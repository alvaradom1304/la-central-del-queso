---
name: venture-risk-assessment
description: 'venture-risk-assessment: Venture Building. Usar para producir venture_risks,
  validation_order, stop_conditions a partir de hipótesis del negocio, recursos, exposición,
  límites; no sustituir otras fases ni declarar resultados sin evidencia.'
---

# Venture Risk Assessment

## Contrato

Versión **0.2.0** · **Atomic** · Venture Building · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Mapear riesgos de demanda, modelo, caja, ejecución y regulación. Usar para mejorar **exposición antes de validación**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **hipótesis del negocio, recursos, exposición, límites**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: Ninguna skill obligatoria; recibir inputs por contrato. Usar Agency OS si ya está en el proyecto.. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

1. Definir iniciativa, etapa, decisión, capital en riesgo, horizonte y restricciones.
2. Identificar riesgos de demanda, economía, ejecución, liquidez, dependencia, cumplimiento y seguridad pertinentes.
3. Registrar mecanismo causal, exposición, evidencia, mitigación y owner; separar incertidumbre de riesgo observado.
4. Construir escenarios y sensibilidad sin probabilidades inventadas; probar correlaciones/dependencias.
5. Definir stop/go, señales tempranas, pérdida tolerable y costo de opciones reversibles.
6. Entregar recomendación según evidencia y exposición; evitar dictamen de inversión sin datos suficientes.

## Regla de decisión y validación

**No usar optimismo del fundador como evidencia.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **venture_risks, validation_order, stop_conditions** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

Verificar fuentes primarias específicas de la tarea y documentación vigente del proveedor cuando se implemente. No se declara consulta de fuentes no revisadas.

Ejemplo: «Usa $venture-risk-assessment con el contexto, alcance y datos disponibles; entrega venture_risks, validation_order, stop_conditions con evidencia y límites».

## Historial

0.1.0 — contrato inicial.
0.2.0 — 2026-10-10: procedimiento técnico, escenario adverso propio y aceptación específica. Mantener EXPERIMENTAL hasta evaluación documentada de los usos pertinentes; validar formato no certifica ejecución.

## Especificación técnica

Leer [technical-specification.md](references/technical-specification.md) antes de implementar o emitir un veredicto. Los casos diseñados no son pruebas ejecutadas.
