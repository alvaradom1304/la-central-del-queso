"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Núcleo del recorrido: un único reloj (gsap.ticker) mueve el scroll suave
// (Lenis), ScrollTrigger y los efectos que siguen al puntero. Con «reducir
// movimiento» no hay scroll suave, ni escenas fijas, ni animaciones atadas al
// scroll: el contenido queda estático y completo.

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText);

/** Para quién compra el visitante; ajusta llamados a la acción y atajos. */
export type Segmento = "casa" | "negocio" | null;

interface Cine {
  /** null hasta montar (en el servidor no se conoce la preferencia). */
  reducido: boolean | null;
  /** Lleva la página a un elemento o posición; con foco opcional al llegar. */
  irA: (destino: HTMLElement | number, opciones?: { foco?: boolean; duracion?: number }) => void;
  pedidoAbierto: boolean;
  abrirPedido: () => void;
  cerrarPedido: () => void;
  segmento: Segmento;
  elegirSegmento: (s: Exclude<Segmento, null>) => void;
}

const Ctx = createContext<Cine | null>(null);
const CLAVE_SEGMENTO = "cq_segmento";

export function useCine() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCine debe usarse dentro de <CineProvider>");
  return c;
}

function usePrefiereReducido(): boolean | null {
  const [reducido, setReducido] = useState<boolean | null>(null);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducido(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reducido;
}

export function CineProvider({ children }: { children: React.ReactNode }) {
  const reducido = usePrefiereReducido();
  const lenisRef = useRef<Lenis | null>(null);
  const [pedidoAbierto, setPedidoAbierto] = useState(false);
  const [segmento, setSegmento] = useState<Segmento>(null);

  useEffect(() => {
    if (reducido !== false) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, autoRaf: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducido]);

  // Las escenas miden su alto al montar; con todo montado y las fuentes
  // cargadas, ScrollTrigger recalcula las posiciones. También cuando cambia el
  // alto del contenido (versión fija de la finca, pedido que crece, etc.):
  // ScrollTrigger no lo detecta solo.
  useEffect(() => {
    ScrollTrigger.refresh();
    let vivo = true;
    document.fonts?.ready.then(() => vivo && ScrollTrigger.refresh());
    const main = document.querySelector(".cine main");
    let alto = main?.getBoundingClientRect().height ?? 0;
    let espera = 0;
    const observer = new ResizeObserver(([entry]) => {
      const nuevo = entry.contentRect.height;
      if (Math.abs(nuevo - alto) < 2) return;
      alto = nuevo;
      window.clearTimeout(espera);
      espera = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    if (main) observer.observe(main);
    return () => {
      vivo = false;
      window.clearTimeout(espera);
      observer.disconnect();
    };
  }, []);

  // Segmento: primero el de la campaña (?segmento=negocio en un QR o anuncio,
  // para que el mensaje coincida con el origen), si no el de la sesión.
  useEffect(() => {
    try {
      const deCampana = new URLSearchParams(window.location.search).get("segmento");
      const guardado = deCampana ?? sessionStorage.getItem(CLAVE_SEGMENTO);
      if (guardado === "casa" || guardado === "negocio") setSegmento(guardado);
    } catch {
      // sin almacenamiento: el segmento vive solo en memoria
    }
  }, []);

  // Con el panel del pedido abierto, el fondo no se desplaza (ni con Lenis).
  useEffect(() => {
    if (!pedidoAbierto) return;
    lenisRef.current?.stop();
    const raiz = document.documentElement;
    const antes = raiz.style.overflow;
    raiz.style.overflow = "hidden";
    return () => {
      raiz.style.overflow = antes;
      lenisRef.current?.start();
    };
  }, [pedidoAbierto]);

  const irA = useCallback((destino: HTMLElement | number, opciones?: { foco?: boolean; duracion?: number }) => {
    const lenis = lenisRef.current;
    // El foco va de inmediato (sin desplazar): si el usuario interrumpe el
    // viaje con la rueda, el teclado igual queda en el destino.
    if (opciones?.foco && typeof destino !== "number") destino.focus({ preventScroll: true });
    if (lenis) {
      lenis.scrollTo(destino, { duration: opciones?.duracion ?? 1.6 });
      return;
    }
    if (typeof destino === "number") window.scrollTo({ top: destino });
    else destino.scrollIntoView({ block: "start" });
  }, []);

  const elegirSegmento = useCallback((s: Exclude<Segmento, null>) => {
    setSegmento(s);
    try {
      sessionStorage.setItem(CLAVE_SEGMENTO, s);
    } catch {
      // idem
    }
  }, []);

  const valor = useMemo<Cine>(
    () => ({
      reducido,
      irA,
      pedidoAbierto,
      abrirPedido: () => setPedidoAbierto(true),
      cerrarPedido: () => setPedidoAbierto(false),
      segmento,
      elegirSegmento,
    }),
    [reducido, irA, pedidoAbierto, segmento, elegirSegmento]
  );
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

/** Enlace interno que llega con el scroll suave y deja el foco en el destino. */
export function useIrAId() {
  const { irA } = useCine();
  return useCallback(
    (e: React.MouseEvent, id: string) => {
      const destino = document.getElementById(id);
      if (!destino) return;
      e.preventDefault();
      irA(destino, { foco: true });
    },
    [irA]
  );
}

/**
 * Cámara en mano: el plano se desplaza unos píxeles hacia el lado contrario
 * del puntero y vuelve al reposo cuando sale. Escribe solo `transform` del
 * elemento (que debe ser una envoltura propia, sin otras animaciones) y solo
 * mientras está en pantalla. Con ratón y sin «reducir movimiento».
 */
export function useCamaraEnMano(ref: React.RefObject<HTMLElement>, amplitud = 14) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const query = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");

    const objetivo = { x: 0, y: 0 };
    const actual = { x: 0, y: 0 };
    let visible = false;
    const mover = (e: PointerEvent) => {
      objetivo.x = (e.clientX / window.innerWidth) * 2 - 1;
      objetivo.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const reposo = () => {
      objetivo.x = 0;
      objetivo.y = 0;
    };
    // La preferencia se consulta en vivo: si el usuario activa «reducir
    // movimiento» (o pasa a táctil), el plano vuelve a su lugar y se queda quieto.
    let quieto = !query.matches;
    const actualizar = () => {
      quieto = !query.matches;
      objetivo.x = objetivo.y = actual.x = actual.y = 0;
      el.style.transform = quieto ? "" : "scale(1.05)";
    };
    query.addEventListener("change", actualizar);
    const tick = (_t: number, deltaMs: number) => {
      if (!visible || quieto) return;
      // En reposo (ya llegó al objetivo) no se escribe nada.
      if (Math.abs(objetivo.x - actual.x) < 0.0005 && Math.abs(objetivo.y - actual.y) < 0.0005) return;
      const a = 1 - Math.exp(-3.5 * Math.min(deltaMs / 1000, 0.05));
      actual.x += (objetivo.x - actual.x) * a;
      actual.y += (objetivo.y - actual.y) * a;
      el.style.transform = `translate3d(${(-actual.x * amplitud).toFixed(2)}px, ${(-actual.y * amplitud * 0.6).toFixed(2)}px, 0) scale(1.05)`;
    };
    el.style.transform = quieto ? "" : "scale(1.05)";
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(el);
    window.addEventListener("pointermove", mover, { passive: true });
    document.documentElement.addEventListener("pointerleave", reposo);
    gsap.ticker.add(tick);
    return () => {
      observer.disconnect();
      query.removeEventListener("change", actualizar);
      window.removeEventListener("pointermove", mover);
      document.documentElement.removeEventListener("pointerleave", reposo);
      gsap.ticker.remove(tick);
      el.style.transform = "";
    };
  }, [ref, amplitud]);
}

/**
 * Titulares que entran por líneas al llegar a la pantalla (SplitText). Se
 * llama dentro de useGSAP: queda atado a su contexto y matchMedia.
 */
export function revelarTitulares(raiz: HTMLElement) {
  const splits: SplitText[] = [];
  raiz.querySelectorAll<HTMLElement>("[data-revelar]").forEach((el) => {
    // autoSplit vuelve a partir las líneas cuando cargan las fuentes o cambia
    // el ancho; la animación devuelta conserva su progreso al rehacerse.
    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      aria: "auto",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }),
    });
    splits.push(split);
  });
  return () => splits.forEach((s) => s.revert());
}
