/**
 * Must-Visit Priority Engine
 * 
 * Validates every user-requested must-visit place and determines feasibility.
 * NEVER silently removes a must-visit place — always explains the decision.
 * 
 * Smart Expansion Rules:
 * 0–30 km   → Local sightseeing (included)
 * 30–100 km → Half-day excursion (included with note)
 * 100–250 km → Full-day excursion (needs_full_day)
 * 250–450 km → Secondary hub (needs_extra_day)
 * 450+ km   → Not recommended for this trip
 */

import { MustVisitResult } from '@/lib/types/blueprint';
import { geocode } from './geocoder';

// ─── Haversine Distance ─────────────────────────────────────────────

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Visit Duration Estimator ───────────────────────────────────────

function estimateVisitDuration(name: string): number {
  const n = name.toLowerCase();
  if (/temple|church|mosque|shrine|gurudwara|mandir|masjid/.test(n)) return 60;
  if (/fort|castle|palace|haveli|ruins/.test(n)) return 120;
  if (/museum|gallery|aquarium/.test(n)) return 120;
  if (/beach|lake|river|waterfall/.test(n)) return 120;
  if (/park|garden|nature|forest|sanctuary/.test(n)) return 90;
  if (/statue|monument|memorial/.test(n)) return 60;
  if (/zoo|theme.park|water.park|amusement|world/.test(n)) return 240;
  if (/market|bazaar|shopping/.test(n)) return 90;
  if (/dam|reservoir/.test(n)) return 60;
  if (/hill|mountain|trek|valley/.test(n)) return 180;
  if (/cave|rock/.test(n)) return 90;
  return 90;
}

// ─── Feasibility Classifier ────────────────────────────────────────

function classifyFeasibility(
  distanceKm: number,
  travelTimeHours: number,
  tripDuration: number,
): 'included' | 'needs_full_day' | 'needs_extra_day' | 'not_recommended' {
  if (distanceKm <= 30) return 'included';
  if (distanceKm <= 100) return 'included'; // half-day excursion, still fits
  if (distanceKm <= 250) return 'needs_full_day';
  if (distanceKm <= 450) {
    // Can fit if trip is long enough
    return tripDuration >= 5 ? 'needs_full_day' : 'needs_extra_day';
  }
  return 'not_recommended';
}

// ─── Explanation Generator ──────────────────────────────────────────

function generateExplanation(
  name: string,
  distanceKm: number,
  travelTimeHours: number,
  feasibility: string,
  tripDuration: number,
  recommendedDay: number,
): string {
  const distStr = distanceKm.toFixed(0);
  const timeStr = travelTimeHours < 1
    ? `${Math.round(travelTimeHours * 60)} minutes`
    : `${travelTimeHours.toFixed(1)} hours`;

  switch (feasibility) {
    case 'included':
      if (distanceKm <= 30) {
        return `${name} is ${distStr} km from the city center. It fits perfectly within your Day ${recommendedDay} itinerary with approximately ${timeStr} of travel.`;
      }
      return `${name} is a ${distStr} km excursion requiring approximately ${timeStr} of travel each way. It can be combined with nearby attractions on Day ${recommendedDay}.`;

    case 'needs_full_day':
      return `${name} is ${distStr} km away, requiring approximately ${timeStr} of travel each way. This is a full-day excursion. We recommend dedicating Day ${recommendedDay} entirely to this visit, including travel time and exploration.`;

    case 'needs_extra_day':
      return `${name} is ${distStr} km from your destination, requiring approximately ${timeStr} of travel each way. At this distance, fitting it into your ${tripDuration}-day trip would be very tight. Consider extending your trip by 1 day or removing this destination.`;

    case 'not_recommended':
      return `${name} is ${distStr} km away, requiring approximately ${timeStr} of travel each way. This distance is very challenging for your ${tripDuration}-day trip and would consume significant time and budget. We recommend saving this for a separate trip.`;

    default:
      return `${name} has been analyzed and placed on Day ${recommendedDay}.`;
  }
}

// ─── Budget Impact Calculator ───────────────────────────────────────

function estimateBudgetImpact(distanceKm: number, feasibility: string): number {
  // Transport cost: ~8 INR/km (round trip)
  const transportCost = Math.round(distanceKm * 8 * 2);
  
  // Entry fee estimate
  const entryFee = 200;
  
  // Food cost for excursion
  const foodCost = feasibility === 'needs_full_day' ? 800 : 
                   feasibility === 'needs_extra_day' ? 1500 : 300;
  
  return transportCost + entryFee + foodCost;
}

