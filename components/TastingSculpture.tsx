"use client";
import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { TableFamilyConfig } from "./FincaToTableExperience";

function PhotographicFallback({ image, name }: { image: string; name: string }) {
  return <div data-testid="webgl-fallback" className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
    <img src={image} alt={name} className="w-full max-w-sm h-52 object-contain rounded-xl"/>
    <p role="status" className="max-w-sm text-center text-sm text-[#F7F4EC]/80">La vista 3D no está disponible en este dispositivo. Puede explorar la fotografía y añadir su selección al pedido.</p>
  </div>;
}

class TastingBoundary extends React.Component<{ image: string; name: string; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <PhotographicFallback image={this.props.image} name={this.props.name}/> : this.props.children; }
}
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

  const woodColor = useTexture("/textures/wood_plank_diff.jpg");
  woodColor.colorSpace = THREE.SRGBColorSpace;

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
            map={woodColor} color="#a68b68"
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
              roughness={0.65}
              metalness={0.02}
              clearcoat={0.06}
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
                0.04,
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
            position={[Math.sin(WEDGE_ANGLE) * RADIUS / 2, HEIGHT / 2, Math.cos(WEDGE_ANGLE) * RADIUS / 2]}
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

          <mesh position={[0, HEIGHT / 2, RADIUS / 2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
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
              roughness={0.65}
              metalness={0.02}
              clearcoat={0.06}
              bumpMap={rindBump}
              bumpScale={0.026}
            />
          </mesh>

          <mesh
            position={[Math.sin(WEDGE_ANGLE) * RADIUS / 2, HEIGHT / 2, Math.cos(WEDGE_ANGLE) * RADIUS / 2]}
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

          <mesh position={[0, HEIGHT / 2, RADIUS / 2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
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

export default function TastingSculpture({ familyConfig, cheeseRotYRef, isDraggingRef, isWedgeCut, onToggleWedge, visible, onContextLost, image, name }: {
 familyConfig: TableFamilyConfig; cheeseRotYRef: React.MutableRefObject<number>; isDraggingRef: React.MutableRefObject<boolean>; isWedgeCut: boolean; onToggleWedge: () => void; visible: boolean; onContextLost: () => void; image: string; name: string;
}) {
 return <TastingBoundary image={image} name={name}><Canvas style={{ height: "100%", position: "absolute", inset: 0 }} frameloop={visible ? "always" : "never"}
 onCreated={({gl}) => { gl.shadowMap.type = THREE.PCFShadowMap; gl.domElement.addEventListener("webglcontextlost", onContextLost, {once:true}); }}
 fallback={<PhotographicFallback image={image} name={name}/>} shadows dpr={[1,1.5]} camera={{position:[0,3.1,6.6],fov:42}}>
 <TableStudioLighting/><ambientLight intensity={0.55}/><directionalLight position={[4,6,4]} intensity={1.6} castShadow shadow-mapSize={[1024,1024]}/>
 <TableCheeseSculpture3D familyConfig={familyConfig} cheeseRotYRef={cheeseRotYRef} isDraggingRef={isDraggingRef} isWedgeCut={isWedgeCut} onToggleWedge={onToggleWedge}/>
 </Canvas></TastingBoundary>;
}
