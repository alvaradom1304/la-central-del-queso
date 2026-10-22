"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { whatsappUrl } from "@/lib/whatsapp";
import { FERIAS, cantidadTexto, colones, paso, producto, proximaFecha } from "@/components/claude/datos";
import { mensajePedido, referenciaCampana, usePedidoEstado } from "@/components/claude/pedidoEstado";
import { useCine } from "./cine";
import { registrarEvento } from "./eventos";

// Panel del pedido: diálogo modal (foco atrapado, Escape, fondo inerte) que
// arma el mensaje de WhatsApp. Sugiere complementos de lo que ya lleva y deja
// pedir que el mismo pedido se aparte cada semana (lo confirma el negocio).

type Retiro = "guadalupe" | "hatillo" | "entrega";

// Complementos honestos: acompañan a los quesos de mesa y de sartén.
const COMPLEMENTOS: { id: string; motivo: string }[] = [
  { id: "natilla-casera", motivo: "Para el gallo pinto y las tortillas" },
  { id: "queso-palmito", motivo: "Se derrite en hilos; ideal con café" },
  { id: "mantequilla-lavada", motivo: "Para el pan de la mañana" },
];

const QUESOS_BASE = ["semiduro-tradicional", "turrialba-artesanal", "queso-tierno", "maduro-reserva", "ahumado-lena"];

