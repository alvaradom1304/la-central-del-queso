# Plano secuencia "Finca": guía de generación con video IA (Higgsfield)

- **Rama:** `exp/plano-secuencia-finca` · **Fecha:** 2026-10-18 · **Rol:** claude/visual-producer · **Revisión:** dirección creativa + QA (M3)
- **Estado:** DISEÑADO. No se ha generado ningún clip ni se ha llamado a Higgsfield. Los comandos ffmpeg de la sección 5 se **probaron** con ffmpeg 9.0.2 sobre los videos existentes de `public/videos/` (solo lectura). No se tocó ningún otro archivo.
- **Objetivo:** un único plano continuo, a la altura de los ojos y caminando hacia delante, que lleve al usuario del portón a la mesa de la lechería. Así el scroll se siente como entrar a la finca y termina donde se eligen los quesos.

**Resumen:** 2 fotogramas clave fijos + 5 clips encadenados (9/11/11/9/10 s). Modelo recomendado: **Kling 3.0 Pro image-to-video**, con fotograma inicial y, en los tramos 4 y 5, también final. Se genera un master 16:9 y el 9:16 sale de un recorte central; solo se genera 9:16 aparte si el recorte falla. Se esperan unas 16 generaciones de video (rango de 5 a 26).

---

## 1. Hallazgos previos (evidencia)

**Las 7 fotos de `public/` están generadas por IA, no son fotos reales.** Cada archivo incluye un manifiesto C2PA con el texto *"Created by Google Generative AI"*, `digitalSourceType = trainedAlgorithmicMedia` y la acción *"Applied imperceptible SynthID watermark"*. Lo comprobé leyendo los bytes del archivo; no validé la firma criptográfica. Miden 1376×768 (`hero_finca.jpg` mide 1024×1024), **menos que 1920×1080**: hay que reescalarlas o regenerarlas en 2K antes de usarlas como fotograma.

| Archivo | Uso en este plano | Motivo |
|---|---|---|
| `porton_finca_turrialba.jpg` | **Base de K0** (editada) | Define la luz: amanecer, sol bajo delante a la derecha, neblina. El portón ya aparece abierto y detrás hay potrero, así que hay que editarla (sección 3). |
| `campo_floral_turrialba.jpg` | Solo referencia | El camino es empedrado (no lastre) y tiene heliconias y flores amarillas que no siguen la regla de continuidad. |
| `potrero_vacas_lecheria.jpg` | Solo referencia | Su cielo azul de media mañana rompe la regla de luz. Una vaca lleva un arete, con riesgo de texto o números. El granero con base de piedra sí es útil como referencia. |
| `entrada_lecheria_granero.jpg` | **K4 = fotograma final del tramo 4** | Puertas dobles abiertas, faroles encendidos (encaja con el amanecer), tarros y macetas. Por dentro parece una cava, y la mesa final K5 se diseña para que coincida. |
| `lecheria_proceso_artesanal.jpg` | **No usar** | Muestra personas inventadas y vapor que sugiere un método de elaboración. |
| `interior_cava_roble.jpg` | No como fotograma | La rueda central lleva una etiqueta con texto alucinado. |
| `hero_finca.jpg` | **No usar** | Paisaje alpino y un letrero con texto alucinado ("FERME…"). **Aviso:** hoy se usa en `components/HeroJourney.tsx`, así que hay que avisar a dirección creativa. |

Los videos de `public/videos/` (1280×720, de 13 a 60 s, tomas separadas, entre 24 y 30 fps) no sirven como plano secuencia. Solo vi el último fotograma de `finca_umbral_camino.mp4`: bosque de pinos y un letrero vial con texto, que no coincide con la finca. No sé de dónde vienen ni con qué licencia.

## 2. Reglas de continuidad (valen para todos los tramos)

