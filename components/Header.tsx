"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-cream/95 backdrop-blur-md border-b border-forest/10 py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <div className="flex-shrink-0 flex items-center group cursor-pointer">
            <span className="font-serif text-3xl text-forest font-bold tracking-tight group-hover:text-terracotta transition-colors">
              La Central
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-10 items-center">
            {["Nuestra Historia", "Quesos Artesanales", "Dónde Encontrarnos"].map((item, i) => (
              <a 
                key={i} 
                href={`#${item.split(' ')[0].toLowerCase()}`} 
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isScrolled ? "text-forest/80 hover:text-terracotta" : "text-forest hover:text-terracotta"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 bg-forest text-cream px-6 py-2.5 rounded-full font-medium shadow-lg shadow-forest/20 hover:bg-forest-light hover:-translate-y-0.5 transition-all duration-300">
              <ShoppingBag className="w-4 h-4" />
              <span>Hacer Pedido</span>
            </button>
            
            {/* Mobile menu toggle */}
            <button 
              className="md:hidden text-forest p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
