"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Filter, Download, MessageCircle, MoreHorizontal, Mail, MapPin, Calendar, Star, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/crm/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        } else {
          console.error("Failed to fetch customers");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Customers
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage your customer relationships and lifetime value.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Button className="h-8 text-xs font-bold bg-[#0B1220] hover:bg-white/5 text-white border border-white/10">
            <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
          </Button>
          <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Customer
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-[#0B1220] p-3 rounded-md border border-white/5">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
          <input 
            type="text" 
            placeholder="Search by name, email, phone, or city..." 
            className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
        <div className="flex gap-2">
          <Button className="h-8 text-xs font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
            <Filter className="w-3 h-3 mr-1.5" /> Segment
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
              <th className="py-3 px-4 w-12">ID</th>
              <th className="py-3 px-4">Customer Details</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">LTV Score</th>
              <th className="py-3 px-4 text-right">Total Spend</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-20 text-center text-[#94A3B8]">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-[#94A3B8]" />
                  </div>
                  <h3 className="text-white font-bold mb-1">No Customers Found</h3>
                  <p className="text-xs text-[#94A3B8]">Your customer directory is empty.</p>
                </td>
              </tr>
            ) : customers.map((cust, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="py-3 px-4 text-[10px] font-mono text-[#94A3B8]">{cust.id}</td>
                <td className="py-3 px-4">
                  <p className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">{cust.name}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">{cust.trips} Trips • Since {cust.since}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1 text-[10px]">
                    <span className="flex items-center gap-1.5 text-white"><MessageCircle className="w-3 h-3 text-[#10B981]" /> {cust.whatsapp}</span>
                    <span className="flex items-center gap-1.5 text-[#94A3B8]"><Mail className="w-3 h-3" /> {cust.email}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#14B8A6]" /> {cust.city}</span>
                </td>
                <td className="py-3 px-4">
                  <LtvChip score={cust.ltv} />
                </td>
                <td className="py-3 px-4 text-right">
                  <p className="text-xs font-bold text-[#14B8A6]">{cust.spend}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">Last: {cust.lastTrip}</p>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10" title="View Profile"><Search className="w-3.5 h-3.5" /></button>
                    <button className="w-7 h-7 rounded bg-[#10B981]/10 text-[#10B981] flex items-center justify-center hover:bg-[#10B981]/20" title="WhatsApp Message"><MessageCircle className="w-3.5 h-3.5" /></button>
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

function LtvChip({ score }: { score: string }) {
  if (score === "Elite") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20"><Star className="w-3 h-3 fill-current" /> Elite</span>;
  if (score === "High") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">High Value</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[#94A3B8] border border-white/20">Medium</span>;
}
