"use client";

import { useState } from "react";
import { Check, HelpCircle, X, ShieldAlert, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [activeTab, setActiveTab] = useState<"traveler" | "agency">("traveler");

  const travelerPlans = [
    {
      name: "Free",
      price: "$0",
      desc: "For solo explorers planning their next quick getaway.",
      features: ["5 AI trip generations per month", "Standard itinerary exports", "Community forum access", "Basic maps integration"]
    },
    {
      name: "Plus",
      price: "$9",
      desc: "For frequent travelers seeking unlimited options and customization.",
      features: ["Unlimited AI trip generations", "Premium PDF exports", "Save up to 15 active itineraries", "Offline maps support", "Ad-free experience"],
      popular: true
    },
    {
      name: "Pro",
      price: "$19",
      desc: "For luxury explorers seeking bespoke recommendations and priorities.",
      features: ["Everything in Plus", "Priority AI processing speed", "Uncapped active saved trips", "24/7 concierge chat access", "Exclusive partner discounts", "Custom route optimization"]
    }
  ];

  const agencyPlans = [
    {
      name: "Growth",
      price: "$99",
      desc: "For boutique agencies getting started with CRM & AI.",
      features: ["Up to 3 staff seats", "100 AI package generations / mo", "Lead management CRM pipeline", "Standard WhatsApp templates", "Email support"]
    },
    {
      name: "Pro",
      price: "$249",
      desc: "For growing teams seeking advanced integrations & APIs.",
      features: ["Up to 10 staff seats", "Unlimited AI package generations", "Advanced WhatsApp Business API integration", "Quotation PDF white-labeling", "Custom API access", "24/7 Priority support"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For global travel networks and large agencies.",
      features: ["Unlimited staff accounts", "Dedicated server instance", "Custom AI training on your data", "Dedicated account manager", "SLA guarantees", "Custom CRM integrations"]
    }
  ];

  const plans = activeTab === "traveler" ? travelerPlans : agencyPlans;

  const comparisonFeatures = [
    { name: "AI Trip Generations", free: "5/mo", plus: "Unlimited", pro: "Unlimited" },
    { name: "Premium PDF Exporters", free: false, plus: true, pro: true },
    { name: "Offline Maps & Navigation", free: false, plus: true, pro: true },
    { name: "Ad-free Interface", free: false, plus: true, pro: true },
    { name: "Priority AI Speeds", free: false, plus: false, pro: true },
    { name: "Live Concierge Chat Support", free: false, plus: false, pro: true }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pt-28 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black tracking-widest uppercase mb-4">
            Pricing Plans
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight font-sora mb-3">
            Honest, Transparent Plans
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Choose the plan that matches your travel frequency or agency size. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-white border border-slate-200/60 p-1 rounded-full flex gap-1">
            <button 
              onClick={() => setActiveTab("traveler")}
              className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "traveler" ? 'bg-black text-white shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Traveler Plans
            </button>
            <button 
              onClick={() => setActiveTab("agency")}
              className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "agency" ? 'bg-black text-white shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Agency Plans
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-[32px] p-8 md:p-10 border flex flex-col justify-between relative ${
                plan.popular 
                  ? 'border-black shadow-[0_15px_40px_rgba(0,0,0,0.06)]' 
                  : 'border-slate-100 shadow-[0_4px_25px_rgba(15,23,42,0.01)]'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-black text-black tracking-wider uppercase mb-1">{plan.name}</h3>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">{plan.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-black font-sora">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-slate-400 text-xs font-semibold">/month</span>}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                      <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className={`w-full rounded-xl py-3 text-xs font-bold transition-all h-11 border-none shadow-sm ${
                  plan.popular ? 'bg-black text-white hover:bg-black/90' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {plan.price === "Custom" ? "Contact Support" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table (Only shown for traveler plans) */}
        {activeTab === "traveler" && (
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm overflow-x-auto">
            <h3 className="text-xl font-bold font-sora text-black mb-6">Compare Traveler Features</h3>
            
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black tracking-widest uppercase">
                  <th className="py-4">Features</th>
                  <th className="py-4 text-center">Free</th>
                  <th className="py-4 text-center">Plus</th>
                  <th className="py-4 text-center">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((f, i) => (
                  <tr key={i} className="border-b border-slate-50 text-slate-700 text-xs font-semibold last:border-0">
                    <td className="py-4 font-bold text-slate-800">{f.name}</td>
                    <td className="py-4 text-center">
                      {typeof f.free === "string" ? f.free : f.free ? <Check className="w-4 h-4 text-teal-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="py-4 text-center">
                      {typeof f.plus === "string" ? f.plus : f.plus ? <Check className="w-4 h-4 text-teal-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="py-4 text-center">
                      {typeof f.pro === "string" ? f.pro : f.pro ? <Check className="w-4 h-4 text-teal-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
