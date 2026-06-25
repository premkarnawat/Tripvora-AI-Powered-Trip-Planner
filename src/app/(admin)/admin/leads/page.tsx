"use client";

import { useState } from "react";
import { 
  Send, Search, Filter, CheckCircle2, AlertCircle, 
  MapPin, Coins, ArrowUpRight, Plus, ExternalLink
} from "lucide-react";

// Mock lead matching data in Travixa
const leadsData = [
  {
    id: "TRIP-2026-00042",
    source: "Talk to Expert CTA",
    assignedAgency: "Wanderlust Holidays",
    status: "Qualified",
    tripType: "Honeymoon Escape",
    budget: "₹3,50,000",
    destination: "Maldives",
    date: "20 Jun 2026",
    revenuePotential: "₹52,500" // 15% platform commission
  },
  {
    id: "TRIP-2026-00041",
    source: "AI Trip Planner Builder",
    assignedAgency: "Travelista India",
    status: "Negotiation",
    tripType: "Adventure Trek",
    budget: "₹1,20,000",
    destination: "Ladakh, India",
    date: "19 Jun 2026",
    revenuePotential: "₹18,000"
  },
  {
    id: "TRIP-2026-00040",
    source: "Goa Resort Marketplace Listing",
    assignedAgency: "Pending Auto Match",
    status: "New Lead",
    tripType: "Family Holiday",
    budget: "₹85,000",
    destination: "Goa, India",
    date: "18 Jun 2026",
    revenuePotential: "₹12,750"
  },
  {
    id: "TRIP-2026-00039",
    source: "Instagram Banner Campaign",
    assignedAgency: "Elite Escapes",
    status: "Booked",
    tripType: "Luxury Safari",
    budget: "₹5,000 Flat", // flat payout or similar
    destination: "Taj Safaris, RJ",
    date: "15 Jun 2026",
    revenuePotential: "₹5,000"
  }
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState(leadsData);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = leads.filter(l => 
    l.destination.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.assignedAgency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Lead Distribution Center</h2>
          <h1 className="text-3xl font-bold font-sora text-[#0F172A]">Platform Leads</h1>
          <p className="text-sm text-[#64748B] mt-1">Audit auto-matching lead pipes, distribution lists, and potential commission metrics.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto">
          <Plus className="w-4 h-4" />
          <span>Manual Lead Match</span>
        </button>
      </div>

      {/* Stats metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Leads Pipeline Value</span>
            <h3 className="text-2xl font-bold font-sora text-[#0F172A] mt-1">₹6,80,000</h3>
            <span className="text-[10px] text-[#16A34A] font-semibold flex items-center mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% leads volume
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#0EA5A4]/10 flex items-center justify-center text-[#0EA5A4]">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Platform Commission Potential</span>
            <h3 className="text-2xl font-bold font-sora text-[#0EA5A4] mt-1">₹1,02,000</h3>
            <span className="text-[10px] text-[#16A34A] font-semibold flex items-center mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> 15% platform split
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Average Conversion Rate</span>
            <h3 className="text-2xl font-bold font-sora text-[#0F172A] mt-1">18.4%</h3>
            <span className="text-[10px] text-[#16A34A] font-semibold flex items-center mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Match in under 5 mins
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50/10 flex items-center justify-center text-emerald-600">
            <ExternalLink className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input 
            type="text" 
            placeholder="Search leads by ID, agency, or destination..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F1F5F9] border border-transparent rounded-full py-1.5 pl-9 pr-4 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all"
          />
        </div>
        
        <span className="text-xs font-bold text-[#64748B]">
          {filteredLeads.length} leads in queue
        </span>
      </div>

      {/* Leads listing table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-slate-50 text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                <th className="p-4 font-normal">Lead ID</th>
                <th className="p-4 font-normal">Source</th>
                <th className="p-4 font-normal">Assigned Agency</th>
                <th className="p-4 font-normal">Trip Type</th>
                <th className="p-4 font-normal">Budget</th>
                <th className="p-4 font-normal">Destination</th>
                <th className="p-4 font-normal">Potential Fee</th>
                <th className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]/50 text-xs font-semibold text-[#0F172A]">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-[#0EA5A4]">{lead.id}</td>
                  <td className="p-4 text-[#64748B]">{lead.source}</td>
                  <td className="p-4">
                    <span className={lead.assignedAgency.startsWith("Pending") ? "text-amber-600 font-bold" : "text-[#0F172A]"}>
                      {lead.assignedAgency}
                    </span>
                  </td>
                  <td className="p-4 text-[#64748B]">{lead.tripType}</td>
                  <td className="p-4 font-bold text-[#0F172A]">{lead.budget}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0EA5A4] shrink-0" />
                      <span>{lead.destination}</span>
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#16A34A]">{lead.revenuePotential}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      lead.status === "Booked" ? "bg-green-100 text-green-700" :
                      lead.status === "New Lead" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
