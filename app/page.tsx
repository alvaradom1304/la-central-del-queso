"use client";

import React, { Suspense } from "react";
import Header from "@/components/Header";
import HeroJourney from "@/components/HeroJourney";
import StorySection from "@/components/StorySection";
import ProductCatalog from "@/components/ProductCatalog";
import FeriaLocator from "@/components/FeriaLocator";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/CartContext";

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-cream flex flex-col font-sans selection:bg-cheese selection:text-forest">
        {/* Cabecera de Navegación Fija */}
        <Header />

        <main className="flex-grow">
          {/* 1. Recorrido Cinematográfico Editorial: Llegada -> Legado 1980 -> Semiduro Turrialba -> En Mesa */}
          <HeroJourney />

          {/* 2. Catálogo Comercial: Búsqueda, Filtros, Moneda Dual CRC/USD, Pedido */}
          <Suspense fallback={<div className="py-24 text-center text-forest font-serif text-2xl">Cargando selección de quesos...</div>}>
            <ProductCatalog />
          </Suspense>

          {/* 3. Historia Familiar & Verdad del Negocio */}
          <StorySection />

          {/* 4. Ubicación Física en Ferias del Agricultor */}
          <FeriaLocator />
        </main>

        {/* 5. Pie de Página */}
        <Footer />

        {/* 6. Panel Desplegable de Carrito / Pedido Preparado */}
        <CartDrawer />
      </div>
    </CartProvider>
  );
}