// Motor de la secuencia de fotogramas, independiente de React.
//
// - Scroll nativo: el progreso sale de window.scrollY y de medidas cacheadas
//   (solo se recalculan al redimensionar).
// - Un único bucle requestAnimationFrame que se despierta con scroll, resize o
//   cuando llega un fotograma, y se duerme cuando el progreso suavizado llega
//   al objetivo. Solo dibuja si cambia la imagen a mostrar.
// - Las capas de texto y el indicador se actualizan escribiendo estilos en los
//   elementos (sin estado de React por fotograma).

import { frameUrl, type FincaManifest, type FrameVariantKey, type Tramo } from "./fincaManifest";

export interface FrameSequenceElements {
  section: HTMLElement;
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  layers: ReadonlyArray<HTMLElement | null>;
  /** Capas de escena opcionales por tramo (objetos tocables): solo opacidad. */
  sceneLayers?: ReadonlyArray<HTMLElement | null>;
  /** Relleno de la línea de progreso vertical (se escala en Y de 0 a 1). */
  progressFill: HTMLElement | null;
  steps: ReadonlyArray<HTMLElement | null>;
}

export interface FrameSequenceHandle {
  scrollToTramo: (index: number) => void;
  destroy: () => void;
}

const MAX_DPR = 2;
const MAX_CONCURRENT_LOADS = 6;
const COARSE_STEP = 8;
/** Fotogramas finos que se cargan a cada lado del que se ve (los gruesos se cargan todos). */
const FINE_WINDOW = 30;
const FINE_WINDOW_SAVE_DATA = 6;
/** Constante de tiempo (ms) del suavizado del progreso. */
const SMOOTHING_MS = 90;
const SETTLE_EPSILON = 0.0005;
const LAYER_SHIFT_PX = 10;

const IDLE = 0;
const LOADING = 1;
const READY = 2;
const FAILED = 3;

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge1 <= edge0) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function fadeLength(tramo: Tramo): number {
  return Math.min(0.03, (tramo.end - tramo.start) * 0.25);
}

/** Opacidad de la capa de texto del tramo `index` para un progreso `p`. */
export function tramoOpacity(tramos: ReadonlyArray<Tramo>, index: number, p: number): number {
  const tramo = tramos[index];
  const fade = fadeLength(tramo);
  const fadeIn = index === 0 ? (p >= tramo.start ? 1 : 0) : smoothstep(tramo.start, tramo.start + fade, p);
  const fadeOut = index === tramos.length - 1 ? 1 : 1 - smoothstep(tramo.end - fade, tramo.end, p);
  return Math.max(0, Math.min(fadeIn, fadeOut));
}

/** Progreso al que conviene saltar para ver el tramo con su texto ya visible. */
export function tramoEntryProgress(tramos: ReadonlyArray<Tramo>, index: number): number {
  const tramo = tramos[index];
  if (!tramo || index === 0) return 0;
  return Math.min(tramo.end, tramo.start + fadeLength(tramo) + 0.002);
}

interface FrameLoader {
  readonly variant: FrameVariantKey;
  readonly images: Array<HTMLImageElement | null>;
  readonly status: Uint8Array;
  readyCount(): number;
  /** Reanuda la carga (al cambiar de fotograma objetivo o volver a la vista). */
  pump(): void;
  /** Deja de pedir fotogramas y cancela los que están en curso; conserva los listos. */
  halt(): void;
  /** Libera todas las imágenes. */
  destroy(): void;
}

interface LoaderHooks {
  targetIndex: () => number;
  /** false mientras la sección está fuera de vista: no se descarga nada. */
  canLoad: () => boolean;
  onReady: (loader: FrameLoader, index: number) => void;
  onPosterFailed: (loader: FrameLoader) => void;
}

