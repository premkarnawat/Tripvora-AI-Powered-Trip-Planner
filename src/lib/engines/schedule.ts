import { getMicroRoute } from './transport';
import { greedyCluster } from './cluster';

export interface ScheduleSlot {
  time: string;
  endTime: string;
  title: string;
  type: 'travel' | 'meal' | 'activity' | 'rest' | 'hotel' | 'checkin' | 'checkout';
  duration: number; // minutes
  notes: string;
  lat?: number;
  lon?: number;
  imageUrl?: string;
  cost?: number;
  walkingDistance?: string;
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

function estimateActivityDuration(category: string): number {
  const cat = category.toLowerCase();
  if (/museum|gallery|aquarium/.test(cat)) return 120;
  if (/temple|church|mosque|shrine|place_of_worship/.test(cat)) return 60;
  if (/fort|castle|palace|ruins/.test(cat)) return 90;
  if (/park|garden|nature/.test(cat)) return 75;
  if (/viewpoint|monument|memorial/.test(cat)) return 45;
  if (/zoo|theme_park|water_park/.test(cat)) return 180;
  if (/beach/.test(cat)) return 120;
  if (/market|bazaar|shopping/.test(cat)) return 90;
  return 60;
}

export async function buildSchedule(
  places: { attractions: any[]; restaurants: any[]; hotels: any[] },
  daysCount: number,
  hotel: any,
  travelType: string,
  pace: string,
  arrivalDatetime: string
): Promise<DaySchedule[]> {
  const schedule: DaySchedule[] = [];
  
  // ── 1. Strict Day Clustering ──
  // We use the new Deduplicated Adaptive Pool. We cluster it into `daysCount` regions.
  // Each day gets one exclusive cluster. No looping. No repeating.
  const validAttractions = places.attractions.filter(p => p.name && p.lat && p.lon);
  const attractionClusters = greedyCluster(
    validAttractions, 
    daysCount, 
    20 // max 20km cluster radius if possible
  );

  let restaurantPool = [...places.restaurants].filter(p => p.name && p.lat && p.lon);

  let currentGlobalTimeMins = parseTime("09:00");
  if (arrivalDatetime) {
    const arrivalDateObj = new Date(arrivalDatetime);
    if (!isNaN(arrivalDateObj.getTime())) {
       currentGlobalTimeMins = arrivalDateObj.getHours() * 60 + arrivalDateObj.getMinutes();
    }
  }

  const isRelaxed = pace.toLowerCase().includes('relax') || travelType.toLowerCase().includes('senior');
  const maxActivitiesPerDay = isRelaxed ? 3 : 5;
  
  for (let dayNum = 1; dayNum <= daysCount; dayNum++) {
    const dayActivities: ScheduleSlot[] = [];
    let currentTimeMins = dayNum === 1 ? currentGlobalTimeMins : parseTime("09:00");
    let lastLat = hotel?.lat || 0;
    let lastLon = hotel?.lon || 0;

    // Check-in
    if (dayNum === 1 && hotel) {
      dayActivities.push({
        time: formatTime(currentTimeMins),
        endTime: formatTime(currentTimeMins + 60),
        title: `Check-in at ${hotel.name}`,
        type: 'checkin',
        duration: 60,
        notes: "Settle in and drop off your luggage.",
        lat: hotel.lat,
        lon: hotel.lon,
        imageUrl: hotel.imageUrl,
      });
      currentTimeMins += 60;
    }

    // ── Consume this day's strict cluster ──
    // If the cluster has fewer items than maxActivitiesPerDay, we just run out and finish early.
    // If the cluster has more, we slice it at maxActivitiesPerDay. 
    // We NEVER borrow from other days or reload the array.
    const clusterForDay = attractionClusters[dayNum - 1] || [];
    const dailyQuota = Math.min(maxActivitiesPerDay, clusterForDay.length);
    let mealsTaken = 0;

    for (let actIdx = 0; actIdx < dailyQuota; actIdx++) {
      if (clusterForDay.length === 0) break;
      
      clusterForDay.sort((a, b) => {
        const distA = Math.pow(a.lat - lastLat, 2) + Math.pow(a.lon - lastLon, 2);
        const distB = Math.pow(b.lat - lastLat, 2) + Math.pow(b.lon - lastLon, 2);
        return distA - distB;
      });
      
      const nextAttraction = clusterForDay.shift()!;
      
      let travelMins = 15;
      let distKm = 2.5;
      if (lastLat && lastLon) {
        const micro = await getMicroRoute(lastLat, lastLon, nextAttraction.lat, nextAttraction.lon);
        if (micro) {
          travelMins = Math.max(10, micro.durationMinutes);
          distKm = micro.distanceKm;
        }
      }

      currentTimeMins += travelMins;
      const actDuration = estimateActivityDuration(nextAttraction.category);
      dayActivities.push({
        time: formatTime(currentTimeMins),
        endTime: formatTime(currentTimeMins + actDuration),
        title: nextAttraction.name,
        type: 'activity',
        duration: actDuration,
        notes: `Explore ${nextAttraction.category.replace('_', ' ')}. Strict non-repeating geographic routing.`,
        lat: nextAttraction.lat,
        lon: nextAttraction.lon,
        cost: nextAttraction.priceLevel ? nextAttraction.priceLevel * 300 : undefined,
        walkingDistance: `${distKm} km drive`,
        imageUrl: nextAttraction.imageUrl, // FIXED: Now dynamically pushes unique API images to UI
      });
      
      currentTimeMins += actDuration;
      lastLat = nextAttraction.lat;
      lastLon = nextAttraction.lon;

      const isLunchTime = currentTimeMins >= 750 && currentTimeMins <= 870;
      const isDinnerTime = currentTimeMins >= 1140 && currentTimeMins <= 1260;
      
      if ((isLunchTime && mealsTaken < 1) || (isDinnerTime && mealsTaken < 2)) {
        if (restaurantPool.length > 0) {
          restaurantPool.sort((a, b) => {
            const distA = Math.pow(a.lat - lastLat, 2) + Math.pow(a.lon - lastLon, 2);
            const distB = Math.pow(b.lat - lastLat, 2) + Math.pow(b.lon - lastLon, 2);
            return distA - distB;
          });
          const nextRestaurant = restaurantPool.shift()!;
          
          let rTravelMins = 10;
          const rMicro = await getMicroRoute(lastLat, lastLon, nextRestaurant.lat, nextRestaurant.lon);
          if (rMicro) rTravelMins = Math.max(5, rMicro.durationMinutes);
          
          currentTimeMins += rTravelMins;
          dayActivities.push({
            time: formatTime(currentTimeMins),
            endTime: formatTime(currentTimeMins + 60),
            title: `Meal at ${nextRestaurant.name}`,
            type: 'meal',
            duration: 60,
            notes: `Highly rated real-world restaurant near your location.`,
            lat: nextRestaurant.lat,
            lon: nextRestaurant.lon,
            cost: nextRestaurant.priceLevel ? nextRestaurant.priceLevel * 400 : 500,
            imageUrl: nextRestaurant.imageUrl,
          });
          
          currentTimeMins += 60;
          lastLat = nextRestaurant.lat;
          lastLon = nextRestaurant.lon;
          mealsTaken++;
        }
      }
    }

    if (hotel && dayActivities.length > 0) {
      let rTravelMins = 20;
      const rMicro = await getMicroRoute(lastLat, lastLon, hotel.lat, hotel.lon);
      if (rMicro) rTravelMins = Math.max(10, rMicro.durationMinutes);
      currentTimeMins += rTravelMins;
      
      dayActivities.push({
        time: formatTime(currentTimeMins),
        endTime: formatTime(currentTimeMins + 30),
        title: `Return to ${hotel.name}`,
        type: 'hotel',
        duration: 30,
        notes: "Head back to rest for the day.",
        lat: hotel.lat,
        lon: hotel.lon,
        imageUrl: hotel.imageUrl,
      });
    }

    schedule.push({
      day: dayNum,
      date: `Day ${dayNum}`,
      theme: `Region Cluster ${dayNum}`,
      activities: dayActivities,
      totalActiveHours: Math.round((currentTimeMins - (dayNum === 1 ? currentGlobalTimeMins : parseTime("09:00"))) / 60)
    });
  }

  return schedule;
}
