"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";
import { useCart } from "../lib/CartContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInWorld, setIsInWorld] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setIsCartOpen, totalItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const cat = document.getElementById("catalogo");
      if (cat) {
        const rect = cat.getBoundingClientRect();
        setIsInWorld(rect.top > 60);
      } else {
        setIsInWorld(window.scrollY < window.innerHeight * 3.5);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Recomendador", href: "#experiencias" },
    { label: "Catálogo", href: "#catalogo" },
    { label: "Pase de Cata Gratis", href: "#club-vip" },
    { label: "Tradición 1980", href: "#historia" },
    { label: "Ferias", href: "#ferias" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 z-40 w-full transition-all duration-300 ${
          isInWorld
            ? isScrolled
              ? "bg-black/50 backdrop-blur-md border-b border-white/10 py-3 shadow-lg"
              : "bg-transparent py-4 sm:py-5"
            : "bg-cream/95 backdrop-blur-md border-b border-forest/10 py-3 shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logotipo de Marca */}
            <a href="#" className="flex flex-col group cursor-pointer focus:outline-hidden">
              <span
                className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                  isInWorld ? "text-white group-hover:text-cheese" : "text-forest group-hover:text-terracotta"
                }`}
              >
                La Central del Queso
              </span>
              <span
                className={`text-2xs sm:text-xs tracking-[0.2em] uppercase font-semibold transition-colors ${
                  isInWorld ? "text-cheese" : "text-terracotta"
                }`}
              >
                Tradición Familiar desde 1980
              </span>
            </a>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium tracking-wide transition-colors py-1 relative group ${
                    isInWorld
                      ? "text-white/80 hover:text-cheese"
                      : "text-forest/80 hover:text-terracotta"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      isInWorld ? "bg-cheese" : "bg-terracotta"
                    }`}
                  ></span>
                </a>
              ))}
            </nav>

            {/* Acciones del Header */}
            <div className="flex items-center gap-3">
              {/* Botón Carrito / Hacer Pedido */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-md ${
                  isInWorld
                    ? "bg-cheese text-forest hover:bg-yellow-400 font-semibold"
                    : "bg-forest text-cream hover:bg-forest-light shadow-forest/20"
                } hover:-translate-y-0.5 active:translate-y-0`}
                aria-label={`Ver pedido (${totalItemsCount} productos)`}
              >
                <ShoppingBag className={`w-4 h-4 ${isInWorld ? "text-forest" : "text-cheese"}`} />
                <span className="hidden sm:inline">Hacer Pedido</span>
                {totalItemsCount > 0 && (
                  <span className="bg-terracotta text-cream text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center -mr-1">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Botón Menú Móvil */}
              <button
                type="button"
                className={`lg:hidden p-2 rounded-xl focus:outline-hidden transition-colors ${
                  isInWorld ? "text-white hover:bg-white/10" : "text-forest hover:bg-forest/5"
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Menú Móvil Desplegable */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[70px] z-30 bg-cream/98 backdrop-blur-lg border-b border-forest/10 p-6 shadow-xl lg:hidden"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-base font-serif text-forest py-2 border-b border-forest/5 hover:text-terracotta transition-colors"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-forest/40" />
                </a>
              ))}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-terracotta text-cream py-3 rounded-xl font-medium"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Revisar mi Pedido ({totalItemsCount})</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
