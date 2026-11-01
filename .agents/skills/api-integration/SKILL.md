---
name: api-integration
description: 'api-integration: AI & Automation. Usar para producir integration_code,
  error_handling, tests a partir de API oficial, contrato, entorno, auth, objetivo;
  no sustituir otras fases ni declarar resultados sin evidencia.'
---

# API-INTEGRATION (Executive Protocol)

**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
## Contrato

Versión **0.2.0** · **Atomic** · AI & Automation · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Verificar docs, límites y versión del proveedor. Usar para mejorar **éxito y latencia de integración**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **API oficial, contrato, entorno, auth, objetivo**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: Ninguna skill obligatoria; recibir inputs por contrato. Usar Agency OS si ya está en el proyecto.. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

1. Identificar proveedor, versión, endpoints, permisos, límites y sandbox; leer documentación oficial vigente específica.
2. Definir schemas request/response/eventos, IDs, errores, fuente de verdad y efectos de cada operación.
3. Implementar autenticación servidor, validación de entrada/salida y verificación de webhooks según proveedor.
4. Diseñar idempotencia persistente, concurrencia, timeout ambiguo, retry acotado y reconciliación por entidad.
5. Separar recepción durable de procesamiento; registrar logs sin secretos ni PII, correlation IDs y fallos recuperables.
6. Ejecutar pruebas contractuales y recorrido autorizado, incluyendo duplicado, desorden, 429, 5xx y fallo parcial.

## Regla de decisión y validación

**No reintentar operaciones no idempotentes sin control ni exponer tokens.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **integration_code, error_handling, tests** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

Verificar fuentes primarias específicas de la tarea y documentación vigente del proveedor cuando se implemente. No se declara consulta de fuentes no revisadas.

Ejemplo: «Usa $api-integration con el contexto, alcance y datos disponibles; entrega integration_code, error_handling, tests con evidencia y límites».

## Historial

0.1.0 — contrato inicial.
0.2.0 — 2026-10-10: procedimiento técnico, escenario adverso propio y aceptación específica. Mantener EXPERIMENTAL hasta evaluación documentada de los usos pertinentes; validar formato no certifica ejecución.

## Especificación técnica

Leer [technical-specification.md](references/technical-specification.md) antes de implementar o emitir un veredicto. Los casos diseñados no son pruebas ejecutadas.

## 2. Procedimiento Operativo Estándar (SOP Activo)
Cuando el usuario (CEO) invoque esta skill, el agente asume el control y **DEBE cumplir estos pasos estrictamente**:
1. **Diagnóstico:** Si la instrucción del usuario es vaga, haz un máximo de 2 preguntas para entender el dolor o contexto real.
2. **Ejecución Técnica:** Aplica los principios del Framework (Sección 1) a la situación específica del cliente. 
3. **Restricción de Calidad:** No uses lenguaje genérico de IA. Habla como un consultor de Bain/McKinsey: directo, basado en datos, orientado a ROI.

## 3. Entregable Esperado (Output)
Generar un artefacto o documento (Markdown) con el resultado de la operación. Debe terminar con una recomendación clara de "Próximo Paso".


