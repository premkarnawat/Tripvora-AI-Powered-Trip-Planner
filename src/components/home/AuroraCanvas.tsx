"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useEffect } from "react";

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
    
    // Create soft aurora-like color bands (Deep Navy & Slate Blue)
    vec3 col = vec3(0.03, 0.05, 0.1); // Dark Base Navy
    col += vec3(0.05, 0.2, 0.4) * 0.08 * sin(p.x * 3.0 + time + p.y * 2.0); // Deep Blue
    col += vec3(0.08, 0.35, 0.5) * 0.05 * cos(p.y * 3.0 - time + p.x * 1.5); // Deep Slate Blue
    
    // Mask to bottom/center
    float mask = smoothstep(1.0, 0.0, d * 0.8);
    gl_FragColor = vec4(col, mask * 0.4);
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

export default function AuroraCanvas() {
  return (
    <Canvas>
      <AuroraShader />
    </Canvas>
  );
}
