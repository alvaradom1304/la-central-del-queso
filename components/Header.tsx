"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";
import { useCart } from "../lib/CartContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setIsCartOpen, totalItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Tradición Familiar", href: "#historia" },
    { label: "Nuestros Quesos", href: "#catalogo" },
    { label: "Puntos en Feria", href: "#ferias" },
    { label: "Sodas & Mayoristas", href: "#mayoristas" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-cream/95 backdrop-blur-md border-b border-forest/10 py-3 shadow-xs"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logotipo de Marca */}
            <a href="#" className="flex flex-col group cursor-pointer focus:outline-hidden">
              <span className="font-serif text-2xl sm:text-3xl text-forest font-bold tracking-tight group-hover:text-terracotta transition-colors">
                La Central del Queso
              </span>
              <span className="text-2xs sm:text-xs text-terracotta tracking-[0.2em] uppercase font-semibold">
                Tradición Familiar desde 1980
              </span>
            </a>

            {/* Navegación Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium tracking-wide text-forest/80 hover:text-terracotta transition-colors py-1 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* Acciones del Header */}
            <div className="flex items-center gap-3">
              {/* Botón Carrito / Hacer Pedido */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 bg-forest text-cream px-5 py-2.5 rounded-full text-sm font-medium shadow-md shadow-forest/20 hover:bg-forest-light hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                aria-label={`Ver pedido (${totalItemsCount} productos)`}
              >
                <ShoppingBag className="w-4 h-4 text-cheese" />
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
                className="lg:hidden text-forest p-2 rounded-xl hover:bg-forest/5 focus:outline-hidden"
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
