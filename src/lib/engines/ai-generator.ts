// ─── Core AI Itinerary Generator ────────────────────────────────────
// Sends ALL real data to Gemini. Returns a complete, local-expert-quality trip.

export interface AIContext {
  origin: string;
  destination: string;
  budget: number;
  duration: number;
  travelType: string;
  travelers: { adults: number; children: number; seniors: number };
  arrivalMode: string;
  arrivalTime: string;
  departureTime: string;
  hotelPreference: string;
  foodPreference: string;
  interests: string[];
  tripPurpose: string;
  comfortLevel: string;
  travelPace: string;
  walkingTolerance: string;
  hotels: Array<{ name: string; lat: number; lon: number; distanceKm?: number }>;
  restaurants: Array<{ name: string; lat: number; lon: number; cuisine?: string; distanceKm?: number }>;
  attractions: Array<{ name: string; lat: number; lon: number; distanceKm?: number }>;
  transportNodes: Array<{ name: string; category: string; distanceKm?: number }>;
  weather: { temperature: number; description: string; rainProbability: number } | null;
  wikiExtract: string | null;
  transport: { suggestedMode: string; durationHours: number; estimatedFare: number; destinationHub: string } | null;
}

interface JourneyStep {
  time: string;
  action: string;
  details: string;
  cost: number;
}

interface Activity {
  time: string;
  title: string;
  description: string;
  category: string;
  type: 'activity' | 'meal' | 'travel' | 'hotel';
  estimatedCost: number;
  duration: string;
  walkingDistance?: string;
}

interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export interface GeneratedItinerary {
  tripOverview: string;
  localTravelAdvice: string;
  packingSuggestions: string[];
  safetyTips: string[];
  arrivalJourney: JourneyStep[];
  departureJourney: JourneyStep[];
  days: DayPlan[];
}

// ─── Build the Gemini Prompt ────────────────────────────────────────

