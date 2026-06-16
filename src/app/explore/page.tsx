import { PageHeader } from "@/components/layout/PageHeader";
import { Compass, MapPin, Navigation2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Beaches", icon: "🏖️" },
  { name: "Mountains", icon: "⛰️" },
  { name: "Cities", icon: "🏙️" },
  { name: "Forests", icon: "🌲" },
  { name: "Historical", icon: "🏛️" },
];

const curatedTrips = [
  { id: 1, title: "Bali Getaway", location: "Indonesia", days: "7 Days", price: "₹45,000" },
  { id: 2, title: "Swiss Alps", location: "Switzerland", days: "10 Days", price: "₹1,20,000" },
  { id: 3, title: "Kyoto Culture", location: "Japan", days: "8 Days", price: "₹85,000" },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen pb-20">
      <PageHeader 
        title="Explore Destinations" 
        description="Discover beautiful places, trending destinations, and curated trips tailored for you."
        icon={Compass}
      />
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="glass-card p-2 pl-6 rounded-full flex items-center gap-4 border border-white/10 shadow-2xl">
            <Search className="w-5 h-5 text-white/40" />
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-white/40"
            />
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 h-12">
              Search
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white font-sora">Travel Categories</h2>
            <Button variant="ghost" className="text-white/60 hover:text-white">View All</Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat, i) => (
              <div key={i} className="glass-card flex-shrink-0 px-6 py-4 rounded-2xl flex flex-col items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-sm font-medium text-white">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curated Trips Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white font-sora mb-8">Curated For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curatedTrips.map((trip) => (
              <div key={trip.id} className="glass-card rounded-3xl overflow-hidden group border border-white/5">
                <div className="h-64 bg-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white">{trip.location}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{trip.title}</h3>
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-white/60 text-sm">{trip.days}</div>
                    <div className="text-lg font-bold text-white">{trip.price}</div>
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
