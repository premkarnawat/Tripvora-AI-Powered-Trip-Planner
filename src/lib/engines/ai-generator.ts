// Core AI itinerary generator — sends real data to Gemini, returns structured trip

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
  // Real data from engines
  hotels: Array<{
    name: string;
    lat: number;
    lon: number;
    distanceKm?: number;
  }>;
  restaurants: Array<{
    name: string;
    lat: number;
    lon: number;
    cuisine?: string;
    distanceKm?: number;
  }>;
  attractions: Array<{
    name: string;
    lat: number;
    lon: number;
    distanceKm?: number;
  }>;
  transportNodes: Array<{
    name: string;
    category: string;
    distanceKm?: number;
  }>;
  weather: {
    temperature: number;
    description: string;
    rainProbability: number;
  } | null;
  wikiExtract: string | null;
  transport: {
    suggestedMode: string;
    durationHours: number;
    estimatedFare: number;
    destinationHub: string;
  } | null;
}

interface Activity {
  time: string;
  title: string;
  description: string;
  category: string;
  type: 'activity' | 'meal' | 'travel' | 'hotel';
  estimatedCost: number;
  duration: string;
}

interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

interface GeneratedItinerary {
  tripOverview: string;
  localTravelAdvice: string;
  packingSuggestions: string[];
  safetyTips: string[];
  days: DayPlan[];
}

// --- Build Gemini prompt ---
function buildPrompt(ctx: AIContext): string {
  const totalTravelers =
    ctx.travelers.adults + ctx.travelers.children + ctx.travelers.seniors;

  const hotelList = ctx.hotels
    .slice(0, 30)
    .map((h) => `  - ${h.name}`)
    .join('\n');

  const restaurantList = ctx.restaurants
    .slice(0, 40)
    .map((r) => `  - ${r.name}${r.cuisine ? ` (${r.cuisine})` : ''}`)
    .join('\n');

  const attractionList = ctx.attractions
    .slice(0, 40)
    .map((a) => `  - ${a.name}`)
    .join('\n');

  const transportList = ctx.transportNodes
    .slice(0, 20)
    .map((t) => `  - ${t.name} [${t.category}]`)
    .join('\n');

  const weatherInfo = ctx.weather
    ? `Current weather: ${ctx.weather.temperature}°C, ${ctx.weather.description}, rain probability ${ctx.weather.rainProbability}%`
    : 'Weather data unavailable';

  const transportInfo = ctx.transport
    ? `Suggested arrival mode: ${ctx.transport.suggestedMode} (${ctx.transport.durationHours} hours, ~₹${ctx.transport.estimatedFare}). Arriving at ${ctx.transport.destinationHub}.`
    : '';

  const wikiInfo = ctx.wikiExtract
    ? `About ${ctx.destination}: ${ctx.wikiExtract.slice(0, 600)}`
    : '';

  return `You are a local travel expert planning a real trip. You speak like a friendly local giving genuine advice.

TRIP DETAILS:
- From: ${ctx.origin} → To: ${ctx.destination}
- Duration: ${ctx.duration} days
- Budget: ₹${ctx.budget} total for ${totalTravelers} traveler(s) (${ctx.travelers.adults} adults, ${ctx.travelers.children} children, ${ctx.travelers.seniors} seniors)
- Travel type: ${ctx.travelType}
- Arrival: ${ctx.arrivalMode} at ${ctx.arrivalTime}
- Departure: ${ctx.departureTime}
- Hotel preference: ${ctx.hotelPreference}
- Food preference: ${ctx.foodPreference}
- Interests: ${ctx.interests.join(', ') || 'general sightseeing'}

${weatherInfo}
${transportInfo}
${wikiInfo}

REAL HOTELS FOUND:
${hotelList || '  (none found)'}

REAL RESTAURANTS FOUND:
${restaurantList || '  (none found)'}

REAL ATTRACTIONS FOUND:
${attractionList || '  (none found)'}

TRANSPORT NODES:
${transportList || '  (none found)'}

STRICT RULES:
1. Use ONLY place names from the lists I provided above.
2. Generate 8-15 activities per day.
3. Each day must have a unique theme.
4. Cluster activities within 3-5km walking distance where possible.
5. Include breakfast, lunch, dinner, and snack stops using the real restaurants listed.
6. Day 1 must start with arrival logistics (travel from ${ctx.origin}, check-in, etc.).
7. The last day (day ${ctx.duration}) must end with departure logistics.
8. If data is insufficient, say "explore the local area" — never invent place names.
9. Never use these words: curated, bespoke, immersive, gastronomic, sanctuary.
10. Write in a warm, conversational tone like a local friend giving advice.
11. Keep estimated costs realistic for India and within the total budget.

Respond with ONLY valid JSON in this exact structure:
{
  "tripOverview": "A warm, helpful overview of the trip (2-3 sentences)",
  "localTravelAdvice": "Practical local tips for getting around ${ctx.destination}",
  "packingSuggestions": ["item1", "item2", "..."],
  "safetyTips": ["tip1", "tip2", "..."],
  "days": [
    {
      "day": 1,
      "title": "Theme for the day",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Real Place Name from the lists above",
          "description": "What to do here and why it's worth visiting",
          "category": "sightseeing",
          "type": "activity",
          "estimatedCost": 0,
          "duration": "1.5 hours"
        }
      ]
    }
  ]
}`;
}

