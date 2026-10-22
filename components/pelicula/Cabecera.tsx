"use client";

import React, { useEffect, useRef } from "react";
import { colones } from "@/components/claude/datos";
import { usePedidoEstado } from "@/components/claude/pedidoEstado";
import { useCine, useIrAId } from "./cine";
import { registrarEvento } from "./eventos";

// Cabecera fija: marca, secciones, acceso directo para negocios y el pedido
// (siempre a un clic). Sobre la portada es transparente; después, sólida.

const NAV = [
  { id: "finca", texto: "La finca" },
  { id: "carta", texto: "Quesos" },
  { id: "casa", texto: "Para su casa" },
  { id: "negocios", texto: "Para negocios" },
  { id: "ferias", texto: "Ferias" },
];

const GRAIN_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>" +
  "<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix type='saturate' values='0'/></filter>" +
  "<rect width='100%' height='100%' filter='url(#g)'/></svg>";

const GRAIN_STYLE: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`,
};

export default function Cabecera() {
  const { lineas, total, aviso } = usePedidoEstado();
  const { abrirPedido, irA, pedidoAbierto } = useCine();
  const irAId = useIrAId();
  const ref = useRef<HTMLElement>(null);
  const n = lineas.length;
  const barraVisible = n > 0 && !pedidoAbierto;

  useEffect(() => {
    let raf = 0;
    const pintar = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      if (window.scrollY > window.innerHeight * 0.6) el.dataset.solida = "";
      else delete el.dataset.solida;
    };
    const alScroll = () => {
      if (!raf) raf = requestAnimationFrame(pintar);
    };
    pintar();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", alScroll);
    };
  }, []);

  const abrir = () => {
    registrarEvento("pedido_abierto", { lineas: n, origen: "cabecera" });
    abrirPedido();
  };

  return (
    <>
      <header ref={ref} className="cine-cabecera">
        <a
          href="#inicio"
          className="cine-marca"
          onClick={(e) => {
            e.preventDefault();
            irA(0);
          }}
        >
          La Central del Queso
          <small>Quesos Doña Martha</small>
        </a>
        <nav aria-label="Secciones" className="cine-nav hidden items-center gap-7 lg:flex">
          {NAV.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={(e) => irAId(e, s.id)}>
              {s.texto}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#negocios" className="cine-pastilla inline-flex lg:hidden" onClick={(e) => irAId(e, "negocios")}>
            Negocios
          </a>
          <button
            type="button"
            className="cine-boton-pedido"
            onClick={abrir}
            aria-haspopup="dialog"
            aria-expanded={pedidoAbierto}
            aria-label={
              n
                ? `Su pedido: ${n} ${n === 1 ? "producto" : "productos"}, total estimado ${colones(total)}`
                : "Su pedido, vacío"
            }
          >
            <span className="hidden sm:inline">Su pedido</span>
            {n > 0 ? <span className="hidden tabular-nums md:inline">{colones(total)}</span> : null}
            <b>{n}</b>
          </button>
        </div>
      </header>

      <div role="status" aria-live="polite" className="cine-aviso" data-visible={aviso ? "true" : "false"}>
        {aviso}
      </div>

      {/* En móvil, con productos apartados, el pedido queda al alcance del pulgar. */}
      <div className="cine-barra lg:hidden" data-visible={barraVisible ? "true" : "false"} aria-hidden={!barraVisible}>
        <button type="button" onClick={abrir} tabIndex={barraVisible ? 0 : -1}>
          <span>
            Ver su pedido · {n} {n === 1 ? "producto" : "productos"}
          </span>
          <span className="rounded-full bg-[var(--tinta)] px-3 py-2 tabular-nums text-[var(--leche)]">{colones(total)}</span>
        </button>
      </div>

      <div className="cine-grano" style={GRAIN_STYLE} aria-hidden="true" />
    </>
  );
}
