/**
 * Filtros de veracidad para textos que vienen de lib/products.ts.
 * El brief del proyecto exige no publicar historia no verificada: se omiten las frases con «1980»
 * hasta que el negocio confirme el dato.
 */
const UNVERIFIED = /1980/;

export function verifiedText(text: string): string {
  return text
    .split(/(?<=\.)\s+/)
    .filter((sentence) => !UNVERIFIED.test(sentence))
    .join(" ");
}

export const crc = (n: number) => `₡${n.toLocaleString("es-CR")}`;
