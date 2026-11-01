# Estrategia de evaluación

1. Estructura: frontmatter, contrato completo, schemas válidos, referencias, nombres, dependencias resueltas, ausencia de ciclos y aliases.
2. Casos por skill: normal, edge, insufficient data, conflicting data, invalid request y high-risk action. Son diseños de prueba; no contarlos como ejecutados.
3. Comportamiento: ejecutar muestra crítica con inputs independientes y sin expected answers en contexto del ejecutante; inspeccionar resultado bruto y registrar hallazgos.
4. Finanzas: verificar cálculos conocidos y negativos/denominadores cero. Seguridad: scope y prueba segura; no incidentes simulados sobre producción.
5. Calidad empresarial: medir resultado, decisiones y operación en cliente con datos vigentes. No certificar éxito con escenario sintético.
6. Reutilización: ejecutar en sector distinto, inputs incompletos y ambiente sin herramientas. Portabilidad: core Markdown/JSON inspeccionable; adapters requieren prueba específica del modelo/runtime.

Rúbrica: Accuracy, Completeness, Evidence, Business Utility, Security, Consistency, Reusability, Failure Handling. Evaluar cada dimensión con evidencia, no un único score promedio que oculte error crítico. Mantener failure log y máximo inicial de tres ciclos correctivos.
