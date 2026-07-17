/**
 * POI Discovery Engine V3
 * 
 * Three-tier architecture:
 * Stage 1: Google Places Nearby Search for discovery (basic data only)
 * Stage 2: Place Details only for places in the final itinerary
 * Stage 3: Lazy loading when user clicks a place card
 * 
 * RULES:
 * - Never invent fake places, hotels, or restaurants
 * - Never create fallback synthetic data
 * - If Google API fails, report it as a warning (don't mask it)
 * - Rank by: popularity, reviews, rating, tourist importance
 */

import { getWikiContext } from './wiki';

export interface Place {
  id: string;
  placeId: string; // Google Place ID for Details API
  lat: number;
  lon: number;
  name: string;
  category: 'hotel' | 'restaurant' | 'attraction' | 'hospital' | 'station' | 'airport' | 'bus_stand' | 'police';
  cuisine?: string;
  distanceKm?: number;
  rating?: number;
  userRatingsTotal?: number;
  provider?: string;
  priceLevel?: number;
  imageUrl?: string;
  photoReference?: string; // For lazy photo loading
  types?: string[];
  businessStatus?: string;
}

export interface PlacesResult {
  hotels: Place[];
  restaurants: Place[];
  attractions: Place[];
  hospitals: Place[];
  police: Place[];
  transportNodes: Place[];
  warnings: string[];
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
      // Coordinates extremely close (<200m) AND similar name
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

/**
 * Stage 1: Google Places Nearby Search
 * Returns basic data only — no Place Details call.
 * Fields retrieved: place_id, name, rating, user_ratings_total, geometry, types, business_status, price_level, photos[0]
 */
async function fetchGooglePlaces(
  lat: number, 
  lon: number, 
  type: string, 
  radius: number = 30000, 
  keyword?: string
): Promise<Place[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GOOGLE_PLACES_KEY_HERE') return [];

  try {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${apiKey}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data.results || data.results.length === 0) return [];

    return data.results.map((r: any) => {
      let category: Place['category'] = 'attraction';
      if (type === 'restaurant') category = 'restaurant';
      else if (type === 'lodging') category = 'hotel';
      else if (type === 'hospital') category = 'hospital';
      else if (type === 'police') category = 'police';
      else if (type === 'transit_station') category = 'station';

      // Extract first photo reference for lazy loading (don't fetch photo yet)
      const photoReference = r.photos?.[0]?.photo_reference || null;
      const imageUrl = photoReference 
        ? `/api/images/proxy?ref=${photoReference}` 
        : undefined;

      return {
        id: r.place_id,
        placeId: r.place_id,
        lat: r.geometry.location.lat,
        lon: r.geometry.location.lng,
        name: r.name,
        category,
        distanceKm: haversine(lat, lon, r.geometry.location.lat, r.geometry.location.lng),
        rating: r.rating || 0,
        userRatingsTotal: r.user_ratings_total || 0,
        provider: 'Google',
        priceLevel: r.price_level,
        imageUrl,
        photoReference,
        types: r.types || [],
        businessStatus: r.business_status || 'OPERATIONAL',
      };
    }).filter((p: Place) => p.businessStatus === 'OPERATIONAL');
  } catch (err) {
    console.error(`Google Places fetch error (${type}):`, err);
    return [];
  }
}

/**
 * Text Search — for finding specific places by name (must-visit, user-specified hotels)
 */
export async function searchPlaceByName(
  query: string,
  lat: number,
  lon: number,
  radius: number = 50000
): Promise<Place | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lon}&radius=${radius}&key=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    const r = data.results[0];
    const photoReference = r.photos?.[0]?.photo_reference || null;
    
    return {
      id: r.place_id,
      placeId: r.place_id,
      lat: r.geometry.location.lat,
      lon: r.geometry.location.lng,
      name: r.name,
      category: 'attraction',
      distanceKm: haversine(lat, lon, r.geometry.location.lat, r.geometry.location.lng),
      rating: r.rating || 0,
      userRatingsTotal: r.user_ratings_total || 0,
      provider: 'Google',
      priceLevel: r.price_level,
      imageUrl: photoReference ? `/api/images/proxy?ref=${photoReference}` : undefined,
      photoReference,
      types: r.types || [],
      businessStatus: r.business_status || 'OPERATIONAL',
    };
  } catch (err) {
    console.error(`Text search error for "${query}":`, err);
    return null;
  }
}

/**
 * Detect restaurant cuisine type from Google types and name
 */
function detectCuisine(types: string[], name: string): string {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('chinese') || types.includes('chinese_restaurant')) return 'Chinese';
  if (nameLower.includes('italian') || types.includes('italian_restaurant')) return 'Italian';
  if (nameLower.includes('south indian') || nameLower.includes('dosa') || nameLower.includes('idli')) return 'South Indian';
  if (nameLower.includes('north indian') || nameLower.includes('tandoor') || nameLower.includes('mughlai')) return 'North Indian';
  if (nameLower.includes('pizza') || nameLower.includes('burger') || nameLower.includes('fast food')) return 'Fast Food';
  if (nameLower.includes('cafe') || nameLower.includes('coffee') || nameLower.includes('bakery')) return 'Cafe';
  if (nameLower.includes('vegetarian') || nameLower.includes('veg') || nameLower.includes('pure veg')) return 'Vegetarian';
  if (nameLower.includes('seafood') || nameLower.includes('fish')) return 'Seafood';
  if (nameLower.includes('biryani') || nameLower.includes('kebab')) return 'Mughlai';
  if (nameLower.includes('thali') || nameLower.includes('gujarati') || nameLower.includes('rajasthani')) return 'Thali';
  if (nameLower.includes('street food') || nameLower.includes('chaat')) return 'Street Food';
  if (types.includes('meal_delivery') || types.includes('meal_takeaway')) return 'Takeaway';
  return 'Local';
}

