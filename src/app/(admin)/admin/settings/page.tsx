"use client";

import { useState } from "react";
import { Settings, Globe, Palette, Share2, Code, Bell, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("platform");

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Platform Settings
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage global configuration for the entire TripPilot OS ecosystem.</p>
        </div>
        <Button className="h-9 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all">
          <Save className="w-4 h-4 mr-2" /> Save All Changes
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <TabButton id="platform" icon={Globe} label="Platform Settings" active={activeTab === "platform"} onClick={() => setActiveTab("platform")} />
          <TabButton id="brand" icon={Palette} label="Brand Settings" active={activeTab === "brand"} onClick={() => setActiveTab("brand")} />
          <TabButton id="social" icon={Share2} label="Social Media" active={activeTab === "social"} onClick={() => setActiveTab("social")} />
          <TabButton id="api" icon={Code} label="API Integrations" active={activeTab === "api"} onClick={() => setActiveTab("api")} />
          <TabButton id="notifications" icon={Bell} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#0B1220] border border-white/5 rounded-xl p-6 lg:p-8">
          
          {activeTab === "platform" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Platform Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Platform Name" value="TripPilot" />
                <InputField label="Tagline" value="AI Powered Trip Planner & Agency CRM" />
                <InputField label="Support Email" value="support@trippilot.in" />
                <InputField label="Support Phone" value="+91 98765 43210" />
                <InputField label="WhatsApp Number" value="+91 98765 43210" />
                <InputField label="Timezone" value="Asia/Kolkata (IST)" />
                <InputField label="Currency" value="INR (₹)" />
                <div className="md:col-span-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Company Address</label>
                    <textarea rows={3} className="w-full bg-[#020817] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" defaultValue="123 Tech Park, Cyber City, Gurugram, Haryana 122002" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "brand" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Brand Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2 block">Primary Logo</label>
                  <div className="flex items-center gap-4 p-4 bg-[#020817] border border-white/10 rounded-lg">
                    <div className="w-16 h-16 rounded bg-purple-500/20 flex items-center justify-center font-bold text-purple-400">TP</div>
                    <Button className="h-8 text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10">Upload New</Button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2 block">Favicon</label>
                  <div className="flex items-center gap-4 p-4 bg-[#020817] border border-white/10 rounded-lg">
                    <div className="w-10 h-10 rounded bg-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-xs">T</div>
                    <Button className="h-8 text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10">Upload</Button>
                  </div>
                </div>
                <InputField label="Primary Color (Hex)" value="#14B8A6" />
                <InputField label="Secondary Color (Hex)" value="#A855F7" />
                <div className="md:col-span-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Email Branding / Header</label>
                    <textarea rows={2} className="w-full bg-[#020817] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" defaultValue="TripPilot - Your Premium Travel Partner" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <InputField label="Copyright Text" value="© 2026 TripPilot Inc. All rights reserved." />
                </div>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Social Media Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Instagram URL" value="https://instagram.com/trippilot" />
                <InputField label="LinkedIn URL" value="https://linkedin.com/company/trippilot" />
                <InputField label="Facebook URL" value="https://facebook.com/trippilot" />
                <InputField label="YouTube URL" value="https://youtube.com/@trippilot" />
                <InputField label="Twitter / X URL" value="https://x.com/trippilot" />
                <InputField label="WhatsApp Channel URL" value="https://wa.me/channel/12345" />
                <InputField label="Telegram Channel URL" value="https://t.me/trippilot" />
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">API Integrations</h2>
              <div className="grid grid-cols-1 gap-6">
                <ApiField title="Gemini AI API" desc="Powers the entire AI Itinerary Generation engine." status="Connected" />
                <ApiField title="Google Maps API" desc="Used for rendering maps on itineraries." status="Connected" />
                <ApiField title="Google Places API" desc="Used for destination autocomplete and imagery." status="Connected" />
                <ApiField title="OpenWeather API" desc="Fetches live weather data for generated trips." status="Connected" />
                <ApiField title="WhatsApp Business API" desc="Handles all WhatsApp automation messages." status="Connected" />
                <ApiField title="Razorpay API" desc="Payment gateway for subscriptions." status="Connected" />
                <ApiField title="Supabase API" desc="Main database and authentication system." status="Connected" />
                <ApiField title="Email SMTP" desc="Sends out transactional emails to users." status="Warning" />
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-4">Global Notification Settings</h2>
              <div className="space-y-4">
                <ToggleField title="Email Notifications" desc="Send automated emails to travelers and agencies." active={true} />
                <ToggleField title="WhatsApp Notifications" desc="Send WhatsApp alerts for quotes and payments." active={true} />
                <ToggleField title="Push Notifications" desc="Send browser push notifications for important updates." active={false} />
                <ToggleField title="Admin Alerts" desc="Send SMS/Email alerts to admins on critical system errors." active={true} />
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

function TabButton({ id, icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
        active 
          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
          : "bg-transparent text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function InputField({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{label}</label>
      <input type="text" className="w-full bg-[#020817] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" defaultValue={value} />
    </div>
  );
}

function ApiField({ title, desc, status }: any) {
  const isConnected = status === "Connected";
  return (
    <div className="flex items-center justify-between p-4 bg-[#020817] border border-white/10 rounded-lg">
      <div>
        <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
        <p className="text-xs text-[#94A3B8]">{desc}</p>
      </div>
      <div className="flex items-center gap-4">
        {isConnected ? (
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-md border border-[#10B981]/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Connected
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-md border border-[#F59E0B]/20">
            Needs Config
          </span>
        )}
        <Button className="h-8 text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10">Configure</Button>
      </div>
    </div>
  );
}

function ToggleField({ title, desc, active }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#020817] border border-white/10 rounded-lg">
      <div>
        <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
        <p className="text-xs text-[#94A3B8]">{desc}</p>
      </div>
      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${active ? "bg-[#14B8A6]" : "bg-white/10"}`}>
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${active ? "right-1" : "left-1"}`} />
      </div>
    </div>
  );
}
