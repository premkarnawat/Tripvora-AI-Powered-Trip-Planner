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
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
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
  const natural = tags['natural'] ?? '';
  const leisure = tags['leisure'] ?? '';

  if (/hotel|resort|guest_house|motel|hostel/.test(tourism)) return 'hotel';
  if (/restaurant|cafe|fast_food|food_court/.test(amenity)) return 'restaurant';
  if (/attraction|viewpoint|museum|gallery|zoo|theme_park|aquarium/.test(tourism)) return 'attraction';
  if (/monument|castle|fort|memorial|ruins|temple|church|mosque/.test(historic)) return 'attraction';
  if (amenity === 'place_of_worship') return 'attraction';
  if (/beach|peak|waterfall|cave_entrance/.test(natural)) return 'attraction';
  if (/park|garden|nature_reserve|water_park/.test(leisure)) return 'attraction';
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
    const query = `[out:json][timeout:12];
(
  node["tourism"~"hotel|resort|guest_house|motel|hostel"](around:8000,${lat},${lon});
  node["amenity"~"restaurant|cafe|fast_food|food_court"](around:8000,${lat},${lon});
  node["tourism"~"attraction|viewpoint|museum|gallery|zoo|theme_park|aquarium"](around:15000,${lat},${lon});
  way["tourism"~"attraction|viewpoint|museum|gallery|zoo|theme_park"](around:15000,${lat},${lon});
  node["historic"~"monument|castle|fort|memorial|ruins|temple|church|mosque"](around:15000,${lat},${lon});
  way["historic"~"monument|castle|fort|memorial|ruins"](around:15000,${lat},${lon});
  node["amenity"~"place_of_worship"](around:10000,${lat},${lon});
  node["natural"~"beach|peak|waterfall|cave_entrance"](around:15000,${lat},${lon});
  node["leisure"~"park|garden|nature_reserve|water_park"](around:10000,${lat},${lon});
  node["amenity"~"hospital|clinic"](around:10000,${lat},${lon});
  node["railway"~"station|halt"](around:100000,${lat},${lon});
  node["aeroway"="aerodrome"](around:150000,${lat},${lon});
  way["aeroway"="aerodrome"](around:150000,${lat},${lon});
  node["amenity"="bus_station"](around:60000,${lat},${lon});
);
out center 150;`;

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return empty;

    const data: OverpassResponse = await res.json();

    const hotels: OSMPlace[] = [];
    const restaurants: OSMPlace[] = [];
    const attractions: OSMPlace[] = [];
    const hospitals: OSMPlace[] = [];
    const transportNodes: OSMPlace[] = [];

    const seenNames = new Set<string>();

    for (const el of data.elements) {
      const tags = el.tags;
      if (!tags || !tags['name']) continue;

      // Deduplicate by name
      const nameLower = tags['name'].toLowerCase();
      if (seenNames.has(nameLower)) continue;
      seenNames.add(nameLower);

      const category = categorize(tags);
      if (!category) continue;

      // Handle way elements (use center coordinates)
      const elLat = el.lat ?? el.center?.lat;
      const elLon = el.lon ?? el.center?.lon;
      if (elLat === undefined || elLon === undefined) continue;

      const distanceKm = haversine(lat, lon, elLat, elLon);

      const place: OSMPlace = {
        id: el.id,
        lat: elLat,
        lon: elLon,
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