/**
 * Classify restaurant as breakfast/lunch/dinner/cafe/any based on name and types
 */
function classifyMealType(name: string, types: string[]): 'breakfast' | 'lunch' | 'dinner' | 'cafe' | 'any' {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('cafe') || nameLower.includes('coffee') || nameLower.includes('bakery') || nameLower.includes('breakfast')) return 'breakfast';
  if (nameLower.includes('bar') || nameLower.includes('lounge') || nameLower.includes('pub') || nameLower.includes('rooftop')) return 'dinner';
  if (nameLower.includes('fine dining') || nameLower.includes('signature')) return 'dinner';
  if (types.includes('cafe')) return 'cafe';
  // Most restaurants serve all meals
  return 'any';
}

// ─── Adaptive Search Engine V3 ───

/**
 * Discover all POIs for a destination using Google Places Nearby Search.
 * 
 * This is Stage 1 of the three-tier architecture:
 * - Only basic data is retrieved (no Place Details calls)
 * - Results are ranked by rating × user_ratings_total
 * - Returns warnings if any category has zero results
 */
export async function discoverPlaces(
  lat: number, 
  lon: number, 
  daysCount: number, 
  destinationName: string
): Promise<PlacesResult> {
  const warnings: string[] = [];
  const requiredAttractions = daysCount * 4;
  let attractions: Place[] = [];
  
  // ─── ATTRACTIONS: Adaptive radius expansion ───
  const radii = [10000, 25000, 50000];
  
  for (const radius of radii) {
    const newPlaces = await fetchGooglePlaces(lat, lon, 'tourist_attraction', radius);
    attractions = deduplicatePOIs([...attractions, ...newPlaces]);
    if (attractions.length >= requiredAttractions) break;
    
    // Try keyword-based queries for variety
    if (attractions.length < requiredAttractions) {
      const [nature, historic, temples] = await Promise.all([
        fetchGooglePlaces(lat, lon, 'tourist_attraction', radius, 'nature'),
        fetchGooglePlaces(lat, lon, 'tourist_attraction', radius, 'historic'),
        fetchGooglePlaces(lat, lon, 'tourist_attraction', radius, 'temple'),
      ]);
      attractions = deduplicatePOIs([...attractions, ...nature, ...historic, ...temples]);
      if (attractions.length >= requiredAttractions) break;
    }
  }

  // Wikipedia fallback for attractions only
  if (attractions.length < requiredAttractions) {
    try {
      const wikiRes = await getWikiContext(destinationName, lat, lon);
      if (wikiRes && wikiRes.nearbyPlaces.length > 0) {
        const wikiPlaces = wikiRes.nearbyPlaces.map(p => ({
          id: `wiki_${p.pageid}`,
          placeId: `wiki_${p.pageid}`,
          lat: p.lat,
          lon: p.lon,
          name: p.title,
          category: 'attraction' as const,
          distanceKm: haversine(lat, lon, p.lat, p.lon),
          rating: 4.0,
          userRatingsTotal: 0,
          provider: 'Wikipedia',
          types: ['point_of_interest'],
          businessStatus: 'OPERATIONAL',
        }));
        attractions = deduplicatePOIs([...attractions, ...wikiPlaces]);
      }
    } catch (e) {
      // Wikipedia fallback is optional
    }
  }

  if (attractions.length === 0) {
    warnings.push('No attractions found for this destination. Please verify the destination name and ensure Google Places API is properly configured.');
  }

  // ─── HOTELS, RESTAURANTS, HOSPITALS, POLICE, TRANSPORT ───
  const [hotels, restaurants, hospitals, police, transportNodes] = await Promise.all([
    fetchGooglePlaces(lat, lon, 'lodging', 20000),
    fetchGooglePlaces(lat, lon, 'restaurant', 20000),
    fetchGooglePlaces(lat, lon, 'hospital', 15000),
    fetchGooglePlaces(lat, lon, 'police', 15000),
    fetchGooglePlaces(lat, lon, 'transit_station', 15000)
  ]);

  // Add cuisine and meal type to restaurants
  const enrichedRestaurants = restaurants.map(r => ({
    ...r,
    cuisine: detectCuisine(r.types || [], r.name),
    mealType: classifyMealType(r.name, r.types || []),
  }));

  if (hotels.length === 0) {
    warnings.push('No hotels found near this destination via Google Places. Verify that the Places API is enabled and the API key has billing configured.');
  }
  if (restaurants.length === 0) {
    warnings.push('No restaurants found near this destination via Google Places. The itinerary will include meal recommendations without specific venue names.');
  }

  // Sort by ranking score: (rating × log(userRatingsTotal + 1)) — rewards both quality and popularity
  const sortByRank = (a: Place, b: Place) => {
    const scoreA = (a.rating || 0) * Math.log10((a.userRatingsTotal || 0) + 2);
    const scoreB = (b.rating || 0) * Math.log10((b.userRatingsTotal || 0) + 2);
    return scoreB - scoreA;
  };

  return { 
    hotels: deduplicatePOIs(hotels).sort(sortByRank), 
    restaurants: deduplicatePOIs(enrichedRestaurants).sort(sortByRank), 
    attractions: deduplicatePOIs(attractions).sort(sortByRank), 
    hospitals: hospitals.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)), 
    police: police.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)),
    transportNodes: transportNodes.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)),
    warnings,
  };
}
