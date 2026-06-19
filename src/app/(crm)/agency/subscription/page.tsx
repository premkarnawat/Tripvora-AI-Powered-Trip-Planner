"use client";

import { CheckCircle2, Zap, MessageCircle, FileText, ArrowRight, Star, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10 flex flex-col lg:flex-row gap-6">
      
      {/* Left Column: Current Plan & Usage */}
      <div className="flex-1 space-y-6">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Subscription & Usage
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage your TripPilot platform tier and API usage limits.</p>
        </div>

        {/* Current Plan */}
        <div className="bg-[#0B1220] border border-[#14B8A6]/30 rounded-md p-6 relative overflow-hidden shadow-[0_0_30px_rgba(20,184,166,0.05)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#14B8A6]/5 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-widest mb-1">Current Plan</p>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                TripPilot Professional
                <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
              </h2>
              <p className="text-sm text-[#94A3B8] mt-1">Billed ₹2,999/month. Next cycle: Nov 01, 2026</p>
            </div>
            <Button className="h-9 text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors">
              Manage Billing
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            <div className="bg-[#020817] border border-white/5 rounded p-4">
              <span className="flex items-center gap-2 text-xs font-bold text-white mb-2"><UsersIcon className="w-4 h-4 text-[#38BDF8]" /> Team Seats</span>
              <div className="flex items-end justify-between">
                 <span className="text-xl font-bold text-white">4 <span className="text-sm text-[#94A3B8] font-normal">/ 5</span></span>
                 <span className="text-[10px] text-[#94A3B8]">Included</span>
              </div>
            </div>
            <div className="bg-[#020817] border border-white/5 rounded p-4">
              <span className="flex items-center gap-2 text-xs font-bold text-white mb-2"><MessageCircle className="w-4 h-4 text-[#10B981]" /> WhatsApp API</span>
              <div className="flex items-end justify-between">
                 <span className="text-xl font-bold text-white">1,240 <span className="text-sm text-[#94A3B8] font-normal">/ 5,000</span></span>
                 <span className="text-[10px] text-[#94A3B8]">Msg/mo</span>
              </div>
            </div>
            <div className="bg-[#020817] border border-white/5 rounded p-4">
              <span className="flex items-center gap-2 text-xs font-bold text-white mb-2"><FileText className="w-4 h-4 text-purple-400" /> AI Quotations</span>
              <div className="flex items-end justify-between">
                 <span className="text-xl font-bold text-white">85 <span className="text-sm text-[#94A3B8] font-normal">/ 200</span></span>
                 <span className="text-[10px] text-[#94A3B8]">Gen/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Marketplace Credits */}
        <div className="bg-[#0B1220] border border-white/5 rounded-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F59E0B] fill-current" /> Marketplace Credits
            </h3>
            <span className="text-xs font-bold text-[#F59E0B]">450 Available</span>
          </div>

          <div className="w-full h-2 bg-[#020817] rounded-full overflow-hidden border border-white/5 mb-4">
            <div className="h-full bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] w-[45%]" />
          </div>
          
          <div className="flex justify-between text-[10px] text-[#94A3B8] mb-6">
            <span>0</span>
            <span>1000 Total Limit</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             <CreditPack amount="100" price="₹999" />
             <CreditPack amount="250" price="₹2,299" popular />
             <CreditPack amount="500" price="₹4,299" />
             <CreditPack amount="1000" price="₹7,999" />
          </div>
        </div>

      </div>

      {/* Right Column: Upgrade Options */}
      <div className="lg:w-[350px] shrink-0 space-y-6">
        
        <div className="bg-gradient-to-b from-[#0B1220] to-[#020817] border border-[#38BDF8]/30 rounded-md p-6 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#38BDF8] to-purple-500" />
          
          <div className="w-12 h-12 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-[#38BDF8] fill-current" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Upgrade to Enterprise</h2>
          <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">
            Unlock unlimited team seats, priority WhatsApp API routing, and exclusive access to High Net-Worth marketplace leads.
          </p>

          <div className="flex items-end gap-1 mb-6">
            <span className="text-3xl font-bold text-white tracking-tight">₹9,999</span>
            <span className="text-xs text-[#94A3B8] mb-1">/month</span>
          </div>

          <ul className="space-y-3 mb-8">
            <FeatureItem text="Unlimited Team Seats" />
            <FeatureItem text="Unlimited AI Quotations" />
            <FeatureItem text="15,000 WhatsApp Msgs" />
            <FeatureItem text="Enterprise Marketplace Leads" />
            <FeatureItem text="White-label Client Portal" />
          </ul>

          <Button className="w-full h-10 text-xs font-bold bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all">
            Upgrade Plan <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>

      </div>
    </div>
  );
}

function UsersIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
      <span className="text-xs text-white">{text}</span>
    </li>
  );
}

function CreditPack({ amount, price, popular }: any) {
  return (
    <div className={`bg-[#020817] border ${popular ? 'border-[#F59E0B]' : 'border-white/5 hover:border-white/20'} rounded p-3 text-center transition-colors cursor-pointer relative`}>
      {popular && <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#0F172A] text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">Most Popular</div>}
      <div className="flex justify-center mb-1">
        <Zap className="w-4 h-4 text-[#F59E0B] fill-current" />
      </div>
      <p className="text-sm font-bold text-white mb-0.5">{amount}</p>
      <p className="text-[10px] text-[#94A3B8]">{price}</p>
    </div>
  );
}
