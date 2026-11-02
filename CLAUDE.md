# Altiora Enterprise OS — Directivas de Eficiencia y Routing para Claude en Orca

Consulta siempre [AGENTS.md](file:///c:/Users/Usuario/OneDrive/Desktop/altiora/AGENTS.md) para el protocolo maestro de misión y la matriz de modelos y razonamiento.

## Reglas de Ejecución:
1. **Graphify Autónomo y Silencioso:**
   - Usa la herramienta MCP `altiora-graphify` automáticamente en segundo plano antes de realizar búsquedas o leer archivos de código.
   - El usuario NUNCA debe tener que escribir comandos ni pedirte que uses Graphify. Hazlo siempre por iniciativa propia de forma transparente.
   - Si el MCP no está disponible, usa el CLI con ruta explícita: `C:/Users/Usuario/.altiora-tools/graphify/Scripts/graphify.exe query "<pregunta>" --graph C:/Users/Usuario/.altiora-tools/graphs/altiora/graphify-out/graph.json` (también `explain "<concepto>"` y `path "<A>" "<B>"`).
   - Lee archivos fuente solo en las líneas que el grafo ya ubicó. Incluye esta regla en cada prompt de subagente que explore código.
   - Lee `GRAPH_REPORT.md` solo para revisión amplia de arquitectura o si query/path/explain no alcanzan.
   - Archivos de `graphify-out/` modificados son esperados tras hooks o updates; no son motivo para omitir Graphify. Un diff grande de `graph.json` en un PR es normal.
   - Tras modificar código: `graphify update .` (solo AST, sin coste de API), con `GRAPHIFY_BACKEND=none`. Nunca ejecutes `graphify install` ni `graphify claude install`.
2. **Selección de Esfuerzo según la Tarea:**
   - Para redacción, copys, documentación y ajustes de CSS: opera con esfuerzo mínimo (conciso, sin sobre-análisis).
   - Para lógica de componentes y flujos de ventas: esfuerzo balanceado (`Medium`).
   - Solo para decisiones de arquitectura profunda o shaders complejos: esfuerzo alto (`High`).
3. **Ahorro de Tokens:**
   - Cero preámbulos.
   - Respeta [.claudeignore](file:///c:/Users/Usuario/OneDrive/Desktop/altiora/.claudeignore). Nunca leas modelos 3D (`.glb`), videos (`.mp4`), texturas ni worktrees duplicados.
   - Mantén los servidores MCP pesados (`chrome-devtools`, `playwright`) apagados salvo requerimiento explícito.
4. **Preservación:**
   - Mantén la integridad de los archivos del cliente y de la empresa.
