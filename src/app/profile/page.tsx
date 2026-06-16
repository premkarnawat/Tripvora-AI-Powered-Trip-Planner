"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { User, Settings, CreditCard, Bell, Shield, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="min-h-screen pb-20">
      <PageHeader 
        title="My Profile" 
        description="Manage your account, preferences, and travel statistics."
        icon={User}
      />
      
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar / User Info */}
        <div className="md:col-span-1 space-y-6">
           <div className="glass-card p-6 rounded-3xl border border-white/5 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/30 to-indigo-500/30 opacity-50" />
             
             <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-primary to-indigo-500 border-4 border-[#0F172A] relative z-10 flex items-center justify-center text-3xl font-bold text-white shadow-xl mt-4 mb-4">
                A
             </div>
             <h2 className="text-xl font-bold text-white mb-1">Arjun Kumar</h2>
             <p className="text-sm text-white/50 mb-6">arjun.kumar@example.com</p>
             
             <Button className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl">
                Edit Profile
             </Button>
           </div>

           <div className="glass-card p-4 rounded-3xl border border-white/5">
             <nav className="flex flex-col gap-2">
                {[
                  { icon: User, label: "Personal Info", active: true },
                  { icon: CreditCard, label: "Payment Methods" },
                  { icon: Bell, label: "Notifications" },
                  { icon: Shield, label: "Security" },
                ].map((item, i) => (
                  <button key={i} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${item.active ? 'bg-primary/20 text-primary' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
             </nav>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
           
           {/* Stats */}
           <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Map className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                    <div className="text-3xl font-bold text-white font-sora">12</div>
                    <div className="text-sm text-white/50">Trips Planned</div>
                 </div>
              </div>
              <div className="glass-card p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Map className="w-6 h-6 text-indigo-400" />
                 </div>
                 <div>
                    <div className="text-3xl font-bold text-white font-sora">5</div>
                    <div className="text-sm text-white/50">Countries Visited</div>
                 </div>
              </div>
           </div>

           {/* Settings Form Placeholder */}
           <div className="glass-card p-8 rounded-3xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
              
              <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm text-white/60">First Name</label>
                       <input type="text" defaultValue="Arjun" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm text-white/60">Last Name</label>
                       <input type="text" defaultValue="Kumar" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm text-white/60">Email Address</label>
                    <input type="email" defaultValue="arjun.kumar@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm text-white/60">Phone Number</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                 </div>
                 
                 <div className="pt-4">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12">
                       Save Changes
                    </Button>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
