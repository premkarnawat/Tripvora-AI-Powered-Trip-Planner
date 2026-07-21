"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TripWizard, WizardData } from "@/components/trip-wizard/TripWizard";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const PIPELINE_STAGES = [
  "Validating destination",
  "Understanding traveler profile",
  "Discovering nearby attractions",
  "Checking weather forecast",
  "Calculating transport routes",
  "Selecting hotels & restaurants",
  "Estimating budget allocation",
  "Validating must-visit places",
  "Optimizing travel clusters",
  "Building trip blueprint"
];

export default function TripPlannerPage() {
  const router = useRouter();
  const [loadingPhase, setLoadingPhase] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ── Auth Gate: Redirect to login if not authenticated ──
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Save current URL so we can redirect back after login
          const returnUrl = encodeURIComponent(window.location.pathname);
          router.replace(`/login?redirect=${returnUrl}`);
          return;
        }
        setIsAuthenticated(true);
      } catch (err) {
        router.replace('/login');
        return;
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [router]);

  const handleComplete = async (data: WizardData) => {
    setLoadingPhase(true);
    setActiveStage(0);

    const interval = setInterval(() => {
      setActiveStage((prev) => {
        if (prev < PIPELINE_STAGES.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 600);

    try {
      const totalMembers = data.members.adults + data.members.children + data.members.seniors;

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

      const paceMap: Record<string, string> = { slow: 'slow', balanced: 'balanced', explorer: 'fast' };
      const pace = paceMap[data.pace] || 'balanced';

      let arrivalDatetime = '';
      if (data.hasTransport && data.transport) {
        arrivalDatetime = `${data.transport.arrival.date} ${data.transport.arrival.time}`;
      } else if (data.tripDates.start) {
        arrivalDatetime = `${data.tripDates.start} 10:00`;
      }

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

      const response = await fetch('/api/trip/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json().catch(() => ({}));

      clearInterval(interval);
      setActiveStage(PIPELINE_STAGES.length);

      // Handle 401 — redirect to login
      if (response.status === 401) {
        router.push('/login?redirect=/trip-planner');
        return;
      }

      if (!response.ok || !resData.success) {
        const fullMsg = resData?.error || "Failed to generate blueprint";
        throw new Error(fullMsg);
      }

      localStorage.removeItem('tripvora_wizard_progress');
      localStorage.setItem('tripvora_blueprint', JSON.stringify(resData.blueprint));

      setTimeout(() => {
        router.push('/trip-planner/blueprint');
      }, 1000);

    } catch (err: any) {
      clearInterval(interval);
      setLoadingPhase(false);
      alert(`Error: ${err.message}`);
    }
  };

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]">
        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    );
  }

  if (loadingPhase) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]">
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Analyzing Your Trip</h2>
          <div className="space-y-4">
            {PIPELINE_STAGES.map((stage, index) => (
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: index <= activeStage ? 1 : 0.3, x: index <= activeStage ? 0 : -20 }}
                className="flex items-center space-x-3"
              >
                {index < activeStage ? (
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-teal-400" />
                  </div>
                ) : index === activeStage ? (
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-white/10" />
                )}
                <span className={`text-sm ${index <= activeStage ? 'text-white' : 'text-slate-500'}`}>
                  {stage}
                </span>
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {activeStage >= PIPELINE_STAGES.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center text-teal-400 font-medium"
              >
                <Check className="w-5 h-5 mr-2" />
                Trip blueprint ready!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return <TripWizard onComplete={handleComplete} />;
}
