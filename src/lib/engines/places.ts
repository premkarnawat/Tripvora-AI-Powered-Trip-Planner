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

function simulateGooglePlaces(lat: number, lon: number, type: string, count: number): Place[] {
  const results: Place[] = [];
  const categories = {
    'restaurant': ['The Grand Dining', 'Spicy Corner', 'Ocean View Restaurant', 'City Bistro', 'Street Eats'],
    'tourist_attraction': ['Central Museum', 'Historic Fort', 'City Botanical Garden', 'Sunset Point', 'Old Town Square'],
    'hospital': ['City General Hospital', 'Care Clinic', 'Metro Health Center'],
    'transit_station': ['Central Railway Station', 'City Bus Terminal', 'Metro Hub']
  };

  const names = categories[type as keyof typeof categories] || ['Generic Place'];
  
  for (let i = 0; i < count; i++) {
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lonOffset = (Math.random() - 0.5) * 0.1;
    const pLat = lat + latOffset;
    const pLon = lon + lonOffset;
    
    let category: Place['category'] = 'attraction';
    if (type === 'restaurant') category = 'restaurant';
    else if (type === 'hospital') category = 'hospital';
    else if (type === 'transit_station') category = 'station';

    results.push({
      id: `gplaces_${type}_${i}`,
      lat: pLat,
      lon: pLon,
      name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
      category,
      distanceKm: haversine(lat, lon, pLat, pLon),
      rating: 3.5 + Math.random() * 1.5,
      provider: 'GooglePlacesAPI_Simulated'
    });
  }
  return results;
}

function simulateBookingAffiliateHotels(lat: number, lon: number, count: number): Place[] {
  const results: Place[] = [];
  const brands = ['Marriott', 'Hilton', 'Radisson', 'Holiday Inn', 'Local Boutique', 'Backpacker Hostel'];
  
  for (let i = 0; i < count; i++) {
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lonOffset = (Math.random() - 0.5) * 0.05;
    const pLat = lat + latOffset;
    const pLon = lon + lonOffset;
    
    results.push({
      id: `booking_aff_${i}`,
      lat: pLat,
      lon: pLon,
      name: brands[i % brands.length] + ' Hotel',
      category: 'hotel',
      distanceKm: haversine(lat, lon, pLat, pLon),
      rating: 3.0 + Math.random() * 2.0,
      provider: 'Booking/Agoda Mock Affiliate',
      priceLevel: Math.floor(Math.random() * 5) + 1
    });
  }
  return results;
}

export async function discoverPlaces(lat: number, lon: number): Promise<PlacesResult> {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const hotels = simulateBookingAffiliateHotels(lat, lon, 10).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  const restaurants = simulateGooglePlaces(lat, lon, 'restaurant', 15).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  const attractions = simulateGooglePlaces(lat, lon, 'tourist_attraction', 15).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  const hospitals = simulateGooglePlaces(lat, lon, 'hospital', 3).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  const transportNodes = simulateGooglePlaces(lat, lon, 'transit_station', 5).sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  return { hotels, restaurants, attractions, hospitals, transportNodes };
}
