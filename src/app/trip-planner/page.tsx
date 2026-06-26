"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Calendar, Users, Wallet, Sparkles, Check, ChevronLeft, ChevronRight, 
  Eye, EyeOff, Bot, Globe, ShieldCheck, Heart, User, Compass, HelpCircle, 
  Map, Award, Plane, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TripPlannerPage() {
  const router = useRouter();
  
  // Wizard States
  const [step, setStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");

  // Step 1: Starting Location & Destination
  const [originCity, setOriginCity] = useState("Beed");
  const [destination, setDestination] = useState("Ganpatipule");
  const [arrivalMode, setArrivalMode] = useState("Bus");
  const [arrivalTime, setArrivalTime] = useState("08:30 AM");
  const [departureTime, setDepartureTime] = useState("04:30 PM");
  const [hotelPreference, setHotelPreference] = useState("Midrange");
  const [foodPreference, setFoodPreference] = useState("Veg");
  const [transportPreference, setTransportPreference] = useState("Bus / Cab");
  const [travelStyle, setTravelStyle] = useState("Relaxed Sightseeing");
  const [travelSpeed, setTravelSpeed] = useState("Balanced");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Ganpatipule", 
    "Goa, India", 
    "Bali, Indonesia"
  ]);

  // Step 2: Dates
  const [dateType, setDateType] = useState<"fixed" | "flexible" | "weekend" | "month">("fixed");
  const [fromDate, setFromDate] = useState("2026-07-15");
  const [toDate, setToDate] = useState("2026-07-20");
  const [flexibleMonth, setFlexibleMonth] = useState("July 2026");
  const [durationNights, setDurationNights] = useState(5);
  const [weekendSelection, setWeekendSelection] = useState("This Weekend");
  const [planningMonth, setPlanningMonth] = useState("September 2026");

  // Step 3 & 4: Travel Type & Detailed Counts
  const [travelerType, setTravelerType] = useState<"Solo" | "Couple" | "Family" | "Friends" | "Corporate">("Couple");
  
  // Counts by travel type
  const [soloGender, setSoloGender] = useState<"unspecified" | "male" | "female">("unspecified");
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [seniorsCount, setSeniorsCount] = useState(0);
  const [boysCount, setBoysCount] = useState(2);
  const [girlsCount, setGirlsCount] = useState(2);
  const [maleCount, setMaleCount] = useState(3);
  const [femaleCount, setFemaleCount] = useState(3);

  // Step 5: Budget
  const [budgetValue, setBudgetValue] = useState(50000);
  const [customBudget, setCustomBudget] = useState("");
  const [customBudgetEnabled, setCustomBudgetEnabled] = useState(false);

  // Step 6: Travel Interests
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(["Luxury", "Nature"]);

  // Auth Forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Initialize
  useEffect(() => {
    const savedAuth = localStorage.getItem("traveler_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePreferenceToggle = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleNextStep = () => {
    if (step < 7) {
      setStep(prev => prev + 1);
    } else {
      // Step 7: Summary clicks "Generate Itinerary" -> trigger Auth Gate
      if (isAuthenticated) {
        triggerItineraryGeneration();
      } else {
        setShowAuth(true);
      }
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    
    setTimeout(() => {
      setAuthLoading(false);
      setIsAuthenticated(true);
      localStorage.setItem("traveler_auth", "true");
      setShowAuth(false);
      triggerItineraryGeneration();
    }, 1200);
  };

  const triggerItineraryGeneration = async () => {
    setLoadingPhase(true);
    let progress = 0;
    const loaderTexts = [
      "Analyzing travel interests & timeline criteria...",
      "Connecting to Travixa AI Engine...",
      "Scraping real-time routes & stays...",
      "Balancing budget allocations & emergency buffers...",
      "Finalizing luxury itinerary..."
    ];
    setLoadingText(loaderTexts[0]);

    // Visual progress interval
    const interval = setInterval(() => {
      progress += 15;
      if (progress > 90) progress = 90; // Hold at 90% until API finishes
      setLoadingProgress(progress);
      const textIdx = Math.min(Math.floor(progress / 20), loaderTexts.length - 1);
      setLoadingText(loaderTexts[textIdx]);
    }, 700);

    try {
      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_city: originCity || "Beed",
          destination: destination || "Ganpatipule",
          trip_type: travelerType,
          budget: budgetValue,
          travelers: { adults: adultsCount, children: childrenCount, soloGender },
          arrival_mode: arrivalMode,
          arrival_time: arrivalTime,
          departure_time: departureTime,
          hotel_preference: hotelPreference,
          food_preference: foodPreference,
          travel_speed: travelSpeed,
          veg_nonveg: foodPreference === "Veg" ? "Pure Veg" : "Veg & Non-Veg",
          interests: selectedPreferences,
          duration: durationNights,
          transport_preference: transportPreference,
          travel_style: travelStyle,
          dates: { startDate: fromDate, endDate: toDate },
          travelType: travelerType
        })
      });

      if (!response.ok) throw new Error("Failed to generate itinerary");
      
      const data = await response.json();
      
      // Store locally so the /trips page can read the real generated data
      localStorage.setItem('last_generated_trip', JSON.stringify(data));
      
      clearInterval(interval);
      setLoadingProgress(100);
      setLoadingText("Itinerary Complete!");
      
      setTimeout(() => {
        router.push("/trips/generated"); // Send to a dynamic trips viewer
      }, 400);
      
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setLoadingText("Error generating trip. Please try again.");
      setTimeout(() => setLoadingPhase(false), 2000);
    }
  };

  // Helper text for step summaries
  const getTravelerSummary = () => {
    if (travelerType === "Solo") return `Solo Traveler (${soloGender === "unspecified" ? "1 Person" : soloGender})`;
    if (travelerType === "Couple") return "Couple (2 Adults)";
    if (travelerType === "Family") return `Family (${adultsCount} Adults, ${childrenCount} Kids, ${seniorsCount} Seniors)`;
    if (travelerType === "Friends") return `Friends Group (${boysCount} Boys, ${girlsCount} Girls)`;
    if (travelerType === "Corporate") return `Corporate Delegation (${maleCount} Male, ${femaleCount} Female)`;
    return "2 Adults";
  };

  return (
    <div className="traveler-theme min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col items-center justify-center font-sans relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="absolute top-0 left-0 right-0 h-16 px-6 md:px-12 flex items-center justify-between z-20 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md">
        <span 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 22L12 2L22 22H2Z" fill="#14B8A6" />
            <path d="M12 2L2 22H12V2Z" fill="#38BDF8" />
          </svg>
          <span className="text-base font-bold font-sora tracking-tight">Travixa</span>
        </span>
        <button 
          onClick={() => router.push("/dashboard")}
          className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          Skip to Dashboard
        </button>
      </header>

      {/* PROCESSING AI LOADER */}
      {loadingPhase && (
        <div className="fixed inset-0 bg-white z-[99] flex flex-col items-center justify-center p-6 space-y-6">
          <div className="relative w-24 h-24 mb-2">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-teal-600 animate-spin" />
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner">
              <Bot className="w-8 h-8 text-teal-600 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2 max-w-sm">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sora">Generating Your AI Trip</h2>
            <p className="text-xs text-slate-500 font-medium animate-pulse">{loadingText}</p>
          </div>
          <div className="w-64 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-teal-600 h-full transition-all duration-300 rounded-full" 
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400">{loadingProgress}% Complete</span>
        </div>
      )}

      {/* SPLIT SCREEN AUTHENTICATION GATE */}
      {showAuth && (
        <div className="fixed inset-0 bg-white z-[90] flex flex-col md:flex-row overflow-hidden font-sans">
          
          {/* Left panel: Inspiration & Reviews */}
          <div 
            className="w-full md:w-[45%] bg-[#0B1329] p-8 md:p-16 text-white flex flex-col justify-between relative min-h-[300px] md:min-h-screen shrink-0"
            style={{
              backgroundImage: "radial-gradient(circle at 10% 10%, rgba(20, 184, 166, 0.15), transparent 60%)"
            }}
          >
            <div>
              <span className="flex items-center gap-2 mb-16">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 22L12 2L22 22H2Z" fill="#14B8A6" fillOpacity="0.8"/>
                  <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
                </svg>
                <span className="text-xl font-bold tracking-tight text-white">Travixa</span>
              </span>
              
              <h3 className="text-3xl font-extrabold font-sora leading-tight mb-4 max-w-sm">
                "Your next journey starts here."
              </h3>
              <p className="text-xs text-white/60 mb-6 max-w-xs leading-relaxed">
                Connect with the world's most intelligent AI Travel Assistant. Customize stays, split group budgets, and travel with emergency backup.
              </p>

              <div className="border border-white/10 rounded-2xl p-4 bg-white/[0.02] max-w-xs space-y-3 mb-6">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=60&auto=format&fit=crop"
                  ].map((url, i) => (
                    <img key={i} src={url} alt="Traveler" className="w-8 h-8 rounded-full border border-[#0B1329] object-cover" />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black border border-[#0B1329]">
                    10k+
                  </div>
                </div>
                <div className="text-[10px] text-white/50">
                  <span className="text-white font-bold block">14,242 Trips Generated</span>
                  Across 120+ global countries this month alone.
                </div>
              </div>

              <div className="border border-white/10 rounded-2xl p-4 bg-white/[0.02] max-w-xs">
                <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-teal-400" /> Trust Indicator
                </p>
                <p className="text-[11px] text-white/80 italic">&ldquo;Travixa completely eliminated my spreadsheet logistics planning. Goa itinerary was ready in 2 minutes!&rdquo;</p>
                <span className="text-[9px] text-white/40 mt-1.5 block">— Sarah J., Solo Explorer</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-white/30 tracking-widest font-black uppercase">
                EST. 2024 / GLOBAL CONCIERGE
              </p>
            </div>
          </div>

          {/* Right panel: Login forms */}
          <div className="w-full md:w-[55%] bg-[#FAFBFD] p-8 md:p-16 flex flex-col justify-between text-slate-800 min-h-screen relative overflow-y-auto custom-scrollbar">
            <div className="hidden md:block" />
            
            <div className="max-w-[460px] w-full mx-auto my-auto bg-white rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100 space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sora">Authentication Required</h1>
                <p className="text-slate-500 text-xs mt-1">Authenticate to save and generate your customized travel plan.</p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100">
                <button 
                  onClick={() => setAuthTab("login")}
                  className={`flex-1 text-center py-2 text-xs font-bold transition-all border-b-2 ${
                    authTab === "login" ? "text-slate-900 border-slate-900" : "text-slate-400 border-transparent hover:text-slate-900"
                  }`}
                >
                  Log In
                </button>
                <button 
                  onClick={() => setAuthTab("signup")}
                  className={`flex-1 text-center py-2 text-xs font-bold transition-all border-b-2 ${
                    authTab === "signup" ? "text-slate-900 border-slate-900" : "text-slate-400 border-transparent hover:text-slate-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {/* Google Sign-in */}
                <button 
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="text-center text-[10px] font-black text-slate-300 tracking-wider uppercase my-2">
                  OR
                </div>

                {/* Email input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@luxury.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Password input */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <span className="text-[10px] text-slate-400 font-bold hover:underline cursor-pointer">Forgot?</span>
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white pr-10 transition-all font-medium"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 bottom-3 text-slate-400 hover:text-slate-900"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>

                {/* OTP Option */}
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold hover:underline cursor-pointer">Request OTP Code to Email</span>
                </div>

                {/* Submit button */}
                <Button 
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-11 rounded-xl text-xs shadow-md mt-4 border-none"
                >
                  {authLoading ? "Syncing Itinerary..." : authTab === "login" ? "Login & Generate" : "Create Account & Generate"}
                </Button>
              </form>
            </div>

            <div className="flex items-center justify-center gap-6 text-[10px] text-slate-400 font-bold mt-12 md:mt-0">
              <span className="hover:text-black cursor-pointer">Privacy Policy</span>
              <span className="hover:text-black cursor-pointer">Terms of Service</span>
            </div>
          </div>

        </div>
      )}

      {/* FULL SCREEN WIZARD PAGE CONTAINER */}
      {!showAuth && (
        <div className="w-full max-w-3xl px-4 py-24 flex flex-col justify-between min-h-[85vh] z-10 relative">
          
          {/* Step Indicator Header (7 steps) */}
          <div className="w-full flex justify-between items-center relative mb-12">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
            <div 
              className="absolute left-0 top-1/2 h-0.5 bg-teal-600 -z-10 -translate-y-1/2 transition-all duration-500" 
              style={{ width: `${((step - 1) / 6) * 100}%` }} 
            />
            
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                step >= i ? "bg-teal-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-400"
              }`}>
                {i}
              </div>
            ))}
          </div>

          {/* MAIN CARD SLIDES (Framer-motion transitions) */}
          <div className="flex-1 bg-white border border-[#E5E7EB] rounded-[32px] p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] min-h-[460px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: DESTINATION & STARTING LOCATION */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 flex-1">
                  <div className="flex items-center gap-1.5 text-teal-600 font-bold uppercase tracking-widest text-[10px]">
                    <MapPin className="w-4 h-4" /> Step 1: Starting Location & Destination
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">Starting Location (Mandatory)</label>
                      <input 
                        type="text"
                        value={originCity}
                        onChange={(e) => setOriginCity(e.target.value)}
                        placeholder="Where are you travelling from? (e.g. Beed, Pune, Mumbai, Nagpur...)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 text-sm text-slate-900 font-bold focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-inner"
                      />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {["Beed", "Pune", "Mumbai", "Nagpur", "Aurangabad", "Indore"].map(city => (
                          <button
                            key={city}
                            onClick={() => setOriginCity(city)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                              originCity === city ? "bg-teal-600 text-white border-teal-600" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            📍 {city}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">Target Destination (Mandatory)</label>
                      <input 
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Where are you heading? (e.g. Ganpatipule, Goa, Bali, Mahabaleshwar...)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 text-sm text-slate-900 font-bold focus:outline-none focus:border-teal-500 focus:bg-white transition-all shadow-inner"
                        autoFocus
                      />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {["Ganpatipule", "Goa", "Mahabaleshwar", "Lonavala", "Bali", "Paris"].map(dest => (
                          <button
                            key={dest}
                            onClick={() => setDestination(dest)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                              destination === dest ? "bg-teal-600 text-white border-teal-600" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            🌴 {dest}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">Popular & Trending Destinations</p>
                      <div className="flex flex-wrap gap-2">
                        {["Goa, India", "Bali, Indonesia", "Tokyo, Japan", "Maldives", "Paris, France"].map(dest => (
                          <button
                            key={dest}
                            onClick={() => setDestination(dest)}
                            className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                              destination === dest 
                                ? "bg-teal-50 border-teal-500 text-teal-700 shadow-sm" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {dest}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">AI Suggestions</p>
                      <div className="flex flex-wrap gap-2">
                        {["Tropical Island Getaways", "Heritage Culture Trails", "Wild Safaris", "Weekend Escapes"].map(aiTag => (
                          <button
                            key={aiTag}
                            onClick={() => setDestination(aiTag + ": Goa")}
                            className="px-3.5 py-1.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-lg border border-teal-200/50 hover:bg-teal-100 transition-all flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-teal-600 animate-pulse" /> {aiTag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: DATES TYPE & RANGE */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 flex-1">
                  <div className="flex items-center gap-1.5 text-teal-600 font-bold uppercase tracking-widest text-[10px]">
                    <Calendar className="w-4 h-4" /> Step 2: Travel Dates
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sora">When is your journey?</h2>

                  {/* Selection Mode Toggles */}
                  <div className="grid grid-cols-4 bg-slate-100 rounded-xl p-1 border border-slate-200/50 gap-1">
                    <button 
                      onClick={() => setDateType("fixed")}
                      className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
                        dateType === "fixed" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Fixed Dates
                    </button>
                    <button 
                      onClick={() => setDateType("flexible")}
                      className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
                        dateType === "flexible" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Flexible
                    </button>
                    <button 
                      onClick={() => setDateType("weekend")}
                      className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
                        dateType === "weekend" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Weekend Escape
                    </button>
                    <button 
                      onClick={() => setDateType("month")}
                      className={`py-2 text-[10px] font-bold rounded-lg transition-all ${
                        dateType === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Month Planning
                    </button>
                  </div>

                  {dateType === "fixed" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 block mb-2 uppercase tracking-wider">Start Date</label>
                        <input 
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 block mb-2 uppercase tracking-wider">End Date</label>
                        <input 
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                  )}

                  {dateType === "flexible" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 block mb-2 uppercase tracking-wider">Target Month</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["July 2026", "August 2026", "September 2026"].map(month => (
                            <button
                              key={month}
                              onClick={() => setFlexibleMonth(month)}
                              className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                flexibleMonth === month 
                                  ? "bg-teal-50 border-teal-500 text-teal-700" 
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {month}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>Nights Stay:</span>
                          <span className="text-teal-600">{durationNights} Nights</span>
                        </div>
                        <input 
                          type="range" 
                          min="2" 
                          max="15" 
                          value={durationNights} 
                          onChange={(e) => setDurationNights(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        />
                      </div>
                    </div>
                  )}

                  {dateType === "weekend" && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Select Weekend</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["This Weekend", "Next Weekend", "End of Month"].map(wk => (
                          <button
                            key={wk}
                            onClick={() => {
                              setWeekendSelection(wk);
                              setDurationNights(2);
                            }}
                            className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                              weekendSelection === wk 
                                ? "bg-teal-50 border-teal-500 text-teal-700" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {wk} (2 Nights)
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {dateType === "month" && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Select Planning Month</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["October 2026", "November 2026", "December 2026", "January 2027", "February 2027", "March 2027"].map(mnth => (
                          <button
                            key={mnth}
                            onClick={() => setPlanningMonth(mnth)}
                            className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                              planningMonth === mnth 
                                ? "bg-teal-50 border-teal-500 text-teal-700" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {mnth}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: TRAVEL TYPE */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 flex-1">
                  <div className="flex items-center gap-1.5 text-teal-600 font-bold uppercase tracking-widest text-[10px]">
                    <Users className="w-4 h-4" /> Step 3: Travel Type
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sora">What is your travel setup?</h2>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {(["Solo", "Couple", "Family", "Friends", "Corporate"] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setTravelerType(type);
                          // Auto advance on selection
                          setStep(4);
                        }}
                        className={`py-4 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-3 ${
                          travelerType === type 
                            ? "bg-teal-50 border-teal-500 text-teal-700 shadow-sm" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xl">
                          {type === "Solo" && "🎒"}
                          {type === "Couple" && "👩‍❤️‍👨"}
                          {type === "Family" && "👨‍👩‍👧‍👦"}
                          {type === "Friends" && "🏄‍♂️"}
                          {type === "Corporate" && "💼"}
                        </span>
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: DETAILED TRAVELER SPECIFICS */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 flex-1">
                  <div className="flex items-center gap-1.5 text-teal-600 font-bold uppercase tracking-widest text-[10px]">
                    <Users className="w-4 h-4" /> Step 4: Traveler Details
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sora">Configure traveler details</h2>

                  {travelerType === "Solo" && (
                    <div className="space-y-4 max-w-sm">
                      <p className="text-xs text-slate-600 font-medium">Solo Expedition (1 traveler)</p>
                      <div className="grid grid-cols-3 gap-2">
                        {(["unspecified", "male", "female"] as const).map(g => (
                          <button
                            key={g}
                            onClick={() => setSoloGender(g)}
                            className={`py-2.5 rounded-xl border text-xs font-bold transition-all capitalize ${
                              soloGender === g ? "bg-teal-50 border-teal-500 text-teal-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {travelerType === "Couple" && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <span>👩‍❤️‍👨</span> Romantic Getaway Confirmed
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">AI Assistant defaults this plan to 2 adults with private stay recommendations.</p>
                    </div>
                  )}

                  {travelerType === "Family" && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 max-w-md">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Family Members Count</p>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {/* Adults */}
                        <div className="space-y-1 text-center">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Adults</span>
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1.5 justify-between">
                            <button onClick={() => setAdultsCount(prev => Math.max(1, prev - 1))} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">-</button>
                            <span className="font-bold text-xs">{adultsCount}</span>
                            <button onClick={() => setAdultsCount(prev => prev + 1)} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">+</button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="space-y-1 text-center">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Kids</span>
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1.5 justify-between">
                            <button onClick={() => setChildrenCount(prev => Math.max(0, prev - 1))} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">-</button>
                            <span className="font-bold text-xs">{childrenCount}</span>
                            <button onClick={() => setChildrenCount(prev => prev + 1)} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">+</button>
                          </div>
                        </div>

                        {/* Seniors */}
                        <div className="space-y-1 text-center">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Seniors</span>
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1.5 justify-between">
                            <button onClick={() => setSeniorsCount(prev => Math.max(0, prev - 1))} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">-</button>
                            <span className="font-bold text-xs">{seniorsCount}</span>
                            <button onClick={() => setSeniorsCount(prev => prev + 1)} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {travelerType === "Friends" && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 max-w-md">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Group Demographics</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-center">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Boys</span>
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1.5 justify-between">
                            <button onClick={() => setBoysCount(prev => Math.max(0, prev - 1))} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">-</button>
                            <span className="font-bold text-xs">{boysCount}</span>
                            <button onClick={() => setBoysCount(prev => prev + 1)} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">+</button>
                          </div>
                        </div>

                        <div className="space-y-1 text-center">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Girls</span>
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1.5 justify-between">
                            <button onClick={() => setGirlsCount(prev => Math.max(0, prev - 1))} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">-</button>
                            <span className="font-bold text-xs">{girlsCount}</span>
                            <button onClick={() => setGirlsCount(prev => prev + 1)} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {travelerType === "Corporate" && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 max-w-md">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Corporate Attendees</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-center">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Male Delegates</span>
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1.5 justify-between">
                            <button onClick={() => setMaleCount(prev => Math.max(0, prev - 1))} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">-</button>
                            <span className="font-bold text-xs">{maleCount}</span>
                            <button onClick={() => setMaleCount(prev => prev + 1)} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">+</button>
                          </div>
                        </div>

                        <div className="space-y-1 text-center">
                          <span className="text-[9px] font-bold text-slate-500 uppercase">Female Delegates</span>
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1.5 justify-between">
                            <button onClick={() => setFemaleCount(prev => Math.max(0, prev - 1))} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">-</button>
                            <span className="font-bold text-xs">{femaleCount}</span>
                            <button onClick={() => setFemaleCount(prev => prev + 1)} className="w-5 h-5 rounded bg-slate-50 font-bold flex items-center justify-center text-xs">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 5: BUDGET RANGE */}
              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 flex-1">
                  <div className="flex items-center gap-1.5 text-teal-600 font-bold uppercase tracking-widest text-[10px]">
                    <Wallet className="w-4 h-4" /> Step 5: Budget Range
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sora">What is your target budget?</h2>

                  <div className="space-y-4 pt-2">
                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Estimated Limit</span>
                      <span className="text-3xl font-black text-teal-600 font-mono">₹{budgetValue.toLocaleString('en-IN')}+</span>
                    </div>

                    <input 
                      type="range" 
                      min="10000" 
                      max="200000" 
                      step="5000"
                      value={budgetValue} 
                      onChange={(e) => {
                        setBudgetValue(Number(e.target.value));
                        setCustomBudget("");
                        setCustomBudgetEnabled(false);
                      }}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />

                    {/* Presets markers */}
                    <div className="grid grid-cols-5 gap-2 pt-2 text-center text-[10px] font-bold text-slate-500">
                      <button onClick={() => { setBudgetValue(10000); setCustomBudgetEnabled(false); }} className="hover:text-teal-600">₹10,000+</button>
                      <button onClick={() => { setBudgetValue(25000); setCustomBudgetEnabled(false); }} className="hover:text-teal-600">₹25,000+</button>
                      <button onClick={() => { setBudgetValue(50000); setCustomBudgetEnabled(false); }} className="hover:text-teal-600">₹50,000+</button>
                      <button onClick={() => { setBudgetValue(100000); setCustomBudgetEnabled(false); }} className="hover:text-teal-600">₹1,00,000+</button>
                      <button 
                        onClick={() => setCustomBudgetEnabled(true)}
                        className={`hover:text-teal-600 font-extrabold ${customBudgetEnabled ? "text-teal-600 underline" : ""}`}
                      >
                        Custom
                      </button>
                    </div>

                    {customBudgetEnabled && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Enter Custom Amount (₹)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 75000"
                          value={customBudget}
                          onChange={(e) => {
                            setCustomBudget(e.target.value);
                            if (Number(e.target.value) > 0) {
                              setBudgetValue(Number(e.target.value));
                            }
                          }}
                          className="w-full max-w-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono text-[#0F172A] focus:outline-none focus:border-teal-500"
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 6: TRAVEL INTERESTS */}
              {step === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 flex-1">
                  <div className="flex items-center gap-1.5 text-teal-600 font-bold uppercase tracking-widest text-[10px]">
                    <Sparkles className="w-4 h-4" /> Step 6: Travel Interests
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sora">What are your travel interests?</h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {[
                      "Adventure", "Nature", "Luxury", "Food", "Culture", "Shopping", 
                      "Nightlife", "Photography", "Spiritual", "Workation", "Family Friendly"
                    ].map(pref => {
                      const isSelected = selectedPreferences.includes(pref);
                      return (
                        <button
                          key={pref}
                          onClick={() => handlePreferenceToggle(pref)}
                          className={`py-3 px-3 rounded-xl border text-[10px] font-bold transition-all ${
                            isSelected 
                              ? "bg-teal-50 border-teal-500 text-teal-700" 
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {pref}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 7: REVIEW SUMMARY */}
              {step === 7 && (
                <motion.div key="step7" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 flex-1">
                  <div className="flex items-center gap-1.5 text-teal-600 font-bold uppercase tracking-widest text-[10px]">
                    <Check className="w-4 h-4" /> Step 7: Review Summary
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sora">Verify your parameters</h2>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs font-semibold text-slate-600 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase">Destination</p>
                      <p className="text-[#0F172A] font-bold mt-0.5">{destination || "Goa, India"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase">Dates / Duration</p>
                      <p className="text-[#0F172A] font-bold mt-0.5">
                        {dateType === "fixed" && `${fromDate} to ${toDate}`}
                        {dateType === "flexible" && `${flexibleMonth} (${durationNights} Nights)`}
                        {dateType === "weekend" && `${weekendSelection} (2 Nights)`}
                        {dateType === "month" && `${planningMonth} Stay`}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase">Travelers Config</p>
                      <p className="text-[#0F172A] font-bold mt-0.5">{getTravelerSummary()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase">Est. Budget Limit</p>
                      <p className="text-[#0F172A] font-bold mt-0.5 font-mono">₹{budgetValue.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[9px] text-slate-400 font-extrabold uppercase">Travel Interests</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedPreferences.map(p => (
                          <span key={p} className="px-2 py-0.5 bg-teal-50 border border-teal-200 text-teal-700 text-[9px] font-bold rounded">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Footer Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                disabled={step === 1}
                className="text-slate-500 hover:text-slate-900 font-bold text-xs"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>

              <Button
                onClick={handleNextStep}
                className={`font-bold px-6 h-12 rounded-xl text-xs flex items-center gap-1.5 border-none transition-all ${
                  step === 7 
                    ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:scale-[1.02]" 
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {step === 7 ? (
                  <>Generate Itinerary <Sparkles className="w-3.5 h-3.5" /></>
                ) : (
                  <>Continue <ChevronRight className="w-4 h-4" /></>
                )}
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
