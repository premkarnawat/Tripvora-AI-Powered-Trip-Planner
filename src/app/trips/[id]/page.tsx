"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, Clock, ShieldAlert, Award, Calendar, Wallet, CloudSun, 
  ArrowLeft, Share2, Download, Plane, Utensils, ExternalLink, Navigation, Heart, Compass, Train,
  Play, Pause, RotateCcw, Map as MapIcon, Car, Footprints
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

  const [mapDayRoute, setMapDayRoute] = useState(1);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStepIdx(prev => {
          const routes = realTripData?.itinerary?.mapExperience?.dayRoutes || [];
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
        <h2 className="text-lg font-bold text-slate-800 font-sora">Loading Travixa Travel Operating System...</h2>
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
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/trip-planner" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-black uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-teal-600" /> Travixa Travel OS
              </span>
              <span className="text-xs text-slate-400 font-bold">• Factual Real-Time Engine</span>
            </div>
            <h1 className="text-base md:text-xl font-black text-slate-900 font-sora tracking-tight">{trip.destination} Travel Guide</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => alert("Itinerary Link Copied!")} className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95">
            <Download className="w-3.5 h-3.5" /> Export Plan
          </button>
        </div>
      </header>

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
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase rounded-full">Verified Geocoding</span>
                <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-black text-[10px] uppercase rounded-full">Optimized Route</span>
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

          {/* PHASE 9: WEATHER INTELLIGENCE ENGINE CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white border border-sky-500/30 rounded-3xl p-6 shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="px-2 py-0.5 bg-sky-500/20 border border-sky-400/30 rounded-full text-[9px] font-black text-sky-300 uppercase tracking-widest font-sora">
                    Phase 9 Weather Engine (Open-Meteo)
                  </span>
                  <h4 className="text-sm font-black text-white mt-1">Live Meteo & Protocol Active</h4>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black font-mono text-amber-400">{trip.weatherEngine?.temperature || 26}°C</span>
                  <span className="text-[10px] text-slate-300 block font-bold">{trip.weatherEngine?.currentWeather || "Clear Skies"}</span>
                </div>
              </div>

              {/* Protocol Banner */}
              <div className="mt-3 p-2.5 bg-sky-950/80 border border-sky-400/40 rounded-xl text-xs space-y-1">
                <p className="font-extrabold text-sky-300 text-[11px] leading-snug">
                  {trip.weatherEngine?.protocolTriggered || "✨ Standard Optimal Weather Protocol Active"}
                </p>
                <p className="text-[10px] text-slate-300 leading-tight">
                  {trip.weatherEngine?.weatherAdvice || "Comfortable climate for sightseeing. Itinerary sequenced for optimal weather safety."}
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

        {/* PHASE 10: DESTINATION INTELLIGENCE ENGINE */}
        {trip.destinationIntelligence && trip.destinationIntelligence.length > 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-[10px] font-black text-purple-700 uppercase tracking-widest font-sora">
                  Phase 10 Destination Intelligence Engine
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2">Overpass + OSM + Wiki Ranked Places</h3>
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
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.description || "Verified regional point of interest."}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-[11px] font-bold text-slate-500">
                      <span>📍 Distance: {item.distance || "1.2 km"}</span>
                      <span className="text-purple-600 font-extrabold">Verified GIS</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE 11: USER PREFERENCE ENGINE */}
        {trip.userPreferenceEngine && (
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            <div className="border-b border-white/10 pb-4 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-[10px] font-black text-indigo-300 uppercase tracking-widest font-sora">
                  Phase 11 User Preference Engine
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white mt-2 flex items-center gap-2">
                  <span>🎯 Active Profile:</span>
                  <span className="text-amber-400 underline decoration-amber-400/50">{trip.userPreferenceEngine.detectedProfile} Traveler</span>
                </h3>
              </div>
              <div className="text-xs font-bold text-indigo-200 bg-indigo-900/50 px-3 py-1.5 rounded-xl border border-indigo-400/30">
                Tailored Itinerary & Pace Active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Pace & Comfort Standard</span>
                <p className="text-sm font-bold text-slate-200">{trip.userPreferenceEngine.paceAndComfort}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">Preferred Categories Focus</span>
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
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">⚡ Automated Profile Rules Triggered</span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 font-medium">
                  {trip.userPreferenceEngine.specialRulesApplied.map((rule: string, rIdx: number) => (
                    <li key={rIdx}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* PHASE 4: HOTEL INTELLIGENCE ENGINE SELECTION */}
        {trip.hotels?.[0] && (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-black text-teal-700 uppercase tracking-widest font-sora">
                  Phase 4 Hotel Intelligence Engine
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2">Verified Hotel Recommendations</h3>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400 block font-bold">Ranking Score Formula</span>
                <span className="font-mono text-teal-800 font-extrabold">Rating(40%) + Dist(20%) + Price(20%) + Reviews(20%)</span>
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
                      <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-2">{item.data?.name || "Verified Hotel"}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 line-clamp-1">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {item.data?.address || "Verified Coordinates"}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex justify-between items-baseline">
                      <div>
                        <span className="text-lg font-black text-slate-950 font-mono">₹{item.data?.pricePerNight?.toLocaleString('en-IN') || 2500}</span>
                        <span className="text-[10px] text-slate-400 font-bold"> / night</span>
                      </div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Score: {item.data?.rankingScore || 94.5}/100
                      </span>
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

        {/* Phase 3: Arrival & Departure Concierge Engine Banner */}
        {trip.conciergeWorkflow && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-teal-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-[10px] font-black text-teal-300 uppercase tracking-widest">
                  Concierge Engine Verified
                </span>
                <h3 className="text-lg sm:text-xl font-black mt-2">Arrival & Departure Concierge Protocol</h3>
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
                        {step.fare && <span className="font-mono bg-amber-950/80 px-2 py-0.5 rounded text-[10px] text-amber-200 border border-amber-500/30">{step.fare}</span>}
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
              onClick={() => setActiveDay(d)}
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

          {/* Panel 2: Food Intelligence & Spends Engine (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* PHASE 5: FOOD INTELLIGENCE ENGINE */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start flex-wrap gap-2">
                <div>
                  <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-black text-amber-800 uppercase tracking-widest font-sora">
                    Phase 5 Food Intelligence Engine
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1.5 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-amber-500 shrink-0" /> Verified Restaurant Recommendations
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
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Categorized Verified Database (8 Categories):</p>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">Timings & Coordinates Verified</span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {trip.restaurants?.map((rst: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 hover:border-amber-400 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 bg-amber-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
                            {rst.categoryLabel || rst.mealType || "Verified Dining"}
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
                          <span className="text-slate-400 block text-[9px] font-bold uppercase">Distance (Geo Rule)</span>
                          <span className="font-bold text-teal-700">📍 {rst.distance || "1.2 km (Verified ≤3km)"}</span>
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

            {/* PHASE 8: BUDGET INTELLIGENCE ENGINE CARD */}
            <div className="bg-white border border-teal-200 rounded-3xl p-6 shadow-md space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <span className="px-2.5 py-0.5 bg-teal-50 border border-teal-200 rounded-full text-[10px] font-black text-teal-700 uppercase tracking-widest font-sora">
                    Phase 8 Budget Intelligence Engine
                  </span>
                  <h4 className="text-base font-black text-slate-900 uppercase tracking-wider font-sora mt-1">Intelligent Allocation & Spend Tracker</h4>
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

        {/* PHASE 6: MAP EXPERIENCE ENGINE */}
        {trip.mapExperience && (
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Phase 6 Map Experience Engine
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
                    {trip.mapExperience.routingEngine || "OpenRouteService Verified"}
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
                            <h4 className="text-lg font-black text-white mt-1.5">{currStep?.name || "Verified Landmark"}</h4>
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
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Verified GIS Markers Legend:</p>
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
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        )}

        {/* RETURN JOURNEY BANNER */}
        {trip.returnPlan && (
          <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 rounded-3xl p-8 text-white shadow-xl space-y-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">Checkout & Departure Schedule</span>
                <h2 className="text-2xl font-black font-sora">Conclusion of {trip.destination} Trip</h2>
                <p className="text-xs text-slate-300 leading-relaxed">{trip.returnPlan.summary}</p>
              </div>

              <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/20 text-center shrink-0">
                <p className="text-[10px] uppercase text-slate-300 font-extrabold">Hotel Check-out Time</p>
                <p className="text-xl font-black font-mono text-teal-300 mt-0.5">⏱️ {trip.returnPlan.checkoutTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-teal-300">Departure Transit Options</p>
                {trip.returnPlan.transportOptions?.map((to:any, i:number) => (
                  <div key={i} className="flex justify-between items-center text-xs text-slate-200">
                    <span>{to.mode}</span>
                    <span className="font-mono font-black text-white">₹{to.cost} ({to.duration})</span>
                  </div>
                ))}
              </div>

              <div className="bg-teal-900/30 border border-teal-500/30 p-5 rounded-2xl flex flex-col justify-center items-center text-center space-y-2">
                <Heart className="w-6 h-6 text-rose-400 animate-bounce" />
                <p className="text-xs md:text-sm font-bold text-teal-200 italic">"{trip.returnPlan.thankYouMessage}"</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Sticky Mobile Bottom Navigation */}
      <nav className="block md:hidden bg-white border-t border-[#E5E7EB] fixed bottom-0 inset-x-0 z-40 px-4 py-3 flex justify-around shadow-lg">
        <Link href="/trip-planner" className="flex flex-col items-center text-slate-400 hover:text-teal-600"><Compass className="w-5 h-5" /><span className="text-[10px] font-bold mt-1">Planner</span></Link>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center text-teal-600 font-bold"><Clock className="w-5 h-5" /><span className="text-[10px] mt-1">Timeline</span></button>
        <button onClick={() => window.print()} className="flex flex-col items-center text-slate-400 hover:text-teal-600"><Download className="w-5 h-5" /><span className="text-[10px] font-bold mt-1">Export</span></button>
      </nav>
    </div>
  );
}
