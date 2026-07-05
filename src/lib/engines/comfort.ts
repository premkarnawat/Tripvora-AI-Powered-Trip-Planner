// Comfort Engine - Phase 13 & 14
export type ComfortMetrics = {
  travel_fatigue: number; // 0.0 to 1.0
  walking_fatigue: number; // 0.0 to 1.0
  weather_stress: number; // 0.0 to 1.0
  rest_needed: boolean;
};

export function calculateComfort(
  walking_preference: string,
  pace_preference: string,
  weather: { temperature: number; rainProbability: number; humidity?: number } | null,
  transportDurationHours: number
): ComfortMetrics {
  let travel_fatigue = 0.0;
  let walking_fatigue = 0.0;
  let weather_stress = 0.0;

  // 1. Travel Fatigue (Based on journey time)
  if (transportDurationHours > 8) travel_fatigue = 0.9;
  else if (transportDurationHours > 4) travel_fatigue = 0.6;
  else if (transportDurationHours > 2) travel_fatigue = 0.3;
  else travel_fatigue = 0.1;

  // 2. Walking Fatigue (Based on user preference)
  const walk = (walking_preference || 'medium').toLowerCase();
  if (walk === 'high') walking_fatigue = 0.2; // High tolerance = low fatigue
  else if (walk === 'medium') walking_fatigue = 0.5;
  else walking_fatigue = 0.8; // Low tolerance = high fatigue

  // 3. Weather Stress
  if (weather) {
    if (weather.temperature > 35) weather_stress += 0.6; // Extreme heat
    else if (weather.temperature > 30) weather_stress += 0.3;
    else if (weather.temperature < 5) weather_stress += 0.5; // Extreme cold
    
    if (weather.rainProbability > 70) weather_stress += 0.4; // High rain
    
    // Cap at 1.0
    weather_stress = Math.min(1.0, weather_stress);
  }

  // 4. Evaluate if immediate rest is needed upon arrival
  // Rule: Never create exhausting trips.
  const pace = (pace_preference || 'balanced').toLowerCase();
  const threshold = pace === 'slow' ? 0.4 : pace === 'balanced' ? 0.6 : 0.8;
  
  // If combined stress factors on arrival are very high, mandate rest
  const combined_stress = (travel_fatigue * 0.5) + (weather_stress * 0.5);
  const rest_needed = combined_stress > threshold;

  return {
    travel_fatigue,
    walking_fatigue,
    weather_stress,
    rest_needed
  };
}
