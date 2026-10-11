'use client';

import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, ContactShadows, Sky } from '@react-three/drei';
import * as THREE from 'three';
import {
  Rotate3d,
  Sparkles,
  Volume2,
  VolumeX,
  ShoppingBag,
  ChevronDown,
  ArrowDown,
  Eye,
  Check
} from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { products } from '../lib/products';

// ==============================================================================
// CONFIGURACIÓN DE HISTORIA Y CAPÍTULOS (Verdad del Negocio desde 1980)
// ==============================================================================
interface Chapter {
  from: number;
  to: number;
  kicker: string;
  title: string;
  body: string;
  align: 'center' | 'left' | 'right';
}

const CHAPTERS: Chapter[] = [
  {
    from: 0.0,
    to: 0.16,
    kicker: 'Tradición Familiar desde 1980',
    title: 'La Central del Queso',
    body: 'Deslice para iniciar el recorrido por la entrada de la hacienda.',
    align: 'center'
  },
  {
    from: 0.18,
    to: 0.32,
    kicker: 'El Portón Tradicional',
    title: 'Apertura a la Tradición',
    body: 'Las puertas de madera se abren dando paso al oficio y legado de más de cuatro décadas.',
    align: 'left'
  },
  {
    from: 0.36,
    to: 0.64,
    kicker: 'El Sendero Campesino',
    title: 'Camino de Madrugadas',
    body: 'Ambientación rústica inspirada en los valles lecheros de Turrialba. Sin atajos, honrando el oficio artesanal.',
    align: 'right'
  },
  {
    from: 0.68,
    to: 0.82,
    kicker: 'Espacio de Maduración',
    title: 'El Reposo del Queso',
    body: 'Donde cada pieza de semiduro reposa al viento fresco de montaña hasta alcanzar su punto y corte perfecto.',
    align: 'left'
  },
  {
    from: 0.85,
    to: 1.0,
    kicker: 'Producto Insignia',
    title: 'La Cava de Quesos',
    body: 'Inspeccione en 360° nuestra rueda de queso semiduro. Arrastre para girar y seleccione su variedad.',
    align: 'center'
  }
];

const STAGES = [
  { at: 0.0, label: 'Llegada' },
  { at: 0.22, label: 'Portón' },
  { at: 0.48, label: 'Sendero' },
  { at: 0.74, label: 'Granero' },
  { at: 0.92, label: 'Cava 3D' }
];

interface CheeseVariety {
  id: string;
  name: string;
  badge: string;
  color: string;
  price: string;
  priceCRC: number;
  desc: string;
}

const VARIETIES: CheeseVariety[] = [
  {
    id: "semiduro-tradicional",
    name: "Semiduro de Turrialba",
    badge: "Insignia de la Casa",
    color: "#f5c342",
    price: "₡5,500 / kg",
    priceCRC: 5500,
    desc: "Punto exacto de sal y firmeza rústica. La receta tradicional de nuestra familia desde 1980."
  },
  {
    id: "maduro-reserva",
    name: "Maduro Selección",
    badge: "Oreado Lento",
    color: "#d99726",
    price: "₡6,800 / kg",
    priceCRC: 6800,
    desc: "Añejado pacientemente en penumbra. Sabor concentrado y corteza dorada firme para tablas."
  },
  {
    id: "ahumado-lena",
    name: "Ahumado en Leña",
    badge: "Receta de Campo",
    color: "#8a5229",
    price: "₡6,200 / kg",
    priceCRC: 6200,
    desc: "Curado suavemente en humo de maderas nobles para un aroma campesino inconfundible."
  }
];

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

// ==============================================================================
// 1. PARTICULAS FLOTANTES DE LUZ Y POLEN
// ==============================================================================
function FloatingPollen() {
  const count = 180;
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = Math.random() * 6 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 90;
    }
    return pos;
  });

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      const t = state.clock.getElapsedTime();
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(t * 0.8 + i) * 0.003;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.10}
        color="#f0d59e"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ==============================================================================
