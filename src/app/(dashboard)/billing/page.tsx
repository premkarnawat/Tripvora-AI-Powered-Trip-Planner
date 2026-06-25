"use client";

import { motion } from "framer-motion";
import { CreditCard, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl text-white/60 mb-1 font-medium">Subscription</h2>
        <h1 className="text-3xl md:text-4xl font-bold text-white font-sora mb-10">
          Billing & Plans
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Current Plan Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white">Active Plan</span>
                </div>
                <h3 className="text-3xl font-bold text-white font-sora mb-2">Free Tier</h3>
                <p className="text-white/60">You are currently on the basic free plan. Upgrade to unlock premium AI generation.</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-4xl font-black text-white font-sora">$0<span className="text-lg text-white/40 font-normal">/mo</span></p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white font-sora mb-6">Payment Methods</h3>
            <div className="flex items-center justify-between p-4 border border-white/10 rounded-2xl bg-white/5 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white/50" />
                </div>
                <div>
                  <p className="font-bold text-white">•••• •••• •••• 4242</p>
                  <p className="text-xs text-white/50">Expires 12/28</p>
                </div>
              </div>
              <button className="text-sm font-bold text-red-400 hover:text-red-300">Remove</button>
            </div>
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              + Add Payment Method
            </Button>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl p-[1px] bg-gradient-to-b from-primary/50 to-transparent">
            <div className="bg-[#0A0F1D] p-8 rounded-[23px] h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <Zap className="w-8 h-8 text-primary opacity-20" />
              </div>
              <h3 className="text-2xl font-bold text-white font-sora mb-2">Travixa Pro</h3>
              <p className="text-white/60 text-sm mb-6">For the avid traveler who wants the best tools.</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-white font-sora">$19</span>
                <span className="text-white/40">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited AI Itineraries",
                  "Real-time Flight Tracking",
                  "Export to PDF & Calendar",
                  "Priority Email Support",
                  "No Ads"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
