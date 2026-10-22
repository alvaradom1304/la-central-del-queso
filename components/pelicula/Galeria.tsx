"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Galería de fotos reales de la sesión (en uso, en la feria). Solo aparece
// cuando hay fotos; cada una entra al llegar a la pantalla (solo opacidad y
// posición, para que siga al alcance de lectores de pantalla).

export interface FotoGaleria {
  clave: string;
  titulo: string;
  alt: string;
  src: string;
}

export default function Galeria({ fotos, etiqueta, className = "" }: { fotos: FotoGaleria[]; etiqueta: string; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = ref.current?.querySelectorAll("li");
        if (!items?.length) return;
        gsap.from(items, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref }
  );

  if (!fotos.length) return null;
  return (
    <ul ref={ref} className={`cine-galeria ${className}`} aria-label={etiqueta}>
      {fotos.map((f) => (
        <li key={f.clave}>
          <figure>
            <div className="cine-galeria-foto">
              <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
            </div>
            <figcaption>{f.titulo}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
