"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider, useCart } from "@/lib/CartContext";
import type { Product } from "@/lib/products";
import FrameSequenceScroll from "./FrameSequenceScroll";
import LecheriaRecepcion from "./LecheriaRecepcion";
import StaticTramos from "./StaticTramos";
import { DEFAULT_NOTICE, type FincaManifest } from "./fincaManifest";

interface FincaExperienceProps {
  manifest: FincaManifest | null;
  /** Capa opcional dentro de #ventana-lecheria (ver LecheriaRecepcion). */
  ventanaOverlay?: React.ReactNode;
  /** Objetos tocables por id de tramo dentro del recorrido. */
  sceneOverlays?: Partial<Record<string, React.ReactNode>>;
  /** Objeto tocable junto a la bienvenida de la lechería. */
  cuenco?: React.ReactNode;
}

export default function FincaExperience(props: FincaExperienceProps) {
  return (
    <CartProvider>
      <ExperienceShell {...props} />
    </CartProvider>
  );
}

/** null hasta montar (en el servidor no se conoce la preferencia). */
function usePrefersReducedMotion(): boolean | null {
  const [reduced, setReduced] = useState<boolean | null>(null);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }
    query.addListener(update);
    return () => query.removeListener(update);
  }, []);
  return reduced;
}

type Mode = "pending" | "sequence" | "static";

const HEADER_LINK =
  "inline-flex min-h-10 items-center text-[10px] uppercase tracking-[0.16em] text-[#F2EDE3]/80 sm:tracking-[0.26em] underline-offset-[7px] transition-colors hover:text-[#F2EDE3] hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F2EDE3] sm:text-[11px]";

function ExperienceShell({ manifest, ventanaOverlay, sceneOverlays, cuenco }: FincaExperienceProps) {
  const reduced = usePrefersReducedMotion();
  const [sequenceFailed, setSequenceFailed] = useState(false);
  const [stagePinned, setStagePinned] = useState(true);
  const [announcement, setAnnouncement] = useState({ text: "", count: 0 });
  const { isCartOpen, setIsCartOpen, totalItemsCount } = useCart();

  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const mode: Mode =
    manifest === null || sequenceFailed ? "static" : reduced === null ? "pending" : reduced ? "static" : "sequence";

  const handleSequenceFallback = useCallback(() => setSequenceFailed(true), []);
  const handleProductAdded = useCallback((product: Product) => {
    setAnnouncement((prev) => ({ text: `${product.name} se agregó a la canasta.`, count: prev.count + 1 }));
  }, []);

  // El CartDrawer existente es un diálogo sin gestión de foco: mientras está
  // abierto, el resto de la página queda inerte, el foco entra al diálogo y al
  // cerrarlo vuelve al control que lo abrió.
  useEffect(() => {
    const blockers = [headerRef.current, mainRef.current, footerRef.current];
    if (isCartOpen) {
      const active = document.activeElement;
      returnFocusRef.current = active instanceof HTMLElement ? active : null;
      blockers.forEach((el) => el?.setAttribute("inert", ""));
      const raf = requestAnimationFrame(() => {
        const dialog = document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]');
        const target =
          dialog?.querySelector<HTMLElement>('button[aria-label="Cerrar pedido"]') ??
          dialog?.querySelector<HTMLElement>("button, [href], input, select, textarea");
        target?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
    blockers.forEach((el) => el?.removeAttribute("inert"));
    const back = returnFocusRef.current;
    returnFocusRef.current = null;
    if (back && back.isConnected) back.focus({ preventScroll: true });
  }, [isCartOpen]);

  const notice = manifest?.notice ?? DEFAULT_NOTICE;
  // Cabecera transparente solo sobre el escenario fijo; si no, fondo propio
  // para que nada pase por debajo de los atajos.
  const headerOverStage = mode !== "static" && stagePinned;

  return (
    <div className="min-h-screen bg-[#0E0C09] font-sans text-[#F2EDE3] selection:bg-[#C4A56E] selection:text-[#0E0C09]">
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-40">
        <div
          className={`flex items-center justify-between gap-4 px-6 pt-4 transition-[background-color,padding] duration-500 sm:gap-6 sm:px-12 sm:pt-6 lg:px-20 ${
            headerOverStage
              ? "bg-gradient-to-b from-[#0E0C09]/75 to-transparent pb-8"
              : "bg-[#0E0C09]/95 pb-4 backdrop-blur-sm sm:pb-6"
          }`}
        >
          <Link
            href="/"
            className="min-w-0 truncate font-serif text-[15px] font-normal text-[#F2EDE3] sm:text-lg sm:tracking-wide focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F2EDE3] sm:text-lg"
          >
            La Central del Queso
            <span className="ml-3 hidden align-middle font-sans text-[10px] uppercase tracking-[0.26em] text-[#F2EDE3]/45 sm:inline">
              Experimento
            </span>
          </Link>
          <nav aria-label="Atajos" className="flex shrink-0 items-center gap-4 sm:gap-10">
            <a href="#lecheria" aria-label="Ir a los productos" className={HEADER_LINK}>
              <span className="sm:hidden">Productos</span>
              <span className="hidden sm:inline">Ir a los productos</span>
            </a>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Canasta: ${totalItemsCount} ${totalItemsCount === 1 ? "artículo" : "artículos"}`}
              className={HEADER_LINK}
            >
              Canasta <span className="ml-1.5 tabular-nums">({totalItemsCount})</span>
            </button>
          </nav>
        </div>
      </header>

      <main ref={mainRef} id="contenido">
        <h1 className="sr-only">Recorrido por la Finca Doña Martha hasta la lechería</h1>

        {manifest && (mode === "sequence" || mode === "pending") ? (
          // En "pending" el CSS decide qué versión se ve en el primer pintado.
          <div className={mode === "pending" ? "motion-reduce:hidden" : undefined}>
            <FrameSequenceScroll
              manifest={manifest}
              enabled={mode === "sequence"}
              onFallback={handleSequenceFallback}
              sceneOverlays={sceneOverlays}
              onPinnedChange={setStagePinned}
            />
          </div>
        ) : null}

        {mode === "static" || mode === "pending" ? (
          <div className={mode === "pending" ? "hidden motion-reduce:block" : undefined}>
            <StaticTramos manifest={manifest} priorityFirst={mode === "static"} />
          </div>
        ) : null}

        <LecheriaRecepcion onProductAdded={handleProductAdded} ventanaOverlay={ventanaOverlay} cuenco={cuenco} />
      </main>

      <footer
        ref={footerRef}
        className="flex flex-col gap-3 border-t border-[#F2EDE3]/10 px-6 py-10 text-[10px] uppercase tracking-[0.24em] text-[#F2EDE3]/45 sm:flex-row sm:items-center sm:justify-between sm:px-12 lg:px-20"
      >
        <p>Página experimental · Imágenes: {notice}</p>
        <Link
          href="/"
          className="inline-flex min-h-10 items-center text-[#F2EDE3]/70 underline-offset-[7px] hover:text-[#F2EDE3] hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F2EDE3]"
        >
          Volver al inicio
        </Link>
      </footer>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement.text}
        {announcement.count % 2 === 1 ? " " : ""}
      </p>

      <CartDrawer />
    </div>
  );
}
