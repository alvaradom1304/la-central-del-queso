import type { MetadataRoute } from "next";
import { SITIO_URL } from "@/lib/sitio";

// Solo la portada: el resto de rutas son de comparación o experimentos (noindex).
// Sin dominio configurado no se publican URL (un sitemap exige URL absolutas).
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITIO_URL) return [];
  return [{ url: `${SITIO_URL}/`, changeFrequency: "weekly", priority: 1 }];
}
