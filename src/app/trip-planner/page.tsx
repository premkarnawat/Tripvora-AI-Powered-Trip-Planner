"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TripWizard, WizardData } from "@/components/trip-wizard/TripWizard";

export default function TripPlannerPage() {
  const router = useRouter();
  const [loadingPhase, setLoadingPhase] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");

  const handleComplete = async (data: WizardData) => {
    setLoadingPhase(true);
    let progress = 10;
    setLoadingProgress(progress);

    const loaderTexts = [
      "Initializing Travel Intelligence Engines...",
      "Analyzing GIS nodes and Transport hubs...",
      "Calculating Traveler DNA and Budget matrix...",
      "Matching accommodations and real-world constraints...",
      "Optimizing daily routing vectors...",
      "Building your personalized itinerary..."
    ];
    setLoadingText(loaderTexts[0]);

    const interval = setInterval(() => {
      progress += 12;
      if (progress > 92) progress = 92;
      setLoadingProgress(progress);
      const textIdx = Math.min(Math.floor(progress / 16), loaderTexts.length - 1);
      setLoadingText(loaderTexts[textIdx]);
    }, 800);

    try {
      // Map new 12-step wizard data → API payload
      const totalMembers = data.members.adults + data.members.children + data.members.seniors;

      // Compute comfort from budget mode + hotel preferences
      const comfortMap: Record<string, string> = {
        'Budget': 'budget',
        '2 Star': 'budget',
        '3 Star': 'comfortable',
        '4 Star': 'comfortable',
        '5 Star': 'luxury',
        'Luxury': 'luxury',
        'Resort': 'luxury',
        'Boutique': 'comfortable',
      };
      const topHotelPref = data.hotelPreference?.[0] || '';
      const comfort = comfortMap[topHotelPref] || 'comfortable';

      // Map pace
      const paceMap: Record<string, string> = { slow: 'slow', balanced: 'balanced', explorer: 'fast' };
      const pace = paceMap[data.pace] || 'balanced';

      // Build arrival datetime
      let arrivalDatetime = '';
      if (data.hasTransport && data.transport) {
        arrivalDatetime = `${data.transport.arrival.date} ${data.transport.arrival.time}`;
      } else if (data.tripDates.start) {
        arrivalDatetime = `${data.tripDates.start} 10:00`;
      }

      // Determine food preference (pick first or default)
      const foodPref = data.foodPreference?.[0]?.toLowerCase().replace(' ', '') || 'veg';

      const payload = {
        source: data.source,
        destination: data.destination,
        trip_type: data.travelType?.toLowerCase() || 'couple',
        travelers: totalMembers || 2,
        boys: data.members.boys || 0,
        girls: data.members.girls || 0,
        children: data.members.children || 0,
        budget: data.budget || 50000,
        currency: "INR",
        start_date: data.tripDates.start || data.transport?.arrival?.date || '',
        end_date: data.tripDates.end || data.transport?.departure?.date || '',
        arrival_datetime: arrivalDatetime,
        comfort,
        pace,
        walking: "medium",
        food: foodPref,
        interests: data.interests || [],
        hotel_preference: data.hotelPreference || [],
        transport_preference: data.hasTransport && data.transport ? [data.transport.type] : [],
        special_requests: [],
        // NEW FIELDS for enhanced engine
        budget_mode: data.budgetMode || 'balanced',
        must_visit: data.mustVisit || [],
        has_transport: data.hasTransport,
        transport_details: data.transport,
        has_hotel: data.hasHotel,
        hotel_details: data.hotel,
        food_preferences: data.foodPreference || [],
        destination_type: data.destinationType || 'city',
        source_coords: data.sourceCoords,
        destination_coords: data.destinationCoords,
      };

      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json().catch(() => ({}));

      clearInterval(interval);
      setLoadingProgress(100);
      setLoadingText("Itinerary finalized! Redirecting...");

      if (resData?.status === "INSUFFICIENT_REAL_DATA") {
        throw new Error(`Trip rejected. Missing verified data: ${resData.missing.join(", ")}.`);
      }
      if (!response.ok) throw new Error(resData?.error || resData?.reason || "Failed to generate itinerary");

      // Clear wizard progress on success
      localStorage.removeItem('tripvora_wizard_progress');
      localStorage.setItem('last_generated_trip', JSON.stringify(resData));

      setTimeout(() => {
        router.push('/trips/generated');
      }, 600);

    } catch (err: any) {
      clearInterval(interval);
      setLoadingPhase(false);
      setLoadingProgress(0);
      alert(`Error: ${err.message}`);
    }
  };

  if (loadingPhase) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1e293b 100%)',
      }}>
        {/* Animated rings */}
        <div style={{ position: 'relative', width: 128, height: 128, marginBottom: 32 }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid rgba(255,255,255,0.08)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid #0EA5A4',
            borderRadius: '50%',
            borderTopColor: 'transparent',
            animation: 'spin 3s linear infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: 16,
            border: '3px solid #3b82f6',
            borderRadius: '50%',
            borderBottomColor: 'transparent',
            animation: 'spin 2s linear infinite reverse',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: 32 }}>✨</span>
          </div>
        </div>

        <h2 style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#fff',
          marginBottom: 12,
          letterSpacing: -0.5,
        }}>
          Building Your Trip
        </h2>

        <p style={{
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 32,
          maxWidth: 400,
          textAlign: 'center',
          fontSize: 14,
          minHeight: 20,
          transition: 'opacity 0.3s',
        }}>
          {loadingText}
        </p>

        {/* Progress bar */}
        <div style={{
          width: 256,
          height: 6,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 6,
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${loadingProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #0EA5A4, #3b82f6)',
            borderRadius: 6,
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
        <div style={{
          marginTop: 12,
          fontFamily: 'monospace',
          fontSize: 14,
          color: '#0EA5A4',
          fontWeight: 700,
        }}>
          {Math.round(loadingProgress)}%
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <TripWizard onComplete={handleComplete} />;
}
