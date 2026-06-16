"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Sparkles, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[100dvh] relative overflow-hidden flex flex-col items-center justify-center px-4 pt-20 pb-10">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] rounded-full bg-primary/20 blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] md:w-[40%] md:h-[40%] rounded-full bg-sky-500/20 blur-[100px] md:blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 max-w-4xl mt-12 w-full"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 border border-white/20 shadow-lg shadow-primary/10"
        >
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-white/90">Tripvora AI Engine 2.0 is live</span>
        </motion.div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 font-sora tracking-tight leading-tight md:leading-tight">
          Plan Smarter.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-400">
            Travel Better.
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto font-light px-4">
          Experience the future of travel. Let Tripvora's AI craft your perfect itinerary with real flights, hotels, and activities in seconds.
        </p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-card p-3 sm:p-2 md:p-4 rounded-3xl md:rounded-full flex flex-col md:flex-row items-center gap-3 md:gap-4 max-w-3xl mx-auto w-full"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full border-b md:border-b-0 md:border-r border-white/10 group focus-within:bg-white/5 transition-colors rounded-t-2xl md:rounded-l-full md:rounded-tr-none">
            <MapPin className="text-primary w-5 h-5 group-focus-within:scale-110 transition-transform" />
            <div className="text-left w-full">
              <p className="text-xs text-white/50 font-medium mb-1">Destination</p>
              <input type="text" placeholder="Where to?" className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30 text-sm md:text-base font-medium focus:placeholder:text-white/50 transition-colors" />
            </div>
          </div>
          
          <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full border-b md:border-b-0 md:border-r border-white/10 group focus-within:bg-white/5 transition-colors">
            <Calendar className="text-primary w-5 h-5 group-focus-within:scale-110 transition-transform" />
            <div className="text-left w-full">
              <p className="text-xs text-white/50 font-medium mb-1">Dates</p>
              <input type="text" placeholder="Add dates" className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30 text-sm md:text-base font-medium focus:placeholder:text-white/50 transition-colors" />
            </div>
          </div>
          
          <div className="w-full md:w-auto p-2">
            <Button size="lg" className="w-full md:w-auto rounded-xl md:rounded-full font-bold px-8 h-12 md:h-14 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95">
              Generate Trip
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
