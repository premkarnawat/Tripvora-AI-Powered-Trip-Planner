"use client";

import { useState } from "react";
import { Phone, MessageSquare, Zap, Plus, Play, Pause, Edit3, CheckCircle2, ChevronRight, FileText, CreditCard, Map, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WhatsAppHub() {
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest">+91 98765 43210 (Official Meta API)</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Phone className="w-6 h-6 text-[#10B981]" /> WhatsApp Business Hub
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage official Meta templates and automated messaging workflows.</p>
        </div>
        <div className="flex bg-[#0B1220] p-1 rounded-md border border-white/10">
          <TabButton active={activeTab === "templates"} onClick={() => setActiveTab("templates")} icon={MessageSquare} label="Message Templates" />
          <TabButton active={activeTab === "automations"} onClick={() => setActiveTab("automations")} icon={Zap} label="Automations" />
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "templates" && <TemplatesTab />}
      {activeTab === "automations" && <AutomationsTab />}

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

function TemplatesTab() {
  const templates = [
    { name: "Welcome Message", desc: "Hello {{1}}, Thank you for your interest in our {{2}} package. Our travel expert will contact you shortly.", icon: MessageSquare, color: "text-[#38BDF8]" },
    { name: "Quotation PDF", desc: "Hi {{1}}, please find attached the quotation for your trip to {{2}}. Let us know if you have any questions.", icon: FileText, color: "text-purple-400" },
    { name: "Payment Reminder", desc: "Hello {{1}}, Your advance payment of {{2}} is pending. Please complete it to confirm your booking.", icon: CreditCard, color: "text-[#F59E0B]" },
    { name: "Trip Reminder", desc: "Your {{1}} trip starts tomorrow! Please find attached your final itinerary and emergency contacts.", icon: Map, color: "text-[#10B981]" },
    { name: "Review Request", desc: "Hope you enjoyed your trip to {{1}}. Please share your review to help us improve!", icon: Star, color: "text-yellow-400" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold text-white">Official Meta Templates</h2>
          <p className="text-xs text-[#94A3B8] mt-1">These templates are pre-approved by WhatsApp to initiate conversations with your leads.</p>
        </div>
        <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
          <Plus className="w-3.5 h-3.5 mr-1" /> Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl, i) => (
          <div key={i} className="bg-[#0B1220] border border-white/5 rounded-md p-5 flex flex-col justify-between hover:border-white/10 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 rounded bg-[#020817] border border-white/10 flex items-center justify-center">
                  <tpl.icon className={`w-4 h-4 ${tpl.color}`} />
                </div>
                <span className="flex items-center gap-1 text-[10px] text-[#10B981] font-bold"><CheckCircle2 className="w-3 h-3" /> Approved</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{tpl.name}</h3>
              <div className="bg-[#020817] p-3 rounded border border-white/5 relative">
                 <div className="absolute top-0 left-0 w-1 h-full bg-[#10B981] rounded-l" />
                 <p className="text-xs text-[#94A3B8] leading-relaxed italic">"{tpl.desc}"</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 text-center py-1.5 bg-white/5 hover:bg-white/10 text-xs font-bold text-white rounded transition-colors">Edit Variables</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutomationsTab() {
  const rules = [
    { trigger: "Lead Received from TripPilot", action: "Send 'Welcome Message'", status: "Active", leads: 142 },
    { trigger: "Quotation Generated", action: "Send 'Quotation PDF' (1-Click)", status: "Active", leads: 89 },
    { trigger: "Payment Pending (48h)", action: "Send 'Payment Reminder'", status: "Active", leads: 34 },
    { trigger: "Trip Starts Tomorrow", action: "Send 'Trip Reminder' + Itinerary PDF", status: "Active", leads: 18 },
    { trigger: "Trip Completed (1d)", action: "Send 'Review Request'", status: "Paused", leads: 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold text-white">Workflow Automations</h2>
          <p className="text-xs text-[#94A3B8] mt-1">Automatically send approved templates based on CRM events.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {rules.map((rule, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-[#0B1220] border border-white/5 rounded-md hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex flex-col w-64">
                <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1">When (CRM Event)</span>
                <span className="text-xs font-bold text-white bg-white/5 px-3 py-1.5 rounded border border-white/10">{rule.trigger}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1">Then (WhatsApp Action)</span>
                <span className="text-xs font-bold text-[#14B8A6] bg-[#14B8A6]/10 px-3 py-1.5 rounded border border-[#14B8A6]/20 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> {rule.action}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
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
