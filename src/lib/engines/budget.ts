// ─── Budget Allocation Engine ───────────────────────────────────────
// Computes budget breakdown based on comfort level, travelers, and trip type
// Enforces Budget Mode: strict, balanced, relaxed

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

function effectiveTravelerCount(travelers: { adults: number; children: number; seniors: number }): number {
  return travelers.adults + (travelers.children * 0.5) + (travelers.seniors * 0.8);
}

function totalHeadcount(travelers: { adults: number; children: number; seniors: number }): number {
  return travelers.adults + travelers.children + travelers.seniors;
}

function computeHealthScore(totalBudget: number, remaining: number): number {
  if (totalBudget <= 0) return 0;
  const ratio = remaining / totalBudget;
  if (ratio >= 0.10) return 100;
  if (ratio <= 0) return 0;
  return Math.round((ratio / 0.10) * 100);
}

export function calculateBudget(
  totalBudget: number,
  duration: number,
  travelers: { adults: number; children: number; seniors: number },
  comfortLevel: string,
  transportFare: number,
  travelType: string,
  hotelCostPerNight: number = 3000,
  budgetMode: string = 'balanced'
): BudgetBreakdown {
  const safeDuration = Math.max(1, duration);
  const nights = Math.max(0, safeDuration - 1);
  const comfortKey = comfortLevel.toLowerCase().trim();
  const effectiveCount = effectiveTravelerCount(travelers);
  const heads = totalHeadcount(travelers);

  // BASE ALLOCATION
  let intercityTotal = transportFare * heads;
  
  const roomMultiplier = (travelType === 'couple' || travelType === 'honeymoon')
    ? Math.ceil(heads / 2)
    : (travelType === 'family')
      ? Math.max(1, Math.ceil(heads / 3))
      : Math.max(1, Math.ceil(heads / 2));

  let accommodationTotal = nights * hotelCostPerNight * roomMultiplier;

  // Food costs based on real world estimates per comfort level
  const baseMealCost = comfortKey === 'budget' ? 200 : comfortKey === 'luxury' ? 1200 : 500;
  let foodPerDay = baseMealCost * 3 * effectiveCount; 
  let foodTotal = foodPerDay * safeDuration;

  // Activities cost
  const baseActivityCost = comfortKey === 'budget' ? 300 : comfortKey === 'luxury' ? 2500 : 800;
  let activitiesPerDay = baseActivityCost * effectiveCount;
  let activitiesTotal = activitiesPerDay * safeDuration;

  let localTransport = (transportFare * 0.2) * heads * safeDuration; 

  let shoppingPool = totalBudget * 0.05;
  let bufferPool = totalBudget * 0.05;

  let planned = intercityTotal + localTransport + accommodationTotal + foodTotal + activitiesTotal + shoppingPool + bufferPool;
  let remaining = totalBudget - planned;

  // BUDGET MODE ENFORCEMENT
  if (remaining < 0 && budgetMode === 'strict') {
    // If strict, we MUST make it fit. Reduce non-essentials first.
    const deficit = -remaining;
    
    // Reduce shopping to 0 if needed
    if (deficit > 0) {
      const reduction = Math.min(shoppingPool, deficit);
      shoppingPool -= reduction;
      planned -= reduction;
    }
    
    // Reduce buffer by up to 80% if needed
    const currentDeficit2 = planned - totalBudget;
    if (currentDeficit2 > 0) {
       const reduction = Math.min(bufferPool * 0.8, currentDeficit2);
       bufferPool -= reduction;
       planned -= reduction;
    }

    // Reduce activities by up to 50% if needed
    const currentDeficit3 = planned - totalBudget;
    if (currentDeficit3 > 0) {
       const reduction = Math.min(activitiesTotal * 0.5, currentDeficit3);
       activitiesTotal -= reduction;
       activitiesPerDay = activitiesTotal / safeDuration;
       planned -= reduction;
    }

    // Reduce food by up to 30% if needed
    const currentDeficit4 = planned - totalBudget;
    if (currentDeficit4 > 0) {
       const reduction = Math.min(foodTotal * 0.3, currentDeficit4);
       foodTotal -= reduction;
       foodPerDay = foodTotal / safeDuration;
       planned -= reduction;
    }

    // If still deficit, just log warning. We can't reduce fixed costs like transport.
    remaining = totalBudget - planned;
  }

  const healthScore = computeHealthScore(totalBudget, remaining);

  const savingsTips = [
    'Compare prices across multiple booking platforms before reserving',
    'Carry a refillable water bottle to avoid buying bottled water at tourist spots',
    'Plan a flexible itinerary to take advantage of last-minute deals'
  ];

  return {
    transport: {
      intercity: Math.round(intercityTotal),
      local: Math.round(localTransport),
      total: Math.round(intercityTotal + localTransport),
    },
    accommodation: {
      perNight: Math.round(accommodationTotal / Math.max(nights, 1)),
      total: Math.round(accommodationTotal),
      nights,
    },
    food: {
      perDay: Math.round(foodPerDay),
      total: Math.round(foodTotal),
      breakdown: {
        breakfast: Math.round(foodPerDay * 0.2),
        lunch: Math.round(foodPerDay * 0.4),
        dinner: Math.round(foodPerDay * 0.3),
        snacks: Math.round(foodPerDay * 0.1),
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
