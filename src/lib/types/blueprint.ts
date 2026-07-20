// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRIPVORA — Trip Blueprint Type Definitions (V3 Two-Phase Architecture)
// Central type definitions for the entire itinerary generation pipeline.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── User Preferences (echoed from Wizard) ──────────────────────────────

export interface UserPreferences {
  source: string;
  sourceCoords: { lat: number; lon: number } | null;
  destination: string;
  destinationCoords: { lat: number; lon: number } | null;
  destinationType: string;
  tripDates: { start: string; end: string };
  duration: { days: number; nights: number };
  hasTransport: boolean;
  transport: {
    type: string;
    arrival: { date: string; time: string; from: string; to: string };
    departure: { date: string; time: string };
  } | null;
  hasHotel: boolean;
  hotel: { name: string; address: string; checkIn: string; checkOut: string } | null;
  travelType: string;
  members: { adults: number; children: number; seniors: number; boys: number; girls: number };
  budget: number;
  budgetMode: 'strict' | 'balanced' | 'flexible';
  pace: 'slow' | 'balanced' | 'explorer';
  interests: string[];
  foodPreference: string[];
  hotelPreference: string[];
  mustVisit: Array<{ name: string; preferredDay: string; priority: string }>;
}

// ─── Destination Intelligence ───────────────────────────────────────────

export interface DestinationHub {
  name: string;
  type: 'primary' | 'secondary' | 'excursion';
  coordinates: { lat: number; lon: number };
  recommendedNights: number;
  nearbyAttractions: string[];
  distanceFromPrimary: number;
  travelTimeFromPrimary: number;
}

export interface TravelCluster {
  id: string;
  name: string;
  centroid: { lat: number; lon: number };
  attractions: RankedAttraction[];
  totalWalkingKm: number;
  suggestedOrder: string[];
  expansionType: 'local' | 'half_day_excursion' | 'full_day_excursion' | 'secondary_hub' | 'overnight';
}

export interface DestinationIntelligenceData {
  primaryHub: DestinationHub;
  secondaryHubs: DestinationHub[];
  excursions: DestinationHub[];
  clusters: TravelCluster[];
  maxComfortableRadiusKm: number;
  suggestedRoute: string[];
}

// ─── Ranked Places ──────────────────────────────────────────────────────

export interface RankedAttraction {
  id: string;
  placeId: string;
  name: string;
  lat: number;
  lon: number;
  category: string;
  rating: number;
  userRatingsTotal: number;
  distanceKm: number;
  provider: string;
  imageUrl: string;
  types: string[];
  businessStatus: string;
  // Place Details (loaded lazily, may be null initially)
  openingHours: DayOpeningHours[] | null;
  phone: string | null;
  website: string | null;
  photos: string[];
  estimatedVisitDuration: number; // minutes
  entryFee: number;
  // Ranking metadata
  rankingScore: number;
  clusterId: string | null;
  // User interaction
  isSelected: boolean; // User can toggle in blueprint
  isUserAdded: boolean; // User manually added this
}

export interface DayOpeningHours {
  day: number; // 0=Sunday, 6=Saturday
  open: string; // "09:00"
  close: string; // "18:00"
}

export interface RankedHotel {
  id: string;
  placeId: string;
  name: string;
  lat: number;
  lon: number;
  rating: number;
  userRatingsTotal: number;
  priceLevel: number;
  distanceKm: number;
  provider: string;
  imageUrl: string;
  estimatedPricePerNight: number;
  amenities: string[];
  tierLabel: string;
  distanceFromClusters: number;
  bookingLink: string;
  googleMapsUrl: string;
  // User interaction
  isSelected: boolean;
  isUserBooked: boolean; // User's pre-booked hotel
}

