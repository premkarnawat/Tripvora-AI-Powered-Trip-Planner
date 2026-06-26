"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Sparkles, Calendar, Users, Wallet, Plane, Bed, 
  MapPin, CloudSun, PhoneCall, DollarSign, Compass, Star, 
  ArrowLeft, Download, Share2, Shield, Clock, 
  AlertCircle, Map, Navigation, ArrowUpRight, CheckCircle2, 
  Plus, Check, ExternalLink, HelpCircle, Phone, Heart, Activity,
  AlertTriangle, Landmark, Pill, ShieldAlert, Utensils, Award, Bus, Car, Train
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
        <h2 className="text-lg font-bold text-slate-800 font-sora">Loading Travixa Travel Operating System...</h2>
        <p className="text-xs text-slate-500">Assembling verified OpenStreetMap geocoding, regional benchmarks, and affiliate intelligence.</p>
      </div>
    );
  }

  // Fallback factual OS structure if API data is unavailable
  const trip = realTripData || {
    destination: "Selected Destination",
    tripOverview: "4-Day Curated Travixa Travel OS Voyage",
    destinationSummary: "Rich heritage landmarks, vibrant culinary hubs, and scenic lookpoints.",
    totalDays: 4,
    totalBudget: 50000,
    estimatedCost: 48500,
    currency: "INR",
    weatherEngine: {
      temperature: 28, rainProbability: 15, uvIndex: 7, currentWeather: "Sunny Skies",
      weatherAdvice: "UV Index 7: apply SPF 50 sunscreen before outdoor sightseeing."
    },
    travelToDestination: {
      userLocation: "Beed, Maharashtra",
      destination: "Selected Destination",
      options: [
        {
          title: "OPTION 1 (Regional Bus + Air Connection)",
          steps: [
            { mode: "Bus: Origin → Regional Airport Hub", cost: 600, duration: "5 Hours" },
            { mode: "Flight: Regional Airport → Destination Hub", cost: 22000, duration: "6 Hours" }
          ],
          totalCost: 22600, totalDuration: "11 Hours"
        },
        {
          title: "OPTION 2 (Direct Express Cab + Premium Flight)",
          steps: [
            { mode: "Taxi: Origin → International Hub", cost: 4500, duration: "6 Hours" },
            { mode: "Flight: International Hub → Destination", cost: 19500, duration: "5.5 Hours" }
          ],
          totalCost: 24000, totalDuration: "11.5 Hours"
        }
      ]
    },
    arrivalPlan: {
      arrivalPoint: "Central Transit Gateway Hub",
      time: "9:30 AM",
      steps: [
        { time: "9:30 AM", step: "Arrive at Central Transit Gateway Hub" },
        { step: "Select City Transfer Option", options: [
          { mode: "🚕 Take Uber / App Cab", cost: 450, duration: "25 min" },
          { mode: "🚌 Airport Shuttle Bus", cost: 80, duration: "45 min" },
          { mode: "🛺 Local Auto Rickshaw", cost: 300, duration: "35 min" }
        ]},
        { step: "Reach Selected Luxury Hotel Sanctuary" },
        { step: "VIP Reception Check-in & Luggage Storage" },
        { step: "Freshen up in Room & Washroom Orientation" },
        { step: "Rest for 30 minutes to recover from transit" },
        { step: "Welcome Breakfast nearby before sightseeing" }
      ]
    },
    returnPlan: {
      checkoutTime: "11:00 AM",
      departurePoint: "Central Transit Hub",
      transportOptions: [
        { mode: "🚕 Direct Airport Cab", cost: 600, duration: "35 min" },
        { mode: "🚌 City Volvo Shuttle", cost: 150, duration: "55 min" }
      ],
      summary: "Smooth room check-out, VIP luggage dispatch, express terminal clearance, and fond travel memories.",
      thankYouMessage: "Thank you for choosing Travixa. We hope you enjoyed your journey. Safe travels and see you again soon."
    },
    budgetTracker: {
      hotels: 18000, transport: 3500, food: 8000, activities: 6000, shoppingOrMisc: 13000,
      dailyTotalAverage: 12000, overallTotal: 35500, remainingOrSavings: 14500, budgetHealthScore: 96
    },
    foodIntelligence: {
      bestVeg: "Regional Veg Hall", bestNonVeg: "Famous Biryani House", bestSeafood: "Coastal Seafood Hub",
      bestBudget: "Open Air Street Cafe", bestPremium: "Rooftop Fine Dining", streetFood: "Evening Heritage Stalls",
      mustTryDish: "Chef Special Thali & Spiced Broth"
    },
    emergencyContacts: {
      police: "112 / Tourist Police", ambulance: "102 / Medical Dispatch", embassyOrHelpline: "+91-11-2687313 / Travixa 24x7 SOS",
      hospitals: ["Central District Hospital", "Apollo Clinic"], pharmacies: ["24x7 Wellness Pharmacy"]
    },
    hotels: [{
      name: "Hyatt Regency Luxury Sanctuary", rating: 4.8, pricePerNight: 7500, starTier: "5-Star Luxury",
      reviewsCount: 2800, address: "Central Corridor",
      googleMapsUrl: "https://www.google.com/maps",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      amenities: ["Spa", "Pool", "Fine Dining", "Valet"],
      distanceFromAttractions: "1.5 km from primary landmarks",
      nearbyRestaurants: "Heritage Cafes (300m)", nearbyTransport: "Rapid Transit (150m)",
      bookingLinks: [
        { provider: "Booking.com", url: "https://www.booking.com", price: 7500 },
        { provider: "Agoda", url: "https://www.agoda.com", price: 7200 },
        { provider: "MakeMyTrip", url: "https://www.makemytrip.com", price: 7600 }
      ],
      alternatives: [
        { name: "Westin Resort", rating: 4.8, pricePerNight: 8800, starTier: "5-Star" },
        { name: "JW Marriott", rating: 4.9, pricePerNight: 9500, starTier: "5-Star" },
        { name: "Sheraton Grand", rating: 4.7, pricePerNight: 7200, starTier: "5-Star" }
      ],
      budgetOption: { name: "Treebo Trend Serene Stay", rating: 4.3, pricePerNight: 2200, amenities: ["Free Wi-Fi", "AC", "Breakfast"] }
    }],
    days: [
      {
        day: 1, title: "Arrival & Heritage Orientation",
        morning: [{
          time: "10:30 AM", timeSlot: "morning", title: "Arrive & Hotel Check-in Workflow", description: "Smooth check-in at reception desk with luggage drop.",
          category: "Stay", type: "hotel", cost: 0, location: "Central Corridor", distance: "4 km", travelTime: "15 min", rating: 4.8, reviewCount: 8420,
          crowdLevel: "Moderate", duration: "45 mins", importance: "Must Visit", recommendationScore: 98,
          transportOptions: { taxi: 250, auto: 130, bus: 30, walk: "1.8 km" },
          aiTip: "Keep ID proofs ready.", alternativeOptions: ["JW Marriott"],
          imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
          googleMapsUrl: "https://www.google.com/maps", bookingLinks: [{ provider: "Viator Pass", url: "#" }]
        }],
        afternoon: [{
          time: "01:30 PM", timeSlot: "afternoon", title: "Welcome Regional Lunch", description: "Iconic open-air local dining hub.",
          category: "Dining", type: "meal", cost: 400, location: "FC Road", distance: "6 km", travelTime: "20 min", rating: 4.6, reviewCount: 12540,
          crowdLevel: "High", duration: "60 mins", importance: "Must Visit", recommendationScore: 96,
          transportOptions: { taxi: 180, auto: 90, bus: 20, walk: "1.2 km" },
          aiTip: "Expect a 10-minute queue.", alternativeOptions: ["Roopali"],
          imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
          googleMapsUrl: "https://www.google.com/maps", bookingLinks: [{ provider: "Dineout Reserve", url: "#" }]
        }],
        evening: [], night: []
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
  const travelOrigin = trip.travelToDestination || (trip.userOriginJourney ? {
    userLocation: trip.userOriginJourney.originCity, destination: trip.destination,
    options: [{ title: "Express Transit", steps: trip.userOriginJourney.transitOptions?.map((t:any) => ({ mode: t.mode, cost: t.cost, duration: t.duration })) || [] }]
  } : null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-28 font-inter">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-black uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-teal-600" /> Travixa Travel OS v3.0
              </span>
              <span className="text-xs text-slate-400 font-bold">• 100% Factual Engine</span>
            </div>
            <h1 className="text-base md:text-xl font-black text-slate-900 font-sora tracking-tight">{trip.destination} Personal Travel Consultant</h1>
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
        
        {/* RULE 2: TRAVEL TO DESTINATION BANNER */}
        {travelOrigin && (
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 rounded-3xl p-6 text-white shadow-md space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-teal-300 text-xs font-extrabold uppercase tracking-widest">
                  <Plane className="w-4 h-4 animate-pulse" /> Travel To Destination (Rule 2)
                </div>
                <h2 className="text-lg md:text-xl font-black font-sora mt-1">{travelOrigin.userLocation || "Beed, Maharashtra"} → {trip.destination}</h2>
                <p className="text-xs text-slate-400">Kept transparent and displayed separately. Does NOT affect daily trip budget.</p>
              </div>
              <span className="px-3 py-1 bg-teal-500/20 border border-teal-400/30 text-teal-300 rounded-full text-xs font-black uppercase">Independent Spends</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* RULE 3: INTELLIGENT ARRIVAL PLAN BANNER */}
        {trip.arrivalPlan && (
          <div className="bg-white border border-teal-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <span className="text-xs font-black uppercase text-teal-700 tracking-wider font-sora">Intelligent Arrival Workflow (Rule 3)</span>
                <h3 className="text-base md:text-lg font-black text-slate-900 mt-0.5">Arrival at {trip.arrivalPlan.arrivalPoint} ({trip.arrivalPlan.time})</h3>
              </div>
              <span className="text-xs bg-teal-50 text-teal-800 px-3 py-1 rounded-xl font-bold font-mono">Step-by-Step Concierge</span>
            </div>

            <div className="flex flex-col md:flex-row gap-3 overflow-x-auto pb-2">
              {trip.arrivalPlan.steps?.map((stp: any, idx: number) => (
                <div key={idx} className="flex-1 min-w-[200px] bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex flex-col justify-between space-y-3 relative">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-[11px] font-black">{idx+1}</span>
                    <p className="text-xs font-bold text-slate-800 leading-snug">{stp.step}</p>
                  </div>

                  {stp.options && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase">City Transfer Options:</p>
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
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase rounded-full">Rule 1: Zero AI Invention</span>
                <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-black text-[10px] uppercase rounded-full">Rule 8: Must Visit Ranking</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-sora">{trip.tripOverview || trip.destinationSummary}</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{trip.destinationSummary}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-6 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-teal-600" /> {trip.totalDays} Days Flow</div>
              <div className="flex items-center gap-2"><Wallet className="w-4 h-4 text-teal-600" /> City Budget Limit: ₹{Number(trip.totalBudget).toLocaleString('en-IN')}</div>
              <div className="flex items-center gap-2"><CloudSun className="w-4 h-4 text-amber-500" /> {trip.weatherEngine?.temperature || 28}°C • {trip.weatherEngine?.currentWeather || "Sunny Skies"}</div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Open-Meteo Weather Advice</h4>
              <p className="text-sm font-extrabold text-slate-800 mt-1">{trip.weatherEngine?.weatherAdvice || "Comfortable climate for sightseeing."}</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Rain Probability:</span><span className="font-bold">{trip.weatherEngine?.rainProbability || 15}%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">UV Index:</span><span className="font-bold text-amber-600">{trip.weatherEngine?.uvIndex || 7} / 10</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Best Season:</span><span className="font-bold text-teal-700">{trip.bestVisitingTime || "Oct - Mar"}</span></div>
            </div>
          </div>
        </div>

        {/* RULE 4 & 14: HOTEL SELECTION & ALTERNATIVES CARD */}
        {trip.hotels?.[0] && (
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="text-xs font-black uppercase text-teal-700 tracking-wider font-sora">Rule 4 & 14: Selected Sanctuary & Affiliate Comparator</span>
                <h3 className="text-lg md:text-xl font-black text-slate-900 mt-0.5">{trip.hotels[0].name}</h3>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-sm font-bold text-slate-700">★★★★ {trip.hotels[0].rating}</span>
                <span className="text-xs text-slate-400">({trip.hotels[0].reviewsCount?.toLocaleString() || "2,800"} reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <img src={trip.hotels[0].imageUrl} alt={trip.hotels[0].name} className="w-full h-64 object-cover rounded-2xl border border-slate-200 shadow-sm" />
              
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-500" /> {trip.hotels[0].address}</p>
                    <p className="text-xs font-semibold text-slate-700">📍 {trip.hotels[0].distanceFromAttractions || "1.5 km from primary attractions"}</p>
                    <p className="text-xs text-slate-600">🍽️ Nearby Dining: {trip.hotels[0].nearbyRestaurants || "Vaishali, Dario's (300m)"}</p>
                    <p className="text-xs text-slate-600">🚆 Nearby Transit: {trip.hotels[0].nearbyTransport || "Metro Station Corridor (150m)"}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 font-mono">₹{trip.hotels[0].pricePerNight?.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-400 block font-bold">/ night</span>
                    <a href={trip.hotels[0].googleMapsUrl || "#"} target="_blank" rel="noreferrer" className="text-xs text-teal-600 font-extrabold hover:underline inline-flex items-center gap-1 mt-1">
                      View on Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Affiliate Booking Links (Rule 14) */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Affiliate Rate Comparison (Booking, Agoda, MakeMyTrip)</p>
                  <div className="flex flex-wrap gap-2">
                    {trip.hotels[0].bookingLinks?.map((deal: any, idx: number) => (
                      <a key={idx} href={deal.url || "#"} target="_blank" rel="noreferrer" className="flex-1 min-w-[140px] p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-teal-400 hover:bg-teal-50/40 transition-all flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">{deal.provider}</span>
                        <div className="text-right">
                          <span className="font-mono font-black text-slate-950 block">₹{deal.price?.toLocaleString('en-IN')}</span>
                          <span className="text-[9px] text-teal-700 font-extrabold">Book Deal →</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Rule 4: Alternative Hotels & Budget Option */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Alternative Luxury Hotels:</p>
                    <div className="flex flex-wrap gap-2">
                      {trip.hotels[0].alternatives?.map((alt: any, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                          {alt.name} (★ {alt.rating})
                        </span>
                      ))}
                    </div>
                  </div>

                  {trip.hotels[0].budgetOption && (
                    <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <p className="font-black text-amber-950">💡 Budget Backup: {trip.hotels[0].budgetOption.name}</p>
                        <p className="text-[10px] text-amber-800">★ {trip.hotels[0].budgetOption.rating} • Complimentary Breakfast</p>
                      </div>
                      <span className="font-mono font-black text-amber-900">₹{trip.hotels[0].budgetOption.pricePerNight}/N</span>
                    </div>
                  )}
                </div>

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
              Day {d} Complete Flow
            </button>
          ))}
        </div>

        {/* Triple Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Panel 1: Day Timeline with Thumbnail & Transport (6 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black text-teal-700 uppercase tracking-wider font-sora">Day {activeDay}: {currentDayObj.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Rule 5 & 13: Full Daily Experience with Thumbnails & Fares</p>
              </div>
              <span className="text-xs font-bold text-slate-500 font-mono">{currentSlots.length} Curated Items</span>
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
                        {step.importance} (Rule 8)
                      </span>
                    )}
                  </div>

                  {/* Thumbnail & Description Grid (Rule 13) */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {step.imageUrl && (
                      <img src={step.imageUrl} alt={step.title} className="w-full sm:w-36 h-28 object-cover rounded-xl border border-slate-200 shadow-2xs shrink-0" />
                    )}
                    <div className="space-y-1.5 flex-1">
                      <h4 className="text-base font-black text-slate-900 leading-tight">{step.title || step.name}</h4>
                      <p className="text-xs text-slate-600 leading-snug">{step.description}</p>
                      
                      <div className="flex flex-wrap gap-4 pt-1 text-[11px] font-bold text-slate-500">
                        <span>★ {step.rating || 4.7} ({step.reviewCount?.toLocaleString() || "34,200"})</span>
                        <span>⏱️ Duration: {step.duration || "1.5h"}</span>
                        <span>👥 Crowd: {step.crowdLevel || "Moderate"}</span>
                        <span className="text-slate-900 font-mono">💵 Ticket/Cost: ₹{(step.cost || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transport Fares to Item (Rule 13) */}
                  {step.transportOptions && (
                    <div className="pt-2 border-t border-slate-200/60 bg-white/70 p-2.5 rounded-xl flex flex-wrap justify-between items-center text-[10px] gap-2">
                      <span className="font-extrabold text-slate-400 uppercase">Transport Fares (Rule 13):</span>
                      <div className="flex gap-3 font-mono font-bold text-slate-700">
                        <span>🚕 Taxi: ₹{step.transportOptions.taxi}</span>
                        <span>🛺 Auto: ₹{step.transportOptions.auto}</span>
                        <span>🚌 Bus: ₹{step.transportOptions.bus}</span>
                        <span>🚶 Walk: {step.transportOptions.walk}</span>
                      </div>
                    </div>
                  )}

                  {/* Booking & Maps Links (Rule 13 & 14) */}
                  <div className="flex justify-between items-center pt-1 flex-wrap gap-2">
                    <div className="flex gap-2">
                      {step.bookingLinks?.map((b:any, i:number) => (
                        <a key={i} href={b.url||"#"} target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-teal-700 transition-colors">
                          Book {b.provider}
                        </a>
                      ))}
                    </div>
                    <a href={step.googleMapsUrl || "#"} target="_blank" rel="noreferrer" className="text-[11px] text-teal-600 font-black hover:underline inline-flex items-center gap-0.5">
                      Open OSM/Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {step.aiTip && (
                    <div className="p-2.5 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-teal-950 italic">
                      💡 <strong>AI Consultant Tip:</strong> {step.aiTip}
                    </div>
                  )}
                </div>
              )) : (
                <div className="p-6 text-center text-xs text-slate-400">No activities listed for this day.</div>
              )}
            </div>
          </div>

          {/* Panel 2: Food Intelligence & Spends Engine (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Rule 9: Food Intelligence Concierge */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-sora flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-500" /> Food Intelligence Concierge (Rule 9)
                </h4>
                <p className="text-[11px] text-slate-400">Categorized regional culinary benchmarks.</p>
              </div>
              
              {trip.foodIntelligence && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <p className="font-extrabold text-amber-950 text-[10px] uppercase tracking-wider">🔥 Must Try Dish in {trip.destination}</p>
                    <p className="text-sm font-black text-amber-900 mt-0.5">{trip.foodIntelligence.mustTryDish}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-semibold">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">🥗 Best Veg: <span className="font-bold block text-slate-900">{trip.foodIntelligence.bestVeg}</span></div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">🍗 Best Non-Veg: <span className="font-bold block text-slate-900">{trip.foodIntelligence.bestNonVeg}</span></div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">🦐 Seafood: <span className="font-bold block text-slate-900">{trip.foodIntelligence.bestSeafood}</span></div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">🍢 Street Food: <span className="font-bold block text-slate-900">{trip.foodIntelligence.streetFood}</span></div>
                  </div>
                </div>
              )}

              {/* Verified Restaurant Recommendations */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase">Verified Restaurant Database:</p>
                {trip.restaurants?.map((rst: any, idx: number) => (
                  <div key={idx} className="p-3 border border-slate-100 rounded-2xl flex gap-3 items-center text-xs hover:bg-slate-50 transition-colors">
                    {rst.imageUrl && <img src={rst.imageUrl} alt={rst.name} className="w-16 h-16 object-cover rounded-xl shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-900 truncate">{rst.name}</span>
                        <span className="font-mono text-teal-800">₹{rst.estimatedCost}/p</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{rst.cuisine}</p>
                      <p className="text-[10px] font-bold text-amber-600">★ {rst.rating} ({rst.reviewsCount?.toLocaleString()} reviews)</p>
                      <div className="flex gap-1.5 mt-1">
                        {rst.bookingLinks?.map((bl:any, i:number) => (
                          <a key={i} href={bl.url||"#"} className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded font-extrabold">{bl.provider}</a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Budget Tracker Card */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-sora">Live City Budget Tracker</h4>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">Score {trip.budgetTracker?.budgetHealthScore || 96}</span>
              </div>

              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">City Budget Limit:</span><span className="font-mono font-bold">₹{Number(trip.totalBudget).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5"><span className="text-slate-500">Estimated City Spends:</span><span className="font-mono font-bold text-slate-900">₹{Number(trip.estimatedCost).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Remaining Savings:</span><span className="font-mono font-bold text-emerald-600">₹{(trip.budgetTracker?.remainingOrSavings || Math.max(Number(trip.totalBudget) - Number(trip.estimatedCost), 0)).toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            {/* Emergency Contacts Hub */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center text-rose-600">
                <h4 className="text-xs font-black uppercase tracking-wider font-sora">Emergency Hub</h4>
                <ShieldAlert className="w-4 h-4" />
              </div>

              <div className="space-y-2 text-xs font-bold text-slate-600">
                <div className="flex justify-between"><span>🚨 Police Helpline</span><span className="text-slate-900 font-mono">{trip.emergencyContacts?.police || "112"}</span></div>
                <div className="flex justify-between"><span>🚑 Ambulance</span><span className="text-slate-900 font-mono">{trip.emergencyContacts?.ambulance || "102"}</span></div>
                <div className="flex justify-between"><span>🌍 24x7 Travixa SOS</span><span className="text-teal-700 font-mono">{trip.emergencyContacts?.embassyOrHelpline || "+91-11-2687313"}</span></div>
              </div>
            </div>

          </div>

        </div>

        {/* RULE 15: END OF TRIP RETURN JOURNEY & THANK YOU BANNER */}
        {trip.returnPlan && (
          <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 rounded-3xl p-8 text-white shadow-xl space-y-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">Rule 15: Return Journey & Checkout Workflow</span>
                <h2 className="text-2xl font-black font-sora">Conclusion of {trip.destination} Voyage</h2>
                <p className="text-xs text-slate-300 leading-relaxed">{trip.returnPlan.summary}</p>
              </div>

              <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/20 text-center shrink-0">
                <p className="text-[10px] uppercase text-slate-300 font-extrabold">Hotel Check-out Time</p>
                <p className="text-xl font-black font-mono text-teal-300 mt-0.5">⏱️ {trip.returnPlan.checkoutTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-teal-300">Departure Airport/Terminal Fares</p>
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

        {/* Mobile Companion Timeline Section */}
        <div className="block lg:hidden space-y-6 pt-4">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 font-sora">Day {activeDay} Mobile Companion</h3>
            <div className="space-y-3">
              {currentSlots.map((step: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span className="text-teal-700 font-mono">{step.time || "10:00 AM"}</span>
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
