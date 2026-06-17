"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Wallet, Compass, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function GlassSearchCard() {
  const [destination, setDestination] = useState("");
  
  // Date states
  const [showDates, setShowDates] = useState(false);
  const [dateType, setDateType] = useState<"fixed" | "flexible">("fixed");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [flexOption, setFlexOption] = useState("This Month");
  const [flexRange, setFlexRange] = useState("±3 Days");
  
  // Travel Type states
  const [travelType, setTravelType] = useState("Couple / Romance");
  
  // Budget states
  const [showBudget, setShowBudget] = useState(false);
  const [budgetType, setBudgetType] = useState<"preset" | "custom">("preset");
  const [budgetPreset, setBudgetPreset] = useState("₹20k–50k");
  const [budgetCustom, setBudgetCustom] = useState("");

  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dates-trigger-container")) {
        setShowDates(false);
      }
      if (!target.closest(".budget-trigger-container")) {
        setShowBudget(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const getDateDisplayString = () => {
    if (dateType === "fixed") {
      if (fromDate && toDate) {
        return `${fromDate} to ${toDate}`;
      }
      return "Add dates";
    } else {
      return `Flexible: ${flexOption} (${flexRange})`;
    }
  };

  const getBudgetDisplayString = () => {
    if (budgetType === "preset") {
      return budgetPreset;
    } else {
      return budgetCustom ? `₹${Number(budgetCustom).toLocaleString()}` : "Set budget";
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save parameters to localStorage
    const params = {
      destination: destination || "Bali",
      dateType,
      fromDate,
      toDate,
      flexOption,
      flexRange,
      travelType,
      budgetType,
      budgetPreset,
      budgetCustom,
      dateDisplay: getDateDisplayString(),
      budgetDisplay: getBudgetDisplayString()
    };
    
    if (typeof window !== "undefined") {
      localStorage.setItem("temp_trip_params", JSON.stringify(params));
      
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        setShowLoginModal(true);
      } else {
        router.push("/plan");
      }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
    }
    setShowLoginModal(false);
    router.push("/plan");
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleGenerate} className="relative rounded-xl p-2 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 bg-black/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-30">
        
        {/* Input Group 1: Destination */}
        <div className="flex-1 flex items-center gap-4 px-6 py-4 rounded-lg hover:bg-white/5 transition-colors cursor-text group border-b lg:border-b-0 lg:border-r border-white/5">
          <MapPin className="text-primary w-5 h-5 group-hover:scale-105 transition-transform duration-300 shrink-0" />
          <div className="flex flex-col w-full text-left">
            <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1 font-sora">Where to?</span>
            <input 
              type="text" 
              placeholder="Goa, Bali, Kashmir..." 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder:text-white/30 text-base font-semibold w-full focus:placeholder:text-white/50 transition-colors font-sans"
            />
          </div>
        </div>
   
        {/* Input Group 2: Dates */}
        <div className="flex-1 relative dates-trigger-container">
          <div 
            onClick={() => {
              setShowDates(!showDates);
              setShowBudget(false);
            }}
            className="flex items-center gap-4 px-6 py-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group border-b lg:border-b-0 lg:border-r border-white/5 h-full"
          >
            <Calendar className="text-primary w-5 h-5 group-hover:scale-105 transition-transform duration-300 shrink-0" />
            <div className="flex flex-col w-full text-left">
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1 font-sora">When?</span>
              <span className={`text-base font-semibold font-sans truncate ${getDateDisplayString() === "Add dates" ? "text-white/30" : "text-white"}`}>
                {getDateDisplayString()}
              </span>
            </div>
          </div>

          {/* Dates Popover */}
          <AnimatePresence>
            {showDates && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-3 z-50 bg-[#0A0F1D]/98 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-2xl max-w-sm w-full text-left flex flex-col gap-4 text-white"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Travel Dates</span>
                  <button type="button" onClick={() => setShowDates(false)} className="text-xs text-white/50 hover:text-white">Close</button>
                </div>
                
                {/* Date Type Segments */}
                <div className="flex bg-white/5 rounded-lg p-1">
                  <button 
                    type="button"
                    onClick={() => setDateType("fixed")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${dateType === "fixed" ? "bg-primary text-white" : "text-white/60 hover:text-white"}`}
                  >
                    Fixed Dates
                  </button>
                  <button 
                    type="button"
                    onClick={() => setDateType("flexible")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${dateType === "flexible" ? "bg-primary text-white" : "text-white/60 hover:text-white"}`}
                  >
                    Flexible Dates
                  </button>
                </div>

                {dateType === "fixed" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">From</label>
                      <input 
                        type="date" 
                        className="bg-[#121824] border border-white/10 rounded-lg p-2.5 text-xs text-white w-full focus:outline-none focus:border-primary"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">To</label>
                      <input 
                        type="date" 
                        className="bg-[#121824] border border-white/10 rounded-lg p-2.5 text-xs text-white w-full focus:outline-none focus:border-primary"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">When?</label>
                      <div className="flex flex-wrap gap-2">
                        {["Any Weekend", "This Month", "Next Month"].map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => setFlexOption(opt)}
                            className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                              flexOption === opt ? "bg-teal-500/10 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">Flexibility</label>
                      <div className="flex gap-2">
                        {["±3 Days", "±7 Days"].map((range) => (
                          <button
                            type="button"
                            key={range}
                            onClick={() => setFlexRange(range)}
                            className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                              flexRange === range ? "bg-teal-500/10 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <Button type="button" onClick={() => setShowDates(false)} className="w-full bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg py-2 mt-2 border-none">
                  Apply Dates
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
   
        {/* Input Group 3: Travel Type */}
        <div className="flex-1 flex items-center gap-4 px-6 py-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group border-b lg:border-b-0 lg:border-r border-white/5">
          <Compass className="text-primary w-5 h-5 group-hover:scale-105 transition-transform duration-300 shrink-0" />
          <div className="flex flex-col w-full text-left">
            <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1 font-sora">Travel Type</span>
            <select 
              value={travelType}
              onChange={(e) => setTravelType(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-base font-semibold w-full cursor-pointer appearance-none font-sans focus:ring-0"
            >
              <option className="bg-[#020307] text-white">Couple / Romance</option>
              <option className="bg-[#020307] text-white">Family</option>
              <option className="bg-[#020307] text-white">Solo Backpacker</option>
              <option className="bg-[#020307] text-white">Luxury Resort</option>
            </select>
          </div>
        </div>

        {/* Input Group 4: Budget */}
        <div className="flex-1 relative budget-trigger-container">
          <div 
            onClick={() => {
              setShowBudget(!showBudget);
              setShowDates(false);
            }}
            className="flex items-center gap-4 px-6 py-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group h-full"
          >
            <Wallet className="text-primary w-5 h-5 group-hover:scale-105 transition-transform duration-300 shrink-0" />
            <div className="flex flex-col w-full text-left">
              <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1 font-sora">Budget</span>
              <span className={`text-base font-semibold font-sans truncate ${getBudgetDisplayString() === "Set budget" ? "text-white/30" : "text-white"}`}>
                {getBudgetDisplayString()}
              </span>
            </div>
          </div>

          {/* Budget Popover */}
          <AnimatePresence>
            {showBudget && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-3 z-50 bg-[#0A0F1D]/98 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-2xl max-w-sm w-full text-left flex flex-col gap-4 text-white"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Budget</span>
                  <button type="button" onClick={() => setShowBudget(false)} className="text-xs text-white/50 hover:text-white">Close</button>
                </div>

                <div className="flex bg-white/5 rounded-lg p-1">
                  <button 
                    type="button"
                    onClick={() => setBudgetType("preset")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${budgetType === "preset" ? "bg-primary text-white" : "text-white/60 hover:text-white"}`}
                  >
                    Presets
                  </button>
                  <button 
                    type="button"
                    onClick={() => setBudgetType("custom")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${budgetType === "custom" ? "bg-primary text-white" : "text-white/60 hover:text-white"}`}
                  >
                    Custom
                  </button>
                </div>

                {budgetType === "preset" ? (
                  <div className="grid grid-cols-2 gap-2">
                    {["₹10k–20k", "₹20k–50k", "₹50k–100k", "₹100k+"].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setBudgetPreset(preset)}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all text-center ${
                          budgetPreset === preset ? "bg-teal-500/10 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase">Amount (INR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                      <input 
                        type="number" 
                        className="bg-[#121824] border border-white/10 rounded-lg py-2.5 pl-7 pr-3 text-xs text-white w-full focus:outline-none focus:border-primary font-semibold"
                        placeholder="e.g. 25,000"
                        value={budgetCustom}
                        onChange={(e) => setBudgetCustom(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Button type="button" onClick={() => setShowBudget(false)} className="w-full bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg py-2 mt-2 border-none">
                  Apply Budget
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    
        {/* Action Button */}
        <div className="w-full lg:w-auto p-2">
          <Button 
            type="submit"
            size="lg" 
            className="w-full lg:w-auto h-14 px-8 rounded-lg bg-primary hover:bg-primary/95 text-white font-bold text-base shadow-[0_4px_20px_rgba(20,184,166,0.25)] hover:shadow-[0_4px_30px_rgba(20,184,166,0.4)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border-none font-sora shrink-0"
          >
            Generate Itinerary
          </Button>
        </div>
   
      </form>

      {/* Split Screen Login Modal Overlay (Mockup 2/4 design) */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark glass background overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Split Screen Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row min-h-[500px] relative z-10 text-slate-800"
            >
              {/* Close Button */}
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
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
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
                        type={showPassword ? "text" : "password"} 
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-medium pr-10"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 bottom-3.5 text-slate-400 hover:text-black"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-black hover:bg-black/90 text-white rounded-xl py-3 text-xs font-bold transition-all shadow-md mt-2 border-none h-11"
                    >
                      Continue
                    </Button>
                  </form>
                </div>

                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-bold mt-8 border-t border-slate-100 pt-4">
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
