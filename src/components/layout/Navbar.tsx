"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 hidden md:block"
    >
      <div className="max-w-7xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-white tracking-tighter">
            Tripvora<span className="text-primary">.</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/explore" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Explore</Link>
            <Link href="/pricing" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Pricing</Link>
            <Link href="/community" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Community</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white hover:text-white/80">Log in</Button>
          <Button className="rounded-full font-semibold px-6">Plan Trip</Button>
        </div>
      </div>
    </motion.header>
  );
}
