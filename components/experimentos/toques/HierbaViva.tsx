"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Hierba en primer plano: siluetas que se mecen con la brisa y se apartan al
// paso del cursor o del dedo. Canvas 2D; decorativa y sin foco.

type Blade = { x: number; length: number; width: number; phase: number; bend: number; tone: number };

const RADIUS = 120;

export default function HierbaViva({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let blades: Blade[] = [];
    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(width / 3.2);
      blades = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        length: height * (0.35 + Math.random() * 0.65),
        width: 1.2 + Math.random() * 2.4,
        phase: Math.random() * Math.PI * 2,
        bend: 0,
        tone: Math.random(),
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const b of blades) {
        let target = Math.sin(time * 1.1 + b.phase + b.x * 0.004) * 0.09;
        if (pointer.active) {
          const dx = b.x - pointer.x;
          const reach = height - b.length * 0.6 - pointer.y;
          if (Math.abs(dx) < RADIUS && reach < RADIUS) {
            const f = 1 - Math.abs(dx) / RADIUS;
            target += Math.sign(dx || 1) * f * f * 0.85;
          }
        }
        b.bend += (target - b.bend) * 0.12;
        const tipX = b.x + Math.sin(b.bend) * b.length;
        const tipY = height - Math.cos(b.bend) * b.length;
        const midX = b.x + Math.sin(b.bend * 0.5) * b.length * 0.5;
        const midY = height - b.length * 0.5;
        const light = 10 + b.tone * 10;
        ctx.strokeStyle = `hsla(95, 22%, ${light}%, ${0.55 + b.tone * 0.4})`;
        ctx.lineWidth = b.width;
        ctx.beginPath();
        ctx.moveTo(b.x, height);
        ctx.quadraticCurveTo(midX, midY, tipX, tipY);
        ctx.stroke();
      }
    };

    build();
    draw(0);

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    observer.observe(canvas);
    const resize = new ResizeObserver(() => {
      build();
      draw(0);
    });
    resize.observe(canvas);

    // El canvas no recibe eventos: el cursor se lee en la ventana y se
    // traduce a coordenadas del canvas solo cuando está encima.
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.x <= rect.width && pointer.y >= -RADIUS && pointer.y <= rect.height;
    };

    let time = 0;
    const tick = (_t: number, deltaMs: number) => {
      if (!visible || parseFloat(host.style.opacity || "1") < 0.01) return;
      time += Math.min(deltaMs, 50) / 1000;
      draw(time);
    };

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      gsap.ticker.add(tick);
    }

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      observer.disconnect();
      resize.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] w-full ${className}`}
    />
  );
}
