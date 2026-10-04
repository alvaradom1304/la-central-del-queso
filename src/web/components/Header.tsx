import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#faf9f6]/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="font-serif text-2xl text-terracotta font-bold">
              Doña Martha
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <a href="#historia" className="text-gray-700 hover:text-terracotta transition-colors font-medium">Nuestra Historia</a>
            <a href="#catalogo" className="text-gray-700 hover:text-terracotta transition-colors font-medium">Catálogo</a>
            <a href="#ferias" className="text-gray-700 hover:text-terracotta transition-colors font-medium">Ubicaciones</a>
            <a href="#b2b" className="text-gray-700 hover:text-terracotta transition-colors font-medium">Mayoristas</a>
          </nav>

          {/* WhatsApp CTA */}
          <div className="flex items-center">
            <a
              href="https://wa.me/50688888888"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foliage text-white px-5 py-2 rounded-full font-medium shadow-sm hover:bg-green-700 transition-colors hidden sm:inline-block"
            >
              Pedir por WhatsApp
            </a>
            
            {/* Mobile menu button (visual only for now) */}
            <div className="md:hidden ml-4 flex items-center">
              <button className="text-gray-700 hover:text-terracotta focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
