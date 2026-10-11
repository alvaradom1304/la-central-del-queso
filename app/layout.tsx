import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "La Central del Queso | Tradición Familiar desde 1980",
  description: "Queso Semiduro tradicional de Turrialba y lácteos artesanales costarricenses. Historia familiar desde 1980 en las Ferias del Agricultor de Guadalupe y Hatillo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-cream text-forest selection:bg-cheese selection:text-forest">
        {children}
      </body>
    </html>
  );
}