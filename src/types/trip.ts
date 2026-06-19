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
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  type: string;
  cost: number;
  location: string;
  rating?: number;
}

export interface DayItinerary {
  day: number;
  date: string;
  activities: Activity[];
}

export interface Hotel {
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  imageUrl: string;
}

export interface Flight {
  airline: string;
  price: number;
  duration: string;
  stops: number;
}

export interface ItineraryData {
  id: string;
  destination: string;
  totalDays: number;
  totalBudget: number;
  estimatedCost: number;
  days: DayItinerary[];
  hotels: Hotel[];
  flights: Flight[];
  currency: string;
}
