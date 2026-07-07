"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardPhase } from "@/components/plan/WizardPhase";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, Plane } from "lucide-react";

export default function TripPlannerPage() {
  const router = useRouter();
  const [loadingPhase, setLoadingPhase] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");

  const handleComplete = async (data: any) => {
    setLoadingPhase(true);
    let progress = 10;
    setLoadingProgress(progress);
    
    const loaderTexts = [
      "Initializing Travel Intelligence Engines...",
      "Analyzing GIS nodes and Transport hubs...",
      "Calculating Traveler DNA and Budget matrix...",
      "Matching accommodations and strict real-world constraints...",
      "Optimizing daily routing vectors..."
    ];
    setLoadingText(loaderTexts[0]);

    const interval = setInterval(() => {
      progress += 15;
      if (progress > 90) progress = 90;
      setLoadingProgress(progress);
      const textIdx = Math.min(Math.floor(progress / 20), loaderTexts.length - 1);
      setLoadingText(loaderTexts[textIdx]);
    }, 700);

    try {
      const payload = {
        source: data.source,
        destination: data.destination,
        trip_type: data.travelType.toLowerCase(),
        travelers: data.members.adults + data.members.children + data.members.seniors,
        boys: data.members.boys,
        girls: data.members.girls,
        children: data.members.children,
        budget: data.budget,
        currency: "INR",
        start_date: data.tripDates.start || data.arrival.date,
        end_date: data.tripDates.end || data.departure.date,
        arrival_datetime: `${data.arrival.date} ${data.arrival.time}`,
        comfort: data.comfort.toLowerCase(),
        pace: data.pace.toLowerCase(),
        walking: "medium", // Defaulting walking to match DTO if not collected
        food: data.foodPreference.toLowerCase(),
        interests: data.interests,
        hotel_preference: data.hotelPreference,
        transport_preference: data.transportPreference,
        special_requests: data.specialPreferences
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
      
      localStorage.setItem('last_generated_trip', JSON.stringify(resData));
      
      setTimeout(() => {
        router.push('/trips/generated');
      }, 500);

    } catch (err: any) {
      clearInterval(interval);
      alert(`Error: ${err.message}`);
      setLoadingPhase(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden font-sora">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
              <Plane className="text-white w-6 h-6 rotate-[-45deg]" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">TRIPVORA</span>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {!loadingPhase ? (
          <WizardPhase initialData={{}} onComplete={handleComplete} />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F172A]/95 backdrop-blur-2xl"
          >
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
              <div 
                className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"
                style={{ animationDuration: '3s' }}
              />
              <div 
                className="absolute inset-4 border-4 border-blue-500 rounded-full border-b-transparent animate-spin"
                style={{ animationDuration: '2s', animationDirection: 'reverse' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Bot className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-teal-400" /> Building Intelligence Matrix
            </h2>
            
            <p className="text-white/60 mb-8 max-w-md text-center h-6">
              {loadingText}
            </p>

            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-teal-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="mt-4 font-mono text-sm text-teal-400 font-bold">
              {Math.round(loadingProgress)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
