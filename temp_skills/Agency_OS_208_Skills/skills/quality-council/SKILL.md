---
name: quality-council
description: 'quality-council: Orchestration. Usar para producir selected_reviewers,
  independent_findings, verdict a partir de resultado, criterios, riesgos, revisores
  reales disponibles; no sustituir otras fases ni declarar resultados sin evidencia.'
---

# Quality Council

## Contrato

Versión **0.1.0** · **Orchestrator** · Orchestration · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Seleccionar revisión de negocio/finanzas/UX/seguridad/etc según riesgo. Usar para mejorar **defectos materiales detectados antes de entrega**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **resultado, criterios, riesgos, revisores reales disponibles**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: $business-decision-gates. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

0. Validar contrato de entrada con [input-schema.json](references/input-schema.json); definir criterio de éxito antes de ejecutar. Si falta dato material, continuar trabajo independiente y devolver estado provisional/bloqueado coherente.
1. Seleccionar revisión de negocio/finanzas/UX/seguridad/etc según riesgo.
2. Entregar contexto mínimo y pedir evidencia independiente.
3. Resolver discrepancias sin votación ciega y registrar decisión.
4. Comprobar resultado específico, registrar evidencia/limitaciones y devolver esquema; no publicar ni activar sistemas por defecto.

## Regla de decisión y validación

**Roles conceptuales no son agentes activos; no escalar datos sensibles a terceros sin necesidad/autorización.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **selected_reviewers, independent_findings, verdict** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

- Procedimiento original sintetizado desde la directiva AEM OS y documentación de visión. Consultar fuentes oficiales/académicas de la tarea al ejecutar; no atribuirlo a un autor no verificado.

Ejemplo: «Usa $quality-council con resultado, criterios, riesgos, revisores reales disponibles para obtener selected_reviewers, independent_findings, verdict». Ante datos insuficientes, devolver preguntas/plan y límites; no simular resultado de campo.

## Historial

0.1.0 — 2026-10-10: core delegable, contratos y casos iniciales. EXPERIMENTAL hasta revisión de comportamiento documentada.
