import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { geocode } from '@/lib/engines/geocoder';
import { discoverPlaces, type OSMPlace } from '@/lib/engines/places';
import { getWeather } from '@/lib/engines/weather';
import { discoverTransport } from '@/lib/engines/transport';
import { getWikiContext } from '@/lib/engines/wiki';
import { getPlaceImage } from '@/lib/engines/images';
import { generateItinerary, type AIContext } from '@/lib/engines/ai-generator';
import { sanitize } from '@/lib/engines/sanitizer';

export const maxDuration = 60;

type ValidationSuccess = {
  valid: true;
  data: {
    origin: string;
    destination: string;
    budget: number;
    duration: number;
    travelers: { adults: number; children: number; seniors: number };
    travelType: string;
    arrivalMode: string;
    arrivalTime: string;
    departureTime: string;
    hotelPreference: string;
    foodPreference: string;
    interests: string[];
  };
};

type ValidationFailure = { valid: false; error: string };

function validateInput(body: Record<string, unknown>): ValidationSuccess | ValidationFailure {
  const destination = String(body.destination || '').trim();
  if (!destination || destination.length < 2 || destination.length > 100) {
    return { valid: false, error: 'Invalid destination' };
  }
  const origin = String(body.origin || 'Mumbai').trim();
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

  const travelersRaw = (body.travelers || {}) as Record<string, unknown>;
  const travelers = {
    adults: Number(travelersRaw.adults) || 2,
    children: Number(travelersRaw.children) || 0,
    seniors: Number(travelersRaw.seniors) || 0,
  };

  return {
    valid: true,
    data: {
      origin,
      destination,
      budget,
      duration,
      travelers,
      travelType: String(body.travelType || 'Couple'),
      arrivalMode: String(body.arrival_mode || 'Train'),
      arrivalTime: String(body.arrival_time || '08:30 AM'),
      departureTime: String(body.departure_time || '04:30 PM'),
      hotelPreference: String(body.hotel_preference || 'Mid-range'),
      foodPreference: String(body.food_preference || 'Veg & Non-Veg'),
      interests: Array.isArray(body.interests) ? body.interests.map(String) : ['Sightseeing', 'Nature'],
    },
  };
}

function buildHotelList(hotels: OSMPlace[], budget: number, duration: number, destination: string) {
  const hotelAllocation = Math.floor(budget * 0.40);
  const nights = Math.max(duration - 1, 1);
  const maxPerNight = Math.max(Math.floor(hotelAllocation / nights), 800);

  return hotels.slice(0, 4).map((h, i) => {
    const tiers = [0.85, 0.45, 0.65, 0.95];
    const tierLabels = ['Best Overall', 'Budget Pick', 'Mid-Range Pick', 'Premium Pick'] as const;
    const price = Math.max(Math.floor(maxPerNight * tiers[i]), 600);
    const q = encodeURIComponent(`${h.name} ${destination}`);
    return {
      name: h.name,
      rating: 0,
      pricePerNight: price,
      amenities: [],
      imageUrl: '',
      coordinates: { lat: h.lat, lon: h.lon },
      address: `${h.distanceKm?.toFixed(1) || '?'} km from center, ${destination}`,
      checkin: '12:00 PM',
      checkout: '11:00 AM',
      cancellationPolicy: 'Contact hotel directly for cancellation policy',
      bookingLink: `https://www.booking.com/searchresults.html?ss=${q}`,
      affiliateLink: `https://www.google.com/maps/search/?api=1&query=${q}`,
      rankingScore: 0,
      reviewCount: 0,
      tierLabel: tierLabels[i] || 'Best Overall',
      distanceFromAttractions: `${h.distanceKm?.toFixed(1) || '?'} km from center`,
    };
  });
}

function buildRestaurantList(restaurants: OSMPlace[], destination: string) {
  return restaurants.slice(0, 8).map((r) => ({
    name: r.name,
    cuisine: r.cuisine || 'Local',
    estimatedCost: 0,
    rating: 0,
    address: `${r.distanceKm?.toFixed(1) || '?'} km from center, ${destination}`,
    mealType: 'Lunch' as const,
  }));
}

