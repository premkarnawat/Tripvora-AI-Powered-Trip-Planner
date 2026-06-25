"use client";

import { useState } from "react";
import { Phone, Mail, Zap, Plus, CheckCircle2, ChevronRight, FileText, CreditCard, Map, Star, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommunicationHub() {
  const [activeTab, setActiveTab] = useState("whatsapp");

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">Level 1 Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Communication Hub
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage your quick-action WhatsApp & Email templates. Messages are sent securely from your own devices.</p>
        </div>
        <div className="flex bg-[#0B1220] p-1 rounded-md border border-white/10">
          <TabButton active={activeTab === "whatsapp"} onClick={() => setActiveTab("whatsapp")} icon={Phone} label="WhatsApp" />
          <TabButton active={activeTab === "email"} onClick={() => setActiveTab("email")} icon={Mail} label="Email" />
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "whatsapp" && <WhatsAppTemplates />}
      {activeTab === "email" && <EmailTemplates />}

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

function WhatsAppTemplates() {
  const templates = [
    { name: "Lead Response", desc: "Hello [Name], Thank you for your interest in our [Destination] package. Our travel expert will contact you shortly.", icon: Phone, color: "text-[#38BDF8]" },
    { name: "Send Quotation", desc: "Hi [Name], here is the customized quotation for your trip to [Destination]. Click here to view: [Link]", icon: FileText, color: "text-purple-400" },
    { name: "Quotation Follow-up", desc: "Hello [Name], just checking in on the quotation sent for [Destination]. Do you need any modifications?", icon: FileText, color: "text-pink-400" },
    { name: "Payment Reminder", desc: "Hello [Name], Your advance payment of [Amount] is pending. Please complete it to confirm your booking.", icon: CreditCard, color: "text-[#F59E0B]" },
    { name: "Booking Confirmation", desc: "Hi [Name], your booking is confirmed! Here is the detailed day-by-day itinerary for [Destination].", icon: CheckCircle2, color: "text-teal-400" },
    { name: "Trip Reminder", desc: "Your [Destination] trip starts tomorrow! Please find attached your final itinerary and emergency contacts.", icon: Map, color: "text-[#10B981]" },
    { name: "Review Request", desc: "Hope you enjoyed your trip to [Destination]. Please share your review to help us improve!", icon: Star, color: "text-yellow-400" },
    { name: "Festival Offer", desc: "Special festival discounts on [Destination] packages! Reply to this message to claim your 10% off.", icon: Zap, color: "text-rose-400" }
  ];

  const handleTestWhatsApp = (desc: string) => {
    const encoded = encodeURIComponent(desc);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold text-white">WhatsApp Quick Actions</h2>
          <p className="text-xs text-[#94A3B8] mt-1">These templates open directly in your WhatsApp application via wa.me links.</p>
        </div>
        <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
          <Plus className="w-3.5 h-3.5 mr-1" /> Custom Template
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
                <button onClick={() => handleTestWhatsApp(tpl.desc)} className="text-[10px] text-[#14B8A6] hover:underline font-bold">
                  Test wa.me Link ↗
                </button>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{tpl.name}</h3>
              <div className="bg-[#020817] p-3 rounded border border-white/5 relative">
                 <div className="absolute top-0 left-0 w-1 h-full bg-[#10B981] rounded-l" />
                 <p className="text-xs text-[#94A3B8] leading-relaxed italic">"{tpl.desc}"</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 text-center py-1.5 border border-white/10 hover:bg-white/5 text-xs font-bold text-white rounded transition-colors flex justify-center items-center gap-1.5">
                <Edit3 className="w-3 h-3" /> Edit Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailTemplates() {
  const templates = [
    { name: "Lead Response", subject: "Your Inquiry for [Destination]", desc: "Hello [Name],\n\nThank you for reaching out regarding your travel plans to [Destination]...", icon: Mail, color: "text-[#38BDF8]" },
    { name: "Quotation Delivery", subject: "Travel Package Quotation: [Destination]", desc: "Hi [Name],\n\nPlease find your customized travel package and quotation attached...", icon: FileText, color: "text-purple-400" },
    { name: "Booking Confirmation", subject: "Booking Confirmed: [Destination]", desc: "Hi [Name],\n\nYour booking is confirmed! Here is your official invoice and details...", icon: CheckCircle2, color: "text-teal-400" },
    { name: "Trip Guide", subject: "Essential Guide for [Destination]", desc: "Hello [Name],\n\nAs your trip approaches, please review this essential guide to [Destination]...", icon: Map, color: "text-[#10B981]" }
  ];

  const handleTestEmail = (subject: string, body: string) => {
    const s = encodeURIComponent(subject);
    const b = encodeURIComponent(body);
    window.open(`mailto:?subject=${s}&body=${b}`, "_self");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-bold text-white">Email Quick Actions</h2>
          <p className="text-xs text-[#94A3B8] mt-1">These templates open directly in your default Email client via mailto: links.</p>
        </div>
        <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
          <Plus className="w-3.5 h-3.5 mr-1" /> Custom Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl, i) => (
          <div key={i} className="bg-[#0B1220] border border-white/5 rounded-md p-5 flex flex-col justify-between hover:border-white/10 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 rounded bg-[#020817] border border-white/10 flex items-center justify-center">
                  <tpl.icon className={`w-4 h-4 ${tpl.color}`} />
                </div>
                <button onClick={() => handleTestEmail(tpl.subject, tpl.desc)} className="text-[10px] text-[#14B8A6] hover:underline font-bold">
                  Test mailto: Link ↗
                </button>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{tpl.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Subj: {tpl.subject}</p>
              <div className="bg-[#020817] p-3 rounded border border-white/5 relative">
                 <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l" />
                 <p className="text-xs text-[#94A3B8] leading-relaxed italic whitespace-pre-line">"{tpl.desc}"</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 text-center py-1.5 border border-white/10 hover:bg-white/5 text-xs font-bold text-white rounded transition-colors flex justify-center items-center gap-1.5">
                <Edit3 className="w-3 h-3" /> Edit Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
