"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Runtime de movimiento de la portada (estándar award-grade-web del laboratorio Altiora).
 * - Un único reloj: gsap.ticker. ScrollTrigger también corre sobre él.
 * - Los componentes registran actualizadores con subscribe(); nadie crea su propio rAF.
 * - Nada de setState por frame: cada actualizador escribe en refs/DOM/three.
 * - Se cuenta por referencias para sobrevivir al doble montaje de React en desarrollo.
 */

export const MAX_DT = 0.05;

/** alpha = 1 - exp(-lambda * dt): misma sensación a 60 y 120 Hz. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * Math.min(dt, MAX_DT)));
}

export const clamp = (v: number, min = -1, max = 1) => Math.min(max, Math.max(min, v));

export interface PointerState {
  /** Objetivo normalizado a [-1, 1] respecto al viewport (+y arriba). */
  x: number;
  y: number;
  /** Píxeles del último evento (para efectos locales). */
  px: number;
  py: number;
  active: boolean;
  coarse: boolean;
}

type Updater = (dt: number, time: number) => void;

interface Runtime {
  pointer: PointerState;
  /** true si el sistema pide menos movimiento o el usuario pausó (WCAG 2.2.2). */
  reduced: boolean;
  userPaused: boolean;
  setUserPaused(paused: boolean): void;
  subscribe(fn: Updater): () => void;
  onMotionChange(fn: (reduced: boolean) => void): () => void;
}

let runtime: Runtime | null = null;
let refs = 0;
let teardown: (() => void) | null = null;

function create(): Runtime {
  gsap.registerPlugin(ScrollTrigger);
  const params = new URLSearchParams(window.location.search);
  // Solo pruebas: ?debug&forcemotion ignora prefers-reduced-motion.
  const forceMotion = params.has("forcemotion") && params.has("debug");
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarseQuery = window.matchMedia("(pointer: coarse)");
  const ac = new AbortController();
  const { signal } = ac;

  const pointer: PointerState = { x: 0, y: 0, px: -1e4, py: -1e4, active: false, coarse: coarseQuery.matches };
  const updaters = new Set<Updater>();
  const motionListeners = new Set<(r: boolean) => void>();

  let systemReduced = reducedQuery.matches && !forceMotion;
  let userPaused = false;
  try { userPaused = sessionStorage.getItem("aw-paused") === "1"; } catch {}
  const apply = () => {
    rt.reduced = systemReduced || userPaused;
    rt.userPaused = userPaused;
    document.documentElement.classList.toggle("aw-paused", userPaused);
    motionListeners.forEach((fn) => fn(rt.reduced));
    sync();
  };

  const rt: Runtime = {
    pointer,
    reduced: systemReduced || userPaused,
    userPaused,
    setUserPaused(paused) {
      userPaused = paused;
      try { sessionStorage.setItem("aw-paused", paused ? "1" : "0"); } catch {}
      apply();
    },
    subscribe(fn) {
      updaters.add(fn);
      sync();
      return () => {
        updaters.delete(fn);
        sync();
      };
    },
    onMotionChange(fn) {
      motionListeners.add(fn);
      return () => motionListeners.delete(fn);
    },
  };

  const setFromClient = (cx: number, cy: number) => {
    pointer.px = cx;
    pointer.py = cy;
    pointer.x = clamp((cx / window.innerWidth) * 2 - 1);
    pointer.y = clamp(1 - (cy / window.innerHeight) * 2);
  };
  const rest = () => {
    pointer.x = pointer.y = 0;
    pointer.px = pointer.py = -1e4;
    pointer.active = false;
  };
  window.addEventListener("pointermove", (e) => { setFromClient(e.clientX, e.clientY); pointer.active = true; }, { passive: true, signal });
  window.addEventListener("pointerdown", (e) => setFromClient(e.clientX, e.clientY), { passive: true, signal });
  window.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") rest(); }, { passive: true, signal });
  window.addEventListener("pointercancel", rest, { passive: true, signal });
  document.documentElement.addEventListener("pointerleave", rest, { passive: true, signal });
  window.addEventListener("blur", rest, { signal });
  // Teclado: el foco en [data-attract] atrae la escena igual que el hover.
  document.addEventListener("focusin", (e) => {
    const el = e.target instanceof Element ? e.target.closest("[data-attract]") : null;
    if (!el || !el.matches(":focus-visible")) return;
    const r = el.getBoundingClientRect();
    setFromClient(r.left + r.width / 2, r.top + r.height / 2);
    pointer.active = true;
  }, { signal });
  document.addEventListener("focusout", (e) => {
    if (e.target instanceof Element && e.target.closest("[data-attract]")) rest();
  }, { signal });
  coarseQuery.addEventListener("change", (e) => (pointer.coarse = e.matches), { signal });
  reducedQuery.addEventListener("change", (e) => {
    systemReduced = e.matches && !forceMotion;
    apply();
  }, { signal });
  document.documentElement.classList.toggle("aw-paused", userPaused);
  document.addEventListener("visibilitychange", () => sync(), { signal });

  let running = false;
  const tick = (time: number, deltaMs: number) => {
    const dt = deltaMs / 1000;
    updaters.forEach((fn) => fn(dt, time));
  };
  function sync() {
    const should = updaters.size > 0 && !document.hidden;
    if (should === running) return;
    running = should;
    if (running) gsap.ticker.add(tick);
    else gsap.ticker.remove(tick);
  }

  teardown = () => {
    document.documentElement.classList.remove("aw-paused");
    gsap.ticker.remove(tick);
    running = false;
    ac.abort();
    updaters.clear();
    motionListeners.clear();
  };
  return rt;
}

/** Obtiene el runtime y suma una referencia. Llamar a release() al desmontar. */
export function acquireRuntime(): Runtime {
  if (!runtime) runtime = create();
  refs++;
  return runtime;
}

export function releaseRuntime() {
  refs = Math.max(0, refs - 1);
  if (refs === 0 && runtime) {
    teardown?.();
    teardown = null;
    runtime = null;
  }
}

export function getRuntime(): Runtime | null {
  return runtime;
}
