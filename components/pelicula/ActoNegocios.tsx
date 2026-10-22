"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { whatsappUrl } from "@/lib/whatsapp";
import { bloqueNegocio, colones } from "@/components/claude/datos";
import { referenciaCampana, usePedidoEstado } from "@/components/claude/pedidoEstado";
import type { FotoUso } from "@/lib/fotos";
import { revelarTitulares, useCine } from "./cine";
import { registrarEvento } from "./eventos";
import Galeria from "./Galeria";
import {
  KG_POR_BLOQUE,
  PRECIO_KG_BLOQUE,
  PRECIO_KG_DETALLE,
  TIPOS_NEGOCIO,
  calcularVolumen,
  kilos,
  type TipoNegocio,
} from "./negocio";

// Para su negocio: sodas, restaurantes, pizzerías, cafeterías y catering.
// Una calculadora de volumen convierte platos por semana en kilos y bloques,
// compara contra el precio por kilo al detalle y arma la cotización por
// WhatsApp con esos datos (el negocio confirma precio, entrega y muestra).

export default function ActoNegocios({ fotos }: { fotos: FotoUso[] }) {
  const { agregar } = usePedidoEstado();
  const { abrirPedido } = useCine();
  const ref = useRef<HTMLElement>(null);
  const [tipo, setTipo] = useState<TipoNegocio>("soda");
  const [platos, setPlatos] = useState(300);
  // El campo guarda lo que se escribe; se acota solo al calcular y al salir
  // (acotar en cada tecla impide escribir «120»).
  const [gramosTexto, setGramosTexto] = useState(String(TIPOS_NEGOCIO[0].gramos));
  const [nombre, setNombre] = useState("");
  const [zona, setZona] = useState("");
  const [frecuencia, setFrecuencia] = useState<"semanal" | "quincenal">("semanal");
  const [muestra, setMuestra] = useState(true);

  const leidos = Number(gramosTexto);
  const gramos = Number.isFinite(leidos) && leidos > 0 ? Math.min(400, Math.max(5, Math.round(leidos))) : 5;
  const v = calcularVolumen(platos, gramos);
  // Bloques de cada pedido según la frecuencia (quincenal = dos semanas).
  const semanasPorPedido = frecuencia === "quincenal" ? 2 : 1;
  const bloquesPedido = calcularVolumen(platos * semanasPorPedido, gramos).bloques;
  const etiquetaTipo = TIPOS_NEGOCIO.find((t) => t.id === tipo)!.etiqueta;

  // El anuncio para lectores de pantalla espera a que el valor se asiente
  // (el deslizador cambia en cada paso).
  const resumen = `${kilos(v.kgSemana)} por semana, ${v.bloques} bloques, ${colones(v.costoBloques)} en bloque, diferencia de ${colones(v.ahorroSemana)} por semana.`;
  const [anuncio, setAnuncio] = useState(resumen);
  useEffect(() => {
    const t = window.setTimeout(() => setAnuncio(resumen), 700);
    return () => window.clearTimeout(t);
  }, [resumen]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const raiz = ref.current!;
        const deshacer = revelarTitulares(raiz);
        gsap.from(raiz.querySelectorAll(".cine-ventajas li, .cine-cifra"), {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: raiz.querySelector(".cine-calc"), start: "top 78%", once: true },
        });
        return deshacer;
      });
    },
    { scope: ref }
  );

  const cotizar = () => {
    const quien = [etiquetaTipo.toLowerCase(), nombre.trim() ? `(${nombre.trim()})` : "", zona.trim() ? `en ${zona.trim()}` : ""]
      .filter(Boolean)
      .join(" ");
    const ref = referenciaCampana();
    const texto = [
      `¡Hola! Escribo por mi negocio: ${quien}.`,
      `Servimos unos ${platos} platos con queso por semana (~${gramos} g por plato): calculo ${kilos(v.kgSemana)} a la semana, unos ${v.bloques} ${v.bloques === 1 ? "bloque" : "bloques"} de ${String(KG_POR_BLOQUE).replace(".", ",")} kg de semiduro.`,
      `¿Me cotizan por volumen con pedido ${frecuencia}?${semanasPorPedido > 1 ? ` Serían unos ${bloquesPedido} bloques por pedido.` : ""}`,
      muestra ? "Me gustaría probar una muestra antes de hacer el primer pedido." : null,
      ref ? `(ref. web: ${ref})` : null,
    ]
      .filter((x) => x !== null)
      .join("\n");
    window.open(whatsappUrl(texto), "_blank", "noopener,noreferrer");
    registrarEvento("whatsapp_cotizacion", { tipo, bloques: v.bloques, frecuencia, muestra });
  };

  return (
    <section ref={ref} id="negocios" tabIndex={-1} aria-labelledby="negocios-titulo" className="cine-negocios cine-oscuro focus:outline-none">
      <div className="mx-auto max-w-6xl">
        <p className="cine-kicker">Para restaurantes, sodas y pizzerías</p>
        <h2 id="negocios-titulo" className="cine-titular mt-4 max-w-3xl text-[clamp(2.6rem,5vw,4.8rem)]" data-revelar>
          Queso para su cocina, todas las semanas
        </h2>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed cine-crema-80">
          Calcule cuánto semiduro usa su cocina y cuánto le cuesta en bloque. Le cotizamos por WhatsApp con esos números.
        </p>

        <Galeria
          className="mt-10"
          etiqueta="El semiduro en la cocina de un negocio"
          fotos={fotos.slice(0, 3).map((f) => ({ clave: f.nombre, titulo: f.titulo, alt: f.alt, src: f.src }))}
        />

        <div className="cine-calc mt-12">
          <div className="space-y-8">
            <fieldset>
              <legend>Tipo de negocio</legend>
              <div className="cine-opciones">
                {TIPOS_NEGOCIO.map((t) => (
                  <label key={t.id}>
                    <input
                      type="radio"
                      name="negocio-tipo"
                      value={t.id}
                      checked={tipo === t.id}
                      onChange={() => {
                        setTipo(t.id);
                        setGramosTexto(String(t.gramos));
                      }}
                    />
                    {t.etiqueta}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="negocio-platos" className="cine-paso">
                Platos con queso por semana: <span className="tabular-nums text-[var(--miel-clara)]">{platos}</span>
              </label>
              <input
                id="negocio-platos"
                type="range"
                min={20}
                max={3000}
                step={10}
                value={platos}
                onChange={(e) => setPlatos(Number(e.target.value))}
                className="cine-rango"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="negocio-gramos" className="cine-paso">
                  Gramos de queso por plato
                </label>
                <input
                  id="negocio-gramos"
                  type="number"
                  inputMode="numeric"
                  min={5}
                  max={400}
                  value={gramosTexto}
                  onChange={(e) => setGramosTexto(e.target.value)}
                  onBlur={() => setGramosTexto(String(gramos))}
                  className="cine-campo-texto"
                  aria-describedby="negocio-gramos-ayuda"
                />
                <p id="negocio-gramos-ayuda" className="mt-1.5 text-xs cine-crema-60">
                  Referencia para {etiquetaTipo.toLowerCase()}; ajústela a su receta.
                </p>
              </div>
              <fieldset>
                <legend>Frecuencia de pedido</legend>
                <div className="cine-opciones">
                  {(["semanal", "quincenal"] as const).map((f) => (
                    <label key={f}>
                      <input type="radio" name="negocio-frecuencia" checked={frecuencia === f} onChange={() => setFrecuencia(f)} />
                      {f === "semanal" ? "Semanal" : "Quincenal"}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <ul className="cine-ventajas">
              <li>
                Bloque de 2,5 kg a {colones(bloqueNegocio.priceCRC)}: sale a {colones(PRECIO_KG_BLOQUE)} el kilo (al detalle,{" "}
                {colones(PRECIO_KG_DETALLE)}).
              </li>
              <li>Semiduro de textura firme: dora en la plancha sin deshacerse y gratina.</li>
              <li>Pedido por WhatsApp; retiro en la feria o entrega a coordinar según su zona.</li>
              <li>Pago por SINPE Móvil.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="cine-cifras">
              <div className="cine-cifra">
                <span>Semiduro por semana</span>
                <Cifra valor={v.kgSemana} formato={kilos} />
              </div>
              <div className="cine-cifra">
                <span>Bloques de 2,5 kg</span>
                <Cifra valor={v.bloques} formato={(n) => String(Math.round(n))} />
              </div>
              <div className="cine-cifra">
                <span>En bloque, por semana</span>
                <Cifra valor={v.costoBloques} formato={colones} />
              </div>
              <div className="cine-cifra">
                <span>Mismo peso al detalle</span>
                <Cifra valor={v.costoDetalle} formato={colones} />
              </div>
              <div className="cine-cifra cine-cifra-destacada">
                <span>Diferencia estimada a favor del bloque</span>
                <Cifra valor={v.ahorroSemana} formato={(n) => `${colones(n)} por semana`} />
                <span className="mt-1">≈ {colones(v.ahorroMes)} al mes, con los precios de referencia de hoy.</span>
              </div>
            </div>
            <p className="sr-only" aria-live="polite">
              {anuncio}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="negocio-nombre" className="mb-1.5 block text-sm font-semibold">
                  Nombre del negocio <span className="font-normal cine-crema-60">(opcional)</span>
                </label>
                <input
                  id="negocio-nombre"
                  type="text"
                  autoComplete="organization"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="cine-campo-texto"
                />
              </div>
              <div>
                <label htmlFor="negocio-zona" className="mb-1.5 block text-sm font-semibold">
                  Zona o cantón <span className="font-normal cine-crema-60">(opcional)</span>
                </label>
                <input
                  id="negocio-zona"
                  type="text"
                  autoComplete="address-level2"
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  className="cine-campo-texto"
                />
              </div>
            </div>
            <label className="cine-casilla">
              <input type="checkbox" checked={muestra} onChange={(e) => setMuestra(e.target.checked)} />
              <span className="text-sm">Me gustaría probar una muestra antes del primer pedido</span>
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="button" className="cine-boton cine-boton-whatsapp" onClick={cotizar}>
                Cotizar por WhatsApp
              </button>
              <button
                type="button"
                className="cine-boton cine-boton-linea text-[var(--crema)]"
                onClick={() => {
                  agregar(bloqueNegocio, bloquesPedido);
                  registrarEvento("producto_agregado", { producto: bloqueNegocio.id, cantidad: bloquesPedido, origen: "negocios" });
                  registrarEvento("pedido_abierto", { lineas: 1, origen: "negocios" });
                  abrirPedido();
                }}
              >
                Agregar {bloquesPedido} {bloquesPedido === 1 ? "bloque" : "bloques"} al pedido
              </button>
            </div>
            <p className="text-xs leading-relaxed cine-crema-60">
              Estimación con precios de referencia; el precio por volumen, la entrega y la muestra se confirman por
              WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Cifra que rueda hasta su nuevo valor (texto decorativo; el valor final se
 * anuncia aparte). Sin animación con «reducir movimiento».
 */
function Cifra({ valor, formato }: { valor: number; formato: (n: number) => string }) {
  const ref = useRef<HTMLElement>(null);
  const previo = useRef(valor);
  const formatoRef = useRef(formato);
  formatoRef.current = formato;
  // React solo pone el texto inicial; después lo escribe únicamente el efecto.
  const inicial = useRef(formato(valor));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desde = previo.current;
    previo.current = valor;
    if (desde === valor || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = formatoRef.current(valor);
      return;
    }
    const estado = { n: desde };
    const tween = gsap.to(estado, {
      n: valor,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatoRef.current(estado.n);
      },
    });
    return () => {
      tween.kill();
    };
  }, [valor]);

  return (
    <strong ref={ref} aria-hidden="true">
      {inicial.current}
    </strong>
  );
}
