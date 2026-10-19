import {
  ACESFilmicToneMapping,
  CanvasTexture,
  CircleGeometry,
  Color,
  IcosahedronGeometry,
  LatheGeometry,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  InstancedMesh,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  Texture,
  WebGLRenderer,
  BufferGeometry,
} from "three";
import { damp } from "@/lib/award/runtime";

/**
 * Horma de Queso Semiduro procedural para la portada.
 * Sin modelos ni texturas externas: geometría de three.js y texturas dibujadas en canvas.
 * Lanza si WebGL no está disponible; quien llama muestra la alternativa estática.
 */

export interface CheeseScene {
  /** px, py en [-1, 1]; cut en [0, 1] (progreso de scroll); motion = false fija el reposo. */
  update(dt: number, px: number, py: number, cut: number, motion: boolean): void;
  render(): void;
  resize(width: number, height: number): void;
  info(): { calls: number; triangles: number; dpr: number };
  /** Centro y radio aproximados de la horma en píxeles del canvas (para el área de arrastre). */
  wheelScreen(): { x: number; y: number; r: number };
  /**
   * Encuadre adaptativo en pantallas anchas: desplaza (y si hace falta reduce) la horma para que
   * quede a la derecha de las líneas del titular que coinciden con ella en altura (px del canvas).
   */
  fitRightOf(lines: { right: number; top: number; bottom: number }[]): void;
  /** «Queso que sí dora»: 0 = pasta cruda, 1 = caras de corte doradas como al sartén. */
  setBrown(t: number): void;
  dispose(): void;
}

interface Options {
  maxDpr?: number;
  onContextLost?: () => void;
  onContextRestored?: () => void;
}

const R = 1.55; // radio de la horma
const H = 0.82; // altura
const WEDGE = Math.PI / 3.2; // ángulo de la cuña
const BEVEL = 0.1; // canto redondeado de la horma

// Generador pseudoaleatorio determinista: misma horma en cada carga y captura.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Corteza: dorado tostado con moteado, como un semiduro oreado. */
function rindTexture() {
  const r = rng(7);
  const t = canvasTexture(1024, 256, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#d9a24c");
    g.addColorStop(0.5, "#c88d3c");
    g.addColorStop(1, "#a8702c");
    c.fillStyle = g;
    c.fillRect(0, 0, 1024, 256);
    for (let i = 0; i < 2600; i++) {
      const a = r() * 0.22;
      c.fillStyle = r() > 0.5 ? `rgba(92,52,18,${a})` : `rgba(255,226,160,${a})`;
      c.beginPath();
      c.arc(r() * 1024, r() * 256, r() * 3.2 + 0.4, 0, Math.PI * 2);
      c.fill();
    }
    // Marca de la tela del molde.
    c.strokeStyle = "rgba(90,52,20,0.18)";
    c.lineWidth = 1;
    for (let y = 8; y < 256; y += 9) {
      c.beginPath();
      c.moveTo(0, y + Math.sin(y) * 2);
      c.lineTo(1024, y + Math.cos(y) * 2);
      c.stroke();
    }
  });
  t.wrapS = RepeatWrapping;
  return t;
}

/** Tapa: corteza clara con el sello circular de la casa grabado. */
function capTexture() {
  const r = rng(11);
  return canvasTexture(1024, 1024, (c) => {
    const g = c.createRadialGradient(512, 512, 60, 512, 512, 520);
    g.addColorStop(0, "#e3b05c");
    g.addColorStop(0.85, "#cf9443");
    g.addColorStop(1, "#a9702d");
    c.fillStyle = g;
    c.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 3800; i++) {
      c.fillStyle = r() > 0.55 ? `rgba(95,55,20,${r() * 0.16})` : `rgba(255,232,170,${r() * 0.18})`;
      c.beginPath();
      c.arc(r() * 1024, r() * 1024, r() * 3 + 0.4, 0, Math.PI * 2);
      c.fill();
    }
    // Sello en bajorrelieve: sombra + luz desplazadas.
    const stamp = (dx: number, dy: number, color: string) => {
      c.save();
      c.translate(512 + dx, 512 + dy);
      c.strokeStyle = color;
      c.fillStyle = color;
      c.lineWidth = 7;
      c.beginPath();
      c.arc(0, 0, 300, 0, Math.PI * 2);
      c.stroke();
      c.lineWidth = 3;
      c.beginPath();
      c.arc(0, 0, 262, 0, Math.PI * 2);
      c.stroke();
      c.font = "700 64px 'Arial Black', Arial, sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      const text = "LA CENTRAL DEL QUESO · LA CENTRAL DEL QUESO · ";
      const step = (Math.PI * 2) / text.length;
      for (let i = 0; i < text.length; i++) {
        c.save();
        c.rotate(i * step - Math.PI / 2);
        c.translate(0, -282 + 0);
        c.font = "700 30px 'Arial Black', Arial, sans-serif";
        c.fillText(text[i], 0, 0);
        c.restore();
      }
      c.font = "900 150px Georgia, 'Times New Roman', serif";
      c.fillText("Q", 0, -10);
      c.font = "700 30px 'Arial Black', Arial, sans-serif";
      c.fillText("SEMIDURO", 0, 105);
      c.restore();
    };
    stamp(3, 3, "rgba(80,45,15,0.32)");
    stamp(-2, -2, "rgba(255,236,190,0.30)");
  });
}

