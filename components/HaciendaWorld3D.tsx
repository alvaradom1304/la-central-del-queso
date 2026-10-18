'use client';

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Html,
  Float,
  Sparkles as DreiSparkles,
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Rotate3d,
  ShoppingBag,
  Check,
  Slice,
  Plus,
  X,
  Camera,
  Box,
  Compass,
  Award,
  Flame,
  Droplets,
  Mountain,
  MapPin,
  Eye,
} from 'lucide-react';
import { useCart } from '../lib/CartContext';
import { products } from '../lib/products';
import { AtmosphericCanvasOverlay } from './AtmosphericCanvasOverlay';
import { spatialAudio } from '../lib/spatialAudio';
import { DepthPhotoCanvas } from './DepthPhotoCanvas';

// ==============================================================================
// 1. UTILIDADES MATEMÁTICAS Y TEXTURAS DE ESTUDIO PARA LA ESCULTURA 3D
// ==============================================================================
const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

function createStudioCheeseTextures() {
  if (typeof document === 'undefined') {
    return { rindBump: null, pasteBump: null, woodPlankBump: null };
  }

  const rindCanvas = document.createElement('canvas');
  rindCanvas.width = 512;
  rindCanvas.height = 512;
  const rctx = rindCanvas.getContext('2d')!;
  rctx.fillStyle = '#808080';
  rctx.fillRect(0, 0, 512, 512);

  rctx.strokeStyle = 'rgba(255,255,255,0.06)';
  rctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 6) {
    rctx.beginPath();
    rctx.moveTo(i, 0);
    rctx.lineTo(i, 512);
    rctx.stroke();
    rctx.beginPath();
    rctx.moveTo(0, i);
    rctx.lineTo(512, i);
    rctx.stroke();
  }

  for (let i = 0; i < 4200; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 0.6 + Math.random() * 2.0;
    const v = 105 + Math.floor(Math.random() * 55);
    rctx.fillStyle = `rgb(${v},${v},${v})`;
    rctx.beginPath();
    rctx.arc(x, y, r, 0, Math.PI * 2);
    rctx.fill();
  }

  const rindBump = new THREE.CanvasTexture(rindCanvas);
  rindBump.wrapS = THREE.RepeatWrapping;
  rindBump.wrapT = THREE.RepeatWrapping;
  rindBump.repeat.set(4, 2);

  const pasteCanvas = document.createElement('canvas');
  pasteCanvas.width = 512;
  pasteCanvas.height = 512;
  const pctx = pasteCanvas.getContext('2d')!;
  pctx.fillStyle = '#969696';
  pctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 95; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 2 + Math.random() * 7.5;
    const grad = pctx.createRadialGradient(x, y, r * 0.1, x, y, r);
    grad.addColorStop(0, '#323232');
    grad.addColorStop(0.75, '#585858');
    grad.addColorStop(1, '#969696');
    pctx.fillStyle = grad;
    pctx.beginPath();
    pctx.arc(x, y, r, 0, Math.PI * 2);
    pctx.fill();
  }

  const pasteBump = new THREE.CanvasTexture(pasteCanvas);
  pasteBump.wrapS = THREE.RepeatWrapping;
  pasteBump.wrapT = THREE.RepeatWrapping;

  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 512;
  woodCanvas.height = 512;
  const wctx = woodCanvas.getContext('2d')!;
  wctx.fillStyle = '#707070';
  wctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 600; i++) {
    wctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
    wctx.fillRect(0, Math.random() * 512, 512, 1 + Math.random() * 2.5);
  }
  const woodPlankBump = new THREE.CanvasTexture(woodCanvas);

  return { rindBump, pasteBump, woodPlankBump };
}

// ==============================================================================
// 2. DATOS EDITORIALES, NODOS INTERACTIVOS DE CAMPO Y VARIEDADES DE AUTOR
// ==============================================================================
interface HotspotInfo {
  id: string;
  position: [number, number, number];
  label: string;
  detail: string;
}

interface CheeseVariety {
  id: string;
  name: string;
  subtitle: string;
  originNote: string;
  rindColor: string;
  pasteColor: string;
  waxBandColor: string;
  price: string;
  weightLabel: string;
  photoUrl: string;
  pairingRitual: string;
  sensory: {
    cremosidad: number;
    ahumado: number;
    maduracion: number;
  };
  hotspots: HotspotInfo[];
}

const VARIETIES: CheeseVariety[] = [
  {
    id: 'semiduro-bloque',
    name: 'Semiduro de Turrialba',
    subtitle: 'Corteza Dorada · Punto de Sal Equilibrado',
    originNote: 'Cuajado al amanecer con leche entera de pastoreo de altura y prensado en lienzo.',
    rindColor: '#e2a43b',
    pasteColor: '#fff5d6',
    waxBandColor: '#7a2e1d',
    price: '₡5.000 / kg',
    weightLabel: 'Horma de 2.5 kg · Corte a medida',
    photoUrl: '/hero_luxury_maison.jpg',
    pairingRitual: 'Ideal a la plancha hasta dorar corteza, acompañado de gallo pinto, plátano maduro y café chorreado.',
    sensory: { cremosidad: 88, ahumado: 20, maduracion: 65 },
    hotspots: [
      {
        id: 'corteza',
        position: [0.95, 0.34, 0.55],
        label: 'Corteza Curada al Aire de Montaña',
        detail: 'Sellado natural mediante volteo diario que conserva intacta la humedad cremosa del corazón.',
      },
      {
        id: 'corazon',
        position: [0.42, 0.24, 0.72],
        label: 'Pasta Firme para Plancha o Mesa',
        detail: 'Derrite en hebras doradas sin liberar suero ni perder su estructura en el sartén.',
      },
      {
        id: 'origen',
        position: [-0.82, 0.22, 0.65],
        label: '100% Leche Fresca de Ordeño',
        detail: 'Elaborado en Santa Cruz de Turrialba sin almidones ni grasas vegetales añadidas.',
      },
    ],
  },
  {
    id: 'ahumado-lena',
    name: 'Ahumado en Leña de Guayabo',
    subtitle: 'Curación Lenta · Notas de Brasas y Montaña',
    originNote: 'Expuesto durante 18 horas al humo tibio de maderas frutales seleccionadas en la finca.',
    rindColor: '#9e4718',
    pasteColor: '#fae4b7',
    waxBandColor: '#2d1508',
    price: '₡6.800 / kg',
    weightLabel: 'Pieza de Cava · Edición Artesanal',
    photoUrl: '/queso_ahumado.jpg',
    pairingRitual: 'Servir a temperatura ambiente (20°C) en lascas finas con miel de flor de café, higos o vino tinto.',
    sensory: { cremosidad: 78, ahumado: 96, maduracion: 85 },
    hotspots: [
      {
        id: 'humo',
        position: [0.95, 0.34, 0.55],
        label: 'Pátina Ámbar de Leña de Guayabo',
        detail: 'Ahumado artesanal en frío que perfuma la corteza con notas dulces de madera y caramelo.',
      },
      {
        id: 'interior-ahumado',
        position: [0.42, 0.24, 0.72],
        label: 'Textura Mantecosa al Corte',
        detail: 'Maridaje extraordinario con café de especialidad costarricense, miel de abeja o vino tinto.',
      },
    ],
  },
  {
    id: 'palmito-artesanal',
    name: 'Queso Palmito Hilado a Mano',
    subtitle: 'Hebras Elásticas · Leche Recién Ordeñada',
    originNote: 'Hilado en caliente por manos expertas hasta lograr decenas de capas fibrosas y jugosas.',
    rindColor: '#f3ead3',
    pasteColor: '#fffdf7',
    waxBandColor: '#1d422b',
    price: '₡6.200 / kg',
    weightLabel: 'Rollo Trenzado Fresco · 500g / 1kg',
    photoUrl: '/queso_palmito.jpg',
    pairingRitual: 'Deshebrar a mano antes de servir sobre tortillas palmeadas calientes o fundir al horno.',
    sensory: { cremosidad: 95, ahumado: 10, maduracion: 35 },
    hotspots: [
      {
        id: 'hebras',
        position: [0.92, 0.34, 0.55],
        label: 'Tejido Lácteo Deshebrable',
        detail: 'Cada nudo se desenrolla en hebras finísimas con el dulzor limpio de la leche fresca.',
      },
      {
        id: 'fundicion',
        position: [0.42, 0.24, 0.72],
        label: 'Gratinado de Alta Gastronomía',
        detail: 'El favorito para picoteos gourmet, chorreadas ticas y horneados artesanales.',
      },
    ],
  },
];

