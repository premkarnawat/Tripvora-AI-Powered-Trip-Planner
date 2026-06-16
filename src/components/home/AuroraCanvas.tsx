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
