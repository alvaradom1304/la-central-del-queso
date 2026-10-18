"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Flame,
  Utensils,
  Wine,
  HeartPulse,
  Calculator,
  Compass,
  ShoppingBag,
  Check,
  Users,
  Scale,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { products, Product, USD_EXCHANGE_RATE } from "../lib/products";
import { useCart } from "../lib/CartContext";

interface OccasionOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  recommendedIds: string[];
  chefTip: string;
}

const OCCASIONS: OccasionOption[] = [
  {
    id: "freir-desayuno",
    title: "Asar al Sartén & Gallo Pinto",
    subtitle: "Que dore parejo por fuera y quede suave por dentro sin deshacerse.",
    icon: <Flame className="w-5 h-5" />,
    recommendedIds: ["semiduro-tradicional", "natilla-casera", "cuajada-criolla"],
    chefTip:
      "Para un dorado perfecto sin que suelte agua, corte el Semiduro de Turrialba en tajadas de 1.5 cm y dórelo en sartén bien caliente con una pizca de nuestra Mantequilla Lavada.",
  },
  {
    id: "fundir-gratinar",
    title: "Fundir, Pizzas & Empanadas",
    subtitle: "Hilos elásticos de leche pura y gratinado dorado al horno o comal.",
    icon: <Utensils className="w-5 h-5" />,
    recommendedIds: ["queso-palmito", "semiduro-tradicional", "bloque-b2b-semiduro"],
    chefTip:
      "Mezcle 60% Queso Palmito deshebrado a mano (para elasticidad) con 40% Semiduro rallado (para sabor y costra dorada).",
  },
  {
    id: "tablas-picada",
    title: "Tablas, Vinos & Tardes de Café",
    subtitle: "Quesos reposados en penumbra o ahumados en leña con carácter profundo.",
    icon: <Wine className="w-5 h-5" />,
    recommendedIds: ["maduro-reserva", "ahumado-lena", "queso-bagaces"],
    chefTip:
      "Saque el Queso Maduro Selección y el Ahumado en Leña del refrigerador 25 minutos antes de servir para que liberen todos sus aromas de mantequilla y madera.",
  },
  {
    id: "fresco-saludable",
    title: "Mesa Fresca & Bajo en Sodio",
    subtitle: "Suavidad de ordeño matutino para tortillas, ensaladas y dieta ligera.",
    icon: <HeartPulse className="w-5 h-5" />,
    recommendedIds: ["queso-tierno", "turrialba-artesanal", "mantequilla-lavada"],
    chefTip:
      "Nuestro Queso Tierno Bajo en Sal conserva toda la cremosidad de la cuajada fresca de Turrialba con una reducción natural de sodio.",
  },
];