export default function PanelPedido() {
  const { lineas, fijar, vaciar, agregar, total, hayPorKilo } = usePedidoEstado();
  const { pedidoAbierto, cerrarPedido, irA } = useCine();
  const panel = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const previo = useRef<HTMLElement | null>(null);

  const [nombre, setNombre] = useState("");
  const [retiro, setRetiro] = useState<Retiro>("guadalupe");
  const [nota, setNota] = useState("");
  const [semanal, setSemanal] = useState(false);
  const [error, setError] = useState(false);
  const [enviado, setEnviado] = useState<string | null>(null);

  // Al quitar una línea o cambiar de estado se desmonta el control enfocado:
  // el foco vuelve al título del panel en vez de perderse.
  const enfocarTitulo = () => window.setTimeout(() => tituloRef.current?.focus(), 0);

  const fechas = useMemo(
    () => (pedidoAbierto ? Object.fromEntries(FERIAS.map((f) => [f.id, proximaFecha(f).fecha])) : {}),
    [pedidoAbierto]
  ) as Record<string, string>;

  const sugerencias = useMemo(() => {
    const ids = new Set(lineas.map((l) => l.id));
    const llevaQueso = lineas.some((l) => QUESOS_BASE.includes(l.id));
    if (!llevaQueso) return [];
    return COMPLEMENTOS.filter((c) => !ids.has(c.id))
      .map((c) => ({ ...c, p: producto(c.id) }))
      .filter((c): c is { id: string; motivo: string; p: Product } => Boolean(c.p?.inStock))
      .slice(0, 2);
  }, [lineas]);

  // Foco, Escape, trampa de tabulación y fondo inerte.
  useEffect(() => {
    if (!pedidoAbierto) return;
    previo.current = document.activeElement as HTMLElement;
    const fondo = document.querySelectorAll<HTMLElement>(".cine > :not(.cine-capa)");
    fondo.forEach((el) => el.setAttribute("inert", ""));
    // Si el panel aún no es enfocable (visibilidad en transición), se reintenta
    // en los fotogramas siguientes.
    let intentos = 0;
    let raf = 0;
    const enfocar = () => {
      const boton = cerrarRef.current;
      boton?.focus();
      if (boton && document.activeElement !== boton && intentos++ < 30) raf = requestAnimationFrame(enfocar);
    };
    const t = setTimeout(enfocar, 60);
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarPedido();
      if (e.key !== "Tab" || !panel.current) return;
      const focos = panel.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focos.length) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    window.addEventListener("keydown", tecla);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", tecla);
      fondo.forEach((el) => el.removeAttribute("inert"));
      // Si el control que abrió el panel ya no existe o quedó oculto (barra
      // móvil, llamado del cierre que cambió), el foco vuelve a «Su pedido».
      const destino = previo.current;
      const valido = destino?.isConnected && !destino.closest('[aria-hidden="true"]');
      const respaldo = document.querySelector<HTMLElement>(".cine-boton-pedido");
      (valido ? destino : respaldo)?.focus?.({ preventScroll: true });
    };
  }, [pedidoAbierto, cerrarPedido]);

  useEffect(() => {
    if (!pedidoAbierto) setEnviado(null);
  }, [pedidoAbierto]);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError(true);
      document.getElementById("cine-nombre")?.focus();
      return;
    }
    const destino =
      retiro === "entrega"
        ? "Entrega a domicilio (¿me confirman si llegan a mi zona?)"
        : `Retiro en la Feria de ${retiro === "guadalupe" ? "Guadalupe" : "Hatillo"}${fechas[retiro] ? `, ${fechas[retiro]}` : ""}`;
    const notaFinal = [nota.trim(), semanal ? "Me gustaría apartar este mismo pedido cada semana; ¿me confirman si se puede?" : ""]
      .filter(Boolean)
      .join(" ");
    const texto = mensajePedido({ lineas, nombre, destino, total, hayPorKilo, nota: notaFinal, ref: referenciaCampana() });
    const url = whatsappUrl(texto);
    window.open(url, "_blank", "noopener,noreferrer");
    registrarEvento("whatsapp_pedido", { lineas: lineas.length, total_estimado: total, retiro, semanal });
    setEnviado(url);
    enfocarTitulo();
  };

  // proximaFecha ya trae el día de la semana («sábado 24 de octubre»).
  const opciones: { id: Retiro; titulo: string; detalle: string }[] = [
    { id: "guadalupe", titulo: "Feria de Guadalupe", detalle: fechas.guadalupe ?? "Sábados" },
    { id: "hatillo", titulo: "Feria de Hatillo", detalle: fechas.hatillo ?? "Domingos" },
    { id: "entrega", titulo: "Entrega a domicilio", detalle: "Le confirmamos si llegamos a su zona" },
  ];

  return (
    <div className="cine-capa" data-abierto={pedidoAbierto ? "true" : "false"} aria-hidden={!pedidoAbierto}>
      <div className="cine-capa-fondo" onClick={cerrarPedido} />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="cine-pedido-titulo" className="cine-panel">
        <div className="flex items-start justify-between gap-4 px-6 pb-3 pt-6">
          <div>
            <p className="cine-kicker !text-[var(--tierra)]">Para apartar por WhatsApp</p>
            <h2 id="cine-pedido-titulo" ref={tituloRef} tabIndex={-1} className="cine-titular mt-2 text-4xl focus:outline-none">
              Su pedido
            </h2>
          </div>
          <button
            ref={cerrarRef}
            type="button"
            onClick={cerrarPedido}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border cine-borde-tinta text-xl hover:bg-[var(--tinta)] hover:text-[var(--leche)]"
            aria-label="Cerrar pedido"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-8" data-lenis-prevent>
          {lineas.length === 0 ? (
            <div className="py-10 text-center">
              <p className="cine-titular text-2xl">Todavía no hay nada apartado.</p>
              <p className="mt-2 text-[var(--tinta-suave)]">Elija sus quesos en la mesa y aquí se arma el pedido.</p>
              <button
                type="button"
                className="cine-boton cine-boton-oscuro mt-6"
                onClick={() => {
                  // Al cerrar se reactivan el scroll (Lenis) y el fondo (inert);
                  // el viaje a la carta va después, y el foco no regresa al botón de origen.
                  previo.current = null;
                  cerrarPedido();
                  window.setTimeout(() => {
                    const carta = document.getElementById("carta");
                    if (carta) irA(carta, { foco: true });
                  }, 80);
                }}
              >
                Ver los quesos
              </button>
            </div>
          ) : enviado ? (
            <div className="py-8" role="status">
              <p className="cine-titular text-3xl">Le abrimos WhatsApp con su pedido.</p>
              <p className="mt-2 text-sm text-[var(--tinta-suave)]">
                ¿No se abrió?{" "}
                <a href={enviado} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--tinta)] underline underline-offset-4">
                  Abrir WhatsApp con el pedido
                </a>
              </p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-[var(--tinta-suave)]">
                <li>
                  Revise el mensaje y tóquele <strong className="text-[var(--tinta)]">Enviar</strong>. Sin ese paso no nos
                  llega.
                </li>
                <li>Le respondemos con la disponibilidad y, si hay algo por kilo, el total exacto al pesar.</li>
                <li>Paga por SINPE Móvil cuando le confirmemos.</li>
              </ol>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEnviado(null);
                    enfocarTitulo();
                  }}
                  className="cine-boton cine-boton-linea"
                >
                  Volver al pedido
                </button>
                <button
                  type="button"
                  onClick={() => {
                    vaciar();
                    cerrarPedido();
                  }}
                  className="cine-boton cine-boton-oscuro"
                >
                  Ya lo envié, vaciar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate>
              <ul aria-label="Productos del pedido">
                {lineas.map((l) => {
                  const p = producto(l.id)!;
                  return (
                    <li key={l.id} className="cine-linea-pedido">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-semibold leading-snug">{p.name}</span>
                        <span className="whitespace-nowrap tabular-nums">{colones(p.priceCRC * l.cantidad)}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <Cantidad
                          p={p}
                          valor={l.cantidad}
                          onCambio={(n) => {
                            fijar(p.id, n);
                            if (n <= 0) enfocarTitulo();
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            fijar(p.id, 0);
                            enfocarTitulo();
                          }}
                          className="text-sm text-[var(--tinta-suave)] underline underline-offset-4 hover:text-[var(--tinta)]"
                        >
                          Quitar
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex items-baseline justify-between" aria-live="polite" aria-atomic="true">
                <span className="font-semibold">Total estimado</span>
                <span className="cine-numero text-3xl tabular-nums">{colones(total)}</span>
              </div>
              {hayPorKilo ? (
                <p className="mt-1 text-sm text-[var(--tinta-suave)]">
                  Los quesos por kilo se cortan a mano: el total exacto se confirma al pesar, antes de que pague.
                </p>
              ) : null}

              {sugerencias.length ? (
                <div className="mt-6">
                  <p className="text-sm font-semibold">Suele acompañarse con</p>
                  <ul className="mt-2 space-y-2">
                    {sugerencias.map(({ id, motivo, p }) => (
                      <li key={id} className="cine-sugerencia">
                        <span className="text-sm leading-snug">
                          <span className="block font-semibold">{p.name}</span>
                          <span className="text-[var(--tinta-suave)]">
                            {motivo} · {colones(p.priceCRC)}
                          </span>
                        </span>
                        <button
                          type="button"
                          className="cine-boton cine-boton-linea !min-h-[38px] shrink-0 !px-3 !text-sm"
                          onClick={() => agregar(p, paso(p))}
                          aria-label={`Agregar ${cantidadTexto(p, paso(p))} de ${p.name}`}
                        >
                          + Agregar
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <fieldset className="mt-6">
                <legend className="mb-2 font-semibold">¿Dónde lo recoge?</legend>
                <div className="space-y-2">
                  {opciones.map((o) => (
                    <label key={o.id} className="cine-opcion-retiro">
                      <input
                        type="radio"
                        name="cine-retiro"
                        value={o.id}
                        checked={retiro === o.id}
                        onChange={() => setRetiro(o.id)}
                      />
                      <span>
                        <span className="block font-semibold">{o.titulo}</span>
                        <span className="block text-sm text-[var(--tinta-suave)] first-letter:uppercase">{o.detalle}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5">
                <label htmlFor="cine-nombre" className="mb-1.5 block font-semibold">
                  Su nombre
                </label>
                <input
                  id="cine-nombre"
                  type="text"
                  autoComplete="given-name"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    if (error) setError(false);
                  }}
                  aria-invalid={error}
                  aria-describedby={error ? "cine-nombre-error" : undefined}
                  className="cine-campo-texto cine-campo-claro"
                  placeholder="Para saludarle por su nombre"
                />
                {error ? (
                  <p id="cine-nombre-error" className="mt-1.5 text-sm font-semibold text-[#a3401f]">
                    Escriba su nombre para que sepamos de quién es el pedido.
                  </p>
                ) : null}
              </div>

              <div className="mt-4">
                <label htmlFor="cine-nota" className="mb-1.5 block font-semibold">
                  Nota <span className="font-normal text-[var(--tinta-suave)]">(opcional)</span>
                </label>
                <textarea
                  id="cine-nota"
                  rows={2}
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="cine-campo-texto cine-campo-claro resize-none"
                  placeholder="Ej.: el semiduro en tajadas gruesas"
                />
              </div>

              <label className="cine-casilla mt-3">
                <input type="checkbox" checked={semanal} onChange={(e) => setSemanal(e.target.checked)} />
                <span className="text-sm">
                  Quiero este mismo pedido cada semana
                  <small>Se lo confirmamos por WhatsApp; puede cambiarlo cuando quiera.</small>
                </span>
              </label>

              <button type="submit" className="cine-boton cine-boton-whatsapp mt-6 w-full !min-h-[56px]">
                Enviar pedido por WhatsApp
              </button>
              <p className="mt-2 text-center text-xs text-[var(--tinta-suave)]">
                Se abre WhatsApp con el mensaje listo. Usted lo revisa y lo envía.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Cantidad({ p, valor, onCambio }: { p: Product; valor: number; onCambio: (n: number) => void }) {
  const s = paso(p);
  return (
    <span className="cine-cantidad">
      <button type="button" onClick={() => onCambio(Math.max(0, valor - s))} aria-label={`Menos ${p.name}`}>
        −
      </button>
      <span aria-live="polite">{cantidadTexto(p, valor)}</span>
      <button type="button" onClick={() => onCambio(valor + s)} aria-label={`Más ${p.name}`}>
        +
      </button>
    </span>
  );
}
