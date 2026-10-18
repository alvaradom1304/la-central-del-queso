import React from "react";
import { locations } from "../lib/locations";
import { MapPin, Clock, Navigation, CheckCircle2, Store } from "lucide-react";

export default function FeriaLocator() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-cream border-t border-forest/10" id="ferias">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 text-terracotta text-2xs sm:text-xs font-bold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5 text-cheese" />
            <span>Puntos de Venta Físicos</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest">
            Encuéntrenos cada fin de semana
          </h2>

          <p className="text-forest/70 text-sm sm:text-base leading-relaxed font-light">
            Venga a conocernos en persona. Pruebe una tajadita fresca, compruebe el punto de sal y llévese el queso recién empacado para su hogar.
          </p>
        </div>

        {/* Tarjetas de Ferias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-3xl p-8 border border-forest/10 shadow-lg shadow-forest/5 relative overflow-hidden flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Badge de Degustación */}
              <div className="absolute top-0 right-0 bg-forest text-cream text-2xs font-bold px-4 py-1.5 rounded-bl-xl tracking-wider uppercase">
                Degustación en el Puesto
              </div>

              <div className="space-y-4">
                <span className="text-2xs font-bold text-terracotta uppercase tracking-widest block">
                  Feria del Agricultor
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                  {loc.name}
                </h3>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm text-forest/80">
                    <Clock className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-forest">Horario Oficial:</span>
                      <span className="font-light">{loc.daysHours}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-forest/80">
                    <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-forest">Ubicación del Puesto:</span>
                      <span className="font-light">{loc.standInfo}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Navegación GPS */}
              <div className="pt-4 border-t border-forest/10 flex flex-col sm:flex-row gap-3">
                <a
                  href={loc.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-cream hover:bg-cream-dark text-forest border border-forest/15 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                >
                  <Navigation className="w-4 h-4 text-terracotta" />
                  <span>Abrir en Google Maps</span>
                </a>

                <a
                  href={loc.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#33ccff]/10 hover:bg-[#33ccff]/20 text-[#007799] border border-[#33ccff]/30 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                >
                  <span className="font-bold">Waze</span>
                  <span>Cómo Llegar</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Nota de retiro previo */}
        <div className="mt-12 text-center text-xs text-forest/60 bg-forest/5 p-4 rounded-2xl border border-forest/5 max-w-xl mx-auto">
          💡 <strong>Tip de compra:</strong> Puede preparar su pedido en la web durante la semana y retirarlo ya empacado y apartado en el puesto sin hacer fila.
        </div>

      </div>
    </section>
  );
}
