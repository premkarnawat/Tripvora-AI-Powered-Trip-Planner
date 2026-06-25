"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Mail } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
  };

  return (
    <footer className="relative bg-[#0F172A] border-t border-white/10 pt-16 pb-12 z-20 text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <Image src="/travixa-logo.png" alt="Travixa" width={160} height={40} className="h-9 w-auto object-contain" style={{ mixBlendMode: "screen" }} />
            </Link>
            <p className="text-[#94A3B8] text-xs font-medium max-w-sm leading-relaxed">
              Travixa is the enterprise AI travel intelligence operating system designed to automate itineraries, quotations, and commercial agency operations with zero compromise.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#38BDF8]">
              <Mail className="w-3.5 h-3.5" />
              <a href="mailto:contact.travixa@gmail.com" className="hover:underline">contact.travixa@gmail.com</a>
            </div>

            {/* Official Vector SVG Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#38BDF8]/20 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#38BDF8]/20 transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Ecosystem</h3>
            <ul className="space-y-2 text-xs font-medium text-[#94A3B8]">
              <li><Link href="/marketplace" className="hover:text-[#38BDF8] transition-colors">Marketplace</Link></li>
              <li><Link href="/destinations" className="hover:text-[#38BDF8] transition-colors">Destinations</Link></li>
              <li><Link href="/agencies" className="hover:text-[#38BDF8] transition-colors">Agency CRM Portal</Link></li>
              <li><Link href="/community" className="hover:text-[#38BDF8] transition-colors">Community Pool</Link></li>
            </ul>
          </div>

          {/* Col 3: Support Links */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Support & Legal</h3>
            <ul className="space-y-2 text-xs font-medium text-[#94A3B8]">
              <li><Link href="/pricing" className="hover:text-[#38BDF8] transition-colors">Pricing & Tiers</Link></li>
              <li><Link href="/contact" className="hover:text-[#38BDF8] transition-colors">Help Center & Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-[#38BDF8] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#38BDF8] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter Box */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Intelligence Dispatch</h3>
            <p className="text-[11px] text-[#94A3B8]">Subscribe to AI travel market trends and feature dispatches.</p>
            {subscribed ? (
              <div className="p-2.5 bg-[#14B8A6]/20 border border-[#14B8A6]/40 rounded text-xs text-[#14B8A6] font-semibold text-center">
                ✓ Subscribed to dispatch.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#0B1220] border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#38BDF8] w-full"
                />
                <Button type="submit" className="h-8 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0F172A] font-bold px-3 text-xs border-none">
                  Join
                </Button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-left text-[11px] text-[#94A3B8]/80 font-mono">
          <p>&copy; {new Date().getFullYear()} Travixa Enterprise Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Enterprise Build v2.5-prod</span>
            <span>•</span>
            <span className="text-[#14B8A6]">● 99.99% Edge Uptime</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
