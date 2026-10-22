"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";
import * as THREE from "three";
import { gsap } from "gsap";

// Cortina de lino de la ventana de la lechería: dos paños cuelgan de una
// barra, se mecen con una brisa leve y se apartan al paso del cursor o del
// dedo. Física verlet en CPU (≈1.200 puntos) y render con three.js.
// Es decorativa: no recibe foco y la imagen de la ventana queda debajo.

const COLS = 18;
const ROWS = 34;
const ITERATIONS = 5;
const GRAVITY = 0.22; // px por paso²
const DAMPING = 0.982;
const RADIUS = 95; // px de influencia del cursor
const PUSH = 0.35;
const MAX_SPEED = 24; // px por paso: tope del empujón para que la tela no se dispare
const PANEL = 0.22; // ancho de cada paño: recogidos a los lados, la escena queda a la vista

type Cloth = {
  pos: Float32Array;
  prev: Float32Array;
  pinned: Uint8Array;
  pairs: Uint16Array;
  rest: Float32Array;
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
};

// vx/vy acumulan el desplazamiento desde el último paso y se consumen en él.
type Pointer = { x: number; y: number; vx: number; vy: number; active: boolean };

function linenTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d")!;
  g.fillStyle = "#ece4d4";
  g.fillRect(0, 0, size, size);
  for (let i = 0; i < size; i += 2) {
    g.fillStyle = `rgba(110, 92, 64, ${0.03 + Math.random() * 0.05})`;
    g.fillRect(0, i, size, 1);
    g.fillStyle = `rgba(110, 92, 64, ${0.02 + Math.random() * 0.04})`;
    g.fillRect(i, 0, 1, size);
  }
  // Irregularidades del hilo
  for (let k = 0; k < 160; k++) {
    g.fillStyle = `rgba(255, 250, 240, ${Math.random() * 0.22})`;
    g.fillRect(Math.random() * size, Math.random() * size, 6 + Math.random() * 18, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeCloth(x0: number, width: number, top: number, height: number, material: THREE.MeshStandardMaterial): Cloth {
  const count = COLS * ROWS;
  const pos = new Float32Array(count * 3);
  const pinned = new Uint8Array(count);
  const spacing = width / (COLS - 1);
  const dy = height / (ROWS - 1);
  const fold = spacing * 0.85; // profundidad de los pliegues fruncidos en la barra
  const uv = new Float32Array(count * 2);

  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const n = j * COLS + i;
      pos[n * 3] = x0 + i * spacing;
      pos[n * 3 + 1] = top - j * dy;
      pos[n * 3 + 2] = fold * Math.sin((i * Math.PI) / 2);
      pinned[n] = j === 0 ? 1 : 0;
      uv[n * 2] = (i / (COLS - 1)) * (width / 80);
      uv[n * 2 + 1] = (j / (ROWS - 1)) * (height / 80);
    }
  }

  // Restricciones estructurales y de cizalla; la longitud de reposo es la
  // inicial, así la tela arranca en equilibrio con sus pliegues.
  const pairs: number[] = [];
  const link = (a: number, b: number) => pairs.push(a, b);
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const n = j * COLS + i;
      if (i < COLS - 1) link(n, n + 1);
      if (j < ROWS - 1) link(n, n + COLS);
      if (i < COLS - 1 && j < ROWS - 1) {
        link(n, n + COLS + 1);
        link(n + 1, n + COLS);
      }
    }
  }
  const rest = new Float32Array(pairs.length / 2);
  for (let k = 0; k < rest.length; k++) {
    const a = pairs[k * 2] * 3;
    const b = pairs[k * 2 + 1] * 3;
    rest[k] = Math.hypot(pos[b] - pos[a], pos[b + 1] - pos[a + 1], pos[b + 2] - pos[a + 2]);
  }

  const index: number[] = [];
  for (let j = 0; j < ROWS - 1; j++) {
    for (let i = 0; i < COLS - 1; i++) {
      const n = j * COLS + i;
      index.push(n, n + COLS, n + 1, n + 1, n + COLS, n + COLS + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();

  return {
    pos,
    prev: pos.slice(),
    pinned,
    pairs: new Uint16Array(pairs),
    rest,
    mesh: new THREE.Mesh(geometry, material),
  };
}

function step(cloth: Cloth, pointer: Pointer, time: number) {
  const { pos, prev, pinned, pairs, rest } = cloth;
  const count = pinned.length;
  const raw = Math.hypot(pointer.vx, pointer.vy);
  const speed = Math.min(raw, MAX_SPEED);
  const scale = raw > 0 ? speed / raw : 0;
  const pvx = pointer.vx * scale;
  const pvy = pointer.vy * scale;

  for (let n = 0; n < count; n++) {
    if (pinned[n]) continue;
    const i = n * 3;
    const x = pos[i];
    const y = pos[i + 1];
    const z = pos[i + 2];
    let nx = x + (x - prev[i]) * DAMPING;
    let ny = y + (y - prev[i + 1]) * DAMPING - GRAVITY;
    let nz = z + (z - prev[i + 2]) * DAMPING;

    // Brisa: ondas lentas que recorren la tela
    nz += Math.sin(time * 0.9 + y * 0.012 + x * 0.018) * 0.035;
    nx += Math.sin(time * 0.6 + y * 0.008) * 0.01;

    if (pointer.active && speed > 0.2) {
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < RADIUS * RADIUS) {
        let f = 1 - Math.sqrt(d2) / RADIUS;
        f *= f;
        nx += pvx * f * PUSH;
        ny += pvy * f * PUSH * 0.3;
        nz -= speed * 0.35 * f;
      }
    }

    prev[i] = x;
    prev[i + 1] = y;
    prev[i + 2] = z;
    pos[i] = nx;
    pos[i + 1] = ny;
    pos[i + 2] = nz;
  }

  for (let it = 0; it < ITERATIONS; it++) {
    for (let k = 0; k < rest.length; k++) {
      const a = pairs[k * 2];
      const b = pairs[k * 2 + 1];
      const ia = a * 3;
      const ib = b * 3;
      const dx = pos[ib] - pos[ia];
      const dy = pos[ib + 1] - pos[ia + 1];
      const dz = pos[ib + 2] - pos[ia + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
      const diff = (d - rest[k]) / d;
      const wa = pinned[a] ? 0 : pinned[b] ? 1 : 0.5;
      const wb = pinned[b] ? 0 : pinned[a] ? 1 : 0.5;
      pos[ia] += dx * diff * wa;
      pos[ia + 1] += dy * diff * wa;
      pos[ia + 2] += dz * diff * wa;
      pos[ib] -= dx * diff * wb;
      pos[ib + 1] -= dy * diff * wb;
      pos[ib + 2] -= dz * diff * wb;
    }
  }

  const geometry = cloth.mesh.geometry;
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
}

export default function CortinaLino({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return; // Sin WebGL: queda la imagen de la ventana sin cortina.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
    camera.position.z = 500;
    scene.add(new THREE.HemisphereLight(0xfff4e0, 0x3a2f22, 1.6));
    const key = new THREE.DirectionalLight(0xffe6c0, 1.8);
    key.position.set(-300, 400, 600);
    const back = new THREE.DirectionalLight(0xfff0d0, 0.9);
    back.position.set(0, 200, -600);
    scene.add(key, back);

    const texture = linenTexture();
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.92,
      metalness: 0,
      side: THREE.DoubleSide,
      transparent: true,
      // En pantallas táctiles el dedo apenas aparta la tela: más translúcida.
      opacity: window.matchMedia("(pointer: coarse)").matches ? 0.72 : 0.9,
    });

    let cloths: Cloth[] = [];
    let width = 0;
    let height = 0;
    const pointer: Pointer = { x: 0, y: 0, vx: 0, vy: 0, active: false };

    const build = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();

      cloths.forEach((c) => {
        scene.remove(c.mesh);
        c.mesh.geometry.dispose();
      });
      const panel = width * PANEL;
      const top = height / 2 - 2;
      const length = height * 1.02;
      cloths = [
        makeCloth(-width / 2 - width * 0.02, panel, top, length, material),
        makeCloth(width / 2 + width * 0.02 - panel, panel, top, length, material),
      ];
      cloths.forEach((c) => scene.add(c.mesh));
    };

    const still: Pointer = { x: 0, y: 0, vx: 0, vy: 0, active: false };
    const settle = () => {
      for (let s = 0; s < 90; s++) cloths.forEach((c) => step(c, still, s / 60));
      renderer.render(scene, camera);
    };

    build();
    settle();

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (reduced) return;
      if (visible) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    });
    observer.observe(host);

    const resize = new ResizeObserver(() => {
      build();
      settle();
    });
    resize.observe(host);

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = rect.height / 2 - (e.clientY - rect.top);
      if (pointer.active) {
        pointer.vx += x - pointer.x;
        pointer.vy += y - pointer.y;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    };
    const onLeave = () => (pointer.active = false);

    // Un solo reloj compartido (gsap.ticker) en lugar de un requestAnimationFrame propio.
    let time = 0;
    const tick = (_t: number, deltaMs: number) => {
      if (!visible || !cloths.length) return;
      time += Math.min(deltaMs, 50) / 1000;
      cloths.forEach((c) => step(c, pointer, time));
      pointer.vx = 0;
      pointer.vy = 0;
      renderer.render(scene, camera);
    };

    if (!reduced) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      gsap.ticker.add(tick);
    }

    return () => {
      gsap.ticker.remove(tick);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      observer.disconnect();
      resize.disconnect();
      cloths.forEach((c) => c.mesh.geometry.dispose());
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [reduced]);

  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[3px] bg-[#2a2118]" />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-[1] h-full w-full ${className}`}
      />
    </>
  );
}
