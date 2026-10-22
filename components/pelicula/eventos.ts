// Eventos del embudo, sin datos personales (ni nombre, ni teléfono, ni nota).
// Si la página tiene un dataLayer (GTM/GA4) se publican ahí; además se emiten
// como `cq:evento` para quien quiera escucharlos. Abrir WhatsApp es intención
// de contacto: no confirma que el mensaje se envió ni que hubo venta.

export type Evento =
  | "segmento_elegido"
  | "producto_agregado"
  | "canasta_agregada"
  | "pedido_abierto"
  | "whatsapp_pedido"
  | "whatsapp_cotizacion";

export function registrarEvento(nombre: Evento, datos: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer?.push({ event: nombre, ...datos });
  window.dispatchEvent(new CustomEvent("cq:evento", { detail: { nombre, ...datos } }));
}
