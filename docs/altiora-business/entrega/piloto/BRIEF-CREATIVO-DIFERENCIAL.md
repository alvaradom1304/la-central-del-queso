# Brief creativo diferencial: La Central del Queso · 31/10/2026 · versión 1

**Uso interno de laboratorio.** Este piloto no tiene contrato, pago ni aceptación del cliente. No es un caso de éxito ni una prueba de la oferta. Lo único que puede decirse en público del piloto está en `docs/altiora-business/PRUEBA-PILOTO.md:34`, y usar su identidad fuera de Altiora requiere permiso (`PRUEBA-PILOTO.md:3`).

Skill aplicada: `altiora-creative-analyst`. Cada afirmación lleva su fuente o la etiqueta `HIPÓTESIS`. Rutas abreviadas:
- `EST/` = `C:/Users/Usuario/OneDrive/Desktop/client-central-del-queso/estrategia/`
- `WEB/` = `C:/Users/Usuario/OneDrive/Desktop/client-central-del-queso/web/`
- `LAB/` = `.../Altiora-Immersive-Web-Lab/projects/la-central-del-queso/`

`EST/01_DISCOVERY_DOCUMENT.md` es una plantilla de ejemplo («Acme Corp», `:4`), así que no se usa como fuente. La documentación de estrategia del cliente (`EST/01` a `04`) no cita entrevistas ni archivos de origen. Por eso se trata como **declaración no verificada**, salvo los datos de encuesta que se señalan.

## 1. Caso
- **Resultado empresarial:** que quien conoce la marca en la feria repita la compra por la web (pedido con número, ya implementado: `PRUEBA-PILOTO.md:34`) sin depender de ir al puesto. No hay meta medida. La meta de `EST/03_STRATEGIC_DIRECTION.md:78` (20 % de clientes de feria en base digital) es una propuesta sin línea base.
- **Resultado humano:** elegir por envío un queso que le guste sin poder probarlo antes.
- **Canales del encargo:** marca, web, anuncios y redes, audio, y punto físico en feria. No hay alcance firmado. La parte creativa vive en la definición (12 h de las 75 h). Para producir momentos firma se reservan **12 h**, un supuesto sin medir (`references/canales.md:41`).

## 2. Verdades del cliente (con fuente)

| # | Verdad | Fuente | ¿Permiso de uso? |
|---|---|---|---|
| V1 | Vende en la Feria del Agricultor de Guadalupe (sábados, 5:30–13:00) y en la de Hatillo (domingos, 6:00–13:30) | `WEB/lib/locations.ts:12-25`; encargo | Es un dato operativo. Hay que confirmar con el cliente los horarios vigentes |
| V2 | La degustación forma parte de la venta en feria | `EST/01_DISCOVERY_CENTRAL_DEL_QUESO.md:36`. Copy de la web: «En la feria nunca vendemos a ciegas: primero le damos a probar una tajadita» (`WEB/components/VipTastingPass.tsx:152`), sin autor registrado | PENDIENTE: confirmar que la frase es del cliente antes de usarla |
| V3 | 29 de 33 encuestados conocieron la marca en la feria | `EST/01…:86` (muestra en feria, agosto de 2026) | No se encontraron los datos brutos: hay que verificarlos antes de citarlos |
| V4 | 17 de 33 encuestados compran semiduro con frecuencia | `EST/01…:90`; `EST/03…:32` | Igual que V3 |
| V5 | Catálogo de 12 referencias con precio en colones y una ficha sensorial de 1 a 5 (firmeza, sal, fundición, intensidad) | `WEB/lib/products.ts:1-6`, `:36-250` | Precios y fichas requieren validación (`LAB/BRIEF.md:35`). **Las fichas sensoriales no tienen fuente de cata** |
| V6 | La web tiene catálogo, recomendador, carrito y registro de pedidos por API | `PRUEBA-PILOTO.md:23-28` | Es interno. Nada se probó en un navegador real |
| V7 | Doña Martha es la figura de confianza del negocio | `EST/01…:45`; `EST/03…:8` | NO. No consta su consentimiento para usar su nombre, su imagen ni su firma |

