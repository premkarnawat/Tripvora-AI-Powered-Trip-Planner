"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Calendar, MapPin, Plus, ArrowUpRight, Compass, Settings, 
  CloudSun, Shield, Coins, FileText, PhoneCall, Star, Bell, Gift, 
  BookOpen, HelpCircle, ArrowRight, UserCheck, ShieldCheck, CreditCard,
  History, Search, MessageSquare, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();

  // Mock Data
  const upcomingTrips = [
    { id: "goa-sunset-escape", name: "Goa Sunset & Beach Escape", dates: "July 15 - July 20, 2026", pax: "2 Adults", status: "Confirmed", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop" }
  ];

  const savedTrips = [
    { id: "tokyo-cherry-blossoms", name: "Tokyo & Kyoto Cherry Blossoms", duration: "7 Nights", budget: "₹2,50,000", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&auto=format&fit=crop" },
    { id: "bali-honeymoon", name: "Bali Luxury Honeymoon Escape", duration: "6 Nights", budget: "₹1,85,000", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&auto=format&fit=crop" }
  ];

  const pastTrips = [
    { id: "munnar-tea-estates", name: "Munnar Tea Estates & Hills", dates: "Oct 12 - Oct 15, 2025", status: "Completed", rating: 5 },
    { id: "leh-ladakh-roadtrip", name: "Leh & Ladakh Adventure Caravan", dates: "July 2 - July 10, 2025", status: "Completed", rating: 4 }
  ];

  const marketplaceOffers = [
    { title: "20% Off Spa at W Bali", code: "WBALISPA20", expiry: "Valid till July 30" },
    { title: "Free Snorkeling in Maldives", code: "MALDIVESFREE", expiry: "Valid till Aug 15" }
  ];

  const recentSearches = [
    { dest: "Bali, Indonesia", category: "Tropical Escape", date: "Checked 1h ago" },
    { dest: "Swiss Alps", category: "Ski & Luxury Stay", date: "Checked 1d ago" },
    { dest: "Kyoto, Japan", category: "Culture & Historic", date: "Checked 3d ago" }
  ];

  const notifications = [
    { id: 1, text: "AI generated new hotel matches for Bali", time: "10m ago", type: "system" },
    { id: 2, text: "Visa documents verified by Agent #42", time: "2h ago", type: "success" },
    { id: 3, text: "Flight prices to Bali dropped by 12%", time: "4h ago", type: "alert" }
  ];

  const travelInsights = [
    { icon: CloudSun, title: "Monsoon Forecast", desc: "Goa is expecting brief showers. AI optimized transit routes automatically." },
    { icon: Coins, title: "Budget Efficiency Score", desc: "You are in the top 8% of cost-saving travelers by booking Agoda partner stays." }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* HEADER BANNER */}
      <div className="relative rounded-[32px] overflow-hidden border border-[#E5E7EB] bg-white p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" /> Personal Travel Assistant Active
            </span>
          </div>
          <h1 className="text-3xl font-black font-sora text-[#0F172A]">Welcome back, Prem</h1>
          <p className="text-xs font-semibold text-[#64748B] max-w-xl leading-relaxed">
            Manage your travel itinerary details, subscription options, billing receipts, and chat live with your personal concierge.
          </p>
        </div>

        <div className="flex gap-4 shrink-0">
          <div className="bg-[#FAFBFD] border border-[#E5E7EB] p-4 px-6 rounded-2xl text-center">
            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Travel Credits</span>
            <span className="text-xl font-bold font-sora text-teal-600 font-mono">₹15,400</span>
          </div>
          
          <div className="bg-[#FAFBFD] border border-[#E5E7EB] p-4 px-6 rounded-2xl text-center">
            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Active Tier</span>
            <span className="text-xl font-bold font-sora text-[#0F172A]">Pro Member</span>
          </div>
        </div>
      </div>

      {/* QUICK ACTION BANNER */}
      <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl">
        <span className="text-xs font-bold text-slate-600">Plan a new custom travel plan instantly:</span>
        <Button 
          onClick={() => router.push("/trip-planner")}
          className="h-10 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm border-none"
        >
          <Plus className="w-4 h-4" /> Plan My Trip
        </Button>
      </div>

      {/* 12 SECTIONS DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (8 Cols) - Trips, Searches & Offers */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Upcoming Trips */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-2">Upcoming Trips</h3>
            
            {upcomingTrips.map(trip => (
              <div key={trip.id} className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row justify-between items-stretch shadow-sm hover:shadow-md transition-all">
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-bold rounded uppercase">
                      {trip.status}
                    </span>
                    <h4 className="text-base font-extrabold text-[#0F172A] mt-2">{trip.name}</h4>
                    <p className="text-[11px] text-[#64748B] mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" /> {trip.dates} • {trip.pax}
                    </p>
                  </div>
                  <Button 
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    className="w-full md:w-max bg-[#0F172A] hover:bg-[#0F172A]/90 text-white font-bold h-9 text-xs flex items-center gap-1"
                  >
                    Open AI Personal Assistant <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="w-full md:w-60 h-32 md:h-auto bg-slate-100 shrink-0">
                  <img src={trip.img} alt={trip.name} className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>

          {/* Section 2: Saved Trips */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-2">Saved Trips</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedTrips.map(trip => (
                <div key={trip.id} className="border border-slate-200 hover:border-teal-500 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between transition-all">
                  <div className="w-full h-32 bg-slate-100">
                    <img src={trip.img} alt={trip.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-3">
                    <h4 className="text-xs font-bold text-[#0F172A] leading-snug">{trip.name}</h4>
                    <div className="flex justify-between text-[10px] text-[#64748B]">
                      <span>⏱️ {trip.duration}</span>
                      <span className="font-mono font-bold text-slate-800">Budget: {trip.budget}</span>
                    </div>
                    <Button 
                      onClick={() => router.push(`/trips/${trip.id}`)}
                      className="w-full h-8 text-[10px] font-bold bg-[#FAFBFD] hover:bg-slate-50 text-[#0F172A] border border-slate-200"
                    >
                      Open Assistant
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Recent Searches */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-2">Recent Searches</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recentSearches.map((search, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => router.push("/trip-planner")}>
                  <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-teal-600" /> {search.dest}
                  </p>
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                    <span>{search.category}</span>
                    <span>{search.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Marketplace Offers */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-2">Marketplace Exclusive Offers</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketplaceOffers.map((offer, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 items-start">
                  <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
                    <Gift className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold text-[#0F172A]">{offer.title}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Promo Code: <strong>{offer.code}</strong></p>
                    <p className="text-[9px] text-[#94A3B8]">{offer.expiry}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (4 Cols) - Alerts, Subscriptions, Journal & Helplines */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section 5: Travel Insights */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-2">
              AI Travel Insights
            </h4>
            <div className="space-y-3">
              {travelInsights.map((insight, idx) => {
                const Icon = insight.icon;
                return (
                  <div key={idx} className="flex gap-2.5 items-start text-xs">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-100 shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[#0F172A]">{insight.title}</h5>
                      <p className="text-[10px] text-[#64748B] mt-0.5 leading-normal">{insight.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 6: Notifications */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-2">
              Notifications & Alerts
            </h4>
            <div className="space-y-2.5">
              {notifications.map(notif => (
                <div key={notif.id} className="flex gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-700 leading-normal">{notif.text}</p>
                    <span className="text-[9px] text-slate-400 font-mono">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7 & 8: Subscription & Billing */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-teal-600" /> Subscription & Billing
            </h4>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Active Plan:</span>
                <span className="font-bold text-[#0F172A]">Pro Concierge Tier</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Renewal Date:</span>
                <span className="font-mono text-slate-700">July 20, 2026</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-teal-600 cursor-pointer hover:underline text-[10px]">
                <span>Manage Billing Receipts</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* Section 9: Past Trips & Trip History */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <History className="w-4 h-4 text-teal-600" /> Trip History
            </h4>
            <div className="space-y-3 text-xs">
              {pastTrips.map(trip => (
                <div key={trip.id} className="flex justify-between items-center py-0.5 border-b border-slate-50 pb-2 last:border-none">
                  <div>
                    <p className="font-bold text-[#0F172A]">{trip.name}</p>
                    <p className="text-[9px] text-[#94A3B8]">{trip.dates}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-extrabold bg-slate-50 text-[#64748B] border border-slate-200 px-1.5 py-0.5 rounded uppercase">
                      {trip.status}
                    </span>
                    <div className="text-[9px] text-amber-500 mt-1 font-bold">{"★".repeat(trip.rating)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 10: Travel Journal */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" /> Travel Journal logs
            </h4>
            <div className="text-xs space-y-2">
              <p className="italic text-slate-500">&ldquo;Day 2 in Munnar: Woke up early to catch the mist over the tea plantations. Absolute magic...&rdquo;</p>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-[10px] font-bold text-teal-600 cursor-pointer hover:underline">
                <span>Open Travel Journal</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* Section 11: Support Center Panel */}
          <div className="bg-slate-900 text-white rounded-[28px] p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 rounded bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                <UserCheck className="w-4 h-4 text-teal-400" />
              </div>
              <span className="text-[9px] bg-teal-500 text-slate-900 font-extrabold px-1.5 py-0.5 rounded">ONLINE</span>
            </div>
            <div>
              <h4 className="text-xs font-bold font-sora">Talk to Concierge Expert</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">Need live help? Talk to our certified agency expert on WhatsApp.</p>
            </div>
            <a 
              href={`https://wa.me/919876543210?text=Hi%20TripPilot,%20I%2527d%20like%20expert%20assistance%20for%20my%20itinerary.`}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-9 text-xs flex items-center justify-center gap-1">
                <PhoneCall className="w-3.5 h-3.5" /> Chat on WhatsApp
              </Button>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
