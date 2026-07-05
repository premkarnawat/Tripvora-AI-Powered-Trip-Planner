"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Heart, Wallet, Compass, ChevronRight, ChevronLeft, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardPhaseProps {
  initialData: any;
  onComplete: (data: any) => void;
}

const INTERESTS = ["beaches", "nature", "temples", "heritage", "shopping", "nightlife", "photography", "adventure", "hidden gems", "cafes", "wildlife"];
const SPECIAL_PREFS = ["sunrise", "sunset", "photography", "low crowd", "luxury experiences", "adventure", "wellness"];
const HOTEL_PREFS = ["beachfront", "resort", "luxury", "family", "private", "city center"];
const TRANSPORT_PREFS = ["flight", "train", "bus", "cab", "self drive", "bike", "mixed"];

export function WizardPhase({ initialData, onComplete }: WizardPhaseProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    source: initialData?.source || "",
    destination: initialData?.destination || "",
    tripDates: { start: "", end: "" },
    arrival: { date: "", time: "10:00" },
    departure: { date: "", time: "18:00" },
    travelType: "couple",
    members: { adults: 2, boys: 0, girls: 0, children: 0, seniors: 0 },
    budget: 50000,
    comfort: "comfortable",
    pace: "balanced",
    interests: [] as string[],
    specialPreferences: [] as string[],
    transportPreference: [] as string[],
    foodPreference: "veg",
    hotelPreference: [] as string[]
  });

  const updateData = (key: string, value: any) => setData(prev => ({ ...prev, [key]: value }));
  const updateMember = (key: string, value: number) => setData(prev => ({ ...prev, members: { ...prev.members, [key]: Math.max(0, value) } }));
  const toggleArray = (key: 'interests' | 'specialPreferences' | 'transportPreference' | 'hotelPreference', value: string) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter(i => i !== value) : [...prev[key], value]
    }));
  };

  const nextStep = () => {
    if (step === 5) onComplete(data);
    else setStep(prev => Math.min(5, prev + 1));
  };
  const prevStep = () => setStep(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 pb-12 w-full">
      <div className="w-full max-w-4xl mb-12 relative z-10">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -z-10 -translate-y-1/2" />
          <div className="absolute left-0 top-1/2 h-0.5 bg-teal-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 4) * 100}%` }} />
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              step >= i ? "bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.5)]" : "bg-[#0F172A] border border-white/20 text-white/40"
            }`}>{i}</div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: LOGISTICS */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <div className="flex items-center gap-3 mb-6"><MapPin className="text-teal-400"/><span className="text-teal-400 font-bold uppercase">Step 1: Logistics</span></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-bold text-white/50 block mb-2 uppercase">Source City</label>
                  <input type="text" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-teal-500" value={data.source} onChange={(e) => updateData('source', e.target.value)} placeholder="e.g. Mumbai" />
                </div>
                <div>
                  <label className="text-sm font-bold text-white/50 block mb-2 uppercase">Destination</label>
                  <input type="text" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-teal-500" value={data.destination} onChange={(e) => updateData('destination', e.target.value)} placeholder="e.g. Goa" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-bold text-white/50 block mb-2 uppercase">Arrival Date</label>
                    <input type="date" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-teal-500 [&::-webkit-calendar-picker-indicator]:invert" value={data.arrival.date} onChange={(e) => updateData('arrival', {...data.arrival, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white/50 block mb-2 uppercase">Time</label>
                    <input type="time" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-teal-500 [&::-webkit-calendar-picker-indicator]:invert" value={data.arrival.time} onChange={(e) => updateData('arrival', {...data.arrival, time: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-bold text-white/50 block mb-2 uppercase">Departure Date</label>
                    <input type="date" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-teal-500 [&::-webkit-calendar-picker-indicator]:invert" value={data.departure.date} onChange={(e) => updateData('departure', {...data.departure, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white/50 block mb-2 uppercase">Time</label>
                    <input type="time" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-teal-500 [&::-webkit-calendar-picker-indicator]:invert" value={data.departure.time} onChange={(e) => updateData('departure', {...data.departure, time: e.target.value})} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CREW */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <div className="flex items-center gap-3 mb-6"><Users className="text-teal-400"/><span className="text-teal-400 font-bold uppercase">Step 2: The Crew</span></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {["solo", "couple", "family", "friends", "bachelor", "corporate", "senior"].map(type => (
                  <button key={type} onClick={() => updateData("travelType", type)} className={`py-3 rounded-xl border font-bold capitalize transition-all ${data.travelType === type ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70"}`}>{type}</button>
                ))}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white/50 uppercase mb-4">Detailed Group Composition</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {["adults", "boys", "girls", "children", "seniors"].map(key => (
                    <div key={key} className="flex flex-col gap-2">
                      <label className="text-xs text-white/60 font-bold capitalize">{key}</label>
                      <div className="flex items-center gap-2 bg-[#0A0F1D] rounded-lg p-2 border border-white/10">
                        <button onClick={() => updateMember(key, data.members[key as keyof typeof data.members] - 1)} className="w-8 h-8 bg-white/5 rounded text-white font-bold">-</button>
                        <span className="flex-1 text-center font-bold">{data.members[key as keyof typeof data.members]}</span>
                        <button onClick={() => updateMember(key, data.members[key as keyof typeof data.members] + 1)} className="w-8 h-8 bg-white/5 rounded text-white font-bold">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: VIBE */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <div className="flex items-center gap-3 mb-6"><Wallet className="text-teal-400"/><span className="text-teal-400 font-bold uppercase">Step 3: The Vibe</span></div>
              <div className="mb-8">
                <label className="text-sm font-bold text-white/50 block mb-2 uppercase">Total Budget (INR)</label>
                <input type="number" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-2xl font-bold text-white focus:border-teal-500" value={data.budget} onChange={(e) => updateData('budget', Number(e.target.value))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-sm font-bold text-white/50 block mb-4 uppercase">Comfort Level</label>
                  <div className="flex flex-col gap-2">
                    {["budget", "comfortable", "luxury"].map(opt => (
                      <button key={opt} onClick={() => updateData("comfort", opt)} className={`py-3 px-4 rounded-xl border text-left font-bold capitalize transition-all ${data.comfort === opt ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70"}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-white/50 block mb-4 uppercase">Travel Pace</label>
                  <div className="flex flex-col gap-2">
                    {["slow", "balanced", "fast"].map(opt => (
                      <button key={opt} onClick={() => updateData("pace", opt)} className={`py-3 px-4 rounded-xl border text-left font-bold capitalize transition-all ${data.pace === opt ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70"}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: INTERESTS */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <div className="flex items-center gap-3 mb-6"><Heart className="text-teal-400"/><span className="text-teal-400 font-bold uppercase">Step 4: Personalization</span></div>
              
              <label className="text-sm font-bold text-white/50 block mb-4 uppercase">What do you want to explore? (Interests)</label>
              <div className="flex flex-wrap gap-2 mb-8">
                {INTERESTS.map(int => (
                  <button key={int} onClick={() => toggleArray("interests", int)} className={`py-2 px-4 rounded-full border text-sm font-bold capitalize transition-all flex items-center gap-2 ${data.interests.includes(int) ? "bg-teal-500 border-teal-500 text-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                    {int} {data.interests.includes(int) && <Check className="w-4 h-4"/>}
                  </button>
                ))}
              </div>

              <label className="text-sm font-bold text-white/50 block mb-4 uppercase">Special Experiences</label>
              <div className="flex flex-wrap gap-2">
                {SPECIAL_PREFS.map(pref => (
                  <button key={pref} onClick={() => toggleArray("specialPreferences", pref)} className={`py-2 px-4 rounded-full border text-sm font-bold capitalize transition-all flex items-center gap-2 ${data.specialPreferences.includes(pref) ? "bg-blue-500 border-blue-500 text-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                    {pref} {data.specialPreferences.includes(pref) && <Check className="w-4 h-4"/>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: DETAILS */}
          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
              <div className="flex items-center gap-3 mb-6"><Compass className="text-teal-400"/><span className="text-teal-400 font-bold uppercase">Step 5: Fine Details</span></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-sm font-bold text-white/50 block mb-4 uppercase">Food Preference</label>
                  <div className="flex flex-wrap gap-2">
                    {["veg", "nonveg", "jain", "vegan", "halal"].map(food => (
                      <button key={food} onClick={() => updateData("foodPreference", food)} className={`py-2 px-4 rounded-xl border text-sm font-bold capitalize transition-all ${data.foodPreference === food ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70"}`}>{food}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-white/50 block mb-4 uppercase">Transport Preference</label>
                  <div className="flex flex-wrap gap-2">
                    {TRANSPORT_PREFS.map(trans => (
                      <button key={trans} onClick={() => toggleArray("transportPreference", trans)} className={`py-2 px-4 rounded-xl border text-sm font-bold capitalize transition-all ${data.transportPreference.includes(trans) ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70"}`}>{trans}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <label className="text-sm font-bold text-white/50 block mb-4 uppercase">Hotel Preference</label>
                <div className="flex flex-wrap gap-2">
                  {HOTEL_PREFS.map(hotel => (
                    <button key={hotel} onClick={() => toggleArray("hotelPreference", hotel)} className={`py-2 px-4 rounded-xl border text-sm font-bold capitalize transition-all ${data.hotelPreference.includes(hotel) ? "bg-teal-500/20 border-teal-500 text-teal-300" : "bg-white/5 border-white/10 text-white/70"}`}>{hotel}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <div className="mt-auto pt-8 border-t border-white/10 flex justify-between items-center">
          <Button variant="ghost" onClick={prevStep} disabled={step === 1} className="text-white hover:bg-white/10 font-bold"><ChevronLeft className="w-5 h-5 mr-1" /> Back</Button>
          <Button onClick={nextStep} className={`font-bold px-8 h-14 rounded-xl transition-all border-none ${step === 5 ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:scale-105" : "bg-white text-black hover:bg-white/90"}`}>
            {step === 5 ? <span className="flex items-center gap-2">Generate Smart Itinerary <Sparkles className="w-4 h-4" /></span> : <span className="flex items-center">Continue <ChevronRight className="w-5 h-5 ml-1" /></span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