// 2. ESCENA 3D (Hacienda, Portón Batiente y Cava)
// ==============================================================================
interface WorldSceneProps {
  progressRef: React.MutableRefObject<number>;
  selectedVariety: CheeseVariety;
  cheeseRotY: number;
}

const TREE_POSITIONS: Array<{ pos: [number, number, number]; scale: number; rot: number }> = [
  { pos: [-6.8, 0, -28], scale: 2.2, rot: 0.5 },
  { pos: [ 7.2, 0, -26], scale: 2.4, rot: 1.8 },
  { pos: [-8.4, 0, -20], scale: 2.0, rot: 3.2 },
  { pos: [ 8.1, 0, -18], scale: 2.3, rot: 0.9 },
  { pos: [-7.2, 0, -10], scale: 2.5, rot: 2.1 },
  { pos: [ 7.6, 0,  -8], scale: 2.2, rot: 4.4 },
  { pos: [-8.0, 0,   0], scale: 2.6, rot: 1.1 },
  { pos: [ 7.4, 0,   3], scale: 2.3, rot: 3.6 },
  { pos: [-8.5, 0,  10], scale: 2.4, rot: 0.7 },
  { pos: [ 8.2, 0,  14], scale: 2.5, rot: 2.4 },
  { pos: [-9.8, 0,  20], scale: 2.8, rot: 1.6 },
  { pos: [ 9.5, 0,  22], scale: 2.7, rot: 4.0 },
];

function RealisticTrees() {
  const { scene } = useGLTF('/models/tree_realistic.glb');

  const treeClones = useMemo(() => {
    return TREE_POSITIONS.map(() => scene.clone(true));
  }, [scene]);

  return (
    <group>
      {TREE_POSITIONS.map((t, idx) => (
        <primitive
          key={idx}
          object={treeClones[idx]}
          position={t.pos}
          scale={t.scale}
          rotation={[0, t.rot, 0]}
        />
      ))}
    </group>
  );
}

function WorldScene({ progressRef, selectedVariety, cheeseRotY }: WorldSceneProps) {
  const { scene: worldScene } = useGLTF('/models/finca_world.glb');
  const { scene: cheeseScene } = useGLTF('/models/cheese_wheel.glb');

  const gateLeftRef = useRef<THREE.Object3D | null>(null);
  const gateRightRef = useRef<THREE.Object3D | null>(null);
  const barnLeftRef = useRef<THREE.Object3D | null>(null);
  const barnRightRef = useRef<THREE.Object3D | null>(null);
  const heroCheeseRef = useRef<THREE.Group>(null);
  const heroMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Ubicar las puertas batientes del portón y del granero en el modelo
  useEffect(() => {
    worldScene.traverse((child) => {
      if (child.name === 'Gate_Door_Left') {
        gateLeftRef.current = child;
      } else if (child.name === 'Gate_Door_Right') {
        gateRightRef.current = child;
      } else if (child.name === 'Barn_Door_L') {
        barnLeftRef.current = child;
      } else if (child.name === 'Barn_Door_R') {
        barnRightRef.current = child;
      }
    });
  }, [worldScene]);

  // Actualizar tono del queso según la variedad seleccionada
  useEffect(() => {
    cheeseScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name.includes("Cheese") || mesh.name.includes("Cylinder")) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.color = new THREE.Color(selectedVariety.color);
          mat.roughness = 0.50;
          mat.metalness = 0.05;
          mesh.material = mat;
          heroMatRef.current = mat;
        }
      }
    });
  }, [cheeseScene, selectedVariety]);

  // Animación continua controlada por scroll (Apertura de portón y granero bidireccional)
  useFrame(() => {
    const p = progressRef.current;

    // Apertura progresiva del portón principal (0.10 -> 0.26)
    const gateOpenFactor = smoothstep(0.10, 0.26, p);
    const maxAngle = Math.PI * 0.52; // ~94 grados

    if (gateLeftRef.current) {
      gateLeftRef.current.rotation.y = -maxAngle * gateOpenFactor;
    }
    if (gateRightRef.current) {
      gateRightRef.current.rotation.y = maxAngle * gateOpenFactor;
    }

    // Apertura progresiva de puertas del granero (0.66 -> 0.80)
    const barnOpenFactor = smoothstep(0.66, 0.80, p);
    const maxBarnAngle = Math.PI * 0.48;

    if (barnLeftRef.current) {
      barnLeftRef.current.rotation.y = -maxBarnAngle * barnOpenFactor;
    }
    if (barnRightRef.current) {
      barnRightRef.current.rotation.y = maxBarnAngle * barnOpenFactor;
    }

    // Rotación 360 interactiva del queso héroe
    if (heroCheeseRef.current) {
      heroCheeseRef.current.rotation.y = cheeseRotY;
    }
  });

  return (
    <>
      <primitive object={worldScene} />
      <RealisticTrees />

      {/* Rueda de Queso en la Cava sobre Pedestal (Z = 46.0, Y = 1.25) */}
      <group
        ref={heroCheeseRef}
        position={[0, 1.24, 46.0]}
        scale={2.2}
      >
        <primitive object={cheeseScene} />
      </group>

      <ContactShadows
        position={[0, 1.03, 46.0]}
        opacity={0.8}
        scale={2.8}
        blur={2.0}
        far={2}
        color="#000000"
      />
    </>
  );
}

