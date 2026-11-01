# Altiora Enterprise OS — Instrucciones de Agente (Codex / Claude / Antigravity)

## Recuperación y briefing de Codex (ChatGPT)
**Al reincorporarse tras renovación de tokens:** Codex debe leer obligatoriamente `docs/operations/CODEX-RECOVERY-BRIEFING.md` (o la copia canónica en `altiora-unificado`). Contiene la nueva mentalidad espartana de alto rendimiento, el uso mandatorio del knowledge graph (`graphify`), y el inventario de todas las tareas completadas por Antigravity y Claude mientras estuvo inactivo (auditoría de calculadora US$10k con techo de 75 h y 25% de margen, réplica de Google Cloud Data Agent Kit, orquestación cognitiva).

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
