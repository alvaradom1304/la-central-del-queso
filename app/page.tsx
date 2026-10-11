"use client";

import React from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import StorySection from "@/components/StorySection";
import ProductCatalog from "@/components/ProductCatalog";
import FeriaLocator from "@/components/FeriaLocator";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/CartContext";

const HaciendaWorld3D = dynamic(() => import("@/components/HaciendaWorld3D"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center text-white space-y-4">
      <div className="w-10 h-10 border-2 border-cheese border-t-transparent rounded-full animate-spin" />
      <span className="font-serif text-xl tracking-wider text-cheese">Cargando experiencia 3D de la hacienda...</span>
    </div>
  ),
});

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-cream flex flex-col font-sans selection:bg-cheese selection:text-forest">
        {/* Cabecera de Navegación Fija */}
        <Header />

        <main className="flex-grow">
          {/* Recorrido 3D Interactivo: Portón -> Apertura de Puertas -> Sendero -> Granero -> Cava 3D */}
          <HaciendaWorld3D>
            <ProductCatalog />
          </HaciendaWorld3D>

          {/* Historia Familiar & Verdad del Negocio */}
          <StorySection />

          {/* Ubicación Física en Ferias del Agricultor */}
          <FeriaLocator />
        </main>

        {/* Pie de Página */}
        <Footer />

        {/* Panel Desplegable de Pedido y Carrito */}
        <CartDrawer />
      </div>
    </CartProvider>
  );
}