// ─── Day Recommender ────────────────────────────────────────────────

function recommendDay(
  preferredDay: string,
  feasibility: string,
  index: number,
  tripDuration: number,
): number {
  // User specified a preferred day
  if (preferredDay && preferredDay !== '' && preferredDay !== 'any') {
    const parsed = parseInt(preferredDay.replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= tripDuration) {
      return parsed;
    }
  }

  // For full-day excursions, use middle days to avoid arrival/departure conflicts
  if (feasibility === 'needs_full_day') {
    const middleDay = Math.floor(tripDuration / 2) + 1;
    return Math.min(middleDay + index, tripDuration);
  }

  // For included places, distribute across days
  return Math.min(index + 1, tripDuration);
}

// ─── Main Validation Function ───────────────────────────────────────

/**
 * Validates every user-requested must-visit place and determines feasibility.
 * 
 * @param mustVisitList - Array of user-specified must-visit places
 * @param primaryHub - The main destination coordinates
 * @param tripDuration - Total days of the trip
 * @param budget - Total trip budget
 * @param budgetMode - Budget enforcement mode
 * @returns Array of MustVisitResult with feasibility analysis
 */
export async function validateMustVisitPlaces(
  mustVisitList: Array<{ name: string; preferredDay: string; priority: string }>,
  primaryHub: { lat: number; lon: number; name: string },
  tripDuration: number,
  budget: number,
  budgetMode: string,
): Promise<MustVisitResult[]> {
  const results: MustVisitResult[] = [];

  for (let i = 0; i < mustVisitList.length; i++) {
    const mv = mustVisitList[i];

    try {
      // Geocode the must-visit place
      const geo = await geocode(mv.name);

      if (!geo) {
        // Geocoding failed — still include with warning
        results.push({
          name: mv.name,
          preferredDay: mv.preferredDay,
          priority: mv.priority,
          coordinates: null,
          distanceFromHub: 0,
          travelTimeHours: 0,
          openingHours: null,
          estimatedVisitDuration: estimateVisitDuration(mv.name),
          budgetImpact: 0,
          feasibility: 'included',
          recommendedDay: Math.min(i + 1, tripDuration),
          explanation: `We could not find the exact location of "${mv.name}" on the map. It has been included in your itinerary, but please verify the name and spelling. The itinerary will use approximate timing.`,
          isValidated: false,
        });
        continue;
      }

      // Calculate distance and travel time
      const distanceKm = haversineKm(
        primaryHub.lat, primaryHub.lon,
        geo.lat, geo.lon
      );
      
      // Average Indian road speed: ~40 km/h
      const travelTimeHours = distanceKm / 40;

      // Classify feasibility
      const feasibility = classifyFeasibility(distanceKm, travelTimeHours, tripDuration);

      // Recommend optimal day
      const recommendedDay = recommendDay(mv.preferredDay, feasibility, i, tripDuration);

      // Estimate budget impact
      const budgetImpact = estimateBudgetImpact(distanceKm, feasibility);

      // Generate explanation
      const explanation = generateExplanation(
        mv.name, distanceKm, travelTimeHours,
        feasibility, tripDuration, recommendedDay
      );

      results.push({
        name: mv.name,
        preferredDay: mv.preferredDay,
        priority: mv.priority,
        coordinates: { lat: geo.lat, lon: geo.lon },
        distanceFromHub: Math.round(distanceKm * 10) / 10,
        travelTimeHours: Math.round(travelTimeHours * 10) / 10,
        openingHours: null, // Will be fetched via Place Details in Stage 2
        estimatedVisitDuration: estimateVisitDuration(mv.name),
        budgetImpact,
        feasibility,
        recommendedDay,
        explanation,
        isValidated: true,
      });
    } catch (err) {
      // Error during validation — still include with warning
      results.push({
        name: mv.name,
        preferredDay: mv.preferredDay,
        priority: mv.priority,
        coordinates: null,
        distanceFromHub: 0,
        travelTimeHours: 0,
        openingHours: null,
        estimatedVisitDuration: estimateVisitDuration(mv.name),
        budgetImpact: 0,
        feasibility: 'included',
        recommendedDay: Math.min(i + 1, tripDuration),
        explanation: `An error occurred while validating "${mv.name}". It has been included in your itinerary with default timing. Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        isValidated: false,
      });
    }
  }

  return results;
}
