"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  { 
    name: "Free Plan", 
    price: "₹0", 
    desc: "For basic trip planning and custom explorations.", 
    features: [
      "3 AI Itineraries/mo",
      "Basic budgeting details",
      "Standard routing suggestions",
      "Email support assistance",
      "Access to saved itineraries"
    ],
    theme: "blue",
    btnText: "Start for Free"
  },
  { 
    name: "Pro Plan", 
    price: "₹799", 
    desc: "For frequent travelers seeking advanced tools.", 
    features: [
      "Unlimited custom itineraries",
      "Advanced budget engine",
      "Multi-city route customization",
      "Priority WhatsApp support",
      "Group trip collaboration tools",
      "Offline PDF itinerary export"
    ],
    theme: "white",
    recommended: true,
    btnText: "Start Free 7 Days Trial"
  },
  { 
    name: "Advance Plan", 
    price: "₹7,999", 
    desc: "For travel agents and coordinators.", 
    features: [
      "CRM & customer lead pipeline",
      "White-label itineraries",
      "Automated WhatsApp alerts",
      "Multi-member agency accounts",
      "Advanced vendor billing OS",
      "Custom agency subdomain"
    ],
    theme: "green",
    btnText: "Get Started"
  }
];

const logoColors: Record<string, string> = {
  "Airbnb": "text-[#FF5A5F] hover:opacity-90",
  "Expedia": "text-[#FFB700] hover:opacity-90",
  "Booking.com": "text-[#38BDF8] hover:opacity-90",
  "MakeMyTrip": "text-[#DF1A22] hover:opacity-90",
  "Agoda": "text-[#EC4899] hover:opacity-90",
  "TripAdvisor": "text-[#00AF87] hover:opacity-90"
};

function PricingCard({ plan }: { plan: any }) {
  const isBlue = plan.theme === "blue";
  const isGreen = plan.theme === "green";
  const isWhite = plan.theme === "white";

  let glowColor = "rgba(59,130,246,0.12)";
  let badgeGradient = "from-blue-500 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]";
  
  if (isGreen) {
    glowColor = "rgba(16,185,129,0.12)";
    badgeGradient = "from-emerald-500 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]";
  } else if (isWhite) {
    glowColor = "rgba(255,255,255,0.08)";
    badgeGradient = "from-white to-gray-300 shadow-[0_0_15px_rgba(255,255,255,0.3)]";
  }

  return (
    <div
      className="relative rounded-2xl p-8 flex flex-col h-full border border-white/[0.08] bg-black/90 text-left overflow-hidden shadow-2xl"
      style={{
        backgroundImage: `radial-gradient(circle at 15% 15%, ${glowColor} 0%, transparent 60%)`
      }}
    >
      {/* Top Right Transparent Circle Outline */}
      <div className="absolute top-0 right-0 w-36 h-36 rounded-full border border-white/[0.03] -mr-8 -mt-8 pointer-events-none z-0" />
      
      {/* Header Info */}
      <div className="relative z-10 flex items-start justify-between mb-6">
        {/* Glow Box Badge */}
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${badgeGradient}`} />
        
        {/* Popular Badge */}
        {plan.recommended && (
          <div className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white flex items-center gap-1 font-mono">
            ★ Popular
          </div>
        )}
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white font-sora mb-2 tracking-tight">{plan.name}</h3>
        
        <div className="text-4xl font-extrabold text-white mb-2 font-sora tracking-tight">
          {plan.price}
          <span className="text-sm font-normal text-white/40 font-sans ml-1">/month</span>
        </div>
        
        <p className="text-white/40 text-xs mb-8 font-sans leading-relaxed">{plan.desc}</p>
        
        {/* Button */}
        <Button 
          className={`w-full h-12 rounded-lg font-bold font-sora text-sm transition-all duration-300 mb-8 border-none ${
            isWhite 
              ? "bg-white hover:bg-white/95 text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]" 
              : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
          }`}
        >
          {plan.btnText}
        </Button>

        {/* Divider line */}
        <div className="flex items-center gap-3 mb-6">
          <span className="h-[1px] flex-1 bg-white/[0.08]" />
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-mono">Stand Out Features</span>
          <span className="h-[1px] flex-1 bg-white/[0.08]" />
        </div>

        {/* Features */}
        <div className="flex flex-col gap-4 flex-1">
          {plan.features.map((feature: string, j: number) => (
            <div key={j} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
              <span className="text-white/70 text-xs font-sans leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TrustAndPricing() {
  return (
    <section className="py-32 bg-[#04060E] relative overflow-hidden border-t border-white/5">
      
      {/* Infinite Marquee Trust Section */}
      <div className="mb-40">
        <div className="text-center mb-12">
          <p className="text-white/40 uppercase tracking-widest text-xs font-bold font-sora">Trusted by leading travel partners</p>
        </div>
        <div className="flex overflow-hidden relative w-full h-16 mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)">
          <motion.div 
            animate={{ x: [0, -1036] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            className="flex gap-16 whitespace-nowrap px-8 items-center"
          >
            {[...Array(2)].fill(["Airbnb", "Expedia", "Booking.com", "MakeMyTrip", "Agoda", "TripAdvisor"]).flat().map((logo, i) => (
              <span 
                key={i} 
                className={`text-3xl font-bold font-sora mx-8 transition-all duration-300 cursor-pointer hover:scale-105 ${logoColors[logo] || 'text-white'}`}
              >
                {logo}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white font-sora mb-4 tracking-tight">Simple, transparent pricing.</h2>
          <p className="text-white/50 text-base font-sans">Choose a plan that fits your goals. No hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ 
                y: -16, 
                scale: 1.03,
                boxShadow: "0px 30px 60px rgba(0, 0, 0, 0.6)"
              }}
              className="h-full"
            >
              <PricingCard plan={plan} />
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
