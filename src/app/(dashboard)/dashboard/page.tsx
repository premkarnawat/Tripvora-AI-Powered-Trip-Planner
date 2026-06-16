"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Bell, Map, Calendar, Users, Star } from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto min-h-screen">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl text-white/60 mb-1 font-medium">Dashboard</h2>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-sora">
            Welcome back, Arjun 👋
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search trips, experiences..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative rounded-full glass hover:bg-white/10 shrink-0">
            <Bell className="w-5 h-5 text-white/80" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary shrink-0 overflow-hidden border-2 border-white/10 flex items-center justify-center font-bold text-white shadow-lg">
            A
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        <StatCard icon={Map} value="12" label="Trips Planned" />
        <StatCard icon={Calendar} value="08" label="Bookings" />
        <StatCard icon={Map} value="05" label="Upcoming Trips" />
        <StatCard icon={Star} value="02" label="Wishlist" />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Trip Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Upcoming Trip</h3>
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">View Details</button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden relative shrink-0">
              {/* Fallback color if image is missing */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-900 to-slate-800" />
            </div>
            
            <div className="flex flex-col justify-center flex-1">
              <h4 className="text-xl font-bold text-white mb-2">Goa Getaway</h4>
              <p className="text-sm text-white/60 mb-4">May 20 - May 25, 2024</p>
              
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-primary/30 w-fit mb-4">
                <span className="text-xs font-medium text-primary">Upcoming</span>
              </div>
              
              <div className="flex items-center gap-6 mt-auto">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/70">5 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/70">2 People</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">AI Recommendations for You</h3>
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">View All</button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900 to-slate-800" />
            </div>
            
            <div className="flex flex-col justify-center flex-1">
              <h4 className="text-xl font-bold text-white mb-1">Kerala Backwaters</h4>
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium text-white/80">4.8</span>
                <span className="text-xs text-white/40">(230 reviews)</span>
              </div>
              
              <p className="text-sm text-white/60 mb-4">5 Days / 4 Nights</p>
              
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="text-xl font-bold text-white">₹18,999</span>
                  <span className="text-xs text-white/40 line-through ml-2">₹24,999</span>
                </div>
                <Button className="h-9 px-6 rounded-full bg-primary hover:bg-primary/90 text-white font-medium text-sm border-none shadow-[0_0_10px_rgba(20,184,166,0.3)] hover:shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-all">
                  Explore
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: any, value: string, label: string }) {
  return (
    <div className="glass-card p-5 rounded-3xl flex flex-col items-start hover:bg-white/10 transition-colors group cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-3xl font-bold text-white font-sora mb-1">{value}</h3>
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
}
