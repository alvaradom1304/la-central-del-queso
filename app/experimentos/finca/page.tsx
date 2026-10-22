import type { Metadata } from "next";
import FincaExperience from "@/components/experimentos/FincaExperience";
import { leerManifiestoFinca } from "@/components/experimentos/leerManifiesto";
import { CortinaDiferida, HierbaDiferida, LecheDiferida } from "@/components/experimentos/toques/Diferidos";

export const metadata: Metadata = {
  title: "Experimento: recorrido por la finca",
  description:
    "Prototipo experimental: recorrido por secuencia de fotogramas desde el portón de la finca hasta la lechería. Imágenes en recreación visual provisional.",
  robots: { index: false, follow: false },
};

export default async function FincaExperimentPage() {
  const manifest = await leerManifiestoFinca();
  return (
    <FincaExperience
      manifest={manifest}
      ventanaOverlay={<CortinaDiferida />}
      sceneOverlays={{ potrero: <HierbaDiferida /> }}
      cuenco={<LecheDiferida className="w-28 shrink-0 sm:w-36" />}
    />
  );
}
