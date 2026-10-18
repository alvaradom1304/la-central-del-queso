"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Clock,
  Heart,
  Award,
  MoveHorizontal,
  Sparkles,
  Flame,
  Droplets,
  Compass,
} from "lucide-react";

const HERITAGE_MILESTONES = [
  {
    year: "1980",
    era: "El Origen en la Montaña",
    title: "La primera ruta hacia Santa Cruz de Turrialba",
    story:
      "Nuestro padre emprendió el viaje semanal hacia las fincas de altura en las faldas del volcán, seleccionando hormas recién prensadas de leche entera cuando aún humeaban en los lienzos de algodón.",
    quote: "“Un buen queso se reconoce por el silencio de la madrugada en que fue cuajado.”",
  },
  {
    year: "1995",
    era: "Las Mañanas de Feria",
    title: "El punto de encuentro en Guadalupe y Hatillo",
    story:
      "Semana tras semana, el puesto familiar se convirtió en parada obligatoria para las familias josefinas que buscaban el semiduro que sí dora en el sartén y la natilla espesa de verdad.",
    quote: "“Cientos de familias nos conocen por nuestro nombre y nosotros conocemos el gusto de su mesa.”",
  },
  {
    year: "2012",
    era: "Guardianes del Oficio",
    title: "El liderazgo de nuestra madre y la selección de cava",
    story:
      "Con devoción inquebrantable, nuestra madre perfeccionó la afinación del Queso Ahumado en Leña y el Palmito hilado a mano, manteniendo intacto el estándar artesanal sin ceder a atajos industriales.",
    quote: "“La calidad no se negocia: cada pieza lleva la palabra de nuestra familia.”",
  },
  {
    year: "HOY",
    era: "Nueva Generación",
    title: "Tradición de 1980 con servicio directo a su mesa",
    story:
      "Hoy los hijos honramos el camino fundado por papá y custodiado por mamá, llevando la experiencia de la feria y la cava artesanal tanto a nuestros puestos tradicionales como a su hogar o restaurante.",
    quote: "“Cuatro décadas después, seguimos madrugando con el mismo orgullo.”",
  },
];

