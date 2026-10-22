import { products, type Product } from "@/lib/products";
import { locations } from "@/lib/locations";

// Capa editorial de la propuesta «El Puesto». Los precios, nombres y perfiles
// sensoriales salen de lib/products.ts; aquí solo se decide cómo se presentan.

export type Uso = "sarten" | "desayuno" | "rallar" | "derretir" | "picar" | "negocio";

export const USOS: { id: Uso; etiqueta: string }[] = [
  { id: "sarten", etiqueta: "Para el sartén" },
  { id: "desayuno", etiqueta: "Para el desayuno" },
  { id: "rallar", etiqueta: "Para rallar" },
  { id: "derretir", etiqueta: "Para derretir" },
  { id: "picar", etiqueta: "Para picar" },
  { id: "negocio", etiqueta: "Para su negocio" },
];

export type Ilus =
  | "semiduro"
  | "maduro"
  | "ahumado"
  | "fresco"
  | "tierno"
  | "bagaces"
  | "palmito"
  | "cuajada"
  | "natilla"
  | "mantequilla"
  | "surtido"
  | "bloque";

interface Ficha {
  ilus: Ilus;
  usos: Uso[];
  // Unidad de venta cuando no se vende por kilo; «precio» acompaña al monto.
  unidad?: { singular: string; plural: string; precio: string };
}

const FICHAS: Record<string, Ficha> = {
  "semiduro-tradicional": { ilus: "semiduro", usos: ["sarten", "desayuno", "rallar"] },
  "turrialba-artesanal": { ilus: "fresco", usos: ["desayuno"] },
  "queso-tierno": { ilus: "tierno", usos: ["desayuno"] },
  "queso-palmito": {
    ilus: "palmito",
    usos: ["derretir", "desayuno"],
    unidad: { singular: "rollo", plural: "rollos", precio: "el rollo · aprox. 500 g" },
  },
  "queso-bagaces": { ilus: "bagaces", usos: ["rallar"] },
  "cuajada-criolla": {
    ilus: "cuajada",
    usos: ["desayuno"],
    unidad: { singular: "bola", plural: "bolas", precio: "la bola" },
  },
  "maduro-reserva": { ilus: "maduro", usos: ["picar", "derretir"] },
  "ahumado-lena": { ilus: "ahumado", usos: ["picar", "sarten"] },
  "natilla-casera": {
    ilus: "natilla",
    usos: ["desayuno"],
    unidad: { singular: "envase de 500 g", plural: "envases de 500 g", precio: "el envase de 500 g" },
  },
  "mantequilla-lavada": {
    ilus: "mantequilla",
    usos: ["desayuno", "sarten"],
    unidad: { singular: "barra de 250 g", plural: "barras de 250 g", precio: "la barra de 250 g" },
  },
  "combo-familiar": {
    ilus: "surtido",
    usos: ["desayuno"],
    unidad: { singular: "surtido", plural: "surtidos", precio: "el surtido · 2 kg" },
  },
  "bloque-b2b-semiduro": {
    ilus: "bloque",
    usos: ["negocio"],
    unidad: { singular: "bloque de 2,5 kg", plural: "bloques de 2,5 kg", precio: "el bloque de 2,5 kg" },
  },
};

export function ficha(p: Product): Ficha {
  return FICHAS[p.id] ?? { ilus: "fresco", usos: [] };
}

export const porKilo = (p: Product) => p.unit === "kg";
export const paso = (p: Product) => (porKilo(p) ? 0.5 : 1);

