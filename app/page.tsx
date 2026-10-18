"use client";

import React from "react";
import dynamic from "next/dynamic";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CheeseMatcher from "@/components/CheeseMatcher";
import VipTastingPass from "@/components/VipTastingPass";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import {
  BrandAmbientIdentity,
  KineticBrandMarquee,
  ArtisanalCrestDivider,
} from "@/components/BrandArtDirection";
import { InteractiveArtisanalPhysics } from "@/components/InteractiveArtisanalPhysics";
import { CartProvider } from "@/lib/CartContext";

const FincaToTableExperience = dynamic(
  () => import("@/components/FincaToTableExperience"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen w-full bg-[#0D1510] flex flex-col items-center justify-center text-[#F7F4EC] space-y-4 px-4 text-center">
        <div className="w-10 h-10 border-2 border-[#DDA13E] border-t-transparent rounded-full animate-spin" />
        <span className="font-serif italic text-2xl tracking-wide text-[#DDA13E]">
          Abriendo el portón de Finca Doña Martha...
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#F7F4EC]/60">
          La Central del Queso · De la Finca a tu Mesa · 1980
        </span>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <CartProvider>
      <SmoothScrollProvider>
        <div className="min-h-screen bg-[#0D1510] text-[#F7F4EC] flex flex-col font-sans selection:bg-[#DDA13E] selection:text-[#0D1510]">
          {/* Cursor Magnético de Galería + Hilo de Oro de Progreso + Grano Cinematográfico */}
          <BrandAmbientIdentity />

          <main className="flex-grow">
            {/* Viaje en 7 Escenas: Portón Finca Doña Martha -> Camino -> Lechería -> Cava -> La Mesa Viva -> Alacena -> Legado & B2B */}
            <FincaToTableExperience />

            {/* Cinta Cinética Reactiva al Scroll */}
            <KineticBrandMarquee
              theme="dark"
              baseVelocity={-2.0}
              items={[
                "FINCA DOÑA MARTHA · TURRIALBA 1.220 M S.N.M.",
                "ORDEÑO MATINAL DE PASTOREO LIBRE",
                "CAVA DE ROBLE Y HUMO DE GUAYABO",
                "LA CENTRAL DEL QUESO · DESDE 1980",
              ]}
            />

            {/* Calculadora Interactiva de Feria + Recomendador Sommelier en la nueva paleta */}
            <CheeseMatcher />

            {/* Emblema Heráldico Editorial */}
            <ArtisanalCrestDivider
              subtitle="Maestría Quesera Costarricense"
              title="Cada horma guarda la niebla del volcán y el calor de las manos que la hilaron."
            />

            {/* Mesa Lúdica Interactiva: Físicas 2D a 120 FPS (Agarrar, lanzar y soltar nuevas hormas) */}
            <section className="py-16 px-4 sm:px-8 bg-[#0D1510] border-t border-white/10">
              <div className="max-w-5xl mx-auto">
                <InteractiveArtisanalPhysics />
              </div>
            </section>

            {/* Cinta Cinética en Madera y Terracota */}
            <KineticBrandMarquee
              theme="terracotta"
              baseVelocity={2.2}
              items={[
                "CATA GRATIS EN FERIA DE GUADALUPE Y HATILLO",
                "SIN ALMIDONES NI GRASAS VEGETALES",
                "QUESO QUE SÍ DORA EN EL SARTÉN",
                "PEDIDOS DIRECTOS Y MAYORISTAS B2B",
              ]}
            />

            {/* Generador Interactivo en Vivo de Pase VIP de Cata Gratis + Club El Quesero Fiel */}
            <VipTastingPass />
          </main>

          <Footer />
          <CartDrawer />
        </div>
      </SmoothScrollProvider>
    </CartProvider>
  );
}