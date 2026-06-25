"use client";

import { useState } from "react";
import { 
  Megaphone, Search, Plus, Eye, MousePointerClick, 
  Send, Percent, Calendar, Play, Pause, Trash2
} from "lucide-react";

// Mock ads data in Travixa Admin Panel
const campaignsData = [
  {
    id: 1,
    name: "Luxury Maldives Honeymoon Slide",
    placement: "Homepage Banner",
    views: 84000,
    clicks: 6720,
    ctr: "8.0%",
    leads: 840,
    conversions: 184,
    status: "Active",
    startDate: "01 Jun 2026",
    endDate: "30 Jun 2026",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Monsoon Treks in Western Ghats",
    placement: "Offer Slider",
    views: 45000,
    clicks: 2250,
    ctr: "5.0%",
    leads: 180,
    conversions: 42,
    status: "Active",
    startDate: "10 Jun 2026",
    endDate: "15 Jul 2026",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Flat 15% Off Razorpay Launch Offer",
    placement: "Promotional Campaign",
    views: 120000,
    clicks: 14400,
    ctr: "12.0%",
    leads: 1620,
    conversions: 340,
    status: "Paused",
    startDate: "01 May 2026",
    endDate: "31 May 2026",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Taj Hotels Premium Featured Banner",
    placement: "Business Advertisement",
    views: 32000,
    clicks: 1280,
    ctr: "4.0%",
    leads: 94,
    conversions: 12,
    status: "Scheduled",
    startDate: "01 Jul 2026",
    endDate: "31 Jul 2026",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format&fit=crop"
  }
];

export default function AdminAdvertisementsPage() {
  const [campaigns, setCampaigns] = useState(campaignsData);
  const [placementFilter, setPlacementFilter] = useState("All");

  const placements = ["All", "Homepage Banner", "Offer Slider", "Promotional Campaign", "Business Advertisement"];

  const toggleCampaign = (id: number) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === "Active" ? "Paused" : "Active" };
      }
      return c;
    }));
  };

  const filteredCampaigns = campaigns.filter(c => 
    placementFilter === "All" || c.placement === placementFilter
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Ad Manager</h2>
          <h1 className="text-3xl font-bold font-sora text-[#0F172A]">Advertisements</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage homepage banners, promotional campaigns, and track conversion rates.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto">
          <Plus className="w-4 h-4" />
          <span>Create Ad Campaign</span>
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <StatItem title="Total Ad Views" value="281.0k" icon={Eye} color="text-sky-600" bg="bg-sky-50" />
        <StatItem title="Total Clicks" value="24.6k" icon={MousePointerClick} color="text-[#0EA5A4]" bg="bg-[#0EA5A4]/10" />
        <StatItem title="Average CTR" value="8.7%" icon={Percent} color="text-teal-600" bg="bg-teal-50" />
        <StatItem title="Ad Leads" value="2,734" icon={Send} color="text-purple-600" bg="bg-purple-50" />
        <StatItem title="Conversions" value="578" icon={Calendar} color="text-[#16A34A]" bg="bg-[#16A34A]/10" />
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex gap-2 overflow-x-auto">
        {placements.map(p => (
          <button
            key={p}
            onClick={() => setPlacementFilter(p)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              placementFilter === p 
                ? "bg-[#0EA5A4]/15 text-[#0EA5A4]" 
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Grid List with Banner Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCampaigns.map((camp) => (
          <div 
            key={camp.id}
            className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-all flex flex-col md:flex-row h-auto md:h-64"
          >
            
            {/* Live Banner Preview Box */}
            <div className="w-full md:w-48 bg-slate-100 relative shrink-0 border-r border-[#E5E7EB] h-44 md:h-full">
              <img 
                src={camp.image} 
                alt={camp.name} 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-[#0F172A]/85 text-white px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase">
                Ad Preview
              </span>
              <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-bold tracking-widest text-white uppercase ${
                camp.status === "Active" ? "bg-[#16A34A]" :
                camp.status === "Paused" ? "bg-amber-500" : "bg-blue-500"
              }`}>
                {camp.status}
              </span>
            </div>

            {/* Campaign info and stats */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-[#0EA5A4] uppercase tracking-widest">{camp.placement}</span>
                <h4 className="text-sm font-bold font-sora text-[#0F172A] mt-0.5 leading-snug">{camp.name}</h4>
                <p className="text-[10px] text-[#94A3B8] mt-1">Duration: {camp.startDate} - {camp.endDate}</p>
              </div>

              {/* Stats block */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center bg-slate-50 border border-slate-100 rounded-lg p-2">
                <div>
                  <span className="text-[8px] font-bold text-[#94A3B8] uppercase block">CTR</span>
                  <p className="text-xs font-bold text-[#0F172A] mt-0.5">{camp.ctr}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-[#94A3B8] uppercase block">Leads</span>
                  <p className="text-xs font-bold text-[#0F172A] mt-0.5">{camp.leads}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-[#94A3B8] uppercase block">Convs</span>
                  <p className="text-xs font-bold text-[#16A34A] mt-0.5">{camp.conversions}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-3.5 mt-4">
                <span className="text-[9px] text-[#94A3B8] font-semibold">{camp.views.toLocaleString()} impressions</span>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleCampaign(camp.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                      camp.status === "Active" 
                        ? "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-600" 
                        : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600"
                    }`}
                    title={camp.status === "Active" ? "Pause Campaign" : "Resume Campaign"}
                  >
                    {camp.status === "Active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 flex items-center justify-center transition-all" title="Delete Campaign">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

function StatItem({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between">
      <div>
        <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">{title}</span>
        <h4 className="text-xl font-bold font-sora text-[#0F172A] mt-1">{value}</h4>
      </div>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg} ${color}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
    </div>
  );
}
