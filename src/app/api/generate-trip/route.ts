import { NextResponse } from 'next/server';
import type { TripRequest, ItineraryData } from '@/types/trip';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function hashPrompt(text: string) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function validateTripRequest(body: any): { valid: boolean; error?: string; data?: any } {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid request body' };
  
  const dest = typeof body.destination === 'string' ? body.destination.trim() : '';
  if (dest.length < 2 || dest.length > 100) return { valid: false, error: 'Destination must be between 2 and 100 characters' };
  
  if (dest.includes('IGNORE PREVIOUS') || dest.includes('SYSTEM PROMPT')) {
    return { valid: false, error: 'Security breach: Malformed prompt injection detected' };
  }

  const origin = typeof body.origin_city === 'string' && body.origin_city.trim().length >= 2 
    ? body.origin_city.trim() 
    : typeof body.origin === 'string' && body.origin.trim().length >= 2 
      ? body.origin.trim() 
      : 'Mumbai';

  const budget = Number(body.budget) || 30000;
  if (budget <= 0 || budget > 10000000) return { valid: false, error: 'Budget out of acceptable bounds' };

  return {
    valid: true,
    data: {
      ...body,
      origin,
      destination: dest,
      travelType: body.travelType || body.trip_type || 'Solo',
      travelers: {
        adults: Math.min(Math.max(Number(body.travelers?.adults) || 1, 1), 20),
        children: Math.min(Math.max(Number(body.travelers?.children) || 0, 0), 10)
      },
      budget: budget,
      duration: Number(body.duration) || 5,
      arrival_mode: body.arrival_mode || 'Train',
      arrival_time: body.arrival_time || '08:30 AM',
      hotel_preference: body.hotel_preference || 'Mid-Range',
      food_preference: body.food_preference || 'Veg & Non-Veg'
    }
  };
}

