"use client";

import { useState } from "react";
import { 
  Percent, Search, Filter, CheckCircle2, XCircle, 
  Star, Edit2, Calendar, Tag, Plus
} from "lucide-react";

// Mock business offers data
const offersData = [
  {
    id: 1,
    business: "Wanderlust Holidays",
    category: "Maldives Packages",
    offerPercent: "15% OFF",
    startDate: "15 Jun 2026",
    endDate: "30 Jul 2026",
    status: "Live",
    isFeatured: true,
    promoCode: "WANDERMALDIVES15",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: 2,
    business: "Taj Safaris India",
    category: "Luxury Resort Stay",
    offerPercent: "₹5,000 Flat",
    startDate: "20 Jun 2026",
    endDate: "20 Aug 2026",
    status: "Pending Approval",
    isFeatured: false,
    promoCode: "TAJSAFARI5K",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: 3,
    business: "Himalayan Stays",
    category: "Kedarkantha Trek Group",
    offerPercent: "20% OFF",
    startDate: "01 Jul 2026",
    endDate: "15 Aug 2026",
    status: "Live",
    isFeatured: false,
    promoCode: "KEDARTREK20",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: 4,
    business: "Goa Shore Trips",
    category: "Water Sports Activity",
    offerPercent: "10% OFF",
    startDate: "01 May 2026",
    endDate: "30 Jun 2026",
    status: "Expired",
    isFeatured: false,
    promoCode: "GOAWATER10",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=150&auto=format&fit=crop"
  }
];

export default function AdminOffersPage() {
  const [offers, setOffers] = useState(offersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOffers = offers.filter(o => {
    const matchesSearch = o.business.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (id: number, action: string) => {
    setOffers(prev => prev.map(o => {
      if (o.id === id) {
        if (action === "Approve") return { ...o, status: "Live" };
        if (action === "Reject") return { ...o, status: "Rejected" };
        if (action === "Feature") return { ...o, isFeatured: !o.isFeatured };
      }
      return o;
    }));
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Promotional Center</h2>
          <h1 className="text-3xl font-bold font-sora text-[#0F172A]">Offers & Deals</h1>
          <p className="text-sm text-[#64748B] mt-1">Review discount campaigns, coupon codes submitted by travel business partners.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto">
          <Plus className="w-4 h-4" />
          <span>Add Custom Coupon</span>
        </button>
      </div>

      {/* Filters & search */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {["All", "Live", "Pending Approval", "Expired"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === s 
                  ? "bg-[#0EA5A4]/15 text-[#0EA5A4]" 
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input 
            type="text" 
            placeholder="Search business or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F1F5F9] border border-transparent rounded-full py-1.5 pl-9 pr-4 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all"
          />
        </div>
      </div>

      {/* Grid of coupons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOffers.map((offer) => (
          <div 
            key={offer.id}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-all flex flex-col sm:flex-row justify-between gap-5"
          >
            <div className="flex gap-4">
              {/* Offer Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img 
                  src={offer.image} 
                  alt={offer.category} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Offer content details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#0EA5A4] bg-[#0EA5A4]/10 px-2 py-0.5 rounded-full border border-[#0EA5A4]/20 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> {offer.offerPercent}
                  </span>
                  <span className={`text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                    offer.status === "Live" ? "bg-green-100 text-green-700" :
                    offer.status === "Pending Approval" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                  }`}>
                    {offer.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-sora text-[#0F172A] leading-tight">{offer.category}</h4>
                <p className="text-xs text-[#64748B]">Submitted by: <strong className="text-[#0F172A]">{offer.business}</strong></p>
                <p className="text-[10px] font-mono text-[#94A3B8]">Code: {offer.promoCode}</p>
                <p className="text-[9px] text-[#94A3B8] flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {offer.startDate} - {offer.endDate}
                </p>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex sm:flex-col justify-between items-end shrink-0 border-t sm:border-t-0 sm:border-l border-[#E5E7EB] pt-4 sm:pt-0 sm:pl-5">
              
              {/* Featured toggle */}
              <button 
                onClick={() => handleAction(offer.id, "Feature")}
                className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                  offer.isFeatured 
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-600" 
                    : "hover:bg-slate-50 border-slate-300 text-[#64748B]"
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${offer.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                <span>{offer.isFeatured ? "Featured" : "Feature Draft"}</span>
              </button>

              <div className="flex gap-1.5 mt-4 sm:mt-auto">
                {offer.status === "Pending Approval" ? (
                  <>
                    <button 
                      onClick={() => handleAction(offer.id, "Approve")}
                      className="p-1.5 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded transition-colors"
                      title="Approve Offer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleAction(offer.id, "Reject")}
                      className="p-1.5 bg-[#DC2626] hover:bg-[#DC2626]/90 text-white rounded transition-colors"
                      title="Reject Offer"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0F172A] rounded transition-colors" title="Edit Coupon">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleAction(offer.id, "Reject")}
                      className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded transition-colors"
                      title="Disable / Expire"
                    >
                      <XCircle className="w-4 h-4" />
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
