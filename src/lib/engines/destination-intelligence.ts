/**
 * Destination Intelligence Engine
 * 
 * Classifies, normalizes, and enriches any travel destination input.
 * Supports: cities, states, countries, temples, beaches, mountains, 
 * islands, attractions, UNESCO sites, national parks, etc.
 * 
 * This engine replaces the assumption that "destination = city".
 * Instead: "destination = travel intent"
 */

export type DestinationType =
  | 'city' | 'state' | 'country' | 'region'
  | 'tourist_attraction' | 'temple' | 'beach' | 'hill_station'
  | 'mountain' | 'island' | 'lake' | 'fort' | 'unesco_site'
  | 'national_park' | 'wildlife_sanctuary' | 'adventure_zone'
  | 'pilgrimage' | 'theme_park' | 'waterfall' | 'museum'
  | 'road_trip_route' | 'town' | 'village';

export interface NormalizedDestination {
  display_name: string;
  type: DestinationType;
  primary_city: string;
  district: string;
  state: string;
  country: string;
  coordinates: { lat: number; lon: number };
  recommended_stay: string;
  cluster_radius_km: number;
  nearby_clusters: string[];
}

export interface TripHub {
  name: string;
  type: 'primary' | 'secondary' | 'excursion';
  coordinates: { lat: number; lon: number };
  recommended_nights: number;
  nearby_attractions: string[];
}

export interface FeasibilityResult {
  destination: string;
  distance_km: number;
  travel_time_hours: number;
  classification: 'perfect_fit' | 'possible' | 'needs_overnight' | 'needs_extra_day' | 'not_recommended';
  confidence: number;
  recommendation: string;
}

// Distance classification rules (km → trip hub classification)
const DISTANCE_RULES = [
  { max: 30, label: 'Local sightseeing', hubType: 'excursion' as const },
  { max: 100, label: 'Half-day excursion', hubType: 'excursion' as const },
  { max: 250, label: 'Full-day excursion', hubType: 'excursion' as const },
  { max: 450, label: 'Secondary hub', hubType: 'secondary' as const },
  { max: Infinity, label: 'Overnight relocation', hubType: 'secondary' as const },
];

// Keyword-based destination type classification
const TYPE_KEYWORDS: Record<DestinationType, string[]> = {
  temple: ['temple', 'mandir', 'masjid', 'mosque', 'church', 'gurudwara', 'dargah', 'shrine', 'jyotirlinga', 'dham'],
  beach: ['beach', 'coast', 'shore', 'bay', 'cove'],
  hill_station: ['hill station', 'hills', 'ghats', 'hill'],
  mountain: ['mountain', 'mount', 'peak', 'summit', 'alps', 'himalaya', 'range'],
  island: ['island', 'atoll', 'archipelago'],
  lake: ['lake', 'tal', 'sar', 'reservoir'],
  fort: ['fort', 'fortress', 'castle', 'citadel', 'palace', 'qila', 'garh', 'wada'],
  waterfall: ['waterfall', 'falls', 'cascade'],
  national_park: ['national park', 'sanctuary', 'reserve', 'tiger reserve'],
  wildlife_sanctuary: ['wildlife', 'bird sanctuary', 'zoo'],
  museum: ['museum', 'gallery', 'exhibition'],
  theme_park: ['theme park', 'amusement', 'disneyland', 'legoland', 'water park'],
  tourist_attraction: ['statue', 'tower', 'monument', 'memorial', 'bridge', 'dam', 'wonder'],
  pilgrimage: ['kedarnath', 'badrinath', 'vaishno', 'amarnath', 'tirupati', 'char dham', 'kashi'],
  adventure_zone: ['trek', 'rafting', 'bungee', 'paragliding', 'skiing', 'diving', 'camping'],
  unesco_site: ['unesco', 'world heritage'],
  road_trip_route: ['road trip', 'highway', 'route'],
  region: ['rann', 'desert', 'valley', 'plateau', 'backwaters', 'sundarbans'],
  city: [],
  state: [],
  country: [],
  town: [],
  village: [],
};

// Recommended stay durations by type
const STAY_RECOMMENDATIONS: Record<DestinationType, string> = {
  city: '2-3 Days',
  state: '5-7 Days',
  country: '7-14 Days',
  region: '2-4 Days',
  tourist_attraction: '1 Day',
  temple: '2-4 Hours',
  beach: '1-2 Days',
  hill_station: '2-3 Days',
  mountain: '2-4 Days',
  island: '3-5 Days',
  lake: '1 Day',
  fort: '2-4 Hours',
  unesco_site: '1 Day',
  national_park: '1-2 Days',
  wildlife_sanctuary: '1 Day',
  adventure_zone: '1-2 Days',
  pilgrimage: '1-2 Days',
  theme_park: '1 Day',
  waterfall: '2-4 Hours',
  museum: '2-4 Hours',
  road_trip_route: '3-5 Days',
  town: '1-2 Days',
  village: '1 Day',
};

