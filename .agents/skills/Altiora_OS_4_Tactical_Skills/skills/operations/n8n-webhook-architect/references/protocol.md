# Protocolo de ejecución — n8n-webhook-architect

1. Crear `task_id` y comprobar todas las entradas obligatorias de `input-schema.json`.
2. Si falta una entrada bloqueante, preguntar solo lo imprescindible; devolver `BLOCKED` y no completar con invenciones.
3. Mantener evidencia con fuente y fecha. Diferenciar hecho, inferencia y recomendación.
4. Ejecutar el SOP de `../SKILL.md` en orden; registrar gates, errores y decisiones.
5. Aplicar límites de autorización: preparar borradores/diseños sí; acciones externas con impacto requieren aprobación.
6. Validar el sobre final contra `output-schema.json`, documentar faltantes y devolver `SUCCESS`, `FAILED`, `BLOCKED` o `NEEDS_REVIEW`.

## Formato mínimo de salida

`task_id`, `skill`, `version`, `status`, `result`, `evidence`, `assumptions`, `missing_inputs`, `validation` y `next_actions`.