function createLoader(manifest: FincaManifest, variantKey: FrameVariantKey, hooks: LoaderHooks): FrameLoader {
  const variant = manifest.variants[variantKey];
  const count = manifest.frameCount;
  const images: Array<HTMLImageElement | null> = new Array(count).fill(null);
  const status = new Uint8Array(count);
  let ready = 0;
  let active = 0;
  let halted = false;
  let posterSettled = false;

  // Orden: fotograma 1 (póster) → cada 8.º (y el último) → resto por cercanía
  // al fotograma que se está viendo.
  const coarse: number[] = [];
  for (let i = COARSE_STEP; i < count; i += COARSE_STEP) coarse.push(i);
  if (count > 1 && coarse[coarse.length - 1] !== count - 1) coarse.push(count - 1);
  let coarseCursor = 0;
  const isCoarse = new Uint8Array(count);
  isCoarse[0] = 1;
  coarse.forEach((i) => (isCoarse[i] = 1));
  // Con "ahorro de datos" la ventana fina es mínima.
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const fineWindow = connection?.saveData ? FINE_WINDOW_SAVE_DATA : FINE_WINDOW;

  const loader: FrameLoader = {
    variant: variantKey,
    images,
    status,
    readyCount: () => ready,
    pump,
    halt,
    destroy,
  };

  function nextIndex(): number {
    if (!posterSettled) return -1;
    while (coarseCursor < coarse.length) {
      const i = coarse[coarseCursor++];
      if (status[i] === IDLE) return i;
    }
    const t = Math.min(count - 1, Math.max(0, hooks.targetIndex()));
    for (let d = 0; d <= fineWindow; d++) {
      const ahead = t + d;
      if (ahead < count && status[ahead] === IDLE) return ahead;
      const behind = t - d;
      if (behind >= 0 && status[behind] === IDLE) return behind;
    }
    return -1;
  }

  // Libera los fotogramas finos lejanos para acotar la memoria de imágenes decodificadas.
  function evict(t: number) {
    const limit = fineWindow * 2;
    for (let i = 1; i < count; i++) {
      if (isCoarse[i] || status[i] !== READY || Math.abs(i - t) <= limit) continue;
      images[i]?.removeAttribute("src");
      images[i] = null;
      status[i] = IDLE;
      ready--;
    }
  }

  function pump() {
    if (halted || !hooks.canLoad()) return;
    evict(Math.min(count - 1, Math.max(0, hooks.targetIndex())));
    while (!halted && active < MAX_CONCURRENT_LOADS) {
      const i = nextIndex();
      if (i < 0) return;
      load(i);
    }
  }

  function load(index: number) {
    status[index] = LOADING;
    active++;
    const img = new Image();
    img.decoding = "async";
    images[index] = img;
    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      img.onload = null;
      img.onerror = null;
      if (halted) return;
      active--;
      if (ok) {
        status[index] = READY;
        ready++;
      } else {
        status[index] = FAILED;
        images[index] = null;
      }
      if (index === 0) {
        posterSettled = true;
        if (!ok) {
          hooks.onPosterFailed(loader);
          return;
        }
      }
      if (ok) hooks.onReady(loader, index);
      pump();
    };

    const url = frameUrl(variant, index + 1, manifest.pad);
    if (typeof img.decode === "function") {
      img.src = url;
      img.decode().then(
        () => finish(true),
        // decode() también puede rechazar con la imagen cargada (p. ej. presión de memoria).
        () => finish(img.complete && img.naturalWidth > 0),
      );
    } else {
      img.onload = () => finish(true);
      img.onerror = () => finish(false);
      img.src = url;
    }
  }

  function halt() {
    if (halted) return;
    halted = true;
    for (let i = 0; i < count; i++) {
      if (status[i] === LOADING) {
        const img = images[i];
        if (img) {
          img.onload = null;
          img.onerror = null;
          img.removeAttribute("src");
        }
        images[i] = null;
        status[i] = IDLE;
      }
    }
  }

  function destroy() {
    halt();
    for (let i = 0; i < count; i++) {
      const img = images[i];
      if (img) img.removeAttribute("src");
      images[i] = null;
      status[i] = IDLE;
    }
    ready = 0;
  }

  load(0);
  return loader;
}

