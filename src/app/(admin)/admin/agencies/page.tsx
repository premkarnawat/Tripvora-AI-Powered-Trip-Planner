"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, Search, Plus, ExternalLink, ShieldCheck, 
  MessageSquare, ChevronRight, AlertCircle, ArrowUpRight
} from "lucide-react";

// Mock data for B2B agencies in TripPilot
const agenciesData = [
  {
    id: "wanderlust-holidays",
    name: "Wanderlust Holidays",
    city: "New Delhi, India",
    plan: "Premium Tier",
    badgeType: "ELITE PARTNER",
    badgeColor: "bg-[#0EA5A4]/10 text-[#0EA5A4] border-[#0EA5A4]/25",
    revenue: "₹2,45,600",
    conversion: "18.5%",
    leads: 284,
    bookings: 84,
    whatsappConnected: true,
    subscriptionStatus: "Active",
    staffAvatars: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
    ],
    avatarPlaceholder: "WH"
  },
  {
    id: "travelista-india",
    name: "Travelista India",
    city: "Mumbai, India",
    plan: "Growth Plan",
    badgeType: "GROWTH PLAN",
    badgeColor: "bg-teal-500/10 text-teal-600 border-teal-500/25",
    revenue: "₹1,92,480",
    conversion: "15.2%",
    leads: 198,
    bookings: 62,
    whatsappConnected: true,
    subscriptionStatus: "Active",
    staffAvatars: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
    ],
    avatarPlaceholder: "TI"
  },
  {
    id: "elite-escapes",
    name: "Elite Escapes",
    city: "Bangalore, India",
    plan: "Premium Tier",
    badgeType: "OVERDUE REVIEW",
    badgeColor: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20",
    revenue: "₹3,20,300",
    conversion: "12.8%",
    leads: 450,
    bookings: 110,
    whatsappConnected: false,
    subscriptionStatus: "Pending Audit",
    staffAvatars: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
    ],
    avatarPlaceholder: "EE"
  },
  {
    id: "voyager-planners",
    name: "Voyager Planners",
    city: "Chennai, India",
    plan: "Premium Tier",
    badgeType: "ELITE PARTNER",
    badgeColor: "bg-[#0EA5A4]/10 text-[#0EA5A4] border-[#0EA5A4]/25",
    revenue: "₹96,400",
    conversion: "11.4%",
    leads: 120,
    bookings: 34,
    whatsappConnected: true,
    subscriptionStatus: "Active",
    staffAvatars: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop"
    ],
    avatarPlaceholder: "VP"
  },
  {
    id: "global-trails",
    name: "Global Trails",
    city: "Kolkata, India",
    plan: "Growth Plan",
    badgeType: "PREMIUM PLAN",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/25",
    revenue: "₹85,900",
    conversion: "10.1%",
    leads: 94,
    bookings: 22,
    whatsappConnected: true,
    subscriptionStatus: "Active",
    staffAvatars: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=100&auto=format&fit=crop"
    ],
    avatarPlaceholder: "GT"
  },
  {
    id: "adventure-hub",
    name: "Adventure Hub",
    city: "Pune, India",
    plan: "Base Plan",
    badgeType: "RENEWED",
    badgeColor: "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/25",
    revenue: "₹78,600",
    conversion: "9.3%",
    leads: 85,
    bookings: 20,
    whatsappConnected: true,
    subscriptionStatus: "Renewed",
    staffAvatars: [
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop"
    ],
    avatarPlaceholder: "AH"
  }
];

export default function AdminAgenciesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("All");

  const filteredAgencies = agenciesData.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agency.city.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterTab === "All") return matchesSearch;
    if (filterTab === "Elite") return matchesSearch && agency.badgeType === "ELITE PARTNER";
    if (filterTab === "Pending") return matchesSearch && agency.subscriptionStatus === "Pending Audit";
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Header section with Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Partners Dashboard</h2>
          <h1 className="text-3xl font-bold font-sora text-[#0F172A]">Agencies (B2B)</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage and monitor your 124 luxury travel partners.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto">
          <Plus className="w-4 h-4" />
          <span>Onboard New Agency</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Total Active Agencies</span>
            <h3 className="text-2xl font-bold font-sora text-[#0F172A] mt-1">124</h3>
            <span className="text-[10px] text-[#16A34A] font-semibold flex items-center mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12% vs last month
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#0EA5A4]/10 flex items-center justify-center text-[#0EA5A4]">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Partner Revenue (30d)</span>
            <h3 className="text-2xl font-bold font-sora text-[#0F172A] mt-1">₹8,42,300</h3>
            <span className="text-[10px] text-[#16A34A] font-semibold flex items-center mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +10.3% vs last month
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600">
            <ExternalLink className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Pending Approvals</span>
            <h3 className="text-2xl font-bold font-sora text-[#0F172A] mt-1">16</h3>
            <span className="text-[10px] text-[#DC2626] font-semibold flex items-center mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> Action required
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {[
            { label: "All Partners", tab: "All" },
            { label: "Elite Partners", tab: "Elite" },
            { label: "Pending Verifications", tab: "Pending" }
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setFilterTab(item.tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filterTab === item.tab 
                  ? "bg-[#0EA5A4]/15 text-[#0EA5A4]" 
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input 
            type="text" 
            placeholder="Search partners by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F1F5F9] border border-transparent rounded-full py-1.5 pl-9 pr-4 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all"
          />
        </div>
      </div>

      {/* Grid Cards Layout exactly like reference image */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgencies.map((agency) => (
          <Link href={`/admin/agencies/${agency.id}`} key={agency.id} className="block">
            <div 
              className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:translate-y-[-2px] hover:shadow-[0_4px_25px_rgba(0,0,0,0.05)] transition-all cursor-pointer flex flex-col justify-between min-h-[275px]"
            >
              {/* Card Header */}
              <div className="p-5 flex items-start justify-between border-b border-[#E5E7EB]/50">
                <div className="w-10 h-10 rounded-xl bg-[#0EA5A4]/10 text-[#0EA5A4] flex items-center justify-center font-bold text-sm shrink-0 border border-[#0EA5A4]/15">
                  {agency.avatarPlaceholder}
                </div>
                <span className={`px-2 py-0.5 rounded border text-[9px] font-bold tracking-wider ${agency.badgeColor}`}>
                  {agency.badgeType}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1">
                <h4 className="text-base font-bold font-sora text-[#0F172A]">{agency.name}</h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">{agency.city}</p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">Monthly Revenue</span>
                    <p className="text-sm font-bold text-[#0F172A] mt-0.5">{agency.revenue}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">Leads Generated</span>
                    <p className="text-sm font-bold text-[#0F172A] mt-0.5">{agency.leads} ({agency.conversion})</p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 bg-slate-50/50 border-t border-[#E5E7EB]/50 flex items-center justify-between shrink-0">
                
                {/* Staff avatars list & WhatsApp status */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {agency.staffAvatars.map((avatar, idx) => (
                      <div key={idx} className="w-6 h-6 rounded-full overflow-hidden border-2 border-white bg-slate-100 shrink-0">
                        <img src={avatar} alt="Staff" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {agency.leads > 200 && (
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-[#64748B] shrink-0">
                        +8
                      </div>
                    )}
                  </div>

                  {agency.whatsappConnected && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-[#16A34A] bg-[#16A34A]/10 border border-[#16A34A]/20 px-2 py-0.5 rounded-full">
                      <MessageSquare className="w-2.5 h-2.5" /> Connected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0EA5A4] hover:underline">
                  <span>Open Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>

              </div>

            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
