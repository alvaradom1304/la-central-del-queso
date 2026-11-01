---
name: value-selling
description: 'value-selling: Sales Intelligence. Usar para producir value_case, assumptions,
  validation a partir de impacto base, drivers, costo, alternativas, criterios comprador;
  no sustituir otras fases ni declarar resultados sin evidencia.'
---

# Value Selling

## Contrato

Versión **0.2.0** · **Atomic** · Sales Intelligence · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Cuantificar beneficios incrementales y costos con comprador. Usar para mejorar **valor confirmado frente a costo**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **impacto base, drivers, costo, alternativas, criterios comprador**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: Ninguna skill obligatoria; recibir inputs por contrato. Usar Agency OS si ya está en el proyecto.. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

1. Precisar alternativa actual, problema, drivers y criterio económico del comprador.
2. Construir baseline trazable con unidad, periodo, volumen y propietario de datos.
3. Cuantificar efecto incremental por mecanismo, evitando doble conteo de ahorro/ingreso/riesgo.
4. Calcular costos totales, adopción, tiempo a valor y escenarios de sensibilidad.
5. Validar supuestos materiales con evidencia del comprador y separar estimación de resultado.
6. Entregar caso de valor, fórmula, límites y condiciones de revisión sin garantía de retorno.

## Regla de decisión y validación

**No tratar beneficio bruto como ROI ni ingreso como utilidad.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **value_case, assumptions, validation** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

Verificar fuentes primarias específicas de la tarea y documentación vigente del proveedor cuando se implemente. No se declara consulta de fuentes no revisadas.

Ejemplo: «Usa $value-selling con el contexto, alcance y datos disponibles; entrega value_case, assumptions, validation con evidencia y límites».

## Historial

0.1.0 — contrato inicial.
0.2.0 — 2026-10-10: procedimiento técnico, escenario adverso propio y aceptación específica. Mantener EXPERIMENTAL hasta evaluación documentada de los usos pertinentes; validar formato no certifica ejecución.

## Especificación técnica

Leer [technical-specification.md](references/technical-specification.md) antes de implementar o emitir un veredicto. Los casos diseñados no son pruebas ejecutadas.

## Evidencia de un caso documental

Al auditar esta versión, leer [evaluation-output-oct10.json](references/evaluation-output-oct10.json) y [evaluation-review-oct10.json](references/evaluation-review-oct10.json). Caso sintético, con schema/traza y revisión aritmética/documental; no demuestra desempeño de cliente ni producción.
