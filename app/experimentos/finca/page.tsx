import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import FincaExperience from "@/components/experimentos/FincaExperience";
import { parseFincaManifest, type FincaManifest } from "@/components/experimentos/fincaManifest";
import { CortinaDiferida, HierbaDiferida, LecheDiferida } from "@/components/experimentos/toques/Diferidos";

export const metadata: Metadata = {
  title: "Experimento: recorrido por la finca | La Central del Queso",
  description:
    "Prototipo experimental: recorrido por secuencia de fotogramas desde el portón de la finca hasta la lechería. Imágenes en recreación visual provisional.",
  robots: { index: false, follow: false },
};

/**
 * Lee public/frames/finca/manifest.json en el servidor (en desarrollo, en cada
 * petición; en producción, al generar la página estática). Si no existe o no
 * cumple el contrato, la página usa la alternativa estática.
 */
async function loadManifest(): Promise<FincaManifest | null> {
  try {
    const file = path.join(process.cwd(), "public", "frames", "finca", "manifest.json");
    const raw = await readFile(file, "utf8");
    const manifest = parseFincaManifest(JSON.parse(raw));
    if (!manifest) console.warn("[experimentos/finca] manifest.json no cumple el contrato; se usa la versión estática.");
    return manifest;
  } catch {
    return null;
  }
}

export default async function FincaExperimentPage() {
  const manifest = await loadManifest();
  return (
    <FincaExperience
      manifest={manifest}
      ventanaOverlay={<CortinaDiferida />}
      sceneOverlays={{ potrero: <HierbaDiferida /> }}
      cuenco={<LecheDiferida className="w-28 shrink-0 sm:w-36" />}
    />
  );
}
