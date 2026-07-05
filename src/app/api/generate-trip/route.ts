import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { geocode } from '@/lib/engines/geocoder';
import { discoverPlaces, type Place } from '@/lib/engines/places';
import { getWeather } from '@/lib/engines/weather';
import { discoverTransport } from '@/lib/engines/transport';
import { getWikiContext } from '@/lib/engines/wiki';
import { getDestinationImage } from '@/lib/engines/images';
import { buildTripContext } from '@/lib/engines/context';
import { buildGroupAllocation } from '@/lib/engines/group';
import { discoverHiddenGems } from '@/lib/engines/hidden-gems';
import { calculateComfort } from '@/lib/engines/comfort';
import { buildDestinationIntelligence } from '@/lib/engines/destination';
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

type TripForm = {
  source: string;
  destination: string;
  trip_type: "solo" | "couple" | "family" | "friends" | "corporate" | "bachelor";
  travelers: number;
  boys: number;
  girls: number;
  children: number;
  budget: number;
  currency: string;
  start_date: string;
  end_date: string;
  arrival_datetime: string;
  comfort: "budget" | "comfortable" | "luxury";
  pace: "slow" | "balanced" | "fast";
  walking: "low" | "medium" | "high";
  food: "veg" | "nonveg" | "jain" | "vegan";
  interests: string[];
  hotel_preference: string[];
  transport_preference: string[];
  special_requests: string[];
};

