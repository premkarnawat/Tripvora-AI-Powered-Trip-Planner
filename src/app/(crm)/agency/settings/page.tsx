"use client";

import { useState } from "react";
import { Settings, Building2, Users, Plug, Bell, Shield, Palette, Save, Upload, Trash2, Mail, MessageCircle, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10 flex gap-6">
      
      {/* Left Sidebar (Settings Navigation) */}
      <div className="w-64 shrink-0 space-y-6 hidden lg:block">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-[#94A3B8]" /> Settings
          </h2>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-3 mb-2">Agency</p>
          <NavButton label="General & Profile" active={activeTab === "General"} onClick={() => setActiveTab("General")} icon={Building2} />
          <NavButton label="Brand & Colors" active={activeTab === "Brand"} onClick={() => setActiveTab("Brand")} icon={Palette} />
          <NavButton label="Team & Roles" active={activeTab === "Team"} onClick={() => setActiveTab("Team")} icon={Users} />
        </div>

        <div className="pt-4 border-t border-white/5 space-y-1">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-3 mb-2">System</p>
          <NavButton label="Integrations" active={activeTab === "Integrations"} onClick={() => setActiveTab("Integrations")} icon={Plug} />
          <NavButton label="Notifications" active={activeTab === "Notifications"} onClick={() => setActiveTab("Notifications")} icon={Bell} />
          <NavButton label="Security" active={activeTab === "Security"} onClick={() => setActiveTab("Security")} icon={Shield} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
        {/* Header Toolbar */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{activeTab} Settings</h1>
            <p className="text-xs text-[#94A3B8] mt-1">Configure your workspace preferences.</p>
          </div>
          <div className="flex gap-2">
            <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Changes
            </Button>
          </div>
        </div>

        {/* Content Views */}
        
        {activeTab === "General" && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-[#0B1220] border border-white/5 rounded-md p-6 space-y-6">
              <h3 className="text-sm font-bold text-white mb-4">Agency Profile</h3>
              
              <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                <div className="w-20 h-20 rounded-md bg-[#020817] border border-white/10 flex items-center justify-center text-xs text-[#94A3B8]">Logo</div>
                <div className="space-y-2">
                  <Button className="h-8 text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10">
                    <Upload className="w-3.5 h-3.5 mr-1" /> Upload Image
                  </Button>
                  <p className="text-[10px] text-[#94A3B8]">Recommended size: 400x400px. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Agency Name</label>
                  <input type="text" defaultValue="Wanderlust Travels" className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Support Email</label>
                  <input type="email" defaultValue="support@wanderlust.com" className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Phone Number</label>
                  <input type="text" defaultValue="+91 98765 43210" className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Website</label>
                  <input type="text" defaultValue="www.wanderlust.com" className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Agency Address</label>
                  <textarea rows={3} defaultValue="Unit 402, Skyline Towers, Andheri West, Mumbai, 400053" className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8] resize-none" />
                </div>
              </div>
            </div>
            
            <div className="bg-[#0B1220] border border-white/5 rounded-md p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Localization</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Default Currency</label>
                  <select className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Timezone</label>
                  <select className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]">
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Team" && (
          <div className="space-y-6">
            <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Active Team Members</h3>
                <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none">
                  Invite Member
                </Button>
              </div>
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Last Active</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {[
                    { name: "Prem Karnawat", email: "prem@tripvora.com", role: "Admin", active: "Just now" },
                    { name: "Sarah Jenkins", email: "sarah@tripvora.com", role: "Sales Agent", active: "2 hours ago" },
                    { name: "Mike Ross", email: "mike@tripvora.com", role: "Operations", active: "Yesterday" },
                  ].map((user, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-3 px-4">
                        <p className="text-xs font-bold text-white">{user.name}</p>
                        <p className="text-[10px] text-[#94A3B8] mt-0.5">{user.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${user.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-white/10 text-[#94A3B8] border-white/20'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#94A3B8]">{user.active}</td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-white/20 hover:text-[#EF4444] transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Integrations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <IntegrationCard 
              name="WhatsApp Business" 
              desc="Send automated itineraries, quotes, and booking confirmations via Meta API." 
              icon={MessageCircle} 
              color="text-[#10B981]" 
              status="Connected" 
            />
            <IntegrationCard 
              name="Razorpay" 
              desc="Accept INR payments directly from your generated quotations and invoices." 
              icon={CreditCard} 
              color="text-[#38BDF8]" 
              status="Connected" 
            />
            <IntegrationCard 
              name="Stripe" 
              desc="Accept international payments in USD, EUR, and 100+ other currencies." 
              icon={CreditCard} 
              color="text-purple-500" 
              status="Not Connected" 
            />
            <IntegrationCard 
              name="Resend (SMTP)" 
              desc="Custom domain email sending for transactional and marketing campaigns." 
              icon={Mail} 
              color="text-white" 
              status="Connected" 
            />
          </div>
        )}

        {/* Placeholders for others */}
        {["Brand", "Notifications", "Security"].includes(activeTab) && (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 bg-white/[0.01] rounded-md h-[50vh]">
            <Settings className="w-8 h-8 text-white/20 mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">{activeTab} Config</h2>
            <p className="text-sm text-[#94A3B8] text-center max-w-sm">This settings panel is under construction.</p>
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

function IntegrationCard({ name, desc, icon: Icon, color, status }: any) {
  const isConnected = status === "Connected";
  return (
    <div className={`bg-[#0B1220] border ${isConnected ? 'border-[#14B8A6]/30' : 'border-white/5'} rounded-md p-5 relative overflow-hidden group`}>
      <div className="w-10 h-10 rounded-md bg-[#020817] border border-white/10 flex items-center justify-center mb-4">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <h3 className="text-sm font-bold text-white mb-2">{name}</h3>
      <p className="text-xs text-[#94A3B8] leading-relaxed mb-6 h-12">{desc}</p>
      
      <div className="flex justify-between items-center">
        {isConnected ? (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#10B981]"><Check className="w-3.5 h-3.5" /> Active</span>
        ) : (
          <span className="text-[10px] font-bold text-[#94A3B8]">Inactive</span>
        )}
        <Button className={`h-7 px-3 text-[10px] font-bold border transition-colors ${isConnected ? 'bg-white/5 text-white hover:bg-white/10 border-white/10' : 'bg-[#14B8A6] text-[#0F172A] hover:bg-[#14B8A6]/90 border-none'}`}>
          {isConnected ? 'Manage' : 'Connect'}
        </Button>
      </div>
    </div>
  );
}
