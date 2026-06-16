"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { Map, Tent, Navigation, Anchor } from "lucide-react";

const categories = [
  { name: "Luxury Resorts", icon: Map, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800&auto=format&fit=crop" },
  { name: "Himalayan Treks", icon: Tent, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop" },
  { name: "Scuba Diving", icon: Anchor, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop" },
  { name: "Local Guides", icon: Navigation, image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop" },
];

function TiltCard({ category }: { category: any }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    // Calculate rotation (-10 to 10 degrees for a tighter premium feel)
    const rotateX = ((y / height) - 0.5) * -10;
    const rotateY = ((x / width) - 0.5) * 10;
    
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
      className="relative h-64 rounded-xl flex flex-col justify-end bg-[#0F172A] border border-white/10 hover:border-white/20 transition-colors cursor-pointer overflow-hidden group shadow-2xl"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={category.image} 
          alt={category.name} 
          className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-700"
        />
        {/* Navy Blue overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent z-10" />
      </div>

      <div className="absolute top-6 left-6 p-2.5 rounded-md bg-[#0F172A]/80 backdrop-blur-md border border-white/10 group-hover:scale-105 transition-transform duration-300 z-20">
        <category.icon className="w-5 h-5 text-white" />
      </div>
      
      <div className="relative z-20 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out text-left">
        <h3 className="text-xl font-bold text-white font-sora mb-1 tracking-tight">{category.name}</h3>
        <p className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 font-sans">
          Explore Collection &rarr;
        </p>
      </div>

      {/* Border border lighting effect */}
      <div className="absolute inset-0 border border-white/5 group-hover:border-primary/30 rounded-xl transition-colors duration-500 pointer-events-none z-30" />
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
