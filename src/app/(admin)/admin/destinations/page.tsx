"use client";

import { useState, useEffect } from "react";
import { 
  Compass, Search, Plus, Eye, EyeOff, Edit2, 
  MapPin, Calendar, Coins, Star, Trash2, Loader2
} from "lucide-react";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch('/api/admin/destinations');
        if (res.ok) {
          const data = await res.json();
          setDestinations(data);
        } else {
          console.error("Failed to fetch destinations");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, []);

  const toggleVisibility = (id: number) => {
    setDestinations(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, visibility: d.visibility === "Public" ? "Draft" : "Public" };
      }
      return d;
    }));
  };

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Content Library</h2>
          <h1 className="text-3xl font-bold font-sora text-[#0F172A]">Destinations</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage public destination wikis, custom media cards, and default trip planners.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto">
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input 
            type="text" 
            placeholder="Search destinations by name or desc..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F1F5F9] border border-transparent rounded-full py-1.5 pl-9 pr-4 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all"
          />
        </div>
        
        <span className="text-xs font-bold text-[#64748B]">
          {filteredDestinations.length} destinations
        </span>
      </div>

      {/* Grid listing destinations content */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-[#64748B]">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading destinations...
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-[#E5E7EB] bg-white rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Compass className="w-8 h-8 text-[#94A3B8]" />
          </div>
          <h3 className="text-[#0F172A] font-bold mb-1">No Destinations Found</h3>
          <p className="text-xs text-[#64748B]">There are no destinations matching your current filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
          <div 
            key={dest.id}
            className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:translate-y-[-2px] hover:shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-all flex flex-col justify-between h-[420px]"
          >
            {/* Header image and visibility */}
            <div className="h-44 bg-slate-100 relative shrink-0">
              <img 
                src={dest.image} 
                alt={dest.name} 
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[8px] font-bold tracking-widest text-white uppercase ${
                dest.visibility === "Public" ? "bg-[#16A34A]" : "bg-slate-500"
              }`}>
                {dest.visibility}
              </span>
            </div>

            {/* Content info details */}
            <div className="p-5 flex-1 space-y-3">
              <div>
                <h4 className="text-base font-bold font-sora text-[#0F172A] flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#0EA5A4]" />
                  <span>{dest.name}</span>
                </h4>
                <p className="text-xs text-[#64748B] line-clamp-2 mt-1 leading-snug">{dest.description}</p>
              </div>

              {/* Detailed parameters */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] font-semibold text-[#64748B]">
                <div className="flex justify-between">
                  <span>Best Months:</span>
                  <span className="text-[#0F172A]">{dest.bestMonths}</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget Scope:</span>
                  <span className="text-[#16A34A]">{dest.budget}</span>
                </div>
                <div className="truncate">
                  <span>Attractions:</span>
                  <span className="text-[#0F172A] ml-1">{dest.attractions}</span>
                </div>
                <div className="truncate">
                  <span>Activities:</span>
                  <span className="text-[#0EA5A4] ml-1">{dest.activities}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions panel */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-[#E5E7EB] flex items-center justify-end gap-1.5 shrink-0">
              <button 
                onClick={() => toggleVisibility(dest.id)}
                className="w-8 h-8 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center justify-center text-[#64748B] transition-all"
                title={dest.visibility === "Public" ? "Make Draft" : "Make Public"}
              >
                {dest.visibility === "Public" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button className="w-8 h-8 bg-[#0EA5A4]/10 hover:bg-[#0EA5A4]/20 border border-[#0EA5A4]/20 rounded-lg flex items-center justify-center text-[#0EA5A4] transition-all" title="Edit Destination">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center justify-center text-red-600 transition-all" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
          ))}
        </div>
      )}

    </div>
  );
}
