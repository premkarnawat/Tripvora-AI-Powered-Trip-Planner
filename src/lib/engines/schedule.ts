// ─── Intelligent Time Scheduling Engine ─────────────────────────────
// Builds day-by-day itineraries from cluster + restaurant data

export interface ScheduleSlot {
  time: string;    // e.g. '09:30'
  endTime: string; // e.g. '11:00'
  title: string;
  type: 'travel' | 'meal' | 'activity' | 'rest' | 'hotel';
  duration: number; // minutes
  notes: string;
}

export interface DaySchedule {
  day: number;
  date: string;
  theme: string;
  slots: ScheduleSlot[];
  totalActiveHours: number;
}

// ─── Time utilities ─────────────────────────────────────────────────

function parseTime(t: string): number {
  const parts = t.split(':');
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function formatTime(mins: number): string {
  const clamped = Math.max(0, Math.min(mins, 1439)); // 23:59 max
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function addMinutes(time: string, mins: number): string {
  return formatTime(parseTime(time) + mins);
}

// ─── Pace config ────────────────────────────────────────────────────

const PACE_HOURS: Record<string, number> = {
  relaxed: 6,
  balanced: 8,
  explorer: 10,
  packed: 12,
};

// ─── Category-based duration estimates (minutes) ────────────────────

function estimateActivityDuration(category: string): number {
  const cat = category.toLowerCase();
  if (/museum|gallery|aquarium/.test(cat)) return 90;
  if (/temple|church|mosque|shrine|place_of_worship/.test(cat)) return 45;
  if (/fort|castle|palace|ruins/.test(cat)) return 75;
  if (/park|garden|nature/.test(cat)) return 60;
  if (/viewpoint|monument|memorial/.test(cat)) return 30;
  if (/zoo|theme_park|water_park/.test(cat)) return 120;
  if (/beach/.test(cat)) return 90;
  if (/market|bazaar|shopping/.test(cat)) return 60;
  return 60; // default
}

// ─── Theme generator from cluster content ───────────────────────────

function generateTheme(
  places: Array<{ name: string; category: string }>,
  dayNum: number,
  totalDays: number,
  isArrival: boolean,
  isDeparture: boolean
): string {
  if (isArrival && isDeparture) return 'Arrival, Explore & Departure';
  if (isArrival) return 'Arrival & Local Exploration';
  if (isDeparture) return 'Final Highlights & Departure';

  if (places.length === 0) {
    if (dayNum === Math.ceil(totalDays / 2)) return 'Leisure & Rest Day';
    return `Day ${dayNum} Exploration`;
  }

  // Analyze categories present
  const categories = places.map(p => p.category.toLowerCase());
  const hasHistoric = categories.some(c => /fort|castle|monument|ruins|historic|temple|church|mosque/.test(c));
  const hasNature = categories.some(c => /park|garden|beach|nature|viewpoint|peak|waterfall/.test(c));
  const hasMuseum = categories.some(c => /museum|gallery/.test(c));
  const hasAdventure = categories.some(c => /zoo|theme_park|water_park|aquarium/.test(c));
  const hasMarket = categories.some(c => /market|bazaar|shopping/.test(c));

  const parts: string[] = [];
  if (hasHistoric) parts.push('Heritage');
  if (hasNature) parts.push('Nature');
  if (hasMuseum) parts.push('Culture');
  if (hasAdventure) parts.push('Adventure');
  if (hasMarket) parts.push('Shopping');

  if (parts.length === 0) {
    // Use top place names
    const topNames = places.slice(0, 2).map(p => p.name);
    return topNames.join(' & ') || `Day ${dayNum} Exploration`;
  }

  return parts.slice(0, 3).join(' & ') + ' Day';
}

// ─── Meal slot insertion ────────────────────────────────────────────

interface MealWindow {
  name: string;
  earliest: number; // minutes from midnight
  latest: number;
  duration: number;
}

const MEAL_WINDOWS: MealWindow[] = [
  { name: 'Breakfast', earliest: 480, latest: 570, duration: 45 }, // 08:00-09:30
  { name: 'Lunch', earliest: 750, latest: 840, duration: 60 },    // 12:30-14:00
  { name: 'Dinner', earliest: 1170, latest: 1260, duration: 75 }, // 19:30-21:00
];

// ─── Check if travel type allows night activities ───────────────────

function allowsNightActivities(travelType: string): boolean {
  const t = travelType.toLowerCase().trim();
  return t === 'bachelor' || t === 'friends';
}

function needsRestBreaks(travelType: string): boolean {
  const t = travelType.toLowerCase().trim();
  return t === 'family' || t === 'senior';
}

// ─── Build a single day's schedule ──────────────────────────────────

function buildDaySlots(
  startMinutes: number,
  endMinutes: number,
  maxActiveMinutes: number,
  places: Array<{ name: string; category: string }>,
  restaurants: Array<{ name: string; cuisine?: string }>,
  hotelName: string,
  travelType: string,
  isArrival: boolean,
  isDeparture: boolean,
  transitDurationMinutes: number
): ScheduleSlot[] {
  const slots: ScheduleSlot[] = [];
  let cursor = startMinutes;
  let activeMinutes = 0;
  let activityIndex = 0;
  let restaurantIndex = 0;
  let lastRestAt = startMinutes;
  const insertRest = needsRestBreaks(travelType);
  const nightOk = allowsNightActivities(travelType);
  const activityCutoff = nightOk ? 1380 : 1200; // 23:00 or 20:00

  // Arrival transit slot
  if (isArrival && transitDurationMinutes > 0) {
    const transitMins = Math.min(transitDurationMinutes, endMinutes - cursor);
    slots.push({
      time: formatTime(cursor),
      endTime: formatTime(cursor + transitMins),
      title: 'Arrive & Travel to Hotel',
      type: 'travel',
      duration: transitMins,
      notes: `Transit to ${hotelName || 'accommodation'}`,
    });
    cursor += transitMins;
    activeMinutes += transitMins;

    // Check-in / freshen up
    if (cursor + 30 <= endMinutes) {
      const checkinDur = 30;
      slots.push({
        time: formatTime(cursor),
        endTime: formatTime(cursor + checkinDur),
        title: `Check-in at ${hotelName || 'Hotel'}`,
        type: 'hotel',
        duration: checkinDur,
        notes: 'Check-in, freshen up, and settle in',
      });
      cursor += checkinDur;
    }
  }

  // Helper: try to insert a meal if we're in the right window
  function tryInsertMeal(): boolean {
    for (const meal of MEAL_WINDOWS) {
      if (cursor >= meal.earliest && cursor <= meal.latest) {
        // Check if this meal is already inserted
        const alreadyHas = slots.some(s => s.title.startsWith(meal.name));
        if (alreadyHas) continue;

        const restaurant = restaurants[restaurantIndex % Math.max(1, restaurants.length)];
        const restaurantName = restaurant?.name;
        const cuisine = restaurant?.cuisine;

        const mealTitle = restaurantName
          ? `${meal.name} at ${restaurantName}`
          : meal.name;
        const mealNotes = cuisine
          ? `${cuisine} cuisine`
          : `${meal.name.toLowerCase()} break`;

        if (cursor + meal.duration <= endMinutes) {
          slots.push({
            time: formatTime(cursor),
            endTime: formatTime(cursor + meal.duration),
            title: mealTitle,
            type: 'meal',
            duration: meal.duration,
            notes: mealNotes,
          });
          cursor += meal.duration;
          restaurantIndex++;
          return true;
        }
      }
    }
    return false;
  }

  // Main scheduling loop
  while (cursor < endMinutes && activeMinutes < maxActiveMinutes) {
    // Check for departure transit
    if (isDeparture) {
      const departureBuffer = transitDurationMinutes + 60; // transit + buffer
      if (cursor + departureBuffer >= endMinutes) {
        break; // Reserve time for departure
      }
    }

    // Try to insert a meal
    if (tryInsertMeal()) continue;

    // Insert rest break if needed (every 180 minutes of activity)
    if (insertRest && (cursor - lastRestAt) >= 180 && cursor + 20 <= endMinutes) {
      slots.push({
        time: formatTime(cursor),
        endTime: formatTime(cursor + 20),
        title: 'Rest Break',
        type: 'rest',
        duration: 20,
        notes: 'Take a breather, hydrate, and relax',
      });
      cursor += 20;
      lastRestAt = cursor;
      continue;
    }

    // Check activity cutoff
    if (cursor >= activityCutoff) break;

    // Insert an activity
    if (activityIndex < places.length) {
      const place = places[activityIndex];
      const duration = estimateActivityDuration(place.category);
      const effectiveDuration = Math.min(duration, endMinutes - cursor, maxActiveMinutes - activeMinutes);

      if (effectiveDuration < 20) break; // Not enough time for meaningful activity

      // Travel time between activities (15 min walking/transit gap)
      if (activityIndex > 0 && cursor + 15 + effectiveDuration <= endMinutes) {
        slots.push({
          time: formatTime(cursor),
          endTime: formatTime(cursor + 15),
          title: `Travel to ${place.name}`,
          type: 'travel',
          duration: 15,
          notes: 'Walking or local transport',
        });
        cursor += 15;
        activeMinutes += 15;
      }

      slots.push({
        time: formatTime(cursor),
        endTime: formatTime(cursor + effectiveDuration),
        title: `Visit ${place.name}`,
        type: 'activity',
        duration: effectiveDuration,
        notes: `Explore ${place.name} (${place.category})`,
      });
      cursor += effectiveDuration;
      activeMinutes += effectiveDuration;
      activityIndex++;
    } else {
      // No more places, advance cursor to next meal or end
      const nextMealStart = MEAL_WINDOWS.find(m => m.earliest > cursor);
      if (nextMealStart && nextMealStart.earliest < endMinutes) {
        // Free time until next meal
        const freeTime = nextMealStart.earliest - cursor;
        if (freeTime >= 30) {
          slots.push({
            time: formatTime(cursor),
            endTime: formatTime(cursor + freeTime),
            title: 'Free Time',
            type: 'rest',
            duration: freeTime,
            notes: 'Explore the neighborhood, relax, or shop',
          });
        }
        cursor = nextMealStart.earliest;
      } else {
        break;
      }
    }
  }

  // Departure transit
  if (isDeparture && transitDurationMinutes > 0) {
    const prepDuration = 30;
    if (cursor + prepDuration + transitDurationMinutes <= endMinutes + 60) {
      slots.push({
        time: formatTime(cursor),
        endTime: formatTime(cursor + prepDuration),
        title: `Checkout from ${hotelName || 'Hotel'}`,
        type: 'hotel',
        duration: prepDuration,
        notes: 'Pack up and checkout',
      });
      cursor += prepDuration;

      slots.push({
        time: formatTime(cursor),
        endTime: formatTime(cursor + transitDurationMinutes),
        title: 'Depart — Travel to Station/Airport',
        type: 'travel',
        duration: transitDurationMinutes,
        notes: 'Head to departure point',
      });
      cursor += transitDurationMinutes;
    }
  }

  // End-of-day hotel return (if not departure day)
  if (!isDeparture && hotelName) {
    const returnDur = 15;
    slots.push({
      time: formatTime(cursor),
      endTime: formatTime(cursor + returnDur),
      title: `Return to ${hotelName}`,
      type: 'hotel',
      duration: returnDur,
      notes: 'Head back to accommodation for the night',
    });
  }

  return slots;
}

// ─── Format date string ─────────────────────────────────────────────

function formatDate(startDate: Date, dayOffset: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayOffset);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ─── Main Export ────────────────────────────────────────────────────

export function buildSchedule(
  duration: number,
  arrivalTime: string,
  departureTime: string,
  pace: string,
  travelType: string,
  clusters: Array<{ places: Array<{ name: string; category: string }>; totalWalkingKm: number }>,
  restaurants: Array<{ name: string; cuisine?: string }>,
  hotelName: string,
  transportDurationHours: number
): DaySchedule[] {
  const safeDuration = Math.max(1, duration);
  const paceKey = pace.toLowerCase().trim();
  const dailyActiveMinutes = (PACE_HOURS[paceKey] ?? PACE_HOURS.balanced) * 60;
  const transitMinutes = Math.round(transportDurationHours * 60);

  // Flatten all cluster places to distribute across days
  const allPlaces: Array<{ name: string; category: string }>[] = [];
  if (clusters.length > 0) {
    // Distribute cluster places across days
    for (const cluster of clusters) {
      allPlaces.push(cluster.places);
    }
  }

  // Distribute restaurants across days (round-robin)
  const restaurantsPerDay: Array<Array<{ name: string; cuisine?: string }>> = [];
  for (let d = 0; d < safeDuration; d++) {
    restaurantsPerDay.push([]);
  }
  for (let i = 0; i < restaurants.length; i++) {
    restaurantsPerDay[i % safeDuration].push(restaurants[i]);
  }

  // Distribute places across days
  const placesPerDay: Array<Array<{ name: string; category: string }>> = [];
  for (let d = 0; d < safeDuration; d++) {
    placesPerDay.push([]);
  }

  // Assign entire clusters to days first (best fit)
  let dayPointer = 0;
  for (const clusterPlaces of allPlaces) {
    // Assign to current day, advance if needed
    const targetDay = dayPointer % safeDuration;
    for (const place of clusterPlaces) {
      placesPerDay[targetDay].push(place);
    }
    dayPointer++;
  }

  // Build schedules
  const schedules: DaySchedule[] = [];
  const startDate = new Date();

  for (let d = 0; d < safeDuration; d++) {
    const isFirstDay = d === 0;
    const isLastDay = d === safeDuration - 1;
    const isOnlyDay = safeDuration === 1;

    // Determine start and end times for this day
    let dayStartMinutes: number;
    let dayEndMinutes: number;

    if (isFirstDay) {
      dayStartMinutes = parseTime(arrivalTime || '09:00');
    } else {
      dayStartMinutes = parseTime('08:00'); // Standard day start
    }

    if (isLastDay) {
      dayEndMinutes = parseTime(departureTime || '18:00');
    } else {
      dayEndMinutes = parseTime('22:00'); // Standard day end
    }

    // Ensure valid range
    if (dayEndMinutes <= dayStartMinutes) {
      dayEndMinutes = dayStartMinutes + 120; // At least 2 hours
    }

    const dayPlaces = placesPerDay[d] || [];
    const dayRestaurants = restaurantsPerDay[d] || [];

    const slots = buildDaySlots(
      dayStartMinutes,
      dayEndMinutes,
      dailyActiveMinutes,
      dayPlaces,
      dayRestaurants,
      hotelName,
      travelType,
      isFirstDay,
      isLastDay,
      isOnlyDay ? Math.min(transitMinutes, 60) : (isFirstDay || isLastDay ? transitMinutes : 0)
    );

    // Calculate total active hours
    const totalActiveMins = slots.reduce((sum, slot) => {
      if (slot.type !== 'rest' && slot.type !== 'hotel') {
        return sum + slot.duration;
      }
      return sum;
    }, 0);

    const theme = generateTheme(
      dayPlaces,
      d + 1,
      safeDuration,
      isFirstDay,
      isLastDay
    );

    schedules.push({
      day: d + 1,
      date: formatDate(startDate, d),
      theme,
      slots,
      totalActiveHours: Math.round((totalActiveMins / 60) * 10) / 10,
    });
  }

  return schedules;
}
