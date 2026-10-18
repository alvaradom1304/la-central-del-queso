"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowDown, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  ChevronRight, 
  ShieldCheck 
} from "lucide-react";
import { useCart } from "../lib/CartContext";

export default function HeroJourney() {
  const { setIsCartOpen } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const steps = [
    {
      id: "llegada",
      tag: "Capítulo 1 · El Origen",
      title: "El sabor del campo en su mesa",
      subtitle: "Tradición y cercanía desde 1980",
      description: "Más de cuatro décadas llevando a las familias costarricenses el verdadero sabor del queso artesanal. Cada amanecer honramos las raíces lecheras de nuestra tierra.",
      image: "/hero_finca.jpg",
      disclaimer: "Ambientación e ilustración del entorno campesino costarricense",
      cta: "Conocer el Legado"
    },
    {
      id: "legado",
      tag: "Capítulo 2 · La Familia",
      title: "El legado de nuestro padre",
      subtitle: "Continuado con amor por nuestra madre e hijos",
      description: "En 1980 nuestro padre comenzó este camino con una carreta de sueños y devoción por el buen queso. Hoy su esposa e hijos mantenemos intacta la promesa: honestidad, trato humano y queso sin atajos.",
      image: "/historia_queso.jpg",
      disclaimer: "Oficio artesanal familiar preservado generación tras generación",
      cta: "Descubrir el Semiduro"
    },
    {
      id: "producto",
      tag: "Capítulo 3 · Producto Insignia",
      title: "Semiduro de Turrialba",
      subtitle: "Seleccionado en origen, pieza por pieza",
      description: "Traído directamente de productores de Turrialba. Cuajado con leche fresca, pasta marfil compacta con micro-poros naturales y el punto de sal exacto que no compite con el sabor de la leche.",
      image: "/hero_queso.jpg",
      disclaimer: "Fotografía gastronómica del Semiduro Tradicional en tabla campesina",
      cta: "Ver en la Mesa"
    },
    {
      id: "mesa",
      tag: "Capítulo 4 · En su Mesa",
      title: "Dora, gratina y acompaña",
      subtitle: "El corazón del desayuno y la cena tica",
      description: "Firme al corte con cuchillo, sedoso al derretirse en la sartén sobre tortillas palmeadas, y el compañero imprescindible del gallo pinto caliente con café chorreado.",
      image: "/queso_catalogo.jpg",
      disclaimer: "Textura firme y punto de sal calibrado para cocina tradicional",
      cta: "Ir al Catálogo"
    }
  ];

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      const el = document.getElementById("catalogo");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  const current = steps[activeStep];

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen bg-cream flex flex-col justify-between pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decoración de fondo suave */}
      <div className="absolute top-0 right-0 w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-cheese/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] bg-terracotta/5 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Barra superior del Hero: Progreso del Recorrido & Saltar al Catálogo */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4 mb-8">
        {/* Pasos del recorrido */}
        <div className="flex items-center gap-2 sm:gap-3">
          {steps.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(index)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                activeStep === index
                  ? "w-8 sm:w-12 bg-terracotta"
                  : index < activeStep
                  ? "w-3 sm:w-4 bg-forest/40 hover:bg-forest/60"
                  : "w-3 sm:w-4 bg-forest/15 hover:bg-forest/30"
              }`}
              aria-label={`Ir al paso ${index + 1}: ${s.title}`}
            />
          ))}
          <span className="text-2xs sm:text-xs font-semibold text-forest/60 ml-2 hidden sm:inline">
            {activeStep + 1} de {steps.length}
          </span>
        </div>

        {/* Botón Permanente: Saltar al Catálogo */}
        <a
          href="#catalogo"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-forest/70 hover:text-terracotta transition-colors px-3 py-1.5 rounded-full border border-forest/15 hover:border-terracotta/40 bg-white/60 backdrop-blur-xs"
        >
          <span>Saltar al Catálogo</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Contenido Principal del Recorrido */}
      <div className="max-w-7xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        
        {/* Columna Izquierda: Narrativa Editorial */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* Badge del Capítulo */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 text-terracotta text-2xs sm:text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-cheese" />
                <span>{current.tag}</span>
              </div>

              {/* Titulares con tipografía responsive escalonada */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-forest font-bold tracking-tight leading-[1.1]">
                {current.title}
              </h1>

              <p className="text-lg sm:text-xl font-serif italic text-forest/70 font-normal">
                {current.subtitle}
              </p>

              {/* Descripción */}
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed font-light max-w-xl">
                {current.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Acciones del Paso */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center justify-center gap-2.5 bg-forest text-cream px-7 py-3.5 rounded-2xl text-sm font-semibold shadow-lg shadow-forest/20 hover:bg-forest-light hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>{current.cta}</span>
              <ChevronRight className="w-4 h-4 text-cheese" />
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-white text-forest border border-forest/15 px-5 py-3.5 rounded-2xl text-sm font-semibold hover:bg-cream-dark transition-all duration-200 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-terracotta" />
              <span>Hacer Pedido</span>
            </button>
          </div>

          {/* Micro credenciales de verdad de negocio */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-forest/10">
            <div className="flex items-center gap-2 text-2xs sm:text-xs text-forest/70 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
              <span>100% Leche Pura</span>
            </div>
            <div className="flex items-center gap-2 text-2xs sm:text-xs text-forest/70 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-forest shrink-0" />
              <span>Sin Químicos</span>
            </div>
            <div className="flex items-center gap-2 text-2xs sm:text-xs text-forest/70 font-medium">
              <Compass className="w-3.5 h-3.5 text-terracotta shrink-0" />
              <span>Ferias Guadalupe & Hatillo</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Fotograma Gastronómico de Estudio con Parallax Suave */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden bg-forest/5 border border-forest/10 shadow-2xl shadow-forest/15">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.image}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-black/10" />
              </motion.div>
            </AnimatePresence>

            {/* Disclaimer honesto en la parte inferior de la imagen */}
            <div className="absolute bottom-4 left-4 right-4 bg-forest/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-cream flex items-center justify-between text-2xs sm:text-xs">
              <span className="opacity-90 truncate mr-2">
                {current.disclaimer}
              </span>
              <span className="font-semibold text-cheese shrink-0">Desde 1980</span>
            </div>
          </div>
        </div>

      </div>

      {/* Flecha inferior sutil indicando el catálogo */}
      <div className="max-w-7xl mx-auto w-full pt-8 flex items-center justify-between">
        <span className="text-2xs text-forest/50">
          Atención en Ferias del Agricultor: Guadalupe (Sáb) · Hatillo (Dom)
        </span>
        <a
          href="#catalogo"
          className="inline-flex items-center gap-1.5 text-xs text-forest/60 hover:text-terracotta transition-colors group"
        >
          <span>Continuar hacia el catálogo</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Control de Audio Flotante No Intrusivo en la esquina inferior izquierda */}
      <div className="fixed bottom-6 left-6 z-30">
        <button
          type="button"
          onClick={toggleAudio}
          className="flex items-center gap-2 bg-cream/90 hover:bg-cream border border-forest/15 px-3 py-2 rounded-full text-2xs font-medium text-forest/70 hover:text-forest shadow-md backdrop-blur-md transition-all duration-200"
          title={isAudioPlaying ? "Silenciar ambiente" : "Activar sonido ambiental de la feria"}
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-terracotta animate-pulse" />
              <span className="hidden sm:inline">Ambiente: Activo</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-forest/50" />
              <span className="hidden sm:inline">Ambiente silenciado</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