| Variable | Regla |
|---|---|
| Hora y clima | Amanecer, entre 30 y 60 min después de la salida del sol. Parcialmente nublado, neblina baja en los cerros, sin lluvia. Igual en los 5 tramos. |
| Luz exterior | Sol bajo **delante y a la derecha** (contraluz suave), cielo dorado pálido. Nunca cielo azul de mediodía. |
| Luz interior | Faroles cálidos colgantes más la luz de día que entra por la puerta y una ventana lateral. La exposición se adapta poco a poco, sin saltos. |
| Lente | Equivalente a 24 mm (se admite de 24 a 28 mm), sin ojo de pez. |
| Cámara | Altura de 1,6 m constante, horizonte nivelado, estabilizada con gimbal. Avanza en línea recta, sin giros, paneos, zoom ni balanceo de paso. |
| Velocidad | Paso lento y constante (unos 1 m/s; el modelo no entiende cifras, por eso en el prompt va como *slow, steady walking pace*). Solo se frena en el tramo 5. |
| Color | Cálido y natural, verdes no saturados, contraste suave, sin teal-orange. En postproducción se aplica **una sola** gradación (LUT) a todo el master, nunca por clip. |
| Contenido | Sin cortes, sin personas ni manos, sin texto, letreros, logos ni números. Los únicos animales son las vacas del tramo 3. |
| Geografía fija | La lechería es **una sola**: madera oscura sobre base de piedra, techo de zinc, puertas dobles de madera, dos faroles, tres tarros de aluminio a la derecha y macetas con hortensias y buganvillas (como en `entrada_lecheria_granero.jpg`). |
| Zona segura móvil | El camino, el punto de fuga, la puerta y la mesa van en el **tercio central** (x entre 34 % y 66 %), que es lo que conserva el recorte 9:16. |

**Bloque de estilo exterior** (se pega al final de los prompts 1 a 4):

```
Single continuous shot with no cuts. First-person view walking forward at eye level, camera height about 1.6 m, 24mm lens look, gimbal-stabilized, level horizon, no head bob, no turning, no zoom. Early morning shortly after sunrise: low warm sun ahead and to the right, soft haze, thin mountain mist, partly cloudy pale golden sky. Natural realistic colors, soft contrast, warm highlights, lush but not oversaturated greens. Photorealistic, fine stable detail. Quiet farm, nobody in sight.
```

**Bloque de estilo interior** (va en el prompt 5):

```
Single continuous shot with no cuts. First-person view at eye level, camera height about 1.6 m, 24mm lens look, gimbal-stabilized, level horizon, no head bob, no turning, no zoom. Warm light from hanging lanterns mixed with soft early-morning daylight from the doorway and a side window; exposure adapts gently with no sudden brightness change. Natural realistic colors, soft contrast. Photorealistic, fine stable detail. Nobody in sight.
```

**Negative prompt base** (se usa si el modelo o la interfaz lo admiten; ver la sección 10):

```
people, person, hands, silhouette, text, letters, numbers, sign, signage, logo, watermark, label, cut, scene change, camera shake, fast motion, zoom, pan, rotation, fisheye, distorted animals, extra legs, merged bodies, morphing, flickering, strobing, color shift, oversaturated, cartoon, CGI look, blurry, low resolution
```

## 3. Fotogramas clave (se hacen antes de generar video)

Todos se entregan en 16:9 y **como mínimo a 1920×1080**: se generan en 2K o se reescalan con un buen reescalador. El formato es PNG. Para que el estilo coincida con las fotos actuales, conviene editarlas con el mismo generador de imagen de Google con que se crearon. También sirve un editor de imagen dentro de Higgsfield.

**K0 · Portón cerrado** (edición de `porton_finca_turrialba.jpg`; es la imagen de partida del tramo 1):

```
Edit this photo keeping the same camera position, framing, light, sky, mountains and hydrangeas exactly. Close the wooden gate so it spans the whole opening between the two posts. Behind the gate, replace the pasture, the nearby cows and the distant barn with a straight gravel lane that continues ahead between blue and white hydrangea hedges and fades into soft morning mist; keep only distant green hills. Gate and posts are plain weathered wood with no sign, letters or numbers. No people. Photorealistic, 16:9.
```

**K4 · Puerta abierta.** Se usa `entrada_lecheria_granero.jpg` sin editar, solo reescalada a 1920×1080.

**K5 · Mesa final** (imagen nueva con `entrada_lecheria_granero.jpg` como referencia; es el fotograma final del tramo 5):

```
Photorealistic interior of the same rustic dairy building shown in the reference image: fieldstone walls, dark weathered timber, glowing hanging lanterns, stone floor, soft early-morning daylight from the doorway behind the camera and a small side window. Eye-level view from 1.6 m height, about 1.5 m in front of a sturdy wooden reception table, centered, 24mm lens look. On the table, a few unlabeled round cheeses and a block of fresh white cheese on wooden boards and plain cotton cloth, leaving clear empty space in the middle of the tabletop. Background: wooden shelves with round cheeses; aluminium milk cans and a stainless steel vat on the left. No people, no hands, no text, labels, logos or numbers. Warm natural colors, soft contrast. 16:9.
```

