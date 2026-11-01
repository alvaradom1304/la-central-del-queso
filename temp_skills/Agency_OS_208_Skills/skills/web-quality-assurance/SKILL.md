---
name: web-quality-assurance
description: 'web-quality-assurance: Premium Web Experience. Usar para producir qa_evidence,
  defects, release_verdict a partir de criterios, app/version, flujos, datos, alcance;
  no sustituir otras fases ni declarar resultados sin evidencia.'
---

# Web Quality Assurance

## Contrato

Versión **0.2.0** · **Atomic** · Premium Web Experience · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Definir aceptación antes de probar. Usar para mejorar **criterios cumplidos y defectos abiertos**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **criterios, app/version, flujos, datos, alcance**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: Ninguna skill obligatoria; recibir inputs por contrato. Usar Agency OS si ya está en el proyecto.. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

1. Construir matriz REQ→caso→resultado esperado→evidencia para tareas y riesgos reales.
2. Fijar build, entorno, fixtures, navegadores/dispositivos, permisos y alcance de prueba.
3. Verificar recorrido UI→API→persistencia→respuesta y estado comercial; comprobar datos independientes del mensaje UI.
4. Ejecutar fallos pertinentes: red, validación, duplicados, refresh, concurrencia, recurso visual ausente y accesibilidad.
5. Clasificar defectos por impacto y reproducibilidad, corregir causa y retestar área afectada/regresiones.
6. Emitir veredicto según críticos/altos, evidencia y límites; separar gate interno de autorización para publicar.

## Regla de decisión y validación

**No declarar aprobado sin evidencia ni publicar sin autorización.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **qa_evidence, defects, release_verdict** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

- https://www.w3.org/TR/WCAG22/ — W3C; consultado 2026-10-10, evaluar proceso completo y limitaciones de checks automáticos

Ejemplo: «Usa $web-quality-assurance con el contexto, alcance y datos disponibles; entrega qa_evidence, defects, release_verdict con evidencia y límites».

## Historial

0.1.0 — contrato inicial.
0.2.0 — 2026-10-10: procedimiento técnico, escenario adverso propio y aceptación específica. Mantener EXPERIMENTAL hasta evaluación documentada de los usos pertinentes; validar formato no certifica ejecución.

## Especificación técnica

Leer [technical-specification.md](references/technical-specification.md) antes de implementar o emitir un veredicto. Los casos diseñados no son pruebas ejecutadas.
