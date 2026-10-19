import React from "react";
import clsx from "clsx";

// Ruido fractal en SVG, rasterizado una sola vez como mosaico de fondo.
// Es estático: no se anima ni se recalcula por fotograma.
const GRAIN_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>" +
  "<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix type='saturate' values='0'/></filter>" +
  "<rect width='100%' height='100%' filter='url(#g)'/></svg>";

const GRAIN_STYLE: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`,
  backgroundSize: "180px 180px",
  opacity: 0.07,
  transform: "translateZ(0)",
};

/** Grano de película muy sutil sobre la imagen. Decorativo. */
export default function FilmGrain({ className }: { className?: string }) {
  return <div aria-hidden="true" className={clsx("pointer-events-none absolute inset-0", className)} style={GRAIN_STYLE} />;
}