/** Pasta: u = 0 en el centro de la horma, u = 1 en la corteza. Ojos, moteado y franja de corteza. */
function pasteTexture() {
  const r = rng(23);
  return canvasTexture(1024, 512, (c) => {
    c.scale(2, 2);
    const g = c.createLinearGradient(0, 0, 512, 0);
    g.addColorStop(0, "#f7ebc6");
    g.addColorStop(0.75, "#f4e3b2");
    g.addColorStop(0.93, "#ecd08a");
    g.addColorStop(0.965, "#d9a24c");
    g.addColorStop(1, "#a8702c");
    c.fillStyle = g;
    c.fillRect(0, 0, 512, 256);
    // Bajo la tapa y sobre la base la pasta también amarillea antes de la corteza.
    const v = c.createLinearGradient(0, 0, 0, 256);
    v.addColorStop(0, "rgba(168,112,44,0.95)");
    v.addColorStop(0.035, "rgba(217,162,76,0.55)");
    v.addColorStop(0.09, "rgba(236,208,138,0)");
    v.addColorStop(0.91, "rgba(236,208,138,0)");
    v.addColorStop(0.965, "rgba(217,162,76,0.55)");
    v.addColorStop(1, "rgba(168,112,44,0.95)");
    c.fillStyle = v;
    c.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 1400; i++) {
      c.fillStyle = r() > 0.5 ? `rgba(190,150,80,${r() * 0.12})` : `rgba(255,252,236,${r() * 0.2})`;
      c.fillRect(r() * 480, 10 + r() * 236, 1 + r() * 1.5, 1 + r() * 1.5);
    }
    for (let i = 0; i < 78; i++) {
      const x = 20 + r() * 440;
      const y = 22 + r() * 212;
      const rx = 1 + r() * r() * 7;
      const ry = rx * (0.55 + r() * 0.4);
      c.fillStyle = "rgba(170,130,60,0.38)";
      c.beginPath();
      c.ellipse(x, y, rx, ry, r() * Math.PI, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "rgba(255,250,230,0.55)";
      c.beginPath();
      c.ellipse(x - rx * 0.25, y - ry * 0.3, rx * 0.5, ry * 0.4, 0, 0, Math.PI * 2);
      c.fill();
    }
  });
}

function shadowTexture() {
  return canvasTexture(256, 256, (c) => {
    const g = c.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(0.55, "rgba(0,0,0,0.22)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
  });
}

/** Perfil de la horma (radio, altura) con canto redondeado, de la tapa a la base. */
function wheelProfile(): Vector2[] {
  const pts: Vector2[] = [new Vector2(0, H / 2), new Vector2(R - BEVEL, H / 2)];
  const steps = 6;
  for (let i = 1; i <= steps; i++) {
    const t = Math.PI / 2 - (i / steps) * (Math.PI / 2);
    pts.push(new Vector2(R - BEVEL + BEVEL * Math.cos(t), H / 2 - BEVEL + BEVEL * Math.sin(t)));
  }
  for (let i = 1; i <= steps; i++) {
    const t = -(i / steps) * (Math.PI / 2);
    pts.push(new Vector2(R - BEVEL + BEVEL * Math.cos(t), -H / 2 + BEVEL + BEVEL * Math.sin(t)));
  }
  pts.push(new Vector2(0, -H / 2));
  return pts;
}

/** Torno parcial; la corteza se repite 4 veces por vuelta para que cuña y horma tengan la misma densidad. */
function latheSector(phiStart: number, phiLength: number, segments: number) {
  const geo = new LatheGeometry(wheelProfile(), segments, phiStart, phiLength);
  const uv = geo.attributes.uv;
  const k = (phiLength / (Math.PI * 2)) * 4;
  for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * k);
  uv.needsUpdate = true;
  return geo;
}