**Contradicciones que bloquean el uso de la «historia»** (no se usan hasta tener un documento del cliente):
- **Antigüedad.** «Más de 30 años» (`EST/01…:7`) frente a «desde 1980» y «más de 45 años» (`WEB/components/StorySection.tsx:77-78`; `HeroJourney.tsx:28`).
- **Fundación.** Doña Martha como fundadora (`EST/01…:5`) frente a «el legado de nuestro padre» (`HeroJourney.tsx:38-39`; `StorySection.tsx:16-48`).
- **Modelo productivo.** «Elaboración artesanal» (`EST/01…:34`) frente a «traído semanalmente de productores de Turrialba» (`products.ts:43`; `HeroJourney.tsx:49`) y frente a una «Finca Doña Martha» con lechería, hato Jersey, cava y 1.220 m (`FincaToTableExperience.tsx:64-66`, `:663-719`).

## 3. Tensión del consumidor · `HIPÓTESIS`
- **En sus palabras:** no hay ninguna cita real, porque no hubo entrevistas ni se revisaron consultas recibidas. Formulación provisional, no textual: «Quiero el queso del puesto sin ir al puesto, pero si no lo pruebo no sé si esta semana tendrá el punto de sal y la textura que me gustan».
- **Qué quiere y qué le frena:** quiere la comodidad del envío. Le frena comprar «a ciegas» un producto que varía y que siempre eligió probándolo. Esto se apoya en lecturas no verificadas: el envío requiere confianza previa (`EST/02_RESEARCH_INTELLIGENCE_REPORT.md:55`), el punto de sal impulsa la compra (`:62`), la higiene genera desconfianza (`:64`), crece la recompra «sin degustación previa» (`:69`) y existe una tensión entre envío y degustación (`EST/01…:79`).
- **Cómo validarla (antes de producir):**
  1. En el puesto, con consentimiento y sin datos personales: 5–8 compradores responden dos preguntas. «¿Qué le haría pedir queso por envío sin probarlo?» y «¿qué le ha salido mal al comprar queso sin probar?». Se anotan las palabras textuales.
  2. Con permiso del cliente, revisar consultas anonimizadas de WhatsApp en busca de preguntas sobre sal, frescura o textura.
  3. Regla de decisión propuesta: si menos de la mitad menciona la incertidumbre sobre sal, textura o frescura, se rehace el insight.

## 4. Códigos de la categoría

Muestra limitada, consultada el 31/10/2026. Incluye páginas públicas, la estrategia del cliente y su web. No se revisaron redes sociales de productores pequeños, así que el mapa **no es exhaustivo**.

