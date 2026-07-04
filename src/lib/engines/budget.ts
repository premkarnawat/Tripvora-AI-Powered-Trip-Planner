// ─── Budget Allocation Engine ───────────────────────────────────────
// Computes budget breakdown based on comfort level, travelers, and trip type

export interface BudgetBreakdown {
  transport: { intercity: number; local: number; total: number };
  accommodation: { perNight: number; total: number; nights: number };
  food: { perDay: number; total: number; breakdown: { breakfast: number; lunch: number; dinner: number; snacks: number } };
  activities: { perDay: number; total: number };
  shopping: number;
  buffer: number;
  planned: number;
  remaining: number;
  budgetHealthScore: number;
  savingsTips: string[];
}

// ─── Allocation ratios by comfort level ─────────────────────────────

interface AllocationRatio {
  transport: number;
  hotel: number;
  food: number;
  activities: number;
  shopping: number;
  buffer: number;
}

const ALLOCATION_RATIOS: Record<string, AllocationRatio> = {
  budget: { transport: 0.25, hotel: 0.25, food: 0.25, activities: 0.15, shopping: 0.05, buffer: 0.05 },
  value: { transport: 0.20, hotel: 0.30, food: 0.25, activities: 0.15, shopping: 0.05, buffer: 0.05 },
  comfortable: { transport: 0.15, hotel: 0.35, food: 0.25, activities: 0.15, shopping: 0.05, buffer: 0.05 },
  premium: { transport: 0.10, hotel: 0.40, food: 0.25, activities: 0.15, shopping: 0.05, buffer: 0.05 },
  luxury: { transport: 0.10, hotel: 0.45, food: 0.20, activities: 0.15, shopping: 0.05, buffer: 0.05 },
};

// ─── Cost multiplier by traveler type ───────────────────────────────

function effectiveTravelerCount(travelers: { adults: number; children: number; seniors: number }): number {
  // Children cost 50% of adult rate, seniors cost 80%
  return travelers.adults + (travelers.children * 0.5) + (travelers.seniors * 0.8);
}

function totalHeadcount(travelers: { adults: number; children: number; seniors: number }): number {
  return travelers.adults + travelers.children + travelers.seniors;
}

// ─── Savings tips generator ─────────────────────────────────────────

function generateSavingsTips(comfortLevel: string, travelType: string, duration: number, travelers: { adults: number; children: number; seniors: number }): string[] {
  const tips: string[] = [];

  // Comfort-level specific tips
  switch (comfortLevel) {
    case 'budget':
      tips.push('Stay in hostels or homestays instead of hotels to save 40-60% on accommodation');
      tips.push('Eat at local street food stalls and dhabas — authentic taste at a fraction of the price');
      tips.push('Use public buses and shared autos instead of private cabs');
      break;
    case 'value':
      tips.push('Book accommodation with breakfast included to save on one meal per day');
      tips.push('Use train travel for intercity journeys — cheaper and scenic compared to flights');
      tips.push('Visit free attractions like public parks, temples, and markets');
      break;
    case 'comfortable':
      tips.push('Book hotels in advance online for 15-30% early-bird discounts');
      tips.push('Opt for combo meal deals at restaurants instead of ordering à la carte');
      tips.push('Purchase city passes or combo tickets for multiple attractions');
      break;
    case 'premium':
      tips.push('Use credit card travel rewards and loyalty points for hotel upgrades');
      tips.push('Book flights during off-peak hours for lower fares');
      tips.push('Consider serviced apartments for stays longer than 3 nights — cheaper than premium hotels');
      break;
    case 'luxury':
      tips.push('Leverage hotel loyalty programs for complimentary upgrades and late checkout');
      tips.push('Book luxury experiences through concierge services for bundled discounts');
      tips.push('Travel during shoulder season for luxury properties at 20-40% lower rates');
      break;
    default:
      tips.push('Compare prices across multiple booking platforms before reserving');
      tips.push('Carry a refillable water bottle to avoid buying bottled water at tourist spots');
      tips.push('Plan a flexible itinerary to take advantage of last-minute deals');
  }

  // Travel-type specific tips
  if (travelType === 'family' || travelType === 'senior') {
    tips.push('Look for family/group discounts at attractions — many offer 20-30% off for groups of 4+');
  }
  if (travelType === 'bachelor' || travelType === 'friends') {
    tips.push('Split accommodation costs by booking shared rooms or apartments with multiple bedrooms');
  }
  if (travelType === 'couple' || travelType === 'honeymoon') {
    tips.push('Ask hotels about honeymoon or couples packages — often includes free meals or spa credits');
  }
  if (travelType === 'solo') {
    tips.push('Consider couchsurfing or shared dorms to dramatically reduce accommodation costs');
  }

  // Duration tips
  if (duration >= 5) {
    tips.push('For longer trips, do laundry mid-trip instead of packing extra clothes — saves luggage fees');
  }

  // Traveler count tips
  if (totalHeadcount(travelers) >= 4) {
    tips.push('Rent a single vehicle for the group instead of individual transport — saves up to 50%');
  }

  // Return 3-5 tips
  return tips.slice(0, 5);
}

