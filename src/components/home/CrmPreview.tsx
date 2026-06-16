"use client";

import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import { useRef } from "react";
import { LineChart, Users, DollarSign, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CrmPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-[#04060E] relative overflow-hidden border-t border-white/5">
      
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 mb-8"
            >
              <span className="text-xs font-bold text-primary uppercase tracking-widest font-sora">Travel Business OS</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white font-sora mb-6 leading-tight"
            >
              Run Your Entire<br/>
              Travel Business.
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-light"
            >
              Tripvora isn't just for travelers. It's a powerful SaaS CRM for travel agencies to manage leads, build AI packages, and automate WhatsApp interactions.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button size="lg" className="h-14 px-8 bg-white text-black hover:bg-white/95 rounded-md font-bold text-base shadow-lg transition-transform duration-300 hover:scale-[1.01]">
                Book Agency Demo
              </Button>
            </motion.div>
          </div>

          {/* Right SaaS Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
            style={{ perspective: "1000px" }}
          >
            <div className="relative rounded-xl p-8 border border-white/[0.08] shadow-2xl bg-black/95 backdrop-blur-2xl">
              
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1 font-sora tracking-tight">Agency Overview</h3>
                  <p className="text-sm text-white/40">Real-time performance metrics</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <StatBox icon={Users} label="Total Leads" value={2459} prefix="" suffix="" inView={isInView} />
                <StatBox icon={DollarSign} label="Revenue" value={12.4} prefix="₹" suffix="L" inView={isInView} decimals={1} />
                <StatBox icon={LineChart} label="Conversion" value={34.2} prefix="" suffix="%" inView={isInView} decimals={1} />
                <StatBox icon={CalendarDays} label="Bookings" value={182} prefix="" suffix="" inView={isInView} />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function StatBox({ icon: Icon, label, value, prefix, suffix, inView, decimals = 0 }: any) {
  return (
    <div className="p-5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300">
      <Icon className="w-5 h-5 text-primary mb-4" />
      <div className="text-3xl font-bold text-white font-sora mb-1 tracking-tight">
        {prefix}
        {inView ? <CountUp end={value} decimals={decimals} duration={2.5} /> : "0"}
        {suffix}
      </div>
      <div className="text-sm text-white/50">{label}</div>
    </div>
  );
}
