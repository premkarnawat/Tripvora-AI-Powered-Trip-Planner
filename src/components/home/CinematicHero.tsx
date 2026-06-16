"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GlassSearchCard } from "./GlassSearchCard";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "./ErrorBoundary";

const AuroraCanvas = dynamic(() => import("./AuroraCanvas"), { ssr: false });

export function CinematicHero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <div className="relative min-h-[100dvh] md:min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0F172A]">
      
      {/* LAYER 1-3: Environment (Parallax Video Background) */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="object-cover object-center w-full h-full scale-[1.05]"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-panorama-of-a-landscape-with-mountains-and-a-lake-4249-large.mp4" type="video/mp4" />
        </video>
        {/* Gradients to enforce true Navy Blue and high readability */}
        <div className="absolute inset-0 bg-[#0F172A]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/30 to-[#0F172A]/50" />
      </motion.div>

      {/* LAYER 8: Aurora Shader (React Three Fiber) */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-60 mix-blend-screen">
        <ErrorBoundary>
          <AuroraCanvas />
        </ErrorBoundary>
      </div>

      {/* LAYER 4-5: Atmosphere (Particles) */}
      {init && (
        <div className="absolute inset-0 z-[2] pointer-events-none opacity-40">
          <ErrorBoundary>
            <Particles
              id="tsparticles"
            options={{
              fpsLimit: 60,
              particles: {
                color: { value: "#14B8A6" },
                move: { enable: true, direction: "none", outModes: { default: "out" }, random: true, speed: 0.5, straight: false },
                number: { density: { enable: true, width: 800 }, value: 50 },
                opacity: { value: { min: 0.1, max: 0.3 } },
                size: { value: { min: 1, max: 3 } },
              },
              detectRetina: true,
            }}
          />
          </ErrorBoundary>
        </div>
      )}

      {/* LAYER 6: Animated Flight Routes */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-60 hidden md:block">
        <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          {/* Mumbai to Bali */}
          <motion.path 
            d="M 200 700 Q 500 300 800 600" 
            fill="none" 
            stroke="url(#gradient1)" 
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          
          {/* Floating Destination Pins */}
          <motion.circle cx="800" cy="600" r="4" fill="#38BDF8" 
            animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>

      {/* LAYER 7 & CONTENT */}
      <motion.div 
        style={{ opacity, y: y2 }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-32 pb-20 flex flex-col items-center text-center mt-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.5)] mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span className="text-xs font-semibold text-white/90 tracking-widest uppercase font-sora">AI Powered Travel Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[84px] font-extrabold text-white mb-6 font-sora tracking-tighter leading-[1.05]"
        >
          Plan Your Perfect Trip<br/>
          In Minutes, <span className="text-gradient">Not Hours.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed mb-12"
        >
          AI creates personalized itineraries, finds flights, hotels, experiences, and helps you travel smarter.
        </motion.p>

        {/* Backdrop Blur 20px Glass Search Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl mx-auto relative group"
        >
          <div className="absolute -inset-[1px] bg-gradient-to-r from-white/15 to-white/5 rounded-xl opacity-100 transition duration-500"></div>
          <div className="backdrop-blur-[20px] relative z-10">
            <GlassSearchCard />
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  );
}