export interface RankedRestaurant {
  id: string;
  placeId: string;
  name: string;
  lat: number;
  lon: number;
  rating: number;
  userRatingsTotal: number;
  cuisine: string;
  priceLevel: number;
  distanceKm: number;
  provider: string;
  imageUrl: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'cafe' | 'any';
  foodMatch: number; // 0-100 match with user's food preference
  // User interaction
  isSelected: boolean;
}

// ─── Transport Analysis ─────────────────────────────────────────────────

export interface TransportOption {
  mode: string;
  duration: string;
  estimatedFare: number;
  bookingLink: string;
  provider: string;
}

export interface TransportAnalysis {
  isBooked: boolean;
  bookedDetails: UserPreferences['transport'] | null;
  suggestedMode: string;
  distanceKm: number;
  durationHours: number;
  originHub: string;
  destinationHub: string;
  nearestAirport: { name: string; distanceKm: number } | null;
  nearestRailway: { name: string; distanceKm: number } | null;
  nearestBusTerminal: { name: string; distanceKm: number } | null;
  options: TransportOption[];
  journeyLegs: string[];
  estimatedFare: number;
}

// ─── Weather ────────────────────────────────────────────────────────────

export interface DayForecast {
  date: string;
  day: number; // Day 1, Day 2, etc.
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  description: string;
  rainProbability: number;
  windSpeed: number;
  uvIndex: number;
  sunrise: string; // "06:15"
  sunset: string; // "18:58"
  isOutdoorSafe: boolean;
  warnings: string[];
  indoorAlternatives: string[];
}

// ─── Must-Visit Validation ──────────────────────────────────────────────

export interface MustVisitResult {
  name: string;
  preferredDay: string;
  priority: string;
  coordinates: { lat: number; lon: number } | null;
  distanceFromHub: number;
  travelTimeHours: number;
  openingHours: string | null;
  estimatedVisitDuration: number; // minutes
  budgetImpact: number;
  feasibility: 'included' | 'needs_full_day' | 'needs_extra_day' | 'not_recommended';
  recommendedDay: number;
  explanation: string;
  isValidated: boolean;
}

// ─── Budget Preview ─────────────────────────────────────────────────────

export interface BudgetPreview {
  totalBudget: number;
  budgetMode: string;
  breakdown: {
    transport: { intercity: number; local: number; total: number };
    accommodation: { perNight: number; total: number; nights: number };
    food: { perDay: number; total: number; breakdown: { breakfast: number; lunch: number; dinner: number; snacks: number } };
    activities: { perDay: number; total: number };
    shopping: number;
    buffer: number;
  };
  totalPlanned: number;
  remaining: number;
  healthScore: number; // 0-100
  healthStatus: 'within_budget' | 'slightly_above' | 'exceeds_budget';
  warnings: string[];
  savingsTips: string[];
}

// ─── Map Data ───────────────────────────────────────────────────────────

export interface MapMarker {
  id: string;
  name: string;
  type: 'hotel' | 'attraction' | 'restaurant' | 'transport' | 'hospital' | 'must_visit';
  lat: number;
  lon: number;
  badge: string;
  clusterName?: string;
}

export interface MapData {
  centerLat: number;
  centerLon: number;
  markers: MapMarker[];
  clusterBoundaries: Array<{
    id: string;
    name: string;
    centroid: { lat: number; lon: number };
    radiusKm: number;
  }>;
  suggestedRoutes: Array<{
    day: number;
    waypoints: Array<{ lat: number; lon: number; name: string }>;
  }>;
}

// ─── AI Recommendations ─────────────────────────────────────────────────

export interface AIRecommendation {
  name: string;
  reason: string;
  type: 'excursion' | 'attraction' | 'hidden_gem' | 'experience';
  distanceKm: number;
  estimatedDuration: string;
  imageUrl: string;
  isAccepted: boolean; // User toggles
}

// ─── Warnings ───────────────────────────────────────────────────────────

export interface TripWarning {
  type: 'budget' | 'weather' | 'timing' | 'walking' | 'transport' | 'availability' | 'distance';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  affectedDay?: number;
  suggestion?: string;
}

