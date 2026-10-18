import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "La Central del Queso | De la Finca a tu Mesa · Desde 1980",
  description:
    "Experiencia inmersiva de origen costarricense: recorra el camino desde el portón de Finca Doña Martha en Turrialba hasta nuestra mesa artesanal de quesos y derivados lácteos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${cormorant.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans bg-[#0D1510] text-[#F7F4EC] selection:bg-[#DDA13E] selection:text-[#0D1510]">
        {children}
      </body>
    </html>
  );
}