"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import CountUp from "./CountUp";
import { getRuntime } from "@/lib/award/runtime";
import { products, type Product } from "@/lib/products";
import { useCart } from "@/lib/CartContext";
import { crc } from "@/lib/award/copy";

type Ritmo = "finde" | "diario" | "eventos";

const RITMOS: { id: Ritmo; label: string; desc: string }[] = [
  { id: "finde", label: "Fines de semana", desc: "Desayunos sabatinos" },
  { id: "diario", label: "Todos los días", desc: "Pinto, café y cenas" },
  { id: "eventos", label: "Muy queseros", desc: "Cocina y picadas" },
];

const byId = (id: string) => products.find((p) => p.id === id) as Product;

/** Misma lógica que components/CheeseMatcher.tsx (factores y umbrales), en una interfaz nueva. */
function calcular(personas: number, ritmo: Ritmo, palmito: boolean, natilla: boolean) {
  const factor = ritmo === "finde" ? 0.22 : ritmo === "diario" ? 0.42 : 0.65;
  const kilos = Math.max(1, Math.round(personas * factor));
  const items: { product: Product; qty: number; label: string }[] = [
    { product: byId("semiduro-tradicional"), qty: kilos, label: `${kilos} kg` },
  ];
  if (palmito) {
    const q = personas >= 6 ? 2 : 1;
    items.push({ product: byId("queso-palmito"), qty: q, label: `${q} rollo${q > 1 ? "s" : ""}` });
  }
  if (natilla) {
    const q = personas >= 5 ? 2 : 1;
    items.push({ product: byId("natilla-casera"), qty: q, label: `${q} × 500 g` });
  }
  let total = items.reduce((s, it) => s + it.product.priceCRC * it.qty, 0);
  const peso = kilos + (palmito ? (personas >= 6 ? 1 : 0.5) : 0) + (natilla ? (personas >= 5 ? 1 : 0.5) : 0);
  // Si la sugerencia coincide con el Surtido Semanal Familiar (1 kg + 1 palmito + 1 natilla), conviene el surtido.
  const combo = byId("combo-familiar");
  const coincide = kilos === 1 && palmito && natilla && items.every((it) => it.qty === 1);
  let ahorro = 0;
  if (coincide && combo && combo.priceCRC < total) {
    ahorro = total - combo.priceCRC;
    items.splice(0, items.length, { product: combo, qty: 1, label: "1 surtido" });
    total = combo.priceCRC;
  }
  return { items, total, peso, ahorro };
}

export default function Canasta() {
  const { addToCart, setIsCartOpen } = useCart();
  const [personas, setPersonas] = useState(4);
  const [ritmo, setRitmo] = useState<Ritmo>("diario");
  const [palmito, setPalmito] = useState(true);
  const [natilla, setNatilla] = useState(true);
  const r = useMemo(() => calcular(personas, ritmo, palmito, natilla), [personas, ritmo, palmito, natilla]);
  const linesRef = useRef<HTMLUListElement>(null);
  const first = useRef(true);
  // Cada cambio «imprime» de nuevo las líneas del tiquete (sin animación con movimiento reducido).
  const signature = r.items.map((it) => it.product.id + it.qty).join("|");
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const ul = linesRef.current;
    if (!ul || (getRuntime()?.reduced ?? true)) return;
    const tween = gsap.fromTo(ul.children, { y: -10, opacity: 0, clipPath: "inset(0 0 100% 0)" }, { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.45, ease: "power2.out", stagger: 0.07, clearProps: "clipPath" });
    return () => { tween.progress(1).kill(); };
  }, [signature]);

  const agregar = () => {
    r.items.forEach((it) => addToCart(it.product, it.qty));
    setIsCartOpen(true);
  };

  return (
    <div className="aw-calc">
      <form className="aw-calc__form" onSubmit={(e) => e.preventDefault()}>
        <div className="aw-field">
          <label htmlFor="aw-personas" className="aw-label">¿Cuántas personas comen en casa?</label>
          <div className="aw-range">
            <input
              id="aw-personas"
              type="range"
              min={1}
              max={12}
              value={personas}
              onChange={(e) => setPersonas(Number(e.target.value))}
              aria-valuetext={`${personas} ${personas === 1 ? "persona" : "personas"}`}
            />
            <output htmlFor="aw-personas" className="aw-range__value" aria-hidden="true">{personas}</output>
          </div>
        </div>

        <fieldset className="aw-field">
          <legend className="aw-label">Ritmo de consumo en la semana</legend>
          <div className="aw-seg">
            {RITMOS.map((op) => (
              <label key={op.id} className="aw-seg__opt">
                <input type="radio" name="aw-ritmo" value={op.id} checked={ritmo === op.id} onChange={() => setRitmo(op.id)} />
                <span><strong>{op.label}</strong><small>{op.desc}</small></span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="aw-field">
          <legend className="aw-label">Sumar a la canasta</legend>
          <label className="aw-check">
            <input type="checkbox" checked={palmito} onChange={(e) => setPalmito(e.target.checked)} />
            <span>Queso palmito hilado a mano</span>
          </label>
          <label className="aw-check">
            <input type="checkbox" checked={natilla} onChange={(e) => setNatilla(e.target.checked)} />
            <span>Natilla casera de rancho</span>
          </label>
        </fieldset>
      </form>

      <div className="aw-ticket">
        <p className="aw-sr" aria-live="polite">
          Total aproximado {crc(r.total)}{r.ahorro > 0 ? `, con el Surtido Semanal Familiar ahorra ${crc(r.ahorro)}` : ""}.
        </p>
        <p className="aw-ticket__head">Canasta sugerida · {personas} {personas === 1 ? "persona" : "personas"}</p>
        <ul className="aw-ticket__lines" ref={linesRef}>
          {r.items.map((it) => (
            <li key={it.product.id}>
              <span>{it.product.name}</span>
              <span className="aw-ticket__qty">{it.label}</span>
              <span className="aw-ticket__sum">{crc(it.product.priceCRC * it.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="aw-ticket__total">
          <span>Total aproximado</span>
          <strong><CountUp value={r.total} format={crc} /></strong>
        </p>
        {r.ahorro > 0 && (
          <p className="aw-ticket__save">Le conviene el {r.items[0].product.name}: ahorra {crc(r.ahorro)}.</p>
        )}
        <p className="aw-ticket__meta">{r.peso.toFixed(1)} kg en total · cantidades orientativas</p>
        <button type="button" className="aw-cta aw-cta--dark" onClick={agregar}>
          Agregar canasta al pedido
        </button>
      </div>
    </div>
  );
}
