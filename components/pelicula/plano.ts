import {
  DEFAULT_NOTICE,
  fallbackImageFor,
  frameUrl,
  type FincaManifest,
  type StaticImage,
} from "@/components/experimentos/fincaManifest";

// Los fotogramas provisionales v1 muestran, desde el f_0113, el interior de la
// lechería con personas generadas por IA (docs/experimentos/plano-secuencia-finca.md
// lo marca como «no usar»). La película corta en la puerta abierta (f_0112) y
// pasa a la mesa. Con otra versión de fotogramas se usa el plano completo.
const ULTIMO_FOTOGRAMA_V1 = 112;

/** Manifiesto recortado a la puerta de la lechería, con los tramos reescalados. */
export function recortarPlano(manifest: FincaManifest): FincaManifest {
  const ultimo = ULTIMO_FOTOGRAMA_V1;
  if (!manifest.variants.desktop.pattern.includes("/finca/v1/") || manifest.frameCount <= ultimo) return manifest;
  const escala = (manifest.frameCount - 1) / (ultimo - 1);
  const tramos = manifest.tramos
    .map((t) => ({ ...t, start: t.start * escala, end: Math.min(1, t.end * escala) }))
    .filter((t) => t.start < 0.98);
  if (tramos.length === 0) return manifest;
  tramos[tramos.length - 1] = { ...tramos[tramos.length - 1], end: 1 };
  return { ...manifest, frameCount: ultimo, tramos };
}

export interface Poster {
  src?: string;
  portraitSrc?: string;
  width: number;
  height: number;
  fallback: StaticImage;
}

/** Primer fotograma del plano: cierra la apertura y abre el acto de la finca. */
export function posterDelPlano(manifest: FincaManifest | null): Poster {
  const fallback = fallbackImageFor("porton", 0);
  if (!manifest) return { width: fallback.width, height: fallback.height, fallback };
  const { desktop, mobile } = manifest.variants;
  return {
    src: frameUrl(desktop, 1, manifest.pad),
    portraitSrc: frameUrl(mobile, 1, manifest.pad),
    width: desktop.width,
    height: desktop.height,
    fallback,
  };
}

export function avisoDeImagenes(manifest: FincaManifest | null): string {
  return manifest?.notice ?? DEFAULT_NOTICE;
}