interface FieldHotspot {
  id: string;
  x: string;
  y: string;
  tag: string;
  title: string;
  desc: string;
}

interface EditorialAct {
  roman: string;
  shortLabel: string;
  kicker: string;
  title: string;
  poem: string;
  caption: string;
  altitude: string;
  temp: string;
  image: string;
  secondaryImage: string;
  fieldHotspots: FieldHotspot[];
}

const EDITORIAL_ACTS: EditorialAct[] = [
  {
    roman: 'ACTO I',
    shortLabel: 'I · Sendero Floral',
    kicker: '1.200 m s.n.m. · Faldas del Volcán Turrialba',
    title: 'Donde la niebla acaricia el sendero floral.',
    poem:
      'Antes de que despunte el sol sobre el valle, el rocío volcánico nutre los pastizales de montaña y las flores silvestres que bordean el camino hacia nuestra lechería familiar.',
    caption: 'Crónica de Campo · Sendero de Santa Cruz de Turrialba, 5:45 a.m.',
    altitude: '1.200 m s.n.m.',
    temp: '12°C · Humedad 88%',
    image: '/campo_floral_turrialba.jpg',
    secondaryImage: '/potrero_vacas_lecheria.jpg',
    fieldHotspots: [
      {
        id: 'flora-1',
        x: '28%',
        y: '68%',
        tag: 'Botánica de Altura',
        title: 'Flores Silvestres & Trébol Dulce',
        desc: 'Suelos volcánicos ricos en minerales que aportan notas herbales y mantecosas únicas a la leche.',
      },
      {
        id: 'neblina-1',
        x: '68%',
        y: '34%',
        tag: 'Microclima Volcánico',
        title: 'Brisa Húmeda del Amanecer',
        desc: 'La neblina matinal mantiene el pasto fresco y tierno durante los 365 días del año.',
      },
    ],
  },
  {
    roman: 'ACTO II',
    shortLabel: 'II · Pastoreo Libre',
    kicker: 'Bienestar Animal · Hato Jersey & Holstein',
    title: 'Ordeño matinal sin prisa industrial.',
    poem:
      'Nuestras vacas pastan en libertad entre potreros verdes y aire puro de montaña. Esa alimentación viva es el secreto del color dorado natural y la riqueza cremosa de cada horma.',
    caption: 'Potrero Principal · Hato Lechero en Pastoreo Rotativo.',
    altitude: '1.140 m s.n.m.',
    temp: '15°C · Ordeño 6:15 a.m.',
    image: '/potrero_vacas_lecheria.jpg',
    secondaryImage: '/entrada_lecheria_granero.jpg',
    fieldHotspots: [
      {
        id: 'ganado-1',
        x: '46%',
        y: '58%',
        tag: 'Genética Lechera',
        title: 'Vacas Jersey en Libertad',
        desc: 'Reconocidas por producir la leche con mayor porcentaje de grasa butírica y proteína natural.',
      },
      {
        id: 'granero-fondo',
        x: '74%',
        y: '42%',
        tag: 'Arquitectura Rural',
        title: 'Rumbo a la Lechería',
        desc: 'A pocos metros del potrero para procesar la leche recién ordeñada sin transporte refrigerado largo.',
      },
    ],
  },
  {
    roman: 'ACTO III',
    shortLabel: 'III · El Granero',
    kicker: 'Herencia desde 1980 · El Umbral y la Cava',
    title: 'Del tarro lechero a las tablas de roble.',
    poem:
      'En el umbral del granero recibimos la leche tibia del día a 34°C. Cuajamos a mano, prensamos en manta de lino y dejamos que el tiempo y la madera de guayabo esculpan el carácter.',
    caption: 'Umbral del Granero · Recepción Matinal en Tarros de Aluminio.',
    altitude: 'Cava de Roble',
    temp: '34°C Recepción · 14°C Cava',
    image: '/entrada_lecheria_granero.jpg',
    secondaryImage: '/queso_ahumado.jpg',
    fieldHotspots: [
      {
        id: 'tarros-1',
        x: '32%',
        y: '66%',
        tag: 'Tradición Intacta',
        title: 'Tarros Lecheros de Aluminio',
        desc: 'Recibimos la leche tibia de la mañana para iniciar la cuajada artesanal en menos de 45 minutos.',
      },
      {
        id: 'portal-cava',
        x: '56%',
        y: '48%',
        tag: 'Interior del Granero',
        title: 'Prensas de Madera & Cava',
        desc: 'Adentro reposan las hormas sobre estantes de cedro y roble curado al humo de guayabo.',
      },
    ],
  },
];

