"use client";

import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, Heart, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  // Determine if we are on a light-themed page (subpages) or dark landing page
  const isLightPage = pathname !== "/";

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-300 ${
        isScrolled 
          ? isLightPage 
            ? 'bg-white/90 backdrop-blur-xl border-b border-black/[0.06] py-3' 
            : 'bg-black/90 backdrop-blur-xl border-b border-white/[0.08] py-3'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isLightPage ? "text-black" : "text-[#E2FF00]"}>
            <path d="M2 22L12 2L22 22H2Z" fill="currentColor" fillOpacity="0.8"/>
            <path d="M12 2L2 22H12V2Z" fill={isLightPage ? "#0F172A" : "#38BDF8"}/>
          </svg>
          <Link 
            href="/" 
            className={`text-xl font-bold tracking-tight font-sora transition-colors ${
              isLightPage ? 'text-black' : 'text-white'
            }`}
          >
            TripPilot
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { name: "Marketplace", href: "/marketplace" },
            { name: "Destinations", href: "/destinations" },
            { name: "Concierge", href: "/plan" },
            { name: "Journal", href: "/community" }
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`relative text-sm font-semibold transition-colors group ${
                  isLightPage 
                    ? isActive ? 'text-black font-bold' : 'text-black/60 hover:text-black' 
                    : isActive ? 'text-[#E2FF00]' : 'text-white/80 hover:text-[#E2FF00]'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  isLightPage ? 'bg-black' : 'bg-[#E2FF00]'
                }`}></span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-5">
          <button 
            className={`hover:scale-105 transition-transform ${
              isLightPage ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white"
            }`}
          >
            <Heart className="w-5 h-5" />
          </button>
          
          <button 
            className={`relative hover:scale-105 transition-transform ${
              isLightPage ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <Link href="/plan">
            <Button 
              className={`rounded-full px-6 h-10 font-bold transition-all duration-300 border-none ${
                isLightPage 
                  ? 'bg-black text-white hover:bg-black/80 shadow-[0_4px_12px_rgba(0,0,0,0.15)]' 
                  : 'bg-[#E2FF00] hover:bg-[#E2FF00]/90 text-black shadow-[0_0_15px_rgba(226,255,0,0.3)]'
              }`}
            >
              Plan Trip
            </Button>
          </Link>

          {/* User Profile Avatar Link */}
          <Link href="/login">
            <div className="w-9 h-9 rounded-full border border-black/10 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          <Link href="/login">
            <div className="w-8 h-8 rounded-full border border-black/10 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <Button variant="ghost" size="icon" className={isLightPage ? "text-black" : "text-white"}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
