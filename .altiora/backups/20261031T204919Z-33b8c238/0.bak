# Compatibilidad comprobada por documentación · 18 de octubre de 2026

| Capa | Codex | Claude Code | Antigravity |
|---|---|---|---|
| Instrucciones | AGENTS.md | CLAUDE.md | GEMINI.md; también reconoce AGENTS.md |
| Skills | .agents/skills | .claude/skills | .agents/skills |
| Hooks de proyecto | .codex/hooks.json, raíz hooks | .claude/settings.json, raíz hooks | .agents/hooks.json, raíz con nombre del hook |
| Roles | .codex/agents/*.toml | .claude/agents/*.md | roles Markdown + define_subagent si la sesión lo ofrece |
| Distribución del kit | ZIP versionado + instalador | ZIP versionado + instalador | ZIP versionado + instalador |

## Límites
Los adaptadores se generan para las convenciones documentadas en la fecha indicada. La versión instalada y las políticas de cada cliente pueden limitar o cambiar su comportamiento. El kit no cambia modelos, permisos, cuentas ni configuración global.

Codex requiere revisar y confiar los hooks locales antes de ejecutarlos. Abrir `/hooks` en la CLI y revisar exactamente los comandos generados. No usar opciones para saltarse la confianza. Los proyectos deben ser confiables; los hooks locales no se ejecutan automáticamente en todo entorno cloud.

Claude Code usa su configuración de proyecto existente. El instalador suma handlers sin sustituir permisos ni otros eventos. Las herramientas disponibles en subagentes varían por sesión. Los roles de investigación, experiencia y revisión se generan con Read, Glob y Grep; la revisión de pruebas con shell queda al coordinador si el rol no tiene esa herramienta.

Antigravity dispone de formatos propios para los hooks y herramientas para definir/invocar subagentes. El kit no presume descubrimiento de un directorio arbitrario de agentes: el coordinador debe leer el rol y registrarlo con `define_subagent` si está disponible. Para una tarea pequeña o sin delegación real se aplica el rol secuencialmente. No se generan workflows legacy; las skills cumplen esa función.

## Hooks incluidos
`SessionStart`: agrega una referencia breve al núcleo y al handoff; no lee transcripciones ni incorpora secretos. `PreToolUse`: deniega escrituras directas a nombres protegidos por `.altiora/policy.json`. En Codex/Claude usa `hookSpecificOutput.permissionDecision`; en Antigravity usa `decision`.

Cobertura de protección: Write/Edit/MultiEdit/NotebookEdit en Claude, apply_patch en Codex y write_to_file/replace_file_content/multi_replace_file_content en Antigravity. Las shell, scripts, herramientas de escritura MCP, aliases desconocidos y formatos no documentados están fuera de esta protección. El kit no es un control de seguridad completo. Un hook que no se carga no protege. Un fallo del proceso puede tratarse de forma distinta por cada cliente.

El paquete es una distribución portable de proyecto, no un plugin nativo universal ni un marketplace conectado. Instalarlo no registra plugins en tiendas de ninguno de los clientes. Evita duplicar hooks al usar simultáneamente plugins externos con reglas equivalentes.

## Verificación en cada cliente
1. Reabrir el proyecto o una sesión para renovar el inventario, si el cliente lo requiere.
2. Pedir que identifique la ruta y una regla concreta del núcleo, sin entregar la regla en el prompt.
3. Pedir que encuentre `altiora-session-handoff` y lea sus instrucciones.
4. Revisar los hooks activos y la confianza pendiente. Probar primero en un proyecto desechable: una edición normal debe continuar y una escritura de herramienta de archivos a `.env` debe ser denegada sin escribirlo.
5. Si hay delegación autorizada y disponible, verificar un rol con una tarea acotada. Registrar si fue agente real o análisis secuencial.
6. Registrar versión del cliente, fecha, comportamiento observado y limitaciones. No marcar LIVE_TESTED con el resultado de `doctor`.

## Fuentes primarias consultadas
- [OpenAI: skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI: subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [OpenAI: hooks](https://learn.chatgpt.com/docs/hooks)
- [Anthropic: skills](https://code.claude.com/docs/en/skills)
- [Anthropic: subagents](https://code.claude.com/docs/en/sub-agents)
- [Anthropic: hooks](https://code.claude.com/docs/en/hooks)
- [Google: rules](https://www.antigravity.google/docs/rules/)
- [Google: skills](https://antigravity.google/docs/skills)
- [Google: hooks](https://antigravity.google/docs/hooks)
