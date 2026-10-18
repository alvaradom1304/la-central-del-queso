import { Product } from "./products";

// Número de WhatsApp de pedidos, en formato internacional sin "+".
// Se define con NEXT_PUBLIC_BUSINESS_PHONE (ver .env.example).
export const BUSINESS_PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "50671714679";

export const BUSINESS_PHONE_DISPLAY = `+${BUSINESS_PHONE.slice(0, 3)} ${BUSINESS_PHONE.slice(3, 7)}-${BUSINESS_PHONE.slice(7)}`;

export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${BUSINESS_PHONE}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function generateWhatsAppLink(product: Product): string {
  const greeting = "¡Hola Doña Martha! Qué gusto saludarle.";
  const orderDetails = `Me gustaría pedir: *${product.name}* de la categoría '${product.category}'.`;
  const quantity = `¿Me podría preparar 1 ${product.unit}?`;
  const closing = "Quedo atento(a) para coordinar la entrega y el pago por Sinpe Móvil. ¡Gracias!";

  const message = `${greeting}\n\n${orderDetails}\n${quantity}\n\n${closing}`;
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`;
}
