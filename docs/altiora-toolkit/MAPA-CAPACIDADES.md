# Mapa de capacidades de Altiora en Claude (routing canónico)

Vigente desde el 31/10/2026. Cubre lo que Claude Code descubre en `.claude/skills`, `.claude/agents`, `~/.claude/skills` y `~/.claude/agents`. Codex y Antigravity usan `.agents/skills` y `.codex/agents` (ver `ROUTING.md`). Las tablas eligen; las skills ejecutan. Un trabajo pequeño se resuelve directamente.

## 1. Un coordinador por tipo de encargo

Los coordinadores son **skills** que se ejecutan en la sesión principal, porque en Claude Code un subagente no puede lanzar otros subagentes.

| Encargo | Coordinador | Cuándo |
|---|---|---|
| Conseguir clientes: segmento, entrevistas, calificación, propuesta, objeciones | `altiora-commercial-director` | Todo lo previo a la firma y al anticipo |
| Entregar un proyecto contratado (o el piloto como si lo fuera) | `altiora-project-director` | Del arranque al cierre y al mantenimiento |
| Caso empresarial abstracto o cliente sin encargo concreto | `company-builder-orchestrator` | Clasificar en A–H y elegir 2–3 skills |
| Trabajo interno de varias especialidades (herramientas, I+D) | `altiora-agent-orchestrator` | Coordinar subagentes con ownership |
| Web experimental (cursor 3D, tipografía cinética, WebGL tipo Buttermax) | agente `immersive-director` + skill `immersive-interaction-lab` | Solo efectos experimentales |
| Enrutar una petición ambigua o resolver solapamientos | `altiora-bibliotecario` | Selección con contexto mínimo |
| Continuidad, colas de voz, cierre de sesión | `altiora-interaction-guard`, `altiora-session-handoff` | Traspasos y pausas |

## 2. Especialistas (subagentes en `.claude/agents`)

| Rol | Subagente | Skills que aplica |
|---|---|---|
| Investigación con web | `altiora-os-research` | `altiora-os-research` |
| Estrategia y oferta | `altiora-os-strategy` | `altiora-os-strategy`, `business-diagnostic`, `value-proposition-design` |
| Experiencia (recorrido, estructura, copy de UI) | `altiora-experience` | `site-architecture`, `cro`, `web-design-guidelines`, `copy-editing` |
| Análisis creativo (lo que hace único al proyecto) | `altiora-creative-analyst` | `altiora-creative-analyst`, `competitor-profiling`, `consumer-psychology` |
| Dirección creativa | `altiora-os-creative` | `altiora-os-creative`, `premium-branding`, `frontend-design` |
| Ingeniería web y automatización | `altiora-engineering` | `nextjs-architecture`, `n8n-webhook-architect`, `vercel-react-best-practices`, `test-driven-development`, `vercel-react-view-transitions`, `mcp-builder` |
| Web 3D/WebGL | `altiora-os-web-3d` | `altiora-os-web-3d`, `immersive-commerce` |
| Activos 3D, imagen y vídeo | `altiora-os-media` | `altiora-os-media` |
| Audio | `audio-specialist` | `audio-production` |
| QA independiente (navegador y pruebas) | `altiora-os-qa` | `altiora-quality-review`, `web-quality-assurance`, `accessibility`, `cybersecurity-owasp`, `requesting-code-review` |
| Crecimiento y automatización posventa | `altiora-os-automation-growth` | `altiora-os-automation-growth`, `analytics`, `conversion-tracking`, `attribution`, `ai-seo`, `ab-testing`, `emails` |
| Revisión WebGL estática | `immersive-reviewer` | `immersive-interaction-lab` |

## 3. Ciclo comercial y de entrega de la oferta de US$10.000

```
problem-validation → lead-qualification (+ competitor-profiling) → cold-email (borradores)
→ mom-test-interviewing / sales-discovery
→ high-ticket-offer + unit-economics + pricing → sales-proposal + sales-enablement → copy-editing
→ sales-objection-analysis / sales-follow-up → [firma + anticipo]
→ altiora-project-director (6 semanas):
   site-architecture + brainstorming → writing-plans → subagent-driven-development / executing-plans
   (test-driven-development) → requesting-code-review → receiving-code-review
   → launch-readiness + conversion-tracking + launch → finishing-a-development-branch → customer-success
→ altiora-case-study → mantenimiento opcional (attribution, ai-seo)
```

Cada fase de la entrega tiene su plantilla y su compuerta en `docs/altiora-business/entrega/` (G1–G8, presupuesto de 75 h, lista de aceptación y manifiesto). Los coordinadores las aplican; no sustituyen la decisión humana.

Las skills de marketing leen primero `.agents/product-marketing.md`: un índice que distingue los encargos de Altiora de los de clientes y remite a `docs/altiora-business/`.

## 4. Desempates entre capacidades parecidas

