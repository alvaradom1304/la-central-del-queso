"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { acquireRuntime, releaseRuntime, damp } from "@/lib/award/runtime";
import type { CheeseScene } from "./cheeseScene";

type Mode = "pending" | "webgl" | "fallback";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Escenario de la portada: horma 3D pegajosa + contenido DOM que pasa por encima.
 * El contenido (children) es HTML servido; este componente solo añade la capa visual y el gesto.
 *
 * Gesto «La cuña»: el usuario corta la horma arrastrando sobre ella (ratón: hacia abajo o a la
 * izquierda; táctil: a la izquierda, para no secuestrar el scroll vertical) o con el botón
 * [data-cut-toggle], accesible por teclado. El scroll también saca la cuña; se usa el mayor de ambos.
 */
export default function HeroStage({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const grab = grabRef.current;
    if (!root || !canvas || !grab) return;
    const html = document.documentElement;
    const params = new URLSearchParams(window.location.search);
    const rt = acquireRuntime();
    const pointer = rt.pointer;
    const ac = new AbortController();
    const { signal } = ac;
    let destroyed = false;
    let scene: CheeseScene | null = null;
    let mode: Mode = "pending";
    let frames = 0;
    let inView = true;
    const scroll = { cut: 0, brown: 0, vel: 0 };
    const live = { brown: 0, tilt: 0 };
    const sticky = canvas.parentElement!;
    const manual = { value: 0, target: 0, dragging: false };
    // Hasta el primer gesto la cuña la saca el scroll; después, el corte es del usuario.
    let owner: "scroll" | "user" = "scroll";
    let shownCut = false;
    const cutButton = root.querySelector<HTMLButtonElement>("[data-cut-toggle]");

    const setMode = (next: Mode) => {
      mode = next;
      root.dataset.gl = next;
    };
    setMode("pending");
    html.classList.toggle("aw-motion", !rt.reduced);

    // --- Titular cinético (dueño único del transform de .aw-line) -------------
    const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]")).map((el) => ({
      el,
      depth: Number(el.dataset.depth) || 1,
      x: 0,
      y: 0,
    }));
    const resetDom = () => {
      lines.forEach((l) => { l.x = l.y = 0; l.el.style.removeProperty("transform"); });
    };

    const currentCut = () => (owner === "user" ? manual.value : scroll.cut);
    const takeOwnership = () => {
      if (owner === "user") return;
      manual.value = manual.target = scroll.cut;
      owner = "user";
    };

    /** Coloca el área de agarre sobre la horma proyectada. */
    const placeGrab = () => {
      if (!scene || mode !== "webgl") return;
      const { x, y, r } = scene.wheelScreen();
      const size = Math.max(120, r * 2.3);
      grab.style.transform = `translate3d(${(x - size / 2).toFixed(1)}px, ${(y - size / 2).toFixed(1)}px, 0)`;
      grab.style.width = grab.style.height = `${size.toFixed(0)}px`;
    };

    const renderStatic = () => {
      if (scene && mode === "webgl") {
        // Con movimiento reducido, antes del primer gesto la horma se ve entera (coherente con el botón).
        scene.setBrown(scroll.brown);
        scene.update(0, 0, 0, rt.reduced && owner === "scroll" ? 0 : currentCut(), false);
        scene.render();
        placeGrab();
      }
      syncCut();
    };

    /**
     * El botón refleja lo que se ve (con histéresis). La tarjeta y su anuncio solo responden al corte
     * del usuario: el scroll no produce anuncios y sin WebGL no hay corte.
     */
    let userShown = false;
    const syncCut = () => {
      const c = currentCut();
      const next = shownCut ? c > 0.4 : c > 0.85;
      if (next !== shownCut) {
        shownCut = next;
        cutButton?.setAttribute("aria-pressed", String(next));
      }
      const user = owner === "user" && mode === "webgl" && shownCut;
      if (user !== userShown) {
        userShown = user;
        window.dispatchEvent(new CustomEvent("aw:cut", { detail: { cut: user } }));
      }
    };

    /** Encuadre: la horma siempre a la derecha del borde real del titular. */
    const fitScene = () => {
      if (!scene || mode !== "webgl") return;
      const sr = sticky.getBoundingClientRect();
      const lines = Array.from(root.querySelectorAll<HTMLElement>(".aw-hero .aw-line__inner")).map((el) => {
        const r = el.getBoundingClientRect();
        return { right: r.right - sr.left, top: r.top - sr.top, bottom: r.bottom - sr.top };
      });
      if (lines.length) scene.fitRightOf(lines);
    };

    const tick = (dt: number) => {
      if (!inView) return;
      if (rt.reduced) return;
      const amp = pointer.coarse ? 9 : 20;
      for (const l of lines) {
        l.x = damp(l.x, pointer.x * amp * l.depth, 6, dt);
        l.y = damp(l.y, -pointer.y * amp * 0.45 * l.depth, 6, dt);
        l.el.style.transform = `translate3d(${l.x.toFixed(2)}px, ${l.y.toFixed(2)}px, 0)`;
      }
      if (!manual.dragging) manual.value = damp(manual.value, manual.target, 5, dt);
      scroll.vel = damp(scroll.vel, 0, 2, dt);
      if (scene && mode === "webgl") {
        const k = pointer.coarse ? 0.5 : 1;
        // El dorado avanza con suavidad; la velocidad del scroll inclina un poco la horma.
        live.brown = damp(live.brown, scroll.brown, 4, dt);
        live.tilt = damp(live.tilt, Math.max(-0.6, Math.min(0.6, scroll.vel / 4000)), 3, dt);
        scene.setBrown(live.brown);
        scene.update(dt, pointer.x * k, pointer.y * k + live.tilt, currentCut(), true);
        scene.render();
        placeGrab();
        frames++;
      }
      syncCut();
    };
    const unsubscribe = rt.subscribe(tick);

    // --- Gesto: botón accesible ------------------------------------------------
    cutButton?.addEventListener("click", () => {
      const visible = currentCut();
      takeOwnership();
      manual.target = visible > 0.5 ? 0 : 1;
      if (rt.reduced) { manual.value = manual.target; renderStatic(); }
      root.classList.add("is-cut-used");
    }, { signal });

    // --- Gesto: arrastrar sobre la horma ----------------------------------------
    let start = { x: 0, y: 0, v: 0, r: 120, id: -1, type: "mouse" };
    grab.addEventListener("pointerdown", (e) => {
      if (!scene || mode !== "webgl") return;
      takeOwnership();
      start = { x: e.clientX, y: e.clientY, v: manual.value, r: Math.max(80, scene.wheelScreen().r), id: e.pointerId, type: e.pointerType };
      manual.dragging = true;
      html.classList.add("aw-dragging");
      e.preventDefault();
      grab.setPointerCapture(e.pointerId);
      grab.classList.add("is-dragging");
    }, { signal });
    grab.addEventListener("pointermove", (e) => {
      if (!manual.dragging || e.pointerId !== start.id) return;
      const dx = e.clientX - start.x;
      const dy = start.type === "mouse" ? e.clientY - start.y : 0;
      manual.value = clamp01(start.v + (-dx + dy) / (start.r * 1.4));
      manual.target = manual.value;
      if (rt.reduced) renderStatic();
    }, { signal });
    const endDrag = (e: PointerEvent) => {
      if (!manual.dragging || e.pointerId !== start.id) return;
      manual.dragging = false;
      html.classList.remove("aw-dragging");
      manual.target = manual.value > 0.5 ? 1 : 0;
      if (rt.reduced) { manual.value = manual.target; renderStatic(); }
      grab.classList.remove("is-dragging");
      root.classList.add("is-cut-used");
      syncCut();
    };
    grab.addEventListener("pointerup", endDrag, { signal });
    grab.addEventListener("pointercancel", endDrag, { signal });

    // --- Scroll y entrada tipográfica -------------------------------------------
    let safety = 0;
    let intro: gsap.core.Tween | null = null;
    const inners = root.querySelectorAll<HTMLElement>(".aw-line__inner");
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scroll.cut = clamp01((self.progress - 0.08) / 0.5);
          scroll.vel = self.getVelocity();
          root.classList.toggle("is-scrolled", self.progress > 0.04);
          if (rt.reduced) renderStatic();
        },
      });
      // «Dorado al fuego»: la pasta se dora mientras se recorre ese paso de la historia.
      const goldStep = root.querySelector("#la-cuna")?.closest("article");
      if (goldStep) {
        ScrollTrigger.create({
          trigger: goldStep,
          start: "top 70%",
          end: "bottom 40%",
          onUpdate: (self) => {
            scroll.brown = self.progress;
            if (rt.reduced) renderStatic();
          },
        });
      }
      if (rt.reduced) {
        gsap.set(inners, { yPercent: 0 });
      } else {
        // fromTo con destino explícito: en StrictMode (montaje doble) from() puede tomar como
        // destino un estado intermedio y dejar el titular oculto.
        intro = gsap.fromTo(inners, { yPercent: 135 }, {
          yPercent: 0,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.09,
          delay: 0.15,
        });
        // Seguro: con pestaña oculta o pocos fps el titular nunca queda invisible.
        safety = window.setTimeout(() => intro?.progress(1), 2600);
      }
    }, root);

    // Barras sensoriales: se rellenan al entrar en vista (sin JS se ven completas).
    const bars = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-in"));
    }, { threshold: 0.35 });
    root.querySelectorAll(".aw-sense").forEach((el) => bars.observe(el));

    // --- WebGL progresivo -------------------------------------------------------
    const resize = () => {
      scene?.resize(sticky.clientWidth, sticky.clientHeight);
      fitScene();
      if (rt.reduced) renderStatic();
      else placeGrab();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(sticky);
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { rootMargin: "100px" });
    io.observe(root);
    // Las fuentes cambian la altura de las secciones: recalcular disparadores cuando terminan de cargar.
    document.fonts?.ready.then(() => { if (!destroyed) { ScrollTrigger.refresh(); resize(); } });

    const offMotion = rt.onMotionChange((reduced) => {
      html.classList.toggle("aw-motion", !reduced);
      if (reduced) { intro?.progress(1); manual.value = manual.target; resetDom(); renderStatic(); }
    });

    (async () => {
      if (params.has("nowebgl")) return setMode("fallback");
      try {
        const { createCheeseScene } = await import("./cheeseScene");
        if (destroyed) return;
        scene = createCheeseScene(canvas, {
          maxDpr: 1.5,
          onContextLost: () => setMode("fallback"),
          onContextRestored: () => { setMode("webgl"); renderStatic(); },
        });
        scene.resize(sticky.clientWidth, sticky.clientHeight);
        setMode("webgl");
        fitScene();
        renderStatic();
      } catch (err) {
        console.info("[La Central] WebGL no disponible; se muestra la ilustración estática.", err);
        scene = null;
        setMode("fallback");
      }
    })();

    if (params.has("debug")) {
      (window as unknown as { __aw: unknown }).__aw = {
        state: () => ({
          mode, frames, reduced: rt.reduced, inView, cut: currentCut(), scrollCut: scroll.cut, manualCut: manual.value, owner, shownCut,
          coarse: pointer.coarse, pointer: { x: pointer.x, y: pointer.y }, gl: scene?.info() ?? null,
          grab: scene ? scene.wheelScreen() : null,
        }),
      };
    }

    return () => {
      destroyed = true;
      unsubscribe();
      offMotion();
      ac.abort();
      clearTimeout(safety);
      ctx.revert();
      bars.disconnect();
      ro.disconnect();
      io.disconnect();
      resetDom();
      scene?.dispose();
      scene = null;
      html.classList.remove("aw-motion", "aw-dragging");
      delete (window as unknown as { __aw?: unknown }).__aw;
      releaseRuntime();
    };
  }, []);

  return (
    <section ref={rootRef} className="aw-stage" id="inicio" data-gl="pending" aria-label="La Central del Queso">
      <div className="aw-stage__sticky" aria-hidden="true">
        <div className="aw-stage__poster">
          <svg viewBox="0 0 400 300" role="presentation" focusable="false">
            <ellipse cx="200" cy="262" rx="176" ry="26" fill="#000" opacity="0.32" />
            <path d="M40 150 L40 200 A160 55 0 0 0 360 200 L360 150 Z" fill="#a8702c" />
            <path d="M40 150 L40 200 A160 55 0 0 0 360 200 L360 150 Z" fill="url(#aw-rind)" />
            <path d="M132.4 249.8 L200 200 L267.6 249.8 A160 55 0 0 1 132.4 249.8 Z" fill="#0f1e16" />
            <path d="M200 150 L267.6 199.8 L267.6 249.8 L200 200 Z" fill="#efd9a0" />
            <path d="M200 150 L132.4 199.8 L132.4 249.8 L200 200 Z" fill="#f7ebc6" />
            <path d="M200 150 L267.6 199.8 A160 55 0 1 0 132.4 199.8 Z" fill="#dda13e" />
            <ellipse cx="200" cy="150" rx="118" ry="40" fill="none" stroke="#b9822f" strokeWidth="3" opacity="0.55" />
            <path d="M200 150 L267.6 199.8 A160 55 0 1 0 132.4 199.8 Z" fill="url(#aw-top)" />
            <defs>
              <linearGradient id="aw-rind" x1="0" x2="1">
                <stop offset="0" stopColor="#7f5220" stopOpacity="0.55" />
                <stop offset="0.45" stopColor="#d9a24c" stopOpacity="0.15" />
                <stop offset="1" stopColor="#7f5220" stopOpacity="0.6" />
              </linearGradient>
              <radialGradient id="aw-top" cx="0.4" cy="0.35" r="0.8">
                <stop offset="0" stopColor="#f0ba5c" stopOpacity="0.6" />
                <stop offset="1" stopColor="#a8702c" stopOpacity="0.35" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <canvas ref={canvasRef} className="aw-stage__gl" tabIndex={-1} aria-hidden="true" />
        {/* Área de agarre decorativa: el equivalente accesible es el botón «Cortar la cuña». */}
        <div ref={grabRef} className="aw-grab">
          <span className="aw-grab__hint">Arrastre para cortar</span>
        </div>
      </div>
      <div className="aw-stage__content">{children}</div>
    </section>
  );
}
