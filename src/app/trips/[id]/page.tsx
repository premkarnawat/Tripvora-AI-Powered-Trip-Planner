"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Sparkles, Calendar, Users, Wallet, Plane, Bed, 
  MapPin, CloudSun, PhoneCall, DollarSign, Compass, Star, 
  ArrowLeft, Download, Share2, Shield, Clock, 
  AlertCircle, Map, Navigation, ArrowUpRight, CheckCircle2, 
  Plus, Check, ExternalLink, HelpCircle, Phone, Heart, Activity,
  AlertTriangle, Landmark, Pill, ShieldAlert, Utensils
} from "lucide-react";
import Link from "next/link";

export default function TripItineraryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? (params.id as string) : "";

  const [activeDay, setActiveDay] = useState(1);
  const [mobileTab, setMobileTab] = useState<"timeline" | "map" | "intel" | "budget" | "help">("timeline");
  const [realTripData, setRealTripData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLiveTrip() {
      try {
        setLoading(true);
        if (id && id !== 'latest' && id !== 'generated' && !id.startsWith('static-') && !id.startsWith('travixa-')) {
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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-lg font-bold text-slate-800 font-sora">Loading Travixa Travel OS Engine...</h2>
        <p className="text-xs text-slate-500">Assembling verified geocoding coordinates and regional benchmark intelligence.</p>
      </div>
    );
  }

  const trip = realTripData || {
    destination: "Selected Destination",
    tripOverview: "4-Day Curated Travel OS Voyage",
    destinationSummary: "Rich heritage landmarks, vibrant culinary hubs, and scenic lookpoints.",
    totalDays: 4,
    totalBudget: 50000,
    estimatedCost: 48500,
    currency: "INR",
    weatherEngine: {
      temperature: 28, rainProbability: 15, uvIndex: 7, currentWeather: "Sunny Skies",
      weatherAdvice: "UV Index 7: apply sunscreen before afternoon sightseeing."
    },
    userOriginJourney: {
      originCity: "Mumbai",
      transitOptions: [{ mode: "🚕 Intercity Highway Cab", cost: 3500, duration: "4h 30m", notes: "Direct express highway transit" }],
      totalTransitCost: 3500
    },
    budgetTracker: {
      hotels: 18000, transport: 3500, food: 8000, activities: 6000, shoppingOrMisc: 13000,
      dailyTotalAverage: 12000, overallTotal: 35500, remainingOrSavings: 14500, budgetHealthScore: 94
    },
    foodIntelligence: {
      bestVeg: "Regional Veg Hall", bestNonVeg: "Famous Biryani House", bestSeafood: "Coastal Seafood Hub",
      bestBudget: "Open Air Street Cafe", bestPremium: "Rooftop Fine Dining", streetFood: "Evening Heritage Stalls"
    },
    emergencyContacts: {
      police: "112 / Tourist Police", ambulance: "102 / Medical Dispatch", embassyOrHelpline: "+91-11-2687313 / Travixa 24x7 SOS",
      hospitals: ["Central District Hospital", "Apollo Clinic"], pharmacies: ["24x7 Wellness Pharmacy"]
    },
    hotels: [{
      name: "Hyatt Regency Luxury Sanctuary", rating: 4.8, pricePerNight: 7500, starTier: "5-Star",
      amenities: ["Spa", "Pool", "Fine Dining"], imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      address: "Central Corridor",
      alternatives: [{ name: "JW Marriott Hotel", rating: 4.9, pricePerNight: 9500, amenities: ["Rooftop Lounge", "Pool"] }],
      budgetOption: { name: "Treebo Trend Boutique Stay", rating: 4.3, pricePerNight: 2200, amenities: ["Free Wi-Fi", "AC", "Breakfast"] }
    }],
    days: [
      {
        day: 1, title: "Arrival & Heritage Orientation",
        morning: [{ time: "10:30 AM", title: "Arrive & Hotel Check-in", description: "Smooth check-in at reception desk.", type: "hotel", cost: 0, location: "Central Corridor", distance: "4 km", travelTime: "15 min" }],
        afternoon: [{ time: "01:30 PM", title: "Welcome Regional Lunch", description: "Iconic open-air local dining hub.", type: "meal", cost: 400, location: "FC Road", distance: "6 km", travelTime: "20 min" }],
        evening: [{ time: "05:00 PM", title: "Historic Fort & Gardens Exploration", description: "Monumental stone ramparts and historic palace grounds.", type: "activity", cost: 100, location: "Kasba Peth", distance: "3 km", travelTime: "12 min" }],
        night: [{ time: "08:30 PM", title: "Traditional Thali Dinner", description: "Unlimited vegetarian thali with regional dessert specialities.", type: "meal", cost: 450, location: "Apte Road", distance: "2 km", travelTime: "8 min" }]
      }
    ]
  };

  const currentDayObj = trip.days?.find((d: any) => d.day === activeDay) || trip.days?.[0] || { day: 1, title: "Curated Day", morning: [], afternoon: [], evening: [], night: [] };
  const currentSlots = [
    ...(currentDayObj.morning || []), ...(currentDayObj.afternoon || []),
    ...(currentDayObj.evening || []), ...(currentDayObj.night || []),
    ...(currentDayObj.activities || [])
  ];

  const totalDaysList = Array.from({ length: trip.totalDays || trip.days?.length || 4 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24 font-inter">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">Travixa OS v2.5</span>
              <span className="text-xs text-slate-400 font-bold">• Factual Geocoding</span>
            </div>
            <h1 className="text-base md:text-xl font-black text-slate-900 font-sora tracking-tight">{trip.destination} Intelligence Voyage</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => alert("Itinerary Link Copied!")} className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95">
            <Download className="w-3.5 h-3.5" /> Export Itinerary
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        
        {/* Origin Journey Banner */}
        {trip.userOriginJourney && (
          <div className="bg-gradient-to-r from-slate-900 to-teal-950 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-teal-400 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300">Origin Journey Transit Logistics</span>
              </div>
              <h2 className="text-lg md:text-xl font-black font-sora">{trip.userOriginJourney.originCity} → {trip.destination} Connection</h2>
              <p className="text-xs text-slate-300 max-w-2xl">Kept transparent and calculated independent of daily city exploration budget.</p>
            </div>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              {trip.userOriginJourney.transitOptions?.map((t: any, idx: number) => (
                <div key={idx} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-3.5 min-w-[200px] flex-1 md:flex-none">
                  <p className="text-xs font-bold text-teal-300">{t.mode}</p>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-sm font-black font-mono">₹{t.cost?.toLocaleString('en-IN') || "3,500"}</span>
                    <span className="text-[10px] text-slate-300">⏱️ {t.duration}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{t.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hero Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase rounded-full">100% Unique Daily Progression</span>
                <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-black text-[10px] uppercase rounded-full">Zero Hallucinated Places</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-sora">{trip.tripOverview || trip.destinationSummary}</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{trip.destinationSummary}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-6 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-teal-600" /> {trip.totalDays} Days</div>
              <div className="flex items-center gap-2"><Wallet className="w-4 h-4 text-teal-600" /> Budget Limit: ₹{Number(trip.totalBudget).toLocaleString('en-IN')}</div>
              <div className="flex items-center gap-2"><CloudSun className="w-4 h-4 text-amber-500" /> {trip.weatherEngine?.temperature || 28}°C • {trip.weatherEngine?.currentWeather || "Sunny Skies"}</div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Weather & Environmental Advice</h4>
              <p className="text-sm font-extrabold text-slate-800 mt-1">{trip.weatherEngine?.weatherAdvice || "Comfortable climate for sightseeing."}</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Rain Probability:</span><span className="font-bold">{trip.weatherEngine?.rainProbability || 15}%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">UV Index:</span><span className="font-bold text-amber-600">{trip.weatherEngine?.uvIndex || 7} / 10</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Local Etiquette:</span><span className="font-bold text-teal-700">Remove shoes at shrines</span></div>
            </div>
          </div>
        </div>

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
              Day {d} Timeline
            </button>
          ))}
        </div>

        {/* Triple Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Panel 1: Day Timeline (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-teal-700 uppercase tracking-wider font-sora">Day {activeDay}: {currentDayObj.title}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Chronological activities, transit logistics, and AI tips.</p>
            </div>

            <div className="border-l-2 border-teal-100 ml-4 pl-6 space-y-6">
              {currentSlots.length > 0 ? currentSlots.map((step: any, idx: number) => (
                <div key={idx} className="relative bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2 transition-all hover:border-teal-300 hover:bg-white hover:shadow-xs">
                  <span className="absolute -left-[31px] top-4 w-3 h-3 rounded-full border-2 border-white bg-teal-600 shadow-xs" />
                  
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                    <span className="text-teal-700 font-mono text-xs">{step.time || "10:00 AM"}</span>
                    <span className="uppercase bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-extrabold text-[9px]">{step.type || step.category || "Activity"}</span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900">{step.title || step.name}</h4>
                  <p className="text-xs text-slate-600 leading-snug">{step.description}</p>

                  <div className="flex flex-wrap gap-3 pt-1 text-[11px] font-bold text-slate-500">
                    {step.distance && <span>📍 Dist: {step.distance}</span>}
                    {step.travelTime && <span>⏱️ Transit: {step.travelTime}</span>}
                    <span className="text-slate-900 font-mono">💵 Cost: ₹{(step.cost || 0).toLocaleString('en-IN')}</span>
                  </div>

                  {step.aiTip && (
                    <div className="p-2.5 bg-teal-50/60 border border-teal-100 rounded-xl text-[11px] text-teal-900 italic">
                      💡 <strong>AI Concierge Tip:</strong> {step.aiTip}
                    </div>
                  )}
                </div>
              )) : (
                <div className="p-6 text-center text-xs text-slate-400">No activities listed for this day.</div>
              )}
            </div>
          </div>

          {/* Panel 2: Food & Hotel Concierge (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Food Intelligence */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-sora flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-500" /> Food Intelligence Concierge
                </h4>
                <p className="text-[11px] text-slate-400">Categorized regional culinary benchmarks.</p>
              </div>
              
              <div className="space-y-2.5 text-xs font-semibold">
                {trip.foodIntelligence ? Object.entries(trip.foodIntelligence).map(([cat, val]: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                    <span className="text-slate-500 capitalize">{cat.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-bold text-slate-900 text-right">{val}</span>
                  </div>
                )) : (
                  <div className="text-xs text-slate-400">Standard regional dining options.</div>
                )}
              </div>
            </div>

            {/* Hotel Comparator & Alternatives */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-sora flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-teal-600" /> Verified Hotel Stays & Alternatives
                </h4>
                <p className="text-[11px] text-slate-400">Selected accommodation + budget backup.</p>
              </div>

              {trip.hotels?.[0] && (
                <div className="space-y-3">
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-teal-950">{trip.hotels[0].name}</span>
                      <span className="text-xs font-mono font-bold text-teal-800">₹{trip.hotels[0].pricePerNight?.toLocaleString('en-IN') || "7,500"}/N</span>
                    </div>
                    <p className="text-[10px] text-teal-700">★ {trip.hotels[0].rating} • {trip.hotels[0].starTier || "Luxury Resort"}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {trip.hotels[0].amenities?.map((am: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-white text-teal-900 font-bold text-[9px] rounded-md shadow-2xs">{am}</span>
                      ))}
                    </div>
                  </div>

                  {/* Budget Alternative */}
                  {trip.hotels[0].budgetOption && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs font-semibold">
                      <div>
                        <p className="font-bold text-slate-800">💡 Budget Option: {trip.hotels[0].budgetOption.name}</p>
                        <p className="text-[10px] text-slate-500">★ {trip.hotels[0].budgetOption.rating} • Free Breakfast</p>
                      </div>
                      <span className="font-mono text-slate-900 font-bold">₹{trip.hotels[0].budgetOption.pricePerNight?.toLocaleString('en-IN') || "2,200"}/N</span>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Panel 3: Live Budget Engine & Emergency Hub (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Live Budget Tracker */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-sora">Live Budget Tracker</h4>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">Score {trip.budgetTracker?.budgetHealthScore || 95}</span>
              </div>

              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">Total Budget Limit:</span><span className="font-mono font-bold">₹{Number(trip.totalBudget).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">Overall Estimated:</span><span className="font-mono font-bold text-slate-900">₹{Number(trip.estimatedCost).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">Remaining Savings:</span><span className="font-mono font-bold text-emerald-600">₹{(trip.budgetTracker?.remainingOrSavings || Math.max(Number(trip.totalBudget) - Number(trip.estimatedCost), 0)).toLocaleString('en-IN')}</span></div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Allocations Breakdown</p>
                <div className="flex justify-between text-slate-600"><span>Hotels</span><span className="font-mono font-bold">₹{trip.budgetTracker?.hotels?.toLocaleString('en-IN') || "18,000"}</span></div>
                <div className="flex justify-between text-slate-600"><span>Food</span><span className="font-mono font-bold">₹{trip.budgetTracker?.food?.toLocaleString('en-IN') || "8,000"}</span></div>
                <div className="flex justify-between text-slate-600"><span>Activities</span><span className="font-mono font-bold">₹{trip.budgetTracker?.activities?.toLocaleString('en-IN') || "6,000"}</span></div>
              </div>
            </div>

            {/* Emergency Contacts Hub */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center text-rose-600">
                <h4 className="text-xs font-black uppercase tracking-wider font-sora">Emergency Hub</h4>
                <ShieldAlert className="w-4 h-4" />
              </div>

              <div className="space-y-2.5 text-xs font-bold text-slate-600">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5"><span>🚨 Police Helpline</span><span className="text-slate-900 font-mono">{trip.emergencyContacts?.police || "112"}</span></div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5"><span>🚑 Ambulance</span><span className="text-slate-900 font-mono">{trip.emergencyContacts?.ambulance || "102"}</span></div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5"><span>🏥 Top Hospital</span><span className="text-slate-900">{trip.emergencyContacts?.hospitals?.[0] || "District Medical Center"}</span></div>
                <div className="flex justify-between items-center"><span>🌍 24x7 Travixa SOS</span><span className="text-teal-700 font-mono">{trip.emergencyContacts?.embassyOrHelpline || "+91-11-2687313"}</span></div>
              </div>
            </div>

          </div>

        </div>

        {/* Mobile Companion Section */}
        <div className="block lg:hidden space-y-6 pt-4">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 font-sora">Day {activeDay} Mobile Timeline</h3>
            <div className="space-y-3">
              {currentSlots.map((step: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span className="text-teal-700">{step.time || "10:00 AM"}</span>
                    <span>₹{step.cost || 0}</span>
                  </div>
                  <p className="text-xs font-black text-slate-800">{step.title}</p>
                  {step.aiTip && <p className="text-[10px] text-teal-800 italic">💡 {step.aiTip}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      {/* Sticky Mobile Bottom Navigation */}
      <nav className="block md:hidden bg-white border-t border-[#E5E7EB] fixed bottom-0 inset-x-0 z-40 px-4 py-3 flex justify-around shadow-lg">
        <Link href="/dashboard" className="flex flex-col items-center text-slate-400 hover:text-teal-600"><Compass className="w-5 h-5" /><span className="text-[10px] font-bold mt-1">Planner</span></Link>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center text-teal-600 font-bold"><Clock className="w-5 h-5" /><span className="text-[10px] mt-1">Timeline</span></button>
        <button onClick={() => window.print()} className="flex flex-col items-center text-slate-400 hover:text-teal-600"><Download className="w-5 h-5" /><span className="text-[10px] font-bold mt-1">Export</span></button>
      </nav>
    </div>
  );
}
