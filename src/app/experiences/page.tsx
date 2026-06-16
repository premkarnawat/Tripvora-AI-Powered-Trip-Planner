"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Compass, Star, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const experiences = [
  {
    id: 1,
    title: "Scuba Diving in Coral Reefs",
    location: "Maldives",
    rating: 4.9,
    reviews: 128,
    price: "₹8,500",
    image: "bg-cyan-900",
    category: "Adventure",
  },
  {
    id: 2,
    title: "Traditional Cooking Class",
    location: "Tuscany, Italy",
    rating: 4.8,
    reviews: 85,
    price: "₹4,200",
    image: "bg-orange-900",
    category: "Food",
  },
  {
    id: 3,
    title: "Guided Temple Tour",
    location: "Kyoto, Japan",
    rating: 4.9,
    reviews: 210,
    price: "₹3,100",
    image: "bg-emerald-900",
    category: "Culture",
  },
  {
    id: 4,
    title: "Hot Air Balloon Ride",
    location: "Cappadocia, Turkey",
    rating: 5.0,
    reviews: 342,
    price: "₹12,000",
    image: "bg-rose-900",
    category: "Adventure",
  }
];

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen pb-20">
      <PageHeader 
        title="Local Experiences" 
        description="Discover and book unforgettable activities and tours."
        icon={Compass}
      />
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
           <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-hide">
              {['All', 'Adventure', 'Culture', 'Food', 'Nature', 'Relaxation'].map((cat, i) => (
                 <Button key={cat} variant={i === 0 ? "default" : "outline"} className={`rounded-full shrink-0 ${i === 0 ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-transparent border-white/20 text-white hover:bg-white/10'}`}>
                    {cat}
                 </Button>
              ))}
           </div>
           <Button variant="outline" className="shrink-0 bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
           </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {experiences.map(exp => (
              <div key={exp.id} className="glass-card rounded-3xl border border-white/5 overflow-hidden group cursor-pointer hover:border-white/20 transition-colors">
                 <div className={`w-full h-48 ${exp.image} relative overflow-hidden`}>
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium text-white border border-white/10">
                       <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                       {exp.rating}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm font-medium">Image Placeholder</div>
                 </div>
                 <div className="p-5">
                    <div className="text-xs text-primary font-medium mb-2">{exp.category}</div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{exp.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-white/50 mb-4">
                       <MapPin className="w-3.5 h-3.5" />
                       {exp.location}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                       <div className="font-bold text-white text-lg">{exp.price}</div>
                       <Button variant="ghost" className="text-sm h-8 px-3 rounded-full hover:bg-primary/20 hover:text-primary text-white/80">
                          Book Now
                       </Button>
                    </div>
                 </div>
              </div>
           ))}
        </div>

      </div>
    </div>
  );
}