export default function CheeseMatcher() {
  const { addToCart, currency, setIsCartOpen } = useCart();

  // Tab activa: "calculator" (Calculadora de Feria) | "sommelier" (Recomendador)
  const [activeTab, setActiveTab] = useState<"calculator" | "sommelier">("calculator");

  // Estado del Sommelier
  const [selectedOccasionId, setSelectedOccasionId] = useState<string>(OCCASIONS[0].id);
  const [activeRecIndex, setActiveRecIndex] = useState<number>(0);
  const [addedId, setAddedId] = useState<string | null>(null);

  // Estado de la Calculadora Familiar
  const [familySize, setFamilySize] = useState<number>(4);
  const [breakfastFrequency, setBreakfastFrequency] = useState<"finde" | "diario" | "eventos">(
    "diario"
  );
  const [includeNatilla, setIncludeNatilla] = useState<boolean>(true);
  const [includePalmito, setIncludePalmito] = useState<boolean>(true);
  const [bundleAdded, setBundleAdded] = useState<boolean>(false);

  const currentOccasion = useMemo(
    () => OCCASIONS.find((o) => o.id === selectedOccasionId) || OCCASIONS[0],
    [selectedOccasionId]
  );

  const recommendedProducts = useMemo(() => {
    return currentOccasion.recommendedIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [currentOccasion]);

  const activeProduct = recommendedProducts[activeRecIndex] || recommendedProducts[0];

  // Cálculo inteligente de la canasta semanal según personas y frecuencia
  const calculatedBundle = useMemo(() => {
    const freqMultiplier =
      breakfastFrequency === "finde" ? 0.22 : breakfastFrequency === "diario" ? 0.42 : 0.65;
    const rawKilos = Math.max(1, Math.round(familySize * freqMultiplier));

    const semiduroProduct = products.find((p) => p.id === "semiduro-tradicional")!;
    const palmitoProduct = products.find((p) => p.id === "queso-palmito")!;
    const natillaProduct = products.find((p) => p.id === "natilla-casera")!;

    const items: Array<{ product: Product; qty: number; reason: string }> = [
      {
        product: semiduroProduct,
        qty: rawKilos,
        reason: `${rawKilos} kg de Semiduro base para desayunos y cocina`,
      },
    ];

    if (includePalmito) {
      const palmitoQty = familySize >= 6 ? 2 : 1;
      items.push({
        product: palmitoProduct,
        qty: palmitoQty,
        reason: `${palmitoQty} rollo(s) de Palmito hilado para fundir y tardes de café`,
      });
    }

    if (includeNatilla) {
      const natillaQty = familySize >= 5 ? 2 : 1;
      items.push({
        product: natillaProduct,
        qty: natillaQty,
        reason: `${natillaQty} envase(s) de 500g de Natilla pura de rancho`,
      });
    }

    const totalCRC = items.reduce((acc, it) => acc + it.product.priceCRC * it.qty, 0);
    const totalWeightKg =
      rawKilos +
      (includePalmito ? (familySize >= 6 ? 1.0 : 0.5) : 0) +
      (includeNatilla ? (familySize >= 5 ? 1.0 : 0.5) : 0);

    const costPerPersonDay = Math.round(
      totalCRC / (familySize * (breakfastFrequency === "finde" ? 2 : 7))
    );

    return {
      items,
      totalCRC,
      totalUSD: totalCRC / USD_EXCHANGE_RATE,
      totalWeightKg,
      costPerPersonDay,
    };
  }, [familySize, breakfastFrequency, includeNatilla, includePalmito]);

  const formatMoney = (crc: number) => {
    if (currency === "CRC") {
      return `₡${crc.toLocaleString("es-CR")}`;
    }
    return `$${(crc / USD_EXCHANGE_RATE).toFixed(2)} USD`;
  };

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  const handleAddBundleToCart = () => {
    calculatedBundle.items.forEach((entry) => {
      addToCart(entry.product, entry.qty);
    });
    setBundleAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setBundleAdded(false), 2000);
  };

  return (
    <section
      id="calculadora-sommelier"
      className="py-24 sm:py-32 px-4 sm:px-8 bg-gradient-to-b from-[#0E1712] via-[#14100C] to-[#120E0A] border-t border-white/10 relative overflow-hidden"
    >
      {/* Resplandores cálidos de montaña y leña */}
      <div className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-[#DDA13E]/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#B85634]/10 blur-[110px]" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Encabezado y Selector de Herramienta Interactiva */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDA13E]/15 border border-[#DDA13E]/40 text-[#DDA13E] font-mono text-xs uppercase tracking-widest">
              <Calculator className="w-3.5 h-3.5" />
              <span>Herramientas Interactivas de Feria</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#F7F4EC] font-semibold tracking-tight leading-[1.05]">
              Calcule el abasto exacto de su hogar o descubra su queso ideal.
            </h2>
            <p className="text-[#F7F4EC]/75 text-sm sm:text-base font-light leading-relaxed">
              Ajuste el deslizador según cuántas personas comen en casa para armar su canasta
              semanal en segundos, o consulte a nuestro Sommelier Digital por ocasión de uso.
            </p>
          </div>

          {/* Conmutador de Modo Interactivo (Calculadora / Sommelier) */}
          <div
            role="tablist"
            aria-label="Herramientas interactivas de compra"
            className="inline-flex bg-[#0B120E] p-1.5 rounded-2xl border border-white/15 shadow-xl self-start lg:self-auto"
          >
            <button
              role="tab"
              aria-selected={activeTab === "calculator"}
              type="button"
              onClick={() => setActiveTab("calculator")}
              data-cursor="CALCULAR"
              className={`min-h-[46px] flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === "calculator"
                  ? "bg-[#DDA13E] text-[#0D1510] shadow-md"
                  : "text-[#F7F4EC]/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Calculadora Semanal de Feria</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "sommelier"}
              type="button"
              onClick={() => setActiveTab("sommelier")}
              data-cursor="SOMMELIER"
              className={`min-h-[46px] flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === "sommelier"
                  ? "bg-[#DDA13E] text-[#0D1510] shadow-md"
                  : "text-[#F7F4EC]/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Recomendador Sommelier</span>
            </button>
          </div>
        </div>

        {/* CONTENIDO INTERACTIVO */}
        <AnimatePresence mode="wait">
          {activeTab === "calculator" ? (
            <motion.div
              key="calculator-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Controles de la Calculadora (6 cols) */}
              <div className="lg:col-span-6 bg-[#1B130D] rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <div>
                    <span className="font-mono text-2xs font-bold uppercase tracking-widest text-[#DDA13E]">
                      Planificador Interactivo de Abasto
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-[#F7F4EC] mt-1">
                      ¿Cuántas personas comen en casa?
                    </h3>
                  </div>

                  {/* Control Deslizante de Tamaño Familiar */}
                  <div className="bg-black/35 p-5 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium text-[#F7F4EC]/90">
                        <Users className="w-4 h-4 text-[#DDA13E]" />
                        <span>Integrantes del hogar:</span>
                      </span>
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-[#DDA13E] tabular-nums">
                        {familySize} {familySize === 1 ? "persona" : "personas"}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={12}
                      value={familySize}
                      onChange={(e) => setFamilySize(Number(e.target.value))}
                      aria-label="Número de integrantes del hogar"
                      className="w-full accent-[#DDA13E] h-2 bg-white/15 rounded-lg cursor-pointer"
                    />

                    <div className="flex justify-between font-mono text-[11px] text-[#F7F4EC]/50 tabular-nums">
                      <span>1–2 (Pareja)</span>
                      <span>4–5 (Familia estándar)</span>
                      <span>8–12 (Casa grande)</span>
                    </div>
                  </div>

                  {/* Frecuencia de Consumo */}
                  <div className="space-y-2.5">
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#DDA13E]">
                      Ritmo de consumo en la semana:
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(
                        [
                          {
                            id: "finde",
                            label: "Fines de Semana",
                            desc: "Desayunos sabatinos",
                          },
                          {
                            id: "diario",
                            label: "Todos los Días",
                            desc: "Pinto, café y cenas",
                          },
                          {
                            id: "eventos",
                            label: "Muy Queseros",
                            desc: "Cocina + picadas",
                          },
                        ] as const
                      ).map((freq) => (
                        <button
                          key={freq.id}
                          type="button"
                          onClick={() => setBreakfastFrequency(freq.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all min-h-[68px] ${
                            breakfastFrequency === freq.id
                              ? "bg-[#DDA13E] text-[#0D1510] border-[#DDA13E] shadow-lg font-bold"
                              : "bg-black/30 text-[#F7F4EC] border-white/10 hover:border-white/30"
                          }`}
                        >
                          <span className="block text-xs font-bold">{freq.label}</span>
                          <span
                            className={`block text-[11px] mt-0.5 ${
                              breakfastFrequency === freq.id
                                ? "text-[#0D1510]/80"
                                : "text-[#F7F4EC]/55"
                            }`}
                          >
                            {freq.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Complementos de Rancho */}
                  <div className="space-y-2.5">
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#DDA13E]">
                      Incluir acompañamientos del rancho:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIncludePalmito(!includePalmito)}
                        className={`min-h-[48px] p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                          includePalmito
                            ? "bg-[#DDA13E]/15 border-[#DDA13E] text-[#F7F4EC]"
                            : "bg-black/25 border-white/10 text-[#F7F4EC]/55"
                        }`}
                      >
                        <span>+ Queso Palmito Hilado</span>
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center ${
                            includePalmito
                              ? "bg-[#DDA13E] text-[#0D1510]"
                              : "border border-white/20"
                          }`}
                        >
                          {includePalmito && <Check className="w-3.5 h-3.5" />}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIncludeNatilla(!includeNatilla)}
                        className={`min-h-[48px] p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all ${
                          includeNatilla
                            ? "bg-[#DDA13E]/15 border-[#DDA13E] text-[#F7F4EC]"
                            : "bg-black/25 border-white/10 text-[#F7F4EC]/55"
                        }`}
                      >
                        <span>+ Natilla Casera 500g</span>
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center ${
                            includeNatilla
                              ? "bg-[#DDA13E] text-[#0D1510]"
                              : "border border-white/20"
                          }`}
                        >
                          {includeNatilla && <Check className="w-3.5 h-3.5" />}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen de la Canasta Calculada en Vivo (6 cols) */}
              <div className="lg:col-span-6 bg-gradient-to-br from-[#122219] via-[#0E1913] to-[#0A120E] text-[#F7F4EC] rounded-3xl p-6 sm:p-8 border border-[#DDA13E]/40 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#DDA13E]/15 blur-3xl" />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between border-b border-white/15 pb-4">
                    <div>
                      <span className="font-mono text-2xs uppercase tracking-widest text-[#DDA13E] font-bold block">
                        Abasto Semanal Sugerido
                      </span>
                      <h4 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F7F4EC]">
                        Canasta a la Medida ({calculatedBundle.totalWeightKg.toFixed(1)} kg total)
                      </h4>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-[#DDA13E]/15 border border-[#DDA13E]/40 flex items-center justify-center text-[#DDA13E]">
                      <Scale className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Lista desglosada */}
                  <div className="space-y-3">
                    {calculatedBundle.items.map((entry) => (
                      <div
                        key={entry.product.id}
                        className="bg-black/35 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={entry.product.image}
                            alt={entry.product.name}
                            className="w-13 h-13 rounded-xl object-cover border border-[#DDA13E]/30 shrink-0"
                          />
                          <div>
                            <div className="font-serif font-semibold text-lg text-[#F7F4EC]">
                              {entry.qty}x {entry.product.name}
                            </div>
                            <div className="text-xs text-[#F7F4EC]/70 font-light">
                              {entry.reason}
                            </div>
                          </div>
                        </div>

                        <div className="text-right tabular-nums shrink-0">
                          <span className="font-mono font-bold text-[#DDA13E] text-base block">
                            {formatMoney(entry.product.priceCRC * entry.qty)}
                          </span>
                          <span className="font-mono text-[11px] text-[#F7F4EC]/50">
                            {entry.qty} {entry.product.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totales con Tabular Nums y Acción 1-Click */}
                <div className="pt-6 mt-6 border-t border-white/15 space-y-4 relative z-10">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-[#F7F4EC]/70 block">
                        Inversión Semanal Estimada:
                      </span>
                      <span className="font-mono text-xs text-[#DDA13E] tabular-nums">
                        ≈ ₡{calculatedBundle.costPerPersonDay.toLocaleString("es-CR")} por persona
                        al día
                      </span>
                    </div>
                    <div className="text-right tabular-nums">
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F4EC] block">
                        {formatMoney(calculatedBundle.totalCRC)}
                      </span>
                      <span className="font-mono text-2xs text-[#F7F4EC]/60">
                        {currency === "CRC"
                          ? `≈ $${calculatedBundle.totalUSD.toFixed(2)} USD`
                          : `≈ ₡${calculatedBundle.totalCRC.toLocaleString("es-CR")} CRC`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddBundleToCart}
                    data-cursor="CARGAR PACK"
                    className="w-full min-h-[52px] flex items-center justify-center gap-2.5 bg-[#DDA13E] text-[#0D1510] hover:bg-[#F0BA5C] font-bold py-3.5 px-6 rounded-2xl text-sm shadow-xl transition-all active:scale-[0.98]"
                  >
                    {bundleAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>¡Canasta Cargada en su Pedido!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Cargar Esta Canasta Completa en 1 Clic</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sommelier-panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Columna Izquierda: Selector de Ocasión (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="font-mono text-2xs font-bold uppercase tracking-widest text-[#DDA13E] block">
                    Paso 1 · ¿Cómo lo va a disfrutar hoy?
                  </span>

                  <div className="space-y-3">
                    {OCCASIONS.map((occ) => {
                      const isSelected = occ.id === selectedOccasionId;
                      return (
                        <button
                          key={occ.id}
                          type="button"
                          onClick={() => {
                            setSelectedOccasionId(occ.id);
                            setActiveRecIndex(0);
                          }}
                          className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                            isSelected
                              ? "bg-[#1B130D] text-[#F7F4EC] border-[#DDA13E] shadow-xl"
                              : "bg-[#0B120E]/80 text-[#F7F4EC]/80 border-white/10 hover:border-white/30"
                          }`}
                        >
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-[#DDA13E] text-[#0D1510]"
                                : "bg-white/5 text-[#DDA13E]"
                            }`}
                          >
                            {occ.icon}
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-serif font-semibold text-lg sm:text-xl leading-snug text-[#F7F4EC]">
                              {occ.title}
                            </h3>
                            <p className="text-xs leading-relaxed font-light text-[#F7F4EC]/70">
                              {occ.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Consejo de Cocina */}
                <div className="bg-[#DDA13E]/10 border border-[#DDA13E]/30 rounded-2xl p-4 sm:p-5 space-y-1.5">
                  <div className="font-mono text-2xs font-bold uppercase tracking-wider text-[#DDA13E] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Secreto de Feria</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#F7F4EC]/90 leading-relaxed italic font-serif">
                    “{currentOccasion.chefTip}”
                  </p>
                </div>
              </div>

              {/* Columna Derecha: Ficha Sensorial Interactiva y Producto Recomendado (7 cols) */}
              <div className="lg:col-span-7 bg-[#1B130D] rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col justify-between">
                {/* Selector de las 3 recomendaciones para esta ocasión */}
                <div className="p-4 sm:px-7 sm:pt-6 border-b border-white/10 bg-black/30 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-2xs uppercase tracking-widest text-[#DDA13E]">
                    Paso 2 · Seleccione entre nuestras {recommendedProducts.length} mejores opciones:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recommendedProducts.map((prod, idx) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => setActiveRecIndex(idx)}
                        className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          activeRecIndex === idx
                            ? "bg-[#DDA13E] text-[#0D1510] shadow-xs"
                            : "bg-white/5 text-[#F7F4EC]/75 border border-white/15 hover:text-white"
                        }`}
                      >
                        {idx === 0
                          ? `★ #1 Ideal: ${prod.name.split(" ")[1] || prod.name}`
                          : prod.name}
                      </button>
                    ))}
                  </div>
                </div>

                {activeProduct && (
                  <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center flex-1">
                    {/* Imagen con Badge y Presentación (5 cols) */}
                    <div className="md:col-span-5 relative aspect-[4/4] rounded-2xl overflow-hidden bg-black/40 border border-white/15 shadow-md">
                      <img
                        src={activeProduct.image}
                        alt={activeProduct.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      {activeProduct.badge && (
                        <span className="absolute top-3 left-3 bg-[#B85634] text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                          {activeProduct.badge}
                        </span>
                      )}
                      <div className="absolute bottom-3 left-3 right-3 text-[#F7F4EC]">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#DDA13E] font-bold block">
                          {activeProduct.presentation}
                        </span>
                        <span className="font-serif text-2xl font-bold tabular-nums">
                          {formatMoney(activeProduct.priceCRC)}{" "}
                          <span className="text-xs font-mono font-normal opacity-75">
                            / {activeProduct.unit}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Perfil Sensorial y Acción (7 cols) */}
                    <div className="md:col-span-7 space-y-5">
                      <div>
                        <span className="font-mono text-2xs font-bold uppercase tracking-widest text-[#DDA13E]">
                          {activeProduct.category}
                        </span>
                        <h3 className="font-serif text-3xl font-semibold text-[#F7F4EC] mt-0.5">
                          {activeProduct.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#F7F4EC]/75 font-light leading-relaxed mt-2">
                          {activeProduct.description}
                        </p>
                      </div>

                      {/* Barras Sensoriales Animadas */}
                      <div className="bg-black/35 p-4 rounded-2xl border border-white/10 space-y-2.5">
                        <div className="font-mono text-2xs font-bold uppercase tracking-wider text-[#DDA13E] flex items-center gap-1.5">
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Perfil de Cata Artesanal</span>
                        </div>

                        {(
                          [
                            { label: "Firmeza al Corte", val: activeProduct.sensory.firmeza },
                            { label: "Punto de Sal", val: activeProduct.sensory.salinidad },
                            {
                              label: "Capacidad de Fundición",
                              val: activeProduct.sensory.fundicion,
                            },
                            { label: "Intensidad Láctea", val: activeProduct.sensory.intensidad },
                          ] as const
                        ).map((stat) => (
                          <div key={stat.label} className="space-y-1">
                            <div className="flex justify-between text-xs text-[#F7F4EC]/85">
                              <span>{stat.label}</span>
                              <span className="font-mono font-bold text-[#DDA13E]">
                                {stat.val}/5
                              </span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(stat.val / 5) * 100}%` }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#B85634] to-[#DDA13E] rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Botón de Compra */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(activeProduct)}
                          className={`w-full min-h-[48px] flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-[0.98] ${
                            addedId === activeProduct.id
                              ? "bg-[#2E5C43] text-white"
                              : "bg-[#DDA13E] text-[#0D1510] hover:bg-[#F0BA5C]"
                          }`}
                        >
                          {addedId === activeProduct.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>¡Agregado a su Canasta!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>
                                Agregar al Pedido ({formatMoney(activeProduct.priceCRC)})
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
