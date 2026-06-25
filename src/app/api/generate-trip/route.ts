import { NextResponse } from 'next/server';
import type { TripRequest, ItineraryData } from '@/types/trip';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper to hash prompt for caching
async function hashPrompt(text: string) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: Request) {
  try {
    const body: TripRequest = await request.json();
    
    // 1. Build the prompt
    const prompt = `Generate a highly detailed luxury travel itinerary for ${body.destination}.
    Travelers: ${body.travelers.adults} adults, ${body.travelers.children} children.
    Travel Type: ${body.travelType}
    Budget: ₹${body.budget}
    Duration: ${body.dates.startDate} to ${body.dates.endDate}.
    
    Return the response STRICTLY as a JSON object matching this exact TypeScript interface:
    {
      "id": "string",
      "destination": "string",
      "totalDays": number,
      "totalBudget": number,
      "estimatedCost": number,
      "currency": "INR",
      "hotels": [{ "name": "string", "rating": number, "pricePerNight": number, "amenities": ["string"], "imageUrl": "string" }],
      "flights": [{ "airline": "string", "price": number, "duration": "string", "stops": number }],
      "days": [{
        "day": number,
        "date": "ISO string",
        "activities": [{
          "time": "string",
          "title": "string",
          "description": "string",
          "type": "travel|activity|meal|stay",
          "cost": number,
          "location": "string",
          "rating": number
        }]
      }]
    }
    DO NOT wrap the response in markdown blocks like \`\`\`json. Return pure JSON.`;

    const promptHash = await hashPrompt(prompt);

    // 2. Setup Supabase Client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {}
        }
      }
    );

    // 3. Check Cache
    const { data: cached } = await supabase
      .from('ai_generation_logs')
      .select('response_json')
      .eq('prompt_hash', promptHash)
      .single();

    if (cached && cached.response_json) {
      return NextResponse.json(cached.response_json);
    }

    // 4. Call Gemini via REST (No SDK needed)
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!geminiKey) throw new Error("Missing Gemini API Key");

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const aiData = await response.json();
    let textResponse = aiData.candidates[0].content.parts[0].text;
    
    // Parse JSON
    const itineraryJson: ItineraryData = JSON.parse(textResponse);

    // 5. Save to Cache (fail silently if table doesn't exist yet during provisioning)
    const { error: cacheError } = await supabase.from('ai_generation_logs').insert({
      prompt_hash: promptHash,
      prompt_text: prompt,
      response_json: itineraryJson,
      token_count: 0 // Could calculate from usage metadata
    });
    if (cacheError) console.error("Cache save failed:", cacheError);

    return NextResponse.json(itineraryJson);

  } catch (error: any) {
    console.error("Trip generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
