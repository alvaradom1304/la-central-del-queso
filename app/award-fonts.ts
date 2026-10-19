import { Big_Shoulders_Display, Instrument_Serif } from "next/font/google";

/** Rótulo de feria: condensada pesada para titulares y precios. */
export const display = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--aw-display",
  display: "swap",
});

/** Acento cálido: una palabra en itálica por titular. */
export const accent = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--aw-accent",
  display: "swap",
});
