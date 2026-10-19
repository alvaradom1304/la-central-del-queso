"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { acquireRuntime, releaseRuntime, damp } from "@/lib/award/runtime";

/**
 * Revelados al hacer scroll y titular final que responde al puntero.
 * - Todo es visible sin JS. Solo se ocultan (gsap.set) los elementos que aún están por debajo del
 *   pliegue al montar, y se revelan al entrar en vista: nunca hay contenido que dependa de animar.
 * - Con movimiento reducido o pausa no se oculta nada.
 * - Un único reloj (gsap.ticker vía runtime) y limpieza completa al desmontar.
 */
export default function Reveals() {
  useEffect(() => {
    const rt = acquireRuntime();
    if (rt.reduced) return () => releaseRuntime();
    gsap.registerPlugin(ScrollTrigger);

    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;
    const ctx = gsap.context(() => {
      // Titulares de sección: barrido de máscara desde abajo.
      gsap.utils.toArray<HTMLElement>(".aw-section .aw-h2, .aw-final__title").filter(below).forEach((el) => {
        gsap.set(el, { clipPath: "inset(0 0 100% 0)", y: 40 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.to(el, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1, ease: "expo.out", clearProps: "clipPath" }),
        });
      });
      // Bloques: entrada escalonada por lotes.
      const blocks = gsap.utils
        .toArray<HTMLElement>(".aw-head .aw-eyebrow, .aw-head .aw-body, .aw-board__filters, .aw-row, .aw-calc__form > *, .aw-ticket, .aw-feria, .aw-final .aw-body, .aw-final .aw-actions")
        .filter(below);
      gsap.set(blocks, { opacity: 0, y: 36 });
      ScrollTrigger.batch(blocks, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.85, ease: "expo.out", stagger: 0.07, overwrite: true }),
      });
    });

    // Titular final: se desplaza con el puntero (dueño único de su transform; sin setState).
    const finalTitle = document.querySelector<HTMLElement>(".aw-final__title");
    const s = { x: 0, y: 0 };
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (finalTitle) io.observe(finalTitle);
    const off = rt.subscribe((dt) => {
      if (!finalTitle || !visible || rt.reduced) return;
      const amp = rt.pointer.coarse ? 6 : 22;
      s.x = damp(s.x, rt.pointer.x * amp, 5, dt);
      s.y = damp(s.y, -rt.pointer.y * amp * 0.4, 5, dt);
      finalTitle.style.translate = `${s.x.toFixed(2)}px ${s.y.toFixed(2)}px`;
    });

    const offMotion = rt.onMotionChange((reduced) => {
      if (!reduced) return;
      // Pausa o preferencia activada a mitad: todo visible y quieto.
      ctx.revert();
      finalTitle?.style.removeProperty("translate");
    });

    return () => {
      off();
      offMotion();
      io.disconnect();
      ctx.revert();
      finalTitle?.style.removeProperty("translate");
      releaseRuntime();
    };
  }, []);
  return null;
}
