/**
 * TRIPVORA — Phase 2 API: Detailed Itinerary Generation
 * 
 * POST /api/trip/generate
 * 
 * Accepts the approved TripBlueprint (potentially modified by user)
 * and generates the detailed day-by-day schedule.
 * 
 * This route does NOT re-discover places or re-analyze the destination.
 * It uses the approved blueprint data to build the final itinerary.
 * 
 * Pipeline:
 * Blueprint → Place Details (Stage 2) → Schedule Builder → Activity Fill
 * → Budget Validation → Quality Validation → Narrative (Gemini) → Persist
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { withSecurity } from '@/lib/security/api-wrapper';
import { buildSchedule } from '@/lib/engines/schedule';
import { generateNarrative, AIContext } from '@/lib/engines/ai-generator';
import { batchFetchPlaceDetails } from '@/lib/engines/place-cache';
import { timedStage, clearPipelineLogs } from '@/lib/engines/logger';
import type {
  TripBlueprint,
  GeneratedItinerary,
  ItineraryDay,
  ItineraryActivity,
  RankedAttraction,
  RankedRestaurant,
} from '@/lib/types/blueprint';

export const maxDuration = 60;

// ─── Travel Pace Limits ─────────────────────────────────────────────

const PACE_LIMITS: Record<string, { min: number; max: number }> = {
  slow: { min: 3, max: 4 },
  balanced: { min: 4, max: 6 },
  explorer: { min: 6, max: 8 },
};

// ─── POST Handler ───────────────────────────────────────────────────

export const POST = withSecurity(
  {
    rateLimit: { limit: 5, windowSeconds: 60 },
    requireAuth: true,
  },
  async (request: Request) => {
    try {
      clearPipelineLogs();
      const { blueprint } = await request.json() as { blueprint: TripBlueprint };

      if (!blueprint || !blueprint.id) {
        return NextResponse.json({ success: false, error: 'Invalid blueprint' }, { status: 400 });
      }

      const prefs = blueprint.userPreferences;
      const duration = prefs.duration.days || blueprint.weather.length || 3;
      const pace = prefs.pace || 'balanced';
      const paceLimit = PACE_LIMITS[pace] || PACE_LIMITS.balanced;

      // ── Step 1: Get selected places from blueprint ──
      const selectedAttractions = blueprint.attractions.filter(a => a.isSelected);
      const selectedHotel = blueprint.hotels.find(h => h.isSelected || h.isUserBooked);
      const selectedRestaurants = blueprint.restaurants.filter(r => r.isSelected);

      // ── Step 2: Fetch Place Details for selected places (Stage 2 caching) ──
      // Only fetch details for places in the FINAL itinerary
      const placeIdsToFetch = [
        ...selectedAttractions.map(a => a.placeId).filter(id => !id.startsWith('wiki_')),
        ...selectedRestaurants.slice(0, duration * 3).map(r => r.placeId), // 3 meals per day
      ];

      const detailsMap = await timedStage('PLACE_DETAILS', () =>
        batchFetchPlaceDetails(placeIdsToFetch)
      );

      // Enrich attractions with opening hours from Place Details
      const enrichedAttractions = selectedAttractions.map(a => {
        const details = detailsMap.get(a.placeId);
        if (details) {
          return {
            ...a,
            openingHours: details.openingHours,
            phone: details.phone,
            website: details.website,
          };
        }
        return a;
      });

      // ── Step 3: Build day-by-day schedule ──
      // Convert to Place format for schedule builder
      const attractionsAsPlaces = enrichedAttractions.map(a => ({
        id: a.id,
        placeId: a.placeId,
        lat: a.lat,
        lon: a.lon,
        name: a.name,
        category: 'attraction' as const,
        distanceKm: a.distanceKm,
        rating: a.rating,
        userRatingsTotal: a.userRatingsTotal,
        types: a.types,
      }));

      const restaurantsAsPlaces = selectedRestaurants.map(r => ({
        id: r.id,
        placeId: r.placeId,
        lat: r.lat,
        lon: r.lon,
        name: r.name,
        category: 'restaurant' as const,
        cuisine: r.cuisine,
        distanceKm: r.distanceKm,
        rating: r.rating,
        userRatingsTotal: r.userRatingsTotal,
      }));

      const hotelAsPlace = selectedHotel ? {
        id: selectedHotel.id,
        placeId: selectedHotel.placeId,
        lat: selectedHotel.lat,
        lon: selectedHotel.lon,
        name: selectedHotel.name,
        category: 'hotel' as const,
        rating: selectedHotel.rating,
      } : null;

      // Build arrival datetime
      let arrivalDatetime = '';
      if (prefs.hasTransport && prefs.transport?.arrival) {
        arrivalDatetime = `${prefs.transport.arrival.date}T${prefs.transport.arrival.time}`;
      } else if (prefs.tripDates.start) {
        arrivalDatetime = `${prefs.tripDates.start}T09:00`;
      }

      const scheduleData = await timedStage('SCHEDULING', async () => buildSchedule(
        {
          attractions: attractionsAsPlaces,
          restaurants: restaurantsAsPlaces,
          hotels: hotelAsPlace ? [hotelAsPlace] : [],
        },
        duration,
        hotelAsPlace,
        prefs.travelType,
        pace,
        arrivalDatetime,
        { forecast: blueprint.weather }
      ));

      // ── Step 4: Build AI context for narrative ──
      const aiContext: AIContext = {
        origin: prefs.source,
        destination: prefs.destination,
        budget: prefs.budget,
        duration,
        travelType: prefs.travelType,
        travelers: {
          adults: prefs.members.adults,
          children: prefs.members.children,
          seniors: prefs.members.seniors,
        },
        arrivalMode: prefs.hasTransport && prefs.transport ? prefs.transport.type : 'Train',
        hotelPreference: prefs.hotelPreference[0] || 'Mid-range',
        foodPreference: prefs.foodPreference[0] || 'veg',
        interests: prefs.interests,
        tripPurpose: prefs.travelType,
        weather: blueprint.weather.length > 0
          ? {
              temperature: blueprint.weather[0].temperatureMax,
              description: blueprint.weather[0].description,
              rainProbability: blueprint.weather[0].rainProbability,
            }
          : null,
        wikiExtract: blueprint.wikiExtract || null,
        schedule: scheduleData.map(d => ({
          day: d.day,
          theme: d.theme,
          places: d.activities.filter(s => s.type === 'activity').map(s => s.title.replace(/^Visit /, '')),
        })),
      };

      // ── Step 5: Generate narrative via Gemini AI ──
      const narrative = await timedStage('NARRATIVE', () => generateNarrative(aiContext));

      // ── Step 6: Build itinerary days ──
      const itineraryDays: ItineraryDay[] = scheduleData.map((day, dayIdx) => {
        const dayWeather = blueprint.weather.find(w => w.day === day.day) || null;

        const activities: ItineraryActivity[] = day.activities.map((slot, slotIdx) => {
          let cleanTitle = slot.title;
          if (slot.type === 'activity') cleanTitle = slot.title.replace(/^Visit /, '');

          // Find the original ranked attraction/restaurant for this activity
          const matchedAttraction = enrichedAttractions.find(
            a => a.name.toLowerCase() === cleanTitle.toLowerCase()
          );

          return {
            time: slot.time,
            endTime: slot.endTime,
            title: slot.title,
            name: cleanTitle,
            type: slot.type as any,
            duration: slot.duration,
            description: narrative.placeDescriptions?.[cleanTitle] || slot.notes || '',
            category: slot.type,
            cost: slot.cost || matchedAttraction?.entryFee || 0,
            lat: slot.lat || matchedAttraction?.lat || 0,
            lon: slot.lon || matchedAttraction?.lon || 0,
            imageUrl: slot.imageUrl || matchedAttraction?.imageUrl || blueprint.heroImage || '',
            placeId: matchedAttraction?.placeId || null,
            openingHours: matchedAttraction?.openingHours
              ? matchedAttraction.openingHours.map(h => `${h.open}-${h.close}`).join(', ')
              : null,
            travelTimeFromPrevious: 0,
            distanceFromPrevious: 0,
            walkingDistance: slot.walkingDistance || '',
            aiTip: '',
          };
        });

        return {
          day: day.day,
          date: day.date,
          title: narrative.dayThemes?.[day.day] || day.theme,
          weather: dayWeather,
          activities,
          totalActiveHours: day.totalActiveHours,
          totalCost: activities.reduce((sum, a) => sum + a.cost, 0),
          totalDistanceKm: 0,
        };
      });

      // ── Step 7: Quality Validation ──
      const validationIssues: string[] = [];
      
      // Check pace limits
      for (const day of itineraryDays) {
        const activityCount = day.activities.filter(a => a.type === 'activity').length;
        if (activityCount > paceLimit.max) {
          validationIssues.push(`Day ${day.day} has ${activityCount} activities (max ${paceLimit.max} for ${pace} pace)`);
        }
      }

      // Check for repeated attractions
      const allAttractionNames = itineraryDays.flatMap(d => 
        d.activities.filter(a => a.type === 'activity').map(a => a.name)
      );
      const duplicates = allAttractionNames.filter((name, i) => allAttractionNames.indexOf(name) !== i);
      if (duplicates.length > 0) {
        validationIssues.push(`Repeated attractions found: ${[...new Set(duplicates)].join(', ')}`);
      }

      const qualityScore = Math.max(0, 100 - validationIssues.length * 15);

      // ── Step 8: Assemble final itinerary ──
      const itinerary: GeneratedItinerary = {
        id: crypto.randomUUID(),
        blueprintId: blueprint.id,
        createdAt: new Date().toISOString(),
        trip: {
          destination: prefs.destination,
          destinationSummary: blueprint.wikiExtract?.slice(0, 300) || `Explore ${prefs.destination}.`,
          heroImage: blueprint.heroImage || '',
          totalDays: duration,
          totalBudget: prefs.budget,
          currency: 'INR',
          tripOverview: narrative.tripOverview || '',
          packingSuggestions: narrative.packingSuggestions || [],
          safetyTips: narrative.safetyTips || [],
          localTravelAdvice: narrative.localTravelAdvice || '',
        },
        days: itineraryDays,
        transport: blueprint.transport,
        hotels: blueprint.hotels.filter(h => h.isSelected || h.isUserBooked),
        restaurants: blueprint.restaurants.filter(r => r.isSelected).slice(0, duration * 3),
        budget: blueprint.budgetPreview,
        weather: blueprint.weather,
        emergency: blueprint.emergency,
        mapData: blueprint.mapData,
        affiliateLinks: {},
        qualityScore,
        validationPassed: validationIssues.length === 0,
        validationIssues,
      };

      // ── Step 9: Database Persistence ──
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (supabaseUrl && supabaseAnon) {
          const cookieStore = await cookies();
          const supabase = createServerClient(supabaseUrl, supabaseAnon, {
            cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} },
          });

          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('trips').insert({
              user_id: user.id,
              destination: prefs.destination,
              trip_data: {
                title: `Trip to ${prefs.destination}`,
                source: prefs.source,
                destination: prefs.destination,
                trip_type: prefs.travelType,
                budget: prefs.budget,
                currency: 'INR',
                start_date: prefs.tripDates.start,
                end_date: prefs.tripDates.end,
                travelers: prefs.members.adults + prefs.members.children + prefs.members.seniors,
                itinerary,
              },
            });
          }
        }
      } catch (saveErr) {
        console.error('Failed to persist trip:', saveErr);
        // Don't fail the entire request - still return the itinerary
      }

      return NextResponse.json({
        success: true,
        itinerary,
        // Also return in legacy format for backward compatibility with /trips/[id] page
        ...itinerary,
      });

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error during generation';
      console.error('Itinerary generation error:', message);
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }
);
