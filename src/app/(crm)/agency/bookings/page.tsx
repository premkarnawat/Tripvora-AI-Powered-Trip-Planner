"use client";

import { useState } from "react";
import { Search, Plus, Filter, Download, FileText, CheckCircle2, Clock, XCircle, MapPin, DollarSign, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockBookings = [
  { id: "BKG-9942", customer: "David Smith", dest: "Tokyo, Japan", amount: "₹8,50,000", paid: "₹4,25,000", status: "Confirmed", date: "Oct 12, 2026", invoice: "INV-2026-142" },
  { id: "BKG-9941", customer: "Acme Corp Retreat", dest: "Bali, Indonesia", amount: "₹45,00,000", paid: "₹45,00,000", status: "Confirmed", date: "Oct 10, 2026", invoice: "INV-2026-141" },
  { id: "BKG-9938", customer: "Priya Sharma", dest: "Europe Tour", amount: "₹12,00,000", paid: "₹0", status: "Pending", date: "Nov 05, 2026", invoice: "INV-2026-138" },
  { id: "BKG-9935", customer: "Rahul Verma", dest: "Maldives", amount: "₹5,20,000", paid: "₹5,20,000", status: "Cancelled", date: "Dec 15, 2026", invoice: "INV-2026-135" },
  { id: "BKG-9930", customer: "Sarah Jenkins", dest: "Dubai", amount: "₹3,40,000", paid: "₹1,70,000", status: "Pending", date: "Dec 20, 2026", invoice: "INV-2026-130" },
];

export default function BookingsPage() {
  const [filter, setFilter] = useState("All");

  const filteredBookings = filter === "All" ? mockBookings : mockBookings.filter(b => b.status === filter);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Bookings
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage client bookings and track payment statuses.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Button className="h-8 text-xs font-bold bg-[#0B1220] hover:bg-white/5 text-white border border-white/10 shadow-sm">
            <Download className="w-3.5 h-3.5 mr-1" /> Export Bookings
          </Button>
          <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> New Booking
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
              placeholder="Search by Booking ID, Customer, or Invoice..." 
              className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex gap-1">
            {["All", "Confirmed", "Pending", "Cancelled"].map(f => (
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
            <Filter className="w-3 h-3 mr-1.5" /> Filter Date
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
              <th className="py-3 px-4 w-12">Booking ID</th>
              <th className="py-3 px-4">Customer & Trip</th>
              <th className="py-3 px-4">Payment Status</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredBookings.map((bkg, i) => {
              const amountNum = parseInt(bkg.amount.replace(/[^0-9]/g, ''));
              const paidNum = parseInt(bkg.paid.replace(/[^0-9]/g, ''));
              const progress = amountNum > 0 ? (paidNum / amountNum) * 100 : 0;
              
              return (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="py-3 px-4 text-[10px] font-mono text-[#94A3B8]">{bkg.id}</td>
                  <td className="py-3 px-4">
                    <p className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">{bkg.customer}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]"><MapPin className="w-3 h-3 text-[#14B8A6]" /> {bkg.dest}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1.5 w-48">
                      <div className="flex justify-between items-center">
                        <StatusChip status={bkg.status} />
                        <span className="text-[10px] font-mono text-[#94A3B8]">{bkg.invoice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[#020817] rounded-full overflow-hidden border border-white/5">
                          <div className={`h-full rounded-full ${progress === 100 ? 'bg-[#10B981]' : progress > 0 ? 'bg-[#F59E0B]' : 'bg-transparent'}`} style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-white w-8 text-right">{progress}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-sm font-bold text-white flex items-center gap-1"><DollarSign className="w-3 h-3 text-[#94A3B8]"/> {bkg.amount}</span>
                      <span className="text-[10px] text-[#94A3B8]">Paid: <strong className={progress === 100 ? 'text-[#10B981]' : 'text-white'}>{bkg.paid}</strong></span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-7 px-2 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10 text-[10px] font-bold border border-white/10" title="Download Invoice">
                        <FileText className="w-3 h-3 mr-1" /> Invoice
                      </button>
                      <button className="w-7 h-7 rounded bg-[#10B981]/10 text-[#10B981] flex items-center justify-center hover:bg-[#10B981]/20 border border-[#10B981]/20" title="Send Payment Link"><Send className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  if (status === "Confirmed") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
  if (status === "Pending") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20"><Clock className="w-3 h-3" /> Pending</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20"><XCircle className="w-3 h-3" /> Cancelled</span>;
}
