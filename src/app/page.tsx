"use client";

import { CinematicHero } from "@/components/home/CinematicHero";
import { AiDemo } from "@/components/home/AiDemo";
import { Destinations } from "@/components/home/Destinations";
import { CrmPreview } from "@/components/home/CrmPreview";
import { MarketplaceGrid } from "@/components/home/MarketplaceGrid";
import { StoryScroll } from "@/components/home/StoryScroll";
import { MacbookShowcase } from "@/components/home/MacbookShowcase";
import { TrustAndPricing } from "@/components/home/TrustAndPricing";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <main className="bg-[#0F172A] min-h-screen overflow-hidden">
      <CinematicHero />
      <StoryScroll />
      <AiDemo />
      <Destinations />
      <MacbookShowcase />
      <MarketplaceGrid />
      <CrmPreview />
      <TrustAndPricing />
      
      {/* Final CTA Section */}
      <section className="relative py-40 overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 pointer-events-none z-0">
           {/* Starry Night CSS Simulation */}
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0F172A] to-[#0F172A]" />
           <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse" />
           <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-primary/50 rounded-full shadow-[0_0_15px_#14B8A6] animate-pulse" />
           <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-sky-400/30 rounded-full blur-[2px] animate-pulse" />
        </motion.div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold text-white font-sora mb-8"
          >
            Start Planning Smarter.
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button size="lg" className="h-16 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.5)] transition-all duration-500 hover:scale-105 border-none shimmer">
              Generate My First Trip
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
