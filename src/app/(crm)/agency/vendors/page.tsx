"use client";

import { useState } from "react";
import { Search, Filter, Plus, Building2, MapPin, DollarSign, Star, MoreHorizontal, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockVendors = [
  { id: "V-104", name: "The Ritz-Carlton", category: "Hotel", dest: "Tokyo, Japan", price: "₹25,000/night", rating: 4.9, status: "Active" },
  { id: "V-103", name: "Hoshinoya Kyoto", category: "Resort", dest: "Kyoto, Japan", price: "₹35,000/night", rating: 4.8, status: "Active" },
  { id: "V-102", name: "Bali VIP Transfers", category: "Transport", dest: "Bali, Indonesia", price: "₹4,500/day", rating: 4.7, status: "Active" },
  { id: "V-101", name: "Scuba Goa Adventures", category: "Activity", dest: "Goa, India", price: "₹3,500/person", rating: 4.5, status: "Active" },
  { id: "V-098", name: "Taj Exotica", category: "Hotel", dest: "Goa, India", price: "₹18,000/night", rating: 4.8, status: "Active" },
  { id: "V-095", name: "Alpine Guides", category: "Tour Guide", dest: "Shimla, India", price: "₹2,500/day", rating: 4.6, status: "Inactive" },
];

export default function VendorsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Vendor Library
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage your agency's actual inventory for package building.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Button className="h-8 text-xs font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
            <Upload className="w-3.5 h-3.5 mr-1" /> Import CSV
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
              placeholder="Search vendors by name, destination, or category..." 
              className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex gap-1">
            {["All", "Hotel", "Resort", "Transport", "Activity", "Tour Guide"].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === f ? 'bg-white/10 text-white' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="h-8 text-xs font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
            <Filter className="w-3 h-3 mr-1.5" /> Advanced
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
              <th className="py-3 px-4 w-12">ID</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Contract Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {mockVendors.filter(v => filter === "All" || v.category === filter).map((vendor, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="py-3 px-4 text-[10px] font-mono text-[#94A3B8]">{vendor.id}</td>
                <td className="py-3 px-4">
                  <p className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors flex items-center gap-2">
                    {vendor.name}
                  </p>
                  <p className="text-[10px] text-yellow-400 mt-1 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-current" /> {vendor.rating}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#94A3B8] font-bold tracking-wide border border-white/10">{vendor.category}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="flex items-center gap-1.5 text-xs text-white"><MapPin className="w-3.5 h-3.5 text-[#14B8A6]" /> {vendor.dest}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs font-bold text-white flex items-center gap-1 font-mono"><DollarSign className="w-3.5 h-3.5 text-[#94A3B8]"/> {vendor.price}</span>
                </td>
                <td className="py-3 px-4">
                  {vendor.status === "Active" ? (
                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Active</span>
                  ) : (
                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[#94A3B8] border border-white/20">Inactive</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-7 px-2 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10 text-[10px] font-bold">Edit</button>
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
