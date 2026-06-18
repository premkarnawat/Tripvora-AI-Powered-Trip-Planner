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
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  if (!mounted) {
    return null;
  }

  const isAuthPage = pathname ? (pathname.startsWith("/login") || pathname.startsWith("/signup")) : false;
  if (isAuthPage) {
    return null;
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#04060E]/98 backdrop-blur-2xl border-b border-white/[0.08] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-[#04060E]/95 backdrop-blur-xl border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* Logo and brand name (Always visible, white text with premium teal icon) */}
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 22L12 2L22 22H2Z" fill="#14B8A6" fillOpacity="0.8"/>
            <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
          </svg>
          <Link 
            href="/" 
            className="text-xl font-bold tracking-tight font-sora text-white hover:text-white/95 transition-colors"
          >
            TripPilot
          </Link>
        </div>

        {/* Desktop Nav Links (Removed Concierge nav link) */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { name: "Marketplace", href: "/marketplace" },
            { name: "Destinations", href: "/destinations" },
            { name: "Journal", href: "/community" }
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`relative text-sm font-semibold transition-colors group ${
                  isActive ? 'text-[#E2FF00]' : 'text-white/80 hover:text-[#E2FF00]'
                }`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E2FF00] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-5">
          <button className="text-white/70 hover:text-white hover:scale-105 transition-all">
            <Heart className="w-5 h-5" />
          </button>
          
          <button className="relative text-white/70 hover:text-white hover:scale-105 transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#04060E]"></span>
          </button>

          <Link href="/plan">
            <Button 
              className="rounded-full px-6 h-10 font-bold transition-all duration-300 border-none bg-[#E2FF00] hover:bg-[#E2FF00]/90 text-black shadow-[0_0_15px_rgba(226,255,0,0.3)] hover:scale-[1.02]"
            >
              Plan Trip
            </Button>
          </Link>

          {/* User Profile Avatar Link */}
          <Link href="/dashboard">
            <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
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
          <Link href="/dashboard">
            <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/5" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-[#04060E]/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 lg:hidden shadow-2xl"
        >
          {[
            { name: "Marketplace", href: "/marketplace" },
            { name: "Destinations", href: "/destinations" },
            { name: "Journal", href: "/community" }
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/80 hover:text-[#E2FF00] font-semibold text-lg py-2 border-b border-white/5"
            >
              {item.name}
            </Link>
          ))}
          <Link href="/plan" onClick={() => setIsMobileMenuOpen(false)} className="mt-2">
            <Button className="w-full h-12 font-bold bg-[#E2FF00] text-black hover:bg-[#E2FF00]/90">
              Plan Trip
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}
