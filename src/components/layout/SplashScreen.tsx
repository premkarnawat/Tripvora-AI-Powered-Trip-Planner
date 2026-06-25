"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Building2, MapPin, Palmtree } from "lucide-react";

// Dotted world map coordinates (scaled to 180x100 viewBox)
const dottedMapPoints = [
  // North America
  { x: 30, y: 35 }, { x: 34, y: 33 }, { x: 38, y: 31 }, { x: 42, y: 30 }, { x: 46, y: 34 },
  { x: 32, y: 39 }, { x: 36, y: 37 }, { x: 40, y: 35 }, { x: 44, y: 40 }, { x: 48, y: 43 },
  { x: 35, y: 45 }, { x: 39, y: 43 }, { x: 43, y: 48 }, { x: 47, y: 52 },
  // South America
  { x: 50, y: 60 }, { x: 54, y: 64 }, { x: 58, y: 68 }, { x: 62, y: 74 }, { x: 64, y: 80 },
  { x: 52, y: 66 }, { x: 56, y: 70 }, { x: 60, y: 78 }, { x: 58, y: 84 },
  // Europe
  { x: 86, y: 32 }, { x: 90, y: 28 }, { x: 94, y: 26 }, { x: 98, y: 28 }, { x: 102, y: 32 },
  { x: 88, y: 36 }, { x: 92, y: 34 }, { x: 96, y: 38 }, { x: 100, y: 42 },
  // Africa
  { x: 92, y: 50 }, { x: 96, y: 48 }, { x: 100, y: 52 }, { x: 104, y: 56 }, { x: 108, y: 60 },
  { x: 94, y: 56 }, { x: 98, y: 60 }, { x: 102, y: 64 }, { x: 106, y: 68 }, { x: 110, y: 72 },
  { x: 108, y: 64 }, { x: 104, y: 76 },
  // Asia
  { x: 112, y: 28 }, { x: 116, y: 26 }, { x: 120, y: 24 }, { x: 124, y: 26 }, { x: 128, y: 28 },
  { x: 114, y: 34 }, { x: 118, y: 32 }, { x: 122, y: 30 }, { x: 126, y: 34 }, { x: 130, y: 38 },
  { x: 116, y: 40 }, { x: 120, y: 38 }, { x: 124, y: 42 }, { x: 128, y: 46 }, { x: 132, y: 50 },
  { x: 122, y: 48 }, { x: 126, y: 52 }, { x: 130, y: 56 }, { x: 134, y: 60 },
  { x: 138, y: 42 }, { x: 142, y: 46 }, { x: 146, y: 50 },
  // Australia
  { x: 148, y: 76 }, { x: 152, y: 74 }, { x: 156, y: 78 }, { x: 160, y: 82 },
  { x: 150, y: 82 }, { x: 154, y: 86 }
];

const travelRoutes = [
  { d: "M 35,45 Q 60,30 90,36", delay: 0.15 },
  { d: "M 90,36 Q 110,50 130,38", delay: 0.35 },
  { d: "M 40,40 Q 80,60 110,72", delay: 0.25 },
  { d: "M 30,80 C 60,65 110,45 150,25", delay: 0.45, isActive: true }
];

