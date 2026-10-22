import { bloqueNegocio, producto } from "@/components/claude/datos";

// Cuenta para cocinas: cuánto semiduro usa por semana y cuánto cuesta en
// bloques de 2,5 kg frente al precio por kilo al detalle. Los precios salen
// de lib/products.ts; los gramos por plato son una referencia que el negocio
// ajusta a su receta. Montos en colones enteros.

export const KG_POR_BLOQUE = 2.5;

export const TIPOS_NEGOCIO = [
  { id: "soda", etiqueta: "Soda o casados", gramos: 40 },
  { id: "restaurante", etiqueta: "Restaurante", gramos: 60 },
  { id: "pizzeria", etiqueta: "Pizzería", gramos: 120 },
  { id: "cafeteria", etiqueta: "Cafetería o panadería", gramos: 35 },
  { id: "catering", etiqueta: "Hotel o catering", gramos: 50 },
] as const;

export type TipoNegocio = (typeof TIPOS_NEGOCIO)[number]["id"];

const semiduro = producto("semiduro-tradicional")!;

/** Precio por kilo comprando en bloque (₡12.500 / 2,5 kg = ₡5.000). */
export const PRECIO_KG_BLOQUE = Math.round(bloqueNegocio.priceCRC / KG_POR_BLOQUE);
/** Precio por kilo del mismo semiduro al detalle. */
export const PRECIO_KG_DETALLE = semiduro.priceCRC;

export interface Volumen {
  kgSemana: number;
  bloques: number;
  costoBloques: number;
  costoDetalle: number;
  ahorroSemana: number;
  ahorroMes: number;
}

export function calcularVolumen(platosSemana: number, gramosPlato: number): Volumen {
  const kgSemana = Math.max(0, (platosSemana * gramosPlato) / 1000);
  const bloques = Math.max(1, Math.ceil(kgSemana / KG_POR_BLOQUE));
  const costoBloques = bloques * bloqueNegocio.priceCRC;
  // Mismos kilos comprados al detalle, para comparar peras con peras.
  const costoDetalle = Math.round(bloques * KG_POR_BLOQUE * PRECIO_KG_DETALLE);
  const ahorroSemana = costoDetalle - costoBloques;
  return {
    kgSemana,
    bloques,
    costoBloques,
    costoDetalle,
    ahorroSemana,
    ahorroMes: Math.round((ahorroSemana * 52) / 12),
  };
}

/** «12,5 kg» con coma decimal y medio kilo de precisión. */
export function kilos(kg: number): string {
  const redondeado = Math.round(kg * 2) / 2;
  return `${String(redondeado).replace(".", ",")} kg`;
}
