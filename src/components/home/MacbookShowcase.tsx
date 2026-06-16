"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const itineraryData = [
  {
    day: 1,
    title: "Arrival & Uluwatu Sunset",
    hotel: "Aman Villas, Nusa Dua",
    details: "SQ942 Business Class arrival. Private chauffeur transfer. Sunset cliffside temple tour.",
  },
  {
    day: 2,
    title: "Seminyak Beach & Spa",
    hotel: "Potato Head VIP Club",
    details: "Premium beachfront daybeds. 90-minute signature therapeutic massage.",
  },
  {
    day: 3,
    title: "Ubud Valley Terraces",
    hotel: "Amandari Valley Suites",
    details: "Sunrise rice terrace trek. Sacred temple tours. Valley-view pool suite check-in.",
  }
];

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
    <section ref={containerRef} className="py-32 bg-[#04060E] relative overflow-hidden flex flex-col items-center perspective-1000">
      
      <div className="text-center mb-16 z-10">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-3 font-sora">Visualized Journeys</span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white font-sora mb-4 tracking-tight"
        >
          Interactive Itineraries.
        </motion.h2>
        <p className="text-white/50 text-base font-sans">Every single detail plotted out, beautifully visualized.</p>
      </div>

      <motion.div 
        style={{ rotateX, scale, y }}
        className="w-[90%] max-w-5xl aspect-video bg-[#121824] rounded-t-3xl border-[16px] border-[#04060E] shadow-[0_-20px_60px_rgba(20,184,166,0.1)] relative overflow-hidden"
      >
        {/* Mock Screen Content - Map and Timeline */}
        <div className="absolute inset-0 bg-[#04060E] p-8 flex gap-8">
          
          {/* Timeline Sidebar */}
          <div className="w-1/3 h-full border-r border-white/10 flex flex-col gap-6 relative">
             <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-white/5" />
             
             {/* Animated drawing line */}
             <motion.div 
                className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-secondary origin-top"
                style={{ scaleY: useTransform(scrollYProgress, [0.3, 0.7], [0, 1]) }}
             />

             {itineraryData.map((item, index) => {
                const day = item.day;
                return (
                  <div key={day} className="relative pl-7 text-left">
                    <motion.div 
                      className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#04060E] border-2 border-primary z-10"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: index * 0.2 }}
                    />
                    <h4 className="text-white font-bold font-sora text-xs mb-0.5">Day {day}: {item.title}</h4>
                    <span className="text-primary text-[9px] font-bold tracking-widest uppercase block mb-1 font-sora">{item.hotel}</span>
                    <p className="text-white/40 text-[9px] font-sans leading-relaxed line-clamp-2">{item.details}</p>
                  </div>
                );
             })}
          </div>

          {/* Map & Booking Detail Area */}
          <div className="flex-1 rounded-lg bg-slate-900/40 border border-white/5 relative overflow-hidden flex flex-col p-5 gap-4">
             {/* Simulated map graphic in background */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 to-transparent pointer-events-none" />
             <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
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

             {/* Top Stay Card */}
             <div className="relative z-10 flex gap-4 bg-[#04060E]/85 border border-white/10 p-3 rounded-lg text-left shadow-lg">
               <img 
                 src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=200&auto=format&fit=crop" 
                 alt="Aman Villas" 
                 className="w-20 h-20 object-cover rounded-md border border-white/5 shrink-0"
               />
               <div className="flex flex-col justify-center">
                 <span className="text-[8px] font-bold text-primary tracking-widest uppercase mb-0.5 font-sora">Stay Selected</span>
                 <h5 className="text-white font-bold text-xs font-sora mb-0.5">Aman Villas, Nusa Dua</h5>
                 <p className="text-white/40 text-[9px] leading-relaxed mb-1 font-sans">Complimentary private driver & daily spa therapy.</p>
                 <div className="flex items-center gap-2">
                   <span className="text-[9px] font-semibold text-white/80 font-sans">₹1,42,000 / night</span>
                   <span className="text-[9px] text-white/30">|</span>
                   <span className="text-[9px] text-yellow-400 font-bold">★ 5.0</span>
                 </div>
               </div>
             </div>

             {/* Bottom Flight & Activity split cards */}
             <div className="relative z-10 grid grid-cols-2 gap-4">
               {/* Flight Ticket */}
               <div className="bg-[#04060E]/85 border border-white/10 p-3 rounded-lg text-left shadow-lg flex flex-col justify-between h-24">
                 <div className="flex justify-between items-start">
                   <div>
                     <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest block font-sora">Flight Info</span>
                     <h6 className="text-white font-bold text-xs font-sora mt-0.5">SQ 942</h6>
                   </div>
                   <span className="text-[8px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-mono font-bold">BUSINESS</span>
                 </div>
                 <div className="flex justify-between items-center text-center mt-2">
                   <div className="text-left">
                     <span className="text-[10px] font-extrabold text-white font-mono">SIN</span>
                     <span className="text-[8px] text-white/40 block font-sans">Singapore</span>
                   </div>
                   <span className="text-[10px] text-white/20 font-mono">&rarr;</span>
                   <div className="text-right">
                     <span className="text-[10px] font-extrabold text-white font-mono">DPS</span>
                     <span className="text-[8px] text-white/40 block font-sans">Bali</span>
                   </div>
                 </div>
               </div>

               {/* Sunset Tour Card */}
               <div className="bg-[#04060E]/85 border border-white/10 p-3 rounded-lg text-left shadow-lg flex gap-3 items-center h-24">
                 <img 
                   src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=120&auto=format&fit=crop" 
                   alt="Uluwatu Sunset" 
                   className="w-12 h-12 object-cover rounded border border-white/5 shrink-0"
                 />
                 <div className="flex flex-col justify-center text-left">
                   <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest block font-sora">Day 1 Tour</span>
                   <h6 className="text-white font-bold text-[9px] font-sora mt-0.5 line-clamp-1">Uluwatu Sunset & Kecak</h6>
                   <span className="text-[8px] text-primary font-semibold mt-0.5 font-sans">VIP Reserved Seats</span>
                 </div>
               </div>
             </div>

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-[#04060E] rounded-b-md" />
      </motion.div>
    </section>
  );
}
