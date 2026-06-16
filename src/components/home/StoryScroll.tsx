"use client";

import { useRef, useEffect, useState } from "react";
import { Sparkles, Map, Compass, MapPin, CreditCard, Heart } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stages = [
  { 
    title: "Dream", 
    icon: Sparkles, 
    desc: "Get inspired by curated global experiences and luxury retreats tailored to your unique interests.", 
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Plan", 
    icon: Map, 
    desc: "Our proprietary AI builds your custom itinerary using real-time flight and hotel data in seconds.", 
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Customize", 
    icon: Compass, 
    desc: "Tweak routes, swap hotels, and adjust activities with drag-and-drop simplicity.", 
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Explore", 
    icon: MapPin, 
    desc: "Discover local secret spots, curated dining recommendations, and exclusive off-the-beaten-path experiences.", 
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Book", 
    icon: CreditCard, 
    desc: "Secure flights, premium hotels, and local tours with a single seamless checkout.", 
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    title: "Experience", 
    icon: Heart, 
    desc: "Embark on a fully-managed trip with 24/7 on-the-road support and instant WhatsApp updates.", 
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop" 
  }
];

export function StoryScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia(containerRef);

      mm.add("(min-width: 768px)", () => {
        // Trigger active state change for each stage block as they scroll into view
        stages.forEach((_, index) => {
          ScrollTrigger.create({
            trigger: `#stage-trigger-${index}`,
            start: "top 45%",
            end: "bottom 45%",
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index),
          });
        });
      });

      // Refresh ScrollTrigger once everything mounts and loads to recompute positions
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => {
        mm.revert();
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <section ref={containerRef} className="relative bg-[#04060E] w-full min-h-screen text-white">
      
      {/* Title Header */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-32 pb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest block mb-3 font-sora">The Journey Blueprint</span>
          <h2 className="text-4xl md:text-6xl font-bold font-sora tracking-tight leading-[1.1]">
            How Tripvora Works.
          </h2>
        </div>
        <p className="text-white/40 max-w-sm text-sm font-sans mt-4 md:mt-0 leading-relaxed">
          From inspiration to your return home, our platform designs and handles every single aspect of your trip.
        </p>
      </div>

      {/* Grid Container */}
      <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row relative">
        
        {/* Left Visual Panel - Sticky on Desktop */}
        <div 
          ref={leftPanelRef}
          className="w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-10rem)] md:sticky md:top-24 flex items-center justify-center p-4 md:p-12 z-20 pointer-events-none"
        >
          <div className="w-full h-full max-h-[460px] relative border border-white/10 bg-slate-900/60 p-1.5 rounded-xl overflow-hidden shadow-2xl">
            {stages.map((stage, index) => (
              <div 
                key={index}
                className={`absolute inset-1.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  index === activeIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
                }`}
              >
                <img 
                  src={stage.image} 
                  alt={stage.title} 
                  className="w-full h-full object-cover rounded-lg brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04060E]/80 via-transparent to-transparent rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Stage Triggers & Information Scroll */}
        <div className="w-full md:w-1/2 flex flex-col px-4 md:px-12 z-10">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index === activeIndex;

            return (
              <div 
                key={index} 
                id={`stage-trigger-${index}`}
                className="min-h-[60vh] md:min-h-screen flex flex-col justify-center py-20 border-b border-white/5 last:border-b-0"
              >
                <div className={`transition-all duration-500 flex flex-col text-left ${isActive ? "opacity-100 translate-x-0" : "opacity-30 -translate-x-2"}`}>
                  
                  {/* Indicator Icon */}
                  <div className={`w-12 h-12 flex items-center justify-center border transition-all duration-500 rounded-md mb-6 ${
                    isActive ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-white/30"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 font-sora">
                    Stage 0{index + 1}
                  </span>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white font-sora tracking-tight mb-4">
                    {stage.title}
                  </h3>
                  
                  <p className="text-white/60 text-base font-sans max-w-md leading-relaxed">
                    {stage.desc}
                  </p>

                  <div className="mt-8 flex items-center gap-4">
                    <span className="h-[1px] w-8 bg-white/20" />
                    <span className="text-xs text-white/40 tracking-wider font-mono">0{index + 1} / 0{stages.length}</span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
