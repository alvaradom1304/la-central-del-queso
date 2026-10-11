"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Heart, Award, MapPin, Truck, Sparkles } from "lucide-react";

export default function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yImage = useTransform(scrollYProgress, [0, 1], ["-6%", "12%"]);
  const opacityText = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  const pillars = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Desde 1980",
      desc: "Más de 44 años de presencia ininterrumpida en las mañanas de feria de San José.",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Origen Turrialba",
      desc: "Seleccionamos cada semana el mejor semiduro directamente de cuajadas tradicionales.",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Legado Familiar",
      desc: "El camino fundado por el padre, custodiado hoy por la madre y continuado con orgullo por los hijos.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-cream-dark/50 border-t border-forest/10 overflow-hidden"
      id="historia"
    >
      {/* Elementos decorativos */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-cheese/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-terracotta/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-20 relative z-10">
        
        {/* Lado de Imagen con Parallax Suave */}
        <div className="w-full lg:w-1/2 relative">
          <motion.div style={{ y: yImage }} className="relative z-10">
            <div className="aspect-[4/5] max-w-lg mx-auto bg-forest/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-forest/15 border border-forest/10">
              <img
                src="/historia_queso.jpg"
                alt="Elaboración tradicional del queso artesanal costarricense"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />

              {/* Badge del Legado de 1980 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute bottom-8 left-6 sm:left-8 bg-terracotta text-cream p-5 sm:p-6 rounded-2xl shadow-xl border border-white/10"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-serif font-bold leading-none">1980</span>
                </div>
                <span className="block text-2xs sm:text-xs uppercase tracking-[0.2em] font-semibold mt-1 opacity-90">
                  Año de Fundación Familiar
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Lado de Narrativa y Verdad de Negocio */}
        <motion.div style={{ opacity: opacityText }} className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-terracotta" />
            <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-terracotta uppercase">
              Nuestra Historia Real
            </h2>
          </div>

          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-forest font-bold leading-[1.15]">
            Cuatro décadas de madrugada, <br />
            <span className="italic font-light text-forest/70">palabra y buen queso.</span>
          </h3>

          <div className="space-y-4 text-forest/80 text-sm sm:text-base leading-relaxed font-light">
            <p>
              En 1980, nuestro padre comenzó a recorrer los pueblos lecheros de Turrialba buscando 
              lo que ninguna fábrica industrial podía producir: el queso semiduro auténtico, cuajado 
              con leche recién ordeñada y curado al viento fresco de las faldas del volcán.
            </p>
            <p>
              Con ese queso cargado en su vehículo llegaba cada fin de semana a las ferias del agricultor, 
              ganándose a pulso la confianza de las familias ticas cliente por cliente, saludo por saludo.
            </p>
            <p>
              Hoy, ese legado que él fundó sigue más vivo que nunca: nuestra madre continúa al frente 
              con la misma devoción inquebrantable, y sus hijos llevamos con orgullo el relevo de su nombre, 
              cuidando que cada pieza de queso mantenga la misma textura, el mismo corte y el mismo respeto por la tradición.
            </p>
          </div>

          {/* Tres Pilares Fundamentales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white/80 p-4 rounded-2xl border border-forest/10 space-y-2 shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-forest/5 flex items-center justify-center text-terracotta">
                  {pillar.icon}
                </div>
                <h4 className="font-serif font-bold text-forest text-base">{pillar.title}</h4>
                <p className="text-xs text-forest/70 leading-relaxed font-light">{pillar.desc}</p>
              </div>
            ))}
          </div>

          {/* Pie de historia con mención transparente a ferias */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-forest/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-forest text-cream font-serif font-bold text-lg flex items-center justify-center italic">
                LC
              </div>
              <div>
                <p className="font-serif font-bold text-forest text-sm">La Central del Queso</p>
                <p className="text-2xs text-forest/50 uppercase tracking-wider">
                  Guadalupe (Sábados) · Hatillo (Domingos)
                </p>
              </div>
            </div>

            <div className="text-2xs text-forest/60 italic bg-forest/5 px-3 py-1.5 rounded-lg border border-forest/5">
              * Nota de transparencia: Cualquier representación campestre es ambientación ilustrativa en homenaje a los lecheros de Turrialba.
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
