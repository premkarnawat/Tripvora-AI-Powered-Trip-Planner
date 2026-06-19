"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageSquare, Zap, Users, Plus, Play, Pause, Edit3, BarChart2, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WhatsAppHub() {
  const [activeTab, setActiveTab] = useState("automations");

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest">Meta API Connected</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Phone className="w-6 h-6 text-[#10B981]" /> WhatsApp Business Hub
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage automations, templates, and bulk campaigns directly from TripPilot.</p>
        </div>
        <div className="flex bg-[#0B1220] p-1 rounded-md border border-white/10">
          <TabButton active={activeTab === "automations"} onClick={() => setActiveTab("automations")} icon={Zap} label="Automations" />
          <TabButton active={activeTab === "templates"} onClick={() => setActiveTab("templates")} icon={MessageSquare} label="Templates" />
          <TabButton active={activeTab === "campaigns"} onClick={() => setActiveTab("campaigns")} icon={Users} label="Campaigns" />
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "automations" && <AutomationsTab />}
      {activeTab === "templates" && <TemplatesTab />}
      {activeTab === "campaigns" && <CampaignsTab />}

    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-all ${
        active ? "bg-white/10 text-white" : "text-[#94A3B8] hover:text-white"
      }`}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

function AutomationsTab() {
  const rules = [
    { trigger: "New Lead Created", action: "Send Automatic Welcome Message", status: "Active", leads: 142 },
    { trigger: "Proposal Created", action: "Send Proposal PDF Link", status: "Active", leads: 89 },
    { trigger: "Payment Pending (48h)", action: "Send Friendly Reminder", status: "Active", leads: 34 },
    { trigger: "Trip Approaching (7d)", action: "Send Packing List & Reminder", status: "Paused", leads: 0 },
    { trigger: "Trip Completed (1d)", action: "Ask for Review / Feedback", status: "Active", leads: 12 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold text-white">Trigger-Based Automations</h2>
        <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
          <Plus className="w-3.5 h-3.5 mr-1" /> New Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {rules.map((rule, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-[#0B1220] border border-white/5 rounded-md hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1">When</span>
                <span className="text-sm font-bold text-white bg-white/5 px-3 py-1.5 rounded border border-white/10">{rule.trigger}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1">Then</span>
                <span className="text-sm font-bold text-[#14B8A6] bg-[#14B8A6]/10 px-3 py-1.5 rounded border border-[#14B8A6]/20 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> {rule.action}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-bold text-white">{rule.leads}</p>
                <p className="text-[10px] text-[#94A3B8]">Triggered (30d)</p>
              </div>
              <div className="flex items-center gap-2">
                {rule.status === "Active" ? (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981]/10 text-[#10B981] text-xs font-bold rounded border border-[#10B981]/20 hover:bg-[#10B981]/20 transition-colors">
                    <Pause className="w-3 h-3" /> Active
                  </button>
                ) : (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-[#94A3B8] text-xs font-bold rounded border border-white/10 hover:bg-white/10 transition-colors">
                    <Play className="w-3 h-3" /> Paused
                  </button>
                )}
                <button className="p-1.5 text-[#94A3B8] hover:text-white transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplatesTab() {
  const templates = [
    { name: "Welcome Message", category: "Greeting", approved: true },
    { name: "Proposal Follow Up", category: "Sales", approved: true },
    { name: "Payment Reminder", category: "Finance", approved: true },
    { name: "Trip Reminder", category: "Operations", approved: true },
    { name: "Festival Offers", category: "Marketing", approved: false },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold text-white">Message Templates</h2>
          <p className="text-xs text-[#94A3B8] mt-1">Meta-approved templates required to initiate conversations.</p>
        </div>
        <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
          <Plus className="w-3.5 h-3.5 mr-1" /> Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl, i) => (
          <div key={i} className="bg-[#0B1220] border border-white/5 rounded-md p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#94A3B8] font-bold uppercase tracking-wider">{tpl.category}</span>
                {tpl.approved ? (
                  <span className="flex items-center gap-1 text-[10px] text-[#10B981] font-bold"><CheckCircle2 className="w-3 h-3" /> Approved</span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-[#F59E0B] font-bold"><ClockIcon /> Pending Meta</span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{tpl.name}</h3>
              <p className="text-xs text-[#94A3B8] line-clamp-2">{"\"Hi {{1}}, thanks for contacting Elite Travels! Your trip to {{2}} is being processed...\""}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
              <button className="flex-1 text-center py-1.5 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-bold text-white rounded transition-colors">Edit</button>
              <button className="flex-1 text-center py-1.5 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-bold text-white rounded transition-colors">Preview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignsTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold text-white">Bulk Marketing Campaigns</h2>
          <p className="text-xs text-[#94A3B8] mt-1">Send personalized offers to selected customer segments.</p>
        </div>
        <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
          <Plus className="w-3.5 h-3.5 mr-1" /> New Campaign
        </Button>
      </div>

      {/* Campaign Analytics */}
      <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Recent Campaign: Diwali Mega Deals</h3>
          <span className="text-[10px] text-[#94A3B8] bg-white/5 px-2 py-1 rounded">Sent on Oct 24, 2026</span>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-white">1,250</span><span className="text-[10px] text-[#94A3B8] uppercase font-bold">Total Sent</span></div>
          <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-[#14B8A6]">1,242</span><span className="text-[10px] text-[#14B8A6] uppercase font-bold">Delivered (99%)</span></div>
          <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-[#38BDF8]">856</span><span className="text-[10px] text-[#38BDF8] uppercase font-bold">Read (68%)</span></div>
          <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-purple-400">124</span><span className="text-[10px] text-purple-400 uppercase font-bold">Clicked (14%)</span></div>
        </div>
      </div>
      
      {/* Campaign Table */}
      <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
              <th className="py-3 px-4">Campaign Name</th>
              <th className="py-3 px-4">Audience</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Sent</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3 px-4 text-xs font-bold text-white">Weekend Getaways - November</td>
              <td className="py-3 px-4 text-xs text-[#94A3B8]">High Value Customers (450)</td>
              <td className="py-3 px-4"><span className="text-[10px] font-bold bg-[#14B8A6]/10 text-[#14B8A6] px-2 py-0.5 rounded border border-[#14B8A6]/20">Draft</span></td>
              <td className="py-3 px-4 text-xs text-[#94A3B8]">-</td>
              <td className="py-3 px-4 text-right"><button className="text-[10px] font-bold text-[#38BDF8] hover:text-white">Edit</button></td>
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3 px-4 text-xs font-bold text-white">Diwali Mega Deals</td>
              <td className="py-3 px-4 text-xs text-[#94A3B8]">All Customers (1,250)</td>
              <td className="py-3 px-4"><span className="text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981]/20">Completed</span></td>
              <td className="py-3 px-4 text-xs text-[#94A3B8]">Oct 24, 2026</td>
              <td className="py-3 px-4 text-right"><button className="text-[10px] font-bold text-[#94A3B8] hover:text-white flex items-center justify-end gap-1"><BarChart2 className="w-3 h-3"/> Report</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
