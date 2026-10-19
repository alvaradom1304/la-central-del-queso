"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { acquireRuntime, releaseRuntime, damp } from "@/lib/award/runtime";
import { createSmokeFluid, type SmokeFluid } from "./smokeFluid";

/**
 * Entrada a la finca: el portón de madera se abre solo y el scroll avanza la secuencia
 * (portón → camino → potrero → lechería → recepción) como si fuera un video.
 * Encima corre el humo: neblina que se aparta con el cursor y vapor en la lechería.
 *
 * - Texto en DOM (lista ordenada): los lectores de pantalla leen el recorrido completo.
 * - Movimiento reducido o pausa: el portón se desvanece sin girar, sin humo, y la secuencia salta
 *   a un fotograma fijo por tramo.
 * - Sin JS: póster estático y el primer texto. Sin WebGL2: neblina CSS que sigue al cursor.
 * - Un solo reloj (subscribe del runtime) y pausa fuera de pantalla.
 */

const FRAMES = 150;
const frameUrl = (variant: "desktop" | "mobile", i: number) =>
  `/frames/finca/v1/${variant}/f_${String(i + 1).padStart(4, "0")}.webp`;

type RGB = readonly [number, number, number];
const WARM: RGB = [1, 0.93, 0.8];
const MIST: RGB = [0.86, 0.9, 0.9];
const STEAM: RGB = [1, 1, 0.98];

interface Ambient {
  every: number;
  amount: number;
  radius: number;
  color: RGB;
  emit: () => [x: number, y: number, vx: number, vy: number];
}
const rand = (a: number, b: number) => a + Math.random() * (b - a);

const TRAMOS: {
  id: string;
  start: number;
  end: number;
  kicker: string;
  title: string;
  text: string;
  dissipation: number;
  ambient: Ambient;
  pointer: RGB;
}[] = [
  {
    id: "porton", start: 0, end: 0.219,
    kicker: "El portón", title: "Bienvenido a la finca",
    text: "Pase adelante: así empieza el camino del queso hasta su mesa.",
    dissipation: 0.9, pointer: WARM,
    ambient: { every: 0.45, amount: 0.035, radius: 3, color: WARM, emit: () => [rand(0, 1), rand(0.04, 0.22), rand(-0.12, 0.12), rand(0.02, 0.1)] },
  },
  {
    id: "camino", start: 0.219, end: 0.406,
    kicker: "El camino", title: "Entre neblina y verde",
    text: "La finca amanece despacio. Siga bajando por el camino.",
    dissipation: 0.75, pointer: MIST,
    ambient: { every: 0.22, amount: 0.045, radius: 3.4, color: MIST, emit: () => [rand(-0.05, 1.05), rand(0.25, 0.6), rand(0.08, 0.22), rand(-0.02, 0.04)] },
  },
  {
    id: "potrero", start: 0.406, end: 0.594,
    kicker: "El potrero", title: "Donde empieza todo",
    text: "Del pasto a la leche, de la leche al queso.",
    dissipation: 0.9, pointer: MIST,
    ambient: { every: 0.4, amount: 0.035, radius: 3, color: MIST, emit: () => [rand(0, 1), rand(0.05, 0.3), rand(-0.1, 0.1), rand(0.02, 0.08)] },
  },
  {
    id: "puerta", start: 0.594, end: 0.781,
    kicker: "La lechería", title: "Pase, la puerta está abierta",
    text: "Adentro, la leche se convierte en queso.",
    dissipation: 0.85, pointer: WARM,
    ambient: { every: 0.3, amount: 0.035, radius: 2.2, color: WARM, emit: () => [rand(0.4, 0.6), rand(0.25, 0.5), rand(-0.05, 0.05), rand(0.06, 0.16)] },
  },
  {
    id: "lecheria", start: 0.781, end: 1,
    kicker: "La mesa", title: "La mesa está lista",
    text: "Abajo están los quesos de la semana. Elija los suyos y le preparamos el pedido.",
    dissipation: 0.55, pointer: STEAM,
    // Vapor de la paila: sube desde el centro del fotograma.
    ambient: { every: 0.09, amount: 0.06, radius: 1.3, color: STEAM, emit: () => [rand(0.4, 0.68), rand(0.42, 0.55), rand(-0.06, 0.06), rand(0.35, 0.7)] },
  },
];