function buildPrompt(ctx: AIContext): string {
  const totalTravelers = ctx.travelers.adults + ctx.travelers.children + ctx.travelers.seniors;
  const perPersonBudget = Math.floor(ctx.budget / totalTravelers);

  // Build data lists
  const hotelList = ctx.hotels.length > 0
    ? ctx.hotels.map(h => `  - ${h.name} (${(h.distanceKm ?? 0).toFixed(1)}km from center)`).join('\n')
    : '  (no hotels found in data)';

  const restaurantList = ctx.restaurants.length > 0
    ? ctx.restaurants.map(r => `  - ${r.name}${r.cuisine ? ` [${r.cuisine}]` : ''} (${(r.distanceKm ?? 0).toFixed(1)}km)`).join('\n')
    : '  (no restaurants found in data)';

  const attractionList = ctx.attractions.length > 0
    ? ctx.attractions.map(a => `  - ${a.name} (${(a.distanceKm ?? 0).toFixed(1)}km from center)`).join('\n')
    : '  (no attractions found in data)';

  const transportList = ctx.transportNodes.length > 0
    ? ctx.transportNodes.map(t => `  - ${t.name} [${t.category}] (${(t.distanceKm ?? 0).toFixed(1)}km)`).join('\n')
    : '  (no transport nodes found)';

  const weatherBlock = ctx.weather
    ? `CURRENT WEATHER: ${ctx.weather.temperature}°C, ${ctx.weather.description}, ${ctx.weather.rainProbability}% rain chance`
    : 'WEATHER: data unavailable — plan for average conditions';

  const transportBlock = ctx.transport
    ? `SUGGESTED TRAVEL: ${ctx.transport.suggestedMode} (${ctx.transport.durationHours}h, ~₹${ctx.transport.estimatedFare}). Arriving at: ${ctx.transport.destinationHub}`
    : '';

  const wikiBlock = ctx.wikiExtract
    ? `ABOUT ${ctx.destination.toUpperCase()}: ${ctx.wikiExtract.slice(0, 800)}`
    : '';

  // Food preference instruction
  let foodInstruction = '';
  const foodPref = ctx.foodPreference.toLowerCase();
  if (foodPref.includes('veg') && !foodPref.includes('non')) {
    foodInstruction = 'CRITICAL: This traveler is PURE VEGETARIAN. Every meal recommendation MUST be vegetarian. Never suggest non-veg restaurants, meat dishes, or seafood. Recommend famous local veg food, authentic veg thalis, South Indian, street food stalls with veg options, and veg-friendly cafes.';
  } else if (foodPref.includes('non-veg') || foodPref.includes('nonveg')) {
    foodInstruction = 'Traveler eats non-veg. Recommend local meat/seafood specialties, famous non-veg joints, and mixed restaurants.';
  } else {
    foodInstruction = 'Recommend a mix of veg and non-veg options. Highlight local specialties.';
  }

  // Travel persona instruction
  let personaInstruction = '';
  const tType = ctx.travelType.toLowerCase();
  if (tType.includes('couple') || tType.includes('honeymoon') || tType.includes('romantic')) {
    personaInstruction = 'This is a COUPLE trip. Prioritize: romantic cafes, sunset viewpoints, private experiences, scenic spots, quiet restaurants. Avoid: party districts, crowded tourist traps, noisy areas.';
  } else if (tType.includes('family')) {
    personaInstruction = 'This is a FAMILY trip. Prioritize: safe areas, kid-friendly attractions, family restaurants, parks, easy walking routes. Avoid: nightlife, bars, extreme activities.';
  } else if (tType.includes('bachelor') || tType.includes('friends')) {
    personaInstruction = 'This is a FRIENDS/GROUP trip. Include: adventure activities, nightlife, street food tours, group experiences, offbeat spots. Keep energy high.';
  } else if (tType.includes('solo')) {
    personaInstruction = 'This is a SOLO trip. Include: safe areas, social cafes, walking tours, photography spots, local interactions. Add safety tips.';
  } else if (tType.includes('senior') || tType.includes('elderly')) {
    personaInstruction = 'This is a SENIOR CITIZEN trip. Prioritize: minimal walking, elevator-accessible places, comfortable transport, temples, gardens, rest breaks every 2 hours. Avoid: steep climbs, long walks, extreme weather exposure.';
  } else if (tType.includes('spiritual') || tType.includes('pilgrimage')) {
    personaInstruction = 'This is a SPIRITUAL/PILGRIMAGE trip. Prioritize: temples, ashrams, holy sites, prayer times, religious rituals, sattvic food. Plan around temple timings and aarti schedules.';
  }

  // Weather adaptation (silent — no labels)
  let weatherAdaptation = '';
  if (ctx.weather) {
    if (ctx.weather.rainProbability > 60) {
      weatherAdaptation = 'HIGH RAIN EXPECTED: Prioritize indoor activities (museums, temples, covered markets, cafes) during afternoon. Move outdoor sightseeing to morning when rain is less likely. Include umbrella in packing.';
    } else if (ctx.weather.temperature > 38) {
      weatherAdaptation = 'EXTREME HEAT: Schedule outdoor activities for early morning (before 10 AM) and evening (after 5 PM). Add water/juice breaks. Midday should be indoor activities or rest.';
    } else if (ctx.weather.temperature < 10) {
      weatherAdaptation = 'COLD WEATHER: Start days a bit later (9 AM). Include warm cafes and indoor spots. Evening activities should end by 8 PM.';
    }
  }

  return `You are the #1 rated local travel planner in ${ctx.destination}. A paying client has hired you to plan their perfect ${ctx.duration}-day trip. Plan it EXACTLY as you would for a real client — every detail matters.

═══════════════════════════════════════
CLIENT BRIEF
═══════════════════════════════════════
• From: ${ctx.origin} → To: ${ctx.destination}
• Duration: ${ctx.duration} days
• Total budget: ₹${ctx.budget.toLocaleString()} for ${totalTravelers} person(s) (₹${perPersonBudget.toLocaleString()}/person)
  - ${ctx.travelers.adults} adults, ${ctx.travelers.children} children, ${ctx.travelers.seniors} seniors
• Travel type: ${ctx.travelType}
• Arrival: ${ctx.arrivalMode} at ${ctx.arrivalTime}
• Departure: ${ctx.departureTime} on day ${ctx.duration}
• Hotel preference: ${ctx.hotelPreference}
• Food: ${ctx.foodPreference}
• Trip purpose: ${ctx.tripPurpose}
• Comfort level: ${ctx.comfortLevel}
• Travel pace: ${ctx.travelPace}
• Walking tolerance: ${ctx.walkingTolerance}
• Interests: ${ctx.interests.join(', ')}

${weatherBlock}
${transportBlock}
${wikiBlock}

═══════════════════════════════════════
REAL DATA FROM MAP SERVICES
═══════════════════════════════════════

HOTELS FOUND:
${hotelList}

RESTAURANTS FOUND:
${restaurantList}

ATTRACTIONS & PLACES:
${attractionList}

TRANSPORT NODES (stations, airports, bus stands):
${transportList}

═══════════════════════════════════════
YOUR PLANNING RULES
═══════════════════════════════════════

${personaInstruction}

${foodInstruction}

${weatherAdaptation}

ARRIVAL JOURNEY:
Build a complete step-by-step journey from ${ctx.origin} to ${ctx.destination}.
- Include departure time, mode, stops, transfers, local transport from station to hotel
- Use ONLY real station/airport names from the transport nodes list above
- If the user is traveling by ${ctx.arrivalMode}, plan around that
- Include estimated costs for each leg

DAILY PLANNING RULES:
1. Generate 10-15 activities per day (NOT 3-4)
2. Every day starts with breakfast and ends with dinner + return to hotel
3. Full day flow: wake up → breakfast → attraction → snack/chai → attraction → lunch → attraction → market/walk → sunset → dinner → hotel
4. GEOGRAPHIC CLUSTERING: All morning activities within 3km of each other. All afternoon activities within 3km of each other. NEVER schedule two activities 15km apart back-to-back.
5. Include at least 2 local experiences per day (street food, market walks, local transport rides, temple visits, sunset spots, cultural activities)
6. Day 1: Arrival + nearby exploration (fewer activities since traveling)
7. Day 2: Must-see landmarks and top attractions
8. Day 3: Hidden gems, local food tour, offbeat spots
9. Day 4+: Mix based on interests (adventure, shopping, nature, culture)
10. Last day: Morning explore + pack + checkout + departure journey
11. NEVER repeat any attraction across days
12. Each day MUST have a unique descriptive title

MEAL PLANNING:
- Breakfast: 8:00-9:00 AM
- Mid-morning chai/snack: 10:30-11:00 AM
- Lunch: 12:30-1:30 PM
- Evening snack: 4:30-5:00 PM
- Dinner: 7:30-8:30 PM
- Use REAL restaurant names from the list. If no restaurant data available, say "local dining near {nearby attraction}" — never invent restaurant names.

COSTS:
- Every activity must have a realistic estimatedCost in INR
- Meals: ₹100-300 for street food, ₹300-800 for restaurants, ₹800-2000 for fine dining
- Attractions: ₹0-500 for temples/viewpoints, ₹200-1000 for museums/parks
- Keep total daily spend within budget

WRITING STYLE:
- Write like a friend who lives in ${ctx.destination} giving advice
- Short, practical sentences
- Specific tips ("get there before 9 AM to avoid crowds", "the view from the left side is better")
- NEVER use these words: curated, bespoke, immersive, gastronomic, sanctuary, nestled, tapestry, plethora, myriad, picturesque, unparalleled

═══════════════════════════════════════
OUTPUT FORMAT (JSON ONLY)
═══════════════════════════════════════

{
  "tripOverview": "2-3 sentence warm overview of why this trip will be great",
  "localTravelAdvice": "3-4 practical sentences about getting around ${ctx.destination}. Local transport, tips, things to know.",
  "packingSuggestions": ["item1", "item2", "...max 8 items"],
  "safetyTips": ["tip1", "tip2", "...max 5 tips"],
  "arrivalJourney": [
    {"time": "07:00 AM", "action": "Leave ${ctx.origin} by ${ctx.arrivalMode}", "details": "From ${ctx.origin} ${ctx.arrivalMode === 'Train' ? 'railway station' : ctx.arrivalMode === 'Bus' ? 'bus stand' : 'airport'}", "cost": 0},
    {"time": "...", "action": "Arrive at ...", "details": "...", "cost": 0}
  ],
  "departureJourney": [
    {"time": "...", "action": "Check out from hotel", "details": "...", "cost": 0},
    {"time": "${ctx.departureTime}", "action": "Depart from ${ctx.destination}", "details": "...", "cost": 0}
  ],
  "days": [
    {
      "day": 1,
      "title": "Descriptive theme title",
      "activities": [
        {
          "time": "08:00 AM",
          "title": "Real place name or activity",
          "description": "What to do here, why it's special, practical tips",
          "category": "dining|sightseeing|culture|adventure|shopping|transport|accommodation|nature|nightlife",
          "type": "activity|meal|travel|hotel",
          "estimatedCost": 300,
          "duration": "45 minutes",
          "walkingDistance": "500m from previous stop"
        }
      ]
    }
  ]
}`;
}

