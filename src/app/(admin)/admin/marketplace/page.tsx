"use client";

import { useState } from "react";
import { 
  Store, Search, Filter, CheckCircle2, XCircle, AlertTriangle, 
  Eye, MousePointerClick, Send, Coins, Star, Plus
} from "lucide-react";

// Mock marketplace listing data in Travixa B2B2C model
const listingsData = [
  {
    id: 1,
    title: "The Ocean Resort & Spa",
    category: "Resort",
    location: "Goa, India",
    plan: "Premium Tier",
    views: 12400,
    clicks: 840,
    leads: 126,
    revenue: "₹1,24,500",
    rating: 4.8,
    isFeatured: true,
    status: "Live",
    partner: "Wanderlust Holidays",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Mountain Retreat Hotel",
    category: "Hotel",
    location: "Manali, HP, India",
    plan: "Growth Plan",
    views: 8700,
    clicks: 580,
    leads: 88,
    revenue: "₹88,700",
    rating: 4.7,
    isFeatured: false,
    status: "Pending Approval",
    partner: "Himalayan Stays",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Valley Adventure Camp",
    category: "Camping",
    location: "Uttarakhand, India",
    plan: "Premium Tier",
    views: 6500,
    clicks: 430,
    leads: 52,
    revenue: "₹56,300",
    rating: 4.6,
    isFeatured: false,
    status: "Live",
    partner: "Deccan Expeditions",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Eco Agro Farm Tour",
    category: "Agro Tourism",
    location: "Alibaug, Maharashtra",
    plan: "Base Plan",
    views: 3200,
    clicks: 210,
    leads: 18,
    revenue: "₹12,400",
    rating: 4.4,
    isFeatured: false,
    status: "Suspended",
    partner: "Local Travels",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Scuba Diving & Snorkeling",
    category: "Activity",
    location: "Andaman Islands, India",
    plan: "Premium Tier",
    views: 9800,
    clicks: 720,
    leads: 94,
    revenue: "₹76,200",
    rating: 4.9,
    isFeatured: true,
    status: "Live",
    partner: "Wanderlust Holidays",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=300&auto=format&fit=crop"
  }
];

const categories = ["All", "Hotel", "Resort", "Trek", "Camping", "Agro Tourism", "Guide", "Cab", "Activity"];

export default function AdminMarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [listings, setListings] = useState(listingsData);

  const filteredListings = listings.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.partner.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAction = (id: number, action: string) => {
    setListings(prev => prev.map(item => {
      if (item.id === id) {
        if (action === "Approve") return { ...item, status: "Live" };
        if (action === "Reject") return { ...item, status: "Rejected" };
        if (action === "Suspend") return { ...item, status: "Suspended" };
        if (action === "Feature") return { ...item, isFeatured: !item.isFeatured };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Inventory Management</h2>
          <h1 className="text-3xl font-bold font-sora text-[#0F172A]">Marketplace Hub</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage global travel partners, active inventory, and listing promotions.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto">
          <Plus className="w-4 h-4" />
          <span>New Listing Slot</span>
        </button>
      </div>

      {/* Category filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#E5E7EB]/50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? "bg-[#0EA5A4]/15 text-[#0EA5A4]" 
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input 
              type="text" 
              placeholder="Search listings, partner, or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-transparent rounded-full py-1.5 pl-9 pr-4 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold text-[#64748B]">
            <span>Showing {filteredListings.length} of {listings.length} listings</span>
          </div>
        </div>
      </div>

      {/* Grid of Listings exactly like third reference image */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div 
            key={item.id}
            className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:translate-y-[-2px] hover:shadow-[0_4px_25px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between h-[390px]"
          >
            {/* Image header */}
            <div className="h-44 relative bg-slate-100 shrink-0">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-widest text-white uppercase ${
                  item.status === "Live" ? "bg-[#16A34A]" :
                  item.status === "Pending Approval" ? "bg-amber-500" : "bg-[#DC2626]"
                }`}>
                  {item.status}
                </span>
                {item.isFeatured && (
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold tracking-widest text-white uppercase bg-[#0EA5A4] flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" /> FEATURED
                  </span>
                )}
              </div>
              
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold text-[#0F172A] flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <span>{item.rating}</span>
              </div>
            </div>

            {/* Content body */}
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold font-sora text-[#0F172A] truncate w-48">{item.title}</h4>
                  <p className="text-[10px] text-[#64748B]">{item.category} • {item.location}</p>
                </div>
                <span className="text-[9px] font-bold bg-slate-100 border border-slate-200 text-[#64748B] px-1.5 py-0.5 rounded">
                  {item.plan}
                </span>
              </div>

              {/* Action analytics metrics */}
              <div className="grid grid-cols-4 gap-2 mt-4 text-center border-t border-b border-[#E5E7EB]/50 py-2.5 bg-slate-50/50">
                <div>
                  <span className="text-[8px] font-bold text-[#94A3B8] uppercase block">Views</span>
                  <p className="text-xs font-bold text-[#0F172A] mt-0.5 flex items-center justify-center gap-0.5">
                    <Eye className="w-3 h-3 text-[#64748B]" /> {item.views.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-[#94A3B8] uppercase block">Clicks</span>
                  <p className="text-xs font-bold text-[#0F172A] mt-0.5 flex items-center justify-center gap-0.5">
                    <MousePointerClick className="w-3 h-3 text-[#64748B]" /> {item.clicks}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-[#94A3B8] uppercase block">Leads</span>
                  <p className="text-xs font-bold text-[#0F172A] mt-0.5 flex items-center justify-center gap-0.5">
                    <Send className="w-3 h-3 text-[#64748B]" /> {item.leads}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-[#94A3B8] uppercase block">Revenue</span>
                  <p className="text-xs font-bold text-[#16A34A] mt-0.5 flex items-center justify-center gap-0.5">
                    <Coins className="w-3 h-3 text-[#16A34A]" /> {item.revenue}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Admin Actions */}
            <div className="px-4 py-3 bg-slate-50 border-t border-[#E5E7EB]/50 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-[#64748B] font-bold truncate w-24">By: {item.partner}</span>
              
              <div className="flex gap-1.5">
                {item.status === "Pending Approval" ? (
                  <>
                    <button 
                      onClick={() => handleAction(item.id, "Approve")}
                      className="px-2.5 py-1 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded text-[10px] font-bold transition-colors"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleAction(item.id, "Reject")}
                      className="px-2.5 py-1 bg-[#DC2626] hover:bg-[#DC2626]/90 text-white rounded text-[10px] font-bold transition-colors"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleAction(item.id, "Suspend")}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0F172A] rounded text-[10px] font-bold transition-colors"
                    >
                      Suspend
                    </button>
                    <button 
                      onClick={() => handleAction(item.id, "Feature")}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                        item.isFeatured 
                          ? "bg-[#0EA5A4]/15 border-[#0EA5A4] text-[#0EA5A4]" 
                          : "bg-white hover:bg-slate-50 border-slate-300 text-[#64748B]"
                      }`}
                    >
                      {item.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
