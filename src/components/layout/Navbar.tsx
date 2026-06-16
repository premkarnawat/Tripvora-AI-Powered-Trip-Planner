"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-300 ${isScrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/[0.08] py-3' : 'bg-transparent'}`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M2 22L12 2L22 22H2Z" fill="currentColor" fillOpacity="0.8"/>
            <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
          </svg>
          <Link href="/" className="text-xl md:text-2xl font-bold text-white tracking-tight font-sora">
            Tripvora
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {["Home", "Trips", "Experiences", "Hotels", "About Us"].map((item, i) => (
            <Link 
              key={item} 
              href="#" 
              className="relative text-sm font-medium text-white/80 hover:text-red-500 transition-colors group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-md px-6 shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all duration-300 shimmer border-none font-medium">
            Plan My Trip
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="lg:hidden text-white">
          <Menu className="w-6 h-6" />
        </Button>
      </div>
    </motion.header>
  );
}
