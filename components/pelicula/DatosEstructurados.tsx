import { products } from "@/lib/products";
import { BUSINESS_PHONE } from "@/lib/whatsapp";
import { SITIO_URL } from "@/lib/sitio";
import { porKilo } from "@/components/claude/datos";
import type { FotosReales } from "@/lib/fotos";

// Datos estructurados (JSON-LD) de la portada. Solo describen lo que la página
// muestra: el negocio, el sitio y los productos con su precio visible en
// colones. No se marca LocalBusiness porque no hay dirección verificada de los
// puestos. `image` va solo con las fotos reales de cada producto: las
// recreaciones generadas por IA no se declaran. Google reserva los fragmentos
// de producto para páginas de un solo producto; aquí la lista sirve a
// buscadores y asistentes que leen schema.org.

const url = (ruta: string) => `${SITIO_URL}${ruta}`;

export default function DatosEstructurados({ fotos }: { fotos: FotosReales }) {
  const marca = { "@type": "Brand", name: "Quesos Doña Martha" };

  const productos = products.map((p) => {
    const reales = Object.values(fotos.productos[p.id] ?? {}).map(url);
    return {
      "@type": "Product",
      "@id": url(`/#producto-${p.id}`),
      name: p.name,
      description: p.pairingNote,
      ...(reales.length ? { image: reales } : {}),
      sku: p.id,
      brand: marca,
      offers: {
        "@type": "Offer",
        url: url(p.id === "bloque-b2b-semiduro" ? "/#negocios" : "/#carta"),
        priceCurrency: "CRC",
        price: p.priceCRC,
        availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        ...(porKilo(p)
          ? {
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: p.priceCRC,
                priceCurrency: "CRC",
                unitCode: "KGM",
                referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "KGM" },
              },
            }
          : {}),
      },
    };
  });

  const grafo = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": url("/#organizacion"),
        name: "La Central del Queso",
        alternateName: "Quesos Doña Martha",
        url: url("/"),
        areaServed: { "@type": "Country", name: "Costa Rica" },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: `+${BUSINESS_PHONE}`,
          contactType: "sales",
          availableLanguage: "es",
        },
      },
      {
        "@type": "WebSite",
        "@id": url("/#sitio"),
        name: "La Central del Queso",
        url: url("/"),
        inLanguage: "es-CR",
        publisher: { "@id": url("/#organizacion") },
      },
      {
        "@type": "ItemList",
        name: "Quesos y derivados de la semana",
        itemListElement: productos.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Datos propios; se escapa «<» para que ningún texto pueda cerrar la etiqueta.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(grafo).replace(/</g, "\\u003c") }}
    />
  );
}