export function producto(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export const bloqueNegocio = producto("bloque-b2b-semiduro")!;

// ₡5.500 — punto como separador de miles, como en los rótulos de feria.
export function colones(n: number): string {
  const entero = Math.round(n);
  return "₡" + String(entero).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function fraccion(q: number): string {
  const entero = Math.floor(q);
  const medio = q - entero >= 0.5;
  if (entero === 0) return medio ? "½" : "0";
  return medio ? `${entero}½` : String(entero);
}

export function cantidadTexto(p: Product, q: number): string {
  if (porKilo(p)) return `${fraccion(q)} kg`;
  const u = ficha(p).unidad ?? { singular: "unidad", plural: "unidades" };
  return `${q} ${q === 1 ? u.singular : u.plural}`;
}

export function precioEtiqueta(p: Product): string {
  if (porKilo(p)) return "el kilo";
  return ficha(p).unidad?.precio ?? "c/u";
}

// ---------- Canasta de feria ----------
// Conserva los factores y umbrales de la calculadora original CheeseMatcher.

export type Frecuencia = "finde" | "diario" | "eventos";

export const FRECUENCIAS: { id: Frecuencia; etiqueta: string; resumen: string }[] = [
  { id: "finde", etiqueta: "Fin de semana", resumen: "fin de semana" },
  { id: "diario", etiqueta: "Todos los días", resumen: "consumo diario" },
  { id: "eventos", etiqueta: "Para compartir", resumen: "para compartir" },
];

export interface LineaCanasta {
  producto: Product;
  cantidad: number;
}

export function calcularCanasta({
  personas,
  frecuencia,
  palmito,
  natilla,
}: {
  personas: number;
  frecuencia: Frecuencia;
  palmito: boolean;
  natilla: boolean;
}): { lineas: LineaCanasta[]; total: number; disponible: boolean } {
  const factor = frecuencia === "finde" ? 0.22 : frecuencia === "diario" ? 0.42 : 0.65;
  const kilos = Math.max(1, Math.round(personas * factor));
  const lineas = [
    { id: "semiduro-tradicional", cantidad: kilos },
    ...(palmito ? [{ id: "queso-palmito", cantidad: personas >= 6 ? 2 : 1 }] : []),
    ...(natilla ? [{ id: "natilla-casera", cantidad: personas >= 5 ? 2 : 1 }] : []),
  ].map((l) => ({ producto: producto(l.id)!, cantidad: l.cantidad }));
  return {
    lineas,
    total: lineas.reduce((s, l) => s + l.producto.priceCRC * l.cantidad, 0),
    disponible: lineas.every((l) => l.producto.inStock),
  };
}

// ---------- Ferias ----------
// Horarios estructurados a partir de lib/locations.ts (daysHours).

export interface Feria {
  id: "guadalupe" | "hatillo";
  nombre: string;
  dia: number; // 0 = domingo
  diaTexto: string;
  abre: number; // minutos desde medianoche
  cierra: number;
  horario: string;
  puesto: string;
  mapsUrl: string;
  wazeUrl: string;
}

const loc = (id: string) => locations.find((l) => l.id === id)!;

export const FERIAS: Feria[] = [
  {
    id: "guadalupe",
    nombre: "Guadalupe",
    dia: 6,
    diaTexto: "Sábados",
    abre: 5 * 60 + 30,
    cierra: 13 * 60,
    horario: "5:30 a. m. – 1:00 p. m.",
    puesto: loc("guadalupe").standInfo,
    mapsUrl: loc("guadalupe").mapsUrl,
    wazeUrl: loc("guadalupe").wazeUrl,
  },
  {
    id: "hatillo",
    nombre: "Hatillo",
    dia: 0,
    diaTexto: "Domingos",
    abre: 6 * 60,
    cierra: 13 * 60 + 30,
    horario: "6:00 a. m. – 1:30 p. m.",
    puesto: loc("hatillo").standInfo,
    mapsUrl: loc("hatillo").mapsUrl,
    wazeUrl: loc("hatillo").wazeUrl,
  },
];

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export interface ProximaFecha {
  feria: Feria;
  enDias: number;
  abierta: boolean;
  fecha: string; // «sábado 24 de octubre»
}

// Hora de Costa Rica (UTC−6, sin horario de verano), sin depender de la zona del navegador.
function ahoraCostaRica(base: Date) {
  const cr = new Date(base.getTime() - 6 * 60 * 60 * 1000);
  return {
    y: cr.getUTCFullYear(),
    m: cr.getUTCMonth(),
    d: cr.getUTCDate(),
    dow: cr.getUTCDay(),
    min: cr.getUTCHours() * 60 + cr.getUTCMinutes(),
  };
}

export function proximaFecha(feria: Feria, base = new Date()): ProximaFecha {
  const now = ahoraCostaRica(base);
  let enDias = (feria.dia - now.dow + 7) % 7;
  if (enDias === 0 && now.min >= feria.cierra) enDias = 7;
  const abierta = enDias === 0 && now.min >= feria.abre;
  const f = new Date(Date.UTC(now.y, now.m, now.d + enDias));
  const fecha = `${DIAS[f.getUTCDay()]} ${f.getUTCDate()} de ${MESES[f.getUTCMonth()]}`;
  return { feria, enDias, abierta, fecha };
}

/** La feria más próxima (hoy abierta, o la siguiente en el calendario). */
export function siguienteFeria(base = new Date()): ProximaFecha {
  return FERIAS.map((f) => proximaFecha(f, base)).sort(
    (a, b) => a.enDias - b.enDias || a.feria.abre - b.feria.abre
  )[0];
}
