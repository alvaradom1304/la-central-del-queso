import React from "react";
import { Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#090F0C] text-[#F7F4EC] pt-16 pb-10 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/10">
          {/* Identidad de la Marca */}
          <div className="space-y-4">
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#F7F4EC] block">
              La Central del Queso
            </span>
            <span className="font-mono text-[10px] text-[#DDA13E] uppercase tracking-[0.25em] block">
              De la Finca a tu Mesa · Desde 1980
            </span>
            <p className="text-xs sm:text-sm text-[#F7F4EC]/70 leading-relaxed font-light">
              Cuatro décadas honrando el oficio quesero tradicional de Costa Rica. Del umbral en
              las faldas de Turrialba a nuestras ferias de Guadalupe y Hatillo y a la mesa de su
              hogar o restaurante.
            </p>
            <div className="pt-1 flex items-center gap-2 font-mono text-[11px] text-[#F7F4EC]/80 bg-white/5 px-3 py-2 rounded-xl border border-white/10 w-fit">
              <span className="text-[#DDA13E] font-bold">SINPE MÓVIL</span>
              <span>Aceptado en Feria y Entregas</span>
            </div>
          </div>

          {/* Mapa de las 7 Escenas */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold text-[#F7F4EC]">
              Recorrido en 7 Escenas
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F7F4EC]/75">
              <li>
                <a href="#inicio-umbral" className="hover:text-[#DDA13E] transition-colors">
                  01–04 · El Umbral, El Camino, La Lechería y La Cava
                </a>
              </li>
              <li>
                <a href="#escena-mesa" className="hover:text-[#DDA13E] transition-colors">
                  05 · La Mesa Artesanal como Interfaz Viva
                </a>
              </li>
              <li>
                <a href="#escena-exploracion" className="hover:text-[#DDA13E] transition-colors">
                  06 · Alacena Interactiva de 12 Variedades
                </a>
              </li>
              <li>
                <a href="#escena-conexion" className="hover:text-[#DDA13E] transition-colors">
                  07 · Legado 1980, Ferias y Canal Mayorista B2B
                </a>
              </li>
            </ul>
          </div>

          {/* Presencia Física */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold text-[#F7F4EC]">Ferias del Agricultor</h3>
            <div className="space-y-3 text-xs sm:text-sm text-[#F7F4EC]/75">
              <div>
                <span className="font-semibold text-[#F7F4EC] block">Feria de Guadalupe</span>
                <span className="text-[#F7F4EC]/60 font-mono text-[11px]">
                  Sábados: 5:30 am – 1:00 pm
                </span>
              </div>
              <div>
                <span className="font-semibold text-[#F7F4EC] block">Feria de Hatillo</span>
                <span className="text-[#F7F4EC]/60 font-mono text-[11px]">
                  Domingos: 6:00 am – 1:30 pm
                </span>
              </div>
              <div className="pt-1">
                <span className="font-semibold text-[#F7F4EC] block">
                  Abastecimiento B2B & Hogar GAM
                </span>
                <span className="text-[#F7F4EC]/60 font-mono text-[11px]">
                  Coordinación directa vía WhatsApp
                </span>
              </div>
            </div>
          </div>

          {/* Contacto y Verdad Comercial */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold text-[#F7F4EC]">Canales de Atención</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-[#F7F4EC]/75">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#DDA13E] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[#F7F4EC] font-medium">WhatsApp de Pedidos</span>
                  <a
                    href="https://wa.me/50688888888"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#DDA13E] text-[#F7F4EC]/90 transition-colors font-mono"
                  >
                    +506 8888-8888
                  </a>
                  <span className="block text-[11px] text-[#F7F4EC]/50">(Línea provisional)</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#DDA13E] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[#F7F4EC] font-medium">Correo Electrónico</span>
                  <span className="text-[#F7F4EC]/90 font-mono text-xs">
                    pedidos@lacentraldelqueso.cr
                  </span>
                  <span className="block text-[11px] text-[#F7F4EC]/50">(Por confirmar)</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Nota de Transparencia Editorial y Legal */}
        <div className="pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-[11px] text-[#F7F4EC]/50">
          <p>
            © {new Date().getFullYear()} La Central del Queso. Tradición familiar costarricense
            desde 1980.
          </p>
          <p className="max-w-2xl text-left lg:text-right">
            Nota editorial: «Finca Doña Martha» y las escenas visuales del recorrido representan una
            recreación artística conceptual del origen quesero en Turrialba; los precios son
            referenciales de feria sujetos a confirmación de lote por WhatsApp.
          </p>
        </div>
      </div>
    </footer>
  );
}
