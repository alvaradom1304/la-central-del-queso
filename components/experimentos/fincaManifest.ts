// Contrato de datos del recorrido por fotogramas (public/frames/finca/manifest.json).
// Módulo puro: lo usan el servidor (lectura del manifiesto) y el cliente (render).
// No contiene datos de la finca: los textos de los tramos vienen del manifiesto.

export type FrameVariantKey = "desktop" | "mobile";

export interface FrameVariant {
  width: number;
  height: number;
  /** Ruta con el marcador {n}, p. ej. "/frames/finca/desktop/f_{n}.webp". */
  pattern: string;
}

export interface Tramo {
  id: string;
  start: number;
  end: number;
  kicker: string;
  title: string;
  text: string;
}

export interface FincaManifest {
  version: number;
  provisional: boolean;
  notice: string;
  frameCount: number;
  pad: number;
  variants: Record<FrameVariantKey, FrameVariant>;
  tramos: Tramo[];
}

export interface StaticImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const DEFAULT_NOTICE = "Recreación visual provisional";

const MAX_FRAMES = 600;
const MAX_PAD = 6;
const MAX_TEXT = 600;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveInt(value: unknown, max: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= max;
}

function cleanText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return value.trim().slice(0, MAX_TEXT);
}

// Solo rutas propias bajo /frames/ con el marcador {n}: el manifiesto no puede
// apuntar a otros orígenes ni salir de la carpeta pública de fotogramas.
function isSafePattern(pattern: string): boolean {
  return (
    pattern.startsWith("/frames/") &&
    pattern.includes("{n}") &&
    !pattern.includes("..") &&
    !pattern.includes("//") &&
    /^[A-Za-z0-9_\-./{}]+$/.test(pattern)
  );
}

function parseVariant(value: unknown): FrameVariant | null {
  if (!isRecord(value)) return null;
  const { width, height, pattern } = value;
  if (!isPositiveInt(width, 8192) || !isPositiveInt(height, 8192)) return null;
  if (typeof pattern !== "string" || !isSafePattern(pattern)) return null;
  return { width, height, pattern };
}

function parseTramo(value: unknown): Tramo | null {
  if (!isRecord(value)) return null;
  const id = cleanText(value.id);
  const kicker = cleanText(value.kicker);
  const title = cleanText(value.title);
  const text = cleanText(value.text) ?? "";
  const { start, end } = value;
  if (!id || !/^[a-z0-9-]+$/i.test(id) || kicker === null || !title) return null;
  if (typeof start !== "number" || typeof end !== "number") return null;
  if (!(start >= 0 && end <= 1 && start < end)) return null;
  return { id, start, end, kicker, title, text };
}

/**
 * Valida el manifiesto. Si algo no cumple el contrato devuelve null y la página
 * usa la alternativa estática en lugar de fallar.
 */
export function parseFincaManifest(raw: unknown): FincaManifest | null {
  if (!isRecord(raw)) return null;
  const { frameCount, pad, variants } = raw;
  if (!isPositiveInt(frameCount, MAX_FRAMES) || !isPositiveInt(pad, MAX_PAD)) return null;
  if (String(frameCount).length > pad) return null;
  if (!isRecord(variants)) return null;

  const desktop = parseVariant(variants.desktop);
  const mobile = parseVariant(variants.mobile);
  if (!desktop || !mobile) return null;

  if (!Array.isArray(raw.tramos)) return null;
  const tramos: Tramo[] = [];
  for (const item of raw.tramos) {
    const tramo = parseTramo(item);
    if (!tramo) return null;
    tramos.push(tramo);
  }
  if (tramos.length === 0 || tramos.length > 12) return null;
  tramos.sort((a, b) => a.start - b.start);
  const ids = new Set(tramos.map((t) => t.id));
  if (ids.size !== tramos.length) return null;

  const notice = cleanText(raw.notice) || DEFAULT_NOTICE;

  return {
    version: typeof raw.version === "number" ? raw.version : 1,
    provisional: raw.provisional !== false,
    notice,
    frameCount,
    pad,
    variants: { desktop, mobile },
    tramos,
  };
}

/** URL del fotograma `frameNumber` (1-based) con relleno de ceros. */
export function frameUrl(variant: FrameVariant, frameNumber: number, pad: number): string {
  return variant.pattern.replace("{n}", String(frameNumber).padStart(pad, "0"));
}

/** Fotograma representativo (1-based) de un tramo: el del centro del tramo. */
export function representativeFrame(manifest: FincaManifest, tramo: Tramo): number {
  const mid = (tramo.start + tramo.end) / 2;
  return Math.round(mid * (manifest.frameCount - 1)) + 1;
}

// ---------------------------------------------------------------------------
// Alternativa sin manifiesto: etiquetas neutras (sin afirmaciones sobre la
// finca) e imágenes ya publicadas en /public. Son recreaciones visuales.
// ---------------------------------------------------------------------------

export const FALLBACK_TRAMOS: Tramo[] = [
  { id: "porton", start: 0, end: 0.18, kicker: "Portón", title: "Bienvenido a la finca", text: "" },
  { id: "camino", start: 0.18, end: 0.4, kicker: "Camino", title: "El camino de entrada", text: "" },
  { id: "potrero", start: 0.4, end: 0.62, kicker: "Potrero", title: "Junto al potrero", text: "" },
  { id: "puerta", start: 0.62, end: 0.8, kicker: "Lechería", title: "La puerta de la lechería", text: "" },
  { id: "lecheria", start: 0.8, end: 1, kicker: "Recepción", title: "Adentro de la lechería", text: "" },
];

const FALLBACK_IMAGES: Record<string, StaticImage> = {
  porton: {
    src: "/porton_finca_turrialba.jpg",
    alt: "Portón de madera abierto hacia un potrero con vacas y un sendero de tierra entre hortensias",
    width: 1376,
    height: 768,
  },
  camino: {
    src: "/campo_floral_turrialba.jpg",
    alt: "Camino empedrado entre hortensias que baja hacia potreros con neblina",
    width: 1376,
    height: 768,
  },
  potrero: {
    src: "/potrero_vacas_lecheria.jpg",
    alt: "Vacas pastando a los lados de un camino de tierra que lleva a un establo de madera",
    width: 1376,
    height: 768,
  },
  puerta: {
    src: "/entrada_lecheria_granero.jpg",
    alt: "Puertas de madera abiertas de la lechería, con estantes de quesos al fondo y pichingas de leche en la entrada",
    width: 1376,
    height: 768,
  },
  lecheria: {
    src: "/lecheria_proceso_artesanal.jpg",
    alt: "Interior de una lechería de madera donde dos personas trabajan la cuajada junto a una paila humeante",
    width: 1376,
    height: 768,
  },
};

const FALLBACK_ORDER = ["porton", "camino", "potrero", "puerta", "lecheria"];

/** Imagen estática de respaldo para un tramo (por id o, si no coincide, por posición). */
export function fallbackImageFor(tramoId: string, index: number): StaticImage {
  return (
    FALLBACK_IMAGES[tramoId] ??
    FALLBACK_IMAGES[FALLBACK_ORDER[Math.min(Math.max(index, 0), FALLBACK_ORDER.length - 1)]]
  );
}
