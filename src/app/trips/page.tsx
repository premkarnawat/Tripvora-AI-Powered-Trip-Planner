"use client";

import { useEffect, useState } from "react";
import { 
  Map, Calendar, Users, ArrowRight, Plus, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TripsPage() {
  const [generatedTrip, setGeneratedTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('last_generated_trip');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setGeneratedTrip(data);
      } catch (e) {
        console.error("Failed to parse saved trip", e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  const trip = generatedTrip?.trip || generatedTrip || {};
  const destHub = trip.destination || "Your Destination";
  const start = trip.start_date || "Upcoming";
  const end = trip.end_date || "";
  const totalDays = trip.totalDays || (generatedTrip?.days?.length) || 5;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pt-28 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black tracking-widest uppercase mb-4">
              <Map className="w-3.5 h-3.5" /> Traveler Dashboard
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight font-sora">
              My Trips
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-1">
              View your upcoming adventures and relive your past journeys.
            </p>
          </div>

          <Link href="/trip-planner">
            <Button className="bg-black hover:bg-black/90 text-white rounded-full px-6 h-11 text-xs font-bold flex items-center gap-1.5 shadow-sm border-none">
              <Plus className="w-4 h-4" /> Create New Trip
            </Button>
          </Link>
        </div>

        {/* Upcoming Trips */}
        <div className="mb-16">
          <h2 className="text-xl font-extrabold text-black font-sora mb-6">Upcoming Trips</h2>
          
          {generatedTrip ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden shrink-0 bg-slate-50 relative">
                  <img 
                    src={generatedTrip?.map?.image || generatedTrip?.days?.[0]?.activities?.[0]?.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"} 
                    alt={destHub} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <h3 className="text-xl font-bold text-black font-sora">{destHub} Escape</h3>
                      <span className="bg-teal-50 text-teal-700 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                        UPCOMING
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-xs font-semibold mb-4">{start} {end ? `- ${end}` : ''}</p>
                    
                    <div className="flex items-center gap-6 mb-6 text-slate-500 text-xs font-bold uppercase">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{totalDays} Days</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>{trip.travelType || "Private Group"}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/trips/generated" className="mt-auto">
                    <Button variant="link" className="p-0 h-auto text-teal-600 font-bold hover:text-teal-700 flex items-center gap-1 text-xs uppercase tracking-widest no-underline hover:no-underline">
                      View Itinerary <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[32px] p-12 border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <Sparkles className="w-12 h-12 text-teal-200 mb-4" />
              <h3 className="text-xl font-bold text-black font-sora mb-2">No trips planned yet</h3>
              <p className="text-slate-500 text-sm max-w-md mb-6">
                Your dashboard is empty! Click the button below to generate your first AI-powered itinerary.
              </p>
              <Link href="/trip-planner">
                <Button className="bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-full px-6 h-11 text-xs font-bold border-none">
                  Generate Your First Itinerary
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
