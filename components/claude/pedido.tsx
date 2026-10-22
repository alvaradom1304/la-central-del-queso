"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { whatsappUrl } from "@/lib/whatsapp";
import { FERIAS, cantidadTexto, colones, paso, producto, proximaFecha } from "./datos";
import {
  PedidoEstadoProvider,
  mensajePedido,
  referenciaCampana,
  usePedidoEstado,
  type PedidoEstado,
} from "./pedidoEstado";

// Interfaz del pedido de la propuesta: barra fija, panel tipo tiquete y aviso.
// El estado (líneas, total, sesión) vive en pedidoEstado.tsx; el panel no se
// abre solo al agregar un producto.

interface PanelCtx {
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
}

const Panel = createContext<PanelCtx | null>(null);

export function usePedido(): PedidoEstado & PanelCtx {
  const estado = usePedidoEstado();
  const panel = useContext(Panel);
  if (!panel) throw new Error("usePedido debe usarse dentro de <PedidoProvider>");
  return { ...estado, ...panel };
}

export function PedidoProvider({ children }: { children: React.ReactNode }) {
  return (
    <PedidoEstadoProvider>
      <PanelProvider>{children}</PanelProvider>
    </PedidoEstadoProvider>
  );
}

function PanelProvider({ children }: { children: React.ReactNode }) {
  const { aviso } = usePedidoEstado();
  const [abierto, setAbierto] = useState(false);
  const valor = useMemo<PanelCtx>(
    () => ({ abierto, abrir: () => setAbierto(true), cerrar: () => setAbierto(false) }),
    [abierto]
  );

  return (
    <Panel.Provider value={valor}>
      {children}
      <BarraPedido />
      <PanelPedido />
      <div role="status" aria-live="polite" className="cq-aviso" data-visible={aviso ? "true" : "false"}>
        {aviso && (
          <span className="inline-flex items-center gap-2">
            <Icono nombre="check" className="w-4 h-4" />
            {aviso}
          </span>
        )}
      </div>
    </Panel.Provider>
  );
}

// ---------- Íconos ----------

type NombreIcono = "bolsa" | "cerrar" | "mas" | "menos" | "chat" | "check" | "flecha" | "pin";

export function Icono({ nombre, className }: { nombre: NombreIcono; className?: string }) {
  const comun = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" {...comun}>
      {nombre === "bolsa" && (
        <>
          <path d="M5 8h14l-1 12H6L5 8z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </>
      )}
      {nombre === "cerrar" && <path d="M6 6l12 12M18 6L6 18" />}
      {nombre === "mas" && <path d="M12 5v14M5 12h14" />}
      {nombre === "menos" && <path d="M5 12h14" />}
      {nombre === "chat" && (
        <>
          <path d="M4 12a8 8 0 1 1 3.3 6.5L4 20l1.2-3.6A7.9 7.9 0 0 1 4 12z" />
          <path d="M9 11h6M9 14h4" />
        </>
      )}
      {nombre === "check" && <path d="M5 12.5l4.5 4.5L19 7" />}
      {nombre === "flecha" && <path d="M5 12h14M13 6l6 6-6 6" />}
      {nombre === "pin" && (
        <>
          <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
          <circle cx="12" cy="9" r="2.5" />
        </>
      )}
    </svg>
  );
}

// ---------- Selector de cantidad ----------

export function Cantidad({
  p,
  valor,
  onCambio,
  min,
  tamano = "md",
}: {
  p: Product;
  valor: number;
  onCambio: (n: number) => void;
  min: number;
  tamano?: "sm" | "md";
}) {
  const s = paso(p);
  const alto = tamano === "sm" ? "h-9" : "h-11";
  const boton = `${alto} ${tamano === "sm" ? "w-9" : "w-11"} grid place-items-center rounded-full hover:bg-[#1C2620]/[0.06] disabled:opacity-30 disabled:hover:bg-transparent transition-colors`;
  return (
    <div className={`inline-flex items-center rounded-full border-2 border-[#1C2620] bg-[#FCFAF5] ${alto}`}>
      <button
        type="button"
        className={boton}
        onClick={() => onCambio(Math.max(min, valor - s))}
        disabled={valor - s < min}
        aria-label={`Menos ${p.name}`}
      >
        <Icono nombre="menos" className="w-4 h-4" />
      </button>
      <span
        className={`min-w-[6.5rem] text-center font-semibold tabular-nums ${tamano === "sm" ? "text-sm min-w-[5.5rem]" : ""}`}
        aria-live="polite"
      >
        {cantidadTexto(p, valor)}
      </span>
      <button type="button" className={boton} onClick={() => onCambio(valor + s)} aria-label={`Más ${p.name}`}>
        <Icono nombre="mas" className="w-4 h-4" />
      </button>
    </div>
  );
}

// ---------- Botón del encabezado ----------

