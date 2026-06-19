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
import Link from "next/link";

const avatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
];

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
      <section 
        className="relative py-48 overflow-hidden border-t border-white/5"
        style={{
          backgroundColor: "#020307",
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(226, 255, 0, 0.12) 0%, transparent 60%),
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 28px 28px, 28px 28px"
        }}
      >
        {/* Floating Neon Yellow Bubbles */}
        <div className="absolute left-12 md:left-24 top-1/4 flex flex-col items-center gap-2 pointer-events-none opacity-80 z-0">
          <div className="w-8 h-8 rounded-full bg-[#E2FF00] shadow-[0_0_15px_rgba(226,255,0,0.6)] animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-[#E2FF00] shadow-[0_0_10px_rgba(226,255,0,0.4)] -ml-6" />
        </div>
        
        <div className="absolute right-12 md:right-24 bottom-1/3 flex flex-col items-center gap-2 pointer-events-none opacity-80 z-0">
          <div className="w-3 h-3 rounded-full bg-[#E2FF00] shadow-[0_0_10px_rgba(226,255,0,0.4)] -mr-6" />
          <div className="w-8 h-8 rounded-full bg-[#E2FF00] shadow-[0_0_15px_rgba(226,255,0,0.6)] animate-pulse" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold text-white font-sora mb-6 tracking-tight leading-[1.15]"
          >
            Start <span className="text-[#E2FF00]">Planning Smarter</span>.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg md:text-xl font-sans max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
          >
            Get stunning custom itineraries, real-time pricing, and luxury experiences tailored for your journey.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link href="/plan">
              <Button size="lg" className="h-14 px-8 rounded-full bg-[#E2FF00] hover:bg-[#E2FF00]/90 text-black font-extrabold text-base shadow-[0_0_25px_rgba(226,255,0,0.3)] hover:scale-[1.02] active:scale-[0.99] border-none font-sora transition-all duration-300">
                Generate Itinerary
              </Button>
            </Link>

            <Link href="/contact">
              <Button size="lg" className="h-14 px-8 rounded-full bg-transparent border-2 border-[#E2FF00] hover:bg-[#E2FF00]/10 text-[#E2FF00] font-extrabold text-base hover:scale-[1.02] active:scale-[0.99] font-sora transition-all duration-300">
                Talk To Expert
              </Button>
            </Link>
            
            {/* Social Proof Avatars */}
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {avatars.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="Explorer"
                    className="w-10 h-10 rounded-full border-2 border-black object-cover"
                  />
                ))}
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#E2FF00] bg-black flex items-center justify-center -ml-3 z-10 shadow-lg">
                <span className="text-[10px] font-bold text-[#E2FF00] font-mono">20k+</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Yellow Marquee Banner */}
        <div className="w-full bg-[#E2FF00] py-4 overflow-hidden absolute bottom-0 left-0 right-0 border-t border-black z-20 flex items-center">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 18 }}
            className="flex gap-12 whitespace-nowrap text-black font-extrabold font-sora text-sm md:text-base tracking-wider uppercase"
          >
            {Array(4).fill([
              "✦ Luxury Stays",
              "✦ Flight Deals",
              "✦ Curated Itineraries",
              "✦ 24/7 Support",
              "✦ Smart Routing"
            ]).flat().map((text, i) => (
              <span key={i} className="flex items-center gap-2">
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
