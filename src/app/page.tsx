"use client";

import { CinematicHero } from "@/components/home/CinematicHero";
import { AiDemo } from "@/components/home/AiDemo";
import { Destinations } from "@/components/home/Destinations";
import { CrmPreview } from "@/components/home/CrmPreview";
import { MarketplaceGrid } from "@/components/home/MarketplaceGrid";
import { StoryScroll } from "@/components/home/StoryScroll";
import { MacbookShowcase } from "@/components/home/MacbookShowcase";
import { TrustAndPricing } from "@/components/home/TrustAndPricing";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="bg-[#04060E] min-h-screen overflow-clip">
      <CinematicHero />
      <StoryScroll />
      <AiDemo />
      <Destinations />
      <MacbookShowcase />
      <MarketplaceGrid />
      <CrmPreview />
      <TrustAndPricing />
      
      {/* Final CTA Section */}
      <section className="relative py-40 overflow-hidden border-t border-white/5">
        <motion.div style={{ y }} className="absolute inset-0 pointer-events-none z-0">
           <div className="absolute inset-0 bg-[#04060E]" />
           <div className="absolute inset-0 bg-gradient-to-b from-[#04060E] to-[#020307]" />
        </motion.div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold text-white font-sora mb-8 tracking-tight"
          >
            Start Planning Smarter.
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button size="lg" className="h-16 px-10 rounded-lg bg-primary hover:bg-primary/95 text-white font-bold text-lg shadow-[0_4px_30px_rgba(20,184,166,0.25)] transition-all duration-300 hover:scale-[1.01] border-none font-sora">
              Generate My First Trip
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