export function BotonPedido() {
  const { lineas, abrir } = usePedido();
  const n = lineas.length;
  return (
    <button
      type="button"
      onClick={abrir}
      className="cq-boton cq-boton-tinta !h-11 !px-4 sm:!px-5"
      aria-label={n ? `Ver su pedido, ${n} ${n === 1 ? "producto" : "productos"}` : "Ver su pedido"}
    >
      <Icono nombre="bolsa" className="w-5 h-5" />
      <span className="hidden sm:inline">Su pedido</span>
      {n > 0 && (
        <span className="ml-0.5 min-w-[1.5rem] h-6 px-1.5 rounded-full bg-[#EDB843] text-[#1C2620] text-xs font-bold grid place-items-center tabular-nums">
          {n}
        </span>
      )}
    </button>
  );
}

// ---------- Barra fija (aparece con productos) ----------

function BarraPedido() {
  const { lineas, total, abierto, abrir } = usePedido();
  const visible = lineas.length > 0 && !abierto;
  return (
    <div className="cq-barra" data-visible={visible ? "true" : "false"} aria-hidden={!visible}>
      <button type="button" onClick={abrir} tabIndex={visible ? 0 : -1} className="cq-barra-boton">
        <span className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-[#EDB843] text-[#1C2620] grid place-items-center font-bold tabular-nums">
            {lineas.length}
          </span>
          <span className="text-left leading-tight">
            <span className="block font-semibold">Ver su pedido</span>
            <span className="block text-xs text-[#F7F2E8]/70">Total estimado {colones(total)}</span>
          </span>
        </span>
        <Icono nombre="flecha" className="w-5 h-5" />
      </button>
    </div>
  );
}

// ---------- Panel del pedido (tiquete) ----------

type Retiro = "guadalupe" | "hatillo" | "entrega";

function PanelPedido() {
  const { lineas, fijar, vaciar, abierto, cerrar, total, hayPorKilo } = usePedido();
  const panel = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const previo = useRef<HTMLElement | null>(null);

  const [nombre, setNombre] = useState("");
  const [retiro, setRetiro] = useState<Retiro>("guadalupe");
  const [nota, setNota] = useState("");
  const [error, setError] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const fechas = useMemo(
    () => (abierto ? Object.fromEntries(FERIAS.map((f) => [f.id, proximaFecha(f).fecha])) : {}),
    [abierto]
  ) as Record<string, string>;

  // foco, Escape, trampa de tabulación y bloqueo de scroll
  useEffect(() => {
    if (!abierto) return;
    previo.current = document.activeElement as HTMLElement;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => cerrarRef.current?.focus(), 60);
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
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
      window.removeEventListener("keydown", tecla);
      document.documentElement.style.overflow = "";
      previo.current?.focus?.();
    };
  }, [abierto, cerrar]);

  useEffect(() => {
    if (!abierto) setEnviado(false);
  }, [abierto]);

  const mensaje = () =>
    mensajePedido({
      lineas,
      nombre,
      destino:
        retiro === "entrega"
          ? "Entrega a domicilio (¿me confirman si llegan a mi zona?)"
          : `Retiro en la Feria de ${retiro === "guadalupe" ? "Guadalupe" : "Hatillo"}, ${fechas[retiro]}`,
      total,
      hayPorKilo,
      nota,
      ref: referenciaCampana(),
    });

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError(true);
      document.getElementById("cq-nombre")?.focus();
      return;
    }
    window.open(whatsappUrl(mensaje()), "_blank", "noopener,noreferrer");
    setEnviado(true);
  };

  const opciones: { id: Retiro; titulo: string; detalle: string }[] = [
    // proximaFecha ya trae el día de la semana («sábado 24 de octubre»).
    { id: "guadalupe", titulo: "Feria de Guadalupe", detalle: fechas.guadalupe ?? "Sábados" },
    { id: "hatillo", titulo: "Feria de Hatillo", detalle: fechas.hatillo ?? "Domingos" },
    { id: "entrega", titulo: "Entrega a domicilio", detalle: "Le confirmamos si llegamos a su zona" },
  ];

  return (
    <div className="cq-capa" data-abierto={abierto ? "true" : "false"} aria-hidden={!abierto}>
      <div className="cq-capa-fondo" onClick={cerrar} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cq-pedido-titulo"
        className="cq-panel"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div>
            <p className="cq-mano text-xl text-[#B14F2C] leading-none">para apartar por WhatsApp</p>
            <h2 id="cq-pedido-titulo" className="cq-display text-4xl leading-tight mt-1">
              Su pedido
            </h2>
          </div>
          <button
            ref={cerrarRef}
            type="button"
            onClick={cerrar}
            className="w-11 h-11 rounded-full grid place-items-center border-2 border-[#1C2620] hover:bg-[#1C2620] hover:text-[#F7F2E8] transition-colors"
            aria-label="Cerrar pedido"
          >
            <Icono nombre="cerrar" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {lineas.length === 0 ? (
            <div className="py-12 text-center">
              <p className="cq-display text-2xl">Todavía no hay nada apartado.</p>
              <p className="mt-2 text-[#4A5A50]">Elija sus quesos en la pizarra y aquí se arma el pedido.</p>
              <a href="#quesos" onClick={cerrar} className="cq-boton cq-boton-tinta mt-6">
                Ver la pizarra
              </a>
            </div>
          ) : enviado ? (
            <div className="py-8">
              <div className="w-14 h-14 rounded-full bg-[#2C5A3C] text-[#F7F2E8] grid place-items-center">
                <Icono nombre="check" className="w-7 h-7" />
              </div>
              <h3 className="cq-display text-3xl mt-5">Le abrimos WhatsApp con su pedido.</h3>
              <ol className="mt-4 space-y-2 text-[#4A5A50] list-decimal pl-5">
                <li>Revise el mensaje y tóquele <strong className="text-[#1C2620]">Enviar</strong>. Sin ese paso no nos llega.</li>
                <li>Le respondemos con la disponibilidad y, si hay algo por kilo, el total exacto al pesar.</li>
                <li>Paga por SINPE Móvil cuando le confirmemos.</li>
              </ol>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => setEnviado(false)} className="cq-boton cq-boton-linea">
                  Volver al pedido
                </button>
                <button
                  type="button"
                  onClick={() => {
                    vaciar();
                    cerrar();
                  }}
                  className="cq-boton cq-boton-tinta"
                >
                  Ya lo envié, vaciar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate>
              <div className="cq-tiquete">
                <ul className="divide-y-2 divide-dashed divide-[#1C2620]/15">
                  {lineas.map((l) => {
                    const p = producto(l.id)!;
                    return (
                      <li key={l.id} className="py-4 first:pt-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-semibold leading-snug">{p.name}</span>
                          <span className="font-mono text-sm tabular-nums whitespace-nowrap">
                            {colones(p.priceCRC * l.cantidad)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <Cantidad p={p} valor={l.cantidad} min={0} tamano="sm" onCambio={(n) => fijar(p.id, n)} />
                          <button
                            type="button"
                            onClick={() => fijar(p.id, 0)}
                            className="text-sm underline underline-offset-4 decoration-[#1C2620]/30 hover:decoration-[#1C2620] text-[#4A5A50]"
                          >
                            Quitar
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-2 pt-4 border-t-2 border-[#1C2620] flex items-baseline justify-between">
                  <span className="font-semibold">Total estimado</span>
                  <span className="cq-display text-3xl tabular-nums">{colones(total)}</span>
                </div>
                {hayPorKilo && (
                  <p className="mt-1 text-sm text-[#4A5A50]">
                    Los quesos por kilo se cortan a mano: el total exacto se lo confirmamos al pesar, antes de que pague.
                  </p>
                )}
              </div>

              <fieldset className="mt-6">
                <legend className="font-semibold mb-2">¿Dónde lo recoge?</legend>
                <div className="space-y-2">
                  {opciones.map((o) => (
                    <label key={o.id} className="cq-opcion">
                      <input
                        type="radio"
                        name="retiro"
                        value={o.id}
                        checked={retiro === o.id}
                        onChange={() => setRetiro(o.id)}
                        className="cq-radio"
                      />
                      <span>
                        <span className="block font-semibold">{o.titulo}</span>
                        <span className="block text-sm text-[#4A5A50] first-letter:uppercase">{o.detalle}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5">
                <label htmlFor="cq-nombre" className="font-semibold block mb-1.5">
                  Su nombre
                </label>
                <input
                  id="cq-nombre"
                  type="text"
                  autoComplete="given-name"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    if (error) setError(false);
                  }}
                  aria-invalid={error}
                  aria-describedby={error ? "cq-nombre-error" : undefined}
                  className="cq-campo"
                  placeholder="Para saludarle por su nombre"
                />
                {error && (
                  <p id="cq-nombre-error" className="mt-1.5 text-sm font-semibold text-[#A3401F]">
                    Escriba su nombre para que sepamos de quién es el pedido.
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label htmlFor="cq-nota" className="font-semibold block mb-1.5">
                  Nota <span className="font-normal text-[#4A5A50]">(opcional)</span>
                </label>
                <textarea
                  id="cq-nota"
                  rows={2}
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="cq-campo resize-none"
                  placeholder="Ej.: el semiduro en tajadas gruesas"
                />
              </div>

              <button type="submit" className="cq-boton cq-boton-verde w-full mt-6 !h-14 text-base">
                <Icono nombre="chat" className="w-5 h-5" />
                Enviar pedido por WhatsApp
              </button>
              <p className="mt-2 text-center text-xs text-[#4A5A50]">
                Se abre WhatsApp con el mensaje listo. Usted lo revisa y lo envía.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
