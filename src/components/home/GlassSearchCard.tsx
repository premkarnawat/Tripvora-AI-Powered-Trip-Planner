"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Wallet, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GlassSearchCard() {
  return (
    <div className="relative glass-card rounded-3xl md:rounded-full p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 overflow-hidden bg-[#0F172A]/70 backdrop-blur-2xl border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
      
      {/* Input Group 1: Destination */}
      <div className="flex-1 flex items-center gap-4 px-6 py-4 w-full rounded-2xl md:rounded-full hover:bg-white/5 transition-colors cursor-text group border-b md:border-b-0 md:border-r border-white/5">
        <MapPin className="text-primary w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <div className="flex flex-col w-full text-left">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1">Where to?</span>
          <input 
            type="text" 
            placeholder="Goa, Bali, Kashmir..." 
            className="bg-transparent border-none outline-none text-white placeholder:text-white/30 text-base font-medium w-full focus:placeholder:text-white/50 transition-colors"
          />
        </div>
      </div>

      {/* Input Group 2: Dates */}
      <div className="flex-1 flex items-center gap-4 px-6 py-4 w-full rounded-2xl md:rounded-full hover:bg-white/5 transition-colors cursor-text group border-b md:border-b-0 md:border-r border-white/5">
        <Calendar className="text-primary w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <div className="flex flex-col w-full text-left">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1">When?</span>
          <input 
            type="text" 
            placeholder="Add dates" 
            className="bg-transparent border-none outline-none text-white placeholder:text-white/30 text-base font-medium w-full focus:placeholder:text-white/50 transition-colors"
          />
        </div>
      </div>

      {/* Input Group 3: Type */}
      <div className="flex-1 flex items-center gap-4 px-6 py-4 w-full rounded-2xl md:rounded-full hover:bg-white/5 transition-colors cursor-text group">
        <Compass className="text-primary w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <div className="flex flex-col w-full text-left">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-1">Travel Type</span>
          <select className="bg-transparent border-none outline-none text-white text-base font-medium w-full cursor-pointer appearance-none">
            <option className="bg-[#0F172A] text-white">Couple / Romance</option>
            <option className="bg-[#0F172A] text-white">Family</option>
            <option className="bg-[#0F172A] text-white">Solo Backpacker</option>
            <option className="bg-[#0F172A] text-white">Luxury Resort</option>
          </select>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full md:w-auto p-2">
        <Button 
          size="lg" 
          className="w-full md:w-auto h-16 md:h-16 px-8 rounded-2xl md:rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shimmer border-none"
        >
          Generate Trip
        </Button>
      </div>

    </div>
  );
}
