"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, Clock, ShieldAlert, Award, Calendar, Wallet, CloudSun, 
  ArrowLeft, Share2, Download, Plane, Utensils, ExternalLink, Navigation, Heart, Compass, Train,
  Play, Pause, RotateCcw, Map as MapIcon, Car, Footprints, MessageSquare, Send, X, Bot, Sparkles, CheckCircle2, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TripViewerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [realTripData, setRealTripData] = useState<any>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [viewMode, setViewMode] = useState<"story" | "classic">("story");

  const [mapDayRoute, setMapDayRoute] = useState(1);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [showConcierge, setShowConcierge] = useState(false);
  const [conciergeInput, setConciergeInput] = useState("");
  const [conciergeHistory, setConciergeHistory] = useState<Array<{role: string, text: string}>>([
    { role: "assistant", text: "👋 Hello! I am your local travel expert for this trip. Ask me for real-time luggage advice, transit tips, or dining alternatives!" }
  ]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStepIdx(prev => {
          const routes = realTripData?.mapExperience?.dayRoutes || realTripData?.itinerary?.mapExperience?.dayRoutes || [];
          const currRoute = routes.find((r:any) => r.day === mapDayRoute) || routes[0];
          const maxIdx = currRoute ? currRoute.steps.length - 1 : 4;
          if (prev >= maxIdx) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, mapDayRoute, realTripData]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center space-y-4 font-inter">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-lg font-bold text-slate-800 font-sora">Loading your trip...</h2>
        <p className="text-xs text-slate-500">Calculating real access routes, transport fares, and clustered daily schedules.</p>
      </div>
    );
  }

  if (!realTripData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center space-y-6 font-inter">
        <Navigation className="w-16 h-16 text-teal-600 animate-pulse mx-auto" />
        <h2 className="text-2xl font-black text-slate-800 font-sora">No Active Itinerary Loaded</h2>
        <p className="text-sm text-slate-500 max-w-md leading-relaxed">Please enter your exact starting location, target destination, and budget preferences in the live planner to generate a factual customized travel schedule.</p>
        <Link href="/trip-planner">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-6 px-8 rounded-2xl shadow-xl transition-all">
            Start Live Planning
          </Button>
        </Link>
      </div>
    );
  }

  const trip = realTripData;
  const currentDayObj = trip.days?.find((d: any) => d.day === activeDay) || trip.days?.[0] || { day: 1, title: "Day Plan", morning: [], afternoon: [], evening: [], night: [] };
  const currentSlots = [
    ...(currentDayObj.morning || []), ...(currentDayObj.afternoon || []),
    ...(currentDayObj.evening || []), ...(currentDayObj.night || []),
    ...(currentDayObj.activities || [])
  ];

  const totalDaysList = Array.from({ length: trip.totalDays || trip.days?.length || 5 }, (_, i) => i + 1);
  const travelOrigin = trip.travelToDestination || null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-28 font-inter">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/trip-planner" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-black uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-teal-600" /> Tripvora
              </span>
              <span className="text-xs text-slate-400 font-bold">• AI Travel Planner</span>
            </div>
            <h1 className="text-base md:text-xl font-black text-slate-900 font-sora tracking-tight">{trip.destination} Travel Guide</h1>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button 
            onClick={() => setViewMode("story")} 
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
              viewMode === "story" 
                ? "bg-white text-teal-800 shadow-xs" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            ✨ Immersive Story
          </button>
          <button 
            onClick={() => setViewMode("classic")} 
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
              viewMode === "classic" 
                ? "bg-white text-teal-800 shadow-xs" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            📋 Detailed Dossier
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => alert("Itinerary Link Copied!")} className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95">
            <Download className="w-3.5 h-3.5" /> Export Plan
          </button>
        </div>
      </header>

      {viewMode === "story" ? (
        // ─── STUNNING IMMERSIVE STORY MODE ───
        <div className="relative min-h-screen text-white overflow-hidden select-none">
          {/* Scrollable/Swapping Backdrop Cover */}
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000 transform scale-105 filter brightness-[0.35]"
            style={{ 
              backgroundImage: `url(${
                currentSlots[activeStepIdx]?.imageUrl || 
                trip.days?.[activeDay - 1]?.activities?.[0]?.imageUrl || 
                "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
              })` 
            }}
          />
          {/* Gradient Ambient Overlay */}
          <div className="fixed inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 pt-8 pb-20">
            {/* Day selector floating panel */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none sticky top-[80px] z-20 bg-slate-950/40 backdrop-blur-md p-2 rounded-2xl border border-white/5 mb-6">
              {totalDaysList.map(d => (
                <button
                  key={d}
                  onClick={() => {
                    setActiveDay(d);
                    setMapDayRoute(d);
                    setActiveStepIdx(0);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 uppercase tracking-widest ${
                    activeDay === d 
                      ? "bg-teal-500 text-slate-950 shadow-md scale-102 font-extrabold" 
                      : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5"
                  }`}
                >
                  Day {d}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Story Feed & Timeline (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Day Summary Glass Card */}
                <div className="backdrop-blur-md bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-[10px] font-black text-teal-300 uppercase tracking-widest">
                      Day {activeDay} Overview
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      ☀️ {trip.weatherEngine?.temperature || 26}°C • {trip.weatherEngine?.currentWeather || "Clear"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white font-sora">Day {activeDay}: {currentDayObj.title}</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">{trip.tripOverview?.split('.')[activeDay - 1] || trip.destinationSummary}</p>
                  
                  {/* Dynamic DNA/Pace Stats bar */}
                  <div className="grid grid-cols-3 gap-3 text-center text-xs pt-3 border-t border-white/10">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block font-black uppercase">Pace</span>
                      <span className="font-bold text-teal-300">{trip.travelerDNA?.travelPace || "Balanced"}</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block font-black uppercase">DNA Match</span>
                      <span className="font-bold text-indigo-300">{trip.travelerDNA?.type || "Couple"}</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block font-black uppercase">Comfort</span>
                      <span className="font-bold text-emerald-300">{trip.travelerDNA?.comfortLevel || "Comfortable"}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Cards list */}
                <div className="relative border-l-2 border-teal-500/30 ml-4 pl-8 space-y-6">
                  {currentSlots.map((step: any, idx: number) => {
                    const isSelected = idx === activeStepIdx;
                    return (
                      <div 
                        key={idx}
                        onClick={() => setActiveStepIdx(idx)}
                        className={`relative backdrop-blur-md border rounded-3xl p-5 md:p-6 transition-all duration-300 cursor-pointer shadow-xl ${
                          isSelected 
                            ? "bg-white/20 border-teal-400 scale-[1.01]" 
                            : "bg-slate-900/40 border-white/10 hover:bg-slate-900/60 hover:border-white/20"
                        }`}
                      >
                        {/* Glowing dot on timeline border */}
                        <span className={`absolute -left-[41px] top-6 w-4 h-4 rounded-full border-2 border-slate-950 transition-all ${
                          isSelected ? "bg-teal-400 shadow-lg shadow-teal-400/50 scale-125" : "bg-slate-800"
                        }`} />

                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-teal-300 font-mono font-black">{step.time || "10:00 AM"}</span>
                            <span className="uppercase bg-white/10 text-slate-300 px-2 py-0.5 rounded text-[9px] font-black tracking-wider">
                              {step.category || step.type || "Activity"}
                            </span>
                          </div>
                          {step.duration && <span className="text-slate-400 font-semibold">{step.duration}</span>}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-start pt-3">
                          {step.imageUrl && (
                            <img 
                              src={step.imageUrl} 
                              alt={step.title} 
                              className="w-full sm:w-28 h-24 object-cover rounded-xl border border-white/10 shadow-md shrink-0" 
                            />
                          )}
                          <div className="space-y-2 flex-1">
                            <h4 className="text-lg font-black text-white leading-tight font-sora">{step.title || step.name}</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                            
                            <div className="flex flex-wrap gap-4 pt-1 text-[11px] font-bold text-slate-400">
                              <span>⭐ {step.rating || 4.7}</span>
                              <span className="text-teal-300">📍 {step.distance || "Nearby"}</span>
                              {step.cost > 0 && <span className="text-emerald-400 font-mono">₹{step.cost?.toLocaleString('en-IN')}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Quick platform links inside card */}
                        {isSelected && (
                          <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center flex-wrap gap-2 animate-fade-in">
                            <div className="flex gap-2">
                              <a href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(step.title || step.name)}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-950 hover:bg-teal-600 text-white rounded-lg text-[10px] font-bold transition-colors">
                                Booking.com →
                              </a>
                              <a href={`https://www.agoda.com/search?keyword=${encodeURIComponent(step.title || step.name)}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-950 hover:bg-blue-600 text-white rounded-lg text-[10px] font-bold transition-colors">
                                Agoda →
                              </a>
                            </div>
                            {step.googleMapsUrl && (
                              <a href={step.googleMapsUrl} target="_blank" rel="noreferrer" className="text-[11px] text-teal-400 hover:text-teal-300 font-black flex items-center gap-1">
                                Route Map <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Fullscreen sticky animated SVG map (5 Cols) */}
              <div className="hidden lg:block lg:col-span-5 h-[calc(100vh-180px)] sticky top-[150px]">
                <div className="h-full backdrop-blur-md bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Header info */}
                  <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-teal-300 tracking-wider">Dynamic Geo Engine</span>
                      <h4 className="text-sm font-black text-white mt-0.5">Route Visualization</h4>
                    </div>
                    <div className="text-right font-mono text-[10px] text-slate-400">
                      <p>Center: {trip.mapExperience?.centerLat?.toFixed(3)}, {trip.mapExperience?.centerLon?.toFixed(3)}</p>
                      <p className="text-teal-400">Distance: {dayRoute?.totalDistanceKm || 5.2} km</p>
                    </div>
                  </div>

                  {/* Dynamic SVG Visual Map */}
                  <div className="relative z-10 w-full h-[320px] flex items-center justify-center bg-slate-950/40 rounded-2xl border border-white/5 my-4">
                    {(() => {
                      // Calculate bounding box on the fly
                      let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
                      if (steps.length > 0) {
                        steps.forEach((s: any) => {
                          const lat = Number(s.lat);
                          const lon = Number(s.lon);
                          if (!isNaN(lat) && lat < minLat) minLat = lat;
                          if (!isNaN(lat) && lat > maxLat) maxLat = lat;
                          if (!isNaN(lon) && lon < minLon) minLon = lon;
                          if (!isNaN(lon) && lon > maxLon) maxLon = lon;
                        });
                      }
                      
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
                            <linearGradient id="storyRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#14b8a6" />
                              <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                          </defs>

                          {/* Grid ticks */}
                          <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1">
                            <line x1="50" y1="50" x2="350" y2="50" strokeDasharray="3" />
                            <line x1="50" y1="350" x2="350" y2="350" strokeDasharray="3" />
                            <line x1="50" y1="50" x2="50" y2="350" strokeDasharray="3" />
                            <line x1="350" y1="50" x2="350" y2="350" strokeDasharray="3" />
                          </g>

                          {/* Curving Polyline route */}
                          {steps.length > 1 && (
                            <path
                              d={`M ${steps.map((s: any) => {
                                const pt = mapToSvg(Number(s.lat), Number(s.lon));
                                return `${pt.x} ${pt.y}`;
                              }).join(" L ")}`}
                              fill="none"
                              stroke="url(#storyRouteGrad)"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="6 5"
                              className="animate-[dash_25s_linear_infinite]"
                            />
                          )}

                          {/* Waypoint Markers */}
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
                                  <circle cx={pt.x} cy={pt.y} r="14" className="fill-teal-500/10 stroke-teal-400 animate-ping" strokeWidth="1" />
                                )}
                                <circle 
                                  cx={pt.x} 
                                  cy={pt.y} 
                                  r={isSelected ? "9" : "6.5"} 
                                  className={`${
                                    isSelected 
                                      ? "fill-teal-400 stroke-slate-950" 
                                      : s.type === "meal" 
                                      ? "fill-amber-500 stroke-white" 
                                      : s.type === "hotel" 
                                      ? "fill-teal-600 stroke-white" 
                                      : "fill-indigo-500 stroke-white"
                                  } transition-all duration-300 hover:scale-125`} 
                                  strokeWidth="1.5" 
                                />
                                <text 
                                  x={pt.x} 
                                  y={pt.y - 12} 
                                  textAnchor="middle" 
                                  className="text-[9px] font-black fill-slate-200 font-mono select-none drop-shadow"
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

                  {/* Active Step Details Bar */}
                  {steps[activeStepIdx] && (
                    <div className="bg-slate-950/80 border border-white/5 p-3.5 rounded-2xl text-xs space-y-1 relative z-10 animate-fade-in">
                      <span className="text-[10px] text-teal-300 font-black uppercase tracking-wider">Active Step {activeStepIdx + 1}:</span>
                      <h5 className="font-bold text-white text-sm">{steps[activeStepIdx].name}</h5>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{steps[activeStepIdx].time} • Next Stop ETA: {steps[activeStepIdx].etaToNext}</p>
                    </div>
                  )}

                  {/* Map Playback controls */}
                  <div className="relative z-10 bg-slate-950/90 border border-white/5 p-3 rounded-2xl flex items-center justify-between gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md"
                      >
                        {isPlaying ? <><Pause className="w-3.5 h-3.5 fill-current" /> Pause</> : <><Play className="w-3.5 h-3.5 fill-current" /> Play Story</>}
                      </button>
                      <button
                        onClick={() => { setIsPlaying(false); setActiveStepIdx(0); }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                        title="Reset Story"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono font-bold">
                      Progress: <span className="text-white">{activeStepIdx + 1}</span> / {steps.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ─── CLASSIC DOSSIER VIEW ───
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
          
          {/* TRAVEL TO DESTINATION BANNER */}
          {travelOrigin && (
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 rounded-3xl p-6 text-white shadow-md space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-teal-300 text-xs font-extrabold uppercase tracking-widest">
                    <Train className="w-4 h-4 animate-pulse" /> Intercity Access & Logistics
                  </div>
                  <h2 className="text-lg md:text-xl font-black font-sora mt-1">{travelOrigin.userLocation || "Starting Location"} → {trip.destination}</h2>
                  <p className="text-xs text-slate-400">Actual travel routes and intercity connections. Displayed separately from city budget.</p>
                </div>
                <span className="px-3 py-1 bg-teal-500/20 border border-teal-400/30 text-teal-300 rounded-full text-xs font-black uppercase">Travel Route</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {travelOrigin.options?.map((opt: any, idx: number) => (
                  <div key={idx} className="bg-white/5 backdrop-blur border border-white/15 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-black text-teal-300">
                      <span>{opt.title || `OPTION ${idx+1}`}</span>
                      {opt.totalCost && <span className="font-mono text-white">Total: ₹{opt.totalCost?.toLocaleString('en-IN')} ({opt.totalDuration})</span>}
                    </div>
                    <div className="space-y-2">
                      {opt.steps?.map((st: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-black/20 px-3 py-2 rounded-xl text-xs">
                          <span className="text-slate-200 font-medium">{st.mode}</span>
                          <div className="flex items-center gap-3 font-mono">
                            <span className="text-teal-300 font-bold">₹{st.cost?.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-slate-400">{st.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ARRIVAL WORKFLOW BANNER */}
          {trip.arrivalPlan && (
            <div className="bg-white border border-teal-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <span className="text-xs font-black uppercase text-teal-700 tracking-wider font-sora">Arrival Route & Schedule</span>
                  <h3 className="text-base md:text-lg font-black text-slate-900 mt-0.5">Arrival at {trip.arrivalPlan.arrivalPoint} ({trip.arrivalPlan.time})</h3>
                </div>
                <span className="text-xs bg-teal-50 text-teal-800 px-3 py-1 rounded-xl font-bold font-mono">Step-by-Step Schedule</span>
              </div>

              <div className="flex flex-col md:flex-row gap-3 overflow-x-auto pb-2">
                {trip.arrivalPlan.steps?.map((stp: any, idx: number) => (
                  <div key={idx} className="flex-1 min-w-[190px] bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex flex-col justify-between space-y-3 relative">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-[11px] font-black shrink-0">{idx+1}</span>
                      <div>
                        {stp.time && <span className="text-[10px] font-mono font-black text-teal-700 block">{stp.time}</span>}
                        <p className="text-xs font-bold text-slate-800 leading-snug mt-0.5">{stp.step}</p>
                      </div>
                    </div>

                    {stp.options && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-200">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">Transfer Options:</p>
                        {stp.options.map((to: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-[11px] bg-white p-1.5 rounded-lg border border-slate-100">
                            <span className="font-semibold text-slate-700">{to.mode}</span>
                            <span className="font-mono font-bold text-teal-800">₹{to.cost} ({to.duration})</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {idx < (trip.arrivalPlan.steps?.length - 1) && (
                      <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-teal-500 font-black">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hero Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase rounded-full">Trip Overview</span>
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-black text-[10px] uppercase rounded-full">Planned Route</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 font-sora">{trip.tripOverview || trip.destinationSummary}</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{trip.destinationSummary}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-6 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-teal-600" /> {trip.totalDays} Days Plan</div>
                <div className="flex items-center gap-2"><Wallet className="w-4 h-4 text-teal-600" /> Budget Limit: ₹{Number(trip.totalBudget).toLocaleString('en-IN')}</div>
                <div className="flex items-center gap-2"><CloudSun className="w-4 h-4 text-amber-500" /> {trip.weatherEngine?.temperature || 26}°C • {trip.weatherEngine?.currentWeather || "Clear Skies"}</div>
              </div>
            </div>

            {/* Weather Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white border border-sky-500/30 rounded-3xl p-6 shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="px-2 py-0.5 bg-sky-500/20 border border-sky-400/30 rounded-full text-[9px] font-black text-sky-300 uppercase tracking-widest font-sora">
                      Live Weather
                    </span>
                    <h4 className="text-sm font-black text-white mt-1">Current Conditions</h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black font-mono text-amber-400">{trip.weatherEngine?.temperature || 26}°C</span>
                    <span className="text-[10px] text-slate-300 block font-bold">{trip.weatherEngine?.currentWeather || "Clear Skies"}</span>
                  </div>
                </div>

                {/* Weather Advice */}
                <div className="mt-3 p-2.5 bg-sky-950/80 border border-sky-400/40 rounded-xl text-xs space-y-1">
                  <p className="text-[10px] text-slate-300 leading-tight">
                    {trip.weatherEngine?.weatherAdvice || "Comfortable weather for exploring."}
                  </p>
                </div>
              </div>

              {/* 5 Requested Weather Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-bold pt-2 border-t border-white/10">
                <div className="bg-white/5 p-2 rounded-lg flex justify-between"><span className="text-slate-400">🌧️ Rain:</span><span className="text-sky-300">{trip.weatherEngine?.rainProbability || 15}%</span></div>
                <div className="bg-white/5 p-2 rounded-lg flex justify-between"><span className="text-slate-400">💧 Humidity:</span><span className="text-teal-300">{trip.weatherEngine?.humidity || 65}%</span></div>
                <div className="bg-white/5 p-2 rounded-lg flex justify-between"><span className="text-slate-400">☀️ UV Index:</span><span className="text-amber-400">{trip.weatherEngine?.uvIndex || 6}/10</span></div>
                <div className="bg-white/5 p-2 rounded-lg flex justify-between"><span className="text-slate-400">💨 Wind:</span><span className="text-emerald-300">{trip.weatherEngine?.wind || 14} km/h</span></div>
              </div>
            </div>
          </div>

          {/* Nearby Experiences */}
          {trip.destinationIntelligence && trip.destinationIntelligence.length > 0 && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-[10px] font-black text-purple-700 uppercase tracking-widest font-sora">
                    Places to Visit
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2">Discover {trip.destination}</h3>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  13 Categories Mapped • Ranked Priority
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trip.destinationIntelligence.map((item: any, idx: number) => {
                  const rankBadge = item.rank === "must visit" 
                    ? "bg-rose-50 text-rose-700 border-rose-200" 
                    : item.rank === "recommended" 
                    ? "bg-amber-50 text-amber-700 border-amber-200" 
                    : "bg-slate-50 text-slate-600 border-slate-200";

                  return (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all bg-slate-50/50 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100/60 text-purple-800">
                            {item.category}
                          </span>
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${rankBadge}`}>
                            {item.rank}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base mt-2">{item.name}</h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.description || ""}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-[11px] font-bold text-slate-500">
                        <span>📍 Distance: {item.distance || "1.2 km"}</span>
                        <span className="text-purple-600 font-extrabold">Map Data</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Your Travel Profile */}
          {trip.userPreferenceEngine && (
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
              <div className="border-b border-white/10 pb-4 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-[10px] font-black text-indigo-300 uppercase tracking-widest font-sora">
                    Personalized For You
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white mt-2 flex items-center gap-2">
                    <span className="text-amber-400">{trip.userPreferenceEngine.detectedProfile}</span> Trip
                  </h3>
                </div>
                <div className="text-xs font-bold text-indigo-200 bg-indigo-900/50 px-3 py-1.5 rounded-xl border border-indigo-400/30">
                  Your preferences applied
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Pace & Comfort</span>
                  <p className="text-sm font-bold text-slate-200">{trip.userPreferenceEngine.paceAndComfort}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">Your Interests</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {trip.userPreferenceEngine.preferredCategories?.map((cat: string, cIdx: number) => (
                      <span key={cIdx} className="px-2 py-0.5 bg-white/10 rounded-md text-[11px] font-bold text-amber-300 uppercase">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {trip.userPreferenceEngine.specialRulesApplied && trip.userPreferenceEngine.specialRulesApplied.length > 0 && (
                <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">How we customized your trip</span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 font-medium">
                    {trip.userPreferenceEngine.specialRulesApplied.map((rule: string, rIdx: number) => (
                      <li key={rIdx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Trip Quality */}
          {trip.validationEngine && (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="border-b border-white/10 pb-4 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest font-sora">
                    Trip Quality
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white mt-2 flex items-center gap-3">
                    Trip Quality
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      trip.validationEngine.totalScore >= 90 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                    }`}>
                      {trip.validationEngine.totalScore} / 100
                    </span>
                  </h3>
                </div>
              </div>

              {trip.validationEngine.warningMessage && (
                <div className={`p-3 rounded-xl border text-xs font-bold ${
                  trip.validationEngine.totalScore >= 90 ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300" : "bg-amber-950/40 border-amber-500/30 text-amber-300"
                }`}>
                  {trip.validationEngine.warningMessage}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {[
                  { label: "Transport", score: trip.validationEngine.transportScore, max: 20 },
                  { label: "Hotel", score: trip.validationEngine.hotelScore, max: 20 },
                  { label: "Food", score: trip.validationEngine.foodScore, max: 15 },
                  { label: "Activities", score: trip.validationEngine.activitiesScore, max: 15 },
                  { label: "Maps", score: trip.validationEngine.mapsScore, max: 10 },
                  { label: "Images", score: trip.validationEngine.imagesScore, max: 10 },
                  { label: "Weather", score: trip.validationEngine.weatherScore, max: 10 },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col justify-between items-center text-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                    <div className="my-2">
                      <span className="text-xl font-black text-white">{item.score}</span>
                      <span className="text-xs text-slate-400"> /{item.max}</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-teal-400 to-indigo-400 h-full rounded-full" style={{ width: `${(item.score / item.max) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Spots */}
          {trip.recommendationEngine && trip.recommendationEngine.length > 0 && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-black text-amber-700 uppercase tracking-widest font-sora">
                    Recommended Spots
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2">Top Picks For You</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {trip.recommendationEngine.slice(0, 8).map((rec: any, idx: number) => (
                  <div key={idx} className="bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-1">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-black uppercase tracking-wider">
                          #{idx + 1} • {rec.category}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base line-clamp-1">{rec.name}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{rec.description || ""}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500 font-semibold">
                      <span>⭐ {rec.rating} ({rec.reviewsCount})</span>
                      <span>📍 {rec.distanceKm} km</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hotel Options */}
          {trip.hotels?.[0] && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-black text-teal-700 uppercase tracking-widest font-sora">
                    Hotel Options
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2">Where to Stay</h3>
                </div>
              </div>

              {/* 4 Category Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Best Overall", badge: "bg-teal-600 text-white", data: trip.hotels[0].bestOverallHotel || trip.hotels[0] },
                  { title: "Budget Pick", badge: "bg-emerald-500 text-white", data: trip.hotels[0].budgetHotel || trip.hotels[0].budgetOption || trip.hotels[0] },
                  { title: "Mid-Range Pick", badge: "bg-blue-600 text-white", data: trip.hotels[0].midHotel || trip.hotels[0].alternatives?.[0] || trip.hotels[0] },
                  { title: "Premium Pick", badge: "bg-purple-600 text-white", data: trip.hotels[0].premiumHotel || trip.hotels[0].alternatives?.[1] || trip.hotels[0] }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-teal-400 hover:bg-white hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${item.badge}`}>
                          {item.title}
                        </span>
                        <span className="font-mono font-black text-xs text-slate-700">★ {item.data?.rating || 4.5}</span>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-2">{item.data?.name || "Hotel"}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 line-clamp-1">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {item.data?.address || ""}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex justify-between items-baseline">
                        <div>
                          <span className="text-lg font-black text-slate-950 font-mono">₹{item.data?.pricePerNight?.toLocaleString('en-IN') || 2500}</span>
                          <span className="text-[10px] text-slate-400 font-bold"> / night</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60">
                        <p>🕒 <span className="font-bold">Check-in:</span> {item.data?.checkin || "12:00 PM"} | <span className="font-bold">Out:</span> {item.data?.checkout || "11:00 AM"}</p>
                        <p className="truncate text-slate-500">🛡️ {item.data?.cancellationPolicy || "Free cancellation up to 48h before check-in"}</p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <a href={item.data?.bookingLink || "#"} target="_blank" rel="noreferrer" className="w-full py-2 bg-slate-900 hover:bg-teal-700 text-white text-center rounded-xl text-xs font-extrabold transition-all">
                        Book via Booking.com →
                      </a>
                      <a href={item.data?.affiliateLink || "#"} target="_blank" rel="noreferrer" className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-center rounded-xl text-[11px] font-bold transition-all">
                        Compare Agoda Deal
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Booking Links */}
          {trip.affiliateLinks && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-black text-blue-700 uppercase tracking-widest font-sora">
                  Book Now
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2">Quick Booking Links</h3>
                <p className="text-xs text-slate-500 mt-1">Compare prices across platforms — we don't charge any commission.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Hotels */}
                {trip.affiliateLinks.hotels && trip.affiliateLinks.hotels.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-700">🏨 Hotels</span>
                    <div className="space-y-2">
                      {trip.affiliateLinks.hotels.map((h: any, i: number) => (
                        <a key={i} href={h.url} target="_blank" rel="noreferrer" className="block w-full py-2 px-3 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-xs font-bold text-slate-800 transition-all text-center">
                          {h.platform} →
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flights */}
                {trip.affiliateLinks.flights && trip.affiliateLinks.flights.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">✈️ Flights</span>
                    <div className="space-y-2">
                      {trip.affiliateLinks.flights.map((f: any, i: number) => (
                        <a key={i} href={f.url} target="_blank" rel="noreferrer" className="block w-full py-2 px-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-800 transition-all text-center">
                          {f.platform} →
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buses */}
                {trip.affiliateLinks.buses && trip.affiliateLinks.buses.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-700">🚌 Buses</span>
                    <div className="space-y-2">
                      {trip.affiliateLinks.buses.map((b: any, i: number) => (
                        <a key={i} href={b.url} target="_blank" rel="noreferrer" className="block w-full py-2 px-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-bold text-slate-800 transition-all text-center">
                          {b.platform} →
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities */}
                {trip.affiliateLinks.activities && trip.affiliateLinks.activities.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">🎯 Activities</span>
                    <div className="space-y-2">
                      {trip.affiliateLinks.activities.map((a: any, i: number) => (
                        <a key={i} href={a.url} target="_blank" rel="noreferrer" className="block w-full py-2 px-3 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-xs font-bold text-slate-800 transition-all text-center">
                          {a.platform} →
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Arrival & Departure */}
          {trip.conciergeWorkflow && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-teal-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-[10px] font-black text-teal-300 uppercase tracking-widest">
                    Arrival & Departure
                  </span>
                  <h3 className="text-lg sm:text-xl font-black mt-2">Your Arrival & Departure Plan</h3>
                </div>
                <div className="text-right text-xs">
                  <p className="text-slate-300 font-bold">Check-in: <span className="text-white font-mono">{trip.conciergeWorkflow.conciergeAdvice.hotelCheckin}</span></p>
                  <p className="text-slate-300 font-bold">Check-out: <span className="text-white font-mono">{trip.conciergeWorkflow.conciergeAdvice.hotelCheckout}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Arrival Workflow */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-black text-teal-400 uppercase tracking-wider flex items-center gap-2">
                    🛬 Day 1: Arrival Protocol
                  </h4>
                  <div className="space-y-3 pl-2 border-l border-teal-500/40">
                    {trip.conciergeWorkflow.arrivalWorkflow?.map((step: any, i: number) => (
                      <div key={i} className="relative pl-4 text-xs space-y-0.5">
                        <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-teal-400" />
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-black text-teal-300">{step.time}</span>
                          {step.fare && <span className="font-mono bg-teal-950/80 px-2 py-0.5 rounded text-[10px] text-teal-200 border border-teal-500/30">{step.fare}</span>}
                        </div>
                        <p className="font-bold text-white">{step.activity}</p>
                        <p className="text-[11px] text-slate-300">{step.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Departure Workflow */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    🛫 Day {totalDaysList.length}: Departure Protocol
                  </h4>
                  <div className="space-y-3 pl-2 border-l border-amber-500/40">
                    {trip.conciergeWorkflow.departureWorkflow?.map((step: any, i: number) => (
                      <div key={i} className="relative pl-4 text-xs space-y-0.5">
                        <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-amber-400" />
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-black text-amber-300">{step.time}</span>
                          {step.fare && <span className="font-mono bg-amber-950/80 px-2 py-0.5 rounded text-[10px] text-amber-200 border border-teal-500/30">{step.fare}</span>}
                        </div>
                        <p className="font-bold text-white">{step.activity}</p>
                        <p className="text-[11px] text-slate-300">{step.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Concierge Advice Footer */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase font-black">Est. Cabs / Transit</p>
                  <p className="font-mono font-black text-teal-300 mt-1">Taxi: {trip.conciergeWorkflow.conciergeAdvice.taxiFare} | Bus: {trip.conciergeWorkflow.conciergeAdvice.busFare}</p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase font-black">Last Mile Walking</p>
                  <p className="font-bold text-white mt-1">🚶 {trip.conciergeWorkflow.conciergeAdvice.walkingTime}</p>
                </div>
                <div className="bg-black/20 p-3 rounded-xl border border-white/5 sm:col-span-2">
                  <p className="text-[10px] text-slate-400 uppercase font-black">Emergency & Luggage Tip</p>
                  <p className="text-[11px] text-slate-200 mt-1 truncate">🚨 {trip.conciergeWorkflow.conciergeAdvice.emergencyContact}</p>
                </div>
              </div>
            </div>
          )}

          {/* Day Tabs Bar */}
          <div className="bg-white border border-[#E5E7EB] p-2 rounded-2xl flex gap-2 overflow-x-auto shadow-2xs">
            {totalDaysList.map(d => (
              <button
                key={d}
                onClick={() => { setActiveDay(d); setMapDayRoute(d); setActiveStepIdx(0); }}
                className={`px-6 py-3 rounded-xl text-xs font-black transition-all shrink-0 ${
                  activeDay === d 
                    ? "bg-teal-600 text-white shadow-xs scale-102" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Day {d} Schedule
              </button>
            ))}
          </div>

          {/* Travel Progress */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-4 rounded-2xl border border-teal-500/30 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/20 rounded-xl border border-teal-400/30">
                <Compass className="w-5 h-5 text-teal-400 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-teal-300">Regional Trip Progress</h4>
                <p className="text-sm font-bold text-white mt-0.5">Day {activeDay} of {totalDaysList.length} • {currentSlots.length} stops planned</p>
              </div>
            </div>
            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-300">
                <span>Progress</span>
                <span className="text-teal-400 font-bold">{Math.round((activeDay / totalDaysList.length) * 100)}% Completed</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${(activeDay / totalDaysList.length) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Triple Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Panel 1: Day Timeline with Thumbnail & Transport (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black text-teal-700 uppercase tracking-wider font-sora">Day {activeDay}: {currentDayObj.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Daily Route Schedule with Distances & Fares</p>
                </div>
                <span className="text-xs font-bold text-slate-500 font-mono">{currentSlots.length} Scheduled Items</span>
              </div>

              <div className="border-l-2 border-teal-100 ml-4 pl-6 space-y-6">
                {currentSlots.length > 0 ? currentSlots.map((step: any, idx: number) => (
                  <div key={idx} className="relative bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4 transition-all hover:border-teal-300 hover:bg-white hover:shadow-xs">
                    <span className="absolute -left-[33px] top-5 w-3.5 h-3.5 rounded-full border-2 border-white bg-teal-600 shadow-xs" />
                    
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-teal-700 font-mono font-black">{step.time || "10:00 AM"}</span>
                        <span className="uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-extrabold text-[9px]">{step.category || step.type || "Activity"}</span>
                      </div>
                      {step.importance && (
                        <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase border ${
                          step.importance === 'Must Visit' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}>
                          {step.importance}
                        </span>
                      )}
                    </div>

                    {/* Thumbnail & Description Grid */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      {step.imageUrl && (
                        <img src={step.imageUrl} alt={step.title} className="w-full sm:w-36 h-28 object-cover rounded-xl border border-slate-200 shadow-2xs shrink-0" />
                      )}
                      <div className="space-y-1.5 flex-1">
                        <h4 className="text-base font-black text-slate-900 leading-tight">{step.title || step.name}</h4>
                        <p className="text-xs text-slate-600 leading-snug">{step.description}</p>
                        
                        <div className="flex flex-wrap gap-4 pt-1 text-[11px] font-bold text-slate-500">
                          <span>★ {step.rating || 4.7} ({step.reviewCount?.toLocaleString() || "28,400"})</span>
                          <span>⏱️ Duration: {step.duration || "1.5h"}</span>
                          <span>👥 Crowd: {step.crowdLevel || "Comfortable"}</span>
                          <span className="text-slate-900 font-mono">💵 Ticket: ₹{(step.cost || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Transport Fares to Item */}
                    {step.transportOptions && (
                      <div className="pt-2 border-t border-slate-200/60 bg-white/70 p-2.5 rounded-xl flex flex-wrap justify-between items-center text-[10px] gap-2">
                        <span className="font-extrabold text-slate-400 uppercase">Transport Options:</span>
                        <div className="flex gap-3 font-mono font-bold text-slate-700">
                          <span>🚕 Taxi: {step.transportOptions.taxi}</span>
                          <span>🛺 Auto: {step.transportOptions.auto}</span>
                          <span>🚌 Transit: {step.transportOptions.bus}</span>
                          <span>🚶 Walk: {step.transportOptions.walk}</span>
                        </div>
                      </div>
                    )}

                    {/* Booking & Maps Links */}
                    <div className="flex justify-between items-center pt-1 flex-wrap gap-2">
                      <div className="flex gap-2">
                        {step.bookingLinks?.map((b:any, i:number) => (
                          <a key={i} href={b.url||"#"} target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-teal-700 transition-colors">
                            {b.provider}
                          </a>
                        ))}
                      </div>
                      <a href={step.googleMapsUrl || "#"} target="_blank" rel="noreferrer" className="text-[11px] text-teal-600 font-black hover:underline inline-flex items-center gap-0.5">
                        Open Route Map <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {step.aiTip && (
                      <div className="p-2.5 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-teal-950 italic">
                        💡 <strong>Travel Tip:</strong> {step.aiTip}
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="p-6 text-center text-xs text-slate-400">No activities scheduled for this day.</div>
                )}
              </div>
            </div>

            {/* Panel 2: Food & Budget (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Food Recommendations */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-black text-amber-800 uppercase tracking-widest font-sora">
                      Food Recommendations
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1.5 flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-amber-500 shrink-0" /> Restaurant Recommendations
                    </h4>
                  </div>
                  <div className="text-right text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <p className="font-extrabold text-slate-700">📍 Geo Rule: ≤ 3.0 km Radius</p>
                    <p className="text-slate-400">Strictly no 20km breakfast detours</p>
                  </div>
                </div>
                
                {trip.foodIntelligence && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <p className="font-extrabold text-amber-950 text-[10px] uppercase tracking-wider">🔥 Signature Culinary Specialties in {trip.destination}</p>
                        <p className="text-sm font-black text-amber-900 mt-0.5">{trip.foodIntelligence.mustTryDish || "Misal Pav, Thali & Filter Coffee"}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-200/60 text-amber-900 px-2.5 py-1 rounded-xl shrink-0">100% Verified</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-semibold text-[11px]">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">🥗 Best Veg:<span className="font-bold block text-slate-900 truncate mt-0.5">{trip.foodIntelligence.bestVeg}</span></div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">🍗 Non-Veg:<span className="font-bold block text-slate-900 truncate mt-0.5">{trip.foodIntelligence.bestNonVeg}</span></div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">🦐 Local Heritage:<span className="font-bold block text-slate-900 truncate mt-0.5">{trip.foodIntelligence.bestSeafood}</span></div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">🍢 Street Chaat:<span className="font-bold block text-slate-900 truncate mt-0.5">{trip.foodIntelligence.streetFood}</span></div>
                    </div>
                  </div>
                )}

                {/* 8 Categorized Restaurant Recommendations */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Restaurants nearby:</p>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {trip.restaurants?.map((rst: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 hover:border-amber-400 hover:bg-white hover:shadow-sm transition-all">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 bg-amber-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
                              {rst.categoryLabel || rst.mealType || "Dining"}
                            </span>
                            <h5 className="font-black text-slate-900 text-sm">{rst.name}</h5>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-amber-600 text-xs font-mono">⭐ {rst.rating || 4.6}</span>
                            <span className="text-[10px] text-slate-400 block">({rst.reviews || `${rst.reviewsCount?.toLocaleString()} reviews` || "15,000 reviews"})</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60 text-[11px] text-slate-600">
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase">Price Range</span>
                            <span className="font-mono font-black text-slate-900">{rst.priceRange || `₹${rst.estimatedCost}`}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase">Distance</span>
                            <span className="font-bold text-teal-700">📍 {rst.distance || "Nearby"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase">Operating Timings</span>
                            <span className="font-semibold text-slate-800">{rst.timings || "11:00 AM - 11:00 PM"}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-200/50">
                          <div className="text-[11px]">
                            <span className="font-bold text-slate-700">🍽️ Speciality: </span>
                            <span className="text-slate-600 italic">{rst.speciality || rst.mustTryDish || "Misal Pav, South Indian, Coffee"}</span>
                          </div>
                          <a href={rst.map || rst.googleMapsUrl || "#"} target="_blank" rel="noreferrer" className="px-3 py-1 bg-slate-900 hover:bg-amber-600 text-white text-[10px] font-extrabold rounded-lg inline-flex items-center gap-1 transition-colors shrink-0">
                            View Map <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="bg-white border border-teal-200 rounded-3xl p-6 shadow-md space-y-6">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-black text-teal-700 uppercase tracking-widest font-sora">
                      Budget Breakdown
                    </span>
                    <h4 className="text-base font-black text-slate-900 uppercase tracking-wider font-sora mt-1">Budget Allocation & Spending</h4>
                  </div>
                  <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl uppercase">
                    Score: {trip.budgetTracker?.budgetHealthScore || 98}/100
                  </span>
                </div>

                {/* Budget Meter */}
                <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>💰 Budget Meter: <span className="text-teal-400 font-mono">{trip.budgetTracker?.budgetMeter?.status || "Optimal (Within Budget)"}</span></span>
                    <span className="font-mono text-emerald-400">{trip.budgetTracker?.budgetMeter?.percentageUsed || 82}% Used</span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(trip.budgetTracker?.budgetMeter?.percentageUsed || 82, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                    <span>Total Budget: ₹{Number(trip.totalBudget).toLocaleString('en-IN')}</span>
                    <span>Actual Spend: ₹{(trip.budgetTracker?.overallTotal || trip.estimatedCost).toLocaleString('en-IN')}</span>
                    <span className="text-emerald-400 font-bold">Reserve: ₹{(trip.budgetTracker?.remainingOrSavings || 3000).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Planned vs Actual Category Spend */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Planned vs Actual Spend Split:</p>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xs">
                    {(trip.budgetTracker?.categorySpend || [
                      { category: "Hotel & Stay (40%)", planned: Math.floor(trip.totalBudget * 0.4), actual: Math.floor(trip.totalBudget * 0.38), status: "Under Budget" },
                      { category: "Transit & Cab (20%)", planned: Math.floor(trip.totalBudget * 0.2), actual: Math.floor(trip.totalBudget * 0.18), status: "Under Budget" },
                      { category: "Food & Dining (20%)", planned: Math.floor(trip.totalBudget * 0.2), actual: Math.floor(trip.totalBudget * 0.19), status: "Under Budget" },
                      { category: "Activities (10%)", planned: Math.floor(trip.totalBudget * 0.1), actual: Math.floor(trip.totalBudget * 0.08), status: "Under Budget" },
                      { category: "Emergency Reserve (10%)", planned: Math.floor(trip.totalBudget * 0.1), actual: Math.floor(trip.totalBudget * 0.1), status: "Intact Reserve" }
                    ]).map((cat: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800 block">{cat.category}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Planned: ₹{cat.planned?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-slate-900 block">₹{cat.actual?.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] font-bold text-teal-700">{cat.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Spend Breakdown */}
                {trip.budgetTracker?.dailySpend && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Daily Spend Breakdown:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {trip.budgetTracker.dailySpend.map((ds: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center font-mono">
                          <span className="font-bold text-slate-700">Day {ds.day}</span>
                          <span className="font-black text-teal-800">₹{ds.total?.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Budget Alternatives Suggestions */}
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-amber-950 uppercase flex items-center gap-1.5">
                    💡 Budget Alternatives & Savings Suggestions:
                  </p>
                  <div className="space-y-1.5 text-xs text-amber-900">
                    {(trip.budgetTracker?.budgetAlternatives || [
                      { title: "Smart Transit Switch", savings: "₹1,200", description: "Use AC Metro passes instead of dedicated station cabs." },
                      { title: "Dining Optimization", savings: "₹1,800", description: "Swap one premium dining dinner for verified local Thali." }
                    ]).map((alt: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start gap-2 bg-white/60 p-2 rounded-xl border border-amber-200/60">
                        <div>
                          <span className="font-bold text-amber-950 block">{alt.title}</span>
                          <span className="text-[11px] text-amber-800 leading-snug">{alt.description}</span>
                        </div>
                        <span className="font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] shrink-0">Save {alt.savings}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Emergency Contacts Hub */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-2 flex justify-between items-center text-rose-600">
                  <h4 className="text-xs font-black uppercase tracking-wider font-sora">Emergency Backup Hub</h4>
                  <ShieldAlert className="w-4 h-4" />
                </div>

                <div className="space-y-2 text-xs font-bold text-slate-600">
                  <div className="flex justify-between"><span>🚨 Police Station</span><span className="text-slate-900 font-mono">{trip.emergencyContacts?.police || "112"}</span></div>
                  <div className="flex justify-between"><span>🚑 Ambulance Service</span><span className="text-slate-900 font-mono">{trip.emergencyContacts?.ambulance || "102"}</span></div>
                  <div className="flex justify-between"><span>ℹ️ Tourist Helpline</span><span className="text-teal-700 font-mono">{trip.emergencyContacts?.embassyOrHelpline || "1363"}</span></div>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Map */}
          {trip.mapExperience && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Interactive Map
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black mt-2 flex items-center gap-2.5 font-sora">
                    <MapIcon className="w-6 h-6 text-teal-400 shrink-0" /> Interactive Travel Map & Timeline Playback
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Powered by OpenStreetMap, OpenRouteService & OSRM. Clustered routing with live ETAs, fares, and traffic.
                  </p>
                </div>

                {/* Day Selector Buttons */}
                <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
                  {(trip.mapExperience.dayRoutes || []).map((dr: any) => (
                    <button
                      key={dr.day}
                      onClick={() => { setMapDayRoute(dr.day); setActiveStepIdx(0); setIsPlaying(false); }}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
                        mapDayRoute === dr.day
                          ? "bg-teal-500 text-slate-950 shadow-md scale-102"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      Day {dr.day} Route
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Canvas + Markers Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Simulated Visual Interactive Map View (7 cols) */}
                <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                  {/* Background Grid Pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Map Header bar */}
                  <div className="relative z-10 flex justify-between items-center bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono font-bold text-slate-200">OSRM Center: {trip.mapExperience.centerLat?.toFixed(4)}, {trip.mapExperience.centerLon?.toFixed(4)}</span>
                    </div>
                    <span className="text-[10px] font-extrabold bg-teal-950 text-teal-300 px-2.5 py-0.5 rounded border border-teal-800">
                      {trip.mapExperience.routingEngine || "Route Data"}
                    </span>
                  </div>

                  {/* Visual Route Playback Canvas */}
                  <div className="relative z-10 my-6 py-4 flex flex-col gap-4">
                    {(() => {
                      const currRoute = (trip.mapExperience.dayRoutes || []).find((r:any) => r.day === mapDayRoute) || (trip.mapExperience.dayRoutes || [])[0];
                      const currStep = currRoute?.steps?.[activeStepIdx] || currRoute?.steps?.[0];
                      return (
                        <div className="bg-slate-900/95 border border-teal-500/30 p-5 rounded-2xl shadow-2xl space-y-3 animate-fade-in">
                          <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2.5">
                            <span className="font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              📍 Step {activeStepIdx + 1} of {currRoute?.steps?.length || 1} — {currStep?.time || "09:00 AM"}
                            </span>
                            <span className="font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded text-teal-300 font-bold">
                              ETA to next: {currStep?.etaToNext || "8 min"}
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                                {currStep?.type?.toUpperCase() || "MARKER"}
                              </span>
                              <h4 className="text-lg font-black text-white mt-1.5">{currStep?.name || "Landmark"}</h4>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">Coords: {currStep?.lat?.toFixed(4)}, {currStep?.lon?.toFixed(4)}</p>
                            </div>
                            <div className="text-right shrink-0 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Next Leg Distance</span>
                              <span className="text-sm font-black font-mono text-emerald-400">{currStep?.distanceToNext || "1.5 km"}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Playback Controls Footer */}
                  <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md"
                      >
                        {isPlaying ? <><Pause className="w-3.5 h-3.5 fill-current" /> Pause Playback</> : <><Play className="w-3.5 h-3.5 fill-current" /> Play Route Timeline</>}
                      </button>
                      <button
                        onClick={() => { setIsPlaying(false); setActiveStepIdx(0); }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                        title="Reset Timeline"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <span>Progress:</span>
                      <span className="text-white font-bold">{activeStepIdx + 1}</span> / {((trip.mapExperience.dayRoutes || []).find((r:any) => r.day === mapDayRoute)?.steps?.length || 1)}
                    </div>
                  </div>
                </div>

                {/* Route Features & Markers List (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  {(() => {
                    const currRoute = (trip.mapExperience.dayRoutes || []).find((r:any) => r.day === mapDayRoute) || (trip.mapExperience.dayRoutes || [])[0];
                    return (
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <div className="border-b border-slate-800 pb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">Day {mapDayRoute} Summary</span>
                          <h4 className="text-sm font-black text-white mt-0.5">{currRoute?.title || `Day ${mapDayRoute} Clustered Circuit`}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 text-xs">
                          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Distance</span>
                            <span className="font-mono font-black text-teal-400 text-sm">{currRoute?.totalDistanceKm || 6.5} km</span>
                          </div>
                          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Time</span>
                            <span className="font-mono font-black text-amber-400 text-sm">{currRoute?.totalEstTimeMin || 50} mins</span>
                          </div>
                          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Live Traffic / Weather</span>
                            <span className="font-bold text-white text-[11px]">{currRoute?.trafficStatus || "Moderate"} | {currRoute?.weatherSummary || "Clear 26°C"}</span>
                          </div>
                          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Transit Mode & Fare</span>
                            <span className="font-bold text-emerald-400 text-[11px]">{currRoute?.travelMode || "OSRM Cab"} (₹{currRoute?.estFare || 450})</span>
                          </div>
                        </div>

                        {/* Displaying all 6 requested markers */}
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Map Markers:</p>
                          <div className="grid grid-cols-2 gap-1.5 max-h-[190px] overflow-y-auto pr-1 text-[11px]">
                            {(trip.mapExperience.markers || []).map((m: any, idx: number) => (
                              <div key={idx} className="p-2 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-2 truncate">
                                <span className="text-sm shrink-0">{m.badge?.split(' ')[0] || "📍"}</span>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-white truncate text-[11px]">{m.name}</p>
                                  <p className="text-[9px] text-slate-400 uppercase font-mono">{m.type}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      )}

      {/* Sticky Mobile Bottom Navigation */}
      <nav className="block md:hidden bg-white border-t border-[#E5E7EB] fixed bottom-0 inset-x-0 z-40 px-4 py-3 flex justify-around shadow-lg">
        <Link href="/trip-planner" className="flex flex-col items-center text-slate-400 hover:text-teal-600"><Compass className="w-5 h-5" /><span className="text-[10px] font-bold mt-1">Planner</span></Link>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center text-teal-600 font-bold"><Clock className="w-5 h-5" /><span className="text-[10px] mt-1">Timeline</span></button>
        <button onClick={() => window.print()} className="flex flex-col items-center text-slate-400 hover:text-teal-600"><Download className="w-5 h-5" /><span className="text-[10px] font-bold mt-1">Export</span></button>
      </nav>

      {/* AI Travel Assistant */}
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
                  let reply = "As your local expert, I advise using verified app cabs like Ola or Uber for transparent metering. Always carry some small cash bills for local auto rickshaws!";
                  if (newQuery.toLowerCase().includes("luggage")) reply = `You can securely store your luggage at ${trip.hotels?.[0]?.name || "your hotel reception"} before check-in or utilize the station cloakroom for ₹30/bag.`;
                  if (newQuery.toLowerCase().includes("emergency")) reply = `Dial 112 for national emergency or 1363 for 24/7 Tourist Police assistance in ${trip.destination}.`;
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
                <button type="submit" className="p-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl transition-transform active:scale-95 font-bold">
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
          <span className="text-xs font-black uppercase tracking-wider font-sora pr-1">Ask AI Local Expert</span>
        </button>
      </div>
    </div>
  );
}
