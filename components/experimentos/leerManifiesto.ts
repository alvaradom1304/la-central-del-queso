import { readFile } from "fs/promises";
import path from "path";
import { parseFincaManifest, type FincaManifest } from "./fincaManifest";

/**
 * Lee public/frames/finca/manifest.json en el servidor (en desarrollo, en cada
 * petición; en producción, al generar la página estática). Si no existe o no
 * cumple el contrato devuelve null y la página usa la alternativa estática.
 */
export async function leerManifiestoFinca(): Promise<FincaManifest | null> {
  try {
    const file = path.join(process.cwd(), "public", "frames", "finca", "manifest.json");
    const raw = await readFile(file, "utf8");
    const manifest = parseFincaManifest(JSON.parse(raw));
    if (!manifest) console.warn("[finca] manifest.json no cumple el contrato; se usa la versión estática.");
    return manifest;
  } catch {
    return null;
  }
}
