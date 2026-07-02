export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  description: string;
  rainProbability: number;
  uvIndex: number;
}

interface OpenMeteoResponse {
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

function weatherCodeToDescription(code: number): string {
  if (code === 0) return 'Clear sky';
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

    const data: OpenMeteoResponse = await res.json();

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
  } catch {
    return null;
  }
}
