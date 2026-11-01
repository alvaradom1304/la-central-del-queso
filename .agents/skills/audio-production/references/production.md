# Criterio de producción sonora

## Identidad de la medición

El helper `scripts/audio_qa.py` incluye `source.sha256` y `source.size_bytes` del WAV completo, sin guardar rutas en el informe ni escribir en el audio. Conservar ese informe junto al archivo medido y usar ese hash para vincular el sidecar del final. Repetir la medición y las revisiones afectadas si cambia el WAV. El hash no autentica al productor, la extracción desde el MP4, la escucha ni los derechos; el agregado sigue exigiendo atestaciones y revisiones. Los informes antiguos sin identidad medida deben declararse como tales.

Mantener la fuente estable y controlada por su propietario. La lectura se limita en tamaño/duración y compara tamaño/fechas para rechazar ediciones comunes; no es un snapshot atómico frente a escritores concurrentes hostiles.

## Definir antes de mover controles

Relacionar cada decisión con atención, emoción, comprensión o continuidad. Para una marca: escoger un vocabulario tímbrico, un motivo reconocible y reglas de variación; no confundir identidad sonora con añadir un jingle a todo. Pedir referencias de intención y comparar rasgos (ritmo, densidad, espacio, textura), sin copiar melodías o identidades ajenas.

Un cue sheet útil anota tiempo de entrada/salida, función narrativa, fuente, ganancia/automatización, bus y estado de derechos de cada elemento. Coordinar frames y tiempo con montaje; no asumir 30 fps si el proyecto usa otra tasa. En una pieza de 15 s, diseñar el arco y los silencios: no rellenar cada corte con un impacto.

## Diseñar por material

| Trabajo | Decisión | Revisión que puede rechazarlo |
|---|---|---|
| Locución, diálogo o podcast | Montaje por sentido y respiración; clip gain antes de dinámica; editar clicks con fades; de-ess y EQ solo donde haya problema | Consonantes recortadas, respiración artificial, eses agresivas, timbre hueco o lectura que cambia el significado |
| Música | Tempo y armonía al servicio del ritmo narrativo; espacio espectral para voz; puntos de edición y colas musicales | Tema que compite con CTA/diálogo, loops perceptibles, transiciones armónicas bruscas o cambios de nivel engañosos |
| Foley/SFX/ambiente | Capas con función: cuerpo, transitorio, textura y espacio; perspectiva y reverberación coherentes con imagen | Overdesign, impactos sin causa, distancia inconsistente, reverberación que borra detalle |
| Restauración | Distinguir hum, ruido estacionario, reverberación, clicks, clipping y falta de ancho de banda; tratar cada causa | Un denoiser de voz usado sobre música; textura acuosa; pedir recuperar información perdida con certeza |
| Web/juego | Loops sin clicks, estados y variaciones limitadas; buses y concurrencia; presupuesto de memoria/latencia y formatos probados en dispositivo | Autoplay, audio indispensable para entender contenido, escalada de volumen con interacciones, loops acumulados |

Separar componentes diegéticos y música incidental. Mantener algunas referencias secas y ruido ambiente natural cuando sostengan la escena. Hacer A/B con loudness equivalente para que “más fuerte” no gane por defecto.

## Mezcla y master

Corregir edición, balance y enmascaramiento antes de buscar más plugins. Usar automatización para frases importantes; sidechain cuando aporte continuidad, evitando bombeo. Eliminar hum solo si está presente; un high-pass puede adelgazar voces y objetos. No aplicar compresión multibanda, widening o excitación por costumbre.

Conservar margen en etapas intermedias, evitar acumulación de ganancias y revisar entradas/salidas de plugins. No confundir audio interno flotante por encima de 0 dBFS con seguridad en el DAC o export entero. Medir después del limitador y volver a medir la versión codificada: los códecs pueden producir overs intersample.

Comprobar imagen estéreo, correlación y suma mono, con énfasis en voz y elementos esenciales. Una correlación baja puede ser buscada en ambiente; la desaparición del mensaje en mono exige corregir. Revisar sincronía, clicks, fades, cortes, sibilancia, distorsión, ruido útil/molesto y colas de efectos.

## Especificación de entrega

La especificación del distribuidor/cliente manda. **−14 LUFS no es una meta universal**, ni un criterio automático de calidad para anuncios. Si no hay destino confirmado, entregar una propuesta de perfil y mantenerla explícita; no afirmar cumplimiento de una plataforma por una cifra memorizada.

Ejemplo condicionado: si la entrega exige **EBU R128-2023**, la referencia es −23 LUFS de programa y máximo −1 dBTP en producción lineal, con tolerancias según el documento. Verificar el perfil de distribución concreto. EBU desaconseja usar LRA para programas menores de un minuto: un spot de 15 s no se rechaza por un LRA “incorrecto”. Fuentes: [EBU R128](https://tech.ebu.ch/docs/r/r128.pdf), [ITU-R BS.1770-5](https://www.itu.int/rec/R-REC-BS.1770-5-202311-I/). Un medidor que declara BS.1770-4 no queda certificado para la revisión 5 por compartir unidades.

Para video, 48 kHz y WAV PCM de 24 bits pueden ser una propuesta de trabajo, no un requisito para todos los clientes. No cambiar la tasa de un proyecto musical sin motivo. Si se reduce profundidad de bits, definir dither en la etapa adecuada, no repetirlo en cada export. El helper propio acepta PCM entero; WAV float y multicanal necesitan otro lector.

Entregar stems coherentes (voz, música, efectos/ambiente, mix-minus cuando se pida), mismo origen y duración, con colas según contrato. Describir si incluyen procesamiento del bus master; no prometer que la suma reconstruye una mezcla con dinámica no lineal sin hacer null test. Identificar versión, tasa, bits, canales y revisiones.

## QA y escucha

Escuchar principio/final y transiciones críticas, y el programa completo antes de aprobar. Probar auriculares, altavoces y un dispositivo representativo de consumo si están disponibles; registrar cuáles realmente se usaron. La medición no permite afirmar que se escuchó un dispositivo ausente. Evitar recomendaciones de volumen elevado sin referencia/calibración.

La checklist de cierre depende del encargo: claridad y emoción; balance/espacio; ausencia de artefactos introducidos; traducción mono; sincronía; especificación técnica; editabilidad y derechos. Un fallo material en cualquiera de los elementos requeridos bloquea la publicación. Sin audio entregado por el usuario, solo se valida el procedimiento y los tests sintéticos del medidor.
