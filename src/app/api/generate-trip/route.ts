import { NextResponse } from 'next/server';
import type { TripRequest, ItineraryData } from '@/types/trip';
import { ItinerarySchema } from '@/lib/validations/itinerary';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const inFlightRequests = new Map<string, Promise<any>>();

async function hashPrompt(text: string) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function validateTripRequest(body: any): { valid: boolean; error?: string; data?: TripRequest } {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid request body' };
  
  const dest = typeof body.destination === 'string' ? body.destination.trim() : '';
  if (dest.length < 2 || dest.length > 100) return { valid: false, error: 'Destination must be between 2 and 100 characters' };
  
  if (dest.includes('IGNORE PREVIOUS') || dest.includes('SYSTEM PROMPT')) {
    return { valid: false, error: 'Security breach: Malformed prompt injection detected' };
  }

  const budget = Number(body.budget) || 50000;
  if (budget <= 0 || budget > 10000000) return { valid: false, error: 'Budget out of acceptable bounds' };

  return {
    valid: true,
    data: {
      destination: dest,
      travelType: body.travelType || 'Solo',
      travelers: {
        adults: Math.min(Math.max(Number(body.travelers?.adults) || 1, 1), 20),
        children: Math.min(Math.max(Number(body.travelers?.children) || 0, 0), 10)
      },
      budget: budget.toString(),
      dates: {
        startDate: body.dates?.startDate || new Date().toISOString().split('T')[0],
        endDate: body.dates?.endDate || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        isFlexible: Boolean(body.dates?.isFlexible)
      },
      agencyMode: Boolean(body.agencyMode)
    }
  };
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 500): Promise<any> {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return await res.json();
      
      if ([429, 500, 502, 503, 504].includes(res.status) && i < retries - 1) {
        const jitter = Math.random() * 200;
        await new Promise(r => setTimeout(r, backoff * Math.pow(2, i) + jitter));
        continue;
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    } catch (err: any) {
      clearTimeout(timeout);
      if (i === retries - 1) throw err;
      const jitter = Math.random() * 200;
      await new Promise(r => setTimeout(r, backoff * Math.pow(2, i) + jitter));
    }
  }
}

// Stage 3-8: Synthetic Benchmark Builders for Permanent Storage Upserts
function buildSyntheticWeather(dest: string) {
  const isCold = dest.toLowerCase().includes('switzerland') || dest.toLowerCase().includes('iceland') || dest.toLowerCase().includes('himalaya');
  const temp = isCold ? 8 : 28;
  const rain = isCold ? 35 : 15;
  const uv = isCold ? 3 : 8;
  return {
    destination_name: dest.toLowerCase().trim(),
    current_weather: { condition: isCold ? "Crisp Alpine Sun" : "Tropical Warm Breeze", temp },
    temperature: temp,
    rain_probability: rain,
    uv_index: uv,
    sunrise: "06:15 AM",
    sunset: "06:45 PM"
  };
}

function buildSyntheticEmergency(dest: string) {
  return {
    destination_name: dest.toLowerCase().trim(),
    hospitals: [{ name: `Central ${dest} Medical Center`, phone: "+1-800-MED-HELP" }],
    police: [{ name: `${dest} Tourist Police HQ`, dial: "112 / 911" }],
    atm: [{ name: "International ATM Hub", location: "Central Gateway" }],
    emergency_numbers: { police: "112", ambulance: "102", helpline: "+1-800-TRAVIXA" }
  };
}