const tramoAt = (p: number) => {
  for (let i = TRAMOS.length - 1; i >= 0; i--) if (p >= TRAMOS[i].start) return i;
  return 0;
};
/** Con movimiento reducido: un fotograma fijo y representativo por tramo. */
const stillFor = (p: number) => {
  const t = TRAMOS[tramoAt(p)];
  return t.start + (t.end - t.start) * 0.6;
};
const pickVariant = () => (window.innerWidth / Math.max(1, window.innerHeight) < 0.9 ? "mobile" : "desktop");

export default function FincaIntro() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
    const sticky = q<HTMLDivElement>(".aw-finca__sticky");
    const view = q<HTMLDivElement>(".aw-finca__view");
    const framesCanvas = q<HTMLCanvasElement>(".aw-finca__frames");
    const smokeCanvas = q<HTMLCanvasElement>(".aw-finca__smoke");
    const bar = q<HTMLSpanElement>(".aw-finca__bar span");
    const caps = Array.from(root.querySelectorAll<HTMLLIElement>(".aw-finca__cap"));
    const ticks = Array.from(root.querySelectorAll<HTMLSpanElement>(".aw-finca__tick"));
    const leafL = q<HTMLDivElement>(".aw-gate__leaf--l");
    const leafR = q<HTMLDivElement>(".aw-gate__leaf--r");
    const sign = q<HTMLDivElement>(".aw-gate__sign");
    const light = q<HTMLDivElement>(".aw-gate__light");
    const gateEl = q<HTMLDivElement>(".aw-gate");
    const ctx2d = framesCanvas.getContext("2d", { alpha: false });
    const params = new URLSearchParams(window.location.search);
    const rt = acquireRuntime();
    const pointer = rt.pointer;
    let destroyed = false;
    let inView = true;

    // --- Secuencia de fotogramas -------------------------------------------------
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const stride = connection?.saveData ? 3 : 1;
    let variant: "desktop" | "mobile" = pickVariant();
    let images: (HTMLImageElement | undefined)[] = [];
    let loadGen = 0;
    let loadedCount = 0;
    const loadAll = () => {
      const gen = ++loadGen;
      images = new Array(FRAMES);
      loadedCount = 0;
      // Primero fotogramas clave repartidos por todo el recorrido; después se rellenan los huecos.
      const order: number[] = [];
      const seen = new Set<number>();
      for (const step of [30, 10, 5, 2, 1]) {
        for (let i = 0; i < FRAMES; i += step) {
          if (i % stride || seen.has(i)) continue;
          seen.add(i);
          order.push(i);
        }
      }
      if (!seen.has(FRAMES - 1)) order.splice(1, 0, FRAMES - 1);
      let cursor = 0;
      let active = 0;
      const pump = () => {
        while (active < 4 && cursor < order.length) {
          const i = order[cursor++];
          active++;
          const img = new Image();
          img.decoding = "async";
          img.src = frameUrl(variant, i);
          img
            .decode()
            .then(() => {
              if (gen !== loadGen || destroyed) return;
              images[i] = img;
              loadedCount++;
            })
            .catch(() => {})
            .finally(() => {
              active--;
              if (gen === loadGen && !destroyed) pump();
            });
        }
      };
      pump();
    };
    loadAll();

    const nearest = (i: number) => {
      for (let d = 0; d < FRAMES; d++) {
        if (images[i - d]) return i - d;
        if (images[i + d]) return i + d;
      }
      return -1;
    };
    let drawn = -1;
    let needsDraw = true;
    const draw = (i: number) => {
      const img = images[i];
      if (!img || !ctx2d) return;
      const cw = framesCanvas.width;
      const ch = framesCanvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx2d.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    // --- Humo ---------------------------------------------------------------------
    let smoke: SmokeFluid | null = null;
    if (!params.has("nowebgl")) {
      try {
        smoke = createSmokeFluid(smokeCanvas, {
          // Equipos modestos (pocos núcleos): menos resolución para conservar el ritmo.
          dyeResolution: (navigator.hardwareConcurrency ?? 8) <= 4 ? 320 : 448,
        });
      } catch {
        smoke = null;
      }
    }
    root.dataset.smoke = smoke ? "on" : "off";
    let burst = 0;
    let ambientT = 0;
    let last = { x: -1, y: -1 };
    let mistX = -1;
    let mistY = -1;

    // --- Tamaño -----------------------------------------------------------------------
    let size = { w: 1, h: 1 };
    const resize = () => {
      const r = sticky.getBoundingClientRect();
      size = { w: r.width, h: r.height };
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      framesCanvas.width = Math.round(r.width * dpr);
      framesCanvas.height = Math.round(r.height * dpr);
      needsDraw = true;
      smoke?.resize(r.width, r.height);
      const next = pickVariant();
      if (next !== variant) {
        variant = next;
        drawn = -1;
        loadAll();
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(sticky);
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting), { rootMargin: "80px 0px" });
    io.observe(root);

    // --- Portón ---------------------------------------------------------------------
    const cam = { push: 1.14 };
    let gate: "closed" | "opening" | "open" = "closed";
    const setGate = (g: typeof gate) => {
      gate = g;
      root.dataset.gate = g;
    };
    let gateTl: gsap.core.Timeline | null = null;
    let gateSafety = 0;
    const finishGate = () => {
      setGate("open");
      cam.push = 1.04;
    };
    const ctx = gsap.context(() => {}, root);
    const openGate = () => {
      if (gate !== "closed" || destroyed) return;
      setGate("opening");
      if (rt.reduced) {
        // Sin giro ni empuje: un fundido (cambio de opacidad, no movimiento).
        ctx.add(() => {
          gateTl = gsap.timeline({ onComplete: finishGate }).fromTo(gateEl, { opacity: 1 }, { opacity: 0, duration: 0.8, ease: "power1.inOut" }, 0.2);
        });
        gateSafety = window.setTimeout(() => gateTl?.progress(1), 3000);
        return;
      }
      ctx.add(() => {
        gateTl = gsap
          .timeline({ onComplete: finishGate })
          .fromTo(light, { opacity: 0, scaleX: 0.3 }, { opacity: 1, scaleX: 1, duration: 0.45, ease: "power2.out" }, 0)
          .fromTo(sign, { opacity: 1, y: 0 }, { opacity: 0, y: -28, duration: 0.6, ease: "power2.in" }, 0.15)
          .fromTo(leafL, { rotateY: 0 }, { rotateY: 96, duration: 2.3, ease: "power3.inOut" }, 0.35)
          .fromTo(leafR, { rotateY: 0 }, { rotateY: -96, duration: 2.3, ease: "power3.inOut" }, 0.35)
          .fromTo(cam, { push: 1.14 }, { push: 1.04, duration: 3, ease: "power2.out" }, 0.3)
          .to(light, { opacity: 0, duration: 0.9, ease: "power1.out" }, 1.1)
          .call(() => { burst = 0.9; }, [], 0.45);
      });
      // Seguro de entrada: con pocos fps (o pestaña en segundo plano) el portón termina de abrirse igual.
      gateSafety = window.setTimeout(() => gateTl?.progress(1), 6000);
    };
    // Si la página se carga ya desplazada (recarga o enlace a otra sección), el portón ya está abierto.
    if (window.scrollY > 40) finishGate();
    else setGate("closed");
    const firstFrame = window.setTimeout(openGate, 900);

    // --- Scroll ---------------------------------------------------------------------
    let target = 0;
    let prog = 0;
    let tramo = -1;
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        target = self.progress;
        if (target > 0.004) openGate();
      },
    });
    target = st.progress;

    const setTramo = (i: number) => {
      if (i === tramo) return;
      tramo = i;
      caps.forEach((c, k) => c.toggleAttribute("data-active", k === i));
      ticks.forEach((t, k) => t.toggleAttribute("data-on", k <= i));
      smoke?.setDissipation(TRAMOS[i].dissipation);
    };

    const applyMotion = (reduced: boolean) => {
      root.dataset.motion = reduced ? "reduced" : "full";
      if (reduced) {
        // Si el portón ya se estaba abriendo, se termina; si sigue cerrado, se abrirá con fundido.
        if (gate === "opening") gateTl?.progress(1);
        cam.push = 1.04;
        smoke?.clear();
      }
    };
    applyMotion(rt.reduced);
    const offMotion = rt.onMotionChange(applyMotion);

    let tx = 0;
    let ty = 0;
    const tick = (dt: number) => {
      if (!inView || destroyed) return;
      const reduced = rt.reduced;

      // Avance: suavizado con el reloj único; con movimiento reducido, saltos por tramo.
      if (reduced) prog = stillFor(target);
      else {
        prog = damp(prog, target, 7, dt);
        if (Math.abs(prog - target) < 1e-4) prog = target;
      }
      const n = nearest(Math.round(prog * (FRAMES - 1)));
      if (n >= 0 && (n !== drawn || needsDraw)) {
        draw(n);
        drawn = n;
        needsDraw = false;
        if (root.dataset.frames !== "ready") root.dataset.frames = "ready";
      }
      setTramo(tramoAt(reduced ? target : prog));
      bar.style.transform = `scaleX(${target.toFixed(4)})`;
      root.toggleAttribute("data-moved", target > 0.02);

      // Cámara: empuje del portón y paralaje leve con el cursor (solo puntero fino).
      const follow = !reduced && !pointer.coarse && pointer.active;
      tx = damp(tx, follow ? -pointer.x * 14 : 0, 3.5, dt);
      ty = damp(ty, follow ? pointer.y * 8 : 0, 3.5, dt);
      view.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${cam.push.toFixed(4)})`;

      if (reduced) return;
      const r = sticky.getBoundingClientRect();
      const inside = pointer.active && pointer.px >= r.left && pointer.px <= r.right && pointer.py >= r.top && pointer.py <= r.bottom;

      if (!smoke || smoke.lost) {
        // Respaldo sin WebGL2: la neblina CSS sigue al cursor.
        if (smoke?.lost && root.dataset.smoke !== "off") root.dataset.smoke = "off";
        if (inside) {
          const mx = Math.round(((pointer.px - r.left) / r.width) * 100);
          const my = Math.round(((pointer.py - r.top) / r.height) * 100);
          if (mx !== mistX || my !== mistY) {
            mistX = mx;
            mistY = my;
            root.style.setProperty("--mx", `${mx}%`);
            root.style.setProperty("--my", `${my}%`);
          }
        }
        return;
      }

      const t = TRAMOS[tramo];
      // La emisión continua se escala con dt: la misma cantidad de humo a 30, 60 o 120 Hz.
      const rate = Math.min(dt * 60, 2);
      if (inside) {
        const x = (pointer.px - r.left) / r.width;
        const y = 1 - (pointer.py - r.top) / r.height;
        if (last.x >= 0 && dt > 0) {
          const vx = Math.max(-4, Math.min(4, (x - last.x) / dt));
          const vy = Math.max(-4, Math.min(4, (y - last.y) / dt));
          const speed = Math.hypot(vx, vy);
          if (speed > 0.03) {
            const k = (0.04 + 0.1 * Math.min(1, speed / 1.4)) * rate;
            smoke.splat(x, y, vx, vy, [t.pointer[0] * k, t.pointer[1] * k, t.pointer[2] * k], 1.1);
          }
        }
        last = { x, y };
      } else last = { x: -1, y: -1 };

      ambientT -= dt;
      if (ambientT <= 0) {
        const a = t.ambient;
        ambientT = a.every * rand(0.6, 1.4);
        const [x, y, vx, vy] = a.emit();
        smoke.splat(x, y, vx, vy, [a.color[0] * a.amount, a.color[1] * a.amount, a.color[2] * a.amount], a.radius);
      }

      // Bocanada al abrir el portón: el aire de la finca entra por la rendija.
      if (burst > 0) {
        burst -= dt;
        const side = Math.random() < 0.5 ? -1 : 1;
        const k = 0.08 * rate;
        smoke.splat(0.5 + side * 0.01, rand(0.12, 0.88), side * rand(0.6, 1.6), rand(-0.1, 0.2), [WARM[0] * k, WARM[1] * k, WARM[2] * k], 0.9);
      }

      smoke.step(dt);
      smoke.render();
    };
    const unsubscribe = rt.subscribe(tick);

    // Estado para pruebas (?debug).
    if (params.has("debug")) {
      (window as unknown as { __finca?: unknown }).__finca = {
        get state() {
          return { gate, prog, target, tramo, drawn, loaded: loadedCount, variant, smoke: smoke ? (smoke.lost ? "lost" : "on") : "off", reduced: rt.reduced };
        },
        /** Bocanada de prueba en (x, y) normalizados, origen abajo a la izquierda. */
        puff(x = 0.5, y = 0.5) {
          smoke?.splat(x, y, 0.4, 0.3, [0.5, 0.5, 0.48], 2);
        },
      };
    }

    return () => {
      destroyed = true;
      loadGen++;
      window.clearTimeout(firstFrame);
      window.clearTimeout(gateSafety);
      unsubscribe();
      offMotion();
      st.kill();
      ctx.revert();
      ro.disconnect();
      io.disconnect();
      smoke?.dispose();
      smoke = null;
      images = [];
      delete (window as unknown as { __finca?: unknown }).__finca;
      releaseRuntime();
    };
  }, []);

  return (
    <section ref={rootRef} className="aw-finca" aria-label="Entrada a la finca" data-gate="closed" data-motion="full">
      <div className="aw-finca__sticky">
        <div className="aw-finca__view" aria-hidden="true">
          <picture>
            <source media="(max-aspect-ratio: 9/10)" srcSet={frameUrl("mobile", 0)} />
            <img className="aw-finca__poster" src={frameUrl("desktop", 0)} alt="" decoding="async" />
          </picture>
          <canvas className="aw-finca__frames" aria-hidden="true" />
        </div>
        <div className="aw-finca__mist" aria-hidden="true" />
        <canvas className="aw-finca__smoke" aria-hidden="true" />
        <div className="aw-finca__shade" aria-hidden="true" />

        {/* Portón decorativo: se abre solo; nunca bloquea el scroll ni los clics. */}
        <div className="aw-gate" aria-hidden="true">
          <div className="aw-gate__leaf aw-gate__leaf--l">
            <span className="aw-gate__rail aw-gate__rail--t" />
            <span className="aw-gate__rail aw-gate__rail--b" />
            <span className="aw-gate__brace" />
            <span className="aw-gate__hinge aw-gate__hinge--t" />
            <span className="aw-gate__hinge aw-gate__hinge--b" />
          </div>
          <div className="aw-gate__leaf aw-gate__leaf--r">
            <span className="aw-gate__rail aw-gate__rail--t" />
            <span className="aw-gate__rail aw-gate__rail--b" />
            <span className="aw-gate__brace" />
            <span className="aw-gate__hinge aw-gate__hinge--t" />
            <span className="aw-gate__hinge aw-gate__hinge--b" />
            <span className="aw-gate__latch" />
          </div>
          <div className="aw-gate__light" />
          <div className="aw-gate__sign">
            <span className="aw-gate__sign-top">Bienvenido a</span>
            <strong>La Central del Queso</strong>
            <span className="aw-gate__sign-bottom">Pase adelante</span>
          </div>
        </div>

        <ol className="aw-finca__caps">
          {TRAMOS.map((t, i) => (
            <li key={t.id} className="aw-finca__cap" data-active={i === 0 ? "" : undefined}>
              <p className="aw-finca__kicker"><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span> {t.kicker}</p>
              <p className="aw-finca__title">{t.title}</p>
              <p className="aw-finca__text">{t.text}</p>
            </li>
          ))}
        </ol>

        <div className="aw-finca__ui">
          <div className="aw-finca__bar" aria-hidden="true">
            <span />
            {TRAMOS.map((t, i) => <i key={t.id} className="aw-finca__tick" style={{ left: `${t.start * 100}%` }} data-on={i === 0 ? "" : undefined} />)}
          </div>
          <p className="aw-finca__note">Recreación visual</p>
          <a className="aw-finca__skip" href="#inicio">Saltar la entrada</a>
        </div>
        <p className="aw-finca__hint" aria-hidden="true">Baje para entrar</p>
      </div>
    </section>
  );
}
