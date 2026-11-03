"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { Sparkles, Compass } from "lucide-react";

// ==============================================================================
// 1. CAPA GLOBAL DE IDENTIDAD DE MARCA: TEXTURA DE PAPEL + CURSOR MAGNÉTICO + HILO DE ORO
// ==============================================================================
export function BrandAmbientIdentity() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { stiffness: 420, damping: 32, mass: 0.4 });
  const smoothY = useSpring(cursorY, { stiffness: 420, damping: 32, mass: 0.4 });

  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isPointerFine, setIsPointerFine] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    setIsPointerFine(mq.matches);

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      const customEl = target?.closest("[data-cursor]") as HTMLElement | null;
      if (customEl) {
        setCursorLabel(customEl.getAttribute("data-cursor"));
      } else {
        setCursorLabel(null);
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Barra Superior de Progreso Editorial (Hilo de Oro de Amanecer) */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B85634] via-[#DDA13E] to-[#F0BA5C] origin-left z-[70] pointer-events-none"
      />

      {/* Grano Analógico Cinematográfico Sutil (0% GPU Load) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Cursor Magnético de Galería (Solo en Desktop con puntero fino) */}
      {isPointerFine && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="pointer-events-none fixed top-0 left-0 z-[80] hidden lg:flex items-center justify-center"
        >
          <div
            className={`rounded-full flex items-center justify-center transition-all duration-300 ${
              cursorLabel
                ? "w-24 h-24 bg-[#16110C]/95 text-[#DDA13E] border border-[#DDA13E]/70 backdrop-blur-md shadow-2xl scale-100"
                : "w-7 h-7 border border-[#DDA13E]/55 bg-[#DDA13E]/10 scale-100"
            }`}
          >
            {cursorLabel ? (
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-center px-2 leading-tight">
                {cursorLabel}
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-[#DDA13E]" />
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}

// ==============================================================================
// 2. CINTA TIPOGRÁFICA CINÉTICA REACTIVA A LA VELOCIDAD DEL SCROLL
// ==============================================================================
export function KineticBrandMarquee({
  items = [
    "PASTOREO DE ALTURA EN TURRIALBA",
    "ORDEÑO MATINAL SIN PRISA",
    "AFINACIÓN EN ROBLE Y HUMO DE GUAYABO",
    "MAESTROS QUESEROS DESDE 1980",
    "100% LECHE ENTERA COSTARRICENSE",
  ],
  theme = "dark",
  baseVelocity = -2.2,
}: {
  items?: string[];
  theme?: "dark" | "light" | "terracotta";
  baseVelocity?: number;
}) {
  const baseX = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 3.5], {
    clamp: false,
  });

  const directionFactor = useRef<number>(1);

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    let next = baseX.get() + moveBy;
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    baseX.set(next);
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  const themeClasses =
    theme === "dark"
      ? "bg-[#0B120E] text-[#F7F4EC] border-y border-white/10"
      : theme === "terracotta"
      ? "bg-gradient-to-r from-[#26150D] via-[#3A1E12] to-[#26150D] text-[#F7F4EC] border-y border-[#DDA13E]/30"
      : "bg-[#16110C] text-[#F7F4EC] border-y border-white/10";

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`relative overflow-hidden py-4 sm:py-5 select-none ${themeClasses}`}
    >
      <motion.div
        style={{ x }}
        className="flex items-center whitespace-nowrap gap-8 sm:gap-12 w-max"
      >
        {repeated.map((text, idx) => (
          <div key={idx} className="inline-flex items-center gap-8 sm:gap-12">
            <span className="font-serif italic text-xl sm:text-2xl md:text-3xl tracking-wide font-medium text-[#F7F4EC]">
              {text}
            </span>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#DDA13E]/50 text-[#DDA13E]">
              <Sparkles className="w-3 h-3" />
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ==============================================================================
// 3. DIVISOR BOTÁNICO & EMBLEMA HERÁLDICO DE FINCA (ENTRE SECCIONES)
// ==============================================================================
export function ArtisanalCrestDivider({
  subtitle = "Patrimonio Lácteo Costarricense",
  title = "Hecho con el tiempo que la industria olvidó.",
}: {
  subtitle?: string;
  title?: string;
}) {
  return (
    <div className="relative py-16 sm:py-20 px-4 bg-[#0D1510] border-t border-white/10 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#DDA13E]/60" />
          <div className="w-11 h-11 rounded-full border border-[#DDA13E]/40 bg-[#DDA13E]/10 flex items-center justify-center text-[#DDA13E] shadow-lg">
            <Compass className="w-5 h-5" />
          </div>
          <span className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#DDA13E]/60" />
        </div>

        <p className="font-mono text-2xs uppercase tracking-[0.3em] text-[#DDA13E] font-bold">
          {subtitle}
        </p>

        <h3 className="font-serif text-2xl sm:text-4xl text-[#F7F4EC] italic font-normal max-w-2xl mx-auto leading-snug">
          “{title}”
        </h3>
      </div>
    </div>
  );
}