const TASTING_RITUAL_STEPS = [
  {
    step: '01',
    title: 'La Corteza de Lino',
    desc: 'Inspeccione el relieve micro-poroso dejado por el lienzo artesanal y el volteo a mano.',
    rotY: 0.45,
    cut: false,
  },
  {
    step: '02',
    title: 'El Primer Corte',
    desc: 'Al abrir la cuña se revela una pasta marfil elástica con ojos lácteos de fermentación limpia.',
    rotY: 1.35,
    cut: true,
  },
  {
    step: '03',
    title: 'Afinación & Humo',
    desc: 'Las maderas de guayabo y el aire frío de Turrialba sellan un aroma profundo a mantequilla tostada.',
    rotY: 2.85,
    cut: true,
  },
  {
    step: '04',
    title: 'Ritual en Mesa',
    desc: 'Corte en triángulos de 1 cm para asar a la plancha o degustar con café recién chorreado.',
    rotY: 4.15,
    cut: true,
  },
];

// ==============================================================================
// 3. SHADER GLSL ARTÍSTICO DE FONDO PARA EL PEDESTAL 3D (SEDA LÁCTEA & ORO CÁLIDO)
// ==============================================================================
const ATELIER_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATELIER_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorAccent;
  varying vec2 vUv;

  float waveNoise(vec2 p) {
    return sin(p.x * 3.2 + uTime * 0.35) * cos(p.y * 2.8 - uTime * 0.25) * 0.5 + 0.5;
  }

  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered);

    float n1 = waveNoise(vUv * 2.2 + vec2(uTime * 0.08, -uTime * 0.05));
    float n2 = waveNoise(vUv * 4.5 - vec2(uTime * 0.12, uTime * 0.09));
    float silk = mix(n1, n2, 0.38);

    float radialGlow = smoothstep(0.68, 0.02, dist);
    vec3 baseDark = vec3(0.045, 0.055, 0.045);
    vec3 warmCore = mix(uColorPrimary * 0.22, uColorAccent * 0.38, silk);

    vec3 finalColor = mix(baseDark, warmCore, radialGlow * (0.65 + 0.35 * silk));

    float ring = smoothstep(0.018, 0.0, abs(dist - 0.36)) * 0.18;
    finalColor += uColorAccent * ring;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function AtelierShaderBackdrop({ accentColor }: { accentColor: string }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorPrimary: { value: new THREE.Color('#2a1d11') },
      uColorAccent: { value: new THREE.Color(accentColor) },
    }),
    []
  );

  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uColorAccent.value.set(accentColor);
    }
  }, [accentColor]);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0.4, -3.2]} scale={[12, 9, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={ATELIER_VERTEX_SHADER}
        fragmentShader={ATELIER_FRAGMENT_SHADER}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

// ==============================================================================
// 4. ENTORNO HDRI DE ESTUDIO Y ESCULTURA PBR DE LA RUEDA DE QUESO
// ==============================================================================
function StudioEnvironmentSetup() {
  const { scene, gl } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color('#120d08');

    const topSoftbox = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ color: '#ffecd1', side: THREE.DoubleSide })
    );
    topSoftbox.position.set(0, 6, 0);
    topSoftbox.rotation.x = Math.PI / 2;
    envScene.add(topSoftbox);

    const keyPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 7),
      new THREE.MeshBasicMaterial({ color: '#ffd996', side: THREE.DoubleSide })
    );
    keyPanel.position.set(5, 3.5, 5);
    keyPanel.lookAt(0, 0, 0);
    envScene.add(keyPanel);

    const rimPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({ color: '#e68a2e', side: THREE.DoubleSide })
    );
    rimPanel.position.set(-5, 3, -4);
    rimPanel.lookAt(0, 0, 0);
    envScene.add(rimPanel);

    const envRT = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = envRT.texture;

    return () => {
      envRT.dispose();
      pmremGenerator.dispose();
    };
  }, [scene, gl]);

  return null;
}

