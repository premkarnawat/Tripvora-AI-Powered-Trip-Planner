"use client";

import { Search, Plus, Filter, Download, Building2, MapPin, Map, User, CreditCard, MoreHorizontal, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockVendors = [
  { id: "VND-402", name: "W Bali Seminyak", category: "Accommodation", location: "Bali, Indonesia", terms: "Post-paid 30 Days", rate: "Contract Rate (-15%)", status: "Active" },
  { id: "VND-401", name: "VIP Transfers Ltd", category: "Transportation", location: "Tokyo, Japan", terms: "Pre-paid 100%", rate: "Standard", status: "Active" },
  { id: "VND-399", name: "Elena Rossi (Guide)", category: "Local Guide", location: "Rome, Italy", terms: "Post-paid 15 Days", rate: "Hourly Rate (€50)", status: "Active" },
  { id: "VND-395", name: "Maldives Seaplane Co.", category: "Transportation", location: "Malé, Maldives", terms: "Pre-paid 100%", rate: "Contract Rate (-5%)", status: "Inactive" },
];

export default function VendorsPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Direct Vendors
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage direct supplier contracts, hotels, guides, and transportation.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Button className="h-8 text-xs font-bold bg-[#0B1220] hover:bg-white/5 text-white border border-white/10 shadow-sm">
            <Download className="w-3.5 h-3.5 mr-1" /> Export List
          </Button>
          <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Vendor
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
              placeholder="Search vendors by name, category, or location..." 
              className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="h-8 text-xs font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
            <Filter className="w-3 h-3 mr-1.5" /> Category Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
              <th className="py-3 px-4 w-12">ID</th>
              <th className="py-3 px-4">Vendor Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Contract Terms</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {mockVendors.map((vendor, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="py-3 px-4 text-[10px] font-mono text-[#94A3B8]">{vendor.id}</td>
                <td className="py-3 px-4">
                  <p className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">{vendor.name}</p>
                  <span className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] mt-1"><MapPin className="w-3 h-3" /> {vendor.location}</span>
                </td>
                <td className="py-3 px-4">
                  <VendorCategoryChip category={vendor.category} />
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs font-bold text-white">{vendor.rate}</span>
                    <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]"><CreditCard className="w-3 h-3" /> {vendor.terms}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {vendor.status === "Active" ? 
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"><CheckCircle2 className="w-3 h-3" /> Active</span> :
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[#94A3B8] border border-white/20">Inactive</span>
                  }
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-7 px-2 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10 text-[10px] font-bold border border-white/10" title="View Contract">
                      <FileText className="w-3 h-3 mr-1" /> Contract
                    </button>
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

function VendorCategoryChip({ category }: { category: string }) {
  if (category === "Accommodation") return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20"><Building2 className="w-3 h-3" /> {category}</span>;
  if (category === "Transportation") return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20"><Map className="w-3 h-3" /> {category}</span>;
  if (category === "Local Guide") return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20"><User className="w-3 h-3" /> {category}</span>;
  return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-white/10 text-[#94A3B8] border border-white/20">{category}</span>;
}
