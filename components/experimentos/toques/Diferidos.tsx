"use client";

import dynamic from "next/dynamic";

// Los objetos tocables se cargan solo en el cliente y después del contenido:
// three.js y los canvas no bloquean el catálogo HTML.
export const CortinaDiferida = dynamic(() => import("./CortinaLino"), { ssr: false });
export const HierbaDiferida = dynamic(() => import("./HierbaViva"), { ssr: false });
export const LecheDiferida = dynamic(() => import("./LecheViva"), { ssr: false });
