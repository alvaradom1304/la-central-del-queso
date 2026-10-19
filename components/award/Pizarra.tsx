"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { CATEGORIES, products, type Product } from "@/lib/products";
import { useCart } from "@/lib/CartContext";
import { crc, verifiedText } from "@/lib/award/copy";
import { flyWedgeToCart } from "@/lib/award/fly";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Miniatura optimizada por Next con `sizes` explícito: el navegador elige la variante pequeña
 * (antes, sin `sizes`, asumía 100vw y pedía hasta w=1920 para una imagen de 132 px).
 */
function thumbProps(src: string) {
  const { props } = getImageProps({ src, alt: "", width: 264, height: 198, quality: 70, sizes: "(max-width: 900px) 96px, 132px" });
  return { src: props.src as string, srcSet: props.srcSet as string | undefined, sizes: props.sizes as string | undefined };
}

export default function Pizarra() {
  const { addToCart, items } = useCart();
  const inCart = useMemo(() => new Map(items.map((it) => [it.product.id, it.quantity])), [items]);
  const [category, setCategory] = useState<string>("Todos");
  const [announce, setAnnounce] = useState("");
  const [added, setAdded] = useState<string | null>(null);
  const countRef = useRef(0);
  const timerRef = useRef(0);
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const list = useMemo(
    () => (category === "Todos" ? products : products.filter((p) => p.category === category)),
    [category],
  );
  // Al filtrar, las filas cambian de sitio: se muestran todas y se recalculan los disparadores de revelado.
  const firstFilter = useRef(true);
  useEffect(() => {
    if (firstFilter.current) { firstFilter.current = false; return; }
    gsap.set(".aw-row", { clearProps: "opacity,transform" });
    ScrollTrigger.refresh();
  }, [category]);

  const add = (prod: Product, from?: DOMRect) => {
    flyWedgeToCart(from);
    // Sin abrir el cajón: el aviso está en la fila y en la región viva; el pedido se revisa desde «Pedido».
    addToCart(prod, 1, { open: false });
    setAdded(prod.id);
    countRef.current += 1;
    // El contador evita que un mensaje idéntico no se vuelva a anunciar.
    setAnnounce(`${prod.name} agregado al pedido (${countRef.current}).`);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setAdded((id) => (id === prod.id ? null : id)), 1600);
  };

  return (
    <div className="aw-board">
      <div className="aw-board__filters" role="group" aria-label="Filtrar por tipo">
        {["Todos", ...CATEGORIES].map((c) => (
          <button key={c} type="button" className="aw-chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <ul className="aw-board__list">
        {list.map((prod) => (
          <li key={prod.id} className="aw-row">
            {/* Revelado dentro de la fila: la imagen nunca tapa texto. */}
            <span className="aw-row__media">
              <img className="aw-row__thumb" {...thumbProps(prod.image)} alt="" loading="lazy" decoding="async" width={132} height={99} />
            </span>
            <div className="aw-row__name">
              <span className="aw-row__cat">{prod.badge ?? prod.category}</span>
              {inCart.has(prod.id) && <span className="aw-row__incart">En su pedido · {inCart.get(prod.id)}</span>}
              <h3>{prod.name}</h3>
              <p>{verifiedText(prod.description)}</p>
            </div>
            <ul className="aw-row__uses" aria-label={`Usos ideales de ${prod.name}`}>
              {prod.idealUses.map((u) => <li key={u}>{u}</li>)}
            </ul>
            <p className="aw-row__price">
              <span className="aw-row__amount">{crc(prod.priceCRC)}</span>
              <span className="aw-row__unit">/ {prod.unit}</span>
              <span className="aw-row__pres">{prod.presentation}</span>
            </p>
            <button type="button" className="aw-add" onClick={(e) => add(prod, e.currentTarget.getBoundingClientRect())}>
              {added === prod.id ? "Agregado ✓" : "Agregar"}
              <span className="aw-sr"> {prod.name} al pedido</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="aw-board__note">
        Precios de referencia en colones. El peso final y la disponibilidad se confirman por WhatsApp. Fotografías ilustrativas.
      </p>
      <p className="aw-sr" role="status" aria-live="polite">{announce}</p>
    </div>
  );
}