function buildBudgetTracker(budget: number, duration: number) {
  const hotel = Math.floor(budget * 0.40);
  const transport = Math.floor(budget * 0.20);
  const food = Math.floor(budget * 0.20);
  const activities = Math.floor(budget * 0.10);
  const emergency = Math.floor(budget * 0.10);
  const total = hotel + transport + food + activities;
  return {
    hotels: hotel, transport, food, activities,
    shoppingOrMisc: emergency,
    dailyTotalAverage: Math.floor(total / duration),
    overallTotal: total,
    remainingOrSavings: budget - total,
    budgetHealthScore: Math.round(((budget - total) / budget) * 100),
    totalBudget: budget,
    plannedSplit: { hotel, transport, food, activities, emergency },
    actualSpend: { hotel, transport, food, activities, emergencyReserve: emergency },
    budgetMeter: { percentageUsed: Math.round((total / budget) * 100), status: 'Estimated' },
    dailySpend: [],
    categorySpend: [
      { category: 'Stay', planned: hotel, actual: hotel, percentage: 40, status: 'Estimated' },
      { category: 'Transport', planned: transport, actual: transport, percentage: 20, status: 'Estimated' },
      { category: 'Food', planned: food, actual: food, percentage: 20, status: 'Estimated' },
      { category: 'Activities', planned: activities, actual: activities, percentage: 10, status: 'Estimated' },
      { category: 'Emergency', planned: emergency, actual: emergency, percentage: 10, status: 'Reserve' },
    ],
    budgetAlternatives: [],
  };
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const validation = validateInput(rawBody);
    if (!validation.valid) {
      return NextResponse.json({ status: 400, reason: 'Invalid destination' }, { status: 400 });
    }
    const body = validation.data;

    // Step 1: Geocode destination
    const geo = await geocode(body.destination);
    if (!geo) {
      return NextResponse.json({ status: 422, reason: `Could not locate "${body.destination}" on the map. Please check the spelling.` }, { status: 422 });
    }

    // Step 2: Parallel data fetching — all real, all with timeouts
    const [placesResult, weatherResult, wikiResult] = await Promise.allSettled([
      discoverPlaces(geo.lat, geo.lon),
      getWeather(geo.lat, geo.lon),
      getWikiContext(body.destination, geo.lat, geo.lon),
    ]);

    const places = placesResult.status === 'fulfilled' ? placesResult.value : { hotels: [], restaurants: [], attractions: [], hospitals: [], transportNodes: [] };
    const weather = weatherResult.status === 'fulfilled' ? weatherResult.value : null;
    const wiki = wikiResult.status === 'fulfilled' ? wikiResult.value : null;

    // Step 3: Transport discovery (depends on places.transportNodes)
    const transport = await discoverTransport(
      body.origin, geo.lat, geo.lon, body.destination, 
      places.transportNodes.map(n => ({ name: n.name, category: n.category, distanceKm: n.distanceKm }))
    );

    // Step 4: Build AI context from REAL data only
    const aiContext: AIContext = {
      origin: body.origin,
      destination: body.destination,
      budget: body.budget,
      duration: body.duration,
      travelType: body.travelType,
      travelers: body.travelers,
      arrivalMode: body.arrivalMode,
      arrivalTime: body.arrivalTime,
      departureTime: body.departureTime,
      hotelPreference: body.hotelPreference,
      foodPreference: body.foodPreference,
      interests: body.interests,
      hotels: places.hotels.slice(0, 10).map(h => ({ name: h.name, lat: h.lat, lon: h.lon, distanceKm: h.distanceKm })),
      restaurants: places.restaurants.slice(0, 15).map(r => ({ name: r.name, lat: r.lat, lon: r.lon, cuisine: r.cuisine, distanceKm: r.distanceKm })),
      attractions: places.attractions.slice(0, 20).map(a => ({ name: a.name, lat: a.lat, lon: a.lon, distanceKm: a.distanceKm })),
      transportNodes: places.transportNodes.slice(0, 10).map(t => ({ name: t.name, category: t.category, distanceKm: t.distanceKm })),
      weather: weather ? { temperature: weather.temperature, description: weather.description, rainProbability: weather.rainProbability } : null,
      wikiExtract: wiki?.extract || null,
      transport: transport ? { suggestedMode: transport.suggestedMode, durationHours: transport.durationHours, estimatedFare: transport.estimatedFare, destinationHub: transport.destinationHub } : null,
    };

    // Step 5: Generate itinerary via Gemini AI (with deterministic fallback)
    const aiOutput = await generateItinerary(aiContext);

    // Step 6: Collect real place names for sanitization
    const realNames = [
      ...places.hotels.map(h => h.name),
      ...places.restaurants.map(r => r.name),
      ...places.attractions.map(a => a.name),
      ...places.transportNodes.map(t => t.name),
      ...(wiki?.nearbyPlaces?.map(p => p.title) || []),
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanAI = (aiOutput ? sanitize(aiOutput as any, realNames) : {}) as any;

    // Step 7: Fetch a hero image for the destination
    let heroImage: string | null = wiki?.thumbnail || null;
    if (!heroImage && places.attractions.length > 0) {
      heroImage = await getPlaceImage(places.attractions[0].name, body.destination);
    }

    // Step 8: Assemble the final response (backwards-compatible with trip viewer)
    const hotelList = buildHotelList(places.hotels, body.budget, body.duration, body.destination);
    const restaurantList = buildRestaurantList(places.restaurants, body.destination);

    const destHub = transport?.destinationHub || places.transportNodes[0]?.name || body.destination;

    // Build days from AI output — keep morning/afternoon/evening/night structure for backwards compatibility
    const days = (cleanAI.days || []).map((day: { day?: number; title?: string; activities?: Array<{ time?: string; title?: string; description?: string; category?: string; type?: string; estimatedCost?: number; duration?: string; imageUrl?: string }> }, idx: number) => {
      const activities = day.activities || [];
      const morning = activities.filter((a: { time?: string }) => {
        const t = a.time || '';
        const hour = parseInt(t);
        return hour >= 6 && hour < 12;
      });
      const afternoon = activities.filter((a: { time?: string }) => {
        const t = a.time || '';
        const hour = parseInt(t);
        return hour >= 12 && hour < 17;
      });
      const evening = activities.filter((a: { time?: string }) => {
        const t = a.time || '';
        const hour = parseInt(t);
        return (hour >= 17 && hour < 21) || t.includes('5:') || t.includes('6:');
      });
      const night = activities.filter((a: { time?: string }) => {
        const t = a.time || '';
        const hour = parseInt(t);
        return hour >= 21 || hour < 6;
      });

      const mapActivity = (a: { time?: string; title?: string; description?: string; category?: string; type?: string; estimatedCost?: number; duration?: string; imageUrl?: string }) => ({
        time: a.time || '10:00 AM',
        timeSlot: 'morning' as const,
        title: a.title || 'Activity',
        name: a.title || 'Activity',
        description: a.description || '',
        category: a.category || 'Activity',
        type: (a.type || 'activity') as 'activity' | 'meal' | 'travel' | 'hotel',
        cost: a.estimatedCost || 0,
        location: body.destination,
        distance: '',
        travelTime: '',
        duration: a.duration || '1 hour',
        aiTip: '',
        imageUrl: a.imageUrl || heroImage || '',
      });

      return {
        day: day.day || idx + 1,
        date: new Date(Date.now() + 86400000 * idx).toISOString().split('T')[0],
        title: day.title || `Day ${idx + 1}`,
        morning: morning.map(mapActivity),
        afternoon: afternoon.map(mapActivity),
        evening: evening.map(mapActivity),
        night: night.map(mapActivity),
        activities: activities.map(mapActivity),
      };
    });

    // Build destination intelligence from real data
    const destinationIntelligence = places.attractions.slice(0, 15).map((a) => ({
      name: a.name,
      category: 'attraction' as const,
      rank: (a.distanceKm || 99) < 3 ? 'must visit' as const : 'recommended' as const,
      distance: `${a.distanceKm?.toFixed(1) || '?'} km`,
      description: `Found via OpenStreetMap at (${a.lat.toFixed(4)}, ${a.lon.toFixed(4)})`,
    }));

    // Build map experience from real data
    const mapMarkers = [
      ...places.hotels.slice(0, 2).map((h, i) => ({ id: `h_${i}`, name: h.name, type: 'hotel', lat: h.lat, lon: h.lon, badge: '🏨 Stay' })),
      ...places.attractions.slice(0, 5).map((a, i) => ({ id: `a_${i}`, name: a.name, type: 'attraction', lat: a.lat, lon: a.lon, badge: '🏛️ Visit' })),
      ...places.restaurants.slice(0, 3).map((r, i) => ({ id: `r_${i}`, name: r.name, type: 'restaurant', lat: r.lat, lon: r.lon, badge: '🍽️ Dine' })),
      ...places.hospitals.slice(0, 1).map((h, i) => ({ id: `med_${i}`, name: h.name, type: 'hospital', lat: h.lat, lon: h.lon, badge: '🏥 Emergency' })),
      ...places.transportNodes.slice(0, 2).map((t, i) => ({ id: `t_${i}`, name: t.name, type: 'transport', lat: t.lat, lon: t.lon, badge: '🚉 Transit' })),
    ];

    const response = {
      id: `tripvora-${Date.now()}`,
      tripOverview: cleanAI.tripOverview || wiki?.extract || `A ${body.duration}-day trip to ${body.destination}`,
      destination: body.destination,
      destinationSummary: wiki?.extract?.slice(0, 200) || `Explore ${body.destination} with real-time planned routes and verified locations.`,
      totalDays: body.duration,
      totalBudget: body.budget,
      estimatedCost: Math.floor(body.budget * 0.85),
      currency: 'INR',
      bestVisitingTime: '',
      weatherConsiderations: weather ? `${weather.description}, ${weather.temperature}°C, ${weather.rainProbability}% rain chance` : 'Weather data unavailable',
      weatherEngine: weather ? {
        currentWeather: weather.description,
        temperature: weather.temperature,
        rainProbability: weather.rainProbability,
        humidity: weather.humidity,
        uvIndex: weather.uvIndex,
        wind: weather.windSpeed,
        weatherCode: weather.weatherCode,
        weatherAdvice: weather.rainProbability > 60 ? 'Carry an umbrella — high chance of rain.' : weather.temperature > 38 ? 'Stay hydrated — extreme heat expected.' : 'Comfortable weather for sightseeing.',
        sunrise: '',
        sunset: '',
      } : undefined,
      packingSuggestions: cleanAI.packingSuggestions || [],
      safetyTips: cleanAI.safetyTips || [],
      localTravelAdvice: cleanAI.localTravelAdvice || '',
      emergencyContacts: {
        police: '112',
        ambulance: '102',
        embassyOrHelpline: '1363',
        hospitals: places.hospitals.slice(0, 3).map(h => h.name),
        pharmacies: [],
      },
      budgetTracker: buildBudgetTracker(body.budget, body.duration),
      travelToDestination: {
        userLocation: body.origin,
        destination: body.destination,
        transportAccess: transport,
        options: [{
          title: `${transport?.suggestedMode || 'Transit'}: ${body.origin} → ${body.destination}`,
          steps: [{
            mode: transport?.suggestedMode || 'Transit',
            cost: transport?.estimatedFare || 0,
            duration: transport ? `${transport.durationHours} hours` : 'Unknown',
          }],
          totalCost: transport?.estimatedFare || 0,
          totalDuration: transport ? `${transport.durationHours} hours` : 'Unknown',
        }],
      },
      transportAccess: {
        transportExists: true,
        transportMode: transport?.suggestedMode || 'Transit',
        sourceHub: transport?.originHub || body.origin,
        destinationHub: destHub,
        distanceKm: transport?.distanceKm || 0,
        duration: transport ? `${transport.durationHours} Hours` : 'Unknown',
        fare: transport ? `₹${transport.estimatedFare}` : 'Unknown',
        journeyLegs: transport?.journeyLegs || [body.origin, body.destination],
      },
      arrivalPlan: {
        arrivalPoint: destHub,
        time: body.arrivalTime,
        steps: [
          { time: body.arrivalTime, step: `Arrive at ${destHub}` },
          { step: 'Take local transport to hotel' },
          { step: 'Check in and freshen up' },
          { step: 'Start exploring nearby area' },
        ],
      },
      returnPlan: {
        checkoutTime: '11:00 AM',
        departurePoint: destHub,
        transportOptions: [{ mode: 'Local cab', cost: 300, duration: '30 min' }],
        summary: `Hotel checkout by 11:00 AM, departure from ${destHub} at ${body.departureTime}.`,
        thankYouMessage: `Have a safe journey home to ${body.origin}!`,
      },
      foodIntelligence: {
        mustTryDish: places.restaurants[0]?.cuisine || 'Local specialty',
        bestVeg: places.restaurants.find(r => r.cuisine?.toLowerCase().includes('veg'))?.name || '',
        bestNonVeg: places.restaurants.find(r => !r.cuisine?.toLowerCase().includes('veg'))?.name || '',
      },
      destinationIntelligence,
      hotels: hotelList.length > 0 ? [{
        ...hotelList[0],
        bestOverallHotel: hotelList[0],
        budgetHotel: hotelList[1] || hotelList[0],
        midHotel: hotelList[2] || hotelList[0],
        premiumHotel: hotelList[3] || hotelList[0],
        alternatives: hotelList.slice(1),
        budgetOption: hotelList[1] || hotelList[0],
      }] : [],
      flights: [],
      restaurants: restaurantList,
      days,
      mapExperience: {
        centerLat: geo.lat,
        centerLon: geo.lon,
        markers: mapMarkers,
        dayRoutes: [],
      },
    };

    // Background persistence (non-blocking)
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
    } catch { /* persistence failure should never block response */ }

    return NextResponse.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Trip generation error:', message);
    return NextResponse.json({ status: 'FAILED', reason: message }, { status: 500 });
  }
}
