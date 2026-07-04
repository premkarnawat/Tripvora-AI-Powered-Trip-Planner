"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, Clock, ArrowLeft, Share2, Download, Plane, Utensils, 
  ExternalLink, Navigation, Heart, Compass, Train, Play, Pause, 
  RotateCcw, Map as MapIcon, Car, Footprints, MessageSquare, Send, 
  X, Bot, Sparkles, CheckCircle2, AlertTriangle, Camera, Ticket, CloudSun, Flame
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function TripViewerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [realTripData, setRealTripData] = useState<any>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [showConcierge, setShowConcierge] = useState(false);
  const [conciergeInput, setConciergeInput] = useState("");
  const [conciergeHistory, setConciergeHistory] = useState<Array<{role: string, text: string}>>([
    { role: "assistant", text: "👋 Welcome to your live regional concierge. Ask me for real-time luggage storage, local transit tips, or regional emergencies!" }
  ]);

  // Load live data from Supabase API or LocalStorage fallback
  useEffect(() => {
    async function loadLiveTrip() {
      try {
        if (id && id !== "generated") {
          const res = await fetch(`/api/trips/${id}`);
          if (res.ok) {
            const row = await res.json();
            if (row && row.demographics) {
              setRealTripData(row.demographics);
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

  // Handle automatic route playback
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStepIdx(prev => {
          const routes = realTripData?.mapExperience?.dayRoutes || [];
          const currRoute = routes.find((r: any) => r.day === activeDay) || routes[0];
          const maxIdx = currRoute ? currRoute.steps.length - 1 : 0;
          if (prev >= maxIdx) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2505);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeDay, realTripData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-6 text-white">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-teal-400 border-r-teal-500 border-slate-800 rounded-full"
        />
        <div>
          <h2 className="text-xl font-black font-sora tracking-wide">Assembling Cinematic Storybook...</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-sm">Generating OSRM routing metrics, custom photo spots, and crowd density indexes.</p>
        </div>
      </div>
    );
  }

  if (!realTripData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-6 text-white">
        <Navigation className="w-16 h-16 text-teal-400 animate-pulse mx-auto" />
        <h2 className="text-2xl font-black font-sora">No Storybook Loaded</h2>
        <p className="text-sm text-slate-400 max-w-md leading-relaxed">Please plan your next destination in the trip planner to generate a factual customized travel schedule.</p>
        <Link href="/trip-planner">
          <Button className="bg-teal-500 hover:bg-teal-400 text-slate-955 font-black py-6 px-8 rounded-2xl shadow-xl transition-all">
            Plan New Adventure
          </Button>
        </Link>
      </div>
    );
  }

  const trip = realTripData;
  const totalDays = trip.days?.length || trip.totalDays || 5;
  const totalDaysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Get active day data
  const currentDayObj = trip.days?.find((d: any) => d.day === activeDay) || trip.days?.[0] || { day: 1, title: "Adventure Awaits", activities: [] };
  const currentSlots = currentDayObj.activities || [];

  // Helper to resolve custom Apple Journal photo spots dynamically based on landmark name
  const getPhotoSpot = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("temple") || lower.includes("church") || lower.includes("mosque")) {
      return "Main entrance archway at golden hour for silhouette reflections.";
    }
    if (lower.includes("beach") || lower.includes("sea") || lower.includes("lake") || lower.includes("river")) {
      return "Water shoreline with low camera angle capturing waves at sunset.";
    }
    if (lower.includes("fort") || lower.includes("castle") || lower.includes("monument")) {
      return "Bastion wall angle highlighting the scaling architectural masonry.";
    }
    if (lower.includes("restaurant") || lower.includes("cafe") || lower.includes("food")) {
      return "Flat-lay food layout with soft overhead lamp highlight in frame.";
    }
    if (lower.includes("market") || lower.includes("bazaar") || lower.includes("shopping")) {
      return "Candid focus shot looking down the colorful center spice aisle.";
    }
    return "Low angle perspective framing the central facade symmetry.";
  };

  // Helper to generate mock crowd score from landmark name hash
  const getCrowdScore = (name: string) => {
    let hash = 0;
    for (let j = 0; j < name.length; j++) {
      hash = name.charCodeAt(j) + ((hash << 5) - hash);
    }
    const score = Math.abs(hash % 40) + 50; // 50% - 90%
    const status = score > 80 ? "Peak Crowds" : score > 65 ? "Moderate Flow" : "Quiet Morning";
    return { score, status };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative font-inter select-none">
      
      {/* ─── CINEMATIC COVER BACKDROP ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeDay}-${activeStepIdx}`}
          initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1.02, filter: "blur(0px) brightness(0.22)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              currentSlots[activeStepIdx]?.imageUrl || 
              currentSlots[0]?.imageUrl || 
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
            })`
          }}
        />
      </AnimatePresence>
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-slate-955 via-slate-955/40 to-slate-955 pointer-events-none" />

      {/* ─── FIXED GLASS NAVIGATION HEADER ─── */}
      <header className="fixed top-0 inset-x-0 z-40 bg-slate-955/45 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/trip-planner" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10">
            <ArrowLeft className="w-4 h-4 text-slate-200" />
          </Link>
          <div>
            <h1 className="text-sm font-black font-sora uppercase tracking-wider text-teal-400">Tripvora Storybook</h1>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">{trip.destination} • {totalDays} Day Journey</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => alert("Storybook Link Copied!")} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button onClick={() => window.print()} className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-955 rounded-xl text-xs font-black shadow-lg transition-transform active:scale-95">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </header>

      {/* ─── FULLSCREEN SNAP LAYOUT CONTAINER ─── */}
      <main className="h-screen w-screen pt-20 flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        {/* LEFT COLUMN: PINTEREST + APPLE JOURNAL STORY FEED */}
        <div className="w-full lg:w-[58%] h-full overflow-y-auto px-4 md:px-8 pb-32 pt-6 scrollbar-none snap-y snap-mandatory">
          
          {/* Day Snap Slides */}
          {totalDaysList.map(dayNum => {
            const dayData = trip.days?.find((d: any) => d.day === dayNum) || { title: "Daily Exploration", activities: [] };
            const daySlots = dayData.activities || [];
            
            return (
              <section 
                key={dayNum}
                id={`day-section-${dayNum}`}
                className="min-h-[calc(100vh-140px)] snap-start py-8 flex flex-col justify-start space-y-6"
                onMouseEnter={() => {
                  if (activeDay !== dayNum) {
                    setActiveDay(dayNum);
                    setActiveStepIdx(0);
                  }
                }}
              >
                {/* Day Divider Badge */}
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div>
                    <span className="px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-[10px] font-black text-teal-300 uppercase tracking-widest">
                      Day {dayNum} Protocol
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-sora mt-2">{dayData.title}</h2>
                  </div>
                  <div className="text-right text-xs text-slate-400 font-mono">
                    <p className="font-bold text-white">☀️ {trip.weatherEngine?.temperature || 26}°C</p>
                    <p>{trip.weatherEngine?.currentWeather || "Sunny Clear"}</p>
                  </div>
                </div>

                {/* Vertical Timeline Path & Cards Stack */}
                <div className="relative pl-6 sm:pl-10 space-y-8 border-l-2 border-white/10 ml-2 sm:ml-4">
                  
                  {daySlots.map((step: any, idx: number) => {
                    const isSelected = activeDay === dayNum && idx === activeStepIdx;
                    const crowd = getCrowdScore(step.title || step.name);
                    
                    return (
                      <motion.div
                        key={idx}
                        onClick={() => {
                          setActiveDay(dayNum);
                          setActiveStepIdx(idx);
                        }}
                        whileHover={{ scale: 1.01 }}
                        className={`relative rounded-3xl p-5 md:p-6 transition-all duration-300 cursor-pointer border ${
                          isSelected 
                            ? "bg-slate-900/70 border-teal-400 shadow-2xl" 
                            : "bg-slate-955/40 border-white/5 hover:border-white/15"
                        }`}
                      >
                        {/* Checkpoint Dot */}
                        <span className={`absolute -left-[35px] sm:-left-[49px] top-7 w-4 h-4 rounded-full border-2 border-slate-955 transition-all ${
                          isSelected 
                            ? "bg-teal-400 shadow-lg shadow-teal-400/50 scale-125" 
                            : "bg-slate-800"
                        }`} />

                        {/* Top Metadata */}
                        <div className="flex justify-between items-center text-xs text-slate-400 pb-2 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="text-teal-300 font-mono font-black">{step.time || "10:00 AM"}</span>
                            <span className="uppercase bg-white/5 text-slate-400 px-2.5 py-0.5 rounded text-[9px] font-black tracking-wider">
                              {step.type || step.category || "Activity"}
                            </span>
                          </div>
                          {step.duration && <span className="font-semibold text-slate-400">{step.duration}</span>}
                        </div>

                        {/* Pinterest Grid Style Card Body */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start pt-4">
                          {step.imageUrl && (
                            <div className="w-full sm:w-36 h-28 overflow-hidden rounded-2xl border border-white/10 shrink-0">
                              <img 
                                src={step.imageUrl} 
                                alt={step.title} 
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                              />
                            </div>
                          )}

                          <div className="space-y-2 flex-1 min-w-0">
                            <h4 className="text-lg font-black text-white font-sora tracking-wide truncate">{step.title || step.name}</h4>
                            <p className="text-xs text-slate-300 leading-relaxed font-inter">{step.description}</p>
                            
                            {/* Apple Journal style micro-details */}
                            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-bold text-slate-400">
                              <div className="flex items-center gap-1">
                                <Camera className="w-3.5 h-3.5 text-teal-400" />
                                <span className="truncate text-slate-300">Spot: {getPhotoSpot(step.title || step.name)}</span>
                              </div>
                              <div className="flex items-center gap-1 justify-end text-right">
                                <Flame className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-slate-300">{crowd.status} ({crowd.score}%)</span>
                              </div>
                            </div>

                            {/* OSRM Route stats */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                              <span>📍 Route: {step.walkingDistance || "250m from previous"}</span>
                              {step.estimatedCost > 0 && <span className="text-emerald-400 font-bold">Ticket: ₹{step.estimatedCost}</span>}
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* RIGHT COLUMN: IMMERSIVE POLARSTEPS-STYLE FULLSCREEN MAP CARD */}
        <div className="hidden lg:block lg:w-[42%] h-full p-6 relative">
          <div className="h-full backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden relative">
            
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Map Header */}
            <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider">Polarsteps Routing Engine</span>
                <h3 className="text-base font-black text-white font-sora mt-0.5">Day {activeDay} Circuit Route</h3>
              </div>
              <div className="text-right text-[10px] text-slate-400 font-mono">
                <p>Center: {trip.mapExperience?.centerLat?.toFixed(3)}, {trip.mapExperience?.centerLon?.toFixed(3)}</p>
                <p className="text-teal-300">OSRM Clustered Circuit</p>
              </div>
            </div>

            {/* Interactive SVG Projection Canvas */}
            <div className="relative z-10 w-full h-[360px] flex items-center justify-center bg-slate-955/50 rounded-2xl border border-white/5 my-4">
              {(() => {
                const routes = trip.mapExperience?.dayRoutes || [];
                const currRoute = routes.find((r: any) => r.day === activeDay) || routes[0];
                const steps = currRoute?.steps || [];

                let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
                steps.forEach((s: any) => {
                  const lat = Number(s.lat);
                  const lon = Number(s.lon);
                  if (!isNaN(lat) && lat < minLat) minLat = lat;
                  if (!isNaN(lat) && lat > maxLat) maxLat = lat;
                  if (!isNaN(lon) && lon < minLon) minLon = lon;
                  if (!isNaN(lon) && lon > maxLon) maxLon = lon;
                });

                if (minLat === 90) minLat = trip.mapExperience?.centerLat || 15;
                if (maxLat === -90) maxLat = trip.mapExperience?.centerLat || 16;
                if (minLon === 180) minLon = trip.mapExperience?.centerLon || 73;
                if (maxLon === -180) maxLon = trip.mapExperience?.centerLon || 74;

                if (maxLat === minLat) { maxLat += 0.01; minLat -= 0.01; }
                if (maxLon === minLon) { maxLon += 0.01; minLon -= 0.01; }

                const mapToSvg = (lat: number, lon: number) => {
                  const x = 50 + ((lon - minLon) / (maxLon - minLon)) * 300;
                  const y = 350 - ((lat - minLat) / (maxLat - minLat)) * 300;
                  return { x, y };
                };

                return (
                  <svg viewBox="0 0 400 400" className="w-full h-full p-4">
                    <defs>
                      <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>

                    {/* SVG grid ticks */}
                    <g stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1">
                      <line x1="50" y1="50" x2="350" y2="50" strokeDasharray="3" />
                      <line x1="50" y1="350" x2="350" y2="350" strokeDasharray="3" />
                      <line x1="50" y1="50" x2="50" y2="350" strokeDasharray="3" />
                      <line x1="350" y1="50" x2="350" y2="350" strokeDasharray="3" />
                    </g>

                    {/* Polyline Route Drawing */}
                    {steps.length > 1 && (
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        d={`M ${steps.map((s: any) => {
                          const pt = mapToSvg(Number(s.lat), Number(s.lon));
                          return `${pt.x} ${pt.y}`;
                        }).join(" L ")}`}
                        fill="none"
                        stroke="url(#routeGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="6 5"
                      />
                    )}

                    {/* Animated Pulsing Waypoints */}
                    {steps.map((s: any, idx: number) => {
                      const pt = mapToSvg(Number(s.lat), Number(s.lon));
                      const isSelected = idx === activeStepIdx;
                      return (
                        <g 
                          key={idx} 
                          className="cursor-pointer" 
                          onClick={() => setActiveStepIdx(idx)}
                        >
                          {isSelected && (
                            <circle cx={pt.x} cy={pt.y} r="14" className="fill-teal-400/20 stroke-teal-400 animate-ping" strokeWidth="1" />
                          )}
                          <circle 
                            cx={pt.x} 
                            cy={pt.y} 
                            r={isSelected ? "9" : "6"} 
                            className={`${
                              isSelected 
                                ? "fill-teal-400 stroke-slate-955" 
                                : s.type === "meal" 
                                ? "fill-amber-500 stroke-white" 
                                : s.type === "hotel" 
                                ? "fill-teal-600 stroke-white" 
                                : "fill-indigo-500 stroke-white"
                            } transition-all`} 
                            strokeWidth="1.5" 
                          />
                          <text 
                            x={pt.x} 
                            y={pt.y - 12} 
                            textAnchor="middle" 
                            className="text-[9px] font-black fill-slate-300 font-mono select-none"
                          >
                            {idx + 1}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>

            {/* Playback Controls & Status Footer */}
            <div className="relative z-10 bg-slate-955/80 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-955 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  {isPlaying ? <><Pause className="w-3.5 h-3.5 fill-current" /> Pause</> : <><Play className="w-3.5 h-3.5 fill-current" /> Auto Play</>}
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setActiveStepIdx(0); }}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition-colors"
                  title="Reset Storyline"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-400">
                <p>Day Stop Progress:</p>
                <p className="text-white font-bold">{activeStepIdx + 1} / {currentSlots.length || 1}</p>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* ─── FLOATING LIVE REGIONAL CONCIERGE ─── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {showConcierge && (
          <div className="w-80 sm:w-96 bg-slate-900 border border-teal-500/40 rounded-3xl shadow-2xl overflow-hidden mb-4 animate-fade-in text-white flex flex-col max-h-[480px]">
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

            <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-955/80 text-xs">
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
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px]">
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
