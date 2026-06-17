"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Search, Compass, Mountain, Umbrella, ArrowLeft, 
  User, Users, Users2, Building2, Calendar, 
  Wallet, Hotel, ShieldCheck, Eye, EyeOff, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlanPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  
  // Selection states
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [budgetVal, setBudgetVal] = useState(25000);
  const [selectedStay, setSelectedStay] = useState("");
  
  // Auth state simulation
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const stepsList = [
    { id: 1, name: "DESTINATION" },
    { id: 2, name: "GROUP" },
    { id: 3, name: "DATES" },
    { id: 4, name: "BUDGET" },
    { id: 5, name: "STAY" }
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Last step: check authentication
      if (!isLoggedIn) {
        setShowLoginModal(true);
      } else {
        generateTrip();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const generateTrip = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Redirect to the dynamic itinerary page
      router.push("/trips/bali-luxury-vacation");
    }, 2500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginModal(false);
    generateTrip();
  };

  return (
    <div 
      className="min-h-screen pt-28 pb-16 flex flex-col justify-between font-sans transition-colors relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #E6F7F5 0%, #F0F4F8 50%, #E8F0F8 100%)"
      }}
    >
      {/* Dynamic ambient background details */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-teal-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1000px] w-full mx-auto px-4 md:px-8 relative z-10 flex-1 flex flex-col justify-center my-6">
        
        {/* Main Title & Subtitle */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-black tracking-tight font-sora mb-3"
          >
            Create Your Journey
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-sm md:text-base font-medium max-w-lg mx-auto"
          >
            Tell our AI concierge about your vision, and we'll craft the perfect itinerary.
          </motion.p>
        </div>

        {/* Mockup Progress Bars */}
        <div className="max-w-2xl mx-auto w-full mb-12">
          <div className="grid grid-cols-5 gap-3 md:gap-6">
            {stepsList.map((s) => {
              const active = step >= s.id;
              const current = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center">
                  <div 
                    className={`w-full h-[6px] rounded-full transition-all duration-500 ${
                      active ? 'bg-teal-500 shadow-[0_2px_4px_rgba(20,184,166,0.3)]' : 'bg-slate-300'
                    }`} 
                  />
                  <span 
                    className={`text-[9px] md:text-[10px] tracking-widest font-black mt-3 transition-colors ${
                      current ? 'text-teal-600' : 'text-slate-400'
                    }`}
                  >
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Component */}
        <div className="max-w-3xl mx-auto w-full bg-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_60px_rgba(15,23,42,0.06)] border border-slate-100/50 min-h-[420px] flex flex-col justify-between relative">
          
          {/* Back Button */}
          {step > 1 && (
            <button 
              onClick={handleBack}
              className="absolute top-6 left-6 text-slate-400 hover:text-black flex items-center gap-1 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-center"
            >
              {/* STEP 1: DESTINATION */}
              {step === 1 && (
                <div>
                  <h2 className="text-3xl font-bold text-black font-sora mb-2">Where to?</h2>
                  <p className="text-slate-500 text-sm mb-8">Enter a city, country, or even a mood like "somewhere tropical".</p>
                  
                  {/* Search Bar */}
                  <div className="relative mb-8">
                    <Search className="w-5 h-5 text-slate-400 absolute left-5 top-4" />
                    <input 
                      type="text" 
                      placeholder="Search destinations..."
                      value={searchVal || selectedDestination}
                      onChange={(e) => {
                        setSearchVal(e.target.value);
                        setSelectedDestination(e.target.value);
                      }}
                      className="w-full bg-slate-50 border border-slate-100 rounded-full py-4 pl-14 pr-6 text-slate-800 text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  {/* Suggestion Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { name: "Kyoto, Japan", icon: Compass },
                      { name: "Swiss Alps", icon: Mountain },
                      { name: "Amalfi Coast", icon: Umbrella }
                    ].map((dest) => {
                      const DestIcon = dest.icon;
                      const isSelected = selectedDestination === dest.name;
                      return (
                        <div 
                          key={dest.name} 
                          onClick={() => {
                            setSelectedDestination(dest.name);
                            setSearchVal(dest.name);
                          }}
                          className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border ${
                            isSelected 
                              ? 'bg-teal-50/70 border-teal-500 text-teal-700 shadow-sm' 
                              : 'bg-slate-50/50 border-slate-100 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                            <DestIcon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold">{dest.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: GROUP */}
              {step === 2 && (
                <div>
                  <h2 className="text-3xl font-bold text-black font-sora mb-2">Who's traveling?</h2>
                  <p className="text-slate-500 text-sm mb-8">Select your travel party composition.</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { name: "Solo", icon: User },
                      { name: "Couple", icon: Users },
                      { name: "Family", icon: Users2 },
                      { name: "Friends", icon: Users2 },
                      { name: "Corporate", icon: Building2 }
                    ].map((g) => {
                      const IconComp = g.icon;
                      const isSelected = selectedGroup === g.name;
                      return (
                        <div 
                          key={g.name}
                          onClick={() => setSelectedGroup(g.name)}
                          className={`flex flex-col items-center justify-center p-5 rounded-2xl cursor-pointer transition-all border text-center ${
                            isSelected 
                              ? 'bg-teal-50/70 border-teal-500 text-teal-700 shadow-sm' 
                              : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <IconComp className="w-6 h-6 mb-3 opacity-80" />
                          <span className="text-xs font-bold uppercase tracking-wider">{g.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: DATES */}
              {step === 3 && (
                <div>
                  <h2 className="text-3xl font-bold text-black font-sora mb-2">When and for how long?</h2>
                  <p className="text-slate-500 text-sm mb-6">Specify your trip duration and preferred month.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-3">Duration</h4>
                      <div className="grid grid-cols-4 gap-3">
                        {["2 Days", "3 Days", "5 Days", "7+ Days"].map((d) => {
                          const isSelected = selectedDuration === d;
                          return (
                            <button
                              key={d}
                              onClick={() => setSelectedDuration(d)}
                              className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                                isSelected 
                                  ? 'bg-teal-50/70 border-teal-500 text-teal-700 font-bold' 
                                  : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-3">Preferred Travel Month</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => {
                          const isSelected = selectedMonth === m;
                          return (
                            <button
                              key={m}
                              onClick={() => setSelectedMonth(m)}
                              className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                                isSelected 
                                  ? 'bg-teal-50/70 border-teal-500 text-teal-700 font-bold' 
                                  : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: BUDGET */}
              {step === 4 && (
                <div>
                  <h2 className="text-3xl font-bold text-black font-sora mb-2">Set your budget</h2>
                  <p className="text-slate-500 text-sm mb-8">Slide to adjust your average budget per person.</p>
                  
                  <div className="py-8 px-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-center mb-6">
                    <span className="text-xs font-black text-slate-400 tracking-widest uppercase block mb-1">Estimated Budget</span>
                    <span className="text-4xl font-extrabold text-black font-sora">₹{budgetVal.toLocaleString()}</span>
                  </div>

                  <input 
                    type="range" 
                    min={5000} 
                    max={100000} 
                    step={5000} 
                    value={budgetVal}
                    onChange={(e) => setBudgetVal(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-bold mt-3 px-1">
                    <span>₹5,000</span>
                    <span>₹50,000</span>
                    <span>₹1,00,000+</span>
                  </div>
                </div>
              )}

              {/* STEP 5: STAY */}
              {step === 5 && (
                <div>
                  <h2 className="text-3xl font-bold text-black font-sora mb-2">Accommodation tier</h2>
                  <p className="text-slate-500 text-sm mb-8">What level of comfort fits your vision?</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {[
                      { name: "Budget", desc: "Simple clean stays", price: "₹" },
                      { name: "Standard", desc: "Cozy 3-star hotels", price: "₹₹" },
                      { name: "Premium", desc: "Upscale 4-star boutique", price: "₹₹₹" },
                      { name: "Luxury", desc: "Unmatched 5-star villas", price: "₹₹₹₹" }
                    ].map((stay) => {
                      const isSelected = selectedStay === stay.name;
                      return (
                        <div 
                          key={stay.name}
                          onClick={() => setSelectedStay(stay.name)}
                          className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between h-36 ${
                            isSelected 
                              ? 'bg-teal-50/70 border-teal-500 text-teal-700 shadow-sm' 
                              : 'bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold text-teal-600 block mb-1">{stay.price}</span>
                            <h4 className="text-base font-bold text-black leading-tight mb-1">{stay.name}</h4>
                          </div>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">{stay.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-end items-center mt-8 pt-6 border-t border-slate-100">
            <Button 
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedDestination) ||
                (step === 2 && !selectedGroup) ||
                (step === 3 && (!selectedDuration || !selectedMonth)) ||
                (step === 5 && !selectedStay)
              }
              className="bg-black hover:bg-black/90 text-white rounded-full px-10 h-12 text-sm font-bold shadow-lg shadow-black/10 active:scale-95 transition-all"
            >
              {step === 5 ? "Generate Journey" : "Next Step"}
            </Button>
          </div>
        </div>

      </div>

      {/* Generating Overlay State */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#04060E]/95 backdrop-blur-md flex flex-col items-center justify-center text-center px-4"
          >
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-teal-500/10 border-t-teal-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-teal-400 animate-pulse" />
              </div>
            </div>
            <motion.h3 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-2xl font-bold text-white font-sora mb-2"
            >
              Generating Your Bespoke Itinerary
            </motion.h3>
            <p className="text-white/40 text-sm max-w-sm">
              Our AI travel planner is tailoring flights, hotels, restaurants, and daily routes for {selectedDestination}...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Authentic Mockup Login Modal (Interception) */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark glass background */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Split Screen Modal (based on mockup 2) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row min-h-[500px] relative z-10"
            >
              {/* Left Column: Deep Navy */}
              <div 
                className="w-full md:w-[42%] bg-[#0B1329] p-8 md:p-10 text-white flex flex-col justify-between relative"
                style={{
                  backgroundImage: "radial-gradient(circle at 10% 10%, rgba(20, 184, 166, 0.15), transparent 60%)"
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-16">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M2 22L12 2L22 22H2Z" fill="currentColor" fillOpacity="0.8"/>
                      <path d="M12 2L2 22H12V2Z" fill="#14B8A6"/>
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
              <div className="flex-1 bg-white p-8 md:p-12 flex flex-col justify-between text-slate-800">
                <div className="w-full">
                  <h3 className="text-2xl font-black text-black tracking-tight mb-2">Welcome Back</h3>
                  <p className="text-slate-500 text-xs mb-6 font-medium">Sign in to access your bespoke travel itineraries.</p>
                  
                  {/* Tabs */}
                  <div className="flex border-b border-slate-100 mb-6">
                    <button className="flex-1 text-center py-2 text-xs font-bold text-black border-b-2 border-black">
                      Login
                    </button>
                    <button className="flex-1 text-center py-2 text-xs font-bold text-slate-400">
                      Sign Up
                    </button>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Google Login */}
                    <button 
                      type="button"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
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
                      className="w-full bg-black hover:bg-black/90 text-white rounded-xl py-3 text-xs font-bold transition-all shadow-md mt-2 border-none"
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

      {/* Footer */}
      <footer className="max-w-[1000px] w-full mx-auto px-4 md:px-8 border-t border-slate-200/50 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] font-bold text-slate-400 gap-4 mt-6">
        <span>&copy; 2024 TripPilot Global. All rights reserved.</span>
        <div className="flex gap-6">
          <span className="hover:text-black cursor-pointer">Privacy</span>
          <span className="hover:text-black cursor-pointer">Terms</span>
          <span className="hover:text-black cursor-pointer">Cookie Policy</span>
          <span className="hover:text-black cursor-pointer">Sustainability</span>
        </div>
      </footer>
    </div>
  );
}
