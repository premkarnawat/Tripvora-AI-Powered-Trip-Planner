"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Calendar, Users, Wallet, Plane, Bed, MapPin, 
  CloudSun, PhoneCall, Bot, Send, Check, SlidersHorizontal, 
  Compass, ArrowLeft, RefreshCw, Plus, Map, Edit, Info, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TripParams {
  destination: string;
  dateType: "fixed" | "flexible";
  fromDate: string;
  toDate: string;
  flexOption: string;
  flexRange: string;
  travelType: string;
  budgetType: "preset" | "custom";
  budgetPreset: string;
  budgetCustom: string;
  dateDisplay: string;
  budgetDisplay: string;
}

export default function PlanPage() {
  const router = useRouter();
  
  // Loading & Init states
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationStep, setGenerationStep] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // User Input Parameters (hydrated from localStorage)
  const [destination, setDestination] = useState("Bali");
  const [travelType, setTravelType] = useState("Couple / Romance");
  const [budget, setBudget] = useState(35000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState("");
  
  // Date states
  const [dateType, setDateType] = useState<"fixed" | "flexible">("flexible");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [flexOption, setFlexOption] = useState("This Month");
  const [flexRange, setFlexRange] = useState("±3 Days");
  
  // Refine Trip Panel States
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Nature", "Relaxation"]);
  const [hotelPreference, setHotelPreference] = useState<"Budget" | "Standard" | "Premium" | "Luxury">("Premium");
  const [transportPreference, setTransportPreference] = useState("Flight");
  const [flightTimePreference, setFlightTimePreference] = useState("Morning");
  
  // AI Refinement pulsing overlay state
  const [isRefining, setIsRefining] = useState(false);
  const [refineText, setRefineText] = useState("Optimizing routes...");

  // AI Assistant Chat states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    { 
      sender: "ai", 
      text: "Welcome to your Trip Workspace! I've crafted a draft itinerary based on your inputs. Feel free to refine it using the panel or ask me directly to make modifications!" 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Mobile UI navigation tab
  const [mobileTab, setMobileTab] = useState<"summary" | "itinerary" | "refine">("itinerary");
  const [activeRightTab, setActiveRightTab] = useState<"chat" | "refine">("chat");

  // Itinerary visual states (mutated by AI suggestions/refiners)
  const [hotelOption, setHotelOption] = useState({
    name: "Alila Villas Uluwatu",
    rating: "5.0 Stars",
    price: "₹18,500 / night",
    desc: "Ocean-view private pools, bespoke cliff dining, butler concierge.",
    link: "https://www.booking.com"
  });

  const [flightOption, setFlightOption] = useState({
    airline: "Singapore Airlines",
    code: "SQ-948",
    price: "₹34,200",
    status: "Recommended Deal",
    link: "https://www.skyscanner.co.in"
  });

  const [dayTimeline, setDayTimeline] = useState([
    {
      day: "Day 1",
      title: "Sunset Temple & Coastal Dining",
      activities: [
        { time: "02:00 PM", name: "Check-in & Welcome Lounge", desc: "Arrive at Seminyak and settle into your premium suite rooms." },
        { time: "05:30 PM", name: "Uluwatu Cliff Sunset Temple Tour", desc: "Watch the spectacular sunset against the Indian Ocean cliffs." },
        { time: "08:30 PM", name: "Romantic Jimbaran Bay Seafood Dinner", desc: "Dine on grilled lobster and red snapper candlelit on the beachfront." }
      ]
    },
    {
      day: "Day 2",
      title: "Ubud Culture & Sacred Valleys",
      activities: [
        { time: "09:30 AM", name: "Sacred Monkey Forest Sanctuary Walk", desc: "Explore the moss-covered jungle temples inhabited by monkeys." },
        { time: "01:00 PM", name: "Gastronomy Lunch at Locavore Ubud", desc: "Indulge in a premium multi-course local ingredient tasting menu." },
        { time: "03:30 PM", name: "Tegallalang Rice Terrace & Giant Swings", desc: "Enjoy panoramic views of emerald valleys and swing above the palms." }
      ]
    },
    {
      day: "Day 3",
      title: "Volcanic Hot Springs & Waterfall Hike",
      activities: [
        { time: "05:00 AM", name: "Mount Batur Sunrise Summit Viewpoint", desc: "Climb to the scenic summit peak to witness the morning sun." },
        { time: "10:00 AM", name: "Toya Devasya Natural Hot Springs", desc: "Rejuvenate in warm geothermal mineral pools with views of Mount Batur." },
        { time: "03:00 PM", name: "Tegenungan Hidden Waterfall Exploration", desc: "Swim at the base of the dramatic forest waterfall canyon." }
      ]
    }
  ]);

  const generationLoaderSteps = [
    "Analyzing destination vibe & weather...",
    "Scanning Skyscanner API for flight routes...",
    "Filtering Booking.com boutique stays...",
    "Optimizing geo-routes and local activities..."
  ];

  // Hydrate states from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedInUser = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(isLoggedInUser);

      const paramsStr = localStorage.getItem("temp_trip_params");
      if (paramsStr) {
        try {
          const params: TripParams = JSON.parse(paramsStr);
          if (params.destination) setDestination(params.destination);
          if (params.travelType) setTravelType(params.travelType);
          
          if (params.budgetCustom) {
            setBudget(Number(params.budgetCustom));
          } else if (params.budgetPreset) {
            const parsed = params.budgetPreset.replace(/[^0-9]/g, "");
            if (parsed) {
              setBudget(Number(parsed) * 1000);
            } else if (params.budgetPreset.includes("100k")) {
              setBudget(120000);
            }
          }
          
          if (params.dateType) setDateType(params.dateType);
          if (params.fromDate) setFromDate(params.fromDate);
          if (params.toDate) setToDate(params.toDate);
          if (params.flexOption) setFlexOption(params.flexOption);
          if (params.flexRange) setFlexRange(params.flexRange);
        } catch (e) {
          console.error("Failed to parse temp_trip_params:", e);
        }
      }
    }

    // Sequence the loading screen
    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      if (stepCount < generationLoaderSteps.length) {
        setGenerationStep(stepCount);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
        }, 400);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // Update budget local storage sync
  const saveBudget = () => {
    const numeric = Number(tempBudgetInput.replace(/[^0-9]/g, ""));
    if (numeric && !isNaN(numeric)) {
      setBudget(numeric);
    }
    setIsEditingBudget(false);
    triggerRefineEffect("Updating budget allocation...");
  };

  // Helper to trigger refiner visual feedback
  const triggerRefineEffect = (message: string) => {
    setRefineText(message);
    setIsRefining(true);
    setTimeout(() => {
      setIsRefining(false);
    }, 1200);
  };

  // Upgrades itinerary elements
  const handleUpgrade = () => {
    triggerRefineEffect("Performing premium upgrades...");
    setHotelOption({
      name: "Amandari Ritz-Carlton Ubud",
      rating: "5.0 Stars",
      price: "₹42,000 / night",
      desc: "Ultra-luxury cliff villas, private horizon plunge pool, 24/7 dedicated butler service.",
      link: "https://www.booking.com"
    });
    setFlightOption({
      airline: "Singapore Airlines Business Class",
      code: "SQ-948 (Biz)",
      price: "₹1,18,000",
      status: "Premium Pick",
      link: "https://www.skyscanner.co.in"
    });
    setHotelPreference("Luxury");
    setBudget(165000);
  };

  // Downgrade or optimize budget
  const handleReduceBudget = () => {
    triggerRefineEffect("Optimizing cost distribution...");
    setHotelOption({
      name: "Aloft Bali Seminyak Resort",
      rating: "4.2 Stars",
      price: "₹5,200 / night",
      desc: "Chic design rooms, rooftop pool, steps from Batu Belig beach.",
      link: "https://www.booking.com"
    });
    setFlightOption({
      airline: "AirAsia",
      code: "AK-377",
      price: "₹16,400",
      status: "Cheapest Deal",
      link: "https://www.skyscanner.co.in"
    });
    setHotelPreference("Budget");
    setBudget(22000);
  };

  // Chat message simulator
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const msgLower = userMsg.toLowerCase();
      let reply = "I've processed your request. Let me refine the flights and day schedule for you.";

      if (msgLower.includes("luxury") || msgLower.includes("upgrade")) {
        reply = "Upgraded to 5-star Luxury resorts (Amandari Ubud) and switched flights to Singapore Airlines Business Class. Your budget has been adjusted to luxury standards.";
        handleUpgrade();
      } else if (msgLower.includes("cheap") || msgLower.includes("reduce") || msgLower.includes("budget") || msgLower.includes("cost")) {
        reply = "I've re-allocated the budget. Stays are changed to Aloft Seminyak and flights are updated to AirAsia lowest fares. Budget is reduced to ₹22,000.";
        handleReduceBudget();
      } else if (msgLower.includes("activity") || msgLower.includes("adventure") || msgLower.includes("sport")) {
        reply = "Added customized water activities (Scuba diving and Jet Skiing) in Nusa Dua on Day 2 morning, and optimized restaurant bookings.";
        triggerRefineEffect("Updating activities checklist...");
        setDayTimeline(prev => {
          const copy = [...prev];
          copy[1].activities.unshift({
            time: "08:30 AM",
            name: "Nusa Dua Scuba Reef Diving",
            desc: "Immerse in beautiful coral reefs and feed exotic marine life."
          });
          return copy;
        });
      } else if (msgLower.includes("hotel") || msgLower.includes("stay") || msgLower.includes("booking")) {
        reply = "Replaced your hotel recommendation with the luxury W Bali Seminyak (5-star boutique beachfront resort) matching your taste.";
        triggerRefineEffect("Replacing hotel preference...");
        setHotelOption({
          name: "W Bali - Seminyak Resort",
          rating: "4.9 Stars",
          price: "₹29,000 / night",
          desc: "Beachfront view villas, wet deck pools, upscale dining restaurants.",
          link: "https://www.booking.com"
        });
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: reply }]);
    }, 1000);
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
    triggerRefineEffect(`Filtering for ${interest} activities...`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginModal(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans relative overflow-x-hidden pt-20">
      
      {/* Background glow canvas */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Main navigation header */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#04060E]/80 backdrop-blur-md border-b border-white/5 py-4 px-6">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#14B8A6]">
                <path d="M2 22L12 2L22 22H2Z" fill="currentColor" fillOpacity="0.8"/>
                <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
              </svg>
              <span className="text-lg font-bold text-white tracking-tight font-sora">
                TripPilot
              </span>
            </Link>
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors font-bold">
              <ArrowLeft className="w-3.5 h-3.5" /> Return Home
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs bg-white/5 border border-white/10 rounded-full px-4 py-1.5 font-bold text-teal-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              AI Draft v1.0
            </div>
            
            {!isLoggedIn ? (
              <Button 
                onClick={() => setShowLoginModal(true)}
                className="bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-white rounded-full text-xs font-bold px-5 h-8 border-none"
              >
                Sign In
              </Button>
            ) : (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 pl-3 pr-1.5">
                <span className="text-[10px] font-bold text-white/60">Premium Traveler</span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center text-[10px] font-black text-white">
                  PT
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Screen Loader / Generation Progress State */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#030712]/98 flex flex-col items-center justify-center text-center px-4"
          >
            <div className="relative mb-8">
              {/* Spinner */}
              <div className="w-24 h-24 rounded-full border-4 border-teal-500/10 border-t-teal-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-teal-400 animate-pulse" />
              </div>
            </div>
            
            <motion.h3 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-2xl font-bold text-white font-sora mb-6"
            >
              Generating Custom Travel Workspace
            </motion.h3>

            <div className="max-w-xs w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-3">
              {generationLoaderSteps.map((stepMsg, idx) => {
                const isCurrent = generationStep === idx;
                const isPast = generationStep > idx;
                return (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    {isPast ? (
                      <Check className="w-4 h-4 text-teal-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border border-teal-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/10 shrink-0" />
                    )}
                    <span className={isCurrent ? "text-white font-bold" : isPast ? "text-white/60" : "text-white/20"}>
                      {stepMsg}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsing overlay for Refinement changes */}
      <AnimatePresence>
        {isRefining && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="bg-[#0A0F1D] border border-white/10 rounded-2xl p-5 shadow-2xl flex items-center gap-4 text-white">
              <RefreshCw className="w-5 h-5 text-teal-400 animate-spin" />
              <span className="text-sm font-bold tracking-tight font-sora">{refineText}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Workspace Layout */}
      {!isGenerating && (
        <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 md:px-6 py-6 flex flex-col gap-6 z-10 pb-28 lg:pb-8">
          
          {/* Sub Header info bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/5 border border-white/[0.08] backdrop-blur-xl p-5 rounded-2xl">
            <div>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block mb-0.5">Workspace</span>
              <h1 className="text-2xl font-bold tracking-tight text-white font-sora flex items-center gap-2">
                Drafting: {destination} <Sparkles className="w-4 h-4 text-[#14B8A6] animate-pulse" />
              </h1>
            </div>
            
            {/* Quick action buttons */}
            <div className="flex gap-2.5">
              <Button 
                onClick={handleUpgrade}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl text-xs font-bold px-4 h-9 border-none shadow-sm"
              >
                Luxury Upgrade
              </Button>
              <Button 
                onClick={handleReduceBudget}
                className="bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 rounded-xl text-xs font-bold px-4 h-9"
              >
                Reduce Budget
              </Button>
            </div>
          </div>

          {/* Grid columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* 1. LEFT COLUMN: Trip Summary (3 cols on desktop) */}
            <div className={`lg:col-span-3 space-y-6 ${mobileTab === "summary" ? "block" : "hidden lg:block"}`}>
              
              {/* Destination Photo Header */}
              <div className="bg-white/5 border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="h-32 bg-slate-800 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400&auto=format&fit=crop" 
                    alt={destination}
                    className="w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] to-transparent" />
                  <span className="absolute bottom-3 left-4 text-lg font-black font-sora text-white truncate max-w-[90%]">
                    {destination}
                  </span>
                </div>
                
                <div className="p-5 space-y-4">
                  {/* Editable Budget Section (Issue 5) */}
                  <div className="border-b border-white/5 pb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Total Budget</span>
                      {!isEditingBudget && (
                        <button 
                          onClick={() => {
                            setIsEditingBudget(true);
                            setTempBudgetInput(budget.toString());
                          }}
                          className="text-xs text-teal-400 hover:text-white flex items-center gap-1 font-bold"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </div>
                    
                    {isEditingBudget ? (
                      <div className="flex gap-2 mt-1">
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1.5 text-xs text-white/50 font-bold">₹</span>
                          <input 
                            type="text"
                            value={tempBudgetInput}
                            onChange={(e) => setTempBudgetInput(e.target.value)}
                            className="bg-white/5 border border-white/20 rounded-lg py-1 pl-6 pr-2 text-xs text-white w-full focus:outline-none focus:border-teal-500 font-semibold"
                            placeholder="Amount in INR"
                            autoFocus
                          />
                        </div>
                        <button onClick={saveBudget} className="bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-3 text-[10px] font-bold">
                          Save
                        </button>
                      </div>
                    ) : (
                      <span className="text-2xl font-black text-white font-sora block mt-0.5">
                        ₹{budget.toLocaleString()} <span className="text-xs text-white/40 font-medium font-sans">INR</span>
                      </span>
                    )}
                  </div>

                  {/* Travelers Group */}
                  <div className="border-b border-white/5 pb-4">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest block mb-1">Travelers</span>
                    <div className="flex items-center gap-2 text-xs text-white/80 font-bold">
                      <Users className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{travelType}</span>
                    </div>
                  </div>

                  {/* Date Preferences */}
                  <div className="border-b border-white/5 pb-4">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest block mb-1">Dates & Flexibility</span>
                    <div className="flex items-center gap-2 text-xs text-white/80 font-bold">
                      <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
                      <span className="truncate">
                        {dateType === "fixed" 
                          ? `${fromDate || "Select Date"} to ${toDate || "Select Date"}` 
                          : `Flexible: ${flexOption} (${flexRange})`}
                      </span>
                    </div>
                  </div>

                  {/* Accommodation Preferences */}
                  <div>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest block mb-1">Accommodation Tier</span>
                    <div className="flex items-center gap-2 text-xs text-white/80 font-bold">
                      <Bed className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{hotelPreference} Tier</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Weather Widget */}
              <div className="bg-white/5 border border-white/[0.08] backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CloudSun className="w-8 h-8 text-teal-400" />
                  <div>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest block">Weather forecast</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">29°C / Sunny</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/40 font-bold block uppercase">Best month</span>
                  <span className="text-xs text-teal-400 font-bold mt-0.5 block">July to Sept</span>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="bg-white/5 border border-white/[0.08] backdrop-blur-xl p-5 rounded-2xl text-xs text-white/50 leading-relaxed font-semibold">
                <h5 className="text-white font-bold mb-2 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-teal-400" /> Concierge Advisory
                </h5>
                Bali requires a visa-on-arrival (VOA) for most passport holders, which can be acquired online or at Denpasar airport for IDR 500,000 (~₹2,700).
              </div>

            </div>

            {/* 2. CENTER COLUMN: Timeline and Travel components (6 cols on desktop) */}
            <div className={`lg:col-span-6 space-y-6 ${mobileTab === "itinerary" ? "block" : "hidden lg:block"}`}>
              
              {/* Daily Timeline card */}
              <div className="bg-white/5 border border-white/[0.08] backdrop-blur-xl p-6 md:p-8 rounded-[32px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white font-sora">Day-by-Day Itinerary</h3>
                  <span className="text-[10px] font-bold bg-[#14B8A6]/10 text-teal-300 border border-[#14B8A6]/20 rounded-full px-3 py-1">
                    Route Optimized
                  </span>
                </div>
                
                {/* Timeline flow */}
                <div className="border-l border-white/10 ml-3 pl-6 space-y-8 text-left">
                  {dayTimeline.map((dayItem, idx) => (
                    <div key={idx} className="relative">
                      {/* Dot icon */}
                      <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-teal-400 border border-[#030712] shadow-sm" />
                      
                      <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase block mb-1">
                        {dayItem.day}
                      </span>
                      <h4 className="text-base font-bold text-white mb-3 font-sora">
                        {dayItem.title}
                      </h4>
                      
                      <div className="space-y-3">
                        {dayItem.activities.map((act, actIdx) => (
                          <div key={actIdx} className="bg-white/2 border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors">
                            <span className="text-[9px] font-bold text-white/30 uppercase block mb-1">{act.time}</span>
                            <h5 className="text-xs font-bold text-white mb-0.5">{act.name}</h5>
                            <p className="text-xs text-white/50 leading-relaxed font-semibold">{act.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Flights */}
              <div className="bg-white/5 border border-white/[0.08] backdrop-blur-xl p-6 rounded-[28px]">
                <div className="flex items-center gap-2 mb-4">
                  <Plane className="w-5 h-5 text-teal-400" />
                  <h4 className="text-xs font-bold text-white tracking-widest uppercase">Flights recommendation</h4>
                </div>
                
                <div className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/80">
                      SQ
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white">{flightOption.airline}</span>
                      <span className="text-[10px] text-white/40 font-semibold uppercase">{flightOption.code}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="block text-sm font-black text-teal-400">{flightOption.price}</span>
                    <span className="text-[9px] text-white/40 font-semibold">{flightOption.status}</span>
                  </div>
                </div>

                <a href={flightOption.link} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-white rounded-xl py-3 text-xs font-bold transition-all h-10 border-none">
                    Book Flight Deal on Skyscanner
                  </Button>
                </a>
              </div>

              {/* Recommended Hotel Stays */}
              <div className="bg-white/5 border border-white/[0.08] backdrop-blur-xl p-6 rounded-[28px]">
                <div className="flex items-center gap-2 mb-4">
                  <Bed className="w-5 h-5 text-teal-400" />
                  <h4 className="text-xs font-bold text-white tracking-widest uppercase font-sora">Hotel recommendation</h4>
                </div>
                
                <div className="p-4 bg-white/2 border border-white/5 rounded-2xl mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="block text-xs font-bold text-white">{hotelOption.name}</span>
                      <span className="text-[10px] text-[#14B8A6] font-bold">{hotelOption.rating}</span>
                    </div>
                    <span className="text-xs font-black text-teal-400">{hotelOption.price}</span>
                  </div>
                  <p className="text-xs text-white/50 font-semibold leading-relaxed">{hotelOption.desc}</p>
                </div>

                <a href={hotelOption.link} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl py-3 text-xs font-bold transition-all h-10">
                    Book Stay on Booking.com
                  </Button>
                </a>
              </div>

              {/* Mockup Interactive Map Container */}
              <div className="bg-white/5 border border-white/[0.08] backdrop-blur-xl p-6 rounded-[28px]">
                <div className="flex items-center gap-2 mb-4">
                  <Map className="w-5 h-5 text-teal-400" />
                  <h4 className="text-xs font-bold text-white tracking-widest uppercase">Itinerary Route Map</h4>
                </div>
                <div className="h-64 bg-slate-950/40 border border-white/5 rounded-2xl overflow-hidden relative flex items-center justify-center">
                  {/* Simulating a map graphics visual */}
                  <div className="absolute inset-0 bg-cover opacity-60 mix-blend-luminosity" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop')" }} />
                  <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_10px_#14B8A6] animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_10px_#14B8A6] animate-pulse" />
                  <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_10px_#14B8A6] animate-pulse" />
                  
                  {/* Glass route details tag */}
                  <div className="absolute bottom-4 left-4 bg-[#0A0F1D]/80 backdrop-blur-md border border-white/10 p-3 rounded-xl text-left">
                    <span className="text-[9px] text-white/40 block font-bold uppercase tracking-widest">Selected route</span>
                    <span className="text-xs font-bold text-white mt-0.5 block">Seminyak &rarr; Ubud &rarr; Mount Batur</span>
                  </div>
                  
                  <button className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 border border-white/10 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* 3. RIGHT COLUMN: Interactive Refine Options & AI Assistant Chat (3 cols on desktop) */}
            <div className={`lg:col-span-3 space-y-6 ${mobileTab === "refine" ? "block" : "hidden lg:block"}`}>
              
              {/* Tab selector for Chat vs Refine options */}
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                <button 
                  onClick={() => setActiveRightTab("chat")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeRightTab === "chat" ? "bg-teal-500/10 border border-teal-500/30 text-teal-300" : "text-white/60 hover:text-white"}`}
                >
                  <Bot className="w-4 h-4" /> AI Assistant
                </button>
                <button 
                  onClick={() => setActiveRightTab("refine")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeRightTab === "refine" ? "bg-teal-500/10 border border-teal-500/30 text-teal-300" : "text-white/60 hover:text-white"}`}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Refine Trip
                </button>
              </div>

              {/* View A: AI Assistant chat box */}
              {activeRightTab === "chat" && (
                <div className="bg-white/5 border border-white/[0.08] backdrop-blur-xl rounded-[28px] p-5 flex flex-col h-[520px] justify-between">
                  <div>
                    <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block mb-2">Concierge Conversation</span>
                    
                    {/* Message Box */}
                    <div className="space-y-4 overflow-y-auto max-h-[340px] pr-2 scrollbar-none flex flex-col text-xs font-semibold leading-relaxed">
                      {chatMessages.map((msg, index) => {
                        const isAi = msg.sender === "ai";
                        return (
                          <div 
                            key={index} 
                            className={`flex gap-2.5 max-w-[85%] ${isAi ? "self-start text-left" : "self-end flex-row-reverse text-right"}`}
                          >
                            {isAi && (
                              <div className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shrink-0">
                                <Bot className="w-3.5 h-3.5 text-teal-400" />
                              </div>
                            )}
                            <div className={`p-3 rounded-2xl ${isAi ? "bg-white/5 border border-white/5 text-white/80" : "bg-[#14B8A6] text-white"}`}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                      
                      {isTyping && (
                        <div className="flex gap-2.5 self-start text-left items-center">
                          <div className="w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shrink-0">
                            <Bot className="w-3.5 h-3.5 text-teal-400" />
                          </div>
                          <div className="flex gap-1 p-3 bg-white/5 border border-white/5 rounded-2xl">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" />
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce delay-100" />
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce delay-200" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/5">
                    {/* Quick suggestion tags (Issue 10) */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { text: "Luxury Upgrade", action: handleUpgrade },
                        { text: "Reduce Cost", action: handleReduceBudget },
                        { text: "Add Activities", action: () => {
                          setChatInput("Add some adventure activities to the itinerary");
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      ].map((chip, i) => (
                        <button
                          key={i}
                          onClick={chip.action}
                          className="text-[9px] font-bold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-full px-2.5 py-1 transition-all"
                        >
                          {chip.text}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="relative">
                      <input 
                        type="text" 
                        placeholder="Type request (e.g. 'Add surfing lessons')..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="w-full bg-[#121824] border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500 font-semibold"
                      />
                      <button 
                        type="submit" 
                        className="absolute right-2.5 top-2 text-teal-400 hover:text-white transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* View B: Refinement Options Form (Issue 3) */}
              {activeRightTab === "refine" && (
                <div className="bg-white/5 border border-white/[0.08] backdrop-blur-xl rounded-[28px] p-5 space-y-5 text-left text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block mb-2">Travel Interests</span>
                    <div className="flex flex-wrap gap-2">
                      {["Adventure", "Nature", "Food", "Photography", "Nightlife", "Relaxation"].map((interest) => {
                        const active = selectedInterests.includes(interest);
                        return (
                          <button
                            key={interest}
                            onClick={() => handleInterestToggle(interest)}
                            className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                              active ? "bg-teal-500/10 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Accommodation Preference */}
                  <div>
                    <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block mb-2">Hotel Preference</span>
                    <div className="grid grid-cols-2 gap-2">
                      {["Budget", "Standard", "Premium", "Luxury"].map((tier) => {
                        const active = hotelPreference === tier;
                        return (
                          <button
                            key={tier}
                            onClick={() => {
                              setHotelPreference(tier as any);
                              if (tier === "Luxury") handleUpgrade();
                              else if (tier === "Budget") handleReduceBudget();
                              else triggerRefineEffect(`Switching accommodation preference to ${tier}...`);
                            }}
                            className={`py-2 px-3 rounded-lg border text-center transition-all ${
                              active ? "bg-teal-500/10 border-teal-500 text-teal-300 font-bold" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            {tier}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Transport Preference */}
                  <div>
                    <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block mb-2">Transport Preference</span>
                    <div className="grid grid-cols-3 gap-2">
                      {["Flight", "Train", "Bus", "Car", "No Preference"].map((trans) => {
                        const active = transportPreference === trans;
                        return (
                          <button
                            key={trans}
                            onClick={() => {
                              setTransportPreference(trans);
                              triggerRefineEffect(`Selecting ${trans} transport filter...`);
                            }}
                            className={`py-2 px-2 rounded-lg border text-center text-[10px] transition-all truncate ${
                              active ? "bg-teal-500/10 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            {trans}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Flight Time Preference */}
                  <div>
                    <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block mb-2">Flight Departure Time</span>
                    <div className="grid grid-cols-2 gap-2">
                      {["Morning", "Afternoon", "Evening", "Night"].map((time) => {
                        const active = flightTimePreference === time;
                        return (
                          <button
                            key={time}
                            onClick={() => {
                              setFlightTimePreference(time);
                              triggerRefineEffect(`Filtering for ${time} flight departures...`);
                            }}
                            className={`py-2 px-2 rounded-lg border text-center transition-all ${
                              active ? "bg-teal-500/10 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date Preferences Toggle (Issue 4) */}
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block mb-2">Dates Type</span>
                    <div className="flex bg-white/5 rounded-lg p-1 mb-3">
                      <button 
                        onClick={() => {
                          setDateType("fixed");
                          triggerRefineEffect("Switching to fixed dates...");
                        }}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${dateType === "fixed" ? "bg-teal-500 text-white" : "text-white/60"}`}
                      >
                        Fixed Dates
                      </button>
                      <button 
                        onClick={() => {
                          setDateType("flexible");
                          triggerRefineEffect("Switching to flexible dates...");
                        }}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${dateType === "flexible" ? "bg-teal-500 text-white" : "text-white/60"}`}
                      >
                        Flexible Dates
                      </button>
                    </div>

                    {dateType === "fixed" ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5 uppercase">From</label>
                          <input 
                            type="date" 
                            value={fromDate}
                            onChange={(e) => {
                              setFromDate(e.target.value);
                              triggerRefineEffect("Applying departure date...");
                            }}
                            className="bg-[#121824] border border-white/10 rounded-lg p-2 text-[10px] text-white w-full focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block mb-0.5 uppercase">To</label>
                          <input 
                            type="date" 
                            value={toDate}
                            onChange={(e) => {
                              setToDate(e.target.value);
                              triggerRefineEffect("Applying return date...");
                            }}
                            className="bg-[#121824] border border-white/10 rounded-lg p-2 text-[10px] text-white w-full focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {["Any Weekend", "This Month", "Next Month"].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setFlexOption(opt);
                                triggerRefineEffect(`Filtering for ${opt}...`);
                              }}
                              className={`py-1 px-2.5 rounded-lg border text-[10px] transition-all ${
                                flexOption === opt ? "bg-teal-500/10 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/60"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-1.5">
                          {["±3 Days", "±7 Days"].map((range) => (
                            <button
                              key={range}
                              onClick={() => {
                                setFlexRange(range);
                                triggerRefineEffect(`Applying ${range} flexibility...`);
                              }}
                              className={`py-1 px-2.5 rounded-lg border text-[10px] transition-all ${
                                flexRange === range ? "bg-teal-500/10 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/60"
                              }`}
                            >
                              {range}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* Sticky footer tab selectors below 'lg' for 100% responsiveness (Issue 7) */}
      {!isGenerating && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0F1D]/90 backdrop-blur-md border-t border-white/10 px-6 py-3.5 flex justify-around shadow-2xl">
          <button 
            onClick={() => setMobileTab("summary")}
            className={`flex flex-col items-center gap-1.5 text-[10px] font-bold transition-all ${mobileTab === "summary" ? "text-teal-400" : "text-white/40"}`}
          >
            <Info className="w-4 h-4" />
            <span>Summary</span>
          </button>
          
          <button 
            onClick={() => setMobileTab("itinerary")}
            className={`flex flex-col items-center gap-1.5 text-[10px] font-bold transition-all ${mobileTab === "itinerary" ? "text-teal-400" : "text-white/40"}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Itinerary</span>
          </button>
          
          <button 
            onClick={() => setMobileTab("refine")}
            className={`flex flex-col items-center gap-1.5 text-[10px] font-bold transition-all ${mobileTab === "refine" ? "text-teal-400" : "text-white/40"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Refine & Chat</span>
          </button>
        </div>
      )}

      {/* Login intercept modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Content card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row min-h-[500px] relative z-10 text-slate-800"
            >
              {/* Close Icon */}
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 z-50 text-slate-400 hover:text-black p-2 rounded-full hover:bg-slate-100 transition-colors md:text-white md:hover:bg-white/10 md:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Deep Navy */}
              <div 
                className="w-full md:w-[45%] bg-[#0B1329] p-8 md:p-10 text-white flex flex-col justify-between relative"
                style={{
                  backgroundImage: "radial-gradient(circle at 10% 10%, rgba(20, 184, 166, 0.15), transparent 60%)"
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-16">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 22L12 2L22 22H2Z" fill="#14B8A6" fillOpacity="0.8"/>
                      <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
                    </svg>
                    <span className="text-lg font-bold tracking-tight font-sora text-white">TripPilot</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-extrabold font-sora leading-tight mb-4">
                    "Your next journey starts here."
                  </h3>
                  
                  {/* Avatar list */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5">
                      {["photo-1534528741775-53994a69daeb", "photo-1507003211169-0a1dd7228f2d", "photo-1494790108377-be9c29b29330"].map((u, i) => (
                        <img 
                          key={i}
                          src={`https://images.unsplash.com/${u}?q=80&w=60&auto=format&fit=crop`}
                          alt="user"
                          className="w-7 h-7 rounded-full border-2 border-[#0B1329] object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-white/50 font-semibold">10,000+ Trips Planned</span>
                  </div>
                </div>

                <div className="mt-12 md:mt-0">
                  <p className="text-[10px] text-white/30 tracking-widest font-black uppercase">
                    EST. 2024 / GLOBAL CONCIERGE
                  </p>
                </div>
              </div>

              {/* Right Column: Sign in details */}
              <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-between bg-white max-w-[500px] mx-auto text-slate-800">
                <div className="w-full">
                  <h3 className="text-2xl font-black text-black tracking-tight mb-2">Welcome Back</h3>
                  <p className="text-slate-500 text-xs mb-6 font-medium">Sign in to access your bespoke travel itineraries.</p>
                  
                  {/* Tabs */}
                  <div className="flex border-b border-slate-100 mb-6">
                    <button type="button" className="flex-1 text-center py-2 text-xs font-bold text-black border-b-2 border-black">
                      Login
                    </button>
                    <Link href="/signup" className="flex-1 text-center py-2 text-xs font-bold text-slate-400 hover:text-black">
                      Sign Up
                    </Link>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Google Login */}
                    <button 
                      type="button"
                      onClick={handleLoginSubmit}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      Continue with Google
                    </button>

                    <div className="text-center text-[10px] font-black text-slate-300 tracking-wider my-3 uppercase">
                      OR
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="name@luxury.com" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
                      />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold text-slate-700">Password</label>
                        <span className="text-[10px] font-bold text-slate-400 hover:text-black cursor-pointer">Forgot?</span>
                      </div>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-medium pr-10"
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-black hover:bg-black/90 text-white rounded-xl py-3 text-xs font-bold transition-all shadow-md mt-2 border-none h-11"
                    >
                      Continue
                    </Button>
                  </form>
                </div>

                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-bold mt-8 border-t border-slate-100 pt-4 font-sans">
                  <span className="hover:text-black cursor-pointer">Privacy Policy</span>
                  <span className="hover:text-black cursor-pointer">Terms of Service</span>
                  <span className="hover:text-black cursor-pointer">Need help?</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
