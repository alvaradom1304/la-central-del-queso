import React, { Suspense } from "react";
import Header from "@/components/Header";
import StorySection from "@/components/StorySection";
import ProductCatalog from "@/components/ProductCatalog";
import FeriaLocator from "@/components/FeriaLocator";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center px-4 py-28 bg-cream border-b border-gray-100">
          <h1 className="text-5xl md:text-6xl font-serif text-terracotta mb-6 max-w-4xl leading-tight">
            La Central del Queso
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl text-gray-700 mb-10 leading-relaxed">
            La calidez de la feria, la frescura de nuestra tradición directamente en su mesa.
          </p>
          <a 
            href="#catalogo" 
            className="bg-foliage text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-green-700 transition-all hover:-translate-y-1"
          >
            Ver Catálogo y Hacer Pedido
          </a>
        </section>

        <StorySection />
        
        <Suspense fallback={<div className="py-16 text-center">Cargando catálogo...</div>}>
          <ProductCatalog />
        </Suspense>

        <FeriaLocator />
      </main>

      <Footer />
    </div>
  );
}