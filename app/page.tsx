"use client";

import React, { Suspense } from "react";
import Header from "@/components/Header";
import StorySection from "@/components/StorySection";
import ProductCatalog from "@/components/ProductCatalog";
import FeriaLocator from "@/components/FeriaLocator";
import Footer from "@/components/Footer";
import FarmJourney from "@/components/FarmJourney";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans selection:bg-cheese selection:text-forest">
      <Header />
      
      <main className="flex-grow">
        
        {/* El Viaje Inmersivo: Zoom a la Finca -> Puertas -> Catálogo */}
        <FarmJourney>
          <div className="pt-24 pb-12">
            <Suspense fallback={<div className="py-24 text-center text-cream font-serif text-2xl">Preparando la cava...</div>}>
              <ProductCatalog />
            </Suspense>
          </div>
        </FarmJourney>

        {/* Las secciones posteriores continúan el flujo normal de la página */}
        <div className="relative z-50 bg-cream">
          <StorySection />
          <FeriaLocator />
        </div>
      </main>

      <Footer />
    </div>
  );
}