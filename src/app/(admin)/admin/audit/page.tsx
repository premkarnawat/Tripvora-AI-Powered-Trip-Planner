"use client";

import { ShieldCheck, Search, Filter, ArrowRight, Download, History } from "lucide-react";
import { Button } from "@/components/ui/button";

const auditLogs = [
  { id: "LOG-9281", admin: "Prem Karnawat", action: "Agency Approved", module: "Agencies", time: "10 mins ago", prev: "Pending", new: "Active" },
  { id: "LOG-9280", admin: "David Smith", action: "Pricing Changed", module: "Subscriptions", time: "2 hours ago", prev: "₹2499/mo", new: "₹2999/mo" },
  { id: "LOG-9279", admin: "System", action: "Database Backup", module: "System", time: "3 hours ago", prev: "-", new: "Success" },
  { id: "LOG-9278", admin: "Prem Karnawat", action: "Banner Uploaded", module: "Promotions", time: "5 hours ago", prev: "None", new: "Diwali_Offer.jpg" },
  { id: "LOG-9277", admin: "David Smith", action: "FAQ Updated", module: "Help Center", time: "1 day ago", prev: "Version 1.2", new: "Version 1.3" },
  { id: "LOG-9276", admin: "System", action: "API Rate Limit Alert", module: "Integrations", time: "1 day ago", prev: "Normal", new: "Warning (Gemini)" },
  { id: "LOG-9275", admin: "Prem Karnawat", action: "User Suspended", module: "Users", time: "2 days ago", prev: "Active", new: "Suspended" },
];

export default function AuditLogsPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            System Audit Logs
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Track every action taken by administrators across the entire platform.</p>
        </div>
        <div className="flex gap-2">
          <Button className="h-9 font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10 transition-colors">
            <Filter className="w-4 h-4 mr-2" /> Filter Logs
          </Button>
          <Button className="h-9 font-bold bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/20 transition-colors">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-[#0B1220] border border-white/5 rounded-xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#020817]/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search by admin, action, or module..." 
              className="w-full bg-[#020817] border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#94A3B8]">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10"><ShieldCheck className="w-3.5 h-3.5" /> 2 Admins</span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10"><History className="w-3.5 h-3.5" /> 30 Days Retention</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#020817] border-b border-white/5">
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Log ID</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Admin</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Action</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Module</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-center">Changes</th>
                <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {auditLogs.map((log, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 text-xs font-mono text-[#94A3B8] group-hover:text-purple-400 transition-colors">{log.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                        {log.admin === "System" ? "SYS" : log.admin.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-xs font-bold text-white">{log.admin}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-white">{log.action}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-1 rounded border border-[#38BDF8]/20">{log.module}</span>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[#94A3B8] truncate max-w-[100px]">{log.prev}</span>
                      <ArrowRight className="w-3 h-3 text-white/30 shrink-0" />
                      <span className="text-white truncate max-w-[100px]">{log.new}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-[#94A3B8] text-right">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
