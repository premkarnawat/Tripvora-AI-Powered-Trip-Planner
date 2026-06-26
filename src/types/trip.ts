export interface TripRequest {
  destination: string;
  travelType: string;
  travelers: {
    adults: number;
    children: number;
    males?: number;
    females?: number;
  };
  budget: string;
  dates: {
    startDate: string | null;
    endDate: string | null;
    isFlexible: boolean;
  };
  agencyMode?: boolean;
}

export interface TransportLogistics {
  mode: string;
  travelTime: string;
  estimatedCost: number;
  recommendedMode?: string;
  reasoning?: string;
}

export interface RouteGeoJSON {
  type: string;
  coordinates: number[][];
}

export interface MapRoutingPayload {
  walkingRoutes?: RouteGeoJSON;
  drivingRoutes?: RouteGeoJSON;
  cyclingRoutes?: RouteGeoJSON;
  eta?: string;
  distance?: string;
  polyline?: string;
}

export interface WeatherIntelligence {
  currentWeather: string;
  hourlyForecast?: any[];
  dailyForecast?: any[];
  rainProbability: number;
  temperature: number;
  wind: number;
  humidity: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  weatherAdvice?: string;
}

export interface AffiliateOffer {
  provider: "Booking.com" | "Agoda" | "Skyscanner" | "Amadeus" | "Goibibo" | "Yatra" | string;
  price: number;
  affiliateLink: string;
  rating: number;
  aiRecommendation?: string;
  isBestDeal?: boolean;
  abstractLayer: boolean;
}

export interface ActivityItem {
  time: string;
  timeSlot: "morning" | "afternoon" | "evening" | "night";
  title: string;
  description: string;
  type: "travel" | "hotel" | "meal" | "activity" | "flight" | "transfer" | "misc";
  cost: number;
  location: string;
  rating?: number;
  details?: string;
  aiRecommendation?: string;
  isVeg?: boolean;
  isVegan?: boolean;
  isJainFriendly?: boolean;
  mustTryDish?: string;
  transportToNext?: TransportLogistics;
  routingMap?: MapRoutingPayload;
}

export interface DayItinerary {
  day: number;
  date: string;
  title: string;
  morning: ActivityItem[];
  afternoon: ActivityItem[];
  evening: ActivityItem[];
  night: ActivityItem[];
  activities?: ActivityItem[];
}

export interface Hotel {
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  imageUrl: string;
  description?: string;
  affiliateOffer?: AffiliateOffer;
  agencyVendorId?: string;
}

export interface Flight {
  airline: string;
  price: number;
  duration: string;
  stops: number;
  affiliateOffer?: AffiliateOffer;
}

export interface RestaurantRecommendation {
  name: string;
  cuisine: string;
  estimatedCost: number;
  rating: number;
  address?: string;
  isVeg?: boolean;
  isNonVeg?: boolean;
  isJainFriendly?: boolean;
  isVegan?: boolean;
  isFamilyFriendly?: boolean;
  mustTryDish?: string;
  mealType?: "Breakfast" | "Lunch" | "Dinner" | "Cafe" | "Street Food";
}

export interface EmergencyContacts {
  police: string;
  ambulance: string;
  embassyOrHelpline: string;
  hospitals?: string[];
  pharmacies?: string[];
}

export interface BudgetBreakdown {
  hotels: number;
  transport: number;
  food: number;
  activities: number;
  shoppingOrMisc: number;
  taxes?: number;
  discounts?: number;
  dailyTotalAverage: number;
  overallTotal: number;
  remainingOrSavings: number;
  budgetHealthScore: number;
}

export interface ItineraryData {
  id: string;
  tripOverview: string;
  destination: string;
  destinationSummary: string;
  totalDays: number;
  totalBudget: number;
  estimatedCost: number;
  currency: string;
  bestVisitingTime: string;
  weatherConsiderations: string;
  weatherEngine?: WeatherIntelligence;
  packingSuggestions: string[];
  safetyTips: string[];
  localTravelAdvice: string;
  emergencyContacts: EmergencyContacts;
  budgetTracker: BudgetBreakdown;
  isAgencyMode?: boolean;
  agencyVendorLibraryUsed?: boolean;
  hotels: Hotel[];
  flights: Flight[];
  restaurants: RestaurantRecommendation[];
  days: DayItinerary[];
}
