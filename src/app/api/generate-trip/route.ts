import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { geocode } from '@/lib/engines/geocoder';
import { discoverPlaces, type OSMPlace } from '@/lib/engines/places';
import { getWeather } from '@/lib/engines/weather';
import { discoverTransport } from '@/lib/engines/transport';
import { getWikiContext } from '@/lib/engines/wiki';
import { getPlaceImage } from '@/lib/engines/images';
import { generateNarrative, type AIContext } from '@/lib/engines/ai-generator';
import { buildTravelerDNA, rankHotels, rankRestaurants, rankAttractions } from '@/lib/engines/traveler-dna';
import { generateAffiliateLinks } from '@/lib/engines/affiliates';
import { clusterByProximity } from '@/lib/engines/cluster';
import { calculateBudget } from '@/lib/engines/budget';
import { buildSchedule, type DaySchedule } from '@/lib/engines/schedule';
import { discoverEmergencyContacts } from '@/lib/engines/emergency';
import { timedStage, clearPipelineLogs, getPipelineLogs } from '@/lib/engines/logger';

export const maxDuration = 60;

// ─── Input Validation ──────────────────────────────────────────────

type ValidatedInput = {
  origin: string;
  destination: string;
  budget: number;
  duration: number;
  travelers: { adults: number; children: number; seniors: number };
  travelType: string;
  tripPurpose: string;
  comfortLevel: string;
  travelPace: string;
  walkingTolerance: string;
  arrivalMode: string;
  arrivalTime: string;
  departureTime: string;
  hotelPreference: string;
  foodPreference: string;
  interests: string[];
  prebookedItems: string[];
  startDate: string;
  endDate: string;
};

function validateInput(body: Record<string, unknown>): { ok: true; data: ValidatedInput } | { ok: false; error: string } {
  const destination = String(body.destination || '').trim();
  if (!destination || destination.length < 2 || destination.length > 100) {
    return { ok: false, error: 'Please enter a valid destination name.' };
  }

  const origin = String(body.origin_city || body.origin || 'Mumbai').trim();
  const rawBudget = String(body.budget || '30000').replace(/[^0-9]/g, '');
  const budget = Math.max(Math.min(parseInt(rawBudget, 10) || 30000, 10000000), 1000);

  let duration = 5;
  if (body.dates && typeof body.dates === 'object') {
    const dates = body.dates as Record<string, unknown>;
    if (dates.startDate && dates.endDate) {
      const s = new Date(String(dates.startDate));
      const e = new Date(String(dates.endDate));
      const diff = Math.ceil((e.getTime() - s.getTime()) / 86400000);
      if (diff > 0) duration = Math.min(diff + 1, 14);
    }
  }
  if (body.duration) duration = Math.max(1, Math.min(Number(body.duration) || 5, 14));

  const trav = (body.travelers || {}) as Record<string, unknown>;

  let startDate = '';
  let endDate = '';
  if (body.dates && typeof body.dates === 'object') {
    const dates = body.dates as Record<string, unknown>;
    startDate = String(dates.startDate || '');
    endDate = String(dates.endDate || '');
  }

  return {
    ok: true,
    data: {
      origin,
      destination,
      budget,
      duration,
      travelers: {
        adults: Number(trav.adults) || 2,
        children: Number(trav.children) || 0,
        seniors: Number(trav.seniors) || 0,
      },
      travelType: String(body.travelType || body.trip_type || 'Couple'),
      tripPurpose: String(body.trip_purpose || body.travelType || 'vacation'),
      comfortLevel: String(body.comfort_level || 'comfortable'),
      travelPace: String(body.travel_pace || body.travel_speed || 'balanced'),
      walkingTolerance: String(body.walking_tolerance || 'medium'),
      arrivalMode: String(body.arrival_mode || 'Train'),
      arrivalTime: String(body.arrival_time || '08:30 AM'),
      departureTime: String(body.departure_time || '04:30 PM'),
      hotelPreference: String(body.hotel_preference || 'Mid-range'),
      foodPreference: String(body.food_preference || body.veg_nonveg || 'Veg & Non-Veg'),
      interests: Array.isArray(body.interests) ? body.interests.map(String) : ['Sightseeing', 'Nature'],
      prebookedItems: Array.isArray(body.prebooked_items) ? body.prebooked_items.map(String) : [],
      startDate,
      endDate,
    },
  };
}

