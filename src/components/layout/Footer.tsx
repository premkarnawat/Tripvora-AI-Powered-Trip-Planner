"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#04060E] border-t border-white/5 py-20 z-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M2 22L12 2L22 22H2Z" fill="currentColor" fillOpacity="0.8"/>
                <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
              </svg>
              <span className="text-lg font-bold text-white tracking-tight font-sora">
                Tripvora
              </span>
            </div>
            <p className="text-white/40 text-sm font-sans mb-6 max-w-xs leading-relaxed">
              Plan, customize, and book your next luxury travel adventure with the world's most advanced AI travel intelligence platform.
            </p>
            <span className="text-white/20 text-xs font-mono">
              &copy; {new Date().getFullYear()} Tripvora Inc. All rights reserved.
            </span>
          </div>

          {/* Product Links */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-sora text-sm font-semibold tracking-wider uppercase mb-6">Product</h4>
            <div className="flex flex-col gap-3">
              {["AI Itinerary Planner", "Luxury Stays", "Verified Experiences", "Agency OS CRM", "WhatsApp Concierge"].map((item) => (
                <Link key={item} href="#" className="text-white/50 hover:text-primary transition-colors text-sm font-sans">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-sora text-sm font-semibold tracking-wider uppercase mb-6">Company</h4>
            <div className="flex flex-col gap-3">
              {["About Us", "Curated Guides", "Affiliate Program", "Privacy Policy", "Terms of Service"].map((item) => (
                <Link key={item} href="#" className="text-white/50 hover:text-primary transition-colors text-sm font-sans">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-sora text-sm font-semibold tracking-wider uppercase mb-6">Stay Inspired</h4>
            <p className="text-white/40 text-sm font-sans mb-6 leading-relaxed">
              Get handpicked travel inspiration, custom deals, and product updates delivered weekly.
            </p>
            <div className="flex items-center gap-2">
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="flex-1 h-11 px-4 rounded-md bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors font-sans"
              />
              <Button size="icon" className="h-11 w-11 rounded-md bg-primary hover:bg-primary/95 text-white shrink-0 border-none">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
