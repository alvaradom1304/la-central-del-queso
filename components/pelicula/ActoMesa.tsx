"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { products } from "@/lib/products";
import { USOS, cantidadTexto, colones, ficha, paso, precioEtiqueta } from "@/components/claude/datos";
import { usePedidoEstado } from "@/components/claude/pedidoEstado";
import type { FotosReales } from "@/lib/fotos";
import { revelarTitulares, useCine, useIrAId } from "./cine";
import { registrarEvento } from "./eventos";

// La mesa: al cruzar la puerta, los quesos de la semana sobre madera y luz
// cálida. En escritorio con ratón la escena se fija y el scroll vertical
// desliza la mesa (un único tween con scrub); el producto del centro queda en
// foco. En pantallas táctiles, angostas o sin movimiento, se recorre de lado.

const CARTA = products.filter((p) => p.id !== "bloque-b2b-semiduro");

// Varias fotos se repiten entre productos: cada repetición se encuadra más
// cerca, para que no se lean como la misma imagen.
const ENCUADRES = [
  { escala: 1, origen: "50% 50%" },
  { escala: 1.35, origen: "38% 58%" },
  { escala: 1.8, origen: "64% 46%" },
];

const ENCUADRE_DE = (() => {
  const vistas = new Map<string, number>();
  return CARTA.map((p) => {
    const n = vistas.get(p.image) ?? 0;
    vistas.set(p.image, n + 1);
    return ENCUADRES[n % ENCUADRES.length];
  });
})();

const ETIQUETA_USO = Object.fromEntries(USOS.map((u) => [u.id, u.etiqueta]));

