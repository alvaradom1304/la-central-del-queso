---
name: product-market-fit-research
description: 'product-market-fit-research: Venture Building. Usar para producir pmf_signals,
  cohort_analysis, limitations a partir de cohortes, uso, recompra, feedback, segmento;
  no sustituir otras fases ni declarar resultados sin evidencia.'
---

# Product Market Fit Research

## Contrato

Versión **0.1.0** · **Atomic** · Venture Building · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Analizar adopción y retención por cohorte. Usar para mejorar **retención y repetición por cohorte**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **cohortes, uso, recompra, feedback, segmento**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: Ninguna skill obligatoria; recibir inputs por contrato. Usar Agency OS si ya está en el proyecto.. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

0. Validar contrato de entrada con [input-schema.json](references/input-schema.json); definir criterio de éxito antes de ejecutar. Si falta dato material, continuar trabajo independiente y devolver estado provisional/bloqueado coherente.
1. Analizar adopción y retención por cohorte.
2. Triangular recompra, alternativas, referidos y valor percibido.
3. Evaluar consistencia por segmento y periodo.
4. Comprobar resultado específico, registrar evidencia/limitaciones y devolver esquema; no publicar ni activar sistemas por defecto.

## Regla de decisión y validación

**No declarar PMF por una encuesta aislada ni umbral universal.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **pmf_signals, cohort_analysis, limitations** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

- https://www.sba.gov/counseling/plan-your-business/ — SBA; planificación.
- https://robfitz.com/about/ — Autor de The Mom Test; referencia de autor, no libro leído completo.

Ejemplo: «Usa $product-market-fit-research con cohortes, uso, recompra, feedback, segmento para obtener pmf_signals, cohort_analysis, limitations». Ante datos insuficientes, devolver preguntas/plan y límites; no simular resultado de campo.

## Historial

0.1.0 — 2026-10-10: core delegable, contratos y casos iniciales. EXPERIMENTAL hasta revisión de comportamiento documentada.
