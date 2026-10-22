"use client";

import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { FRECUENCIAS, calcularCanasta, cantidadTexto, colones, type Frecuencia } from "@/components/claude/datos";
import { usePedidoEstado } from "@/components/claude/pedidoEstado";
import type { FotoUso } from "@/lib/fotos";
import { revelarTitulares, useCine } from "./cine";
import { registrarEvento } from "./eventos";
import Galeria from "./Galeria";

// Para su casa: la canasta de la semana según cuántos se sientan a la mesa
// (mismas cantidades que la calculadora original) y lo que quita la duda de
// comprar: cómo se aparta, dónde se recoge y cómo se paga.

const OPCIONALES = ["queso-palmito", "natilla-casera"];

const CONFIANZA = [
  { titulo: "Apártelo por WhatsApp", texto: "El mensaje sale listo con su pedido; usted solo lo envía." },
  { titulo: "Recójalo en la feria", texto: "Sábados en Guadalupe, domingos en Hatillo." },
  { titulo: "Pruebe antes de llevar", texto: "En el puesto le damos a probar." },
  { titulo: "Pague por SINPE Móvil", texto: "Cuando le confirmemos el total al pesar." },
];

export default function ActoCasa({ fotos }: { fotos: FotoUso[] }) {
  const { agregar } = usePedidoEstado();
  const { abrirPedido } = useCine();
  const ref = useRef<HTMLElement>(null);
  const [personas, setPersonas] = useState(4);
  const [frecuencia, setFrecuencia] = useState<Frecuencia>("diario");
  const [incluidos, setIncluidos] = useState<Record<string, boolean>>({ "queso-palmito": true, "natilla-casera": true });
  const [agregada, setAgregada] = useState(false);

  // La sugerencia completa se muestra siempre; lo que se desmarca queda tachado.
  const sugerida = calcularCanasta({ personas, frecuencia, palmito: true, natilla: true });
  const elegida = calcularCanasta({
    personas,
    frecuencia,
    palmito: incluidos["queso-palmito"],
    natilla: incluidos["natilla-casera"],
  });

  const cambiar = (fn: () => void) => {
    fn();
    setAgregada(false);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const raiz = ref.current!;
        const deshacer = revelarTitulares(raiz);
        // Solo opacidad y posición: el contenido sigue disponible para teclado y lectores.
        gsap.from(raiz.querySelector(".cine-recibo"), {
          y: 60,
          opacity: 0,
          rotate: 1.5,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: raiz.querySelector(".cine-calc"), start: "top 75%", once: true },
        });
        gsap.from(raiz.querySelectorAll(".cine-confianza li"), {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: raiz.querySelector(".cine-confianza"), start: "top 88%", once: true },
        });
        return deshacer;
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="casa" tabIndex={-1} aria-labelledby="casa-titulo" className="cine-casa focus:outline-none">
      <div className="mx-auto max-w-6xl">
        <p className="cine-kicker">Para su casa</p>
        <h2 id="casa-titulo" className="cine-titular mt-4 max-w-3xl text-[clamp(2.6rem,5vw,4.8rem)]" data-revelar>
          La canasta de la semana, sin adivinar cuánto llevar
        </h2>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--tinta-suave)]">
          Cuéntenos cuántos son en casa y con qué frecuencia comen queso. Le sugerimos la canasta y usted la ajusta antes
          de pedir.
        </p>

        <Galeria
          className="mt-10"
          etiqueta="Así se ve en la mesa"
          fotos={fotos.slice(0, 3).map((f) => ({ clave: f.nombre, titulo: f.titulo, alt: f.alt, src: f.src }))}
        />

        <div className="cine-calc mt-12">
          <div className="space-y-9">
            <div>
              <span id="casa-personas" className="cine-paso">
                ¿Cuántos se sientan a la mesa?
              </span>
              <div className="cine-contador" role="group" aria-labelledby="casa-personas">
                <button
                  type="button"
                  aria-label="Una persona menos"
                  disabled={personas <= 1}
                  onClick={() => cambiar(() => setPersonas((n) => n - 1))}
                >
                  −
                </button>
                <output aria-live="polite">{personas}</output>
                <button
                  type="button"
                  aria-label="Una persona más"
                  disabled={personas >= 12}
                  onClick={() => cambiar(() => setPersonas((n) => n + 1))}
                >
                  +
                </button>
                <span className="text-[var(--tinta-suave)]">{personas === 1 ? "persona" : "personas"}</span>
              </div>
            </div>

            <fieldset>
              <legend>¿Con qué frecuencia comen queso?</legend>
              <div className="cine-opciones">
                {FRECUENCIAS.map((f) => (
                  <label key={f.id}>
                    <input
                      type="radio"
                      name="casa-frecuencia"
                      value={f.id}
                      checked={frecuencia === f.id}
                      onChange={() => cambiar(() => setFrecuencia(f.id))}
                    />
                    {f.etiqueta}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>¿Algo más para la mesa?</legend>
              {sugerida.lineas
                .filter((l) => OPCIONALES.includes(l.producto.id))
                .map((l) => (
                  <label key={l.producto.id} className="cine-casilla">
                    <input
                      type="checkbox"
                      checked={incluidos[l.producto.id]}
                      onChange={(e) => {
                        const marcado = e.target.checked;
                        cambiar(() => setIncluidos((prev) => ({ ...prev, [l.producto.id]: marcado })));
                      }}
                    />
                    <span>
                      {l.producto.name}
                      <small>{l.producto.id === "natilla-casera" ? "La compañera del gallo pinto" : "Para acompañar el café"}</small>
                    </span>
                  </label>
                ))}
            </fieldset>
          </div>

          <div className="cine-recibo">
            <p className="cine-kicker">Su canasta sugerida</p>
            <p className="mt-2 text-sm text-[var(--tinta-suave)]">
              Para {personas} {personas === 1 ? "persona" : "personas"} ·{" "}
              {FRECUENCIAS.find((f) => f.id === frecuencia)?.resumen}
            </p>
            <ul aria-label="Canasta sugerida">
              {sugerida.lineas.map((l) => {
                const incluido = OPCIONALES.includes(l.producto.id) ? incluidos[l.producto.id] : true;
                return (
                  <li key={l.producto.id} data-incluido={incluido ? "true" : "false"}>
                    <span>
                      {l.producto.name}
                      <small>{cantidadTexto(l.producto, l.cantidad)}</small>
                    </span>
                    <strong>{colones(l.producto.priceCRC * l.cantidad)}</strong>
                  </li>
                );
              })}
            </ul>
            <div className="cine-total" aria-live="polite" aria-atomic="true">
              <span className="font-semibold">Total estimado</span>
              <strong>{colones(elegida.total)}</strong>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--tinta-suave)]">
              Sugerencia orientativa: puede ajustar las cantidades en su pedido. El peso exacto y la disponibilidad se
              confirman por WhatsApp.
            </p>
            <button
              type="button"
              className="cine-boton cine-boton-oscuro mt-6 w-full"
              disabled={!elegida.disponible}
              onClick={() => {
                elegida.lineas.forEach((l) => agregar(l.producto, l.cantidad));
                registrarEvento("canasta_agregada", { personas, frecuencia, total_estimado: elegida.total });
                setAgregada(true);
              }}
            >
              Agregar la canasta a mi pedido
            </button>
            <p role="status" className="mt-3 min-h-[1.5em] text-center text-sm">
              {agregada ? (
                <>
                  Listo, ya está en su pedido.{" "}
                  <button
                    type="button"
                    className="font-semibold underline underline-offset-4"
                    onClick={() => {
                      registrarEvento("pedido_abierto", { origen: "casa" });
                      abrirPedido();
                    }}
                  >
                    Revisar y enviar
                  </button>
                </>
              ) : null}
            </p>
          </div>
        </div>

        <ul className="cine-confianza mt-14" aria-label="Cómo funciona">
          {CONFIANZA.map((c) => (
            <li key={c.titulo}>
              <strong>{c.titulo}</strong>
              {c.texto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