// --- Call Gemini API ---
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
          temperature: 0.3,
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

    // Clean markdown fences if present
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed: GeneratedItinerary = JSON.parse(cleaned);
    return parsed;
  } catch {
    return null;
  }
}

// --- Deterministic fallback when AI is unavailable ---
function buildFallbackItinerary(ctx: AIContext): GeneratedItinerary {
  const overview = ctx.wikiExtract
    ? ctx.wikiExtract.slice(0, 300)
    : `A ${ctx.duration}-day trip to ${ctx.destination} from ${ctx.origin}`;

  const days: DayPlan[] = [];
  const allAttractions = [...ctx.attractions];
  const allRestaurants = [...ctx.restaurants];

  let attractionIdx = 0;
  let restaurantIdx = 0;

  for (let d = 1; d <= ctx.duration; d++) {
    const activities: Activity[] = [];
    const isFirstDay = d === 1;
    const isLastDay = d === ctx.duration;

    // Arrival on day 1
    if (isFirstDay) {
      const arrivalHub =
        ctx.transport?.destinationHub ?? `${ctx.destination} Station`;
      activities.push({
        time: ctx.arrivalTime || '09:00 AM',
        title: `Arrive at ${arrivalHub}`,
        description: `Arrive in ${ctx.destination} via ${ctx.transport?.suggestedMode ?? ctx.arrivalMode}`,
        category: 'transport',
        type: 'travel',
        estimatedCost: ctx.transport?.estimatedFare ?? 0,
        duration: '1 hour',
      });

      // Hotel check-in
      const hotel = ctx.hotels[0];
      if (hotel) {
        activities.push({
          time: '10:30 AM',
          title: `Check in at ${hotel.name}`,
          description: `Get settled at your hotel and freshen up`,
          category: 'accommodation',
          type: 'hotel',
          estimatedCost: 0,
          duration: '1 hour',
        });
      }
    }

    // Breakfast
    const breakfast = allRestaurants[restaurantIdx % Math.max(1, allRestaurants.length)];
    if (breakfast) {
      activities.push({
        time: isFirstDay ? '11:30 AM' : '08:30 AM',
        title: breakfast.name,
        description: `Breakfast${breakfast.cuisine ? ` — ${breakfast.cuisine}` : ''}`,
        category: 'dining',
        type: 'meal',
        estimatedCost: Math.round(ctx.budget / (ctx.duration * 8)),
        duration: '45 minutes',
      });
      restaurantIdx++;
    }

    // Attractions (3-4 per day)
    const attractionsPerDay = isFirstDay || isLastDay ? 2 : 4;
    const morningTimes = ['10:00 AM', '11:30 AM', '01:30 PM', '03:00 PM'];
    for (let i = 0; i < attractionsPerDay; i++) {
      if (attractionIdx < allAttractions.length) {
        const attr = allAttractions[attractionIdx];
        const timeSlot =
          morningTimes[(activities.length - (isFirstDay ? 2 : 0)) % morningTimes.length] ??
          '02:00 PM';

        activities.push({
          time: timeSlot,
          title: attr.name,
          description: `Visit ${attr.name} and explore the surroundings`,
          category: 'sightseeing',
          type: 'activity',
          estimatedCost: Math.round(ctx.budget / (ctx.duration * 10)),
          duration: '1.5 hours',
        });
        attractionIdx++;
      }
    }

    // Lunch
    const lunch = allRestaurants[restaurantIdx % Math.max(1, allRestaurants.length)];
    if (lunch) {
      activities.push({
        time: '01:00 PM',
        title: lunch.name,
        description: `Lunch${lunch.cuisine ? ` — ${lunch.cuisine}` : ''}`,
        category: 'dining',
        type: 'meal',
        estimatedCost: Math.round(ctx.budget / (ctx.duration * 6)),
        duration: '1 hour',
      });
      restaurantIdx++;
    }

    // Dinner
    const dinner = allRestaurants[restaurantIdx % Math.max(1, allRestaurants.length)];
    if (dinner) {
      activities.push({
        time: '07:30 PM',
        title: dinner.name,
        description: `Dinner${dinner.cuisine ? ` — ${dinner.cuisine}` : ''}`,
        category: 'dining',
        type: 'meal',
        estimatedCost: Math.round(ctx.budget / (ctx.duration * 5)),
        duration: '1 hour',
      });
      restaurantIdx++;
    }

    // Departure on last day
    if (isLastDay) {
      const hotel = ctx.hotels[0];
      if (hotel) {
        activities.push({
          time: '09:00 AM',
          title: `Check out from ${hotel.name}`,
          description: 'Pack up and check out',
          category: 'accommodation',
          type: 'hotel',
          estimatedCost: 0,
          duration: '30 minutes',
        });
      }

      activities.push({
        time: ctx.departureTime || '06:00 PM',
        title: `Depart from ${ctx.destination}`,
        description: `Head back to ${ctx.origin}`,
        category: 'transport',
        type: 'travel',
        estimatedCost: ctx.transport?.estimatedFare ?? 0,
        duration: `${ctx.transport?.durationHours ?? 2} hours`,
      });
    }

    // Sort by time
    activities.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

    days.push({
      day: d,
      title: isFirstDay
        ? `Arrival & First Impressions`
        : isLastDay
          ? `Farewell & Departure`
          : `Day ${d} in ${ctx.destination}`,
      activities,
    });
  }

  return {
    tripOverview: overview,
    localTravelAdvice: `Use local autos or ride-sharing apps to get around ${ctx.destination}. Carry cash for smaller vendors.`,
    packingSuggestions: buildPackingSuggestions(ctx),
    safetyTips: [
      'Keep copies of your ID and tickets',
      'Stay hydrated, especially during daytime outings',
      'Use official transport services',
      'Keep emergency contacts handy',
    ],
    days,
  };
}

