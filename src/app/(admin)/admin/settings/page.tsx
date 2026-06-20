"use client";

import { useState } from "react";
import { 
  Settings, Globe, Palette, Share2, Code, Bell, 
  Save, CheckCircle2, AlertCircle, Upload
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("platform");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Save Button */}
      <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
        <div>
          <h1 className="text-2xl font-bold font-sora text-[#0F172A] flex items-center gap-2">
            Platform Settings
          </h1>
          <p className="text-xs text-[#64748B] mt-1">Manage global configurations, APIs, email SMTP, and brand assets.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Saved Successfully
            </span>
          )}
          <button 
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-bold shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-1">
          <TabButton id="platform" icon={Globe} label="Platform Details" active={activeTab === "platform"} onClick={() => setActiveTab("platform")} />
          <TabButton id="brand" icon={Palette} label="Brand & Styling" active={activeTab === "brand"} onClick={() => setActiveTab("brand")} />
          <TabButton id="social" icon={Share2} label="Social Integrations" active={activeTab === "social"} onClick={() => setActiveTab("social")} />
          <TabButton id="api" icon={Code} label="API Keys & Services" active={activeTab === "api"} onClick={() => setActiveTab("api")} />
          <TabButton id="notifications" icon={Bell} label="Platform Alerts" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
        </div>

        {/* Content Details Area */}
        <div className="flex-1 bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          
          {activeTab === "platform" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-base font-bold font-sora text-[#0F172A] border-b border-[#E5E7EB] pb-3">Platform Configurations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Platform Name" value="TripPilot" />
                <InputField label="Tagline" value="Travel Business Operating System" />
                <InputField label="Support Email" value="support@trippilot.in" />
                <InputField label="Support Phone" value="+91 98765 43210" />
                <InputField label="WhatsApp Support" value="+91 98765 43210" />
                <InputField label="Timezone" value="Asia/Kolkata (IST)" />
                <InputField label="Default Currency" value="INR (₹) - Indian Rupees" readonly={true} />
                
                <div className="md:col-span-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Company Office Address</label>
                    <textarea rows={3} className="w-full bg-[#F1F5F9] border border-transparent rounded-lg py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all resize-none" defaultValue="123 Tech Park, Cyber City, Gurugram, Haryana 122002" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "brand" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-base font-bold font-sora text-[#0F172A] border-b border-[#E5E7EB] pb-3">Brand & Styling Assets</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-2">Primary Logo Image</label>
                  <div className="flex items-center gap-4 p-4 border border-[#E5E7EB] rounded-xl bg-slate-50/50">
                    <div className="w-12 h-12 rounded bg-[#0EA5A4]/15 flex items-center justify-center font-bold text-[#0EA5A4]">TP</div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-[#0F172A] rounded-lg text-xs font-semibold transition-all">
                      <Upload className="w-3.5 h-3.5" /> Upload File
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block mb-2">Favicon Icon (32x32)</label>
                  <div className="flex items-center gap-4 p-4 border border-[#E5E7EB] rounded-xl bg-slate-50/50">
                    <div className="w-10 h-10 rounded bg-[#0EA5A4]/15 flex items-center justify-center font-bold text-[#0EA5A4] text-xs">T</div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-[#0F172A] rounded-lg text-xs font-semibold transition-all">
                      <Upload className="w-3.5 h-3.5" /> Upload
                    </button>
                  </div>
                </div>

                <InputField label="Primary Brand Color (Hex)" value="#0EA5A4" />
                <InputField label="Secondary Brand Color (Hex)" value="#14B8A6" />
                
                <div className="md:col-span-2">
                  <InputField label="Email Branding Header" value="TripPilot - Premium Travel Management" />
                </div>
                
                <div className="md:col-span-2">
                  <InputField label="Footer Copyright Information" value="© 2026 TripPilot Inc. All rights reserved." />
                </div>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-base font-bold font-sora text-[#0F172A] border-b border-[#E5E7EB] pb-3">Social Media Integrations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Instagram Profile Link" value="https://instagram.com/trippilot" />
                <InputField label="LinkedIn Company Page" value="https://linkedin.com/company/trippilot" />
                <InputField label="Facebook Fan Page" value="https://facebook.com/trippilot" />
                <InputField label="YouTube Channel Page" value="https://youtube.com/@trippilot" />
                <InputField label="Twitter / X handle" value="https://x.com/trippilot" />
                <InputField label="WhatsApp broadcast channel" value="https://wa.me/channel/12345" />
                <InputField label="Telegram support community" value="https://t.me/trippilot" />
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-base font-bold font-sora text-[#0F172A] border-b border-[#E5E7EB] pb-3">API Keys & Services Endpoint</h3>
              
              <div className="space-y-3.5">
                <ApiServiceField title="Gemini API Key" desc="Powers the itinerary builder and natural travel search inputs." status="Connected" />
                <ApiServiceField title="Google Maps JavaScript API" desc="Used for rendering interactive maps on planning itineraries." status="Connected" />
                <ApiServiceField title="Google Places Web Service" desc="Autocomplete search inputs for hotels, attractions, destinations." status="Connected" />
                <ApiServiceField title="OpenWeather API Endpoint" desc="Live forecasts details mapping dynamically on itineraries." status="Connected" />
                <ApiServiceField title="WhatsApp Meta API Endpoint" desc="Broadcasting and transaction messaging split services." status="Connected" />
                <ApiServiceField title="Razorpay API Credentials" desc="B2B subscription plans collection split payment." status="Connected" />
                <ApiServiceField title="Supabase DB Configuration" desc="RLS policies, schema migrations, and storage backups." status="Connected" />
                <ApiServiceField title="Email SMTP Integration" desc="Sends transaction notifications, updates, invoices." status="Warning" />
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-base font-bold font-sora text-[#0F172A] border-b border-[#E5E7EB] pb-3">Platform Alerts & Toggles</h3>
              
              <div className="space-y-4">
                <ToggleSettingsField title="Email Notifications" desc="Dispatches transaction invoices and quotes automatically." active={true} />
                <ToggleSettingsField title="WhatsApp Messages" desc="Broadcasts updates on WhatsApp split API links." active={true} />
                <ToggleSettingsField title="Push browser notifications" desc="Alerts traveler upon expert quote reply matches." active={false} />
                <ToggleSettingsField title="Platform Admin Alerts" desc="Triggers SMS alert notifications upon severe API errors." active={true} />
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
        active 
          ? "bg-[#0EA5A4]/10 border-[#0EA5A4]/20 text-[#0EA5A4]" 
          : "bg-transparent border-transparent text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
      }`}
    >
      <Icon className="w-4.5 h-4.5 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function InputField({ label, value, readonly = false }: { label: string, value: string, readonly?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">{label}</label>
      <input 
        type="text" 
        className={`w-full bg-[#F1F5F9] border border-transparent rounded-lg py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all ${
          readonly ? "opacity-60 cursor-not-allowed bg-slate-100" : ""
        }`} 
        defaultValue={value}
        disabled={readonly}
      />
    </div>
  );
}

function ApiServiceField({ title, desc, status }: any) {
  const isConnected = status === "Connected";
  return (
    <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-xl bg-slate-50/30">
      <div>
        <h4 className="text-xs font-bold text-[#0F172A]">{title}</h4>
        <p className="text-[10px] text-[#64748B] mt-0.5">{desc}</p>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <span className={`px-2.5 py-0.5 rounded border text-[9px] font-bold ${
          isConnected 
            ? "bg-[#16A34A]/10 border-[#16A34A]/25 text-[#16A34A]" 
            : "bg-amber-100 border-amber-300 text-amber-700"
        }`}>
          {status}
        </span>
        <button className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-[#0F172A] rounded-lg text-[10px] font-bold transition-all">
          Configure
        </button>
      </div>
    </div>
  );
}

function ToggleSettingsField({ title, desc, active }: any) {
  const [enabled, setEnabled] = useState(active);
  return (
    <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-xl bg-slate-50/30">
      <div>
        <h4 className="text-xs font-bold text-[#0F172A]">{title}</h4>
        <p className="text-[10px] text-[#64748B] mt-0.5">{desc}</p>
      </div>

      <button 
        onClick={() => setEnabled(!enabled)}
        className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
          enabled ? "bg-[#0EA5A4]" : "bg-slate-200"
        }`}
      >
        <span className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
          enabled ? "right-1" : "left-1"
        }`} />
      </button>
    </div>
  );
}
