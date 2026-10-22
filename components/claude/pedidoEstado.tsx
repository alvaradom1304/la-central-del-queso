"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { cantidadTexto, colones, paso, porKilo, producto } from "./datos";

// Estado del pedido sin interfaz: lo comparten la propuesta «El Puesto» (/claude)
// y la película de la portada. Admite medios kilos y guarda el pedido en la
// sesión del navegador.

export interface Linea {
  id: string;
  cantidad: number;
}

export interface PedidoEstado {
  lineas: Linea[];
  cantidadDe: (id: string) => number;
  agregar: (p: Product, cantidad?: number) => void;
  fijar: (id: string, cantidad: number) => void;
  vaciar: () => void;
  total: number;
  hayPorKilo: boolean;
  /** Último producto agregado, para avisarlo; se borra solo. */
  aviso: string | null;
}

const Ctx = createContext<PedidoEstado | null>(null);
const CLAVE = "cq_claude_pedido";

export function usePedidoEstado() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePedidoEstado debe usarse dentro de <PedidoEstadoProvider>");
  return c;
}

export function PedidoEstadoProvider({ children }: { children: React.ReactNode }) {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);
  // Solo se guarda después de leer la sesión: si no, el primer render (vacío)
  // pisaría el pedido guardado (en desarrollo, StrictMode lo hace visible).
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const guardado = sessionStorage.getItem(CLAVE);
      if (guardado) {
        const datos = JSON.parse(guardado) as Linea[];
        setLineas(datos.filter((l) => producto(l.id) && l.cantidad > 0));
      }
    } catch {
      // sin almacenamiento: el pedido vive solo en memoria
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado) return;
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(lineas));
    } catch {
      // idem
    }
  }, [lineas, cargado]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 2800);
    return () => clearTimeout(t);
  }, [aviso]);

  const agregar = useCallback((p: Product, cantidad = paso(p)) => {
    setLineas((prev) => {
      const ya = prev.find((l) => l.id === p.id);
      if (ya) return prev.map((l) => (l.id === p.id ? { ...l, cantidad: l.cantidad + cantidad } : l));
      return [...prev, { id: p.id, cantidad }];
    });
    setAviso(`Agregado: ${cantidadTexto(p, cantidad)} de ${p.name}`);
  }, []);

  const fijar = useCallback((id: string, cantidad: number) => {
    setLineas((prev) =>
      cantidad <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, cantidad } : l))
    );
  }, []);

  const valor = useMemo<PedidoEstado>(() => {
    const total = lineas.reduce((s, l) => s + (producto(l.id)?.priceCRC ?? 0) * l.cantidad, 0);
    return {
      lineas,
      cantidadDe: (id) => lineas.find((l) => l.id === id)?.cantidad ?? 0,
      agregar,
      fijar,
      vaciar: () => setLineas([]),
      total,
      hayPorKilo: lineas.some((l) => {
        const p = producto(l.id);
        return p ? porKilo(p) : false;
      }),
      aviso,
    };
  }, [lineas, aviso, agregar, fijar]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

/** Origen de campaña (?src= o ?utm_source=) para que el pedido diga de dónde vino. */
export function referenciaCampana(): string | null {
  try {
    const q = new URLSearchParams(window.location.search);
    const ref = q.get("src") || q.get("utm_source");
    // Solo identificadores cortos de campaña: nada de texto libre en el mensaje.
    return ref && /^[\w.-]{1,40}$/.test(ref) ? ref : null;
  } catch {
    return null;
  }
}

/** Texto del mensaje de WhatsApp con el pedido. */
export function mensajePedido({
  lineas,
  nombre,
  destino,
  total,
  hayPorKilo,
  nota,
  ref,
}: {
  lineas: Linea[];
  nombre: string;
  destino: string;
  total: number;
  hayPorKilo: boolean;
  nota: string;
  ref: string | null;
}): string {
  const filas = lineas
    .map((l) => {
      const p = producto(l.id)!;
      return `• ${cantidadTexto(p, l.cantidad)} — ${p.name}`;
    })
    .join("\n");
  return [
    `¡Hola, Doña Martha! Soy ${nombre.trim()}.`,
    "Quisiera apartar este pedido:",
    "",
    filas,
    "",
    destino,
    `Total estimado: ${colones(total)}${hayPorKilo ? " (sé que se confirma al pesar)" : ""}`,
    nota.trim() ? `Nota: ${nota.trim()}` : null,
    "",
    "¡Muchas gracias!",
    ref ? `(ref. web: ${ref})` : null,
  ]
    .filter((x) => x !== null)
    .join("\n");
}
