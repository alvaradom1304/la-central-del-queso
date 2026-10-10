"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Leaf, Droplets, Sun } from "lucide-react";

export default function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Capturar el progreso del scroll dentro de esta sección
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Efectos de Parallax y Transformación
  const yImage = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);
  const scaleImage = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);
  const opacityText = useTransform(scrollYProgress, [0.1, 0.3, 0.6], [0, 1, 1]);
  const yText = useTransform(scrollYProgress, [0.1, 0.3], [50, 0]);

  const features = [
    { icon: <Droplets className="w-5 h-5"/>, title: "Leche Pura", desc: "Ordeño diario sin aditivos industriales." },
    { icon: <Leaf className="w-5 h-5"/>, title: "100% Artesanal", desc: "Hilado a mano siguiendo la receta original." },
    { icon: <Sun className="w-5 h-5"/>, title: "Curado Natural", desc: "Maduración perfecta en el clima de Turrialba." }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 px-4 bg-white overflow-hidden" 
      id="nuestra-historia"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        
        {/* Lado de Imagen con Parallax (Scrollytelling visual) */}
        <div className="w-full lg:w-1/2 relative">
          <motion.div 
            style={{ y: yImage }}
            className="relative z-10"
          >
            <div className="aspect-[4/5] bg-cream-dark rounded-[2rem] overflow-hidden relative shadow-2xl shadow-forest/10 border border-forest/5">
              
              {/* Contenedor de la imagen que hace zoom inverso al hacer scroll */}
              <motion.div 
                style={{ scale: scaleImage }}
                className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center"
              >
                <img src="/historia_queso.jpg" alt="Manos elaborando queso artesanal" className="w-full h-full object-cover" />
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent mix-blend-multiply"></div>
              
              {/* Badge Flotante (Años de Tradición) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                viewport={{ once: true, margin: "-100px" }}
                className="absolute bottom-10 left-[-20px] bg-terracotta text-cream p-6 rounded-2xl shadow-2xl backdrop-blur-md"
              >
                <span className="block text-5xl font-serif leading-none mb-1">+30</span>
                <span className="block text-xs uppercase tracking-[0.2em] font-bold opacity-90">Años de Legado</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Elemento decorativo de fondo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cheese/5 rounded-full blur-3xl -z-10"></div>
        </div>
        
        {/* Lado de Texto con aparición progresiva (Scrollytelling narrativo) */}
        <motion.div 
          style={{ opacity: opacityText, y: yText }}
          className="w-full lg:w-1/2"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-terracotta"></div>
            <h2 className="text-sm font-bold tracking-widest text-terracotta uppercase">Nuestras Raíces</h2>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-serif text-forest mb-8 leading-[1.15]">
            De nuestras manos a su mesa, <span className="italic text-forest/70 font-light">sin atajos.</span>
          </h3>
          
          <div className="space-y-6 text-lg text-forest/70 leading-relaxed font-light mb-12">
            <p>
              Por más de tres décadas, nuestra familia se ha levantado de madrugada para cuidar la leche 
              más fresca y transformarla en los quesos artesanales que usted conoce y en los que confía. 
            </p>
            <p>
              No creemos en procesos industriales masivos ni en alterar los sabores con químicos. 
              Creemos en el <strong className="text-forest font-medium">trato humano</strong>, en el queso hilado a mano, y en el sabor a campo 
              que solo se logra cuando las cosas se hacen con paciencia.
            </p>
          </div>

          {/* Features animadas escalonadamente */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                viewport={{ once: true }}
                className="flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center text-terracotta">
                  {feature.icon}
                </div>
                <h4 className="font-serif text-forest font-bold text-lg">{feature.title}</h4>
                <p className="text-sm text-forest/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Firma */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-5 border-t border-forest/10 pt-8"
          >
            <div className="h-16 w-16 bg-cream rounded-full flex items-center justify-center text-forest text-2xl font-serif font-bold italic border border-forest/5">
              M
            </div>
            <div>
              <p className="font-bold text-forest text-lg">Familia Doña Martha</p>
              <p className="text-forest/50 text-sm tracking-wide">FUNDADORES, TURRIALBA</p>
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
}