// ==============================================================================
// 3. TRAYECTORIA CINEMÁTICA DE CÁMARA GUIADA POR SCROLL
// ==============================================================================
interface CameraControllerProps {
  progressRef: React.MutableRefObject<number>;
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>;
}

function CameraController({ progressRef, mousePosRef }: CameraControllerProps) {
  const { camera } = useThree();

  const camPos = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = progressRef.current;
    const mx = mousePosRef.current.x;
    const my = mousePosRef.current.y;

    if (p <= 0.18) {
      // 1. Frente al portón
      const local = p / 0.18;
      const z = -38.0 + local * 11.0;
      camPos.set(0, 2.1, z);
      lookTarget.set(0, 2.3, -22.0);
    } else if (p <= 0.32) {
      // 2. Atravesando las puertas abiertas del portón
      const local = (p - 0.18) / 0.14;
      const z = -27.0 + local * 11.0;
      const sway = Math.sin(local * Math.PI) * 0.25;
      camPos.set(sway, 2.05, z);
      lookTarget.set(0, 2.0, 5.0);
    } else if (p <= 0.68) {
      // 3. Sendero por las colinas y praderas
      const local = (p - 0.32) / 0.36;
      const z = -16.0 + local * 36.0;
      const curveX = Math.sin(local * Math.PI * 1.5) * 0.65;
      const walkBob = Math.sin(local * Math.PI * 14) * 0.04;
      camPos.set(curveX, 2.0 + walkBob, z);
      lookTarget.set(0, 2.0, z + 12.0);
    } else if (p <= 0.82) {
      // 4. Ingreso al granero
      const local = (p - 0.68) / 0.14;
      const z = 20.0 + local * 11.0;
      const x = 0.65 * (1.0 - local);
      camPos.set(x, 1.95 - local * 0.2, z);
      lookTarget.set(0, 1.8, 42.0);
    } else {
      // 5. Frente al pedestal central de la cava
      const local = (p - 0.82) / 0.18;
      const z = 31.0 + local * 12.8;
      const y = 1.75 - local * 0.35;
      camPos.set(0, y, z);
      lookTarget.set(0, 1.25, 46.0);
    }

    camPos.x += mx * 0.30;
    camPos.y += my * 0.18;

    camera.position.lerp(camPos, delta * 7.5);
    camera.lookAt(lookTarget);
  });

  return null;
}

