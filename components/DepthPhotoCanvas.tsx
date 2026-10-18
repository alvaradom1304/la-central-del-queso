'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ==============================================================================
// GLSL SHADER DE DESPLAZAMIENTO 2.5D PARALLAX DEPTH
// ==============================================================================
const DEPTH_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DEPTH_FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    // Estimación física de profundidad procedural (Luminancia + Gradiente de Altura)
    vec4 baseColor = texture2D(uTexture, vUv);
    float luma = dot(baseColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // El suelo y primer plano (y bajo) tiene mayor desplazamiento que el horizonte volcánico
    float depth = mix(1.0 - vUv.y * 0.75, luma, 0.35);

    // Desplazamiento Parallax con aberración cromática orgánica
    vec2 offset = uMouse * (depth * uIntensity * 0.045);
    
    float r = texture2D(uTexture, vUv + offset * 1.04).r;
    float g = texture2D(uTexture, vUv + offset).g;
    float b = texture2D(uTexture, vUv + offset * 0.96).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

function DepthPlane({
  imageUrl,
  mousePos,
  intensity = 1.0,
}: {
  imageUrl: string;
  mousePos: { x: number; y: number };
  intensity?: number;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const currentMouse = useRef(new THREE.Vector2(0, 0));

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imageUrl);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }, [imageUrl]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: intensity },
    }),
    [texture, intensity]
  );

  useEffect(() => {
    targetMouse.current.set(mousePos.x, mousePos.y);
  }, [mousePos.x, mousePos.y]);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const dt = Math.min(delta, 0.05);
    currentMouse.current.lerp(targetMouse.current, dt * 8);
    matRef.current.uniforms.uMouse.value.copy(currentMouse.current);
  });

  return (
    <mesh scale={[3.55, 2.0, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={DEPTH_VERTEX_SHADER}
        fragmentShader={DEPTH_FRAGMENT_SHADER}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function DepthPhotoCanvas({
  imageUrl,
  mousePos,
  className = '',
  intensity = 1.0,
}: {
  imageUrl: string;
  mousePos: { x: number; y: number };
  className?: string;
  intensity?: number;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1.8], fov: 58 }}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
        }}
      >
        <DepthPlane imageUrl={imageUrl} mousePos={mousePos} intensity={intensity} />
      </Canvas>
    </div>
  );
}