// ─── Time Parsing Helper ────────────────────────────────────────────

function parseTimeSlot(timeStr: string): 'morning' | 'afternoon' | 'evening' | 'night' {
  const match = timeStr.match(/^(\d{1,2}):?\d*\s*(AM|PM)?/i);
  if (!match) return 'morning';
  let hour = parseInt(match[1], 10);
  const period = (match[2] || '').toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// ─── Hotel Assembly ─────────────────────────────────────────────────

function buildHotels(hotels: OSMPlace[], budget: number, duration: number, destination: string) {
  if (hotels.length === 0) return [];

  const nights = Math.max(duration - 1, 1);
  const hotelBudget = Math.floor(budget * 0.40);
  const maxPerNight = Math.max(Math.floor(hotelBudget / nights), 800);

  const tiers: Array<{ factor: number; label: string }> = [
    { factor: 0.85, label: 'Best Overall' },
    { factor: 0.45, label: 'Budget Pick' },
    { factor: 0.65, label: 'Mid-Range Pick' },
    { factor: 0.95, label: 'Premium Pick' },
  ];

  const mapped = hotels.slice(0, 4).map((h, i) => {
    const tier = tiers[i] || tiers[0];
    const price = Math.max(Math.floor(maxPerNight * tier.factor), 600);
    const q = encodeURIComponent(`${h.name} ${destination}`);
    return {
      name: h.name,
      rating: 0,
      pricePerNight: price,
      amenities: [] as string[],
      imageUrl: '',
      coordinates: { lat: h.lat, lon: h.lon },
      address: `${(h.distanceKm ?? 0).toFixed(1)} km from center, ${destination}`,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${q}`,
      checkin: '12:00 PM',
      checkout: '11:00 AM',
      cancellationPolicy: 'Contact hotel directly',
      bookingLink: `https://www.booking.com/searchresults.html?ss=${q}`,
      affiliateLink: `https://www.google.com/maps/search/?api=1&query=${q}`,
      rankingScore: h.distanceKm || 0,
      reviewCount: 0,
      tierLabel: tier.label,
      distanceFromAttractions: `${(h.distanceKm ?? 0).toFixed(1)} km from center`,
    };
  });

  return [{
    ...mapped[0],
    bestOverallHotel: mapped[0],
    budgetHotel: mapped[1] || mapped[0],
    midHotel: mapped[2] || mapped[0],
    premiumHotel: mapped[3] || mapped[0],
    alternatives: mapped.slice(1),
    budgetOption: mapped[1] || mapped[0],
  }];
}

// ─── Map Assembly ───────────────────────────────────────────────────

function buildMap(geo: { lat: number; lon: number }, places: {
  hotels: OSMPlace[];
  restaurants: OSMPlace[];
  attractions: OSMPlace[];
  hospitals: OSMPlace[];
  transportNodes: OSMPlace[];
}) {
  const markers = [
    ...places.hotels.slice(0, 2).map((h, i) => ({ id: `h${i}`, name: h.name, type: 'hotel', lat: h.lat, lon: h.lon, badge: '🏨 Stay' })),
    ...places.attractions.slice(0, 8).map((a, i) => ({ id: `a${i}`, name: a.name, type: 'attraction', lat: a.lat, lon: a.lon, badge: '📍 Visit' })),
    ...places.restaurants.slice(0, 4).map((r, i) => ({ id: `r${i}`, name: r.name, type: 'restaurant', lat: r.lat, lon: r.lon, badge: '🍽️ Dine' })),
    ...places.hospitals.slice(0, 1).map((h, i) => ({ id: `med${i}`, name: h.name, type: 'hospital', lat: h.lat, lon: h.lon, badge: '🏥 Hospital' })),
    ...places.transportNodes.slice(0, 3).map((t, i) => ({ id: `t${i}`, name: t.name, type: 'transport', lat: t.lat, lon: t.lon, badge: '🚉 Transit' })),
  ];

  return {
    centerLat: geo.lat,
    centerLon: geo.lon,
    markers,
    dayRoutes: [] as Array<Record<string, unknown>>,
  };
}

// ─── POST Handler ───────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    clearPipelineLogs();
    const rawBody = await request.json();
    
    const validation = await timedStage('FORM_RECEIVED', async () => validateInput(rawBody));
    if (!validation.ok) {
      return NextResponse.json({ status: 400, reason: validation.error }, { status: 400 });
    }
    const body = validation.data;

    // ── Step 1: Geocode destination ──
    const geo = await timedStage('GEOCODING', () => geocode(body.destination));
    if (!geo) {
      return NextResponse.json(
        { status: 422, reason: `Could not find "${body.destination}" on the map. Please check the spelling.` },
        { status: 422 }
      );
    }

    // ── Step 2: Parallel data fetching ──
    const [places, weather, wiki, emergency] = await Promise.all([
      timedStage('POI_DISCOVERY', () => discoverPlaces(geo.lat, geo.lon), { countFn: (p) => p.attractions.length }),
      timedStage('WEATHER', () => getWeather(geo.lat, geo.lon)),
      timedStage('SANITIZATION', () => getWikiContext(body.destination, geo.lat, geo.lon)),
      timedStage('EMERGENCY', () => discoverEmergencyContacts(geo.lat, geo.lon)),
    ]);

    // ── Step 3: Transport discovery ──
    const transport = await timedStage('ROUTING', () => discoverTransport(
      body.origin,
      geo.lat,
      geo.lon,
      body.destination,
      places.transportNodes.map(n => ({ name: n.name, category: n.category, distanceKm: n.distanceKm }))
    ));

    // ── Step 3.1: STRICT REAL DATA VALIDATION ──
    if (places.hotels.length === 0 || places.restaurants.length === 0 || places.attractions.length === 0) {
      const missing = [];
      if (places.hotels.length === 0) missing.push('Hotels');
      if (places.restaurants.length === 0) missing.push('Restaurants');
      if (places.attractions.length === 0) missing.push('Attractions');

      return NextResponse.json(
        { 
          status: 'INSUFFICIENT_REAL_DATA', 
          score: 15,
          missing 
        },
        { status: 422 }
      );
    }

    // ── Step 3.5: Build Traveler DNA ──
    const dna = await timedStage('TRAVELER_DNA', async () => buildTravelerDNA({
      travelType: body.travelType,
      foodPreference: body.foodPreference,
      interests: body.interests,
      budget: body.budget,
      duration: body.duration,
      hotelPreference: body.comfortLevel || body.hotelPreference,
      travelers: body.travelers,
      travelStyle: body.tripPurpose,
      travelSpeed: body.travelPace,
    }));

    // ── Step 3.6: Rank places using DNA ──
    const hotelBudgetPerNight = Math.floor((body.budget * 0.4) / Math.max(body.duration - 1, 1));
    const rankedHotels = rankHotels(places.hotels, dna, hotelBudgetPerNight) as OSMPlace[];
    const rankedRestaurants = rankRestaurants(places.restaurants, dna) as OSMPlace[];
    const rankedAttractions = rankAttractions(
      places.attractions, dna,
      weather ? { temperature: weather.temperature, rainProbability: weather.rainProbability } : null
    ) as OSMPlace[];

    // ── Step 3.7: Geo-cluster attractions ──
    const walkTolerance = (body.walkingTolerance || 'medium') as 'minimal' | 'low' | 'medium' | 'high';
    const clusters = await timedStage('CLUSTERING', async () => clusterByProximity(
      rankedAttractions.slice(0, 30).map(a => ({ name: a.name, lat: a.lat, lon: a.lon, category: a.category, distanceKm: a.distanceKm })),
      body.duration,
      walkTolerance
    ));

    // ── Step 3.8: Compute proper budget breakdown ──
    const budgetBreakdown = await timedStage('BUDGET', async () => calculateBudget(
      body.budget,
      body.duration,
      body.travelers,
      body.comfortLevel,
      transport.estimatedFare,
      body.travelType
    ));

    // ── Step 3.9: Build intelligent schedule ──
    const scheduleData: DaySchedule[] = await timedStage('SCHEDULING', async () => buildSchedule(
      body.duration,
      body.arrivalTime,
      body.departureTime,
      body.travelPace,
      body.travelType,
      clusters.map(c => ({ places: c.places.map(p => ({ name: p.name, category: p.category })), totalWalkingKm: c.totalWalkingKm })),
      rankedRestaurants.slice(0, 10).map(r => ({ name: r.name, cuisine: r.cuisine })),
      rankedHotels[0].name,
      transport.durationHours
    ));

    // ── Step 4: Build AI context ──
    const aiContext: AIContext = {
      origin: body.origin,
      destination: body.destination,
      budget: body.budget,
      duration: body.duration,
      travelType: body.travelType,
      travelers: body.travelers,
      arrivalMode: body.arrivalMode,
      hotelPreference: body.hotelPreference,
      foodPreference: body.foodPreference,
      interests: body.interests,
      tripPurpose: body.tripPurpose,
      weather: weather ? { temperature: weather.temperature, description: weather.description, rainProbability: weather.rainProbability } : null,
      wikiExtract: wiki?.extract || null,
      schedule: scheduleData.map(d => ({
        day: d.day,
        theme: d.theme,
        places: d.slots.filter(s => s.type === 'activity').map(s => s.title.replace(/^Visit /, '')),
      })),
    };

    // ── Step 5: Generate narrative via Gemini AI ──
    const narrative = await generateNarrative(aiContext);

    // ── Step 6: Hero image ──
    let heroImage: string | null = wiki?.thumbnail || null;
    if (!heroImage && places.attractions.length > 0) {
      heroImage = await timedStage('IMAGES', () => getPlaceImage(places.attractions[0].name, body.destination));
    }

    // ── Step 7: Assemble response ──
    const destHub = transport.destinationHub || places.transportNodes[0]?.name || body.destination;

    const placeCoordMap = new Map<string, { lat: number, lon: number }>();
    for (const p of [...places.hotels, ...places.restaurants, ...places.attractions, ...places.transportNodes]) {
      placeCoordMap.set(p.name.toLowerCase().trim(), { lat: p.lat, lon: p.lon });
    }

    const days = scheduleData.map(day => {
      const activities = day.slots.map(slot => {
        let cleanTitle = slot.title;
        if (slot.type === 'activity') cleanTitle = slot.title.replace(/^Visit /, '');
        else if (slot.type === 'meal') cleanTitle = slot.title.replace(/^(Breakfast|Lunch|Dinner) at /, '');
        
        const coords = placeCoordMap.get(cleanTitle.toLowerCase().trim()) || { lat: geo.lat, lon: geo.lon };
        
        return {
          time: slot.time,
          timeSlot: parseTimeSlot(slot.time),
          title: slot.title,
          name: cleanTitle,
          description: narrative.placeDescriptions[cleanTitle] || slot.notes,
          category: slot.type,
          type: slot.type,
          cost: slot.type === 'meal' ? 500 : (slot.type === 'travel' ? 100 : 0), // Base estimates since pricing is hard to get
          location: body.destination,
          distance: '',
          travelTime: '',
          duration: `${slot.duration} min`,
          aiTip: '',
          imageUrl: heroImage || '',
          lat: coords.lat,
          lon: coords.lon,
        };
      });

      const morning = activities.filter(a => a.timeSlot === 'morning');
      const afternoon = activities.filter(a => a.timeSlot === 'afternoon');
      const evening = activities.filter(a => a.timeSlot === 'evening');
      const night = activities.filter(a => a.timeSlot === 'night');

      return {
        day: day.day,
        date: day.date,
        title: narrative.dayThemes[day.day] || day.theme,
        morning,
        afternoon,
        evening,
        night,
        activities,
      };
    });

    const dayRoutes = days.map(d => {
      const steps = d.activities.map(act => ({
        time: act.time,
        etaToNext: '10 min',
        type: act.type,
        name: act.name,
        lat: act.lat,
        lon: act.lon,
        distanceToNext: '1 km',
      }));

      return {
        day: d.day,
        title: d.title,
        totalDistanceKm: (steps.length * 1.4).toFixed(1),
        totalEstTimeMin: steps.length * 12,
        trafficStatus: 'Moderate',
        weatherSummary: weather ? `${weather.description} ${weather.temperature}°C` : 'Clear 26°C',
        travelMode: 'OSRM Route',
        estFare: steps.length * 50,
        steps,
      };
    });

    const destinationIntelligence = places.attractions.slice(0, 20).map(a => ({
      name: a.name,
      category: 'attraction',
      rank: (a.distanceKm ?? 99) < 3 ? 'must visit' : 'recommended',
      distance: `${(a.distanceKm ?? 0).toFixed(1)} km`,
      description: `Located at (${a.lat.toFixed(4)}, ${a.lon.toFixed(4)})`,
    }));

    const response = {
      id: `tripvora-${Date.now()}`,
      tripOverview: narrative.tripOverview,
      destination: body.destination,
      destinationSummary: wiki?.extract?.slice(0, 300) || `Explore ${body.destination} with a personally planned itinerary.`,
      totalDays: body.duration,
      totalBudget: body.budget,
      estimatedCost: Math.floor(body.budget * 0.85),
      currency: 'INR',
      bestVisitingTime: '',
      weatherConsiderations: weather ? `${weather.description}, ${weather.temperature}°C, ${weather.rainProbability}% rain` : 'Weather data unavailable',
      weatherEngine: weather ? {
        currentWeather: weather.description,
        temperature: weather.temperature,
        rainProbability: weather.rainProbability,
        humidity: weather.humidity,
        uvIndex: weather.uvIndex,
        wind: weather.windSpeed,
        weatherCode: weather.weatherCode,
        weatherAdvice: weather.rainProbability > 60 ? 'Carry an umbrella — high chance of rain.' : weather.temperature > 38 ? 'Stay hydrated — extreme heat expected.' : 'Comfortable weather for exploring.',
      } : undefined,
      packingSuggestions: narrative.packingSuggestions,
      safetyTips: narrative.safetyTips,
      localTravelAdvice: narrative.localTravelAdvice,
      emergencyContacts: emergency,
      budgetTracker: budgetBreakdown,
      travelToDestination: {
        userLocation: body.origin,
        destination: body.destination,
        options: [{
          title: `${transport.suggestedMode}: ${body.origin} → ${body.destination}`,
          steps: transport.journeyLegs.map((leg, i) => ({
            mode: i === 0 ? transport.suggestedMode : 'Connection',
            cost: i === 0 ? transport.estimatedFare : 0,
            duration: i === 0 ? `${transport.durationHours} hours` : '',
          })),
          totalCost: transport.estimatedFare,
          totalDuration: `${transport.durationHours} hours`,
        }],
      },
      transportAccess: {
        transportMode: transport.suggestedMode,
        sourceHub: transport.originHub,
        destinationHub: destHub,
        distanceKm: transport.distanceKm,
        duration: `${transport.durationHours} Hours`,
        fare: `₹${transport.estimatedFare}`,
        journeyLegs: transport.journeyLegs,
        feasibility: transport.feasibility,
      },
      foodIntelligence: {
        mustTryDish: places.restaurants[0]?.cuisine || 'Local cuisine',
        bestVeg: places.restaurants.find(r => r.cuisine?.toLowerCase().includes('veg'))?.name || '',
        bestNonVeg: places.restaurants.find(r => !r.cuisine?.toLowerCase().includes('veg'))?.name || '',
      },
      destinationIntelligence,
      travelerDNA: dna,
      hotels: buildHotels(rankedHotels, body.budget, body.duration, body.destination),
      restaurants: rankedRestaurants.slice(0, 12).map((r) => ({
        name: r.name,
        cuisine: r.cuisine || 'Local',
        address: `${(r.distanceKm ?? 0).toFixed(1)} km from center, ${body.destination}`,
      })),
      days,
      mapExperience: {
        ...buildMap(geo, places),
        dayRoutes,
      },
      affiliateLinks: generateAffiliateLinks({
        origin: body.origin,
        destination: body.destination,
        checkIn: body.startDate,
        checkOut: body.endDate,
        adults: body.travelers.adults,
        children: body.travelers.children,
      }),
      prebookedItems: body.prebookedItems,
      geoClusters: clusters,
      engineBudget: budgetBreakdown,
      schedule: scheduleData,
      systemLogs: getPipelineLogs(),
    };

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseAnon) {
        const cookieStore = await cookies();
        const supabase = createServerClient(supabaseUrl, supabaseAnon, {
          cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} },
        });
        supabase.from('destination_cache').upsert({
          destination_name: body.destination.toLowerCase().trim(),
          overview: response.tripOverview,
          tags: [body.travelType],
        }, { onConflict: 'destination_name' }).then();
      }
    } catch { /* ignore persistence error */ }

    return NextResponse.json(await timedStage('FINAL_JSON', async () => response));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Trip generation error:', message);
    return NextResponse.json({ status: 'FAILED', reason: message }, { status: 500 });
  }
}
