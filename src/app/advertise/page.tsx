"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Target, TrendingUp, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdvertisePage() {
  const plans = [
    {
      name: "Silver Tier",
      price: "₹15,000",
      period: "per month",
      desc: "Perfect for local boutiques and experiences.",
      features: ["Marketplace Listing", "Standard Impressions", "Local Geo-Targeting", "Basic Analytics"],
      color: "border-slate-400/30",
      button: "bg-slate-800 text-white hover:bg-slate-700"
    },
    {
      name: "Gold Tier",
      price: "₹45,000",
      period: "per month",
      desc: "For regional hotels and tour operators.",
      features: ["Featured Marketplace Listing", "High Impressions", "Regional Geo-Targeting", "AI Smart Recommendations", "Advanced Analytics"],
      color: "border-yellow-500/50 bg-yellow-500/5",
      button: "bg-yellow-500 hover:bg-yellow-600 text-black",
      popular: true
    },
    {
      name: "Platinum Tier",
      price: "Custom",
      period: "Enterprise",
      desc: "Global exposure for major airlines and chains.",
      features: ["Banner Ads Across Platform", "Maximum Impressions", "Global Targeting", "Priority AI Injection", "Custom CRM Integration", "Dedicated Account Manager"],
      color: "border-teal-500/50 bg-teal-500/5",
      button: "bg-teal-500 hover:bg-teal-600 text-white"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-4 font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black font-sora tracking-tight mb-4">Reach Premium Travelers.</h1>
          <p className="text-white/60 font-medium text-lg max-w-2xl mx-auto">
            Place your brand directly inside the AI-generated itineraries of high-intent travelers using our Smart Travel OS.
          </p>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#0A0F1D]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-bold font-sora mb-2">Hyper-Targeted</h3>
            <p className="text-sm text-white/50">Your ads only show when a user's trip matches your exact location and demographic.</p>
          </div>
          <div className="bg-[#0A0F1D]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-bold font-sora mb-2">High Intent</h3>
            <p className="text-sm text-white/50">Users are actively building budgets and ready to book. Capture them at the decision moment.</p>
          </div>
          <div className="bg-[#0A0F1D]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-bold font-sora mb-2">Measurable ROI</h3>
            <p className="text-sm text-white/50">Track clicks, impressions, and exact conversions through our comprehensive advertiser dashboard.</p>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative bg-[#0A0F1D]/80 backdrop-blur-xl border ${plan.color} rounded-[24px] p-8 flex flex-col`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold font-sora mb-2">{plan.name}</h3>
              <p className="text-sm text-white/50 mb-6 h-10">{plan.desc}</p>
              <div className="mb-8">
                <span className="text-4xl font-black font-sora">{plan.price}</span>
                <span className="text-white/50 text-sm ml-2">{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-semibold text-white/80">
                    <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Button className={`w-full font-bold py-6 rounded-xl ${plan.button}`}>
                Contact Sales
              </Button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