// ==============================================================================
// 4. ILUMINACIÓN DINÁMICA DÍA EXTERIOR -> PENUMBRA CAVA
// ==============================================================================
function DynamicEnvironmentLighting({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const cellarSpotRef = useRef<THREE.SpotLight>(null);
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#141d18', 0.016);
  }, [scene]);

  useFrame(() => {
    const p = progressRef.current;
    const insideFactor = smoothstep(0.70, 0.86, p);

    if (sunRef.current) {
      sunRef.current.intensity = 2.4 * (1.0 - insideFactor * 0.85);
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = 0.9 * (1.0 - insideFactor * 0.55);
    }
    if (cellarSpotRef.current) {
      cellarSpotRef.current.intensity = 5.5 * insideFactor;
    }

    if (scene.fog) {
      const fogColor = new THREE.Color().lerpColors(
        new THREE.Color('#141d18'),
        new THREE.Color('#0a0a0a'),
        insideFactor
      );
      (scene.fog as THREE.FogExp2).color = fogColor;
    }
  });

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[14, 22, -10]}
        inclination={0.52}
        azimuth={0.25}
        turbidity={8}
        rayleigh={0.6}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <ambientLight ref={ambientRef} intensity={0.9} color="#e6f0ff" />
      <directionalLight
        ref={sunRef}
        position={[14, 22, -10]}
        intensity={2.4}
        color="#fff4e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        ref={cellarSpotRef}
        position={[0, 3.6, 46.0]}
        target-position={[0, 1.25, 46.0]}
        angle={0.65}
        penumbra={0.8}
        intensity={0}
        color="#ffe2b3"
        castShadow
      />
      <pointLight position={[0, 3.2, 28.0]} intensity={1.6} color="#ffb74d" distance={12} />
      <pointLight position={[0, 3.2, 38.0]} intensity={2.0} color="#ffb74d" distance={12} />
    </>
  );
}

