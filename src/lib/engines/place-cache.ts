/**
 * Place Cache Engine — Three-Tier Caching Strategy
 * 
 * Stage 1: Nearby Search (basic data, no cache needed)
 * Stage 2: Place Details API (ONLY for final itinerary places)
 * Stage 3: Lazy loading (user clicks → fetch on demand)
 * Stage 4: In-memory Map cache with TTL
 * Stage 5: Background refresh for popular destinations (TODO: future feature)
 * 
 * Image Priority: Google Places Photo → Wikimedia → Wikipedia → Unsplash fallback
 */

import { CachedPlaceDetails, DayOpeningHours, CACHE_TTL } from '@/lib/types/blueprint';

// ─── In-Memory Cache ────────────────────────────────────────────────

const placeCache = new Map<string, CachedPlaceDetails>();
let cacheHits = 0;
let cacheMisses = 0;

/**
 * Check if a cached entry exists and is still valid
 */
export function getCachedPlace(placeId: string): CachedPlaceDetails | null {
  const entry = placeCache.get(placeId);
  if (!entry) {
    cacheMisses++;
    return null;
  }

  // Check TTL
  const now = new Date();
  const expires = new Date(entry.expiresAt);
  if (now > expires) {
    placeCache.delete(placeId);
    cacheMisses++;
    return null;
  }

  cacheHits++;
  return entry;
}

/**
 * Determine cache TTL based on place type
 */
function getTTLHours(types: string[]): number {
  if (types.some(t => t.includes('lodging') || t.includes('hotel'))) return CACHE_TTL.hotels;
  if (types.some(t => t.includes('restaurant') || t.includes('food') || t.includes('cafe'))) return CACHE_TTL.restaurants;
  return CACHE_TTL.attractions;
}

/**
 * Parse Google Places opening_hours into our DayOpeningHours format
 */
function parseOpeningHours(openingHours: any): DayOpeningHours[] | null {
  if (!openingHours?.periods) return null;

  return openingHours.periods.map((period: any) => ({
    day: period.open?.day ?? 0,
    open: period.open?.time
      ? `${period.open.time.slice(0, 2)}:${period.open.time.slice(2)}`
      : '00:00',
    close: period.close?.time
      ? `${period.close.time.slice(0, 2)}:${period.close.time.slice(2)}`
      : '23:59',
  }));
}

/**
 * Stage 2: Fetch place details from Google Places API and cache
 * Only called for places that make it into the final itinerary
 */
export async function fetchPlaceDetails(placeId: string): Promise<CachedPlaceDetails | null> {
  // Check cache first
  const cached = getCachedPlace(placeId);
  if (cached) return cached;

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  // Minimal fields to reduce cost (~$17/1000 calls with these fields)
  const fields = 'name,formatted_address,formatted_phone_number,website,opening_hours,photos,rating,user_ratings_total,price_level,types';

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 'OK' || !data.result) return null;

    const r = data.result;
    const types = r.types || [];
    const ttlHours = getTTLHours(types);
    const now = new Date();

    // Extract photo references (don't fetch photos yet — lazy load)
    const photos = (r.photos || []).slice(0, 5).map((p: any) => p.photo_reference);

    const details: CachedPlaceDetails = {
      placeId,
      name: r.name || '',
      openingHours: parseOpeningHours(r.opening_hours),
      phone: r.formatted_phone_number || null,
      website: r.website || null,
      photos,
      rating: r.rating || 0,
      userRatingsTotal: r.user_ratings_total || 0,
      formattedAddress: r.formatted_address || null,
      priceLevel: r.price_level ?? null,
      types,
      lastUpdated: now.toISOString(),
      expiresAt: new Date(now.getTime() + ttlHours * 3600000).toISOString(),
    };

    // Save to cache
    placeCache.set(placeId, details);

    return details;
  } catch (err) {
    console.error(`Place Details fetch error for ${placeId}:`, err);
    return null;
  }
}

/**
 * Batch fetch details for multiple places
 * Only fetches cache misses — returns all results (cached + fresh)
 */
export async function batchFetchPlaceDetails(
  placeIds: string[]
): Promise<Map<string, CachedPlaceDetails>> {
  const results = new Map<string, CachedPlaceDetails>();
  const toFetch: string[] = [];

  // Check cache first
  for (const id of placeIds) {
    const cached = getCachedPlace(id);
    if (cached) {
      results.set(id, cached);
    } else {
      toFetch.push(id);
    }
  }

  // Fetch cache misses in parallel (max 5 concurrent to avoid rate limits)
  const batchSize = 5;
  for (let i = 0; i < toFetch.length; i += batchSize) {
    const batch = toFetch.slice(i, i + batchSize);
    const fetched = await Promise.allSettled(
      batch.map(id => fetchPlaceDetails(id))
    );

    fetched.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value) {
        results.set(batch[idx], result.value);
      }
    });
  }

  return results;
}

/**
 * Get Google Places Photo URL
 * Only call this for places actually displayed to the user
 */
export function getPlacePhotoUrl(photoReference: string, maxWidth: number = 400): string {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || !photoReference) return '';
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`;
}

/**
 * Get place image with priority fallback:
 * 1. Google Places Photo (if photoReference available)
 * 2. Wikimedia Commons
 * 3. Wikipedia
 * 4. Empty string (frontend uses placeholder)
 */
export async function getPlaceImage(place: {
  name: string;
  placeId?: string;
  photoReference?: string;
}): Promise<string> {
  // 1. Google Places Photo (via proxy to avoid exposing API key)
  if (place.photoReference) {
    return `/api/images/proxy?ref=${place.photoReference}`;
  }

  // 2. Wikipedia thumbnail
  try {
    const encodedName = encodeURIComponent(place.name);
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodedName}&pithumbsize=600&format=json&origin=*`;
    const res = await fetch(wikiUrl, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      const pages = data?.query?.pages;
      if (pages) {
        const firstPageId = Object.keys(pages)[0];
        const thumbnail = pages[firstPageId]?.thumbnail?.source;
        if (thumbnail) return thumbnail;
      }
    }
  } catch {
    // Fallback silently
  }

  // 3. No image available
  return '';
}

/**
 * Clear expired cache entries
 */
export function cleanExpiredCache(): void {
  const now = new Date();
  for (const [key, entry] of placeCache.entries()) {
    if (now > new Date(entry.expiresAt)) {
      placeCache.delete(key);
    }
  }
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats(): { total: number; hits: number; misses: number; hitRate: string } {
  const total = cacheHits + cacheMisses;
  return {
    total: placeCache.size,
    hits: cacheHits,
    misses: cacheMisses,
    hitRate: total > 0 ? `${((cacheHits / total) * 100).toFixed(1)}%` : '0%',
  };
}
