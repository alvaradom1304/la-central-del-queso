# Herramientas: elegir por problema

Catálogo primario: [revisiones y fuentes completas](repositories.json). Fecha: 2026-10-31. Los 14 repositorios son referencias, ninguno se instaló ni se midió perceptualmente. El script PCM propio no depende de ellos.

## Base y candidatos

| Repositorio / evidencia de licencia | Papel | Código | Decisión |
|---|---|---|---|
| [FFmpeg/FFmpeg](https://github.com/FFmpeg/FFmpeg/blob/11ef8d60d670b6908185a4780ad1a33b77783b0f/LICENSE.md) | measure-export | LGPL-2.1-or-later; optional GPL/nonfree build components change terms | evaluate |
| [audacity/audacity](https://github.com/audacity/audacity/blob/f6be9d7522fc01f59e8461f38ca3f8fcd35fd043/LICENSE.txt) | waveform-editing | GPL-3.0 overall; per-file GPL-2.0-or-later and third-party exceptions; docs CC-BY-3.0 | evaluate |
| [librosa/librosa](https://github.com/librosa/librosa/blob/4ffed287f9044654cc4a1a7393f895cd716a0a5d/LICENSE.md) | analysis | ISC | evaluate |
| [csteinmetz1/pyloudnorm](https://github.com/csteinmetz1/pyloudnorm/blob/b8d67bfd3ce5deef872f688fcfa491a0ca69fddd/LICENSE) | loudness | MIT | evaluate |
| [spotify/pedalboard](https://github.com/spotify/pedalboard/blob/05e8f0b3c4851e77485d7e842dc0355b44106471/LICENSE) | dsp-mixing | GPL-3.0 | evaluate |
| [bastibe/python-soundfile](https://github.com/bastibe/python-soundfile/blob/e8293394e6b712240f06aea5d074956481abf33e/LICENSE) | audio-io | BSD-3-Clause wrapper; libsndfile and bundled libraries have separate terms | evaluate |
| [xiph/rnnoise](https://github.com/xiph/rnnoise/blob/70f1d256acd4b34a572f999a05c87bf00b67730d/COPYING) | speech-denoise | BSD-3-Clause code | evaluate |
| [Rikorose/DeepFilterNet](https://github.com/Rikorose/DeepFilterNet/blob/d375b2d8309e0935d165700c91da9de862a99c31/LICENSE) | speech-restoration | MIT OR Apache-2.0 | evaluate |
| [ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp/blob/482279b8a18855ba741d7b88c30fcb3874691f59/LICENSE) | transcription | MIT code | evaluate |
| [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox/blob/5de7a54aa4e5e2baadb0182dde554908b48b85c2/LICENSE) | voice-generation | MIT code | evaluate |
| [Stability-AI/stable-audio-tools](https://github.com/Stability-AI/stable-audio-tools/blob/3241adba4fc2a85cf5b29d9eb68d42f40a28e820/LICENSE) | sound-generation | MIT code | hold |
| [facebookresearch/audiocraft](https://github.com/facebookresearch/audiocraft/blob/896ec7c47f5e5d1e5aa1e4b260c4405328bf009d/LICENSE) | music-generation | MIT code | hold |
| [supercollider/supercollider](https://github.com/supercollider/supercollider/blob/a1eab9a0c05310eb4b32290149c40d31d88d440b/COPYING) | synthesis | GPL-3.0 | evaluate |
| [juce-framework/JUCE](https://github.com/juce-framework/JUCE/blob/454fe891acc8204f99f4ef1e3a28c84b1a4da145/LICENSE.md) | plugin-engineering | AGPL-3.0 OR commercial JUCE 9 terms | reference_only |

## Selección concreta

- Medición/export: reutilizar FFmpeg autorizado si existe; comprobar versión, filtros y build antes de usar ebur128/loudnorm. Para validación normativa, probar el medidor con señales oficiales y registrar sus limitaciones. pyloudnorm es un candidato Python, no certificación automática de BS.1770-5.
- Edición/mezcla: un DAW/editor existente primero. Audacity puede servir para edición; Pedalboard permite cadenas programáticas cuando sus plugins y licencias estén controlados. SoundFile/librosa añaden I/O y análisis si hay una necesidad que el helper no cubre. La licencia de una herramienta no decide por sí sola los derechos de su salida.
- Voz deteriorada: RNNoise o DeepFilterNet solo después de una muestra A/B con conversación, respiración y ruido representativos. DeepFilterNet tiene última actividad observada en 2024; no interpretar el README multiplataforma como compatibilidad probada con Python/Torch actuales.
- Voz generada: Chatterbox es candidato, con voz autorizada, guion revisado, modelo y dependencias verificados y marcas de procedencia conservadas. La [tarjeta oficial](https://huggingface.co/ResembleAI/chatterbox) muestra MIT; comprobar la variante exacta, no extender esa etiqueta a todos los modelos ni outputs. Whisper.cpp transcribe; no mide calidad de voz.
- Música/SFX generativos: AudioCraft queda en HOLD comercial por [licencia de pesos](https://github.com/facebookresearch/audiocraft/blob/896ec7c47f5e5d1e5aa1e4b260c4405328bf009d/LICENSE_weights). Stable Audio Tools tiene código MIT, pero los modelos usan términos separados: [Stable Audio Open 1.0](https://huggingface.co/stabilityai/stable-audio-open-1.0) requiere revisar/aceptar condiciones. El pyproject fijado exige Python >=3.10,<3.11; no instalarlo dentro del entorno del medidor.
- Síntesis/ingeniería: SuperCollider solo si hace falta síntesis original; no iniciar servidor de audio ni capturar micrófono por abrir la skill. JUCE es una referencia para construir productos DSP/plugins, no un requisito de producción diaria. Sus módulos tienen doble licencia AGPL/comercial.

## Compatibilidad y actualización

El catálogo fija commits completos; latest_release es el tag reportado por la API de GitHub, no necesariamente la versión del paquete. Chatterbox ilustra la diferencia: release v0.1.2 frente a pyproject 0.1.7 en la revisión observada. No usar esas versiones como conjunto compatible ni sustituir el entorno que ya funciona.

Antes de incorporar un candidato: inspeccionar licencia de la parte usada, dependencias/build/model card, plataforma/hardware, una prueba mínima con fuente controlada y un fallback. No hay descargas de modelos, plugins, servicios, costes ni archivos de audio ajenos autorizados por este catálogo.

Fuentes de registro por cliente: [Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Gemini CLI](https://geminicli.com/docs/core/subagents/), [Antigravity](https://antigravity.google/docs/skills?app=antigravity-ide). Los adaptadores nativos se generan desde team/agents.json y team/roles/audio-specialist.md; se descubren al abrir/refrescar el cliente según su versión. Un archivo disponible no demuestra ejecución de ese agente ni acceso al DAW.
