"use client";

import { LifeBuoy, Users, Building, Clock, CheckCircle2, AlertCircle, Search, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const tickets = [
  { id: "TCK-1042", user: "David Smith", type: "Traveler", subject: "Refund for cancelled flight", priority: "High", status: "Open", created: "2 hrs ago", lastReply: "10 mins ago" },
  { id: "TCK-1041", user: "Elite Travels", type: "Agency", subject: "API quota exhausted", priority: "Urgent", status: "In Progress", created: "5 hrs ago", lastReply: "1 hr ago" },
  { id: "TCK-1040", user: "Priya Sharma", type: "Traveler", subject: "How to edit itinerary?", priority: "Low", status: "Resolved", created: "1 day ago", lastReply: "12 hrs ago" },
  { id: "TCK-1039", user: "Acme Corp", type: "Agency", subject: "Payment gateway error", priority: "High", status: "Closed", created: "2 days ago", lastReply: "1 day ago" },
  { id: "TCK-1038", user: "John Doe", type: "Traveler", subject: "Login issues", priority: "Medium", status: "Open", created: "2 days ago", lastReply: "2 days ago" },
];

export default function SupportCenterPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Support Center
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage all support requests from travelers and agencies.</p>
        </div>
        <div className="flex gap-2">
          <Button className="h-9 font-bold bg-[#14B8A6]/10 hover:bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/20 transition-colors">
            Create Ticket
          </Button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPIBox title="Open Tickets" value="24" icon={AlertCircle} color="text-[#EF4444]" bg="bg-[#EF4444]/10" border="border-[#EF4444]/20" />
        <KPIBox title="Pending" value="12" icon={Clock} color="text-[#F59E0B]" bg="bg-[#F59E0B]/10" border="border-[#F59E0B]/20" />
        <KPIBox title="Resolved" value="1,402" icon={CheckCircle2} color="text-[#10B981]" bg="bg-[#10B981]/10" border="border-[#10B981]/20" />
        <KPIBox title="Agency Tickets" value="8" icon={Building} color="text-[#38BDF8]" bg="bg-[#38BDF8]/10" border="border-[#38BDF8]/20" />
        <KPIBox title="Traveler Tickets" value="28" icon={Users} color="text-purple-400" bg="bg-purple-500/10" border="border-purple-500/20" />
        <KPIBox title="Avg Response" value="15m" icon={LifeBuoy} color="text-white" bg="bg-white/5" border="border-white/10" />
      </div>

      {/* Ticket Management Table */}
      <div className="bg-[#0B1220] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#020817]/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search tickets by ID, user, or subject..." 
              className="w-full bg-[#020817] border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <Button className="h-9 font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10 transition-colors">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#020817] border-b border-white/5">
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Ticket ID</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">User / Subject</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Type</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Priority</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Last Reply</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map((ticket, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 text-xs font-mono text-[#94A3B8] group-hover:text-white transition-colors">{ticket.id}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-white">{ticket.subject}</span>
                      <span className="text-[10px] text-[#94A3B8]">{ticket.user} • Created {ticket.created}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      ticket.type === "Agency" ? "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    }`}>
                      {ticket.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold ${
                      ticket.priority === "Urgent" ? "text-[#EF4444]" :
                      ticket.priority === "High" ? "text-[#F59E0B]" :
                      ticket.priority === "Medium" ? "text-[#38BDF8]" : "text-[#94A3B8]"
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      ticket.status === "Open" ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20" :
                      ticket.status === "In Progress" ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20" :
                      ticket.status === "Resolved" ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" :
                      "bg-white/5 text-[#94A3B8] border-white/10"
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-[#94A3B8]">{ticket.lastReply}</td>
                  <td className="p-4 text-right">
                    <Button className="h-7 text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 mr-2">Reply</Button>
                    <button className="text-[#94A3B8] hover:text-white transition-colors p-1 rounded hover:bg-white/5"><MoreVertical className="w-4 h-4" /></button>
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

function KPIBox({ title, value, icon: Icon, color, bg, border }: any) {
  return (
    <div className={`p-4 rounded-xl border ${bg} ${border} flex flex-col gap-3 relative overflow-hidden group`}>
      <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full ${color} opacity-10 group-hover:scale-150 transition-transform duration-500`} />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest z-10">{title}</span>
        <Icon className={`w-4 h-4 ${color} z-10`} />
      </div>
      <span className={`text-2xl font-bold ${color} z-10`}>{value}</span>
    </div>
  );
}
