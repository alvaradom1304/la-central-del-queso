"use client";

import React from "react";
import FilmGrain from "./FilmGrain";
import FrameImage from "./FrameImage";
import { cartela } from "./format";
import {
  DEFAULT_NOTICE,
  FALLBACK_TRAMOS,
  fallbackImageFor,
  frameUrl,
  representativeFrame,
  type FincaManifest,
} from "./fincaManifest";

interface StaticTramosProps {
  /** null si el manifiesto aún no existe: se usan imágenes ya publicadas. */
  manifest: FincaManifest | null;
  /** Cargar la primera imagen con prioridad (solo cuando este modo es seguro). */
  priorityFirst?: boolean;
}

/**
 * Versión estática del recorrido: un bloque por tramo con un fotograma
 * representativo como <img> y su cartela. Se usa con prefers-reduced-motion,
 * sin manifiesto o si el canvas falla.
 */
export default function StaticTramos({ manifest, priorityFirst = false }: StaticTramosProps) {
  const tramos = manifest?.tramos ?? FALLBACK_TRAMOS;
  const notice = manifest?.notice ?? DEFAULT_NOTICE;

  return (
    <section aria-label="Recorrido por la finca" className="bg-[#0E0C09] px-6 pb-28 pt-28 sm:px-12 sm:pt-36 lg:px-20">
      <ol className="mx-auto max-w-7xl space-y-28 sm:space-y-40">
        {tramos.map((tramo, i) => {
          const fallback = fallbackImageFor(tramo.id, i);
          const frame = manifest ? representativeFrame(manifest, tramo) : null;
          const variant = manifest?.variants.desktop;
          const label = cartela(i, tramo.kicker || tramo.title);
          return (
            <li key={tramo.id} id={`tramo-${tramo.id}`} className="scroll-mt-24">
              <article aria-labelledby={`tramo-estatico-${tramo.id}`}>
                <figure>
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#17130E] sm:aspect-video">
                    <FrameImage
                      src={manifest && variant && frame ? frameUrl(variant, frame, manifest.pad) : undefined}
                      width={variant?.width ?? fallback.width}
                      height={variant?.height ?? fallback.height}
                      alt={`Recreación visual del tramo ${label}`}
                      fallback={fallback}
                      priority={priorityFirst && i === 0}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <FilmGrain />
                  </div>
                  <figcaption className="mt-3 text-right text-[10px] uppercase tracking-[0.24em] text-[#F2EDE3]/45">
                    {notice}
                  </figcaption>
                </figure>
                <div className="mt-8 max-w-xl sm:mt-10">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#C4A56E] sm:text-[11px]">{label}</p>
                  <h2
                    id={`tramo-estatico-${tramo.id}`}
                    className="mt-5 text-balance font-serif text-5xl font-normal leading-[0.95] tracking-[-0.01em] text-[#F2EDE3] sm:text-6xl"
                  >
                    {tramo.title}
                  </h2>
                  {tramo.text ? (
                    <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-[#F2EDE3]/70">{tramo.text}</p>
                  ) : null}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
