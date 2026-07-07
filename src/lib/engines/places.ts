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

async function fetchGooglePlaces(lat: number, lon: number, type: string, radius: number = 5000): Promise<Place[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GOOGLE_PLACES_KEY_HERE') {
    console.warn(`[Places API] Missing key. Returning empty array for ${type}.`);
    return [];
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((r: any) => {
      let category: Place['category'] = 'attraction';
      if (type === 'restaurant') category = 'restaurant';
      else if (type === 'lodging') category = 'hotel';
      else if (type === 'hospital') category = 'hospital';
      else if (type === 'police') category = 'station';
      else if (type === 'transit_station') category = 'station';

      return {
        id: r.place_id,
        lat: r.geometry.location.lat,
        lon: r.geometry.location.lng,
        name: r.name,
        category,
        distanceKm: haversine(lat, lon, r.geometry.location.lat, r.geometry.location.lng),
        rating: r.rating || 4.0,
        provider: 'GooglePlacesAPI',
        priceLevel: r.price_level
      };
    });
  } catch (err) {
    console.warn(`[Places API] Fetch failed for ${type}. Returning empty array.`);
    return [];
  }
}

export async function discoverPlaces(lat: number, lon: number): Promise<PlacesResult> {
  // Execute real API calls concurrently
  const [hotels, restaurants, attractions, hospitals, police, transportNodes] = await Promise.all([
    fetchGooglePlaces(lat, lon, 'lodging', 5000).catch(e => { throw e; }),
    fetchGooglePlaces(lat, lon, 'restaurant', 5000).catch(e => { throw e; }),
    fetchGooglePlaces(lat, lon, 'tourist_attraction', 10000).catch(e => { throw e; }),
    fetchGooglePlaces(lat, lon, 'hospital', 10000).catch(e => { throw e; }),
    fetchGooglePlaces(lat, lon, 'police', 10000).catch(e => { throw e; }),
    fetchGooglePlaces(lat, lon, 'transit_station', 10000).catch(e => { throw e; })
  ]);

  return { 
    hotels: hotels.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)), 
    restaurants: restaurants.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)), 
    attractions: attractions.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)), 
    hospitals: hospitals.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)), 
    police: police.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)),
    transportNodes: transportNodes.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
  };
}
