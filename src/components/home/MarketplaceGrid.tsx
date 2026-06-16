"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { Map, Tent, Navigation, Anchor } from "lucide-react";

const categories = [
  { name: "Luxury Resorts", icon: Map, color: "from-primary/20 to-primary/0" },
  { name: "Himalayan Treks", icon: Tent, color: "from-sky-500/20 to-sky-500/0" },
  { name: "Scuba Diving", icon: Anchor, color: "from-blue-500/20 to-blue-500/0" },
  { name: "Local Guides", icon: Navigation, color: "from-emerald-500/20 to-emerald-500/0" },
];

function TiltCard({ category }: { category: any }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    // Calculate rotation (-15 to 15 degrees)
    const rotateX = ((y / height) - 0.5) * -15;
    const rotateY = ((x / width) - 0.5) * 15;
    
    mouseX.set(rotateY);
    mouseY.set(rotateX);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      style={{
        rotateX: mouseY,
        rotateY: mouseX,
        transformPerspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative h-64 rounded-3xl p-6 flex flex-col justify-end bg-gradient-to-br ${category.color} bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer overflow-hidden group shadow-xl`}
    >
      <div className="absolute top-6 left-6 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5 group-hover:scale-110 transition-transform duration-300">
        <category.icon className="w-6 h-6 text-white" />
      </div>
      
      <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-xl font-bold text-white font-sora mb-1">{category.name}</h3>
        <p className="text-sm text-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore collection →</p>
      </div>

      {/* Glow effect that follows mouse - simulated by generic gradient here for simplicity */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}

export function MarketplaceGrid() {
  return (
    <section className="py-32 bg-[#0F172A] relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white font-sora mb-4"
          >
            The Ultimate Marketplace.
          </motion.h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Book everything in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <TiltCard category={category} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
