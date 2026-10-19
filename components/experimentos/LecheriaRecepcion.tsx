"use client";

import React from "react";
import Image from "next/image";
import { products, type Product } from "@/lib/products";
import { useCart } from "@/lib/CartContext";
import { whatsappUrl } from "@/lib/whatsapp";
import { DEFAULT_NOTICE } from "./fincaManifest";
import { formatCRC } from "./format";

// Solo productos disponibles; primero los destacados (isHero), luego el resto
// en el orden del catálogo.
const RECEPCION_PRODUCTS: Product[] = [
  ...products.filter((p) => p.inStock && p.isHero),
  ...products.filter((p) => p.inStock && !p.isHero),
];

const WHATSAPP_GREETING = "Hola, vengo del recorrido por la finca en la web y quisiera hacer una consulta.";

const VENTANA_IMAGE = {
  src: "/lecheria_proceso_artesanal.jpg",
  alt: "Interior de una lechería de madera donde dos personas trabajan la cuajada junto a una paila humeante",
};

const TEXT_LINK =
  "inline-flex min-h-11 items-center text-[10px] uppercase tracking-[0.26em] text-[#F2EDE3]/85 underline decoration-[#F2EDE3]/35 underline-offset-[7px] transition-colors hover:text-[#F2EDE3] hover:decoration-[#C4A56E] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#F2EDE3] sm:text-[11px]";

interface LecheriaRecepcionProps {
  /** Aviso para el anuncio accesible tras agregar un producto. */
  onProductAdded?: (product: Product) => void;
  /**
   * Capa opcional que se monta como hijo de #ventana-lecheria, encima de la
   * foto (p. ej. un componente WebGL posicionado en absoluto que la cubra).
   */
  ventanaOverlay?: React.ReactNode;
  /** Objeto tocable bajo el texto de bienvenida (decorativo). */
  cuenco?: React.ReactNode;
}

/**
 * Final del recorrido (id="lecheria"): una "ventana de la lechería" con texto
 * de bienvenida y el catálogo como piezas de exposición. El pedido sigue el
 * flujo existente: canasta (CartDrawer) → consulta por WhatsApp.
 */
export default function LecheriaRecepcion({ onProductAdded, ventanaOverlay, cuenco }: LecheriaRecepcionProps) {
  const { addToCart, setIsCartOpen, totalItemsCount } = useCart();

  const handleAdd = (product: Product) => {
    addToCart(product, 1);
    onProductAdded?.(product);
  };

  return (
    <section
      id="lecheria"
      tabIndex={-1}
      aria-labelledby="lecheria-titulo"
      className="relative scroll-mt-20 bg-[#0E0C09] px-6 py-28 text-[#F2EDE3] focus:outline-none sm:px-12 sm:py-36 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Ventana de la lechería: imagen a la izquierda, bienvenida a la derecha. */}
        <div className="grid items-end gap-12 md:grid-cols-12 md:gap-16">
          <figure className="md:col-span-5">
            <div id="ventana-lecheria" className="relative aspect-[4/5] w-full overflow-hidden bg-[#17130E]">
              <Image
                src={VENTANA_IMAGE.src}
                alt={VENTANA_IMAGE.alt}
                fill
                sizes="(min-width: 1280px) 520px, (min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
              {ventanaOverlay}
            </div>
            <figcaption className="mt-3 text-[10px] uppercase tracking-[0.24em] text-[#F2EDE3]/45">
              {DEFAULT_NOTICE}
            </figcaption>
          </figure>

          <div className="md:col-span-6 md:col-start-7 md:pb-14">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#C4A56E] sm:text-[11px]">Final del recorrido</p>
            <h2
              id="lecheria-titulo"
              className="mt-5 text-balance font-serif text-5xl font-normal leading-[0.95] tracking-[-0.01em] sm:text-7xl"
            >
              Le recibimos en la lechería
            </h2>
            <p className="mt-6 max-w-md text-pretty text-sm leading-relaxed text-[#F2EDE3]/70">
              Elija lo que quiere llevar y agréguelo a su canasta. El pedido se envía como consulta a nuestro WhatsApp
              para confirmar disponibilidad y coordinar el retiro o la entrega.
            </p>
            {cuenco ? (
              <div aria-hidden="true" className="mt-12 flex items-center gap-6">
                {cuenco}
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#F2EDE3]/45 motion-reduce:hidden">
                  Pase la mano por la leche
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Piezas de exposición. */}
        <ul role="list" aria-label="Productos" className="mt-28 grid gap-x-12 gap-y-20 sm:mt-40 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-28">
          {RECEPCION_PRODUCTS.map((product) => (
            <li key={product.id}>
              <article aria-labelledby={`producto-${product.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-[#17130E]">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 380px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-5">
                  <h3 id={`producto-${product.id}`} className="font-serif text-2xl font-normal leading-tight">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-xs text-[#F2EDE3]/60">{product.presentation}</p>
                  <div className="mt-1 flex items-baseline justify-between gap-6">
                    <p className="text-xs tabular-nums text-[#F2EDE3]/85">
                      {formatCRC(product.priceCRC)}
                      <span className="text-[#F2EDE3]/55"> · por {product.unit}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      aria-label={`Agregar a la canasta: ${product.name}`}
                      className={TEXT_LINK}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-28 flex flex-col items-start gap-2 border-t border-[#F2EDE3]/10 pt-10 sm:flex-row sm:items-center sm:gap-12">
          <button type="button" onClick={() => setIsCartOpen(true)} className={TEXT_LINK}>
            Ver mi canasta ({totalItemsCount})
          </button>
          <a href={whatsappUrl(WHATSAPP_GREETING)} target="_blank" rel="noopener noreferrer" className={TEXT_LINK}>
            Escribir por WhatsApp
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
