# Altiora Enterprise OS — Protocolo Maestro de Misión, Enrutamiento y Razonamiento

Este documento rige la operación de todas las IAs dentro del ecosistema **Orca** (Antigravity, Claude Code, Codex y subagentes). Ninguna IA debe operar fuera de estas directrices.

---

## 1. Misión de Empresa y Activos Consolidados

Altiora opera como una firma de ingeniería estratégica y experiencias digitales de alto valor. Nuestro portafolio activo incluye:

1. **La Central del Queso (Costa Rica):**
   - Experiencia inmersiva *«De la finca a tu mesa»* en 7 escenas con scrollytelling cinematográfico.
   - Motor WebGL (Three.js + R3F), audio espacial binaural procedural, catálogo interactivo y checkout directo a WhatsApp con pago por SINPE Móvil.
2. **El Tilichero CR (Costa Rica):**
   - Rebranding estratégico: De *bazar de tiliches* a **Curaduría Cyber-Street / Retro-Tech** (*"Tesoros tech que no sabías que ocupabas"*).
   - Identidad visual: Loot Box minimalista, estética Dark Mode Obsidian (`#0A0A0C`), verde neón (`#00FFA3`) y naranja reactivo (`#FF5E1E`).
   - Sistema de Captura de Clientes: Landing interactiva gamificada ([`public/boceto-el-tilichero.html`](public/boceto-el-tilichero.html)) con apertura de Loot Box 3D, sonido sintetizado retro, filtro de catálogo en tiempo real y checkout automático por WhatsApp/SINPE Móvil.
   - Motor de Adquisición: Matriz de creativos para Meta Ads en Costa Rica (Problema/Solución, Drops FOMO y Comparativa de entrega 24h vs. Amazon).
3. **Infraestructura Cognitiva & Data Agent Kit:**
   - Auditoría de calculadora corporativa US$10k (techo 75h, 25% margen).
   - Réplica de Google Cloud Data Agent Kit y biblioteca modular de 50+ skills especializadas.

---

## 2. Recuperación y Briefing de Codex (ChatGPT)

**Al reincorporarse tras renovación de tokens:** Codex debe leer obligatoriamente `docs/operations/CODEX-RECOVERY-BRIEFING.md` (o la copia canónica en `altiora-unificado`). Contiene la nueva mentalidad espartana de alto rendimiento, el uso mandatorio del knowledge graph (`graphify`), y el inventario de todas las tareas completadas por Antigravity y Claude mientras estuvo inactivo (auditoría de calculadora US$10k con techo de 75 h y 25% de margen, réplica de Google Cloud Data Agent Kit, orquestación cognitiva).

---

## 3. Matriz Dinámica de Selección de Modelo y Nivel de Razonamiento

**Regla de Oro:** *"El modelo y nivel de esfuerzo mínimos que garanticen el 100% de calidad."*  
Nunca utilices un modelo grande o razonamiento alto para tareas que un modelo ágil resuelve con precisión.

| Nivel de Tarea | Tipo de Trabajo | Modelo Asignado en Orca | Nivel de Razonamiento (Thinking) | Justificación de Consumo |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Micro / Redacción / Operación Rápida** | • Copies para Meta Ads, guiones breves, traducciones<br>• Ajustes menores de CSS / HTML, formateo JSON/CSV<br>• Respuestas a preguntas directas y documentación | **Gemini 3.8 Flash**<br>*(o Claude Haiku)* | **Low / None**<br>*(Sin sobrecosto de pensamiento)* | Ejecución inmediata sin quemar tokens en razonamiento innecesario. |
| **Tier 2: Ejecución Técnica & Web** | • Componentes React / Next.js, lógica de carritos<br>• Endpoints de API, esquemas de BD, pruebas unitarias<br>• Automatizaciones de CRM y flujos de ventas sin n8n | **Gemini 3.8 Flash**<br>*(o Claude Sonnet / Codex)* | **Medium**<br>*(Razonamiento balanceado)* | Resuelve código limpio con validación sintáctica eficiente. |
| **Tier 3: Arquitectura, 3D & Quality Gates** | • Shaders WebGL / Three.js, físicas y matemáticas<br>• Auditorías de ciberseguridad OWASP y contratos API<br>• Deliberación de estrategia financiera y unit economics | **Gemini 3.8 Pro**<br>*(o Claude Opus solo si se aprueba)* | **High**<br>*(Pensamiento profundo extendido)* | Tareas donde el coste de error es crítico para el negocio. |

---

## 4. Protocolo Espartano de Ahorro de Tokens (Mandatorio)

1. **Conectores Pesados Apagados por Defecto:**
   - Servidores MCP de navegador (`chrome-devtools`, `playwright`) deben permanecer inactivos salvo que la tarea explícitamente demande navegación web automatizada en vivo.
2. **Higiene de Archivos y `.claudeignore`:**
   - Prohibido leer recursivamente directorios de assets (`public/models/*.glb`, `public/videos/*.mp4`, `public/textures/`) o árboles duplicados (`.claude/worktrees/`).
   - Usar lecturas delimitadas por líneas (`StartLine`, `EndLine`) en lugar de volcar archivos enteros.
3. **Una Sesión por Tarea:**
   - En Orca, ejecuta `/compact` o limpia la conversación tras cerrar un hito para no arrastrar historiales inflados a consultas nuevas.
4. **Respuestas Orientadas a ROI:**
   - Concisas, estructuradas en markdown, sin rellenos ceremoniales.

---

## 5. Activación 100% Autónoma de Graphify (Knowledge Graph)

- **Ejecución Automática Mandatoria:** El usuario **NUNCA** debe tener que escribir comandos, flags ni `/graphify`. La IA debe invocar internamente `graphify query`, `graphify explain` o la herramienta MCP `altiora-graphify` en segundo plano **por iniciativa propia** antes de hacer cualquier `grep`, `glob` o lectura de código.
- **Ruta de Consulta Quirúrgica:**
  - Lee archivos fuente solo en las líneas exactas que el grafo ya ubicó.
  - Usa `graphify path "<A>" "<B>"` para mapear relaciones y `graphify explain "<concepto>"` para conceptos focalizados.
  - Si `graphify-out/wiki/index.md` existe, úsalo para navegación general en lugar de navegación de código crudo.
  - Lee `graphify-out/GRAPH_REPORT.md` únicamente para revisión amplia de arquitectura o si la consulta específica no alcanza.
- **Tolerancia a Archivos Sucios y Reconstrucción:**
  - Archivos modificados en `graphify-out/` son esperados tras hooks o actualizaciones; no son motivo para omitir Graphify.
  - Un diff grande de `graph.json` en un commit/PR es completamente normal; no debe señalarse como churn.
- **Sincronización Transparente:** Tras modificar código, la IA ejecuta internamente `graphify update .` de forma silenciosa para mantener el grafo al día (solo AST, sin coste de API, con `GRAPHIFY_BACKEND=none`). Nunca ejecutes instaladores globales de Graphify.