/** Cara de corte con la misma silueta del perfil; u = radio / R, v = altura. */
function cutFaceGeometry() {
  const shape = new Shape(wheelProfile());
  const geo = new ShapeGeometry(shape, 6);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / R, (pos.getY(i) + H / 2) / H);
  uv.needsUpdate = true;
  return geo;
}

function cutFace(geo: BufferGeometry, mat: Material, a: number) {
  const m = new Mesh(geo, mat);
  m.rotation.y = a - Math.PI / 2;
  return m;
}

/** Sello de la tapa como calco en sector circular (UV planas: continúa entre horma y cuña). */
function capDecal(phiStart: number, phiLength: number, segments: number) {
  const geo = new CircleGeometry(R - BEVEL, segments, phiStart - Math.PI / 2, phiLength);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, H / 2 + 0.002, 0);
  return geo;
}

export function createCheeseScene(canvas: HTMLCanvasElement, opts: Options = {}): CheeseScene {
  const maxDpr = opts.maxDpr ?? 1.5;
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "default",
    failIfMajorPerformanceCaveat: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 60);
  camera.position.set(0, 3.1, 9.2);
  camera.lookAt(0, 0.1, 0);

  scene.add(new HemisphereLight(0xfff1d6, 0x163022, 1.15));
  const key = new DirectionalLight(0xffd8a0, 2.6);
  key.position.set(-4, 6, 5);
  scene.add(key);
  const rim = new DirectionalLight(0xbfe3c4, 1.1);
  rim.position.set(5, 2, -5);
  scene.add(rim);

  // Recursos propios (todos se liberan en dispose).
  const textures: Texture[] = [rindTexture(), capTexture(), pasteTexture(), shadowTexture()];
  const [rindTex, capTex, pasteTex, shadowTex] = textures;
  rindTex.repeat.set(1, 1);
  // La propia textura de corteza sirve de relieve: el moteado se lee como superficie oreada.
  const rindMat = new MeshStandardMaterial({ map: rindTex, bumpMap: rindTex, bumpScale: 0.9, roughness: 0.84, metalness: 0 });
  const capMat = new MeshStandardMaterial({ map: capTex, roughness: 0.78, metalness: 0 });
  // Emisivo cálido leve: la pasta se lee crema aunque la luz de contorno (verde) la alcance.
  const pasteMat = new MeshStandardMaterial({ map: pasteTex, roughness: 0.62, metalness: 0, side: DoubleSide, emissive: new Color("#f3dca0"), emissiveIntensity: 0.22 });
  const crumbMat = new MeshStandardMaterial({ color: new Color("#f4e3b2"), roughness: 0.8, flatShading: true, side: DoubleSide });
  const shadowMat = new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
  const materials: Material[] = [rindMat, capMat, pasteMat, crumbMat, shadowMat];
  const PASTE_RAW = new Color("#ffffff");
  const PASTE_GOLD = new Color("#d98a3a");
  const EMISSIVE_RAW = new Color("#f3dca0");
  const EMISSIVE_GOLD = new Color("#ff8a2a");

  const bodyGeo = latheSector(WEDGE / 2, Math.PI * 2 - WEDGE, 96);
  const wedgeGeo = latheSector(-WEDGE / 2, WEDGE, 20);
  const bodyCapGeo = capDecal(WEDGE / 2, Math.PI * 2 - WEDGE, 96);
  const wedgeCapGeo = capDecal(-WEDGE / 2, WEDGE, 20);
  const faceGeo = cutFaceGeometry();
  const shadowGeo = new PlaneGeometry(1, 1);
  const crumbGeo = new IcosahedronGeometry(0.1, 0);
  const geometries: BufferGeometry[] = [bodyGeo, wedgeGeo, bodyCapGeo, wedgeCapGeo, faceGeo, shadowGeo, crumbGeo];

  const wheel = new Group();
  const body = new Group();
  body.add(new Mesh(bodyGeo, rindMat), new Mesh(bodyCapGeo, capMat));
  body.add(cutFace(faceGeo, pasteMat, WEDGE / 2), cutFace(faceGeo, pasteMat, -WEDGE / 2));
  const wedge = new Group();
  wedge.add(new Mesh(wedgeGeo, rindMat), new Mesh(wedgeCapGeo, capMat));
  wedge.add(cutFace(faceGeo, pasteMat, WEDGE / 2), cutFace(faceGeo, pasteMat, -WEDGE / 2));
  wheel.add(body, wedge);

  const shadow = new Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -H / 2 - 0.01;
  shadow.scale.set(R * 3.1, R * 3.1, 1);

  // Dados de queso en tres capas de profundidad: 3 draw calls, sin actualizar matrices por frame.
  const dummy = new Object3D();
  const r = rng(5);
  const layers = [0.35, 0.7, 1.15].map((depth, li) => {
    const count = [5, 4, 3][li];
    const mesh = new InstancedMesh(crumbGeo, crumbMat, count);
    for (let i = 0; i < count; i++) {
      // Solo en el semicírculo derecho y detrás: nunca sobre el titular (que vive a la izquierda).
      const a = -Math.PI / 2 + ((i + 0.5) / count) * Math.PI + (r() - 0.5) * 0.3;
      const rad = 2.3 + r() * 0.9 + li * 0.25;
      dummy.position.set(Math.cos(a) * rad, (r() - 0.3) * 1.8, Math.sin(a) * rad * 0.55 - 0.6 + li * 0.4);
      dummy.rotation.set(r() * 3, r() * 3, r() * 3);
      const sc = 0.75 + li * 0.4 + r() * 0.35;
      // Virutas: planas y alargadas, como raspaduras de pasta.
      dummy.scale.set(sc * (1.1 + r() * 0.7), sc * (0.18 + r() * 0.12), sc * (0.7 + r() * 0.4));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    const g = new Group();
    g.add(mesh);
    return { g, mesh, depth };
  });

  const rig = new Group();
  rig.add(wheel, shadow, ...layers.map((l) => l.g));
  scene.add(rig);

  const pose = { rx: 0, ry: 0, cut: 0, spin: 0, bob: 0, lx: 0, ly: 0 };
  let dpr = 1;
  let viewShift = 0;
  let size = { w: 1, h: 1 };
  let narrow = false;

  const onLost = (e: Event) => {
    e.preventDefault();
    opts.onContextLost?.();
  };
  const onRestored = () => opts.onContextRestored?.();
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  return {
    update(dt, px, py, cut, motion) {
      if (motion) {
        // Inclinación acotada hacia el cursor y deriva lenta propia.
        pose.rx = damp(pose.rx, -py * 0.22, 3.5, dt);
        pose.ry = damp(pose.ry, px * 0.55, 3.5, dt);
        pose.cut = damp(pose.cut, cut, 6, dt);
        // Deriva acotada (oscilación, no vueltas): la cuña sale siempre hacia el espectador.
        pose.spin = Math.sin(pose.bob * 0.22) * 0.32 * (1 - pose.cut);
        pose.lx = damp(pose.lx, px, 4, dt);
        pose.ly = damp(pose.ly, py, 4, dt);
        pose.bob += Math.min(dt, 0.05);
      } else {
        pose.rx = 0;
        pose.ry = 0;
        pose.lx = 0;
        pose.ly = 0;
        pose.cut = cut;
      }
      const c = pose.cut;
      // La horma gira para enseñar el corte a medida que la cuña sale.
      // Al cortar, la horma gira un poco a la derecha: la cuña sale hacia el espectador, lejos del titular.
      // En vertical la cuña sale hacia arriba a la derecha, lejos del texto que está debajo.
      wheel.rotation.set(0.12 + pose.rx, -0.35 + pose.ry + pose.spin + c * (narrow ? 1.05 : 0.22), 0);
      wheel.position.y = motion ? Math.sin(pose.bob * 0.9) * 0.05 : 0;
      // La cuña se desliza hacia el espectador y se inclina, como al servirla.
      const out = 0.12 + c * (narrow ? 0.8 : 1.0);
      wedge.position.set(0, c * (narrow ? 0.32 : 0.3), out);
      wedge.rotation.set(c * 0.35, 0, -c * 0.12);
      for (const l of layers) {
        l.g.position.set(pose.lx * l.depth * 0.6, pose.ly * l.depth * 0.4, 0);
        l.g.rotation.y = pose.spin * (0.4 + l.depth * 0.3);
      }
    },
    render() {
      renderer.render(scene, camera);
    },
    resize(width, height) {
      size = { w: Math.max(1, width), h: Math.max(1, height) };
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      renderer.setPixelRatio(dpr);
      renderer.setSize(size.w, size.h, false);
      const aspect = size.w / size.h;
      camera.aspect = aspect;
      narrow = aspect < 1.05;
      // Ancho: la horma vive en la mitad derecha. Estrecho: arriba, lejos del titular.
      if (aspect >= 1.5) {
        viewShift = -size.w * 0.2;
        camera.fov = 28;
        rig.scale.setScalar(1);
        rig.position.set(0, 0.15, 0);
      } else if (aspect >= 1.05) {
        // Proporción intermedia: más pequeña y arriba a la derecha, por encima del titular.
        // Escala base mayor: el encuadre adaptativo (fitRightOf) se encarga de los solapes con el titular.
        viewShift = -size.w * 0.26;
        camera.fov = 30;
        rig.scale.setScalar(0.86);
        rig.position.set(0, 0.55, 0);
      } else {
        viewShift = 0;
        camera.fov = 34;
        rig.scale.setScalar(0.78);
        rig.position.set(0, 1.55, 0);
      }
      camera.setViewOffset(size.w, size.h, viewShift, 0, size.w, size.h);
      camera.updateProjectionMatrix();
    },
    info() {
      return { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, dpr };
    },
    wheelScreen() {
      // Antes del primer render la matriz de vista aún no existe: calcularla para proyectar bien.
      camera.updateMatrixWorld();
      wheel.updateWorldMatrix(true, false);
      const c = new Vector3();
      wheel.getWorldPosition(c);
      const edge = c.clone().add(new Vector3(R * rig.scale.x, 0, 0));
      c.project(camera);
      edge.project(camera);
      const x = (c.x * 0.5 + 0.5) * size.w;
      const y = (-c.y * 0.5 + 0.5) * size.h;
      const ex = (edge.x * 0.5 + 0.5) * size.w;
      return { x, y, r: Math.abs(ex - x) };
    },
    setBrown(t) {
      const k = Math.min(1, Math.max(0, t));
      pasteMat.color.copy(PASTE_RAW).lerp(PASTE_GOLD, k * 0.62);
      pasteMat.emissive.copy(EMISSIVE_RAW).lerp(EMISSIVE_GOLD, k * 0.7);
      pasteMat.emissiveIntensity = 0.22 + k * 0.16;
      pasteMat.roughness = 0.62 - k * 0.22; // la costra dorada brilla un poco
    },
    fitRightOf(lines) {
      if (narrow) return;
      const margin = 28;
      for (let k = 0; k < 10; k++) {
        rig.updateWorldMatrix(true, true);
        const w = this.wheelScreen();
        // Solo cuentan las líneas que comparten franja vertical con la horma (vista en 3/4: ~0,75 r).
        const top = w.y - w.r * 0.75;
        const bottom = w.y + w.r * 0.95;
        const leftLimit = lines.filter((l) => l.bottom > top && l.top < bottom).reduce((m, l) => Math.max(m, l.right), 0);
        if (leftLimit <= 0) break;
        // 1,2 × radio: deja sitio a la cuña cuando sale.
        const left = w.x - w.r * 1.2;
        const right = w.x + w.r * 1.2;
        if (left >= leftLimit + margin) break;
        const free = size.w - 16 - (leftLimit + margin);
        const diam = right - left;
        if (diam > free && free > 0) {
          // Antes de encoger, subir la horma: arriba solo están las líneas cortas del titular.
          if (top > 96 && k < 3) {
            rig.position.y += 0.18;
            continue;
          }
          rig.scale.multiplyScalar(Math.max(0.5, free / diam));
        } else {
          viewShift -= leftLimit + margin - left;
          camera.setViewOffset(size.w, size.h, viewShift, 0, size.w, size.h);
          camera.updateProjectionMatrix();
        }
      }
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      layers.forEach((l) => l.mesh.dispose());
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
    },
  };
}
