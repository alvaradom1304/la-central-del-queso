"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { BUSINESS_PHONE_DISPLAY, whatsappUrl } from "@/lib/whatsapp";
import { FERIAS, colones } from "@/components/claude/datos";
import { usePedidoEstado } from "@/components/claude/pedidoEstado";
import { Polen } from "./Atmosfera";
import { revelarTitulares, useCine, useIrAId } from "./cine";
import { registrarEvento } from "./eventos";

// Cierre: cae la tarde sobre el campo. Resume el pedido con un llamado claro,
// recuerda el canal para negocios y deja los datos de contacto.

export default function Cierre({ avisoImagenes }: { avisoImagenes: string }) {
  const { lineas, total } = usePedidoEstado();
  const { abrirPedido } = useCine();
  const irAId = useIrAId();
  const ref = useRef<HTMLElement>(null);
  const n = lineas.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const raiz = ref.current!;
        const deshacer = revelarTitulares(raiz);
        // El sol baja mientras se llega al final de la página.
        gsap.fromTo(
          raiz.querySelector(".cine-sol"),
          { yPercent: -35, scale: 1.1 },
          {
            yPercent: 10,
            scale: 0.92,
            ease: "none",
            scrollTrigger: { trigger: raiz, start: "top bottom", end: "bottom bottom", scrub: true },
          }
        );
        return deshacer;
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="cierre" aria-labelledby="cierre-titulo" className="cine-cierre">
      <div className="cine-sol" aria-hidden="true" />
      <Polen densidad={0.6} dprMax={1} />
      <div className="relative mx-auto max-w-3xl">
        <p className="cine-kicker">Hasta el próximo fin de semana</p>
        <h2 id="cierre-titulo" className="cine-titular mt-4 text-[clamp(2.8rem,6vw,5.6rem)]" data-revelar>
          La mesa está lista
        </h2>
        {n > 0 ? (
          <>
            <p className="mx-auto mt-5 max-w-xl text-[17px] cine-crema-85">
              Tiene {n} {n === 1 ? "producto" : "productos"} apartados, unos {colones(total)}. Envíelo por WhatsApp y le
              confirmamos al pesar.
            </p>
            <button
              type="button"
              className="cine-boton mt-8"
              onClick={() => {
                registrarEvento("pedido_abierto", { lineas: n, origen: "cierre" });
                abrirPedido();
              }}
            >
              Revisar y enviar mi pedido
            </button>
          </>
        ) : (
          <>
            <p className="mx-auto mt-5 max-w-xl text-[17px] cine-crema-85">
              Elija sus quesos, apártelos por WhatsApp y recójalos en la feria.
            </p>
            <a href="#carta" className="cine-boton mt-8" onClick={(e) => irAId(e, "carta")}>
              Elegir mis quesos
            </a>
          </>
        )}
        <p className="mt-6 text-sm cine-crema-75">
          ¿Cocina para un negocio?{" "}
          <a href="#negocios" className="font-semibold text-[var(--miel-clara)] underline underline-offset-4" onClick={(e) => irAId(e, "negocios")}>
            Calcule su volumen y cotice
          </a>
        </p>
      </div>

      <footer className="relative mx-auto mt-28 grid max-w-5xl gap-8 border-t cine-borde-crema pt-10 text-left text-sm cine-crema-75 md:grid-cols-3">
        <div>
          <p className="cine-titular text-2xl text-[var(--crema)]">La Central del Queso</p>
          <p className="mt-1">Quesos Doña Martha</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--crema)]">Pedidos por WhatsApp</p>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            {BUSINESS_PHONE_DISPLAY}
          </a>
          <p className="mt-1">Pago por SINPE Móvil.</p>
          <p className="mt-1">{FERIAS.map((f) => `${f.nombre}, ${f.diaTexto.toLowerCase()}`).join(" · ")}</p>
        </div>
        <div>
          <p>Precios de referencia en colones; el total por kilo se confirma al pesar.</p>
          <p className="mt-2 cine-crema-60">{avisoImagenes}.</p>
        </div>
      </footer>
    </section>
  );
}