// ==============================================================================
// 5. COMPONENTE PRINCIPAL
// ==============================================================================
export default function HaciendaWorld3D({ children }: { children?: React.ReactNode }) {
  const { addToCart } = useCart();

  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });

  const [displayProgress, setDisplayProgress] = useState(0);
  const [selectedVariety, setSelectedVariety] = useState<CheeseVariety>(VARIETIES[0]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isDraggingCheese, setIsDraggingCheese] = useState(false);
  const [cheeseRotY, setCheeseRotY] = useState(0);
  const [hasAddedHero, setHasAddedHero] = useState(false);
  const lastMouseXRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Escuchar scroll del track 3D (bidireccional y suave, aislado del catálogo)
  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const totalDist = trackRef.current.offsetHeight - window.innerHeight;
      if (totalDist <= 0) return;

      const currentScroll = -rect.top;
      const target = Math.min(Math.max(currentScroll / totalDist, 0), 1);
      targetProgressRef.current = target;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const tick = () => {
      const cur = progressRef.current;
      const tgt = targetProgressRef.current;
      const next = cur + (tgt - cur) * 0.085;
      progressRef.current = next;

      if (Math.abs(next - displayProgress) > 0.005) {
        setDisplayProgress(next);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [displayProgress]);

  // Rotación del queso con mouse al estar en la cava
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePosRef.current = { x, y };

      if (isDraggingCheese) {
        const deltaX = e.clientX - lastMouseXRef.current;
        lastMouseXRef.current = e.clientX;
        setCheeseRotY((prev) => prev + deltaX * 0.012);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (progressRef.current > 0.85) {
        setIsDraggingCheese(true);
        lastMouseXRef.current = e.clientX;
      }
    };

    const handleMouseUp = () => {
      setIsDraggingCheese(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCheese]);

  // Audio ambiental Web Audio API
  const toggleAudio = () => {
    if (!audioEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(240, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        setAudioEnabled(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      setAudioEnabled(false);
    }
  };

  const handleOrderHeroCheese = () => {
    // Buscar el producto en la lista o crearlo a partir de la variedad
    const found = products.find((p) => p.id === selectedVariety.id) || products[0];
    addToCart(found, 1);
    setHasAddedHero(true);
    setTimeout(() => setHasAddedHero(false), 2000);
  };

  const isAtCava = displayProgress >= 0.86;

  return (
    <div className="relative bg-[#0a0a0a]">
      
      {/* Botón Permanente Fijo: "Saltar al Catálogo" en esquina superior derecha */}
      <a
        href="#catalogo"
        className="fixed top-5 right-36 z-50 hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/90 hover:text-cheese hover:border-cheese/40 text-xs font-semibold tracking-wide transition-all shadow-xl"
      >
        <span>Saltar al Catálogo</span>
        <ChevronDown className="w-3.5 h-3.5 text-cheese" />
      </a>

      {/* Botón flotante de audio rural */}
      <button
        onClick={toggleAudio}
        aria-label="Alternar audio ambiental"
        className={`fixed z-40 flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl text-white/90 hover:text-cheese hover:border-cheese/40 transition-all duration-300 shadow-2xl cursor-pointer ${
          isAtCava
            ? 'top-20 right-4 px-2.5 py-2.5 sm:px-4 sm:py-2.5 sm:bottom-6 sm:left-6 sm:top-auto sm:right-auto'
            : 'bottom-6 left-6 px-4 py-2.5'
        } text-xs tracking-wider uppercase font-medium`}
      >
        {audioEnabled ? (
          <>
            <Volume2 className="w-4 h-4 text-cheese animate-pulse" />
            <span className={`text-cheese text-2xs ${isAtCava ? 'hidden sm:inline' : 'inline'}`}>
              Ambiente 3D
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 opacity-60" />
            <span className={`text-2xs ${isAtCava ? 'hidden sm:inline' : 'inline'}`}>
              Sonido
            </span>
          </>
        )}
      </button>

      {/* TRACK DE SCROLL (480vh para control pausado y reversible) */}
      <div ref={trackRef} className="relative h-[480vh]">
        
        {/* LIENZO STICKY WEBGL EN TIEMPO REAL */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a0a]">
          
          <Canvas
            camera={{ fov: 48, near: 0.1, far: 180 }}
            className={`h-full w-full ${isAtCava ? 'cursor-grab active:cursor-grabbing' : ''}`}
          >
            <Suspense fallback={null}>
              <CameraController progressRef={progressRef} mousePosRef={mousePosRef} />
              <DynamicEnvironmentLighting progressRef={progressRef} />
              <FloatingPollen />
              <WorldScene
                progressRef={progressRef}
                selectedVariety={selectedVariety}
                cheeseRotY={cheeseRotY}
              />
            </Suspense>
          </Canvas>

          {/* Viñeta cinematográfica */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.8)_100%)]" />

          {/* Banner de Verdad de Negocio en la parte superior central (Desktop) */}
          <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 z-20 text-center px-4 hidden md:block">
            <span className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-cream/70 text-2xs uppercase tracking-wider font-medium">
              Ambientación 3D inspirada en la tradición lechera de Turrialba
            </span>
          </div>

          {/* SUPERPOSICIÓN DE TEXTOS CON ESCALADO RESPONSIVE (Sin cortes) */}
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-6 sm:px-12 md:px-24 text-white">
            {CHAPTERS.map((c) => {
              const isVisible = displayProgress >= c.from && displayProgress <= c.to;
              const fade = isVisible ? 1 : 0;
              const isCavaChapter = c.from >= 0.85;
              const alignClass =
                c.align === 'center'
                  ? 'items-center text-center'
                  : c.align === 'right'
                  ? 'items-end text-right'
                  : 'items-start text-left';

              const verticalClass = isCavaChapter
                ? 'justify-start pt-28 sm:pt-32 md:pt-36'
                : 'justify-center';

              return (
                <div
                  key={c.title}
                  style={{
                    opacity: fade,
                    transform: `translateY(${(1 - fade) * 20}px)`,
                    pointerEvents: isVisible && !isAtCava ? 'auto' : 'none'
                  }}
                  className={`absolute inset-0 flex flex-col ${verticalClass} px-6 sm:px-12 md:px-24 transition-all duration-700 ${alignClass}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 sm:w-8 h-px bg-cheese" />
                    <p className="text-2xs sm:text-xs font-semibold uppercase tracking-[0.3em] text-cheese">
                      {c.kicker}
                    </p>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-3xl leading-[1.1]">
                    {c.title}
                  </h2>
                  <p className="mt-4 max-w-md text-xs sm:text-sm md:text-base font-light text-white/80 drop-shadow-md leading-relaxed">
                    {c.body}
                  </p>
                </div>
              );
            })}
          </div>

          {/* PANEL DE CATA Y CONTROL 360° (Fase 5: Cava) */}
          {isAtCava && (
            <div className="absolute bottom-4 sm:bottom-8 left-4 right-4 sm:left-8 sm:right-8 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pointer-events-auto max-w-5xl mx-auto">
              
              {/* Selector de Variedades */}
              <div className="bg-black/75 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-2xs uppercase tracking-widest text-cheese font-semibold">
                  <Rotate3d className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Arrastre para girar la pieza en 360°</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {VARIETIES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariety(v)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedVariety.id === v.id
                          ? 'bg-cheese/20 border-cheese text-white shadow-[0_0_15px_rgba(242,169,0,0.3)] font-bold'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/20"
                        style={{ backgroundColor: v.color }}
                      />
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón de Pedido Conectado a CartContext */}
              <div className="bg-black/75 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl flex items-center justify-between sm:justify-start gap-5">
                <div>
                  <div className="text-2xs uppercase tracking-widest text-cheese font-semibold">
                    {selectedVariety.name}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white font-serif">
                    {selectedVariety.price}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOrderHeroCheese}
                  className="flex items-center gap-2 py-3 px-5 sm:px-6 rounded-full bg-cheese text-forest font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(242,169,0,0.3)] hover:bg-cheese-light transition-all"
                >
                  {hasAddedHero ? (
                    <>
                      <Check className="w-4 h-4 text-forest" />
                      <span>¡Agregado!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Pedir Esta Pieza</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* Indicador Vertical de Etapas (Llegada -> Portón -> Sendero -> Granero -> Cava) */}
          <div className="pointer-events-none absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-4 md:flex">
            <div className="flex flex-col items-end gap-5 text-2xs uppercase tracking-[0.25em] text-cheese">
              {STAGES.map((s) => (
                <div
                  key={s.label}
                  className={`transition-all duration-300 ${
                    displayProgress >= s.at - 0.08 && displayProgress <= s.at + 0.12
                      ? 'text-white font-bold scale-110 drop-shadow-[0_0_8px_#f2a900]'
                      : 'text-white/40'
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>
            <div className="relative h-48 w-px bg-white/15">
              <div
                className="absolute inset-x-0 top-0 h-full origin-top bg-cheese transition-transform duration-150"
                style={{ transform: `scaleY(${displayProgress})` }}
              />
            </div>
          </div>

          {/* Indicador de Desplazamiento */}
          {!isAtCava && (
            <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-white/50 text-2xs uppercase tracking-[0.25em]">
              <span className="mb-2">Deslice para avanzar por la hacienda</span>
              <div className="w-px h-6 bg-gradient-to-b from-cheese to-transparent animate-pulse" />
            </div>
          )}

        </div>
      </div>

      {/* SECCIÓN POSTERIOR (Catálogo de Productos) */}
      <div className="relative z-20 bg-cream" id="catalogo">
        {children}
      </div>
    </div>
  );
}

useGLTF.preload('/models/finca_world.glb');
useGLTF.preload('/models/cheese_wheel.glb');
useGLTF.preload('/models/tree_realistic.glb');
