export interface GeoResult {
  lat: number;
  lon: number;
  displayName: string;
}

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

export async function geocode(query: string): Promise<GeoResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Tripvora/1.0' },
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) return null;

    const data: NominatimResponse[] = await res.json();
    if (!data.length) return null;

    const first = data[0];
    const lat = parseFloat(first.lat);
    const lon = parseFloat(first.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

    return {
      lat,
      lon,
      displayName: first.display_name,
    };
  } catch (err: unknown) {
    throw new Error(`GEOCODING_FAILED: Failed to geocode "${query}" - ${err instanceof Error ? err.message : String(err)}`);
  }
}
