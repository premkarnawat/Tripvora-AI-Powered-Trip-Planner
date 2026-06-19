"use client";

import { useState } from "react";
import { Search, Plus, Filter, LayoutGrid, List, TableProperties, MoreHorizontal, Phone, MessageCircle, Mail, MapPin, Calendar, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockLeads = [
  { id: "L-4092", name: "David Smith", whatsapp: "+1 234 567 8900", dest: "Tokyo, Japan", budget: "₹8,50,000", date: "Oct 12, 2026", pax: 4, source: "Website", score: "Hot", status: "Negotiation", owner: "Sarah" },
  { id: "L-4091", name: "Priya Sharma", whatsapp: "+91 98765 43210", dest: "Europe Tour", budget: "₹12,00,000", date: "Nov 05, 2026", pax: 2, source: "Instagram", score: "Warm", status: "Proposal Sent", owner: "Mike" },
  { id: "L-4089", name: "Acme HR Team", whatsapp: "+1 555 019 2834", dest: "Bali, Ind.", budget: "₹45,00,000", date: "Sep 20, 2026", pax: 24, source: "Referral", score: "Hot", status: "Qualified", owner: "JD" },
  { id: "L-4085", name: "Rahul Verma", whatsapp: "+91 99999 88888", dest: "Maldives", budget: "₹5,20,000", date: "Dec 15, 2026", pax: 2, source: "Marketplace", score: "Cold", status: "New", owner: "Unassigned" },
];

export default function LeadsPage() {
  const [view, setView] = useState("table");

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Lead Management
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Track and convert inquiries into booked trips.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex bg-[#0B1220] p-1 rounded-md border border-white/10 h-8">
            <button onClick={() => setView("kanban")} className={`px-2.5 rounded ${view === "kanban" ? "bg-white/10 text-white" : "text-[#94A3B8] hover:text-white"}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
            <button onClick={() => setView("list")} className={`px-2.5 rounded ${view === "list" ? "bg-white/10 text-white" : "text-[#94A3B8] hover:text-white"}`}><List className="w-3.5 h-3.5" /></button>
            <button onClick={() => setView("table")} className={`px-2.5 rounded ${view === "table" ? "bg-white/10 text-white" : "text-[#94A3B8] hover:text-white"}`}><TableProperties className="w-3.5 h-3.5" /></button>
          </div>
          <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-[#0B1220] p-3 rounded-md border border-white/5">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
          <input 
            type="text" 
            placeholder="Search leads by name, ID, or destination..." 
            className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
        <div className="flex gap-2">
          <Button className="h-8 text-xs font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
            <Filter className="w-3 h-3 mr-1.5" /> Filters
          </Button>
        </div>
      </div>

      {/* Content View */}
      {view === "table" && <LeadsTable leads={mockLeads} />}
      {view === "list" && <LeadsList leads={mockLeads} />}
      {view === "kanban" && <LeadsKanban leads={mockLeads} />}
      
    </div>
  );
}

function LeadsTable({ leads }: any) {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
            <th className="py-3 px-4 w-12">ID</th>
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">Trip Details</th>
            <th className="py-3 px-4">Budget</th>
            <th className="py-3 px-4">Score</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {leads.map((lead: any, i: number) => (
            <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
              <td className="py-3 px-4 text-[10px] font-mono text-[#94A3B8]">{lead.id}</td>
              <td className="py-3 px-4">
                <p className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">{lead.name}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-[#94A3B8]">
                  <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3" /> WhatsApp</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <p className="text-xs font-bold text-white">{lead.dest}</p>
                <p className="text-[10px] text-[#94A3B8] mt-1">{lead.date} • {lead.pax} Pax</p>
              </td>
              <td className="py-3 px-4">
                <span className="text-xs font-bold text-[#14B8A6]">{lead.budget}</span>
              </td>
              <td className="py-3 px-4">
                <ScoreChip score={lead.score} />
              </td>
              <td className="py-3 px-4">
                <StatusChip status={lead.status} />
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="h-7 px-2 rounded bg-[#10B981]/10 text-[#10B981] flex items-center justify-center hover:bg-[#10B981]/20 text-[10px] font-bold"><MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp</button>
                  <button className="h-7 px-2 rounded bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center hover:bg-[#38BDF8]/20 text-[10px] font-bold">Gen Package</button>
                  <button className="h-7 px-2 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10 text-[10px] font-bold">Quote</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadsList({ leads }: any) {
  return (
    <div className="space-y-3">
      {leads.map((lead: any, i: number) => (
        <div key={i} className="bg-[#0B1220] border border-white/5 rounded-md p-4 hover:border-[#14B8A6]/30 transition-colors flex items-center justify-between group">
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#14B8A6] to-[#0F172A] flex items-center justify-center text-xs font-bold text-white border border-[#14B8A6]/20">
              {lead.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-sm font-bold text-white">{lead.name}</h3>
                <ScoreChip score={lead.score} />
                <StatusChip status={lead.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#14B8A6]" /> {lead.dest}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {lead.date}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {lead.pax} Pax</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {lead.budget}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button className="h-8 text-xs font-bold bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/20">
              <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
            </Button>
            <Button className="h-8 text-xs font-bold bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/20">
              Generate Package
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function LeadsKanban({ leads }: any) {
  const columns = ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Booked"];
  
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar h-[60vh]">
      {columns.map(col => (
        <div key={col} className="w-72 shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">{col}</h3>
            <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full font-bold">
              {leads.filter((l: any) => l.status === col).length}
            </span>
          </div>
          <div className="flex-1 bg-[#0B1220]/50 rounded-md p-2 space-y-2 border border-white/5">
            {leads.filter((l: any) => l.status === col).map((lead: any, i: number) => (
              <div key={i} className="bg-[#020817] p-3 rounded border border-white/10 shadow-sm cursor-grab hover:border-[#14B8A6]/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <ScoreChip score={lead.score} />
                  <span className="text-[10px] text-[#94A3B8] font-mono">{lead.id}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{lead.name}</h4>
                <p className="text-xs text-[#14B8A6] font-medium mb-3">{lead.dest}</p>
                <div className="flex justify-between items-end pt-3 mt-3 border-t border-white/5">
                  <div className="flex gap-1">
                     <button className="w-6 h-6 rounded bg-[#10B981]/10 text-[#10B981] flex items-center justify-center hover:bg-[#10B981]/20" title="WhatsApp"><MessageCircle className="w-3 h-3" /></button>
                     <button className="w-6 h-6 rounded bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center hover:bg-[#38BDF8]/20" title="Generate Package"><MapPin className="w-3 h-3" /></button>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold text-white" title={`Owner: ${lead.owner}`}>
                    {lead.owner.substring(0, 1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoreChip({ score }: { score: string }) {
  if (score === "Hot") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">🔥 Hot</span>;
  if (score === "Warm") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">🟡 Warm</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[#94A3B8] border border-white/20">⚪ Cold</span>;
}

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "New": "bg-white/10 text-white border-white/20",
    "Contacted": "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20",
    "Qualified": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Proposal Sent": "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    "Negotiation": "bg-pink-500/10 text-pink-400 border-pink-500/20",
    "Booked": "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
    "Lost": "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-widest whitespace-nowrap ${styles[status] || styles["New"]}`}>
      {status}
    </span>
  );
}
