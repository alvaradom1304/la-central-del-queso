"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { CartProvider, useCart } from "@/lib/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { acquireRuntime, releaseRuntime } from "@/lib/award/runtime";

function Header() {
  const { totalItemsCount, setIsCartOpen } = useCart();
  return (
    <header className="aw-bar">
      <a className="aw-bar__brand" href="#inicio" aria-label="La Central del Queso, inicio">
        <span className="aw-bar__seal" aria-hidden="true">Q</span>
        <span className="aw-bar__name">La Central del Queso</span>
      </a>
      <nav aria-label="Principal">
        <ul className="aw-bar__nav">
          <li><a href="#pizarra">Quesos</a></li>
          <li><a href="#canasta">Canasta</a></li>
          <li><a href="#ferias">Ferias</a></li>
        </ul>
      </nav>
      <button
        type="button"
        className="aw-bar__cart"
        onClick={() => setIsCartOpen(true)}
        aria-label={`Abrir pedido, ${totalItemsCount} ${totalItemsCount === 1 ? "producto" : "productos"}`}
      >
        Pedido <span className="aw-bar__count" aria-hidden="true">{totalItemsCount}</span>
      </button>
      <MotionToggle />
    </header>
  );
}

/** Pausa el movimiento continuo (deriva de la horma, titular que sigue al puntero). WCAG 2.2.2. */
function MotionToggle() {
  const [state, setState] = useState<{ ready: boolean; paused: boolean; system: boolean }>({ ready: false, paused: false, system: false });
  const rtRef = useRef<ReturnType<typeof acquireRuntime> | null>(null);
  useEffect(() => {
    const rt = acquireRuntime();
    rtRef.current = rt;
    const read = () => setState({ ready: true, paused: rt.userPaused, system: rt.reduced && !rt.userPaused });
    read();
    const off = rt.onMotionChange(read);
    return () => { off(); rtRef.current = null; releaseRuntime(); };
  }, []);
  // Con la preferencia del sistema activa no hay movimiento que pausar.
  if (!state.ready || state.system) return null;
  return (
    <button
      type="button"
      className="aw-pause"
      aria-pressed={state.paused}
      onClick={() => rtRef.current?.setUserPaused(!state.paused)}
    >
      <span aria-hidden="true">{state.paused ? "▶" : "❚❚"}</span>
      <span className="aw-pause__text">Pausar movimiento</span>
    </button>
  );
}

export default function AwardShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <a className="aw-skip" href="#contenido">Saltar al contenido</a>
        <Header />
        {children}
        <CartDrawer />
      </CartProvider>
    </MotionConfig>
  );
}