function getBaselineTemplate(dest: string, budget: number, weather: any): ItineraryData {
  const hotelBudget = Math.floor(budget * 0.35);
  const transportBudget = Math.floor(budget * 0.25);
  const foodBudget = Math.floor(budget * 0.20);
  const actBudget = Math.floor(budget * 0.15);
  const miscBudget = budget - (hotelBudget + transportBudget + foodBudget + actBudget);

  return {
    id: `static-template-${Date.now()}`,
    tripOverview: `Curated luxury Travel OS baseline voyage for ${dest}. Engineered for seamless exploration.`,
    destination: dest,
    destinationSummary: `${dest} balances rich cultural landmarks, natural beauty, and elite hospitality.`,
    totalDays: 4,
    totalBudget: budget,
    estimatedCost: Math.floor(budget * 0.95),
    currency: "INR",
    bestVisitingTime: "October to April",
    weatherConsiderations: `Average temperature ${weather?.temperature || 28}°C. Rain chance ${weather?.rain_probability || 15}%.`,
    weatherEngine: {
      currentWeather: weather?.current_weather?.condition || "Pleasant",
      temperature: weather?.temperature || 28,
      rainProbability: weather?.rain_probability || 15,
      wind: 12, humidity: 65, uvIndex: weather?.uv_index || 7,
      sunrise: "06:15 AM", sunset: "06:45 PM",
      weatherAdvice: weather?.uv_index > 6 ? "High UV: prioritize outdoor sightseeing before 11 AM or after 3 PM." : "Comfortable climate for all-day sightseeing."
    },
    packingSuggestions: ["Reef-safe sunscreen", "Comfortable walking shoes", "Evening formal attire", "Universal adapter"],
    safetyTips: ["Keep passports in verified hotel safe vaults", "Use AI-prechecked chauffeur services exclusively"],
    localTravelAdvice: "Local customs value polite greetings. Tip 10% in upscale dining establishments.",
    emergencyContacts: {
      police: "112 / Local Police Helpline",
      ambulance: "102 / Medical Dispatch",
      embassyOrHelpline: "+1-800-TRAVIXA-SOS"
    },
    budgetTracker: {
      hotels: hotelBudget, transport: transportBudget, food: foodBudget, activities: actBudget, shoppingOrMisc: miscBudget,
      dailyTotalAverage: Math.floor(budget / 4), overallTotal: Math.floor(budget * 0.95), remainingOrSavings: Math.floor(budget * 0.05), budgetHealthScore: 95
    },
    hotels: [
      { 
        name: `Grand ${dest} Luxury Sanctuary`, rating: 4.9, pricePerNight: Math.floor(hotelBudget / 4), 
        amenities: ["Private Infinity Pool", "Spa", "Chauffeur", "Michelin Dining"], 
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        affiliateOffer: { provider: "Booking.com", price: Math.floor(hotelBudget / 4), affiliateLink: "https://booking.com", rating: 4.9, abstractLayer: true }
      }
    ],
    flights: [
      { airline: "Travixa Express Concierge Transfer", price: transportBudget, duration: "3h 15m", stops: 0 }
    ],
    restaurants: [
      { name: "L'Etoile Rooftop & Lounge", cuisine: "Gourmet Regional Fusion", estimatedCost: Math.floor(foodBudget / 4), rating: 4.8, isVeg: true, isVegan: true, isJainFriendly: true, mealType: "Dinner" }
    ],
    days: [
      {
        day: 1,
        date: new Date().toISOString().split('T')[0],
        title: `VIP Arrival & Sunset Walk in ${dest}`,
        morning: [{ time: "10:30 AM", timeSlot: "morning", title: "Private Chauffeur Airport Pick-up", description: "Luxury sedan transfer directly to suite.", type: "transfer", cost: Math.floor(transportBudget * 0.2), location: `${dest} International Gateway`, rating: 5.0 }],
        afternoon: [{ time: "01:30 PM", timeSlot: "afternoon", title: "Welcome Gastronomy Lunch", description: "Multi-course regional tasting menu.", type: "meal", cost: Math.floor(foodBudget * 0.3), location: "The Grand Lounge", rating: 4.8, isVeg: true }],
        evening: [{ time: "05:30 PM", timeSlot: "evening", title: "Sunset Landmark Tour", description: "Private guided orientation tour of historical landmarks.", type: "activity", cost: Math.floor(actBudget * 0.4), location: `${dest} Historic Center`, rating: 4.9 }],
        night: [{ time: "08:30 PM", timeSlot: "night", title: "Under-the-Stars Villa Dining", description: "Chef-prepared dining within suite courtyard.", type: "meal", cost: Math.floor(foodBudget * 0.3), location: "Sanctuary Courtyard", rating: 4.9 }]
      },
      {
        day: 2,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        title: "Exclusive Private Charter & Nature Discovery",
        morning: [{ time: "09:00 AM", timeSlot: "morning", title: "Private Yacht / Marine Excursion", description: "Half-day voyage exploring offshore marine habitats.", type: "activity", cost: Math.floor(actBudget * 0.6), location: "Marina Harbour", rating: 5.0 }],
        afternoon: [{ time: "01:30 PM", timeSlot: "afternoon", title: "Seaside Organic Harvest Lunch", description: "Farm-to-table culinary feast.", type: "meal", cost: Math.floor(foodBudget * 0.2), location: "Azure Beach Pavilion", rating: 4.7 }],
        evening: [{ time: "06:00 PM", timeSlot: "evening", title: "Holistic Spa Masterclass", description: "90-minute rejuvenation therapy session.", type: "activity", cost: Math.floor(miscBudget * 0.5), location: "Serenity Spa", rating: 4.9 }],
        night: [{ time: "08:30 PM", timeSlot: "night", title: "Chef's Table Tasting Dinner", description: "7-course culinary masterclass.", type: "meal", cost: Math.floor(foodBudget * 0.2), location: "L'Etoile Rooftop", rating: 4.9 }]
      }
    ]
  };
}

