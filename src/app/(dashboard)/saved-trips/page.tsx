"use client";

import { motion } from "framer-motion";
import { Compass, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavedTrips() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Placeholder for Trips */}
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-6 rounded-3xl flex flex-col hover:bg-white/5 transition-colors group"
          >
            <div className="w-full h-40 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-2xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Trip {i} Destination</h3>
            <p className="text-sm text-white/60 mb-6">Generated on May 10, 2024</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm text-white/80">5 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-white/80">2 Travelers</span>
              </div>
            </div>
            
            <Button className="w-full bg-white/10 hover:bg-primary hover:text-white text-white border-none transition-all mt-auto flex items-center justify-center gap-2">
              View Itinerary <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
