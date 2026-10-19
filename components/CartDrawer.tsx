"use client";

import React, { useState, useEffect, useRef } from "react";
import { BUSINESS_PHONE } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useCart } from "../lib/CartContext";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    currency,
    setCurrency,
    totalCRC,
    totalUSD,
    totalItemsCount
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [pickupLocation, setPickupLocation] = useState<string>("Feria Guadalupe (Sábados)");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"review" | "form">("review");

  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Diálogo modal: foco dentro al abrir, atrapado con Tab, devuelto al cerrar; Escape cierra.
  useEffect(() => {
    if (!isCartOpen) return;
    const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }, 30);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const inside = panelRef.current.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const returnTo = returnFocusRef;
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      returnTo.current?.focus?.();
    };
  }, [isCartOpen, setIsCartOpen]);

  const generateWhatsAppMessage = () => {
    let msg = `🧀 *CONSULTA DE PEDIDO — LA CENTRAL DEL QUESO*\n`;
    msg += `----------------------------------------\n`;
    if (customerName.trim()) {
      msg += `👤 *Cliente:* ${customerName.trim()}\n`;
    }
    msg += `📍 *Punto deseado:* ${pickupLocation}\n\n`;
    msg += `📦 *Detalle del Pedido:*\n`;

    items.forEach((item) => {
      const itemTotalCRC = item.product.priceCRC * item.quantity;
      msg += ` • ${item.quantity}x ${item.product.name} (${item.product.unit})\n`;
      msg += `   └ Subtotal: ₡${itemTotalCRC.toLocaleString("es-CR")}\n`;
    });

    msg += `\n💰 *Total Estimado:* ₡${totalCRC.toLocaleString("es-CR")} (~$${totalUSD.toFixed(2)} USD)\n`;
    
    if (notes.trim()) {
      msg += `📝 *Observaciones:* ${notes.trim()}\n`;
    }

    msg += `----------------------------------------\n`;
    msg += `_Consulta enviada desde la web oficial. Por favor confirmar disponibilidad de lote para la feria._`;

    return encodeURIComponent(msg);
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Por favor ingrese su nombre para personalizar su pedido.");
      return;
    }
    const phone = BUSINESS_PHONE;
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden" role="dialog" aria-modal="true" aria-label="Carrito de compras">
          {/* Backdrop con desenfoque suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-forest/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              ref={panelRef}
              className="w-screen max-w-md bg-cream text-forest flex flex-col shadow-2xl border-l border-forest/10"
            >
              {/* Header del Drawer */}
              <div className="p-6 border-b border-forest/10 flex items-center justify-between bg-white/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center text-forest">
                    <ShoppingBag className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-forest">Mi Pedido</h2>
                    <p className="text-xs text-forest/60">
                      {totalItemsCount} {totalItemsCount === 1 ? "artículo seleccionado" : "artículos seleccionados"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Selector rápido de moneda CRC / USD */}
                  <div className="flex items-center bg-forest/5 rounded-lg p-0.5 border border-forest/10">
                    <button
                      type="button"
                      onClick={() => setCurrency("CRC")}
                      className={`text-xs px-2 py-1 rounded font-semibold transition-colors ${
                        currency === "CRC" ? "bg-forest text-cream shadow-xs" : "text-forest/70 hover:text-forest"
                      }`}
                    >
                      ₡ CRC
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("USD")}
                      className={`text-xs px-2 py-1 rounded font-semibold transition-colors ${
                        currency === "USD" ? "bg-forest text-cream shadow-xs" : "text-forest/70 hover:text-forest"
                      }`}
                    >
                      $ USD
                    </button>
                  </div>

                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-forest/40 hover:text-forest hover:bg-forest/5 rounded-full transition-colors"
                    aria-label="Cerrar pedido"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contenido del Carrito */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-forest/5 flex items-center justify-center text-forest/30">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="font-serif text-2xl text-forest">Su canasta está vacía</h3>
                    <p className="text-sm text-forest/60 max-w-xs">
                      Explore nuestro catálogo y seleccione los quesos tradicionales para armar su pedido.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-6 py-2.5 bg-forest text-cream rounded-full text-sm font-medium hover:bg-forest-light transition-colors"
                    >
                      Explorar Catálogo
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Lista de productos */}
                    <div className="space-y-3">
                      {items.map((item) => {
                        const itemPrice =
                          currency === "CRC"
                            ? `₡${(item.product.priceCRC * item.quantity).toLocaleString("es-CR")}`
                            : `$${((item.product.priceCRC * item.quantity) / 520).toFixed(2)}`;

                        const unitPrice =
                          currency === "CRC"
                            ? `₡${item.product.priceCRC.toLocaleString("es-CR")}`
                            : `$${(item.product.priceCRC / 520).toFixed(2)}`;

                        return (
                          <div
                            key={item.product.id}
                            className="bg-white p-4 rounded-2xl border border-forest/10 shadow-xs flex flex-col gap-3"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <h4 className="font-serif font-bold text-forest text-base leading-tight">
                                  {item.product.name}
                                </h4>
                                <span className="text-xs text-forest/50">
                                  {unitPrice} por {item.product.unit}
                                </span>
                              </div>
                              <span className="font-bold text-forest text-base whitespace-nowrap">
                                {itemPrice}
                              </span>
                            </div>

                            {/* Controles de Cantidad */}
                            <div className="flex items-center justify-between pt-2 border-t border-forest/5">
                              <div className="flex items-center border border-forest/15 rounded-lg bg-cream/50">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1.5 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-l-lg transition-colors"
                                  aria-label="Disminuir cantidad"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-3 text-sm font-semibold text-forest min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1.5 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-r-lg transition-colors"
                                  aria-label="Aumentar cantidad"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-xs text-terracotta hover:text-red-700 flex items-center gap-1 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Formulario de preparación de pedido */}
                    <div className="pt-4 border-t border-forest/10 space-y-4">
                      <div className="bg-white/80 p-4 rounded-2xl border border-forest/10 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-terracotta">
                          Datos para la Entrega
                        </h4>

                        <div>
                          <label htmlFor="pedido-nombre" className="block text-xs font-medium text-forest mb-1">
                            Nombre del Solicitante *
                          </label>
                          <input
                            id="pedido-nombre"
                            type="text"
                            required
                            aria-required="true"
                            autoComplete="name"
                            placeholder="Ej: Laura Castro"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full text-sm bg-cream border border-forest/15 rounded-xl px-3 py-2 text-forest focus:outline-hidden focus:ring-2 focus:ring-terracotta/40"
                          />
                        </div>

                        <div>
                          <label htmlFor="pedido-lugar" className="block text-xs font-medium text-forest mb-1">
                            Lugar de Retiro o Entrega
                          </label>
                          <select
                            id="pedido-lugar"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            className="w-full text-sm bg-cream border border-forest/15 rounded-xl px-3 py-2 text-forest focus:outline-hidden focus:ring-2 focus:ring-terracotta/40"
                          >
                            <option value="Feria Guadalupe (Sábados)">Feria Guadalupe (Sábados)</option>
                            <option value="Feria Hatillo (Domingos)">Feria Hatillo (Domingos)</option>
                            <option value="Entrega Domicilio GAM (Coordinar)">Entrega a Domicilio GAM (Ruta coordinada)</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="pedido-notas" className="block text-xs font-medium text-forest mb-1">
                            Observaciones (Opcional)
                          </label>
                          <input
                            id="pedido-notas"
                            type="text"
                            placeholder="Ej: Empacar en bolsa al vacío, trozo grande..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full text-xs bg-cream border border-forest/15 rounded-xl px-3 py-2 text-forest focus:outline-hidden focus:ring-2 focus:ring-terracotta/40"
                          />
                        </div>
                      </div>

                      {/* Aviso de verdad comercial */}
                      <div className="flex items-start gap-2 text-xs text-forest/70 bg-cheese/10 p-3 rounded-xl border border-cheese/20">
                        <AlertCircle className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                        <span>
                          <strong>Consulta previa:</strong> No realizamos cobros automáticos en línea. Su consulta llega a nuestro WhatsApp para verificar el lote fresco y coordinar su retiro o entrega.
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer del Drawer con Totales y Acción */}
              {items.length > 0 && (
                <div className="p-6 border-t border-forest/10 bg-white/90 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-forest/70">Subtotal Estimado:</span>
                    <div className="text-right">
                      <span className="text-2xl font-serif font-bold text-forest">
                        {currency === "CRC"
                          ? `₡${totalCRC.toLocaleString("es-CR")}`
                          : `$${totalUSD.toFixed(2)} USD`}
                      </span>
                      <span className="block text-2xs text-forest/50">
                        {currency === "CRC"
                          ? `≈ $${totalUSD.toFixed(2)} USD`
                          : `≈ ₡${totalCRC.toLocaleString("es-CR")} CRC`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="w-full flex items-center justify-center gap-2 bg-terracotta text-cream py-3.5 px-6 rounded-2xl font-medium shadow-lg shadow-terracotta/25 hover:bg-[#A33F2E] transition-all duration-300"
                  >
                    <span>Enviar Consulta a WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="w-full text-center text-xs text-forest/50 hover:text-terracotta transition-colors"
                  >
                    Vaciar toda la canasta
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
