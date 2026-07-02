export interface OSMPlace {
  id: number;
  lat: number;
  lon: number;
  name: string;
  category: 'hotel' | 'restaurant' | 'attraction' | 'hospital' | 'station' | 'airport' | 'bus_stand';
  cuisine?: string;
  distanceKm?: number;
}

export interface PlacesResult {
  hotels: OSMPlace[];
  restaurants: OSMPlace[];
  attractions: OSMPlace[];
  hospitals: OSMPlace[];
  transportNodes: OSMPlace[];
}

interface OverpassElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
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

function categorize(tags: Record<string, string>): OSMPlace['category'] | null {
  const tourism = tags['tourism'] ?? '';
  const amenity = tags['amenity'] ?? '';
  const historic = tags['historic'] ?? '';
  const railway = tags['railway'] ?? '';
  const aeroway = tags['aeroway'] ?? '';

  if (/hotel|resort|guest_house/.test(tourism)) return 'hotel';
  if (/restaurant|cafe|fast_food/.test(amenity)) return 'restaurant';
  if (/attraction|viewpoint|museum|gallery/.test(tourism)) return 'attraction';
  if (/monument|castle|fort|memorial/.test(historic)) return 'attraction';
  if (/hospital|clinic/.test(amenity)) return 'hospital';
  if (/station|halt/.test(railway)) return 'station';
  if (aeroway === 'aerodrome') return 'airport';
  if (amenity === 'bus_station') return 'bus_stand';

  return null;
}

export async function discoverPlaces(lat: number, lon: number): Promise<PlacesResult> {
  const empty: PlacesResult = {
    hotels: [],
    restaurants: [],
    attractions: [],
    hospitals: [],
    transportNodes: [],
  };

  try {
    const query = `[out:json][timeout:8];
(
  node["tourism"~"hotel|resort|guest_house"](around:5000,${lat},${lon});
  node["amenity"~"restaurant|cafe|fast_food"](around:5000,${lat},${lon});
  node["tourism"~"attraction|viewpoint|museum|gallery"](around:5000,${lat},${lon});
  node["historic"~"monument|castle|fort|memorial"](around:5000,${lat},${lon});
  node["amenity"~"hospital|clinic"](around:5000,${lat},${lon});
  node["railway"~"station|halt"](around:80000,${lat},${lon});
  node["aeroway"="aerodrome"](around:80000,${lat},${lon});
  node["amenity"="bus_station"](around:40000,${lat},${lon});
);
out body 80;`;

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return empty;

    const data: OverpassResponse = await res.json();

    const hotels: OSMPlace[] = [];
    const restaurants: OSMPlace[] = [];
    const attractions: OSMPlace[] = [];
    const hospitals: OSMPlace[] = [];
    const transportNodes: OSMPlace[] = [];

    for (const el of data.elements) {
      const tags = el.tags;
      if (!tags || !tags['name']) continue;

      const category = categorize(tags);
      if (!category) continue;

      const distanceKm = haversine(lat, lon, el.lat, el.lon);

      const place: OSMPlace = {
        id: el.id,
        lat: el.lat,
        lon: el.lon,
        name: tags['name'],
        category,
        distanceKm,
      };

      if (tags['cuisine']) {
        place.cuisine = tags['cuisine'];
      }

      switch (category) {
        case 'hotel':
          hotels.push(place);
          break;
        case 'restaurant':
          restaurants.push(place);
          break;
        case 'attraction':
          attractions.push(place);
          break;
        case 'hospital':
          hospitals.push(place);
          break;
        case 'station':
        case 'airport':
        case 'bus_stand':
          transportNodes.push(place);
          break;
      }
    }

    const byDistance = (a: OSMPlace, b: OSMPlace) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0);
    hotels.sort(byDistance);
    restaurants.sort(byDistance);
    attractions.sort(byDistance);
    hospitals.sort(byDistance);
    transportNodes.sort(byDistance);

    return { hotels, restaurants, attractions, hospitals, transportNodes };
  } catch {
    return empty;
  }
}
