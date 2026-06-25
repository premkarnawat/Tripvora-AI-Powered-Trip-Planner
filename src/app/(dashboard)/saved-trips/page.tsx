"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, Calendar, Users, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SavedTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await fetch('/api/trips');
        if (res.ok) {
          const data = await res.json();
          // Filter only saved trips (drafts)
          setTrips(data.filter((t: any) => t.status === 'draft'));
        } else {
          console.error("Failed to fetch trips");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl text-white/60 mb-1 font-medium">My Trips</h2>
        <h1 className="text-3xl md:text-4xl font-bold text-white font-sora mb-10">
          Saved Itineraries
        </h1>
      </motion.div>

      {loading ? (
        <div className="py-20 text-center text-white/60">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading your saved itineraries...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="py-20 text-center border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
          <Compass className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Saved Trips Yet</h3>
          <p className="text-white/60 mb-6">Start planning your next adventure to see it here.</p>
          <Button onClick={() => router.push("/trip-planner")} className="bg-primary hover:bg-primary/90 text-white">
            Plan a New Trip
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {trips.map((trip: any, i: number) => (
            <motion.div 
              key={trip.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 rounded-3xl flex flex-col hover:bg-white/5 transition-colors group border border-white/10"
            >
              <div className="w-full h-40 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-2xl mb-6 relative overflow-hidden">
                {/* Fallback image */}
                <img 
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&auto=format&fit=crop" 
                  alt={trip.destination || trip.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{trip.name || trip.destination || "Unnamed Trip"}</h3>
              <p className="text-sm text-white/60 mb-6">
                Saved on {new Date(trip.created_at || Date.now()).toLocaleDateString()}
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white/80">{trip.duration_days || 5} Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white/80">{trip.adult_count || 2} Travelers</span>
                </div>
              </div>
              
              <Button 
                onClick={() => router.push(`/trips/${trip.id}`)}
                className="w-full bg-white/10 hover:bg-primary hover:text-white text-white border-none transition-all mt-auto flex items-center justify-center gap-2"
              >
                View Itinerary <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
