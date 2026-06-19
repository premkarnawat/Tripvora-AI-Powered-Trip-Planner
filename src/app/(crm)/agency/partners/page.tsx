"use client";

import { Search, Plus, Filter, Globe, DollarSign, MapPin, CheckCircle2, ShieldCheck, Mail, MessageCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockPartners = [
  { id: "PTN-104", name: "Asia Pacific DMC", type: "DMC", region: "Southeast Asia", commission: "15%", tier: "Preferred", status: "Active", contact: "sarah@asiapacific.com" },
  { id: "PTN-103", name: "EuroTours Wholesale", type: "Wholesaler", region: "Europe", commission: "12%", tier: "Standard", status: "Active", contact: "bookings@eurotours.eu" },
  { id: "PTN-098", name: "Dubai Desert Safari Excursions", type: "Activity Provider", region: "UAE", commission: "20%", tier: "Preferred", status: "Active", contact: "hello@dubaidesert.ae" },
  { id: "PTN-095", name: "Global Bedbank", type: "B2B Aggregator", region: "Global", commission: "10%", tier: "Standard", status: "Inactive", contact: "api@globalbedbank.com" },
];

export default function PartnersPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            B2B Partners
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage Destination Management Companies (DMCs) and Wholesalers.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Partner
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-[#0B1220] p-3 rounded-md border border-white/5">
        <div className="flex gap-4 items-center">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search partners by name, region, or type..." 
              className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="h-8 text-xs font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
            <Filter className="w-3 h-3 mr-1.5" /> Filter by Region
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
              <th className="py-3 px-4 w-12">ID</th>
              <th className="py-3 px-4">Partner Details</th>
              <th className="py-3 px-4">Network Region</th>
              <th className="py-3 px-4">Commission</th>
              <th className="py-3 px-4">Status & Tier</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {mockPartners.map((partner, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="py-3 px-4 text-[10px] font-mono text-[#94A3B8]">{partner.id}</td>
                <td className="py-3 px-4">
                  <p className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">{partner.name}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">{partner.type} • {partner.contact}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="flex items-center gap-1.5 text-xs text-white"><Globe className="w-3.5 h-3.5 text-[#14B8A6]" /> {partner.region}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-[#94A3B8]" /> {partner.commission}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1.5 items-start">
                    {partner.status === "Active" ? 
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"><CheckCircle2 className="w-3 h-3" /> Active</span> :
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[#94A3B8] border border-white/20">Inactive</span>
                    }
                    {partner.tier === "Preferred" && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20"><ShieldCheck className="w-3 h-3" /> Preferred</span>}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10" title="Email Partner"><Mail className="w-3.5 h-3.5" /></button>
                    <button className="w-7 h-7 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10" title="WhatsApp"><MessageCircle className="w-3.5 h-3.5" /></button>
                    <button className="w-7 h-7 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