const ESCENA_FIJA = "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export default function ActoMesa({ fotos }: { fotos: FotosReales["productos"] }) {
  const { agregar, cantidadDe } = usePedidoEstado();
  const { irA } = useCine();
  const irAId = useIrAId();
  const seccionRef = useRef<HTMLElement>(null);
  const escenarioRef = useRef<HTMLDivElement>(null);
  const tiraRef = useRef<HTMLDivElement>(null);
  const recorridoRef = useRef<() => number>(() => 0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => revelarTitulares(seccionRef.current!));
      mm.add(ESCENA_FIJA, () => {
        const seccion = seccionRef.current!;
        const escenario = escenarioRef.current!;
        const tira = tiraRef.current!;
        const recorrido = () => Math.max(0, tira.scrollWidth - escenario.clientWidth);
        const medir = () => {
          seccion.style.height = `${window.innerHeight + recorrido()}px`;
        };
        // Enfoque selectivo: el producto más cerca del centro queda nítido y
        // los demás se desenfocan según su distancia (variable --foco, 0 a 1).
        // Las posiciones se miden una vez por refresh; en cada actualización
        // solo se usa la x del tween (sin leer layout por fotograma).
        const planos = Array.from(tira.querySelectorAll<HTMLElement>("li[data-plano]"));
        let centros: number[] = [];
        let anchoEscenario = 1;
        const medirCentros = () => {
          const caja = escenario.getBoundingClientRect();
          const x = Number(gsap.getProperty(tira, "x")) || 0;
          anchoEscenario = caja.width || 1;
          centros = planos.map((p) => {
            const r = p.getBoundingClientRect();
            return r.left - caja.left + r.width / 2 - x;
          });
        };
        // Se escribe solo si el valor cambia en pasos de 0,02: menos recálculos
        // del desenfoque mientras se desliza.
        const ultimos: number[] = [];
        const enfocar = () => {
          const x = Number(gsap.getProperty(tira, "x")) || 0;
          const mitad = anchoEscenario / 2;
          planos.forEach((plano, i) => {
            const d = Math.round((Math.min(1, Math.abs(centros[i] + x - mitad) / mitad) * 50)) / 50;
            if (ultimos[i] === d) return;
            ultimos[i] = d;
            plano.style.setProperty("--foco", d.toFixed(2));
          });
        };
        seccion.dataset.fijada = "";
        recorridoRef.current = recorrido;
        medir();
        ScrollTrigger.addEventListener("refreshInit", medir);
        gsap.to(tira, {
          x: () => -recorrido(),
          ease: "none",
          scrollTrigger: {
            trigger: seccion,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: enfocar,
            onRefresh: () => {
              medirCentros();
              enfocar();
            },
          },
        });
        medirCentros();
        enfocar();
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", medir);
          delete seccion.dataset.fijada;
          seccion.style.height = "";
          recorridoRef.current = () => 0;
          planos.forEach((plano) => plano.style.removeProperty("--foco"));
        };
      });
    },
    { scope: seccionRef }
  );

  // Con la escena fija, el foco de teclado no desplaza la mesa: se baja la
  // página hasta que el producto enfocado queda a la vista. Un clic con el
  // ratón ocurre sobre un producto ya visible y no mueve nada.
  const alEnfocar = (e: React.FocusEvent<HTMLDivElement>) => {
    const seccion = seccionRef.current;
    const escenario = escenarioRef.current;
    const tira = tiraRef.current;
    const objetivoFoco = e.target as HTMLElement;
    const plano = objetivoFoco.closest<HTMLElement>("[data-plano]");
    if (!seccion || !escenario || !tira || !plano || seccion.dataset.fijada === undefined) return;
    if (!objetivoFoco.matches(":focus-visible")) return;
    const recorrido = recorridoRef.current();
    // Ambos rectángulos llevan la misma traslación: la resta da la posición dentro de la tira.
    const enTira = plano.getBoundingClientRect().left - tira.getBoundingClientRect().left;
    const objetivo = enTira - (escenario.clientWidth - plano.offsetWidth) / 2;
    const inicio = seccion.getBoundingClientRect().top + window.scrollY;
    irA(inicio + Math.min(recorrido, Math.max(0, objetivo)), { duracion: 0.6 });
  };

  return (
    <section ref={seccionRef} id="carta" tabIndex={-1} aria-labelledby="carta-titulo" className="cine-mesa focus:outline-none">
      <div ref={escenarioRef} className="cine-escenario">
        <div className="cine-tira-marco w-full" onFocus={alEnfocar}>
          <div ref={tiraRef} className="cine-tira">
            <div className="cine-tira-intro">
              <p className="cine-kicker !text-[var(--miel-clara)]">La mesa de la semana</p>
              <h2 id="carta-titulo" className="cine-titular mt-4 text-[clamp(2.6rem,5vw,4.6rem)]" data-revelar>
                Elija sus quesos
              </h2>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed cine-crema-80">
                Precios de referencia en colones. Lo que va por kilo se corta a mano y el total exacto se confirma al
                pesar, antes de que pague.
              </p>
              <p className="mt-8 text-sm cine-crema-60">{CARTA.length} productos · deslice →</p>
            </div>

            <ol className="cine-productos" aria-label="Quesos y derivados de la semana">
              {CARTA.map((p, i) => {
                const enPedido = cantidadDe(p.id);
                const unidad = cantidadTexto(p, paso(p));
                const usos = ficha(p).usos.filter((u) => u !== "negocio").slice(0, 2);
                // Con foto real de la sesión se usa tal cual; si no, la recreación
                // con su encuadre (ampliado cuando la foto se repite).
                const real = fotos[p.id];
                const principal = real?.general ?? real?.medio;
                const encuadre = principal ? ENCUADRES[0] : ENCUADRE_DE[i];
                return (
                  <li key={p.id} data-plano className="cine-producto">
                    <article aria-labelledby={`producto-${p.id}`}>
                      <div className="cine-producto-imagen" data-cursor={real?.detalle ? "De cerca" : undefined}>
                        {/* Optimizada por Next (tamaño y formato); se pide más grande por el encuadre ampliado. */}
                        <Image
                          src={principal ?? p.image}
                          alt=""
                          fill
                          sizes={`(min-width: 900px) ${Math.round(340 * encuadre.escala)}px, ${Math.round(85 * encuadre.escala)}vw`}
                          style={
                            encuadre.escala === 1
                              ? undefined
                              : { transform: `scale(${encuadre.escala})`, transformOrigin: encuadre.origen }
                          }
                        />
                        {/* El detalle (la textura de cerca) aparece al pasar el puntero o al enfocar la tarjeta. */}
                        {real?.detalle ? (
                          <Image
                            src={real.detalle}
                            alt=""
                            fill
                            sizes="(min-width: 900px) 340px, 85vw"
                            className="cine-producto-detalle"
                          />
                        ) : null}
                        <span className="cine-producto-num" aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="cine-producto-texto">
                        <h3 id={`producto-${p.id}`}>{p.name}</h3>
                        {usos.length ? (
                          <ul className="cine-usos" aria-label="Usos">
                            {usos.map((u) => (
                              <li key={u}>{ETIQUETA_USO[u]}</li>
                            ))}
                          </ul>
                        ) : null}
                        <p className="cine-precio">
                          {colones(p.priceCRC)}
                          <small>{precioEtiqueta(p)}</small>
                        </p>
                        <p className="cine-producto-nota">{p.pairingNote}</p>
                        <div className="cine-producto-acciones">
                          <button
                            type="button"
                            className="cine-boton"
                            disabled={!p.inStock}
                            onClick={() => {
                              agregar(p);
                              registrarEvento("producto_agregado", { producto: p.id, origen: "mesa" });
                            }}
                            aria-label={p.inStock ? `Agregar ${unidad} de ${p.name}` : `${p.name}: agotado esta semana`}
                          >
                            {p.inStock ? `+ ${unidad}` : "Agotado"}
                          </button>
                          {enPedido > 0 ? (
                            <span className="cine-en-pedido">En su pedido: {cantidadTexto(p, enPedido)}</span>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>

            {/* data-plano: con la mesa fija, el teclado también trae esta tarjeta a la vista. */}
            <div className="cine-tira-fin" data-plano>
              <p className="cine-kicker !text-[var(--miel-clara)]">¿Cuánto llevar?</p>
              <p className="cine-titular mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">Le armamos la canasta según su mesa.</p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <a href="#casa" className="cine-boton" onClick={(e) => irAId(e, "casa")}>
                  Para mi casa
                </a>
                <a
                  href="#negocios"
                  className="cine-boton cine-boton-linea text-[var(--crema)]"
                  onClick={(e) => irAId(e, "negocios")}
                >
                  Para mi negocio
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
