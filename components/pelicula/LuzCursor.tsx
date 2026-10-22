"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Un punto de luz cálida acompaña al puntero; sobre controles se abre en un
// anillo y sobre zonas con data-cursor muestra una indicación. No reemplaza
// el cursor del sistema. Solo con ratón y sin «reducir movimiento».

const CONTROLES = "a, button, input, textarea, select, label";

export default function LuzCursor() {
  const [activo, setActivo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const etiquetaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setActivo(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!activo) return;
    const luz = ref.current;
    const etiqueta = etiquetaRef.current;
    if (!luz || !etiqueta) return;

    const objetivo = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const actual = { ...objetivo };
    let texto = "";

    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      objetivo.x = e.clientX;
      objetivo.y = e.clientY;
      luz.style.opacity = "1";
    };
    const sobre = (e: PointerEvent) => {
      const destino = e.target instanceof Element ? e.target : null;
      const control = destino?.closest(CONTROLES);
      const zona = destino?.closest<HTMLElement>("[data-cursor]");
      if (control) luz.dataset.sobre = "";
      else delete luz.dataset.sobre;
      const nuevo = control ? "" : zona?.dataset.cursor ?? "";
      if (nuevo !== texto) {
        texto = nuevo;
        etiqueta.textContent = texto;
      }
    };
    const salir = () => {
      luz.style.opacity = "0";
    };
    // Interpolación por tiempo: igual a 60 y a 120 Hz.
    const tick = (_t: number, deltaMs: number) => {
      // Quieto (ya llegó al puntero): no se escribe nada.
      if (Math.abs(objetivo.x - actual.x) < 0.1 && Math.abs(objetivo.y - actual.y) < 0.1) return;
      const a = 1 - Math.exp(-20 * Math.min(deltaMs / 1000, 0.05));
      actual.x += (objetivo.x - actual.x) * a;
      actual.y += (objetivo.y - actual.y) * a;
      luz.style.transform = `translate3d(${actual.x.toFixed(1)}px, ${actual.y.toFixed(1)}px, 0)`;
    };

    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("pointerover", sobre, { passive: true });
    document.documentElement.addEventListener("pointerleave", salir);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerover", sobre);
      document.documentElement.removeEventListener("pointerleave", salir);
      gsap.ticker.remove(tick);
    };
  }, [activo]);

  if (!activo) return null;
  return (
    <div ref={ref} className="cine-luz-cursor" aria-hidden="true">
      <span ref={etiquetaRef} />
    </div>
  );
}
