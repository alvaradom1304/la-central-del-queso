#!/usr/bin/env node
// Convierte clips de video (o fotos, como material provisional) en las
// secuencias de fotogramas del recorrido /experimentos/finca.
//
// Uso:
//   node scripts/build-frames.mjs --frames 150 clip1.mp4 clip2.mp4 ...
//   node scripts/build-frames.mjs --frames 150 --provisional foto1.jpg foto2.jpg ...
//
// --version vN escribe en public/frames/finca/vN/ (por defecto v1). Usa una
// versión nueva cada vez que cambien las imágenes: los .webp se sirven con
// caché inmutable de un año (vercel.json).
//
// --fade S fija el fundido entre clips (por defecto 0,6 s con fotos y 0 con
// video, porque los clips encadenados ya continúan uno en el otro).
//
// Salida: public/frames/finca/vN/{desktop,mobile}/f_0001.webp ... y manifest.json.
// Los clips se unen en un solo plano y se muestrean de forma uniforme.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve, extname } from "node:path";
import { tmpdir } from "node:os";

const ROOT = resolve(import.meta.dirname ?? new URL(".", import.meta.url).pathname.slice(1), "..");
const OUT = join(ROOT, "public", "frames", "finca");
const PAD = 4;
const PHOTO_SECONDS = 2.4; // duración de cada foto en modo provisional
const VARIANTS = {
  desktop: { width: 1280, height: 720, quality: 56 },
  mobile: { width: 720, height: 1280, quality: 52 },
};

// Textos neutrales: no afirman raza, altitud, año ni métodos hasta que se confirmen.
const TRAMOS = [
  { id: "porton", start: 0.0, end: 0.18, kicker: "El portón", title: "Bienvenido a la finca", text: "Pase adelante. Desde aquí empieza el camino de la leche hasta su mesa." },
  { id: "camino", start: 0.18, end: 0.4, kicker: "El camino", title: "Entre neblina y verde", text: "La finca amanece despacio. Siga avanzando por el camino." },
  { id: "potrero", start: 0.4, end: 0.62, kicker: "El potrero", title: "Donde empieza todo", text: "Aquí pastan las vacas. De su leche nacen nuestros quesos." },
  { id: "puerta", start: 0.62, end: 0.8, kicker: "La lechería", title: "Pase, la puerta está abierta", text: "Adentro la leche se convierte en queso." },
  { id: "lecheria", start: 0.8, end: 1.0, kicker: "La recepción", title: "La mesa está lista", text: "Estos son los quesos de la semana. Elija los suyos y le preparamos el pedido." },
];

function findFfmpeg(name) {
  if (process.env[name.toUpperCase()]) return process.env[name.toUpperCase()];
  const probe = spawnSync(name, ["-version"], { stdio: "ignore", shell: false });
  if (probe.status === 0) return name;
  const links = join(process.env.LOCALAPPDATA ?? "", "Microsoft", "WinGet", "Links", `${name}.exe`);
  if (existsSync(links)) return links;
  const pkgs = join(process.env.LOCALAPPDATA ?? "", "Microsoft", "WinGet", "Packages");
  if (existsSync(pkgs)) {
    for (const dir of readdirSync(pkgs).filter((d) => d.startsWith("Gyan.FFmpeg"))) {
      const base = join(pkgs, dir);
      for (const sub of readdirSync(base)) {
        const exe = join(base, sub, "bin", `${name}.exe`);
        if (existsSync(exe)) return exe;
      }
    }
  }
  throw new Error(`No se encontró ${name}. Instálalo (winget install Gyan.FFmpeg) o define la variable ${name.toUpperCase()}.`);
}

const FFMPEG = findFfmpeg("ffmpeg");
const FFPROBE = findFfmpeg("ffprobe");

