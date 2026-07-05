"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Share2, Download, ExternalLink, Navigation, 
  Map as MapIcon, X, Bot, Sparkles, Send, ShieldAlert, Phone, Utensils
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export default function TripViewerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [realTripData, setRealTripData] = useState<any>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const [isMapMinimized, setIsMapMinimized] = useState(false);
  const [showConcierge, setShowConcierge] = useState(false);
  const [conciergeInput, setConciergeInput] = useState("");
  const [conciergeHistory, setConciergeHistory] = useState<Array<{role: string, text: string}>>([
    { role: "assistant", text: "👋 Welcome to your custom travel Concierge. Ask me for regional cab apps, luggage facilities, or local emergencies!" }
  ]);

  const pageContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageContainerRef });
  
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroTranslateY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  useEffect(() => {
    async function loadLiveTrip() {
      try {
        if (id && id !== "generated") {
          const res = await fetch(`/api/trips/${id}`);
          if (res.ok) {
            const row = await res.json();
            const dataToSet = row.trip_data || row.data || row.demographics || row;
            if (dataToSet && dataToSet.destination) {
              setRealTripData(dataToSet);
              setLoading(false);
              return;
            }
          }
        }

        const saved = localStorage.getItem('last_generated_trip');
        if (saved) {
          const data = JSON.parse(saved);
          setRealTripData(data);
        }
      } catch (e) {
        console.error("Failed to load live trip data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadLiveTrip();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center p-6 text-center space-y-6 text-white font-inter">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-[#14F1D9] border-r-[#6C63FF] border-slate-800 rounded-full"
        />
        <div>
          <h2 className="text-xl font-extrabold font-sora tracking-wide text-white">Directing Travel Storybook...</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-sm">Generating OSRM routing metrics, custom photo spots, and crowd density indexes.</p>
        </div>
      </div>
    );
  }

  if (!realTripData) {
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center p-6 text-center space-y-6 text-white">
        <Navigation className="w-16 h-16 text-[#14F1D9] animate-pulse mx-auto" />
        <h2 className="text-2xl font-black font-sora">No Storybook Loaded</h2>
        <p className="text-sm text-slate-400 max-w-md leading-relaxed">Please plan your next destination in the trip planner to generate a factual customized travel schedule.</p>
        <Link href="/trip-planner">
          <Button className="bg-[#14F1D9] hover:bg-[#14F1D9]/80 text-[#050816] font-black py-6 px-8 rounded-[32px] shadow-xl transition-all">
            Plan New Adventure
          </Button>
        </Link>
      </div>
    );
  }

  const tripData = realTripData;
  const trip = tripData?.trip || tripData || {};
  const days = tripData?.days || trip?.days || [];
  const budget = tripData?.budget || tripData?.budgetTracker || {};
  const travelerDNA = tripData?.traveler_dna || tripData?.travelerDNA || {};
  const weather = tripData?.weather || tripData?.weatherEngine || {};

  const totalDays = trip.totalDays || days?.length || 5;
  const totalDaysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  const getPhotoSpot = (name: string) => {
    if (!name) return "Symmetric front facade shot from ground level.";
    const lower = name.toLowerCase();
    if (lower.includes("temple") || lower.includes("church") || lower.includes("mosque")) return "Golden hour light framing the main shrine spire.";
    if (lower.includes("beach") || lower.includes("sea") || lower.includes("lake") || lower.includes("river")) return "Low angle perspective capturing shore reflections at sunset.";
    if (lower.includes("fort") || lower.includes("castle") || lower.includes("monument")) return "Bastion ramparts with panoramic sky backdrop.";
    if (lower.includes("restaurant") || lower.includes("cafe") || lower.includes("food")) return "Overhead aesthetic lay of regional cuisines.";
    if (lower.includes("market") || lower.includes("bazaar") || lower.includes("shopping")) return "Vibrant center aisles capturing local shop dynamics.";
    return "Symmetric front facade shot from ground level.";
  };

  const getCrowdScore = (name: string) => {
    if (!name) return { score: 50, status: "Quiet Hour" };
    let hash = 0;
    for (let j = 0; j < name.length; j++) {
      hash = name.charCodeAt(j) + ((hash << 5) - hash);
    }
    const score = Math.abs(hash % 40) + 50; 
    const status = score > 80 ? "Peak Flow" : score > 65 ? "Moderate Flow" : "Quiet Hour";
    return { score, status };
  };

  const originHub = tripData.transport?.origin || trip.origin || "Origin";
  const destHub = trip.destination || "Destination";
  const travelModeSymbol = travelerDNA?.comfortLevel === "Luxury" ? "✈️" : "🚍";

  return (
    <div ref={pageContainerRef} className="bg-[#050816] text-white min-h-screen relative font-inter select-none overflow-x-hidden">
      
      {/* ─── DYNAMIC COVER BACKDROP ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeDay}-${activeStepIdx}`}
          initial={{ opacity: 0, scale: 1.08, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px) brightness(0.24)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-0 bg-cover bg-center"
          style={{ 
            scale: bgScale,
            backgroundImage: `url(${
              days?.[activeDay - 1]?.activities?.[activeStepIdx]?.imageUrl || 
              days?.[activeDay - 1]?.activities?.[0]?.imageUrl || 
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
            })`
          }}
        />
      </AnimatePresence>
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-[#050816] via-[#050816]/30 to-[#050816] pointer-events-none" />

      {/* ─── HEADER NAVIGATION BAR ─── */}
      <header className="fixed top-0 inset-x-0 z-40 bg-slate-950/45 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/trip-planner" className="p-2 bg-white/5 hover:bg-white/10 rounded-[32px] transition-colors border border-white/10">
            <ArrowLeft className="w-4 h-4 text-slate-200" />
          </Link>
          <div>
            <h1 className="text-sm font-extrabold font-sora uppercase tracking-wider text-[#14F1D9]">Tripvora</h1>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">{trip.destination} • {totalDays} Day Journey</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => alert("Travel Storybook link copied!")} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button onClick={() => window.print()} className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[#14F1D9] hover:bg-[#14F1D9]/80 text-[#050816] rounded-xl text-xs font-black shadow-lg transition-transform active:scale-95">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </header>

      {/* ─── FULLSCREEN HERO (100vh) ─── */}
      <motion.section 
        style={{ y: heroTranslateY }}
        className="h-screen w-full relative flex flex-col justify-center items-center px-6 pt-20 text-center z-10"
      >
        <div className="space-y-6 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-[32px] text-xs font-black text-[#14F1D9] uppercase tracking-widest"
          >
            Ready for your cinematic movie
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold font-sora tracking-tight text-white capitalize leading-tight"
          >
            {destHub}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-xs"
          >
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-4 backdrop-blur-md">
              <p className="text-slate-400 uppercase font-black tracking-wider text-[9px]">Duration</p>
              <p className="text-white font-extrabold text-sm mt-1">{totalDays} Days Journey</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-4 backdrop-blur-md">
              <p className="text-slate-400 uppercase font-black tracking-wider text-[9px]">Travel Style</p>
              <p className="text-white font-extrabold text-sm mt-1">{travelerDNA?.type || "Couple Adventure"}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-4 backdrop-blur-md">
              <p className="text-slate-400 uppercase font-black tracking-wider text-[9px]">Weather</p>
              <p className="text-white font-extrabold text-sm mt-1">{weather?.temperature || 26}°C • {weather?.currentWeather || "Clear"}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-4 backdrop-blur-md">
              <p className="text-slate-400 uppercase font-black tracking-wider text-[9px]">Budget</p>
              <p className="text-white font-extrabold text-sm mt-1">₹{budget?.totalBudget?.toLocaleString('en-IN') || trip.totalBudget?.toLocaleString('en-IN') || "15,000"}</p>
            </div>
          </motion.div>

          <div className="pt-8 max-w-xl mx-auto w-full">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-4">Route Journey Flow</p>
            <div className="flex justify-between items-center relative px-2">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 z-0">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-[#14F1D9] to-[#6C63FF]"
                />
              </div>
              
              {[originHub, "En Route", "Approaching", destHub].map((node, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center text-xs font-black shadow-lg">
                    {idx === 0 ? "🛫" : idx === 3 ? "🏖️" : travelModeSymbol}
                  </div>
                  <span className="text-[10px] font-black text-slate-200 uppercase bg-[#050816]/80 px-2 py-0.5 rounded-full">{node}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── STORY SCROLL FEED ─── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pb-32 space-y-28">
        
        {totalDaysList.map(dayNum => {
          const dayData = days?.find((d: any) => d.day === dayNum) || { title: "Explore Location", activities: [] };
          const dayActivities = dayData.activities || [];
          
          return (
            <div 
              key={dayNum}
              className="space-y-12"
              onMouseEnter={() => {
                if (activeDay !== dayNum) {
                  setActiveDay(dayNum);
                  setActiveStepIdx(0);
                }
              }}
            >
              
              {/* ─── DAY FULL SCREEN HEADER (100vh introducing the day) ─── */}
              <div 
                className="h-[80vh] w-full rounded-[32px] overflow-hidden relative flex items-end p-8 sm:p-12 bg-cover bg-center border border-white/10 shadow-2xl"
                style={{
                  backgroundImage: `url(${
                    dayActivities[0]?.imageUrl || 
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
                  })`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent z-0" />
                <div className="relative z-10 space-y-3">
                  <span className="px-3.5 py-1 bg-[#14F1D9]/20 border border-[#14F1D9]/40 text-[#14F1D9] text-xs font-black uppercase tracking-widest rounded-[32px]">
                    Day {dayNum} Protocol
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-extrabold font-sora text-white leading-tight mt-2">{dayData.title}</h2>
                  <p className="text-slate-300 text-sm max-w-md">Your immersive journey continues with expertly curated locations.</p>
                </div>
              </div>

              {/* ─── PINTEREST STORY UI: HORIZONTAL JOURNEY TIMELINE ─── */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-black tracking-widest text-slate-400 px-2">Horizontal Journey Timeline</h3>
                
                <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 px-2 scrollbar-none">
                  {dayActivities.map((stop: any, idx: number) => {
                    const isSelected = activeDay === dayNum && idx === activeStepIdx;
                    return (
                      <motion.div
                        key={idx}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveDay(dayNum);
                          setActiveStepIdx(idx);
                        }}
                        className={`snap-center shrink-0 w-[290px] sm:w-[330px] rounded-[32px] border backdrop-blur-xl p-5 shadow-2xl cursor-pointer transition-all duration-500 ${
                          isSelected 
                            ? "bg-white/10 border-[#14F1D9] scale-[1.02] shadow-[#14F1D9]/5"
                            : "bg-[rgba(255,255,255,0.06)] border-white/5 opacity-70 blur-[0.5px] hover:opacity-100 hover:blur-none"
                        }`}
                      >
                        {stop.imageUrl && (
                          <div className="w-full h-32 rounded-[24px] overflow-hidden border border-white/10 mb-4 shrink-0">
                            <img 
                              src={stop.imageUrl} 
                              alt={stop.title} 
                              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] text-slate-400">
                            <span className="font-mono font-black text-[#14F1D9]">{stop.time || "10:00 AM"}</span>
                            <span className="uppercase bg-white/5 px-2 py-0.5 rounded font-black">{stop.type || stop.category || "Stop"}</span>
                          </div>
                          <h4 className="text-base font-extrabold font-sora text-white truncate">{stop.title || stop.name}</h4>
                          
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px] text-slate-300 font-bold">
                            <p>⭐ {stop.rating || 4.7}</p>
                            <p className="text-right">💰 ₹{stop.cost || stop.estimatedCost || 100}</p>
                            <p>📍 {stop.walkingDistance || "Nearby"}</p>
                            <p className="text-right">🚗 {stop.duration || "45 mins"}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* ─── PINTEREST STORY UI: IMMERSIVE DAY STORIES & DESTINATION CARDS ─── */}
              <div className="space-y-8 max-w-4xl mx-auto columns-1 md:columns-2 gap-8">
                {dayActivities.map((step: any, idx: number) => {
                  const isSelected = activeDay === dayNum && idx === activeStepIdx;
                  const crowd = getCrowdScore(step.title || step.name);
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      whileHover={{ y: -6 }}
                      onClick={() => {
                        setActiveDay(dayNum);
                        setActiveStepIdx(idx);
                      }}
                      className={`break-inside-avoid mb-8 rounded-[32px] border backdrop-blur-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? "bg-white/10 border-[#14F1D9] shadow-2xl shadow-[#14F1D9]/10" 
                          : "bg-[rgba(255,255,255,0.06)] border-white/5"
                      }`}
                    >
                      {step.imageUrl && (
                        <div className="w-full relative group overflow-hidden" style={{ height: idx % 2 === 0 ? '300px' : '400px' }}>
                          <img 
                            src={step.imageUrl} 
                            alt={step.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-6 left-6 right-6">
                            <span className="px-3 py-1 bg-[#14F1D9] text-[#050816] rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                              {step.type || step.category || "Activity"}
                            </span>
                            <h4 className="text-xl font-extrabold font-sora text-white mt-3 leading-tight drop-shadow-md">
                              {step.title || step.name}
                            </h4>
                          </div>
                        </div>
                      )}

                      <div className="p-6 space-y-4 bg-slate-950/50">
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                          <span className="text-sm font-mono font-black text-[#14F1D9] bg-white/5 px-3 py-1 rounded-xl">
                            {step.time || "10:00 AM"}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">
                            ⏳ {step.duration || "45 mins"}
                          </span>
                        </div>

                        <p className="text-sm text-slate-300 leading-relaxed font-inter line-clamp-3">
                          {step.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <p className="text-[9px] text-slate-400 uppercase font-black flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Crowd</p>
                            <p className="font-extrabold text-amber-400 mt-1">{crowd.status}</p>
                          </div>
                          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <p className="text-[9px] text-slate-400 uppercase font-black flex items-center gap-1"><Bot className="w-3 h-3"/> AI Photo Tip</p>
                            <p className="font-extrabold text-[#14F1D9] mt-1 truncate">{getPhotoSpot(step.title || step.name)}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          );
        })}

        {/* ─── BUDGET SECTION (Animated Budget Journey) ─── */}
        <section className="bg-[rgba(255,255,255,0.06)] border border-white/5 rounded-[32px] p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto space-y-6">
          <div className="border-b border-white/5 pb-4">
            <span className="px-3.5 py-1 bg-[#14F1D9]/20 border border-[#14F1D9]/40 text-[#14F1D9] text-xs font-black uppercase tracking-widest rounded-full">
              Finances
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold font-sora text-white mt-2">Your Budget Journey</h3>
            <p className="text-xs text-slate-400 mt-1">Relative allocation mapped across different luxury tiers.</p>
          </div>

          <div className="space-y-5">
            {(budget?.categorySpend || tripData.engineBudget?.categorySpend)?.slice(0, 4).map((budgetCat: any, idx: number) => {
              const colors = ["bg-[#14F1D9]", "bg-[#6C63FF]", "bg-amber-400", "bg-emerald-400", "bg-rose-400"];
              const icons = ["🏨", "🚕", "🍗", "🎯", "🚨"];
              const color = colors[idx % colors.length];
              const icon = icons[idx % icons.length];
              return (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>{icon} {budgetCat.category}</span>
                    <span className="font-mono">{budgetCat.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${budgetCat.percentage}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className={`${color} h-full rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* ─── STICKY FLOATING MAP SECTION ─── */}
      <div className="fixed bottom-8 left-8 z-30 hidden xl:block">
        <motion.div 
          animate={{ width: isMapMinimized ? 64 : 320, height: isMapMinimized ? 64 : 350 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col justify-between"
        >
          {isMapMinimized ? (
            <button 
              onClick={() => setIsMapMinimized(false)}
              className="w-full h-full flex items-center justify-center text-slate-200 hover:text-white transition-colors"
            >
              <MapIcon className="w-6 h-6 text-[#14F1D9]" />
            </button>
          ) : (
            <div className="p-4 h-full flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[10px] font-black uppercase text-[#14F1D9] tracking-wider">Live Story Map</span>
                <button 
                  onClick={() => setIsMapMinimized(true)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mini vector SVG projection */}
              <div className="w-full flex-1 bg-slate-950/50 rounded-[24px] border border-white/5 overflow-hidden flex items-center justify-center">
                {(() => {
                  const routes = tripData.mapExperience?.dayRoutes || [];
                  const currRoute = routes.find((r: any) => r.day === activeDay) || routes[0];
                  const steps = currRoute?.steps || [];

                  if (!steps.length) return <div className="text-xs text-slate-500 font-medium">Map Syncing...</div>;

                  let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
                  steps.forEach((s: any) => {
                    const lat = Number(s.lat);
                    const lon = Number(s.lon);
                    if (!isNaN(lat) && lat < minLat) minLat = lat;
                    if (!isNaN(lat) && lat > maxLat) maxLat = lat;
                    if (!isNaN(lon) && lon < minLon) minLon = lon;
                    if (!isNaN(lon) && lon > maxLon) maxLon = lon;
                  });

                  if (minLat === 90) minLat = tripData.mapExperience?.centerLat || 15;
                  if (maxLat === -90) maxLat = tripData.mapExperience?.centerLat || 16;
                  if (minLon === 180) minLon = tripData.mapExperience?.centerLon || 73;
                  if (maxLon === -180) maxLon = tripData.mapExperience?.centerLon || 74;

                  if (maxLat === minLat) { maxLat += 0.01; minLat -= 0.01; }
                  if (maxLon === minLon) { maxLon += 0.01; minLon -= 0.01; }

                  const mapToSvg = (lat: number, lon: number) => {
                    const x = 30 + ((lon - minLon) / (maxLon - minLon)) * 200;
                    const y = 230 - ((lat - minLat) / (maxLat - minLat)) * 200;
                    return { x, y };
                  };

                  return (
                    <svg viewBox="0 0 260 260" className="w-full h-full p-2">
                      <defs>
                        <linearGradient id="floatingRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#14F1D9" />
                          <stop offset="100%" stopColor="#6C63FF" />
                        </linearGradient>
                      </defs>

                      {steps.length > 1 && (
                        <path
                          d={`M ${steps.map((s: any) => {
                            const pt = mapToSvg(Number(s.lat), Number(s.lon));
                            return `${pt.x} ${pt.y}`;
                          }).join(" L ")}`}
                          fill="none"
                          stroke="url(#floatingRouteGrad)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="4 3"
                        />
                      )}

                      {steps.map((s: any, idx: number) => {
                        const pt = mapToSvg(Number(s.lat), Number(s.lon));
                        const isSelected = idx === activeStepIdx;
                        return (
                          <g key={idx}>
                            {isSelected && (
                              <circle cx={pt.x} cy={pt.y} r="10" className="fill-[#14F1D9]/20 stroke-[#14F1D9] animate-ping" strokeWidth="1" />
                            )}
                            <circle 
                              cx={pt.x} 
                              cy={pt.y} 
                              r={isSelected ? "6" : "4.5"} 
                              className={isSelected ? "fill-[#14F1D9] stroke-slate-950" : "fill-[#6C63FF] stroke-white"} 
                              strokeWidth="1" 
                            />
                          </g>
                        );
                      })}
                    </svg>
                  );
                })()}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                <span className="truncate max-w-[180px] font-bold text-white">📍 {days?.[activeDay - 1]?.activities?.[activeStepIdx]?.title || "Active Spot"}</span>
                <span className="shrink-0">{activeStepIdx + 1} / {days?.[activeDay - 1]?.activities?.length || 1}</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ─── FLOATING LIVE REGIONAL CONCIERGE ─── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {showConcierge && (
          <div className="w-80 sm:w-96 bg-slate-900 border border-[#14F1D9]/40 rounded-[32px] shadow-2xl overflow-hidden mb-4 animate-fade-in text-white flex flex-col max-h-[480px]">
            <div className="bg-gradient-to-r from-teal-600 to-indigo-600 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-full"><Bot className="w-5 h-5 text-white" /></div>
                <div>
                  <h4 className="text-sm font-black font-sora">Travixa AI Local Expert</h4>
                  <p className="text-[10px] text-teal-100 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Regional Concierge
                  </p>
                </div>
              </div>
              <button onClick={() => setShowConcierge(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-950/80 text-xs">
              {conciergeHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-teal-600 text-white rounded-br-none font-medium' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none leading-relaxed'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-none">
                <button onClick={() => setConciergeInput("Best cab app here?")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-full shrink-0 border border-slate-700 font-bold">🚕 Cab App?</button>
                <button onClick={() => setConciergeInput("Where to keep luggage?")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-full shrink-0 border border-slate-700 font-bold">🎒 Luggage storage?</button>
                <button onClick={() => setConciergeInput("Emergency tourist help")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-full shrink-0 border border-slate-700 font-bold">🚨 Emergency?</button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!conciergeInput.trim()) return;
                const newQuery = conciergeInput;
                setConciergeInput("");
                setConciergeHistory(prev => [...prev, { role: "user", text: newQuery }]);
                setTimeout(() => {
                  let reply = "For fast, metered transit here, utilizing verified regional Ola/Uber app booking is highly advised. Local auto-rickshaws are available nearby.";
                  if (newQuery.toLowerCase().includes("luggage")) reply = `You can securely store bags at your hotel checkout counter or utilize verified transit hub lockers for ₹30/bag.`;
                  if (newQuery.toLowerCase().includes("emergency")) reply = `Dial 112 for national rescue services or 1363 for 24/7 Regional Tourist Police assistance.`;
                  setConciergeHistory(prev => [...prev, { role: "assistant", text: reply }]);
                }, 600);
              }} className="flex gap-2">
                <input
                  type="text"
                  value={conciergeInput}
                  onChange={(e) => setConciergeInput(e.target.value)}
                  placeholder="Ask local expert anything..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
                <button type="submit" className="p-2 bg-teal-500 hover:bg-teal-400 text-slate-955 rounded-xl transition-transform active:scale-95 font-bold">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowConcierge(!showConcierge)}
          className="group flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white rounded-full shadow-2xl border-2 border-white/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-spin text-amber-300" style={{ animationDuration: '4s' }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-ping" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider font-sora pr-1">Ask AI Assistant</span>
        </button>
      </div>

    </div>
  );
}
