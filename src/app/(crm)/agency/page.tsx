"use client";

import { motion } from "framer-motion";
import { DollarSign, Users, FileText, CalendarCheck, Clock, ArrowRight, Activity, PlaneTakeoff, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgencyDashboard() {
  const currentDateTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
            <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-widest">Business Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Overview
          </h1>
        </div>
        <div className="flex gap-2">
          <Button className="h-8 text-xs font-bold bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/20 shadow-sm transition-colors">
            Generate Package
          </Button>
          <Button className="h-8 text-xs font-bold bg-[#14B8A6]/10 hover:bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/20 shadow-sm transition-colors">
            Generate Quotation
          </Button>
          <Button className="h-8 text-xs font-bold bg-[#10B981] hover:bg-[#10B981]/90 text-[#0F172A] border-none shadow-sm transition-colors">
            Send WhatsApp
          </Button>
        </div>
      </div>

      {/* 1. TOP ROW: Dense KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiMetric title="Today's Leads" value="12" icon={Users} trend="+3" />
        <KpiMetric title="Pending Quotes" value="42" icon={FileText} trend="-2" warning />
        <KpiMetric title="Upcoming Trips" value="8" icon={PlaneTakeoff} />
        <KpiMetric title="Pending Payments" value="₹14,200" icon={Clock} warning />
        <KpiMetric title="Monthly Revenue" value="₹41,28,500" icon={DollarSign} trend="+12%" success />
        <KpiMetric title="Monthly Profit" value="₹8,25,000" icon={Activity} trend="+8%" success />
        <KpiMetric title="Lead Conversion" value="24.5%" icon={TrendingUp} trend="+2.1%" success />
      </div>

      {/* 2. SECOND ROW: Linear Lead Pipeline */}
      <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-bold text-white">Lead Pipeline</h3>
          <span className="text-xs text-[#94A3B8] font-medium">Last 30 Days</span>
        </div>
        <div className="flex w-full h-8 rounded-sm overflow-hidden mb-4 border border-white/5">
          <div className="bg-white/10 w-[30%] hover:bg-white/20 transition-colors border-r border-[#0B1220]" title="New: 142" />
          <div className="bg-[#38BDF8]/40 w-[25%] hover:bg-[#38BDF8]/50 transition-colors border-r border-[#0B1220]" title="Contacted: 118" />
          <div className="bg-purple-500/50 w-[20%] hover:bg-purple-500/60 transition-colors border-r border-[#0B1220]" title="Proposal: 95" />
          <div className="bg-[#F59E0B]/60 w-[10%] hover:bg-[#F59E0B]/70 transition-colors border-r border-[#0B1220]" title="Negotiation: 47" />
          <div className="bg-[#10B981]/80 w-[15%] hover:bg-[#10B981]/90 transition-colors" title="Booked: 71" />
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
          <div className="flex flex-col gap-1"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-white/10" /> New</span><span className="text-white">142</span></div>
          <div className="flex flex-col gap-1"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#38BDF8]/40" /> Contacted</span><span className="text-white">118</span></div>
          <div className="flex flex-col gap-1"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-purple-500/50" /> Proposal Sent</span><span className="text-white">95</span></div>
          <div className="flex flex-col gap-1"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#F59E0B]/60" /> Negotiation</span><span className="text-white">47</span></div>
          <div className="flex flex-col gap-1"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#10B981]/80" /> Booked</span><span className="text-white">71</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. THIRD ROW: Upcoming Departures */}
        <div className="lg:col-span-2 bg-[#0B1220] border border-white/5 rounded-md p-5 shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white">Upcoming Departures (Next 7 Days)</h3>
            <button className="text-[#14B8A6] text-xs font-bold hover:text-white transition-colors">View Calendar</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                  <th className="pb-2 px-2 w-1/3">Trip / Client</th>
                  <th className="pb-2 px-2">Destination</th>
                  <th className="pb-2 px-2">Date</th>
                  <th className="pb-2 px-2 text-right">Pax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {[
                  { name: "Smith Family Vacay", dest: "Tokyo, Japan", date: "Tomorrow", pax: "4", client: "David Smith" },
                  { name: "Acme Corp Retreat", dest: "Bali, Indonesia", date: "In 3 days", pax: "24", client: "Acme HR" },
                  { name: "Jenkins Honeymoon", dest: "Maldives", date: "In 5 days", pax: "2", client: "Sarah Jenkins" },
                  { name: "Solo Backpacking", dest: "Vietnam", date: "In 7 days", pax: "1", client: "Mike Ross" },
                ].map((trip, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <td className="py-2.5 px-2">
                      <p className="font-bold text-white text-xs group-hover:text-[#38BDF8] transition-colors">{trip.name}</p>
                      <p className="text-[10px] text-[#94A3B8]">{trip.client}</p>
                    </td>
                    <td className="py-2.5 px-2 text-xs text-white/80">{trip.dest}</td>
                    <td className="py-2.5 px-2 text-xs text-[#14B8A6] font-medium">{trip.date}</td>
                    <td className="py-2.5 px-2 text-xs text-white text-right font-mono">{trip.pax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. FOURTH ROW: Recent Activities */}
        <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Live Feed
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </h3>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            <ActivityItem type="new_lead" text="New Lead: Priya Sharma (Europe Tour)" time="Just now" />
            <ActivityItem type="payment" text="Payment Received: ₹45,000 from Jenkins" time="15m ago" />
            <ActivityItem type="proposal" text="Proposal Sent: Acme Corp Retreat (₹4,50,000)" time="1h ago" />
            <ActivityItem type="booking" text="Booking Confirmed: Tokyo Flight (Smith)" time="2h ago" />
            <ActivityItem type="whatsapp" text="WhatsApp Read: David Kim" time="3h ago" />
            <ActivityItem type="new_lead" text="New Marketplace Lead: Emma Stone" time="5h ago" />
          </div>
        </div>

      </div>
    </div>
  );
}

function KpiMetric({ title, value, trend, icon: Icon, success, warning }: any) {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-md p-3 hover:bg-white/[0.02] transition-colors group relative overflow-hidden">
      <div className="flex justify-between items-start mb-2">
        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{title}</p>
        <Icon className="w-3.5 h-3.5 text-[#94A3B8]" />
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-xl font-bold text-white tracking-tight">{value}</h3>
        {trend && (
          <span className={`text-[10px] font-bold ${success ? 'text-[#10B981]' : warning ? 'text-[#EF4444]' : 'text-[#38BDF8]'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ type, text, time }: any) {
  const getStyle = () => {
    switch(type) {
      case 'new_lead': return { color: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10', icon: Users };
      case 'payment': return { color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', icon: DollarSign };
      case 'proposal': return { color: 'text-purple-400', bg: 'bg-purple-400/10', icon: FileText };
      case 'booking': return { color: 'text-[#14B8A6]', bg: 'bg-[#14B8A6]/10', icon: CalendarCheck };
      case 'whatsapp': return { color: 'text-green-500', bg: 'bg-green-500/10', icon: Activity }; // Fallback icon
      default: return { color: 'text-[#94A3B8]', bg: 'bg-white/5', icon: Activity };
    }
  };
  
  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className="flex gap-3 items-start group">
      <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${style.bg} border border-white/5 mt-0.5`}>
        <Icon className={`w-3 h-3 ${style.color}`} />
      </div>
      <div>
        <p className="text-xs text-white/90 font-medium group-hover:text-white transition-colors">{text}</p>
        <p className="text-[10px] text-[#94A3B8] mt-0.5">{time}</p>
      </div>
    </div>
  );
}
