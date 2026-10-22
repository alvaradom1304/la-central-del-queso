"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Capas de atmósfera del campo, todas decorativas: neblina y rayos (CSS) y
// polen flotando en la luz (canvas 2D). Con «reducir movimiento» quedan
// quietas o no se dibujan.

export function Neblina({ className = "" }: { className?: string }) {
  return (
    <div className={`cine-neblina ${className}`} aria-hidden="true">
      <span />
      <span />
    </div>
  );
}

export function Rayos() {
  return <div className="cine-rayos" aria-hidden="true" />;
}

interface Mota {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  fase: number;
}

/**
 * Polen: motas de luz que derivan despacio y se apartan un poco del puntero.
 * Un único tick de gsap; se detiene fuera de pantalla y en pestañas ocultas.
 */
export function Polen({ densidad = 1, dprMax = 1.5 }: { densidad?: number; dprMax?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let motas: Mota[] = [];
    let ancho = 0;
    let alto = 0;
    let visible = false;
    const puntero = { x: -9999, y: -9999 };

    const medir = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, dprMax);
      ancho = r.width;
      alto = r.height;
      canvas.width = Math.max(1, Math.round(ancho * dpr));
      canvas.height = Math.max(1, Math.round(alto * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cantidad = Math.min(90, Math.round(((ancho * alto) / 16000) * densidad));
      motas = Array.from({ length: cantidad }, () => ({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.3) * 8,
        vy: -2 - Math.random() * 6,
        fase: Math.random() * Math.PI * 2,
      }));
    };

    // Solo mide el lienzo cuando está a la vista.
    const mover = (e: PointerEvent) => {
      if (!visible) return;
      const r = canvas.getBoundingClientRect();
      puntero.x = e.clientX - r.left;
      puntero.y = e.clientY - r.top;
    };

    const tick = (t: number, deltaMs: number) => {
      if (!visible) return;
      const dt = Math.min(deltaMs / 1000, 0.05);
      ctx.clearRect(0, 0, ancho, alto);
      for (const m of motas) {
        const dx = m.x - puntero.x;
        const dy = m.y - puntero.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) {
          const f = (1 - Math.sqrt(d2) / 120) * 60 * dt;
          m.x += (dx / (Math.sqrt(d2) + 0.01)) * f;
          m.y += (dy / (Math.sqrt(d2) + 0.01)) * f;
        }
        m.x += (m.vx + Math.sin(t * 0.6 + m.fase) * 6) * dt;
        m.y += m.vy * dt;
        if (m.y < -10) m.y = alto + 10;
        if (m.x < -10) m.x = ancho + 10;
        if (m.x > ancho + 10) m.x = -10;
        const brillo = 0.35 + 0.35 * Math.sin(t * 1.4 + m.fase);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 228, 176, ${brillo.toFixed(3)})`;
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    const redimension = new ResizeObserver(medir);
    medir();
    observer.observe(canvas);
    redimension.observe(canvas);
    window.addEventListener("pointermove", mover, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      observer.disconnect();
      redimension.disconnect();
      window.removeEventListener("pointermove", mover);
      gsap.ticker.remove(tick);
      canvas.width = 0;
      canvas.height = 0;
    };
  }, [densidad, dprMax]);

  return <canvas ref={ref} className="cine-polen" aria-hidden="true" />;
}
