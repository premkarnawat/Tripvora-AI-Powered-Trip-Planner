"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Calendar, Wallet, Bed, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardPhaseProps {
  initialData: any;
  onComplete: (data: any) => void;
}

export function WizardPhase({ initialData, onComplete }: WizardPhaseProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    destination: initialData?.destination || "",
    travelType: initialData?.travelType || "Couple",
    members: { adults: 2, children: 0, seniors: 0, boys: 0, girls: 0, male: 0, female: 0, total: 2 },
    dateType: initialData?.dateType || "fixed",
    fromDate: initialData?.fromDate || "",
    toDate: initialData?.toDate || "",
    flexOption: initialData?.flexOption || "This Month",
    flexRange: initialData?.flexRange || "±3 Days",
    budgetType: initialData?.budgetType || "preset",
    budgetAmount: initialData?.budgetCustom || 50000,
    hotelStar: "5-Star",
    stayType: "Resort"
  });

  const updateData = (key: string, value: any) => setData(prev => ({ ...prev, [key]: value }));
  const updateMember = (key: string, value: number) => setData(prev => ({ ...prev, members: { ...prev.members, [key]: Math.max(0, value) } }));

  const nextStep = () => {
    if (step === 5) {
      onComplete(data);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 pb-12 w-full">
      {/* Step Indicator */}
      <div className="w-full max-w-3xl mb-12 relative z-10">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -z-10 -translate-y-1/2" />
          <div 
            className="absolute left-0 top-1/2 h-0.5 bg-teal-500 -z-10 -translate-y-1/2 transition-all duration-500" 
            style={{ width: `${((step - 1) / 4) * 100}%` }} 
          />
          
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              step >= i ? "bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.5)]" : "bg-[#0F172A] border border-white/20 text-white/40"
            }`}>
              {i}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: DESTINATION */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-teal-400 w-6 h-6" />
                <span className="text-teal-400 font-bold uppercase tracking-widest text-sm">Step 1</span>
              </div>
              <h2 className="text-3xl font-bold text-white font-sora mb-6">Where are you heading?</h2>
              
              <input 
                type="text" 
                placeholder="Search destination (e.g., Bali, Paris, Tokyo)..."
                className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-lg text-white focus:outline-none focus:border-teal-500 transition-colors mb-8"
                value={data.destination}
                onChange={(e) => updateData("destination", e.target.value)}
                autoFocus
              />
              
              <p className="text-sm font-bold text-white/50 mb-4 uppercase tracking-widest">Popular Destinations</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Bali", "Dubai", "Goa", "Maldives", "Paris", "Tokyo", "London", "Rome"].map(dest => (
                  <button 
                    key={dest} 
                    onClick={() => updateData("destination", dest)}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                      data.destination === dest ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: TRAVEL TYPE */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-teal-400 w-6 h-6" />
                <span className="text-teal-400 font-bold uppercase tracking-widest text-sm">Step 2</span>
              </div>
              <h2 className="text-3xl font-bold text-white font-sora mb-6">Who is traveling?</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {["Solo", "Couple", "Family", "Group", "Corporate"].map(type => (
                  <button 
                    key={type} 
                    onClick={() => updateData("travelType", type)}
                    className={`py-4 rounded-xl border font-bold transition-all ${
                      data.travelType === type ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Dynamic Fields based on selection */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Traveler Details</h3>
                
                {data.travelType === "Solo" && <p className="text-white/80 font-semibold">Awesome! A solo adventure awaits. We'll find the best hostels and safe zones.</p>}
                
                {data.travelType === "Couple" && <p className="text-white/80 font-semibold">Perfect! A romantic getaway. We'll prioritize private resorts and romantic dinners.</p>}
                
                {data.travelType === "Family" && (
                  <div className="grid grid-cols-3 gap-4">
                    {["adults", "children", "seniors"].map(key => (
                      <div key={key} className="flex flex-col gap-2">
                        <label className="text-xs text-white/60 font-bold capitalize">{key}</label>
                        <div className="flex items-center gap-3 bg-[#0A0F1D] rounded-lg p-2 border border-white/10">
                          <button onClick={() => updateMember(key, data.members[key as keyof typeof data.members] - 1)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded text-white">-</button>
                          <span className="flex-1 text-center font-bold">{data.members[key as keyof typeof data.members]}</span>
                          <button onClick={() => updateMember(key, data.members[key as keyof typeof data.members] + 1)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded text-white">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {data.travelType === "Group" && (
                  <div className="grid grid-cols-3 gap-4">
                    {["total", "boys", "girls"].map(key => (
                      <div key={key} className="flex flex-col gap-2">
                        <label className="text-xs text-white/60 font-bold capitalize">{key}</label>
                        <div className="flex items-center gap-3 bg-[#0A0F1D] rounded-lg p-2 border border-white/10">
                          <button onClick={() => updateMember(key, data.members[key as keyof typeof data.members] - 1)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded text-white">-</button>
                          <span className="flex-1 text-center font-bold">{data.members[key as keyof typeof data.members]}</span>
                          <button onClick={() => updateMember(key, data.members[key as keyof typeof data.members] + 1)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded text-white">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {data.travelType === "Corporate" && (
                  <div className="grid grid-cols-3 gap-4">
                    {["total", "male", "female"].map(key => (
                      <div key={key} className="flex flex-col gap-2">
                        <label className="text-xs text-white/60 font-bold capitalize">{key}</label>
                        <div className="flex items-center gap-3 bg-[#0A0F1D] rounded-lg p-2 border border-white/10">
                          <button onClick={() => updateMember(key, data.members[key as keyof typeof data.members] - 1)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded text-white">-</button>
                          <span className="flex-1 text-center font-bold">{data.members[key as keyof typeof data.members]}</span>
                          <button onClick={() => updateMember(key, data.members[key as keyof typeof data.members] + 1)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded text-white">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: DATES */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-teal-400 w-6 h-6" />
                <span className="text-teal-400 font-bold uppercase tracking-widest text-sm">Step 3</span>
              </div>
              <h2 className="text-3xl font-bold text-white font-sora mb-6">When are you going?</h2>
              
              <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
                <button onClick={() => updateData("dateType", "fixed")} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${data.dateType === "fixed" ? "bg-teal-500 text-white" : "text-white/60 hover:text-white"}`}>Fixed Dates</button>
                <button onClick={() => updateData("dateType", "flexible")} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${data.dateType === "flexible" ? "bg-teal-500 text-white" : "text-white/60 hover:text-white"}`}>Flexible Dates</button>
              </div>

              {data.dateType === "fixed" ? (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-white/50 block mb-2 uppercase tracking-widest">From</label>
                    <input type="date" value={data.fromDate} onChange={(e) => updateData("fromDate", e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-teal-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white/50 block mb-2 uppercase tracking-widest">To</label>
                    <input type="date" value={data.toDate} onChange={(e) => updateData("toDate", e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-teal-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-white/50 block mb-3 uppercase tracking-widest">General Timeframe</label>
                    <div className="flex flex-wrap gap-3">
                      {["This Month", "Next Month", "In 2 Months", "Any Weekend"].map(opt => (
                        <button key={opt} onClick={() => updateData("flexOption", opt)} className={`py-3 px-6 rounded-xl border text-sm font-bold transition-all ${data.flexOption === opt ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white/50 block mb-3 uppercase tracking-widest">Flexibility</label>
                    <div className="flex flex-wrap gap-3">
                      {["±3 Days", "±7 Days", "Exact only"].map(opt => (
                        <button key={opt} onClick={() => updateData("flexRange", opt)} className={`py-3 px-6 rounded-xl border text-sm font-bold transition-all ${data.flexRange === opt ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: BUDGET */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="text-teal-400 w-6 h-6" />
                <span className="text-teal-400 font-bold uppercase tracking-widest text-sm">Step 4</span>
              </div>
              <h2 className="text-3xl font-bold text-white font-sora mb-6">What is your total budget?</h2>
              
              <div className="relative mb-8">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-white/50 font-bold">₹</span>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/20 rounded-2xl pl-14 pr-6 py-5 text-3xl font-bold text-white focus:outline-none focus:border-teal-500 transition-colors"
                  value={data.budgetAmount}
                  onChange={(e) => updateData("budgetAmount", Number(e.target.value))}
                />
              </div>

              <p className="text-sm font-bold text-white/50 mb-4 uppercase tracking-widest">Quick Presets (INR)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[25000, 50000, 100000, 250000].map(amt => (
                  <button 
                    key={amt} 
                    onClick={() => updateData("budgetAmount", amt)}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                      data.budgetAmount === amt ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    ₹{(amt/1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: STAY PREFERENCES */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Bed className="text-teal-400 w-6 h-6" />
                <span className="text-teal-400 font-bold uppercase tracking-widest text-sm">Step 5</span>
              </div>
              <h2 className="text-3xl font-bold text-white font-sora mb-6">Where do you want to stay?</h2>
              
              <div className="space-y-8">
                <div>
                  <label className="text-sm font-bold text-white/50 block mb-4 uppercase tracking-widest">Hotel Standard</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["3-Star", "4-Star", "5-Star", "Ultra Luxury"].map(star => (
                      <button 
                        key={star} 
                        onClick={() => updateData("hotelStar", star)}
                        className={`py-4 rounded-xl border font-bold transition-all ${
                          data.hotelStar === star ? "bg-teal-500/20 border-teal-500 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-white/50 block mb-4 uppercase tracking-widest">Property Type</label>
                  <div className="flex flex-wrap gap-3">
                    {["Hotel", "Resort", "Villa", "Homestay", "Hostel"].map(type => (
                      <button 
                        key={type} 
                        onClick={() => updateData("stayType", type)}
                        className={`py-3 px-6 rounded-xl border text-sm font-bold transition-all ${
                          data.stayType === type ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="mt-auto pt-8 border-t border-white/10 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={step === 1}
            className="text-white hover:bg-white/10 font-bold w-full md:w-auto"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Back
          </Button>
          
          <Button 
            onClick={nextStep}
            className={`font-bold px-4 md:px-8 h-14 w-full md:w-auto rounded-xl transition-all border-none ${
              step === 5 ? "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:scale-105" : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {step === 5 ? (
              <span className="flex items-center gap-2">Generate Smart Itinerary <Sparkles className="w-4 h-4" /></span>
            ) : (
              <span className="flex items-center">Continue <ChevronRight className="w-5 h-5 ml-1" /></span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
