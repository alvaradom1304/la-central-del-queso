// Valida las fotos reales en public/fotos contra la lista de tomas
// (lib/fotos-plan.json + los productos de lib/products.ts): nombres,
// proporción, tamaño mínimo, duplicados y peso. Uso: npm run fotos:validar
// Sale con código 1 si hay errores; las fotos que faltan no son error.

import fs from "node:fs";
import path from "node:path";
import plan from "../lib/fotos-plan.json" with { type: "json" };

const { products } = await import("../lib/products.ts");

const RAIZ = path.resolve(import.meta.dirname, "..", plan.carpeta);
const TOLERANCIA = 0.03; // ±3 % en la proporción
const PESO_MAXIMO = 2.5 * 1024 * 1024; // lo que conviene subir al repositorio

// ---------------------------------------------------------------- lo esperado

/** carpeta → Map(nombre → { formato, opcional }) */
const esperado = new Map();
const agregar = (carpeta, nombre, formato, opcional = false) => {
  if (!esperado.has(carpeta)) esperado.set(carpeta, new Map());
  esperado.get(carpeta).set(nombre, { formato, opcional });
};
for (const p of products) {
  for (const toma of plan.productos.tomas) agregar(plan.productos.carpeta, `${p.id}-${toma}`, plan.productos.formato);
}
for (const t of plan.uso.tomas) agregar(plan.uso.carpeta, t.nombre, plan.uso.formato);
for (const sede of plan.ferias.sedes) {
  for (const t of plan.ferias.tomas) agregar(plan.ferias.carpeta, `${sede}-${t.nombre}`, t.formato, t.nombre === "retrato");
}
agregar("", plan.compartir.nombre, plan.compartir.formato, true);

// ---------------------------------------------------------------- dimensiones

/** Ancho y alto tal como se ven (JPEG con orientación EXIF, PNG, WebP). */
function dimensiones(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { ancho: buf.readUInt32BE(16), alto: buf.readUInt32BE(20) };
  }
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const tipo = buf.toString("ascii", 12, 16);
    if (tipo === "VP8 ") return { ancho: buf.readUInt16LE(26) & 0x3fff, alto: buf.readUInt16LE(28) & 0x3fff };
    if (tipo === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { ancho: (b & 0x3fff) + 1, alto: ((b >> 14) & 0x3fff) + 1 };
    }
    if (tipo === "VP8X") return { ancho: 1 + buf.readUIntLE(24, 3), alto: 1 + buf.readUIntLE(27, 3) };
    return null;
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let orientacion = 1;
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marca = buf[i + 1];
      const largo = buf.readUInt16BE(i + 2);
      if (marca === 0xe1 && buf.toString("ascii", i + 4, i + 10) === "Exif\0\0") orientacion = orientacionExif(buf, i + 10);
      const esSof = marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca);
      if (esSof) {
        const alto = buf.readUInt16BE(i + 5);
        const ancho = buf.readUInt16BE(i + 7);
        // 5 a 8: la cámara guardó la foto girada; el navegador la muestra rotada.
        return orientacion >= 5 ? { ancho: alto, alto: ancho } : { ancho, alto };
      }
      i += 2 + largo;
    }
  }
  return null;
}

function orientacionExif(buf, tiff) {
  try {
    const le = buf.toString("ascii", tiff, tiff + 2) === "II";
    const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
    const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
    const ifd = tiff + u32(tiff + 4);
    const entradas = u16(ifd);
    for (let k = 0; k < entradas; k++) {
      const e = ifd + 2 + k * 12;
      if (u16(e) === 0x0112) return u16(e + 8);
    }
  } catch {
    // EXIF incompleto: se asume sin rotación
  }
  return 1;
}

// ---------------------------------------------------------------- utilidades