Los quesos de K5 son **genéricos**: no representan los productos del catálogo. El centro de la mesa queda vacío a propósito para que la web superponga las fotos o tarjetas de los productos reales.

## 4. Tramos

Duraciones de 9, 11, 11, 9 y 10 s. `scripts/build-frames.mjs` reparte el scroll en proporción a la duración de cada clip. Con un fundido de 0,6 s el reparto queda en 18,3/21,9/21,8/17,6/20,4 %, frente al objetivo de 18/22/22/18/20.
**Si solo dispones de 5 o 10 s:** genera los 5 clips de 10 s y recorta el 1 y el 4 a unos 8,2 s y el 5 a unos 9,1 s. Recórtalos **antes** de extraer el fotograma de enlace (sección 5).

Para todos los tramos: modelo **Kling 3.0 Pro image-to-video**, `sound: "off"` (su valor por defecto es `"on"`) y `cfg_scale` 0,5 (el valor por defecto; si el clip ignora el prompt, prueba entre 0,6 y 0,7, algo que no he verificado). El movimiento de cámara se describe dentro del prompt porque Kling no tiene un parámetro de cámara.

### Tramo 1 · `porton` (0–18 %) · 9 s
- **Inicio:** K0. **Final:** libre. **Movimiento:** cámara quieta que arranca y avanza recto a través del portón.

```
A closed, weathered wooden farm gate stands between two old wooden posts framed by blue and white hydrangea bushes. Through the gaps in the gate a gravel lane continues straight ahead between hydrangea hedges into soft mist. The camera starts walking forward slowly; the gate swings open smoothly on its hinges by itself and stays open, and the camera passes through the gateway onto the gravel lane. The gate is plain wood with no sign or lettering. [BLOQUE EXTERIOR]
```
- **Negative:** base + `gate breaking, gate bending, gate melting, sign on gate, name on gate`.
- **Plan B** (si falla 3 veces la apertura): edita K0 con el portón entreabierto y usa *"the half-open gate swings fully open as the camera approaches"*.
- **9:16:** en el recorte central los postes quedan fuera del cuadro y solo se ve la hoja del portón moviéndose. Acéptalo si se entiende que se abre; si no, haz el 9:16 aparte.

### Tramo 2 · `camino` (18–40 %) · 11 s
- **Inicio:** último fotograma del tramo 1. **Final:** libre. **Movimiento:** avance recto a la misma velocidad.

```
Continuing the same shot without a cut: the camera keeps walking forward at the same slow, steady pace along a straight gravel farm lane. Dense blue, white and pale pink hydrangea bushes line both sides of the lane. Thin mist drifts low across the lane and over the green hills; volcanic mountain ridges are partly veiled by mist in the distance. Near the end of the shot the hedge on the right side opens up, revealing a weathered wooden post-and-wire fence and an open green pasture beyond it. [BLOQUE EXTERIOR]
```
- **Negative:** base + `cobblestones, paved road, cars, road signs, buildings nearby`.
- **9:16:** el recorte central funciona porque el camino y el punto de fuga quedan en el centro.

### Tramo 3 · `potrero` (40–62 %) · 11 s
- **Inicio:** último fotograma del tramo 2. **Final:** libre (si la lechería sale distinta, ver K3 opcional en la sección 6). **Movimiento:** avance recto.

```
Continuing the same shot without a cut: the camera keeps walking forward at the same slow, steady pace along the gravel lane, with a weathered wooden post-and-wire fence on the right. Beyond the fence, four or five dairy cows graze calmly in a lush green pasture at a natural distance, moving slowly with their heads down to the grass; they stay behind the fence. Straight ahead at the end of the lane, a single-story dairy barn of dark weathered timber with a fieldstone base and a corrugated metal roof comes into view; its double wooden doors are closed, two lanterns glow beside them, and clay pots with hydrangeas and bougainvillea and three aluminium milk cans stand by the entrance. Mist lingers on the hills behind the barn. [BLOQUE EXTERIOR]
```
- **Negative:** base + `cows crossing the lane, cows walking toward camera, two heads, five legs, merged cows, deformed udders, ear tags with numbers, people milking, tractor`.
- **9:16:** en el recorte central las vacas de la derecha se salen del cuadro. Es aceptable siempre que se vean la cerca y la lechería al fondo.

### Tramo 4 · `puerta` (62–80 %) · 9 s
- **Inicio:** último fotograma del tramo 3. **Final (`last_image_url`):** K4. **Movimiento:** avance que se frena un poco en el umbral.

