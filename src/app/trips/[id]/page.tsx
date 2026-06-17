"use client";

import { useParams } from "next/navigation";
import { 
  Sparkles, Calendar, Users, Wallet, Plane, Bed, 
  MapPin, CloudSun, PhoneCall, DollarSign, Compass, Star, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TripItineraryPage() {
  const params = useParams();
  const id = params.id as string;

  // Curated Trip data
  const trip = {
    title: "Bali Luxury Escape",
    destination: "Seminyak & Ubud, Bali",
    duration: "7 Days",
    party: "Couple Trip",
    budget: "₹85,000 / person",
    weather: "28°C / Sunny",
    emergency: { police: "112", medical: "118", touristHelp: "+62 361 751261" },
    timeline: [
      {
        day: "Day 1",
        title: "Sunset Temple & Coastal Dining",
        activities: [
          { time: "02:00 PM", name: "Check-in at Alila Villas Seminyak", desc: "Settle into your ocean-view luxury villa." },
          { time: "05:00 PM", name: "Uluwatu Sunset Temple Tour", desc: "Watch the spectacular Kecak Dance against the ocean sunset." },
          { time: "08:30 PM", name: "Dinner at Jimbaran Seafood Bay", desc: "Enjoy fresh grilled lobster candlelit on the beach." }
        ]
      },
      {
        day: "Day 2",
        title: "Ubud Culture & Sacred Forests",
        activities: [
          { time: "09:00 AM", name: "Sacred Monkey Forest Sanctuary", desc: "Walk through ancient mossy temples and feed local macaques." },
          { time: "01:00 PM", name: "Lunch at Locavore Ubud", desc: "Experience ingredient-led local fine dining." },
          { time: "03:30 PM", name: "Tegallalang Rice Terrace Swing", desc: "Walk the green terraced valley and enjoy the giant swings." }
        ]
      },
      {
        day: "Day 3",
        title: "Sunrise Volcano & Hot Springs",
        activities: [
          { time: "04:00 AM", name: "Mount Batur Sunrise Hike", desc: "Moderate early morning trek up to watch the sunrise above the clouds." },
          { time: "09:00 AM", name: "Toya Devasya Hot Springs", desc: "Soak in volcanic hot springs with infinity views of Lake Batur." }
        ]
      }
    ],
    flights: [
      { airline: "Singapore Airlines", code: "SQ-948", price: "₹34,200", status: "Recommended Deal", link: "https://www.skyscanner.co.in" },
      { airline: "Malindo Air", code: "OD-157", price: "₹22,800", status: "Cheapest Deal", link: "https://www.skyscanner.co.in" }
    ],
    hotels: [
      { name: "Alila Villas Uluwatu", rating: "5.0 Stars", price: "₹32,000 / night", desc: "Clifftop private pools, elite butler service.", link: "https://www.booking.com" },
      { name: "Maya Ubud Resort & Spa", rating: "4.8 Stars", price: "₹18,500 / night", desc: "Lush forest views, river suites, award spa.", link: "https://www.booking.com" }
    ],
    budgetBreakdown: [
      { name: "Flights & Visa", val: 35 },
      { name: "Stays & Resorts", val: 40 },
      { name: "Activities & Tours", val: 15 },
      { name: "Dining & Cabs", val: 10 }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pt-28 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Top Notification */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 flex items-center gap-3 mb-10 text-teal-800 text-xs font-bold leading-relaxed max-w-3xl">
          <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
          <span>Your custom itinerary has been generated successfully using verified travel listings and pricing.</span>
        </div>

        {/* Hero Summary Header */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-[0_10px_35px_rgba(15,23,42,0.02)] mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-1">Generated Trip Itinerary</span>
            <h1 className="text-3xl md:text-4xl font-black text-black font-sora tracking-tight mb-4">
              {trip.title}
            </h1>
            
            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{trip.duration}</span>
              </div>
              <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{trip.party}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-5 px-6 rounded-2xl text-right">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Estimated Budget</span>
            <span className="text-2xl font-black text-black">{trip.budget}</span>
          </div>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Chronological Timeline */}
          <div className="lg:col-span-8 space-y-10">
            
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-black font-sora mb-6">Daily Timeline</h3>
              
              <div className="border-l border-slate-100 ml-4 pl-6 space-y-10">
                {trip.timeline.map((dayItem, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline dot */}
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm" />
                    
                    <span className="text-[10px] font-black text-teal-600 tracking-widest uppercase block mb-1">{dayItem.day}</span>
                    <h4 className="text-lg font-bold text-black mb-4 font-sora">{dayItem.title}</h4>
                    
                    <div className="space-y-4">
                      {dayItem.activities.map((act, actIdx) => (
                        <div key={actIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{act.time}</span>
                          </div>
                          <h5 className="text-sm font-bold text-slate-800 mb-1">{act.name}</h5>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">{act.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Pricing Widgets, Flights, Hotels, Weather, Emergency */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Flights Deal */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Plane className="w-5 h-5 text-teal-600" />
                <h4 className="text-sm font-black text-slate-800 tracking-wider uppercase">Live Flights Booking</h4>
              </div>
              
              <div className="space-y-3 mb-4">
                {trip.flights.map((f, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100/60 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-800">{f.airline}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{f.code}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-bold text-teal-600">{f.price}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">{f.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <a href="https://www.skyscanner.co.in" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-black hover:bg-black/90 text-white rounded-xl py-3 text-xs font-bold transition-all h-10 border-none">
                  Search Flights on Skyscanner
                </Button>
              </a>
            </div>

            {/* Live Hotels Deal */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Bed className="w-5 h-5 text-teal-600" />
                <h4 className="text-sm font-black text-slate-800 tracking-wider uppercase">Recommended Hotels</h4>
              </div>
              
              <div className="space-y-3 mb-4">
                {trip.hotels.map((h, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100/60">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-800">{h.name}</span>
                      <span className="text-[9px] font-black text-teal-600">{h.price}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mb-1">{h.desc}</p>
                  </div>
                ))}
              </div>

              <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-slate-50 border border-slate-100 hover:bg-black hover:text-white hover:border-black text-black rounded-xl py-3 text-xs font-bold transition-all h-10">
                  Search Booking.com
                </Button>
              </a>
            </div>

            {/* Weather & Emergency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                <CloudSun className="w-5 h-5 text-teal-600 mx-auto mb-2" />
                <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Weather</span>
                <span className="text-sm font-bold text-slate-700 mt-1 block">{trip.weather}</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                <PhoneCall className="w-5 h-5 text-red-500 mx-auto mb-2 animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Emergency</span>
                <span className="text-sm font-bold text-slate-700 mt-1 block">{trip.emergency.police} (Police)</span>
              </div>
            </div>

            {/* Budget Breakdown */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-4">Budget Breakdown</h4>
              <div className="space-y-3">
                {trip.budgetBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs text-slate-700 font-bold mb-1">
                      <span>{item.name}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
