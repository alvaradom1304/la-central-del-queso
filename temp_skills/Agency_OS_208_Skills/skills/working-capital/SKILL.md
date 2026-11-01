---
name: working-capital
description: 'working-capital: Financial Intelligence. Usar para producir working_capital_needs,
  cycle, levers a partir de inventario, cuentas por cobrar/pagar, plazos; no sustituir
  otras fases ni declarar resultados sin evidencia.'
---

# Working Capital

## Contrato

Versión **0.2.0** · **Atomic** · Financial Intelligence · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Definir capital de trabajo operativo y partidas. Usar para mejorar **días del ciclo de conversión de efectivo**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **inventario, cuentas por cobrar/pagar, plazos**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: Ninguna skill obligatoria; recibir inputs por contrato. Usar Agency OS si ya está en el proyecto.. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

1. Delimitar entidad, moneda, periodo, fechas de cierre y definiciones contables aplicables.
2. Separar efectivo, cuentas por cobrar/pagar, inventario, reservas y partidas no operativas.
3. Calcular capital de trabajo y ciclo de caja con bases comparables; registrar método para promedios y saldos.
4. Modelar cambios de volumen, plazos, stock y cobranza en escenarios trazables.
5. Priorizar acciones por liquidez, costo, servicio y riesgo, sin confundir mejora de caja con beneficio.
6. Reconciliar con flujo de caja y entregar fórmulas, sensibilidad, datos faltantes y responsables propuestos.

## Regla de decisión y validación

**No recomendar retrasar obligaciones ilegítimamente; fórmulas dependen de datos comparables.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **working_capital_needs, cycle, levers** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

Verificar fuentes primarias específicas de la tarea y documentación vigente del proveedor cuando se implemente. No se declara consulta de fuentes no revisadas.

Ejemplo: «Usa $working-capital con el contexto, alcance y datos disponibles; entrega working_capital_needs, cycle, levers con evidencia y límites».

## Historial

0.1.0 — contrato inicial.
0.2.0 — 2026-10-10: procedimiento técnico, escenario adverso propio y aceptación específica. Mantener EXPERIMENTAL hasta evaluación documentada de los usos pertinentes; validar formato no certifica ejecución.

## Especificación técnica

Leer [technical-specification.md](references/technical-specification.md) antes de implementar o emitir un veredicto. Los casos diseñados no son pruebas ejecutadas.

## Evidencia de un caso documental

Al auditar esta versión, leer [evaluation-output-oct10.json](references/evaluation-output-oct10.json) y [evaluation-review-oct10.json](references/evaluation-review-oct10.json). Caso sintético, con schema/traza y revisión aritmética/documental; no demuestra desempeño de cliente ni producción.
