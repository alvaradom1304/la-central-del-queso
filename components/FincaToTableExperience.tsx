"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Rotate3d,
  ShoppingBag,
  Check,
  Slice,
  Plus,
  Minus,
  Search,
  Compass,
  Flame,
  Droplets,
  Mountain,
  MapPin,
  Eye,
  ArrowRight,
  UtensilsCrossed,
  Store,
  Clock,
  Navigation,
  Heart,
  Award,
  SlidersHorizontal,
  Info,
  Zap,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useCart } from "../lib/CartContext";
import { products, CATEGORIES, Product, USD_EXCHANGE_RATE } from "../lib/products";
import { locations } from "../lib/locations";
import { spatialAudio } from "../lib/spatialAudio";
import { DepthPhotoCanvas } from "./DepthPhotoCanvas";
import { VideoScrollytellingPlayer } from "./VideoScrollytellingPlayer";

// ==============================================================================
// 1. DEFINICIÓN DE LAS 7 ESCENAS DEL STORYBOARD «DE LA FINCA A TU MESA»
// ==============================================================================
export interface NarrativeSceneMeta {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  timeOfDay: string;
  altitude: string;
  scrollRange?: [number, number];
  anchorId?: string;
}

export const NARRATIVE_SCENES: NarrativeSceneMeta[] = [
  {
    id: "umbral",
    number: "01",
    title: "El Umbral",
    subtitle: "Portón «Finca Doña Martha» · Amanecer en la Cordillera",
    timeOfDay: "05:35 A.M. · Niebla Volcánica",
    altitude: "1.220 m s.n.m.",
    scrollRange: [0.0, 0.25],
  },
  {
    id: "camino",
    number: "02",
    title: "El Camino Vivo",
    subtitle: "Sendero de Hortensias y Potreros de Pastoreo Libre",
    timeOfDay: "06:10 A.M. · Rocío Matinal",
    altitude: "1.180 m s.n.m.",
    scrollRange: [0.25, 0.5],
  },
  {
    id: "lecheria",
    number: "03",
    title: "La Lechería",
    subtitle: "Recepción en Tarros, Cuajado Tibio y Prensado en Lienzo",
    timeOfDay: "06:45 A.M. · Leche a 34°C",
    altitude: "Taller Artesanal",
    scrollRange: [0.5, 0.76],
  },
  {
    id: "transformacion",
    number: "04",
    title: "La Transformación",
    subtitle: "Del Molde Fresco a las Tablas de Roble y Humo de Guayabo",
    timeOfDay: "Cava en Penumbra · 14°C",
    altitude: "Afinación Lenta",
    scrollRange: [0.76, 1.0],
  },
  {
    id: "mesa",
    number: "05",
    title: "La Mesa",
    subtitle: "La Mesa Artesanal como Interfaz Viva de Degustación",
    timeOfDay: "Luz Cálida de Montaña",
    altitude: "Madera de Guanacaste",
    anchorId: "escena-mesa",
  },
  {
    id: "exploracion",
    number: "06",
    title: "Exploración",
    subtitle: "Alacena Interactiva por Familias, Pesos y Pedido Directo",
    timeOfDay: "Selección al Corte",
    altitude: "Precios de Feria",
    anchorId: "escena-exploracion",
  },
  {
    id: "conexion",
    number: "07",
    title: "Conexión Humana",
    subtitle: "Legado Familiar desde 1980, Ferias y Canal Mayorista B2B",
    timeOfDay: "Guadalupe & Hatillo",
    altitude: "Trato Directo",
    anchorId: "escena-conexion",
  },
];

// ==============================================================================
// 2. CONFIGURACIÓN ESPACIAL DE FAMILIAS SOBRE LA MESA (ESCENAS 05 Y 06)
// ==============================================================================
interface TableFamilyConfig {
  category: string;
  shortTitle: string;
  tableZoneLabel: string;
  atmosphereTitle: string;
  ambientGradient: string;
  accentHex: string;
  rindColor: string;
  pasteColor: string;
  waxBandColor: string;
  tablePinX: string;
  tablePinY: string;
  featuredProductId: string;
  tastingRitual: string;
  macroTextureNote: string;
}

const TABLE_FAMILIES: TableFamilyConfig[] = [
  {
    category: "Línea Tradicional Turrialba",
    shortTitle: "Tradicional Turrialba",
    tableZoneLabel: "Tabla Central · Corteza Dorada",
    atmosphereTitle: "Atmósfera: Sol Matinal de Altura",
    ambientGradient:
      "radial-gradient(circle at 25% 20%, rgba(221, 161, 62, 0.24), rgba(15, 30, 22, 0.96) 72%)",
    accentHex: "#DDA13E",
    rindColor: "#e2a43b",
    pasteColor: "#fff5d6",
    waxBandColor: "#7a2e1d",
    tablePinX: "38%",
    tablePinY: "58%",
    featuredProductId: "semiduro-tradicional",
    tastingRitual:
      "Cortar en tajadas de 1 cm para dorar a la plancha sin que pierda su forma, o servir fresco junto a tortillas recién palmeadas.",
    macroTextureNote:
      "Pasta firme de leche entera con ojos lácteos pequeños y corteza sellada en lienzo de algodón.",
  },
  {
    category: "Quesos de Mesa & Hilados",
    shortTitle: "Hilados & Mesa",
    tableZoneLabel: "Tabla de Cedro · Hebras Frescas",
    atmosphereTitle: "Atmósfera: Vapor de Leche Recién Hilada",
    ambientGradient:
      "radial-gradient(circle at 60% 25%, rgba(243, 234, 211, 0.22), rgba(20, 28, 22, 0.96) 72%)",
    accentHex: "#E8D5B5",
    rindColor: "#f3ead3",
    pasteColor: "#fffdf7",
    waxBandColor: "#1d422b",
    tablePinX: "56%",
    tablePinY: "61%",
    featuredProductId: "queso-palmito",
    tastingRitual:
      "Deshebrar a mano siguiendo el sentido del nudo antes de llevar a la mesa o gratinar al horno.",
    macroTextureNote:
      "Capas concéntricas de hebra elástica y jugosa con acidez láctea limpia y punto suave de salmuera.",
  },
  {
    category: "Madurados & Ahumados",
    shortTitle: "Madurados & Ahumados",
    tableZoneLabel: "Piedra Volcánica · Cava & Leña",
    atmosphereTitle: "Atmósfera: Brasa de Guayabo y Penumbra de Cava",
    ambientGradient:
      "radial-gradient(circle at 35% 30%, rgba(184, 86, 52, 0.28), rgba(22, 15, 11, 0.97) 74%)",
    accentHex: "#C86D44",
    rindColor: "#9e4718",
    pasteColor: "#fae4b7",
    waxBandColor: "#2d1508",
    tablePinX: "73%",
    tablePinY: "66%",
    featuredProductId: "ahumado-lena",
    tastingRitual:
      "Atemperar 15 minutos antes de cortar en cuñas delgadas; marida con miel de flor de café, higos o vino tinto.",
    macroTextureNote:
      "Pátina ámbar tostada al humo natural de madera de guayabo e interior mantecoso de curación lenta.",
  },
  {
    category: "Derivados Lácteos del Rancho",
    shortTitle: "Natilla & Mantequilla",
    tableZoneLabel: "Cuenco de Barro · Crema Pura",
    atmosphereTitle: "Atmósfera: Frescura de Ordeño y Agua de Montaña",
    ambientGradient:
      "radial-gradient(circle at 75% 25%, rgba(122, 168, 138, 0.22), rgba(14, 26, 20, 0.96) 72%)",
    accentHex: "#8FC1A3",
    rindColor: "#eed99b",
    pasteColor: "#fffdf9",
    waxBandColor: "#3b5e49",
    tablePinX: "67%",
    tablePinY: "52%",
    featuredProductId: "natilla-casera",
    tastingRitual:
      "Servir fría directamente del cuenco con cuchara de madera sobre plátano maduro horneado o gallo pinto.",
    macroTextureNote:
      "Crema espesa 100% natural sin almidones ni féculas y mantequilla batida y lavada en agua fría.",
  },
  {
    category: "Especial Mayoristas & Sodas",
    shortTitle: "Canastas & Bloques B2B",
    tableZoneLabel: "Alacena Familiar & Institucional",
    atmosphereTitle: "Atmósfera: Abasto Semanal de Feria y Cocina Profesional",
    ambientGradient:
      "radial-gradient(circle at 50% 20%, rgba(221, 161, 62, 0.22), rgba(18, 22, 18, 0.97) 75%)",
    accentHex: "#DDA13E",
    rindColor: "#d99b38",
    pasteColor: "#fff4d2",
    waxBandColor: "#1B3A2B",
    tablePinX: "84%",
    tablePinY: "44%",
    featuredProductId: "combo-familiar",
    tastingRitual:
      "Surtido familiar con ahorro directo para toda la semana o bloques prensados de 2.5 kg para cocinas comerciales.",
    macroTextureNote:
      "Estandarización artesanal de humedad y punto de sal para garantizar rendimiento superior en plancha y rallado.",
  },
];

