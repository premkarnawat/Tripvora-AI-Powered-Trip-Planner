import { DayForecast } from '@/lib/types/blueprint';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRIPVORA — Weather Engine (Enhanced with 7-Day Forecast)
// Uses Open-Meteo API for current weather and daily forecasts.
// All planning logic is deterministic — no AI used for decisions.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── Current Weather Types ──────────────────────────────────────────────

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  description: string;
  rainProbability: number;
  uvIndex: number;
}

interface OpenMeteoCurrentResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    uv_index_max: number[];
    precipitation_probability_max: number[];
  };
}

// ─── Forecast API Response Types ────────────────────────────────────────

interface OpenMeteoForecastResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weathercode: number[];
    windspeed_10m_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

// ─── WMO Weather Code Mapping ───────────────────────────────────────────

/** Maps WMO weather codes to human-readable descriptions. */
const WMO_CODE_MAP: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Freezing light drizzle',
  57: 'Freezing dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Freezing light rain',
  67: 'Freezing heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

/**
 * Converts a WMO weather code to a human-readable description.
 * Falls back to range-based matching for unmapped codes.
 */
function weatherCodeToDescription(code: number): string {
  if (WMO_CODE_MAP[code]) return WMO_CODE_MAP[code];

  // Fallback: range-based matching for any gaps
  if (code >= 1 && code <= 3) return 'Partly cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Clear';
}

// ─── Forecast Helper Functions ──────────────────────────────────────────

/**
 * Extracts 'HH:MM' from an ISO-8601 datetime string (e.g. "2026-07-15T06:12").
 * Returns the time portion, or '—' if the input is invalid.
 */
function formatTimeHHMM(isoDateTime: string): string {
  if (!isoDateTime) return '—';
  // Open-Meteo returns "YYYY-MM-DDTHH:MM"
  const timePart = isoDateTime.split('T')[1];
  if (!timePart) return '—';
  // Take only HH:MM (drop seconds if present)
  return timePart.substring(0, 5);
}

/**
 * Generates weather warnings based on forecast conditions.
 * Deterministic rules — no AI involved.
 */
function generateWarnings(
  weatherCode: number,
  temperatureMax: number,
  temperatureMin: number,
  rainProbability: number,
  windSpeed: number,
  uvIndex: number,
): string[] {
  const warnings: string[] = [];

  // Heavy rain warning (codes 65–67, 82)
  if (weatherCode >= 65 && weatherCode <= 67) {
    warnings.push('⚠️ Heavy rain expected — carry waterproof gear and plan indoor alternatives.');
  }
  if (weatherCode === 82) {
    warnings.push('⚠️ Violent rain showers likely — avoid outdoor activities if possible.');
  }

  // Thunderstorm warning (codes 95–99)
  if (weatherCode >= 95) {
    warnings.push('⛈️ Thunderstorm expected — stay indoors and avoid open areas.');
  }

  // Extreme heat warning (> 40°C)
  if (temperatureMax > 40) {
    warnings.push(`🔥 Extreme heat (${temperatureMax}°C) — stay hydrated, avoid midday sun, and seek shade.`);
  } else if (temperatureMax > 35) {
    warnings.push(`☀️ High temperature (${temperatureMax}°C) — drink plenty of water and take breaks.`);
  }

  // Extreme cold warning (< 0°C)
  if (temperatureMin < 0) {
    warnings.push(`❄️ Sub-zero temperatures (${temperatureMin}°C) — layer up and watch for icy surfaces.`);
  }

  // High UV warning (> 8)
  if (uvIndex > 8) {
    warnings.push(`🧴 Very high UV index (${uvIndex}) — wear sunscreen SPF50+, hat, and sunglasses.`);
  } else if (uvIndex > 5) {
    warnings.push(`🧴 High UV index (${uvIndex}) — apply sunscreen and limit direct sun exposure.`);
  }

  // High wind warning (> 50 km/h)
  if (windSpeed > 50) {
    warnings.push(`💨 Strong winds (${windSpeed} km/h) — avoid hilltop attractions and open areas.`);
  }

  // High rain probability
  if (rainProbability >= 80) {
    warnings.push('🌧️ High rain probability — carry an umbrella and have backup indoor plans.');
  }

  return warnings;
}

