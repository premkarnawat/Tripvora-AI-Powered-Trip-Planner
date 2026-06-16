"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Building, Star, MapPin, Calendar, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const hotels = [
  {
    id: 1,
    name: "The Oberoi Amarvilas",
    location: "Agra, India",
    rating: 4.9,
    reviews: 1420,
    price: "₹35,000",
    image: "bg-amber-900",
    tags: ["Luxury", "Pool", "Spa"],
  },
  {
    id: 2,
    name: "Marina Bay Sands",
    location: "Singapore",
    rating: 4.8,
    reviews: 3250,
    price: "₹45,000",
    image: "bg-blue-900",
    tags: ["City View", "Infinity Pool", "Casino"],
  },
  {
    id: 3,
    name: "Taj Lake Palace",
    location: "Udaipur, India",
    rating: 4.9,
    reviews: 890,
    price: "₹42,000",
    image: "bg-indigo-900",
    tags: ["Heritage", "Lake View", "Luxury"],
  }
];

export default function HotelsPage() {
  return (
    <div className="min-h-screen pb-20">
      <PageHeader 
        title="Find Perfect Stays" 
        description="Book premium hotels, resorts, and unique accommodations worldwide."
        icon={Building}
      />
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 mt-8">
        
        {/* Search Widget */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 mb-12 relative z-20 shadow-2xl">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
                 <label className="text-xs text-white/50 mb-1 uppercase tracking-wider font-medium">Destination</label>
                 <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <input type="text" placeholder="Where are you going?" className="bg-transparent border-none text-white w-full focus:outline-none placeholder:text-white/30 text-sm font-medium" />
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
                 <label className="text-xs text-white/50 mb-1 uppercase tracking-wider font-medium">Check In - Check Out</label>
                 <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-white text-sm font-medium">Add dates</span>
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center">
                 <label className="text-xs text-white/50 mb-1 uppercase tracking-wider font-medium">Guests & Rooms</label>
                 <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-white text-sm font-medium">2 Guests, 1 Room</span>
                 </div>
              </div>
              <Button className="h-full min-h-[70px] bg-primary hover:bg-primary/90 text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-2">
                 <Search className="w-5 h-5" /> Search
              </Button>
           </div>
        </div>

        {/* Hotel Listings */}
        <div>
           <h2 className="text-2xl font-bold text-white font-sora mb-6">Trending Accommodations</h2>
           <div className="flex flex-col gap-6">
              {hotels.map(hotel => (
                 <div key={hotel.id} className="glass-card rounded-3xl border border-white/5 overflow-hidden flex flex-col md:flex-row group hover:bg-white/5 transition-colors">
                    <div className={`w-full md:w-72 h-64 md:h-auto ${hotel.image} relative overflow-hidden shrink-0`}>
                       <div className="absolute inset-0 flex items-center justify-center text-white/20 font-medium">Image Placeholder</div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{hotel.name}</h3>
                             <div className="flex items-center gap-1 text-sm text-white/60">
                                <MapPin className="w-4 h-4" />
                                {hotel.location}
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="bg-primary/20 text-primary font-bold px-3 py-1 rounded-xl inline-flex items-center gap-1 mb-1 border border-primary/30">
                                <Star className="w-3.5 h-3.5 fill-primary" /> {hotel.rating}
                             </div>
                             <div className="text-xs text-white/40">{hotel.reviews} reviews</div>
                          </div>
                       </div>
                       
                       <div className="flex flex-wrap gap-2 my-4">
                          {hotel.tags.map(tag => (
                             <span key={tag} className="text-xs font-medium px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white/70">
                                {tag}
                             </span>
                          ))}
                       </div>
                       
                       <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                          <div>
                             <div className="text-sm text-white/50 mb-1">Starting from</div>
                             <div className="text-2xl font-bold text-white">{hotel.price} <span className="text-sm font-normal text-white/40">/ night</span></div>
                          </div>
                          <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8">
                             View Details
                          </Button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
