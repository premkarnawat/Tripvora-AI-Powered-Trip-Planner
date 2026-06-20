"use client";

import { useState } from "react";
import { 
  Coins, TrendingUp, ArrowUpRight, BarChart3, Star, 
  Building2, Store, Calendar, DollarSign
} from "lucide-react";

export default function AdminRevenuePage() {
  const [timeframe, setTimeframe] = useState("Last 30 Days");

  // Summary Metrics in ₹
  const revenueDetails = [
    { label: "Total Revenue", value: "₹48,92,400", change: "+14.2%" },
    { label: "Agency CRM Revenue", value: "₹8,42,300", change: "+8.4%" },
    { label: "Marketplace Revenue", value: "₹18,24,600", change: "+16.5%" },
    { label: "Featured Listing Revenue", value: "₹6,80,000", change: "+10.1%" },
    { label: "Advertisement Revenue", value: "₹4,62,300", change: "+5.8%" },
    { label: "Lead Revenue", value: "₹6,82,400", change: "+12.4%" },
    { label: "Affiliate Revenue", value: "₹4,00,800", change: "+22.4%" },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Financial Operations</h2>
          <h1 className="text-3xl font-bold font-sora text-[#0F172A]">Revenue & Analytics</h1>
          <p className="text-sm text-[#64748B] mt-1">Platform commission, SaaS subscriptions, and advertisement earnings dashboard.</p>
        </div>
        <select 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] font-bold focus:outline-none"
        >
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Grid of 7 Detailed Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {revenueDetails.map((item, idx) => (
          <div 
            key={idx}
            className={`bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col justify-between ${
              idx === 0 ? "col-span-2 md:col-span-2 border-[#0EA5A4]/40 bg-[#0EA5A4]/5" : ""
            }`}
          >
            <div>
              <span className="text-[8px] font-bold text-[#94A3B8] uppercase block tracking-wider">{item.label}</span>
              <h4 className={`font-bold font-sora text-[#0F172A] mt-1 ${
                idx === 0 ? "text-2xl" : "text-sm"
              }`}>{item.value}</h4>
            </div>
            <span className="text-[8px] font-bold text-[#16A34A] flex items-center mt-2">
              <ArrowUpRight className="w-2.5 h-2.5" /> {item.change}
            </span>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue & Growth Chart */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="text-base font-bold font-sora text-[#0F172A]">Platform Growth & Commissions</h3>
            <p className="text-xs text-[#64748B]">Earned split commission from marketplace bookings (₹ INR)</p>
          </div>

          <div className="flex-1 w-full flex items-end gap-3 pt-6 pb-2">
            {[35, 55, 40, 75, 60, 85, 100, 70, 95, 110, 80, 120].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <div className="w-full relative flex justify-center items-end h-full">
                  <div 
                    className="w-full bg-[#0EA5A4]/15 group-hover:bg-[#0EA5A4]/35 rounded-t-md transition-all"
                    style={{ height: `${val}%` }}
                  />
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-[#0F172A] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow pointer-events-none transition-opacity whitespace-nowrap">
                    ₹{(val * 4).toFixed(1)}k
                  </div>
                </div>
                <span className="text-[9px] font-bold text-[#94A3B8] uppercase">
                  {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown Share Pie-Simulation */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="text-base font-bold font-sora text-[#0F172A]">Revenue Streams Share</h3>
            <p className="text-xs text-[#64748B]">Platform earnings contribution ratio</p>
          </div>

          <div className="space-y-4 py-2">
            {[
              { label: "Marketplace Commission", percent: "37.3%", color: "bg-[#0EA5A4]" },
              { label: "B2B SaaS CRM Subs", percent: "17.2%", color: "bg-[#14B8A6]" },
              { label: "Advertisements & Promos", percent: "22.8%", color: "bg-teal-400" },
              { label: "Leads & Referrals", percent: "22.7%", color: "bg-slate-300" },
            ].map((stream, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-semibold text-[#0F172A]">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${stream.color}`} />
                  <span className="text-[#64748B]">{stream.label}</span>
                </div>
                <span>{stream.percent}</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-[#94A3B8] font-medium text-center border-t border-slate-100 pt-3">
            Payout processed automatically via Razorpay Split
          </div>
        </div>

      </div>

      {/* Top Performing Entities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Agencies */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold font-sora text-[#0F172A] flex items-center gap-1.5">
              <Building2 className="w-4.5 h-4.5 text-[#0EA5A4]" />
              <span>Top Revenue Agencies</span>
            </h3>
            <span className="text-[10px] text-[#0EA5A4] font-bold hover:underline cursor-pointer">View CRM ledger</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-semibold text-[#0F172A]">
            {[
              { name: "Wanderlust Holidays", plan: "Premium Plan", gross: "₹2,45,600", commission: "₹36,840" },
              { name: "Travelista India", plan: "Growth Plan", gross: "₹1,92,480", commission: "₹28,870" },
              { name: "Elite Escapes", plan: "Premium Plan", gross: "₹1,20,300", commission: "₹18,045" },
            ].map((ag, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-[#0F172A] font-bold">{ag.name}</p>
                  <p className="text-[10px] text-[#94A3B8]">{ag.plan}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#0F172A] font-bold">{ag.gross}</p>
                  <p className="text-[10px] text-[#16A34A]">{ag.commission} platform fee</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Listings */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold font-sora text-[#0F172A] flex items-center gap-1.5">
              <Store className="w-4.5 h-4.5 text-[#0EA5A4]" />
              <span>Top Marketplace Listings</span>
            </h3>
            <span className="text-[10px] text-[#0EA5A4] font-bold hover:underline cursor-pointer">View marketplace stats</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-semibold text-[#0F172A]">
            {[
              { name: "The Ocean Resort & Spa", category: "Resort", gross: "₹1,24,500", clicks: "840 clicks" },
              { name: "Scuba Diving & Snorkeling", category: "Activity", gross: "₹76,200", clicks: "720 clicks" },
              { name: "Kedarkantha Trek Group", category: "Trek", gross: "₹56,300", clicks: "430 clicks" },
            ].map((list, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-[#0F172A] font-bold">{list.name}</p>
                  <p className="text-[10px] text-[#94A3B8]">{list.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#0F172A] font-bold">{list.gross}</p>
                  <p className="text-[10px] text-[#0EA5A4]">{list.clicks}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
