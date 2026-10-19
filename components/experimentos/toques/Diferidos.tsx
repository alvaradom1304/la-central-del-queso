"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Los objetos tocables se cargan solo en el cliente y después del contenido:
// three.js y los canvas no bloquean el catálogo HTML.
const CortinaLino = dynamic(() => import("./CortinaLino"), { ssr: false });
export const HierbaDiferida = dynamic(() => import("./HierbaViva"), { ssr: false });
export const LecheDiferida = dynamic(() => import("./LecheViva"), { ssr: false });

/** La cortina (three.js) se descarga cuando la ventana de la lechería se acerca a la pantalla. */
export function CortinaDiferida() {
  const ref = useRef<HTMLDivElement>(null);
  const [cerca, setCerca] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCerca(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="absolute inset-0">
      {cerca ? <CortinaLino /> : null}
    </div>
  );
}