```
Continuing the same shot without a cut: the camera walks the last few meters toward the dairy barn entrance and steps onto a wooden deck. Clay pots with hydrangeas, bougainvillea and ferns flank the entrance; three aluminium milk cans stand to the right; two lanterns glow beside the doorway. The double wooden doors swing open smoothly to both sides by themselves, revealing a warmly lit interior with stone walls and wooden shelves. The camera slows slightly as it reaches the threshold. Plain wooden doors with no sign or lettering. [BLOQUE EXTERIOR]
```
- **Negative:** base + `sign above door, name plate, letters on milk cans, doors warping, doors melting`.
- **9:16:** las hojas de la puerta ocupan aproximadamente de x 33 % a 41 % y de 62 % a 70 %. En el recorte central se ve la apertura, pero no el marco completo.

### Tramo 5 · `lecheria` (80–100 %) · 10 s
- **Inicio:** último fotograma del tramo 4. **Final (`last_image_url`):** K5. **Movimiento:** cruza el umbral, avanza, frena suave y se detiene durante el último segundo.

```
Continuing the same shot without a cut: the camera crosses the threshold into a small rustic dairy room with fieldstone walls, dark timber beams and a stone floor. On the left, aluminium milk cans and a stainless steel vat with fresh white curd; on the right, wooden shelves with round cheeses. The camera walks slowly toward a sturdy wooden reception table in the center, decelerates smoothly and comes to a complete stop facing the table at standing height, holding perfectly still for the final second. On the table, a few unlabeled cheeses rest on wooden boards and plain cotton cloth, with open empty space in the middle of the tabletop. Everything is still. [BLOQUE INTERIOR]
```
- **Negative:** base + `steam, smoke, labels on cheese, price tags, brand names, packaging with text, camera shake at the stop`.
- **9:16:** el recorte central funciona porque la mesa está centrada.

### 16:9 frente a 9:16: recomendación
1. **Generar solo el master 16:9 y recortar el 9:16 del centro**, que es lo que ya hace `build-frames.mjs` (desktop 1600×900, mobile 720×1280). Cuesta la mitad y mantiene una sola cadena que revisar.
2. **El problema es la resolución.** El script normaliza a 1920×1080 y después recorta 607×1080, así que el móvil se amplía ×1,19. Si Kling entrega 720p, el recorte es de 405×720 y la ampliación de ×1,78, lo que se ve blando. Comprueba la resolución con `ffprobe` en el primer clip. Si es 720p, usa Kling O3 `mode: "4k"` y pide a web-engineer que el recorte móvil se haga **antes** de normalizar; si no, el 4K se pierde.
3. **Generar el 9:16 aparte** solo si el recorte no funciona (sobre todo en los tramos 1 y 4) o si se ve blando. Habría que repetir la cadena entera con K0, K4 y K5 en 9:16 (extendiendo el lienzo en vertical) y los mismos prompts. Nunca se mezclan clips 9:16 nativos con recortes, porque los enlaces no coincidirían. Además, el script tendría que aceptar clips móviles separados (cambio para web-engineer).

## 5. Encadenado con ffmpeg (comandos probados)

ffmpeg está instalado con winget pero **no está en el PATH**. Antes de nada, en PowerShell:
`$env:Path = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin;$env:Path"`

1. **Revisar el clip** (resolución, fps y número de fotogramas):
   `ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=width,height,r_frame_rate,nb_read_frames:format=duration -of compact=p=0 tramo1.mp4`
2. **Extraer el último fotograma**, que será la imagen inicial del tramo siguiente. Se probó y da SSIM = 1,000 frente al último fotograma real:
   `ffmpeg -y -sseof -1 -i tramo1.mp4 -fps_mode passthrough -update 1 enlace_1-2.png`
3. **Si el último fotograma sale borroso**, saca los fotogramas del último medio segundo y elige el más nítido:
   `ffmpeg -y -sseof -0.5 -i tramo1.mp4 -fps_mode passthrough cola/f_%03d.png`
   Si hay K archivos y eliges `f_k`, recorta el clip a `T − K + k` fotogramas (T sale del paso 1) y repite el paso 2 sobre el clip recortado:
   `ffmpeg -y -i tramo1.mp4 -frames:v 342 -an -c:v libx264 -crf 14 -pix_fmt yuv420p tramo1_rec.mp4`
