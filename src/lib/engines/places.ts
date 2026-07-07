import { getWikiContext } from './wiki';

export interface Place {
  id: string;
  lat: number;
  lon: number;
  name: string;
  category: 'hotel' | 'restaurant' | 'attraction' | 'hospital' | 'station' | 'airport' | 'bus_stand';
  cuisine?: string;
  distanceKm?: number;
  rating?: number;
  provider?: string;
  priceLevel?: number;
  imageUrl?: string;
}

export interface PlacesResult {
  hotels: Place[];
  restaurants: Place[];
  attractions: Place[];
  hospitals: Place[];
  police: Place[];
  transportNodes: Place[];
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─── Deduplication Engine ───
function deduplicatePOIs(places: Place[]): Place[] {
  const unique: Place[] = [];
  
  for (const p of places) {
    const isDuplicate = unique.some(u => {
      // Exact ID match
      if (u.id === p.id) return true;
      // Coordinates extremely close (< 200m) AND similar name
      const dist = haversine(u.lat, u.lon, p.lat, p.lon);
      if (dist < 0.2) {
        const nameA = u.name.toLowerCase().replace(/[^a-z]/g, '');
        const nameB = p.name.toLowerCase().replace(/[^a-z]/g, '');
        if (nameA.includes(nameB) || nameB.includes(nameA)) return true;
      }
      return false;
    });

    if (!isDuplicate) {
      unique.push(p);
    }
  }
  
  return unique;
}

async function fetchGooglePlaces(lat: number, lon: number, type: string, radius: number = 30000, keyword?: string): Promise<Place[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GOOGLE_PLACES_KEY_HERE') return [];

  try {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${apiKey}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data.results || data.results.length === 0) return [];

    return data.results.map((r: any) => {
      let category: Place['category'] = 'attraction';
      if (type === 'restaurant') category = 'restaurant';
      else if (type === 'lodging') category = 'hotel';
      else if (type === 'hospital') category = 'hospital';
      else if (type === 'police') category = 'station';
      else if (type === 'transit_station') category = 'station';

      let imageUrl;
      if (r.photos && r.photos.length > 0) {
        imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${r.photos[0].photo_reference}&key=${apiKey}`;
      }

      return {
        id: r.place_id,
        lat: r.geometry.location.lat,
        lon: r.geometry.location.lng,
        name: r.name,
        category,
        distanceKm: haversine(lat, lon, r.geometry.location.lat, r.geometry.location.lng),
        rating: r.rating || 4.0,
        provider: 'Google',
        priceLevel: r.price_level,
        imageUrl
      };
    });
  } catch (err) {
    return [];
  }
}

// ─── Adaptive Search Engine ───
export async function discoverPlaces(lat: number, lon: number, daysCount: number, destinationName: string): Promise<PlacesResult> {
  const requiredAttractions = daysCount * 4;
  let attractions: Place[] = [];
  
  // RADIUS EXPANSION LOOP
  const radii = [10000, 25000, 50000];
  
  for (const radius of radii) {
    const newPlaces = await fetchGooglePlaces(lat, lon, 'tourist_attraction', radius);
    attractions = deduplicatePOIs([...attractions, ...newPlaces]);
    if (attractions.length >= requiredAttractions) break;
    
    // If still short, try querying with specific keywords to force different results
    if (attractions.length < requiredAttractions) {
       const nature = await fetchGooglePlaces(lat, lon, 'tourist_attraction', radius, 'nature');
       const historic = await fetchGooglePlaces(lat, lon, 'tourist_attraction', radius, 'historic');
       attractions = deduplicatePOIs([...attractions, ...nature, ...historic]);
       if (attractions.length >= requiredAttractions) break;
    }
  }

  // WIKIPEDIA FALLBACK
  if (attractions.length < requiredAttractions) {
    try {
      const wikiRes = await getWikiContext(destinationName, lat, lon);
      if (wikiRes && wikiRes.nearbyPlaces.length > 0) {
        const wikiPlaces = wikiRes.nearbyPlaces.map(p => ({
          id: `wiki_${p.pageid}`,
          lat: p.lat,
          lon: p.lon,
          name: p.title,
          category: 'attraction' as const,
          distanceKm: haversine(lat, lon, p.lat, p.lon),
          rating: 4.0,
          provider: 'Wikipedia'
        }));
        attractions = deduplicatePOIs([...attractions, ...wikiPlaces]);
      }
    } catch (e) {
      // ignore
    }
  }

  // Execute standard fetches for others (radius 10km for essentials, 20km for hotels/restaurants)
  const [hotels, restaurants, hospitals, police, transportNodes] = await Promise.all([
    fetchGooglePlaces(lat, lon, 'lodging', 20000),
    fetchGooglePlaces(lat, lon, 'restaurant', 20000),
    fetchGooglePlaces(lat, lon, 'hospital', 15000),
    fetchGooglePlaces(lat, lon, 'police', 15000),
    fetchGooglePlaces(lat, lon, 'transit_station', 15000)
  ]);

  return { 
    hotels: deduplicatePOIs(hotels).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)), 
    restaurants: deduplicatePOIs(restaurants).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)), 
    attractions: attractions.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)), 
    hospitals: hospitals.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)), 
    police: police.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)),
    transportNodes: transportNodes.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
  };
}
