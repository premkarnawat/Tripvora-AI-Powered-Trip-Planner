"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, SlidersHorizontal, Star, ArrowUpRight, 
  MapPin, ChevronLeft, ChevronRight, BadgeCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All Experiences");
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("Any");
  
  // Staging state to apply search on click of "Explore Now"
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [appliedBudget, setAppliedBudget] = useState("All");
  const [appliedRating, setAppliedRating] = useState("Any");

  const categories = [
    "All Experiences", "Resorts", "Treks", "Camping", 
    "Agro Tourism", "Scuba", "Adventure", "Bike Rentals", 
    "Photography", "Cab Services", "Tour Guides", "Go Karting"
  ];

  const listings = [
    {
      id: "azores-scuba",
      title: "Azores Deep Sea Scuba",
      location: "Portugal",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop",
      price: "$1,280",
      rating: "4.9",
      badge: "Partner Deal",
      verified: true,
      category: "Scuba"
    },
    {
      id: "zenith-resort",
      title: "Zenith Alpine Resort",
      location: "Switzerland",
      image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=600&auto=format&fit=crop",
      price: "$3,450",
      rating: "4.6",
      badge: "Trending",
      verified: true,
      category: "Resorts"
    },
    {
      id: "marrakesh-tour",
      title: "Marrakesh Soul Tour",
      location: "Morocco",
      image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=600&auto=format&fit=crop",
      price: "$2,700",
      rating: "5.0",
      badge: "Festival Deal",
      verified: false,
      category: "Treks"
    },
    {
      id: "sahara-glamping",
      title: "Sahara Star Glamping",
      location: "Tunisia",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop",
      price: "$1,500",
      rating: "4.8",
      badge: "Festival Offer",
      verified: true,
      category: "Camping"
    },
    {
      id: "tuscany-cook",
      title: "Tuscany Cooking Class",
      location: "Italy",
      image: "https://images.unsplash.com/photo-1486894980609-fce7c3c164ad?q=80&w=600&auto=format&fit=crop",
      price: "$800",
      rating: "4.7",
      badge: "Weekend Offer",
      verified: true,
      category: "Agro Tourism"
    },
    {
      id: "monaco-gokart",
      title: "Monaco Circuit Karting",
      location: "Monaco",
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop",
      price: "$2,200",
      rating: "4.9",
      badge: "Partner Promotion",
      verified: false,
      category: "Go Karting"
    }
  ];

  const promotions = [
    {
      title: "City Escape: Tokyo",
      tag: "WEEKEND DEALS",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop",
      desc: "Look now and get 20% off on all luxury suites this weekend.",
      btnText: "Claim Offer"
    },
    {
      title: "Amalfi Summer Dream",
      tag: "FESTIVAL SPECIAL",
      image: "https://images.unsplash.com/photo-1486894980609-fce7c3c164ad?q=80&w=600&auto=format&fit=crop",
      desc: "Experience the iconic coastlines with exclusive tours and local culinary festivals.",
      btnText: "Explore Festival"
    }
  ];

  const treks = [
    {
      title: "Patagonia Ridge",
      difficulty: "Expert",
      image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=400&auto=format&fit=crop",
      tag: "Difficulty"
    },
    {
      title: "Monaco Circuit",
      difficulty: "Adrenaline: High",
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=400&auto=format&fit=crop",
      tag: "Experience"
    },
    {
      title: "Sahara Star Glamping",
      difficulty: "3-Day Nature",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400&auto=format&fit=crop",
      tag: "Adventure"
    },
    {
      title: "Bali Blue Coves",
      difficulty: "Underwater Details",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop",
      tag: "Coastal"
    }
  ];

  // Apply search query, budget, rating filters on Explore click (scroll to listings)
  const handleSearchSubmit = () => {
    const listingsEl = document.getElementById("listings-section");
    if (listingsEl) {
      listingsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter listings based on active filters in real-time
  const filteredListings = listings.filter((item) => {
    // 1. Category Filter (Pills)
    if (activeCategory !== "All Experiences") {
      if (item.category !== activeCategory) {
        return false;
      }
    }

    // 2. Search Query Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchCat) return false;
    }

    // 3. Budget Filter
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""));
    if (budgetFilter === "low" && priceNum >= 1500) return false;
    if (budgetFilter === "mid" && (priceNum < 1500 || priceNum > 3000)) return false;
    if (budgetFilter === "high" && priceNum <= 3000) return false;

    // 4. Rating Filter
    const ratingNum = parseFloat(item.rating);
    if (ratingFilter === "4.5" && ratingNum < 4.5) return false;
    if (ratingFilter === "4.8" && ratingNum < 4.8) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pb-20 font-sans">
      
      {/* 1. HERO SECTION WITH WATER VILLA BACKGROUND (Added pb-36 md:pb-48 padding for perfect clearance) */}
      <div className="relative w-full overflow-hidden flex items-center bg-[#070D19] pt-24 pb-36 md:pb-48">
        
        {/* Parallax Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1600&auto=format&fit=crop" 
            alt="Overwater bungalows"
            className="w-full h-full object-cover object-center scale-[1.03] opacity-75"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div className="max-w-[1400px] w-full mx-auto px-4 md:px-8 relative z-10 text-white mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-left"
          >
            {/* White Glassmorphic Badge */}
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider uppercase mb-6 text-teal-300">
              Connect As Partner
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-sora leading-[1.1] mb-6 tracking-tight">
              Promote Your Travel Business To Thousands Of Travelers
            </h1>
            
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 font-medium">
              Reach a global audience of luxury travelers seeking bespoke experiences. Our AI-driven platform connects your brand with explorers ready to book.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/agencies">
                <Button className="bg-white hover:bg-white/90 text-black rounded-full px-8 h-12 font-bold flex items-center gap-1 shadow-lg transition-all active:scale-95 border-none">
                  List Your Business <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/agencies#pricing">
                <Button variant="outline" className="border-white/30 hover:bg-white/10 text-white rounded-full px-8 h-12 font-bold backdrop-blur-sm transition-all">
                  Book Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-20">
        
        {/* 2. SEARCH BAR WIDGET (Centered perfectly and uses full max-width with proper grid) */}
        <div className="-mt-14 mb-16 w-full flex justify-center">
          <div className="bg-white rounded-3xl lg:rounded-full p-4 shadow-[0_15px_50px_rgba(15,23,42,0.08)] border border-slate-100 flex flex-col lg:flex-row items-center gap-4 w-full max-w-5xl mx-auto">
            
            {/* Destination Search */}
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 border-b lg:border-b-0 lg:border-r border-slate-100">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="w-full">
                <span className="block text-[10px] font-black text-slate-400 tracking-wider uppercase">Where is next?</span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search experiences..."
                  className="w-full bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none placeholder:text-slate-400 p-0 h-5 focus:ring-0"
                />
              </div>
            </div>

            {/* Budget filter */}
            <div className="w-full lg:w-48 flex items-center gap-3 px-4 py-2 border-b lg:border-b-0 lg:border-r border-slate-100">
              <SlidersHorizontal className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="w-full">
                <span className="block text-[10px] font-black text-slate-400 tracking-wider uppercase">Budget</span>
                <select 
                  value={budgetFilter}
                  onChange={(e) => setBudgetFilter(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none cursor-pointer p-0 h-5 focus:ring-0"
                >
                  <option value="All">All Ranges</option>
                  <option value="low">Under $1,500</option>
                  <option value="mid">$1,500 - $3,000</option>
                  <option value="high">$3,000+</option>
                </select>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="w-full lg:w-48 flex items-center gap-3 px-4 py-2">
              <Star className="w-5 h-5 text-slate-400 shrink-0 fill-slate-100" />
              <div className="w-full">
                <span className="block text-[10px] font-black text-slate-400 tracking-wider uppercase">Rating</span>
                <select 
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-800 text-sm font-semibold focus:outline-none cursor-pointer p-0 h-5 focus:ring-0"
                >
                  <option value="Any">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.8">4.8+ Stars</option>
                </select>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleSearchSubmit}
              className="w-full lg:w-auto bg-black hover:bg-black/90 text-white rounded-full px-8 h-12 font-bold shrink-0 border-none"
            >
              Explore Now
            </Button>
          </div>
        </div>

        {/* 3. CATEGORIES TABS */}
        <div id="listings-section" className="mb-12">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => {
              const active = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-extrabold tracking-wide uppercase transition-all border ${
                    active 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-slate-600 border-slate-200/60 hover:border-slate-400'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. LISTING GRID (Renders dynamically based on active filter selections) */}
        <div className="mb-24">
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredListings.map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(15,23,42,0.02)] group flex flex-col justify-between"
                >
                  {/* Image container */}
                  <div className="h-64 overflow-hidden relative bg-slate-100">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Verified Badge */}
                    {item.verified && (
                      <span className="absolute top-4 left-4 bg-teal-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        Verified
                      </span>
                    )}
                    {/* Category tag */}
                    <span className="absolute top-4 right-4 bg-black/60 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {item.badge}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-black font-extrabold text-xs">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-black font-sora mb-4 group-hover:text-teal-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-4 border-t border-slate-50 pt-4">
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Starting from</span>
                        <span className="text-xl font-black text-black">{item.price}</span>
                      </div>
                      
                      <Link href={`/marketplace/${item.id}`}>
                        <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100/60 shadow-sm">
              <SlidersHorizontal className="w-10 h-10 text-slate-350 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-black mb-1 font-sora">No results found</h4>
              <p className="text-slate-450 text-xs font-semibold">Try adjusting your filters or search query details.</p>
            </div>
          )}
        </div>

        {/* 5. UNMISSABLE PROMOTIONS */}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-black font-sora tracking-tight">Unmissable Promotions</h2>
              <p className="text-slate-500 text-sm mt-1">Hand-picked deals from our global travel partners.</p>
            </div>
            {/* Arrows */}
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promotions.map((promo, i) => (
              <div 
                key={i} 
                className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm flex flex-col sm:flex-row h-auto sm:h-72"
              >
                {/* Promo Image */}
                <div className="w-full sm:w-[45%] h-52 sm:h-full relative overflow-hidden shrink-0">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-[#E2FF00] text-black text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    {promo.tag}
                  </span>
                </div>
                {/* Content */}
                <div className="p-8 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-[10px] font-black text-teal-600 tracking-widest uppercase mb-1">{promo.tag}</h4>
                    <h3 className="text-2xl font-bold text-black font-sora leading-tight mb-3">{promo.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">{promo.desc}</p>
                  </div>
                  <Button className="bg-black hover:bg-black/90 text-white rounded-full px-6 h-10 text-xs font-bold w-fit mt-6 border-none">
                    {promo.btnText}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. TOP TREKS & ADVENTURES */}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-black font-sora tracking-tight">Top Treks & Adventure</h2>
              <p className="text-slate-500 text-sm mt-1">Adrenaline-packed activities recommended by our community.</p>
            </div>
            <Link href="/marketplace" className="text-xs font-black text-black hover:text-teal-600 tracking-wider uppercase flex items-center gap-1">
              View All Activities <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {treks.map((t, i) => (
              <div 
                key={i} 
                className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-sm"
              >
                {/* Image */}
                <img 
                  src={t.image} 
                  alt={t.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Black Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                {/* Details */}
                <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col justify-end">
                  <span className="text-[9px] font-black text-[#E2FF00] tracking-widest uppercase mb-1">
                    {t.tag}: {t.difficulty}
                  </span>
                  <h4 className="text-lg font-bold font-sora leading-snug">
                    {t.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 7. PARTNER SPOTLIGHT (DARK CRM PREVIEW) */}
      <section className="bg-black text-white py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-sora mb-3">Partner Spotlight</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Discover how leading travel brands are transforming their reach through TripPilot's advertising ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Quote Box (Left 5 cols) */}
            <div className="lg:col-span-5 bg-white text-slate-800 rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100">
              <span className="text-[9px] font-black text-teal-600 tracking-widest uppercase block mb-6">Success Story</span>
              <p className="text-lg italic font-medium text-slate-700 leading-relaxed mb-8">
                "TripPilot didn't just give us leads, they gave us a platform to deliver sharp, custom quotations. We've seen a 650% increase in bookings for our premium packages within the first quarter."
              </p>
              
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" 
                  alt="Marcus Thorne"
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <h5 className="font-bold text-black text-sm">Marcus Thorne</h5>
                  <p className="text-slate-400 text-xs font-semibold">CEO, Alpine Luxury Collection</p>
                </div>
              </div>
            </div>

            {/* Metric Box (Right 7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-6">
              {[
                { val: "40k+", desc: "Active Monthly Explorers" },
                { val: "2.5x", desc: "Avg. Booking Value Increase" },
                { val: "85%", desc: "Partner Retention Rate" },
                { val: "12", desc: "Global Regions Reached" }
              ].map((m, i) => (
                <div 
                  key={i} 
                  className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md"
                >
                  <h4 className="text-4xl md:text-5xl font-black text-[#E2FF00] font-sora tracking-tight mb-2">
                    {m.val}
                  </h4>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
