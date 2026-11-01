# Un core, rutas verificables

La preferencia breve en las instrucciones del cliente pide evaluar cada mensaje. El cuerpo de esta skill se carga bajo demanda si la selección necesita ayuda; releerlo por turno aumentaría contexto sin aportar evidencia.

| Cliente local | Skill de usuario | Instrucción persistente |
|---|---|---|
| Codex | `~/.codex/skills/altiora-bibliotecario/SKILL.md` en esta instalación; verificar listado del cliente | `~/.codex/AGENTS.md` |
| Claude Code | `~/.claude/skills/altiora-bibliotecario/SKILL.md` | `~/.claude/CLAUDE.md` |
| Gemini CLI | `~/.gemini/skills/altiora-bibliotecario/SKILL.md` | `~/.gemini/GEMINI.md` |
| Antigravity | Skills/rules del workspace admitidas por su versión; usar core portable desde el repo | Instrucción del workspace; comprobar descubrimiento en el cliente |

En un repo Altiora guardar una sola copia portable en `skills/altiora-bibliotecario/`. Desde AGENTS.md, CLAUDE.md y GEMINI.md enlazarla con el mismo bloque de preferencia. No copiar toda la biblioteca, no añadir agentes vacíos ni cambiar reglas de permisos. Si el cliente requiere un directorio nativo, publicar o vincular solo esta skill según su documentación y permisos.

Bibliotecas personales pueden diferir por cliente. El índice local reúne definiciones encontradas y conserva duplicados por ruta; **el listado del runtime vigente decide qué puede invocarse**. Un archivo Markdown accesible se puede estudiar como instrucciones, pero no equivale a una herramienta o agente conectado. No versionar índices con rutas personales en repositorios públicos.

Buscador estándar Python 3, sin dependencias externas:

```text
python scripts/library.py build --root RUTA_SKILLS --root OTRA_RUTA --output references/catalog.local.json
python scripts/library.py find --catalog references/catalog.local.json "seguridad MCP" --limit 5
python scripts/library.py check --catalog references/catalog.local.json
```

`build` lee únicamente frontmatter de SKILL.md y de Markdown situado directamente en carpetas `agents`, además de metadatos de agentes TOML; no ejecuta contenidos, importa código ni sigue enlaces de directorio. `find` devuelve candidatos con ruta; abrir la skill pertinente antes de aplicarla. El índice es snapshot; no sustituye el descubrimiento nativo ni recomienda un modelo por precio supuesto.

`build` registra las raíces absolutas elegidas. `check` vuelve a leer únicamente los metadatos de esas raíces y detecta altas, bajas y cambios de nombre, descripción o tipo. Solo ejecutar este control sobre catálogos locales propios o revisados: las raíces del JSON determinan qué carpetas se consultan. No compartir índices con rutas personales en GitHub.

| Estado de `check` | Acción |
|---|---|
| `METADATA_CURRENT` (salida0) | Los metadatos coinciden en este momento; no certifica cuerpos, sesión nativa o herramientas conectadas |
| `STALE` (salida1) | Revisar `added`, `removed`, `changed` y reconstruir con las raíces previstas |
| `LEGACY_REBUILD_REQUIRED` (salida1) | El catálogo antiguo carece de raíces; reconstruir explícitamente, sin adivinarlas |
| `INVALID_CATALOG` (salida1) | Corregir o reconstruir un índice local propio; no usarlo como prueba de vigencia |
| `UNVERIFIED` (salida1) | Una fuente no está disponible, no se pudo leer o la raíz/ancestro es un enlace; resolver sin ampliar permisos por efecto lateral |

Los informes se imprimen como JSON por stdout también cuando el control no pasa. `check` es de solo lectura y no reescribe el catálogo. Un cambio solo en el cuerpo de una skill no exige reconstruir sus metadatos, pero sus instrucciones deben leerse al aplicarla. Ejecutar este control al reutilizar un índice tras cambios o al retomar una instalación; no repetirlo por mensaje. `find` conserva su búsqueda rápida sobre el snapshot y no lo refresca implícitamente. No hay garantía de atomicidad si otra aplicación modifica fuentes durante el recorrido.

Fuentes oficiales consultadas el 30/10/2026: [Claude Code skills](https://code.claude.com/docs/en/skills), [Gemini CLI skills](https://geminicli.com/docs/cli/creating-skills/), [Codex skills](https://learn.chatgpt.com/docs/build-skills). Las rutas disponibles pueden depender de versión y despliegue. No se probó un chat real en Claude, Gemini o Antigravity en esta entrega.
