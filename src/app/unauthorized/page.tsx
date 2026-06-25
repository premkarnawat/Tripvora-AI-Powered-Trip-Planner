"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div 
      className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.15), transparent 70%)"
      }}
    >
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Animated Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full text-center relative z-10 space-y-8 p-8 rounded-2xl border border-white/5 bg-[#0D1226]/50 backdrop-blur-xl shadow-2xl"
      >
        {/* Animated Icon */}
        <div className="flex justify-center">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
          >
            <ShieldAlert className="w-8 h-8" />
          </motion.div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold font-sora tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Access Denied
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            You do not have the required permissions to access this portal. Please ensure you are logged in with the correct account role or return to the main dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button 
            asChild
            variant="outline"
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-300"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button 
            asChild
            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold transition-all duration-300 shadow-[0_4px_14px_rgba(20,184,166,0.3)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.4)]"
          >
            <Link href="/login" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Log In
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-widest font-sora text-slate-500"
      >
        Travixa Security
      </motion.p>
    </div>
  );
}