// ─── Call Gemini API ────────────────────────────────────────────────

async function callGemini(
  prompt: string,
  model: string,
  apiKey: string,
  timeoutMs: number
): Promise<GeneratedItinerary | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      }),
    });

    if (!res.ok) return null;

    const data: {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    } = await res.json();

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;

    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    return JSON.parse(cleaned) as GeneratedItinerary;
  } catch {
    return null;
  }
}

// ─── Deterministic Fallback (no AI) ─────────────────────────────────

function buildFallbackItinerary(ctx: AIContext): GeneratedItinerary {
  const overview = ctx.wikiExtract
    ? ctx.wikiExtract.slice(0, 300)
    : `A ${ctx.duration}-day trip to ${ctx.destination} from ${ctx.origin}. This itinerary was built from verified map data.`;

  // Build arrival journey
  const arrivalHub = ctx.transport?.destinationHub ?? ctx.transportNodes[0]?.name ?? `${ctx.destination} area`;
  const arrivalJourney: JourneyStep[] = [
    {
      time: ctx.arrivalTime || '08:00 AM',
      action: `Leave ${ctx.origin} by ${ctx.transport?.suggestedMode || ctx.arrivalMode}`,
      details: `From ${ctx.origin}`,
      cost: ctx.transport?.estimatedFare ?? 0,
    },
    {
      time: '',
      action: `Arrive at ${arrivalHub}`,
      details: `After ~${ctx.transport?.durationHours ?? '?'} hours`,
      cost: 0,
    },
    {
      time: '',
      action: 'Take local transport to hotel',
      details: 'Auto/cab from station',
      cost: 200,
    },
  ];

  const departureJourney: JourneyStep[] = [
    { time: '10:00 AM', action: 'Check out from hotel', details: 'Pack and settle bills', cost: 0 },
    { time: ctx.departureTime || '04:00 PM', action: `Depart from ${ctx.destination}`, details: `Via ${ctx.transport?.suggestedMode || 'transport'} from ${arrivalHub}`, cost: ctx.transport?.estimatedFare ?? 0 },
  ];

  // Prepare pools
  const allAttractions = [...ctx.attractions];
  const allRestaurants = [...ctx.restaurants];
  let attrIdx = 0;
  let restIdx = 0;

  const nextAttraction = () => {
    if (attrIdx < allAttractions.length) return allAttractions[attrIdx++];
    return null;
  };
  const nextRestaurant = () => {
    if (allRestaurants.length === 0) return null;
    const r = allRestaurants[restIdx % allRestaurants.length];
    restIdx++;
    return r;
  };

  const days: DayPlan[] = [];
  const mealCost = Math.round(ctx.budget / (ctx.duration * 8));
  const activityCost = Math.round(ctx.budget / (ctx.duration * 12));

  const dayThemes = [
    'Arrival & First Impressions',
    'Top Landmarks & Must-See Spots',
    'Hidden Gems & Local Flavors',
    'Culture, Markets & Experiences',
    'Nature & Scenic Views',
    'Adventure & Off the Beaten Path',
    'Relaxation & Local Life',
    'Farewell & Departure',
  ];

  for (let d = 1; d <= ctx.duration; d++) {
    const isFirst = d === 1;
    const isLast = d === ctx.duration;
    const activities: Activity[] = [];

    // Arrival on day 1
    if (isFirst) {
      activities.push({
        time: ctx.arrivalTime || '09:00 AM',
        title: `Arrive at ${arrivalHub}`,
        description: `Welcome to ${ctx.destination}! Take local transport to your hotel.`,
        category: 'transport',
        type: 'travel',
        estimatedCost: ctx.transport?.estimatedFare ?? 0,
        duration: `${ctx.transport?.durationHours ?? 2} hours`,
      });

      const hotel = ctx.hotels[0];
      if (hotel) {
        activities.push({
          time: '11:00 AM',
          title: `Check in at ${hotel.name}`,
          description: 'Freshen up and get settled.',
          category: 'accommodation',
          type: 'hotel',
          estimatedCost: 0,
          duration: '1 hour',
        });
      }
    }

    // Breakfast
    const bkfst = nextRestaurant();
    activities.push({
      time: isFirst ? '12:00 PM' : '08:30 AM',
      title: bkfst ? bkfst.name : `Breakfast near hotel`,
      description: bkfst?.cuisine ? `Try the ${bkfst.cuisine} options here.` : 'Start the day with a local breakfast.',
      category: 'dining',
      type: 'meal',
      estimatedCost: mealCost,
      duration: '45 minutes',
    });

    // Morning attractions (3-4)
    const morningStart = isFirst ? 1 : 3;
    const morningTimes = ['09:30 AM', '10:30 AM', '11:30 AM', '09:00 AM'];
    for (let i = 0; i < morningStart + 1; i++) {
      const attr = nextAttraction();
      if (attr) {
        activities.push({
          time: isFirst ? '01:00 PM' : (morningTimes[i] ?? '10:00 AM'),
          title: attr.name,
          description: `Visit ${attr.name} — ${(attr.distanceKm ?? 0).toFixed(1)}km from center.`,
          category: 'sightseeing',
          type: 'activity',
          estimatedCost: activityCost,
          duration: '1.5 hours',
          walkingDistance: `${(attr.distanceKm ?? 1).toFixed(1)}km`,
        });
      }
    }

    // Mid-morning chai
    if (!isFirst) {
      activities.push({
        time: '11:00 AM',
        title: 'Chai & snack break',
        description: 'Quick chai stop at a local tea stall.',
        category: 'dining',
        type: 'meal',
        estimatedCost: 50,
        duration: '20 minutes',
      });
    }

    // Lunch
    const lunch = nextRestaurant();
    activities.push({
      time: isFirst ? '02:30 PM' : '01:00 PM',
      title: lunch ? lunch.name : 'Local lunch spot',
      description: lunch?.cuisine ? `Lunch — ${lunch.cuisine} cuisine.` : 'Lunch at a nearby spot.',
      category: 'dining',
      type: 'meal',
      estimatedCost: mealCost * 2,
      duration: '1 hour',
    });

    // Afternoon attractions (2-3)
    if (!isLast) {
      const afternoonTimes = ['02:30 PM', '03:30 PM', '04:30 PM'];
      for (let i = 0; i < 3; i++) {
        const attr = nextAttraction();
        if (attr) {
          activities.push({
            time: afternoonTimes[i] ?? '03:00 PM',
            title: attr.name,
            description: `Explore ${attr.name}.`,
            category: 'sightseeing',
            type: 'activity',
            estimatedCost: activityCost,
            duration: '1 hour',
            walkingDistance: `${(attr.distanceKm ?? 1).toFixed(1)}km`,
          });
        }
      }

      // Evening snack
      activities.push({
        time: '05:00 PM',
        title: 'Evening snack & chai',
        description: 'Recharge with local street food.',
        category: 'dining',
        type: 'meal',
        estimatedCost: 100,
        duration: '30 minutes',
      });

      // Sunset / evening activity
      const sunsetAttr = nextAttraction();
      activities.push({
        time: '06:00 PM',
        title: sunsetAttr ? sunsetAttr.name : 'Sunset walk',
        description: sunsetAttr ? `Catch sunset at ${sunsetAttr.name}.` : 'Walk around the area and enjoy the evening.',
        category: 'nature',
        type: 'activity',
        estimatedCost: 0,
        duration: '1 hour',
      });

      // Evening market / shopping
      activities.push({
        time: '07:00 PM',
        title: 'Explore local market',
        description: 'Browse local shops and pick up souvenirs.',
        category: 'shopping',
        type: 'activity',
        estimatedCost: 500,
        duration: '45 minutes',
      });
    }

    // Departure on last day
    if (isLast) {
      const hotel = ctx.hotels[0];
      if (hotel) {
        activities.push({
          time: '10:00 AM',
          title: `Check out from ${hotel.name}`,
          description: 'Pack up and settle your hotel bill.',
          category: 'accommodation',
          type: 'hotel',
          estimatedCost: 0,
          duration: '30 minutes',
        });
      }

      // One last attraction
      const lastAttr = nextAttraction();
      if (lastAttr) {
        activities.push({
          time: '11:00 AM',
          title: lastAttr.name,
          description: `One last visit before leaving ${ctx.destination}.`,
          category: 'sightseeing',
          type: 'activity',
          estimatedCost: activityCost,
          duration: '1 hour',
        });
      }

      activities.push({
        time: ctx.departureTime || '04:00 PM',
        title: `Depart from ${ctx.destination}`,
        description: `Head to ${arrivalHub} for your journey back to ${ctx.origin}.`,
        category: 'transport',
        type: 'travel',
        estimatedCost: ctx.transport?.estimatedFare ?? 0,
        duration: `${ctx.transport?.durationHours ?? 2} hours`,
      });
    }

    // Dinner (except last day if departing early)
    if (!isLast || ctx.departureTime?.includes('PM')) {
      const dinner = nextRestaurant();
      activities.push({
        time: '08:00 PM',
        title: dinner ? dinner.name : 'Dinner',
        description: dinner?.cuisine ? `Dinner — ${dinner.cuisine}.` : `Dinner at a local spot in ${ctx.destination}.`,
        category: 'dining',
        type: 'meal',
        estimatedCost: mealCost * 2,
        duration: '1 hour',
      });

      // Return to hotel
      activities.push({
        time: '09:30 PM',
        title: 'Return to hotel',
        description: 'Rest up for tomorrow.',
        category: 'accommodation',
        type: 'hotel',
        estimatedCost: 0,
        duration: '',
      });
    }

    // Sort by time
    activities.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

    const themeIdx = isFirst ? 0 : isLast ? dayThemes.length - 1 : Math.min(d - 1, dayThemes.length - 2);
    days.push({
      day: d,
      title: dayThemes[themeIdx] ?? `Day ${d} in ${ctx.destination}`,
      activities,
    });
  }

  return {
    tripOverview: overview,
    localTravelAdvice: `Use local autos or cabs to get around ${ctx.destination}. Carry cash for street vendors and small shops. Download offline maps before your trip.`,
    packingSuggestions: buildPackingSuggestions(ctx),
    safetyTips: [
      'Keep copies of your ID and tickets (digital + physical)',
      'Stay hydrated, especially during daytime outings',
      'Use official transport services — avoid unmarked vehicles',
      'Keep emergency contacts saved on your phone',
      `Local emergency: 112 (Police), 102 (Ambulance)`,
    ],
    arrivalJourney,
    departureJourney,
    days,
  };
}

