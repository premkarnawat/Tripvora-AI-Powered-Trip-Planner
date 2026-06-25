"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Building2, Compass, Utensils, Sparkles, MapPin, FileText, Bot } from "lucide-react";

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Accessibility & First-Visit Guardrails
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("travixa_intro_seen");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reducedMotion) {
      setShow(false);
      return;
    }

    setShow(true);

    // 60 FPS Timed Cinematic Sequence (Total 3.2 seconds)
    const t1 = setTimeout(() => setStep(1), 500);  // Map & Routes
    const t2 = setTimeout(() => setStep(2), 1100); // Airplane Path & Monogram
    const t3 = setTimeout(() => setStep(3), 1600); // Logo Morph & Glow
    const t4 = setTimeout(() => setStep(4), 2200); // Brand & Tagline
    const t5 = setTimeout(() => setStep(5), 2700); // Ecosystem Icons
    const t6 = setTimeout(() => {
      localStorage.setItem("travixa_intro_seen", "true");
      setShow(false);
    }, 3300); // Dissolve into homepage

    return () => {
      [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
    };
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-[9999] bg-[#0F172A] flex flex-col items-center justify-center overflow-hidden selection:bg-transparent"
      >
        {/* Subtle Ambient Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center max-w-lg px-6 text-center">
          
          {/* Scene 1: Words Fade Upward */}
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-3 font-mono text-xs font-bold tracking-[0.3em] text-[#38BDF8]"
            >
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>DISCOVER</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>PLAN</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-amber-400">EXPERIENCE</motion.p>
            </motion.div>
          )}

          {/* Scene 2 & 3: Glowing Dotted Routes & Airplane Path */}
          {step >= 1 && step < 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-64 h-40 flex items-center justify-center"
            >
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100">
                {/* Glowing Travel Route */}
                <motion.path
                  d="M 20 80 Q 100 10 180 50"
                  fill="transparent"
                  stroke="#14B8A6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                {step === 2 && (
                  <motion.circle
                    cx="180" cy="50" r="4" fill="#38BDF8"
                    className="animate-ping"
                  />
                )}
              </svg>
              {step === 2 && (
                <motion.div
                  initial={{ x: -80, y: 30, rotate: -25 }}
                  animate={{ x: 80, y: -10, rotate: 15 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute text-white shadow-lg"
                >
                  <Plane className="w-5 h-5 text-[#38BDF8] fill-current" />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Scene 4 & 5: Logo Creation, Brand Name & Tagline */}
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center space-y-4"
            >
              {/* Glowing Monogram Logo Morph */}
              <div className="relative">
                <motion.div
                  animate={{ boxShadow: ["0 0 0px #14B8A6", "0 0 35px rgba(20,184,166,0.4)", "0 0 10px #14B8A6"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#14B8A6] p-0.5 flex items-center justify-center shadow-2xl"
                >
                  <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
                    <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-[#38BDF8] bg-clip-text text-transparent">TX</span>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-1.5">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-extrabold tracking-[0.25em] text-white font-sans"
                >
                  TRAVIXA
                </motion.h1>
                {step >= 4 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs font-semibold tracking-widest text-[#94A3B8] uppercase"
                  >
                    Travel Intelligence. Perfected.
                  </motion.p>
                )}
              </div>

              {/* Scene 6: Ecosystem Icons Fade Upward */}
              {step >= 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ staggerChildren: 0.05 }}
                  className="flex gap-4 pt-4 text-[#38BDF8]/70"
                >
                  {[Plane, Building2, Compass, Utensils, Sparkles, MapPin, FileText, Bot].map((Icon, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                      <Icon className="w-4 h-4" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

        </div>

        {/* Scene 7: Thin Premium Loading Bar */}
        <div className="absolute bottom-12 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.1, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-[#38BDF8] to-[#14B8A6]"
          />
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
