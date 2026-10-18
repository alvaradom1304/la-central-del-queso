"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sparkles, RotateCcw, Hand, Plus } from "lucide-react";

interface PhysicsBody {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  vRot: number;
  type: "seal" | "medal" | "cheese" | "milkCan";
  label: string;
  color: string;
}

const EXTRA_SPAWNS: Array<Pick<PhysicsBody, "type" | "label" | "color" | "radius">> = [
  { type: "cheese", label: "PALMITO", color: "#DDA13E", radius: 38 },
  { type: "seal", label: "FINCA 1980", color: "#B85634", radius: 34 },
  { type: "medal", label: "NATILLA", color: "#2E5C43", radius: 33 },
  { type: "cheese", label: "MADURO", color: "#9E4718", radius: 39 },
  { type: "milkCan", label: "1.200m", color: "#4B6B56", radius: 35 },
];

export function InteractiveArtisanalPhysics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const isDraggingRef = useRef<number | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const [activeItemCount, setActiveItemCount] = useState(6);

  const initBodies = (width: number) => {
    const bodies: PhysicsBody[] = [
      {
        id: 1,
        x: width * 0.18,
        y: 60,
        vx: 1.5,
        vy: 0,
        radius: 36,
        rotation: 0.1,
        vRot: 0.02,
        type: "seal",
        label: "1980",
        color: "#7A2E1D",
      },
      {
        id: 2,
        x: width * 0.34,
        y: 40,
        vx: -1.2,
        vy: 0,
        radius: 34,
        rotation: -0.2,
        vRot: -0.015,
        type: "medal",
        label: "ORO",
        color: "#DDA13E",
      },
      {
        id: 3,
        x: width * 0.5,
        y: 80,
        vx: 2.0,
        vy: 0,
        radius: 42,
        rotation: 0.3,
        vRot: 0.03,
        type: "cheese",
        label: "SEMIDURO",
        color: "#C88A2E",
      },
      {
        id: 4,
        x: width * 0.68,
        y: 50,
        vx: -0.8,
        vy: 0,
        radius: 35,
        rotation: 0.05,
        vRot: -0.01,
        type: "milkCan",
        label: "34°C",
        color: "#2E5C43",
      },
      {
        id: 5,
        x: width * 0.28,
        y: 110,
        vx: 1.1,
        vy: 0,
        radius: 32,
        rotation: 0.4,
        vRot: 0.02,
        type: "seal",
        label: "TURRIALBA",
        color: "#9E4718",
      },
      {
        id: 6,
        x: width * 0.62,
        y: 130,
        vx: -1.4,
        vy: 0,
        radius: 38,
        rotation: -0.15,
        vRot: -0.02,
        type: "cheese",
        label: "AHUMADO",
        color: "#B85634",
      },
    ];
    bodiesRef.current = bodies;
    setActiveItemCount(bodies.length);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (bodiesRef.current.length === 0) {
        initBodies(rect.width);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const GRAVITY = 0.42;
    const BOUNCE = 0.68;
    const FRICTION = 0.985;

    const loop = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, w, h);

      // Cuadrícula sutil dorada sobre madera oscura
      ctx.strokeStyle = "rgba(221, 161, 62, 0.07)";
      ctx.lineWidth = 1;
      const step = 36;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      const bodies = bodiesRef.current;
      const draggedId = isDraggingRef.current;

      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];

        if (draggedId === b.id) {
          const targetX = mousePosRef.current.x;
          const targetY = mousePosRef.current.y;
          b.vx = (targetX - b.x) * 0.28;
          b.vy = (targetY - b.y) * 0.28;
          b.x += b.vx;
          b.y += b.vy;
          b.vRot = b.vx * 0.01;
          b.rotation += b.vRot;
        } else {
          b.vy += GRAVITY;
          b.vx *= FRICTION;
          b.vy *= FRICTION;
          b.x += b.vx;
          b.y += b.vy;
          b.rotation += b.vRot;
          b.vRot *= 0.99;
        }

        if (b.y + b.radius > h) {
          b.y = h - b.radius;
          b.vy = -b.vy * BOUNCE;
          b.vx *= 0.92;
        }
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx = -b.vx * BOUNCE;
        }
        if (b.x + b.radius > w) {
          b.x = w - b.radius;
          b.vx = -b.vx * BOUNCE;
        }

        for (let j = i + 1; j < bodies.length; j++) {
          const b2 = bodies[j];
          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.hypot(dx, dy);
          const minDist = b.radius + b2.radius;

          if (dist < minDist && dist > 0.01) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            b.x -= nx * overlap * 0.5;
            b.y -= ny * overlap * 0.5;
            b2.x += nx * overlap * 0.5;
            b2.y += ny * overlap * 0.5;

            const kx = b.vx - b2.vx;
            const ky = b.vy - b2.vy;
            const p = (2 * (nx * kx + ny * ky)) / 2;

            b.vx -= p * nx * 0.65;
            b.vy -= p * ny * 0.65;
            b2.vx += p * nx * 0.65;
            b2.vy += p * ny * 0.65;
          }
        }
      }

      for (const b of bodies) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);

        ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;

        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#F7F4EC";
        ctx.stroke();

        ctx.shadowColor = "transparent";

        ctx.beginPath();
        ctx.arc(0, 0, b.radius - 6, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "#FFFDF9";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.label, 0, 0);

        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const b of bodiesRef.current) {
      if (Math.hypot(x - b.x, y - b.y) <= b.radius) {
        isDraggingRef.current = b.id;
        mousePosRef.current = { x, y };
        prevMousePosRef.current = { x, y };
        e.currentTarget.setPointerCapture(e.pointerId);
        break;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    prevMousePosRef.current = mousePosRef.current;
    mousePosRef.current = { x, y };
  };

  const handlePointerUp = () => {
    if (isDraggingRef.current !== null) {
      const b = bodiesRef.current.find((item) => item.id === isDraggingRef.current);
      if (b) {
        b.vx = (mousePosRef.current.x - prevMousePosRef.current.x) * 0.85;
        b.vy = (mousePosRef.current.y - prevMousePosRef.current.y) * 0.85;
      }
      isDraggingRef.current = null;
    }
  };

  const handleSpawnPiece = () => {
    const canvas = canvasRef.current;
    if (!canvas || bodiesRef.current.length >= 14) return;
    const rect = canvas.getBoundingClientRect();
    const tpl = EXTRA_SPAWNS[bodiesRef.current.length % EXTRA_SPAWNS.length];
    const nextBody: PhysicsBody = {
      id: Date.now() + Math.random(),
      x: rect.width * (0.25 + Math.random() * 0.5),
      y: 35,
      vx: (Math.random() - 0.5) * 4,
      vy: 1,
      radius: tpl.radius,
      rotation: Math.random(),
      vRot: (Math.random() - 0.5) * 0.05,
      type: tpl.type,
      label: tpl.label,
      color: tpl.color,
    };
    bodiesRef.current.push(nextBody);
    setActiveItemCount(bodiesRef.current.length);
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    initBodies(rect.width);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/15 bg-[#16110C] shadow-2xl p-6 sm:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DDA13E]/15 border border-[#DDA13E]/40 flex items-center justify-center text-[#DDA13E]">
            <Hand className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-semibold text-[#F7F4EC] text-xl sm:text-2xl">
              Mesa Lúdica de Físicas: Sellos de Finca & Hormas
            </h4>
            <p className="text-xs text-[#F7F4EC]/65">
              Agarre con el cursor o su dedo, lance y apile las hormas y sellos de 1980 con gravedad
              real.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSpawnPiece}
            data-cursor="SOLTAR HORMA"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#DDA13E] text-[#0D1510] text-xs font-bold hover:bg-[#F0BA5C] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Soltar Horma (+1)</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-[#F7F4EC] hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#DDA13E]" />
            <span>Reiniciar ({activeItemCount})</span>
          </button>
        </div>
      </div>

      <div
        data-cursor="AGARRAR"
        className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-[#0E0A07] border border-white/10 touch-none"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
        <div className="pointer-events-none absolute bottom-3 left-4 text-[11px] font-mono text-[#F7F4EC]/55 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#DDA13E]" />
          <span>Motor de colisiones 2D a 120 FPS · Arrastre y lance cualquier sello</span>
        </div>
      </div>
    </div>
  );
}
