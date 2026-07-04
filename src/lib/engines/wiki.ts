export interface WikiResult {
  extract: string;
  thumbnail: string | null;
  nearbyPlaces: Array<{ title: string; lat: number; lon: number; pageid: number }>;
}

interface WikiSummaryResponse {
  extract: string;
  thumbnail?: {
    source: string;
  };
}

interface GeosearchEntry {
  pageid: number;
  title: string;
  lat: number;
  lon: number;
}

interface GeosearchResponse {
  query?: {
    geosearch?: GeosearchEntry[];
  };
}

export async function getWikiContext(
  destination: string,
  lat: number,
  lon: number,
): Promise<WikiResult | null> {
  try {
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination)}`;
    const geoUrl =
      `https://en.wikipedia.org/w/api.php` +
      `?action=query&list=geosearch` +
      `&gscoord=${lat}|${lon}` +
      `&gsradius=10000&gslimit=20&format=json`;

    const [summaryResult, geoResult] = await Promise.allSettled([
      fetch(summaryUrl, { signal: AbortSignal.timeout(3000) }),
      fetch(geoUrl, { signal: AbortSignal.timeout(3000) }),
    ]);

    let extract = '';
    let thumbnail: string | null = null;
    let nearbyPlaces: WikiResult['nearbyPlaces'] = [];

    if (summaryResult.status === 'fulfilled' && summaryResult.value.ok) {
      const summary: WikiSummaryResponse = await summaryResult.value.json();
      extract = summary.extract ?? '';
      thumbnail = summary.thumbnail?.source ?? null;
    }

    if (geoResult.status === 'fulfilled' && geoResult.value.ok) {
      const geo: GeosearchResponse = await geoResult.value.json();
      const entries = geo.query?.geosearch ?? [];
      nearbyPlaces = entries.map((entry) => ({
        title: entry.title,
        lat: entry.lat,
        lon: entry.lon,
        pageid: entry.pageid,
      }));
    }

    if (!extract && nearbyPlaces.length === 0) return null;

    return { extract, thumbnail, nearbyPlaces };
  } catch (err: unknown) {
    throw new Error(`WIKI_FETCH_FAILED: Failed to fetch Wikipedia context - ${err instanceof Error ? err.message : String(err)}`);
  }
}
