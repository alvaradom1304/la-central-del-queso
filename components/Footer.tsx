import React from "react";
import { Phone, Mail, MapPin, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#121E17] text-cream pt-20 pb-10 border-t border-forest-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          
          {/* Identidad de la Marca */}
          <div className="space-y-4">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-cream block">
              La Central del Queso
            </span>
            <span className="text-2xs text-cheese uppercase tracking-[0.25em] font-semibold block">
              Tradición Familiar desde 1980
            </span>
            <p className="text-xs sm:text-sm text-cream/70 leading-relaxed font-light">
              Cuatro décadas honrando el oficio quesero tradicional de Costa Rica. Llevamos el mejor semiduro de Turrialba de las faldas del volcán directamente a su hogar.
            </p>
            
            <div className="pt-2 flex items-center gap-2 text-2xs text-cream/80 bg-white/5 px-3 py-2 rounded-xl border border-white/10 w-fit">
              <span className="text-cheese font-bold">SINPE MÓVIL</span>
              <span>Aceptado en Feria y Entregas</span>
            </div>
          </div>

          {/* Enlaces de Navegación Rápida */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-cream">Navegación</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-cream/75">
              <li>
                <a href="#historia" className="hover:text-cheese transition-colors">
                  Tradición y Legado de 1980
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-cheese transition-colors">
                  Catálogo de Quesos Artesanales
                </a>
              </li>
              <li>
                <a href="#ferias" className="hover:text-cheese transition-colors">
                  Ferias de Guadalupe y Hatillo
                </a>
              </li>
              <li>
                <a href="#mayoristas" className="hover:text-cheese transition-colors">
                  Atención para Sodas y Restaurantes
                </a>
              </li>
            </ul>
          </div>

          {/* Ferias y Horarios */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-cream">Presencia Física</h3>
            <div className="space-y-3 text-xs sm:text-sm text-cream/75">
              <div>
                <span className="font-bold text-cream block">Feria de Guadalupe</span>
                <span className="text-cream/60 text-2xs">Sábados: 5:30 am – 1:00 pm</span>
              </div>
              <div>
                <span className="font-bold text-cream block">Feria de Hatillo</span>
                <span className="text-cream/60 text-2xs">Domingos: 6:00 am – 1:30 pm</span>
              </div>
              <div className="pt-1">
                <span className="font-bold text-cream block">Entregas GAM Programadas</span>
                <span className="text-cream/60 text-2xs">Previa coordinación por WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Contacto & Verdad Comercial */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-cream">Canales de Atención</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-cream/75">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-cheese shrink-0 mt-0.5" />
                <div>
                  <span className="block text-cream font-medium">WhatsApp de Pedidos</span>
                  <a
                    href="https://wa.me/50688888888"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cheese text-cream/90 transition-colors"
                  >
                    +506 8888-8888
                  </a>
                  <span className="block text-2xs text-cream/50">(Línea provisional)</span>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-cheese shrink-0 mt-0.5" />
                <div>
                  <span className="block text-cream font-medium">Correo Electrónico</span>
                  <span className="text-cream/90">pedidos@lacentraldelqueso.cr</span>
                  <span className="block text-2xs text-cream/50">(Por confirmar)</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Pie de Página Legal y Transparencia */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-cream/50">
          <p>© {new Date().getFullYear()} La Central del Queso. Tradición familiar costarricense desde 1980.</p>
          <div className="flex items-center gap-2">
            <span>Elaborado y comercializado con orgullo en Costa Rica</span>
            <span>🇨🇷</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
