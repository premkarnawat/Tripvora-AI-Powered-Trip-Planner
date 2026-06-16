"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Bot, Plane, Hotel, Map, Check } from "lucide-react";

export function AiDemo() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isInView) {
      const sequence = async () => {
        setStep(1); // User types
        await new Promise(r => setTimeout(r, 1500));
        setStep(2); // AI thinking
        await new Promise(r => setTimeout(r, 1000));
        setStep(3); // Finding flights
        await new Promise(r => setTimeout(r, 800));
        setStep(4); // Finding hotels
        await new Promise(r => setTimeout(r, 800));
        setStep(5); // Building itinerary
        await new Promise(r => setTimeout(r, 1000));
        setStep(6); // Done
      };
      sequence();
    }
  }, [isInView]);

  return (
    <section 
      ref={containerRef} 
      className="py-32 relative bg-[#04060E] overflow-hidden border-t border-white/5"
      style={{
        background: `
          radial-gradient(at 0% 0%, rgba(253, 224, 71, 0.35) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(239, 68, 68, 0.35) 0px, transparent 50%),
          radial-gradient(at 50% 50%, rgba(236, 72, 153, 0.25) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.35) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.35) 0px, transparent 50%),
          #04060E
        `
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white font-sora mb-4"
          >
            Watch the AI Magic.
          </motion.h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Our proprietary engine scans millions of data points in real-time.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-xl p-6 md:p-10 border border-white/[0.08] shadow-2xl relative overflow-hidden bg-black/95 backdrop-blur-md">
          
          {/* User Input Bubble */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={step >= 1 ? { opacity: 1, scale: 1, x: 0 } : {}}
            className="flex justify-end mb-8"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-lg px-6 py-4 border border-white/10 text-white shadow-lg">
              <p className="font-semibold font-sans">Plan a luxury trip to Bali for 5 days under ₹1,50,000</p>
            </div>
          </motion.div>

          {/* AI Processing Bubble */}
          <div className="flex justify-start">
            <div className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center mr-4 shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex flex-col gap-3 w-full max-w-lg">
              {step >= 2 && (
                <StepItem icon={Bot} text="Analyzing preferences..." delay={0} />
              )}
              {step >= 3 && (
                <StepItem icon={Plane} text="Scanning 400+ airlines for best routes..." delay={0.1} />
              )}
              {step >= 4 && (
                <StepItem icon={Hotel} text="Finding luxury villas matching budget..." delay={0.1} />
              )}
              {step >= 5 && (
                <StepItem icon={Map} text="Crafting day-by-day itinerary..." delay={0.1} />
              )}
              {step >= 6 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-5 rounded-lg bg-white/5 border border-white/10 text-white"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4.5 h-4.5 text-white" />
                    <span className="font-bold text-white font-sora text-sm tracking-wide">Trip Generated!</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed font-sans">
                    I've crafted a 5-day luxury itinerary in Bali, complete with direct flights and a 5-star oceanfront villa, staying exactly within your ₹1,50,000 budget.
                  </p>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function StepItem({ icon: Icon, text, delay }: { icon: any, text: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3"
    >
      <Icon className="w-4 h-4 text-white" />
      <span className="text-sm text-white font-medium">{text}</span>
    </motion.div>
  );
}
