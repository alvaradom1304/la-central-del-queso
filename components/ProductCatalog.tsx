"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Check, 
  Sparkles, 
  Filter, 
  Store, 
  UtensilsCrossed, 
  ArrowRight,
  Info
} from "lucide-react";
import { products, CATEGORIES, Product, USD_EXCHANGE_RATE } from "../lib/products";
import { useCart } from "../lib/CartContext";

export default function ProductCatalog() {
  const { addToCart, items, setIsCartOpen, currency, setCurrency } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedAnimation, setAddedAnimation] = useState<Record<string, boolean>>({});

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.presentation.toLowerCase().includes(searchQuery.toLowerCase());
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
    
    // Feedback visual temporal
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
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-cream" id="catalogo">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera Editorial del Catálogo */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 border border-forest/10 text-terracotta text-2xs sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cheese" />
            <span>Nuestra Selección Artesanal</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-forest font-bold tracking-tight">
            Quesos de Verdad. <br />
            <span className="italic font-light text-forest/70">Sin atajos industriales.</span>
          </h2>

          <p className="text-forest/70 text-sm sm:text-base leading-relaxed font-light">
            Seleccionados en Turrialba y llevados directamente a la feria cada semana. 
            Consulte pesos, agregue a su canasta y arme su consulta para retiro o entrega.
          </p>

          {/* Selector de Moneda Centralizado */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="text-xs text-forest/60 font-medium">Ver precios en:</span>
            <div className="inline-flex items-center bg-forest/5 p-1 rounded-xl border border-forest/10">
              <button
                type="button"
                onClick={() => setCurrency("CRC")}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-200 ${
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
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-200 ${
                  currency === "USD"
                    ? "bg-forest text-cream shadow-xs"
                    : "text-forest/70 hover:text-forest"
                }`}
              >
                Dólares ($ USD)
              </button>
            </div>
            <span className="text-2xs text-forest/40 hidden sm:inline">
              (TC ref: ₡{USD_EXCHANGE_RATE} / $1)
            </span>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros de Categoría */}
        <div className="mb-12 space-y-6">
          {/* Buscador de Texto */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-forest/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por tipo de queso, presentación o receta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-forest/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-forest placeholder:text-forest/35 focus:outline-hidden focus:ring-2 focus:ring-terracotta/40 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-forest/40 hover:text-forest px-1.5 py-0.5 rounded"
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
              className={`text-xs sm:text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 ${
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
                  className={`text-xs sm:text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 ${
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
            <h3 className="font-serif text-xl font-bold text-forest">No se encontraron productos</h3>
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

                return (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                    className={`flex flex-col bg-white rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      product.isHero
                        ? "border-terracotta/60 ring-2 ring-terracotta/15 shadow-md shadow-terracotta/5"
                        : "border-forest/10 shadow-xs"
                    }`}
                  >
                    {/* Contenedor Visual de Producto */}
                    <div className="relative aspect-[16/11] bg-cream-dark/60 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      {/* Badge Superior */}
                      {product.badge && (
                        <div className="absolute top-4 left-4 bg-terracotta text-cream text-2xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                          {product.badge}
                        </div>
                      )}

                      {/* Presentación en la base de la imagen */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-2xs text-cream font-medium">
                        <span className="bg-forest/75 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                          {product.presentation}
                        </span>
                        <span className="bg-forest/75 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10">
                          Por {product.unit}
                        </span>
                      </div>
                    </div>

                    {/* Ficha Técnica y Detalles */}
                    <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-2xs font-bold uppercase tracking-widest text-terracotta block">
                          {product.category}
                        </span>

                        <h3 className="font-serif font-bold text-forest text-xl leading-snug">
                          {product.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-forest/75 font-light leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Bloque de Precio y Selector de Cantidad */}
                      <div className="pt-4 border-t border-forest/10 space-y-3">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="font-serif font-bold text-2xl text-forest block">
                              {formatPrice(product.priceCRC)}
                            </span>
                            <span className="text-2xs text-forest/50 block">
                              {formatSecondaryPrice(product.priceCRC)} / {product.unit}
                            </span>
                          </div>

                          {/* Selector de Cantidad rápido */}
                          <div className="flex items-center border border-forest/20 rounded-xl bg-cream/70 p-0.5">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, -1)}
                              className="p-1 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-lg transition-colors"
                              aria-label="Restar una unidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-forest min-w-[1.75rem] text-center">
                              {currentQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product.id, 1)}
                              className="p-1 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-lg transition-colors"
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
                          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            isAdded
                              ? "bg-forest-light text-cream shadow-xs"
                              : product.isHero
                              ? "bg-terracotta text-cream hover:bg-[#A33F2E] shadow-md shadow-terracotta/20 hover:-translate-y-0.5"
                              : "bg-forest text-cream hover:bg-forest-light shadow-md shadow-forest/15 hover:-translate-y-0.5"
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

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              ¿Administra una Soda, Pizzería o Restaurante?
            </h3>

            <p className="text-cream/80 text-sm sm:text-base leading-relaxed font-light">
              Abastecemos cocinas comerciales en San José con bloques enteros de Semiduro de Turrialba (2.5 kg y más). 
              Garantizamos punto de sal consistente, excelente rendimiento en fundición y precio preferencial por volumen 
              con entregas programadas.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/50688888888?text=Hola,%20represento%20a%20un%20negocio%20gastron%C3%B3mico%20y%20deseo%20consultar%20precios%20por%20volumen%20de%20Queso%20Semiduro."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-cheese text-forest px-6 py-3.5 rounded-2xl text-sm font-bold shadow-lg hover:bg-cheese-light transition-all duration-200"
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
    </section>
  );
}
