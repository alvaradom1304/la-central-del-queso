"use client";

import React from "react";
import type { FincaManifest } from "@/components/experimentos/fincaManifest";
import type { FotosReales } from "@/lib/fotos";
import { PedidoEstadoProvider } from "@/components/claude/pedidoEstado";
import { CineProvider } from "./cine";
import Cabecera from "./Cabecera";
import LuzCursor from "./LuzCursor";
import Amanecer from "./Amanecer";
import ActoFinca from "./ActoFinca";
import ActoMesa from "./ActoMesa";
import ActoCasa from "./ActoCasa";
import ActoNegocios from "./ActoNegocios";
import ActoFerias from "./ActoFerias";
import Cierre from "./Cierre";
import PanelPedido from "./PanelPedido";
import { avisoDeImagenes, posterDelPlano } from "./plano";
import "./pelicula.css";

/**
 * La portada como un recorrido inmersivo por el campo, en un solo plano y
 * contado con el scroll: amanecer → camino de la finca → la mesa (carta) →
 * para su casa → para su negocio → ferias → cierre. El pedido está a un clic
 * en todo momento.
 */
export default function Pelicula({ manifest, fotos }: { manifest: FincaManifest | null; fotos: FotosReales }) {
  // Con fotos reales, el aviso aclara que solo lo que aún no tiene foto propia es recreación.
  const hayReales =
    Object.keys(fotos.productos).length > 0 ||
    fotos.uso.length > 0 ||
    Object.values(fotos.ferias).some((f) => f.length > 0);
  const recreacion = avisoDeImagenes(manifest).toLowerCase();
  const aviso = hayReales
    ? `Recorrido por la finca y productos sin foto propia: ${recreacion}`
    : `Imágenes: ${recreacion}`;

  return (
    <PedidoEstadoProvider>
      <CineProvider>
        <div className="cine">
          <a
            href="#carta"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-[var(--miel)] focus:px-4 focus:py-2 focus:text-[var(--tinta)]"
          >
            Saltar a los quesos
          </a>
          <Cabecera />
          <LuzCursor />
          <main>
            <Amanecer poster={posterDelPlano(manifest)} />
            <ActoFinca manifest={manifest} />
            <ActoMesa fotos={fotos.productos} />
            <ActoCasa fotos={fotos.uso.filter((f) => f.para !== "negocio")} />
            <ActoNegocios fotos={fotos.uso.filter((f) => f.para !== "casa")} />
            <ActoFerias fotos={fotos.ferias} />
            <Cierre avisoImagenes={aviso} />
          </main>
          <PanelPedido />
        </div>
      </CineProvider>
    </PedidoEstadoProvider>
  );
}
