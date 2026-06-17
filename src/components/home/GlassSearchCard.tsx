"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Wallet, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function GlassSearchCard() {
  return (
    <div className="relative rounded-xl p-2 flex flex-col md:flex-row items-center gap-2 overflow-hidden bg-black/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
      
      {/* Input Group 1: Destination */}
      <div className="flex-1 flex items-center gap-4 px-6 py-4 w-full rounded-lg hover:bg-white/5 transition-colors cursor-text group border-b md:border-b-0 md:border-r border-white/5">
        <MapPin className="text-primary w-5 h-5 group-hover:scale-105 transition-transform duration-300" />
        <div className="flex flex-col w-full text-left">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1 font-sora">Where to?</span>
          <input 
            type="text" 
            placeholder="Goa, Bali, Kashmir..." 
            className="bg-transparent border-none outline-none text-white placeholder:text-white/30 text-base font-semibold w-full focus:placeholder:text-white/50 transition-colors font-sans"
          />
        </div>
      </div>
 
      {/* Input Group 2: Dates */}
      <div className="flex-1 flex items-center gap-4 px-6 py-4 w-full rounded-lg hover:bg-white/5 transition-colors cursor-text group border-b md:border-b-0 md:border-r border-white/5">
        <Calendar className="text-primary w-5 h-5 group-hover:scale-105 transition-transform duration-300" />
        <div className="flex flex-col w-full text-left">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1 font-sora">When?</span>
          <input 
            type="text" 
            placeholder="Add dates" 
            className="bg-transparent border-none outline-none text-white placeholder:text-white/30 text-base font-semibold w-full focus:placeholder:text-white/50 transition-colors font-sans"
          />
        </div>
      </div>
 
      {/* Input Group 3: Type */}
      <div className="flex-1 flex items-center gap-4 px-6 py-4 w-full rounded-lg hover:bg-white/5 transition-colors cursor-text group">
        <Compass className="text-primary w-5 h-5 group-hover:scale-105 transition-transform duration-300" />
        <div className="flex flex-col w-full text-left">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1 font-sora">Travel Type</span>
          <select className="bg-transparent border-none outline-none text-white text-base font-semibold w-full cursor-pointer appearance-none font-sans">
            <option className="bg-[#020307] text-white">Couple / Romance</option>
            <option className="bg-[#020307] text-white">Family</option>
            <option className="bg-[#020307] text-white">Solo Backpacker</option>
            <option className="bg-[#020307] text-white">Luxury Resort</option>
          </select>
        </div>
      </div>
  
      {/* Action Button */}
      <div className="w-full md:w-auto p-2">
        <Link href="/plan" className="w-full md:w-auto block">
          <Button 
            size="lg" 
            className="w-full md:w-auto h-14 px-8 rounded-lg bg-primary hover:bg-primary/95 text-white font-bold text-base shadow-[0_4px_20px_rgba(20,184,166,0.25)] hover:shadow-[0_4px_30px_rgba(20,184,166,0.4)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border-none font-sora"
          >
            Generate Itinary
          </Button>
        </Link>
      </div>
 
    </div>
  );
}
