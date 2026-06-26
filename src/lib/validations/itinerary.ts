import { z } from "zod";

export const TransportLogisticsSchema = z.object({
  mode: z.string(),
  travelTime: z.string(),
  estimatedCost: z.number().nonnegative(),
  recommendedMode: z.string().optional(),
  reasoning: z.string().optional(),
}).passthrough();

export const ActivityItemSchema = z.object({
  time: z.string(),
  timeSlot: z.enum(["morning", "afternoon", "evening", "night"]).default("morning"),
  title: z.string(),
  description: z.string(),
  type: z.enum(["travel", "hotel", "meal", "activity", "flight", "transfer", "misc"]).default("activity"),
  cost: z.number().nonnegative().default(0),
  location: z.string(),
  rating: z.number().min(0).max(5).optional(),
  details: z.string().optional(),
  aiRecommendation: z.string().optional(),
  isVeg: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isJainFriendly: z.boolean().optional(),
  mustTryDish: z.string().optional(),
  transportToNext: TransportLogisticsSchema.optional(),
}).passthrough();

export const DayItinerarySchema = z.object({
  day: z.number().int().positive(),
  date: z.string(),
  title: z.string().default("Exploration Day"),
  morning: z.array(ActivityItemSchema).default([]),
  afternoon: z.array(ActivityItemSchema).default([]),
  evening: z.array(ActivityItemSchema).default([]),
  night: z.array(ActivityItemSchema).default([]),
  activities: z.array(ActivityItemSchema).optional(),
}).passthrough();

export const HotelSchema = z.object({
  name: z.string(),
  rating: z.number().min(0).max(5),
  pricePerNight: z.number().nonnegative(),
  amenities: z.array(z.string()).default([]),
  imageUrl: z.string().url().or(z.string()),
  description: z.string().optional(),
}).passthrough();

export const FlightSchema = z.object({
  airline: z.string(),
  price: z.number().nonnegative(),
  duration: z.string(),
  stops: z.number().int().nonnegative(),
}).passthrough();

export const RestaurantRecommendationSchema = z.object({
  name: z.string(),
  cuisine: z.string(),
  estimatedCost: z.number().nonnegative(),
  rating: z.number().min(0).max(5),
  address: z.string().optional(),
  isVeg: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isJainFriendly: z.boolean().optional(),
  mustTryDish: z.string().optional(),
}).passthrough();

export const EmergencyContactsSchema = z.object({
  police: z.string().default("112 / 911"),
  ambulance: z.string().default("102 / 911"),
  embassyOrHelpline: z.string().default("+1-800-TRAVIXA"),
}).passthrough();

export const BudgetBreakdownSchema = z.object({
  hotels: z.number().nonnegative().default(0),
  transport: z.number().nonnegative().default(0),
  food: z.number().nonnegative().default(0),
  activities: z.number().nonnegative().default(0),
  shoppingOrMisc: z.number().nonnegative().default(0),
  taxes: z.number().optional(),
  discounts: z.number().optional(),
  dailyTotalAverage: z.number().nonnegative().default(0),
  overallTotal: z.number().nonnegative().default(0),
  remainingOrSavings: z.number().default(0),
  budgetHealthScore: z.number().min(0).max(100).default(85),
}).passthrough();

export const ItinerarySchema = z.object({
  id: z.string(),
  tripOverview: z.string().default("Curated luxury itinerary designed by Travixa AI."),
  destination: z.string(),
  destinationSummary: z.string().default("Tropical luxury destination."),
  totalDays: z.number().int().positive(),
  totalBudget: z.number().nonnegative(),
  estimatedCost: z.number().nonnegative(),
  currency: z.string().default("INR"),
  bestVisitingTime: z.string().default("Year round"),
  weatherConsiderations: z.string().default("Pleasant tropical climate."),
  packingSuggestions: z.array(z.string()).default(["Sunscreen", "Comfortable walking shoes", "Evening wear"]),
  safetyTips: z.array(z.string()).default(["Keep valuables in hotel safe", "Use registered transport"]),
  localTravelAdvice: stringOrArrayToString(),
  emergencyContacts: EmergencyContactsSchema.default({ police: "112", ambulance: "102", embassyOrHelpline: "Support" }),
  budgetTracker: BudgetBreakdownSchema.default({ hotels: 0, transport: 0, food: 0, activities: 0, shoppingOrMisc: 0, dailyTotalAverage: 0, overallTotal: 0, remainingOrSavings: 0, budgetHealthScore: 85 }),
  hotels: z.array(HotelSchema).default([]),
  flights: z.array(FlightSchema).default([]),
  restaurants: z.array(RestaurantRecommendationSchema).default([]),
  days: z.array(DayItinerarySchema).default([]),
}).passthrough();

function stringOrArrayToString() {
  return z.string().or(z.array(z.string()).transform(arr => arr.join(". "))).default("Respect local customs and timings.");
}

export type ValidatedItinerary = z.infer<typeof ItinerarySchema>;
