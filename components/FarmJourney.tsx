"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function FarmJourney({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // ======= FASES CINEMÁTICAS =======
  
  // 1. Textos iniciales desaparecen al empezar a bajar
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  // 2. El video (o fondo) hace un sutil zoom in y se oscurece lentamente
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);
  const bgOpacity = useTransform(scrollYProgress, [0.3, 0.6], [1, 0]); // Fade to black

  // 3. Título elegante "LA CAVA" aparece en la oscuridad y luego desaparece
  const titleOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
  const titleScale = useTransform(scrollYProgress, [0.55, 0.85], [0.9, 1.1]);

  // 4. Liberar la capa fija al final
  const overlayPointerEvents = useTransform(scrollYProgress, (v) => v > 0.9 ? "none" : "auto");
  const overlayOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

  return (
    <div className="relative bg-forest">
      
      {/* El Track de Scroll (300vh) */}
      <div ref={containerRef} className="h-[300vh] w-full absolute top-0 left-0"></div>

      {/* CORTINA CINEMATOGRÁFICA FIJA */}
      <motion.div 
        style={{ pointerEvents: overlayPointerEvents as any, opacity: overlayOpacity }}
        className="fixed inset-0 z-50 overflow-hidden bg-black flex items-center justify-center"
      >
        
        {/* === CAPA 1: FONDO ANIMADO CINEMÁTICO (Efecto Drone) === */}
        <motion.div 
          style={{ opacity: bgOpacity, scale: bgScale }}
          className="absolute inset-0 bg-black origin-center overflow-hidden"
        >
          {/* 
            Usamos la foto de alta resolución con una animación infinita (Ken Burns) 
            para simular el movimiento lento de un drone. Esto evita los bloqueos 
            de navegador que ponen la pantalla negra con los videos externos.
          */}
          <motion.img 
            src="/hero_finca.jpg" 
            alt="Finca"
            className="w-full h-full object-cover opacity-60"
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, -20, 0] 
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity,
              ease: "linear" 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/90"></div>
        </motion.div>

        {/* === CAPA 2: TEXTO HERO INICIAL === */}
        <motion.div 
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <span className="text-cheese font-medium tracking-[0.3em] uppercase text-sm mb-6 block drop-shadow-md">
            Un Viaje al Origen
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-cream mb-8 leading-[1.05] tracking-tight drop-shadow-lg">
            Camine con <br/> <span className="text-cheese-light italic">nosotros.</span>
          </h1>
          <p className="text-lg md:text-2xl text-cream/80 mb-16 max-w-2xl font-light drop-shadow-md">
            Haga scroll para descender a la cava.
          </p>
          <div className="animate-bounce w-px h-24 bg-gradient-to-b from-cheese to-transparent"></div>
        </motion.div>

        {/* === CAPA 3: TRANSICIÓN ELEGANTE (SIN PUERTAS DE CANVA) === */}
        <motion.div 
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <h2 className="text-5xl md:text-8xl font-serif text-cream tracking-[0.3em] font-light text-center drop-shadow-2xl">
            LA CAVA
          </h2>
        </motion.div>

      </motion.div>

      {/* 
        EL CONTENIDO REAL (CATÁLOGO)
        padding-top: 200vh para que al terminar la animación
        el catálogo aparezca ya posicionado.
      */}
      <div className="relative z-10 pt-[200vh]">
        {children}
      </div>

    </div>
  );
}
