import { NextResponse } from 'next/server';

/**
 * Destination Search Autocomplete API
 * 
 * Searches for any travel destination: cities, temples, beaches,
 * mountains, attractions, states, countries, etc.
 * Uses Nominatim (OpenStreetMap) for geocoding.
 */

const searchCache = new Map<string, { data: any; expires: number }>();
const SEARCH_CACHE_TTL = 60 * 60 * 1000; // 1 hour

function classifyDestination(types: string[]): string {
  if (types.includes('country')) return 'country';
  if (types.includes('administrative_area_level_1')) return 'state';
  if (types.includes('locality') || types.includes('sublocality')) return 'city';
  if (types.includes('natural_feature')) return 'nature';
  if (types.includes('point_of_interest')) return 'attraction';
  if (types.includes('airport')) return 'airport';
  if (types.includes('train_station')) return 'station';
  return 'place';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }
    
    const cacheKey = query.toLowerCase();
    const cached = searchCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return NextResponse.json({ results: cached.data }, {
        headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
      });
    }

    // Nominatim geocoding search
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1&accept-language=en`,
      {
        headers: {
          'User-Agent': 'Tripvora-TripPlanner/1.0',
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await response.json();

    // Type detection keywords
    const typeKeywords: Record<string, string[]> = {
      'Temple': ['temple', 'mandir', 'masjid', 'mosque', 'church', 'gurudwara', 'dargah', 'shrine'],
      'Beach': ['beach', 'coast', 'shore', 'bay'],
      'Hill Station': ['hill station', 'hills'],
      'Mountain': ['mountain', 'mount', 'peak', 'alps', 'himalaya'],
      'Island': ['island', 'atoll'],
      'Lake': ['lake', 'tal', 'sar'],
      'Fort': ['fort', 'fortress', 'castle', 'palace', 'qila', 'wada'],
      'Waterfall': ['waterfall', 'falls'],
      'National Park': ['national park', 'sanctuary', 'reserve'],
      'Museum': ['museum', 'gallery'],
      'Theme Park': ['theme park', 'amusement', 'disneyland', 'water park'],
      'Tourist Attraction': ['statue', 'tower', 'monument', 'memorial', 'dam', 'bridge'],
    };

    // Icon mapping
    const typeIcons: Record<string, string> = {
      'Temple': '🛕',
      'Beach': '🏖️',
      'Hill Station': '⛰️',
      'Mountain': '🏔️',
      'Island': '🏝️',
      'Lake': '🌊',
      'Fort': '🏰',
      'Waterfall': '💧',
      'National Park': '🌿',
      'Museum': '🏛️',
      'Theme Park': '🎢',
      'Tourist Attraction': '⭐',
      'City': '🏙️',
      'State': '📍',
      'Country': '🌍',
      'Region': '🗺️',
      'Town': '🏘️',
      'Village': '🏡',
    };

    const results = data.map((item: any) => {
      const name = item.address?.city || item.address?.town || item.address?.village ||
                   item.address?.state || item.address?.country || item.display_name?.split(',')[0] || '';
      const displayName = item.display_name || '';
      const lower = displayName.toLowerCase();

      // Detect type
      let type = 'City';
      if (item.address?.state && !item.address?.city && !item.address?.town && !item.address?.village) {
        type = 'State';
      } else if (item.address?.country && !item.address?.state) {
        type = 'Country';
      } else {
        for (const [typeName, keywords] of Object.entries(typeKeywords)) {
          if (keywords.some(kw => lower.includes(kw))) {
            type = typeName;
            break;
          }
        }
      }

      // Build parent region string
      const parts: string[] = [];
      if (item.address?.state && type !== 'State') parts.push(item.address.state);
      if (item.address?.country) parts.push(item.address.country);
      const parentRegion = parts.join(', ');

      return {
        name: name.trim(),
        type,
        destinationType: classifyDestination([item.class, item.type].filter(Boolean) as string[]),
        icon: typeIcons[type] || '📍',
        parentRegion,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        displayName: displayName,
        addressDetails: item.address || {},
      };
    });

    // Deduplicate by name
    const seen = new Set<string>();
    const unique = results.filter((r: any) => {
      const key = `${r.name}-${r.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Update cache
    searchCache.set(cacheKey, { data: unique, expires: Date.now() + SEARCH_CACHE_TTL });

    return NextResponse.json({ results: unique }, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
    });
  } catch (error: any) {
    console.error('Destination search error:', error.message);
    return NextResponse.json({ results: [] });
  }
}
