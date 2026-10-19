"use client";

import { gsap } from "gsap";
import { getRuntime } from "./runtime";

/**
 * Continuidad: una cuña vuela desde `from` hasta el contador del pedido y lo hace latir.
 * Decorativa (aria-hidden), no mueve el foco. Sin vuelo con movimiento reducido o pausa.
 */
export function flyWedgeToCart(from: DOMRect | undefined) {
  const to = document.querySelector(".aw-bar__count")?.getBoundingClientRect();
  const reduced = getRuntime()?.reduced ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bump = () => {
    const badge = document.querySelector<HTMLElement>(".aw-bar__count");
    if (!badge) return;
    badge.classList.remove("is-bump");
    void badge.offsetWidth;
    badge.classList.add("is-bump");
  };
  if (!from || !to || reduced) {
    bump();
    return;
  }
  const el = document.createElement("span");
  el.className = "aw-fly";
  el.setAttribute("aria-hidden", "true");
  el.style.left = `${from.left + from.width / 2 - 15}px`;
  el.style.top = `${from.top + from.height / 2 - 12}px`;
  document.body.appendChild(el);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  gsap.timeline({ onComplete: () => el.remove() })
    .to(el, { x: dx * 0.55, y: dy * 0.55 - 80, rotation: 160, duration: 0.38, ease: "power2.out" })
    .to(el, { x: dx, y: dy, rotation: 300, scale: 0.35, duration: 0.34, ease: "power2.in" })
    .add(bump);
}
