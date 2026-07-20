import { NextResponse } from 'next/server';
import { withSecurity } from '@/lib/security/api-wrapper';
import { z } from 'zod';

const editTripSchema = z.object({
  currentItinerary: z.any(),
  editType: z.enum(['swap_attraction', 'remove_attraction', 'add_attraction', 'change_time', 'reorder_day', 'general']),
  targetDay: z.number().optional(),
  targetActivityIndex: z.number().optional(),
  newValue: z.any().optional(),
  userMessage: z.string().min(1),
});

export const POST = withSecurity(
  {
    rateLimit: { limit: 10, windowSeconds: 60 },
    requireAuth: true,
  },
  async (request: Request) => {
    try {
      const body = await request.json();
      const { currentItinerary, editType, targetDay, targetActivityIndex, newValue, userMessage } = body;
      
      if (!currentItinerary || !currentItinerary.days) {
        return NextResponse.json({ error: 'Invalid itinerary' }, { status: 400 });
      }

      const updatedItinerary = { ...currentItinerary };
      const days = [...updatedItinerary.days];

      switch (editType) {
        case 'remove_attraction': {
          if (targetDay !== undefined && targetActivityIndex !== undefined) {
            const dayIdx = targetDay - 1;
            if (days[dayIdx] && days[dayIdx].activities[targetActivityIndex]) {
              days[dayIdx] = {
                ...days[dayIdx],
                activities: days[dayIdx].activities.filter((_: any, i: number) => i !== targetActivityIndex),
              };
              // Recalculate day totals
              days[dayIdx].totalActiveHours = Math.round(
                days[dayIdx].activities.reduce((sum: number, a: any) => sum + (a.duration || 0), 0) / 60
              );
              days[dayIdx].totalCost = days[dayIdx].activities.reduce((sum: number, a: any) => sum + (a.cost || 0), 0);
            }
          }
          break;
        }

        case 'swap_attraction': {
          if (targetDay !== undefined && targetActivityIndex !== undefined && newValue) {
            const dayIdx = targetDay - 1;
            if (days[dayIdx] && days[dayIdx].activities[targetActivityIndex]) {
              days[dayIdx].activities[targetActivityIndex] = {
                ...days[dayIdx].activities[targetActivityIndex],
                ...newValue,
              };
            }
          }
          break;
        }

        case 'change_time': {
          if (targetDay !== undefined && targetActivityIndex !== undefined && newValue?.time) {
            const dayIdx = targetDay - 1;
            if (days[dayIdx] && days[dayIdx].activities[targetActivityIndex]) {
              days[dayIdx].activities[targetActivityIndex] = {
                ...days[dayIdx].activities[targetActivityIndex],
                time: newValue.time,
              };
              // Sort activities by time after change
              days[dayIdx].activities.sort((a: any, b: any) => {
                const timeA = a.time.replace(/[^0-9:]/g, '');
                const timeB = b.time.replace(/[^0-9:]/g, '');
                return timeA.localeCompare(timeB);
              });
            }
          }
          break;
        }

        case 'reorder_day': {
          // Swap two days
          if (targetDay !== undefined && newValue?.targetDay !== undefined) {
            const fromIdx = targetDay - 1;
            const toIdx = newValue.targetDay - 1;
            if (days[fromIdx] && days[toIdx]) {
              [days[fromIdx], days[toIdx]] = [days[toIdx], days[fromIdx]];
              // Update day numbers
              days[fromIdx].day = fromIdx + 1;
              days[toIdx].day = toIdx + 1;
            }
          }
          break;
        }

        case 'general':
        default: {
          // For general edits, use AI but ONLY for narrative updates
          // The structure stays the same - AI just updates descriptions
          const geminiKey = process.env.GEMINI_API_KEY;
          if (geminiKey) {
            try {
              const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
              const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: AbortSignal.timeout(15000),
                body: JSON.stringify({
                  contents: [{
                    parts: [{
                      text: `You are editing a travel itinerary. The user requested: "${userMessage}"

Current itinerary has ${days.length} days.

IMPORTANT RULES:
1. Return ONLY a JSON object with the fields you want to update
2. You can ONLY update these fields: day titles, activity descriptions, activity tips
3. You CANNOT add, remove, or change the order of activities
4. You CANNOT change times, costs, coordinates, or place names
5. If the user's request requires structural changes (adding/removing places), return {"requiresStructuralEdit": true, "suggestion": "Please use the specific edit controls to add or remove activities."}

Return JSON only.`
                    }]
                  }],
                  generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
                }),
              });

              if (res.ok) {
                const data = await res.json();
                const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (raw) {
                  const parsed = JSON.parse(raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim());
                  if (parsed.requiresStructuralEdit) {
                    return NextResponse.json({
                      updatedItinerary: currentItinerary,
                      message: parsed.suggestion || 'Please use the specific edit controls for this change.',
                      requiresStructuralEdit: true,
                    });
                  }
                }
              }
            } catch (aiErr) {
              console.error('AI edit helper failed:', aiErr);
              // Continue without AI assistance
            }
          }
          break;
        }
      }

      updatedItinerary.days = days;

      return NextResponse.json({
        updatedItinerary,
        message: `Itinerary updated: ${editType}`,
      });
    } catch (err: any) {
      console.error('Edit API error:', err);
      return NextResponse.json({ error: 'Failed to edit itinerary' }, { status: 500 });
    }
  }
);
