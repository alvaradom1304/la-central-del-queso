const crcFormatter = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Precio en colones con formato es-CR (p. ej. "₡5 500"). Los separadores se
 * normalizan a espacio duro para que el texto del servidor y el del navegador
 * coincidan al hidratar aunque sus versiones de ICU difieran.
 */
export function formatCRC(amount: number): string {
  return crcFormatter.format(amount).replace(/\s/g, " ");
}

const ROMAN: Array<[number, string]> = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** Número romano (1–39) para las cartelas de los tramos. */
export function toRoman(value: number): string {
  let rest = Math.max(1, Math.min(39, Math.floor(value)));
  let out = "";
  for (const [amount, symbol] of ROMAN) {
    while (rest >= amount) {
      out += symbol;
      rest -= amount;
    }
  }
  return out;
}

/** Cartela de museo de un tramo: "I — Portón". */
export function cartela(index: number, label: string): string {
  return `${toRoman(index + 1)} — ${label}`;
}