function timeToMinutes(time: string): number {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function buildPackingSuggestions(ctx: AIContext): string[] {
  const items = ['Comfortable walking shoes', 'Sunscreen and sunglasses'];

  if (ctx.weather) {
    if (ctx.weather.temperature > 30) {
      items.push('Light cotton clothes', 'Hat or cap', 'Water bottle');
    } else if (ctx.weather.temperature < 15) {
      items.push('Warm jacket', 'Layers', 'Warm socks');
    } else {
      items.push('Light layers for variable weather');
    }

    if (ctx.weather.rainProbability > 40) {
      items.push('Umbrella or rain jacket');
    }
  } else {
    items.push('Light layers for variable weather', 'Umbrella');
  }

  items.push('Power bank and charger', 'Basic first-aid kit');
  return items;
}

// --- Main export ---
export async function generateItinerary(
  context: AIContext
): Promise<GeneratedItinerary | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // No API key — use deterministic fallback
    return buildFallbackItinerary(context);
  }

  const prompt = buildPrompt(context);

  // Primary: gemini-2.5-flash (15s timeout)
  const primary = await callGemini(prompt, 'gemini-2.5-flash', apiKey, 15000);
  if (primary) return primary;

  // Fallback: gemini-2.0-flash-lite (15s timeout)
  const fallback = await callGemini(
    prompt,
    'gemini-2.0-flash-lite',
    apiKey,
    15000
  );
  if (fallback) return fallback;

  // All AI failed — deterministic fallback
  return buildFallbackItinerary(context);
}
