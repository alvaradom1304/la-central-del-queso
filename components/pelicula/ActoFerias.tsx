"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { FERIAS, proximaFecha } from "@/components/claude/datos";
import type { FotosReales } from "@/lib/fotos";
import { revelarTitulares, useCine } from "./cine";
import { registrarEvento } from "./eventos";
import Galeria, { type FotoGaleria } from "./Galeria";

// Ferias: dónde y cuándo recoger. La próxima fecha depende del reloj del
// visitante, así que se calcula al montar. Con fotos reales de la sesión, cada
// tarjeta muestra su puesto y debajo va lo que pasa en él (balanza, prueba, entrega).

const PORTADA_FERIA = ["frente", "mostrador", "amanecer"];
const MOMENTOS = ["balanza", "prueba", "entrega", "retrato"];

export default function ActoFerias({ fotos }: { fotos: FotosReales["ferias"] }) {
  const ref = useRef<HTMLElement>(null);
  const { abrirPedido } = useCine();
  const [proximas, setProximas] = useState<Record<string, string>>({});

  // Cada momento una sola vez, de la primera feria que lo tenga.
  const momentos: FotoGaleria[] = MOMENTOS.flatMap((toma) => {
    for (const f of FERIAS) {
      const foto = fotos[f.id]?.find((x) => x.toma === toma);
      if (foto) return [{ clave: `${f.id}-${toma}`, titulo: foto.titulo, alt: foto.alt, src: foto.src }];
    }
    return [];
  }).slice(0, 3);

  useEffect(() => {
    setProximas(Object.fromEntries(FERIAS.map((f) => [f.id, proximaFecha(f).fecha])));
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const raiz = ref.current!;
        const deshacer = revelarTitulares(raiz);
        raiz.querySelectorAll<HTMLElement>(".cine-feria").forEach((tarjeta, i) => {
          gsap.from(tarjeta, {
            y: 50,
            opacity: 0,
            duration: 0.9,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: tarjeta, start: "top 90%", once: true },
          });
        });
        return deshacer;
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="ferias" tabIndex={-1} aria-labelledby="ferias-titulo" className="cine-ferias focus:outline-none">
      <div className="mx-auto max-w-6xl">
        <p className="cine-kicker">Cada fin de semana</p>
        <h2 id="ferias-titulo" className="cine-titular mt-4 text-[clamp(2.6rem,5vw,4.6rem)]" data-revelar>
          Encuéntrenos en la feria
        </h2>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed cine-crema-80">
          Ferias del Agricultor de Guadalupe y Hatillo, en San José, Costa Rica. Apártelo antes por WhatsApp y recójalo en
          el puesto; ahí mismo puede probar antes de llevar.
        </p>

        <ol className="mt-12 grid gap-6 md:grid-cols-2">
          {FERIAS.map((f) => (
            <li key={f.id} className="cine-feria">
              {(() => {
                const portada = PORTADA_FERIA.map((t) => fotos[f.id]?.find((x) => x.toma === t)).find(Boolean);
                return portada ? (
                  <div className="cine-feria-foto">
                    <Image src={portada.src} alt={portada.alt} fill sizes="(min-width: 768px) 45vw, 90vw" />
                  </div>
                ) : null;
              })()}
              <h3 className="cine-titular text-3xl">Feria de {f.nombre}</h3>
              <dl>
                <dt>Día</dt>
                <dd>{f.diaTexto}</dd>
                <dt>Horario</dt>
                <dd className="tabular-nums">{f.horario}</dd>
                <dt>Puesto</dt>
                <dd>{f.puesto}</dd>
                <dt>Próxima</dt>
                <dd className="first-letter:uppercase">{proximas[f.id] ?? f.diaTexto}</dd>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={f.mapsUrl} target="_blank" rel="noopener noreferrer" className="cine-boton cine-boton-linea text-[var(--crema)]">
                  Google Maps
                </a>
                <a href={f.wazeUrl} target="_blank" rel="noopener noreferrer" className="cine-boton cine-boton-linea text-[var(--crema)]">
                  Waze
                </a>
              </div>
            </li>
          ))}
        </ol>

        <Galeria className="mt-8" etiqueta="En el puesto" fotos={momentos} />

        <button
          type="button"
          className="cine-boton mt-10"
          onClick={() => {
            registrarEvento("pedido_abierto", { origen: "ferias" });
            abrirPedido();
          }}
        >
          Apartar mi pedido
        </button>
      </div>
    </section>
  );
}
