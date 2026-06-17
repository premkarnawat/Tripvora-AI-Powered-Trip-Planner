"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { 
  Compass, MapPin, Calendar, Wallet, Landmark, 
  Utensils, Car, ClipboardList, Bed, Sparkles, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DestinationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeSec, setActiveSec] = useState("overview");

  // Mock data mapping
  const destinationDetails: Record<string, any> = {
    "bali": {
      name: "Bali",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
      overview: "Bali is a world-famous Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple, and enjoys a warm, tropical climate year-round.",
      bestTime: "April to October (Dry season offers excellent surfing and beach weather).",
      budgetRange: "₹45,000 - ₹95,000 per person, depending on stay preference.",
      attractions: ["Uluwatu Temple", "Tegallalang Rice Terraces", "Mount Batur Volcano", "Seminyak Beach"],
      food: "Nasi Goreng, Babi Guling, Sate Lilit, and fresh tropical fruit juices.",
      transportation: "Scooter rentals are highly popular for couples/solo travelers. Private drivers or local Bluebird cabs are best for families.",
      itinerary: [
        { day: "Day 1", title: "South Bali Exploration", desc: "Arrive, check into your beach resort in Seminyak, explore local boutiques, and watch the sunset at Uluwatu Temple." },
        { day: "Day 2", title: "Cultural Heart of Bali", desc: "Drive to Ubud, hike the Campuhan Ridge walk, visit the Sacred Monkey Forest, and dine at a traditional organic warung." },
        { day: "Day 3", title: "Sunrise Volcano Trek", desc: "Hike Mount Batur at sunrise, relax in local natural hot springs, and visit coffee plantations in Kintamani." }
      ],
      nearby: ["Nusa Penida Island", "Lombok", "Gili Islands"],
      hotels: ["The Udaya Resorts", "Maya Ubud Resort & Spa", "Alila Villas Uluwatu"],
      activities: ["Surfing lessons", "Balinese cooking class", "Scuba diving at Tulamben shipwreck"]
    },
    "swiss-alps": {
      name: "Swiss Alps",
      country: "Switzerland",
      image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=1200&auto=format&fit=crop",
      overview: "The Swiss Alps form a spectacular spine across south-central Europe. Home to the iconic Matterhorn peak, world-class ski trails, and crystal-clear mountain lakes, it is the ultimate alpine adventure destination.",
      bestTime: "June to September for hiking, December to March for snowsports.",
      budgetRange: "₹1,80,000 - ₹3,50,000 per person.",
      attractions: ["The Matterhorn peak", "Jungfraujoch Sphinx Observatory", "Lake Geneva", "Interlaken Lakes"],
      food: "Cheese Fondue, Raclette, Rösti (crispy potato pancake), and fine Swiss chocolate.",
      transportation: "The Swiss Travel Pass offers unlimited travel by trains, buses, and boats across the entire country.",
      itinerary: [
        { day: "Day 1", title: "Arrival in Zurich & Transfer", desc: "Arrive in Zurich, take the scenic train ride to Interlaken, and check into your chalet overlooking the lakes." },
        { day: "Day 2", title: "Top of Europe", desc: "Take the mountain railway up to Jungfraujoch, the highest railway station in Europe, and explore the Ice Palace." },
        { day: "Day 3", title: "Zermatt & Matterhorn Views", desc: "Travel to Zermatt, take the Gornergrat cog railway for legendary Matterhorn vistas, and enjoy Alpine Fondue." }
      ],
      nearby: ["Geneva", "Lucerne", "Chamonix (France)"],
      hotels: ["The Chedi Andermatt", "Omnia Hotel Zermatt", "Badrutt's Palace"],
      activities: ["Glacier hiking", "Skiing and Snowboarding", "Paragliding over Interlaken"]
    }
  };

  const item = destinationDetails[id] || destinationDetails["bali"];

  const sections = [
    { id: "overview", label: "Overview", icon: Compass },
    { id: "attractions", label: "Attractions", icon: Landmark },
    { id: "itinerary", label: "Sample Itinerary", icon: ClipboardList },
    { id: "practical", label: "Practical Info", icon: Car }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pb-20 font-sans">
      
      {/* Hero Header with Parallax */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden flex items-end">
        <img 
          src={item.image} 
          alt={item.name} 
          className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="max-w-[1200px] w-full mx-auto px-4 md:px-6 relative z-10 text-white pb-8 md:pb-12">
          <div className="flex items-center gap-1 text-xs text-white/60 font-bold uppercase tracking-wider mb-2">
            <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E2FF00]">{item.name}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-sora leading-tight tracking-tight mb-2">
            {item.name}
          </h1>
          <span className="inline-block text-sm md:text-base font-medium text-slate-300">
            {item.country}
          </span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 mt-12">
        
        {/* Section Navigation Tabs */}
        <div className="flex gap-4 border-b border-slate-200/60 pb-3 mb-10 overflow-x-auto scrollbar-hide">
          {sections.map((sec) => {
            const active = sec.id === activeSec;
            const IconComp = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSec(sec.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                  active 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-slate-500 border-slate-200/60 hover:border-slate-400'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Content Details based on selected tab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            
            {activeSec === "overview" && (
              <div className="bg-white rounded-[28px] p-8 border border-slate-100/80 shadow-[0_4px_20px_rgba(15,23,42,0.01)] space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-black font-sora mb-3">Overview</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {item.overview}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                      <Calendar className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-400 tracking-wider uppercase mb-1">Best Time to Visit</h4>
                      <p className="text-xs text-slate-700 font-bold leading-relaxed">{item.bestTime}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                      <Wallet className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-400 tracking-wider uppercase mb-1">Budget Range</h4>
                      <p className="text-xs text-slate-700 font-bold leading-relaxed">{item.budgetRange}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSec === "attractions" && (
              <div className="bg-white rounded-[28px] p-8 border border-slate-100/80 shadow-[0_4px_20px_rgba(15,23,42,0.01)]">
                <h3 className="text-xl font-bold text-black font-sora mb-6">Top Attractions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.attractions.map((attr: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{attr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSec === "itinerary" && (
              <div className="bg-white rounded-[28px] p-8 border border-slate-100/80 shadow-[0_4px_20px_rgba(15,23,42,0.01)] space-y-8">
                <h3 className="text-xl font-bold text-black font-sora mb-6">Sample Itinerary</h3>
                
                <div className="relative border-l border-slate-100 ml-4 pl-6 space-y-8">
                  {item.itinerary.map((dayItem: any, idx: number) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm" />
                      
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-teal-600 tracking-widest uppercase block mb-1">{dayItem.day}</span>
                        <h4 className="text-base font-bold text-black mb-2 leading-snug">{dayItem.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{dayItem.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSec === "practical" && (
              <div className="bg-white rounded-[28px] p-8 border border-slate-100/80 shadow-[0_4px_20px_rgba(15,23,42,0.01)] space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils className="w-5 h-5 text-teal-600" />
                    <h3 className="text-lg font-bold text-black font-sora">Food & Dining</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium pl-7">
                    {item.food}
                  </p>
                </div>

                <div className="border-t border-slate-50 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Car className="w-5 h-5 text-teal-600" />
                    <h3 className="text-lg font-bold text-black font-sora">Local Transportation</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium pl-7">
                    {item.transportation}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Hotel recommendations / Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick action card */}
            <div className="bg-black text-white rounded-[28px] p-8 shadow-[0_15px_45px_rgba(0,0,0,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
              <span className="text-[9px] font-black text-[#E2FF00] tracking-widest uppercase block mb-4">Plan with AI</span>
              <h4 className="text-xl font-bold font-sora leading-tight mb-4">
                Want a custom itinerary for {item.name}?
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                Let our AI travel concierge plan a bespoke trip details based on your style, party, and duration.
              </p>
              <Link href="/plan">
                <Button className="w-full bg-[#E2FF00] hover:bg-[#E2FF00]/90 text-black font-extrabold rounded-xl py-3 text-xs border-none shadow-[0_4px_12px_rgba(226,255,0,0.2)]">
                  Start Planning Now
                </Button>
              </Link>
            </div>

            {/* Premium Hotels */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-4">Recommended Stays</h4>
              <div className="space-y-4">
                {item.hotels.map((hotel: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100/60">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                      <Bed className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{hotel}</span>
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