// ==============================================================================
// 3. TEXTURAS PROCEDURALES PBR Y ESCULTURA 3D PARA LA MESA (ESCENA 05)
// ==============================================================================
function createTableCheeseTextures() {
  if (typeof document === "undefined") {
    return { rindBump: null, pasteBump: null, woodPlankBump: null };
  }

  const rindCanvas = document.createElement("canvas");
  rindCanvas.width = 512;
  rindCanvas.height = 512;
  const rctx = rindCanvas.getContext("2d")!;
  rctx.fillStyle = "#808080";
  rctx.fillRect(0, 0, 512, 512);

  rctx.strokeStyle = "rgba(255,255,255,0.06)";
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

  for (let i = 0; i < 3600; i++) {
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

  const pasteCanvas = document.createElement("canvas");
  pasteCanvas.width = 512;
  pasteCanvas.height = 512;
  const pctx = pasteCanvas.getContext("2d")!;
  pctx.fillStyle = "#969696";
  pctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 85; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 2 + Math.random() * 7.5;
    const grad = pctx.createRadialGradient(x, y, r * 0.1, x, y, r);
    grad.addColorStop(0, "#323232");
    grad.addColorStop(0.75, "#585858");
    grad.addColorStop(1, "#969696");
    pctx.fillStyle = grad;
    pctx.beginPath();
    pctx.arc(x, y, r, 0, Math.PI * 2);
    pctx.fill();
  }

  const pasteBump = new THREE.CanvasTexture(pasteCanvas);
  pasteBump.wrapS = THREE.RepeatWrapping;
  pasteBump.wrapT = THREE.RepeatWrapping;

  const woodCanvas = document.createElement("canvas");
  woodCanvas.width = 512;
  woodCanvas.height = 512;
  const wctx = woodCanvas.getContext("2d")!;
  wctx.fillStyle = "#707070";
  wctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 550; i++) {
    wctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
    wctx.fillRect(0, Math.random() * 512, 512, 1 + Math.random() * 2.5);
  }
  const woodPlankBump = new THREE.CanvasTexture(woodCanvas);

  return { rindBump, pasteBump, woodPlankBump };
}

function TableStudioLighting() {
  const { scene, gl } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color("#140e09");

    const topSoftbox = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ color: "#ffecd1", side: THREE.DoubleSide })
    );
    topSoftbox.position.set(0, 6, 0);
    topSoftbox.rotation.x = Math.PI / 2;
    envScene.add(topSoftbox);

    const keyPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 7),
      new THREE.MeshBasicMaterial({ color: "#ffd996", side: THREE.DoubleSide })
    );
    keyPanel.position.set(5, 3.5, 5);
    keyPanel.lookAt(0, 0, 0);
    envScene.add(keyPanel);

    const rimPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({ color: "#e68a2e", side: THREE.DoubleSide })
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

function TableCheeseSculpture3D({
  familyConfig,
  cheeseRotYRef,
  isDraggingRef,
  isWedgeCut,
  onToggleWedge,
}: {
  familyConfig: TableFamilyConfig;
  cheeseRotYRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
  isWedgeCut: boolean;
  onToggleWedge: () => void;
}) {
  const turntableRef = useRef<THREE.Group>(null);
  const wedgeGroupRef = useRef<THREE.Group>(null);
  const wedgeSlideRef = useRef(1);

  const { rindBump, pasteBump, woodPlankBump } = useMemo(
    () => createTableCheeseTextures(),
    []
  );

  const WEDGE_ANGLE = Math.PI * 0.34;
  const MAIN_WHEEL_ANGLE = Math.PI * 2 - WEDGE_ANGLE;
  const RADIUS = 1.24;
  const HEIGHT = 0.56;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (!isDraggingRef.current) {
      cheeseRotYRef.current += dt * 0.16;
    }

    if (turntableRef.current) {
      turntableRef.current.rotation.y = THREE.MathUtils.damp(
        turntableRef.current.rotation.y,
        cheeseRotYRef.current,
        10,
        dt
      );
    }

    const targetSlide = isWedgeCut ? 1.0 : 0.0;
    wedgeSlideRef.current = THREE.MathUtils.damp(wedgeSlideRef.current, targetSlide, 8, dt);

    if (wedgeGroupRef.current) {
      const s = wedgeSlideRef.current;
      const bisector = WEDGE_ANGLE * 0.5;
      const dist = s * 0.44;
      wedgeGroupRef.current.position.set(
        Math.sin(bisector) * dist,
        s * 0.04,
        Math.cos(bisector) * dist
      );
    }
  });

  return (
    <group position={[0, -0.28, 0]}>
      <group ref={turntableRef}>
        {/* Tabla Artesanal de Madera de Guanacaste */}
        <mesh position={[0, -0.16, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.66, 1.74, 0.12, 64]} />
          <meshStandardMaterial
            color="#2b1b10"
            roughness={0.68}
            metalness={0.08}
            bumpMap={woodPlankBump}
            bumpScale={0.022}
          />
        </mesh>

        {/* Aro de Bronce Bruñido */}
        <mesh position={[0, -0.09, 0]}>
          <cylinderGeometry args={[1.56, 1.56, 0.028, 64]} />
          <meshStandardMaterial color="#DDA13E" metalness={0.9} roughness={0.22} />
        </mesh>

        {/* Superficie de Corte de Madera */}
        <mesh position={[0, -0.05, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.48, 1.5, 0.07, 64]} />
          <meshStandardMaterial
            color="#4a2c18"
            roughness={0.52}
            metalness={0.05}
            bumpMap={woodPlankBump}
            bumpScale={0.02}
          />
        </mesh>

        {/* Horma Principal */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, HEIGHT / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry
              args={[RADIUS, RADIUS, HEIGHT, 64, 4, false, WEDGE_ANGLE, MAIN_WHEEL_ANGLE]}
            />
            <meshPhysicalMaterial
              color={familyConfig.rindColor}
              roughness={0.38}
              metalness={0.02}
              clearcoat={0.22}
              clearcoatRoughness={0.42}
              sheen={0.38}
              sheenColor="#fff2cc"
              bumpMap={rindBump}
              bumpScale={0.026}
            />
          </mesh>

          {/* Cinta de Cera de la Familia */}
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
            <meshStandardMaterial color={familyConfig.waxBandColor} roughness={0.5} />
          </mesh>

          {/* Caras Interiores de la Pasta */}
          <mesh
            position={[0, HEIGHT / 2, 0]}
            rotation={[0, WEDGE_ANGLE - Math.PI / 2, 0]}
            receiveShadow
          >
            <planeGeometry args={[RADIUS, HEIGHT]} />
            <meshPhysicalMaterial
              color={familyConfig.pasteColor}
              roughness={0.32}
              clearcoat={0.26}
              clearcoatRoughness={0.35}
              bumpMap={pasteBump}
              bumpScale={0.032}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh position={[0, HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
            <planeGeometry args={[RADIUS, HEIGHT]} />
            <meshPhysicalMaterial
              color={familyConfig.pasteColor}
              roughness={0.32}
              clearcoat={0.26}
              clearcoatRoughness={0.35}
              bumpMap={pasteBump}
              bumpScale={0.032}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* Cuña Cortada Interactiva */}
        <group
          ref={wedgeGroupRef}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWedge();
          }}
        >
          <mesh position={[0, HEIGHT / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, 32, 2, false, 0, WEDGE_ANGLE]} />
            <meshPhysicalMaterial
              color={familyConfig.rindColor}
              roughness={0.38}
              metalness={0.02}
              clearcoat={0.22}
              bumpMap={rindBump}
              bumpScale={0.026}
            />
          </mesh>

          <mesh
            position={[0, HEIGHT / 2, 0]}
            rotation={[0, WEDGE_ANGLE - Math.PI / 2, 0]}
            receiveShadow
          >
            <planeGeometry args={[RADIUS, HEIGHT]} />
            <meshPhysicalMaterial
              color={familyConfig.pasteColor}
              roughness={0.3}
              clearcoat={0.28}
              bumpMap={pasteBump}
              bumpScale={0.03}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh position={[0, HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
            <planeGeometry args={[RADIUS, HEIGHT]} />
            <meshPhysicalMaterial
              color={familyConfig.pasteColor}
              roughness={0.3}
              clearcoat={0.28}
              bumpMap={pasteBump}
              bumpScale={0.03}
              side={THREE.DoubleSide}
            />
          </mesh>

          <Html position={[0.45, HEIGHT + 0.18, 0.45]} center distanceFactor={6}>
            <button
              type="button"
              onClick={onToggleWedge}
              className="px-2.5 py-1 rounded-full bg-[#120d09]/90 border border-[#DDA13E]/60 text-[#F7F4EC] text-[10px] font-mono uppercase tracking-widest whitespace-nowrap shadow-xl hover:bg-[#DDA13E] hover:text-[#120d09] transition-colors"
            >
              {isWedgeCut ? "Unir Cuña" : "Cortar Cuña"}
            </button>
          </Html>
        </group>

        {/* Cuchillo Quesero Forjado sobre la Tabla */}
        <group position={[-0.95, 0.02, 0.85]} rotation={[0, 0.55, 0]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.72, 0.015, 0.14]} />
            <meshStandardMaterial color="#d8dde2" metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[-0.52, 0.03, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.045, 0.038, 0.42, 16]} />
            <meshStandardMaterial color="#3b2112" roughness={0.6} />
          </mesh>
        </group>
      </group>

      <ContactShadows
        position={[0, -0.24, 0]}
        opacity={0.65}
        scale={5.5}
        blur={2.2}
        far={2.5}
      />
    </group>
  );
}

