import { Product } from "./products";

// Use a placeholder phone number for Doña Martha
const BUSINESS_PHONE = "50688888888";

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
