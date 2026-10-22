// Dominio de producción del sitio, única fuente para canonical, sitemap y
// datos estructurados: NEXT_PUBLIC_SITE_URL o, en los builds de Vercel, su
// dominio de producción. En local queda vacío y las URL salen relativas.
export const SITIO_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")
).replace(/\/$/, "");