// ==============================================================================
// 4. COMPONENTE PRINCIPAL: VIAJE EN 7 ESCENAS «DE LA FINCA A TU MESA»
// ==============================================================================
export default function FincaToTableExperience() {
  const {
    addToCart,
    items,
    setIsCartOpen,
    currency,
    setCurrency,
    totalCRC,
    totalUSD,
    totalItemsCount,
  } = useCart();

  // --- Fuente Única de Progreso Narrativo (Escenas 01 -> 04) ---
  const journeyContainerRef = useRef<HTMLDivElement>(null);
  const [narrativeProgress, setNarrativeProgress] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 });

  // --- Preferencias de Accesibilidad, Rendimiento y Audio ---
  const [liteMode, setLiteMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // --- Estado de Escena 05 y 06 (La Mesa como Interfaz Viva) ---
  const [selectedFamilyIndex, setSelectedFamilyIndex] = useState(0);
  const [showAllFamilies, setShowAllFamilies] = useState(false);
  const [tableVisualMode, setTableVisualMode] = useState<"panorama" | "3d">("panorama");
  const [isFamilyLoading, setIsFamilyLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedFeedback, setAddedFeedback] = useState<Record<string, boolean>>({});
  const [spotlightProductId, setSpotlightProductId] = useState<string>("semiduro-tradicional");

  // --- Estado del Pedestal 3D en La Mesa ---
  const cheeseRotYRef = useRef(0.6);
  const isDragging3DRef = useRef(false);
  const dragStartXRef = useRef(0);
  const [isWedgeCut, setIsWedgeCut] = useState(true);
  const [activeRitualStep, setActiveRitualStep] = useState(1);
  const [activeFieldHotspot, setActiveFieldHotspot] = useState<number>(0);

  const STAGE_FIELD_HOTSPOTS = [
    [
      {
        x: "34%",
        y: "46%",
        tag: "Portón de Cedro · 1980",
        title: "Umbral de Finca Doña Martha",
        desc: "Cruzar este portón abre la ruta familiar que cada semana conecta las faldas del Volcán Turrialba con su mesa.",
      },
      {
        x: "68%",
        y: "38%",
        tag: "Microclima de Altura",
        title: "Bruma Volcánica a 1.220 m s.n.m.",
        desc: "El rocío matinal nutre los pastizales de montaña durante los 365 días del año.",
      },
    ],
    [
      {
        x: "29%",
        y: "62%",
        tag: "Botánica de Montaña",
        title: "Hortensias & Pasto Estrella",
        desc: "Suelos volcánicos ricos en minerales que aportan notas herbales y mantecosas únicas a la leche.",
      },
      {
        x: "64%",
        y: "52%",
        tag: "Bienestar Animal",
        title: "Hato Jersey en Pastoreo Libre",
        desc: "Vacas que pastan en libertad sin estrés industrial, produciendo leche con alto tenor de grasa butírica.",
      },
    ],
    [
      {
        x: "48%",
        y: "54%",
        tag: "Paila Tibia · 34°C",
        title: "Cuajado Matinal Recién Ordeñado",
        desc: "La leche se trabaja tibia apenas entra a la lechería, preservando sus fermentos lácteos naturales.",
      },
      {
        x: "62%",
        y: "66%",
        tag: "Oficio Manual",
        title: "Prensado en Lienzo de Algodón",
        desc: "Cada horma es moldeada y prensada a mano para lograr una textura firme que dora sin soltar agua.",
      },
    ],
    [
      {
        x: "35%",
        y: "48%",
        tag: "Cava en Penumbra",
        title: "Estantes de Roble & Cedro",
        desc: "El volteo manual diario sella una corteza dorada natural que protege la humedad cremosa interior.",
      },
      {
        x: "66%",
        y: "56%",
        tag: "Leña de Montaña",
        title: "Ahumado Suave en Guayabo",
        desc: "Humo tibio de maderas frutales que impregna nuestras variedades maduras con notas de brasa y campo.",
      },
    ],
  ];

  const TASTING_RITUAL_STEPS = [
    {
      step: "01",
      title: "La Corteza de Lino",
      desc: "Inspeccione el relieve micro-poroso dejado por el lienzo artesanal y el volteo a mano.",
      rotY: 0.45,
      cut: false,
    },
    {
      step: "02",
      title: "El Primer Corte",
      desc: "Al abrir la cuña se revela una pasta marfil elástica con ojos lácteos de fermentación limpia.",
      rotY: 1.35,
      cut: true,
    },
    {
      step: "03",
      title: "Afinación & Humo",
      desc: "Las maderas de guayabo y el aire frío de Turrialba sellan un aroma profundo a mantequilla tostada.",
      rotY: 2.85,
      cut: true,
    },
    {
      step: "04",
      title: "Ritual en Mesa",
      desc: "Corte en triángulos de 1 cm para asar a la plancha o degustar con café recién chorreado.",
      rotY: 4.15,
      cut: true,
    },
  ];

  // --- Estado de Escena 07 (Comparador de Maduración & Historia 1980) ---
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [maturationSlider, setMaturationSlider] = useState(52);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Detectar prefers-reduced-motion al montar
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setLiteMode(true);
    }
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setLiteMode(true);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Controlador Único de Progreso Narrativo
  useEffect(() => {
    const handleScroll = () => {
      const container = journeyContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
      const rawProgress = -rect.top / scrollableDistance;
      const clamped = Math.max(0, Math.min(1, rawProgress));
      setNarrativeProgress(clamped);

      // Determinar cuál de las 7 escenas está activa
      const mesaEl = document.getElementById("escena-mesa");
      const expEl = document.getElementById("escena-exploracion");
      const conEl = document.getElementById("escena-conexion");

      const vhMid = window.innerHeight * 0.45;
      if (conEl && conEl.getBoundingClientRect().top <= vhMid) {
        setActiveSceneIndex(6);
      } else if (expEl && expEl.getBoundingClientRect().top <= vhMid) {
        setActiveSceneIndex(5);
      } else if (mesaEl && mesaEl.getBoundingClientRect().top <= vhMid) {
        setActiveSceneIndex(4);
      } else if (clamped < 0.25) {
        setActiveSceneIndex(0);
      } else if (clamped < 0.5) {
        setActiveSceneIndex(1);
      } else if (clamped < 0.76) {
        setActiveSceneIndex(2);
      } else {
        setActiveSceneIndex(3);
      }

      if (audioEnabled) {
        spatialAudio.updateProgress(clamped);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [audioEnabled]);

  const toggleAudio = () => {
    if (audioEnabled) {
      spatialAudio.stop();
      setAudioEnabled(false);
    } else {
      spatialAudio.init();
      setAudioEnabled(true);
    }
  };

  // Navegación directa a cualquier escena del Storyboard
  const navigateToScene = (index: number) => {
    const scene = NARRATIVE_SCENES[index];
    if (!scene) return;

    if (scene.anchorId) {
      const target = document.getElementById(scene.anchorId);
      if (target) {
        target.scrollIntoView({ behavior: liteMode ? "auto" : "smooth" });
      }
      return;
    }

    if (scene.scrollRange && journeyContainerRef.current) {
      const rect = journeyContainerRef.current.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const scrollableDistance = Math.max(
        1,
        journeyContainerRef.current.offsetHeight - window.innerHeight
      );
      const targetProgress = scene.scrollRange[0] + 0.03;
      window.scrollTo({
        top: containerTop + scrollableDistance * targetProgress,
        behavior: liteMode ? "auto" : "smooth",
      });
    }
  };

  const activeFamily = TABLE_FAMILIES[selectedFamilyIndex];

  const handleSelectFamily = (idx: number) => {
    if (idx === selectedFamilyIndex && !showAllFamilies) return;
    setIsFamilyLoading(true);
    setShowAllFamilies(false);
    setSelectedFamilyIndex(idx);
    setSpotlightProductId(TABLE_FAMILIES[idx].featuredProductId);
    setTimeout(() => setIsFamilyLoading(false), 180);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        showAllFamilies ||
        searchQuery.trim().length > 0 ||
        p.category === activeFamily.category;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.presentation.toLowerCase().includes(q) ||
        p.idealUses.some((u) => u.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [activeFamily.category, showAllFamilies, searchQuery]);

  const spotlightProduct = useMemo(
    () =>
      products.find((p) => p.id === spotlightProductId) ||
      products.find((p) => p.id === activeFamily.featuredProductId) ||
      products[0],
    [spotlightProductId, activeFamily.featuredProductId]
  );

  const formatPrice = (priceCRC: number) => {
    if (currency === "CRC") {
      return `₡${priceCRC.toLocaleString("es-CR")}`;
    }
    return `$${(priceCRC / USD_EXCHANGE_RATE).toFixed(2)} USD`;
  };

  const handleQuantityDelta = (id: string, delta: number) => {
    const current = quantities[id] || 1;
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, current + delta) }));
  };

  const handleAddProduct = (product: Product) => {
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    if (audioEnabled) {
      spatialAudio.playKnifeSliceSfx();
    }
    setAddedFeedback((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedFeedback((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
  };

  // --- Cálculos Cinemáticos de Cámara y Transiciones (Escenas 01 -> 04) ---
  // Escena 01: El portón de madera se abre físicamente con el scroll
  const gateOpenRatio = Math.min(1, Math.max(0, narrativeProgress / 0.24));
  const gateSwingDeg = gateOpenRatio * 74; // Las hojas del portón giran hasta 74 grados
  const gateFrameScale = 1 + gateOpenRatio * 0.42;
  const gateFrameOpacity = narrativeProgress < 0.2 ? 1 : Math.max(0, 1 - (narrativeProgress - 0.2) / 0.08);

  // Qué imagen protagoniza el lienzo de profundidad según el progreso
  const currentJourneyStage =
    narrativeProgress < 0.25
      ? 0
      : narrativeProgress < 0.5
      ? 1
      : narrativeProgress < 0.76
      ? 2
      : 3;

  const stageImages = [
    "/porton_finca_turrialba.jpg",
    narrativeProgress < 0.38 ? "/campo_floral_turrialba.jpg" : "/potrero_vacas_lecheria.jpg",
    narrativeProgress < 0.62 ? "/entrada_lecheria_granero.jpg" : "/lecheria_proceso_artesanal.jpg",
    "/interior_cava_roble.jpg",
  ];

  // Zoom progresivo continuo dentro de cada tramo para sensación de avance real
  const localStageProgress =
    currentJourneyStage === 0
      ? narrativeProgress / 0.25
      : currentJourneyStage === 1
      ? (narrativeProgress - 0.25) / 0.25
      : currentJourneyStage === 2
      ? (narrativeProgress - 0.5) / 0.26
      : (narrativeProgress - 0.76) / 0.24;

  const cameraDollyScale = liteMode ? 1.02 : 1.02 + Math.max(0, Math.min(1, localStageProgress)) * 0.16;

  return (
    <div
      onMouseMove={(e) => {
        if (liteMode) return;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        setMouseNorm({ x: nx, y: ny });
      }}
      className="relative bg-[#0D1510] text-[#F7F4EC] selection:bg-[#DDA13E] selection:text-[#0D1510]"
    >
      {/* ====================================================================
          BARRA SUPERIOR DE NAVEGACIÓN CINEMATOGRÁFICA Y ACCESIBILIDAD
      ==================================================================== */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0B120E]/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Identidad de Marca */}
          <a
            href="#inicio-umbral"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: liteMode ? "auto" : "smooth" });
            }}
            className="flex items-center gap-3 group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-full bg-[#DDA13E]/15 border border-[#DDA13E]/50 flex items-center justify-center text-[#DDA13E] font-serif font-bold text-lg group-hover:bg-[#DDA13E] group-hover:text-[#0D1510] transition-colors">
              LC
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#F7F4EC] block leading-none">
                La Central del Queso
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#DDA13E]/90 block mt-1">
                De la Finca a tu Mesa · 1980
              </span>
            </div>
          </a>

          {/* Mapa Interactivo de las 7 Escenas (Desktop) */}
          <nav
            aria-label="Recorrido narrativo de 7 escenas"
            className="hidden xl:flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-full border border-white/10"
          >
            {NARRATIVE_SCENES.map((scene, idx) => {
              const isCurrent = activeSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => navigateToScene(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? "bg-[#DDA13E] text-[#0D1510] font-semibold shadow-sm"
                      : "text-[#F7F4EC]/70 hover:text-[#F7F4EC] hover:bg-white/5"
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-75">{scene.number}</span>
                  <span>{scene.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Controles Rápidos: Modo Ligero, Audio, Calculadora, Ver Productos y Canasta */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setLiteMode((prev) => !prev)}
              title="Activar o desactivar animaciones espaciales y 3D"
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
                liteMode
                  ? "bg-[#DDA13E]/20 border-[#DDA13E] text-[#DDA13E]"
                  : "bg-white/5 border-white/15 text-[#F7F4EC]/75 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {liteMode ? "Modo Ligero Activo" : "Modo Ligero"}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleAudio}
              aria-label={audioEnabled ? "Silenciar paisaje sonoro" : "Activar sonido de finca"}
              className={`p-2 rounded-full border transition-colors ${
                audioEnabled
                  ? "bg-[#DDA13E]/20 border-[#DDA13E] text-[#DDA13E]"
                  : "bg-white/5 border-white/15 text-[#F7F4EC]/75 hover:text-white"
              }`}
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Acceso rápido a la Calculadora Semanal */}
            <a
              href="#calculadora-sommelier"
              className="px-3.5 py-2 rounded-full bg-[#1B130D] hover:bg-[#DDA13E] hover:text-[#0D1510] border border-[#DDA13E]/40 text-xs font-medium text-[#DDA13E] transition-colors hidden md:inline-flex items-center gap-1.5"
            >
              <span>Calculadora</span>
            </a>

            {/* Botón directo "Ver productos" exigido en Escena 01 y barra global */}
            <button
              type="button"
              onClick={() => navigateToScene(4)}
              className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-[#F7F4EC] transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Ver Productos</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DDA13E]" />
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative px-3.5 sm:px-4 py-2 rounded-full bg-[#DDA13E] hover:bg-[#F0BA5C] text-[#0D1510] font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Pedido</span>
              {totalItemsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#0D1510] text-[#DDA13E] font-mono text-[11px] font-bold tabular-nums">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          ESCENAS 01 A 04 — EL VIAJE CINEMATOGRÁFICO («DE LA FINCA A TU MESA»)
          Un único controlador de progreso narrativo sincroniza cámara,
          apertura 3D del portón «Finca Doña Martha», camino vivo, lechería y
          match-cut espacial hacia la mesa.
      ==================================================================== */}
      <section
        id="inicio-umbral"
        ref={journeyContainerRef}
        className={`relative w-full ${liteMode ? "min-h-screen py-24" : "h-[430vh]"}`}
      >
        <div
          className={`${
            liteMode ? "relative min-h-[85vh]" : "sticky top-0 h-screen w-full"
          } overflow-hidden flex flex-col justify-between pt-20 pb-8 px-4 sm:px-10 select-none`}
        >
          {/* CAPA 1: VIDEO SCROLLYTELLING CONTINUO COHERENTE («DE LA FINCA A TU MESA») */}
          <div className="absolute inset-0 -z-20 overflow-hidden bg-[#0A110D]">
            <VideoScrollytellingPlayer
              currentStage={currentJourneyStage}
              localStageProgress={localStageProgress}
              globalProgress={narrativeProgress}
              cameraDollyScale={cameraDollyScale}
              liteMode={liteMode}
              className="w-full h-full"
            />
          </div>

          {/* CAPA 2: NIEBLA VOLCÁNICA Y VAPOR ARTESANAL EN MOVIMIENTO */}
          {!liteMode && (
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div
                className="absolute -inset-x-1/4 top-12 h-72 rounded-full blur-[90px] opacity-40 transition-transform duration-500"
                style={{
                  background:
                    currentJourneyStage <= 1
                      ? "radial-gradient(circle, rgba(232,240,234,0.45) 0%, transparent 70%)"
                      : "radial-gradient(circle, rgba(245,205,140,0.35) 0%, transparent 70%)",
                  transform: `translate3d(${(mouseNorm.x * -28).toFixed(1)}px, ${(
                    mouseNorm.y * -14
                  ).toFixed(1)}px, 0)`,
                }}
              />
            </div>
          )}

          {/* CAPA 2.5: PINES INTERACTIVOS DE DESCUBRIMIENTO EN EL PAISAJE (ESCENAS 01–04) */}
          <div className="hidden md:block absolute inset-0 z-15 pointer-events-none">
            {(STAGE_FIELD_HOTSPOTS[currentJourneyStage] || []).map((spot, idx) => {
              const isSpotActive = activeFieldHotspot === idx;
              return (
                <button
                  key={spot.title}
                  type="button"
                  data-cursor="EXPLORAR"
                  onClick={() => setActiveFieldHotspot(idx)}
                  style={{ left: spot.x, top: spot.y }}
                  className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-hidden"
                >
                  <span
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-all shadow-2xl ${
                      isSpotActive
                        ? "bg-[#DDA13E] text-[#0D1510] border-white font-bold scale-105"
                        : "bg-[#0B120E]/85 text-[#F7F4EC] border-[#DDA13E]/60 hover:bg-[#16110C]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSpotActive ? "bg-[#0D1510] animate-ping" : "bg-[#DDA13E]"
                      }`}
                    />
                    <span className="font-mono text-[11px]">{spot.title}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* CAPA 3: ESCENA 01 — PORTÓN DE MADERA TALLADA «FINCA DOÑA MARTHA» EN PERSPECTIVA 3D */}
          {gateFrameOpacity > 0.01 && !liteMode && (
            <div
              className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between overflow-hidden"
              style={{
                perspective: "1400px",
                opacity: gateFrameOpacity,
                transform: `scale(${gateFrameScale.toFixed(3)})`,
                transformOrigin: "center center",
              }}
            >
              {/* Dintel / Arco Superior de Madera Rústica con Letrero «FINCA DOÑA MARTHA» */}
              <div className="w-full pt-16 sm:pt-20 flex justify-center">
                <div className="relative px-8 sm:px-14 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-b from-[#2E1E12] via-[#23160D] to-[#1A1009] border-2 border-[#6E4B2E]/70 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-center">
                  {/* Clavos de hierro forjado en las esquinas del letrero */}
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D46] absolute top-2.5 left-3 shadow-inner" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D46] absolute top-2.5 right-3 shadow-inner" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D46] absolute bottom-2.5 left-3 shadow-inner" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D46] absolute bottom-2.5 right-3 shadow-inner" />

                  <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#DDA13E]/90 block">
                    Santa Cruz de Turrialba · Costa Rica
                  </span>
                  <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.14em] text-[#F7F4EC] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] block mt-0.5">
                    FINCA DOÑA MARTHA
                  </span>
                  <span className="font-mono text-[9px] text-[#F7F4EC]/55 block mt-1">
                    * Nombre narrativo del recorrido · Tradición Familiar desde 1980
                  </span>
                </div>
              </div>

              {/* Hojas Izquierda y Derecha del Portón de Madera que se abren al hacer Scroll */}
              <div className="relative flex-1 flex items-end justify-between px-0 pb-0">
                {/* Hoja Izquierda del Portón */}
                <div
                  style={{
                    transformOrigin: "left center",
                    transform: `rotateY(${gateSwingDeg.toFixed(1)}deg)`,
                  }}
                  className="w-[26vw] max-w-[320px] h-[54vh] border-r-4 border-t-4 border-[#4A321F]/85 bg-gradient-to-r from-[#1E130B]/95 via-[#2C1C11]/75 to-transparent rounded-tr-xl shadow-2xl flex flex-col justify-evenly py-6"
                >
                  <div className="h-5 w-full bg-[#3A2516]/90 border-y border-[#6B482D]/40" />
                  <div className="h-5 w-full bg-[#3A2516]/90 border-y border-[#6B482D]/40" />
                  <div className="h-5 w-full bg-[#3A2516]/90 border-y border-[#6B482D]/40" />
                </div>

                {/* Hoja Derecha del Portón */}
                <div
                  style={{
                    transformOrigin: "right center",
                    transform: `rotateY(-${gateSwingDeg.toFixed(1)}deg)`,
                  }}
                  className="w-[26vw] max-w-[320px] h-[54vh] border-l-4 border-t-4 border-[#4A321F]/85 bg-gradient-to-l from-[#1E130B]/95 via-[#2C1C11]/75 to-transparent rounded-tl-xl shadow-2xl flex flex-col justify-evenly py-6"
                >
                  <div className="h-5 w-full bg-[#3A2516]/90 border-y border-[#6B482D]/40" />
                  <div className="h-5 w-full bg-[#3A2516]/90 border-y border-[#6B482D]/40" />
                  <div className="h-5 w-full bg-[#3A2516]/90 border-y border-[#6B482D]/40" />
                </div>
              </div>
            </div>
          )}

          {/* CAPA 4: TELEMETRÍA SUPERIOR DEL VIAJE Y SELECTOR DE ESCENA */}
          <div className="relative z-20 max-w-[1440px] w-full mx-auto flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0B120E]/75 backdrop-blur-md border border-white/15">
              <span className="px-2 py-0.5 rounded-full bg-[#DDA13E] text-[#0D1510] font-mono text-xs font-bold">
                ESCENA {NARRATIVE_SCENES[currentJourneyStage].number} / 07
              </span>
              <span className="font-serif italic text-base sm:text-lg text-[#F7F4EC]">
                {NARRATIVE_SCENES[currentJourneyStage].title}
              </span>
              <span className="hidden sm:inline text-white/30">·</span>
              <span className="hidden sm:inline font-mono text-xs text-[#DDA13E]">
                {NARRATIVE_SCENES[currentJourneyStage].timeOfDay}
              </span>
            </div>

            {/* Indicador de Altitud y Transparencia Editorial */}
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-full bg-[#0B120E]/75 backdrop-blur-md border border-white/15 font-mono text-xs text-[#F7F4EC]/85 flex items-center gap-2">
                <Mountain className="w-3.5 h-3.5 text-[#DDA13E]" />
                <span>{NARRATIVE_SCENES[currentJourneyStage].altitude}</span>
              </div>
              {currentJourneyStage === 2 && (
                <div className="px-3.5 py-1.5 rounded-full bg-[#B85634]/90 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white">
                  Recreación artística conceptual del oficio artesanal
                </div>
              )}
            </div>
          </div>

          {/* CAPA 5: NARRATIVA CENTRAL Y PUNTOS DE INTERÉS ESPACIALES POR ESCENA */}
          <div className="relative z-20 max-w-[1440px] w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-5 bg-[#0B120E]/70 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentJourneyStage}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.32 }}
                  className="space-y-4"
                >
                  <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#DDA13E] flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    <span>{NARRATIVE_SCENES[currentJourneyStage].subtitle}</span>
                  </div>

                  {currentJourneyStage === 0 && (
                    <>
                      <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight text-[#F7F4EC] text-balance">
                        Cruzar el portón donde nace el sabor de 1980.
                      </h1>
                      <p className="text-sm sm:text-base text-[#F7F4EC]/85 font-light leading-relaxed max-w-2xl">
                        Bienvenido al umbral de{" "}
                        <strong className="font-medium text-[#DDA13E]">
                          «Finca Doña Martha»
                        </strong>{" "}
                        en las faldas húmedas de Turrialba. Avance con el scroll para abrir el
                        portón de madera, recorrer nuestros potreros de altura y llegar hasta la
                        mesa donde cada horma se convierte en su pedido semanal.
                      </p>
                    </>
                  )}

                  {currentJourneyStage === 1 && (
                    <>
                      <h2 className="font-serif text-4xl sm:text-6xl font-semibold leading-[1.04] tracking-tight text-[#F7F4EC] text-balance">
                        El camino vivo entre hortensias, neblina y pastoreo libre.
                      </h2>
                      <p className="text-sm sm:text-base text-[#F7F4EC]/85 font-light leading-relaxed max-w-2xl">
                        A 1.180 metros de altitud, el rocío volcánico mantiene tierno el pasto todo
                        el año. Las vacas pastan sin prisa industrial, aportando el color dorado
                        natural y la riqueza butírica que distingue al verdadero queso de montaña.
                      </p>
                    </>
                  )}

                  {currentJourneyStage === 2 && (
                    <>
                      <h2 className="font-serif text-4xl sm:text-6xl font-semibold leading-[1.04] tracking-tight text-[#F7F4EC] text-balance">
                        La lechería al amanecer: leche tibia, lienzo y manos expertas.
                      </h2>
                      <p className="text-sm sm:text-base text-[#F7F4EC]/85 font-light leading-relaxed max-w-2xl">
                        La leche recién ordeñada llega en tarros a 34°C. Se corta la cuajada con
                        lira artesanal, se hila el palmito en caliente y se prensan las hormas en
                        mantas de algodón puro.{" "}
                        <span className="italic text-[#DDA13E]">
                          (Escena de recreación artística conceptual inspirada en el oficio
                          tradicional costarricense).
                        </span>
                      </p>
                    </>
                  )}

                  {currentJourneyStage === 3 && (
                    <>
                      <h2 className="font-serif text-4xl sm:text-6xl font-semibold leading-[1.04] tracking-tight text-[#F7F4EC] text-balance">
                        La transformación: silencio de cava y humo de guayabo.
                      </h2>
                      <p className="text-sm sm:text-base text-[#F7F4EC]/85 font-light leading-relaxed max-w-2xl">
                        Atravesamos el pórtico de madera hacia la cava de maduración. Aquí el
                        tiempo y el humo suave de maderas frutales sellan la corteza dorada antes
                        de servir las piezas directamente en nuestra mesa artesanal.
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Botonera de Acción Inmediata: Avanzar Tramo, Ir a La Mesa o Abrir Calculadora */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateToScene(4)}
                  className="min-h-[48px] px-6 py-3 rounded-full bg-[#DDA13E] hover:bg-[#F0BA5C] text-[#0D1510] font-semibold text-sm flex items-center gap-2.5 shadow-xl transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ver Productos en La Mesa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#calculadora-sommelier"
                  className="min-h-[48px] px-5 py-3 rounded-full bg-[#1B130D]/90 hover:bg-[#DDA13E] text-[#DDA13E] hover:text-[#0D1510] border border-[#DDA13E]/45 text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <span>Calculadora de Feria & Sommelier</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Tarjeta Lateral Interactiva de Hallazgos de Campo + Control de Progreso */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {STAGE_FIELD_HOTSPOTS[currentJourneyStage]?.[activeFieldHotspot] && (
                <div className="bg-[#16110C]/90 backdrop-blur-xl p-5 rounded-3xl border border-[#DDA13E]/40 space-y-2 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#DDA13E]">
                      ● HALLAZGO INTERACTIVO ·{" "}
                      {STAGE_FIELD_HOTSPOTS[currentJourneyStage][activeFieldHotspot].tag}
                    </span>
                    <div className="flex gap-1.5">
                      {STAGE_FIELD_HOTSPOTS[currentJourneyStage].map((s, idx) => (
                        <button
                          key={s.title}
                          type="button"
                          onClick={() => setActiveFieldHotspot(idx)}
                          className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                            activeFieldHotspot === idx
                              ? "bg-[#DDA13E] text-[#0D1510] font-bold"
                              : "bg-white/10 text-[#F7F4EC]/70"
                          }`}
                        >
                          Nota 0{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#F7F4EC]">
                    {STAGE_FIELD_HOTSPOTS[currentJourneyStage][activeFieldHotspot].title}
                  </h3>
                  <p className="text-xs text-[#F7F4EC]/80 font-light leading-relaxed">
                    {STAGE_FIELD_HOTSPOTS[currentJourneyStage][activeFieldHotspot].desc}
                  </p>
                </div>
              )}

              <div className="bg-[#0B120E]/75 backdrop-blur-xl p-5 rounded-3xl border border-white/15 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#DDA13E]">
                  <span>PROGRESO DEL RECORRIDO POR LA FINCA</span>
                  <span>{Math.round(narrativeProgress * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#DDA13E] to-[#F0BA5C] transition-all duration-150"
                    style={{ width: `${Math.round(narrativeProgress * 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[0, 1, 2, 3].map((stageIdx) => (
                    <button
                      key={stageIdx}
                      type="button"
                      onClick={() => {
                        setActiveFieldHotspot(0);
                        navigateToScene(stageIdx);
                      }}
                      className={`py-2 px-2 rounded-xl text-left border transition-all ${
                        currentJourneyStage === stageIdx
                          ? "bg-[#DDA13E]/20 border-[#DDA13E] text-[#F7F4EC]"
                          : "bg-white/5 border-white/10 text-[#F7F4EC]/60 hover:text-white"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-[#DDA13E] block">
                        0{stageIdx + 1}
                      </span>
                      <span className="text-xs font-medium line-clamp-1">
                        {NARRATIVE_SCENES[stageIdx].title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CAPA 6: PIE DE ESCENA CON INDICADOR DE SCROLL O SALTO DIRECTO */}
          <div className="relative z-20 max-w-[1440px] w-full mx-auto flex items-center justify-between text-xs text-[#F7F4EC]/70 pt-4">
            <span className="font-mono uppercase tracking-widest">
              {currentJourneyStage < 3
                ? "Deslice hacia abajo para avanzar por el sendero"
                : "Siguiente paso: La Mesa Artesanal Interactiva"}
            </span>
            <button
              type="button"
              onClick={() => navigateToScene(5)}
              className="font-mono uppercase tracking-widest text-[#DDA13E] hover:underline flex items-center gap-1"
            >
              <span>Saltar animación e ir al catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ESCENA 05 — LA MESA ARTESANAL COMO INTERFAZ VIVA (#escena-mesa)
          La mesa deja de ser una decoración: sus estaciones espaciales
          permiten tocar las 5 familias de productos, cambiando atmósfera,
          tabla central (Panorama Fotográfico con pines o Escultura 3D al corte)
          y ficha activa.
      ==================================================================== */}
      <section
        id="escena-mesa"
        className="relative py-24 sm:py-32 px-4 sm:px-8 border-t border-white/10 transition-all duration-700"
        style={{ background: activeFamily.ambientGradient }}
      >
        <div className="max-w-[1440px] mx-auto space-y-12">
          {/* Cabecera de Escena 05 */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 font-mono text-xs text-[#DDA13E]">
                <span>ESCENA 05 · LA MESA COMO INTERFAZ</span>
                <span>·</span>
                <span>{activeFamily.atmosphereTitle}</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight text-[#F7F4EC] leading-[1.05]">
                La Mesa de Guanacaste: toque una familia para transformar la cata.
              </h2>
              <p className="text-sm sm:text-base text-[#F7F4EC]/80 font-light leading-relaxed">
                Cada estación sobre la madera representa una familia artesanal de{" "}
                <strong>La Central del Queso</strong>. Seleccione una familia sobre la mesa o
                interactúe con la pieza en 3D para explorar su textura, corte y precios reales.
              </p>
            </div>

            {/* Conmutador entre Mesa Fotográfica con Pines Espaciales y Escultura 3D al Corte */}
            <div className="flex items-center gap-2 bg-[#0B120E]/80 p-1.5 rounded-2xl border border-white/15 self-start">
              <button
                type="button"
                onClick={() => setTableVisualMode("panorama")}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  tableVisualMode === "panorama"
                    ? "bg-[#DDA13E] text-[#0D1510] shadow-md"
                    : "text-[#F7F4EC]/75 hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Mesa Panorámica Interactiva</span>
              </button>
              <button
                type="button"
                onClick={() => setTableVisualMode("3d")}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  tableVisualMode === "3d"
                    ? "bg-[#DDA13E] text-[#0D1510] shadow-md"
                    : "text-[#F7F4EC]/75 hover:text-white"
                }`}
              >
                <Rotate3d className="w-4 h-4" />
                <span>Corte 3D sobre la Tabla</span>
              </button>
            </div>
          </div>

          {/* Selector de las 5 Familias sobre la Mesa */}
          <div
            role="tablist"
            aria-label="Familias de productos en la mesa"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
          >
            {TABLE_FAMILIES.map((fam, idx) => {
              const isSelected = selectedFamilyIndex === idx && !showAllFamilies;
              const count = products.filter((p) => p.category === fam.category).length;
              return (
                <button
                  key={fam.category}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelectFamily(idx)}
                  className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                    isSelected
                      ? "bg-[#1C140E] border-[#DDA13E] shadow-[0_12px_35px_rgba(221,161,62,0.22)] -translate-y-0.5"
                      : "bg-[#0B120E]/65 border-white/10 hover:border-white/30 hover:bg-[#0B120E]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#DDA13E]">
                      Estación 0{idx + 1}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-[#F7F4EC]/80">
                      {count} var.
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#F7F4EC] leading-snug">
                      {fam.shortTitle}
                    </h3>
                    <p className="text-xs text-[#F7F4EC]/60 mt-0.5 line-clamp-1">
                      {fam.tableZoneLabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Escenario Principal de La Mesa: Vista Izquierda (Mesa Interactiva / 3D) + Vista Derecha (Pieza Protagonista en Mesa) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Lado Izquierdo (7 cols): La Mesa Viva */}
            <div className="lg:col-span-7 relative rounded-[2.25rem] overflow-hidden border border-white/15 bg-[#120D09] shadow-[0_30px_80px_rgba(0,0,0,0.65)] min-h-[440px] sm:min-h-[540px] flex flex-col justify-between">
              {tableVisualMode === "panorama" ? (
                <div className="relative w-full h-full min-h-[440px] sm:min-h-[540px] flex-1">
                  <img
                    src="/mesa_interactiva_tasting.jpg"
                    alt="Mesa artesanal de madera de guanacaste con quesos de La Central del Queso frente a las montañas de Turrialba"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1510]/90 via-transparent to-[#0D1510]/45 pointer-events-none" />

                  {/* Pines Interactivos Anclados Físicamente sobre las Piezas de la Mesa */}
                  {TABLE_FAMILIES.map((fam, idx) => {
                    const isActive = selectedFamilyIndex === idx;
                    return (
                      <button
                        key={fam.category}
                        type="button"
                        onClick={() => handleSelectFamily(idx)}
                        style={{ left: fam.tablePinX, top: fam.tablePinY }}
                        className={`-translate-x-1/2 -translate-y-1/2 absolute z-20 group focus:outline-hidden transition-transform ${
                          isActive ? "scale-110 z-30" : "hover:scale-105"
                        }`}
                      >
                        <span
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-full border backdrop-blur-md shadow-2xl text-xs font-medium transition-all ${
                            isActive
                              ? "bg-[#DDA13E] text-[#0D1510] border-white font-bold"
                              : "bg-[#0D1510]/85 text-[#F7F4EC] border-[#DDA13E]/60 hover:bg-[#1B130D]"
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isActive ? "bg-[#0D1510] animate-ping" : "bg-[#DDA13E]"
                            }`}
                          />
                          <span>{fam.shortTitle}</span>
                        </span>
                      </button>
                    );
                  })}

                  {/* Leyenda Inferior sobre la Mesa */}
                  <div className="absolute bottom-5 inset-x-5 z-20 flex flex-wrap items-center justify-between gap-3 bg-[#0B120E]/85 backdrop-blur-xl p-4 rounded-2xl border border-white/15">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#DDA13E] block">
                        {activeFamily.tableZoneLabel}
                      </span>
                      <p className="text-xs sm:text-sm text-[#F7F4EC]/90 mt-0.5">
                        {activeFamily.macroTextureNote}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTableVisualMode("3d")}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#DDA13E] hover:text-[#0D1510] text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <Rotate3d className="w-4 h-4" />
                      <span>Inspeccionar Horma en 3D</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onPointerDown={(e) => {
                    isDragging3DRef.current = true;
                    dragStartXRef.current = e.clientX;
                  }}
                  onPointerMove={(e) => {
                    if (!isDragging3DRef.current) return;
                    const deltaX = e.clientX - dragStartXRef.current;
                    dragStartXRef.current = e.clientX;
                    cheeseRotYRef.current += deltaX * 0.012;
                  }}
                  onPointerUp={() => {
                    isDragging3DRef.current = false;
                  }}
                  onPointerLeave={() => {
                    isDragging3DRef.current = false;
                  }}
                  className="relative w-full h-full min-h-[440px] sm:min-h-[540px] flex-1 cursor-grab active:cursor-grabbing"
                >
                  {/* Selector Interactivo del Ritual de Cata en 4 Fases */}
                  <div className="absolute top-4 inset-x-4 z-20 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TASTING_RITUAL_STEPS.map((ritual, rIdx) => {
                      const isStepActive = activeRitualStep === rIdx;
                      return (
                        <button
                          key={ritual.step}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRitualStep(rIdx);
                            cheeseRotYRef.current = ritual.rotY;
                            setIsWedgeCut(ritual.cut);
                            if (audioEnabled) spatialAudio.playKnifeSliceSfx();
                          }}
                          className={`p-2.5 rounded-xl border text-left backdrop-blur-md transition-all ${
                            isStepActive
                              ? "bg-[#DDA13E] text-[#0D1510] border-white font-bold shadow-lg"
                              : "bg-[#0B120E]/80 text-[#F7F4EC]/80 border-white/15 hover:border-[#DDA13E]/50"
                          }`}
                        >
                          <span className="font-mono text-[10px] uppercase block opacity-80">
                            Fase {ritual.step}
                          </span>
                          <span className="font-serif text-xs sm:text-sm font-semibold block truncate">
                            {ritual.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {!liteMode ? (
                    <Canvas
                      shadows
                      dpr={[1, 1.5]}
                      camera={{ position: [0, 1.45, 3.35], fov: 42 }}
                    >
                      <TableStudioLighting />
                      <ambientLight intensity={0.55} />
                      <directionalLight
                        position={[4, 6, 4]}
                        intensity={1.6}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                      />
                      <TableCheeseSculpture3D
                        familyConfig={activeFamily}
                        cheeseRotYRef={cheeseRotYRef}
                        isDraggingRef={isDragging3DRef}
                        isWedgeCut={isWedgeCut}
                        onToggleWedge={() => {
                          setIsWedgeCut((prev) => !prev);
                          if (audioEnabled) spatialAudio.playKnifeSliceSfx();
                        }}
                      />
                    </Canvas>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <img
                        src={spotlightProduct.image}
                        alt={spotlightProduct.name}
                        className="w-64 h-48 object-cover rounded-2xl border border-[#DDA13E]/40"
                      />
                      <p className="text-xs text-[#F7F4EC]/75 max-w-sm">
                        Modo Ligero activo. Desactive &ldquo;Modo Ligero&rdquo; en la barra
                        superior si desea interactuar con la horma 3D en tiempo real.
                      </p>
                    </div>
                  )}

                  {/* Controles de la Tabla 3D */}
                  <div className="absolute bottom-5 inset-x-5 z-20 flex flex-wrap items-center justify-between gap-3 bg-[#0B120E]/85 backdrop-blur-xl p-4 rounded-2xl border border-white/15">
                    <div className="space-y-0.5 max-w-md">
                      <div className="flex items-center gap-2 text-xs text-[#DDA13E] font-mono">
                        <Rotate3d className="w-4 h-4" />
                        <span>
                          {TASTING_RITUAL_STEPS[activeRitualStep].step} ·{" "}
                          {TASTING_RITUAL_STEPS[activeRitualStep].title}
                        </span>
                      </div>
                      <p className="text-xs text-[#F7F4EC]/80">
                        {TASTING_RITUAL_STEPS[activeRitualStep].desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsWedgeCut((prev) => !prev);
                          if (audioEnabled) spatialAudio.playKnifeSliceSfx();
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#DDA13E] text-[#0D1510] text-xs font-bold flex items-center gap-1.5"
                      >
                        <Slice className="w-3.5 h-3.5" />
                        <span>{isWedgeCut ? "Unir Cuña" : "Cortar Cuña"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTableVisualMode("panorama")}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white"
                      >
                        Ver Mesa Completa
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lado Derecho (5 cols): Ficha Sensorial y Pedido Directo de la Pieza en Mesa */}
            <div className="lg:col-span-5 rounded-[2.25rem] bg-[#16110C] border border-white/15 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#DDA13E]">
                    Pieza Destacada en Mesa
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-[#F7F4EC]/90">
                    {spotlightProduct.presentation}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={spotlightProduct.image}
                    alt={spotlightProduct.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#DDA13E]/30 shrink-0"
                  />
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F7F4EC] leading-tight">
                      {spotlightProduct.name}
                    </h3>
                    <p className="font-serif italic text-sm text-[#DDA13E]">
                      {spotlightProduct.category}
                    </p>
                    <div className="pt-1 flex items-baseline gap-2 tabular-nums">
                      <span className="font-serif text-2xl font-bold text-[#F7F4EC]">
                        {formatPrice(spotlightProduct.priceCRC)}
                      </span>
                      <span className="font-mono text-xs text-[#F7F4EC]/55">
                        / {spotlightProduct.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#F7F4EC]/80 font-light leading-relaxed">
                  {spotlightProduct.description}
                </p>

                {/* Perfil Sensorial de la Pieza */}
                <div className="p-4 rounded-2xl bg-black/35 border border-white/10 space-y-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#DDA13E] block">
                    Notas de Cata & Estructura Láctea
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {(
                      [
                        { label: "Firmeza", val: spotlightProduct.sensory.firmeza },
                        { label: "Salinidad", val: spotlightProduct.sensory.salinidad },
                        { label: "Fundición", val: spotlightProduct.sensory.fundicion },
                        { label: "Intensidad", val: spotlightProduct.sensory.intensidad },
                      ] as const
                    ).map((metric) => (
                      <div key={metric.label} className="space-y-1">
                        <div className="flex justify-between text-[#F7F4EC]/80">
                          <span>{metric.label}</span>
                          <span className="font-mono text-[#DDA13E]">{metric.val}/5</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#DDA13E] rounded-full"
                            style={{ width: `${(metric.val / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs italic text-[#F7F4EC]/70 pt-2 border-t border-white/10">
                    &ldquo;{activeFamily.tastingRitual}&rdquo;
                  </p>
                </div>
              </div>

              {/* Acción de Compra Directa desde La Mesa */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center bg-white/5 border border-white/15 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => handleQuantityDelta(spotlightProduct.id, -1)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#F7F4EC]/70 hover:text-white hover:bg-white/10"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 font-mono text-sm font-bold tabular-nums">
                      {quantities[spotlightProduct.id] || 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityDelta(spotlightProduct.id, 1)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#F7F4EC]/70 hover:text-white hover:bg-white/10"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddProduct(spotlightProduct)}
                    className="flex-1 min-h-[46px] px-5 py-3 rounded-xl bg-[#DDA13E] hover:bg-[#F0BA5C] text-[#0D1510] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                  >
                    {addedFeedback[spotlightProduct.id] ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡En su canasta!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>
                          Servir en mi Pedido (
                          {formatPrice(
                            spotlightProduct.priceCRC * (quantities[spotlightProduct.id] || 1)
                          )}
                          )
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-[#F7F4EC]/50 font-mono">
                  * Precios de referencia en feria. Se confirma disponibilidad y peso exacto vía
                  WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ESCENA 06 — EXPLORACIÓN INTERACTIVA EN LA ALACENA DE LA MESA (#escena-exploracion)
          Reemplaza el antiguo grid de tarjetas blancas repetidas por un
          listado escénico de Tablas de Alacena con estados de carga, vacío,
          moneda CRC/USD y adición inmediata al pedido.
      ==================================================================== */}
      <section
        id="escena-exploracion"
        className="relative py-20 sm:py-28 px-4 sm:px-8 bg-[#120E0A] border-t border-white/10"
      >
        <div className="max-w-[1440px] mx-auto space-y-10">
          {/* Barra de Control de la Alacena: Moneda, Buscador y Filtro de Familia */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#DDA13E] block">
                ESCENA 06 · EXPLORACIÓN INTERACTIVA DE VARIEDADES
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#F7F4EC]">
                {showAllFamilies
                  ? "Alacena Completa de Finca (12 Variedades)"
                  : `Familia: ${activeFamily.category}`}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Buscador en vivo */}
              <div className="relative min-w-[260px] sm:min-w-[320px]">
                <Search className="w-4 h-4 text-[#F7F4EC]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar variedad, uso (freír, fundir, pinto)..."
                  className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-[#F7F4EC] placeholder:text-[#F7F4EC]/40 focus:outline-hidden focus:border-[#DDA13E]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#DDA13E] hover:underline px-1.5 py-0.5"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Botón para alternar entre la familia activa en la mesa o las 12 variedades */}
              <button
                type="button"
                onClick={() => setShowAllFamilies((prev) => !prev)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  showAllFamilies
                    ? "bg-[#DDA13E] text-[#0D1510] border-[#DDA13E]"
                    : "bg-white/5 text-[#F7F4EC]/85 border-white/15 hover:border-white/30"
                }`}
              >
                {showAllFamilies
                  ? "Filtrar por Estación de Mesa"
                  : `Ver Todas las Familias (${products.length})`}
              </button>

              {/* Selector de Moneda CRC / USD */}
              <div className="inline-flex items-center bg-white/5 p-1 rounded-xl border border-white/15">
                <button
                  type="button"
                  onClick={() => setCurrency("CRC")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    currency === "CRC"
                      ? "bg-[#DDA13E] text-[#0D1510]"
                      : "text-[#F7F4EC]/65 hover:text-white"
                  }`}
                >
                  ₡ CRC
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    currency === "USD"
                      ? "bg-[#DDA13E] text-[#0D1510]"
                      : "text-[#F7F4EC]/65 hover:text-white"
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>
          </div>

          {/* Estado de Carga de Transición entre Familias */}
          {isFamilyLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-9 h-9 border-2 border-[#DDA13E] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-serif italic text-lg text-[#DDA13E]">
                Preparando la tabla de {activeFamily.shortTitle}...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Estado Vacío */
            <div className="py-16 px-6 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-4 max-w-xl mx-auto">
              <Info className="w-8 h-8 text-[#DDA13E] mx-auto" />
              <h3 className="font-serif text-2xl text-[#F7F4EC]">
                No encontramos esa variedad en la mesa
              </h3>
              <p className="text-sm text-[#F7F4EC]/65">
                Intente buscar por otro término (por ejemplo: &ldquo;palmito&rdquo;,
                &ldquo;ahumado&rdquo;, &ldquo;natilla&rdquo; o &ldquo;sartén&rdquo;) o explore
                todas las familias.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowAllFamilies(true);
                }}
                className="px-5 py-2.5 rounded-full bg-[#DDA13E] text-[#0D1510] text-xs font-bold uppercase tracking-wider"
              >
                Mostrar toda la alacena ({products.length})
              </button>
            </div>
          ) : (
            /* Listado Escénico de Tablas de Cata (Diseño Editorial Asimétrico en Madera Oscura y Pergamino) */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProducts.map((product, idx) => {
                const qty = quantities[product.id] || 1;
                const isAdded = addedFeedback[product.id];
                const isPinnedOnTable = spotlightProduct.id === product.id;

                return (
                  <motion.article
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.2) }}
                    className={`group relative rounded-3xl overflow-hidden border transition-all flex flex-col sm:flex-row ${
                      isPinnedOnTable
                        ? "bg-[#221811] border-[#DDA13E] shadow-[0_16px_45px_rgba(221,161,62,0.16)]"
                        : "bg-[#1A130E] border-white/10 hover:border-[#DDA13E]/50"
                    }`}
                  >
                    {/* Imagen Identificada y Botón para Subir a la Tabla Principal */}
                    <div className="sm:w-52 md:w-60 relative aspect-[16/11] sm:aspect-auto shrink-0 overflow-hidden bg-black/40">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

                      {product.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#B85634] text-white font-mono text-[10px] uppercase tracking-wider font-semibold">
                          {product.badge}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSpotlightProductId(product.id);
                          navigateToScene(4);
                        }}
                        className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-xl bg-black/75 hover:bg-[#DDA13E] text-[#F7F4EC] hover:text-[#0D1510] border border-white/15 text-[11px] font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Colocar en La Mesa</span>
                      </button>
                    </div>

                    {/* Detalles Gastronómicos, Presentación y Compra */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#DDA13E]">
                          <span>{product.category}</span>
                          <span className="text-[#F7F4EC]/60">{product.presentation}</span>
                        </div>

                        <h3 className="font-serif text-2xl font-semibold text-[#F7F4EC] leading-snug">
                          {product.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#F7F4EC]/75 font-light leading-relaxed">
                          {product.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {product.idealUses.map((use) => (
                            <span
                              key={use}
                              className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#F7F4EC]/80"
                            >
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bloque de Precio Confirmado y Acción de Pedido */}
                      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                        <div className="tabular-nums">
                          <span className="font-serif text-2xl font-bold text-[#F7F4EC] block leading-none">
                            {formatPrice(product.priceCRC * qty)}
                          </span>
                          <span className="font-mono text-[11px] text-[#F7F4EC]/55">
                            {formatPrice(product.priceCRC)} / {product.unit}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-black/40 border border-white/15 rounded-xl p-0.5">
                            <button
                              type="button"
                              onClick={() => handleQuantityDelta(product.id, -1)}
                              className="w-8 h-8 flex items-center justify-center text-[#F7F4EC]/70 hover:text-white"
                              aria-label="Restar unidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 font-mono text-xs font-bold tabular-nums">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityDelta(product.id, 1)}
                              className="w-8 h-8 flex items-center justify-center text-[#F7F4EC]/70 hover:text-white"
                              aria-label="Sumar unidad"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddProduct(product)}
                            className={`min-h-[40px] px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 ${
                              isAdded
                                ? "bg-[#2E5C43] text-white"
                                : "bg-[#DDA13E] hover:bg-[#F0BA5C] text-[#0D1510]"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>Agregado</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-4 h-4" />
                                <span>Agregar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          ESCENA 07 — LA CONEXIÓN HUMANA (#escena-conexion)
          Historia familiar desde 1980, comparador táctil de maduración,
          puntos de venta en Ferias del Agricultor y abastecimiento B2B.
      ==================================================================== */}
      <section
        id="escena-conexion"
        className="relative py-24 sm:py-32 px-4 sm:px-8 bg-[#0E1712] border-t border-white/10"
      >
        <div className="max-w-[1440px] mx-auto space-y-20">
          {/* Parte 1: Crónica Familiar desde 1980 + Comparador de Tiempo (Día 1 vs Día 45) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 font-mono text-xs text-[#DDA13E]">
                <Heart className="w-3.5 h-3.5" />
                <span>ESCENA 07 · LA CONEXIÓN HUMANA · DESDE 1980</span>
              </div>

              <h2 className="font-serif text-4xl sm:text-6xl font-semibold text-[#F7F4EC] leading-[1.06]">
                Generaciones de madrugada transformadas en confianza.
              </h2>

              <p className="text-sm sm:text-base text-[#F7F4EC]/80 font-light leading-relaxed">
                Nuestro padre inició en 1980 la ruta semanal hacia las fincas de Santa Cruz de
                Turrialba para elegir hormas recién prensadas. Con los años, nuestra madre
                consolidó el trato cálido y exigente en las ferias de San José, y hoy los hijos
                continuamos llevando ese mismo estándar intacto hasta su mesa o negocio.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
                  <Clock className="w-5 h-5 text-[#DDA13E]" />
                  <h3 className="font-serif text-xl font-semibold text-[#F7F4EC]">
                    +45 Años de Oficio
                  </h3>
                  <p className="text-xs text-[#F7F4EC]/65 leading-relaxed">
                    Presencia familiar ininterrumpida cada fin de semana desde 1980.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
                  <Award className="w-5 h-5 text-[#DDA13E]" />
                  <h3 className="font-serif text-xl font-semibold text-[#F7F4EC]">
                    Sin Atajos Industriales
                  </h3>
                  <p className="text-xs text-[#F7F4EC]/65 leading-relaxed">
                    Leche entera costarricense sin almidones ni grasas vegetales añadidas.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
                  <Store className="w-5 h-5 text-[#DDA13E]" />
                  <h3 className="font-serif text-xl font-semibold text-[#F7F4EC]">
                    Hogar & B2B
                  </h3>
                  <p className="text-xs text-[#F7F4EC]/65 leading-relaxed">
                    Atención directa en feria, pedidos familiares y bloques para restaurantes.
                  </p>
                </div>
              </div>
            </div>

            {/* Comparador Táctil Día 1 (Hilado Fresco) vs Día 45 (Ahumado & Maduro) */}
            <div className="lg:col-span-6">
              <div
                ref={sliderContainerRef}
                onPointerDown={(e) => {
                  setIsDraggingSlider(true);
                  e.currentTarget.setPointerCapture(e.pointerId);
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = ((e.clientX - rect.left) / rect.width) * 100;
                  setMaturationSlider(Math.min(Math.max(pct, 6), 94));
                }}
                onPointerMove={(e) => {
                  if (!isDraggingSlider) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = ((e.clientX - rect.left) / rect.width) * 100;
                  setMaturationSlider(Math.min(Math.max(pct, 6), 94));
                }}
                onPointerUp={() => setIsDraggingSlider(false)}
                onPointerCancel={() => setIsDraggingSlider(false)}
                className="relative aspect-[16/11] rounded-[2rem] overflow-hidden border border-white/15 shadow-2xl select-none cursor-ew-resize touch-none"
              >
                <img
                  src="/queso_ahumado.jpg"
                  alt="Día 45: Queso Ahumado y Maduro en leña"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#DDA13E]/40 text-right pointer-events-none">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#DDA13E] block">
                    Día 45 · Cava & Leña
                  </span>
                  <span className="font-serif text-sm text-white">Ahumado & Maduro Reserva</span>
                </div>

                <div
                  style={{ clipPath: `inset(0 ${(100 - maturationSlider).toFixed(1)}% 0 0)` }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <img
                    src="/queso_palmito.jpg"
                    alt="Día 1: Queso Palmito recién hilado"
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#0D1510]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 pointer-events-none">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#DDA13E] block">
                      Día 1 · Ordeño Matinal
                    </span>
                    <span className="font-serif text-sm text-white">
                      Palmito & Cuajada Recién Hilada
                    </span>
                  </div>
                </div>

                {/* Línea divisoria interactiva */}
                <div
                  style={{ left: `${maturationSlider.toFixed(1)}%` }}
                  className="absolute inset-y-0 w-0.5 bg-[#DDA13E] shadow-[0_0_15px_#DDA13E] pointer-events-none"
                >
                  <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#DDA13E] text-[#0D1510] font-bold flex items-center justify-center shadow-xl">
                    ↔
                  </div>
                </div>

                <div className="absolute bottom-4 inset-x-4 bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 flex items-center justify-between text-xs pointer-events-none">
                  <span className="text-[#F7F4EC]/85">
                    Deslice para comparar la transformación del tiempo en la horma
                  </span>
                  <span className="font-mono text-[#DDA13E]">
                    {Math.round(maturationSlider)}% / {Math.round(100 - maturationSlider)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Parte 2: Puntos de Venta Físicos en Ferias del Agricultor + Canal Mayorista B2B */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Ferias del Agricultor (Guadalupe y Hatillo) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-6 sm:p-7 rounded-3xl bg-[#15221B] border border-white/10 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#DDA13E] block">
                      Punto de Venta Oficial · Degustación en Puesto
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F7F4EC]">
                      {loc.name}
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm text-[#F7F4EC]/80 pt-1">
                      <p className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-[#DDA13E] shrink-0 mt-0.5" />
                        <span>{loc.daysHours}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#DDA13E] shrink-0 mt-0.5" />
                        <span>{loc.standInfo}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex gap-2.5">
                    <a
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#DDA13E]" />
                      <span>Google Maps</span>
                    </a>
                    <a
                      href={loc.wazeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#33ccff]/15 hover:bg-[#33ccff]/25 border border-[#33ccff]/30 text-[#7ce0ff] text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span className="font-bold">Waze</span>
                      <span>Ruta</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Canal B2B Mayoristas: Restaurantes, Sodas, Pizzerías y Hoteles */}
            <div className="lg:col-span-5 p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#23170F] via-[#1B120C] to-[#120C08] border border-[#DDA13E]/40 flex flex-col justify-between space-y-6 shadow-2xl">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDA13E]/15 text-[#DDA13E] font-mono text-[10px] uppercase tracking-widest">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Abastecimiento B2B · Sodas, Pizzerías y Restaurantes</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-[#F7F4EC] leading-tight">
                  ¿Su cocina necesita punto de sal y fundición consistentes cada semana?
                </h3>
                <p className="text-xs sm:text-sm text-[#F7F4EC]/80 font-light leading-relaxed">
                  Entregamos bloques institucionales de Semiduro de Turrialba (2.5 kg y volumen
                  mayorista), Queso Palmito y Natilla pura con precio preferencial y programación
                  semanal confiable.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href="https://wa.me/50688888888?text=Hola,%20me%20interesa%20cotizar%20abastecimiento%20B2B%20para%20mi%20restaurante%20o%20comercio%20con%20La%20Central%20del%20Queso."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-[#DDA13E] hover:bg-[#F0BA5C] text-[#0D1510] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Store className="w-4 h-4" />
                  <span>Solicitar Lista de Precios B2B por WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    handleSelectFamily(4);
                    navigateToScene(5);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#F7F4EC]/80 transition-colors"
                >
                  Ver Bloque Institucional de 2.5 kg en la Alacena
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          BARRA FLOTANTE DE PEDIDO ACTIVO (ZERO-FRICTION CHECKOUT)
      ==================================================================== */}
      <AnimatePresence>
        {totalItemsCount > 0 && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            className="fixed bottom-4 inset-x-4 z-40 max-w-3xl mx-auto"
          >
            <div className="bg-[#16100B]/95 backdrop-blur-xl border border-[#DDA13E]/50 rounded-2xl p-3.5 sm:px-6 sm:py-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#DDA13E] text-[#0D1510] flex items-center justify-center font-bold shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="tabular-nums">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#DDA13E] block">
                    Su Selección en La Mesa ({totalItemsCount}{" "}
                    {totalItemsCount === 1 ? "pieza" : "piezas"})
                  </span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#F7F4EC]">
                    {currency === "CRC"
                      ? `₡${totalCRC.toLocaleString("es-CR")}`
                      : `$${totalUSD.toFixed(2)} USD`}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#DDA13E] hover:bg-[#F0BA5C] text-[#0D1510] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <span>Confirmar Pedido por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
