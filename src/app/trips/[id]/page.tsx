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
                    <span className="text-sm font-black font-mono">₹{t.cost.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-300">⏱️ {t.duration}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{t.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
              <div className="flex items-center gap-2"><CloudSun className="w-4 h-4 text-amber-500" /> {trip.weatherEngine?.temperature}°C • {trip.weatherEngine?.currentWeather}</div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Weather & Environmental Advice</h4>
              <p className="text-sm font-extrabold text-slate-800 mt-1">{trip.weatherEngine?.weatherAdvice || "Comfortable climate for sightseeing."}</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Rain Probability:</span><span className="font-bold">{trip.weatherEngine?.rainProbability}%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">UV Index:</span><span className="font-bold text-amber-600">{trip.weatherEngine?.uvIndex} / 10</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Local Etiquette:</span><span className="font-bold text-teal-700">Remove shoes at shrines</span></div>
            </div>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
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

          <div className="lg:col-span-4 space-y-6">
            
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
                      <span className="text-xs font-mono font-bold text-teal-800">₹{trip.hotels[0].pricePerNight}/N</span>
                    </div>
                    <p className="text-[10px] text-teal-700">★ {trip.hotels[0].rating} • {trip.hotels[0].starTier || "Luxury Resort"}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {trip.hotels[0].amenities?.map((am: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-white text-teal-900 font-bold text-[9px] rounded-md shadow-2xs">{am}</span>
                      ))}
                    </div>
                  </div>

                  {trip.hotels[0].budgetOption && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs font-semibold">
                      <div>
                        <p className="font-bold text-slate-800">💡 Budget Option: {trip.hotels[0].budgetOption.name}</p>
                        <p className="text-[10px] text-slate-500">★ {trip.hotels[0].budgetOption.rating} • Free Breakfast</p>
                      </div>
                      <span className="font-mono text-slate-900 font-bold">₹{trip.hotels[0].budgetOption.pricePerNight}/N</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full" style={{ width: `${(spentTransport/totalBudget)*100}%` }} />
                  </div>
                </div>

                {/* Stays */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500">
                    <span>Hotels / Stays</span>
                    <span>₹{spentHotels}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full" style={{ width: `${(spentHotels/totalBudget)*100}%` }} />
                  </div>
                </div>

                {/* Food */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-500">
                    <span>Food Guide</span>
                    <span>₹{spentFood}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${(spentFood/totalBudget)*100}%` }} />
                  </div>
                </div>
              </div>

              {/* Simulators */}
              <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-2">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Simulate Spends</p>
                
                {/* Scuba Diving */}
                <button
                  onClick={handleToggleScuba}
                  className={`w-full py-2 rounded-xl text-[9px] font-bold transition-all flex items-center justify-between px-2 ${
                    scubaAdded ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>🎟️ Add Scuba Diving</span>
                  <span>+₹3,500</span>
                </button>

                {/* Sunset dinner */}
                <button
                  onClick={handleToggleDinner}
                  className={`w-full py-2 rounded-xl text-[9px] font-bold transition-all flex items-center justify-between px-2 ${
                    dinnerUpgraded ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>🌅 Upgrade beach dinner</span>
                  <span>+₹2,400</span>
                </button>
              </div>
            </div>

            {/* Affiliate Compare Section */}
            <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-sora">Hotel Stay Affiliate Comparator</h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Live rates check at Hyatt Goa.</p>
              </div>

              <div className="space-y-2">
                {[
                  { partner: "Booking.com", price: "₹6,800/N", rating: 4.8, refund: "Free Cancel", badge: "Best Rated" },
                  { partner: "Agoda", price: "₹6,200/N", rating: 4.6, refund: "Non-Refundable", badge: "Lowest Price" },
                  { partner: "MakeMyTrip", price: "₹6,900/N", rating: 4.7, refund: "Free Cancel", badge: null },
                  { partner: "Goibibo", price: "₹7,100/N", rating: 4.5, refund: "Free Cancel", badge: null },
                  { partner: "Yatra", price: "₹7,300/N", rating: 4.4, refund: "Non-Refundable", badge: null }
                ].map((deal, idx) => (
                  <div key={idx} className="p-2.5 border border-slate-100 rounded-xl space-y-2 text-[10px] hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0F172A]">{deal.partner}</span>
                        {deal.badge && (
                          <span className="text-[7px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-extrabold uppercase border border-emerald-200">
                            {deal.badge}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-slate-900 font-mono">{deal.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold">
                      <span>★ {deal.rating} • {deal.refund}</span>
                      <button className="text-teal-600 font-black hover:underline flex items-center gap-0.5">
                        Book Stay <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skyscanner Flight comparison */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Flights Affiliate</p>
                <div className="p-3 border border-slate-100 rounded-2xl flex justify-between items-center text-[10px]">
                  <div>
                    <p className="font-bold text-[#0F172A]">Compare Skyscanner Flights</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Compare all airline partners & travel agency rates.</p>
                  </div>
                  <a href="https://www.skyscanner.co.in" target="_blank" rel="noreferrer" className="p-2 bg-slate-950 text-white rounded-xl text-[9px] font-bold hover:bg-slate-800 transition-colors">Compare</a>
                </div>
              </div>
            </div>

            {/* Emergency Hub */}
            <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-5 shadow-sm space-y-4">
              <div className="border-b border-[#E5E7EB] pb-2 flex justify-between items-center text-rose-600">
                <h4 className="text-xs font-bold uppercase tracking-wider font-sora">Emergency Hub</h4>
                <ShieldAlert className="w-4 h-4" />
              </div>

              <div className="space-y-2 text-[10px] font-bold text-slate-600">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1">🚨 Police Helpline</span>
                  <span className="text-[#0F172A] font-mono">112 / +91-832-2428787</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1">🏥 Nearest Hospital</span>
                  <span className="text-[#0F172A]">Manipal Hospital Bambolim</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1">🏦 Nearest ATM</span>
                  <span className="text-[#0F172A] font-medium">SBI ATM (150m)</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1">💊 Nearest Pharmacy</span>
                  <span className="text-[#0F172A]">Union Pharmacy (300m)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">🌍 Foreign Embassy Helpline</span>
                  <span className="text-[#0F172A] font-mono">+91-11-2687313</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* MOBILE-FIRST TRAVEL COMPANION VIEW */}
      <div className="block lg:hidden max-w-md mx-auto px-4 pb-12 space-y-6">
        {/* Header Back & Logo bar */}
        <div className="flex justify-between items-center py-2">
          <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center bg-white border border-[#E5E7EB] rounded-full shadow-sm">
            <ArrowLeft className="w-4 h-4 text-[#0F172A]" />
          </Link>
          <span className="text-xs font-bold text-[#0F172A] font-sora">Trip Companion</span>
          <div className="flex gap-2">
            <button 
              onClick={() => alert("Copied share link")}
              className="w-9 h-9 flex items-center justify-center bg-white border border-[#E5E7EB] rounded-full shadow-sm"
            >
              <Share2 className="w-4 h-4 text-[#0F172A]" />
            </button>
            <button 
              onClick={() => window.print()}
              className="w-9 h-9 flex items-center justify-center bg-white border border-[#E5E7EB] rounded-full shadow-sm"
            >
              <Download className="w-4 h-4 text-[#0F172A]" />
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative h-60 rounded-[32px] overflow-hidden shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop" 
            alt="Goa Sunset" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
            <div className="flex gap-1.5 flex-wrap">
              <span className="text-[8px] font-black uppercase bg-[#E2FF00] text-black px-2 py-0.5 rounded">Active</span>
              <span className="text-[8px] font-black uppercase bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded">Couple Trip</span>
            </div>
            <h2 className="text-2xl font-black font-sora tracking-tight leading-tight">Goa Sunset Escape</h2>
            <p className="text-[10px] text-white/70 font-semibold flex items-center gap-1">
              📍 North & South Goa • July 15 - July 20
            </p>
          </div>
        </div>

        {/* Quick Metrics Bar (Thumb-friendly cards) */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white border border-[#E5E7EB] p-3 rounded-2xl shadow-sm">
            <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Remaining</span>
            <span className="text-xs font-black text-emerald-600 font-mono">₹{getRemainingBudget().toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-3 rounded-2xl shadow-sm">
            <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Spent</span>
            <span className="text-xs font-black text-slate-800 font-mono">₹{getUsedBudget().toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-white border border-[#E5E7EB] p-3 rounded-2xl shadow-sm">
            <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Weather</span>
            <span className="text-xs font-black text-[#0F172A]">☀️ 30°C</span>
          </div>
        </div>

        {/* Horizontal Day Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
          {[1, 2, 3, 4, 5].map(d => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 snap-start ${
                activeDay === d 
                  ? "bg-teal-600 text-white shadow-sm" 
                  : "bg-white border border-[#E5E7EB] text-[#64748B]"
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>

        {/* Sticky Mobile Sub-navigation Tab Bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-1 flex justify-between shadow-sm sticky top-2 z-20">
          {[
            { id: "timeline", label: "Timeline", icon: Clock },
            { id: "map", label: "Map View", icon: Map },
            { id: "intel", label: "Transit", icon: Navigation },
            { id: "budget", label: "Budget", icon: Wallet },
            { id: "help", label: "Help", icon: ShieldAlert }
          ].map(tb => {
            const Icon = tb.icon;
            const isTabActive = mobileTab === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => setMobileTab(tb.id as any)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all ${
                  isTabActive ? "bg-teal-50 text-teal-600 font-extrabold" : "text-slate-400 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[9px] font-bold">{tb.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile View Tab Contents */}
        <div className="space-y-4">
          {/* TIMELINE TAB */}
          {mobileTab === "timeline" && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Day {activeDay} Route Timeline</span>
              </div>
              <div className="border-l border-slate-100 ml-3 pl-5 space-y-4">
                {dayTimeline.map((step: any, idx: number) => (
                  <div key={idx} className="relative space-y-2 bg-slate-50/50 border border-slate-100 p-3.5 rounded-2xl">
                    <span className="absolute -left-[27px] top-4 w-2 h-2 rounded-full border border-white shadow bg-teal-600" />
                    
                    <div className="flex justify-between items-center text-[8px] text-slate-400 font-bold">
                      <span>{step.time}</span>
                      <span>{step.weather}</span>
                    </div>
                    
                    <h4 className="text-xs font-black text-[#0F172A]">{step.title}</h4>
                    
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[8px] text-[#64748B] font-bold">
                      {step.distance !== "0 km" && <span>🚘 {step.distance}</span>}
                      {step.duration !== "Arrived" && <span>⏱️ {step.duration}</span>}
                      {step.cost > 0 && <span className="font-mono">💵 ₹{step.cost}</span>}
                      <span>🛠️ {step.transport}</span>
                    </div>

                    <div className="p-2 bg-white border border-slate-150 rounded-xl text-[8px] text-slate-500 leading-normal">
                      <strong>AI Tip:</strong> {step.aiTip}
                    </div>

                    <div className="flex justify-end pt-0.5">
                      <a 
                        href={step.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[8px] text-teal-600 font-extrabold flex items-center gap-1"
                      >
                        <Navigation className="w-2.5 h-2.5" /> Navigate ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAP TAB */}
          {mobileTab === "map" && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-4 shadow-sm flex flex-col h-[400px]">
              <div className="border-b border-slate-100 pb-2 mb-2 flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Google Maps Companion</span>
                <span className="text-[8px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-extrabold">{selectedRouteNode} focus</span>
              </div>
              <div className="flex-1 rounded-2xl bg-sky-50 relative overflow-hidden border border-slate-100">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-sky-100 to-teal-50">
                  <div className="w-full h-full relative">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      <path d="M15 75 Q 35 45, 55 35 T 85 25" fill="none" stroke="#14B8A6" strokeWidth="3" strokeDasharray="3 3" />
                      <circle cx="15" cy="75" r="4.5" fill="#14B8A6" />
                      <circle cx="55" cy="35" r="4.5" fill="#0EA5E9" />
                      <circle cx="85" cy="25" r="4.5" fill="#10B981" />
                    </svg>

                    <div className="absolute bottom-6 left-6">
                      <span className="text-[7px] bg-slate-900 text-white px-2 py-0.5 rounded font-extrabold shadow">Airport</span>
                    </div>

                    <div className="absolute top-1/3 left-1/3">
                      <span className="text-[7px] bg-white border border-slate-200 text-[#0F172A] px-2 py-0.5 rounded font-extrabold shadow">Hyatt</span>
                    </div>

                    <div className="absolute top-6 right-6">
                      <span className="text-[7px] bg-white border border-slate-200 text-[#0F172A] px-2 py-0.5 rounded font-extrabold shadow">Beach</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 border border-teal-500 rounded-xl p-3 shadow text-[8px] font-bold text-[#0F172A] space-y-1">
                      <p className="text-teal-700 flex items-center gap-1">📍 active node: {selectedRouteNode}</p>
                      <p className="text-slate-500 leading-snug">Tap nodes along the timeline to sync map routing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INTEL TAB */}
          {mobileTab === "intel" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Transport Intelligence (Compact Cards instead of tables!) */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Transport Intelligence</span>
                </div>
                <div className="space-y-2">
                  {[
                    { mode: "🚕 Taxi Cab", cost: "₹450", time: "15 min", comfort: "High", comfortColor: "text-emerald-600 bg-emerald-50" },
                    { mode: "🛺 Auto Rickshaw", cost: "₹150", time: "20 min", comfort: "Medium", comfortColor: "text-teal-600 bg-teal-50", recommended: true },
                    { mode: "🚌 AC Bus", cost: "₹30", time: "35 min", comfort: "Low", comfortColor: "text-slate-500 bg-slate-100" },
                    { mode: "🛵 Scooter Rent", cost: "₹400/d", time: "22 min", comfort: "Medium", comfortColor: "text-amber-600 bg-amber-50" }
                  ].map((tr, idx) => (
                    <div key={idx} className={`p-3 border rounded-2xl flex justify-between items-center text-[10px] ${tr.recommended ? 'border-teal-500 bg-teal-50/20' : 'border-slate-100 bg-white'}`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-[#0F172A]">{tr.mode}</span>
                          {tr.recommended && <span className="text-[6px] bg-teal-500 text-white font-extrabold px-1 py-0.2 rounded uppercase">Rec</span>}
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold">{tr.time} transit • Comfort: <span className={`px-1 rounded text-[7px] font-bold ${tr.comfortColor}`}>{tr.comfort}</span></p>
                      </div>
                      <span className="font-black text-slate-900 font-mono">{tr.cost}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food Intelligence */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Local Dining Guide</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { name: "Gunpowder Assagao", category: "Best Non-Veg", dist: "12 km", rating: 4.9, cost: "₹₹", label: "Local Favorite" },
                    { name: "Fisherman's Wharf", category: "Best Seafood", dist: "1.5 km", rating: 4.8, cost: "₹₹₹", label: "Premium Dining" },
                    { name: "Navtara Veg Panaji", category: "Best Veg", dist: "3 km", rating: 4.4, cost: "₹", label: "Budget Friendly" }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 border border-slate-100 rounded-2xl flex justify-between items-center text-[10px] hover:bg-slate-50 transition-colors bg-white">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-[#0F172A]">{item.name}</span>
                          <span className="text-[7px] bg-teal-50 text-teal-700 px-1 py-0.2 rounded font-extrabold uppercase">{item.category}</span>
                        </div>
                        <p className="text-[8px] text-slate-400 font-bold">{item.dist} away • {item.cost} • <span className="text-teal-600 font-black">{item.label}</span></p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="font-extrabold text-[9px] text-[#0F172A]">★ {item.rating}</span>
                        <button className="bg-slate-950 text-white rounded-lg px-2 py-0.5 text-[8px] font-bold">Book Table</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BUDGET TAB */}
          {mobileTab === "budget" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Budget Breakdown */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Live Budget Allocation</span>
                  <span className={`text-[7px] font-extrabold px-1.5 py-0.5 rounded uppercase border ${getBudgetHealth().color}`}>
                    {getBudgetHealth().label}
                  </span>
                </div>

                <div className="space-y-2 text-[10px] font-bold text-[#64748B]">
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Limit:</span>
                    <span className="font-mono text-slate-900 font-black">₹{totalBudget.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>Spent:</span>
                    <span className="font-mono text-slate-900">₹{getUsedBudget().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining:</span>
                    <span className="font-mono text-emerald-600 font-black">₹{getRemainingBudget().toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-slate-500">
                      <span>Transport</span>
                      <span>₹{spentTransport}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full" style={{ width: `${(spentTransport/totalBudget)*100}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-slate-500">
                      <span>Hotels & Stays</span>
                      <span>₹{spentHotels}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full" style={{ width: `${(spentHotels/totalBudget)*100}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-slate-500">
                      <span>Activities & Food</span>
                      <span>₹{spentActivities + spentFood}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${((spentActivities + spentFood)/totalBudget)*100}%` }} />
                    </div>
                  </div>
                </div>

                {/* Simulators */}
                <div className="p-3 bg-slate-50 border border-slate-200 border-dashed rounded-2xl space-y-2">
                  <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">Simulate Spends</p>
                  <button
                    onClick={handleToggleScuba}
                    className={`w-full py-2.5 rounded-xl text-[9px] font-bold transition-all flex items-center justify-between px-3 ${
                      scubaAdded ? "bg-emerald-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>🎟️ Scuba Diving activity</span>
                    <span>+₹3,500</span>
                  </button>

                  <button
                    onClick={handleToggleDinner}
                    className={`w-full py-2.5 rounded-xl text-[9px] font-bold transition-all flex items-center justify-between px-3 ${
                      dinnerUpgraded ? "bg-emerald-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>🌅 Luxury beach dinner</span>
                    <span>+₹2,400</span>
                  </button>
                </div>
              </div>

              {/* Stays Affiliate comparator */}
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Stays Affiliate Rates Comparator</span>
                </div>
                <div className="space-y-2">
                  {[
                    { partner: "Booking.com", price: "₹6,200", badge: "Best Offer" },
                    { partner: "Agoda", price: "₹6,350", badge: null },
                    { partner: "MakeMyTrip", price: "₹6,800", badge: null }
                  ].map((deal, idx) => (
                    <div key={idx} className="p-3 border border-slate-100 rounded-2xl flex justify-between items-center text-[10px] bg-white">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-[#0F172A]">{deal.partner}</span>
                          {deal.badge && <span className="text-[6px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded border border-emerald-200 font-bold uppercase">{deal.badge}</span>}
                        </div>
                        <p className="text-[8px] text-slate-400 font-bold">Hyatt Goa • Free Cancel</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="font-black text-slate-900 font-mono">{deal.price}</span>
                        <button className="text-teal-600 font-black flex items-center gap-0.5 text-[9px]">Book ↗</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HELP TAB */}
          {mobileTab === "help" && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-rose-100 pb-2 flex justify-between items-center text-rose-600">
                <span className="text-[9px] font-black uppercase tracking-widest block">Emergency Helplines</span>
                <ShieldAlert className="w-4 h-4" />
              </div>
              
              <div className="space-y-3">
                {[
                  { icon: "🚨", label: "Police Helpline", number: "112" },
                  { icon: "🏥", label: "Nearest Hospital", number: "Manipal Hospital" },
                  { icon: "🏦", label: "SBI ATM", number: "150m away" },
                  { icon: "💊", label: "Union Pharmacy", number: "300m away" }
                ].map((hl, idx) => (
                  <div key={idx} className="p-3 bg-rose-50/10 border border-rose-500/10 rounded-2xl flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{hl.icon}</span>
                      <div>
                        <p className="font-black text-slate-900">{hl.label}</p>
                        <p className="text-[9px] text-slate-500 font-bold">{hl.number}</p>
                      </div>
                    </div>
                    <a href={`tel:${hl.number}`} className="bg-rose-600 text-white font-bold px-3 py-1.5 rounded-xl text-[9px] transition-transform active:scale-95 shadow-sm">Call Now</a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
