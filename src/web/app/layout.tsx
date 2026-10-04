import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Central del Queso | Doña Martha",
  description: "La calidez de la feria, la frescura de nuestra tradición en su mesa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}