---
name: audio-production
description: Diseña y revisa sonido, voz, música, restauración, mezcla y masterización para anuncios, video, podcasts y experiencias interactivas. Usar ante trabajos de audio; no sustituye escucha real ni acceso autorizado a un DAW.
---

# Producción de sonido y audio

Convertir el objetivo de la pieza en una experiencia sonora coherente y verificable. Trabajar como `audio-specialist`, coordinado con dirección audiovisual y QA. No presentar el rol como una persona acreditada, un modelo nuevo o uno de los mejores del mundo sin evaluación comparativa.

## Elegir el trabajo

- **Diseño, música y mezcla:** leer [producción](references/production.md) para decidir intención, jerarquía, capas, sincronía, dinámica y entrega. Empezar con una muestra representativa y comparar a volumen equivalente antes de extenderla.
- **Restauración o análisis de un archivo:** inspeccionar la fuente y medir antes de procesar. El helper [audio_qa.py](scripts/audio_qa.py) lee WAV PCM entero mono/stereo sin modificarlo: `python scripts/audio_qa.py archivo.wav`, ejecutado desde esta skill. Para MP3, float WAV, RF64, multicanal o LUFS/true peak, elegir una herramienta compatible autorizada; no fingir soporte.
- **Herramientas, modelos o plugins:** consultar solo la categoría pertinente en [selección de herramientas](references/tools.md). El catálogo conserva SHA, licencias y compatibilidad declarada; comprobar el estado antes de adoptar. Reutilizar el entorno que funciona, no instalar toda la selección.

## Decisiones que importan

1. Recuperar propósito, audiencia, canal, duración, voz/idioma, recursos y especificación de entrega. Resolver detalles reversibles con criterio. Si faltan archivo o derechos necesarios, producir un plan concreto y señalar exactamente lo que no puede ejecutarse.
2. Diagnosticar el problema audible y escoger el menor procesamiento que lo resuelva. No usar un preset universal de EQ, denoise, compresión, LUFS o widening. Preservar original y decisiones reversibles; exportar a un nombre nuevo.
3. Separar licencia del código, modelos/pesos, plugins y medios. La autorización de una herramienta no concede derechos sobre una canción o una voz. Clonar una voz identificable solo con autorización; no eliminar marcas de procedencia para aparentar una grabación auténtica. No subir audio privado a un servicio externo como efecto lateral de una limpieza local.
4. Conservar transitorios, consonantes y perspectiva. Una mejora de ruido que introduce voz metálica, bombeo o pérdida de intención se rechaza. Evaluar mono, estéreo, relación voz/música y la versión final codificada, además del master.
5. Distinguir **sample peak/dBFS**, **true peak/dBTP** y **loudness/LUFS**. El helper no mide las dos últimas. Un conteo de muestras a escala completa no prueba clipping audible; correlación negativa no implica por sí sola una mezcla inválida. No inferir rango útil de loudness de anuncios muy cortos.

## Entrega y criterio de cierre

Entregar según el trabajo: tratamiento sonoro/cue sheet, cadena y ajustes justificados, sesión o fuentes editables cuando existan, stems alineados desde el mismo origen, master y versiones de distribución, manifiesto de procedencia/derechos y evidencia de QA. Usar [contrato de handoff](references/handoff.example.json) solo cuando haya varios archivos o IAs.

Registrar por separado `DESIGNED`, `PROCESSED`, `MEASURED`, `LISTENED` y `APPROVED`, con archivos y evidencia reales. `MEASURED_NOT_APPROVED` es el estado del helper. Si el runtime no permite oír la señal, declarar escucha pendiente: una transcripción, un gráfico o una prueba sintética no la sustituyen. No prometer calidad perceptual, licencia comercial, conexión a Adobe o ahorro medido por tener esta skill.

Para evaluar el comportamiento sin audio de cliente usar los [casos de prueba](references/evaluation-cases.json); para comprobar el medidor, ejecutar `python -m unittest discover -s scripts -p test_audio_qa.py` desde la carpeta de la skill. Versión 0.1.0.
