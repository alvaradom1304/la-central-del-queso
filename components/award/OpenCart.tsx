"use client";

import type { ReactNode } from "react";
import { useCart } from "@/lib/CartContext";

/** Botón que abre el cajón de pedido existente (CartDrawer). */
export default function OpenCart({ children, className }: { children: ReactNode; className?: string }) {
  const { setIsCartOpen } = useCart();
  return (
    <button type="button" className={className} onClick={() => setIsCartOpen(true)} data-attract>
      {children}
    </button>
  );
}