| Lo que hacen todos | Respetar o romper | Por qué |
|---|---|---|
| Los años de tradición como sello. Monteverde: «70 años de tradición» ([Delfino, 07/06/2024](https://delfino.cr/2024/06/quesos-monteverde-celebra-70-anos-de-historia-entretejida-con-la-comunidad-en-el-bosque-nuboso)); el cliente: «desde 1980» (`StorySection.tsx:77`) | **Romper** | Cualquiera puede firmarlo y, en este cliente, la cifra es contradictoria |
| La montaña y el paisaje de origen. Montañas en el empaque de Monteverde (misma fuente); «bruma volcánica» (`FincaToTableExperience.tsx:671`) | **Romper** | Es una postal intercambiable y no ayuda a elegir |
| Familia y herencia entre generaciones: así se cubre la DO Queso Turrialba («tradición, familia, herencia de saberes», [Delfino, 01/09/2025](https://www.delfino.cr/2025/09/la-fuerza-de-la-tradicion-mantiene-vivo-el-queso-turrialba-con-denominacion-de-origen)); `EST/04_BRAND_SYSTEM.md:46` | **Romper como protagonista** | Lo comparten cientos de familias. El trato humano se muestra con personas reales que dan permiso |
| «Artesanal», «auténtico» ([IICA](https://iica.int/en/press/news/queso-turrialba-historia-y-sabor-de-una-denominacion-de-origen-2), consultado el 31/10/2026) | **Respetar con moderación** | Es lo que el comprador busca. Se usa como descripción, nunca como superlativo |
| «Turrialba» como garantía de origen. La industria vende «Queso Tipo TURRIALBA» y el nombre está protegido por DO ([Delfino, 04/2023](https://www.delfino.cr/2023/04/10-anos-despues-tribunal-rechaza-demanda-de-dos-pinos-contra-denominacion-de-origen-queso-turrialba)) | **Respetar la regla** | Es un tema legal y de confianza (ver §9) |
| Calidad y higiene certificadas como argumento industrial (Monteverde, «certificaciones… internacionalmente») | **Respetar** la higiene visible: empaque al vacío (`EST/04…:74`) | La higiene es un freno declarado (`EST/02…:64`) |
| Crema, verde y terracota; tablas rústicas y kraft (`EST/04…:69`, `:80`) | **Respetar la paleta** (continuidad con lo construido) y **romper el atrezo rústico** | La paleta ya existe. Tablas, portón y kraft son el cliché |
| Usos de la cocina tica: gallo pinto, tortilla, café chorreado (`products.ts:51`, `:60-61`) | **Respetar** | Es concreto y útil. Se evita convertirlo en postal |
| La degustación existe en la feria (`EST/02…:53`), pero en lo digital la categoría no la traslada. Esto es `HIPÓTESIS` sobre la muestra revisada | **Romper: es el hueco** | Nadie ayuda a elegir por cómo se comporta el queso en la mesa |

## 5. Insight elegido
«En el puesto se prueba antes de comprar (V2, V1) × quien pide por envío quiere comodidad pero teme que el queso no tenga su punto (§3, `HIPÓTESIS`) × la categoría vende años, paisaje y familia, y nadie ayuda a elegir por cómo se comporta el queso (§4)».

**Por qué este.** Se apoya en lo que el cliente hace en dos puestos concretos y en datos que ya están en su catálogo (V5). Además, resuelve la tarea que la web acaba de habilitar: pedir sin ir al puesto. Supera el filtro del competidor **solo en parte**, porque cualquier puesto de feria da a probar. Lo propio está en la combinación: sus dos ferias, su escala sensorial y el paso del puesto a la web. Esa especificidad queda en 3 hasta que se pruebe con personas (§10).

**Descartados:**
1. «Tradición familiar de 30 años (o desde 1980) frente a la frialdad industrial» (`EST/04…:39`). Lo firma cualquier quesería de la categoría, con Monteverde a la cabeza, y su verdad es contradictoria (§2). Falla en verdad y en el filtro del competidor.
2. «Origen Turrialba y volcán frente a las imitaciones "tipo Turrialba"». Lo firman mejor los productores de la zona DO. Además, no está verificado que el cliente produzca ni compre allí (`products.ts:43`), y el nombre tiene protección legal. Falla en verdad y en el filtro del competidor.
3. «El semiduro que sí dora en el sartén» (`page.tsx:83`). Cualquier vendedor de semiduro puede decirlo y todavía no hay una prueba grabada. No es el insight central, pero se conserva como **prueba de producto** para anuncios (§8).

## 6. Idea central
**Cada canal hace lo que hace la tajada de prueba en el puesto: dejar que la persona compruebe el punto del queso (sal, firmeza, cómo dora o funde) antes de decidir, y recordar el que ya le gustó.**

## 7. Territorio: «el punto»

| Dimensión | Decisiones | Prohibido |
|---|---|---|
| **Verbal** | Usted, frases cortas, voz de puesto. Palabras propias: *tajada, punto, dora, funde, se ralla, pruébelo, sábado en Guadalupe, domingo en Hatillo*. Siempre se dice el uso concreto y el precio | «Desde 1980» y «30 años» (hasta que haya un documento), «Finca Doña Martha», «maestros queseros», «legado», «patrimonio», «sommelier», «VIP», «maison», «calidad y compromiso», «sin químicos», «100 % leche pura», «bajo en sal» (sin análisis), «Queso Turrialba» (sin verificar la DO) |
| **Visual** | Forma: el corte de la tajada (sección del queso) y una **regla de cuatro barras** (firmeza, sal, fundición, intensidad) como signo. Color: la paleta crema, verde y terracota ya construida, con menos brillos dorados. Imagen: foto real del puesto, de manos cortando y de queso en sartén en una cocina, siempre con permiso. Tipografía: la serif y la sans existentes, con licencias por comprobar | Portón, vacas, bruma y paisajes generados presentados como reales; tablas rústicas como fondo; «firma» caligráfica de Doña Martha sin su consentimiento; fotos de banco |
| **Sonora** | Opcional y silenciada por defecto. Material propio: el corte del cuchillo en la tabla del puesto o el chisporroteo del semiduro en la sartén. Tempo calmado, sin música de biblioteca | Cencerros y viento sintéticos que simulan una finca (`WEB/lib/spatialAudio.ts:119-125`, `:187`); voces clonadas; voces de terceros identificables en la feria |
| **Interacción (web)** | Elegir por uso y por punto en dos pasos, con el resultado convertido en acción («añadir»). El contenido funciona sin animación, con teclado y con movimiento reducido. La interacción solo existe si acorta la elección | Cursores, marquesinas y física que no ayudan a elegir; un 3D que retrase el catálogo; escasez falsa |

## 8. Momentos firma

| Canal | Momento firma | Por qué es propio | Horas estimadas | Ejecuta |
|---|---|---|---|---|
| **Marca** | **La regla del punto**: cuatro barras cortas que aparecen igual en la etiqueta, la ficha web y la pizarra del puesto | Sale de la escala que ya usa su catálogo (V5) | 2 h | `premium-branding`, `canvas-design` |
| **Web** | **«Su punto»**: el «Recomendador Sommelier» (`CheeseMatcher.tsx:243`) pasa a ser dos preguntas con la voz del puesto («¿Para qué lo va a usar?» y «¿Cómo le gusta de sal?»). Devuelve una ficha de tajada con la regla, el precio y el botón de añadir | Ayuda en la tarea exacta que plantea la tensión. **Requisito:** validar las fichas sensoriales con una cata del cliente (sin eso, no se publica) | 6 h | agente `altiora-experience`, `frontend-design` |
| **Anuncios y redes** | **La prueba de la sartén**: una toma real de 15 s, sin cortes, de una tajada de semiduro en sartén, con subtítulos, más «Pruébelo el sábado en Guadalupe o el domingo en Hatillo». Prueba una sola hipótesis: el comportamiento del queso atrae más que el paisaje | La prueba la graba el cliente: si no dora, no hay anuncio | 2 h (guion, lista de tomas y variantes de copy; la grabación es del cliente) | `ad-creative`, `social`, `video` |
| **Punto físico** | **La tarjeta del punto**: en el puesto se marca en una tarjeta el queso que la persona probó y le gustó, con un QR que abre esa ficha en la web y lleva el origen (Guadalupe o Hatillo) | Une V1, V2 y la web. Sustituye el QR con descuento de `EST/03…:57`, porque los márgenes no están validados (`EST/01…:28`) | 2 h (diseño y origen del QR) | `premium-branding`, `conversion-tracking` |
| **Audio** | **El corte**: logo sonoro de 1–2 s grabado en el puesto (cuchillo y tabla), para el final del vídeo y como sonido opcional en la web | Es un sonido de su gesto de venta, no de una finca supuesta | 3–4 h + grabación | `audio-production`, agente `audio-specialist` |

**Dentro de las 12 h:** marca, web, anuncios y punto físico (2 + 6 + 2 + 2 = 12 h, estimación sin medir).

**Propuestos como cambio (plantilla 04):**
- **Audio** (3–4 h, más permiso y grabación).
- **Limpieza de verdad de la web actual** (unas 3–4 h de construcción, ver la Auditoría). Es condición previa a publicar cualquier momento firma.

Impresión de tarjetas, pauta y licencias requieren autorización y no están incluidas.

## 9. Riesgos y derechos

**Clichés que se evitan:**
- «de la finca a tu mesa» (`page.tsx:29`), portón de cedro, pastoreo libre, cava en penumbra y humo de guayabo;
- tabla rústica y kraft, «receta de la abuela», cencerros;
- fotos «maison» de lujo (`products.ts:49`);
- «tradición» y «auténtico» como relleno.

**Afirmaciones sin prueba que hoy están en la web:**
- antigüedad y fundación contradictorias (§2);
- citas entre comillas atribuidas a la familia (`StorySection.tsx:23`, `:31`, `:39`, `:47`): parecen testimonios y no tienen fuente;
- 1.220 m, hato Jersey, 34 °C, cava a 14 °C y 45 días (`FincaToTableExperience.tsx:66`, `:84`, `:92`, `:671-697`);
- «100 % Leche Pura» y «Sin Químicos» (`HeroJourney.tsx:181-185`);
- «Sin almidones» (`products.ts:185`) y «Bajo en Sal» (`products.ts:74-79`): son declaraciones de composición y salud que requieren análisis y revisión normativa.

**Denominación de origen:**
- Solo puede llamarse «Queso Turrialba» el queso producido en la zona delimitada (distrito de Santa Cruz y parte de Santa Teresita) ([Delfino, 04/2023](https://www.delfino.cr/2023/04/10-anos-despues-tribunal-rechaza-demanda-de-dos-pinos-contra-denominacion-de-origen-queso-turrialba)).
- Productos como «Queso Turrialba Fresco de Finca» (`products.ts:56`) y «Semiduro de Turrialba» (`:39`) usan el nombre sin verificar ni la procedencia ni la relación con el Consejo Regulador.
- Hay que pedir la verificación al cliente y una revisión jurídica (Altiora no la sustituye). Mientras tanto, no se usa el nombre como denominación.

**Derechos de imagen, sonido, voz y tipografías:**
- No hay registro de activos (`EJEMPLO-PILOTO.md:36`).
- Las imágenes de finca llevan el aviso «Ambientación e ilustración» (`HeroJourney.tsx:31`) y no pueden presentarse como documentales (`LAB/BRIEF.md:15`).
- Nombre, cara y firma de Doña Martha y de la familia: requieren consentimiento escrito.
- Personas en la feria (clientes, vendedores vecinos): requieren consentimiento o no deben poder identificarse.
- Grabar en la feria o en una finca, incluidos sus sonidos: requiere permiso del dueño o administrador y conocer las reglas de la feria (NO VERIFICADO).
- Las licencias de las fuentes tipográficas actuales no se revisaron.

**Accesibilidad:**
- Sonido apagado por defecto y subtítulos en todo vídeo.
- Ficha usable sin animación y con teclado.
- Contraste de los textos pequeños en opacidad baja (`text-forest/60`, `text-2xs`) por medir.
- `FincaToTableExperience` ya activa el modo ligero con movimiento reducido (`:761-773`). La marquesina no muestra esa comprobación (`BrandArtDirection.tsx:136-150`; no se ejecutó la web).

**Mantenimiento:**
- `inStock: true` y las fichas sensoriales están fijas en el código (`products.ts`), así que el cliente necesita una forma simple de actualizarlas.
- La tarjeta del punto debe poder marcarse con bolígrafo en segundos, porque Altiora no opera el puesto.

## 10. Validación

**Puntuación en la rúbrica** (sobre el brief y su plan; aún no hay piezas producidas):

| Criterio | Nota | Evidencia |
|---|---|---|
| Especificidad | **3** | Se basa en V1, V2 y V5. La degustación es común en las ferias y nadie probó la atribución (la rúbrica limita a 3 sin prueba con personas) |
| Verdad | **3** | No usa la historia contradictoria. V3–V5 aún no tienen datos brutos ni cata |
| Insight del consumidor | **2** | La tensión es concreta, pero `HIPÓTESIS` y sin palabras reales |
| Coherencia entre canales | **4** | El mismo gesto (la tajada y el punto) en etiqueta, web, puesto y anuncio. Es un plan, todavía no un conjunto de piezas |
| Momento firma | **4** | «Su punto» ayuda a elegir sin probar. Sin construir |
| Oficio | **3** | Brief limpio y con fuentes. El oficio de las piezas no puede evaluarse todavía |
| Viabilidad | **3** | Cabe en 12 h con recortes: el audio y la limpieza pasan a la plantilla 04 |
| Ética y accesibilidad | **4** | Elimina la presión falsa y las afirmaciones sin base, sonido apagado y subtítulos. No se midieron contraste ni movimiento |

Sin bloqueos: especificidad y verdad están en 3 y no hay ningún 1.

**Prueba con personas:** NO VERIFICADO (n = 0).

**Aprobación del cliente:** PENDIENTE. No hay un decisor registrado y el piloto es un laboratorio interno.

## Auditoría de lo existente

Rúbrica aplicada a la web del checkout local, leída el 31/10/2026 y sin ejecutar: especificidad 2, **verdad 1 (bloquea)**, insight 2, coherencia 2, momento firma 3, oficio 3, viabilidad 2, **ética y accesibilidad 2** (baja a 1 si los «18 cupos» no son reales). `HeroJourney.tsx` y `StorySection.tsx` no se importan en ninguna parte (la búsqueda solo devuelve sus definiciones), pero su contenido se repite en `FincaToTableExperience.tsx` y `page.tsx`.

1. **Retirar la historia y la finca sin fuente** (criterio: *Verdad*, que bloquea; también *Especificidad*, por cliché).
   - Dónde: `FincaToTableExperience.tsx:64-66` y `:663-719`; `page.tsx:26-29` y `:52-57`; `BrandArtDirection.tsx:113`; `products.ts:43` y `:56`.
   - Contiene «Finca Doña Martha», 1980, altitud, hato, temperaturas, «Maestros queseros» y el uso del nombre Turrialba.
   - Se sustituye por lo verificado: ferias, horarios, catálogo y precios validados.
2. **Convertir el recomendador en el momento firma «Su punto»** (criterio: *Momento firma*; también *Insight del consumidor*).
   - Dónde: `CheeseMatcher.tsx:32-69` y `:243`.
   - «Sommelier» y «Secreto de Feria» pasan a las dos preguntas con voz de puesto, con las fichas validadas por cata.
   - La mesa de física (`page.tsx:69-74`, `InteractiveArtisanalPhysics`) es un detalle bonito sin función y debería dejar de estar en el recorrido de compra.
3. **Quitar la presión falsa y el movimiento sin control** (criterio: *Ética y accesibilidad*; también *Oficio*).
   - «18 cupos… disponibles» es un texto fijo (`VipTastingPass.tsx:129`), junto con «Cierre de apartados» (`:126`) y el lenguaje «VIP».
   - La marquesina gira sin comprobar el movimiento reducido (`BrandArtDirection.tsx:136-150`).
   - Los cencerros sintéticos (`spatialAudio.ts:187`) simulan una finca no verificada.
