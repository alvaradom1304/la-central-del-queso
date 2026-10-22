"use client";

import React, { useEffect, useRef } from "react";
import FilmGrain from "./FilmGrain";
import FrameImage from "./FrameImage";
import { cartela, toRoman } from "./format";
import { fallbackImageFor, frameUrl, type FincaManifest } from "./fincaManifest";
import { createFrameSequence, type FrameSequenceHandle } from "./frameSequenceEngine";

interface FrameSequenceScrollProps {
  manifest: FincaManifest;
  /** false mientras no se sepa si el usuario pide movimiento reducido. */
  enabled: boolean;
  /** Se llama si el canvas o los fotogramas fallan: la página pasa a la versión estática. */
  onFallback: () => void;
  /** Alto de la sección en vh (recorrido de scroll). */
  heightVh?: number;
  /** Objetos tocables por id de tramo; aparecen y se funden con su tramo. */
  sceneOverlays?: Partial<Record<string, React.ReactNode>>;
  /** true mientras el escenario está fijo a pantalla completa; false cuando la sección termina. */
  onPinnedChange?: (pinned: boolean) => void;
}

// Viñeta desde la esquina inferior izquierda: legibilidad del texto sin bandas.
const VIGNETTE_STYLE: React.CSSProperties = {
  background:
    "radial-gradient(135% 100% at 0% 100%, rgba(14,12,9,0.9) 0%, rgba(14,12,9,0.58) 30%, rgba(14,12,9,0.18) 54%, rgba(14,12,9,0) 72%), " +
    "linear-gradient(to top, rgba(14,12,9,0.45) 0%, rgba(14,12,9,0) 22%)",
};

const TEXT_SHADOW = "[text-shadow:0_1px_14px_rgba(14,12,9,0.6)]";

/**
 * Recorrido por secuencia de fotogramas: sección alta con un canvas sticky a
 * pantalla completa. El progreso sale del scroll nativo de la sección.
 * Todo lo que cambia por fotograma (canvas, opacidad de textos, línea de
 * progreso) lo escribe el motor sobre refs, nunca con estado de React.
 */
