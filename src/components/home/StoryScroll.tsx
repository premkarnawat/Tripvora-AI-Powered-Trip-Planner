"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Map, Plane, Compass, Sparkles } from "lucide-react";

const steps = [
  { title: "Dream", icon: Sparkles, desc: "Get inspired by curated global experiences." },
  { title: "Plan", icon: Map, desc: "AI builds your personalized itinerary instantly." },
  { title: "Customize", icon: Compass, desc: "Tweak hotels, flights, and activities easily." },
  { title: "Book", icon: Plane, desc: "Secure everything with one seamless checkout." },
];

export function StoryScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section ref={containerRef} className="py-40 bg-[#0F172A] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white font-sora mb-6"
          >
            How Tripvora Works
          </motion.h2>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-secondary"
              style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {steps.map((step, index) => {
              // Custom transforms for each step to create a staggered entry based on scroll
              const y = useTransform(
                scrollYProgress, 
                [Math.max(0, (index - 1) * 0.25), index * 0.25], 
                [50, 0]
              );
              const opacity = useTransform(
                scrollYProgress, 
                [Math.max(0, (index - 1) * 0.25), index * 0.25], 
                [0.2, 1]
              );

              return (
                <motion.div 
                  key={index}
                  style={{ y, opacity }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-20 h-20 rounded-full bg-[#0F172A] border-4 border-[#0F172A] shadow-[0_0_0_2px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_0_2px_#14B8A6] flex items-center justify-center mb-6 transition-all duration-500 relative z-10">
                    <step.icon className="w-8 h-8 text-white/50 group-hover:text-primary transition-colors duration-500" />
                    
                    {/* Active Glow */}
                    <motion.div 
                      className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10"
                      style={{ opacity }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-sora mb-3">{step.title}</h3>
                  <p className="text-white/50 text-sm max-w-[200px]">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
