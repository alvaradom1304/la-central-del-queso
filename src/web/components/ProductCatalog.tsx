"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { products, CATEGORIES, Product } from "../lib/products";

export default function ProductCatalog() {
  const searchParams = useSearchParams();
  const [source, setSource] = useState<string>("direct_web");

  useEffect(() => {
    // Capture ?src= or ?utm_source=
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
  
  // Modal Form State
  const [customerName, setCustomerName] = useState("");
  const [pickupLocation, setPickupLocation] = useState<"Guadalupe" | "Hatillo" | "Delivery">("Guadalupe");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter products based on selected category
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
        customerName,
        customerPhone: "", // Optional, captured via WhatsApp anyway
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
        // Redirect to WhatsApp
        window.location.href = data.whatsappUrl;
      } else {
        alert("Hubo un error procesando su pedido. Por favor intente de nuevo.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión. Intente de nuevo.");
    } finally {
      setIsSubmitting(false);
      setSelectedProduct(null); // Close modal
    }
  };

  return (
    <section className="py-16 px-4 bg-[#faf9f6] max-w-7xl mx-auto" id="catalogo">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-terracotta mb-4">Nuestros Lácteos</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Calidad artesanal empacada al vacío. Seleccione el producto que desea y coordine su entrega fácilmente.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === tab
                ? "bg-foliage text-white shadow-md"
                : "bg-cream text-gray-700 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`flex flex-col bg-white rounded-2xl shadow-sm border ${
              product.isHero ? "border-terracotta/50 ring-1 ring-terracotta/20" : "border-gray-100"
            } overflow-hidden transition-all hover:shadow-md`}
          >
            {/* Visual Placeholder for Product */}
            <div className={`h-48 flex items-center justify-center relative ${product.isHero ? "bg-cream" : "bg-gray-50"}`}>
              {product.badge && (
                <span className="absolute top-4 right-4 bg-terracotta text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
              <span className="text-4xl">🧀</span>
            </div>

            {/* Product Details */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                {product.category}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow">{product.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div>
                  <span className="text-xl font-bold text-terracotta">
                    ₡{product.priceCRC.toLocaleString("es-CR")}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/ {product.unit}</span>
                </div>
                
                <button
                  onClick={() => setSelectedProduct(product)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    product.isHero
                      ? "bg-terracotta text-white hover:bg-red-600"
                      : "bg-foliage text-white hover:bg-green-700"
                  }`}
                >
                  Pedir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron productos en esta categoría.
        </div>
      )}

      {/* Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-2xl font-serif text-terracotta mb-2">Completar Pedido</h3>
            <p className="text-gray-600 mb-6 border-b border-gray-100 pb-4">
              <strong>{selectedProduct.name}</strong> a ₡{selectedProduct.priceCRC.toLocaleString("es-CR")} / {selectedProduct.unit}
            </p>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Su Nombre</label>
                <input 
                  type="text" 
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-foliage focus:border-foliage"
                  placeholder="Ej: María Rojas"
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-foliage focus:border-foliage"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Punto de Entrega</label>
                  <select 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-foliage focus:border-foliage"
                  >
                    <option value="Guadalupe">Feria Guadalupe</option>
                    <option value="Hatillo">Feria Hatillo</option>
                    <option value="Delivery">A Domicilio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas Opcionales</label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-foliage focus:border-foliage"
                  placeholder="Ej: Lo necesito rallado, paso a las 9am..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <div className="text-lg font-bold text-gray-900">
                  Total: ₡{(selectedProduct.priceCRC * quantity).toLocaleString("es-CR")}
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-foliage text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Procesando..." : "Ir a WhatsApp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
