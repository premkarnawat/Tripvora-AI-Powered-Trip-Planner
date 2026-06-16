"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, ArrowRight, BrainCircuit, Map, Tag, HeadphonesIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(intervalId);
    }, 150);
    return () => clearInterval(intervalId);
  }, [text]);

  return <span className="text-gradient font-bold">{displayedText}<span className="animate-pulse">|</span></span>;
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0F172A] overflow-hidden selection:bg-primary/30">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero_bg.png" 
          alt="Mountain Landscape" 
          fill 
          priority
          className="object-cover object-center opacity-80"
        />
        {/* Gradients to blend image into the dark theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-transparent to-transparent opacity-80" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pt-32 md:pt-48 pb-20 min-h-screen flex flex-col justify-between">
        
        <div className="max-w-3xl">
          {/* Animated Chip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/80">AI Powered Trip Planner</span>
          </motion.div>
          
          {/* Main Heading with Typewriter */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 font-sora tracking-tight leading-[1.1]"
          >
            Plan Smarter Trips<br/>
            With <TypewriterText text="AI." />
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-xl text-white/70 mb-10 max-w-xl font-light leading-relaxed"
          >
            Discover amazing places, create personalized itineraries, book experiences and make your journey unforgettable.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-md text-base font-semibold group shimmer border-none">
              Start Planning Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="lg" className="h-14 px-8 border-white/20 text-white hover:bg-white/5 hover:text-white rounded-md text-base font-medium group bg-transparent backdrop-blur-sm">
              <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/40 mr-3 group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 fill-white" />
              </span>
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Feature Cards Bottom Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
              className="p-6 rounded-2xl bg-[#0F172A]/60 backdrop-blur-xl border border-white/5 flex items-start gap-4 transition-all duration-300 group cursor-pointer"
            >
              <div className="p-3 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors border border-white/10 group-hover:border-primary/30">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 text-sm md:text-base">{feature.title}</h3>
                <p className="text-white/50 text-xs md:text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating Animated Graphic element (Right side connected line effect) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="hidden lg:block absolute right-[15%] top-[35%] pointer-events-none"
      >
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md border border-primary/30"
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          {/* Dashed Line SVG connecting to background */}
          <svg className="absolute top-1/2 right-full w-64 h-32 -translate-y-1/2 opacity-30" viewBox="0 0 200 100" fill="none">
            <path d="M 200 50 Q 150 50 100 80 T 0 90" stroke="#14B8A6" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

const features = [
  {
    icon: BrainCircuit,
    title: "AI Trip Planner",
    desc: "Smart itineraries in seconds"
  },
  {
    icon: Map,
    title: "Curated Experiences",
    desc: "Handpicked activities and adventures"
  },
  {
    icon: Tag,
    title: "Best Prices",
    desc: "Compare and get the best deals"
  },
  {
    icon: HeadphonesIcon,
    title: "24x7 Support",
    desc: "We're here for you anytime"
  }
];
