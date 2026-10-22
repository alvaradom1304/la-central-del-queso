"use client";

import React, { useState, useMemo } from "react";
import { BUSINESS_PHONE } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Sparkles,
  Store,
  UtensilsCrossed,
  ArrowRight,
  Info,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { products, CATEGORIES, Product, USD_EXCHANGE_RATE } from "../lib/products";
import { useCart } from "../lib/CartContext";

export default function ProductCatalog() {
  const { addToCart, items, setIsCartOpen, currency, setCurrency, totalCRC, totalUSD, totalItemsCount } =
    useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedAnimation, setAddedAnimation] = useState<Record<string, boolean>>({});
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.presentation.toLowerCase().includes(q) ||
        product.idealUses.some((u) => u.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleQuantityChange = (id: string, delta: number) => {
    const current = quantities[id] || 1;
    const next = Math.max(1, current + delta);
    setQuantities((prev) => ({ ...prev, [id]: next }));
  };

  const handleAdd = (product: Product) => {
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);

    setAddedAnimation((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const formatPrice = (priceCRC: number) => {
    if (currency === "CRC") {
      return `₡${priceCRC.toLocaleString("es-CR")}`;
    }
    const usd = priceCRC / USD_EXCHANGE_RATE;
    return `$${usd.toFixed(2)} USD`;
  };

  const formatSecondaryPrice = (priceCRC: number) => {
    if (currency === "CRC") {
      const usd = priceCRC / USD_EXCHANGE_RATE;
      return `≈ $${usd.toFixed(2)} USD`;
    }
    return `≈ ₡${priceCRC.toLocaleString("es-CR")} CRC`;
  };

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-cream relative" id="catalogo">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera Editorial del Catálogo */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/5 border border-forest/10 text-terracotta text-2xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cheese" />
            <span>Nuestra Selección Artesanal</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-forest font-bold tracking-tight text-balance">
            Quesos de Verdad. <br />
            <span className="italic font-light text-forest/70">Sin atajos industriales.</span>
          </h2>

          <p className="text-forest/70 text-sm sm:text-base leading-relaxed font-light text-pretty">
            Seleccionados en Turrialba y llevados directamente a la feria cada semana. Consulte
            notas de cata, agregue a su canasta y arme su consulta para retiro o entrega.
          </p>

          {/* Selector de Moneda Centralizado */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="text-xs text-forest/60 font-medium">Ver precios en:</span>
            <div className="inline-flex items-center bg-forest/5 p-1 rounded-xl border border-forest/10">
              <button
                type="button"
                onClick={() => setCurrency("CRC")}
                className={`min-h-[36px] text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all duration-200 active:scale-[0.98] ${
                  currency === "CRC"
                    ? "bg-forest text-cream shadow-xs"
                    : "text-forest/70 hover:text-forest"
                }`}
              >
                Colones (₡ CRC)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`min-h-[36px] text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all duration-200 active:scale-[0.98] ${
                  currency === "USD"
                    ? "bg-forest text-cream shadow-xs"
                    : "text-forest/70 hover:text-forest"
                }`}
              >
                Dólares ($ USD)
              </button>
            </div>
            <span className="text-2xs text-forest/40 hidden sm:inline tabular-nums">
              (TC ref: ₡{USD_EXCHANGE_RATE} / $1)
            </span>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros de Categoría */}
        <div className="mb-12 space-y-6">
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-forest/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por queso, uso (freír, fundir, pinto)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[46px] bg-white border border-forest/15 rounded-2xl pl-11 pr-16 py-3 text-sm text-forest placeholder:text-forest/40 focus:outline-hidden focus:ring-2 focus:ring-terracotta/40 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-forest/50 hover:text-forest px-2 py-1 rounded-lg bg-forest/5"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Categorías como Pastillas Horizontales */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedCategory("Todos")}
              className={`min-h-[40px] text-xs sm:text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 active:scale-[0.98] ${
                selectedCategory === "Todos"
                  ? "bg-terracotta text-cream shadow-md shadow-terracotta/20 font-semibold"
                  : "bg-white text-forest/70 border border-forest/10 hover:border-forest/30 hover:text-forest"
              }`}
            >
              Todos los Quesos ({products.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[40px] text-xs sm:text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 active:scale-[0.98] ${
                    selectedCategory === cat
                      ? "bg-terracotta text-cream shadow-md shadow-terracotta/20 font-semibold"
                      : "bg-white text-forest/70 border border-forest/10 hover:border-forest/30 hover:text-forest"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Cuadrícula de Productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/60 rounded-3xl border border-forest/10 p-8 space-y-3">
            <Info className="w-8 h-8 text-forest/30 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-forest">
              No se encontraron productos
            </h3>
            <p className="text-sm text-forest/60 max-w-sm mx-auto">
              Intente con otro término de búsqueda o seleccione otra categoría.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Todos");
              }}
              className="mt-2 text-xs font-semibold text-terracotta hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const currentQty = quantities[product.id] || 1;
                const isAdded = addedAnimation[product.id];
                const isExpanded = expandedCardId === product.id;

                return (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    onMouseMove={(e) => {
                      const el = e.currentTarget;
                      const rect = el.getBoundingClientRect();
                      const px = (e.clientX - rect.left) / rect.width;
                      const py = (e.clientY - rect.top) / rect.height;
                      const rx = (0.5 - py) * 7;
                      const ry = (px - 0.5) * 9;
                      el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
                      el.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
                      el.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.transform =
                        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
                    }}
                    style={
                      {
                        "--glare-x": "50%",
                        "--glare-y": "50%",
                        transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms ease",
                        willChange: "transform",
                      } as React.CSSProperties
                    }
                    className={`group/card relative flex flex-col bg-white rounded-3xl overflow-hidden border hover:shadow-editorial ${
                      product.isHero
                        ? "border-terracotta/60 ring-2 ring-terracotta/15 shadow-md shadow-terracotta/5"
                        : "border-forest/10 shadow-xs"
                    }`}
                  >
                    {/* Reflejo Especular Dorado 3D que sigue al cursor */}
                    <div
                      className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "radial-gradient(420px circle at var(--glare-x) var(--glare-y), rgba(242,169,0,0.16), transparent 65%)",
                      }}
                    />

                    {/* Contenedor Visual de Producto */}
                    <div className="relative aspect-[16/11] bg-cream-dark/60 overflow-hidden group">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

                      {/* Badge Superior */}
                      {product.badge && (
                        <div className="absolute top-4 left-4 bg-terracotta text-cream text-2xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                          {product.badge}
                        </div>
                      )}

                      {/* Presentación en la base de la imagen */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-2xs text-cream font-medium">
                        <span className="bg-forest/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                          {product.presentation}
                        </span>
                        <span className="bg-forest/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                          Por {product.unit}
                        </span>
                      </div>
                    </div>

                    {/* Ficha Técnica y Detalles */}
                    <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="text-2xs font-bold uppercase tracking-widest text-terracotta block">
                          {product.category}
                        </span>

                        <h3 className="font-serif font-bold text-forest text-xl leading-snug">
                          {product.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-forest/75 font-light leading-relaxed">
                          {product.description}
                        </p>

                        {/* Chips de Usos Ideales */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {product.idealUses.map((use) => (
                            <span
                              key={use}
                              className="text-2xs bg-cream-dark/80 text-forest/80 px-2.5 py-0.5 rounded-full border border-forest/10 font-medium"
                            >
                              {use}
                            </span>
                          ))}
                        </div>

                        {/* Botón Desplegable de Notas de Cata & Perfil Sensorial */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedCardId(isExpanded ? null : product.id)
                          }
                          aria-expanded={isExpanded}
                          className="w-full flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-forest/65 hover:text-terracotta pt-2 transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta" />
                            <span>Ficha de Cata & Maridaje</span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-terracotta" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="p-3.5 mt-1 rounded-2xl bg-cream/90 border border-forest/10 space-y-2.5 text-2xs">
                                <div className="grid grid-cols-2 gap-2">
                                  {(
                                    [
                                      { label: "Firmeza", val: product.sensory.firmeza },
                                      { label: "Salinidad", val: product.sensory.salinidad },
                                      { label: "Fundición", val: product.sensory.fundicion },
                                      { label: "Intensidad", val: product.sensory.intensidad },
                                    ] as const
                                  ).map((s) => (
                                    <div key={s.label} className="space-y-1">
                                      <div className="flex justify-between text-forest/80 font-semibold">
                                        <span>{s.label}</span>
                                        <span className="tabular-nums text-terracotta">
                                          {s.val}/5
                                        </span>
                                      </div>
                                      <div className="h-1.5 bg-forest/10 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-terracotta rounded-full"
                                          style={{ width: `${(s.val / 5) * 100}%` }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <p className="text-forest/75 italic pt-1 border-t border-forest/10 leading-relaxed">
                                  “{product.pairingNote}”
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Bloque de Precio y Selector de Cantidad */}
                      <div className="pt-4 border-t border-forest/10 space-y-3">
                        <div className="flex items-baseline justify-between">
                          <div className="tabular-nums">
                            <span className="font-serif font-bold text-2xl text-forest block">
                              {formatPrice(product.priceCRC * currentQty)}
                            </span>
                            <span className="text-2xs text-forest/50 block">
                              {formatSecondaryPrice(product.priceCRC)} / {product.unit}
                            </span>
                          </div>

                          {/* Selector de Cantidad con Hit Targets >= 40px */}
                          <div className="flex items-center border border-forest/20 rounded-xl bg-cream/70 p-0.5">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, -1)}
                              className="min-w-[36px] min-h-[36px] flex items-center justify-center text-forest/60 hover:text-forest hover:bg-forest/10 rounded-lg transition-colors active:scale-95"
                              aria-label="Restar una unidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-forest min-w-[2rem] text-center tabular-nums">
                              {currentQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, 1)}
                              className="min-w-[36px] min-h-[36px] flex items-center justify-center text-forest/60 hover:text-forest hover:bg-forest/10 rounded-lg transition-colors active:scale-95"
                              aria-label="Sumar una unidad"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Botón de Agregar a la Canasta */}
                        <button
                          type="button"
                          onClick={() => handleAdd(product)}
                          className={`w-full min-h-[46px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                            isAdded
                              ? "bg-forest-light text-cream shadow-xs"
                              : product.isHero
                              ? "bg-terracotta text-cream hover:bg-terracotta-dark shadow-md shadow-terracotta/20"
                              : "bg-forest text-cream hover:bg-forest-light shadow-md shadow-forest/15"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4 text-cheese" />
                              <span>¡Agregado al pedido!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>
                                Agregar {currentQty > 1 ? `(${currentQty})` : ""} al Pedido
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Sección Especial B2B: Atención a Sodas, Restaurantes y Hoteles */}
        <div
          id="mayoristas"
          className="mt-20 bg-forest text-cream rounded-[2.5rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl shadow-forest/30 border border-forest-light/20"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cheese/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-3xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cheese text-2xs uppercase tracking-wider font-bold">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Canal Institucional & Gastronómico</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
              ¿Administra una Soda, Pizzería o Restaurante?
            </h3>

            <p className="text-cream/80 text-sm sm:text-base leading-relaxed font-light text-pretty">
              Abastecemos cocinas comerciales en San José con bloques enteros de Semiduro de
              Turrialba (2.5 kg y más). Garantizamos punto de sal consistente, excelente
              rendimiento en fundición y precio preferencial por volumen con entregas programadas.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/${BUSINESS_PHONE}?text=Hola,%20represento%20a%20un%20negocio%20gastron%C3%B3mico%20y%20deseo%20consultar%20precios%20por%20volumen%20de%20Queso%20Semiduro.`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] inline-flex items-center gap-2 bg-cheese text-forest px-6 py-3.5 rounded-2xl text-sm font-bold shadow-lg hover:bg-cheese-light transition-all duration-200 active:scale-[0.98]"
              >
                <Store className="w-4 h-4" />
                <span>Consultar Condiciones Mayoristas</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <span className="text-2xs sm:text-xs text-cream/60 italic">
                * Atención personalizada previa coordinación telefónica o WhatsApp.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA FLOTANTE PERSISTENTE DE CANASTA (Zero-Friction Checkout) */}
      <AnimatePresence>
        {totalItemsCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-4 inset-x-4 z-40 max-w-3xl mx-auto pointer-events-auto"
          >
            <div className="bg-forest/95 backdrop-blur-xl text-cream border border-white/15 rounded-2xl p-3.5 sm:px-6 sm:py-4 shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative w-11 h-11 rounded-xl bg-cheese text-forest flex items-center justify-center font-bold shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 bg-terracotta text-cream text-2xs font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow">
                    {totalItemsCount}
                  </span>
                </div>
                <div className="tabular-nums">
                  <span className="text-2xs uppercase tracking-wider text-cheese font-bold block">
                    Su Canasta de Feria
                  </span>
                  <div className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                    {currency === "CRC"
                      ? `₡${totalCRC.toLocaleString("es-CR")}`
                      : `$${totalUSD.toFixed(2)} USD`}
                    <span className="text-xs font-sans font-normal text-cream/65 ml-2 hidden sm:inline">
                      ({items.length} {items.length === 1 ? "variedad" : "variedades"})
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="min-h-[44px] bg-cheese hover:bg-cheese-light text-forest font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <span>Revisar y Pedir</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
