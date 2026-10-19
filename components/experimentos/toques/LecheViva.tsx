"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";
import { gsap } from "gsap";

// Cuenco de leche: la superficie se ondula al pasar el cursor o el dedo.
// Campo de alturas de 128×128 (ecuación de onda discreta) sombreado en un
// canvas 2D que el CSS escala. Decorativo y sin foco.

const N = 128;
const DAMP = 0.975;
const BASE = [244, 239, 228]; // color de la leche

export default function LecheViva({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = canvas.height = N;
    const image = ctx.createImageData(N, N);
    let current = new Float32Array(N * N);
    let previous = new Float32Array(N * N);
    let energy = 0;

    const render = () => {
      const data = image.data;
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const i = y * N + x;
          const sx = (current[i + 1] ?? 0) - (current[i - 1] ?? 0);
          const sy = (current[i + N] ?? 0) - (current[i - N] ?? 0);
          // Luz desde arriba a la izquierda: brillo según la pendiente
          const shade = Math.max(-38, Math.min(38, (sx + sy) * 1.6));
          const vignette = Math.hypot(x - N / 2, y - N / 2) / (N / 2);
          const edge = vignette > 0.82 ? (vignette - 0.82) * 90 : 0;
          const p = i * 4;
          data[p] = BASE[0] + shade - edge;
          data[p + 1] = BASE[1] + shade - edge;
          data[p + 2] = BASE[2] + shade * 0.9 - edge * 1.1;
          data[p + 3] = 255;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    const disturb = (cx: number, cy: number, strength: number) => {
      const r = 3;
      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          const px = Math.round(cx + x);
          const py = Math.round(cy + y);
          if (px < 1 || py < 1 || px >= N - 1 || py >= N - 1) continue;
          const f = 1 - Math.hypot(x, y) / (r + 1);
          if (f > 0) current[py * N + px] += strength * f;
        }
      }
      energy = 1;
    };

    const simulate = () => {
      for (let y = 1; y < N - 1; y++) {
        for (let x = 1; x < N - 1; x++) {
          const i = y * N + x;
          previous[i] = ((current[i - 1] + current[i + 1] + current[i - N] + current[i + N]) / 2 - previous[i]) * DAMP;
        }
      }
      const swap = current;
      current = previous;
      previous = swap;
    };

    render();

    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * N;
      const y = ((e.clientY - rect.top) / rect.height) * N;
      const speed = last ? Math.min(Math.hypot(x - last.x, y - last.y), 6) : 1;
      disturb(x, y, 18 + speed * 10);
      last = { x, y };
    };
    const onLeave = () => (last = null);

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (reduced) return;
      if (visible) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    });
    observer.observe(canvas);

    // Solo simula mientras hay ondas: en reposo no consume.
    const tick = () => {
      if (!visible || energy < 0.002) return;
      simulate();
      simulate();
      render();
      energy *= 0.985;
    };

    if (!reduced) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
      gsap.ticker.add(tick);
    }

    return () => {
      gsap.ticker.remove(tick);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      observer.disconnect();
    };
  }, [reduced]);

  return (
    <div
      aria-hidden
      className={`relative aspect-square rounded-full bg-[#3b2c1f] p-[4%] shadow-[inset_0_2px_10px_rgba(0,0,0,0.6),0_30px_60px_-30px_rgba(0,0,0,0.8)] ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full touch-pan-y rounded-full" />
    </div>
  );
}
