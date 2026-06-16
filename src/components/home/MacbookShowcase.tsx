"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function MacbookShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <section ref={containerRef} className="py-32 bg-[#0F172A] relative overflow-hidden flex flex-col items-center perspective-1000">
      
      <div className="text-center mb-16 z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white font-sora mb-4"
        >
          Interactive Itineraries.
        </motion.h2>
        <p className="text-white/50 text-lg">Every detail planned, beautifully visualized.</p>
      </div>

      <motion.div 
        style={{ rotateX, scale, y }}
        className="w-[90%] max-w-5xl aspect-video bg-[#1e293b] rounded-t-3xl border-[16px] border-[#0f172a] shadow-[0_-20px_60px_rgba(20,184,166,0.15)] relative overflow-hidden"
      >
        {/* Mock Screen Content - Map and Timeline */}
        <div className="absolute inset-0 bg-[#0F172A] p-8 flex gap-8">
          
          {/* Timeline Sidebar */}
          <div className="w-1/3 h-full border-r border-white/10 flex flex-col gap-6 relative">
             <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-white/10" />
             
             {/* Animated drawing line */}
             <motion.div 
                className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-secondary origin-top"
                style={{ scaleY: useTransform(scrollYProgress, [0.3, 0.7], [0, 1]) }}
             />

             {[1, 2, 3].map((day) => (
                <div key={day} className="relative pl-10">
                  <motion.div 
                    className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0F172A] border-2 border-primary z-10"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: day * 0.2 }}
                  />
                  <h4 className="text-white font-bold mb-2">Day {day}</h4>
                  <div className="h-16 rounded-xl bg-white/5 border border-white/10 w-full mb-2 animate-pulse" />
                  <div className="h-12 rounded-xl bg-white/5 border border-white/10 w-3/4 animate-pulse" />
                </div>
             ))}
          </div>

          {/* Map Area */}
          <div className="flex-1 rounded-2xl bg-slate-800/50 border border-white/5 relative overflow-hidden">
             {/* Simulated map graphic */}
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 to-transparent" />
             <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <motion.path 
                 d="M 20 80 Q 50 20 80 50" 
                 fill="none" 
                 stroke="#38BDF8" 
                 strokeWidth="0.5" 
                 strokeDasharray="1 1"
                 style={{ pathLength: useTransform(scrollYProgress, [0.3, 0.7], [0, 1]) }}
               />
               <circle cx="20" cy="80" r="1.5" fill="#14B8A6" />
               <circle cx="80" cy="50" r="1.5" fill="#14B8A6" />
             </svg>
          </div>

        </div>

        {/* Screen Glare Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
      </motion.div>
      
      {/* Laptop Base Mockup */}
      <motion.div 
        style={{ scale, y: useTransform(scrollYProgress, [0, 0.5], [100, 0]) }}
        className="w-[95%] max-w-[1100px] h-4 bg-gradient-to-b from-[#334155] to-[#1e293b] rounded-b-3xl shadow-2xl relative z-20"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-[#0f172a] rounded-b-md" />
      </motion.div>
    </section>
  );
}
