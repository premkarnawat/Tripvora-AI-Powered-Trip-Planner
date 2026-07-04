// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRIPVORA — Gemini Narrative Engine (STORYTELLING ONLY)
// Does NOT invent places, timings, or prices.
// Generates ONLY descriptions, themes, and travel tips based on the actual built schedule.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { timedStage } from './logger';

export interface AIContext {
  origin: string;
  destination: string;
  budget: number;
  duration: number;
  travelType: string;
  travelers: { adults: number; children: number; seniors: number };
  arrivalMode: string;
  hotelPreference: string;
  foodPreference: string;
  interests: string[];
  tripPurpose: string;
  weather: { temperature: number; description: string; rainProbability: number } | null;
  wikiExtract: string | null;
  schedule: Array<{
    day: number;
    theme: string; // The baseline theme from schedule engine
    places: string[]; // List of real place names visited on this day
  }>;
}

export interface GeneratedNarrative {
  tripOverview: string;
  localTravelAdvice: string;
  packingSuggestions: string[];
  safetyTips: string[];
  dayThemes: Record<number, string>; // Maps Day number -> Creative Theme Name
  placeDescriptions: Record<string, string>; // Maps Place Name -> Creative description + tips
}

function buildPrompt(ctx: AIContext): string {
  const totalTravelers = ctx.travelers.adults + ctx.travelers.children + ctx.travelers.seniors;

  const weatherBlock = ctx.weather
    ? `CURRENT WEATHER: ${ctx.weather.temperature}°C, ${ctx.weather.description}, ${ctx.weather.rainProbability}% rain chance`
    : 'WEATHER: data unavailable — plan for average conditions';

  const wikiBlock = ctx.wikiExtract
    ? `ABOUT ${ctx.destination.toUpperCase()}: ${ctx.wikiExtract.slice(0, 800)}`
    : '';

  // Extract all unique places from schedule
  const uniquePlaces = Array.from(new Set(ctx.schedule.flatMap(d => d.places)));

  const scheduleBlock = ctx.schedule.map(d => `Day ${d.day}: ${d.places.join(', ')}`).join('\n');

  return `You are the Lead Travel Copywriter and Local Expert for ${ctx.destination}. A paying client has hired you to write the narrative descriptions for their ${ctx.duration}-day trip.

═══════════════════════════════════════
CLIENT BRIEF
═══════════════════════════════════════
• From: ${ctx.origin} → To: ${ctx.destination}
• Travelers: ${totalTravelers} (${ctx.travelType})
• Trip purpose: ${ctx.tripPurpose}
• Interests: ${ctx.interests.join(', ')}

${weatherBlock}
${wikiBlock}

═══════════════════════════════════════
THE SCHEDULE (ALREADY BUILT)
═══════════════════════════════════════
Here is the exact schedule we have already locked in. DO NOT change the schedule, add places, or suggest alternatives. 
Your job is ONLY to write descriptions for these specific places and days.

${scheduleBlock}

═══════════════════════════════════════
YOUR TASK
═══════════════════════════════════════

1. tripOverview: Write a 2-3 sentence cinematic, emotional overview of why this trip will be incredible.
2. localTravelAdvice: 3-4 practical sentences about getting around ${ctx.destination}. Local transport, tips, things to know.
3. packingSuggestions: List 5-8 highly specific items to pack based on the weather and activities.
4. safetyTips: List 3-5 specific safety tips for ${ctx.destination}.
5. dayThemes: Provide a creative, cinematic 3-6 word title for each Day (1 to ${ctx.duration}).
6. placeDescriptions: For EVERY place listed in the schedule, write a 1-2 sentence compelling description + 1 specific local tip (e.g., "Get the corner table", "Best lighting at 4pm").

WRITING STYLE:
- Write like a luxury travel magazine editor.
- Short, punchy, evocative sentences.
- Specific, actionable tips.
- NEVER use these words: curated, bespoke, immersive, gastronomic, sanctuary, nestled, tapestry, plethora, myriad, picturesque, unparalleled.

═══════════════════════════════════════
OUTPUT FORMAT (STRICT JSON ONLY)
═══════════════════════════════════════

{
  "tripOverview": "...",
  "localTravelAdvice": "...",
  "packingSuggestions": ["item1", "item2"],
  "safetyTips": ["tip1", "tip2"],
  "dayThemes": {
    "1": "Arrival & Coastal Sunsets",
    "2": "Ancient Forts & Hidden Coves"
  },
  "placeDescriptions": {
    "Name of Place 1": "Description and tip.",
    "Name of Place 2": "Description and tip."
  }
}`;
}

async function callGemini(prompt: string, model: string, apiKey: string, timeoutMs: number): Promise<GeneratedNarrative> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`GEMINI_API_FAILED: Status ${res.status}`);
  }

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!raw) {
    throw new Error('GEMINI_API_FAILED: Empty response from model');
  }

  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error('GEMINI_API_FAILED: Failed to parse JSON response');
  }

  // Basic schema validation
  if (!parsed.tripOverview || !parsed.placeDescriptions) {
    throw new Error('GEMINI_API_FAILED: Missing required fields in response');
  }

  return parsed as GeneratedNarrative;
}

export async function generateNarrative(context: AIContext): Promise<GeneratedNarrative> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_FAILED: Missing API key');
  }

  return await timedStage('GEMINI', async () => {
    const prompt = buildPrompt(context);

    try {
      // Primary model
      return await callGemini(prompt, 'gemini-2.5-flash', apiKey, 25000);
    } catch (e) {
      console.warn('Primary Gemini model failed, trying fallback...', e);
      // Fallback model
      return await callGemini(prompt, 'gemini-2.0-flash-lite', apiKey, 20000);
    }
  });
}
