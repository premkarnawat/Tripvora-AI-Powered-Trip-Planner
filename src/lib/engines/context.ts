import type { DayForecast } from '@/lib/types/blueprint';

export interface DayContext {
  sunrise: string;
  sunset: string;
  goldenHourStart: string;
  goldenHourEnd: string;
  isDaytime: boolean;
  suggestedDayStart: string;
  suggestedDayEnd: string;
  checkInTime: string;
}

export function buildDayContext(
  arrivalTime: string | null,
  forecast: DayForecast | null,
  dayNumber: number
): DayContext {
  // Use real sunrise/sunset from forecast, fallback to reasonable defaults
  const sunrise = forecast?.sunrise || '06:15';
  const sunset = forecast?.sunset || '18:30';
  
  // Golden hour = 1 hour before sunset
  const sunsetMins = parseTimeToMinutes(sunset);
  const goldenHourStart = formatMinutesToTime(sunsetMins - 60);
  
  // Suggest starting sightseeing 1 hour after sunrise (or after arrival on day 1)
  const sunriseMins = parseTimeToMinutes(sunrise);
  let dayStart = formatMinutesToTime(sunriseMins + 60); // 1 hour after sunrise
  if (dayNumber === 1 && arrivalTime) {
    const arrivalMins = parseTimeToMinutes(arrivalTime);
    if (arrivalMins > sunriseMins + 60) dayStart = arrivalTime;
  }
  
  return {
    sunrise, sunset,
    goldenHourStart, goldenHourEnd: sunset,
    isDaytime: true,
    suggestedDayStart: dayStart,
    suggestedDayEnd: formatMinutesToTime(sunsetMins + 120), // 2 hours after sunset
    checkInTime: '14:00',
  };
}

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatMinutesToTime(mins: number): string {
  const clamped = Math.max(0, Math.min(mins, 1439));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
