"use client";

import { Megaphone, Plus, Search, Filter, Edit2, Trash2, Calendar, Power, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const promotions = [
  { id: "PRM-501", title: "Diwali Special Offer", type: "Festival Campaign", status: "Active", cta: "Claim 50% Off", priority: "High", dates: "Oct 15 - Nov 10" },
  { id: "PRM-502", title: "Maldives Featured", type: "Destination Promo", status: "Scheduled", cta: "View Packages", priority: "Medium", dates: "Nov 01 - Nov 30" },
  { id: "PRM-503", title: "Summer Sale 2026", type: "Global Banner", status: "Ended", cta: "Book Now", priority: "High", dates: "May 01 - Jun 30" },
  { id: "PRM-504", title: "Marketplace Flash Sale", type: "Offer Card", status: "Draft", cta: "Unlock Deals", priority: "Low", dates: "Not set" },
];

export default function PromotionsPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Banner & Promotions
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage global banners, festival campaigns, and destination promotions across the platform.</p>
        </div>
        <div className="flex gap-2">
          <Button className="h-9 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all">
            <Plus className="w-4 h-4 mr-2" /> New Promotion
          </Button>
        </div>
      </div>

      <div className="bg-[#0B1220] border border-white/5 rounded-xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#020817]/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search promotions..." 
              className="w-full bg-[#020817] border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>
          <Button className="h-9 font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10 transition-colors">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#020817] border-b border-white/5">
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Campaign Details</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Type</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Duration</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Priority</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {promotions.map((promo, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#020817] border border-white/10 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4 text-[#94A3B8]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{promo.title}</p>
                        <p className="text-[10px] text-[#38BDF8] font-mono mt-0.5">CTA: {promo.cta}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-bold text-white/80">{promo.type}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center w-max gap-1 ${
                      promo.status === "Active" ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" :
                      promo.status === "Scheduled" ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20" :
                      promo.status === "Ended" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      "bg-white/5 text-[#94A3B8] border-white/10"
                    }`}>
                      {promo.status === "Active" && <Power className="w-3 h-3" />}
                      {promo.status === "Scheduled" && <Calendar className="w-3 h-3" />}
                      {promo.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-[#94A3B8]">{promo.dates}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold ${
                      promo.priority === "High" ? "text-[#EF4444]" :
                      promo.priority === "Medium" ? "text-[#F59E0B]" : "text-[#94A3B8]"
                    }`}>
                      {promo.priority}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <ActionBtn icon={Edit2} tooltip="Edit Promo" />
                      <ActionBtn icon={Trash2} tooltip="Delete" color="hover:text-red-400" />
                    </div>
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

function ActionBtn({ icon: Icon, tooltip, color }: any) {
  return (
    <button title={tooltip} className={`w-8 h-8 rounded flex items-center justify-center text-[#94A3B8] hover:bg-white/5 transition-colors ${color || "hover:text-white"}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}
