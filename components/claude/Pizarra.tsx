"use client";

import React, { useState } from "react";
import { CATEGORIES, products, type Product, type SensoryProfile } from "@/lib/products";
import { IlusProducto } from "./Ilustraciones";
import { Cantidad, Icono, usePedido } from "./pedido";
import { USOS, cantidadTexto, colones, ficha, paso, precioEtiqueta, type Uso } from "./datos";

const GRUPOS: Record<string, string> = {
  "Línea Tradicional Turrialba": "Los de siempre",
  "Quesos de Mesa & Hilados": "De mesa e hilados",
  "Madurados & Ahumados": "Madurados y ahumado",
  "Derivados Lácteos del Rancho": "Natilla y mantequilla",
  "Especial Mayoristas & Sodas": "Surtidos y por volumen",
};

const SENSORIAL: { clave: keyof SensoryProfile; etiqueta: string }[] = [
  { clave: "firmeza", etiqueta: "Firmeza" },
  { clave: "salinidad", etiqueta: "Sal" },
  { clave: "fundicion", etiqueta: "Se derrite" },
  { clave: "intensidad", etiqueta: "Sabor" },
];

export function Medidor({ perfil, claro }: { perfil: SensoryProfile; claro?: boolean }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-2 max-w-sm">
      {SENSORIAL.map(({ clave, etiqueta }) => (
        <div key={clave} className="flex items-center justify-between gap-3">
          <dt className={`text-sm ${claro ? "text-[#4A5A50]" : ""}`}>{etiqueta}</dt>
          <dd className="flex gap-1" aria-label={`${perfil[clave]} de 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="cq-punto" data-lleno={i <= perfil[clave] ? "true" : "false"} />
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Fila({ p, abierta, alternar }: { p: Product; abierta: boolean; alternar: () => void }) {
  const { agregar, cantidadDe } = usePedido();
  const [cantidad, setCantidad] = useState(porDefecto(p));
  const enPedido = cantidadDe(p.id);
  const f = ficha(p);
  const idDetalle = `cq-detalle-${p.id}`;

  return (
    <li className="cq-fila py-4 sm:py-5">
      <div className="flex items-center gap-3 sm:gap-5">
        <IlusProducto tipo={f.ilus} className="w-14 h-14 sm:w-[72px] sm:h-[72px] shrink-0" />
        <button
          type="button"
          onClick={alternar}
          aria-expanded={abierta}
          aria-controls={idDetalle}
          className="flex-1 min-w-0 text-left group"
        >
          <span className="flex items-baseline gap-3">
            <span className="cq-display text-[1.3rem] sm:text-[1.65rem] leading-tight group-hover:underline decoration-2 underline-offset-4 decoration-[#B14F2C]">
              {p.name}
            </span>
            <span className="cq-puntos hidden sm:block" aria-hidden="true" />
            <span className="hidden sm:block shrink-0 text-right">
              <span className="cq-display text-[1.65rem] tabular-nums">{colones(p.priceCRC)}</span>
            </span>
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#4A5A50]">
            <span className="sm:hidden font-semibold text-[#1C2620] tabular-nums">{colones(p.priceCRC)}</span>
            <span>{precioEtiqueta(p)}</span>
            {p.badge && <span className="hidden md:inline">· {p.badge}</span>}
            {enPedido > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2C5A3C] text-[#F7F2E8] px-2.5 py-0.5 text-xs font-semibold">
                <Icono nombre="check" className="w-3.5 h-3.5" />
                {cantidadTexto(p, enPedido)} en su pedido
              </span>
            )}
            <span className="ml-auto sm:ml-0 inline-flex items-center gap-1 font-semibold text-[#1C2620]">
              {abierta ? "Cerrar" : "Ver detalle"}
              <svg viewBox="0 0 24 24" className={`w-4 h-4 transition-transform ${abierta ? "rotate-180" : ""}`} aria-hidden="true">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </button>
        <button
          type="button"
          className="cq-mas"
          onClick={() => agregar(p, paso(p))}
          disabled={!p.inStock}
          aria-label={p.inStock ? `Agregar ${cantidadTexto(p, paso(p))} de ${p.name}` : `${p.name}: agotado esta semana`}
        >
          <Icono nombre="mas" className="w-5 h-5" />
        </button>
      </div>

      <div id={idDetalle} hidden={!abierta}>
        <div className="mt-4 sm:ml-[92px] grid gap-6 md:grid-cols-[1fr_auto] md:items-end rounded-[20px] bg-[#F7F2E8] border-2 border-[#1C2620]/10 p-5">
          <div className="space-y-4">
            <ul className="flex flex-wrap gap-2" aria-label="Usos recomendados">
              {p.idealUses.map((u) => (
                <li key={u} className="text-sm font-semibold px-3 py-1 rounded-full bg-[#ECE1C9]">
                  {u}
                </li>
              ))}
            </ul>
            <p className="cq-pretty max-w-xl">
              <span className="cq-mano text-xl text-[#B14F2C] mr-1.5">Cómo nos gusta:</span>
              {p.pairingNote}
            </p>
            <Medidor perfil={p.sensory} claro />
            <p className="text-sm text-[#4A5A50]">Presentación: {p.presentation}.</p>
          </div>
          {p.inStock ? (
            <div className="flex flex-col items-start md:items-end gap-3">
              <Cantidad p={p} valor={cantidad} min={paso(p)} onCambio={setCantidad} />
              <button type="button" className="cq-boton cq-boton-tinta" onClick={() => agregar(p, cantidad)}>
                Agregar · {colones(p.priceCRC * cantidad)}
              </button>
            </div>
          ) : (
            <p className="font-semibold text-[#A3401F]">Agotado esta semana</p>
          )}
        </div>
      </div>
    </li>
  );
}

function porDefecto(p: Product) {
  return p.unit === "kg" ? 1 : 1;
}

export default function Pizarra() {
  const [uso, setUso] = useState<Uso | "todos">("todos");
  const [abierta, setAbierta] = useState<string | null>(null);

  const lista = products.filter((p) => uso === "todos" || ficha(p).usos.includes(uso));
  const grupos =
    uso === "todos"
      ? CATEGORIES.map((c) => ({ titulo: GRUPOS[c] ?? c, items: lista.filter((p) => p.category === c) })).filter(
          (g) => g.items.length
        )
      : [{ titulo: null as string | null, items: lista }];

  const alternar = (id: string) => setAbierta((a) => (a === id ? null : id));

  return (
    <div>
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-2">
        <div role="group" aria-label="Filtrar por uso" className="flex gap-2 w-max">
          <button type="button" className="cq-chip" aria-pressed={uso === "todos"} onClick={() => setUso("todos")}>
            Todos
          </button>
          {USOS.map((u) => (
            <button key={u.id} type="button" className="cq-chip" aria-pressed={uso === u.id} onClick={() => setUso(u.id)}>
              {u.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="cq-tarjeta mt-6 px-4 sm:px-8 py-4 sm:py-6">
        <p className="sr-only" aria-live="polite">
          {lista.length} {lista.length === 1 ? "producto" : "productos"}
        </p>
        {grupos.map((g) => (
          <section key={g.titulo ?? "filtro"} className="[&+section]:mt-6">
            {g.titulo && (
              <h3 className="flex items-center gap-3 pt-3 pb-1">
                <span className="cq-mano text-[1.6rem] leading-none text-[#B14F2C]">{g.titulo}</span>
                <span className="flex-1 h-0.5 bg-[#1C2620]/15" aria-hidden="true" />
              </h3>
            )}
            <ul>
              {g.items.map((p) => (
                <Fila key={p.id} p={p} abierta={abierta === p.id} alternar={() => alternar(p.id)} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
