"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Calendar, MapPin, ShieldAlert, 
  Play, Plus, ArrowUpRight, Compass, Settings, 
  CloudSun, Shield, Coins, FileText, PhoneCall, Star
} from "lucide-react";

export default function Dashboard() {
  const [showAddSpend, setShowAddSpend] = useState(false);

  // Mock Budget Stats
  const budget = {
    total: 60000,
    used: 32000,
    remaining: 28000,
    percent: 46,
    stay: 14200,
    food: 6400,
    transport: 4200,
    activities: 7200
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Dynamic Hero Countdown Banner */}
      <div className="relative rounded-[32px] overflow-hidden border border-[#E5E7EB] bg-white p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-widest bg-[#14B8A6]/10 px-2.5 py-0.5 rounded-full border border-[#14B8A6]/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Assistant Active
            </span>
          </div>
          <h1 className="text-3xl font-black font-sora text-[#0F172A]">Welcome to Goa, Prem</h1>
          <p className="text-xs font-semibold text-[#64748B] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#14B8A6]" /> Upcoming Journey: <strong>Goa Trip</strong>
          </p>
        </div>

        {/* Action / Countdown details */}
        <div className="flex gap-4">
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 px-6 rounded-2xl text-center shrink-0">
            <span className="block text-[8px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Countdown</span>
            <span className="text-xl font-bold font-sora text-[#0F172A]">4 Days Left</span>
          </div>
          
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 px-6 rounded-2xl text-center shrink-0">
            <span className="block text-[8px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">AI Travel Score</span>
            <span className="text-xl font-bold font-sora text-[#14B8A6]">92%</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-widest px-1">Quick Planner Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Link href="/plan" className="block text-center p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#14B8A6] hover:translate-y-[-2px] transition-all">
            <Sparkles className="w-5 h-5 mx-auto text-[#14B8A6]" />
            <span className="text-[10px] font-bold text-[#0F172A] mt-2 block">Generate Itinerary</span>
          </Link>
          <Link href="/trips" className="block text-center p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#14B8A6] hover:translate-y-[-2px] transition-all">
            <Calendar className="w-5 h-5 mx-auto text-[#14B8A6]" />
            <span className="text-[10px] font-bold text-[#0F172A] mt-2 block">Continue Planning</span>
          </Link>
          <Link href="/partner" className="block text-center p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#14B8A6] hover:translate-y-[-2px] transition-all">
            <Compass className="w-5 h-5 mx-auto text-[#14B8A6]" />
            <span className="text-[10px] font-bold text-[#0F172A] mt-2 block">Find Travel Expert</span>
          </Link>
          <Link href="/offers" className="block text-center p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#14B8A6] hover:translate-y-[-2px] transition-all">
            <Coins className="w-5 h-5 mx-auto text-[#14B8A6]" />
            <span className="text-[10px] font-bold text-[#0F172A] mt-2 block">Browse Offers</span>
          </Link>
          <Link href="/marketplace" className="block text-center p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#14B8A6] hover:translate-y-[-2px] transition-all">
            <Plus className="w-5 h-5 mx-auto text-[#14B8A6]" />
            <span className="text-[10px] font-bold text-[#0F172A] mt-2 block">Explore Marketplace</span>
          </Link>
        </div>
      </div>

      {/* Main Grid Widgets - exact mapping from image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Remaining Budget & Spends */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Budget Widget Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">Remaining Budget</span>
                <h3 className="text-4xl font-bold font-sora text-[#0F172A] mt-1">₹{budget.remaining.toLocaleString()}</h3>
              </div>
              <div className="text-right text-xs font-semibold text-[#64748B]">
                <span>Total Budget: ₹{budget.total.toLocaleString()}</span>
                <span className="block text-[#14B8A6] font-bold mt-1">{budget.percent}% Spent</span>
              </div>
            </div>

            {/* Spent progress bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#0F172A] rounded-full" style={{ width: `${budget.percent}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-[#94A3B8] font-bold">
                <span>Spent: ₹{budget.used.toLocaleString()}</span>
                <span>Trip Ends in 4 days</span>
              </div>
            </div>

            {/* Stay, Food, Transport, Activities grids */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[8px] font-bold text-[#94A3B8] uppercase block">Stay</span>
                <p className="text-xs font-bold text-[#0F172A] mt-1">₹{budget.stay.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[8px] font-bold text-[#94A3B8] uppercase block">Food</span>
                <p className="text-xs font-bold text-[#0F172A] mt-1">₹{budget.food.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[8px] font-bold text-[#94A3B8] uppercase block">Transport</span>
                <p className="text-xs font-bold text-[#0F172A] mt-1">₹{budget.transport.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[8px] font-bold text-[#94A3B8] uppercase block">Activities</span>
                <p className="text-xs font-bold text-[#0F172A] mt-1">₹{budget.activities.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Recent Spends ledger */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold font-sora text-[#0F172A]">Recent Spends</h3>
              <span className="text-[10px] text-[#14B8A6] font-bold hover:underline cursor-pointer">View All</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-semibold text-[#0F172A]">
              {[
                { name: "Airport Transfer", category: "Oct 12 • Uber Premium", amount: "₹850" },
                { name: "The Leela Goa", category: "Oct 11 • Accommodation", amount: "₹7,200" },
                { name: "Fisherman's Wharf", category: "Oct 11 • Fine Dining", amount: "₹3,450" },
                { name: "Kayaking Tour", category: "Oct 10 • Activities", amount: "₹2,100" }
              ].map((spend, idx) => (
                <div key={idx} className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-[#0F172A] font-bold">{spend.name}</p>
                    <p className="text-[9px] text-[#94A3B8]">{spend.category}</p>
                  </div>
                  <span className="font-bold text-[#0F172A]">{spend.amount}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 bg-[#0F172A] hover:bg-[#0F172A]/90 text-white rounded-xl text-xs font-bold transition-all mt-4">
              + Add New Expense
            </button>
          </div>

          {/* Group travel banner */}
          <div className="bg-black text-white rounded-[28px] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
            <div className="space-y-1">
              <h4 className="text-base font-bold font-sora">Traveling with a group?</h4>
              <p className="text-xs text-slate-400">Split expenses easily with friends and track individual balances in real-time.</p>
            </div>
            <button className="px-5 py-2.5 bg-white hover:bg-slate-100 text-black rounded-full text-xs font-bold shrink-0 transition-all">
              Get Started
            </button>
          </div>

        </div>

        {/* Right Column: AI Budget insights & Documents */}
        <div className="space-y-6">
          
          {/* AI Budget Insights */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-[#14B8A6] uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#14B8A6]" />
              <span>AI Budget Insights</span>
            </h4>

            <div className="space-y-3.5 text-xs text-[#64748B] leading-relaxed">
              <div className="p-3 bg-[#14B8A6]/5 border border-[#14B8A6]/10 rounded-xl font-semibold">
                &ldquo;You've saved <strong className="text-[#14B8A6]">₹2,400</strong> on transport by using scooters instead of private cabs. Keep it up!&rdquo;
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-semibold">
                &ldquo;Dining costs are 12% higher than planned. Try some local eateries tonight to balance the budget.&ldquo;
              </div>
            </div>
          </div>

          {/* Projected total card */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-5 shadow-sm space-y-4">
            <div>
              <span className="text-[9px] font-bold text-[#64748B] uppercase block">Projected Total Cost</span>
              <h3 className="text-2xl font-bold font-sora text-[#0F172A] mt-0.5">₹46,500</h3>
              <p className="text-[10px] text-[#94A3B8] font-medium">Estimated end-of-trip spend</p>
            </div>

            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <div className="flex justify-between text-[10px] text-[#64748B] font-bold">
                <span>Confidence Level</span>
                <span className="text-[#16A34A]">High (92%)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#16A34A] rounded-full" style={{ width: "92%" }} />
              </div>
            </div>
          </div>

          {/* Travel Vault Widget */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-widest flex items-center justify-between">
              <span>Travel Vault Status</span>
              <Shield className="w-4.5 h-4.5 text-[#14B8A6]" />
            </h4>

            <div className="space-y-2.5 text-xs font-semibold text-[#64748B]">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Boarding Pass</span>
                <span className="text-[#16A34A]">Verified</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Hotel Voucher</span>
                <span className="text-[#16A34A]">Verified</span>
              </div>
              <div className="flex justify-between">
                <span>Travel Insurance</span>
                <span className="text-amber-600">Pending Review</span>
              </div>
            </div>
          </div>

          {/* Emergency Helpline contacts */}
          <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#DC2626] uppercase tracking-widest flex items-center justify-between">
              <span>Emergency helpline</span>
              <PhoneCall className="w-4.5 h-4.5 text-[#DC2626] animate-pulse" />
            </h4>
            <div className="space-y-2 text-xs font-semibold">
              <a href="tel:112" className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50">
                <span>Police / Distress Helpline</span>
                <span className="text-[#DC2626]">Dial 112</span>
              </a>
              <a href="tel:108" className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50">
                <span>Medical Ambulance Emergency</span>
                <span className="text-[#DC2626]">Dial 108</span>
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
