"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Traveler", price: "Free", desc: "For individual explorers.", features: ["3 AI Itineraries/mo", "Basic Budgeting", "Email Support"] },
  { name: "Plus", price: "$9/mo", desc: "For frequent flyers.", features: ["Unlimited Itineraries", "Advanced Filters", "Group Collaboration", "Priority Support"], recommended: true },
  { name: "Agency OS", price: "$99/mo", desc: "For travel businesses.", features: ["CRM Pipeline", "White-label itineraries", "WhatsApp Automation", "Team Accounts"] },
];

export function TrustAndPricing() {
  return (
    <section className="py-32 bg-[#0F172A] relative overflow-hidden">
      
      {/* Infinite Marquee Trust Section */}
      <div className="mb-40">
        <div className="text-center mb-12">
          <p className="text-white/40 uppercase tracking-widest text-sm font-bold">Trusted by leading travel partners</p>
        </div>
        <div className="flex overflow-hidden relative w-full h-16 mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)">
          <motion.div 
            animate={{ x: [0, -1036] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            className="flex gap-16 whitespace-nowrap px-8 items-center opacity-50 grayscale"
          >
            {[...Array(2)].fill(["Airbnb", "Expedia", "Booking.com", "MakeMyTrip", "Agoda", "TripAdvisor"]).flat().map((logo, i) => (
              <span key={i} className="text-3xl font-bold text-white font-sora mx-8">{logo}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white font-sora mb-4">Simple, transparent pricing.</h2>
          <p className="text-white/50 text-lg">No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass-card rounded-3xl p-8 flex flex-col group ${plan.recommended ? 'border-primary/50 bg-[#0F172A]' : 'border-white/10'}`}
            >
              {/* Radial Hover Glow (CSS fallback for simplicity, can use useMouse for full effect) */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-xs font-bold text-white shadow-[0_0_15px_rgba(20,184,166,0.5)]">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-white font-sora mb-2">{plan.name}</h3>
              <p className="text-white/50 text-sm mb-6">{plan.desc}</p>
              
              <div className="text-4xl font-extrabold text-white mb-8 font-sora">{plan.price}</div>

              <div className="flex flex-col gap-4 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-white/70 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className={`w-full h-12 rounded-full font-bold ${plan.recommended ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-white/10 hover:bg-white text-white hover:text-[#0F172A]'}`}>
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
