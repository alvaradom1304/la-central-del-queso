"use client";

import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/products";
import { useCart } from "@/lib/CartContext";
import { crc } from "@/lib/award/copy";
import { flyWedgeToCart } from "@/lib/award/fly";

const semiduro = products.find((p) => p.id === "semiduro-tradicional")!;

/**
 * Consecuencia del gesto: cuando el usuario corta la cuña aparece la porción con su precio real
 * y se puede agregar al pedido. Escucha el evento «aw:cut» que emite HeroStage.
 * Solo datos de lib/products.ts: precio por kilo, no un precio de porción inventado.
 */
export default function SliceCard() {
  const { addToCart } = useCart();
  const [cut, setCut] = useState(false);
  const [added, setAdded] = useState(false);
  const [announce, setAnnounce] = useState("");
  const timer = useRef(0);
  const count = useRef(0);
  const wedgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onCut = (e: Event) => setCut(Boolean((e as CustomEvent<{ cut: boolean }>).detail?.cut));
    window.addEventListener("aw:cut", onCut);
    return () => {
      window.removeEventListener("aw:cut", onCut);
      window.clearTimeout(timer.current);
    };
  }, []);

  const fly = () => flyWedgeToCart(wedgeRef.current?.getBoundingClientRect());

  const add = () => {
    addToCart(semiduro, 1, { open: false });
    count.current += 1;
    setAnnounce(`${semiduro.name} agregado al pedido (${count.current}).`);
    fly();
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      <p className="aw-sr" aria-live="polite">
        {cut ? `Cuña cortada: ${semiduro.name}, ${crc(semiduro.priceCRC)} por ${semiduro.unit}.` : ""}
      </p>
      <p className="aw-sr" role="status" aria-live="polite">{announce}</p>
      <div className="aw-slice" data-open={cut} hidden={!cut}>
        <span ref={wedgeRef} className="aw-slice__wedge" aria-hidden="true" />
        <div className="aw-slice__text">
          <p className="aw-slice__label"><span className="aw-slice__label-long">La cuña de la casa</span><span className="aw-slice__label-short" aria-hidden="true">Cuña · Semiduro</span></p>
          <p className="aw-slice__name">{semiduro.name}</p>
          <p className="aw-slice__price">
            {crc(semiduro.priceCRC)} <span>/ {semiduro.unit}<span className="aw-slice__pres"> · {semiduro.presentation.toLowerCase()}</span></span>
          </p>
        </div>
        <button type="button" className="aw-slice__add" onClick={add}>
          {added ? "Agregado ✓" : "Agregar"}
          <span className="aw-sr"> {semiduro.name} al pedido</span>
        </button>
      </div>
    </>
  );
}
