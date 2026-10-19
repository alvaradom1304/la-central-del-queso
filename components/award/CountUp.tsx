"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getRuntime } from "@/lib/award/runtime";

/**
 * Número que cuenta hasta su nuevo valor. React solo pinta el valor inicial; después el tween
 * escribe el texto directamente (sin setState por frame). Con movimiento reducido, salto directo.
 */
export default function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [initial] = useState(value);
  const shown = useRef({ v: value });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = getRuntime()?.reduced ?? true;
    if (reduced) {
      shown.current.v = value;
      el.textContent = format(value);
      return;
    }
    const tween = gsap.to(shown.current, {
      v: value,
      duration: 0.7,
      ease: "power3.out",
      onUpdate: () => { el.textContent = format(Math.round(shown.current.v)); },
    });
    return () => { tween.kill(); };
  }, [value, format]);

  return <span ref={ref}>{format(initial)}</span>;
}