export function createFrameSequence(
  manifest: FincaManifest,
  elements: FrameSequenceElements,
  onFatal: (reason: "canvas" | "frames") => void,
): FrameSequenceHandle {
  const { section, stage, canvas, layers, sceneLayers = [], progressFill, steps } = elements;
  const tramos = manifest.tramos;
  const lastIndex = manifest.frameCount - 1;

  let disposed = false;
  let fatal = false;

  // Medidas cacheadas (solo se recalculan en layout()).
  let sectionTop = 0;
  let scrollRange = 1;

  // Reloj y progreso.
  let rafId = 0;
  let running = false;
  let lastTime = 0;
  let target = 0;
  let current = -1;
  let inView = true;

  // Dibujo.
  let needsDraw = true;
  let drawnImage: HTMLImageElement | null = null;
  let canvasShown = false;

  // Caché de estilos escritos.
  const opacityCache = new Array<number>(tramos.length).fill(-1);
  let fillCache = -1;
  let activeStep = -1;
  let lastOverlayProgress = -1;
  let pumpedIndex = -1;

  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext("2d", { alpha: false });
  } catch {
    ctx = null;
  }

  function pickVariant(): FrameVariantKey {
    return window.innerHeight > window.innerWidth ? "mobile" : "desktop";
  }

  const hooks: LoaderHooks = {
    targetIndex: () => Math.round(clamp01(current < 0 ? target : current) * lastIndex),
    canLoad: () => inView && !disposed,
    onReady: (from, index) => {
      if (from === loader && index === 0 && previous) {
        previous.destroy();
        previous = null;
      }
      wake();
    },
    onPosterFailed: (from) => {
      if (from === loader) fail("frames");
    },
  };

  let loader: FrameLoader | null = null;
  let previous: FrameLoader | null = null;

  function fail(reason: "canvas" | "frames") {
    if (fatal || disposed) return;
    fatal = true;
    loader?.halt();
    previous?.halt();
    canvas.style.opacity = "0";
    onFatal(reason);
  }

  // ------------------------------------------------------------------ layout
  function layout() {
    const rect = section.getBoundingClientRect();
    sectionTop = rect.top + window.scrollY;
    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;
    scrollRange = Math.max(1, section.offsetHeight - stageHeight);

    const key = pickVariant();
    if (ctx && loader && key !== loader.variant) switchVariant(key);

    if (!ctx || stageWidth === 0 || stageHeight === 0) return;
    // Densidad: devicePixelRatio con tope 2 y sin superar la resolución útil
    // del fotograma (más píxeles no añaden detalle y cuestan memoria y relleno).
    const variant = manifest.variants[key];
    const cover = Math.max(stageWidth / variant.width, stageHeight / variant.height);
    const useful = Math.max(1, 1 / cover);
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR, useful);
    const width = Math.max(1, Math.round(stageWidth * dpr));
    const height = Math.max(1, Math.round(stageHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      configureContext();
      needsDraw = true;
      // Redibujar ya: cambiar el tamaño borra el lienzo.
      renderFrame(current < 0 ? readTarget() : current);
    }
  }

  function configureContext() {
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }

  function switchVariant(key: FrameVariantKey) {
    if (previous) previous.destroy();
    // Mantener la variante anterior para dibujar hasta que llegue el póster nuevo.
    if (loader && loader.readyCount() > 0) {
      loader.halt();
      previous = loader;
    } else {
      loader?.destroy();
      previous = null;
    }
    loader = createLoader(manifest, key, hooks);
    needsDraw = true;
  }

  // ------------------------------------------------------------------ dibujo
  function nearestReady(from: FrameLoader | null, index: number): HTMLImageElement | null {
    if (!from || from.readyCount() === 0) return null;
    const { status, images } = from;
    for (let d = 0; d <= lastIndex; d++) {
      const behind = index - d;
      if (behind >= 0 && status[behind] === READY) return images[behind];
      const ahead = index + d;
      if (d > 0 && ahead <= lastIndex && status[ahead] === READY) return images[ahead];
    }
    return null;
  }

  function drawCover(img: HTMLImageElement) {
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  function renderFrame(progress: number) {
    if (!ctx || fatal) return;
    const index = Math.round(clamp01(progress) * lastIndex);
    const img = nearestReady(loader, index) ?? nearestReady(previous, index);
    if (!img) return;
    if (img === drawnImage && !needsDraw) return;
    drawCover(img);
    drawnImage = img;
    needsDraw = false;
    if (!canvasShown) {
      canvasShown = true;
      canvas.style.opacity = "1";
    }
  }

  // ------------------------------------------------------------------ capas
  function renderOverlays(progress: number) {
    if (Math.abs(progress - lastOverlayProgress) < 0.0001) return;
    lastOverlayProgress = progress;
    let active = 0;
    for (let i = 0; i < tramos.length; i++) {
      const tramo = tramos[i];
      if (progress >= tramo.start) active = i;

      const opacity = tramoOpacity(tramos, i, progress);
      if (
        Math.abs(opacity - opacityCache[i]) > 0.002 ||
        (opacity !== opacityCache[i] && (opacity === 0 || opacity === 1))
      ) {
        opacityCache[i] = opacity;
        const layer = layers[i];
        if (layer) {
          layer.style.opacity = opacity.toFixed(3);
          layer.style.transform = `translate3d(0, ${((1 - opacity) * LAYER_SHIFT_PX).toFixed(1)}px, 0)`;
        }
        const scene = sceneLayers[i];
        if (scene) scene.style.opacity = opacity.toFixed(3);
      }

    }
    const fill = clamp01(progress);
    if (progressFill && (Math.abs(fill - fillCache) > 0.001 || (fill !== fillCache && (fill === 0 || fill === 1)))) {
      fillCache = fill;
      progressFill.style.transform = `scaleY(${fill.toFixed(4)})`;
    }
    if (active !== activeStep) {
      activeStep = active;
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (!step) continue;
        if (i === active) step.setAttribute("aria-current", "step");
        else step.removeAttribute("aria-current");
      }
    }
  }

  // ------------------------------------------------------------------ reloj
  function readTarget(): number {
    return clamp01((window.scrollY - sectionTop) / scrollRange);
  }

  function wake() {
    if (disposed || running || !inView) return;
    running = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function tick(now: number) {
    rafId = 0;
    if (disposed || !inView) {
      running = false;
      return;
    }
    // Sin tope superior: tras un fotograma lento el suavizado alcanza al scroll de inmediato.
    const dt = Math.max(0, now - lastTime);
    lastTime = now;
    target = readTarget();
    if (current < 0) {
      current = target;
    } else {
      current += (target - current) * (1 - Math.exp(-dt / SMOOTHING_MS));
      if (Math.abs(target - current) < SETTLE_EPSILON) current = target;
    }
    renderOverlays(current);
    renderFrame(current);
    // Al cambiar de fotograma, la ventana de carga se desplaza con él.
    const index = Math.round(clamp01(target) * lastIndex);
    if (index !== pumpedIndex) {
      pumpedIndex = index;
      loader?.pump();
    }
    if (current !== target) {
      rafId = requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  // ------------------------------------------------------------------ eventos
  const onScroll = () => wake();
  const onResize = () => {
    if (disposed) return;
    layout();
    wake();
  };
  // Tras perder y recuperar el contexto 2D el lienzo queda en blanco: redibujar.
  const onContextRestored = () => {
    if (disposed || fatal) return;
    configureContext();
    drawnImage = null;
    needsDraw = true;
    renderFrame(current < 0 ? readTarget() : current);
  };

  const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
  const intersectionObserver =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          (entries) => {
            const entry = entries[entries.length - 1];
            const wasInView = inView;
            inView = entry.isIntersecting;
            if (inView && !wasInView) {
              // Al volver a la sección, saltar al progreso real sin animar el atraso.
              current = -1;
              needsDraw = true;
              loader?.pump();
              wake();
            }
          },
          { rootMargin: "100px 0px" },
        )
      : null;

  // ------------------------------------------------------------------ inicio
  layout();
  if (ctx) {
    configureContext();
    loader = createLoader(manifest, pickVariant(), hooks);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  canvas.addEventListener("contextrestored", onContextRestored);
  resizeObserver?.observe(section);
  resizeObserver?.observe(stage);
  intersectionObserver?.observe(section);
  wake();

  if (!ctx) {
    // Sin canvas 2D: el póster <img> sigue visible y el contenido pasa a la versión estática.
    queueMicrotask(() => fail("canvas"));
  }

  return {
    scrollToTramo(index: number) {
      if (disposed) return;
      layout();
      const top = sectionTop + tramoEntryProgress(tramos, index) * scrollRange;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      running = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("contextrestored", onContextRestored);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      loader?.destroy();
      previous?.destroy();
      loader = null;
      previous = null;
      drawnImage = null;
      ctx = null;
      // Liberar el búfer del lienzo.
      canvas.width = 0;
      canvas.height = 0;
      canvas.style.opacity = "0";
    },
  };
}
