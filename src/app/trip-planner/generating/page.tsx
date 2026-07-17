"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const PIPELINE_STAGES = [
  "Loading approved blueprint",
  "Fetching place details for your itinerary",
  "Building Day 1 schedule",
  "Building Day 2 schedule",
  "Optimizing travel routes",
  "Selecting meal venues",
  "Calculating travel distances",
  "Validating budget",
  "Checking weather compatibility",
  "Generating AI travel narrative"
];

export default function GeneratingPage() {
  const router = useRouter();
  const [activeStage, setActiveStage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const generateTrip = async () => {
      try {
        const blueprintStr = localStorage.getItem("tripvora_blueprint");
        if (!blueprintStr) {
          throw new Error("No blueprint found. Please start over.");
        }
        
        const blueprint = JSON.parse(blueprintStr);

        // Start fake progress for UI
        interval = setInterval(() => {
          setActiveStage((prev) => {
            if (prev < PIPELINE_STAGES.length - 1) return prev + 1;
            return prev;
          });
        }, 1500);

        const response = await fetch('/api/trip/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blueprint })
        });

        const resData = await response.json().catch(() => ({}));

        clearInterval(interval);
        setActiveStage(PIPELINE_STAGES.length);

        if (!response.ok || !resData.success) {
          const fullMsg = resData?.error || "Failed to generate itinerary";
          throw new Error(fullMsg);
        }

        // Save generated trip
        localStorage.setItem('last_generated_trip', JSON.stringify(resData.itinerary));

        setTimeout(() => {
          router.push('/trips/generated');
        }, 1000);

      } catch (err: any) {
        if (interval) clearInterval(interval);
        setError(err.message);
      }
    };

    generateTrip();
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]">
      <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Generating Your Itinerary</h2>
        
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/trip-planner/blueprint')}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium"
            >
              Back to Blueprint
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {PIPELINE_STAGES.map((stage, index) => (
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: index <= activeStage ? 1 : 0.3, x: index <= activeStage ? 0 : -20 }}
                className="flex items-center space-x-3"
              >
                {index < activeStage ? (
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-teal-400" />
                  </div>
                ) : index === activeStage ? (
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-white/10 shrink-0" />
                )}
                <span className={`text-sm ${index <= activeStage ? 'text-white' : 'text-slate-500'}`}>
                  {stage}
                </span>
              </motion.div>
            ))}
          </div>
        )}
        
        <AnimatePresence>
          {activeStage >= PIPELINE_STAGES.length && !error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center text-teal-400 font-medium"
            >
              <Check className="w-5 h-5 mr-2" />
              Itinerary ready!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
