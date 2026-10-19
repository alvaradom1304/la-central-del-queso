#!/usr/bin/env node
// Guardián award-grade: detecta patrones de riesgo en código de webs inmersivas.
// Heurístico (expresiones regulares): señala dónde mirar; no sustituye la prueba en navegador.
//
// Uso CLI:   node scripts/immersive-guard.mjs <archivo|carpeta> [...]   → sale con 1 si hay errores
// Uso hook:  node scripts/immersive-guard.mjs --hook                    → lee el JSON del hook por stdin,
//            revisa el archivo editado y devuelve avisos como contexto adicional; nunca bloquea.
// Sin dependencias. Node 20+.
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';

const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.scss', '.html', '.vue', '.svelte', '.astro']);
const SKIP = new Set(['node_modules', '.next', 'dist', 'build', 'out', '.git', '.references', '.vercel', 'coverage']);
const MAX_FILES = 3000;

const ANIM_IMPORT = /from\s+['"](gsap|three|@react-three\/[\w-]+|lenis|@studio-freight\/[\w-]+|framer-motion|motion|motion\/react)['"]/;
const REDUCED = /prefers-reduced-motion|useReducedMotion|reducedMotion|reduced-motion/;

/** @returns {{rule:string, level:'error'|'warn', msg:string, line?:number}[]} */
function checkFile(path, text, project) {
  const out = [];
  const ext = extname(path);
  const lineOf = (idx) => text.slice(0, idx).split('\n').length;
  const add = (rule, level, msg, idx) => out.push({ rule, level, msg, line: idx == null ? undefined : lineOf(idx) });
  const isMarkup = ['.tsx', '.jsx', '.html', '.vue', '.svelte', '.astro'].includes(ext);
  const isStyle = ['.css', '.scss'].includes(ext);
  const isCode = !isStyle && ext !== '.html';

  if (isMarkup) {
    for (const m of text.matchAll(/<canvas\b[^>]*>/gi)) {
      if (!/aria-hidden/.test(m[0]) && !/aria-label|role=/.test(m[0]))
        add('canvas-aria', 'warn', 'Canvas sin aria-hidden (si es decorativo) ni nombre accesible. Mantén el contenido en DOM.', m.index);
    }
  }

  if (isCode) {
    if (ANIM_IMPORT.test(text) && project && !project.hasReduced)
      add('reduced-motion', 'error', 'El proyecto anima (gsap/three/R3F/lenis/motion) pero no hay rastro de prefers-reduced-motion.', text.search(ANIM_IMPORT));

    const raf = text.search(/\brequestAnimationFrame\s*\(/);
    if (raf >= 0 && project && (project.rafFiles.size > 1 || project.usesGsap))
      add('single-clock', 'warn', `requestAnimationFrame propio y ${project.usesGsap ? 'GSAP en el proyecto' : `${project.rafFiles.size} archivos con rAF`}: usa un reloj único (gsap.ticker o useFrame).`, raf);

    for (const m of text.matchAll(/useFrame\s*\(/g)) {
      const chunk = text.slice(m.index, m.index + 700);
      if (/\bset[A-Z]\w*\s*\(/.test(chunk))
        add('frame-setstate', 'error', 'setState dentro de useFrame: re-render por frame. Usa refs y muta el objeto.', m.index);
    }

    const creates = text.search(/new\s+(?:\w+Geometry|\w+Material|WebGLRenderer|\w*Texture|WebGLRenderTarget)\s*\(/);
    if (creates >= 0 && !/\.dispose\s*\(/.test(text))
      add('dispose', 'warn', 'Crea geometrías, materiales, texturas o renderer sin ningún dispose() en el archivo.', creates);

    const adds = (text.match(/addEventListener\s*\(/g) || []).length;
    const removes = (text.match(/removeEventListener\s*\(/g) || []).length;
    if (adds > removes && !/\bsignal\b|AbortController/.test(text))
      add('listeners', 'warn', `${adds} addEventListener y ${removes} removeEventListener sin AbortController/signal: posible fuga al desmontar.`, text.search(/addEventListener\s*\(/));

    const lenis = text.search(/new\s+Lenis\s*\(|<ReactLenis\b/);
    if (lenis >= 0 && !/autoRaf\s*:\s*false/.test(text))
      add('lenis-raf', 'warn', 'Lenis sin autoRaf:false: crea un segundo requestAnimationFrame. Conéctalo al ticker.', lenis);

    const lerp = text.search(/\+=\s*\(\s*[\w.[\]]+\s*-\s*[\w.[\]]+\s*\)\s*\*\s*0?\.\d+/);
    if (lerp >= 0)
      add('fixed-lerp', 'warn', 'Lerp con factor fijo por frame: cambia la sensación a 60/120 Hz. Usa damp(current, target, lambda, dt).', lerp);

    const fromIdx = text.search(/gsap\.from\s*\(/);
    if (fromIdx >= 0 && /from\s+['"]react['"]|useEffect|useLayoutEffect|useGSAP/.test(text))
      add('gsap-from-react', 'warn', 'gsap.from() en un componente React: con montaje doble (StrictMode/HMR) puede tomar como destino el estado oculto. Usa gsap.fromTo con destino explícito.', fromIdx);

    const tl = text.search(/gsap\.(from|fromTo)\s*\(/);
    if (tl >= 0 && !/progress\s*\(\s*1\s*\)|lagSmoothing\s*\(\s*0/.test(text) && /h1|title|headline|kinetic|titular/i.test(text))
      add('intro-safety', 'warn', 'Entrada gsap.from en un titular sin seguro: con pestaña oculta o pocos fps puede quedar invisible. Completa con progress(1) tras 2–3 s.', tl);
  }

  if (isStyle || isMarkup) {
    const touch = text.search(/(html|body|\*)\s*\{[^}]*touch-action\s*:\s*none/);
    if (touch >= 0) add('touch-action', 'error', 'touch-action:none global: bloquea el scroll táctil.', touch);
    const outline = text.search(/outline\s*:\s*(none|0)\b/);
    if (outline >= 0 && !/focus-visible/.test(text))
      add('focus', 'warn', 'outline:none sin estilo :focus-visible en el mismo archivo.', outline);
  }
  return out;
}

async function* walk(dir, budget) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (budget.n <= 0) return;
    if (SKIP.has(e.name) || e.name.startsWith('.') && e.isDirectory()) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p, budget);
    else if (EXTS.has(extname(e.name))) { budget.n--; yield p; }
  }
}

async function findRoot(start) {
  let dir = start;
  for (let i = 0; i < 12; i++) {
    try { await stat(join(dir, 'package.json')); return dir; } catch {}
    const up = dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return start;
}

async function projectFacts(root) {
  const facts = { root, hasReduced: false, usesGsap: false, rafFiles: new Set() };
  for await (const f of walk(root, { n: MAX_FILES })) {
    const t = await readFile(f, 'utf8').catch(() => '');
    if (REDUCED.test(t)) facts.hasReduced = true;
    if (/from\s+['"]gsap['"]/.test(t)) facts.usesGsap = true;
    if (/\brequestAnimationFrame\s*\(/.test(t)) facts.rafFiles.add(f);
  }
  return facts;
}

async function readStdin() {
  let s = '';
  for await (const chunk of process.stdin) s += chunk;
  return s;
}

const format = (file, root, f) => `${relative(root, file) || file}${f.line ? ':' + f.line : ''} [${f.level}] ${f.rule}: ${f.msg}`;

if (process.argv.includes('--hook')) {
  // Nunca bloquear la edición: cualquier fallo del guardián termina en silencio con código 0.
  try {
    const input = JSON.parse((await readStdin()) || '{}');
    const file = input.tool_input?.file_path || input.tool_input?.path;
    if (!file || !EXTS.has(extname(file)) || /node_modules|[\\/]\.next[\\/]|[\\/]dist[\\/]/.test(file)) process.exit(0);
    const text = await readFile(file, 'utf8');
    const root = await findRoot(dirname(resolve(file)));
    const findings = checkFile(file, text, await projectFacts(root));
    if (findings.length) {
      const lines = findings.map((f) => format(file, root, f));
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `immersive-guard (estándar award-grade-web) en ${relative(root, file)}:\n- ${lines.join('\n- ')}\nRevisa si aplican; son heurísticas, no bloquean.`,
        },
      }));
    }
  } catch {}
  process.exit(0);
}

const targets = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!targets.length) {
  console.error('Uso: node scripts/immersive-guard.mjs <archivo|carpeta> [...]');
  process.exit(2);
}
let errors = 0;
let warns = 0;
for (const target of targets) {
  const abs = resolve(target);
  const info = await stat(abs).catch(() => null);
  if (!info) { console.error(`No existe: ${target}`); errors++; continue; }
  const root = await findRoot(info.isDirectory() ? abs : dirname(abs));
  let tErrors = 0;
  let tWarns = 0;
  const facts = await projectFacts(root);
  const files = [];
  if (info.isDirectory()) for await (const f of walk(abs, { n: MAX_FILES })) files.push(f);
  else files.push(abs);
  for (const f of files) {
    const findings = checkFile(f, await readFile(f, 'utf8'), facts);
    for (const x of findings) {
      console.log(format(f, root, x));
      if (x.level === 'error') { errors++; tErrors++; } else { warns++; tWarns++; }
    }
  }
  console.log(`\n${relative(process.cwd(), abs) || '.'}: ${files.length} archivos, ${errors} errores, ${warns} avisos.`);
}
process.exit(errors ? 1 : 0);
