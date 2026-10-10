"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Info, ChevronDown } from "lucide-react";
import { products, CATEGORIES, Product } from "../lib/products";

export default function ProductCatalog() {
  const searchParams = useSearchParams();
  const [source, setSource] = useState<string>("direct_web");

  useEffect(() => {
    const utmSource = searchParams.get("utm_source");
    const srcParam = searchParams.get("src");
    const detectedSource = utmSource || srcParam;
    
    if (detectedSource) {
      setSource(detectedSource);
      sessionStorage.setItem("acquisition_source", detectedSource);
    } else {
      const storedSource = sessionStorage.getItem("acquisition_source");
      if (storedSource) setSource(storedSource);
    }
  }, [searchParams]);

  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [customerName, setCustomerName] = useState("");
  const [pickupLocation, setPickupLocation] = useState<"Guadalupe" | "Hatillo" | "Delivery">("Guadalupe");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProducts = products.filter((product) => {
    if (activeCategory === "Todos") return true;
    return product.category === activeCategory;
  });

  const tabs = ["Todos", ...CATEGORIES];

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !customerName) return;

    setIsSubmitting(true);
    
    try {
      const payload = {
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        customerName,
        customerPhone: "",
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity,
        unit: selectedProduct.unit,
        totalPriceCRC: selectedProduct.priceCRC * quantity,
        pickupLocation,
        notes,
        source
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.whatsappUrl) {
        window.location.href = data.whatsappUrl;
      } else {
        alert("Hubo un error procesando su pedido. Por favor intente de nuevo.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión. Intente de nuevo.");
    } finally {
      setIsSubmitting(false);
      setSelectedProduct(null);
    }
  };

  return (
    <section className="py-32 px-4 bg-forest relative overflow-hidden" id="catalogo">
      {/* Elementos decorativos de la cava */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cream to-transparent opacity-10 pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cheese/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-20">
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: 60 }}
            viewport={{ once: true }}
            className="w-px bg-cheese mx-auto mb-8"
          ></motion.div>
          
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-cheese text-sm font-semibold tracking-[0.3em] uppercase mb-4 block"
          >
            La Cava de Doña Martha
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-serif text-cream mb-6"
          >
            El final del recorrido. <br/> <span className="italic font-light text-cream/70">Su recompensa.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-cream/50 max-w-2xl mx-auto text-lg font-light"
          >
            Nuestros quesos han alcanzado su punto perfecto. Seleccione sus favoritos para que se los llevemos directamente de la finca a su casa.
          </motion.p>
        </div>

        {/* Category Filters (Modo Oscuro) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === tab
                  ? "bg-cheese text-forest shadow-[0_0_20px_rgba(242,169,0,0.2)]"
                  : "bg-transparent text-cream/70 border border-cream/20 hover:border-cheese/50 hover:text-cheese"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05, type: "spring", stiffness: 100 }}
                key={product.id}
                className={`group flex flex-col bg-cream rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border ${
                  product.isHero ? "border-terracotta ring-2 ring-terracotta/20 shadow-[0_0_30px_rgba(192,80,61,0.2)]" : "border-cream-dark"
                }`}
              >
                {/* Visual Placeholder for Product */}
                <div className={`h-64 flex flex-col items-center justify-center relative overflow-hidden bg-stone-100`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
                  
                  {/* Imagen del queso */}
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 z-0">
                    <img src="/queso_catalogo.jpg" alt={product.name} className="w-full h-full object-cover" />
                  </div>

                  {product.badge && (
                    <span className="absolute top-5 right-5 bg-terracotta text-cream text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-20">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-8 flex flex-col flex-grow bg-cream z-10 relative">
                  <div className="text-xs text-terracotta font-bold uppercase tracking-[0.15em] mb-3">
                    {product.category}
                  </div>
                  <h3 className="text-2xl font-serif text-forest mb-3 leading-snug">{product.name}</h3>
                  <p className="text-forest/70 text-sm mb-8 flex-grow leading-relaxed font-light">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-forest/10">
                    <div>
                      <span className="text-2xl font-bold text-forest">
                        ₡{product.priceCRC.toLocaleString("es-CR")}
                      </span>
                      <span className="text-forest/50 text-xs uppercase tracking-wider ml-1">/ {product.unit}</span>
                    </div>
                    
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                        product.isHero
                          ? "bg-terracotta text-cream hover:bg-[#A33F2E] hover:shadow-lg hover:shadow-terracotta/30"
                          : "bg-forest text-cream hover:bg-forest-light hover:shadow-lg hover:shadow-forest/30"
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Agregar</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-cream/50">
            No se encontraron productos en esta categoría.
          </div>
        )}

        {/* Modal de Pedido Mantiene la elegancia */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="absolute inset-0 bg-forest/80 backdrop-blur-md"
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="bg-cream rounded-3xl w-full max-w-lg p-8 shadow-2xl relative z-10 border border-cream-dark"
              >
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 right-6 text-forest/40 hover:text-terracotta transition-colors p-2 rounded-full hover:bg-white"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="mb-8">
                  <span className="text-terracotta text-sm font-bold tracking-widest uppercase mb-2 block">
                    Confirmar Selección
                  </span>
                  <h3 className="text-3xl font-serif text-forest mb-2">{selectedProduct.name}</h3>
                  <p className="text-forest/70 font-medium">
                    ₡{selectedProduct.priceCRC.toLocaleString("es-CR")} <span className="font-light">/ {selectedProduct.unit}</span>
                  </p>
                </div>

                <form onSubmit={handleOrderSubmit} className="space-y-5">
                  {/* ... Inputs del form ... (se mantienen iguales visualmente, pero asegurando contrastes) */}
                  <div>
                    <label className="block text-sm font-medium text-forest mb-2">Su Nombre Completo</label>
                    <input 
                      type="text" 
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-terracotta/50 shadow-sm text-forest placeholder:text-forest/30"
                      placeholder="Ej: María Rojas"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-1/3">
                      <label className="block text-sm font-medium text-forest mb-2">Cantidad</label>
                      <input 
                        type="number" 
                        min="1"
                        required
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-terracotta/50 shadow-sm text-forest"
                      />
                    </div>
                    <div className="w-full sm:w-2/3">
                      <label className="block text-sm font-medium text-forest mb-2">Punto de Entrega</label>
                      <select 
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value as any)}
                        className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-terracotta/50 shadow-sm text-forest"
                      >
                        <option value="Guadalupe">Feria Guadalupe (Sábado)</option>
                        <option value="Hatillo">Feria Hatillo (Domingo)</option>
                        <option value="Delivery">A Domicilio (Ruta GAM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest mb-2">Notas Opcionales</label>
                    <textarea 
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-terracotta/50 shadow-sm text-forest resize-none placeholder:text-forest/30"
                      placeholder="Ej: Lo necesito rallado, paso a las 9am..."
                    ></textarea>
                  </div>

                  <div className="pt-6 mt-6 flex justify-between items-center border-t border-forest/10">
                    <div>
                      <span className="block text-xs text-forest/50 uppercase tracking-widest mb-1">Total a Pagar</span>
                      <div className="text-2xl font-bold text-forest">
                        ₡{(selectedProduct.priceCRC * quantity).toLocaleString("es-CR")}
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-forest text-cream px-8 py-4 rounded-xl font-medium shadow-xl shadow-forest/20 hover:bg-forest-light disabled:opacity-50 transition-all hover:-translate-y-1"
                    >
                      {isSubmitting ? "Procesando..." : "Enviar a WhatsApp"}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 text-xs text-forest/50 justify-center">
                    <Info className="w-3 h-3" />
                    <span>Pagará en efectivo o SINPE al momento de la entrega.</span>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
