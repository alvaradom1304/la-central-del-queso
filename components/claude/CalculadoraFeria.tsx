"use client";

import { useState } from "react";
import { FRECUENCIAS, calcularCanasta, cantidadTexto, colones, type Frecuencia } from "./datos";
import { usePedido } from "./pedido";

export default function CalculadoraFeria() {
  const [personas, setPersonas] = useState(4);
  const [frecuencia, setFrecuencia] = useState<Frecuencia>("diario");
  const [palmito, setPalmito] = useState(true);
  const [natilla, setNatilla] = useState(true);
  const { agregar, abrir } = usePedido();
  const { lineas: seleccion, total, disponible } = calcularCanasta({ personas, frecuencia, palmito, natilla });
  return (
    <section id="calculadora-sommelier" className="art-calculadora">
      <div className="art-section-head">
        <div>
          <span className="cq-mano">Hagamos las cuentas</span>
          <h2 className="cq-display">
            Su canasta de feria,
            <br />
            sin adivinar cuánto llevar.
          </h2>
        </div>
        <p>Cuéntenos cuántos son en casa. Le sugerimos una canasta que puede ajustar antes de pedir.</p>
      </div>
      <div className="art-calc-grid">
        <div className="art-calc-controls">
          <div className="art-step">
            <span>01</span>
            <h3>¿Cuántos se sientan a la mesa?</h3>
          </div>
          <div className="art-people">
            <button
              type="button"
              aria-label="Quitar una persona"
              disabled={personas <= 1}
              onClick={() => setPersonas((p) => p - 1)}
            >
              −
            </button>
            <output aria-live="polite">
              {personas}
              <small>{personas === 1 ? "persona" : "personas"}</small>
            </output>
            <button
              type="button"
              aria-label="Agregar una persona"
              disabled={personas >= 12}
              onClick={() => setPersonas((p) => p + 1)}
            >
              +
            </button>
          </div>
          <label className="sr-only" htmlFor="art-personas">
            Personas en casa
          </label>
          <input
            id="art-personas"
            type="range"
            min="1"
            max="12"
            value={personas}
            onChange={(e) => setPersonas(Number(e.target.value))}
          />
          <fieldset>
            <legend className="art-step">
              <span>02</span>¿Con qué frecuencia comen queso?
            </legend>
            <div className="art-options">
              {FRECUENCIAS.map((f) => (
                <label key={f.id} data-selected={frecuencia === f.id}>
                  <input
                    type="radio"
                    name="frecuencia-feria"
                    value={f.id}
                    checked={frecuencia === f.id}
                    onChange={() => setFrecuencia(f.id)}
                  />
                  {f.etiqueta}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="art-step">
              <span>03</span>¿Algo más para la mesa?
            </legend>
            <label className="art-extra">
              <input type="checkbox" checked={palmito} onChange={(e) => setPalmito(e.target.checked)} />
              <span>
                Queso palmito<small>Para acompañar el café</small>
              </span>
            </label>
            <label className="art-extra">
              <input type="checkbox" checked={natilla} onChange={(e) => setNatilla(e.target.checked)} />
              <span>
                Natilla casera<small>La compañera del gallo pinto</small>
              </span>
            </label>
          </fieldset>
        </div>
        <div className="art-receipt">
          <div className="art-receipt-title">
            <span>LA CENTRAL DEL QUESO</span>
            <h3 className="cq-display">La cuenta de su canasta</h3>
            <p>
              Para {personas} {personas === 1 ? "persona" : "personas"} ·{" "}
              {FRECUENCIAS.find((f) => f.id === frecuencia)?.resumen}
            </p>
          </div>
          <ul>
            {seleccion.map((l) => (
              <li key={l.producto.id}>
                <span>
                  {l.producto.name}
                  <small>{cantidadTexto(l.producto, l.cantidad)}</small>
                </span>
                <strong>{colones(l.producto.priceCRC * l.cantidad)}</strong>
              </li>
            ))}
          </ul>
          <div className="art-total" aria-live="polite" aria-atomic="true">
            <span>Total estimado</span>
            <strong>{colones(total)}</strong>
          </div>
          <p className="art-disclaimer">
            Sugerencia orientativa: puede ajustar las cantidades en su pedido. El peso exacto y la disponibilidad se
            confirman por WhatsApp.
          </p>
          <button
            type="button"
            className="cq-boton cq-boton-tinta"
            disabled={!disponible}
            onClick={() => {
              seleccion.forEach((l) => agregar(l.producto, l.cantidad));
              abrir();
            }}
          >
            Agregar canasta a mi pedido ↗
          </button>
          <p className="art-small">Se suma a los productos que ya haya elegido.</p>
        </div>
      </div>
    </section>
  );
}
