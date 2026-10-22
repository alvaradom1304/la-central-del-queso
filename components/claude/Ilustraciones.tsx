import type { Ilus } from "./datos";

// Ilustraciones de producto de la propuesta «El Puesto».
// Se dibujan a mano en SVG en lugar de usar las fotos de public/, que son
// generadas por IA (manifiesto C2PA) y muestran quesos que no son los de la casa.

const T = "#1C2620"; // tinta
const LINEA = { stroke: T, strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

interface Rueda {
  costra: string;
  cara: string;
  pasta: string;
  pastaSombra: string;
  ojos?: boolean;
}

const RUEDAS: Record<"semiduro" | "maduro" | "ahumado", Rueda> = {
  semiduro: { costra: "#E6C474", cara: "#F2DC9E", pasta: "#F8EBC2", pastaSombra: "#EBD59C", ojos: true },
  maduro: { costra: "#C77F2E", cara: "#DCA24F", pasta: "#F3D892", pastaSombra: "#E3C274" },
  ahumado: { costra: "#7E4522", cara: "#A2622F", pasta: "#F1DBA2", pastaSombra: "#DFC484" },
};

function RuedaCortada({ c }: { c: Rueda }) {
  return (
    <>
      <ellipse cx="60" cy="93" rx="50" ry="8" fill={T} opacity="0.08" />
      <path d="M16 56 L16 78 A44 14 0 0 0 45 91.2 L45 69.2 A44 14 0 0 1 16 56 Z" fill={c.costra} {...LINEA} />
      <path d="M88.3 88.7 A44 14 0 0 0 104 78 L104 56 A44 14 0 0 1 88.3 66.7 Z" fill={c.costra} {...LINEA} />
      <path d="M60 56 L88.3 66.7 A44 14 0 1 0 45 69.2 Z" fill={c.cara} {...LINEA} />
      <path d="M60 56 L88.3 66.7 L88.3 88.7 L60 78 Z" fill={c.pastaSombra} {...LINEA} />
      <path d="M60 56 L45 69.2 L45 91.2 L60 78 Z" fill={c.pasta} {...LINEA} />
      <path d="M24 50 A36 10 0 0 1 62 44" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" />
      {c.ojos && (
        <g fill={T} opacity="0.18">
          <ellipse cx="71" cy="72" rx="2" ry="1.5" />
          <ellipse cx="79" cy="80" rx="1.4" ry="1.1" />
          <ellipse cx="52" cy="80" rx="1.6" ry="1.2" />
        </g>
      )}
    </>
  );
}

interface Bloque {
  frente: string;
  tapa: string;
  lado: string;
}

function BloqueBasico({ c, alto = 34 }: { c: Bloque; alto?: number }) {
  const base = 92;
  const top = base - alto;
  return (
    <>
      <ellipse cx="64" cy="95" rx="50" ry="7" fill={T} opacity="0.08" />
      <path d={`M92 ${top} L108 ${top - 14} L108 ${base - 14} L92 ${base} Z`} fill={c.lado} {...LINEA} />
      <path d={`M20 ${top} L36 ${top - 14} L108 ${top - 14} L92 ${top} Z`} fill={c.tapa} {...LINEA} />
      <path d={`M20 ${top} H92 V${base} H20 Z`} fill={c.frente} {...LINEA} />
    </>
  );
}

function Fresco({ tierno }: { tierno?: boolean }) {
  const c = { frente: "#FBF6EA", tapa: "#FFFFFF", lado: "#ECE3CF" };
  return (
    <>
      <BloqueBasico c={c} alto={tierno ? 26 : 34} />
      <g fill={T} opacity="0.12">
        <circle cx="34" cy={tierno ? 78 : 72} r="1.4" />
        <circle cx="52" cy={tierno ? 84 : 80} r="1.1" />
        <circle cx="72" cy={tierno ? 79 : 70} r="1.5" />
        <circle cx="82" cy="85" r="1" />
      </g>
      {tierno && (
        <g>
          <path d="M86 56 C 96 44, 110 46, 112 52 C 104 60, 94 60, 86 56 Z" fill="#5D8A4E" {...LINEA} />
          <path d="M88 56 C 96 52, 104 51, 110 52" fill="none" stroke={T} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}
    </>
  );
}

function Bagaces() {
  return (
    <>
      <BloqueBasico c={{ frente: "#F0DA98", tapa: "#F7E7B4", lado: "#DEC27C" }} alto={30} />
      <g fill="none" stroke={T} strokeOpacity="0.25" strokeWidth="1.3" strokeLinecap="round">
        <path d="M30 70 l6 4" />
        <path d="M58 76 l-5 5" />
        <path d="M74 68 l4 3" />
      </g>
      <g fill="#F4DE9C" {...LINEA} strokeWidth={1.4}>
        <path d="M6 100 q 4 -6 8 0" />
        <path d="M12 102 q 4 -7 8 -1" />
        <path d="M18 99 q 3 -5 7 0" />
        <path d="M9 96 q 3 -5 7 0" />
      </g>
    </>
  );
}

function BloqueNegocio() {
  return (
    <>
      <ellipse cx="62" cy="99" rx="54" ry="7" fill={T} opacity="0.08" />
      <path d="M94 54 L112 38 L112 80 L94 96 Z" fill="#E3C67F" {...LINEA} />
      <path d="M14 54 L32 38 L112 38 L94 54 Z" fill="#F6E3A9" {...LINEA} />
      <path d="M14 54 H94 V96 H14 Z" fill="#EFD48C" {...LINEA} />
      <path d="M44 54 H60 V96 H44 Z" fill="#D8B98B" {...LINEA} />
      <path d="M48 54 L66 38 H82 L60 54 Z" fill="#D8B98B" {...LINEA} />
      <g stroke="#fff" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round">
        <path d="M20 62 l10 -6" />
        <path d="M20 72 l18 -10" />
        <path d="M68 90 l20 -12" />
        <path d="M98 70 l8 -8" />
      </g>
    </>
  );
}

function Palmito() {
  return (
    <>
      <ellipse cx="60" cy="96" rx="42" ry="7" fill={T} opacity="0.08" />
      <path d="M84 84 C 96 92, 104 90, 110 100" fill="none" stroke={T} strokeWidth="6" strokeLinecap="round" />
      <path d="M84 84 C 96 92, 104 90, 110 100" fill="none" stroke="#FBF5E6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="62" r="32" fill="#FBF5E6" {...LINEA} />
      <g fill="none" stroke="#D5C6A2" strokeWidth="2" strokeLinecap="round">
        <path d="M36 50 C 50 38, 72 38, 86 52" />
        <path d="M31 62 C 48 50, 74 48, 91 64" />
        <path d="M33 74 C 50 62, 76 60, 89 76" />
        <path d="M42 86 C 56 76, 72 76, 80 88" />
        <path d="M50 33 C 42 50, 44 74, 56 93" />
        <path d="M70 32 C 79 48, 80 72, 72 93" />
      </g>
    </>
  );
}

function Cuajada() {
  return (
    <>
      <path d="M10 86 L60 66 L110 86 L60 106 Z" fill="#E4ECEC" {...LINEA} />
      <g stroke="#9DB4B4" strokeWidth="1.2">
        <path d="M35 76 L85 96" />
        <path d="M85 76 L35 96" />
      </g>
      <path
        d="M30 86 C 28 62, 44 46, 60 46 C 78 46, 92 62, 90 86 C 76 94, 44 94, 30 86 Z"
        fill="#FFFBF2"
        {...LINEA}
      />
      <g fill="#E3D7BC">
        <circle cx="46" cy="66" r="2.2" />
        <circle cx="58" cy="58" r="1.8" />
        <circle cx="70" cy="68" r="2.4" />
        <circle cx="52" cy="78" r="1.6" />
        <circle cx="76" cy="80" r="1.8" />
        <circle cx="64" cy="74" r="1.4" />
      </g>
    </>
  );
}

function Natilla() {
  return (
    <>
      <ellipse cx="60" cy="102" rx="40" ry="6" fill={T} opacity="0.08" />
      <path d="M72 58 L104 24" stroke={T} strokeWidth="8" strokeLinecap="round" />
      <path d="M72 58 L104 24" stroke="#C9925A" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M20 60 C 20 86, 40 100, 60 100 C 80 100, 100 86, 100 60 Z" fill="#C2663E" {...LINEA} />
      <ellipse cx="60" cy="60" rx="40" ry="10" fill="#A9532F" {...LINEA} />
      <ellipse cx="60" cy="60" rx="35" ry="7" fill="#FFF8E8" stroke={T} strokeWidth="1.4" />
      <path d="M46 60 C 50 55, 64 55, 67 60 C 69 64, 57 65, 55 61" fill="none" stroke="#E2D3B2" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 76 C 34 86, 42 92, 50 94" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

function Mantequilla() {
  return (
    <>
      <path d="M8 84 L42 64 L112 70 L82 94 Z" fill="#EBD8B6" {...LINEA} />
      <path d="M78 66 L90 56 L90 78 L78 88 Z" fill="#E2BA48" {...LINEA} />
      <path d="M28 66 L40 56 L90 56 L78 66 Z" fill="#FAE08A" {...LINEA} />
      <path d="M28 66 H78 V88 H28 Z" fill="#F4D065" {...LINEA} />
      <path d="M50 52 C 54 44, 66 44, 66 50 C 66 54, 58 54, 58 50" fill="#FBE7A6" {...LINEA} strokeWidth={1.5} />
    </>
  );
}

function Surtido() {
  return (
    <>
      <ellipse cx="62" cy="106" rx="42" ry="6" fill={T} opacity="0.08" />
      <circle cx="46" cy="42" r="15" fill="#FBF5E6" {...LINEA} />
      <path d="M36 38 C 42 32, 52 32, 58 40 M34 46 C 42 40, 54 40, 60 48" fill="none" stroke="#D5C6A2" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M62 46 L88 28 L86 46 Z" fill="#F2DC9E" {...LINEA} />
      <path d="M86 46 L88 28 L94 34 L92 48 Z" fill="#E6C474" {...LINEA} />
      <path d="M86 48 L98 54 L100 100 L90 104 Z" fill="#C49E6C" {...LINEA} />
      <path d="M28 48 H86 L90 104 H24 Z" fill="#D8B98B" {...LINEA} />
      <path d="M28 48 L33 53 L38 48 L43 53 L48 48 L53 53 L58 48 L63 53 L68 48 L73 53 L78 48 L83 53 L86 48" fill="none" stroke={T} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M40 74 C 48 70, 64 70, 72 74" fill="none" stroke={T} strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
    </>
  );
}

export function IlusProducto({ tipo, className }: { tipo: Ilus; className?: string }) {
  let dibujo: React.ReactNode;
  switch (tipo) {
    case "semiduro":
    case "maduro":
    case "ahumado":
      dibujo = <RuedaCortada c={RUEDAS[tipo]} />;
      break;
    case "fresco":
      dibujo = <Fresco />;
      break;
    case "tierno":
      dibujo = <Fresco tierno />;
      break;
    case "bagaces":
      dibujo = <Bagaces />;
      break;
    case "bloque":
      dibujo = <BloqueNegocio />;
      break;
    case "palmito":
      dibujo = <Palmito />;
      break;
    case "cuajada":
      dibujo = <Cuajada />;
      break;
    case "natilla":
      dibujo = <Natilla />;
      break;
    case "mantequilla":
      dibujo = <Mantequilla />;
      break;
    case "surtido":
      dibujo = <Surtido />;
      break;
  }
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      {dibujo}
    </svg>
  );
}

// Composición del encabezado: la tabla del puesto con el rótulo de cartón colgado.
export function EscenaPuesto({ precio, className }: { precio: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 600 540"
      className={className}
      role="img"
      aria-label={`Ilustración del puesto: una rueda de queso semiduro cortada, un queso palmito y un tazón de natilla sobre una tabla de madera, con un rótulo de cartón que dice Semiduro, ${precio} el kilo.`}
    >
      {/* clavo e hilo */}
      <g className="cq-rotulo">
        <path d="M300 18 L226 96 M300 18 L374 96" stroke={T} strokeWidth="2" fill="none" />
        <path
          d="M196 92 L404 86 L410 248 L200 256 Z"
          fill="#D8B98B"
          stroke={T}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M206 100 L396 95" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" />
        <circle cx="226" cy="100" r="5" fill="#F7F2E8" stroke={T} strokeWidth="2" />
        <circle cx="374" cy="96" r="5" fill="#F7F2E8" stroke={T} strokeWidth="2" />
        <g transform="rotate(-2 300 170)">
          <text x="302" y="148" textAnchor="middle" className="cq-mano" fontSize="46" fontWeight="700" fill={T}>
            Semiduro
          </text>
          <text x="302" y="214" textAnchor="middle" className="cq-mano" fontSize="76" fontWeight="700" fill="#B14F2C">
            {precio}
          </text>
          <text x="302" y="242" textAnchor="middle" className="cq-mano" fontSize="30" fontWeight="600" fill={T}>
            el kilo
          </text>
        </g>
      </g>
      <circle cx="300" cy="18" r="6" fill="#8A8F86" stroke={T} strokeWidth="2" />

      {/* tabla */}
      <path d="M78 404 H526 Q548 404 556 420 L572 458 H32 L48 420 Q56 404 78 404 Z" fill="#BE8752" stroke={T} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 458 H572 V476 Q572 486 562 486 H42 Q32 486 32 476 Z" fill="#94603A" stroke={T} strokeWidth="2.5" strokeLinejoin="round" />
      <g stroke={T} strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M110 420 C 180 416, 240 424, 300 418" />
        <path d="M340 440 C 400 436, 460 444, 520 438" />
        <path d="M80 446 C 130 442, 170 448, 220 444" />
      </g>

      <svg x="168" y="208" width="300" height="300" viewBox="0 0 120 120">
        <RuedaCortada c={RUEDAS.semiduro} />
      </svg>
      <svg x="44" y="310" width="160" height="160" viewBox="0 0 120 120">
        <Palmito />
      </svg>
      <svg x="420" y="300" width="164" height="164" viewBox="0 0 120 120">
        <Natilla />
      </svg>

      {/* hojas */}
      <g fill="#5D8A4E" stroke={T} strokeWidth="2" strokeLinejoin="round">
        <path d="M206 452 C 214 436, 236 434, 244 440 C 236 452, 218 456, 206 452 Z" />
        <path d="M228 458 C 240 450, 258 452, 262 458 C 252 466, 238 466, 228 458 Z" />
      </g>

      {/* anotaciones */}
      <g className="cq-mano" fill={T} fontSize="24" fontWeight="600">
        <text x="40" y="300">hilado a mano</text>
        <text x="452" y="286">natilla de rancho</text>
      </g>
      <g fill="none" stroke={T} strokeWidth="1.8" strokeLinecap="round">
        <path d="M96 308 C 104 320, 110 330, 114 342" />
        <path d="M108 336 L114 342 L116 334" />
        <path d="M500 294 C 500 306, 498 316, 494 326" />
        <path d="M488 320 L494 326 L498 318" />
      </g>
    </svg>
  );
}
