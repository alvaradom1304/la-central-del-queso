# Cambios

## 1.0.0 · 2026-10-18
- Núcleo portable y adaptadores para instrucciones, skills, hooks y roles.
- Dos skills operativas nuevas; se conservan las variantes existentes.
- Instalación con preview, respaldos, hashes, diagnóstico y rollback conservador.
- Contratos de tarea, resultado y traspaso; validador de handoff sin dependencias.
- Estado inicial de las skills: EXPERIMENTAL. Sin pruebas de rendimiento comercial ni sesiones de los tres clientes.

KEEP: conservar núcleo y adaptadores mientras pasen pruebas y descubrimiento local.
REVISE: corregir un contrato o comportamiento con evidencia de fallo real.
REVERT: usar la transacción si aparece una regresión y no hay cambios posteriores que preservar.
