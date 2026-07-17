/**
 * TRIPVORA — Phase 1 API: Trip Analysis & Blueprint Generation
 * 
 * POST /api/trip/analyze
 * 
 * Accepts wizard data, runs ALL intelligence engines, and returns
 * a TripBlueprint JSON for user review. Does NOT generate the 
 * day-by-day itinerary — that happens in Phase 2 after user approval.
 * 
 * Pipeline:
 * Validation → Geocoding → [Places, Weather, Wiki, Transport] (parallel)
 * → Must-Visit → Clustering → Budget → Quality Pre-Validation → Blueprint
 */

import { NextResponse } from 'next/server';
import { withSecurity } from '@/lib/security/api-wrapper';
import { geocode } from '@/lib/engines/geocoder';
import { discoverPlaces } from '@/lib/engines/places';
import { getWeather, getForecast } from '@/lib/engines/weather';
import { getWikiContext } from '@/lib/engines/wiki';
import { getDestinationImage } from '@/lib/engines/images';
import { discoverTransport } from '@/lib/engines/transport';
import { buildTravelerDNA, rankHotels, rankRestaurants, rankAttractions } from '@/lib/engines/traveler-dna';
import { clusterByProximity } from '@/lib/engines/cluster';
import { calculateBudget } from '@/lib/engines/budget';
import { validateMustVisitPlaces } from '@/lib/engines/must-visit';
import { discoverHiddenGems } from '@/lib/engines/hidden-gems';
import { generateAffiliateLinks } from '@/lib/engines/affiliates';
import { timedStage, clearPipelineLogs } from '@/lib/engines/logger';
import type {
  TripBlueprint,
  UserPreferences,
  RankedAttraction,
  RankedHotel,
  RankedRestaurant,
  TripWarning,
  AIRecommendation,
  MapMarker,
  DestinationIntelligenceData,
  DestinationHub,
  TravelCluster,
} from '@/lib/types/blueprint';
import type { Place } from '@/lib/engines/places';

export const maxDuration = 60;

// ─── Input Validation ───────────────────────────────────────────────

function validateAnalyzeInput(body: Record<string, unknown>): { ok: true; data: UserPreferences } | { ok: false; error: string } {
  const destination = String(body.destination || '').trim();
  const source = String(body.source || '').trim();
  if (!destination || destination.length < 2) return { ok: false, error: 'Invalid destination' };
  if (!source || source.length < 2) return { ok: false, error: 'Invalid source' };

  return {
    ok: true,
    data: {
      source,
      sourceCoords: (body.sourceCoords as any) || null,
      destination,
      destinationCoords: (body.destinationCoords as any) || null,
      destinationType: String(body.destinationType || 'city'),
      tripDates: (body.tripDates as any) || { start: body.start_date || '', end: body.end_date || '' },
      duration: (body.duration as any) || { days: 0, nights: 0 },
      hasTransport: Boolean(body.hasTransport || body.has_transport),
      transport: (body.transport || body.transport_details || null) as any,
      hasHotel: Boolean(body.hasHotel || body.has_hotel),
      hotel: (body.hotel || body.hotel_details || null) as any,
      travelType: String(body.travelType || body.trip_type || 'couple'),
      members: (body.members as any) || {
        adults: Number(body.travelers) || 2,
        children: Number(body.children) || 0,
        seniors: 0,
        boys: Number(body.boys) || 0,
        girls: Number(body.girls) || 0,
      },
      budget: Number(body.budget) || 50000,
      budgetMode: (String(body.budgetMode || body.budget_mode || 'balanced')) as any,
      pace: (String(body.pace || 'balanced')) as any,
      interests: Array.isArray(body.interests) ? body.interests.map(String) : [],
      foodPreference: Array.isArray(body.foodPreference || body.food_preferences)
        ? (body.foodPreference || body.food_preferences as any).map(String)
        : body.food ? [String(body.food)] : [],
      hotelPreference: Array.isArray(body.hotelPreference || body.hotel_preference)
        ? (body.hotelPreference || body.hotel_preference as any).map(String)
        : [],
      mustVisit: Array.isArray(body.mustVisit || body.must_visit)
        ? (body.mustVisit || body.must_visit) as any[]
        : [],
    },
  };
}

