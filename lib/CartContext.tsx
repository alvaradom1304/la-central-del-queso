"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, USD_EXCHANGE_RATE } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  /** options.open = false agrega sin abrir el cajón (la fila da su propio aviso). */
  addToCart: (product: Product, quantity?: number, options?: { open?: boolean }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  currency: "CRC" | "USD";
  setCurrency: (currency: "CRC" | "USD") => void;
  totalCRC: number;
  totalUSD: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrency] = useState<"CRC" | "USD">("CRC");

  // Recuperar carrito de sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("central_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignorar errores en navegadores restrictivos
    }
  }, []);

  // Guardar en sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem("central_cart", JSON.stringify(items));
    } catch {
      // Ignorar errores
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1, options?: { open?: boolean }) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    if (options?.open !== false) setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCRC = items.reduce(
    (sum, item) => sum + item.product.priceCRC * item.quantity,
    0
  );

  const totalUSD = totalCRC / USD_EXCHANGE_RATE;

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        currency,
        setCurrency,
        totalCRC,
        totalUSD,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
