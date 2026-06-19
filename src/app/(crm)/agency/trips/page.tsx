"use client";

import { useState } from "react";
import { Search, Filter, Plus, FileText, Send, Bell, MapPin, Users, Calendar, DollarSign, MoreHorizontal, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockTrips = [
  { id: "TRP-209", name: "Smith Family Vacay", dest: "Tokyo, Japan", date: "Oct 15 - Oct 25, 2026", pax: 4, value: "₹8,50,000", profit: "₹1,25,000", status: "Upcoming", client: "David Smith" },
  { id: "TRP-208", name: "Acme Corp Retreat", dest: "Bali, Indonesia", date: "Oct 10 - Oct 17, 2026", pax: 24, value: "₹45,00,000", profit: "₹8,50,000", status: "Active", client: "Acme HR" },
  { id: "TRP-201", name: "Jenkins Honeymoon", dest: "Maldives", date: "Sep 20 - Sep 28, 2026", pax: 2, value: "₹5,20,000", profit: "₹95,000", status: "Completed", client: "Sarah Jenkins" },
  { id: "TRP-199", name: "Solo Backpacking", dest: "Vietnam", date: "Sep 05 - Sep 15, 2026", pax: 1, value: "₹1,15,000", profit: "₹18,000", status: "Completed", client: "Mike Ross" },
  { id: "TRP-195", name: "Delta Team Offsite", dest: "Goa, India", date: "Aug 12 - Aug 15, 2026", pax: 12, value: "₹12,00,000", profit: "₹2,40,000", status: "Cancelled", client: "Delta Corp" },
];

export default function TripsPage() {
  const [filter, setFilter] = useState("All");

  const filteredTrips = filter === "All" ? mockTrips : mockTrips.filter(t => t.status === filter);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Trip Management
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Track and manage active, upcoming, and completed departures.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Create Trip
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
              placeholder="Search by trip name, destination, or client..." 
              className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex gap-1">
            {["All", "Active", "Upcoming", "Completed", "Cancelled"].map(f => (
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

      {/* Overview Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Active Trips" value="2" sub="Currently traveling" color="text-[#10B981]" />
        <MetricCard label="Upcoming (30d)" value="14" sub="Next departures" color="text-[#38BDF8]" />
        <MetricCard label="Total Value" value="₹2,45,50,000" sub="Active & Upcoming" color="text-white" />
        <MetricCard label="Expected Profit" value="₹38,20,000" sub="Active & Upcoming" color="text-[#14B8A6]" />
      </div>

      {/* Table */}
      <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
              <th className="py-3 px-4 w-12">ID</th>
              <th className="py-3 px-4">Trip Details</th>
              <th className="py-3 px-4">Logistics</th>
              <th className="py-3 px-4">Financials</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredTrips.map((trip, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="py-3 px-4 text-[10px] font-mono text-[#94A3B8]">{trip.id}</td>
                <td className="py-3 px-4">
                  <p className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">{trip.name}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">{trip.client}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-white"><MapPin className="w-3.5 h-3.5 text-[#14B8A6]" /> {trip.dest}</span>
                    <span className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]"><Calendar className="w-3 h-3" /> {trip.date} • <Users className="w-3 h-3 ml-1" /> {trip.pax} Pax</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-[#94A3B8]"/> {trip.value}</span>
                    <span className="text-[10px] font-bold text-[#14B8A6]">Profit: {trip.profit}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <TripStatusChip status={trip.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-7 px-2 rounded bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center hover:bg-[#38BDF8]/20 text-[10px] font-bold border border-[#38BDF8]/20" title="View Itinerary">
                      <FileText className="w-3 h-3 mr-1" /> Itinerary
                    </button>
                    <button className="w-7 h-7 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10" title="Send Documents"><Send className="w-3.5 h-3.5" /></button>
                    <button className="w-7 h-7 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10" title="Send Reminder"><Bell className="w-3.5 h-3.5" /></button>
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

function MetricCard({ label, value, sub, color }: any) {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-md p-4">
      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">{label}</p>
      <h3 className={`text-xl font-bold tracking-tight mb-1 ${color}`}>{value}</h3>
      <p className="text-[10px] text-[#94A3B8]">{sub}</p>
    </div>
  );
}

function TripStatusChip({ status }: { status: string }) {
  if (status === "Active") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Active</span>;
  if (status === "Upcoming") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20"><Plane className="w-3 h-3" /> Upcoming</span>;
  if (status === "Completed") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[#94A3B8] border border-white/20">Completed</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">Cancelled</span>;
}
