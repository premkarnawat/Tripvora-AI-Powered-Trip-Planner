"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { GlassSearchCard } from "./GlassSearchCard";

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="relative min-h-[100dvh] md:min-h-screen w-full flex items-center justify-center overflow-hidden">
      
      {/* Layer 1: 4K Video Background (Simulated with high-quality MP4) */}
      <motion.div style={{ y }} className="absolute inset-0 z-0 w-full h-full">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="object-cover w-full h-full scale-105"
        >
          {/* Using a premium high-quality nature video link */}
          <source src="https://cdn.pixabay.com/video/2020/02/16/32338-392576140_large.mp4" type="video/mp4" />
        </video>
        
        {/* Layer 2: Gradient Overlays for Navy Theme Blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 via-transparent to-[#0F172A]/80" />
      </motion.div>

      {/* Layer 6: Animated SVG Flight Routes */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-50 hidden md:block">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          {/* Route 1 */}
          <motion.path 
            d="M 200 800 Q 400 400 800 200" 
            fill="none" 
            stroke="#14B8A6" 
            strokeWidth="1.5"
            strokeDasharray="5 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          {/* Route 2 */}
          <motion.path 
            d="M 100 300 Q 500 100 900 400" 
            fill="none" 
            stroke="#38BDF8" 
            strokeWidth="1.5"
            strokeDasharray="5 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.3, 0] }}
            transition={{ duration: 8, delay: 2, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Content Layer */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-32 pb-20 flex flex-col items-center text-center mt-10 md:mt-20"
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 shadow-[0_0_20px_rgba(20,184,166,0.15)] mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-white/90 tracking-wide uppercase text-xs">AI Powered Travel Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 font-sora tracking-tighter leading-[1.05]"
        >
          Plan Your Perfect Trip<br/>
          In Minutes, <span className="text-gradient">Not Hours.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed mb-12"
        >
          AI creates personalized itineraries, finds flights, hotels, experiences, and helps you travel smarter with unparalleled luxury.
        </motion.p>

        {/* Glassmorphism Interactive Search Component */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <GlassSearchCard />
        </motion.div>
        
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/40 uppercase tracking-widest">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent">
          <motion.div 
            animate={{ y: [0, 48, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-4 bg-primary shadow-[0_0_8px_#14B8A6]"
          />
        </div>
      </motion.div>
    </div>
  );
}
