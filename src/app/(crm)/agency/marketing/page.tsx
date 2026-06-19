"use client";

import { useState } from "react";
import { Plus, Search, Filter, Mail, MessageCircle, BarChart3, Users, Send, CheckCircle2, AlertCircle, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockCampaigns = [
  { id: "CMP-012", name: "Diwali Special Maldives Promo", type: "WhatsApp", audience: "High LTV Customers (1,240)", status: "Active", sent: 1240, open: "86%", click: "24%", conv: "4.2%" },
  { id: "CMP-011", name: "Europe Summer Early Bird", type: "Email", audience: "All Leads (8,450)", status: "Completed", sent: 8450, open: "42%", click: "12%", conv: "1.8%" },
  { id: "CMP-010", name: "Corporate Retreat Outreach", type: "Email", audience: "B2B Leads (450)", status: "Draft", sent: 0, open: "-", click: "-", conv: "-" },
  { id: "CMP-009", name: "Bali Flash Sale", type: "WhatsApp", audience: "Warm Leads (2,100)", status: "Scheduled", sent: 0, open: "-", click: "-", conv: "-" },
];

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("Campaigns");

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10 flex gap-6">
      
      {/* Left Sidebar (Navigation & Stats) */}
      <div className="w-64 shrink-0 space-y-6 hidden lg:block">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[#F59E0B] fill-current" /> Marketing
          </h2>
          <Button className="w-full h-9 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm mb-6">
            <Plus className="w-3.5 h-3.5 mr-1" /> New Campaign
          </Button>
        </div>

        <div className="space-y-1">
          <NavButton label="Campaigns" active={activeTab === "Campaigns"} onClick={() => setActiveTab("Campaigns")} icon={Send} />
          <NavButton label="Audience Segments" active={activeTab === "Segments"} onClick={() => setActiveTab("Segments")} icon={Users} />
          <NavButton label="Templates" active={activeTab === "Templates"} onClick={() => setActiveTab("Templates")} icon={Mail} />
          <NavButton label="Automations" active={activeTab === "Automations"} onClick={() => setActiveTab("Automations")} icon={Clock} />
        </div>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-3">Quick Stats (30d)</p>
          <div className="bg-[#0B1220] p-4 rounded-md border border-white/5">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs text-[#94A3B8]">Total Sent</span>
              <span className="text-sm font-bold text-white">12,450</span>
            </div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs text-[#94A3B8]">Avg Open Rate</span>
              <span className="text-sm font-bold text-[#14B8A6]">48.2%</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-[#94A3B8]">Conversion</span>
              <span className="text-sm font-bold text-[#38BDF8]">3.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-4">
        
        {/* Header Toolbar */}
        <div className="flex justify-between items-center bg-[#0B1220] p-3 rounded-md border border-white/5">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="flex gap-2">
            <Button className="h-8 text-xs font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
              <Filter className="w-3 h-3 mr-1.5" /> Filter
            </Button>
          </div>
        </div>

        {/* Content View */}
        {activeTab === "Campaigns" && (
          <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
                  <th className="py-3 px-4">Campaign Name</th>
                  <th className="py-3 px-4">Channel & Audience</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Open Rate</th>
                  <th className="py-3 px-4 text-center">Clicks</th>
                  <th className="py-3 px-4 text-right">Conv.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {mockCampaigns.map((camp, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <td className="py-3 px-4">
                      <p className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">{camp.name}</p>
                      <p className="text-[10px] text-[#94A3B8] font-mono mt-1">{camp.id}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded border ${camp.type === 'WhatsApp' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20'}`}>
                          {camp.type === 'WhatsApp' ? <MessageCircle className="w-3 h-3" /> : <Mail className="w-3 h-3" />} {camp.type}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] flex items-center gap-1"><Users className="w-3 h-3" /> {camp.audience}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <CampaignStatusChip status={camp.status} />
                    </td>
                    <td className="py-3 px-4 text-center text-xs font-bold text-white">{camp.open}</td>
                    <td className="py-3 px-4 text-center text-xs font-bold text-white">{camp.click}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs font-bold text-[#14B8A6]">{camp.conv}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== "Campaigns" && (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 bg-white/[0.01] rounded-md h-[60vh]">
            <div className="w-12 h-12 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-[#14B8A6]" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">{activeTab} Manager</h2>
            <p className="text-sm text-[#94A3B8] text-center max-w-sm">This section allows you to manage your {activeTab.toLowerCase()} for targeted marketing campaigns.</p>
          </div>
        )}

      </div>
    </div>
  );
}

function NavButton({ label, active, icon: Icon, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-xs font-bold ${active ? 'bg-[#14B8A6]/10 text-[#14B8A6]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function CampaignStatusChip({ status }: { status: string }) {
  if (status === "Active") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"><CheckCircle2 className="w-3 h-3" /> Sending</span>;
  if (status === "Completed") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-[#94A3B8] border border-white/20">Completed</span>;
  if (status === "Scheduled") return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20"><Clock className="w-3 h-3" /> Scheduled</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">Draft</span>;
}
