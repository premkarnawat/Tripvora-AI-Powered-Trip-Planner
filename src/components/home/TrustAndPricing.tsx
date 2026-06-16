"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Traveler", price: "Free", desc: "For individual explorers.", features: ["3 AI Itineraries/mo", "Basic Budgeting", "Email Support"] },
  { name: "Plus", price: "₹799/mo", desc: "For frequent flyers.", features: ["Unlimited Itineraries", "Advanced Filters", "Group Collaboration", "Priority Support"], recommended: true },
  { name: "Agency OS", price: "₹7,999/mo", desc: "For travel businesses.", features: ["CRM Pipeline", "White-label itineraries", "WhatsApp Automation", "Team Accounts"] },
];

function PricingCard({ plan }: { plan: any }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={`relative glass-card rounded-xl p-8 flex flex-col group overflow-hidden border text-left ${
        plan.recommended ? "border-primary/40 bg-[#0B0F19]" : "border-white/10 bg-[#0F172A]"
      }`}
    >
      {/* Background Radial Mouse Glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(20, 184, 166, 0.06),
              transparent 80%
            )
          `,
        }}
      />

      {plan.recommended && (
        <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-lg">
          Most Popular
        </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-white font-sora mb-1 tracking-tight">{plan.name}</h3>
        <p className="text-white/40 text-xs mb-6 font-sans">{plan.desc}</p>
        
        <div className="text-4xl font-extrabold text-white mb-8 font-sora tracking-tight">{plan.price}</div>

        <div className="flex flex-col gap-3.5 mb-8 flex-1">
          {plan.features.map((feature: string, j: number) => (
            <div key={j} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <Check className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-white/70 text-sm font-sans">{feature}</span>
            </div>
          ))}
        </div>

        <Button className={`w-full h-12 rounded-lg font-bold font-sora text-sm transition-all duration-300 ${
          plan.recommended 
            ? "bg-primary hover:bg-primary/95 text-white shadow-[0_4px_20px_rgba(20,184,166,0.25)]" 
            : "bg-white/5 hover:bg-white text-white hover:text-[#0F172A] border border-white/10"
        }`}>
          Get Started
        </Button>
      </div>

      {/* Border border lighting effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
        style={{
          border: "1px solid transparent",
          background: useMotionTemplate`
            radial-gradient(
              180px circle at ${mouseX}px ${mouseY}px,
              #14B8A6,
              transparent 70%
            )
          `,
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude"
        }}
      />
    </motion.div>
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
          <h2 className="text-4xl md:text-5xl font-bold text-white font-sora mb-4 tracking-tight">Simple, transparent pricing.</h2>
          <p className="text-white/50 text-base font-sans">No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.015 }}
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
