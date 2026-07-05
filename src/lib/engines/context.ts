// Trip Context Engine - Phase 6
export type TripContext = {
  arrival_day_start: string;
  hotel_checkin: string;
  available_hours: number;
  sunrise: string;
  sunset: string;
  max_pois_first_day: number;
};

export function buildTripContext(
  arrivalTime: string,
  lat: number,
  lon: number,
  duration: number
): TripContext {
  // Parse arrival time assuming format 'HH:MM AM/PM' or 'HH:MM'
  const timeStr = arrivalTime || '12:00 PM';
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  let hours = 12;
  let minutes = 0;
  
  if (match) {
    hours = parseInt(match[1]);
    minutes = parseInt(match[2]);
    const ampm = match[3]?.toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
  }
  
  const arrivalMinutes = hours * 60 + minutes;
  
  // Hardcoded sunrise/sunset approximation for MVP (Phase 6 rule: Never assume day starts at 8 AM)
  // In a full production OS, we'd query OpenMeteo or an ephemeris library here using lat/lon.
  const sunriseMinutes = 6 * 60 + 15; // 06:15
  const sunsetMinutes = 18 * 60 + 58; // 18:58
  
  // Calculate available hours on first day (Assume day ends at 22:00 = 1320 mins)
  const dayEndMinutes = 22 * 60;
  let availableMinutes = dayEndMinutes - arrivalMinutes;
  if (availableMinutes < 0) availableMinutes = 0;
  
  const available_hours = Math.floor(availableMinutes / 60);
  
  // Calculate max POIs for the first day (assume roughly 2 hours per POI including travel)
  let max_pois = Math.floor(available_hours / 2);
  
  // Cap POIs to prevent exhausting arrival day
  if (max_pois > 4) max_pois = 4;
  if (max_pois < 0) max_pois = 0;
  
  return {
    arrival_day_start: formatTime(arrivalMinutes),
    hotel_checkin: '14:00', // Standard global check-in time
    available_hours,
    sunrise: formatTime(sunriseMinutes),
    sunset: formatTime(sunsetMinutes),
    max_pois_first_day: max_pois
  };
}

function formatTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