function run(bin, args) {
  const r = spawnSync(bin, args, { stdio: ["ignore", "ignore", "pipe"], maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`${bin} falló:\n${r.stderr?.toString().slice(-2000)}`);
}

function duration(file) {
  const r = spawnSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
  return parseFloat(r.stdout.toString());
}

function parseArgs(argv) {
  const opts = { frames: 150, provisional: false, fade: null, version: "v1", inputs: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--frames") opts.frames = parseInt(argv[++i], 10);
    else if (argv[i] === "--provisional") opts.provisional = true;
    else if (argv[i] === "--fade") opts.fade = parseFloat(argv[++i]);
    else if (argv[i] === "--version") opts.version = argv[++i];
    else opts.inputs.push(resolve(argv[i]));
  }
  if (!opts.inputs.length) throw new Error("Indica al menos un clip o foto de entrada.");
  for (const f of opts.inputs) if (!existsSync(f)) throw new Error(`No existe: ${f}`);
  if (!/^vd+$/.test(opts.version)) throw new Error("--version debe tener la forma v1, v2…");
  opts.fade ??= opts.provisional ? 0.6 : 0;
  return opts;
}

// Normaliza cada entrada a 2276x1280 a 30 fps (alto suficiente para recortar
// el móvil 720x1280 sin ampliar); una foto se convierte
// en un avance lento (zoom) para simular el paso.
function normalize(input, tmp, i) {
  const out = join(tmp, `n_${i}.mp4`);
  const isImage = [".jpg", ".jpeg", ".png", ".webp"].includes(extname(input).toLowerCase());
  const base = "scale=2276:1280:force_original_aspect_ratio=increase,crop=2276:1280,setsar=1";
  if (isImage) {
    const frames = Math.round(PHOTO_SECONDS * 30);
    run(FFMPEG, ["-y", "-loop", "1", "-i", input, "-vf",
      `scale=2880:1620:force_original_aspect_ratio=increase,crop=2880:1620,zoompan=z='1+0.18*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=2276x1280:fps=30,setsar=1`,
      "-frames:v", String(frames), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", out]);
  } else {
    run(FFMPEG, ["-y", "-i", input, "-an", "-vf", `${base},fps=30`, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", out]);
  }
  return out;
}

// Con un clip por tramo, cada tramo empieza a mitad del fundido que lo une al anterior.
function tramosFor(clips, fade) {
  if (clips.length !== TRAMOS.length) return TRAMOS;
  const durations = clips.map(duration);
  const total = durations.reduce((s, d) => s + d, 0) - fade * (clips.length - 1);
  let t = 0;
  const cuts = [0];
  durations.slice(0, -1).forEach((d) => {
    t += d - fade;
    cuts.push((t + fade / 2) / total);
  });
  cuts.push(1);
  return TRAMOS.map((tramo, i) => ({ ...tramo, start: +cuts[i].toFixed(3), end: +cuts[i + 1].toFixed(3) }));
}

// Une los clips con fundidos cruzados en un único plano.
function concat(clips, tmp, fade) {
  if (clips.length === 1) return clips[0];
  const out = join(tmp, "master.mp4");
  const args = ["-y"];
  clips.forEach((c) => args.push("-i", c));
  if (fade <= 0) {
    const inputs = clips.map((_, k) => `[${k}:v]`).join("");
    args.push("-filter_complex", `${inputs}concat=n=${clips.length}:v=1:a=0[v]`, "-map", "[v]", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", out);
    run(FFMPEG, args);
    return out;
  }
  let filter = "";
  let prev = "[0:v]";
  let offset = 0;
  clips.slice(1).forEach((_, k) => {
    offset += duration(clips[k]) - fade;
    const label = k === clips.length - 2 ? "[v]" : `[x${k}]`;
    filter += `${prev}[${k + 1}:v]xfade=transition=fade:duration=${fade}:offset=${offset.toFixed(3)}${label};`;
    prev = label;
  });
  args.push("-filter_complex", filter.slice(0, -1), "-map", "[v]", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", out);
  run(FFMPEG, args);
  return out;
}

function extract(master, frames, version) {
  const total = duration(master);
  const result = {};
  for (const [name, v] of Object.entries(VARIANTS)) {
    const dir = join(OUT, version, name);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    run(FFMPEG, ["-y", "-i", master, "-vf",
      `fps=${(frames / total).toFixed(6)},scale=${v.width}:${v.height}:force_original_aspect_ratio=increase,crop=${v.width}:${v.height}`,
      "-frames:v", String(frames), "-c:v", "libwebp", "-quality", String(v.quality), "-compression_level", "6",
      join(dir, `f_%0${PAD}d.webp`)]);
    const files = readdirSync(dir);
    const bytes = files.reduce((s, f) => s + statSync(join(dir, f)).size, 0);
    result[name] = { count: files.length, mb: +(bytes / 1048576).toFixed(2) };
  }
  return result;
}

const opts = parseArgs(process.argv.slice(2));
const tmp = join(tmpdir(), `frames-finca-${Date.now()}`);
mkdirSync(tmp, { recursive: true });
try {
  const clips = opts.inputs.map((f, i) => normalize(f, tmp, i));
  const master = concat(clips, tmp, opts.fade);
  const stats = extract(master, opts.frames, opts.version);
  const frameCount = Math.min(stats.desktop.count, stats.mobile.count);
  const manifest = {
    version: 1,
    provisional: opts.provisional,
    notice: opts.provisional ? "Recreación visual provisional" : "Recreación visual",
    frameCount,
    pad: PAD,
    variants: Object.fromEntries(Object.entries(VARIANTS).map(([name, v]) => [name, {
      width: v.width, height: v.height, pattern: `/frames/finca/${opts.version}/${name}/f_{n}.webp`,
    }])),
    tramos: tramosFor(clips, opts.fade),
  };
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Fotogramas: ${frameCount}. Escritorio ${stats.desktop.mb} MB, móvil ${stats.mobile.mb} MB.`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