function timeToMinutes(time: string): number {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 720; // default to noon
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function buildPackingSuggestions(ctx: AIContext): string[] {
  const items = ['Comfortable walking shoes', 'Sunscreen (SPF 50+)'];

  if (ctx.weather) {
    if (ctx.weather.temperature > 30) {
      items.push('Light cotton clothes', 'Hat or cap', 'Reusable water bottle');
    } else if (ctx.weather.temperature < 15) {
      items.push('Warm jacket or fleece', 'Thermal layers', 'Warm socks');
    } else {
      items.push('Light layers for changing weather');
    }
    if (ctx.weather.rainProbability > 40) {
      items.push('Compact umbrella or rain jacket');
    }
  } else {
    items.push('Light layers', 'Umbrella (just in case)');
  }

  items.push('Power bank + charger', 'Basic medicines & first-aid');

  const tType = ctx.travelType.toLowerCase();
  if (tType.includes('spiritual') || tType.includes('pilgrimage')) {
    items.push('Modest clothing for temple visits');
  }
  if (tType.includes('adventure') || tType.includes('trek')) {
    items.push('Trekking shoes', 'Dry-fit clothing');
  }

  return items.slice(0, 10);
}

// ─── Main Export ────────────────────────────────────────────────────

export async function generateItinerary(
  context: AIContext
): Promise<GeneratedItinerary> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return buildFallbackItinerary(context);
  }

  const prompt = buildPrompt(context);

  // Primary: gemini-2.5-flash (25s for thorough generation)
  const primary = await callGemini(prompt, 'gemini-2.5-flash', apiKey, 25000);
  if (primary) return primary;

  // Fallback model
  const fallback = await callGemini(prompt, 'gemini-2.0-flash-lite', apiKey, 20000);
  if (fallback) return fallback;

  // All AI failed — deterministic fallback using real data
  return buildFallbackItinerary(context);
}
