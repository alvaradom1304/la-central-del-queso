# Orca incorporado como referencia de Altiora

Repositorio confirmado por el usuario: [stablyai/orca](https://github.com/stablyai/orca). Revisión del 31/10/2026 en horario de Costa Rica.

## Versión fijada y alcance

- Release estable observada: [v1.4.245](https://github.com/stablyai/orca/releases/tag/v1.4.245), no draft ni prerelease al consultar.
- Tag anotado `7a5202ad17310bc22e1f03398a96a189a3b33f03`, resuelto mediante API GitHub al commit completo `1c6ac8c3c4d2c3dec2cb5966d225ca2a0e0471d3`. El fetch local por SHA coincide y `package.json` declara 1.4.245.
- Licencia raíz [MIT](https://github.com/stablyai/orca/blob/1c6ac8c3c4d2c3dec2cb5966d225ca2a0e0471d3/LICENSE), copyright 2026 Lovecast Inc. Se conserva el aviso original. Esta comprobación no es una auditoría de todas las dependencias, componentes móviles o servicios.
- Se descargó una caché Git superficial sin checkout y se extrajeron siete archivos de documentación/manifiestos para estudio. No se instalaron dependencias, ejecutó código de Orca o inició un servicio.

## Encaje con lo existente

Altiora ya dispone de Bibliotecario, skills, roles, traspaso y un MCP privado de coordinación. Orca añade un entorno de ejecución/seguimiento entre agentes que podría complementar ese método, sin sustituir el criterio de negocio ni los controles de calidad. No hay evidencia de que reduzca tokens, costes u horas en Altiora.

Ahora se adopta como patrón de coordinación la distinción tarea/intento, el dueño de archivos, resultados explícitos y revisión de bloqueos. Se usan las herramientas nativas disponibles de esta sesión. El registro local **no** es un Run de Orca ni permite invocar su CLI.

## Windows y requisitos: declarado frente a probado

El [README fijado](https://github.com/stablyai/orca/blob/1c6ac8c3c4d2c3dec2cb5966d225ca2a0e0471d3/README.md) declara Windows y enlaza un instalador. La release observada contiene `orca-windows-setup.exe`; no se descargó ese instalador. No se certifica funcionamiento, firma del binario o compatibilidad con este PC.

La [guía de Codex](https://github.com/stablyai/orca/blob/1c6ac8c3c4d2c3dec2cb5966d225ca2a0e0471d3/docs/site/content/docs/agents/codex.mdx) describe ejecución anfitriona o WSL, acceso al perfil y hooks. La [guía de Claude Code](https://github.com/stablyai/orca/blob/1c6ac8c3c4d2c3dec2cb5966d225ca2a0e0471d3/docs/site/content/docs/agents/claude-code.mdx) usa el login/perfil existente. No se copiaron credenciales, alteraron homes, crearon symlinks o siguieron instrucciones de cambio de cuenta.

El manifiesto fijado declara Node 24 y pnpm 12.14.0 para trabajar desde fuente, con pasos nativos de postinstalación. No se intentó construirlo. El comando `orca` no se localizó en el PATH consultado; eso no demuestra ausencia en todo el equipo.

## Orquestación experimental

La [documentación fijada de orquestación](https://github.com/stablyai/orca/blob/1c6ac8c3c4d2c3dec2cb5966d225ca2a0e0471d3/docs/site/content/docs/cli/orchestration.mdx) requiere activar Experimental y disponer de un runtime activo. Distingue Run, Task y Dispatch; la autoridad de finalización corresponde al intento activo. También documenta comandos antiguos sin efectos y confirmación de entregas para evitar relecturas ambiguas.

No se activó esa opción ni se lanzaron agentes de Orca. Los ejemplos que crean worktrees o usan `--setup run` pueden ejecutar provisión; los de modelo/esfuerzo cambian la configuración efectiva del lanzamiento. No son valores por defecto para Altiora. Revisar costes, hooks, telemetría, autenticaciones y efectos antes de una prueba autorizada; no cambiar permisos o perfiles para forzar un PASS.

## Decisión

**Fuente incorporada y patrones documentados. Runtime pendiente de prueba autorizada.** Codex asume la coordinación usando capacidades reales. Se conserva el prompt de Claude como no enviado; este encargo no reanuda el control del PC detenido con Esc.

Comprobaciones: identidad canónica confirmada, tag/commit/version coherentes, siete fuentes extraídas sin ejecutarlas, aviso MIT conservado y revisión estática independiente recibida. Faltan prueba funcional de Orca en este PC, revisión de integración con perfiles y medición de resultados. No se amplió acceso a carpetas, se vinculó el teléfono o se alteró el Git empresarial.