/**
 * Suggests indoor alternatives when outdoor conditions are unsafe.
 * Returns an empty array when it's safe to be outdoors.
 */
function suggestIndoorAlternatives(isOutdoorSafe: boolean): string[] {
  if (isOutdoorSafe) return [];
  return ['museums', 'shopping malls', 'indoor attractions'];
}

// ─── Current Weather (Existing Function — Preserved) ────────────────────

/**
 * Fetches current weather data for a given location from Open-Meteo.
 * Returns null on API failure.
 */
export async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
      `&daily=uv_index_max,precipitation_probability_max` +
      `&timezone=auto`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) return null;

    const data: OpenMeteoCurrentResponse = await res.json();

    const current = data.current;
    const daily = data.daily;

    return {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      description: weatherCodeToDescription(current.weather_code),
      rainProbability: daily.precipitation_probability_max?.[0] ?? 0,
      uvIndex: daily.uv_index_max?.[0] ?? 0,
    };
  } catch (err: unknown) {
    throw new Error(`WEATHER_API_FAILED: Failed to fetch weather - ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ─── 7-Day Forecast with Sunrise/Sunset (New) ──────────────────────────

/**
 * Fetches a daily weather forecast for the given date range from Open-Meteo.
 * Includes temperature extremes, precipitation, wind, UV, sunrise/sunset,
 * outdoor safety assessment, warnings, and indoor alternatives.
 *
 * @param lat       - Latitude of the destination
 * @param lon       - Longitude of the destination
 * @param startDate - Trip start date in 'YYYY-MM-DD' format
 * @param endDate   - Trip end date in 'YYYY-MM-DD' format
 * @returns Array of DayForecast objects, or an empty array on failure
 */
export async function getForecast(
  lat: number,
  lon: number,
  startDate: string, // 'YYYY-MM-DD'
  endDate: string,   // 'YYYY-MM-DD'
): Promise<DayForecast[]> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,windspeed_10m_max,uv_index_max,sunrise,sunset` +
      `&timezone=auto` +
      `&start_date=${startDate}` +
      `&end_date=${endDate}`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error(`[WeatherEngine] Forecast API returned ${res.status}: ${res.statusText}`);
      return [];
    }

    const data: OpenMeteoForecastResponse = await res.json();
    const d = data.daily;

    // Validate that we received daily data
    if (!d || !d.time || d.time.length === 0) {
      console.error('[WeatherEngine] Forecast API returned no daily data');
      return [];
    }

    const forecasts: DayForecast[] = d.time.map((date, index) => {
      const temperatureMax = d.temperature_2m_max[index] ?? 0;
      const temperatureMin = d.temperature_2m_min[index] ?? 0;
      const weatherCode = d.weathercode[index] ?? 0;
      const rainProbability = d.precipitation_probability_max[index] ?? 0;
      const windSpeed = d.windspeed_10m_max[index] ?? 0;
      const uvIndex = d.uv_index_max[index] ?? 0;
      const sunrise = formatTimeHHMM(d.sunrise[index] ?? '');
      const sunset = formatTimeHHMM(d.sunset[index] ?? '');

      // Deterministic outdoor safety check
      const isOutdoorSafe =
        rainProbability < 60 &&
        weatherCode < 65 &&
        temperatureMax < 42;

      const warnings = generateWarnings(
        weatherCode,
        temperatureMax,
        temperatureMin,
        rainProbability,
        windSpeed,
        uvIndex,
      );

      const indoorAlternatives = suggestIndoorAlternatives(isOutdoorSafe);

      return {
        date,
        day: index + 1,
        temperatureMax,
        temperatureMin,
        weatherCode,
        description: weatherCodeToDescription(weatherCode),
        rainProbability,
        windSpeed,
        uvIndex,
        sunrise,
        sunset,
        isOutdoorSafe,
        warnings,
        indoorAlternatives,
      };
    });

    return forecasts;
  } catch (err: unknown) {
    console.error(
      `[WeatherEngine] Failed to fetch forecast: ${err instanceof Error ? err.message : String(err)}`,
    );
    return [];
  }
}
