"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, Play, ArrowRight, ShieldCheck, Zap, 
  MessageSquareCode, FileSpreadsheet, Users, BarChart3, Database 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgenciesPage() {
  const [activeTab, setActiveTab] = useState("crm");

  const features = [
    {
      id: "crm",
      name: "Lead CRM",
      icon: Users,
      title: "Omnichannel Lead Management CRM",
      desc: "Automatically aggregate leads from Facebook, Instagram, Google Ads, and your website into one unified database. Assign deals to agents dynamically and track conversion pipeline stages in real-time.",
      bullets: ["Direct landing page integrations", "Automated lead distribution rules", "Custom pipeline stages & deal values", "Interaction history tracking"]
    },
    {
      id: "ai-builder",
      name: "AI Package Builder",
      icon: Zap,
      title: "Instant AI Package & Quotation Builder",
      desc: "Enter a traveler's requirements or paste a rough travel text, and let the AI instantly compile a detailed day-by-day itinerary complete with hotel, transport, and sightseeing recommendations.",
      bullets: ["Generate luxury proposals in under 10 seconds", "Real-time pricing estimation integration", "Auto-reallocation based on traveler budget", "White-labeled PDF proposal outputs"]
    },
    {
      id: "whatsapp",
      name: "WhatsApp Automation",
      icon: MessageSquareCode,
      title: "WhatsApp Business API Integrations",
      desc: "Send automated booking receipts, payment reminders, and feedback surveys directly to your clients' WhatsApp. Equip your agents with a shared inbox and custom message templates.",
      bullets: ["Shared team inbox", "Automatic payment alerts", "Meta Verified template support", "AI Chatbot customer helper"]
    }
  ];

  const currentFeature = features.find(f => f.id === activeTab) || features[0];

  const pricingTiers = [
    {
      name: "Growth",
      price: "$99",
      desc: "Perfect for boutique travel agencies getting started with AI.",
      features: ["Up to 3 agency staff accounts", "AI Quotation Generator (100/mo)", "Lead CRM core pipeline", "Standard WhatsApp notifications", "Email support"]
    },
    {
      name: "Pro",
      price: "$249",
      desc: "Ideal for growing teams seeking advanced integrations.",
      features: ["Up to 10 staff accounts", "Unlimited AI package generations", "Advanced WhatsApp Business API integration", "Quotation PDF white-labeling", "Custom API access", "24/7 Priority support"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Custom solutions for global travel networks and large agencies.",
      features: ["Unlimited staff accounts", "Dedicated server instance", "Custom AI training on your agency data", "Dedicated account manager", "SLA guarantees", "Custom CRM integrations"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pt-28 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-black tracking-widest uppercase mb-6">
            <ShieldCheck className="w-4 h-4" /> B2B Agency OS
          </span>
          
          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight font-sora leading-[1.1] mb-6">
            Grow Your Travel Business With AI
          </h1>
          
          <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto font-medium">
            Equip your agency with the world's most advanced AI travel planning CRM. Build quotations in seconds, automate client outreach, and scale conversion pipelines.
          </p>

          <div className="flex justify-center items-center gap-4">
            <Button className="bg-black hover:bg-black/90 text-white rounded-full px-8 h-12 font-bold shadow-lg transition-all active:scale-95 border-none">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-slate-200/80 hover:bg-slate-50 text-slate-700 rounded-full px-8 h-12 font-bold transition-all">
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Video Demo Placeholder */}
        <div className="mb-24 relative max-w-4xl mx-auto rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/60 aspect-video bg-slate-900 group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200&auto=format&fit=crop" 
            alt="CRM Demo"
            className="w-full h-full object-cover opacity-40 group-hover:scale-[1.01] transition-transform duration-700"
          />
          {/* Overlay Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#E2FF00] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 fill-black ml-1" />
            </div>
          </div>
          <span className="absolute bottom-6 left-6 text-white text-xs font-bold bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
            Watch 2-Minute Platform Demo Video
          </span>
        </div>

        {/* Tabbed Feature Showcase */}
        <div className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-sora text-black tracking-tight">The Agency OS Suite</h2>
            <p className="text-slate-500 text-sm mt-1">Everything you need to run a high-revenue agency in one place.</p>
          </div>

          {/* Feature selector */}
          <div className="flex justify-center gap-4 border-b border-slate-200/60 pb-3 mb-10 overflow-x-auto scrollbar-hide">
            {features.map((f) => {
              const active = f.id === activeTab;
              const IconComp = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveTab(f.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                    active 
                      ? 'bg-black text-white border-black shadow-sm' 
                      : 'bg-white text-slate-500 border-slate-200/60 hover:border-slate-400'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  {f.name}
                </button>
              );
            })}
          </div>

          {/* Feature details */}
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100/80 shadow-[0_4px_25px_rgba(15,23,42,0.02)] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-black font-sora leading-tight mb-4">
                {currentFeature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                {currentFeature.desc}
              </p>
              
              <ul className="space-y-3">
                {currentFeature.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs text-slate-700 font-bold">
                    <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Visual placeholder */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 h-72 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Live CRM Pipeline</span>
                <span className="bg-teal-100 text-teal-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Updated Just Now</span>
              </div>
              
              <div className="space-y-3 my-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="text-xs font-bold text-slate-800">Leads Inbox</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">24 Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    <span className="text-xs font-bold text-slate-800">Quotations Generated</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">112 Generated</span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <span className="text-[10px] text-teal-600 font-bold hover:underline cursor-pointer flex items-center gap-1">
                  View Full Dashboard <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div id="pricing" className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-sora text-black tracking-tight">Flexible CRM Pricing</h2>
            <p className="text-slate-500 text-sm mt-1">Scale your platform seats and generations as your agency expands.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, i) => (
              <div 
                key={i} 
                className={`bg-white rounded-[32px] p-8 md:p-10 border flex flex-col justify-between relative ${
                  tier.popular 
                    ? 'border-black shadow-[0_15px_40px_rgba(0,0,0,0.06)]' 
                    : 'border-slate-100 shadow-[0_4px_25px_rgba(15,23,42,0.01)]'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-black text-black tracking-wider uppercase mb-1">{tier.name}</h3>
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">{tier.desc}</p>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold text-black font-sora">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-slate-400 text-xs font-semibold">/month</span>}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className={`w-full rounded-xl py-3 text-xs font-bold transition-all h-11 border-none shadow-sm ${
                    tier.popular ? 'bg-black text-white hover:bg-black/90' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-sora text-black tracking-tight">Success Stories</h2>
            <p className="text-slate-500 text-sm mt-1">See how leading travel companies scale with TripPilot.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Alpine Luxury Collection",
                quote: "Before TripPilot, building a custom itinerary took hours. Now, we generate and deliver clean, stunning proposals in 3 minutes, which skyrocketed our conversion by 650%.",
                user: "Marcus Thorne, CEO"
              },
              {
                title: "Nomad Expeditions",
                quote: "The direct WhatsApp automation saves our team thousands of minutes every week. Payment reminders and review collections are fully automated.",
                user: "Sarah Jenkins, Ops Director"
              }
            ].map((caseStudy, idx) => (
              <div key={idx} className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.01)] flex flex-col justify-between">
                <p className="text-slate-600 italic text-sm leading-relaxed mb-6 font-semibold">
                  "{caseStudy.quote}"
                </p>
                <div>
                  <h4 className="text-base font-bold text-black font-sora mb-1">{caseStudy.title}</h4>
                  <span className="text-xs text-slate-400 font-semibold">{caseStudy.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
