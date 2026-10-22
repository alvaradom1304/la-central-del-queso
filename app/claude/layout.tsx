import type { Metadata } from "next";
import { Caveat, Fraunces, Instrument_Sans } from "next/font/google";
import "./claude.css";
import "./artesanal.css";
import "./maison.css";

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--cq-display",
});

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--cq-sans" });

const mano = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--cq-mano" });

export const metadata: Metadata = {
  title: { absolute: "La Central del Queso · Quesos Doña Martha — propuesta «El Puesto»" },
  description:
    "Quesos de feria de Doña Martha: elija en la pizarra, envíe su pedido por WhatsApp y recójalo en la Feria del Agricultor de Guadalupe o Hatillo.",
  // Propuesta de comparación: no indexar hasta que se promueva a la portada.
  robots: { index: false, follow: false },
};

export default function ClaudeLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${sans.variable} ${mano.variable}`}>{children}</div>;
}
