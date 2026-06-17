"use client";

import { useState } from "react";
import { User, Settings, CreditCard, Bell, Shield, Map, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pt-28 pb-20 font-sans">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black tracking-widest uppercase mb-4">
            <User className="w-3.5 h-3.5" /> Account OS
          </span>
          <h1 className="text-3xl font-black text-black tracking-tight font-sora">
            My Profile
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">
            Manage your account details, billing options, and travel statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar / User Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-20 bg-teal-50/50" />
              
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-white overflow-hidden relative z-10 shadow-md mb-4 mt-2">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                  alt="Arjun Kumar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-bold text-black font-sora">Elena Rostova</h2>
              <p className="text-xs text-slate-400 font-semibold mb-6">elena@luxury.com</p>
              
              <Button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-150 text-black text-xs font-bold rounded-xl h-10 transition-all">
                Edit Avatar
              </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
              <nav className="flex flex-col gap-1.5">
                {[
                  { id: "info", icon: User, label: "Personal Info" },
                  { id: "billing", icon: CreditCard, label: "Payment Methods" },
                  { id: "settings", icon: Settings, label: "Settings" }
                ].map((item) => {
                  const active = activeTab === item.id;
                  return (
                    <button 
                      key={item.id} 
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
                        active 
                          ? 'bg-teal-50 text-teal-700 font-bold' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <item.icon className="w-4.5 h-4.5" />
                      <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <Map className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-black font-sora leading-none mb-1">12</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Trips Planned</div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-black font-sora leading-none mb-1">5</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Countries Visited</div>
                </div>
              </div>
            </div>

            {/* Settings Form */}
            {activeTab === "info" && (
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-black font-sora mb-6">Personal Information</h3>
                
                <form onSubmit={handleSave} className="space-y-4">
                  {success && (
                    <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-800 text-xs font-bold flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-teal-600" /> Changes saved successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase">First Name</label>
                      <input 
                        type="text" 
                        defaultValue="Elena" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-semibold" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Last Name</label>
                      <input 
                        type="text" 
                        defaultValue="Rostova" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="elena@luxury.com" 
                      disabled
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-400 transition-all font-semibold cursor-not-allowed" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Phone Number</label>
                    <input 
                      type="tel" 
                      defaultValue="+91 98765 43210" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-semibold" 
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="bg-black hover:bg-black/90 text-white rounded-xl px-8 h-11 text-xs font-bold border-none shadow-sm">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab !== "info" && (
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm py-12 text-center text-slate-400">
                <Settings className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                <p className="text-xs font-semibold">Settings module configuration available on live agency plans.</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

// Dummy standard Globe icon component fallback
function Globe(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
