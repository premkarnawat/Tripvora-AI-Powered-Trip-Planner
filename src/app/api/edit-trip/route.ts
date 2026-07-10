import { NextResponse } from 'next/server';
import type { ItineraryData } from '@/types/trip';
import { ItinerarySchema } from '@/lib/validations/itinerary';
import { withSecurity } from '@/lib/security/api-wrapper';
import { z } from 'zod';

// Automated Server-Side Budget Intelligence Recalculator
function recalculateBudgetTotals(itinerary: any): any {
  let hotelCost = 0;
  let transportCost = 0;
  let foodCost = 0;
  let activityCost = 0;
  let miscCost = 0;

  itinerary.hotels?.forEach((h: any) => {
    hotelCost += (h.pricePerNight * (itinerary.totalDays || 1));
  });

  itinerary.flights?.forEach((f: any) => {
    transportCost += (f.price || 0);
  });

  itinerary.days?.forEach((day: any) => {
    const slots = [...(day.morning || []), ...(day.afternoon || []), ...(day.evening || []), ...(day.night || [])];
    slots.forEach((act: any) => {
      const c = Number(act.cost) || 0;
      if (act.type === 'meal') foodCost += c;
      else if (act.type === 'travel' || act.type === 'transfer' || act.type === 'flight') transportCost += c;
      else if (act.type === 'hotel') hotelCost += c;
      else if (act.type === 'misc') miscCost += c;
      else activityCost += c;
    });
  });

  const overallTotal = hotelCost + transportCost + foodCost + activityCost + miscCost;
  const targetBudget = Number(itinerary.totalBudget) || (overallTotal * 1.1);
  const remaining = targetBudget - overallTotal;
  const usedRatio = overallTotal / (targetBudget || 1);
  const healthScore = Math.min(Math.max(Math.floor(usedRatio * 100), 1), 100);

  itinerary.estimatedCost = overallTotal;
  itinerary.budgetTracker = {
    hotels: hotelCost,
    transport: transportCost,
    food: foodCost,
    activities: activityCost,
    shoppingOrMisc: miscCost,
    dailyTotalAverage: Math.floor(overallTotal / (itinerary.totalDays || 1)),
    overallTotal: overallTotal,
    remainingOrSavings: remaining,
    budgetHealthScore: healthScore
  };

  return itinerary;
}

const editTripSchema = z.object({
  currentItinerary: z.any(),
  userMessage: z.string().min(1),
  chatHistory: z.array(z.any()).optional()
});

export const POST = withSecurity(
  {
    rateLimit: { limit: 120, windowSeconds: 60 },
    schema: editTripSchema,
    requireAuth: false // Public for now, could be protected
  },
  async (request: Request) => {
    try {
      const body = await request.json();
      const { currentItinerary, userMessage, chatHistory } = body;

      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) return NextResponse.json({ error: "Server API configuration missing" }, { status: 500 });
      const editUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiKey}`;

      const systemInstruction = `You are the Travixa AI Travel Intelligence Engine — Granular Document Editor.
Your mandate is to treat the provided JSON itinerary as a strict structured editable document.

CRITICAL EDITING RULES:
1. SELECTIVE EDITING ONLY: If the user requests a modification (e.g. "Replace Day 2 hotel" or "Add a beach visit"), modify ONLY the specific affected time slot or property. Preserve 100% of the remaining days, activities, titles, and descriptions unchanged.
2. BUDGET ADJUSTMENT: If the user says "Reduce my budget by INR 15000", systematically optimize affected cost items while preserving the core flow.
3. STRICT SCHEMA: Return pure valid JSON strictly conforming to the exact input schema. Never include markdown code fencing (\`\`\`json) or conversational commentary outside JSON.`;

      const promptText = `${systemInstruction}\n\nCurrent Itinerary Document:\n${JSON.stringify(currentItinerary)}\n\nRecent Conversation History:\n${JSON.stringify(chatHistory || [])}\n\nUser Modification Instruction:\n"${userMessage}"\n\nReturn the updated JSON document matching the exact schema. Pure JSON only.`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(editUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { temperature: 0.3, responseMimeType: "application/json" }
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`AI Editor API returned HTTP ${res.status}`);
      }

      const aiData = await res.json();
      let rawText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("Empty editor response");

      rawText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsedJson = JSON.parse(rawText);

      // Enforce Zod Schema Validation
      let validated = ItinerarySchema.parse(parsedJson);

      // Enforce Automated Budget Intelligence Recalculation
      validated = recalculateBudgetTotals(validated);

      return NextResponse.json({
        updatedItinerary: validated,
        message: `I have updated your itinerary based on: "${userMessage}". All budget metrics have been dynamically re-audited.`
      });
    } catch (err: any) {
      console.error("Granular edit API error:", err);
      return NextResponse.json({ error: err.message || "Failed to edit itinerary" }, { status: 500 });
    }
  }
);