| Duda | Elegir |
|---|---|
| `high-ticket-offer` u `offers` | Oferta propia de Altiora → `high-ticket-offer`; oferta de un cliente → `offers` |
| `sales-discovery` o `spin-selling` | Preparar o resumir la llamada → `sales-discovery`; técnica SPIN a fondo → `spin-selling` |
| `altiora-quality-review` o `web-quality-assurance` | Revisión de cualquier entrega → `altiora-quality-review`; QA web detallada → añadir `web-quality-assurance` |
| `verification-before-completion` | Autocontrol antes de declarar «hecho»; no sustituye QA independiente |
| `consumer-psychology` o `marketing-psychology` | Funnel/oferta con ética y ejemplos → `consumer-psychology`; modelos mentales generales → `marketing-psychology` |
| `altiora-os-automation-growth` o `n8n-webhook-architect` | Estrategia y métricas → el primero; flujo web→n8n concreto → el segundo |
| `launch` o `launch-readiness` | Anuncio y plan comercial de salida → `launch`; lista técnica de producción → `launch-readiness` |
| `copywriting` o `copy-editing` | Escribir desde cero → `copywriting`; pulir un borrador → `copy-editing` |
| `analytics`, `conversion-tracking` o `attribution` | Plan de medición → `analytics`; que cada conversión llegue y se verifique → `conversion-tracking`; qué canal vende → `attribution` |
| `executing-plans` o `subagent-driven-development` | Ejecutar el plan en la sesión → `executing-plans`; tareas independientes con subagentes → `subagent-driven-development` |
| `writing-skills` o `skill-creator` | Probar y afilar una skill con escenarios → `writing-skills`; empaquetar y evaluar formalmente → `skill-creator` |
| `meta-ads-growth` o `meta-ads-creator` | Estrategia, auditoría, medición y decisión de inversión en Meta Ads → `meta-ads-growth`; conceptos, guiones y variantes de anuncios → `meta-ads-creator`. Copias idénticas a las de `~/.codex/skills`, solo en `.claude/skills` para no duplicar nombres en Codex |
| `ai-seo` o `searchfit-seo:ai-visibility` | Optimizar contenido para buscadores con IA → `ai-seo` (disponible también en Codex); medición con el plugin SearchFit → el segundo |

## 4 ter. Librería creativa (31/10/2026)

Orden de trabajo: `altiora-creative-analyst` escribe el brief diferencial; el agente `altiora-os-creative` lo dirige; cada disciplina lo produce; la rúbrica anti-plantilla del analista revisa el resultado antes de QA.

| Disciplina | Skills | Agente |
|---|---|---|
| Marca | `premium-branding`, `copywriting`, `copy-editing`, `canvas-design` (territorios visuales) | `altiora-os-creative` |
| Web | `frontend-design`, `immersive-interaction-lab`, `vercel-react-view-transitions`, `web-design-guidelines`, `algorithmic-art` (sistemas generativos) | `altiora-experience`, `altiora-os-web-3d` |
| Anuncios y redes | `ad-creative`, `meta-ads-creator`, `meta-ads-growth`, `social` | `altiora-os-creative` |
| Imagen y vídeo | `image`, `video`, `canvas-design` | `altiora-os-media` |
| Audio e identidad sonora | `audio-production`, más la guía sonora de `altiora-creative-analyst/references/canales.md` | `audio-specialist` |

Las ~30 skills creativas de `~/.codex/skills` (`creative-direction`, `advertising-concept`, `brand-*`…) son plantillas generadas que comparten el 90 % del texto. **No se copiaron a Claude**: quedan como variantes de Codex hasta reescribirlas con oficio real.

## 4 bis. Skills importadas de GitHub el 31/10/2026

21 skills, procedentes de los mismos 4 repositorios que Codex evaluó el 18/10, con revisión fijada. Procedencia y motivo de cada una en [`skill-sources.json`](skill-sources.json). Cada carpeta conserva `LICENSE.txt` y `SOURCE.md`. Están instaladas en `.claude/skills` (Claude) y en `.agents/skills` (Codex y Antigravity). Cambios locales: descripción en español y, en 5 de ellas, una nota «Uso en Altiora» sobre envíos, servidores, commits o cuentas.

## 5. Retirados y redefinidos el 31/10/2026 (todo conservado)

Copias en `.altiora/retired/20261031-claude/`. Para restaurar, mover de vuelta a `.claude/`.

| Elemento | Cambio | Motivo | Usar en su lugar |
|---|---|---|---|
| skill `altiora-os-coordinate` | retirada | Duplicaba `altiora-agent-orchestrator` | `altiora-agent-orchestrator` y los directores |
| skill `altiora-os-qa` | retirada | Duplicaba `altiora-quality-review` | `altiora-quality-review` + `web-quality-assurance` |
| agente `altiora-os-coordinate` | retirado | Un subagente no puede delegar | Skills directoras en la sesión principal |
| agente `altiora-review` | redefinido (lo gestiona el kit) | Solo lectura: no reproduce flujos | Revisión estática rápida; aceptación con `altiora-os-qa` |
| agente `altiora-research` | redefinido (lo gestiona el kit) | Sin acceso web | Búsqueda local; investigación externa con `altiora-os-research` |

`kit-originals/` guarda, con hash verificado contra `.altiora/installation.json`, las versiones del kit de los 10 archivos gestionados que se mejoraron. El kit 1.1.0 ya incorporó estas versiones (`doctor` PASSED): los roles las declaran en su frontmatter y las mejoras de skills se registraron con `manage.py adopt`. Los originales siguen guardados para restaurarlos si hace falta.

Codex conserva sus equivalentes en `.codex/agents` y `.agents/skills`; las referencias en `docs/altiora-business/FINANZAS.md` siguen siendo válidas allí.
