import type { MetadataRoute } from "next";
import { SITIO_URL } from "@/lib/sitio";

// /claude y /experimentos no se bloquean aquí: su `noindex` solo funciona si
// el buscador puede rastrearlas y leerlo.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(SITIO_URL ? { sitemap: `${SITIO_URL}/sitemap.xml` } : {}),
  };
}
