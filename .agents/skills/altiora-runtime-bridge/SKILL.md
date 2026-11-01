---
name: altiora-runtime-bridge
description: Prepara o verifica la portabilidad de un proyecto Altiora entre Codex, Claude Code y Antigravity cuando se configura o cambia el entorno de trabajo.
---

# Puente entre entornos

Entradas: raíz del proyecto, entorno destino y capacidad que se necesita. Salida: estado de instrucciones, skills, roles, hooks y limitaciones verificadas.

1. Leer las instrucciones del proyecto y `.altiora/system/docs/COMPATIBILITY.md`. Identificar herramientas reales; un archivo de rol no prueba que exista un agente activo.
2. Ejecutar `python .altiora/system/scripts/manage.py doctor --target .`. Revisar rutas y hashes. El diagnóstico estructural no prueba descubrimiento por el cliente.
3. Ejecutar `python .altiora/system/skills/altiora-runtime-bridge/scripts/check_runtimes.py --target .`. Comprueba de forma estructural y de solo lectura lo que ve cada runtime:
   - frontmatter inválido;
   - el mismo nombre con contenido distinto dentro de un runtime (Codex lee `.agents/skills` y `~/.codex/skills`; Claude Code, `.claude/skills` y `~/.claude/skills`; Antigravity, `.agents/skills`);
   - skills citadas en `CLAUDE.md`, `AGENTS.md` o `GEMINI.md` que ese runtime no descubre;
   - archivos con CRLF y LF mezclados.

   Corregir los errores. Los avisos se resuelven con el dueño de cada archivo; no borrar variantes sin confirmación. Con `--strict`, los avisos también hacen fallar la comprobación. Ejecutarlo antes y después de importar o copiar una skill: una copia idéntica no es un duplicado, una copia distinta con el mismo nombre sí.
4. Buscar la capacidad por nombre y descripción en el inventario nativo. Leer únicamente las seleccionadas. Conservar variantes locales; no copiar toda una biblioteca por defecto.
5. Si falta una skill concreta, revisar su licencia, recursos, comandos, dependencias y rutas absolutas antes de importarla con `manage.py install --help`. No convertir herramientas ausentes en supuestas conexiones.
6. Verificar en el cliente: instrucciones visibles, skill localizada y hook de sesión ejecutado. En Codex revisar `/hooks` y su confianza pendiente. No omitir controles de confianza. Si no se puede abrir el cliente, registrar esta verificación como pendiente.
7. Para roles en Antigravity, leer `.altiora/system/roles/<nombre>.md` y usar `define_subagent` solo si está disponible y autorizado. Sin esa herramienta, aplicar el rol secuencialmente.

Entregar una tabla con capa, ruta, estado (`CREATED`, `INSTALLED`, `DISCOVERED`, `LIVE_TESTED`), evidencia y limitación. Si hay incompatibilidad, conservar los archivos fuente, usar el procedimiento manual delimitado y explicar qué función falta. No confundir copiar un ZIP con instalar un plugin nativo.

Para migrar trabajo activo, aplicar `altiora-session-handoff`; no mover secretos ni historial completo.
