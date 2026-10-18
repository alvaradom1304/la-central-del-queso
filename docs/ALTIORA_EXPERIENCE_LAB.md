# ALTIORA EXPERIENCE LAB — Especificación Operativa, Arquitectura y SOP
**Proyecto:** Rediseño Inmersivo, Cinematográfico y Comercial de *La Central del Queso* (Tradición Familiar desde 1980)  
**Versión:** 2.0 (Ruptura de Inercia Visual · Viaje en 7 Escenas «De la finca a tu mesa»)

---

## 1. Fase A — Auditoría del Proyecto Existente y Diagnóstico de Inercia Visual

### 1.1 Estado Real del Entorno Inspeccionado
- **Ruta activa del proyecto web:** `C:\Users\Usuario\OneDrive\Desktop\client-central-del-queso\web`
- **Estado de Git:** El directorio no cuenta con un repositorio `.git` inicializado localmente; el control de versiones y respaldo de componentes se gestiona preservando los módulos existentes en `components/` y `lib/`.
- **Dependencias instaladas verificadas (`package.json`):**
  - `next@14.2.3`, `react@18`, `typescript@5`, `tailwindcss@3.4.1`
  - `three@^0.186.1`, `@react-three/fiber@^8.18.0`, `@react-three/drei@^9.122.0`
  - `gsap@^3.15.0`, `@gsap/react@^2.1.2`, `@studio-freight/react-lenis@^0.0.47`, `framer-motion@^14.1.0`, `lucide-react@^1.54.0`
- **Assets fotográficos verificados en `public/`:**
  1. `porton_finca_turrialba.jpg` (1.03 MB) — Portón de madera rústica al amanecer con hortensias, sendero húmedo, vacas Jersey y granero al fondo.
  2. `campo_floral_turrialba.jpg` (1.12 MB) — Camino empedrado de montaña entre flores silvestres y neblina matinal.
  3. `potrero_vacas_lecheria.jpg` (1.15 MB) — Potrero verde con ganado lechero conduciendo hacia la lechería.
  4. `entrada_lecheria_granero.jpg` (1.08 MB) — Umbral de piedra y madera de la lechería con tarros de aluminio y estantes interiores.
  5. `lecheria_proceso_artesanal.jpg` (Generado e integrado) — Interior de la lechería artesanal al amanecer con vapor sobre paila de leche tibia, corte de cuajada y prensado manual en lienzo de algodón.
  6. `interior_cava_roble.jpg` (1.14 MB) — Cava de maduración en roble y piedra conduciendo al pedestal central.
  7. `mesa_interactiva_tasting.jpg` (Generado e integrado) — Mesa artesanal de madera de guanacaste frente a las montañas de Turrialba con las familias de quesos dispuestas en escena.
  8. `hero_luxury_maison.jpg`, `queso_palmito.jpg`, `queso_ahumado.jpg`, `natilla_mantequilla.jpg`, `combo_feria.jpg`, `queso_catalogo.jpg`.

### 1.2 Diagnóstico Visual: ¿Por qué las iteraciones anteriores se sentían repetitivas?
1. **Plantilla de secciones apiladas desconectadas:** Aunque se cambiaba el Hero superior, el cuerpo de la página caía siempre en bloques aislados (`CheeseMatcher`, `ProductCatalog`, `VipTastingPass`, `StorySection`, `FeriaLocator`) separados por divisores horizontales.
2. **El catálogo seguía siendo un grid genérico de tarjetas rectangulares blancas:** En `ProductCatalog.tsx`, los 12 productos se mostraban en un `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` de tarjetas blancas con `rounded-3xl border-forest/10`, rompiendo la ilusión espacial de haber viajado hasta la finca.
3. **Inercia tipográfica y cromática:** Uso invariable de `Playfair Display` + `Inter` sobre `#FAF9F6` sin transición lumínica entre la bruma fría del amanecer (`5:45 a.m.`), el calor húmedo de la paila (`34°C`) y la calidez ambarina de la mesa de madera de guanacaste.
4. **Qué se conserva por valor real de negocio:**
   - Datos reales verificados en `lib/products.ts` (12 productos auténticos en 5 categorías con precios referenciales en `₡ CRC` y `$ USD`, perfiles sensoriales y notas de maridaje).
   - Estado de carrito persistente y flujo de pedido directo por WhatsApp en `lib/CartContext.tsx` y `components/CartDrawer.tsx`.
   - Motor de audio binaural procedural opt-in (`lib/spatialAudio.ts`) y geometría PBR de la horma 3D con cuchillo de cata.

