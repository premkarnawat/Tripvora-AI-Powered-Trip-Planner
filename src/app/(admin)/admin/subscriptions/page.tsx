"use client";

import { useState } from "react";
import { 
  CreditCard, Plus, ArrowUpRight, CheckCircle2, 
  Settings, HelpCircle, Edit2, AlertCircle
} from "lucide-react";

// Mock subscription stats and plans
const plansData = [
  {
    id: 1,
    name: "Base Plan",
    price: "₹999/mo",
    agencies: 42,
    features: "Lead Management, basic CRM, 5 active trips/mo",
    status: "Active"
  },
  {
    id: 2,
    name: "Growth Plan",
    price: "₹1,999/mo",
    agencies: 54,
    features: "Lead Management, AI Package Builder, 25 active trips/mo",
    status: "Active"
  },
  {
    id: 3,
    name: "Premium Plan (Pro)",
    price: "₹2,999/mo",
    agencies: 28,
    features: "All CRM features, Quotations Builder, Unlimited trips, Custom WhatsApp Integration",
    status: "Active"
  }
];

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState(plansData);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Billing System</h2>
          <h1 className="text-3xl font-bold font-sora text-[#0F172A]">Subscriptions</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage B2B SaaS pricing plans, active subscription counts, and Razorpay endpoints.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto">
          <Plus className="w-4 h-4" />
          <span>Create New Tier</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Active B2B Subscriptions</span>
          <h3 className="text-2xl font-bold font-sora text-[#0F172A] mt-1">124</h3>
          <span className="text-[10px] text-[#16A34A] font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +8.4% MRR growth
          </span>
        </div>
        
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Monthly SaaS MRR</span>
          <h3 className="text-2xl font-bold font-sora text-[#0F172A] mt-1">₹2,84,300</h3>
          <span className="text-[10px] text-[#16A34A] font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Active in Razorpay
          </span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Failed Renewals (30d)</span>
          <h3 className="text-2xl font-bold font-sora text-red-600 mt-1">2</h3>
          <span className="text-[10px] text-red-500 font-semibold flex items-center mt-1">
            <AlertCircle className="w-3.5 h-3.5" /> Action required
          </span>
        </div>
      </div>

      {/* Plans Config list */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold font-sora text-[#0F172A]">Pricing Tiers Configuration</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                <th className="py-3 px-4 font-normal">Plan Name</th>
                <th className="py-3 px-4 font-normal">Monthly Cost</th>
                <th className="py-3 px-4 font-normal text-center">Active Agencies</th>
                <th className="py-3 px-4 font-normal">Feature Snippet</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal text-right">Configure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]/50 text-xs font-semibold text-[#0F172A]">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 text-[#0EA5A4]">{p.name}</td>
                  <td className="py-4 px-4 font-bold text-[#0F172A]">{p.price}</td>
                  <td className="py-4 px-4 text-center">{p.agencies}</td>
                  <td className="py-4 px-4 text-[#64748B] truncate max-w-xs">{p.features}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[#64748B] transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
