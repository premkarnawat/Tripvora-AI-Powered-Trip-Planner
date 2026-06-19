import { NextResponse } from 'next/server';
import type { TripRequest, ItineraryData } from '@/types/trip';

export async function POST(request: Request) {
  try {
    const body: TripRequest = await request.json();

    // TODO: Connect to live Gemini API here using the body payload
    // const prompt = `Generate a trip for ${body.travelers.adults} adults to ${body.destination}...`;
    // const response = await gemini.generateContent(prompt);
    
    // MOCK ARCHITECTURE RESPONSE
    // This perfectly simulates what the Gemini API will return once hooked up
    const mockData: ItineraryData = {
      id: "trip_" + Date.now(),
      destination: body.destination || "Unknown Destination",
      totalDays: 5,
      totalBudget: parseInt(body.budget) || 5000,
      estimatedCost: 4250,
      currency: "USD",
      hotels: [
        {
          name: "Luxury Resort Spa",
          rating: 4.9,
          pricePerNight: 250,
          amenities: ["Pool", "Spa", "Breakfast"],
          imageUrl: "https://images.unsplash.com/photo-1566073171526-87f930ce6f6b?q=80&w=400&auto=format&fit=crop"
        }
      ],
      flights: [
        {
          airline: "Emirates",
          price: 850,
          duration: "14h 30m",
          stops: 1
        }
      ],
      days: [
        {
          day: 1,
          date: new Date().toISOString(),
          activities: [
            {
              time: "10:00 AM",
              title: "Arrival & Check-in",
              description: "Arrive at airport and transfer to hotel.",
              type: "travel",
              cost: 50,
              location: "Airport"
            }
          ]
        }
      ]
    };

    // Simulate network delay for AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json(mockData);

  } catch (error) {
    console.error("Trip generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
