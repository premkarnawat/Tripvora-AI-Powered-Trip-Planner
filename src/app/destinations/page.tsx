"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Compass, Calendar, Wallet, Clock, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DestinationsPage() {
  const [activeTab, setActiveTab] = useState("Popular");
  const [searchVal, setSearchVal] = useState("");

  const tabs = [
    "Popular", "Weekend Getaways", "International", 
    "Couple Trips", "Family Trips", "Adventure", "Budget Trips"
  ];

  const destinationsList = [
    {
      id: "bali",
      name: "Bali",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop",
      bestTime: "Apr - Oct",
      budget: "₹45,000",
      duration: "7 Days",
      tripsGenerated: "8.4k+ planned",
      category: ["Popular", "Couple Trips", "International"]
    },
    {
      id: "swiss-alps",
      name: "Swiss Alps",
      country: "Switzerland",
      image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=600&auto=format&fit=crop",
      bestTime: "Jun - Sep / Dec - Mar",
      budget: "₹1,80,000",
      duration: "10 Days",
      tripsGenerated: "4.2k+ planned",
      category: ["Popular", "Adventure", "International"]
    },
    {
      id: "amalfi-coast",
      name: "Amalfi Coast",
      country: "Italy",
      image: "https://images.unsplash.com/photo-1486894980609-fce7c3c164ad?q=80&w=600&auto=format&fit=crop",
      bestTime: "May - Sep",
      budget: "₹1,50,000",
      duration: "8 Days",
      tripsGenerated: "3.9k+ planned",
      category: ["Popular", "Couple Trips", "International"]
    },
    {
      id: "kyoto",
      name: "Kyoto",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=600&auto=format&fit=crop",
      bestTime: "Mar - May / Oct - Nov",
      budget: "₹1,20,000",
      duration: "6 Days",
      tripsGenerated: "5.1k+ planned",
      category: ["Popular", "Family Trips", "International"]
    },
    {
      id: "goa",
      name: "Goa",
      country: "India",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
      bestTime: "Nov - Feb",
      budget: "₹15,000",
      duration: "4 Days",
      tripsGenerated: "14.2k+ planned",
      category: ["Popular", "Weekend Getaways", "Budget Trips"]
    },
    {
      id: "rishikesh",
      name: "Rishikesh",
      country: "India",
      image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=600&auto=format&fit=crop",
      bestTime: "Sep - Nov / Mar - May",
      budget: "₹8,500",
      duration: "3 Days",
      tripsGenerated: "6.8k+ planned",
      category: ["Weekend Getaways", "Adventure", "Budget Trips"]
    }
  ];

  const filteredDests = destinationsList.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                          dest.country.toLowerCase().includes(searchVal.toLowerCase());
    const matchesTab = dest.category.includes(activeTab) || activeTab === "Popular";
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pt-28 pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black tracking-widest uppercase mb-4">
            <Compass className="w-3.5 h-3.5" /> Destination Discovery
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight font-sora mb-3">
            Explore Curated Collections
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Uncover the world's most premium, verified getaways hand-picked for every style of travel.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <Search className="w-5 h-5 text-slate-400 absolute left-5 top-4" />
          <input 
            type="text" 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search by city, country or experiences..."
            className="w-full bg-white border border-slate-200/80 rounded-full py-4 pl-14 pr-6 text-slate-800 text-sm focus:outline-none focus:border-teal-500 transition-all font-semibold shadow-sm"
          />
        </div>

        {/* Tabs Filter */}
        <div className="border-b border-slate-200/60 pb-1.5 mb-12">
          <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {tabs.map((tab) => {
              const active = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 text-sm font-extrabold tracking-wide uppercase transition-all pb-2 relative ${
                    active ? 'text-black font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                  {active && (
                    <motion.div 
                      layoutId="destTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-teal-500 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredDests.map((dest) => (
            <motion.div 
              key={dest.id}
              whileHover={{ y: -6 }}
              className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(15,23,42,0.02)] group flex flex-col justify-between"
            >
              {/* Photo Container */}
              <div className="h-64 relative overflow-hidden bg-slate-50">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-[10px] font-black text-teal-300 uppercase tracking-widest block mb-0.5">{dest.country}</span>
                  <h3 className="text-2xl font-bold font-sora text-white leading-tight">{dest.name}</h3>
                </div>
                {/* Trips count indicator */}
                <span className="absolute top-4 right-4 bg-black/60 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full backdrop-blur-sm shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-300 animate-pulse" /> {dest.tripsGenerated}
                </span>
              </div>

              {/* Card Meta details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-3 gap-4 mb-6 text-center border-b border-slate-50 pb-5">
                  <div className="flex flex-col items-center">
                    <Calendar className="w-4 h-4 text-slate-400 mb-1" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Best Time</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{dest.bestTime}</span>
                  </div>
                  
                  <div className="flex flex-col items-center border-x border-slate-100">
                    <Wallet className="w-4 h-4 text-slate-400 mb-1" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Avg Budget</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{dest.budget}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <Clock className="w-4 h-4 text-slate-400 mb-1" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Duration</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{dest.duration}</span>
                  </div>
                </div>

                <Link href={`/destinations/${dest.id}`} className="w-full">
                  <Button className="w-full bg-slate-50 border border-slate-100 hover:bg-black hover:text-white hover:border-black text-black rounded-full py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                    Explore Details <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
