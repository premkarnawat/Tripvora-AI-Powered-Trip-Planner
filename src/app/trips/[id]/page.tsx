"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Share2, Download, Map as MapIcon, ShieldAlert,
  Clock, MapPin, Coffee, Utensils, Bed, Compass, CloudSun, AlertCircle, Phone
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function TripDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [realTripData, setRealTripData] = useState<any>(null);
  const [activeDay, setActiveDay] = useState(1);

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
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold font-sora text-teal-400">Loading Tripvora Dashboard...</h2>
      </div>
    );
  }

  if (!realTripData) {
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center text-white space-y-4">
        <AlertCircle className="w-16 h-16 text-teal-400" />
        <h2 className="text-2xl font-bold">No Itinerary Found</h2>
        <p className="text-slate-400">Please generate a new trip in the planner.</p>
        <Link href="/trip-planner">
          <Button className="mt-4 bg-teal-500 text-slate-900 font-bold hover:bg-teal-400">Back to Planner</Button>
        </Link>
      </div>
    );
  }

  const trip = realTripData?.trip || realTripData || {};
  const days = realTripData?.days || trip?.days || [];
  const budget = realTripData?.budget || {};
  const weather = realTripData?.weather || {};
  const emergency = realTripData?.emergency || {};
  const destHub = trip.destination || "Destination";
  const totalDays = trip.totalDays || days?.length || 5;

  const currentDayData = days.find((d: any) => d.day === activeDay) || days[0];
  const activities = currentDayData?.activities || [];

  return (
    <div className="min-h-screen bg-[#050816] text-white font-inter flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0A0F24]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/trip-planner" className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10">
            <ArrowLeft className="w-5 h-5 text-slate-200" />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-sora text-white">{destHub}</h1>
            <p className="text-xs text-teal-400 font-bold tracking-wide uppercase">{totalDays} Day Journey</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button className="bg-teal-500 text-slate-900 font-bold hover:bg-teal-400 gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </header>

      {/* DASHBOARD LAYOUT */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDEBAR: DAY NAVIGATION */}
        <div className="lg:col-span-3 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Itinerary Timeline</h3>
          {days.map((dayObj: any) => (
            <button
              key={dayObj.day}
              onClick={() => setActiveDay(dayObj.day)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
                activeDay === dayObj.day 
                  ? "bg-teal-500/10 border border-teal-500/30 text-teal-400 shadow-[0_0_15px_rgba(20,241,217,0.1)]" 
                  : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold">Day {dayObj.day}</span>
                <span className="text-[10px] truncate max-w-[140px] opacity-80">{dayObj.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* MAIN CONTENT: DAY DETAILS */}
        <div className="lg:col-span-6 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Day Header */}
              <div className="bg-gradient-to-br from-slate-900 to-[#0A0F24] p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <h2 className="text-2xl font-bold font-sora text-white mb-2">{currentDayData.title}</h2>
                <p className="text-sm text-slate-400 max-w-md">Follow this optimized chronological route to make the most of your day.</p>
              </div>

              {/* Activities Timeline */}
              <div className="space-y-4">
                {activities.map((activity: any, idx: number) => (
                  <div key={idx} className="flex gap-4 group">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center z-10 group-hover:border-teal-400 transition-colors">
                        {activity.type === 'Breakfast' || activity.type === 'Lunch' || activity.type === 'Dinner' ? <Utensils className="w-3.5 h-3.5 text-teal-400" /> :
                         activity.type === 'Check-in' ? <Bed className="w-3.5 h-3.5 text-teal-400" /> :
                         <Compass className="w-3.5 h-3.5 text-teal-400" />}
                      </div>
                      {idx !== activities.length - 1 && (
                        <div className="w-0.5 h-full bg-white/5 my-1" />
                      )}
                    </div>

                    {/* Activity Card */}
                    <div className="flex-1 pb-6">
                      <div className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-colors">
                        {activity.imageUrl && (
                          <div className="w-full h-48 mb-4 rounded-xl overflow-hidden relative group/img">
                            <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                            {(activity.type === 'hotel' || activity.type === 'checkin') && (
                               <a href={`https://www.google.com/search?q=${encodeURIComponent(activity.name + " booking")}`} target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 text-teal-400 font-bold text-xs px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all shadow-lg flex items-center gap-2">Book Stay <ArrowRight className="w-3 h-3" /></a>
                            )}
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-bold text-teal-400 bg-teal-400/10 px-2 py-1 rounded mb-2 inline-block">
                              {activity.time}
                            </span>
                            <h4 className="text-lg font-bold text-white leading-tight">{activity.title || activity.name}</h4>
                          </div>
                          <span className="text-xs text-slate-400 flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
                            <Clock className="w-3 h-3" /> {activity.duration}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">{activity.description}</p>
                        
                        {(activity.cost || activity.walkingDistance) && (
                          <div className="flex gap-4 pt-3 border-t border-white/5 text-xs text-slate-400">
                            {activity.cost && <span>💰 Est. ₹{activity.cost}</span>}
                            {activity.walkingDistance && <span>🚶 {activity.walkingDistance}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT SIDEBAR: METRICS & CONTEXT */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Weather Widget */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-teal-400" /> Local Weather
            </h3>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-sora font-bold text-white">{weather?.temperature || 26}°C</p>
                <p className="text-sm text-slate-400 mt-1 capitalize">{weather?.currentWeather || "Clear Skies"}</p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p>Rain: {weather?.rainProbability || 10}%</p>
              </div>
            </div>
          </div>

          {/* Budget Widget */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total Budget</h3>
            <p className="text-2xl font-sora font-bold text-white">₹{budget?.planned?.toLocaleString('en-IN') || trip?.totalBudget?.toLocaleString('en-IN') || "0"}</p>
            <p className="text-xs text-slate-400 mt-2">Highly optimized based on your strict financial limits.</p>
          </div>

          {/* Emergency / Verified Data */}
          <div className="bg-teal-500/5 border border-teal-500/20 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Safety Network
            </h3>
            <div className="space-y-3 text-sm">
              {emergency?.hospital ? (
                <div>
                  <p className="text-slate-300 font-bold flex items-center gap-2">🏥 {emergency.hospital.name}</p>
                  <p className="text-xs text-slate-500 pl-6">{emergency.hospital.distanceKm.toFixed(1)} km away</p>
                </div>
              ) : (
                <p className="text-slate-500 text-xs">No primary hospital found within 10km.</p>
              )}
              {emergency?.police ? (
                <div>
                  <p className="text-slate-300 font-bold flex items-center gap-2">🚓 {emergency.police.name}</p>
                  <p className="text-xs text-slate-500 pl-6">{emergency.police.distanceKm.toFixed(1)} km away</p>
                </div>
              ) : (
                <p className="text-slate-500 text-xs">No local police station logged.</p>
              )}
              <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
                <p className="text-slate-400"><span className="text-teal-400">Police:</span> {emergency?.helplines?.police || 112}</p>
                <p className="text-slate-400"><span className="text-teal-400">Ambulance:</span> {emergency?.helplines?.ambulance || 102}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
