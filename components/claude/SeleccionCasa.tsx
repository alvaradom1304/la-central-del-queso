"use client";

import { products } from "@/lib/products";
import { usePedido } from "./pedido";
import { colones, paso, precioEtiqueta } from "./datos";

const piezas = [
  { id: "semiduro-tradicional", image: "/hero_luxury_maison.jpg", nota: "Para dorar despacio en el sartén" },
  { id: "queso-palmito", image: "/queso_palmito.jpg", nota: "Hilos suaves para la hora del café" },
  { id: "natilla-casera", image: "/natilla_mantequilla.jpg", nota: "El último toque del desayuno" },
];

export default function SeleccionCasa() {
  const { agregar } = usePedido();
  return (
    <section className="maison-selection" aria-labelledby="seleccion-title">
      <div className="maison-heading">
        <span>De nuestra mesa a la suya</span>
        <h2 id="seleccion-title" className="cq-display">
          Los favoritos de la casa.
        </h2>
        <p>Tres maneras de empezar una buena costumbre.</p>
      </div>
      <div className="maison-products">
        {piezas.map((pieza, i) => {
          const p = products.find((p) => p.id === pieza.id)!;
          return (
            <article key={p.id}>
              <div className="maison-product-photo">
                <img src={pieza.image} alt={p.name} width="700" height="600" loading="lazy" />
                <span>0{i + 1} / SELECCIÓN DE LA CASA</span>
              </div>
              <div className="maison-product-copy">
                <p>{pieza.nota}</p>
                <h3 className="cq-display">{p.name}</h3>
                <div>
                  <span>
                    <strong>{colones(p.priceCRC)}</strong>
                    <small>{precioEtiqueta(p)}</small>
                  </span>
                  <button
                    type="button"
                    disabled={!p.inStock}
                    onClick={() => agregar(p, paso(p))}
                    aria-label={`Agregar ${p.unit === "kg" ? "medio kilo de " : ""}${p.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <a className="maison-text-link" href="#quesos">
        Explorar la carta completa <span>↗</span>
      </a>
    </section>
  );
}