4. **Subir el enlace como PNG.** En la web de Higgsfield se carga como *start frame*. En la API hace falta una URL HTTPS pública o `POST /files/generate-upload-url` seguido de un PUT; una ruta local de `public/` no sirve.
5. **Unir los clips.** La vía oficial es `node scripts/build-frames.mjs --frames 150 tramo1.mp4 tramo2.mp4 tramo3.mp4 tramo4.mp4 tramo5.mp4`, que une, extrae los webp y escribe el manifiesto. Para revisar el master en QA antes de eso, hay dos opciones:
   - **Unión directa** (recomendada, porque el primer fotograma de cada clip ya es el último del anterior). Quita ese fotograma duplicado para que no se note un tirón:
     `ffmpeg -y -i tramo1.mp4 -i tramo2.mp4 -i tramo3.mp4 -i tramo4.mp4 -i tramo5.mp4 -filter_complex "[0:v]scale=1920:1080:flags=lanczos,fps=30,setsar=1[v0];[1:v]trim=start_frame=1,setpts=PTS-STARTPTS,scale=1920:1080:flags=lanczos,fps=30,setsar=1[v1];[2:v]trim=start_frame=1,setpts=PTS-STARTPTS,scale=1920:1080:flags=lanczos,fps=30,setsar=1[v2];[3:v]trim=start_frame=1,setpts=PTS-STARTPTS,scale=1920:1080:flags=lanczos,fps=30,setsar=1[v3];[4:v]trim=start_frame=1,setpts=PTS-STARTPTS,scale=1920:1080:flags=lanczos,fps=30,setsar=1[v4];[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[v]" -map "[v]" -an -c:v libx264 -crf 14 -pix_fmt yuv420p master_16x9.mp4`
   - **Fundido corto de 0,2 s**, para disimular saltos de color o nitidez. Los offsets son la duración acumulada menos k × 0,2, calculados con las duraciones reales que da `ffprobe`. Ejemplo con 9/11/11/9/10 s: 8.8, 19.6, 30.4 y 39.2:
     `ffmpeg -y -i tramo1.mp4 -i tramo2.mp4 -i tramo3.mp4 -i tramo4.mp4 -i tramo5.mp4 -filter_complex "[0:v]scale=1920:1080,fps=30,setsar=1[a0];[1:v]scale=1920:1080,fps=30,setsar=1[a1];[2:v]scale=1920:1080,fps=30,setsar=1[a2];[3:v]scale=1920:1080,fps=30,setsar=1[a3];[4:v]scale=1920:1080,fps=30,setsar=1[a4];[a0][a1]xfade=transition=fade:duration=0.2:offset=8.8[x1];[x1][a2]xfade=transition=fade:duration=0.2:offset=19.6[x2];[x2][a3]xfade=transition=fade:duration=0.2:offset=30.4[x3];[x3][a4]xfade=transition=fade:duration=0.2:offset=39.2[v]" -map "[v]" -an -c:v libx264 -crf 14 -pix_fmt yuv420p master_16x9_xf.mp4`
   - **Nota para web-engineer** (no edité el script): `build-frames.mjs` usa `FADE = 0.6`. Con clips encadenados, los dos lados del fundido avanzan, así que 0,6 s producen doble exposición en objetos cercanos. Propongo bajarlo a 0,2 s o unir sin fundido.
6. **Vista previa móvil** (recorte central, el mismo que hace el script):
   `ffmpeg -y -i master_16x9.mp4 -vf "crop=ih*9/16:ih,scale=720:1280:flags=lanczos" -c:v libx264 -crf 18 preview_9x16.mp4`

## 6. Riesgos y cómo evitarlos

