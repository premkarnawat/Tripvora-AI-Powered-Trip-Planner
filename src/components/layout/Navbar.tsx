"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, Heart, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSplashActive, setIsSplashActive] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("travixa_intro_seen");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!seen && !reducedMotion) {
        setIsSplashActive(true);
      }
    }

    const handleSplashComplete = () => {
      setIsSplashActive(false);
    };

    window.addEventListener("travixa_splash_complete", handleSplashComplete);

    const unsubscribeScroll = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });

    return () => {
      window.removeEventListener("travixa_splash_complete", handleSplashComplete);
      unsubscribeScroll();
    };
  }, [scrollY]);

  if (!mounted) {
    return null;
  }

  const isHiddenPage = pathname ? (
    pathname.startsWith("/login") || 
    pathname.startsWith("/signup") || 
    pathname.startsWith("/agency") || 
    pathname.startsWith("/admin") || 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/trips") || 
    pathname.startsWith("/trip-planner") ||
    pathname.startsWith("/saved-trips") ||
    pathname.startsWith("/bookmarks") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/help")
  ) : false;

  if (isHiddenPage) {
    return null;
  }

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isAuthed = localStorage.getItem("traveler_auth") === "true";
    if (isAuthed) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 transition-all duration-300 ${
        isScrolled 
          ? 'border-b border-white/[0.08] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
          : 'border-b border-white/5 py-4'
      }`}
      style={{ backgroundColor: "#04060E" }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* Official Travixa Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center transition-opacity hover:opacity-95">
            <Image 
              id="navbar-logo"
              src="/travixa-logo.png" 
              alt="Travixa" 
              width={150} 
              height={36} 
              className="h-8 w-auto object-contain sm:h-9 transition-opacity duration-300" 
              style={{ opacity: isSplashActive ? 0 : 1, mixBlendMode: "screen" }}
              priority 
            />
          </Link>
        </div>

        {/* Desktop Nav Links (Removed Concierge nav link) */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { name: "Marketplace", href: "/marketplace" },
            { name: "Destinations", href: "/destinations" },
            { name: "Journal", href: "/community" },
            { name: "Pricing", href: "/pricing" }
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


          {/* User Profile Avatar Link */}
          <div onClick={handleAvatarClick} className="w-9 h-9 rounded-full border border-white/10 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          <div onClick={handleAvatarClick} className="w-8 h-8 rounded-full border border-white/10 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
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
            { name: "Journal", href: "/community" },
            { name: "Pricing", href: "/pricing" }
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
        </motion.div>
      )}
    </motion.header>
  );
}
