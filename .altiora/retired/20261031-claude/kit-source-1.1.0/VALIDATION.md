# Evidencia de validación · 18 de octubre de 2026

## Resultado de scripts
20 pruebas distintas pasaron con Python 3.12.10 en Windows: 18 de integración en una ejecución (119.977 segundos), una adicional que ejecuta los comandos generados para los tres protocolos con espacios en la ruta (12.040 segundos) y una de frontmatter simple (0.015 segundos). Tras reforzar la validación de la política, se repitió el caso de configuración inválida, incluyendo listas de patrones con tipo incorrecto, y pasó (2.116 segundos). Los tiempos describen este equipo y no son una mejora de rendimiento del producto.

Cobertura ejecutada:
- Preview sin escrituras, instalación y diagnóstico de integridad.
- Reinstalación sin cambios ni duplicados.
- Conservación de reglas, permisos, hooks previos y variantes locales de skills.
- Rechazo de JSON de configuración inválido antes de modificar el proyecto.
- Restauración de bytes originales mediante rollback y rechazo de rollback con trabajo posterior.
- Detección de deriva en payload gestionado y rechazo de rutas fuera del proyecto.
- Importación selectiva de una skill con recursos de referencia.
- Parseo real de los cuatro TOML de roles, sin fijar modelo.
- Payloads nativos de protección para Codex, Claude y Antigravity; archivos normales y .env.example continúan con los permisos habituales.
- apply_patch con edición, eliminación, movimiento y rutas Windows.
- Contratos SessionStart de los tres entornos.
- Política inválida produce denegación sin revelar datos de entrada.
- Validación de handoff correcto, campos ausentes, evidencia/fecha ausente y estado complete incompatible con pendientes.
- Caso negativo de cobertura: un comando shell no es bloqueado por el guard de archivos; límite explícito, no prueba de protección shell.

Comandos reproducibles:
```powershell
python -m unittest discover -s tests -v
python scripts/package.py --verify
```

La primera ejecución de las pruebas falló porque la carpeta temporal de Windows no permitía las escrituras. Las pruebas se corrigieron para usar `work/altiora-system-tests` dentro del workspace, verificando el destino antes de limpiar cada fixture. La ejecución posterior de las 18 pruebas pasó.

El validador oficial `skill-creator/scripts/quick_validate.py` se intentó con Python del sistema y Python bundled; ambos carecen de PyYAML. No se instalaron dependencias. Se revisó el frontmatter simple de las dos skills y se conserva una prueba local de su estructura; no se afirma haber pasado el validador oficial.

## Límites de evidencia
Las pruebas ejecutan scripts reales y payloads de protocolos documentados. No se abrieron sesiones nuevas de Antigravity, Claude Code ni Codex para comprobar descubrimiento o confianza de hooks; esa prueba queda pendiente. Los roles no se lanzaron como subagentes en esta entrega. No se probaron macOS/Linux, clientes cloud ni versiones antiguas. No hay resultados comerciales medidos.

Las dos skills tienen instrucciones completas para su alcance, pero siguen EXPERIMENTAL hasta probar escenarios de comportamiento en cada cliente. La documentación consultada está enlazada en `docs/COMPATIBILITY.md`.