export async function POST(request: Request) {
  try {
    // Stage 1: Input Validation
    const rawBody = await request.json();
    const validation = validateTripRequest(rawBody);
    if (!validation.valid || !validation.data) {
      return NextResponse.json({ error: validation.error || "Invalid request" }, { status: 400 });
    }
    const body = validation.data;
    const normDest = body.destination.toLowerCase().trim();

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    );

    // Stage 3-11: Query Permanent Reusable Supabase Intelligence Caches
    const [destRow, weatherRow, emergRow] = await Promise.all([
      supabase.from('destination_intelligence').select('*').eq('destination_name', normDest).single().then(r => r.data),
      supabase.from('weather_cache').select('*').eq('destination_name', normDest).single().then(r => r.data),
      supabase.from('emergency_cache').select('*').eq('destination_name', normDest).single().then(r => r.data)
    ]);

    // Stage 3-11 Cache Miss Failover: Build Permanent Intelligence Once
    let weatherData = weatherRow;
    if (!weatherData) {
      weatherData = buildSyntheticWeather(body.destination);
      supabase.from('weather_cache').insert(weatherData).then(({ error }) => { if (error) console.warn("Weather cache insert error:", error.message); });
    }

    let emergData = emergRow;
    if (!emergData) {
      emergData = buildSyntheticEmergency(body.destination);
      supabase.from('emergency_cache').insert(emergData).then(({ error }) => { if (error) console.warn("Emergency cache insert error:", error.message); });
    }

    // Stage 12: AI Context Builder Orchestration Payload
    const travixaContextBlock = {
      destinationIntelligence: destRow || { overview: `${body.destination} luxury benchmark intelligence.` },
      weatherEngine: weatherData,
      transportationEngine: {
        supportedModes: ["Walking", "Auto", "Taxi", "Metro", "Bus", "Train", "Scooter", "Bike", "Cab", "Rental"],
        mandate: "Recommend multi-modal transport between adjacent activities with distance, ETA, cost, and clear reasoning."
      },
      restaurantEngine: {
        mandate: "Classify all meal recommendations with Veg, Non-Veg, Jain Friendly, Vegan, Family Friendly flags and Must-Try regional dishes."
      },
      emergencyEngine: emergData,
      affiliateEngine: {
        mode: body.agencyMode ? "agency_vendor_library" : "abstract_affiliates",
        providers: ["Booking.com", "Agoda", "Skyscanner"]
      }
    };

    // Stage 13: Gemini AI Master Prompt Execution
    const travixaMasterSystemPrompt = `You are the Travixa Travel Intelligence Engine — an autonomous, production-grade AI Travel Operating System (Travel OS).
NOT ChatGPT. NOT Gemini. NOT a standard chatbot. You function as a principal travel planner and luxury consultant.

CORE ARCHITECTURAL MANDATE:
You are the final decision engine. You MUST synthesize your response strictly using the Travixa Assembled Context Block provided below.
Never invent hotels, fictional attractions, fabricated prices, or impossible routes. Use realistic estimates only when exact data is unlisted, clearly aligning with regional economic benchmarks.

TRAVIXA ASSEMBLED CONTEXT BLOCK:
${JSON.stringify(travixaContextBlock, null, 2)}

OPERATIONAL RULES:
1. Respect budget (INR ${body.budget}), trip dates (${body.dates.startDate} to ${body.dates.endDate}), family composition (${body.travelers.adults} adults, ${body.travelers.children} children), and travel pace.
2. Weather Awareness: Average temperature is ${weatherData.temperature}°C. Rain probability is ${weatherData.rain_probability}%. UV Index is ${weatherData.uv_index}. If UV > 6, shift outdoor sightseeing to early morning or late afternoon. If rain > 40%, prioritize indoor cultural sanctuaries.
3. Transportation Logistics: Recommend precise transport modes (Walk, Auto, Taxi, Metro, Cab) between time slots with cost and ETA reasoning.
4. Food Intelligence: Tag restaurants with Veg, Non-Veg, Vegan, Jain Friendly flags and Must-Try regional specialities.

REQUIRED STRICT JSON SCHEMA:
Return pure valid JSON matching ItineraryData interface without markdown code fencing (\`\`\`json) or commentary outside JSON.`;

    const userPrompt = `Generate a complete Travel OS itinerary for ${body.destination} (${body.travelType} trip) with budget INR ${body.budget}.`;
    const fullPrompt = `${travixaMasterSystemPrompt}\n\nUser Request:\n${userPrompt}`;
    const promptHash = await hashPrompt(fullPrompt);

    if (inFlightRequests.has(promptHash)) {
      return NextResponse.json(await inFlightRequests.get(promptHash));
    }

    const { data: cachedLog } = await supabase.from('ai_generation_logs').select('response_json').eq('prompt_hash', promptHash).single();
    if (cachedLog?.response_json) {
      return NextResponse.json(cachedLog.response_json);
    }

    const generationPromise = (async () => {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) throw new Error("GEMINI_API_KEY environment variable missing");
      const primaryUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiKey}`;
      const secondaryUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

      let aiResponseJson: any = null;
      try {
        aiResponseJson = await fetchWithRetry(primaryUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { temperature: 0.5, responseMimeType: "application/json" }
          })
        }, 2, 600);
      } catch (proErr) {
        console.warn(`[Travixa Travel OS] Gemini Pro failover for "${body.destination}". Calling Gemini Flash...`, proErr);
        aiResponseJson = await fetchWithRetry(secondaryUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { temperature: 0.6, responseMimeType: "application/json" }
          })
        }, 2, 600);
      }

      let rawText = aiResponseJson?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("Empty model output");

      rawText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsedJson = JSON.parse(rawText);

      // Stage 14: Structured Zod Runtime Schema Validation
      const validated = ItinerarySchema.parse(parsedJson);
      const tokenCount = aiResponseJson?.usageMetadata?.totalTokenCount || 750;

      // Stage 15: Database Caching Writes
      supabase.from('ai_generation_logs').insert({
        prompt_hash: promptHash, prompt_text: userPrompt, response_json: validated, token_count: tokenCount
      }).then(({ error }) => { if (error) console.warn("Log write error:", error.message); });

      supabase.from('destination_cache').upsert({
        destination_name: normDest, overview: validated.tripOverview || validated.destinationSummary, tags: [body.travelType, "Travel OS"]
      }, { onConflict: 'destination_name' }).then(({ error }) => { if (error) console.warn("Dest cache upsert error:", error.message); });

      return validated;
    })();

    inFlightRequests.set(promptHash, generationPromise);

    try {
      const result = await generationPromise;
      inFlightRequests.delete(promptHash);
      return NextResponse.json(result);
    } catch (aiErr) {
      inFlightRequests.delete(promptHash);
      console.warn(`[Travixa Travel OS] All live LLM generation failed for "${body.destination}". Serving baseline...`, aiErr);
      return NextResponse.json(getBaselineTemplate(body.destination, Number(body.budget), weatherData));
    }
  } catch (err: any) {
    console.error("Travel OS fatal exception:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