| Riesgo | Prevención | Si aparece |
|---|---|---|
| Texto alucinado en el portón o la puerta ("Finca Doña Martha" u otro) | Los prompts piden *plain wood, no sign or lettering*; el negative lo excluye y K0 no tiene letrero. **El nombre nunca lo genera la IA.** | Rechazar el clip. El nombre se agrega en postproducción como capa tipográfica, y solo si el usuario lo confirma. |
| Personas o manos inventadas | Prompt *nobody in sight* + negative. No usar `lecheria_proceso_artesanal.jpg`. | Rechazar el clip, aunque la persona aparezca solo un instante. |
| Vacas deformes (patas, cabezas, fusiones, deslizamiento) | Pocas vacas, a media distancia, detrás de la cerca, sin cruzar el camino y con movimiento lento. | Rechazar. Tras 3 fallos, alejar las vacas o dejar menos. |
| Saltos de luz o de color entre tramos | Bloque de estilo idéntico, enlace con el fotograma exacto y LUT única. | Unión con fundido de 0,2 s. Si persiste, regenerar el tramo siguiente. |
| Parpadeo, follaje que hierve, bordes que se deforman | Prompt *stable detail*, movimiento lento, nada de vapor ni humo. | Medir con QA (sección 8). Rechazar si se ve a velocidad normal. |
| La cadena pierde calidad (cada enlace se degrada) | Enlaces en PNG, elegir el fotograma más nítido, salida pro o 4K, y en los tramos 4 y 5 un fotograma final fijo (K4, K5). | Si el tramo 3 llega a la lechería con otra fachada: crear **K3 opcional** (edición de K4 con las puertas cerradas, vista a unos 10 m) y usarlo como `last_image_url` del tramo 3. |
| Transformación brusca (*morph*) entre inicio y final | Que K4 y K5 sean alcanzables caminando 9–10 s (de 8 a 10 m). | Acercar el inicio o alargar el clip. |
| Arranque lento al inicio de cada clip | *"already moving… same slow, steady pace"* en el prompt. | Recortar los primeros 3 a 6 fotogramas del clip siguiente y volver a medir el SSIM del enlace. |
| Portón o puertas físicamente imposibles | Bisagras visibles y *"swings… on its hinges"*. | Usar el plan B (portón entreabierto). |
| Productos falsos en la mesa | Quesos sin etiqueta, centro vacío y producto real superpuesto por la web. | Rechazar si aparecen marcas, precios o empaques con texto. |
| Dependencia en cadena | Aprobar cada tramo **antes** de generar el siguiente. | Rechazar el tramo N obliga a rehacer del N+1 al 5 (salvo si los anclan K4 o K5). |
| Pérdida de salidas | Higgsfield guarda los resultados al menos 7 días. | Descargar y registrar en el manifiesto el mismo día. |

## 7. Datos que NO se afirman hasta que el usuario los confirme

| Dato sin confirmar | No poner en prompt ni en pantalla | Redacción neutral mientras tanto |
|---|---|---|
| Raza de las vacas | "Jersey", "Holstein", "Brown Swiss"… | `dairy cows` (el pelaje lo hereda la imagen de partida) |
| Altitud de 1.220 m | "at 1,220 m", "high-altitude cloud forest" | `green hills with low mountain mist` |
| Nombre "Finca Doña Martha" | Letreros, rótulos, texto en portón o puerta | `plain unmarked wooden gate/doors` |
| Año 1980 | "since 1980", fechas talladas, "1980s" | `weathered wood` |
| Métodos (hilado a mano, ahumado en leña, leche cruda o pasteurizada, ordeño) | Vapor, humo de leña, manos estirando cuajada, ordeño | `a stainless steel vat with fresh white curd` (genérico, al fondo) |
| Volcán o lugar concreto | "Turrialba Volcano" como vista real | `volcanic mountain ridges in the distance` |

Los textos de los tramos en `scripts/build-frames.mjs` ya son neutrales; no hay que cambiarlos.

## 8. Lista de verificación por clip (antes de convertirlo en fotogramas)

- [ ] **Técnica:** al menos 1920×1080, fps constante, duración la pedida, sin marca de agua, sin audio necesario (comando del paso 1 de la sección 5).
- [ ] **Enlace:** el SSIM entre el PNG de enlace y el primer fotograma del clip nuevo es de 0,90 o más. El umbral es un **supuesto**; hay que calibrarlo con el primer par aprobado.
  `ffmpeg -y -i tramo2.mp4 -frames:v 1 inicio_2.png` y luego `ffmpeg -i enlace_1-2.png -i inicio_2.png -lavfi ssim -f null -`
- [ ] **Parpadeo:** el salto de luminancia media entre fotogramas no supera 3 (en escala de 0 a 255) sin una causa visible. El umbral también es un **supuesto**.
  `ffmpeg -i tramo2.mp4 -vf "signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=yavg.txt" -f null -` y luego
  `node -e "const v=require('fs').readFileSync('yavg.txt','utf8').match(/YAVG=([\d.]+)/g).map(s=>+s.slice(5));let m=0;for(let i=1;i<v.length;i++)m=Math.max(m,Math.abs(v[i]-v[i-1]));console.log('max dYAVG',m.toFixed(2))"`
