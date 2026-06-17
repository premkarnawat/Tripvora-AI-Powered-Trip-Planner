"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { 
  Star, MapPin, ShieldAlert, Award, PhoneCall, 
  ChevronRight, Send, Camera, Clock, BadgeCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketplaceListingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Mock details
  const detailsMap: Record<string, any> = {
    "azores-scuba": {
      title: "Azores Deep Sea Scuba",
      location: "Azores Islands, Portugal",
      category: "Scuba & Marine Life",
      price: "$1,280",
      rating: "4.9",
      reviewsCount: "128 reviews",
      images: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop"
      ],
      description: "Dive into the deep blue of the Azores, one of the world's premier marine exploration destinations. Encounter manta rays, blue sharks, and breathtaking underwater volcanic walls under the safe guidance of local marine biologists.",
      highlights: ["Manta Ray encounter guarantees", "PADI Certified instruction included", "5-star luxury catamaran travel", "Full premium gear hire"],
      pricingDetails: "Includes 4 guided boat dives, premium accommodation for 3 nights, gourmet seafood dinners, and professional video footage of your dives."
    },
    "zenith-resort": {
      title: "Zenith Alpine Resort",
      location: "Zermatt, Switzerland",
      category: "Luxury Resorts",
      price: "$3,450",
      rating: "4.6",
      reviewsCount: "94 reviews",
      images: [
        "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1486894980609-fce7c3c164ad?q=80&w=800&auto=format&fit=crop"
      ],
      description: "Nestled high in the Swiss Alps, Zenith Alpine Resort offers unrivaled luxury ski-in, ski-out suites with breathtaking floor-to-ceiling vistas of the Matterhorn. Indulge in award-winning thermal baths and Michelin-starred dining.",
      highlights: ["Exclusive ski-in/ski-out Matterhorn access", "Private outdoor hot tubs", "Michelin star dining included", "Helicopter transfers available"],
      pricingDetails: "Price per room/night. Includes daily champagne breakfast, access to private spas, and personal ski concierge services."
    },
    "marrakesh-tour": {
      title: "Marrakesh Soul Tour",
      location: "Medina, Morocco",
      category: "Culture & Treks",
      price: "$2,700",
      rating: "5.0",
      reviewsCount: "310 reviews",
      images: [
        "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop"
      ],
      description: "Journey deep into the heartbeat of Marrakesh. Wander the labyrinths of the old Medina, stay in majestic 18th-century riads, hike the red dust trails of the Atlas Mountains, and dine under desert stars.",
      highlights: ["Private Riad accommodation", "Guided souk tours & spice tastings", "Atlas Mountains day-hike", "Sahara Desert luxury dinner"],
      pricingDetails: "Includes airport transfers, English-speaking guide, all monument entrance fees, and half-board premium dining."
    }
  };

  const item = detailsMap[id] || detailsMap["azores-scuba"];

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pt-28 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mb-6">
          <span>Marketplace</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-teal-600">{item.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600">{item.title}</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-teal-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <BadgeCheck className="w-3 h-3" /> Verified Partner
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.category}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight font-sora">
              {item.title}
            </h1>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 font-semibold">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-1 text-black font-extrabold">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{item.rating}</span>
                <span className="text-slate-400 font-medium font-sans">({item.reviewsCount})</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-4 px-6 rounded-2xl shadow-sm text-right shrink-0">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Starting from</span>
            <span className="text-3xl font-black text-black">{item.price}</span>
            <span className="block text-[10px] text-slate-400 font-medium">all taxes included</span>
          </div>
        </div>

        {/* Grid Photos */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12 rounded-[28px] overflow-hidden shadow-sm">
          <div className="md:col-span-8 h-96 bg-slate-100 relative group overflow-hidden">
            <img 
              src={item.images[0]} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" 
            />
            <button className="absolute bottom-4 right-4 bg-black/60 hover:bg-black text-white text-xs font-bold py-2 px-4 rounded-full flex items-center gap-1.5 backdrop-blur-sm transition-colors">
              <Camera className="w-4 h-4" /> View All Photos
            </button>
          </div>
          <div className="md:col-span-4 h-96 bg-slate-200 hidden md:block">
            <img 
              src={item.images[1]} 
              alt={item.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        {/* Split Details & Lead Gen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-10">
            
            <div className="bg-white border border-slate-100 rounded-[28px] p-8 shadow-[0_4px_20px_rgba(15,23,42,0.01)]">
              <h3 className="text-xl font-bold text-black font-sora mb-4">Overview</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                {item.description}
              </p>
              
              <h4 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-4">Key Highlights</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.highlights.map((h: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-100 rounded-[28px] p-8 shadow-[0_4px_20px_rgba(15,23,42,0.01)]">
              <h3 className="text-xl font-bold text-black font-sora mb-3">Pricing & Inclusions</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {item.pricingDetails}
              </p>
            </div>

            {/* Simulated Reviews */}
            <div className="bg-white border border-slate-100 rounded-[28px] p-8 shadow-[0_4px_20px_rgba(15,23,42,0.01)]">
              <h3 className="text-xl font-bold text-black font-sora mb-6">Recent Reviews</h3>
              <div className="space-y-6">
                {[
                  { name: "Eleanor P.", text: "An absolutely magical experience. The staff was incredibly knowledgeable and safety was outstanding.", rating: 5 },
                  { name: "Rupert K.", text: "Exceeded all expectations. The food was incredible and the views were simply out of this world.", rating: 4 }
                ].map((rev, idx) => (
                  <div key={idx} className="border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-black">{rev.name}</span>
                      <div className="flex gap-0.5">
                        {Array(rev.rating).fill(0).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">"{rev.text}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Talk to Expert Lead Gen Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-white rounded-[28px] p-8 shadow-[0_15px_45px_rgba(15,23,42,0.05)] border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-black leading-tight">Talk to an Expert</h4>
                  <p className="text-xs text-slate-400 font-semibold">Direct line to a luxury trip curator</p>
                </div>
              </div>

              {!leadSubmitted ? (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 font-medium">
                    Have questions about this package? Leave your details below and a certified agent will contact you on WhatsApp or phone within 15 minutes.
                  </p>
                  
                  <div>
                    <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase mb-1.5 block">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase mb-1.5 block">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase mb-1.5 block">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-semibold"
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-black hover:bg-black/90 text-white rounded-xl py-3 text-xs font-bold transition-all shadow-md mt-6 h-11 border-none flex items-center justify-center gap-1.5"
                  >
                    Request Free Consultation <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mx-auto mb-4 animate-bounce">
                    <Star className="w-6 h-6 fill-teal-600" />
                  </div>
                  <h4 className="text-lg font-bold text-black mb-2 font-sora">Request Received!</h4>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto font-medium">
                    A certified expert is reviewing the details for <span className="font-bold text-black">{item.title}</span> and will reach out to you shortly.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