export default function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState<number>(52);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"comparador" | "legado">("comparador");
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState<number>(0);

  const updateSliderFromClientX = useCallback((clientX: number) => {
    const el = sliderContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rawPct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(rawPct, 6), 94));
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yImage = useTransform(scrollYProgress, [0, 1], ["-3%", "6%"]);

  const pillars = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Desde 1980",
      desc: "Más de 45 años de presencia ininterrumpida en las mañanas de feria de San José.",
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

  const activeMilestone = HERITAGE_MILESTONES[activeMilestoneIdx];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-cream-dark/50 border-t border-forest/10 overflow-hidden"
      id="historia"
    >
      {/* Auras cálidas editoriales */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-cheese/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-terracotta/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          {/* Lado Izquierdo: Comparador Interactivo 120 FPS (Día 1 vs Día 45) */}
          <div className="w-full lg:w-1/2 relative">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <button
                type="button"
                onClick={() => setViewMode("comparador")}
                data-cursor="COMPARAR"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "comparador"
                    ? "bg-forest text-cheese shadow-md"
                    : "bg-forest/10 text-forest/70 hover:bg-forest/15"
                }`}
              >
                <MoveHorizontal className="w-3.5 h-3.5" />
                Comparador de Maduración (Interactivo)
              </button>
              <button
                type="button"
                onClick={() => setViewMode("legado")}
                data-cursor="ARCHIVO"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "legado"
                    ? "bg-forest text-cheese shadow-md"
                    : "bg-forest/10 text-forest/70 hover:bg-forest/15"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Retrato de Finca
              </button>
            </div>

            <motion.div style={{ y: yImage }} className="relative z-10">
              {viewMode === "comparador" ? (
                <div
                  ref={sliderContainerRef}
                  data-cursor="DESLIZAR"
                  onPointerDown={(e) => {
                    setIsDraggingSlider(true);
                    e.currentTarget.setPointerCapture(e.pointerId);
                    updateSliderFromClientX(e.clientX);
                  }}
                  onPointerMove={(e) => {
                    if (!isDraggingSlider) return;
                    updateSliderFromClientX(e.clientX);
                  }}
                  onPointerUp={() => setIsDraggingSlider(false)}
                  onPointerCancel={() => setIsDraggingSlider(false)}
                  className="aspect-[4/5] max-w-lg mx-auto bg-forest rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-forest/20 border border-forest/15 select-none cursor-ew-resize touch-none"
                >
                  {/* CAPA BASE (DERECHA): Día 45 — Cava & Leña */}
                  <img
                    src="/queso_ahumado.jpg"
                    alt="Horma madurada 45 días y ahumada en leña de guayabo"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/30 pointer-events-none" />

                  <div className="absolute top-5 right-5 bg-black/75 backdrop-blur-md text-cream px-3.5 py-2 rounded-xl border border-cheese/30 text-right pointer-events-none">
                    <div className="flex items-center justify-end gap-1.5 text-cheese text-2xs uppercase tracking-widest font-bold">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Día 45 · Cava & Leña</span>
                    </div>
                    <p className="text-xs font-serif font-semibold mt-0.5">
                      Ahumado & Maduro Reserva
                    </p>
                    <p className="text-[10px] text-cream/70">
                      Corteza dorada · Notas de cedro y humo
                    </p>
                  </div>

                  {/* CAPA RECORTADA (IZQUIERDA): Día 1 — Ordeño & Hilado Fresco */}
                  <div
                    style={{
                      clipPath: `inset(0 ${(100 - sliderPos).toFixed(2)}% 0 0)`,
                      willChange: "clip-path",
                    }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <img
                      src="/queso_palmito.jpg"
                      alt="Queso Palmito recién hilado a mano Día 1"
                      draggable={false}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-black/25" />

                    <div className="absolute top-5 left-5 bg-forest/85 backdrop-blur-md text-cream px-3.5 py-2 rounded-xl border border-white/20 text-left">
                      <div className="flex items-center gap-1.5 text-cheese text-2xs uppercase tracking-widest font-bold">
                        <Droplets className="w-3.5 h-3.5" />
                        <span>Día 1 · Ordeño Matinal</span>
                      </div>
                      <p className="text-xs font-serif font-semibold mt-0.5">
                        Palmito & Cuajada Fresca
                      </p>
                      <p className="text-[10px] text-cream/75">
                        Hebra elástica · Leche tibia de Turrialba
                      </p>
                    </div>
                  </div>

                  {/* CORTINA DIVISORA */}
                  <div
                    style={{ left: `${sliderPos.toFixed(2)}%` }}
                    className="absolute top-0 bottom-0 w-0.5 bg-cheese shadow-[0_0_15px_rgba(243,198,95,0.9)] pointer-events-none"
                  >
                    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-cheese text-forest shadow-2xl border-2 border-white flex items-center justify-center">
                      <MoveHorizontal className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>

                  <div className="absolute bottom-5 inset-x-5 bg-black/70 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center justify-between text-cream pointer-events-none">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-cheese font-bold block">
                        Arrastre la cortina para comparar el tiempo
                      </span>
                      <span className="text-xs sm:text-sm font-serif">
                        {sliderPos > 50
                          ? "Predomina: Frescura láctea recién hilada (Día 1)"
                          : "Predomina: Maduración en cava y leña (Día 45)"}
                      </span>
                    </div>
                    <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-lg text-cheese font-bold">
                      {Math.round(sliderPos)}% / {Math.round(100 - sliderPos)}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/5] max-w-lg mx-auto bg-forest/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-forest/15 border border-forest/10">
                  <img
                    src="/entrada_lecheria_granero.jpg"
                    alt="Umbral de la lechería tradicional en Turrialba"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-transparent" />

                  <div className="absolute bottom-8 left-6 sm:left-8 bg-terracotta text-cream p-5 sm:p-6 rounded-2xl shadow-xl border border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-serif font-bold leading-none">
                        1980
                      </span>
                    </div>
                    <span className="block text-2xs sm:text-xs uppercase tracking-[0.2em] font-semibold mt-1 opacity-90">
                      Año de Fundación Familiar
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Lado Derecho: Manifiesto Editorial + Línea de Tiempo Interactiva por Décadas */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-10 bg-terracotta" />
              <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-terracotta uppercase">
                Crónica Familiar · 1980 — Presente
              </h2>
            </div>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-forest font-bold leading-[1.12] text-balance">
              Cuatro décadas de madrugada, palabra y buen queso.
            </h3>

            {/* Selector Interactivo de Épocas (Scrollytelling / Clickable Timeline) */}
            <div className="pt-2 space-y-4">
              <div className="grid grid-cols-4 gap-2 bg-forest/5 p-1.5 rounded-2xl border border-forest/10">
                {HERITAGE_MILESTONES.map((m, idx) => {
                  const active = idx === activeMilestoneIdx;
                  return (
                    <button
                      key={m.year}
                      type="button"
                      onClick={() => setActiveMilestoneIdx(idx)}
                      data-cursor={m.year}
                      className={`py-2.5 px-3 rounded-xl font-serif font-bold text-sm sm:text-base transition-all cursor-pointer ${
                        active
                          ? "bg-forest text-cheese shadow-md"
                          : "text-forest/65 hover:text-forest hover:bg-white/60"
                      }`}
                    >
                      {m.year}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMilestone.year}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                  className="bg-white p-6 rounded-3xl border border-forest/10 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xs uppercase tracking-[0.22em] text-terracotta font-bold flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      {activeMilestone.era}
                    </span>
                    <span className="font-serif font-bold text-xl text-forest/30">
                      {activeMilestone.year}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                    {activeMilestone.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-forest/80 font-light leading-relaxed">
                    {activeMilestone.story}
                  </p>

                  <p className="pt-2 border-t border-forest/10 font-serif italic text-sm text-terracotta">
                    {activeMilestone.quote}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Tres Pilares Fundamentales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 p-4 rounded-2xl border border-forest/10 space-y-2 shadow-xs hover:-translate-y-0.5 transition-transform"
                >
                  <div className="w-9 h-9 rounded-xl bg-forest/5 flex items-center justify-center text-terracotta">
                    {pillar.icon}
                  </div>
                  <h4 className="font-serif font-bold text-forest text-base">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-forest/70 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Firma y Sello de Casa */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-forest/10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-terracotta text-cream font-serif font-bold text-lg flex items-center justify-center italic shadow-md border-2 border-cheese/40">
                  LC
                </div>
                <div>
                  <p className="font-serif font-bold text-forest text-sm">
                    Familia La Central del Queso
                  </p>
                  <p className="text-2xs text-forest/55 uppercase tracking-wider">
                    Guadalupe (Sábados) · Hatillo (Domingos)
                  </p>
                </div>
              </div>

              <div className="text-2xs text-forest/60 italic bg-forest/5 px-3 py-1.5 rounded-lg border border-forest/5">
                * Tradición costarricense directa del productor a su mesa desde 1980.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