- [ ] **Continuidad:** misma dirección de luz, misma temperatura de color y misma neblina. Altura constante, sin giros, velocidad pareja con el tramo anterior, sin cortes.
- [ ] **Contenido:** sin personas ni manos; sin texto, logos ni números legibles (portón, puerta, tarros, aretes, quesos). Vacas con la anatomía correcta y sin deslizarse. Portón y puertas que giran sobre la bisagra.
- [ ] **Móvil:** `preview_9x16.mp4` conserva el sujeto del tramo y no se ve blando a 720×1280.
- [ ] **Enlace siguiente:** último fotograma nítido o recortado según el paso 3.
- [ ] **Hechos:** nada de lo que aparece afirma datos de la sección 7.
- [ ] **Manifiesto:** fila completa (sección 11). Lo aprueban dirección creativa y QA.

## 9. Estimación de generaciones

Los intentos por tramo son un **supuesto** según la dificultad; no hay datos medidos.

| Pieza | Mínimo | Esperado | Máximo | Motivo |
|---|---|---|---|---|
| K0 y K5 (imagen) | 2 | 5 | 8 | Ediciones con restricciones de texto y luz |
| T1 portón (9 s) | 1 | 4 | 6 | Apertura física y riesgo de texto |
| T2 camino (11 s) | 1 | 2 | 4 | Avance simple |
| T3 potrero (11 s) | 1 | 4 | 6 | Anatomía de las vacas |
| T4 puerta (9 s) | 1 | 3 | 5 | Apertura y llegar al fotograma K4 |
| T5 lechería (10 s) | 1 | 3 | 5 | Parada final y llegar a K5 |
| **Total video 16:9** | **5** | **16 (≈160 s)** | **26** | |

- Los borradores opcionales en Kling 3.0 std o turbo para validar prompts suman entre 5 y 10 generaciones baratas. El borrador no se reutiliza: el clip definitivo se genera en pro y su movimiento será otro.
- Hacer el 9:16 aparte duplica aproximadamente el total.
- **Costo: no encontré un precio oficial por crédito.** Según la documentación oficial, el costo depende del modelo y de los parámetros. Los estados `failed` y `nsfw` no se cobran, y una cancelación antes de procesar se reembolsa. Hay que consultar en la consola o el playground de Higgsfield el costo de *Kling 3.0 Pro I2V, 10 s, sound off* y multiplicarlo por 16 (esperado) y por 26 (máximo). Hay cifras de terceros, pero se contradicen y no las usé. **No se gastan créditos sin la aprobación del usuario.**

## 10. Higgsfield: API real frente a `lib/higgsfield.ts`

Consultado el 2026-10-18 en docs.higgsfield.ai. No probé la API porque no hay clave en el entorno.

| Aspecto | `lib/higgsfield.ts` | Documentación oficial |
|---|---|---|
| URL base y ruta | `https://api.higgsfield.ai/v1` + `/generations/video` | `https://api.higgsfield.ai` + una ruta por modelo, p. ej. `/kling-video/v3.0/pro/image-to-video`. No existe `/v1/generations/video`. |
| Autenticación | `Authorization: Bearer <HIGGSFIELD_API_KEY>` | `Authorization: Key <KEY_ID>:<KEY_SECRET>` (`HF_API_KEY_ID`, `HF_API_KEY_SECRET`). `.env.example` cita `open.higgsfield.ai`, que no aparece en la documentación. |
| Modelos | `soul-cinema`, `higgsfield-dop`, `kling-1.5`, `minimax-video` | SOUL Cinema es un modelo **de imagen** (`/higgsfield-ai/soul/cinema`). DoP y Kling 1.5 no están en el catálogo actual. Hay Kling 2.5 Turbo, 2.6, 3.0, O3 y Omni, MiniMax Hailuo 2.3 (`/minimax/hailuo-2.3/standard/image-to-video`), Cinema Studio 4.0, Wan, Seedance, entre otros. |
| Duración | `5 \| 10` | Kling 3.0 y O3 admiten enteros de 3 a 15 s; Cinema Studio 4.0, de 4 a 30 s. |
| Cámara | `camera: { motion: 'dolly_in', speed }` | Kling no tiene parámetro de cámara (se describe en el prompt). Cinema Studio 4.0 usa `camera_movement` con presets con guion (`dolly-in`, `pov`…). No existe `speed`. |
| Fotograma final | No existe | Kling 3.0 usa `last_image_url`; O3 usa `first_frame_url` y `last_frame_url`. |
| `aspect_ratio` | Lo envía siempre | No está en el esquema de Kling 3.0 Pro I2V (**supuesto:** sigue la proporción de la imagen; hay que verificarlo). Sí está en O3 y en Cinema Studio. |
| `negative_prompt` | Lo envía siempre | En la especificación OpenAPI solo aparece en los endpoints de Kling 2.5 Turbo. En Kling 3.0 y O3 no está documentado. |
| Audio | No lo controla | Kling 3.0 Pro tiene `sound: "on"` por defecto; hay que mandar `"off"`. |
| Respuesta | `{ id, status: queued\|processing\|completed\|failed, videoUrl }` | `{ status, request_id, status_url, cancel_url }`. Estados: `queued`, `in_progress`, `completed`, `failed`, `nsfw`, `canceled`. El video llega en `video.url`. |
| Consulta de estado | `GET /v1/generations/video/{id}` | `GET /requests/{request_id}/status` (conviene usar `status_url`). |
| Imágenes de entrada | Asume una URL | URL HTTPS pública, o `POST /files/generate-upload-url` seguido de un PUT. |
| Otros | — | Cabecera opcional `Idempotency-Key` para reintentos seguros. Los resultados se guardan al menos 7 días. |