function parecido(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[a.length][b.length];
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;

// ---------------------------------------------------------------- revisión

const errores = [];
const avisos = [];
const encontrados = new Map(); // carpeta → Set(nombre)

for (const [carpeta, nombres] of esperado) {
  const dir = path.join(RAIZ, carpeta);
  encontrados.set(carpeta, new Set());
  let archivos = [];
  try {
    archivos = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isFile()).map((d) => d.name);
  } catch {
    continue; // carpeta todavía vacía o inexistente
  }
  const vistos = new Map();
  for (const archivo of archivos) {
    const m = /^(.+)\.([a-z0-9]+)$/i.exec(archivo);
    if (!m || !plan.extensiones.includes(m[2].toLowerCase())) continue;
    const ruta = path.join(carpeta, archivo);
    let nombre = m[1].toLowerCase();
    const ext = m[2].toLowerCase();

    if (archivo !== archivo.toLowerCase() || /\s/.test(archivo)) avisos.push(`${ruta}: use minúsculas y sin espacios.`);
    if (ext !== "jpg" && ext !== "jpeg") avisos.push(`${ruta}: la lista pide JPG; ${ext.toUpperCase()} también funciona.`);

    // Versión vertical opcional para redes (la web no la usa).
    const sufijo = plan.sufijosOpcionales.find((s) => nombre.endsWith(`-${s}`));
    const base = sufijo ? nombre.slice(0, -(sufijo.length + 1)) : nombre;

    if (!nombres.has(base)) {
      const sugerencia = [...nombres.keys()].sort((a, b) => parecido(base, a) - parecido(base, b))[0];
      errores.push(`${ruta}: nombre fuera de la lista${sugerencia ? `; ¿quiso decir «${sugerencia}.jpg»?` : "."}`);
      continue;
    }
    if (vistos.has(nombre)) {
      errores.push(`${ruta}: repetida con ${vistos.get(nombre)}; deje una sola.`);
      continue;
    }
    vistos.set(nombre, archivo);

    const buf = fs.readFileSync(path.join(dir, archivo));
    if (buf.length > PESO_MAXIMO) avisos.push(`${ruta}: pesa ${mb(buf.length)}; para la web exporte una versión de unos 3000 px y calidad 85.`);
    const dim = dimensiones(buf);
    if (!dim) {
      errores.push(`${ruta}: no se pudo leer como imagen.`);
      continue;
    }
    if (sufijo) {
      if (dim.alto <= dim.ancho) avisos.push(`${ruta}: es «${sufijo}» pero no está en vertical (${dim.ancho} × ${dim.alto}).`);
      continue;
    }

    const formato = plan.formatos[nombres.get(base).formato];
    const proporcion = dim.ancho / dim.alto;
    let bien = true;
    if (Math.abs(proporcion - formato.proporcion) / formato.proporcion > TOLERANCIA) {
      errores.push(
        `${ruta}: ${dim.ancho} × ${dim.alto} no es ${nombres.get(base).formato}` +
          (proporcion < 1 ? " (está en vertical; esta toma va horizontal)." : ".")
      );
      bien = false;
    }
    // Con la proporción equivocada (p. ej. girada) el tamaño mínimo confunde: se omite.
    if (bien && (dim.ancho < formato.ancho || dim.alto < formato.alto)) {
      errores.push(`${ruta}: ${dim.ancho} × ${dim.alto} es menor que el mínimo ${formato.ancho} × ${formato.alto}.`);
      bien = false;
    }
    if (bien) encontrados.get(carpeta).add(base);
  }
}

// ---------------------------------------------------------------- informe

console.log("Fotos reales: revisión de public/fotos\n");
for (const [carpeta, nombres] of esperado) {
  const ok = encontrados.get(carpeta);
  const obligatorias = [...nombres].filter(([, v]) => !v.opcional).map(([n]) => n);
  const listas = obligatorias.filter((n) => ok.has(n)).length;
  if (!obligatorias.length) {
    console.log(`${"compartir.jpg".padEnd(18)} opcional, ${ok.size ? "lista" : "no está (se usa la imagen actual)"}`);
    continue;
  }
  console.log(`${carpeta.padEnd(18)} ${listas}/${obligatorias.length} listas`);
  const faltan = obligatorias.filter((n) => !ok.has(n));
  if (faltan.length && faltan.length <= 8) console.log(`  faltan: ${faltan.join(", ")}`);
  else if (faltan.length) console.log(`  faltan ${faltan.length}, por ejemplo: ${faltan.slice(0, 4).join(", ")}…`);
}

if (avisos.length) {
  console.log(`\nAvisos (${avisos.length}):`);
  for (const a of avisos) console.log(`  aviso  ${a}`);
}
if (errores.length) {
  console.log(`\nErrores (${errores.length}): corríjalos antes de publicar (la web usaría estas fotos tal como están).`);
  for (const e of errores) console.log(`  error  ${e}`);
  process.exit(1);
}
console.log("\nSin errores. Las fotos listas se usan en la web al volver a generarla (npm run build o el próximo despliegue).");
