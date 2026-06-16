"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const destinations = [
  { name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop" },
  { name: "Kashmir, India", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1000&auto=format&fit=crop" },
  { name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1000&auto=format&fit=crop" },
  { name: "Swiss Alps", image: "https://images.unsplash.com/photo-1531366936310-6cb1c82806cc?q=80&w=1000&auto=format&fit=crop" },
];

export function Destinations() {
  return (
    <section className="py-32 bg-[#04060E] relative border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white font-sora mb-4"
            >
              Curated Destinations.
            </motion.h2>
            <p className="text-white/50 text-lg max-w-xl">
              Handpicked premium experiences verified by our experts.
            </p>
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-md w-fit bg-transparent font-sora text-sm">
            View All Destinations
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative h-[450px] rounded-xl overflow-hidden cursor-pointer border border-white/5"
            >
              <div className="absolute inset-0 bg-black">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              </div>
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-85" />
 
              {/* Hover Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <h3 className="text-2xl font-bold text-white font-sora mb-2">{dest.name}</h3>
                  <div className="flex items-center gap-3 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span className="text-sm font-semibold text-primary font-sans">50+ Experiences</span>
                    <span className="text-white/20">|</span>
                    <span className="text-sm font-medium text-white/70 font-sans">From ₹95,000</span>
                  </div>
                  <Button className="w-full bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-500 delay-140 font-sora">
                    Explore
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
