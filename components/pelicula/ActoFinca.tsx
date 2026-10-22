"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import FrameImage from "@/components/experimentos/FrameImage";
import {
  FALLBACK_TRAMOS,
  fallbackImageFor,
  frameUrl,
  representativeFrame,
  type FincaManifest,
} from "@/components/experimentos/fincaManifest";
import { createFrameSequence } from "@/components/experimentos/frameSequenceEngine";
import { HierbaDiferida } from "@/components/experimentos/toques/Diferidos";
import { Neblina } from "./Atmosfera";
import { useCamaraEnMano, useCine } from "./cine";
import { avisoDeImagenes } from "./plano";

/**
 * La finca: el plano secuencia del portón a la puerta de la lechería, movido
 * por el scroll con el motor de fotogramas del experimento. El relato de cada
 * tramo aparece dentro del plano y, al final del camino, la luz de la puerta
 * llena la pantalla para entrar a la mesa. Sin movimiento, sin manifiesto o si
 * el canvas falla, se muestran fotogramas fijos.
 */
export default function ActoFinca({ manifest }: { manifest: FincaManifest | null }) {
  const { reducido } = useCine();
  const [fallo, setFallo] = useState(false);
  const modo = manifest === null || fallo ? "fija" : reducido === null ? "pendiente" : reducido ? "fija" : "secuencia";

  return (
    <section id="finca" tabIndex={-1} aria-labelledby="finca-titulo" className="relative focus:outline-none">
      <h2 id="finca-titulo" className="sr-only">
        La finca: del portón a la lechería
      </h2>
      {manifest && (modo === "secuencia" || modo === "pendiente") ? (
        // En "pendiente" el CSS decide qué versión se ve en el primer pintado.
        <div className={modo === "pendiente" ? "motion-reduce:hidden" : undefined}>
          <PlanoFinca manifest={manifest} activo={modo === "secuencia"} onFallo={() => setFallo(true)} />
        </div>
      ) : null}
      {modo === "fija" || modo === "pendiente" ? (
        <div className={modo === "pendiente" ? "hidden motion-reduce:block" : undefined}>
          <FincaFija manifest={manifest} />
        </div>
      ) : null}
    </section>
  );
}

function PlanoFinca({
  manifest,
  activo,
  onFallo,
}: {
  manifest: FincaManifest;
  activo: boolean;
  onFallo: () => void;
}) {
  const seccionRef = useRef<HTMLDivElement>(null);
  const escenarioRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camaraRef = useRef<HTMLDivElement>(null);
  const capasRef = useRef<Array<HTMLDivElement | null>>([]);
  const tocablesRef = useRef<Array<HTMLDivElement | null>>([]);
  const onFalloRef = useRef(onFallo);
  onFalloRef.current = onFallo;
  useCamaraEnMano(camaraRef);

  useEffect(() => {
    if (!activo) return;
    const section = seccionRef.current;
    const stage = escenarioRef.current;
    const canvas = canvasRef.current;
    if (!section || !stage || !canvas) return;
    const handle = createFrameSequence(
      manifest,
      {
        section,
        stage,
        canvas,
        layers: capasRef.current,
        sceneLayers: tocablesRef.current,
        progressFill: null,
        steps: [],
      },
      () => onFalloRef.current()
    );
    return () => handle.destroy();
  }, [activo, manifest]);

  // Luz de la puerta: sube en el último tramo del recorrido.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: seccionRef.current, start: "top top", end: "bottom bottom", scrub: true },
          })
          .to(".cine-luz-puerta", { opacity: 0, duration: 0.86, ease: "none" })
          .to(".cine-luz-puerta", { opacity: 1, duration: 0.14, ease: "power2.in" });
      });
    },
    { scope: seccionRef }
  );

  const { tramos, variants, pad } = manifest;

  return (
    <div ref={seccionRef} className="relative" style={{ height: `${tramos.length * 100 + 120}vh` }}>
      <div ref={escenarioRef} className="cine-escenario cine-panoramico sticky top-0" data-cursor="Avance">
        <div ref={camaraRef} className="absolute inset-0">
          <FrameImage
            src={frameUrl(variants.desktop, 1, pad)}
            portraitSrc={frameUrl(variants.mobile, 1, pad)}
            width={variants.desktop.width}
            height={variants.desktop.height}
            alt=""
            fallback={fallbackImageFor(tramos[0].id, 0)}
            className="cine-imagen-plena"
          />
          <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" style={{ opacity: 0 }} />
        </div>
        <Neblina />
        <div className="cine-vineta" aria-hidden="true" />

        {/* La hierba del potrero se aparta al paso del cursor; aparece con su tramo. */}
        {tramos.map((tramo, i) =>
          tramo.id === "potrero" ? (
            <div
              key={tramo.id}
              ref={(el) => {
                tocablesRef.current[i] = el;
              }}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[5]"
              style={{ opacity: 0 }}
            >
              <HierbaDiferida />
            </div>
          ) : null
        )}

        <p className="cine-aviso-imagen">{avisoDeImagenes(manifest)}</p>

        <div className="cine-relato">
          {tramos.map((tramo, i) => (
            <div
              key={tramo.id}
              ref={(el) => {
                capasRef.current[i] = el;
              }}
              className="cine-relato-capa"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <p className="cine-kicker !mt-0">{tramo.kicker || tramo.title}</p>
              <h3 className="mt-3">{tramo.title}</h3>
              {tramo.text ? <p>{tramo.text}</p> : null}
            </div>
          ))}
        </div>

        <div className="cine-luz-puerta" aria-hidden="true" />
      </div>
    </div>
  );
}

/** Versión fija: un fotograma por tramo, en formato panorámico, con su relato debajo. */
function FincaFija({ manifest }: { manifest: FincaManifest | null }) {
  // Sin manifiesto se omite el interior de la lechería (imagen con personas generadas).
  const tramos = manifest?.tramos ?? FALLBACK_TRAMOS.filter((t) => t.id !== "lecheria");
  const aviso = avisoDeImagenes(manifest);

  return (
    <div className="px-4 pb-24 pt-[calc(var(--cabecera)+40px)] sm:px-10">
      <ol className="mx-auto max-w-6xl space-y-16 sm:space-y-24">
        {tramos.map((tramo, i) => {
          const fallback = fallbackImageFor(tramo.id, i);
          const variant = manifest?.variants.desktop;
          const frame = manifest ? representativeFrame(manifest, tramo) : null;
          return (
            <li key={tramo.id}>
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[var(--campo-musgo)] sm:aspect-[2.39/1]">
                  <FrameImage
                    src={manifest && variant && frame ? frameUrl(variant, frame, manifest.pad) : undefined}
                    width={variant?.width ?? fallback.width}
                    height={variant?.height ?? fallback.height}
                    alt={`Recreación visual: ${tramo.title.toLowerCase()}`}
                    fallback={fallback}
                    className="cine-imagen-plena"
                  />
                </div>
                <figcaption className="mx-auto mt-6 max-w-2xl text-center">
                  <span className="cine-kicker">{tramo.kicker || tramo.title}</span>
                  <span className="cine-titular mt-3 block text-3xl sm:text-4xl">{tramo.title}</span>
                  {tramo.text ? (
                    <span className="mt-2 block cine-crema-80">{tramo.text}</span>
                  ) : null}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ol>
      <p className="mt-10 text-center text-xs uppercase tracking-[0.2em] cine-crema-60">Imágenes: {aviso}</p>
    </div>
  );
}
