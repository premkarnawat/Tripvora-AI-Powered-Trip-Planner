"use client";

import { motion } from "framer-motion";
import { Bookmark, MapPin, Star } from "lucide-react";

export default function BookmarksPage() {
  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl text-white/60 mb-1 font-medium">Collections</h2>
        <h1 className="text-3xl md:text-4xl font-bold text-white font-sora mb-10">
          My Bookmarks
        </h1>
      </motion.div>

      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button className="text-primary font-bold border-b-2 border-primary pb-4 -mb-[18px]">All Items</button>
        <button className="text-white/50 hover:text-white font-medium pb-4">Hotels</button>
        <button className="text-white/50 hover:text-white font-medium pb-4">Experiences</button>
        <button className="text-white/50 hover:text-white font-medium pb-4">Stories</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for Bookmarks */}
        {[1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-4 rounded-3xl group cursor-pointer"
          >
            <div className="w-full h-48 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-2xl mb-4 relative overflow-hidden">
              <button className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-primary fill-primary" />
              </button>
            </div>
            
            <div className="px-2 pb-2">
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium text-white/80">4.9</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Luxury Resort & Spa</h3>
              <div className="flex items-center gap-1.5 text-white/50">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs">Bali, Indonesia</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