// Cluster radius by destination type
const CLUSTER_RADIUS: Record<DestinationType, number> = {
  city: 30,
  state: 200,
  country: 500,
  region: 100,
  tourist_attraction: 80,
  temple: 50,
  beach: 40,
  hill_station: 50,
  mountain: 60,
  island: 30,
  lake: 40,
  fort: 50,
  unesco_site: 60,
  national_park: 80,
  wildlife_sanctuary: 60,
  adventure_zone: 50,
  pilgrimage: 80,
  theme_park: 30,
  waterfall: 50,
  museum: 20,
  road_trip_route: 200,
  town: 40,
  village: 30,
};

/**
 * Classify a destination string into a DestinationType
 */
export function classifyDestination(name: string, addressDetails?: any): DestinationType {
  const lower = name.toLowerCase();

  // Check if address details indicate a state/country
  if (addressDetails) {
    if (addressDetails.state && !addressDetails.city && !addressDetails.town && !addressDetails.village) {
      return 'state';
    }
    if (addressDetails.country && !addressDetails.state && !addressDetails.city) {
      return 'country';
    }
  }

  // Keyword-based classification
  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    if (keywords.length === 0) continue;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return type as DestinationType;
      }
    }
  }

  return 'city'; // Default fallback
}

/**
 * Normalize a destination into a structured object
 */
export function normalizeDestination(
  displayName: string,
  type: DestinationType,
  coordinates: { lat: number; lon: number },
  addressDetails?: any
): NormalizedDestination {
  const city = addressDetails?.city || addressDetails?.town || addressDetails?.village || displayName;
  const district = addressDetails?.county || addressDetails?.state_district || '';
  const state = addressDetails?.state || '';
  const country = addressDetails?.country || 'India';

  return {
    display_name: displayName,
    type,
    primary_city: type === 'city' ? displayName : city,
    district,
    state,
    country,
    coordinates,
    recommended_stay: STAY_RECOMMENDATIONS[type] || '1-2 Days',
    cluster_radius_km: CLUSTER_RADIUS[type] || 50,
    nearby_clusters: [],
  };
}

/**
 * Calculate feasibility of visiting a must-visit place from the primary hub
 */
export function calculateFeasibility(
  hubCoords: { lat: number; lon: number },
  targetCoords: { lat: number; lon: number },
  destinationName: string,
  tripDurationDays: number
): FeasibilityResult {
  const distance = haversineKm(hubCoords.lat, hubCoords.lon, targetCoords.lat, targetCoords.lon);
  const travelTimeHours = distance / 50; // Assume ~50 km/h average in India

  let classification: FeasibilityResult['classification'];
  let confidence: number;
  let recommendation: string;

  if (distance <= 30) {
    classification = 'perfect_fit';
    confidence = 98;
    recommendation = 'Local attraction, easily accessible';
  } else if (distance <= 100) {
    classification = 'perfect_fit';
    confidence = 95;
    recommendation = 'Half-day excursion, highly recommended';
  } else if (distance <= 250 && tripDurationDays >= 3) {
    classification = 'possible';
    confidence = 85;
    recommendation = 'Full-day excursion, recommended for longer trips';
  } else if (distance <= 450 && tripDurationDays >= 5) {
    classification = 'needs_overnight';
    confidence = 70;
    recommendation = 'Requires overnight stay, plan as secondary hub';
  } else if (distance <= 450) {
    classification = 'needs_extra_day';
    confidence = 55;
    recommendation = 'Consider adding extra days for this destination';
  } else {
    classification = 'not_recommended';
    confidence = 30;
    recommendation = 'Too far for this trip duration, consider a separate trip';
  }

  return {
    destination: destinationName,
    distance_km: Math.round(distance),
    travel_time_hours: Math.round(travelTimeHours * 10) / 10,
    classification,
    confidence,
    recommendation,
  };
}

/**
 * Build trip hubs from primary destination + must-visit places
 */
export function buildTripHubs(
  primary: NormalizedDestination,
  mustVisitCoords: Array<{ name: string; coords: { lat: number; lon: number } }>,
  durationDays: number
): TripHub[] {
  const hubs: TripHub[] = [];

  // Primary hub
  hubs.push({
    name: primary.primary_city,
    type: 'primary',
    coordinates: primary.coordinates,
    recommended_nights: Math.max(1, durationDays - mustVisitCoords.length),
    nearby_attractions: [],
  });

  // Evaluate must-visit places
  for (const mv of mustVisitCoords) {
    const feasibility = calculateFeasibility(primary.coordinates, mv.coords, mv.name, durationDays);

    if (feasibility.classification === 'needs_overnight' || feasibility.classification === 'needs_extra_day') {
      hubs.push({
        name: mv.name,
        type: 'secondary',
        coordinates: mv.coords,
        recommended_nights: 1,
        nearby_attractions: [],
      });
    } else if (feasibility.classification === 'perfect_fit' || feasibility.classification === 'possible') {
      // Add as excursion from primary hub
      hubs.push({
        name: mv.name,
        type: 'excursion',
        coordinates: mv.coords,
        recommended_nights: 0,
        nearby_attractions: [],
      });
    }
  }

  return hubs;
}

/**
 * Haversine formula — distance between two coordinates in km
 */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
