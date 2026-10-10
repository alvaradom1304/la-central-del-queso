import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1">
            <h2 className="font-serif text-3xl text-cream font-bold mb-4">Doña Martha</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Lácteos artesanales costarricenses. La calidez de la feria y la frescura de nuestra tradición directamente a su mesa.
            </p>
            {/* Sinpe Movil Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
              <span className="text-foliage font-bold text-lg">SINPE</span>
              <span className="text-gray-300 text-sm">Móvil Aceptado</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li><a href="#historia" className="text-gray-400 hover:text-white transition-colors">Nuestra Historia</a></li>
              <li><a href="#catalogo" className="text-gray-400 hover:text-white transition-colors">Catálogo de Productos</a></li>
              <li><a href="#ferias" className="text-gray-400 hover:text-white transition-colors">Ubicación en Ferias</a></li>
            </ul>
          </div>

          {/* Delivery & B2B */}
          <div className="md:col-span-1" id="b2b">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Servicios</h3>
            <ul className="space-y-3">
              <li className="text-gray-400">Entregas a domicilio locales programadas</li>
              <li className="text-gray-400 mt-4">
                <span className="block text-white font-medium mb-1">¿Tiene una Soda o Restaurante?</span>
                Ofrecemos precios preferenciales para mayoristas.
              </li>
              <li>
                <a 
                  href="https://wa.me/50688888888?text=Hola,%20tengo%20un%20negocio%20y%20me%20gustar%C3%ADa%20informaci%C3%B3n%20para%20mayoristas"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-block mt-2 text-terracotta hover:text-red-400 font-medium transition-colors"
                >
                  Solicitar catálogo B2B →
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Contacto Directo</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <span className="text-xl">📱</span>
                <div>
                  <span className="block text-white font-medium">WhatsApp Pedidos</span>
                  <a href="https://wa.me/50688888888" className="hover:text-terracotta transition-colors">+506 8888-8888</a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <span className="text-xl">✉️</span>
                <div>
                  <span className="block text-white font-medium">Correo Electrónico</span>
                  <a href="mailto:pedidos@lacentraldelqueso.cr" className="hover:text-terracotta transition-colors">pedidos@lacentraldelqueso.cr</a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} La Central del Queso / Quesos Doña Martha. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0">Orgullosamente Costarricense 🇨🇷</p>
        </div>
      </div>
    </footer>
  );
}
