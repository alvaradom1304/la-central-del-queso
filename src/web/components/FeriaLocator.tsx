import React from "react";
import { locations } from "../lib/locations";

export default function FeriaLocator() {
  return (
    <section className="py-20 px-4 bg-white border-t border-gray-100" id="ferias">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-foliage uppercase mb-3">Puntos de Venta Físicos</h2>
          <h3 className="text-4xl font-serif text-terracotta mb-4">Visítenos en la Feria</h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Venga a conocernos en persona. Pruebe nuestros quesos frescos y llévese la calidad directamente de nuestras manos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-[#faf9f6] rounded-2xl p-8 border border-gray-200 shadow-sm relative overflow-hidden">
              
              {/* Tasting Badge */}
              <div className="absolute top-0 right-0 bg-foliage text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                Degustación Gratis
              </div>

              <h4 className="text-2xl font-bold text-gray-900 mb-2">{loc.name}</h4>
              
              <div className="flex items-start gap-3 mb-4 mt-6">
                <span className="text-xl">🕒</span>
                <div>
                  <p className="font-semibold text-gray-800">Horario</p>
                  <p className="text-gray-600">{loc.daysHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-8">
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-semibold text-gray-800">Ubicación del Puesto</p>
                  <p className="text-gray-600">{loc.standInfo}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={loc.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">🗺️</span> Google Maps
                </a>
                <a
                  href={loc.wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#33ccff] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2ab8e6] transition-colors"
                >
                  <span className="text-lg">🚗</span> Waze
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