// ─── Budget health score ────────────────────────────────────────────

function computeHealthScore(totalBudget: number, remaining: number): number {
  if (totalBudget <= 0) return 0;
  const ratio = remaining / totalBudget;
  if (ratio >= 0.10) return 100;
  if (ratio <= 0) return 0;
  // Linear scale from 0 to 100 as ratio goes from 0 to 0.10
  return Math.round((ratio / 0.10) * 100);
}

// ─── Main Export ────────────────────────────────────────────────────

export function calculateBudget(
  totalBudget: number,
  duration: number,
  travelers: { adults: number; children: number; seniors: number },
  comfortLevel: string,
  transportFare: number,
  travelType: string
): BudgetBreakdown {
  const safeDuration = Math.max(1, duration);
  const nights = Math.max(0, safeDuration - 1);
  const comfortKey = comfortLevel.toLowerCase().trim();
  const ratios = ALLOCATION_RATIOS[comfortKey] ?? ALLOCATION_RATIOS.comfortable;
  const effectiveCount = effectiveTravelerCount(travelers);
  const heads = totalHeadcount(travelers);

  // ── Allocate total budget into categories ───────────────────────
  const transportPool = totalBudget * ratios.transport;
  const hotelPool = totalBudget * ratios.hotel;
  const foodPool = totalBudget * ratios.food;
  const activitiesPool = totalBudget * ratios.activities;
  const shoppingPool = totalBudget * ratios.shopping;
  const bufferPool = totalBudget * ratios.buffer;

  // ── Transport: intercity fare is given, local is remainder ──────
  const intercityTotal = transportFare * heads;
  const localTransport = Math.max(0, transportPool - intercityTotal);
  const transportTotal = intercityTotal + localTransport;

  // ── Accommodation ──────────────────────────────────────────────
  // Rooms needed: couples share, families share, solos individual
  const roomMultiplier = (travelType === 'couple' || travelType === 'honeymoon')
    ? Math.ceil(heads / 2)
    : (travelType === 'family')
      ? Math.max(1, Math.ceil(heads / 3))
      : (travelType === 'friends' || travelType === 'bachelor')
        ? Math.max(1, Math.ceil(heads / 2))
        : Math.max(1, Math.ceil(heads / 2));

  const perNightTotal = nights > 0 ? hotelPool / nights : 0;
  const perNightPerRoom = roomMultiplier > 0 ? perNightTotal / roomMultiplier : perNightTotal;
  const accommodationTotal = nights > 0 ? perNightPerRoom * roomMultiplier * nights : 0;

  // ── Food ───────────────────────────────────────────────────────
  const foodPerDay = safeDuration > 0 ? foodPool / safeDuration : 0;
  const foodPerDayPerPerson = effectiveCount > 0 ? foodPerDay / effectiveCount : foodPerDay;

  // Breakdown per person per day
  const breakfastPerPerson = foodPerDayPerPerson * 0.20;
  const lunchPerPerson = foodPerDayPerPerson * 0.35;
  const dinnerPerPerson = foodPerDayPerPerson * 0.35;
  const snacksPerPerson = foodPerDayPerPerson * 0.10;

  const foodTotal = foodPerDay * safeDuration;

  // ── Activities ─────────────────────────────────────────────────
  const activitiesPerDay = safeDuration > 0 ? activitiesPool / safeDuration : 0;
  const activitiesTotal = activitiesPerDay * safeDuration;

  // ── Totals ─────────────────────────────────────────────────────
  const planned = transportTotal + accommodationTotal + foodTotal + activitiesTotal + shoppingPool + bufferPool;
  const remaining = totalBudget - planned;
  const healthScore = computeHealthScore(totalBudget, remaining);

  // ── Savings tips ───────────────────────────────────────────────
  const savingsTips = generateSavingsTips(comfortKey, travelType.toLowerCase().trim(), safeDuration, travelers);

  return {
    transport: {
      intercity: Math.round(intercityTotal),
      local: Math.round(localTransport),
      total: Math.round(transportTotal),
    },
    accommodation: {
      perNight: Math.round(perNightPerRoom),
      total: Math.round(accommodationTotal),
      nights,
    },
    food: {
      perDay: Math.round(foodPerDay),
      total: Math.round(foodTotal),
      breakdown: {
        breakfast: Math.round(breakfastPerPerson * effectiveCount),
        lunch: Math.round(lunchPerPerson * effectiveCount),
        dinner: Math.round(dinnerPerPerson * effectiveCount),
        snacks: Math.round(snacksPerPerson * effectiveCount),
      },
    },
    activities: {
      perDay: Math.round(activitiesPerDay),
      total: Math.round(activitiesTotal),
    },
    shopping: Math.round(shoppingPool),
    buffer: Math.round(bufferPool),
    planned: Math.round(planned),
    remaining: Math.round(remaining),
    budgetHealthScore: healthScore,
    savingsTips,
  };
}
