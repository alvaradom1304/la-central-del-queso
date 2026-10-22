import type { Metadata } from "next";
import Pelicula from "@/components/pelicula/Pelicula";
import DatosEstructurados from "@/components/pelicula/DatosEstructurados";
import { recortarPlano } from "@/components/pelicula/plano";
import { leerManifiestoFinca } from "@/components/experimentos/leerManifiesto";
import { leerFotosReales } from "@/lib/fotos";

// La propuesta editorial «El Puesto» sigue en /claude, sin indexar, para comparar.

const TITULO = "Quesos de Turrialba en Guadalupe y Hatillo | La Central del Queso";
const DESCRIPCION =
  "Quesos frescos y madurados, natilla y mantequilla. Apártelos por WhatsApp y recójalos en las ferias de Guadalupe y Hatillo, o cotice por volumen para su restaurante.";

export async function generateMetadata(): Promise<Metadata> {
  // Con la foto real public/fotos/compartir.jpg, la vista previa al compartir la usa.
  const { compartir } = leerFotosReales();
  const imagen = compartir
    ? { url: compartir, width: 1200, height: 630, alt: "La Central del Queso, quesos de Turrialba" }
    : {
        url: "/porton_finca_turrialba.jpg",
        width: 1376,
        height: 768,
        alt: "Portón de madera abierto hacia un potrero al amanecer (recreación visual)",
      };
  return {
    title: { absolute: TITULO },
    description: DESCRIPCION,
    // Las variantes con ?src=, ?utm_source= o ?segmento= (QR, campañas) apuntan a la misma portada.
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "es_CR",
      siteName: "La Central del Queso",
      url: "/",
      title: TITULO,
      description: DESCRIPCION,
      images: [imagen],
    },
    twitter: { card: "summary_large_image", title: TITULO, description: DESCRIPCION },
  };
}

export default async function Home() {
  const manifest = await leerManifiestoFinca();
  const fotos = leerFotosReales();
  return (
    <>
      <DatosEstructurados fotos={fotos} />
      <Pelicula manifest={manifest ? recortarPlano(manifest) : null} fotos={fotos} />
    </>
  );
}
