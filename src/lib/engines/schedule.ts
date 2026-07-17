import { greedyCluster } from './cluster';
import { Place } from './places';

export interface ScheduleSlot {
  time: string;
  endTime: string;
  title: string;
  type: 'travel' | 'meal' | 'activity' | 'rest' | 'hotel' | 'checkin' | 'checkout' | 'evening';
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
  return 60;
}

export async function buildSchedule(
  places: { attractions: Place[]; restaurants: Place[]; hotels: Place[] },
  daysCount: number,
  hotel: Place | null,
  travelType: string,
  pace: string,
  arrivalDatetime: string
): Promise<DaySchedule[]> {
  const schedule: DaySchedule[] = [];
  
  // Clean inputs
  const validAttractions = places.attractions.filter(p => p.name && p.lat && p.lon);
  const attractionClusters = greedyCluster(
    validAttractions, 
    daysCount, 
    20 // max radius
  );

  let restaurantPool = [...places.restaurants].filter(p => p.name && p.lat && p.lon);

  let currentGlobalTimeMins = parseTime("09:00");
  let arrivalDateObj = new Date();
  if (arrivalDatetime) {
    const d = new Date(arrivalDatetime);
    if (!isNaN(d.getTime())) {
       arrivalDateObj = d;
       currentGlobalTimeMins = d.getHours() * 60 + d.getMinutes();
    }
  }

  const isRelaxed = pace === 'slow';
  const isExplorer = pace === 'explorer';
  const maxActivitiesPerDay = isRelaxed ? 4 : isExplorer ? 8 : 6;
  
  for (let dayNum = 1; dayNum <= daysCount; dayNum++) {
    const dayActivities: ScheduleSlot[] = [];
    let currentTimeMins = dayNum === 1 ? Math.max(currentGlobalTimeMins, parseTime("09:00")) : parseTime("09:00");
    let lastLat = hotel?.lat || validAttractions[0]?.lat || 0;
    let lastLon = hotel?.lon || validAttractions[0]?.lon || 0;

    // Determine current date string
    const d = new Date(arrivalDateObj);
    d.setDate(d.getDate() + dayNum - 1);
    const dateStr = d.toISOString().split('T')[0];

    // Check-in on Day 1
    if (dayNum === 1 && hotel) {
      if (currentTimeMins < parseTime("14:00")) {
         // Arrived early, check in at 14:00 later or drop bags
         dayActivities.push({
          time: formatTime(currentTimeMins),
          endTime: formatTime(currentTimeMins + 30),
          title: `Drop luggage at ${hotel.name}`,
          type: 'hotel',
          duration: 30,
          notes: "Drop off your luggage before check-in time.",
          lat: hotel.lat,
          lon: hotel.lon,
        });
        currentTimeMins += 30;
      } else {
        dayActivities.push({
          time: formatTime(currentTimeMins),
          endTime: formatTime(currentTimeMins + 60),
          title: `Check-in at ${hotel.name}`,
          type: 'checkin',
          duration: 60,
          notes: "Settle in and drop off your luggage.",
          lat: hotel.lat,
          lon: hotel.lon,
        });
        currentTimeMins += 60;
      }
    }

    const cluster = attractionClusters[dayNum - 1];
    let dailyActivitiesCount = 0;

    if (cluster && cluster.places.length > 0) {
      // Order cluster places by suggested order
      const orderedPlaces = cluster.suggestedOrder
        .map(name => cluster.places.find(p => p.name === name))
        .filter(Boolean) as Place[];

      for (const attr of orderedPlaces) {
        if (dailyActivitiesCount >= maxActivitiesPerDay) break;

        // Add lunch if it's lunchtime
        if (currentTimeMins >= parseTime("12:30") && currentTimeMins < parseTime("14:30")) {
           // Find nearest lunch place
           const lunchPlaces = restaurantPool.filter(r => 
             r.category === 'restaurant' && 
             (!r.types || r.types.indexOf('cafe') === -1)
           );
           
           let bestLunch = lunchPlaces[0];
           let bestLunchDist = Infinity;
           for (const r of lunchPlaces) {
             const dist = haversineKm(lastLat, lastLon, r.lat, r.lon);
             if (dist < bestLunchDist) {
               bestLunchDist = dist;
               bestLunch = r;
             }
           }

           if (bestLunch) {
             const travelTime = Math.max(10, Math.round((bestLunchDist / 30) * 60));
             currentTimeMins += travelTime; // travel to lunch

             dayActivities.push({
                time: formatTime(currentTimeMins),
                endTime: formatTime(currentTimeMins + 60),
                title: `Lunch at ${bestLunch.name}`,
                type: 'meal',
                duration: 60,
                notes: `Enjoy a delicious lunch. Distance: ${bestLunchDist.toFixed(1)} km`,
                lat: bestLunch.lat,
                lon: bestLunch.lon,
             });
             currentTimeMins += 60;
             lastLat = bestLunch.lat;
             lastLon = bestLunch.lon;
             
             // Remove from pool so we don't repeat
             restaurantPool = restaurantPool.filter(r => r.id !== bestLunch.id);
           }
        }

        // Travel to attraction
        const distToAttr = haversineKm(lastLat, lastLon, attr.lat, attr.lon);
        const travelMins = Math.max(10, Math.round((distToAttr / 30) * 60));
        currentTimeMins += travelMins;

        const visitDuration = estimateVisitDuration(attr.category, attr.types || [], attr.name);

        dayActivities.push({
          time: formatTime(currentTimeMins),
          endTime: formatTime(currentTimeMins + visitDuration),
          title: `Visit ${attr.name}`,
          type: 'activity',
          duration: visitDuration,
          notes: `Explore ${attr.name}.`,
          lat: attr.lat,
          lon: attr.lon,
        });

        currentTimeMins += visitDuration;
        lastLat = attr.lat;
        lastLon = attr.lon;
        dailyActivitiesCount++;
      }
    }

    // Add dinner if it's dinner time or day is ending
    if (currentTimeMins >= parseTime("18:00") || (currentTimeMins > parseTime("16:00") && dailyActivitiesCount > 0)) {
       // Fast forward to dinner time if too early
       if (currentTimeMins < parseTime("19:00")) {
         currentTimeMins = parseTime("19:00");
       }

       const dinnerPlaces = restaurantPool.filter(r => r.category === 'restaurant');
       let bestDinner = dinnerPlaces[0];
       let bestDinnerDist = Infinity;
       
       for (const r of dinnerPlaces) {
         const dist = haversineKm(lastLat, lastLon, r.lat, r.lon);
         if (dist < bestDinnerDist) {
           bestDinnerDist = dist;
           bestDinner = r;
         }
       }

       if (bestDinner) {
         const travelTime = Math.max(10, Math.round((bestDinnerDist / 30) * 60));
         currentTimeMins += travelTime;

         dayActivities.push({
            time: formatTime(currentTimeMins),
            endTime: formatTime(currentTimeMins + 90),
            title: `Dinner at ${bestDinner.name}`,
            type: 'meal',
            duration: 90,
            notes: `Relax and enjoy dinner. Distance: ${bestDinnerDist.toFixed(1)} km`,
            lat: bestDinner.lat,
            lon: bestDinner.lon,
         });
         currentTimeMins += 90;
         lastLat = bestDinner.lat;
         lastLon = bestDinner.lon;
         restaurantPool = restaurantPool.filter(r => r.id !== bestDinner.id);
       }
    }

    // Return to hotel
    if (hotel && dayNum < daysCount) {
       const travelTime = Math.max(15, Math.round((haversineKm(lastLat, lastLon, hotel.lat, hotel.lon) / 30) * 60));
       currentTimeMins += travelTime;
       dayActivities.push({
          time: formatTime(currentTimeMins),
          endTime: formatTime(currentTimeMins + 30),
          title: `Return to ${hotel.name}`,
          type: 'rest',
          duration: 30,
          notes: "Head back to the hotel for the night.",
          lat: hotel.lat,
          lon: hotel.lon,
       });
    }

    // Checkout on last day
    if (hotel && dayNum === daysCount) {
       // Assuming departure, checkout in morning or end of day
       dayActivities.push({
          time: formatTime(currentTimeMins),
          endTime: formatTime(currentTimeMins + 30),
          title: `Checkout from ${hotel.name} & Departure`,
          type: 'checkout',
          duration: 30,
          notes: "End of the trip. Safe travels!",
          lat: hotel.lat,
          lon: hotel.lon,
       });
    }

    schedule.push({
      day: dayNum,
      date: dateStr,
      theme: cluster && cluster.places.length > 0 ? `${cluster.places[0].name} Explorer` : 'City Explorer',
      activities: dayActivities,
      totalActiveHours: Math.round((currentTimeMins - parseTime("09:00")) / 60)
    });
  }

  return schedule;
}
