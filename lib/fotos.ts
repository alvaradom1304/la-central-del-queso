import fs from "fs";
import path from "path";
import { products } from "@/lib/products";
import plan from "@/lib/fotos-plan.json";

// Fotos reales de la sesión (lista de tomas). Se leen de public/fotos al
// generar la página: entra solo lo que siga los nombres de lib/fotos-plan.json
// y, si una foto no está, la web sigue con la imagen actual (recreación).
// Solo para el servidor (usa fs); los componentes importan únicamente los tipos.

export type TomaProducto = "general" | "medio" | "detalle";

export interface FotoUso {
  nombre: string;
  para: "casa" | "negocio" | "ambos";
  titulo: string;
  alt: string;
  src: string;
}

export interface FotoFeria {
  toma: string;
  titulo: string;
  alt: string;
  src: string;
}

export interface FotosReales {
  /** Por id de producto, las tomas que existen. */
  productos: Record<string, Partial<Record<TomaProducto, string>>>;
  /** Fotos en uso que existen, en el orden del plan. */
  uso: FotoUso[];
  /** Por feria, las tomas que existen, en el orden del plan. */
  ferias: Record<string, FotoFeria[]>;
  /** Imagen para la vista previa al compartir (public/fotos/compartir.jpg). */
  compartir: string | null;
}

const BASE_URL = "/" + plan.carpeta.replace(/^public\//, "");

/** Archivos de imagen de una carpeta: nombre sin extensión (en minúsculas) → archivo. */
function archivosDe(carpeta: string): Map<string, string> {
  const mapa = new Map<string, string>();
  let lista: string[] = [];
  try {
    lista = fs.readdirSync(path.join(process.cwd(), plan.carpeta, carpeta));
  } catch {
    return mapa; // la carpeta aún no existe
  }
  for (const archivo of lista) {
    const m = /^(.+)\.([a-z0-9]+)$/i.exec(archivo);
    if (!m || !plan.extensiones.includes(m[2].toLowerCase())) continue;
    const nombre = m[1].toLowerCase();
    if (!mapa.has(nombre)) mapa.set(nombre, archivo);
  }
  return mapa;
}

const url = (carpeta: string, archivo: string) =>
  `${BASE_URL}/${carpeta ? `${carpeta}/` : ""}${encodeURIComponent(archivo)}`;

export function leerFotosReales(): FotosReales {
  const enProductos = archivosDe(plan.productos.carpeta);
  const productos: FotosReales["productos"] = {};
  for (const p of products) {
    for (const toma of plan.productos.tomas as TomaProducto[]) {
      const archivo = enProductos.get(`${p.id}-${toma}`);
      if (archivo) (productos[p.id] ??= {})[toma] = url(plan.productos.carpeta, archivo);
    }
  }

  const enUso = archivosDe(plan.uso.carpeta);
  const uso = plan.uso.tomas.flatMap((t) => {
    const archivo = enUso.get(t.nombre);
    return archivo ? [{ ...t, para: t.para as FotoUso["para"], src: url(plan.uso.carpeta, archivo) }] : [];
  });

  const enFerias = archivosDe(plan.ferias.carpeta);
  const ferias: FotosReales["ferias"] = {};
  for (const sede of plan.ferias.sedes) {
    ferias[sede] = plan.ferias.tomas.flatMap((t) => {
      const archivo = enFerias.get(`${sede}-${t.nombre}`);
      return archivo ? [{ toma: t.nombre, titulo: t.titulo, alt: t.alt, src: url(plan.ferias.carpeta, archivo) }] : [];
    });
  }

  const compartir = archivosDe("").get(plan.compartir.nombre);
  return { productos, uso, ferias, compartir: compartir ? url("", compartir) : null };
}
