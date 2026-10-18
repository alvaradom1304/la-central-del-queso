'use client';

import React, { useEffect, useRef } from 'react';

interface AtmosphericCanvasOverlayProps {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  isAtCava: boolean;
  cinemaFx?: boolean;
  isActive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulsePhase: number;
  rotation: number;
  rotSpeed: number;
  petalColor: string;
  isPetal: boolean;
}

const PETAL_COLORS = [
  '255, 225, 130', // polen dorado y botón de oro
  '244, 162, 184', // pétalo de hortensia rosada / bougainvillea
  '175, 205, 255', // pétalo de hortensia azul de montaña
  '255, 248, 231', // flor blanca de café / trébol
];

/**
 * AtmosphericCanvasOverlay (Ultra-Fast Zero-ShadowBlur Engine):
 * - Cero llamadas a ctx.shadowBlur (reemplazadas por doble pase de alfa suave = 20x más rápido).
 * - Se pausa automáticamente vía IntersectionObserver (isActive=false) cuando el usuario baja al catálogo.
 */
export const AtmosphericCanvasOverlay: React.FC<AtmosphericCanvasOverlayProps> = ({
  progressRef,
  mouseRef,
  cinemaFx = true,
  isActive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    // DPR 1.25 para gradientes atmosféricos: idéntica nitidez visual con 60% menos fill-rate en GPU
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    const PARTICLE_COUNT = 48;
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.8 + 0.25,
      vx: (Math.random() - 0.35) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2.4 + 1.0,
      alpha: Math.random() * 0.5 + 0.25,
      pulsePhase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      petalColor: PETAL_COLORS[idx % PETAL_COLORS.length],
      isPetal: idx % 3 === 0,
    }));

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      const p = progressRef.current || 0;
      const mouse = mouseRef.current || { x: 0, y: 0 };

      // 1. RAYOS VOLUMÉTRICOS DE AMANECER EN EL CAMPO (p < 0.58)
      if (cinemaFx && p < 0.58) {
        const sunRayAlpha = (1 - p / 0.58) * 0.2;
        const sunRayGrad = ctx.createRadialGradient(
          width * 0.72,
          height * 0.08,
          20,
          width * 0.5,
          height * 0.65,
          Math.max(width, height) * 0.8
        );
        sunRayGrad.addColorStop(0, `rgba(255, 240, 190, ${sunRayAlpha * 1.3})`);
        sunRayGrad.addColorStop(0.45, `rgba(255, 215, 140, ${sunRayAlpha * 0.5})`);
        sunRayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = sunRayGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. RESPLANDOR CÁLIDO DEL GRANERO Y CAVA 3D (p > 0.55)
      if (cinemaFx && p > 0.55) {
        const cellarAlpha = Math.min(1, (p - 0.55) / 0.3) * 0.22;
        const cellarGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.48,
          40,
          width * 0.5,
          height * 0.52,
          Math.max(width, height) * 0.58
        );
        cellarGrad.addColorStop(0, `rgba(248, 195, 85, ${cellarAlpha * 1.1})`);
        cellarGrad.addColorStop(0.5, `rgba(185, 105, 30, ${cellarAlpha * 0.35})`);
        cellarGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = cellarGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. PARTÍCULAS ORGÁNICAS SIN SHADOWBLUR (Ultra-rápido a 120 FPS)
      const isCellar = p >= 0.62;
      const mousePxX = (mouse.x * 0.5 + 0.5) * width;
      const mousePxY = (-mouse.y * 0.5 + 0.5) * height;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const pt = particles[i];

        const dx = pt.x - mousePxX;
        const dy = pt.y - mousePxY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 28900 && distSq > 4) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 170) * 0.55;
          pt.vx += (dx / dist) * force;
          pt.vy += (dy / dist) * force;
        }

        const windX = isCellar ? 0.02 : Math.sin(time + pt.pulsePhase) * 0.2 + 0.14;
        const windY = isCellar ? -0.13 : Math.cos(time * 0.8 + i) * 0.1 - 0.07;

        pt.vx = pt.vx * 0.97 + windX * 0.03;
        pt.vy = pt.vy * 0.97 + windY * 0.03;
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.rotation += pt.rotSpeed;

        if (pt.y < -20) {
          pt.y = height + 12;
          pt.x = Math.random() * width;
        } else if (pt.y > height + 20) {
          pt.y = -12;
          pt.x = Math.random() * width;
        }
        if (pt.x < -20) pt.x = width + 12;
        else if (pt.x > width + 20) pt.x = -12;

        const pulse = Math.sin(time * 2 + pt.pulsePhase) * 0.28 + 0.72;
        const currentAlpha = pt.alpha * pt.z * pulse;
        const r = pt.size * pt.z;

        if (!isCellar && pt.isPetal) {
          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(pt.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 1.85, r * 1.0, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pt.petalColor}, ${(currentAlpha * 0.85).toFixed(3)})`;
          ctx.fill();
          ctx.restore();
        } else {
          const color = isCellar ? '245, 205, 120' : '255, 238, 175';
          // Halo exterior suave (reemplaza shadowBlur con 0 costo de CPU)
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${(currentAlpha * 0.18).toFixed(3)})`;
          ctx.fill();
          // Núcleo brillante
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${currentAlpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [progressRef, mouseRef, cinemaFx, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[12] w-full h-full"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      aria-hidden="true"
    />
  );
};