Ejemplo del cuerpo para el tramo 4 (`POST https://api.higgsfield.ai/kling-video/v3.0/pro/image-to-video`):

```json
{ "image_url": "https://<url-publica>/enlace_3-4.png", "last_image_url": "https://<url-publica>/K4.png", "prompt": "<prompt del tramo 4 + bloque exterior>", "duration": 9, "sound": "off", "cfg_scale": 0.5 }
```

**Alternativa para máxima resolución:** `POST /kling-video/o3/first-last-frame` con `first_frame_url`, `last_frame_url`, `duration`, `aspect_ratio: "16:9"`, `mode: "pro" | "4k"` y `sound: "off"`.
**No recomendado para este plano:** Cinema Studio 4.0, porque su API llega como máximo a 720p y las imágenes entran como referencias (`image_urls`), no como fotograma inicial fijo.

## 11. Manifiesto de entrega (una fila por clip aprobado)

| Tramo | Archivo | Modelo y endpoint | Inicio / final | Duración | Parámetros | Versión del prompt | request_id | Fecha | Créditos | QA (sección 8) | Aprobó |
|---|---|---|---|---|---|---|---|---|---|---|---|

Los clips originales y los PNG de enlace se guardan **fuera de `public/`**, porque no se publican. A la web solo llega la salida de `build-frames.mjs`. **Derechos:** K0, K4 y K5 derivan de imágenes generadas con Google AI. Los términos de uso comercial de Higgsfield están **pendientes de verificar**.

## 12. Etiquetado en la página

- **Aviso visible** (pequeño, fijo en una esquina del recorrido): **"Recreación visual hecha con IA"**.
- **Texto ampliado** (al final del recorrido o como `aria-describedby`): *"Este recorrido es una recreación visual generada con inteligencia artificial. Representa el camino de la finca a la lechería; no es una grabación del lugar."*
- Propuesta para web-engineer: cambiar el `notice` del manifiesto (hoy "Recreación visual") por "Recreación visual hecha con IA".
- Si el nombre de la finca se confirma, se muestra como texto de la web, no dentro de la imagen.
- Las fotos `public/*.jpg` que usan otros componentes también son de IA y hoy no llevan aviso. Lo decide dirección creativa.

## 13. Decisiones pendientes (usuario)

1. Aprobar el presupuesto de créditos (sección 9) después de consultar el costo en la consola.
2. Confirmar o descartar los datos de la sección 7.
3. Usar la web de Higgsfield o la API (para la API, `lib/higgsfield.ts` hay que reescribirlo; corresponde a web-engineer).
4. Aceptar o no que el portón y la puerta se abran solos.
5. Decidir la estrategia móvil: recorte (recomendado) o cadena 9:16 aparte.
6. Reemplazar `hero_finca.jpg` (texto alucinado y paisaje alpino).

**Criterio de aceptación de la entrega:** los 5 clips pasan la sección 8. El master se ve de principio a fin sin cortes, saltos ni ghosting. `build-frames.mjs` genera los fotogramas desktop y mobile sin errores, y dirección creativa y QA dan su visto bueno.

### Fuentes (consultadas el 2026-10-18)
- https://docs.higgsfield.ai/docs/authentication.md · /docs/concepts/requests.md · /docs/concepts/billing-and-retention.md · /docs/concepts/file-uploads.md
- https://docs.higgsfield.ai/docs/models/video-generation.md · /docs/models/kling-3.md · /docs/models/kling-3/pro-image-to-video.md · /docs/models/kling-o3/first-last-frame.md · /docs/models/cinema-studio-4/generate.md · /docs/models/soul-cinema.md · /docs/openapi.json
