import { greedyCluster } from './cluster';
import { Place } from './places';
import type { DayForecast, DayOpeningHours } from '@/lib/types/blueprint';

export interface ScheduleSlot {
  time: string;
  endTime: string;
  title: string;
  type: 'travel' | 'meal' | 'activity' | 'rest' | 'hotel' | 'checkin' | 'checkout' | 'evening' | 'breakfast' | 'snack';
  duration: number; // minutes
  notes: string;
  lat?: number;
  lon?: number;
  imageUrl?: string;
  cost?: number;
  walkingDistance?: string;
  placeId?: string;
}

export interface DaySchedule {
  day: number;
  date: string;
  theme: string;
  activities: ScheduleSlot[];
  totalActiveHours: number;
}

function parseTime(t: string): number {
  const parts = t.split(':');
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function formatTime(mins: number): string {
  const clamped = Math.max(0, Math.min(mins, 1439));
  let h = Math.floor(clamped / 60);
  const m = clamped % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

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

function estimateTravelMinutes(distKm: number): number {
  // Average speed ~40 km/h in Indian cities, minimum 10 min for any transit
  return Math.max(10, Math.round((distKm / 40) * 60));
}

function estimateVisitDuration(category: string, types: string[], name: string): number {
  const nameLower = name.toLowerCase();
  if (/museum|gallery|aquarium/.test(nameLower)) return 90;
  if (/temple|church|mosque|shrine|gurudwara/.test(nameLower)) return 45;
  if (/fort|castle|palace|ruins|haveli/.test(nameLower)) return 90;
  if (/park|garden|nature|lake/.test(nameLower)) return 60;
  if (/viewpoint|monument|memorial|statue/.test(nameLower)) return 30;
  if (/zoo|theme.park|water.park|amusement/.test(nameLower)) return 180;
  if (/beach/.test(nameLower)) return 90;
  if (/market|bazaar|shopping/.test(nameLower)) return 60;
  return 60;
}

// Check if a place is open at a given time on a given day
function isPlaceOpen(
  openingHours: DayOpeningHours[] | null | undefined,
  dayOfWeek: number, // 0=Sunday, 6=Saturday
  timeMins: number
): boolean {
  if (!openingHours || openingHours.length === 0) return true; // Unknown = assume open
  const dayHours = openingHours.find(h => h.day === dayOfWeek);
  if (!dayHours) return false; // No hours for this day = closed
  const openMins = parseTime(dayHours.open);
  const closeMins = parseTime(dayHours.close);
  return timeMins >= openMins && timeMins < closeMins;
}

// Check if a place is indoor (weather-resistant)
function isIndoorPlace(name: string, types: string[]): boolean {
  const nameLower = name.toLowerCase();
  return /museum|gallery|mall|shopping|cinema|theater|library|aquarium|temple|church|mosque/.test(nameLower)
    || types.some(t => ['museum', 'shopping_mall', 'movie_theater', 'art_gallery', 'library', 'place_of_worship'].includes(t));
}

function findNearestRestaurant(
  pool: Place[],
  lat: number,
  lon: number,
  mealType?: string
): { restaurant: Place; distance: number } | null {
  let best: Place | null = null;
  let bestDist = Infinity;

  for (const r of pool) {
    if (r.category !== 'restaurant') continue;
    const isCafe = (r.types || []).includes('cafe') || r.name.toLowerCase().includes('cafe');
    if (mealType === 'breakfast' && !isCafe && !(r as any).mealType?.includes('breakfast')) continue;
    if (mealType === 'dinner' && isCafe) continue;

    const dist = haversineKm(lat, lon, r.lat, r.lon);
    if (dist < bestDist) {
      bestDist = dist;
      best = r;
    }
  }

  return best ? { restaurant: best, distance: bestDist } : null;
}

export interface ScheduleOptions {
  forecast?: DayForecast[];
  openingHoursMap?: Map<string, DayOpeningHours[]>;
}

export async function buildSchedule(
  places: { attractions: Place[]; restaurants: Place[]; hotels: Place[] },
  daysCount: number,
  hotel: Place | null,
  travelType: string,
  pace: string,
  arrivalDatetime: string,
  options?: ScheduleOptions
): Promise<DaySchedule[]> {
  const schedule: DaySchedule[] = [];
  const forecast = options?.forecast || [];

  const validAttractions = places.attractions.filter(p => p.name && p.lat && p.lon);
  const attractionClusters = greedyCluster(validAttractions, daysCount, 20);

  let restaurantPool = [...places.restaurants].filter(p => p.name && p.lat && p.lon);

  let arrivalDateObj = new Date();
  let arrivalTimeMins = parseTime('09:00');
  if (arrivalDatetime) {
    const d = new Date(arrivalDatetime);
    if (!isNaN(d.getTime())) {
      arrivalDateObj = d;
      arrivalTimeMins = d.getHours() * 60 + d.getMinutes();
    }
  }

  const isRelaxed = pace === 'slow';
  const isExplorer = pace === 'explorer';
  const maxActivitiesPerDay = isRelaxed ? 4 : isExplorer ? 8 : 6;

  for (let dayNum = 1; dayNum <= daysCount; dayNum++) {
    const dayActivities: ScheduleSlot[] = [];
    const dayForecast = forecast[dayNum - 1] || null;
    const isRainyDay = dayForecast ? dayForecast.rainProbability > 60 : false;
    const isHotDay = dayForecast ? dayForecast.temperatureMax > 40 : false;

    // Get sunrise/sunset from real forecast data
    const sunrise = dayForecast?.sunrise || '06:15';
    const sunset = dayForecast?.sunset || '18:30';
    const sunsetMins = parseTime(sunset);

    // Calculate date and day of week
    const d = new Date(arrivalDateObj);
    d.setDate(d.getDate() + dayNum - 1);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay(); // 0=Sunday

    let currentTimeMins = dayNum === 1 ? Math.max(arrivalTimeMins, parseTime('08:00')) : parseTime('08:00');
    let lastLat = hotel?.lat || validAttractions[0]?.lat || 0;
    let lastLon = hotel?.lon || validAttractions[0]?.lon || 0;

    // ── Breakfast ──
    if (dayNum > 1 || currentTimeMins <= parseTime('09:00')) {
      const breakfast = findNearestRestaurant(restaurantPool, lastLat, lastLon, 'breakfast');
      if (breakfast) {
        const travelTime = estimateTravelMinutes(breakfast.distance);
        currentTimeMins += travelTime;
        dayActivities.push({
          time: formatTime(currentTimeMins),
          endTime: formatTime(currentTimeMins + 45),
          title: `Breakfast at ${breakfast.restaurant.name}`,
          type: 'breakfast',
          duration: 45,
          notes: `Start your day with breakfast. ${breakfast.distance.toFixed(1)} km from hotel.`,
          lat: breakfast.restaurant.lat,
          lon: breakfast.restaurant.lon,
          imageUrl: breakfast.restaurant.imageUrl,
          placeId: breakfast.restaurant.placeId,
        });
        currentTimeMins += 45;
        lastLat = breakfast.restaurant.lat;
        lastLon = breakfast.restaurant.lon;
        restaurantPool = restaurantPool.filter(r => r.id !== breakfast.restaurant.id);
      } else {
        currentTimeMins = Math.max(currentTimeMins, parseTime('09:00'));
      }
    }

    // ── Check-in on Day 1 ──
    if (dayNum === 1 && hotel) {
      if (currentTimeMins < parseTime('14:00')) {
        dayActivities.push({
          time: formatTime(currentTimeMins),
          endTime: formatTime(currentTimeMins + 30),
          title: `Drop luggage at ${hotel.name}`,
          type: 'hotel',
          duration: 30,
          notes: 'Drop off your luggage before check-in time.',
          lat: hotel.lat, lon: hotel.lon,
        });
        currentTimeMins += 30;
      } else {
        dayActivities.push({
          time: formatTime(currentTimeMins),
          endTime: formatTime(currentTimeMins + 60),
          title: `Check-in at ${hotel.name}`,
          type: 'checkin',
          duration: 60,
          notes: 'Settle in and drop off your luggage.',
          lat: hotel.lat, lon: hotel.lon,
        });
        currentTimeMins += 60;
      }
      lastLat = hotel.lat;
      lastLon = hotel.lon;
    }

    // ── Attractions ──
    const cluster = attractionClusters[dayNum - 1];
    let dailyActivitiesCount = 0;
    let hadLunch = false;
    let hadSnack = false;

    if (cluster && cluster.places.length > 0) {
      // Sort places: on rainy/hot days, prefer indoor first
      let orderedPlaces = cluster.suggestedOrder
        .map(name => cluster.places.find(p => p.name === name))
        .filter(Boolean) as Place[];

      if (isRainyDay || isHotDay) {
        const indoor = orderedPlaces.filter(p => isIndoorPlace(p.name, p.types || []));
        const outdoor = orderedPlaces.filter(p => !isIndoorPlace(p.name, p.types || []));
        orderedPlaces = [...indoor, ...outdoor];
      }

      for (const attr of orderedPlaces) {
        if (dailyActivitiesCount >= maxActivitiesPerDay) break;
        if (currentTimeMins > sunsetMins + 90) break; // Don't schedule too late

        // ── Lunch break ──
        if (!hadLunch && currentTimeMins >= parseTime('12:30') && currentTimeMins < parseTime('14:30')) {
          const lunch = findNearestRestaurant(restaurantPool, lastLat, lastLon, 'lunch');
          if (lunch) {
            const travelTime = estimateTravelMinutes(lunch.distance);
            currentTimeMins += travelTime;
            dayActivities.push({
              time: formatTime(currentTimeMins),
              endTime: formatTime(currentTimeMins + 60),
              title: `Lunch at ${lunch.restaurant.name}`,
              type: 'meal',
              duration: 60,
              notes: `Enjoy lunch. ${lunch.distance.toFixed(1)} km away.`,
              lat: lunch.restaurant.lat, lon: lunch.restaurant.lon,
              imageUrl: lunch.restaurant.imageUrl,
              placeId: lunch.restaurant.placeId,
            });
            currentTimeMins += 60;
            lastLat = lunch.restaurant.lat;
            lastLon = lunch.restaurant.lon;
            restaurantPool = restaurantPool.filter(r => r.id !== lunch.restaurant.id);
            hadLunch = true;
          }
        }

        // ── Tea/snack break (relaxed/balanced only) ──
        if (!hadSnack && !isExplorer && currentTimeMins >= parseTime('15:30') && currentTimeMins < parseTime('16:30')) {
          dayActivities.push({
            time: formatTime(currentTimeMins),
            endTime: formatTime(currentTimeMins + 30),
            title: 'Tea & Snack Break',
            type: 'snack',
            duration: 30,
            notes: isRainyDay ? 'Perfect time for a warm chai and snacks while watching the rain.' : 'Recharge with some local tea and snacks.',
          });
          currentTimeMins += 30;
          hadSnack = true;
        }

        // Check opening hours before scheduling
        const ohKey = (attr as any).openingHours;
        if (ohKey && !isPlaceOpen(ohKey, dayOfWeek, currentTimeMins)) {
          continue; // Skip closed attractions
        }

        // Travel to attraction
        const distToAttr = haversineKm(lastLat, lastLon, attr.lat, attr.lon);
        const travelMins = estimateTravelMinutes(distToAttr);
        currentTimeMins += travelMins;

        const visitDuration = estimateVisitDuration(attr.category, attr.types || [], attr.name);

        dayActivities.push({
          time: formatTime(currentTimeMins),
          endTime: formatTime(currentTimeMins + visitDuration),
          title: `Visit ${attr.name}`,
          type: 'activity',
          duration: visitDuration,
          notes: `Explore ${attr.name}.${distToAttr > 1 ? ` ${distToAttr.toFixed(1)} km drive.` : ''}`,
          lat: attr.lat, lon: attr.lon,
          imageUrl: attr.imageUrl,
          placeId: attr.placeId,
        });

        currentTimeMins += visitDuration;
        lastLat = attr.lat;
        lastLon = attr.lon;
        dailyActivitiesCount++;
      }
    }

    // ── Sunset activity if clear weather ──
    if (!isRainyDay && currentTimeMins < sunsetMins - 30) {
      const sunsetPlaces = validAttractions.filter(p =>
        /viewpoint|sunset|beach|lakefront|riverfront/i.test(p.name) &&
        !dayActivities.some(a => a.placeId === p.placeId)
      );
      if (sunsetPlaces.length > 0) {
        const nearest = sunsetPlaces.reduce((best, p) => {
          const dist = haversineKm(lastLat, lastLon, p.lat, p.lon);
          return dist < (best.dist || Infinity) ? { place: p, dist } : best;
        }, { place: sunsetPlaces[0], dist: Infinity });

        if (nearest.dist < 30) {
          const travelMins = estimateTravelMinutes(nearest.dist);
          const targetTime = sunsetMins - 45;
          if (currentTimeMins < targetTime) currentTimeMins = targetTime;
          currentTimeMins += travelMins;

          dayActivities.push({
            time: formatTime(currentTimeMins),
            endTime: formatTime(currentTimeMins + 45),
            title: `Sunset at ${nearest.place.name}`,
            type: 'evening',
            duration: 45,
            notes: `Watch the sunset. Golden hour starts around ${formatTime(sunsetMins - 60)}.`,
            lat: nearest.place.lat, lon: nearest.place.lon,
            imageUrl: nearest.place.imageUrl,
            placeId: nearest.place.placeId,
          });
          currentTimeMins += 45;
          lastLat = nearest.place.lat;
          lastLon = nearest.place.lon;
        }
      }
    }

    // ── Dinner ──
    if (currentTimeMins >= parseTime('18:00') || dailyActivitiesCount > 0) {
      if (currentTimeMins < parseTime('19:30')) currentTimeMins = parseTime('19:30');

      const dinner = findNearestRestaurant(restaurantPool, lastLat, lastLon, 'dinner');
      if (dinner) {
        const travelTime = estimateTravelMinutes(dinner.distance);
        currentTimeMins += travelTime;
        dayActivities.push({
          time: formatTime(currentTimeMins),
          endTime: formatTime(currentTimeMins + 90),
          title: `Dinner at ${dinner.restaurant.name}`,
          type: 'meal',
          duration: 90,
          notes: `Relax and enjoy dinner. ${dinner.distance.toFixed(1)} km away.`,
          lat: dinner.restaurant.lat, lon: dinner.restaurant.lon,
          imageUrl: dinner.restaurant.imageUrl,
          placeId: dinner.restaurant.placeId,
        });
        currentTimeMins += 90;
        lastLat = dinner.restaurant.lat;
        lastLon = dinner.restaurant.lon;
        restaurantPool = restaurantPool.filter(r => r.id !== dinner.restaurant.id);
      }
    }

    // ── Return to hotel ──
    if (hotel && dayNum < daysCount) {
      const hotelDist = haversineKm(lastLat, lastLon, hotel.lat, hotel.lon);
      const travelTime = estimateTravelMinutes(hotelDist);
      currentTimeMins += travelTime;
      dayActivities.push({
        time: formatTime(currentTimeMins),
        endTime: formatTime(currentTimeMins + 30),
        title: `Return to ${hotel.name}`,
        type: 'rest',
        duration: 30,
        notes: 'Head back to the hotel for the night.',
        lat: hotel.lat, lon: hotel.lon,
      });
    }

    // ── Checkout on last day ──
    if (hotel && dayNum === daysCount) {
      dayActivities.push({
        time: formatTime(currentTimeMins),
        endTime: formatTime(currentTimeMins + 30),
        title: `Checkout from ${hotel.name} & Departure`,
        type: 'checkout',
        duration: 30,
        notes: 'End of the trip. Safe travels!',
        lat: hotel.lat, lon: hotel.lon,
      });
    }

    // ── Weather warning in theme ──
    const weatherNote = isRainyDay
      ? '🌧️ Rain expected — indoor activities prioritized'
      : isHotDay
      ? '🌡️ Extreme heat — outdoor shifted to cooler hours'
      : '';

    schedule.push({
      day: dayNum,
      date: dateStr,
      theme: cluster && cluster.places.length > 0
        ? `${cluster.places[0].name} Explorer${weatherNote ? ` | ${weatherNote}` : ''}`
        : `City Explorer${weatherNote ? ` | ${weatherNote}` : ''}`,
      activities: dayActivities,
      totalActiveHours: Math.round((currentTimeMins - parseTime('09:00')) / 60),
    });
  }

  return schedule;
}
