"use client";

import { motion } from "framer-motion";
import { User, Lock, Bell, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl text-white/60 mb-1 font-medium">Account</h2>
        <h1 className="text-3xl md:text-4xl font-bold text-white font-sora mb-10">
          Settings
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Settings Navigation */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-bold transition-all border border-white/10">
            <User className="w-4 h-4" /> Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 font-medium transition-all">
            <Lock className="w-4 h-4" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 font-medium transition-all">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 font-medium transition-all">
            <Globe className="w-4 h-4" /> Preferences
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 space-y-8">
          
          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white font-sora mb-6">Profile Information</h3>
            <form className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white border-2 border-white/20">
                  A
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Change Avatar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">First Name</label>
                  <input type="text" defaultValue="Arjun" className="w-full bg-[#121824] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Last Name</label>
                  <input type="text" defaultValue="Sharma" className="w-full bg-[#121824] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Email Address</label>
                <input type="email" defaultValue="arjun@example.com" className="w-full bg-[#121824] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-red-500/20 bg-red-500/5">
            <h3 className="text-xl font-bold text-white font-sora mb-2">Danger Zone</h3>
            <p className="text-white/60 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/50">
              Delete Account
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
