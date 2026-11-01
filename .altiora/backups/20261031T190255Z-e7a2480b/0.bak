# Un core, rutas verificables

La preferencia breve en las instrucciones del cliente pide evaluar cada mensaje. El cuerpo de esta skill se carga bajo demanda si la selección necesita ayuda; releerlo por turno aumentaría contexto sin aportar evidencia.

| Cliente local | Skill de usuario | Instrucción persistente |
|---|---|---|
| Codex | `~/.codex/skills/altiora-bibliotecario/SKILL.md` en esta instalación; verificar listado del cliente | `~/.codex/AGENTS.md` |
| Claude Code | `~/.claude/skills/altiora-bibliotecario/SKILL.md` | `~/.claude/CLAUDE.md` |
| Gemini CLI | `~/.gemini/skills/altiora-bibliotecario/SKILL.md` | `~/.gemini/GEMINI.md` |
| Antigravity | Core portable desde el repo, sin copiar toda la biblioteca | AGENTS.md y GEMINI.md del workspace, documentados en [Rules](https://antigravity.google/docs/rules); comprobar descubrimiento real |

En un repo Altiora guardar una sola copia portable en `skills/altiora-bibliotecario/`. Desde AGENTS.md, CLAUDE.md y GEMINI.md enlazarla con el mismo bloque de preferencia. No copiar toda la biblioteca, no añadir agentes vacíos ni cambiar reglas de permisos. Si el cliente requiere un directorio nativo, publicar o vincular solo esta skill según su documentación y permisos.

Bibliotecas personales pueden diferir por cliente. El índice local reúne definiciones encontradas y conserva duplicados por ruta; **el listado del runtime vigente decide qué puede invocarse**. Un archivo Markdown accesible se puede estudiar como instrucciones, pero no equivale a una herramienta o agente conectado. No versionar índices con rutas personales en repositorios públicos.

Buscador estándar Python 3, sin dependencias externas:

```text
python scripts/library.py build --root RUTA_SKILLS --root OTRA_RUTA --output references/catalog.local.json
python scripts/library.py find --catalog references/catalog.local.json "seguridad MCP" --limit 5
python scripts/library.py check --catalog references/catalog.local.json
```

`build` lee únicamente frontmatter de SKILL.md y de Markdown situado directamente en carpetas `agents`, además de metadatos de agentes TOML; no ejecuta contenidos, importa código ni sigue enlaces de directorio. `find` devuelve candidatos con ruta; abrir la skill pertinente antes de aplicarla. El índice es snapshot; no sustituye el descubrimiento nativo ni recomienda un modelo por precio supuesto.

Fuentes oficiales consultadas el 30/10/2026: [Claude Code skills](https://code.claude.com/docs/en/skills), [Gemini CLI skills](https://geminicli.com/docs/cli/creating-skills/), [Codex skills](https://learn.chatgpt.com/docs/build-skills). Las rutas disponibles pueden depender de versión y despliegue. No se probó un chat real en Claude, Gemini o Antigravity en esta entrega.
