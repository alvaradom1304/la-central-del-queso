---
name: web-performance
description: 'web-performance: Premium Web Experience. Usar para producir performance_budget,
  measurements, fixes a partir de sitio, entorno, dispositivos/red, objetivos; no
  sustituir otras fases ni declarar resultados sin evidencia.'
---

# Web Performance

## Contrato

Versión **0.2.0** · **Atomic** · Premium Web Experience · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Medir baseline de carga/interacción/layout y recursos. Usar para mejorar **LCP/INP/CLS y peso bajo condiciones registradas**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **sitio, entorno, dispositivos/red, objetivos**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: Ninguna skill obligatoria; recibir inputs por contrato. Usar Agency OS si ya está en el proyecto.. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

1. Definir plantillas y acciones críticas, dispositivo/red, build, cache y condiciones; separar laboratorio, RUM y CrUX.
2. Registrar baseline reproducible y presupuestos por ruta para carga, interacción, layout, recursos y costo de inmersión.
3. Diagnosticar LCP por TTFB, demora/carga del recurso y demora de render; INP por input delay/procesamiento/presentación; CLS por shifts.
4. Corregir la causa medida: prioridad/dimensiones del hero, JS/hidratación, terceros, fuentes, cache o trabajo de GPU.
5. Repetir antes/después bajo condiciones comparables y registrar variabilidad, ejecuciones y limitaciones.
6. Verificar compra y regresiones visuales/accesibilidad; definir monitor de campo y recuperación sin prometer datos ausentes.

## Regla de decisión y validación

**Distinguir laboratorio de campo; verificar umbrales vigentes.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **performance_budget, measurements, fixes** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

- https://web.dev/articles/vitals — web.dev; consultado 2026-10-10, métricas/umbrales/campo

Ejemplo: «Usa $web-performance con el contexto, alcance y datos disponibles; entrega performance_budget, measurements, fixes con evidencia y límites».

## Historial

0.1.0 — contrato inicial.
0.2.0 — 2026-10-10: procedimiento técnico, escenario adverso propio y aceptación específica. Mantener EXPERIMENTAL hasta evaluación documentada de los usos pertinentes; validar formato no certifica ejecución.

## Especificación técnica

Leer [technical-specification.md](references/technical-specification.md) antes de implementar o emitir un veredicto. Los casos diseñados no son pruebas ejecutadas.
