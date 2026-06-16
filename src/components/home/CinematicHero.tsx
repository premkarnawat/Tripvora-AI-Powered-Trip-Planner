"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GlassSearchCard } from "./GlassSearchCard";
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

// --- Custom WebGL Aurora Shader ---
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  varying vec2 vUv;
  
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float a = time * 0.5;
    float d = length(p);
    
    // Create soft aurora-like color bands (Teal and Sky Blue)
    vec3 col = vec3(0.05, 0.09, 0.16); // Base Navy
    col += vec3(0.08, 0.72, 0.65) * 0.1 * sin(p.x * 5.0 + time + p.y * 3.0); // Teal
    col += vec3(0.22, 0.74, 0.97) * 0.1 * cos(p.y * 4.0 - time + p.x * 2.0); // Sky Blue
    
    // Mask to bottom/center
    float mask = smoothstep(1.0, 0.0, d * 0.8);
    gl_FragColor = vec4(col, mask * 0.5);
  }
`;

function AuroraShader() {
  const materialRef = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { time: { value: 0 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Animate the shader
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      materialRef.uniforms.time.value += 0.01;
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [materialRef]);

  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <primitive object={materialRef} attach="material" />
    </mesh>
  );
}

export function CinematicHero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <div className="relative min-h-[100dvh] md:min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0F172A]">
      
      {/* LAYER 1-3: Environment (Parallax Background) */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <img 
          src="/hero_bg.png" 
          alt="Mountain Landscape" 
          className="object-cover object-bottom w-full h-full scale-[1.15]"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 via-transparent to-[#0F172A]/80" />
      </motion.div>

      {/* LAYER 8: Aurora Shader (React Three Fiber) */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-60 mix-blend-screen">
        <Canvas>
          <AuroraShader />
        </Canvas>
      </div>

      {/* LAYER 4-5: Atmosphere (Particles) */}
      {init && (
        <div className="absolute inset-0 z-[2] pointer-events-none opacity-40">
          <Particles
            id="tsparticles"
            options={{
              fpsLimit: 60,
              particles: {
                color: { value: "#14B8A6" },
                move: { enable: true, direction: "none", outModes: { default: "out" }, random: true, speed: 0.5, straight: false },
                number: { density: { enable: true, area: 800 }, value: 50 },
                opacity: { value: 0.3, random: true },
                size: { value: { min: 1, max: 3 } },
              },
              detectRetina: true,
            }}
          />
        </div>
      )}

      {/* LAYER 6: Animated Flight Routes */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-60 hidden md:block">
        <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          {/* Mumbai to Bali */}
          <motion.path 
            d="M 200 700 Q 500 300 800 600" 
            fill="none" 
            stroke="url(#gradient1)" 
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          
          {/* Floating Destination Pins */}
          <motion.circle cx="800" cy="600" r="4" fill="#38BDF8" 
            animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>

      {/* LAYER 7 & CONTENT */}
      <motion.div 
        style={{ opacity, y: y2 }}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 pt-32 pb-20 flex flex-col items-center text-center mt-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.15)] mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-white/90 tracking-wide uppercase text-xs">AI Powered Travel Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[84px] font-extrabold text-white mb-6 font-sora tracking-tighter leading-[1.05]"
        >
          Plan Your Perfect Trip<br/>
          In Minutes, <span className="text-gradient">Not Hours.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed mb-12"
        >
          AI creates personalized itineraries, finds flights, hotels, experiences, and helps you travel smarter.
        </motion.p>

        {/* Backdrop Blur 20px Glass Search Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl mx-auto relative group"
        >
          {/* Custom tracking mouse-glow effect (simulated by radial gradient) */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-[30px] opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="backdrop-blur-[20px]">
            <GlassSearchCard />
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  );
}
