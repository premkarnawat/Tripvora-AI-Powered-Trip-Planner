"use client";

import { useState, useEffect } from "react";
import { WizardPhase } from "@/components/plan/WizardPhase";
import { CommandCenter } from "@/components/plan/CommandCenter";

export default function PlanPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [phase, setPhase] = useState<"wizard" | "loading" | "os">("wizard");
  const [tripData, setTripData] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    // Hydrate from GlassSearchCard localStorage if available
    const savedParams = localStorage.getItem("temp_trip_params");
    if (savedParams) {
      try {
        const parsed = JSON.parse(savedParams);
        setTripData(parsed);
      } catch (e) {
        console.error("Failed to parse trip params", e);
      }
    }
  }, []);

  const handleWizardComplete = async (data: any) => {
    setPhase("loading");
    
    try {
      // Connect to the API Architecture
      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to generate trip");
      
      const itineraryData = await response.json();
      setTripData(itineraryData);
      setPhase("os");
    } catch (error) {
      console.error("Error generating trip:", error);
      // Fallback for now if API fails
      setTripData(data);
      setPhase("os");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#030712]">
      
      {phase === "wizard" && (
        <WizardPhase initialData={tripData} onComplete={handleWizardComplete} />
      )}

      {phase === "loading" && (
        <div className="min-h-screen flex flex-col items-center justify-center relative">
          {/* Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
              <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-b-transparent animate-spin animation-delay-200" style={{ animationDirection: 'reverse' }}/>
            </div>
            
            <h2 className="text-3xl font-black text-white font-sora mb-2 text-center animate-pulse">
              Compiling Travel Intelligence
            </h2>
            <p className="text-white/50 font-bold uppercase tracking-widest text-sm text-center">
              Fetching Flights • Booking Hotels • Parsing Weather
            </p>
          </div>
        </div>
      )}

      {phase === "os" && (
        <CommandCenter data={tripData} />
      )}

    </div>
  );
}