function SculpturalCheesePedestal3D({
  variety,
  cheeseRotYRef,
  isDraggingRef,
  isWedgeCut,
  onToggleWedge,
  activeHotspot,
  setActiveHotspot,
}: {
  variety: CheeseVariety;
  cheeseRotYRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  isWedgeCut: boolean;
  onToggleWedge: () => void;
  activeHotspot: string | null;
  setActiveHotspot: (id: string | null) => void;
}) {
  const turntableRef = useRef<THREE.Group>(null);
  const wedgeGroupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const wedgeSlideRef = useRef(1);

  const { rindBump, pasteBump, woodPlankBump } = useMemo(() => createStudioCheeseTextures(), []);

  const WEDGE_ANGLE = Math.PI * 0.34;
  const MAIN_WHEEL_ANGLE = Math.PI * 2 - WEDGE_ANGLE;
  const RADIUS = 1.24;
  const HEIGHT = 0.56;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    if (!isDraggingRef.current) {
      cheeseRotYRef.current += dt * 0.18;
    }

    if (turntableRef.current) {
      turntableRef.current.rotation.y = THREE.MathUtils.damp(
        turntableRef.current.rotation.y,
        cheeseRotYRef.current,
        10,
        dt
      );
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = state.clock.elapsedTime * 0.12;
    }

    const targetSlide = isWedgeCut ? 1.0 : 0.0;
    wedgeSlideRef.current = THREE.MathUtils.damp(wedgeSlideRef.current, targetSlide, 8, dt);

    if (wedgeGroupRef.current) {
      const s = wedgeSlideRef.current;
      const bisector = WEDGE_ANGLE * 0.5;
      const dist = s * 0.42;
      wedgeGroupRef.current.position.set(
        Math.sin(bisector) * dist,
        s * 0.05,
        Math.cos(bisector) * dist
      );
    }
  });

  return (
    <group position={[0, -0.32, 0]}>
      <mesh ref={outerRingRef} position={[0, 0.55, -0.3]} rotation={[0.25, 0, 0]}>
        <torusGeometry args={[1.95, 0.006, 16, 120]} />
        <meshStandardMaterial
          color="#f2a900"
          metalness={0.95}
          roughness={0.18}
          transparent
          opacity={0.45}
        />
      </mesh>

      <group ref={turntableRef}>
        <mesh position={[0, -0.18, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.62, 1.72, 0.14, 64]} />
          <meshStandardMaterial
            color="#1c1917"
            roughness={0.75}
            metalness={0.15}
            bumpMap={woodPlankBump}
            bumpScale={0.015}
          />
        </mesh>

        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[1.54, 1.54, 0.035, 64]} />
          <meshStandardMaterial color="#d49b35" metalness={0.92} roughness={0.2} />
        </mesh>

        <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.46, 1.48, 0.08, 64]} />
          <meshStandardMaterial
            color="#4a2c18"
            roughness={0.55}
            metalness={0.06}
            bumpMap={woodPlankBump}
            bumpScale={0.02}
          />
        </mesh>

        {/* RUEDA MAESTRA DE QUESO */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, HEIGHT / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry
              args={[RADIUS, RADIUS, HEIGHT, 64, 4, false, WEDGE_ANGLE, MAIN_WHEEL_ANGLE]}
            />
            <meshPhysicalMaterial
              color={variety.rindColor}
              roughness={0.38}
              metalness={0.02}
              clearcoat={0.24}
              clearcoatRoughness={0.42}
              sheen={0.38}
              sheenColor="#fff2cc"
              bumpMap={rindBump}
              bumpScale={0.026}
            />
          </mesh>

          <mesh position={[0, HEIGHT / 2, 0]}>
            <cylinderGeometry
              args={[
                RADIUS + 0.004,
                RADIUS + 0.004,
                0.12,
                64,
                1,
                true,
                WEDGE_ANGLE,
                MAIN_WHEEL_ANGLE,
              ]}
            />
            <meshStandardMaterial color={variety.waxBandColor} roughness={0.5} />
          </mesh>

          <mesh
            position={[0, HEIGHT / 2, 0]}
            rotation={[0, WEDGE_ANGLE - Math.PI / 2, 0]}
            receiveShadow
          >
            <planeGeometry args={[RADIUS, HEIGHT]} />
            <meshPhysicalMaterial
              color={variety.pasteColor}
              roughness={0.32}
              clearcoat={0.28}
              clearcoatRoughness={0.35}
              bumpMap={pasteBump}
              bumpScale={0.032}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh position={[0, HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
            <planeGeometry args={[RADIUS, HEIGHT]} />
            <meshPhysicalMaterial
              color={variety.pasteColor}
              roughness={0.32}
              clearcoat={0.28}
              clearcoatRoughness={0.35}
              bumpMap={pasteBump}
              bumpScale={0.032}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh position={[-0.25, HEIGHT + 0.004, -0.2]} rotation={[-Math.PI / 2, 0, 0.3]}>
            <ringGeometry args={[0.26, 0.31, 48]} />
            <meshStandardMaterial color="#d49b35" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>

        {/* CUÑA EXTRAÍBLE */}
        <group
          ref={wedgeGroupRef}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWedge();
          }}
        >
          <mesh position={[0, HEIGHT / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, 36, 2, false, 0, WEDGE_ANGLE]} />
            <meshPhysicalMaterial
              color={variety.rindColor}
              roughness={0.38}
              clearcoat={0.24}
              clearcoatRoughness={0.42}
              bumpMap={rindBump}
              bumpScale={0.026}
            />
          </mesh>

          <mesh position={[0, HEIGHT / 2, 0]}>
            <cylinderGeometry
              args={[RADIUS + 0.004, RADIUS + 0.004, 0.12, 36, 1, true, 0, WEDGE_ANGLE]}
            />
            <meshStandardMaterial color={variety.waxBandColor} roughness={0.5} />
          </mesh>

          <mesh position={[0, HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[RADIUS, HEIGHT]} />
            <meshPhysicalMaterial
              color={variety.pasteColor}
              roughness={0.3}
              clearcoat={0.32}
              bumpMap={pasteBump}
              bumpScale={0.032}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, HEIGHT / 2, 0]} rotation={[0, WEDGE_ANGLE - Math.PI / 2, 0]}>
            <planeGeometry args={[RADIUS, HEIGHT]} />
            <meshPhysicalMaterial
              color={variety.pasteColor}
              roughness={0.3}
              clearcoat={0.32}
              bumpMap={pasteBump}
              bumpScale={0.032}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* Ramita de Romero */}
        <group position={[-0.95, 0.02, 0.72]} rotation={[0, 0.5, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.016, 0.65, 8]} />
            <meshStandardMaterial color="#3d5229" roughness={0.8} />
          </mesh>
          {[-0.22, -0.1, 0.02, 0.14, 0.24].map((offset, idx) => (
            <group key={idx} position={[offset, 0.02, 0]}>
              <mesh position={[0, 0.02, 0.04]} rotation={[0.4, 0.3, 0]}>
                <capsuleGeometry args={[0.012, 0.09, 4, 8]} />
                <meshStandardMaterial color="#4f6e35" roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.02, -0.04]} rotation={[-0.4, -0.3, 0]}>
                <capsuleGeometry args={[0.012, 0.09, 4, 8]} />
                <meshStandardMaterial color="#4f6e35" roughness={0.6} />
              </mesh>
            </group>
          ))}
        </group>

        {/* PINES INTERACTIVOS DE NOTAS DE CATA (+) */}
        {variety.hotspots.map((h) => {
          const isOpen = activeHotspot === h.id;
          return (
            <Html key={h.id} position={h.position} center distanceFactor={6}>
              <div className="relative select-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(isOpen ? null : h.id);
                  }}
                  aria-label={h.label}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer border ${
                    isOpen
                      ? 'bg-terracotta text-cream border-white scale-110'
                      : 'bg-black/80 text-cheese border-cheese/70 hover:scale-110 hover:bg-cheese hover:text-forest'
                  }`}
                >
                  {isOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>

                {isOpen && (
                  <div className="absolute bottom-11 left-1/2 -translate-x-1/2 w-60 p-3.5 rounded-2xl bg-black/90 backdrop-blur-xl border border-cheese/40 text-left shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-2xs uppercase tracking-widest text-cheese font-bold mb-1">
                      {h.label}
                    </p>
                    <p className="text-xs text-cream/90 font-light leading-relaxed">{h.detail}</p>
                  </div>
                )}
              </div>
            </Html>
          );
        })}
      </group>

      <DreiSparkles
        count={28}
        scale={[3.8, 2.2, 3.8]}
        position={[0, 0.65, 0]}
        size={1.6}
        speed={0.22}
        opacity={0.45}
        color="#f5c453"
      />
    </group>
  );
}

// ==============================================================================
// 5. COMPONENTE PRINCIPAL: CRÓNICA DE SCROLLYTELLING INMERSIVA + ATELIER 3D
// ==============================================================================
export default function HaciendaWorld3D({ children }: { children?: React.ReactNode }) {
  const { addToCart } = useCart();

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const scrollyTrackRef = useRef<HTMLDivElement>(null);
  const archFrameRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const cheeseRotYRef = useRef(0.45);
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);

  const [isHeroInView, setIsHeroInView] = useState(true);
  const [activeActIndex, setActiveActIndex] = useState(0);
  const [selectedFieldHotspot, setSelectedFieldHotspot] = useState<FieldHotspot | null>(
    EDITORIAL_ACTS[0].fieldHotspots[0]
  );
  const [selectedVariety, setSelectedVariety] = useState<CheeseVariety>(VARIETIES[0]);
  const [activeRitualStep, setActiveRitualStep] = useState(1);
  const [isWedgeCut, setIsWedgeCut] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [hasAddedHero, setHasAddedHero] = useState(false);
  const [photoTilt, setPhotoTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  useEffect(() => {
    const el = heroSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroInView(entry.isIntersecting),
      { rootMargin: '200px 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Motor Scrollytelling Coreografiado: expande el arco botánico y cambia de Acto según el scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect();
        const total = Math.max(1, heroSectionRef.current.offsetHeight - window.innerHeight);
        progressRef.current = Math.min(1, Math.max(0, -rect.top / total));
      }

      if (scrollyTrackRef.current) {
        const rect = scrollyTrackRef.current.getBoundingClientRect();
        const totalScroll = Math.max(1, scrollyTrackRef.current.offsetHeight - window.innerHeight);
        const p = Math.min(1, Math.max(0, -rect.top / totalScroll));

        if (archFrameRef.current) {
          const expand = smoothstep(0.0, 0.35, p);
          const scale = 0.91 + expand * 0.09;
          const topRadius = Math.round(180 - expand * 148);
          archFrameRef.current.style.transform = `scale3d(${scale.toFixed(4)}, ${scale.toFixed(4)}, 1)`;
          archFrameRef.current.style.borderRadius = `${topRadius}px ${topRadius}px 28px 28px`;
        }

        const nextAct = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
        setActiveActIndex((prev) => {
          if (prev !== nextAct) {
            setSelectedFieldHotspot(EDITORIAL_ACTS[nextAct].fieldHotspots[0]);
            return nextAct;
          }
          return prev;
        });

        spatialAudio.updateProgress(p, mousePosRef.current.x);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
      if (isDraggingRef.current) {
        const dx = e.clientX - lastPointerXRef.current;
        lastPointerXRef.current = e.clientX;
        cheeseRotYRef.current += dx * 0.013;
      }
      spatialAudio.updateProgress(progressRef.current, mousePosRef.current.x);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const jumpToScrollyAct = (idx: number) => {
    setActiveActIndex(idx);
    setSelectedFieldHotspot(EDITORIAL_ACTS[idx].fieldHotspots[0]);
    spatialAudio.updateProgress(idx * 0.4, mousePosRef.current.x);
    if (!scrollyTrackRef.current) return;
    const rect = scrollyTrackRef.current.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const totalScroll = scrollyTrackRef.current.offsetHeight - window.innerHeight;
    const targetP = idx === 0 ? 0.08 : idx === 1 ? 0.5 : 0.86;
    window.scrollTo({ top: trackTop + totalScroll * targetP, behavior: 'smooth' });
  };

  const handleSelectRitualStep = (idx: number) => {
    setActiveRitualStep(idx);
    const step = TASTING_RITUAL_STEPS[idx];
    cheeseRotYRef.current = step.rotY;
    setIsWedgeCut(step.cut);
    if (step.cut) {
      spatialAudio.playKnifeSliceSfx();
    }
  };

  const toggleAudio = () => {
    if (!audioEnabled) {
      spatialAudio.init();
      setAudioEnabled(true);
    } else {
      spatialAudio.stop();
      setAudioEnabled(false);
    }
  };

  const handleOrderHeroCheese = () => {
    const found = products.find((p) => p.id === selectedVariety.id) || products[0];
    addToCart(found, 1);
    setHasAddedHero(true);
    setTimeout(() => setHasAddedHero(false), 2000);
  };

  const currentAct = EDITORIAL_ACTS[activeActIndex];

  return (
    <div className="relative bg-[#0c130f] text-cream">
      <div ref={heroSectionRef} className="relative">
        {/* Partículas Doradas de Pólen y Luz de Montaña */}
        <AtmosphericCanvasOverlay
          progressRef={progressRef}
          mouseRef={mousePosRef}
          isAtCava={false}
          cinemaFx={true}
          isActive={isHeroInView}
        />

        {/* Líneas Arquitectónicas de Galería (Grid Editorial de Lujo) */}
        <div className="pointer-events-none absolute inset-0 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-full border-x border-white/[0.06] grid grid-cols-1 lg:grid-cols-12">
            <div className="hidden lg:block lg:col-span-4 border-r border-white/[0.05]" />
            <div className="hidden lg:block lg:col-span-4 border-r border-white/[0.05]" />
          </div>
        </div>

        {/* ===================================================================
            PORTADA DE MARCA (BRAND MANIFESTO HERO)
        =================================================================== */}
        <section className="relative z-20 min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-between">
          {/* Metadatos Superiores */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 text-2xs uppercase tracking-[0.28em] text-cream/60">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cheese animate-pulse" />
              <span>Santa Cruz de Turrialba · Costa Rica</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <span>Latitud 09°58&apos;N · Altitud 1.200m</span>
              <span className="text-cheese/80">Casa Fundada en 1980</span>
            </div>
            <button
              type="button"
              onClick={toggleAudio}
              data-cursor="SONIDO"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:border-cheese/50 hover:text-cheese transition-colors cursor-pointer"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cheese" />
                  <span className="text-cheese">Paisaje Sonoro Activo</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 opacity-60" />
                  <span>Activar Paisaje Sonoro</span>
                </>
              )}
            </button>
          </div>

          {/* Composición Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center my-auto py-10">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-7"
            >
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.04] border border-cheese/30 text-cheese text-2xs uppercase tracking-[0.25em] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Artesanía Láctea de Montaña · Desde 1980</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.02] text-white text-balance">
                El arte silencioso de la leche fresca y el fuego lento.
              </h1>

              <p className="text-base sm:text-lg text-cream/75 font-light leading-relaxed max-w-xl text-pretty">
                Una crónica inmersiva desde los senderos florales del Volcán Turrialba y el ordeño
                matinal hasta nuestra cava de roble y humo de guayabo.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#cronica-turrialba"
                  data-cursor="INICIAR"
                  className="min-h-[50px] inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-cheese text-forest font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(242,169,0,0.28)] hover:bg-cheese-light transition-all active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  <span>Iniciar Crónica Visual</span>
                </a>

                <a
                  href="#atelier-3d"
                  data-cursor="3D 360°"
                  className="min-h-[50px] inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-white/20 bg-white/[0.03] hover:bg-white/[0.08] hover:border-cheese/40 text-cream text-xs uppercase tracking-[0.18em] font-medium transition-all"
                >
                  <Rotate3d className="w-4 h-4 text-cheese" />
                  <span>Atelier de Cata 3D</span>
                </a>
              </div>

              {/* Tres Cifras de Identidad */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-cheese block tabular-nums">
                    45+ Años
                  </span>
                  <span className="text-2xs uppercase tracking-widest text-cream/55">
                    Oficio Familiar
                  </span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-white block tabular-nums">
                    1.200 m
                  </span>
                  <span className="text-2xs uppercase tracking-widest text-cream/55">
                    Pastoreo Volcánico
                  </span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-cheese block tabular-nums">
                    100%
                  </span>
                  <span className="text-2xs uppercase tracking-widest text-cream/55">
                    Leche Recién Ordeñada
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Ventana en Arco de Museo con Obra Maestra Editorial */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md" data-cursor="PIEZA MAESTRA">
                <div className="p-3 rounded-t-[14rem] rounded-b-3xl border border-cheese/35 bg-white/[0.02] backdrop-blur-xs shadow-2xl">
                  <div className="relative aspect-[4/5] rounded-t-[13.2rem] rounded-b-2xl overflow-hidden group">
                    <img
                      src="/hero_luxury_maison.jpg"
                      alt="Obra maestra quesera sobre basalto volcánico con miel de flor de café"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-cream">
                      <div>
                        <span className="text-2xs uppercase tracking-[0.25em] text-cheese block font-semibold">
                          Selección de Cava 1980
                        </span>
                        <p className="font-serif text-lg italic text-white">
                          Afinación en Basalto Volcánico
                        </p>
                      </div>
                      <span className="text-2xs font-mono text-white/70 border border-white/20 px-2.5 py-1 rounded-full backdrop-blur-md">
                        LOTE ARTESANAL
                      </span>
                    </div>
                  </div>
                </div>

                {/* Miniatura Flotante Izquierda: Pastoreo Libre */}
                <div className="hidden sm:block absolute -left-10 -bottom-8 w-44 p-2 rounded-2xl border border-white/15 bg-[#111a14]/95 backdrop-blur-xl shadow-2xl">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2">
                    <img
                      src="/potrero_vacas_lecheria.jpg"
                      alt="Pastoreo de altura"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-cheese font-semibold">
                    Pastoreo Libre
                  </p>
                  <p className="text-[11px] text-cream/75 font-light">
                    Hato Jersey en Santa Cruz
                  </p>
                </div>

                {/* Sello Circular Giratorio */}
                <div className="absolute -top-6 -right-4 w-28 h-28 rounded-full bg-[#111a14]/95 border border-cheese/40 flex items-center justify-center p-2 shadow-2xl">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full animate-spin"
                    style={{ animationDuration: '24s' }}
                  >
                    <defs>
                      <path
                        id="circlePath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      />
                    </defs>
                    <text fill="#F2A900" fontSize="8.3" fontWeight="600" letterSpacing="2.1">
                      <textPath href="#circlePath">
                        • LA CENTRAL DEL QUESO • TURRIALBA 1980
                      </textPath>
                    </text>
                  </svg>
                  <Award className="w-6 h-6 text-cheese absolute" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="border-t border-white/10 pt-5 flex items-center justify-between text-2xs uppercase tracking-[0.25em] text-cream/50">
            <span>Scrollytelling Interactivo · Toque los pines sobre el paisaje</span>
            <span className="text-cheese">Deslice para recorrer los III Actos ↓</span>
          </div>
        </section>

        {/* ===================================================================
            TEATRO DE SCROLLYTELLING FIJADO (PINNED CHRONICLE: ACTOS I, II, III)
        =================================================================== */}
        <section id="cronica-turrialba" ref={scrollyTrackRef} className="relative h-[310vh] z-20">
          <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-7xl mx-auto w-full space-y-6">
              {/* Barra Superior de Navegación del Scrollytelling (Scrubber de Actos) */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-black/50 backdrop-blur-xl border border-white/15 rounded-2xl p-2.5 sm:px-5">
                <div className="flex items-center gap-2">
                  {EDITORIAL_ACTS.map((act, idx) => {
                    const isActive = idx === activeActIndex;
                    return (
                      <button
                        key={act.roman}
                        type="button"
                        onClick={() => jumpToScrollyAct(idx)}
                        data-cursor={act.roman}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isActive
                            ? 'bg-cheese text-forest shadow-md'
                            : 'text-cream/65 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {act.shortLabel}
                      </button>
                    );
                  })}
                </div>

                <div className="hidden md:flex items-center gap-4 text-2xs font-mono text-cheese">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    {currentAct.altitude}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cheese/15 border border-cheese/30">
                    {currentAct.temp}
                  </span>
                </div>
              </div>

              {/* Escenario Central: Portal en Arco que se Expande + Pines Botánicos Interactivos */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div
                    ref={archFrameRef}
                    style={{
                      transform: 'scale3d(0.92, 0.92, 1)',
                      borderRadius: '140px 140px 28px 28px',
                      willChange: 'transform, border-radius',
                    }}
                    className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden border border-cheese/35 shadow-2xl bg-black"
                  >
                    {EDITORIAL_ACTS.map((act, idx) => {
                      const isCurrent = idx === activeActIndex;
                      return (
                        <div
                          key={act.roman}
                          className={`absolute inset-0 transition-all duration-700 ease-out ${
                            isCurrent ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
                          }`}
                        >
                          <DepthPhotoCanvas
                            imageUrl={act.image}
                            mousePos={mousePosRef.current}
                            className="w-full h-full"
                            intensity={1.15}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/25 pointer-events-none" />

                          {act.fieldHotspots.map((spot) => {
                            const isSelected = selectedFieldHotspot?.id === spot.id;
                            return (
                              <button
                                key={spot.id}
                                type="button"
                                onClick={() => setSelectedFieldHotspot(spot)}
                                data-cursor="DESCUBRIR"
                                style={{ left: spot.x, top: spot.y }}
                                className={`-translate-x-1/2 -translate-y-1/2 absolute z-20 group/pin flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-2xl ${
                                  isSelected
                                    ? 'bg-cheese text-forest border-white scale-110 font-bold'
                                    : 'bg-black/75 text-cream border-cheese/60 hover:scale-105 hover:bg-cheese/20'
                                }`}
                              >
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span className="text-2xs uppercase tracking-wider whitespace-nowrap">
                                  {spot.title}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}

                    <div className="absolute bottom-4 left-5 right-5 z-20 flex items-center justify-between text-2xs text-cream/85 pointer-events-none">
                      <span className="font-mono bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                        {currentAct.caption}
                      </span>
                      <span className="hidden sm:inline font-mono text-cheese bg-black/65 px-3 py-1 rounded-full border border-cheese/30">
                        Pulse los pines sobre la escena
                      </span>
                    </div>
                  </div>
                </div>

                {/* Columna Narrativa + Ficha del Nodo Seleccionado (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentAct.roman}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -18 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-serif italic text-2xl text-cheese">
                          {currentAct.roman}
                        </span>
                        <span className="h-px w-10 bg-cheese/40" />
                        <span className="text-2xs uppercase tracking-[0.25em] text-cream/65 font-semibold">
                          {currentAct.kicker}
                        </span>
                      </div>

                      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.08] text-balance">
                        {currentAct.title}
                      </h2>

                      <p className="text-sm sm:text-base text-cream/75 font-light leading-relaxed text-pretty">
                        {currentAct.poem}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {selectedFieldHotspot && (
                    <motion.div
                      key={selectedFieldHotspot.id}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 rounded-2xl bg-white/[0.04] border border-cheese/35 backdrop-blur-xl space-y-2 shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xs uppercase tracking-[0.22em] text-cheese font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          {selectedFieldHotspot.tag}
                        </span>
                        <span className="text-[10px] font-mono text-cream/50 uppercase">
                          Nodo Activo en Escena
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-white">
                        {selectedFieldHotspot.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-cream/80 font-light leading-relaxed">
                        {selectedFieldHotspot.desc}
                      </p>
                    </motion.div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-2xs uppercase tracking-[0.22em] text-cream/50">
                    <span>Siga deslizando o elija un Acto arriba</span>
                    <span className="text-cheese font-mono">
                      0{activeActIndex + 1} / 03
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            ACTO IV: EL ATELIER DE CATA (3D SELECTIVO + RITUAL DE CATA EN 4 PASOS)
        =================================================================== */}
        <section
          id="atelier-3d"
          className="relative z-20 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="rounded-[2.5rem] border border-cheese/25 bg-gradient-to-br from-[#141d17] via-[#0e1410] to-[#17120c] p-6 sm:p-10 lg:p-14 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-2xs uppercase tracking-[0.28em] text-cheese font-bold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Acto IV · El Atelier de Cata Interactiva</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                  Escultura Láctea en 360° & Ritual de Corte
                </h2>
                <p className="text-sm sm:text-base text-cream/70 font-light">
                  Gire libremente la horma sobre el pedestal de basalto o recorra las 4 fases del
                  Ritual de Cata para animar el corte e inspeccionar su miga interior.
                </p>
              </div>

              <div className="inline-flex items-center bg-black/50 p-1.5 rounded-2xl border border-white/15 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  data-cursor="MODO 3D"
                  className={`min-h-[38px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-cheese text-forest shadow-md'
                      : 'text-cream/70 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Escultura 3D (360°)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  data-cursor="MACRO 8K"
                  className={`min-h-[38px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'photo'
                      ? 'bg-cheese text-forest shadow-md'
                      : 'text-cream/70 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Fotografía Macro 8K</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6">
              {TASTING_RITUAL_STEPS.map((ritual, idx) => {
                const isSelected = activeRitualStep === idx;
                return (
                  <button
                    key={ritual.step}
                    type="button"
                    onClick={() => handleSelectRitualStep(idx)}
                    data-cursor={`FASE ${ritual.step}`}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cheese/15 border-cheese text-white shadow-lg'
                        : 'bg-black/35 border-white/10 text-cream/65 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-cheese">
                        FASE {ritual.step}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-cheese animate-ping" />
                      )}
                    </div>
                    <p className="font-serif font-bold text-sm sm:text-base text-white">
                      {ritual.title}
                    </p>
                    <p className="text-2xs text-cream/65 font-light mt-1 line-clamp-2">
                      {ritual.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-8 items-center">
              <div className="lg:col-span-7">
                <div
                  data-cursor={viewMode === '3d' ? 'GIRAR 360°' : 'INCLINAR 3D'}
                  className="relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden border border-cheese/30 bg-[#0b0d0b] shadow-inner"
                >
                  {viewMode === '3d' ? (
                    <div
                      onMouseDown={(e) => {
                        isDraggingRef.current = true;
                        lastPointerXRef.current = e.clientX;
                      }}
                      onTouchStart={(e) => {
                        if (e.touches.length === 1) {
                          isDraggingRef.current = true;
                          lastPointerXRef.current = e.touches[0].clientX;
                        }
                      }}
                      onTouchMove={(e) => {
                        if (isDraggingRef.current && e.touches.length === 1) {
                          const dx = e.touches[0].clientX - lastPointerXRef.current;
                          lastPointerXRef.current = e.touches[0].clientX;
                          cheeseRotYRef.current += dx * 0.015;
                        }
                      }}
                      onTouchEnd={() => {
                        isDraggingRef.current = false;
                      }}
                      className="w-full h-full cursor-grab active:cursor-grabbing"
                    >
                      <Canvas
                        frameloop={isHeroInView ? 'always' : 'demand'}
                        dpr={[1, 1.5]}
                        shadows
                        camera={{ position: [0, 1.55, 3.65], fov: 38, near: 0.1, far: 30 }}
                        gl={{
                          antialias: true,
                          powerPreference: 'high-performance',
                          toneMapping: THREE.ACESFilmicToneMapping,
                          toneMappingExposure: 1.15,
                        }}
                      >
                        <Suspense fallback={null}>
                          <StudioEnvironmentSetup />
                          <AtelierShaderBackdrop accentColor={selectedVariety.rindColor} />

                          <ambientLight intensity={0.55} color="#fff2de" />
                          <spotLight
                            position={[3.5, 5.2, 3.5]}
                            angle={0.5}
                            penumbra={0.85}
                            intensity={4.2}
                            color="#ffe6bd"
                            castShadow
                            shadow-mapSize={[1024, 1024]}
                          />
                          <pointLight position={[-3, 2.2, -2]} intensity={2.0} color="#ff9d3b" />

                          <Float speed={1.4} rotationIntensity={0.04} floatIntensity={0.08}>
                            <SculpturalCheesePedestal3D
                              variety={selectedVariety}
                              cheeseRotYRef={cheeseRotYRef}
                              isDraggingRef={isDraggingRef}
                              isWedgeCut={isWedgeCut}
                              onToggleWedge={() => {
                                setIsWedgeCut((prev) => !prev);
                                spatialAudio.playKnifeSliceSfx();
                              }}
                              activeHotspot={activeHotspot}
                              setActiveHotspot={setActiveHotspot}
                            />
                          </Float>

                          <ContactShadows
                            position={[0, -0.52, 0]}
                            opacity={0.65}
                            scale={5.5}
                            blur={2.2}
                            far={2.5}
                            frames={1}
                            resolution={256}
                          />
                        </Suspense>
                      </Canvas>

                      <div className="pointer-events-none absolute top-4 left-4 right-4 flex items-center justify-between text-2xs">
                        <span className="bg-black/70 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-cream/85 inline-flex items-center gap-1.5">
                          <Rotate3d className="w-3.5 h-3.5 text-cheese" />
                          <span>Arrastre en 360° · Pulse (+) sobre la pieza</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setIsWedgeCut((prev) => !prev);
                            spatialAudio.playKnifeSliceSfx();
                          }}
                          className="pointer-events-auto bg-terracotta hover:bg-terracotta-dark text-cream px-3.5 py-1.5 rounded-full font-bold inline-flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                        >
                          <Slice className="w-3.5 h-3.5" />
                          <span>{isWedgeCut ? 'Unir Cuña' : 'Extraer Cuña de Cata'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const px = (e.clientX - rect.left) / rect.width;
                        const py = (e.clientY - rect.top) / rect.height;
                        setPhotoTilt({
                          rx: (0.5 - py) * 10,
                          ry: (px - 0.5) * 12,
                          gx: px * 100,
                          gy: py * 100,
                        });
                      }}
                      onMouseLeave={() => setPhotoTilt({ rx: 0, ry: 0, gx: 50, gy: 50 })}
                      className="w-full h-full relative overflow-hidden flex items-center justify-center p-6"
                      style={{ perspective: '1000px' }}
                    >
                      <div
                        style={{
                          transform: `rotateX(${photoTilt.rx}deg) rotateY(${photoTilt.ry}deg) scale3d(1.02,1.02,1)`,
                          transition: 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                        className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-cheese/30"
                      >
                        <img
                          src={selectedVariety.photoUrl}
                          alt={selectedVariety.name}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background: `radial-gradient(circle at ${photoTilt.gx}% ${photoTilt.gy}%, rgba(242,169,0,0.28), transparent 55%)`,
                          }}
                        />
                        <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md p-4 rounded-xl border border-white/15">
                          <p className="text-2xs uppercase tracking-widest text-cheese font-bold">
                            Fotografía Macro de Estudio · Mueve el cursor para inclinación 3D
                          </p>
                          <p className="text-xs text-cream/90 mt-0.5">{selectedVariety.originNote}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="space-y-2">
                  <span className="text-2xs uppercase tracking-[0.22em] text-cream/55 font-semibold block">
                    Seleccione Variedad en el Pedestal:
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {VARIETIES.map((v) => {
                      const active = selectedVariety.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setSelectedVariety(v);
                            setActiveHotspot(null);
                          }}
                          data-cursor="CATAR"
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                            active
                              ? 'bg-cheese/15 border-cheese text-white shadow-lg'
                              : 'bg-white/[0.03] border-white/10 text-cream/70 hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-4 h-4 rounded-full border border-white/40 shrink-0"
                              style={{ backgroundColor: v.rindColor }}
                            />
                            <div>
                              <p className="font-serif font-bold text-base leading-tight text-white">
                                {v.name}
                              </p>
                              <p className="text-2xs text-cream/60">{v.subtitle}</p>
                            </div>
                          </div>
                          <span className="font-serif font-bold text-sm text-cheese tabular-nums">
                            {v.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  <div>
                    <span className="text-2xs uppercase tracking-widest text-cheese font-bold block">
                      Nota del Maestro Quesero & Maridaje
                    </span>
                    <p className="text-xs sm:text-sm text-cream/85 font-light mt-1 leading-relaxed">
                      {selectedVariety.originNote}
                    </p>
                    <p className="text-xs text-cheese/90 italic font-serif mt-2">
                      “{selectedVariety.pairingRitual}”
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-white/10">
                    {[
                      {
                        label: 'Cremosidad Láctea',
                        val: selectedVariety.sensory.cremosidad,
                        icon: Droplets,
                      },
                      {
                        label: 'Notas de Humo & Leña',
                        val: selectedVariety.sensory.ahumado,
                        icon: Flame,
                      },
                      {
                        label: 'Afinación en Cava',
                        val: selectedVariety.sensory.maduracion,
                        icon: Mountain,
                      },
                    ].map((metric) => {
                      const Icon = metric.icon;
                      return (
                        <div key={metric.label} className="space-y-1">
                          <div className="flex items-center justify-between text-2xs">
                            <span className="flex items-center gap-1.5 text-cream/75 font-medium">
                              <Icon className="w-3 h-3 text-cheese" />
                              {metric.label}
                            </span>
                            <span className="font-mono text-cheese tabular-nums">{metric.val}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cheese to-terracotta rounded-full transition-all duration-500"
                              style={{ width: `${metric.val}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div>
                    <span className="text-2xs uppercase tracking-widest text-cream/55 block">
                      {selectedVariety.weightLabel}
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-white tabular-nums">
                      {selectedVariety.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOrderHeroCheese}
                    data-cursor="PEDIR"
                    className="min-h-[48px] px-6 py-3.5 rounded-full bg-cheese hover:bg-cheese-light text-forest font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all active:scale-95 cursor-pointer"
                  >
                    {hasAddedHero ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Agregado al Pedido!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Agregar Pieza</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CONTENIDO POSTERIOR */}
      <div className="relative z-20 bg-cream text-forest">{children}</div>
    </div>
  );
}
