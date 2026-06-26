"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { 
  Sparkles, Calendar, Users, Wallet, Plane, Bed, 
  MapPin, CloudSun, PhoneCall, DollarSign, Compass, Star, 
  ArrowLeft, Download, Share2, Shield, Clock, 
  AlertCircle, Map, Navigation, ArrowUpRight, CheckCircle2, 
  Plus, Check, ExternalLink, HelpCircle, Phone, Heart, Activity,
  AlertTriangle, Landmark, Pill, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TripItineraryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Local state for active day summary tabs
  const [activeDay, setActiveDay] = useState(1);
  const [mobileTab, setMobileTab] = useState<"timeline" | "map" | "intel" | "budget" | "help">("timeline");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotActionText, setCopilotActionText] = useState("");

  // Live Budget System
  const [totalBudget, setTotalBudget] = useState(85000);
  const [spentTransport, setSpentTransport] = useState(12400);
  const [spentHotels, setSpentHotels] = useState(25000);
  const [spentFood, setSpentFood] = useState(6200);
  const [spentActivities, setSpentActivities] = useState(8500);
  const [spentShopping, setSpentShopping] = useState(4000);
  const [emergencyBuffer, setEmergencyBuffer] = useState(10000);

  // Dynamic AI State mapping
  const [realTripData, setRealTripData] = useState<any>(null);
  const [realTitle, setRealTitle] = useState("Curated Luxury Voyage");
  const [realDestination, setRealDestination] = useState("Selected Destination");

  useEffect(() => {
    async function loadLiveTrip() {
      try {
        if (id && id !== 'latest' && !id.startsWith('static-')) {
          const res = await fetch(`/api/trips/${id}`);
          if (res.ok) {
            const row = await res.json();
            if (row && row.demographics) {
              setRealTripData(row.demographics);
              setRealTitle(row.title || "Curated Voyage");
              setRealDestination(row.destination || "Luxury Escape");
              if (row.target_budget) setTotalBudget(Number(row.target_budget));
              return;
            }
          }
        }

        const saved = localStorage.getItem('last_generated_trip');
        if (saved) {
          const data = JSON.parse(saved);
          setRealTripData(data);
          if (data.totalBudget) setTotalBudget(Number(data.totalBudget));
          if (data.destination) setRealDestination(data.destination);
          if (data.tripOverview || data.destinationSummary) {
            setRealTitle((data.tripOverview || data.destinationSummary).slice(0, 48) + "...");
          }
          
          let hotelsCost = 0, flightsCost = 0, foodCost = 0, activityCost = 0;
          data.hotels?.forEach((h: any) => hotelsCost += (h.pricePerNight * (data.totalDays || 1)));
          data.flights?.forEach((f: any) => flightsCost += (f.price || 0));
          
          data.days?.forEach((day: any) => {
            const slots = [...(day.morning || []), ...(day.afternoon || []), ...(day.evening || []), ...(day.night || []), ...(day.activities || [])];
            slots.forEach((act: any) => {
              const c = Number(act.cost) || 0;
              if (act.type === 'meal') foodCost += c;
              else if (act.type === 'transfer' || act.type === 'travel' || act.type === 'flight') flightsCost += c;
              else if (act.type === 'hotel') hotelsCost += c;
              else activityCost += c;
            });
          });
          
          setSpentHotels(hotelsCost);
          setSpentTransport(flightsCost);
          setSpentFood(foodCost);
          setSpentActivities(activityCost);
        }
      } catch (e) {
        console.error("Failed to load live trip data:", e);
      }
    }
    loadLiveTrip();
  }, [id]);

  // Dynamic Simulators
  const [scubaAdded, setScubaAdded] = useState(false);
  const [dinnerUpgraded, setDinnerUpgraded] = useState(false);

  // Map route preview nodes
  const [selectedRouteNode, setSelectedRouteNode] = useState("Flight");
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const getUsedBudget = () => {
    let sum = spentTransport + spentHotels + spentFood + spentActivities + spentShopping;
    if (scubaAdded) sum += 3500;
    if (dinnerUpgraded) sum += 2400;
    return sum;
  };

  const getRemainingBudget = () => {
    return totalBudget - getUsedBudget() - emergencyBuffer;
  };

  const getBudgetHealth = () => {
    const ratio = getUsedBudget() / totalBudget;
    if (ratio < 0.6) return { label: "Excellent", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (ratio < 0.85) return { label: "Healthy", color: "text-teal-600 bg-teal-50 border-teal-200" };
    return { label: "Warning Limit", color: "text-rose-600 bg-rose-50 border-rose-200" };
  };

  const handleToggleScuba = () => {
    setScubaAdded(!scubaAdded);
  };

  const handleToggleDinner = () => {
    setDinnerUpgraded(!dinnerUpgraded);
  };

  const handleCopilotCommand = (action: string) => {
    setCopilotActionText(`AI Assistant: Processing "${action}" request...`);
    
    if (action === "Optimize Budget") {
      setSpentHotels(prev => Math.round(prev * 0.9)); // 10% saving on hotel
    } else if (action === "Replace Hotel") {
      setSpentHotels(19500); // Swap to budget contract Stay
    } else if (action === "Add Activity") {
      setScubaAdded(true);
    } else if (action === "Remove Activity") {
      setScubaAdded(false);
    } else if (action === "Customize Trip") {
      setTotalBudget(totalBudget + 15000);
    }
    
    setTimeout(() => {
      setCopilotActionText("");
      setIsCopilotOpen(false);
    }, 2000);
  };

  // Day-wise journey timeline data - use AI generated if available
  const dayTimeline = realTripData?.days?.flatMap((d: any) => 
    d.activities?.map((act: any) => ({
      time: act.time || "10:00 AM",
      title: act.title || "Activity",
      distance: act.location || "Local",
      duration: "Variable",
      transport: act.type || "transit",
      cost: act.cost || 0,
      weather: "Sunny 28°C",
      aiTip: act.description || "Generated by AI",
      mapLink: `https://maps.google.com/?q=${encodeURIComponent(act.location || act.title)}`,
      nodeId: act.title
    }))
  ) || [
    {
      time: "06:30 AM",
      title: "Board Flight (BOM → GOI)",
      distance: "Goa (540 km)",
      duration: "1h 15m",
      transport: "Indigo Flight 6E-242",
      cost: 4500,
      weather: "Sunny 28°C",
      aiTip: "Cabin bags pre-checked. Direct flight includes complimentary snacks.",
      mapLink: "https://maps.google.com/?q=Chhatrapati+ शिवाजी+Airport+Mumbai",
      nodeId: "Flight"
    },
    {
      time: "09:15 AM",
      title: "Arrive Goa Airport (Dabolim)",
      distance: "0 km",
      duration: "Arrived",
      transport: "Transit terminal",
      cost: 0,
      weather: "Clear 29°C",
      aiTip: "Head to Exit Gate 2. Avoid local unmetered taxi brokers.",
      mapLink: "https://maps.google.com/?q=Dabolim+Goa+Airport",
      nodeId: "Airport"
    },
    {
      time: "09:30 AM",
      title: "Airport Shuttle Boarding",
      distance: "18 km",
      duration: "25 min",
      transport: "Electric AC Bus",
      cost: 120,
      weather: "Sunny 30°C",
      aiTip: "AI Recommended: Direct shuttle saves ₹530 compared to standard taxis.",
      mapLink: "https://maps.google.com/?q=KTC+Bus+Stand+Panaji",
      nodeId: "Shuttle"
    },
    {
      time: "10:00 AM",
      title: "Hotel Check-In & Refresh",
      distance: "12 km",
      duration: "15 min",
      transport: "Cab Transfer",
      cost: 450,
      weather: "Sunny 30°C",
      aiTip: "Check-in voucher #XP-9021 verified at Grand Hyatt Goa.",
      mapLink: "https://maps.google.com/?q=Grand+Hyatt+Goa+Bambolim",
      nodeId: "Hotel"
    },
    {
      time: "12:30 PM",
      title: "Lunch Recommendation: Local Curry",
      distance: "1.5 km",
      duration: "5 min",
      transport: "Walk",
      cost: 800,
      weather: "Hot 32°C",
      aiTip: "Try the authentic Goan fish thali here. 10% discount for Pro members.",
      mapLink: "https://maps.google.com/?q=Fishermans+Wharf+Panaji+Goa",
      nodeId: "Lunch"
    },
    {
      time: "02:00 PM",
      title: "Attraction: Basilica of Bom Jesus",
      distance: "8 km",
      duration: "18 min",
      transport: "Scooter rental",
      cost: 200,
      weather: "Sunny 31°C",
      aiTip: "UNESCO World Heritage site. Dress conservatively, photography allowed.",
      mapLink: "https://maps.google.com/?q=Basilica+of+Bom+Jesus+Old+Goa",
      nodeId: "Attraction"
    },
    {
      time: "05:30 PM",
      title: "Sunset Point: Vagator Beach",
      distance: "4 km",
      duration: "10 min",
      transport: "Scooter",
      cost: 150,
      weather: "Clear 27°C",
      aiTip: "Best viewing spot is next to the cliff deck. Sunset expected at 06:14 PM.",
      mapLink: "https://maps.google.com/?q=Vagator+Beach+Cliff",
      nodeId: "Sunset"
    },
    {
      time: "08:00 PM",
      title: "Dinner: Curlies Beach Shack",
      distance: "6 km",
      duration: "12 min",
      transport: "Scooter",
      cost: 1500,
      weather: "Breezy 26°C",
      aiTip: "Reserved private table overlooking the waves. Excellent seafood options.",
      mapLink: "https://maps.google.com/?q=Curlies+Beach+Shack+Anjuna",
      nodeId: "Dinner"
    },
    {
      time: "10:00 PM",
      title: "Return to Grand Hyatt Goa",
      distance: "16 km",
      duration: "25 min",
      transport: "Hotel Shuttle Cab",
      cost: 800,
      weather: "Cool 25°C",
      aiTip: "Ensure scooter keys are returned to valet desks.",
      mapLink: "https://maps.google.com/?q=Grand+Hyatt+Goa+Bambolim",
      nodeId: "Return"
    }
  ];

  return (
    <div className="traveler-theme min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-6 pb-20 font-sans relative">
      
      {/* SECTION 2: AI TRAVEL COPILOT (Floating Assistant Panel) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className="w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all border border-teal-500/20"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </button>

        <AnimatePresence>
          {isCopilotOpen && (
            <>
              <div className="fixed inset-0 bg-black/40 md:bg-transparent z-40" onClick={() => setIsCopilotOpen(false)} />
              <div className="fixed bottom-0 left-0 right-0 w-full rounded-t-[32px] md:absolute md:bottom-16 md:right-0 md:w-80 md:rounded-[24px] bg-white border border-[#E5E7EB] p-6 md:p-5 shadow-2xl space-y-4 z-50 animate-in slide-in-from-bottom-5 duration-200 max-h-[85vh] overflow-y-auto pb-safe">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-[#0F172A] flex items-center gap-1.5 font-sora">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>AI Travel Copilot</span>
                  </h4>
                  <button onClick={() => setIsCopilotOpen(false)} className="text-slate-400 hover:text-slate-900 text-xs">✕</button>
                </div>

                {copilotActionText && (
                  <div className="p-2.5 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl text-[10px] font-bold animate-pulse">
                    {copilotActionText}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-slate-700">
                  <button onClick={() => handleCopilotCommand("Optimize Budget")} className="p-2 border border-slate-200 hover:bg-slate-50 hover:text-[#0F172A] rounded-xl text-left">📉 Optimize Budget</button>
                  <button onClick={() => handleCopilotCommand("Replace Hotel")} className="p-2 border border-slate-200 hover:bg-slate-50 hover:text-[#0F172A] rounded-xl text-left">🏨 Replace Hotel</button>
                  <button onClick={() => handleCopilotCommand("Add Activity")} className="p-2 border border-slate-200 hover:bg-slate-50 hover:text-[#0F172A] rounded-xl text-left">🎟️ Add Activity</button>
                  <button onClick={() => handleCopilotCommand("Remove Activity")} className="p-2 border border-slate-200 hover:bg-slate-50 hover:text-[#0F172A] rounded-xl text-left">❌ Remove Activity</button>
                  <button onClick={() => handleCopilotCommand("Find Better Hotel")} className="p-2 border border-slate-200 hover:bg-slate-50 hover:text-[#0F172A] rounded-xl text-left">🏨 Find Better Hotel</button>
                  <button onClick={() => handleCopilotCommand("Find Better Flight")} className="p-2 border border-slate-200 hover:bg-slate-50 hover:text-[#0F172A] rounded-xl text-left">✈️ Find Better Flight</button>
                  <button onClick={() => handleCopilotCommand("Find Food Nearby")} className="p-2 border border-slate-200 hover:bg-slate-50 hover:text-[#0F172A] rounded-xl text-left">🍔 Find Food Nearby</button>
                  <button onClick={() => handleCopilotCommand("Find ATM")} className="p-2 border border-slate-200 hover:bg-slate-50 hover:text-[#0F172A] rounded-xl text-left">🏧 Find ATM</button>
                  <button onClick={() => handleCopilotCommand("Customize Trip")} className="p-2 border border-slate-200 hover:bg-slate-50 hover:text-[#0F172A] rounded-xl text-left">⚙️ Customize Trip</button>
                  <button onClick={() => handleCopilotCommand("Emergency Help")} className="p-2 border border-rose-200 hover:bg-rose-50 hover:text-rose-700 rounded-xl text-left text-rose-600">🚨 Emergency Help</button>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:block max-w-[1400px] mx-auto px-4 md:px-6 space-y-6">
        
        {/* Navigation back */}
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> AI Travel Concierge Engine Active
          </span>
        </div>

        {/* SECTION 1: TRIP HEADER HERO IMAGE & DETAILS */}
        <div className="bg-white border border-[#E5E7EB] rounded-[32px] overflow-hidden shadow-sm flex flex-col md:flex-row justify-between items-stretch">
          <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded">
                  AI Travel Assistant Enabled
                </span>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 rounded">
                  {realTripData?.totalDays || 5} Days Trip
                </span>
              </div>
              <h1 className="text-3xl font-black font-sora tracking-tight text-[#0F172A]">{realDestination} Experience</h1>
              <p className="text-xs text-[#64748B] mt-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" /> {realDestination}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">
              <div className="border-l-2 border-teal-500 pl-3">
                <span className="text-[8px] text-slate-400 block">Duration</span>
                <span className="text-[#0F172A] font-extrabold">{realTripData?.totalDays || 5} Days</span>
              </div>
              <div className="border-l-2 border-teal-500 pl-3">
                <span className="text-[8px] text-slate-400 block">Estimated Weather</span>
                <span className="text-[#0F172A] font-extrabold">Sunny 30°C</span>
              </div>
              <div className="border-l-2 border-teal-500 pl-3">
                <span className="text-[8px] text-slate-400 block">Total Budget limit</span>
                <span className="text-teal-700 font-extrabold">₹{totalBudget.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-l-2 border-teal-500 pl-3">
                <span className="text-[8px] text-slate-400 block">Used Spends</span>
                <span className="text-slate-800 font-extrabold">₹{getUsedBudget().toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[420px] h-48 md:h-auto bg-slate-100 relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60" 
              alt="Sunset beach"
              className="w-full h-full object-cover"
            />
            {/* Quick Actions */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button 
                onClick={() => alert("Trip Saved to Saved Trips Hub")}
                className="p-2.5 bg-white/95 backdrop-blur hover:bg-white text-slate-900 rounded-xl shadow-md text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Save
              </button>
              <button 
                onClick={() => alert("Shareable Travel Assistant link copied to clipboard")}
                className="p-2.5 bg-white/95 backdrop-blur hover:bg-white text-slate-900 rounded-xl shadow-md text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-800" /> Share
              </button>
              <button 
                onClick={() => window.print()}
                className="p-2.5 bg-white/95 backdrop-blur hover:bg-white text-slate-900 rounded-xl shadow-md text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-slate-800" /> Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Day Selection Tabs */}
        <div className="bg-white border border-[#E5E7EB] p-2 rounded-2xl flex gap-1.5 overflow-x-auto shadow-sm">
          {[1, 2, 3, 4, 5].map(d => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeDay === d 
                  ? "bg-teal-600 text-white shadow-sm font-extrabold" 
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
              }`}
            >
              Day {d} Timeline
            </button>
          ))}
        </div>

        {/* TRIPLE PANEL ASSISTANT INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: Today's Journey Timeline (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-[#64748B] uppercase tracking-wider">
                Today's Journey
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Chronological transit, stay, and activities flow.</p>
            </div>

            <div className="border-l border-slate-100 ml-4 pl-6 space-y-6">
              {dayTimeline.map((step: any, idx: number) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedRouteNode(step.nodeId)}
                  className={`relative text-xs font-semibold space-y-2 cursor-pointer p-2.5 rounded-2xl border transition-all ${
                    selectedRouteNode === step.nodeId 
                      ? "bg-teal-50/60 border-teal-200 text-[#0F172A]" 
                      : "bg-white border-transparent hover:bg-slate-50"
                  }`}
                >
                  {/* Node indicator dot */}
                  <span className={`absolute -left-[32px] top-4.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow ${
                    selectedRouteNode === step.nodeId ? "bg-teal-600 scale-125" : "bg-slate-400"
                  }`} />

                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span className="font-bold">{step.time}</span>
                    <span>{step.weather}</span>
                  </div>

                  <h4 className="text-xs font-bold text-[#0F172A]">{step.title}</h4>

                  {/* Step details */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-[#64748B] font-bold">
                    {step.distance !== "0 km" && <span>🚘 Dist: {step.distance}</span>}
                    {step.duration !== "Arrived" && <span>⏱️ Time: {step.duration}</span>}
                    {step.cost > 0 && <span className="font-mono">💵 Cost: ₹{step.cost}</span>}
                    <span>🛠️ {step.transport}</span>
                  </div>

                  {/* AI Tips block */}
                  <div className="p-2.5 bg-white border border-slate-150 rounded-xl text-[9px] text-slate-500 italic leading-snug">
                    <strong>AI Tip:</strong> {step.aiTip}
                  </div>

                  {/* Map Link */}
                  <div className="pt-1 flex justify-end">
                    <a 
                      href={step.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()} // Prevent node selection trigger
                      className="text-[9px] text-teal-600 font-extrabold hover:underline flex items-center gap-1.5"
                    >
                      <Navigation className="w-3 h-3" /> Open Route Map ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: Maps & Transport/Food Intelligence (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Map Preview */}
            <div className={`bg-white border border-[#E5E7EB] rounded-[32px] p-5 shadow-sm transition-all duration-300 flex flex-col justify-between ${
              isMapExpanded ? "h-[500px]" : "h-[350px]"
            }`}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                <div>
                  <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5 font-sora">
                    <Map className="w-4 h-4 text-teal-600 animate-pulse" /> Map Route Preview
                  </h4>
                  <p className="text-[9px] text-slate-400">Current node focus: {selectedRouteNode}</p>
                </div>
                <button 
                  onClick={() => setIsMapExpanded(!isMapExpanded)}
                  className="text-[9px] font-bold text-teal-600 hover:underline"
                >
                  {isMapExpanded ? "Collapse View" : "Expand View"}
                </button>
              </div>

              {/* Map Visualization Canvas */}
              <div className="flex-1 rounded-2xl overflow-hidden bg-sky-50 relative border border-slate-200">
                <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-tr from-sky-100 to-teal-50">
                  <div className="w-full h-full relative">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      <path d="M10 80 Q 30 40, 50 30 T 90 20" fill="none" stroke="#14B8A6" strokeWidth="2.5" strokeDasharray="3 3" />
                      <circle cx="10" cy="80" r="3.5" fill="#14B8A6" />
                      <circle cx="50" cy="30" r="3.5" fill="#0EA5E9" />
                      <circle cx="90" cy="20" r="3.5" fill="#10B981" />
                    </svg>

                    <div className="absolute bottom-4 left-4 text-center">
                      <span className="text-[8px] bg-slate-900 text-white px-2 py-0.5 rounded font-bold shadow">Goa Airport</span>
                    </div>

                    <div className="absolute top-1/3 left-1/3 text-center">
                      <span className="text-[8px] bg-white border border-slate-200 text-[#0F172A] px-2 py-0.5 rounded font-bold shadow">Hyatt Hotel</span>
                    </div>

                    <div className="absolute top-4 right-4 text-center">
                      <span className="text-[8px] bg-white border border-slate-200 text-[#0F172A] px-2 py-0.5 rounded font-bold shadow">Beach Shack</span>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-white/95 border border-teal-500 rounded-xl p-2.5 shadow text-[8px] font-bold text-[#0F172A] max-w-[160px] space-y-1">
                      <p className="text-teal-700">📍 Active Destination</p>
                      <p className="text-slate-500 leading-normal">Selected transit step is: <strong>{selectedRouteNode}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transport Intelligence comparison */}
            <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-sora">Transport Intelligence</h3>
                <p className="text-[9px] text-slate-400 mt-0.5">Route transit mode comparisons.</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] font-semibold text-[#64748B]">
                  <thead>
                    <tr className="border-b border-slate-150 text-slate-400 uppercase tracking-widest text-[8px]">
                      <th className="pb-2">Mode</th>
                      <th className="pb-2 text-right">Cost</th>
                      <th className="pb-2 text-right">Duration</th>
                      <th className="pb-2 text-right">Comfort</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-[#0F172A]">
                    <tr>
                      <td className="py-2.5">🚕 Taxi Cab</td>
                      <td className="py-2.5 text-right font-mono">₹450</td>
                      <td className="py-2.5 text-right">15 min</td>
                      <td className="py-2.5 text-right text-emerald-600">High</td>
                    </tr>
                    <tr className="bg-teal-50/40">
                      <td className="py-2.5 flex items-center gap-1 font-bold text-teal-800">
                        🛺 Auto Rickshaw
                        <span className="bg-teal-100 text-teal-800 px-1 py-0.2 rounded text-[7px] font-extrabold uppercase">Rec</span>
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-teal-800">₹150</td>
                      <td className="py-2.5 text-right font-bold text-teal-800">20 min</td>
                      <td className="py-2.5 text-right text-teal-600 font-bold">Medium</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">🚌 AC Bus</td>
                      <td className="py-2.5 text-right font-mono">₹30</td>
                      <td className="py-2.5 text-right">35 min</td>
                      <td className="py-2.5 text-right text-slate-400">Low</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">🚇 Metro Rail</td>
                      <td className="py-2.5 text-right font-mono">₹40</td>
                      <td className="py-2.5 text-right">25 min</td>
                      <td className="py-2.5 text-right text-emerald-600">High</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">🛵 Scooter Rent</td>
                      <td className="py-2.5 text-right font-mono">₹400/day</td>
                      <td className="py-2.5 text-right">22 min</td>
                      <td className="py-2.5 text-right text-amber-600">Medium</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">🚶 Walk</td>
                      <td className="py-2.5 text-right font-mono">₹0</td>
                      <td className="py-2.5 text-right">60 min</td>
                      <td className="py-2.5 text-right text-rose-600">Low</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Food Intelligence guide */}
            <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-sora">Food Intelligence</h3>
                <p className="text-[9px] text-slate-400 mt-0.5">Categorized local dining concierge.</p>
              </div>
              
              <div className="space-y-2">
                {[
                  { name: "Gunpowder Assagao", category: "Best Non-Veg", dist: "12 km", rating: 4.9, cost: "₹₹", label: "Local Favorite" },
                  { name: "Fisherman's Wharf", category: "Best Seafood", dist: "1.5 km", rating: 4.8, cost: "₹₹₹", label: "Premium Dining" },
                  { name: "Navtara Veg Panaji", category: "Best Veg", dist: "3 km", rating: 4.4, cost: "₹", label: "Budget Friendly" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border border-slate-100 rounded-2xl hover:bg-slate-50 text-[10px] transition-colors">
                    <div className="space-y-1 flex-1 pr-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[#0F172A]">{item.name}</span>
                        <span className="text-[8px] bg-teal-50 text-teal-700 px-1 py-0.2 rounded font-extrabold uppercase">{item.category}</span>
                      </div>
                      <div className="flex gap-2 text-[9px] text-slate-400 font-bold">
                        <span>{item.dist} away</span>
                        <span>•</span>
                        <span>{item.cost}</span>
                        <span>•</span>
                        <span className="text-teal-600 font-extrabold">{item.label}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="font-extrabold text-[#0F172A] text-[9px]">★ {item.rating}</span>
                      <button className="bg-slate-900 hover:bg-slate-800 text-white px-2 py-0.5 rounded-lg text-[9px] font-bold transition-colors">Reserve Table</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLUMN 3: Right - Live Budget, Affiliate Compare & Emergency Hub (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Live budget engine */}
            <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-sora">Live Budget Engine</h4>
                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase border ${getBudgetHealth().color}`}>
                  {getBudgetHealth().label}
                </span>
              </div>
              
              <div className="space-y-2 text-xs font-semibold text-[#64748B]">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Total Budget Limit:</span>
                  <span className="font-mono text-[#0F172A] font-bold">₹{totalBudget.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Spent Spends:</span>
                  <span className="font-mono text-[#0F172A]">₹{getUsedBudget().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Remaining:</span>
                  <span className="font-mono text-emerald-600 font-bold">₹{getRemainingBudget().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Daily Allowed budget:</span>
                  <span className="font-mono text-slate-800">₹15,000/day</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency Buffer:</span>
                  <span className="font-mono text-rose-600 font-bold">₹{emergencyBuffer.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Breakdown category bars */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Expense Allocations</p>
                
                {/* Transport */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500">
                    <span>Transport</span>
                    <span>₹{spentTransport}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full" style={{ width: `${(spentTransport/totalBudget)*100}%` }} />
                  </div>
                </div>

                {/* Stays */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500">
                    <span>Hotels / Stays</span>
                    <span>₹{spentHotels}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full" style={{ width: `${(spentHotels/totalBudget)*100}%` }} />
                  </div>
                </div>

                {/* Food */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500">
                    <span>Food Guide</span>
                    <span>₹{spentFood}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${(spentFood/totalBudget)*100}%` }} />
                  </div>
                </div>
              </div>

              {/* Simulators */}
              <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-2">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Simulate Spends</p>
                
                {/* Scuba Diving */}
                <button
                  onClick={handleToggleScuba}
                  className={`w-full py-2 rounded-xl text-[9px] font-bold transition-all flex items-center justify-between px-2 ${
                    scubaAdded ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>🎟️ Add Scuba Diving</span>
                  <span>+₹3,500</span>
                </button>

                {/* Sunset dinner */}
                <button
                  onClick={handleToggleDinner}
                  className={`w-full py-2 rounded-xl text-[9px] font-bold transition-all flex items-center justify-between px-2 ${
                    dinnerUpgraded ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>🌅 Upgrade beach dinner</span>
                  <span>+₹2,400</span>
                </button>
              </div>
            </div>

            {/* Affiliate Compare Section */}
            <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-sora">Hotel Stay Affiliate Comparator</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Live rates check at Hyatt Goa.</p>
              </div>

              <div className="space-y-2">
                {[
                  { partner: "Booking.com", price: "₹6,800/N", rating: 4.8, refund: "Free Cancel", badge: "Best Rated" },
                  { partner: "Agoda", price: "₹6,200/N", rating: 4.6, refund: "Non-Refundable", badge: "Lowest Price" },
                  { partner: "MakeMyTrip", price: "₹6,900/N", rating: 4.7, refund: "Free Cancel", badge: null },
                  { partner: "Goibibo", price: "₹7,100/N", rating: 4.5, refund: "Free Cancel", badge: null },
                  { partner: "Yatra", price: "₹7,300/N", rating: 4.4, refund: "Non-Refundable", badge: null }
                ].map((deal, idx) => (
                  <div key={idx} className="p-2.5 border border-slate-100 rounded-xl space-y-2 text-[10px] hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0F172A]">{deal.partner}</span>
                        {deal.badge && (
                          <span className="text-[7px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-extrabold uppercase border border-emerald-200">
                            {deal.badge}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-slate-900 font-mono">{deal.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold">
                      <span>★ {deal.rating} • {deal.refund}</span>
                      <button className="text-teal-600 font-black hover:underline flex items-center gap-0.5">
                        Book Stay <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skyscanner Flight comparison */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Flights Affiliate</p>
                <div className="p-3 border border-slate-100 rounded-2xl flex justify-between items-center text-[10px]">
                  <div>
                    <p className="font-bold text-[#0F172A]">Compare Skyscanner Flights</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Compare all airline partners & travel agency rates.</p>
                  </div>
                  <a href="https://www.skyscanner.co.in" target="_blank" rel="noreferrer" className="p-2 bg-slate-950 text-white rounded-xl text-[9px] font-bold hover:bg-slate-800 transition-colors">Compare</a>
                </div>
              </div>
            </div>

            {/* Emergency Hub */}
            <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-5 shadow-sm space-y-4">
              <div className="border-b border-[#E5E7EB] pb-2 flex justify-between items-center text-rose-600">
                <h4 className="text-xs font-bold uppercase tracking-wider font-sora">Emergency Hub</h4>
                <ShieldAlert className="w-4 h-4" />
              </div>

              <div className="space-y-2 text-[10px] font-bold text-slate-600">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1">🚨 Police Helpline</span>
                  <span className="text-[#0F172A] font-mono">112 / +91-832-2428787</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1">🏥 Nearest Hospital</span>
                  <span className="text-[#0F172A]">Manipal Hospital Bambolim</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1">🏦 Nearest ATM</span>
                  <span className="text-[#0F172A] font-medium">SBI ATM (150m)</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1">💊 Nearest Pharmacy</span>
                  <span className="text-[#0F172A]">Union Pharmacy (300m)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">🌍 Foreign Embassy Helpline</span>
                  <span className="text-[#0F172A] font-mono">+91-11-2687313</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MOBILE-FIRST TRAVEL COMPANION VIEW */}
      <div className="block lg:hidden max-w-md mx-auto px-4 pb-12 space-y-6">
        {/* Header Back & Logo bar */}
        <div className="flex justify-between items-center py-2">
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#E5E7EB] rounded-full shadow-sm">
            <ArrowLeft className="w-4 h-4 text-[#0F172A]" />
          </Link>
          <span className="text-xs font-bold text-[#0F172A] font-sora">Trip Companion</span>
          <div className="flex gap-2">
            <button 
              onClick={() => alert("Copied share link")}
              className="w-9 h-9 flex items-center justify-center bg-white border border-[#E5E7EB] rounded-full shadow-sm"
            >
              <Share2 className="w-4 h-4 text-[#0F172A]" />
            </button>
            <button 
              onClick={() => window.print()}
              className="w-9 h-9 flex items-center justify-center bg-white border border-[#E5E7EB] rounded-full shadow-sm"
            >
              <Download className="w-4 h-4 text-[#0F172A]" />
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative h-60 rounded-[32px] overflow-hidden shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop" 
            alt="Goa Sunset" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
            <div className="flex gap-1.5 flex-wrap">
              <span className="text-[8px] font-black uppercase bg-[#E2FF00] text-black px-2 py-0.5 rounded">Active</span>
              <span className="text-[8px] font-black uppercase bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded">Couple Trip</span>
            </div>
            <h2 className="text-2xl font-black font-sora tracking-tight leading-tight">Goa Sunset Escape</h2>
            <p className="text-[10px] text-white/70 font-semibold flex items-center gap-1">
              📍 North & South Goa • July 15 - July 20
            </p>
          </div>
        </div>

        {/* Quick Metrics Bar (Thumb-friendly cards) */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white border border-[#E5E7EB] p-3 rounded-2xl shadow-sm">
            <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Remaining</span>
            <span className="text-xs font-black text-emerald-600 font-mono">₹{getRemainingBudget().toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-3 rounded-2xl shadow-sm">
            <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Spent</span>
            <span className="text-xs font-black text-slate-800 font-mono">₹{getUsedBudget().toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-3 rounded-2xl shadow-sm">
            <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Weather</span>
            <span className="text-xs font-black text-[#0F172A]">☀️ 30°C</span>
          </div>
        </div>

        {/* Horizontal Day Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
          {[1, 2, 3, 4, 5].map(d => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 snap-start ${
                activeDay === d 
                  ? "bg-teal-600 text-white shadow-sm" 
                  : "bg-white border border-[#E5E7EB] text-[#64748B]"
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>

        {/* Sticky Mobile Sub-navigation Tab Bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-1 flex justify-between shadow-sm sticky top-2 z-20">
          {[
            { id: "timeline", label: "Timeline", icon: Clock },
            { id: "map", label: "Map View", icon: Map },
            { id: "intel", label: "Transit", icon: Navigation },
            { id: "budget", label: "Budget", icon: Wallet },
            { id: "help", label: "Help", icon: ShieldAlert }
          ].map(tb => {
            const Icon = tb.icon;
            const isTabActive = mobileTab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setMobileTab(tb.id as any)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all ${
                  isTabActive ? "bg-teal-50 text-teal-600 font-extrabold" : "text-slate-400 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[9px] font-bold">{tb.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile View Tab Contents */}
        <div className="space-y-4">
          {/* TIMELINE TAB */}
          {mobileTab === "timeline" && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Day {activeDay} Route Timeline</span>
              </div>
              <div className="border-l border-slate-100 ml-3 pl-5 space-y-4">
                {dayTimeline.map((step: any, idx: number) => (
                  <div key={idx} className="relative space-y-2 bg-slate-50/50 border border-slate-100 p-3.5 rounded-2xl">
                    <span className="absolute -left-[27px] top-4 w-2 h-2 rounded-full border border-white shadow bg-teal-600" />
                    
                    <div className="flex justify-between items-center text-[8px] text-slate-400 font-bold">
                      <span>{step.time}</span>
                      <span>{step.weather}</span>
                    </div>
                    
                    <h4 className="text-xs font-black text-[#0F172A]">{step.title}</h4>
                    
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[8px] text-[#64748B] font-bold">
                      {step.distance !== "0 km" && <span>🚘 {step.distance}</span>}
                      {step.duration !== "Arrived" && <span>⏱️ {step.duration}</span>}
                      {step.cost > 0 && <span className="font-mono">💵 ₹{step.cost}</span>}
                      <span>🛠️ {step.transport}</span>
                    </div>

                    <div className="p-2 bg-white border border-slate-150 rounded-xl text-[8px] text-slate-500 leading-normal">
                      <strong>AI Tip:</strong> {step.aiTip}
                    </div>

                    <div className="flex justify-end pt-0.5">
                      <a 
                        href={step.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[8px] text-teal-600 font-extrabold flex items-center gap-1"
                      >
                        <Navigation className="w-2.5 h-2.5" /> Navigate ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAP TAB */}
          {mobileTab === "map" && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-4 shadow-sm flex flex-col h-[400px]">
              <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Google Maps Companion</span>
                <span className="text-[8px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-extrabold">{selectedRouteNode} focus</span>
              </div>
              <div className="flex-1 rounded-2xl bg-sky-50 relative overflow-hidden border border-slate-100">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-sky-100 to-teal-50">
                  <div className="w-full h-full relative">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      <path d="M15 75 Q 35 45, 55 35 T 85 25" fill="none" stroke="#14B8A6" strokeWidth="3" strokeDasharray="3 3" />
                      <circle cx="15" cy="75" r="4.5" fill="#14B8A6" />
                      <circle cx="55" cy="35" r="4.5" fill="#0EA5E9" />
                      <circle cx="85" cy="25" r="4.5" fill="#10B981" />
                    </svg>

                    <div className="absolute bottom-6 left-6">
                      <span className="text-[7px] bg-slate-900 text-white px-2 py-0.5 rounded font-extrabold shadow">Airport</span>
                    </div>

                    <div className="absolute top-1/3 left-1/3">
                      <span className="text-[7px] bg-white border border-slate-200 text-[#0F172A] px-2 py-0.5 rounded font-extrabold shadow">Hyatt</span>
                    </div>

                    <div className="absolute top-6 right-6">
                      <span className="text-[7px] bg-white border border-slate-200 text-[#0F172A] px-2 py-0.5 rounded font-extrabold shadow">Beach</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 border border-teal-500 rounded-xl p-3 shadow text-[8px] font-bold text-[#0F172A] space-y-1">
                      <p className="text-teal-700 flex items-center gap-1">📍 active node: {selectedRouteNode}</p>
                      <p className="text-slate-500 leading-snug">Tap nodes along the timeline to sync map routing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INTEL TAB */}
          {mobileTab === "intel" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Transport Intelligence (Compact Cards instead of tables!) */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Transport Intelligence</span>
                </div>
                <div className="space-y-2">
                  {[
                    { mode: "🚕 Taxi Cab", cost: "₹450", time: "15 min", comfort: "High", comfortColor: "text-emerald-600 bg-emerald-50" },
                    { mode: "🛺 Auto Rickshaw", cost: "₹150", time: "20 min", comfort: "Medium", comfortColor: "text-teal-600 bg-teal-50", recommended: true },
                    { mode: "🚌 AC Bus", cost: "₹30", time: "35 min", comfort: "Low", comfortColor: "text-slate-500 bg-slate-100" },
                    { mode: "🛵 Scooter Rent", cost: "₹400/d", time: "22 min", comfort: "Medium", comfortColor: "text-amber-600 bg-amber-50" }
                  ].map((tr, idx) => (
                    <div key={idx} className={`p-3 border rounded-2xl flex justify-between items-center text-[10px] ${tr.recommended ? 'border-teal-500 bg-teal-50/20' : 'border-slate-100 bg-white'}`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-[#0F172A]">{tr.mode}</span>
                          {tr.recommended && <span className="text-[6px] bg-teal-500 text-white font-extrabold px-1 py-0.2 rounded uppercase">Rec</span>}
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold">{tr.time} transit • Comfort: <span className={`px-1 rounded text-[7px] font-bold ${tr.comfortColor}`}>{tr.comfort}</span></p>
                      </div>
                      <span className="font-black text-slate-900 font-mono">{tr.cost}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food Intelligence */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Local Dining Guide</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: "Gunpowder Assagao", category: "Best Non-Veg", dist: "12 km", rating: 4.9, cost: "₹₹", label: "Local Favorite" },
                    { name: "Fisherman's Wharf", category: "Best Seafood", dist: "1.5 km", rating: 4.8, cost: "₹₹₹", label: "Premium Dining" },
                    { name: "Navtara Veg Panaji", category: "Best Veg", dist: "3 km", rating: 4.4, cost: "₹", label: "Budget Friendly" }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 border border-slate-100 rounded-2xl flex justify-between items-center text-[10px] hover:bg-slate-50 transition-colors bg-white">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-[#0F172A]">{item.name}</span>
                          <span className="text-[7px] bg-teal-50 text-teal-700 px-1 py-0.2 rounded font-extrabold uppercase">{item.category}</span>
                        </div>
                        <p className="text-[8px] text-slate-400 font-bold">{item.dist} away • {item.cost} • <span className="text-teal-600 font-black">{item.label}</span></p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="font-extrabold text-[9px] text-[#0F172A]">★ {item.rating}</span>
                        <button className="bg-slate-950 text-white rounded-lg px-2 py-0.5 text-[8px] font-bold">Book Table</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BUDGET TAB */}
          {mobileTab === "budget" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Budget Breakdown */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Live Budget Allocation</span>
                  <span className={`text-[7px] font-extrabold px-1.5 py-0.5 rounded uppercase border ${getBudgetHealth().color}`}>
                    {getBudgetHealth().label}
                  </span>
                </div>

                <div className="space-y-2 text-[10px] font-bold text-[#64748B]">
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Limit:</span>
                    <span className="font-mono text-slate-900 font-black">₹{totalBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Spent:</span>
                    <span className="font-mono text-slate-900">₹{getUsedBudget().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining:</span>
                    <span className="font-mono text-emerald-600 font-black">₹{getRemainingBudget().toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-slate-500">
                      <span>Transport</span>
                      <span>₹{spentTransport}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full" style={{ width: `${(spentTransport/totalBudget)*100}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-slate-500">
                      <span>Hotels & Stays</span>
                      <span>₹{spentHotels}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full" style={{ width: `${(spentHotels/totalBudget)*100}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-slate-500">
                      <span>Activities & Food</span>
                      <span>₹{spentActivities + spentFood}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${((spentActivities + spentFood)/totalBudget)*100}%` }} />
                    </div>
                  </div>
                </div>

                {/* Simulators */}
                <div className="p-3 bg-slate-50 border border-slate-200 border-dashed rounded-2xl space-y-2">
                  <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">Simulate Spends</p>
                  <button
                    onClick={handleToggleScuba}
                    className={`w-full py-2.5 rounded-xl text-[9px] font-bold transition-all flex items-center justify-between px-3 ${
                      scubaAdded ? "bg-emerald-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>🎟️ Scuba Diving activity</span>
                    <span>+₹3,500</span>
                  </button>

                  <button
                    onClick={handleToggleDinner}
                    className={`w-full py-2.5 rounded-xl text-[9px] font-bold transition-all flex items-center justify-between px-3 ${
                      dinnerUpgraded ? "bg-emerald-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>🌅 Luxury beach dinner</span>
                    <span>+₹2,400</span>
                  </button>
                </div>
              </div>

              {/* Stays Affiliate comparator */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Stays Affiliate Rates Comparator</span>
                </div>
                <div className="space-y-2">
                  {[
                    { partner: "Booking.com", price: "₹6,200", badge: "Best Offer" },
                    { partner: "Agoda", price: "₹6,350", badge: null },
                    { partner: "MakeMyTrip", price: "₹6,800", badge: null }
                  ].map((deal, idx) => (
                    <div key={idx} className="p-3 border border-slate-100 rounded-2xl flex justify-between items-center text-[10px] bg-white">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-[#0F172A]">{deal.partner}</span>
                          {deal.badge && <span className="text-[6px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded border border-emerald-200 font-bold uppercase">{deal.badge}</span>}
                        </div>
                        <p className="text-[8px] text-slate-400 font-bold">Hyatt Goa • Free Cancel</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="font-black text-slate-900 font-mono">{deal.price}</span>
                        <button className="text-teal-600 font-black flex items-center gap-0.5 text-[9px]">Book ↗</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HELP TAB */}
          {mobileTab === "help" && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-rose-100 pb-2 flex justify-between items-center text-rose-600">
                <span className="text-[9px] font-black uppercase tracking-widest block">Emergency Helplines</span>
                <ShieldAlert className="w-4 h-4" />
              </div>
              
              <div className="space-y-3">
                {[
                  { icon: "🚨", label: "Police Helpline", number: "112" },
                  { icon: "🏥", label: "Nearest Hospital", number: "Manipal Hospital" },
                  { icon: "🏦", label: "SBI ATM", number: "150m away" },
                  { icon: "💊", label: "Union Pharmacy", number: "300m away" }
                ].map((hl, idx) => (
                  <div key={idx} className="p-3 bg-rose-50/10 border border-rose-500/10 rounded-2xl flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{hl.icon}</span>
                      <div>
                        <p className="font-black text-slate-900">{hl.label}</p>
                        <p className="text-[9px] text-slate-500 font-bold">{hl.number}</p>
                      </div>
                    </div>
                    <a href={`tel:${hl.number}`} className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl text-[9px] transition-transform active:scale-95 shadow-sm">Call Now</a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