---

## 2. Matriz de Descubrimiento de Herramientas, Conectores y Repositorios Oficiales

| Necesidad | Herramienta / Repositorio Oficial | Disponibilidad Real | Licencia | Compatibilidad | Beneficio Real | Coste / Performance | Decisión |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Motor WebGL & Escena 3D** | [`mrdoob/three.js`](https://github.com/mrdoob/three.js) (`v0.186.1`) | Instalado en `package.json` | MIT | Total con Next.js 14 (Client Components) | Shaders GLSL de profundidad 2.5D y escultura PBR en Escena 05 | ~150 KB gzipped (cargado con `next/dynamic`) | **Adoptado** |
| **Renderizador React 3D** | [`pmndrs/react-three-fiber`](https://github.com/pmndrs/react-three-fiber) + [`pmndrs/drei`](https://github.com/pmndrs/drei) | Instalado en `package.json` | MIT | React 18 | Sincronización declarativa de luces, cámara y objetos 3D sobre la mesa | Bajo overhead sobre Three.js | **Adoptado** |
| **Postprocesado WebGL** | [`pmndrs/react-postprocessing`](https://github.com/pmndrs/react-postprocessing) | No instalado | MIT | Requiere paquete adicional | Bloom/DOF por postprocesado | Penaliza FPS en móviles de gama media | **Descartado** (Se resuelve vía iluminación volumétrica en shader GLSL propio sin pase extra de framebuffer) |
| **Controlador de Progreso y Scrollytelling** | [`greensock/GSAP`](https://github.com/greensock/GSAP) + React Scroll Engine | Instalado en `package.json` | Standard No-Charge | Total | Interpolación determinista de una única fuente de progreso narrativo (`0.0 → 1.0`) | 60–120 FPS estables usando `transform` y uniforms | **Adoptado** |
| **Desplazamiento Suave** | [`darkroomengineering/lenis`](https://github.com/darkroomengineering/lenis) | Instalado (`@studio-freight/react-lenis`) | MIT | Next.js 14 | Inercia física sedosa en el travelling por la finca | < 5 KB, desactivable con `prefers-reduced-motion` | **Adoptado** |
| **Secuenciación de Escenas** | [`theatre-js/theatre`](https://github.com/theatre-js/theatre) | No instalado | Apache-2.0 | React 18 | Editor visual de timelines | Pesado para producción cuando la curva de cámara es paramétrica | **Descartado** (Se implementa rig paramétrico de 7 escenas con fuente única de progreso) |
| **Optimización de Assets 3D** | [`donmccurdy/glTF-Transform`](https://github.com/donmccurdy/glTF-Transform) | Evaluado | MIT | CLI / Node | Compresión Draco/Meshopt para mallas externas | Se prioriza geometría paramétrica PBR + fotografía 2.5D real para evitar paisajes low-poly | **Documentado** |

---

## 3. Fase B — Tres Direcciones Creativas Radicalmente Diferentes

### Dirección 1 — Finca Cinematográfica («Bruma & Tierra Viva»)
- **Concepto:** Inmersión subjetiva en primera persona (POV) desde el portón de madera de **«Finca Doña Martha»** al amanecer hasta el interior humeante de la lechería.
- **Referencias:** Documentales cinematográficos de terroir (Chef's Table), experiencias WebGL de naturaleza orgánica.
- **Paleta:** Bruma Volcánica `#E6ECE8`, Musgo Profundo `#0B1510`, Tierra Húmeda `#231A12`, Luz de Amanecer `#DDA13E`, Leche Tibia `#F9F6F0`.
- **Tipografías:** *Cormorant Garamond* (Display poético) + *Plus Jakarta Sans* (UI funcional) + *JetBrains Mono* (coordenadas, altitud y hora del día).
- **Lenguaje de movimiento:** Travelling espacial en eje Z (`scale`, `perspective`, apertura física de hojas del portón de madera en 3D y desplazamiento de profundidad GLSL).
- **Riesgos y ventajas:** Alto impacto emocional; requiere acceso inmediato al catálogo para compradores recurrentes.

### Dirección 2 — Editorial Gastronómica de Lujo («Maison du Terroir»)
- **Concepto:** Crónica de alta gastronomía en claroscuro inspirada en publicaciones impresas de autor, con macrotexturas de corteza, lino, piedra volcánica y madera.
- **Paleta:** Basalto `#121110`, Pergamino Crudo `#F4EFE6`, Cobre de Paila `#A85432`, Oro Mantequilla `#E5B24C`.
- **Tipografías:** Serif condensada de alto contraste + Sans humanista.
- **Lenguaje de movimiento:** Transiciones asimétricas por cortina (*wipe*) y comparadores táctiles.
- **Riesgos y ventajas:** Excelente legibilidad de producto, pero menor sensación de recorrido espacial por la finca.

### Dirección 3 — Laboratorio Inmersivo («La Mesa como Interfaz Viva»)
- **Concepto:** La mesa de madera artesanal deja de ser una foto decorativa y se convierte en el sistema operativo de compra: elegir una familia sobre la mesa transforma la iluminación ambiental, la tabla central 3D/macro y las fichas sensoriales.
- **Paleta:** Nogal Ahumado `#18120D`, Ámbar de Leña `#C87A28`, Crema Fresca `#FFFDF9`, Verde Salvia `#2E4A38`.
- **Lenguaje de movimiento:** Nodos espaciales interactivos anclados sobre la tabla de madera, rotación física 3D de la horma con corte de cuña en tiempo real y cambio dinámico de atmósfera según la familia de queso.

### Síntesis Seleccionada: «De la Finca a tu Mesa — Película Interactiva & Mesa Viva»
Adoptamos una **síntesis deliberada y sin fisuras**:
1. **Escenas 01 a 04** ejecutan la **Dirección 1 (Finca Cinematográfica)** con una única fuente de progreso narrativo que abre físicamente el portón de **«Finca Doña Martha»**, recorre el sendero vivo con paralaje multicapa, entra a la lechería humeante y realiza un *match-cut* espacial por la cava de roble.
2. **Escenas 05 y 06** ejecutan la **Dirección 3 + 2 (La Mesa como Interfaz Viva)**, eliminando por completo el antiguo grid de tarjetas blancas repetidas y reemplazándolo por el **Comedor & Mesa Artesanal Interactiva**, donde las 5 familias de productos residen sobre la mesa de guanacaste con cambio de atmósfera lumínica, escultura 3D al corte y alacena de pedido directo.

---

## 4. Equipo de Agentes Altiora Experience Lab e Interfaces entre Roles

| Rol Especializado | Responsabilidad Operativa | Entregable / Interfaz en Código |
| :--- | :--- | :--- |
| **Experience & Creative Director** | Dramaturgia de las 7 escenas, ruptura del diseño anterior, nueva tipografía (*Cormorant Garamond* + *Plus Jakarta Sans*) y paleta evolutiva por temperatura de luz. | `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts` |
| **3D & Spatial Shader Artist** | Shader GLSL de profundidad 2.5D con neblina atmosférica, partículas orgánicas y escultura 3D PBR de la horma sobre la mesa. | `components/DepthPhotoCanvas.tsx`, `components/FincaToTableExperience.tsx` |
| **Cinematic / Motion Designer** | Fuente única de progreso narrativo (`0.0 → 1.0`), apertura 3D del portón «Finca Doña Martha», travelling sin fundidos negros arbitrarios. | Controlador `useNarrativeJourney` en `components/FincaToTableExperience.tsx` |
| **UX & Conversion Strategist** | **La Mesa como Interfaz (Escenas 05–06)**, estados de búsqueda/vacío/carga, botón permanente «Ver productos / Saltar experiencia», flujo B2B y WhatsApp. | Estaciones de Mesa Interactiva + `components/CartDrawer.tsx` |
| **QA & Accessibility Reviewer** | Soporte `prefers-reduced-motion`, Modo Ligero sin WebGL, navegación por teclado, contraste WCAG AA y transparencia editorial sobre recreaciones artísticas. | Controles de accesibilidad en HUD y degradación automática |

---

## 5. Storyboard Maestro de las 7 Escenas («De la finca a tu mesa»)

1. **Escena 01 — El Umbral (`progreso 0.00 – 0.22`)**:
   - Portón de madera rústica con travesaño tallado **«FINCA DOÑA MARTHA»** *(con nota visible de validación de nombre narrativo)*. Amanecer en las faldas del Volcán Turrialba, neblina atmosférica en movimiento, hortensias en primer plano y sonido binaural opcional. Al hacer scroll, las dos hojas del portón de madera se abren físicamente en perspectiva 3D mientras la cámara cruza el umbral. Botón directo **«Ir a La Mesa / Ver Productos»** siempre accesible.
2. **Escena 02 — El Camino Vivo (`progreso 0.22 – 0.48`)**:
   - Desplazamiento cinematográfico por el sendero empedrado y los potreros de pastoreo libre (`campo_floral_turrialba.jpg` → `potrero_vacas_lecheria.jpg`). Capas de paralaje botánico asimétrico, cambio gradual de luz dorada matinal y marcadores espaciales de altitud (`1.200 m s.n.m.`) y genética lechera Jersey.
3. **Escena 03 — La Lechería (`progreso 0.48 – 0.74`)**:
   - Llegada al taller artesanal (`entrada_lecheria_granero.jpg` → `lecheria_proceso_artesanal.jpg`). Leche tibia a `34°C`, vapor matinal, manos trabajando la cuajada en lienzo de algodón y utensilios de madera. Incluye distinción transparente: *«Recreación artística conceptual del oficio quesero tradicional»*.
4. **Escena 04 — La Transformación (`progreso 0.74 – 1.00`)**:
   - Transición espacial motivada (*match-cut* de cámara atravesando el pórtico de madera hacia la cava de maduración `interior_cava_roble.jpg`), conectando el molde fresco con la horma dorada sobre el pedestal central que conduce directamente a La Mesa sin fundidos negros artificiales.
5. **Escena 05 — La Mesa (`#la-mesa`)**:
   - La cámara desemboca en la gran mesa de madera de guanacaste frente a la montaña (`mesa_interactiva_tasting.jpg` + Escultura 3D interactiva al corte). **La mesa es la interfaz**: 5 estaciones espaciales sobre la tabla permiten tocar cada familia de productos (`Línea Tradicional Turrialba`, `Quesos de Mesa & Hilados`, `Madurados & Ahumados`, `Derivados Lácteos del Rancho`, `Especial Mayoristas & Sodas`).
6. **Escena 06 — Exploración Interactiva en La Mesa (`#exploracion-mesa`)**:
   - Al elegir una estación en la mesa, cambia la atmósfera lumínica del comedor, se actualiza la tabla principal (con vista 3D manipulable o vista macro fotográfica), y se despliegan las piezas reales de esa familia en formato de **Alacena y Ficha de Cata Táctil** (con precios confirmados en `₡ CRC` y `$ USD`, selector de peso/cantidad, buscador instantáneo con estado vacío/reset y adición directa al pedido).
7. **Escena 07 — La Conexión Humana (`#conexion-humana`)**:
   - Cierra con la crónica familiar desde 1980 (comparador Día 1 vs Día 45), puntos de retiro en Ferias del Agricultor (Guadalupe y Hatillo con Waze/Google Maps) y portal de abastecimiento B2B para sodas, pizzerías y restaurantes.

---

## 6. Repositorio de Laboratorio y Ecosistema Altiora OS

- **Repositorio Oficial de Investigación y Laboratorio:** [`https://github.com/alvaradom1304/Altiora-Immersive-Web-Lab`](https://github.com/alvaradom1304/Altiora-Immersive-Web-Lab)
- **Ruta local vinculada:** `C:\Users\Usuario\OneDrive\Desktop\Altiora-Immersive-Web-Lab`
- **Estado de Comprobación:** Clonado, verificado e integrado (`OK: 16 repositorios y 9 documentos validados`).
- **Propósito:** Aloja los experimentos reproducibles de WebGL, shaders GLSL, modelos glTF, benchmarks de interacción y las plantillas de auditoría técnica que alimentan la experiencia en producción de *La Central del Queso*.
