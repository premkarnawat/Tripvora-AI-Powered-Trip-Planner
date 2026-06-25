"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Building2, MapPin, Sparkles } from "lucide-react";

// Dotted world map coordinates (scaled to 300x160 canvas)
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

const ecosystemItems = [
  { icon: Plane, label: "FLIGHTS" },
  { icon: Building2, label: "HOTELS" },
  { icon: MapPin, label: "DESTINATIONS" },
  { icon: Sparkles, label: "EXPERIENCES" },
];

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [conceptText, setConceptText] = useState("");

  // Transition Coordinates
  const [monoStartCoords, setMonoStartCoords] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [monoTargetCoords, setMonoTargetCoords] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const seen = localStorage.getItem("travixa_intro_seen");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reducedMotion) {
      setShow(false);
      window.dispatchEvent(new CustomEvent("travixa_splash_complete"));
      return;
    }

    setShow(true);

    // Cinematic Timings (Total: 3.8s including 600ms morph)
    const t1 = setTimeout(() => setStep(1), 500);   // 0.5s - Scene 2 (Dotted Map)
    const t2 = setTimeout(() => setStep(2), 1000);  // 1.0s - Scene 3 (Airplane Flight)
    const t3 = setTimeout(() => setStep(3), 1500);  // 1.5s - Scene 4 (Logo morph & concept text)
    const t4 = setTimeout(() => setStep(4), 2000);  // 2.0s - Scene 5 (Brand & tagline)
    const t5 = setTimeout(() => setStep(5), 2500);  // 2.5s - Scene 6 (Ecosystem icons)
    const t6 = setTimeout(() => setStep(6), 2900);  // 2.9s - Scene 7 (Thin loading line & dissolve start)

    // Trigger Scene 8 (Seamless Shrink to Navbar)
    const t7 = setTimeout(() => {
      const monogramEl = document.getElementById("splash-monogram-container");
      const navLogoEl = document.getElementById("navbar-logo");

      if (monogramEl && navLogoEl) {
        const monoRect = monogramEl.getBoundingClientRect();
        const navRect = navLogoEl.getBoundingClientRect();

        setMonoStartCoords({
          left: monoRect.left,
          top: monoRect.top,
          width: monoRect.width,
          height: monoRect.height,
        });

        // The monogram should fit in the square dimensions of the navbar logo image (height x height)
        setMonoTargetCoords({
          left: navRect.left,
          top: navRect.top,
          width: navRect.height,
          height: navRect.height,
        });

        setStep(7); // Scene 8 starts
      } else {
        // Fallback: Skip animation if elements not found
        localStorage.setItem("travixa_intro_seen", "true");
        window.dispatchEvent(new CustomEvent("travixa_splash_complete"));
        setShow(false);
      }
    }, 3200);

    // Final Clean Up and Complete
    const t8 = setTimeout(() => {
      localStorage.setItem("travixa_intro_seen", "true");
      window.dispatchEvent(new CustomEvent("travixa_splash_complete"));
      setShow(false);
    }, 3800);

    return () => {
      [t1, t2, t3, t4, t5, t6, t7, t8].forEach(clearTimeout);
    };
  }, []);

  // Concept text sequence (Scene 4)
  useEffect(() => {
    if (step === 3) {
      setConceptText("Journey");
      const c1 = setTimeout(() => setConceptText("Planning"), 120);
      const c2 = setTimeout(() => setConceptText("Intelligence"), 250);
      const c3 = setTimeout(() => setConceptText("Travixa"), 380);
      return () => {
        [c1, c2, c3].forEach(clearTimeout);
      };
    }
  }, [step]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none overflow-hidden">
      
      {/* Backdrop Container */}
      <motion.div
        animate={{
          backgroundColor: step === 7 ? "rgba(15, 23, 42, 0)" : "#0F172A",
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
      >
        {/* Subtle Ambient Radial Vignette & Moving Soft Light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        {step < 7 && (
          <motion.div
            className="absolute w-[450px] h-[450px] rounded-full bg-[#14B8A6]/4 blur-[100px] pointer-events-none"
            animate={{
              x: [-40, 40, -20, -40],
              y: [-20, 30, 40, -20],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center max-w-lg px-6 text-center">
          
          {/* Scene 1: Fading Words & Sound Wave */}
          <AnimatePresence>
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center space-y-6"
              >
                {/* Visual Sound Wave */}
                <div className="flex items-center justify-center gap-1.5 h-10 mb-2">
                  {[0.6, 1.2, 0.8, 1.4, 0.9, 1.1, 0.5].map((scale, i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] bg-[#14B8A6] rounded-full"
                      style={{ height: 20 }}
                      animate={{
                        scaleY: [1, scale, 0.5, 1],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center space-y-4 font-sora text-sm font-semibold tracking-[0.4em] text-white">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                    className="text-cyan-400"
                  >
                    DISCOVER
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.18 }}
                    className="text-teal-400"
                  >
                    PLAN
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                    className="text-[#E2FF00]"
                  >
                    EXPERIENCE
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scene 2 & 3: Dotted Map & Airplane Route */}
          <AnimatePresence>
            {(step === 1 || step === 2) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative w-[300px] h-[160px] flex items-center justify-center scale-110"
              >
                <svg viewBox="0 0 180 100" className="w-full h-full text-teal-500/20 select-none">
                  <defs>
                    <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="route-grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#E2FF00" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  {/* Dotted Map Points */}
                  {dottedMapPoints.map((p, idx) => (
                    <motion.circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r="1.2"
                      fill="currentColor"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      transition={{ delay: (p.x + p.y) * 0.002, duration: 0.25 }}
                    />
                  ))}

                  {/* Passive Routes */}
                  <motion.path
                    d="M 90 32 Q 60 25 40 35"
                    fill="none"
                    stroke="url(#route-grad)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M 40 35 Q 85 15 120 30"
                    fill="none"
                    stroke="url(#route-grad)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                  />

                  {/* Active Route (for flight) */}
                  <motion.path
                    d="M 120 30 Q 140 55 152 74"
                    fill="none"
                    stroke="url(#route-grad-active)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
                  />
                </svg>

                {/* Flying Airplane (Scene 3) */}
                {step === 2 && (
                  <motion.div
                    style={{
                      offsetPath: "path('M 120 30 Q 140 55 152 74')",
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
                      offsetDistance: { duration: 0.5, ease: "easeInOut" },
                      opacity: { times: [0, 0.15, 0.85, 1], duration: 0.5 }
                    }}
                  >
                    <div className="-translate-x-1/2 -translate-y-1/2">
                      <Plane className="w-4 h-4 text-[#E2FF00] fill-current drop-shadow-[0_0_8px_rgba(226,255,0,0.8)] rotate-90" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scene 4, 5, 6, 7: Logo Creation, Brand Details & Loading */}
          <AnimatePresence>
            {step >= 3 && step <= 6 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                {/* Monogram Wrapper */}
                <div
                  id="splash-monogram-container"
                  className="relative w-24 h-24 mb-4 flex items-center justify-center"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full text-teal-400 drop-shadow-[0_0_15px_rgba(20,184,166,0.35)]">
                    <defs>
                      <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0EA5E9" />
                        <stop offset="100%" stopColor="#14B8A6" />
                      </linearGradient>
                    </defs>

                    {/* Monogram drawing strokes */}
                    <motion.path
                      d="M 20,30 L 68,30"
                      stroke="url(#accent-grad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M 68,30 L 80,30"
                      stroke="#E2FF00"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.3, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M 40,30 C 40,45 28,60 28,72 C 28,82 36,90 46,90 C 56,90 64,82 64,72 C 64,60 52,45 52,30"
                      stroke="url(#accent-grad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.15, ease: "easeInOut" }}
                    />
                    <motion.circle
                      cx="46"
                      cy="72"
                      r="6"
                      fill="#E2FF00"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.85, type: "spring" }}
                    />
                  </svg>
                </div>

                {/* Sub-text Transitions (Scene 4) */}
                {step === 3 && (
                  <motion.div
                    key={conceptText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="text-xs font-bold tracking-[0.25em] text-teal-400 font-mono"
                  >
                    {conceptText.toUpperCase()}
                  </motion.div>
                )}

                {/* Brand Name & Tagline (Scene 5) */}
                {step >= 4 && (
                  <div className="flex flex-col items-center">
                    <motion.h1
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-3xl font-extrabold tracking-[0.35em] text-white font-sora mt-1"
                    >
                      TRAVIXA
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.15 }}
                      className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase mt-2.5 font-sans"
                    >
                      Travel Intelligence. Perfected.
                    </motion.p>
                  </div>
                )}

                {/* Ecosystem Icons (Scene 6) */}
                {step >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-4 gap-5 mt-7 w-72"
                  >
                    {ecosystemItems.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className="flex flex-col items-center space-y-1.5"
                      >
                        <div className="w-8.5 h-8.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-teal-400">
                          <item.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[8px] font-bold tracking-wider text-slate-500 font-mono">
                          {item.label}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Thin Premium Loading Line (Scene 7) */}
                {step === 6 && (
                  <div className="w-56 h-[1.5px] bg-white/10 rounded-full overflow-hidden mt-8.5 relative">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-teal-400 to-[#E2FF00]"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>

      {/* Scene 8: Seamless Logo Shrink Transition */}
      {step === 7 && monoStartCoords && monoTargetCoords && (
        <motion.div
          style={{
            position: "fixed",
            left: monoStartCoords.left,
            top: monoStartCoords.top,
            width: monoStartCoords.width,
            height: monoStartCoords.height,
            zIndex: 10000,
            pointerEvents: "none",
          }}
          animate={{
            left: monoTargetCoords.left,
            top: monoTargetCoords.top,
            width: monoTargetCoords.width,
            height: monoTargetCoords.height,
          }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1], // apple premium bezier curves
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-teal-400">
            <defs>
              <linearGradient id="accent-grad-transition" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            {/* Top Bar */}
            <path
              d="M 20,30 L 68,30"
              stroke="url(#accent-grad-transition)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 68,30 L 80,30"
              stroke="#E2FF00"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Loop */}
            <path
              d="M 40,30 C 40,45 28,60 28,72 C 28,82 36,90 46,90 C 56,90 64,82 64,72 C 64,60 52,45 52,30"
              stroke="url(#accent-grad-transition)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Circle */}
            <circle cx="46" cy="72" r="6" fill="#E2FF00" />
          </svg>
        </motion.div>
      )}

    </div>
  );
}
