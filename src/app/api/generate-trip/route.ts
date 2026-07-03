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
import { buildTravelerDNA, rankHotels, rankRestaurants, rankAttractions } from '@/lib/engines/traveler-dna';

export const maxDuration = 60;

// ─── Input Validation ──────────────────────────────────────────────

type ValidatedInput = {
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

function validateInput(body: Record<string, unknown>): { ok: true; data: ValidatedInput } | { ok: false; error: string } {
  const destination = String(body.destination || '').trim();
  if (!destination || destination.length < 2 || destination.length > 100) {
    return { ok: false, error: 'Please enter a valid destination name.' };
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

  const trav = (body.travelers || {}) as Record<string, unknown>;

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
      rankingScore: 0,
      reviewCount: 0,
      tierLabel: tier.label,
      distanceFromAttractions: `${(h.distanceKm ?? 0).toFixed(1)} km from center`,
    };
  });

  // Structure the first hotel object to match what the trip viewer expects
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

// ─── Restaurant Assembly ────────────────────────────────────────────

function buildRestaurants(restaurants: OSMPlace[], destination: string) {
  return restaurants.slice(0, 12).map((r) => ({
    name: r.name,
    cuisine: r.cuisine || 'Local',
    estimatedCost: 0,
    rating: 0,
    address: `${(r.distanceKm ?? 0).toFixed(1)} km from center, ${destination}`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' ' + destination)}`,
    mealType: 'Lunch' as const,
  }));
}

// ─── Budget Assembly ────────────────────────────────────────────────

function buildBudget(budget: number, duration: number, transportFare: number) {
  const hotel = Math.floor(budget * 0.40);
  const transport = Math.floor(budget * 0.15) + transportFare;
  const food = Math.floor(budget * 0.20);
  const activities = Math.floor(budget * 0.10);
  const localTransport = Math.floor(budget * 0.05);
  const emergency = Math.floor(budget * 0.10);
  const total = hotel + transport + food + activities + localTransport;

  return {
    hotels: hotel,
    transport,
    food,
    activities,
    localTransport,
    shoppingOrMisc: emergency,
    dailyTotalAverage: Math.floor(total / duration),
    overallTotal: total,
    remainingOrSavings: Math.max(budget - total, 0),
    budgetHealthScore: Math.round(((budget - total) / budget) * 100),
    totalBudget: budget,
    plannedSplit: { hotel, transport, food, activities, emergency },
    actualSpend: { hotel, transport, food, activities, emergencyReserve: emergency },
    budgetMeter: {
      percentageUsed: Math.min(Math.round((total / budget) * 100), 100),
      status: total < budget * 0.85 ? 'Within Budget' : total < budget ? 'Near Limit' : 'Over Budget',
    },
    dailySpend: [] as Array<Record<string, unknown>>,
    categorySpend: [
      { category: 'Stay', planned: hotel, actual: hotel, percentage: 40, status: 'Estimated' },
      { category: 'Intercity Transport', planned: transportFare, actual: transportFare, percentage: 15, status: 'Estimated' },
      { category: 'Food & Dining', planned: food, actual: food, percentage: 20, status: 'Estimated' },
      { category: 'Activities', planned: activities, actual: activities, percentage: 10, status: 'Estimated' },
      { category: 'Local Transport', planned: localTransport, actual: localTransport, percentage: 5, status: 'Estimated' },
      { category: 'Emergency Reserve', planned: emergency, actual: emergency, percentage: 10, status: 'Reserve' },
    ],
    budgetAlternatives: [] as Array<Record<string, unknown>>,
  };
}

// ─── Arrival Plan from AI Journey ───────────────────────────────────

interface JourneyStep {
  time?: string;
  action?: string;
  details?: string;
  cost?: number;
}

function buildArrivalPlan(arrivalJourney: JourneyStep[] | undefined, destHub: string, arrivalTime: string) {
  if (arrivalJourney && arrivalJourney.length > 0) {
    return {
      arrivalPoint: destHub,
      time: arrivalJourney[0]?.time || arrivalTime,
      steps: arrivalJourney.map(j => ({
        time: j.time || '',
        step: j.action || '',
        details: j.details || '',
        fare: j.cost ? `₹${j.cost}` : undefined,
        options: undefined,
      })),
    };
  }

  // Fallback: simple arrival
  return {
    arrivalPoint: destHub,
    time: arrivalTime,
    steps: [
      { time: arrivalTime, step: `Arrive at ${destHub}` },
      { step: 'Take local transport to hotel' },
      { step: 'Check in and freshen up' },
      { step: 'Begin exploring nearby area' },
    ],
  };
}

function buildReturnPlan(departureJourney: JourneyStep[] | undefined, destHub: string, departureTime: string, origin: string) {
  if (departureJourney && departureJourney.length > 0) {
    return {
      checkoutTime: '11:00 AM',
      departurePoint: destHub,
      steps: departureJourney.map(j => ({
        time: j.time || '',
        step: j.action || '',
        details: j.details || '',
        fare: j.cost ? `₹${j.cost}` : undefined,
      })),
      summary: `Departure from ${destHub} back to ${origin}`,
      thankYouMessage: `Have a safe journey home!`,
    };
  }

  return {
    checkoutTime: '11:00 AM',
    departurePoint: destHub,
    transportOptions: [{ mode: 'Local transport to station', cost: 200, duration: '30 min' }],
    summary: `Hotel checkout by 11:00 AM, departure from ${destHub} at ${departureTime}.`,
    thankYouMessage: `Have a safe journey home!`,
  };
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
    const rawBody = await request.json();
    const validation = validateInput(rawBody);
    if (!validation.ok) {
      return NextResponse.json({ status: 400, reason: validation.error }, { status: 400 });
    }
    const body = validation.data;

    // ── Step 1: Geocode destination ──
    const geo = await geocode(body.destination);
    if (!geo) {
      return NextResponse.json(
        { status: 422, reason: `Could not find "${body.destination}" on the map. Please check the spelling.` },
        { status: 422 }
      );
    }

    // ── Step 2: Parallel data fetching (all real, all with timeouts) ──
    const [placesResult, weatherResult, wikiResult] = await Promise.allSettled([
      discoverPlaces(geo.lat, geo.lon),
      getWeather(geo.lat, geo.lon),
      getWikiContext(body.destination, geo.lat, geo.lon),
    ]);

    const places = placesResult.status === 'fulfilled'
      ? placesResult.value
      : { hotels: [], restaurants: [], attractions: [], hospitals: [], transportNodes: [] };
    const weather = weatherResult.status === 'fulfilled' ? weatherResult.value : null;
    const wiki = wikiResult.status === 'fulfilled' ? wikiResult.value : null;

    // Enrich attractions with Wikipedia geosearch results
    if (wiki?.nearbyPlaces) {
      for (const wp of wiki.nearbyPlaces) {
        const alreadyFound = places.attractions.some(a =>
          a.name.toLowerCase() === wp.title.toLowerCase()
        );
        if (!alreadyFound && wp.title.length > 3) {
          places.attractions.push({
            id: wp.pageid,
            lat: wp.lat,
            lon: wp.lon,
            name: wp.title,
            category: 'attraction',
            distanceKm: 0,
          });
        }
      }
    }

    // ── Step 3: Transport discovery ──
    const transport = await discoverTransport(
      body.origin,
      geo.lat,
      geo.lon,
      body.destination,
      places.transportNodes.map(n => ({ name: n.name, category: n.category, distanceKm: n.distanceKm }))
    );

    // ── Step 3.5: Build Traveler DNA ──
    const dna = buildTravelerDNA({
      travelType: body.travelType,
      foodPreference: body.foodPreference,
      interests: body.interests,
      budget: body.budget,
      duration: body.duration,
      hotelPreference: body.hotelPreference,
      travelers: body.travelers,
    });

    // ── Step 3.6: Rank places using DNA ──
    const hotelBudgetPerNight = Math.floor((body.budget * 0.4) / Math.max(body.duration - 1, 1));
    const rankedHotels = rankHotels(places.hotels, dna, hotelBudgetPerNight) as OSMPlace[];
    const rankedRestaurants = rankRestaurants(places.restaurants, dna) as OSMPlace[];
    const rankedAttractions = rankAttractions(
      places.attractions, dna,
      weather ? { temperature: weather.temperature, rainProbability: weather.rainProbability } : null
    ) as OSMPlace[];

    // ── Step 4: Build AI context from RANKED real data ──
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
      hotels: rankedHotels.slice(0, 15).map(h => ({ name: h.name, lat: h.lat, lon: h.lon, distanceKm: h.distanceKm })),
      restaurants: rankedRestaurants.slice(0, 20).map(r => ({ name: r.name, lat: r.lat, lon: r.lon, cuisine: r.cuisine, distanceKm: r.distanceKm })),
      attractions: rankedAttractions.slice(0, 30).map(a => ({ name: a.name, lat: a.lat, lon: a.lon, distanceKm: a.distanceKm })),
      transportNodes: places.transportNodes.slice(0, 15).map(t => ({ name: t.name, category: t.category, distanceKm: t.distanceKm })),
      weather: weather ? { temperature: weather.temperature, description: weather.description, rainProbability: weather.rainProbability } : null,
      wikiExtract: wiki?.extract || null,
      transport: transport ? {
        suggestedMode: transport.suggestedMode,
        durationHours: transport.durationHours,
        estimatedFare: transport.estimatedFare,
        destinationHub: transport.destinationHub,
      } : null,
    };

    // ── Step 5: Generate itinerary via Gemini AI ──
    const aiOutput = await generateItinerary(aiContext);

    // ── Step 6: Sanitize AI output ──
    const realNames = [
      ...places.hotels.map(h => h.name),
      ...places.restaurants.map(r => r.name),
      ...places.attractions.map(a => a.name),
      ...places.transportNodes.map(t => t.name),
      ...(wiki?.nearbyPlaces?.map(p => p.title) || []),
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clean = sanitize(aiOutput as any, realNames) as any;

    // ── Step 7: Hero image ──
    let heroImage: string | null = wiki?.thumbnail || null;
    if (!heroImage && places.attractions.length > 0) {
      heroImage = await getPlaceImage(places.attractions[0].name, body.destination);
    }

    // ── Step 8: Assemble response ──
    const destHub = transport?.destinationHub || places.transportNodes[0]?.name || body.destination;

    // Build days with morning/afternoon/evening/night split (backwards compatible)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const days = (clean.days || []).map((day: any, idx: number) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const activities = (day.activities || []).map((a: any) => ({
        time: a.time || '10:00 AM',
        timeSlot: parseTimeSlot(a.time || '10:00 AM'),
        title: a.title || 'Activity',
        name: a.title || 'Activity',
        description: a.description || '',
        category: a.category || 'activity',
        type: a.type || 'activity',
        cost: a.estimatedCost || 0,
        location: body.destination,
        distance: a.walkingDistance || '',
        travelTime: '',
        duration: a.duration || '1 hour',
        aiTip: '',
        imageUrl: heroImage || '',
      }));

      // Split activities into time-of-day buckets
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const morning = activities.filter((a: any) => a.timeSlot === 'morning');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const afternoon = activities.filter((a: any) => a.timeSlot === 'afternoon');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const evening = activities.filter((a: any) => a.timeSlot === 'evening');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const night = activities.filter((a: any) => a.timeSlot === 'night');

      return {
        day: day.day || idx + 1,
        date: new Date(Date.now() + 86400000 * idx).toISOString().split('T')[0],
        title: day.title || `Day ${idx + 1}`,
        morning,
        afternoon,
        evening,
        night,
        activities,
      };
    });

    // Destination intelligence from real data
    const destinationIntelligence = places.attractions.slice(0, 20).map(a => ({
      name: a.name,
      category: 'attraction',
      rank: (a.distanceKm ?? 99) < 3 ? 'must visit' : 'recommended',
      distance: `${(a.distanceKm ?? 0).toFixed(1)} km`,
      description: `Located at (${a.lat.toFixed(4)}, ${a.lon.toFixed(4)})`,
    }));

    // Transport feasibility info
    const transportAccess = {
      transportExists: true,
      transportMode: transport?.suggestedMode || 'Transit',
      sourceHub: transport?.originHub || body.origin,
      destinationHub: destHub,
      distanceKm: transport?.distanceKm || 0,
      duration: transport ? `${transport.durationHours} Hours` : 'Unknown',
      fare: transport ? `₹${transport.estimatedFare}` : 'Unknown',
      journeyLegs: transport?.journeyLegs || [body.origin, body.destination],
      nearestAirport: (transport as any)?.nearestAirport || null,
      nearestRailway: (transport as any)?.nearestRailway || null,
      nearestBusStand: (transport as any)?.nearestBusStand || null,
      feasibility: (transport as any)?.feasibility || { byFlight: false, byTrain: false, byBus: true, byCar: true },
    };

    const response = {
      id: `tripvora-${Date.now()}`,
      tripOverview: clean.tripOverview || wiki?.extract || `A ${body.duration}-day trip to ${body.destination}`,
      destination: body.destination,
      destinationSummary: wiki?.extract?.slice(0, 300) || `Explore ${body.destination} with a personally planned itinerary.`,
      totalDays: body.duration,
      totalBudget: body.budget,
      estimatedCost: Math.floor(body.budget * 0.85),
      currency: 'INR',
      bestVisitingTime: '',
      weatherConsiderations: weather
        ? `${weather.description}, ${weather.temperature}°C, ${weather.rainProbability}% rain`
        : 'Weather data unavailable',
      weatherEngine: weather ? {
        currentWeather: weather.description,
        temperature: weather.temperature,
        rainProbability: weather.rainProbability,
        humidity: weather.humidity,
        uvIndex: weather.uvIndex,
        wind: weather.windSpeed,
        weatherCode: weather.weatherCode,
        weatherAdvice: weather.rainProbability > 60
          ? 'Carry an umbrella — high chance of rain.'
          : weather.temperature > 38
            ? 'Stay hydrated — extreme heat expected.'
            : 'Comfortable weather for exploring.',
        sunrise: '',
        sunset: '',
      } : undefined,
      packingSuggestions: clean.packingSuggestions || [],
      safetyTips: clean.safetyTips || [],
      localTravelAdvice: clean.localTravelAdvice || '',
      emergencyContacts: {
        police: '112',
        ambulance: '102',
        embassyOrHelpline: '1363',
        hospitals: places.hospitals.slice(0, 3).map(h => h.name),
        pharmacies: [] as string[],
      },
      budgetTracker: buildBudget(body.budget, body.duration, transport?.estimatedFare || 0),
      travelToDestination: {
        userLocation: body.origin,
        destination: body.destination,
        transportAccess,
        options: [{
          title: `${transport?.suggestedMode || 'Transit'}: ${body.origin} → ${body.destination}`,
          steps: transport?.journeyLegs.map((leg, i) => ({
            mode: i === 0 ? transport?.suggestedMode || 'Transit' : 'Connection',
            cost: i === 0 ? transport?.estimatedFare || 0 : 0,
            duration: i === 0 ? `${transport?.durationHours || '?'} hours` : '',
          })) || [{ mode: 'Transit', cost: 0, duration: 'Unknown' }],
          totalCost: transport?.estimatedFare || 0,
          totalDuration: transport ? `${transport.durationHours} hours` : 'Unknown',
        }],
      },
      transportAccess,
      arrivalPlan: buildArrivalPlan(clean.arrivalJourney, destHub, body.arrivalTime),
      returnPlan: buildReturnPlan(clean.departureJourney, destHub, body.departureTime, body.origin),
      foodIntelligence: {
        mustTryDish: places.restaurants[0]?.cuisine || 'Local cuisine',
        bestVeg: places.restaurants.find(r => r.cuisine?.toLowerCase().includes('veg'))?.name || '',
        bestNonVeg: places.restaurants.find(r => !r.cuisine?.toLowerCase().includes('veg'))?.name || '',
      },
      destinationIntelligence,
      travelerDNA: {
        type: dna.travelerType,
        purpose: dna.purpose,
        comfortLevel: dna.comfortLevel,
        energyLevel: dna.energyLevel,
        spendingStyle: dna.spendingStyle,
        walkingTolerance: dna.walkingTolerance,
        travelPace: dna.travelPace,
        foodPreference: dna.foodPreference,
        maxActivitiesPerDay: dna.maxActivitiesPerDay,
        prioritize: dna.prioritize,
        avoid: dna.avoid,
      },
      userPreferenceEngine: {
        detectedProfile: dna.purpose,
        preferredCategories: body.interests,
        paceAndComfort: `${dna.travelPace > 60 ? 'Packed' : dna.travelPace > 35 ? 'Balanced' : 'Relaxed'} pace, ${dna.maxActivitiesPerDay} activities/day`,
        specialRulesApplied: [
          ...(dna.foodPreference === 'pure_veg' ? ['Pure vegetarian enforcement'] : []),
          ...dna.prioritize.slice(0, 3).map(p => `Prioritize: ${p}`),
          ...dna.avoid.slice(0, 2).map(a => `Avoid: ${a}`),
        ],
      },
      hotels: buildHotels(rankedHotels, body.budget, body.duration, body.destination),
      flights: [] as Array<Record<string, unknown>>,
      restaurants: buildRestaurants(rankedRestaurants, body.destination),
      days,
      mapExperience: buildMap(geo, places),
      conciergeWorkflow: {
        arrivalWorkflow: (clean.arrivalJourney || []).map((j: JourneyStep) => ({
          time: j.time || '',
          activity: j.action || '',
          details: j.details || '',
          fare: j.cost ? `₹${j.cost}` : undefined,
        })),
        departureWorkflow: (clean.departureJourney || []).map((j: JourneyStep) => ({
          time: j.time || '',
          activity: j.action || '',
          details: j.details || '',
          fare: j.cost ? `₹${j.cost}` : undefined,
        })),
        conciergeAdvice: {
          hotelCheckin: '12:00 PM',
          hotelCheckout: '11:00 AM',
          taxiFare: `₹${Math.round((transport?.distanceKm || 10) * 15)}/trip`,
          busFare: `₹${Math.round((transport?.distanceKm || 10) * 2)}/trip`,
          walkingTime: '10-15 min to nearby spots',
          emergencyContact: '112 (Police) | 102 (Ambulance)',
        },
        validation: {
          arrivalTransportExists: places.transportNodes.length > 0,
          hotelReachable: places.hotels.length > 0,
          timingRealistic: true,
          departureFeasible: true,
        },
      },
    };

    // ── Background persistence (non-blocking) ──
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
    } catch { /* persistence failure should not block */ }

    return NextResponse.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Trip generation error:', message);
    return NextResponse.json({ status: 'FAILED', reason: message }, { status: 500 });
  }
}
