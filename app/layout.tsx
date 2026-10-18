import type { Metadata } from "next";

import "./globals.css";

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
      style={{ "--font-inter": "Arial, sans-serif", "--font-playfair": "Georgia, serif", "--font-mono": "Consolas, monospace" } as React.CSSProperties}
    >
      <body className="font-sans bg-[#0D1510] text-[#F7F4EC] selection:bg-[#DDA13E] selection:text-[#0D1510]">
        {children}
      </body>
    </html>
  );
}