// ─── Helper: Convert Places to Ranked types ─────────────────────────

function toRankedAttraction(p: Place, index: number): RankedAttraction {
  return {
    id: p.id,
    placeId: p.placeId || p.id,
    name: p.name,
    lat: p.lat,
    lon: p.lon,
    category: p.category,
    rating: p.rating || 0,
    userRatingsTotal: p.userRatingsTotal || 0,
    distanceKm: p.distanceKm || 0,
    provider: p.provider || 'Google',
    imageUrl: p.imageUrl || '',
    types: p.types || [],
    businessStatus: p.businessStatus || 'OPERATIONAL',
    openingHours: null, // Loaded lazily in Stage 2
    phone: null,
    website: null,
    photos: p.photoReference ? [p.imageUrl || ''] : [],
    estimatedVisitDuration: estimateVisitDuration(p.category, p.types || [], p.name),
    entryFee: estimateEntryFee(p.types || [], p.name),
    rankingScore: (p.rating || 0) * Math.log10((p.userRatingsTotal || 0) + 2),
    clusterId: null,
    isSelected: true,
    isUserAdded: false,
  };
}

function toRankedHotel(p: Place, budget: number, duration: number, destination: string): RankedHotel {
  const nights = Math.max(duration - 1, 1);
  const hotelBudget = Math.floor(budget * 0.40);
  const maxPerNight = Math.max(Math.floor(hotelBudget / nights), 800);
  const estimatedPrice = Math.max(Math.floor(maxPerNight * (p.priceLevel ? p.priceLevel / 4 : 0.6)), 600);
  const q = encodeURIComponent(`${p.name} ${destination}`);

  return {
    id: p.id,
    placeId: p.placeId || p.id,
    name: p.name,
    lat: p.lat,
    lon: p.lon,
    rating: p.rating || 0,
    userRatingsTotal: p.userRatingsTotal || 0,
    priceLevel: p.priceLevel || 0,
    distanceKm: p.distanceKm || 0,
    provider: p.provider || 'Google',
    imageUrl: p.imageUrl || '',
    estimatedPricePerNight: estimatedPrice,
    amenities: [],
    tierLabel: getTierLabel(p.priceLevel || 0),
    distanceFromClusters: p.distanceKm || 0,
    bookingLink: `https://www.booking.com/searchresults.html?ss=${q}`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${q}`,
    isSelected: false,
    isUserBooked: false,
  };
}

function toRankedRestaurant(p: Place): RankedRestaurant {
  return {
    id: p.id,
    placeId: p.placeId || p.id,
    name: p.name,
    lat: p.lat,
    lon: p.lon,
    rating: p.rating || 0,
    userRatingsTotal: p.userRatingsTotal || 0,
    cuisine: (p as any).cuisine || 'Local',
    priceLevel: p.priceLevel || 0,
    distanceKm: p.distanceKm || 0,
    provider: p.provider || 'Google',
    imageUrl: p.imageUrl || '',
    mealType: (p as any).mealType || 'any',
    foodMatch: 50,
    isSelected: true,
  };
}

function estimateVisitDuration(category: string, types: string[], name: string): number {
  const cat = category.toLowerCase();
  const nameLower = name.toLowerCase();
  if (/museum|gallery|aquarium/.test(nameLower)) return 120;
  if (/temple|church|mosque|shrine|gurudwara/.test(nameLower)) return 60;
  if (/fort|castle|palace|ruins|haveli/.test(nameLower)) return 90;
  if (/park|garden|nature/.test(nameLower)) return 75;
  if (/viewpoint|monument|memorial|statue/.test(nameLower)) return 45;
  if (/zoo|theme.park|water.park|amusement/.test(nameLower)) return 180;
  if (/beach/.test(nameLower)) return 120;
  if (/market|bazaar|shopping/.test(nameLower)) return 90;
  if (/lake|river|waterfall/.test(nameLower)) return 60;
  return 60;
}

function estimateEntryFee(types: string[], name: string): number {
  const nameLower = name.toLowerCase();
  if (/museum|gallery|aquarium|zoo|theme.park|water.park/.test(nameLower)) return 300;
  if (/fort|castle|palace|ruins|unesco/.test(nameLower)) return 200;
  if (/temple|church|mosque|shrine/.test(nameLower)) return 0;
  if (/park|garden|nature|beach|lake/.test(nameLower)) return 50;
  if (/viewpoint|monument|memorial|statue/.test(nameLower)) return 100;
  return 0;
}

function getTierLabel(priceLevel: number): string {
  if (priceLevel <= 1) return 'Budget';
  if (priceLevel === 2) return 'Mid-Range';
  if (priceLevel === 3) return 'Premium';
  if (priceLevel >= 4) return 'Luxury';
  return 'Mid-Range';
}

// ─── POST Handler ───────────────────────────────────────────────────

export const POST = withSecurity(
  {
    rateLimit: { limit: 10, windowSeconds: 60 },
    requireAuth: true,
  },
  async (request: Request) => {
    try {
      clearPipelineLogs();
      const rawBody = await request.json();

      // ── Step 1: Validate inputs ──
      const validation = validateAnalyzeInput(rawBody);
      if (!validation.ok) {
        return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
      }
      const prefs = validation.data;

      // Calculate duration
      let duration = prefs.duration.days;
      if (!duration && prefs.tripDates.start && prefs.tripDates.end) {
        duration = Math.max(1, Math.ceil(
          (new Date(prefs.tripDates.end).getTime() - new Date(prefs.tripDates.start).getTime()) / 86400000
        ));
      }
      if (!duration) duration = 3; // Default

      // ── Step 2: Geocode destination ──
      const geo = await timedStage('GEOCODING', () => geocode(prefs.destination));
      if (!geo) {
        return NextResponse.json(
          { success: false, error: `Could not find "${prefs.destination}" on the map. Please check the spelling.` },
          { status: 422 }
        );
      }

      // ── Step 3: Parallel data fetching ──
      const [places, weather, forecast, wiki, heroImage, transport] = await Promise.all([
        timedStage('POI_DISCOVERY', () => discoverPlaces(geo.lat, geo.lon, duration, prefs.destination)),
        timedStage('WEATHER', () => getWeather(geo.lat, geo.lon)),
        timedStage('FORECAST', () => getForecast(
          geo.lat, geo.lon,
          prefs.tripDates.start || new Date().toISOString().split('T')[0],
          prefs.tripDates.end || new Date(Date.now() + duration * 86400000).toISOString().split('T')[0]
        )),
        timedStage('WIKI', () => getWikiContext(prefs.destination, geo.lat, geo.lon)),
        timedStage('IMAGE', () => getDestinationImage(prefs.destination)),
        timedStage('TRANSPORT', () => discoverTransport(
          prefs.source, geo.lat, geo.lon, prefs.destination,
          [], // Transport nodes will be populated after places
          prefs.hasTransport ? prefs.transportDetails : null
        )),
      ]);

      // ── Step 4: Build Traveler DNA ──
      const totalMembers = prefs.members.adults + prefs.members.children + prefs.members.seniors;
      const dna = await timedStage('TRAVELER_DNA', async () => buildTravelerDNA({
        travelType: prefs.travelType,
        foodPreference: prefs.foodPreference[0] || 'veg',
        interests: prefs.interests,
        budget: prefs.budget,
        duration,
        hotelPreference: prefs.hotelPreference[0] || 'comfortable',
        travelers: { adults: prefs.members.adults, children: prefs.members.children, seniors: prefs.members.seniors },
        travelStyle: prefs.travelType,
        travelSpeed: prefs.pace,
      }));

      // ── Step 5: Rank places using DNA ──
      const hotelBudgetPerNight = Math.floor((prefs.budget * 0.4) / Math.max(duration - 1, 1));
      const rankedHotelsRaw = rankHotels(places.hotels, dna, hotelBudgetPerNight) as Place[];
      const rankedRestaurantsRaw = rankRestaurants(places.restaurants, dna) as Place[];
      const rankedAttractionsRaw = rankAttractions(
        places.attractions, dna,
        weather ? { temperature: weather.temperature, rainProbability: weather.rainProbability } : null
      ) as Place[];

      // Convert to ranked types
      const rankedAttractions = rankedAttractionsRaw.map((p, i) => toRankedAttraction(p, i));
      const rankedHotels = rankedHotelsRaw.map(p => toRankedHotel(p, prefs.budget, duration, prefs.destination));
      const rankedRestaurants = rankedRestaurantsRaw.map(p => toRankedRestaurant(p));

      // Mark first hotel as selected
      if (rankedHotels.length > 0) rankedHotels[0].isSelected = true;

      // ── Step 6: Must-Visit Validation ──
      const mustVisitResults = prefs.mustVisit.length > 0
        ? await timedStage('MUST_VISIT', () => validateMustVisitPlaces(
            prefs.mustVisit,
            { lat: geo.lat, lon: geo.lon, name: prefs.destination },
            duration,
            prefs.budget,
            prefs.budgetMode
          ))
        : [];

      // ── Step 7: Geo-Clustering ──
      const walkTolerance = 'medium'; // Map from pace
      const clusters = await timedStage('CLUSTERING', async () => clusterByProximity(
        rankedAttractionsRaw.slice(0, 30),
        duration,
        walkTolerance
      ));

      // Build travel clusters with names
      const travelClusters: TravelCluster[] = clusters.map((c: any, i: number) => ({
        id: `cluster_${i}`,
        name: c.places.length > 0 ? `${c.places[0].name} Area` : `Cluster ${i + 1}`,
        centroid: c.centroid,
        attractions: c.places.map((p: Place, j: number) => toRankedAttraction(p, j)),
        totalWalkingKm: c.totalWalkingKm || 0,
        suggestedOrder: c.suggestedOrder || c.places.map((p: Place) => p.name),
        expansionType: (c.totalWalkingKm || 0) > 100 ? 'full_day_excursion' : 'local' as any,
      }));

      // Assign cluster IDs to attractions
      for (const cluster of travelClusters) {
        for (const attr of cluster.attractions) {
          const mainAttr = rankedAttractions.find(a => a.id === attr.id);
          if (mainAttr) mainAttr.clusterId = cluster.id;
        }
      }

      // ── Step 8: Hidden Gems & Recommendations ──
      const hiddenGems = await timedStage('HIDDEN_GEMS', async () => discoverHiddenGems(rankedAttractionsRaw));
      
      const recommendations: AIRecommendation[] = hiddenGems.slice(0, 5).map((gem: any) => ({
        name: gem.name,
        reason: `A hidden gem with a uniqueness score of ${gem.score}. ${gem.isGem ? 'Few tourists know about this place.' : 'Highly rated by explorers.'}`,
        type: 'hidden_gem' as const,
        distanceKm: gem.distanceKm || 0,
        estimatedDuration: '1-2 hours',
        imageUrl: gem.imageUrl || '',
        isAccepted: false,
      }));

      // ── Step 9: Budget Analysis ──
      const budgetBreakdown = await timedStage('BUDGET', async () => calculateBudget(
        prefs.budget,
        duration,
        { adults: prefs.members.adults, children: prefs.members.children, seniors: prefs.members.seniors },
        prefs.hotelPreference[0]?.toLowerCase() || 'comfortable',
        transport.estimatedFare,
        prefs.travelType,
        rankedHotels.find((h: any) => h.isSelected)?.estimatedPricePerNight || 3000,
        prefs.budgetMode
      ));

      // ── Step 10: Generate Warnings ──
      const warnings: TripWarning[] = [];

      // Places warnings
      for (const w of places.warnings) {
        warnings.push({
          type: 'availability',
          severity: 'warning',
          title: 'Data Availability',
          message: w,
        });
      }

      // Budget warnings
      if (budgetBreakdown.budgetHealthScore < 40) {
        warnings.push({
          type: 'budget',
          severity: 'critical',
          title: 'Budget Alert',
          message: `Your planned expenses significantly exceed your budget. Consider increasing your budget or choosing a more economical option.`,
          suggestion: budgetBreakdown.savingsTips[0],
        });
      } else if (budgetBreakdown.budgetHealthScore < 70) {
        warnings.push({
          type: 'budget',
          severity: 'warning',
          title: 'Budget Tight',
          message: `Your budget is tight. You may want to adjust some preferences.`,
          suggestion: budgetBreakdown.savingsTips[0],
        });
      }

      // Weather warnings
      for (const day of forecast) {
        if (!day.isOutdoorSafe) {
          warnings.push({
            type: 'weather',
            severity: 'warning',
            title: `Weather Alert — Day ${day.day}`,
            message: day.warnings.join('. '),
            affectedDay: day.day,
            suggestion: `Consider indoor activities: ${day.indoorAlternatives.join(', ')}`,
          });
        }
      }

      // Must-visit warnings
      for (const mv of mustVisitResults) {
        if (mv.feasibility === 'needs_full_day') {
          warnings.push({
            type: 'distance',
            severity: 'warning',
            title: `${mv.name} — Full Day Required`,
            message: mv.explanation,
            suggestion: `Dedicate Day ${mv.recommendedDay} entirely to this visit.`,
          });
        } else if (mv.feasibility === 'not_recommended') {
          warnings.push({
            type: 'distance',
            severity: 'critical',
            title: `${mv.name} — Very Far`,
            message: mv.explanation,
            suggestion: `Consider removing this from the itinerary or extending your trip.`,
          });
        }
      }

      // ── Step 11: Build Map Data ──
      const markers: MapMarker[] = [
        ...rankedHotels.slice(0, 3).map((h, i) => ({
          id: `h${i}`, name: h.name, type: 'hotel' as const,
          lat: h.lat, lon: h.lon, badge: '🏨 Stay',
        })),
        ...rankedAttractions.slice(0, 15).map((a, i) => ({
          id: `a${i}`, name: a.name, type: 'attraction' as const,
          lat: a.lat, lon: a.lon, badge: '📍 Visit',
          clusterName: travelClusters.find(c => c.id === a.clusterId)?.name,
        })),
        ...rankedRestaurants.slice(0, 6).map((r, i) => ({
          id: `r${i}`, name: r.name, type: 'restaurant' as const,
          lat: r.lat, lon: r.lon, badge: '🍽️ Dine',
        })),
        ...places.transportNodes.slice(0, 3).map((t, i) => ({
          id: `t${i}`, name: t.name, type: 'transport' as const,
          lat: t.lat, lon: t.lon, badge: '🚉 Transit',
        })),
      ];

      // Must-visit markers
      for (const mv of mustVisitResults) {
        if (mv.coordinates) {
          markers.push({
            id: `mv_${mv.name}`, name: mv.name, type: 'must_visit',
            lat: mv.coordinates.lat, lon: mv.coordinates.lon, badge: '⭐ Must Visit',
          });
        }
      }

      // ── Step 12: Build Emergency Data ──
      const emergency = {
        hospital: places.hospitals.length > 0
          ? { name: places.hospitals[0].name, lat: places.hospitals[0].lat, lon: places.hospitals[0].lon, distanceKm: places.hospitals[0].distanceKm || 0 }
          : null,
        police: places.police.length > 0
          ? { name: places.police[0].name, lat: places.police[0].lat, lon: places.police[0].lon, distanceKm: places.police[0].distanceKm || 0 }
          : null,
        helplines: { police: '112', ambulance: '102', fire: '101', tourist: '1363' },
      };

      // ── Step 13: Build Destination Intelligence ──
      const destinationIntelligence: DestinationIntelligenceData = {
        primaryHub: {
          name: prefs.destination,
          type: 'primary',
          coordinates: { lat: geo.lat, lon: geo.lon },
          recommendedNights: Math.max(duration - 1, 1),
          nearbyAttractions: rankedAttractions.slice(0, 5).map(a => a.name),
          distanceFromPrimary: 0,
          travelTimeFromPrimary: 0,
        },
        secondaryHubs: [],
        excursions: mustVisitResults
          .filter(mv => mv.feasibility === 'needs_full_day' && mv.coordinates)
          .map(mv => ({
            name: mv.name,
            type: 'excursion' as const,
            coordinates: mv.coordinates!,
            recommendedNights: 0,
            nearbyAttractions: [],
            distanceFromPrimary: mv.distanceFromHub,
            travelTimeFromPrimary: mv.travelTimeHours,
          })),
        clusters: travelClusters,
        maxComfortableRadiusKm: prefs.pace === 'slow' ? 30 : prefs.pace === 'balanced' ? 100 : 250,
        suggestedRoute: travelClusters.map(c => c.name),
      };

      // ── Step 14: Build Transport Analysis ──
      const transportAnalysis = {
        isBooked: prefs.hasTransport,
        bookedDetails: prefs.transport,
        suggestedMode: transport.suggestedMode,
        distanceKm: transport.distanceKm,
        durationHours: transport.durationHours,
        originHub: transport.originHub,
        destinationHub: transport.destinationHub || places.transportNodes[0]?.name || prefs.destination,
        nearestAirport: transport.nearestAirport,
        nearestRailway: transport.nearestRailway,
        nearestBusTerminal: transport.nearestBusStand || null,
        options: [],
        journeyLegs: transport.journeyLegs,
        estimatedFare: transport.estimatedFare,
      };

      // ── Step 15: Assemble Blueprint ──
      const blueprint: TripBlueprint = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        userPreferences: prefs,
        destination: destinationIntelligence,
        attractions: rankedAttractions,
        hotels: rankedHotels,
        restaurants: rankedRestaurants,
        transport: transportAnalysis,
        weather: forecast,
        mustVisitValidation: mustVisitResults,
        budgetPreview: {
          totalBudget: prefs.budget,
          budgetMode: prefs.budgetMode,
          breakdown: budgetBreakdown,
          totalPlanned: budgetBreakdown.planned,
          remaining: budgetBreakdown.remaining,
          healthScore: budgetBreakdown.budgetHealthScore,
          healthStatus: budgetBreakdown.budgetHealthScore >= 70 ? 'within_budget'
            : budgetBreakdown.budgetHealthScore >= 40 ? 'slightly_above'
            : 'exceeds_budget',
          warnings: budgetBreakdown.budgetHealthScore < 70
            ? [`Budget utilization is ${100 - budgetBreakdown.budgetHealthScore}%`]
            : [],
          savingsTips: budgetBreakdown.savingsTips,
        },
        clusters: travelClusters,
        mapData: {
          centerLat: geo.lat,
          centerLon: geo.lon,
          markers,
          clusterBoundaries: travelClusters.map(c => ({
            id: c.id,
            name: c.name,
            centroid: c.centroid,
            radiusKm: c.totalWalkingKm || 5,
          })),
          suggestedRoutes: [],
        },
        recommendations,
        warnings,
        emergency,
        wikiExtract: wiki?.extract || null,
        heroImage: heroImage || wiki?.thumbnail || null,
      };

      return NextResponse.json({
        success: true,
        blueprint,
      });

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error during trip analysis';
      console.error('Trip analysis error:', message);
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }
);
