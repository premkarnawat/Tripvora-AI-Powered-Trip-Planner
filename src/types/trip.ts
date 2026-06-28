export interface TripRequest {
  origin?: string;
  destination: string;
  travelType: string;
  travelers: {
    adults: number;
    children: number;
    males?: number;
    females?: number;
    [key: string]: any;
  };
  budget: string;
  dates: {
    startDate: string | null;
    endDate: string | null;
    isFlexible: boolean;
    [key: string]: any;
  };
  agencyMode?: boolean;
  [key: string]: any;
}

export interface TransportLogistics {
  mode: string;
  travelTime: string;
  estimatedCost: number;
  recommendedMode?: string;
  reasoning?: string;
  [key: string]: any;
}

export interface RouteGeoJSON {
  type: string;
  coordinates: number[][];
  [key: string]: any;
}

export interface MapRoutingPayload {
  walkingRoutes?: RouteGeoJSON;
  drivingRoutes?: RouteGeoJSON;
  cyclingRoutes?: RouteGeoJSON;
  eta?: string;
  distance?: string;
  polyline?: string;
  [key: string]: any;
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
  [key: string]: any;
}

export interface AffiliateOffer {
  provider: "Booking.com" | "Agoda" | "Skyscanner" | "Amadeus" | "Goibibo" | "Yatra" | string;
  price: number;
  affiliateLink: string;
  rating: number;
  aiRecommendation?: string;
  isBestDeal?: boolean;
  abstractLayer: boolean;
  [key: string]: any;
}

export interface ActivityItem {
  time: string;
  timeSlot: "morning" | "afternoon" | "evening" | "night";
  title: string;
  name?: string;
  description: string;
  category?: string;
  type: "travel" | "hotel" | "meal" | "activity" | "flight" | "transfer" | "misc";
  cost: number;
  location: string;
  distance?: string;
  travelTime?: string;
  rating?: number;
  reviewCount?: number;
  bestVisitingTime?: string;
  weather?: string;
  recommendedStayDuration?: string;
  aiTip?: string;
  alternativeOptions?: string[];
  imageUrl?: string;
  details?: string;
  aiRecommendation?: string;
  isVeg?: boolean;
  isVegan?: boolean;
  isJainFriendly?: boolean;
  mustTryDish?: string;
  transportToNext?: TransportLogistics;
  routingMap?: MapRoutingPayload;
  [key: string]: any;
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
  [key: string]: any;
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
  alternatives?: Hotel[];
  budgetOption?: Hotel;
  [key: string]: any;
}

export interface Flight {
  airline: string;
  price: number;
  duration: string;
  stops: number;
  affiliateOffer?: AffiliateOffer;
  [key: string]: any;
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
  [key: string]: any;
}

export interface EmergencyContacts {
  police: string;
  ambulance: string;
  embassyOrHelpline: string;
  hospitals?: string[];
  pharmacies?: string[];
  [key: string]: any;
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
  [key: string]: any;
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
  userOriginJourney?: {
    originCity: string;
    transitOptions: { mode: string; cost: number; duration: string; notes?: string }[];
    totalTransitCost: number;
  };
  foodIntelligence?: {
    bestVeg?: string;
    bestNonVeg?: string;
    bestSeafood?: string;
    bestBudget?: string;
    bestPremium?: string;
    bestLocalSpecialty?: string;
    streetFood?: string;
  };
  hotels: Hotel[];
  flights: Flight[];
  restaurants: RestaurantRecommendation[];
  days: DayItinerary[];
  mapExperience?: any;
  [key: string]: any;
}