function validateInput(body: Record<string, unknown>): { ok: true; data: TripForm } | { ok: false; error: string } {
  const destination = String(body.destination || '').trim();
  const source = String(body.source || '').trim();
  if (!destination || destination.length < 2) return { ok: false, error: 'Invalid destination' };
  if (!source || source.length < 2) return { ok: false, error: 'Invalid source' };

  return {
    ok: true,
    data: {
      source,
      destination,
      trip_type: (String(body.trip_type) as any) || "couple",
      travelers: Number(body.travelers) || 2,
      boys: Number(body.boys) || 0,
      girls: Number(body.girls) || 0,
      children: Number(body.children) || 0,
      budget: Number(body.budget) || 50000,
      currency: String(body.currency || "INR"),
      start_date: String(body.start_date || ""),
      end_date: String(body.end_date || ""),
      arrival_datetime: String(body.arrival_datetime || ""),
      comfort: (String(body.comfort) as any) || "comfortable",
      pace: (String(body.pace) as any) || "balanced",
      walking: (String(body.walking) as any) || "medium",
      food: (String(body.food) as any) || "veg",
      interests: Array.isArray(body.interests) ? body.interests.map(String) : [],
      hotel_preference: Array.isArray(body.hotel_preference) ? body.hotel_preference.map(String) : [],
      transport_preference: Array.isArray(body.transport_preference) ? body.transport_preference.map(String) : [],
      special_requests: Array.isArray(body.special_requests) ? body.special_requests.map(String) : []
    }
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

function buildHotels(hotels: Place[], budget: number, duration: number, destination: string) {
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
  hotels: Place[];
  restaurants: Place[];
  attractions: Place[];
  hospitals: Place[];
  transportNodes: Place[];
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

    const duration = Math.max(1, Math.ceil((new Date(body.end_date).getTime() - new Date(body.start_date).getTime()) / 86400000));
    
    // ── Step 2: Parallel data fetching ──
    const [places, weather, wiki, emergency, destinationImage] = await Promise.all([
      timedStage('POI_DISCOVERY', () => discoverPlaces(geo.lat, geo.lon), { countFn: (p) => p.attractions.length }),
      timedStage('WEATHER', () => getWeather(geo.lat, geo.lon)),
      timedStage('SANITIZATION', () => getWikiContext(body.destination, geo.lat, geo.lon)),
      timedStage('EMERGENCY', () => discoverEmergencyContacts(geo.lat, geo.lon)),
      timedStage('IMAGE_ENGINE', () => getDestinationImage(body.destination)),
    ]);

    // ── Step 2.5: Context & Group Engines ──
    const tripContext = await timedStage('TRIP_CONTEXT', async () => buildTripContext(
      body.arrival_datetime,
      geo.lat,
      geo.lon,
      duration
    ));

    const groupAllocation = await timedStage('GROUP_ENGINE', async () => buildGroupAllocation(
      { boys: body.boys, girls: body.girls, children: body.children, total_travelers: body.travelers },
      body.budget,
      body.trip_type
    ));

    // ── Step 3: Transport discovery ──
    const transport = await timedStage('ROUTING', () => discoverTransport(
      body.source,
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
      travelType: body.trip_type,
      foodPreference: body.food,
      interests: body.interests,
      budget: body.budget,
      duration: duration,
      hotelPreference: body.hotel_preference[0] || body.comfort,
      travelers: { adults: body.travelers, children: body.children, seniors: 0 },
      travelStyle: body.trip_type,
      travelSpeed: body.pace,
    }));

    // ── Step 3.6: Rank places using DNA ──
    const hotelBudgetPerNight = Math.floor((body.budget * 0.4) / Math.max(duration - 1, 1));
    const rankedHotels = rankHotels(places.hotels, dna, hotelBudgetPerNight) as Place[];
    const rankedRestaurants = rankRestaurants(places.restaurants, dna) as Place[];
    const rankedAttractions = rankAttractions(
      places.attractions, dna,
      weather ? { temperature: weather.temperature, rainProbability: weather.rainProbability } : null
    ) as Place[];

    // ── Step 3.7: Geo-cluster & Hidden Gems & Destination Intel ──
    const walkTolerance = (body.walking || 'medium') as 'minimal' | 'low' | 'medium' | 'high';
    const clusters = await timedStage('CLUSTERING', async () => clusterByProximity(
      rankedAttractions.slice(0, 30).map(a => ({ name: a.name, lat: a.lat, lon: a.lon, category: a.category, distanceKm: a.distanceKm })),
      duration,
      walkTolerance
    ));

    const hiddenGems = await timedStage('HIDDEN_GEMS', async () => discoverHiddenGems(rankedAttractions));
    
    const destinationIntelligence = await timedStage('DESTINATION_INTEL', async () => buildDestinationIntelligence(
      [...rankedAttractions, ...rankedRestaurants, ...rankedHotels],
      hiddenGems
    ));

    // ── Step 3.8: Compute proper budget breakdown ──
    const budgetBreakdown = await timedStage('BUDGET', async () => calculateBudget(
      body.budget,
      duration,
      { adults: body.travelers, children: body.children, seniors: 0 },
      body.comfort,
      transport.estimatedFare,
      body.trip_type
    ));

    // ── Step 3.9: Comfort & Schedule Optimizer ──
    const comfortMetrics = await timedStage('COMFORT_ENGINE', async () => calculateComfort(
      body.walking,
      body.pace,
      weather ? { temperature: weather.temperature, rainProbability: weather.rainProbability } : null,
      transport.durationHours
    ));

    const scheduleData: DaySchedule[] = await timedStage('SCHEDULING', async () => buildSchedule(
      duration,
      tripContext.arrival_day_start,
      '', // Let engine decide departure time based on pace
      body.pace,
      body.trip_type,
      clusters.map(c => ({ places: c.places.map(p => ({ name: p.name, category: p.category })), totalWalkingKm: c.totalWalkingKm })),
      rankedRestaurants.slice(0, 10).map(r => ({ name: r.name, cuisine: r.cuisine })),
      rankedHotels[0].name,
      transport.durationHours
    ));

    // ── Step 4: Build AI context ──
    const aiContext: AIContext = {
      origin: body.source,
      destination: body.destination,
      budget: body.budget,
      duration: duration,
      travelType: body.trip_type,
      travelers: { adults: body.travelers, children: body.children, seniors: 0 },
      arrivalMode: body.transport_preference[0] || 'Train',
      hotelPreference: body.hotel_preference[0] || 'Mid-range',
      foodPreference: body.food,
      interests: body.interests,
      tripPurpose: body.trip_type,
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

    // ── Step 6: Final JSON Assembly (Phase 23 Strict Match) ──
    const response = {
      success: true,
      id: crypto.randomUUID(),
      trip: {
        destination: body.destination,
        destinationSummary: wiki?.extract?.slice(0, 300) || `Explore ${body.destination}.`,
        heroImage: destinationImage,
        totalDays: duration,
        totalBudget: body.budget,
        currency: 'INR',
        tripOverview: narrative.tripOverview,
        packingSuggestions: narrative.packingSuggestions,
        safetyTips: narrative.safetyTips,
        localTravelAdvice: narrative.localTravelAdvice,
      },
      traveler_dna: dna,
      context: tripContext,
      group: groupAllocation,
      transport: {
        transportMode: transport.suggestedMode,
        sourceHub: transport.originHub,
        destinationHub: destHub,
        distanceKm: transport.distanceKm,
        duration: `${transport.durationHours} Hours`,
        fare: transport.estimatedFare,
        journeyLegs: transport.journeyLegs,
      },
      hotels: buildHotels(rankedHotels as Place[], body.budget, duration, body.destination),
      restaurants: rankedRestaurants.slice(0, 12).map((r) => ({
        name: r.name,
        cuisine: r.cuisine || 'Local',
        address: `${(r.distanceKm ?? 0).toFixed(1)} km from center`,
      })),
      poi: destinationIntelligence,
      weather: weather ? {
        currentWeather: weather.description,
        temperature: weather.temperature,
        rainProbability: weather.rainProbability,
        weatherAdvice: weather.rainProbability > 60 ? 'Rain expected' : 'Clear',
      } : {},
      emergency: emergency,
      budget: budgetBreakdown,
      comfort: comfortMetrics,
      days: days,
      map: buildMap(geo, places),
      affiliateLinks: generateAffiliateLinks({
        origin: body.source,
        destination: body.destination,
        checkIn: body.start_date,
        checkOut: body.end_date,
        adults: body.travelers,
        children: body.children,
      }),
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
          overview: response.trip.tripOverview,
          tags: [body.trip_type],
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