const ecosystemItems = [
  { icon: Plane, label: "FLIGHTS" },
  { icon: Building2, label: "HOTELS" },
  { icon: MapPin, label: "DESTINATIONS" },
  { icon: Palmtree, label: "EXPERIENCES" },
];

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only play cinematic intro on the main homepage
    if (window.location.pathname !== "/") {
      setShow(false);
      window.dispatchEvent(new CustomEvent("travixa_splash_complete"));
      return;
    }

    const seen = localStorage.getItem("travixa_intro_seen");
    const forceSplash = window.location.search.includes("splash=true");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ((seen && !forceSplash) || reducedMotion) {
      setShow(false);
      window.dispatchEvent(new CustomEvent("travixa_splash_complete"));
      return;
    }

    setShow(true);
    setStep(0);

    // Timings matching the 8 storyboard panels, slowed down for readability (1.2s per panel)
    const timers = [
      setTimeout(() => setStep(1), 1200),   // Scene 2 (1.2s) - World map softly appears
      setTimeout(() => setStep(2), 2400),  // Scene 3 (2.4s) - Airplane flies route
      setTimeout(() => setStep(3), 3600),  // Scene 4 (3.6s) - Logo monogram starts forming
      setTimeout(() => setStep(4), 4800),  // Scene 5 (4.8s) - Logo completes with gold dot & radar glow
      setTimeout(() => setStep(5), 6000),  // Scene 6 (6.0s) - Brand name and tagline fade in
      setTimeout(() => setStep(6), 7200),  // Scene 7 (7.2s) - Ecosystem items fade in
      setTimeout(() => setStep(7), 8400),  // Scene 8 (8.4s) - Loading bar runs & dissolve transition
      setTimeout(() => {
        // Complete transition and hide
        localStorage.setItem("travixa_intro_seen", "true");
        window.dispatchEvent(new CustomEvent("travixa_splash_complete"));
        setShow(false);
      }, 9600) // End (9.6s)
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none overflow-hidden">
      {/* Backdrop Container */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          opacity: step === 7 ? [1, 1, 0] : 1,
        }}
        transition={{
          duration: 1.2,
          times: [0, 0.65, 1], // Stays opaque through 65% of the 1.2s, then fades out in the last 420ms
          ease: "easeInOut"
        }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
        style={{ backgroundColor: "#04060E" }}
      >
        {/* Subtle Ambient Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl px-6 text-center">
          
          {/* Scene 1: Fading Words Stack (0.0s - 1.2s) */}
          <AnimatePresence>
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center space-y-5 md:space-y-7"
              >
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-2xl md:text-3.5xl font-extrabold tracking-[0.35em] text-[#14B8A6] font-sora"
                >
                  DISCOVER.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="text-2xl md:text-3.5xl font-extrabold tracking-[0.35em] text-[#38BDF8] font-sora"
                >
                  PLAN.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                  className="text-2xl md:text-3.5xl font-extrabold tracking-[0.35em] text-[#FACC15] font-sora"
                >
                  EXPERIENCE.
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scene 2 & 3: Dotted World Map & Airplane (1.2s - 3.6s) */}
          <AnimatePresence>
            {(step === 1 || step === 2) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="relative w-[360px] h-[190px] md:w-[500px] md:h-[260px] flex items-center justify-center"
              >
                <svg viewBox="0 0 180 100" className="w-full h-full text-[#14B8A6]/20 select-none">
                  <defs>
                    <linearGradient id="route-passive-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.05" />
                      <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="route-active-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#FACC15" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  {/* Dotted Map Points */}
                  {dottedMapPoints.map((p, idx) => (
                    <motion.circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r="1.0"
                      fill="currentColor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.22 }}
                      transition={{ delay: (p.x + p.y) * 0.002, duration: 0.4 }}
                    />
                  ))}

                  {/* World Travel Routes */}
                  {travelRoutes.map((route, i) => (
                    <motion.path
                      key={i}
                      d={route.d}
                      fill="none"
                      stroke={route.isActive ? "url(#route-active-grad)" : "url(#route-passive-grad)"}
                      strokeWidth={route.isActive ? "1.5" : "0.75"}
                      strokeDasharray={route.isActive ? "none" : "2 2"}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, delay: route.delay, ease: "easeInOut" }}
                    />
                  ))}

                  {/* Airplane Contrail Path (Scene 3 only) */}
                  {step === 2 && (
                    <motion.path
                      d="M 30,80 C 60,65 110,45 150,25"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="2.0"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.0, ease: "easeInOut" }}
                      className="drop-shadow-[0_0_6px_rgba(20,184,166,0.65)]"
                    />
                  )}
                </svg>

                {/* Flying Airplane along the swoop path (Scene 3) */}
                {step === 2 && (
                  <motion.div
                    style={{
                      offsetPath: "path('M 30,80 C 60,65 110,45 150,25')",
                      offsetRotate: "auto",
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",
                    }}
                    initial={{ offsetDistance: "0%", opacity: 0 }}
                    animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                    transition={{
                      offsetDistance: { duration: 1.0, ease: "easeInOut" },
                      opacity: { times: [0, 0.12, 0.88, 1], duration: 1.0 }
                    }}
                  >
                    <div className="-translate-x-1/2 -translate-y-1/2">
                      <Plane className="w-5.5 h-5.5 text-[#FACC15] fill-[#FACC15] drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scene 4 - 8: Logo, Brand Typography, Ecosystem, Loading (3.6s - 9.6s) */}
          <AnimatePresence>
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                {/* Logo Monogram Wrapper */}
                <motion.div
                  animate={{
                    filter: step >= 4 
                      ? "drop-shadow(0 0 25px rgba(20,184,166,0.5)) drop-shadow(0 0 10px rgba(250,204,21,0.25))" 
                      : "drop-shadow(0 0 0px rgba(0,0,0,0))"
                  }}
                  transition={{ duration: 0.5 }}
                  className="relative w-28 h-28 mb-2 flex items-center justify-center"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#14B8A6]">
                    <defs>
                      <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#14B8A6" />
                      </linearGradient>
                    </defs>

                    {/* Concentric Pulsing Radar Rings (Scene 5+) */}
                    {step >= 4 && (
                      <>
                        <motion.circle
                          cx="48"
                          cy="72"
                          initial={{ r: 6, opacity: 0.8 }}
                          animate={{ r: 24, opacity: 0 }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                          stroke="#FACC15"
                          strokeWidth="1.25"
                          fill="none"
                        />
                        <motion.circle
                          cx="48"
                          cy="72"
                          initial={{ r: 6, opacity: 0.8 }}
                          animate={{ r: 38, opacity: 0 }}
                          transition={{
                            duration: 1.8,
                            delay: 0.6,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                          stroke="#FACC15"
                          strokeWidth="0.75"
                          fill="none"
                        />
                      </>
                    )}

                    {/* T-Monogram Shapes drawing themselves */}
                    <motion.path
                      d="M 22,30 L 68,30"
                      stroke="url(#accent-grad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M 68,30 L 80,30"
                      stroke="#FACC15"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                      transition={{ duration: 0.4, delay: 0.5, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M 42,30 C 42,45 30,60 30,72 C 30,82 38,90 48,90 C 58,90 66,82 66,72 C 66,60 54,45 54,30"
                      stroke="url(#accent-grad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                      transition={{ duration: 0.75, delay: 0.25, ease: "easeInOut" }}
                    />

                    {/* Logo Center Refinement Dot */}
                    <motion.circle
                      cx="48"
                      cy="72"
                      r="6.5"
                      fill="#FACC15"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={step >= 4 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="shadow-[0_0_8px_#FACC15]"
                    />
                  </svg>
                </motion.div>

                {/* Brand Name & Tagline (Scene 6+) */}
                <div className="flex flex-col items-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={step >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3.5xl md:text-4xl font-extrabold tracking-[0.45em] text-white font-sora select-none mt-2 translate-x-[0.225em]"
                  >
                    TRAVIXA
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={step >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                    transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[10px] md:text-xs font-bold tracking-[0.25em] mt-3 select-none text-slate-400 font-sans"
                  >
                    <span className="text-[#14B8A6]">TRAVEL INTELLIGENCE.</span>{" "}
                    <span className="text-[#FACC15]">PERFECTED.</span>
                  </motion.p>
                </div>

                {/* Ecosystem Icons row (Scene 7+) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={step >= 6 ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-4 gap-6 md:gap-8 mt-9 w-72 md:w-80 justify-center"
                >
                  {ecosystemItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={step >= 6 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                      transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#14B8A6] shadow-[0_0_8px_rgba(20,184,166,0.15)]">
                        <item.icon className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      {/* Gold dot */}
                      <div className="w-1 h-1 rounded-full bg-[#FACC15] mt-2.5 shadow-[0_0_4px_#FACC15]" />
                      {/* Label */}
                      <span className="text-[7.5px] md:text-[8px] font-bold tracking-widest text-slate-500 mt-2 font-sans">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Premium Loading Bar Indicator (Scene 8) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={step === 7 ? { opacity: 1, scale: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-56 md:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden mt-10 relative"
                >
                  {/* Filling progress line */}
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={step === 7 ? { width: "100%" } : { width: "0%" }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-[#14B8A6] via-[#38BDF8] to-[#FACC15] relative"
                  >
                    {/* Moving lens flare glow point */}
                    <motion.div
                      initial={{ left: "0%" }}
                      animate={step === 7 ? { left: "100%" } : { left: "0%" }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-white blur-[2.5px] shadow-[0_0_8px_#38BDF8,0_0_15px_#14B8A6]"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
