"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import FrameImage from "@/components/experimentos/FrameImage";
import { siguienteFeria } from "@/components/claude/datos";
import { Neblina, Polen, Rayos } from "./Atmosfera";
import { useCamaraEnMano, useCine, useIrAId } from "./cine";
import { registrarEvento } from "./eventos";
import type { Poster } from "./plano";

/**
 * Portada: amanece en la finca. La propuesta de valor y la bifurcación
 * comercial (casa / negocio) están en el primer cuadro; al bajar, la cámara
 * avanza hacia el portón, que es el primer fotograma del recorrido.
 */
export default function Amanecer({ poster }: { poster: Poster }) {
  const ref = useRef<HTMLElement>(null);
  const camaraRef = useRef<HTMLDivElement>(null);
  const { irA, elegirSegmento, segmento } = useCine();
  const irAId = useIrAId();
  useCamaraEnMano(camaraRef);
  // Fecha real de la próxima feria (depende del reloj del visitante: al montar).
  const [proxima, setProxima] = useState("");

  useEffect(() => {
    const p = siguienteFeria();
    const cierre = p.feria.horario.split("–")[1]?.trim() ?? "";
    setProxima(
      p.abierta
        ? `Hoy estamos en la Feria de ${p.feria.nombre}, hasta la ${cierre}`
        : `Próxima feria: ${p.fecha}, en ${p.feria.nombre}`
    );
  }, []);
  const negocioPrimero = segmento === "negocio";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(ref);
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom bottom", scrub: true },
          })
          .fromTo(q(".cine-apertura-imagen"), { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
          // Solo opacidad (no visibility): los botones siguen al alcance del teclado.
          .to(q(".cine-amanecer-contenido"), { opacity: 0, y: -48, duration: 0.45 }, 0.08)
          .to(q(".cine-pista"), { opacity: 0, duration: 0.12 }, 0)
          .to(q(".cine-neblina"), { yPercent: -14, duration: 1 }, 0)
          .to(q(".cine-rayos"), { opacity: 0.15, duration: 1 }, 0);
      });
    },
    { scope: ref }
  );

  const elegir = (s: "casa" | "negocio") => {
    elegirSegmento(s);
    registrarEvento("segmento_elegido", { segmento: s, origen: "portada" });
    const destino = document.getElementById(s === "casa" ? "carta" : "negocios");
    if (destino) irA(destino, { foco: true });
  };

  return (
    <section
      ref={ref}
      id="inicio"
      aria-labelledby="titulo-portada"
      className="cine-amanecer relative motion-safe:h-[200vh]"
    >
      <div className="cine-escenario relative motion-safe:sticky motion-safe:top-0" data-cursor="Avance">
        <div ref={camaraRef} className="absolute inset-0">
          <FrameImage
            src={poster.src}
            portraitSrc={poster.portraitSrc}
            width={poster.width}
            height={poster.height}
            alt=""
            fallback={poster.fallback}
            priority
            className="cine-imagen-plena cine-apertura-imagen"
          />
        </div>
        <Rayos />
        <Neblina />
        <Polen />
        <div className="cine-vineta" aria-hidden="true" />

        {/* Con la escena avanzada el texto está transparente: si el teclado llega a
            un botón (p. ej. Shift+Tab desde la finca), la página vuelve al inicio. */}
        <div
          className="cine-amanecer-contenido"
          onFocus={(e) => {
            if (window.scrollY > 8 && (e.target as HTMLElement).matches(":focus-visible")) irA(0, { duracion: 0.6 });
          }}
        >
          <p className="cine-kicker cine-entrada" style={{ "--d": 100 } as React.CSSProperties}>
            La Central del Queso · Quesos Doña Martha
          </p>
          <h1 id="titulo-portada" className="cine-titular cine-entrada mt-5" style={{ "--d": 200 } as React.CSSProperties}>
            Quesos de Turrialba, del campo a su mesa
          </h1>
          <p className="cine-amanecer-intro cine-entrada mt-6" style={{ "--d": 450 } as React.CSSProperties}>
            Quesos frescos y madurados, natilla y mantequilla que llegan cada semana a las ferias de Guadalupe y Hatillo.
            Apártelos por WhatsApp o pídalos por volumen para su negocio.
          </p>
          <div className="cine-entrada mt-8 flex flex-wrap gap-3" style={{ "--d": 650 } as React.CSSProperties}>
            {/* El llamado principal sigue al segmento (p. ej. ?segmento=negocio desde un QR para restaurantes). */}
            <button
              type="button"
              className={negocioPrimero ? "cine-boton cine-boton-linea text-[var(--crema)]" : "cine-boton"}
              onClick={() => elegir("casa")}
            >
              Comprar para mi casa
            </button>
            <button
              type="button"
              className={negocioPrimero ? "cine-boton" : "cine-boton cine-boton-linea text-[var(--crema)]"}
              onClick={() => elegir("negocio")}
            >
              Soy restaurante o negocio
            </button>
          </div>
          <p className="cine-entrada mt-5 min-h-[1.5em] text-sm text-[var(--miel-clara)] [text-shadow:0_1px_10px_rgba(0,0,0,.7)]" style={{ "--d": 750 } as React.CSSProperties}>
            {proxima}
          </p>
          <a
            href="#finca"
            onClick={(e) => irAId(e, "finca")}
            className="cine-entrada mt-4 inline-block py-2 text-sm cine-crema-80 underline underline-offset-4 hover:text-[var(--miel-clara)]"
            style={{ "--d": 800 } as React.CSSProperties}
          >
            o recorra la finca primero ↓
          </a>
        </div>

        <p className="cine-pista" aria-hidden="true">
          Deslice
        </p>
      </div>
    </section>
  );
}