// ─── THE TRIP BLUEPRINT (Phase 1 Output) ────────────────────────────────

export interface TripBlueprint {
  id: string;
  createdAt: string;
  
  // User inputs echoed back
  userPreferences: UserPreferences;
  
  // Destination intelligence
  destination: DestinationIntelligenceData;
  
  // Discovered & ranked places
  attractions: RankedAttraction[];
  hotels: RankedHotel[];
  restaurants: RankedRestaurant[];
  
  // Transport analysis
  transport: TransportAnalysis;
  
  // Weather forecast (per-day)
  weather: DayForecast[];
  
  // Must-visit validation
  mustVisitValidation: MustVisitResult[];
  
  // Budget analysis
  budgetPreview: BudgetPreview;
  
  // Geographic clusters
  clusters: TravelCluster[];
  
  // Map data
  mapData: MapData;
  
  // AI-generated recommendations
  recommendations: AIRecommendation[];
  
  // Warnings
  warnings: TripWarning[];
  
  // Emergency contacts
  emergency: {
    hospital: { name: string; lat: number; lon: number; distanceKm: number } | null;
    police: { name: string; lat: number; lon: number; distanceKm: number } | null;
    helplines: { police: string; ambulance: string; fire: string; tourist: string };
  };
  
  // Context data
  wikiExtract: string | null;
  heroImage: string | null;
}

// ─── ITINERARY TYPES (Phase 2 Output) ──────────────────────────────────

export interface ItineraryActivity {
  time: string;
  endTime: string;
  title: string;
  name: string;
  type: 'travel' | 'meal' | 'activity' | 'rest' | 'hotel' | 'checkin' | 'checkout' | 'evening' | 'departure' | 'breakfast' | 'snack';
  duration: number; // minutes
  description: string;
  category: string;
  cost: number;
  lat: number;
  lon: number;
  imageUrl: string;
  placeId: string | null;
  openingHours: string | null;
  travelTimeFromPrevious: number; // minutes
  distanceFromPrevious: number; // km
  walkingDistance: string;
  aiTip: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string; // AI-generated creative theme
  weather: DayForecast | null;
  activities: ItineraryActivity[];
  totalActiveHours: number;
  totalCost: number;
  totalDistanceKm: number;
}

export interface GeneratedItinerary {
  id: string;
  blueprintId: string;
  createdAt: string;
  
  trip: {
    destination: string;
    destinationSummary: string;
    heroImage: string;
    totalDays: number;
    totalBudget: number;
    currency: string;
    tripOverview: string;
    packingSuggestions: string[];
    safetyTips: string[];
    localTravelAdvice: string;
  };
  
  days: ItineraryDay[];
  
  transport: TransportAnalysis;
  hotels: RankedHotel[];
  restaurants: RankedRestaurant[];
  
  budget: BudgetPreview;
  weather: DayForecast[];
  emergency: TripBlueprint['emergency'];
  
  mapData: MapData;
  affiliateLinks: Record<string, string>;
  
  // Quality validation
  qualityScore: number;
  validationPassed: boolean;
  validationIssues: string[];
}

// ─── Place Cache Types ──────────────────────────────────────────────────

export interface CachedPlaceDetails {
  placeId: string;
  name: string;
  openingHours: DayOpeningHours[] | null;
  phone: string | null;
  website: string | null;
  photos: string[];
  rating: number;
  userRatingsTotal: number;
  formattedAddress: string | null;
  priceLevel: number | null;
  types: string[];
  lastUpdated: string;
  expiresAt: string;
}

export interface PlaceCacheConfig {
  hotels: number; // TTL in hours
  restaurants: number;
  attractions: number;
}

export const CACHE_TTL: PlaceCacheConfig = {
  hotels: 24,
  restaurants: 24,
  attractions: 168, // 7 days
};
