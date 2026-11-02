# Altiora Enterprise OS — Directivas de Superpoderes y Ejecución para Antigravity

Consulta siempre [AGENTS.md](file:///c:/Users/Usuario/OneDrive/Desktop/altiora/AGENTS.md) para el protocolo maestro de misión, enrutamiento y matriz de modelos.

---

## ⚡ Superpoderes y Principios Operativos de Antigravity

1. **Graphify Autónomo y Silencioso (Zero-Friction Knowledge Retrieval):**
   - Antes de realizar búsquedas a ciegas (`grep`, `find`, lectura extensiva), consultar autónomamente el grafo de dependencias y AST vía CLI (`graphify query` / `graphify explain`) o el MCP `altiora-graphify`.
   - Ruta del grafo: `C:/Users/Usuario/.altiora-tools/graphs/altiora/graphify-out/graph.json`.
   - `GRAPHIFY_BACKEND=none` mandatorio; nunca ejecutar instaladores de Graphify.

2. **Resolución Directa y Máxima Agencia:**
   - Resolver problemas técnicos de forma proactiva y autónoma.
   - Si una tarea está delimitada y aprobada, ejecutarla de principio a fin sin solicitar confirmaciones triviales.
   - Producir código limpio, modular y completamente funcional a la primera.

3. **Verificación Continua y Evidencia Inmutable:**
   - Ninguna entrega se da por terminada sin evidencia ejecutable.
   - Validar sintaxis, TypeScript, estructura y ejecución de pruebas de manera proporcional antes de declarar finalizado el hito.
   - Separar hechos comprobados de inferencias; marcar lo no corrido como `NOT_RUN`.

4. **Matriz de Razonamiento y Eficiencia de Consumo:**
   - **Tier 1 (Low / None):** Copies, textos, formatos JSON/CSV, ajustes visuales directos.
   - **Tier 2 (Medium):** Componentes React/Next.js, endpoints de API, hooks, lógica de negocio.
   - **Tier 3 (High):** Experiencias 3D WebGL (Three.js/R3F), shaders, arquitectura de estado, auditorías OWASP.

5. **Higiene Espartana de Tokens:**
   - Respetar rigurosamente [.claudeignore](file:///c:/Users/Usuario/OneDrive/Desktop/altiora/.claudeignore).
   - Prohibido volcar o inspeccionar recursivamente archivos binarios (`.glb`, `.mp4`, texturas) o árboles clonados (`.claude/worktrees/`).
   - Usar lecturas delimitadas por rango de líneas (`StartLine`, `EndLine`).
   - Mantener conectores pesados apagados por defecto salvo solicitud explícita.

6. **Orquestación Multi-Agente & Orca Ecosystem:**
   - Invocar subagentes especializados (`altiora-engineering`, `immersive-motion-engineer`, `altiora-review`, `immersive-director`) cuando la tarea se beneficie del paralelismo o revisión cruzada.
   - Coordinar con Codex y Claude Code a través de `altiora-shared` y el protocolo canónico unificado.