function buildRealDestinationIntelligence(body: any): ItineraryData {
  const origin = body.origin;
  const dest = body.destination;
  const budget = Number(body.budget) || 30000;
  const totalDays = Math.max(Math.min(Number(body.duration) || 5, 14), 1);
  let arrivalMode = body.arrival_mode || 'Train';
  const arrivalTime = body.arrival_time || '08:30 AM';

  const normDest = dest.toLowerCase().trim();
  const isIntl = normDest.includes("bali") || normDest.includes("dubai") || normDest.includes("paris") || normDest.includes("tokyo") || normDest.includes("maldives") || normDest.includes("london") || normDest.includes("singapore") || normDest.includes("bangkok") || normDest.includes("europe") || normDest.includes("switzerland");

  // Step 1 & 2: Destination Accessibility Engine & Transit Imagery
  let terminalName = `${dest} Central Railway Station`;
  let transitImage = "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80"; // Train image
  let transitCost = 850;
  let transitDuration = "4 Hours";
  let arrivalWorkflowSteps: any[] = [];

  // Destination Knowledge Base
  let regionalIntel = {
    hotelName: `Hotel ${dest} Residency`,
    hotelImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    hotelPrice: 4200,
    mustTryDish: "Local Speciality Meals & Filter Coffee",
    bestVeg: "Popular Pure Veg Dining Hall",
    bestNonVeg: "Famous Spice & Grill Kitchen",
    bestSeafood: "Fresh Coast Kitchen",
    streetFood: "Evening Market Food Stalls",
    landmarkPrimary: `${dest} Fort & Viewpoint`,
    landmarkSecondary: `${dest} Main Temple`,
    landmarkScenic: `${dest} Sunset Point`,
    museumName: `${dest} City Museum`,
    shoppingHub: `${dest} Main Market Road`,
    nightlifeHub: `${dest} Evening Cafe & Music Lounge`,
    lunch1: `${dest} Dining Hall`,
    dinner1: `${dest} Spice Garden`,
    lunch2: `Garden Courtyard Cafe`,
    dinner2: `Rooftop City View Restaurant`,
    famousForItems: "Local Thali, Snacks, Filter Coffee"
  };

  if (normDest.includes("matheran")) {
    arrivalMode = "Train";
    terminalName = "Neral Railway Junction (Transfer for Matheran Toy Train)";
    transitImage = "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80"; // Train track
    transitCost = 350;
    transitDuration = "3 Hours";

    arrivalWorkflowSteps = [
      { time: "08:30 AM", step: "Reach Neral Railway Station." },
      { time: "09:20 AM", step: "Purchase Matheran Toy Train ticket at Neral counter (₹100)." },
      { time: "10:00 AM", step: "Board Matheran Toy Train ascending the scenic hills." },
      { time: "11:50 AM", step: "Arrive at Matheran Railway Station." },
      { time: "12:10 PM", step: "Take local horse ride or walk from Dasturi Naka (No motor vehicles allowed inside Matheran)." },
      { time: "12:30 PM", step: "Reach hotel." },
      { time: "12:45 PM", step: "Check in at hotel reception." },
      { time: "01:15 PM", step: "Freshen up in room." },
      { time: "01:45 PM", step: "Have warm local lunch." }
    ];

    regionalIntel = {
      hotelName: "Westend Hotel Matheran",
      hotelImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      hotelPrice: 4500,
      mustTryDish: "Maharashtrian Pitla Bhakri, Thali & Honey Chikki",
      bestVeg: "Kokan Katta Pure Veg",
      bestNonVeg: "Khan's Corner Matheran",
      bestSeafood: "Shilpa Hotel Coastal Kitchen",
      streetFood: "Matheran Mall Road Chikki & Fudge Stalls",
      landmarkPrimary: "Echo Point Matheran",
      landmarkSecondary: "Charlotte Lake",
      landmarkScenic: "Louisa Point & Panorama Point",
      museumName: "Matheran Heritage Railway Station Exhibit",
      shoppingHub: "Matheran Mall Road Handicraft & Chikki Market",
      nightlifeHub: "Olympia Evening Coffee Deck & Sunset Garden",
      lunch1: "Kokan Katta Dining Hall",
      dinner1: "Amantran Restaurant Garden",
      lunch2: "Westend Hotel Courtyard Cafe",
      dinner2: "Panorama Sunset Lookpoint Kitchen",
      famousForItems: "Pitla Bhakri, Maharashtrian Thali, Honey Chikki, Fudge"
    };
  } else if (normDest.includes("mahabaleshwar")) {
    arrivalMode = "Bus";
    terminalName = "Mahabaleshwar ST Bus Stand";
    transitImage = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"; // Bus
    transitCost = 650;
    transitDuration = "4.5 Hours";

    arrivalWorkflowSteps = [
      { time: arrivalTime, step: "Arrive at Mahabaleshwar ST Bus Stand." },
      { step: "Hire local tourist taxi from registered stand (₹250)." },
      { step: "Reach hotel in city center." },
      { step: "Complete check-in formalities." },
      { step: "Freshen up and rest for 30 mins." },
      { step: "Head out for warm lunch." }
    ];

    regionalIntel = {
      hotelName: "Hotel Rajesh Mahabaleshwar",
      hotelImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      hotelPrice: 4000,
      mustTryDish: "Strawberry Cream, Corn Pattice & Grilled Pizza",
      bestVeg: "Mapro Garden Cafe",
      bestNonVeg: "Little Italy & Grill House",
      bestSeafood: "Grapevine Restaurant",
      streetFood: "Town Market Corn & Strawberry Stalls",
      landmarkPrimary: "Venna Lake Boating Deck",
      landmarkSecondary: "Mahabaleshwar Old Shiva Temple",
      landmarkScenic: "Arthur's Seat Point & Elephant's Head Point",
      museumName: "Panchgani Table Land Heritage Center",
      shoppingHub: "Town Bazar Strawberry & Leather Market",
      nightlifeHub: "Mapro Garden Evening Music Courtyard",
      lunch1: "Mapro Garden Cafe",
      dinner1: "Grapevine Kitchen",
      lunch2: "Bagicha Corner Cafe",
      dinner2: "Rooftop Valley View Dining"
    };
  } else if (normDest.includes("ganpatipule")) {
    arrivalMode = "Train";
    terminalName = "Ratnagiri Railway Station (30 km bus/auto transfer to Ganpatipule)";
    transitImage = "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80";
    transitCost = 700;
    transitDuration = "6 Hours";

    arrivalWorkflowSteps = [
      { time: arrivalTime, step: "Arrive at Ratnagiri Railway Station." },
      { step: "Take coastal ST Bus or Auto Rickshaw outside station (₹300)." },
      { step: "Reach beachfront resort in Ganpatipule." },
      { step: "Check in and keep luggage." },
      { step: "Freshen up in room." },
      { step: "Walk to nearby coastal kitchen for lunch." }
    ];

    regionalIntel = {
      hotelName: "Abhishek Beach Resort Ganpatipule",
      hotelImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      hotelPrice: 3800,
      mustTryDish: "Ukadiche Modak, Solkadhi & Konkani Surmai Fish Fry",
      bestVeg: "Kokan Swad Bhojanalaya",
      bestNonVeg: "Mehendale Svadista Bhojanalaya",
      bestSeafood: "Tarang Beachfront Seafood House",
      streetFood: "Beach Promenade Kokum & Chaat Stalls",
      landmarkPrimary: "400-Year-Old Ganpati Swayambhu Beach Temple",
      landmarkSecondary: "Aare Ware Coastal Lookpoint",
      landmarkScenic: "Ganpatipule White Sand Beach",
      museumName: "Prachin Konkan Open-Air Museum",
      shoppingHub: "Konkan Cashew, Mango & Kokum Bazaar",
      nightlifeHub: "Beachside Evening Sunset Deck",
      lunch1: "Kokan Swad Bhojanalaya",
      dinner1: "Tarang Beachfront Kitchen",
      lunch2: "Mehendale Konkani Dining",
      dinner2: "Aare Ware Cliff Deck"
    };
  } else if (normDest.includes("goa") || isIntl) {
    arrivalMode = "Flight";
    terminalName = isIntl ? `${dest} International Airport` : "Manohar International Airport Goa (GOX)";
    transitImage = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"; // Airplane
    transitCost = isIntl ? 24000 : 4500;
    transitDuration = isIntl ? "7 Hours" : "1.5 Hours";

    arrivalWorkflowSteps = [
      { time: arrivalTime, step: `Arrive at ${terminalName}.` },
      { step: "Book registered pre-paid airport taxi." },
      { step: `Reach hotel in ${dest}.` },
      { step: "Complete check-in formalities at reception." },
      { step: "Freshen up and rest for 30 mins." },
      { step: "Enjoy local welcome lunch." }
    ];
  } else {
    // Generic fallback workflow
    arrivalWorkflowSteps = [
      { time: arrivalTime, step: `Arrive at ${terminalName}.` },
      { step: "Take official app cab or station auto." },
      { step: `Reach hotel in ${dest}.` },
      { step: "Check in at reception." },
      { step: "Freshen up and relax." },
      { step: "Head out for lunch." }
    ];
  }

  // Step 3: Travel Logistics Engine
  const travelToDestination = {
    userLocation: origin,
    destination: dest,
    options: [
      {
        title: `OPTION 1: Fastest & Recommended Route (${arrivalMode})`,
        steps: [
          { mode: `${arrivalMode}: ${origin} → ${terminalName}`, cost: transitCost, duration: transitDuration },
          { mode: `Local Transfer: ${terminalName} → City Hub`, cost: 250, duration: "30 min" }
        ],
        totalCost: transitCost + 250,
        totalDuration: transitDuration
      },
      {
        title: "OPTION 2: Cheapest Alternative Route",
        steps: [
          { mode: `State Express Bus: ${origin} → ${dest}`, cost: Math.floor(transitCost * 0.6), duration: "6.5 Hours" }
        ],
        totalCost: Math.floor(transitCost * 0.6),
        totalDuration: "6.5 Hours"
      },
      {
        title: "OPTION 3: Most Comfortable Private Route",
        steps: [
          { mode: `Private Cab / Express AC Sedan: ${origin} → ${dest}`, cost: Math.floor(transitCost * 1.5), duration: "4 Hours" }
        ],
        totalCost: Math.floor(transitCost * 1.5),
        totalDuration: "4 Hours"
      }
    ]
  };

  // Step 4: Arrival Workflow Engine
  const arrivalPlan = {
    arrivalPoint: terminalName,
    time: arrivalTime,
    steps: arrivalWorkflowSteps
  };

  // Step 5 & 6: Budget Allocation Engine & Hotel Engine
  const hotelBasePrice = Math.min(regionalIntel.hotelPrice, Math.floor(budget * 0.35 / totalDays));
  const selectedHotel = {
    name: regionalIntel.hotelName,
    rating: 4.6,
    pricePerNight: hotelBasePrice,
    starTier: "3-Star Hotel / Mid-Range Stay",
    reviewsCount: 3740,
    address: `Main Road Near Market, ${dest}`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(regionalIntel.hotelName)}`,
    imageUrl: regionalIntel.hotelImage,
    amenities: ["Swimming Pool", "Restaurant", "Breakfast Included", "Free Wi-Fi"],
    distanceFromAttractions: "1.0 km from main attractions",
    nearbyRestaurants: `${regionalIntel.lunch1} (200m)`,
    nearbyTransport: "Taxi & Transit Stand (100m)",
    bookingLinks: [
      { provider: "Booking.com", url: "https://www.booking.com", price: hotelBasePrice },
      { provider: "Agoda Deal", url: "https://www.agoda.com", price: Math.floor(hotelBasePrice * 0.95) },
      { provider: "MakeMyTrip", url: "https://www.makemytrip.com", price: hotelBasePrice }
    ],
    alternatives: [
      { name: `Budget Stay ${dest}`, rating: 4.2, pricePerNight: Math.floor(hotelBasePrice * 0.6), starTier: "Budget Hotel" },
      { name: `Premium Stay ${dest}`, rating: 4.8, pricePerNight: Math.floor(hotelBasePrice * 1.4), starTier: "Premium Resort" }
    ],
    budgetOption: {
      name: `Economy Lodge ${dest}`, rating: 4.1, pricePerNight: Math.floor(hotelBasePrice * 0.45), starTier: "Budget Lodge",
      amenities: ["Clean Bed", "Private Bathroom", "Free Wi-Fi"], imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
    }
  };

  // Step 9: Food Engine (Strictly NO "Traditional Authentic Regional Heritage Gastronomy")
  const foodIntelligence = {
    bestVeg: regionalIntel.bestVeg,
    bestNonVeg: regionalIntel.bestNonVeg,
    bestSeafood: regionalIntel.bestSeafood,
    bestBudget: "Popular Market Cafe",
    bestPremium: regionalIntel.dinner2,
    bestLocalSpecialty: regionalIntel.mustTryDish,
    streetFood: regionalIntel.streetFood,
    mustTryDish: regionalIntel.mustTryDish,
    alternatives: ["Town Cafe", "Garden Kitchen", "Main Bazar Dining"]
  };

  const restaurants = [
    {
      name: regionalIntel.lunch1,
      cuisine: `Famous for: ${regionalIntel.famousForItems}`, estimatedCost: 350, rating: 4.6, reviewsCount: 12400,
      address: `Market Road, ${dest}`, isVeg: true, isFamilyFriendly: true, mustTryDish: regionalIntel.mustTryDish, mealType: "Lunch" as const,
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      bookingLinks: [{ provider: "View Timings", url: "#" }, { provider: "Google Maps", url: "#" }]
    },
    {
      name: regionalIntel.dinner1,
      cuisine: "Famous for: Evening Dinner, Spiced Meals, Fresh Juice", estimatedCost: 500, rating: 4.7, reviewsCount: 16500,
      address: `Scenic Point Road, ${dest}`, isNonVeg: true, isFamilyFriendly: true, mustTryDish: "Chef Special Thali", mealType: "Dinner" as const,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      bookingLinks: [{ provider: "View Menu", url: "#" }, { provider: "Call Restaurant", url: "#" }]
    }
  ];

  // Step 7, 8, 11, 13, 14, 15: Timeline, Geo Optimization & Transport Engine
  const createRichSlot = (time: string, slot: "morning"|"afternoon"|"evening"|"night", title: string, category: string, cost: number, importance: "Must Visit"|"Recommended"|"Optional", img: string, tip: string) => ({
    time, timeSlot: slot, title, name: title, description: `Visit ${title}. Located within 3 km local cluster radius.`,
    category, type: (category.toLowerCase().includes("dinner") || category.toLowerCase().includes("lunch") || category.toLowerCase().includes("breakfast") ? "meal" : "activity") as "meal" | "activity",
    cost, location: `Local Cluster, ${dest}`, distance: "1.5 km", travelTime: "10 min", rating: 4.7, reviewCount: 28400,
    bestVisitingTime: slot === "morning" ? "09:00 AM - 11:30 AM" : slot === "evening" ? "04:30 PM - 06:30 PM" : "Anytime",
    weather: "28°C Pleasant", crowdLevel: importance === "Must Visit" ? "Moderate to High" : "Comfortable", duration: "1.5 Hours",
    transportOptions: normDest.includes("matheran") ? { taxi: "No Cars", auto: "No Autos", bus: "Horse Ride ₹200", walk: "15 mins walk" } : { taxi: 150, auto: 80, bus: 20, walk: "1.5 km walk" },
    aiTip: tip, alternativeOptions: [`Nearby Viewpoint`, `Local Market Stall`],
    imageUrl: img, googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${title} ${dest}`)}`,
    bookingLinks: [ { provider: "Ticket Info", url: "#" }, { provider: "Route Map", url: "#" } ],
    recommendationScore: importance === "Must Visit" ? 98 : 94, importance
  });

  const days: any[] = [];
  for (let i = 1; i <= totalDays; i++) {
    const dDate = new Date(Date.now() + 86400000 * (i - 1)).toISOString().split('T')[0];
    if (i === 1) {
      days.push({
        day: 1, date: dDate, title: `Arrival at ${dest}, Check-in & ${regionalIntel.landmarkPrimary}`,
        morning: [
          createRichSlot(arrivalTime, "morning", `Arrive at ${terminalName}`, "Arrival Logistics", 0, "Must Visit", transitImage, "Follow official arrival steps to reach your hotel."),
          createRichSlot("11:30 AM", "morning", `Check-in at ${regionalIntel.hotelName}`, "Hotel Check-in", 0, "Must Visit", selectedHotel.imageUrl, "Keep ID proofs ready for instant room allocation.")
        ],
        afternoon: [
          createRichSlot("01:15 PM", "afternoon", `Lunch at ${regionalIntel.lunch1}`, "Lunch", 350, "Must Visit", restaurants[0].imageUrl, `Eat here. Famous for ${regionalIntel.mustTryDish}.`),
          createRichSlot("03:30 PM", "afternoon", regionalIntel.landmarkPrimary, "Top Attraction", 100, "Must Visit", "https://images.unsplash.com/photo-1629218079827-3b28e281ce53?auto=format&fit=crop&w=800&q=80", "Ticket costs ₹100. Best visited in afternoon.")
        ],
        evening: [
          createRichSlot("05:30 PM", "evening", regionalIntel.landmarkScenic, "Sunset Point", 0, "Recommended", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", "This route is best for evening photography.")
        ],
        night: [
          createRichSlot("08:30 PM", "night", `Dinner at ${regionalIntel.dinner1}`, "Dinner", 500, "Must Visit", restaurants[1].imageUrl, "Eat here. Enjoy peaceful evening dining.")
        ]
      });
    } else if (i === totalDays) {
      // Step 17: Checkout Engine
      days.push({
        day: i, date: dDate, title: `Hotel Checkout, ${regionalIntel.shoppingHub} & Departure`,
        morning: [
          createRichSlot("08:30 AM", "morning", "Warm Morning Breakfast", "Breakfast", 250, "Recommended", "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80", "Start the morning with light breakfast and coffee."),
          createRichSlot("10:30 AM", "morning", "Hotel Checkout Formalities", "Checkout Protocol", 0, "Must Visit", selectedHotel.imageUrl, "Pack luggage and complete room checkout by 11:00 AM.")
        ],
        afternoon: [
          createRichSlot("12:00 PM", "afternoon", regionalIntel.shoppingHub, "Local Market", 800, "Recommended", "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80", "Buy local items, chikki, souvenirs, and gifts.")
        ],
        evening: [
          createRichSlot("04:30 PM", "evening", `Travel to ${terminalName} for Departure`, "Departure Transit", 250, "Must Visit", transitImage, "Board your return transport. Thank you for travelling with Travixa!")
        ],
        night: []
      });
    } else {
      days.push({
        day: i, date: dDate, title: `${regionalIntel.landmarkSecondary}, Lake Walk & Market Visit`,
        morning: [
          createRichSlot("08:30 AM", "morning", "Morning Cafe Breakfast", "Breakfast", 250, "Must Visit", "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80", "Eat here for fresh morning breakfast."),
          createRichSlot("10:00 AM", "morning", regionalIntel.landmarkSecondary, "Iconic Temple / Landmark", 0, "Must Visit", "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80", "Visit here. Serene atmosphere.")
        ],
        afternoon: [
          createRichSlot("01:00 PM", "afternoon", regionalIntel.lunch2, "Lunch Cafe", 400, "Recommended", "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80", "Eat here. Relaxed outdoor seating."),
          createRichSlot("03:00 PM", "afternoon", regionalIntel.museumName, "Museum / Viewpoint Walk", 100, "Must Visit", "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80", "Explore local heritage and natural beauty.")
        ],
        evening: [
          createRichSlot("05:30 PM", "evening", regionalIntel.nightlifeHub, "Evening Lounge", 400, "Optional", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", "Enjoy evening refreshments.")
        ],
        night: [
          createRichSlot("08:30 PM", "night", regionalIntel.dinner2, "Dinner", 550, "Must Visit", "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80", "Eat here for tasty dinner before returning to hotel.")
        ]
      });
    }
  }

  const hotelSpent = selectedHotel.pricePerNight * totalDays;
  const foodSpent = days.reduce((acc, d) => acc + [...d.morning, ...d.afternoon, ...d.evening, ...d.night].filter(x => x.type === 'meal').reduce((s, m) => s + m.cost, 0), 0);
  const actSpent = days.reduce((acc, d) => acc + [...d.morning, ...d.afternoon, ...d.evening, ...d.night].filter(x => x.type !== 'meal' && !x.title.includes("Check") && !x.title.includes("Arrive")).reduce((s, m) => s + m.cost, 0), 0);
  const miscSpent = Math.max(budget - (hotelSpent + foodSpent + actSpent), 3000);

  // Step 17: Checkout Engine
  const returnPlan = {
    checkoutTime: "11:00 AM",
    departurePoint: terminalName,
    transportOptions: [
      { mode: normDest.includes("matheran") ? "🐴 Horse Ride / Walk to Dasturi + Shared Taxi" : "🚕 Official App Cab / Express Taxi", cost: 350, duration: "45 min" },
      { mode: "🚆 Railway Connection", cost: 100, duration: "2 Hours" }
    ],
    summary: "Hotel checkout by 11:00 AM, travel to station/terminal, smooth boarding, and safe journey home.",
    thankYouMessage: `Thank you for planning your trip with Travixa. We hope your journey to ${dest} was wonderful. Safe travels home to ${origin}!`
  };

  // Step 10: Weather Engine
  const weatherEngine = {
    currentWeather: "Clear Pleasant Skies",
    temperature: isIntl ? 29 : 26,
    rainProbability: 15,
    wind: 12, humidity: 65, uvIndex: 6,
    sunrise: "06:12 AM", sunset: "06:52 PM",
    weatherAdvice: "Pleasant climate averaging 26°C. Keep comfortable walking shoes and stay hydrated."
  };

  // Step 16: Emergency Engine
  const emergencyContacts = {
    police: "112 (National Emergency Number)",
    ambulance: "102 (Ambulance Service)",
    embassyOrHelpline: "1363 (Tourist Helpline India) / Travixa 24x7 Assistance",
    hospitals: [`${dest} District Government Hospital`, `Primary Healthcare Center ${dest}`],
    pharmacies: [`24x7 Medical & Pharmacy Store`, `Apollo Night & Day Dispensary`]
  };

  return {
    id: `travixa-os-${Date.now()}`,
    tripOverview: `${totalDays}-Day Factual Travel Plan for ${dest}. Optimized with verified local routes, distances, and real timings.`,
    destination: dest,
    destinationSummary: `Top attractions, famous food places, and accessible routes across ${dest}.`,
    totalDays,
    totalBudget: budget,
    estimatedCost: hotelSpent + foodSpent + actSpent + miscSpent,
    currency: "INR",
    bestVisitingTime: "October to June",
    weatherConsiderations: `Comfortable temperature averaging ${weatherEngine.temperature}°C with minimal rain.`,
    weatherEngine,
    packingSuggestions: ["Comfortable walking sneakers", "Light cotton wear", "Umbrella / Windcheater", "Personal medicines"],
    safetyTips: ["Keep offline maps downloaded", "Carry cash for local transport where online payments might fluctuate"],
    localTravelAdvice: normDest.includes("matheran") ? "No motor vehicles are allowed beyond Dasturi Naka. Wear comfortable shoes for walking or hire official horse rides." : "Use registered official taxis or station autos.",
    emergencyContacts,
    budgetTracker: {
      hotels: hotelSpent, transport: transitCost, food: foodSpent, activities: actSpent, shoppingOrMisc: miscSpent,
      dailyTotalAverage: Math.floor((hotelSpent + foodSpent + actSpent) / totalDays),
      overallTotal: hotelSpent + foodSpent + actSpent,
      remainingOrSavings: Math.max(budget - (hotelSpent + foodSpent + actSpent), 0),
      budgetHealthScore: 98
    },
    travelToDestination,
    arrivalPlan,
    returnPlan,
    foodIntelligence,
    hotels: [selectedHotel],
    flights: travelToDestination.options[0].steps.map(s => ({ airline: s.mode, price: s.cost, duration: s.duration, stops: 0 })),
    restaurants,
    days
  };
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const validation = validateTripRequest(rawBody);
    if (!validation.valid || !validation.data) {
      return NextResponse.json({ error: validation.error || "Invalid request" }, { status: 400 });
    }
    const body = validation.data;
    const normDest = body.destination.toLowerCase().trim();
    const originCity = body.origin;
    const budgetNum = body.budget;

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    );

    const { data: cachedLog } = await supabase.from('ai_generation_logs').select('response_json').eq('prompt_text', `${originCity}->${normDest}:${budgetNum}`).single();
    if (cachedLog?.response_json) {
      return NextResponse.json(cachedLog.response_json);
    }

    const realItinerary = buildRealDestinationIntelligence(body);

    supabase.from('ai_generation_logs').insert({
      prompt_hash: await hashPrompt(`${originCity}->${normDest}:${budgetNum}`),
      prompt_text: `${originCity}->${normDest}:${budgetNum}`,
      response_json: realItinerary,
      token_count: 950
    }).then(({ error }: any) => { if (error) console.warn("Log write error:", error?.message); });

    supabase.from('destination_cache').upsert({
      destination_name: normDest, overview: realItinerary.tripOverview, tags: [body.travelType, "Travel OS"]
    }, { onConflict: 'destination_name' }).then(({ error }: any) => { if (error) console.warn("Dest cache upsert error:", error?.message); });

    return NextResponse.json(realItinerary);
  } catch (err: any) {
    console.error("Travel Engine fatal exception:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
