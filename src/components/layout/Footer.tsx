"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Send, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#04060E] border-t border-white/5 py-20 z-20 text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#14B8A6]">
                <path d="M2 22L12 2L22 22H2Z" fill="currentColor" fillOpacity="0.8"/>
                <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
              </svg>
              <span className="text-lg font-bold text-white tracking-tight font-sora">
                TripPilot
              </span>
            </div>
            <p className="text-white/40 text-xs font-semibold mb-6 max-w-xs leading-relaxed">
              Plan, customize, and book your next luxury travel adventure with the world's most advanced AI travel intelligence ecosystem.
            </p>
            <span className="text-white/20 text-[10px] font-bold">
              &copy; {new Date().getFullYear()} TripPilot Inc. All rights reserved.
            </span>
          </div>

          {/* Product Links */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-sora text-xs font-black tracking-widest uppercase mb-6">Product</h4>
            <div className="flex flex-col gap-3">
              {[
                { name: "Destinations", href: "/destinations" },
                { name: "Marketplace", href: "/marketplace" },
                { name: "Community", href: "/community" },
                { name: "Pricing", href: "/pricing" }
              ].map((item) => (
                <Link key={item.name} href={item.href} className="text-white/50 hover:text-[#14B8A6] transition-colors text-xs font-bold">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Business Links */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-sora text-xs font-black tracking-widest uppercase mb-6">Business</h4>
            <div className="flex flex-col gap-3">
              {[
                { name: "For Agencies", href: "/agencies" },
                { name: "Advertise", href: "/marketplace" },
                { name: "Partner With Us", href: "/agencies#pricing" },
                { name: "Affiliate Program", href: "/pricing" }
              ].map((item) => (
                <Link key={item.name} href={item.href} className="text-white/50 hover:text-[#14B8A6] transition-colors text-xs font-bold">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-sora text-xs font-black tracking-widest uppercase mb-6">Resources</h4>
            <div className="flex flex-col gap-3">
              {[
                { name: "Blog", href: "/resources" },
                { name: "Travel Guides", href: "/resources" },
                { name: "Help Center", href: "/resources" }
              ].map((item) => (
                <Link key={item.name} href={item.href} className="text-white/50 hover:text-[#14B8A6] transition-colors text-xs font-bold">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-sora text-xs font-black tracking-widest uppercase mb-6">Legal</h4>
            <div className="flex flex-col gap-3">
              {[
                { name: "Privacy", href: "/privacy" },
                { name: "Terms", href: "/terms" },
                { name: "Refund Policy", href: "/refund" }
              ].map((item) => (
                <Link key={item.name} href={item.href} className="text-white/50 hover:text-[#14B8A6] transition-colors text-xs font-bold">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Links */}
          <div className="flex flex-col text-left">
            <h4 className="text-white font-sora text-xs font-black tracking-widest uppercase mb-6">Contact</h4>
            <div className="flex flex-col gap-3">
              <span className="text-white/50 text-xs font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#14B8A6]" />
                <a href="mailto:trips@tripvora.com" className="hover:text-white transition-colors">trips@tripvora.com</a>
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
