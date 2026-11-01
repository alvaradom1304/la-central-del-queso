---
name: revenue-intelligence
description: 'revenue-intelligence: Orchestration. Usar para producir revenue_diagnosis,
  cross_team_actions, experiments a partir de funnel, ventas, marketing, margen, cohortes,
  operación; no sustituir otras fases ni declarar resultados sin evidencia.'
---

# Revenue Intelligence

## Contrato

Versión **0.1.0** · **Composite** · Orchestration · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Conciliar señales desde demanda hasta cliente/retención. Usar para mejorar **contribución y conversión por etapa**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **funnel, ventas, marketing, margen, cohortes, operación**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: $conversion-analysis, $sales-discovery, $lead-qualification, $margin-analysis, $retention, $marketing-analytics. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

0. Validar contrato de entrada con [input-schema.json](references/input-schema.json); definir criterio de éxito antes de ejecutar. Si falta dato material, continuar trabajo independiente y devolver estado provisional/bloqueado coherente.
1. Conciliar señales desde demanda hasta cliente/retención.
2. Seleccionar discovery/qualificación/analítica según cuello.
3. Priorizar mejora por contribución y devolver aprendizaje a marketing.
4. Comprobar resultado específico, registrar evidencia/limitaciones y devolver esquema; no publicar ni activar sistemas por defecto.

## Regla de decisión y validación

**No confundir actividad comercial con ingreso ni ingresos con caja.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **revenue_diagnosis, cross_team_actions, experiments** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

- Procedimiento original sintetizado desde la directiva AEM OS y documentación de visión. Consultar fuentes oficiales/académicas de la tarea al ejecutar; no atribuirlo a un autor no verificado.

Ejemplo: «Usa $revenue-intelligence con funnel, ventas, marketing, margen, cohortes, operación para obtener revenue_diagnosis, cross_team_actions, experiments». Ante datos insuficientes, devolver preguntas/plan y límites; no simular resultado de campo.

## Historial

0.1.0 — 2026-10-10: core delegable, contratos y casos iniciales. EXPERIMENTAL hasta revisión de comportamiento documentada.
