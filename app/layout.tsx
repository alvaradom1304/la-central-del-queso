import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITIO_URL } from "@/lib/sitio";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

// Metadata base de todas las rutas (la heredan las que no definen la suya, como el 404).
export const metadata: Metadata = {
  metadataBase: SITIO_URL ? new URL(SITIO_URL) : undefined,
  title: {
    default: "La Central del Queso | Quesos de Turrialba",
    template: "%s | La Central del Queso",
  },
  description:
    "Quesos de Turrialba, natilla y mantequilla en las ferias de Guadalupe y Hatillo, San José, Costa Rica. Pedidos por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CR"
      className={`${plusJakarta.variable} ${cormorant.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans bg-[#0D1510] text-[#F7F4EC] selection:bg-[#DDA13E] selection:text-[#0D1510]">
        {children}
      </body>
    </html>
  );
}