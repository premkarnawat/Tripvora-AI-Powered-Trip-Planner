"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus, Building2, MapPin, DollarSign, Star, MoreHorizontal, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch('/api/crm/vendors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setVendors(data);
      })
      .catch(() => alert("Error loading vendor catalog"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddVendor = async () => {
    const name = prompt("Enter Vendor Name:");
    if (!name) return;
    const category = prompt("Enter Category (Hotel/Resort/Transport/Activity):", "Hotel") || "Hotel";
    const dest = prompt("Enter Destination Location:", "Goa, India") || "Goa, India";
    const price = prompt("Enter Contract Rate:", "₹15,000/night") || "₹15,000/night";

    const newVendor = {
      id: `V-${Date.now().toString().slice(-4)}`,
      name,
      category,
      dest,
      price,
      rating: 4.8,
      status: "Active"
    };

    // Optimistic UI Update
    setVendors([newVendor, ...vendors]);

    try {
      await fetch('/api/crm/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor)
      });
    } catch (err) {
      alert("Error saving vendor to DB");
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm("Remove vendor from agency catalog?")) return;
    setVendors(vendors.filter(v => v.id !== id && v.real_id !== id));
    try {
      await fetch(`/api/crm/vendors?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn("Delete DB notice:", err);
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesFilter = filter === "All" || v.category === filter;
    const matchesSearch = !search || (v.name || "").toLowerCase().includes(search.toLowerCase()) || (v.dest || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
          <Button onClick={() => alert("CSV Import template generated!")} className="h-8 text-xs font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
            <Upload className="w-3.5 h-3.5 mr-1" /> Import CSV
          </Button>
          <Button onClick={handleAddVendor} className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
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
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search vendors by name, destination..." 
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
      </div>

      {/* Table */}
      <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#94A3B8] font-mono animate-pulse">Loading live agency inventory from Supabase...</div>
        ) : filteredVendors.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#94A3B8]">No vendors match your search criteria. Click "Add Vendor" to create one.</div>
        ) : (
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
                <th className="py-3 px-4 w-12">ID</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Contract Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredVendors.map((vendor, i) => (
                <tr key={vendor.id || i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3 px-4 text-[10px] font-mono text-[#94A3B8]">{vendor.id || `V-${100+i}`}</td>
                  <td className="py-3 px-4">
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                      {vendor.name || vendor.vendor_name}
                    </p>
                    <p className="text-[10px] text-yellow-400 mt-1 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-current" /> {vendor.rating || 4.8}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#94A3B8] font-bold tracking-wide border border-white/10">{vendor.category || "Hotel"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1.5 text-xs text-white"><MapPin className="w-3.5 h-3.5 text-[#14B8A6]" /> {vendor.dest || vendor.destination || "Goa"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-bold text-white flex items-center gap-1 font-mono"><DollarSign className="w-3.5 h-3.5 text-[#94A3B8]"/> {vendor.price || "₹12,000"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Active</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleDeleteVendor(vendor.id || vendor.real_id)} className="p-1 rounded hover:bg-red-500/10 text-red-400 transition-colors title='Delete Vendor'"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