export default function FrameSequenceScroll({
  manifest,
  enabled,
  onFallback,
  heightVh = 560,
  sceneOverlays,
  onPinnedChange,
}: FrameSequenceScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const stepRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const handleRef = useRef<FrameSequenceHandle | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const onPinnedChangeRef = useRef(onPinnedChange);
  onPinnedChangeRef.current = onPinnedChange;

  // El escenario deja de estar fijo cuando el final de la sección entra en pantalla.
  useEffect(() => {
    const end = endRef.current;
    if (!end) return;
    const observer = new IntersectionObserver(([entry]) => {
      onPinnedChangeRef.current?.(!entry.isIntersecting && entry.boundingClientRect.top > 0);
    });
    observer.observe(end);
    return () => observer.disconnect();
  }, []);
  const onFallbackRef = useRef(onFallback);

  useEffect(() => {
    onFallbackRef.current = onFallback;
  }, [onFallback]);

  useEffect(() => {
    if (!enabled) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;

    const handle = createFrameSequence(
      manifest,
      {
        section,
        stage,
        canvas,
        layers: layerRefs.current,
        sceneLayers: sceneRefs.current,
        progressFill: progressFillRef.current,
        steps: stepRefs.current,
      },
      () => onFallbackRef.current(),
    );
    handleRef.current = handle;
    return () => {
      handle.destroy();
      handleRef.current = null;
    };
  }, [enabled, manifest]);

  const { tramos, variants, pad, notice } = manifest;
  const posterFallback = fallbackImageFor(tramos[0].id, 0);

  return (
    <section
      ref={sectionRef}
      aria-label="Recorrido por la finca"
      className="relative bg-[#0E0C09]"
      style={{ height: `${heightVh}vh` }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#0E0C09] supports-[height:100svh]:h-svh"
      >
        {/* Póster: visible antes de hidratar y como respaldo si el canvas falla. */}
        <FrameImage
          src={frameUrl(variants.desktop, 1, pad)}
          portraitSrc={frameUrl(variants.mobile, 1, pad)}
          width={variants.desktop.width}
          height={variants.desktop.height}
          alt=""
          fallback={posterFallback}
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />

        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          style={{ opacity: 0 }}
        />

        <FilmGrain />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={VIGNETTE_STYLE} />

        {/* Objetos tocables de cada tramo, entre la imagen y los textos. */}
        {sceneOverlays
          ? tramos.map((tramo, i) =>
              sceneOverlays[tramo.id] ? (
                <div
                  key={tramo.id}
                  ref={(el) => {
                    sceneRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[5]"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  {sceneOverlays[tramo.id]}
                </div>
              ) : null,
            )
          : null}

        {/* Línea de progreso vertical con una marca por tramo. */}
        <nav
          aria-label="Tramos del recorrido"
          className="absolute right-2 top-1/2 z-20 h-[40vh] w-8 -translate-y-1/2 [filter:drop-shadow(0_0_5px_rgba(14,12,9,0.65))] sm:right-8 lg:right-16"
        >
          <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#F2EDE3]/35">
            <span
              ref={progressFillRef}
              className="absolute inset-0 origin-top bg-[#C4A56E]"
              style={{ transform: "scaleY(0)" }}
            />
          </span>
          <ol className="absolute inset-0">
            {tramos.map((tramo, i) => {
              const label = cartela(i, tramo.kicker || tramo.title);
              return (
                <li key={tramo.id} className="absolute inset-x-0" style={{ top: `${tramo.start * 100}%` }}>
                  <button
                    ref={(el) => {
                      stepRefs.current[i] = el;
                    }}
                    type="button"
                    aria-label={`Ir a ${label}`}
                    aria-current={i === 0 ? "step" : undefined}
                    onClick={() => handleRef.current?.scrollToTramo(i)}
                    className="group absolute left-1/2 top-0 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-[#F2EDE3]"
                  >
                    <span
                      aria-hidden="true"
                      className="block h-px w-2.5 bg-[#F2EDE3]/55 transition-[width,background-color] duration-300 group-hover:w-4 group-hover:bg-[#F2EDE3] group-aria-[current=step]:w-4 group-aria-[current=step]:bg-[#C4A56E]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-full mr-1 whitespace-nowrap text-[10px] uppercase tracking-[0.28em] text-[#F2EDE3]/70 transition-colors duration-300 group-hover:text-[#F2EDE3] group-focus-visible:text-[#F2EDE3] group-aria-[current=step]:text-[#F2EDE3]/90"
                    >
                      {toRoman(i + 1)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Capas de texto: esquina inferior izquierda, sobre la retícula de la cabecera. */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {tramos.map((tramo, i) => (
            <div
              key={tramo.id}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              className="absolute bottom-0 left-0 w-full max-w-[36rem] pb-20 pl-6 pr-16 sm:pb-24 sm:pl-12 sm:pr-12 lg:pl-20"
              style={{
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? "translate3d(0, 0px, 0)" : "translate3d(0, 10px, 0)",
              }}
            >
              <article aria-labelledby={`tramo-titulo-${tramo.id}`} className={TEXT_SHADOW}>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#F2EDE3]/80 sm:text-[11px]">
                  {cartela(i, tramo.kicker || tramo.title)}
                </p>
                <h2
                  id={`tramo-titulo-${tramo.id}`}
                  className="mt-5 text-balance font-serif text-5xl font-normal leading-[0.95] tracking-[-0.01em] text-[#F2EDE3] sm:text-6xl lg:text-7xl"
                >
                  {tramo.title}
                </h2>
                {tramo.text ? (
                  <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-[#F2EDE3]/85">{tramo.text}</p>
                ) : null}
              </article>
            </div>
          ))}
        </div>

        {/* Aviso de recreación provisional. */}
        <p
          className={`absolute bottom-7 right-6 z-20 text-[10px] uppercase tracking-[0.24em] text-[#F2EDE3]/70 sm:bottom-9 sm:right-12 lg:right-20 ${TEXT_SHADOW}`}
        >
          {notice}
        </p>
      </div>
      <div ref={endRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" />
    </section>
  );
}
