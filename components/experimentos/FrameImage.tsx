"use client";

import React, { useEffect, useRef, useState } from "react";
import type { StaticImage } from "./fincaManifest";

interface FrameImageProps {
  /** Fotograma horizontal (o único). Si falta, se usa directamente el respaldo. */
  src?: string;
  /** Fotograma vertical para pantallas en orientación vertical. */
  portraitSrc?: string;
  width: number;
  height: number;
  alt: string;
  /** Imagen publicada que se muestra si el fotograma no carga. */
  fallback: StaticImage;
  className?: string;
  priority?: boolean;
}

/**
 * <img> de un fotograma con respaldo: si el archivo no existe o falla, muestra
 * la imagen de respaldo. También detecta errores ocurridos antes de hidratar.
 */
export default function FrameImage({
  src,
  portraitSrc,
  width,
  height,
  alt,
  fallback,
  className,
  priority = false,
}: FrameImageProps) {
  const [failed, setFailed] = useState(!src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed || !src) {
    return (
      <img
        src={fallback.src}
        alt={alt === "" ? "" : fallback.alt}
        width={fallback.width}
        height={fallback.height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    );
  }

  return (
    <picture>
      {portraitSrc ? <source media="(orientation: portrait)" srcSet={portraitSrc} /> : null}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}
