---
name: aem-skill-factory
description: 'aem-skill-factory: Orchestration. Usar para producir capability_contract,
  skill_package, evaluation a partir de capacidad repetible, ejemplos, alcance, fuentes,
  skills existentes; no sustituir otras fases ni declarar resultados sin evidencia.'
---

# AEM-SKILL-FACTORY (Executive Protocol)

**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
## Contrato

Versión **0.1.1** · **Composite** · Orchestration · **EXPERIMENTAL**.
Propietario conceptual: AEM OS / Dennis. No equivale a agente instalado ni capacidad profesional certificada.
Leer [contract.json](references/contract.json) para contrato completo y [protocol.md](references/protocol.md) para evidencia, delegación y autorización. Ambos son parte normativa de esta skill autónoma.

## Propósito y resultado empresarial

Auditar alias/solapamiento y separar skill de knowledge/context/workflow. Usar para mejorar **reutilización y éxito en casos independientes**, sin prometer efecto comercial futuro.

## Inputs y límites

Recibir **capacidad repetible, ejemplos, alcance, fuentes, skills existentes**, objetivo, contexto vigente, alcance autorizado y criterios de aceptación. Inputs faltantes pueden ser desconocidos explícitos: no pasar validación semántica por enviar null. Contexto opcional: decisiones previas, baseline y restricciones de herramientas. No necesitar secretos ni datos ajenos a esta tarea.
No repetir una fase ya validada sin cambio material ni usar esta skill si el encargo corresponde a otra capacidad.

Dependencias candidatas: $aem-skill-system. Seleccionar solo las pertinentes; pueden sustituirse por outputs equivalentes verificados. Resolver por name/versión, no por ruta absoluta. No afirmar que dependencia se ejecutó por aparecer aquí.

## Procedimiento

0. Validar contrato de entrada con [input-schema.json](references/input-schema.json); definir criterio de éxito antes de ejecutar. Si falta dato material, continuar trabajo independiente y devolver estado provisional/bloqueado coherente.
1. Auditar alias/solapamiento y separar skill de knowledge/context/workflow. Aplicar [creation-and-improvement.md](references/creation-and-improvement.md): REUSE, IMPROVE, CREATE o DEFER; una definición con guardado pendiente no es una capacidad ausente.
2. Para una capacidad faltante, declarar problema repetible, aporte incremental, métrica, baseline real o UNKNOWN y criterios de aceptación. Crear procedimiento específico, schema y límites con inicializador del entorno dentro del alcance autorizado.
3. Validar estructura y comportamiento en casos antes de promover estado.
4. Comprobar resultado específico, registrar evidencia/limitaciones y verificar guardado. Tras uso significativo, registrar aprendizaje, evaluar cambio y regresiones, versionar y decidir KEEP/REVISE/REVERT según [creation-and-improvement.md](references/creation-and-improvement.md). No activar sistemas de clientes por defecto.

## Regla de decisión y validación

**No generar variantes vacías ni marcar VALIDATED por YAML; preservar originales y verificar guardado.**

Comprobar exactitud, completitud de alcance, evidencia, utilidad, seguridad, consistencia y manejo de fallo. Registrar fecha/entorno, criterio, prueba realizada y resultado. Una comprobación no realizada se devuelve NOT_RUN. Para evaluación usar [evaluation-cases.json](references/evaluation-cases.json); no promover estado por validar solo YAML/JSON.

## Output y delegación

Entregar **capability_contract, skill_package, evaluation** dentro de [output-schema.json](references/output-schema.json): task_id, skill/version, status, result, evidence, assumptions, missing_inputs, validation y next_actions.
Cada campo de result incluye summary, data, evidence_ids y limitations. Describir el contenido específico en data; conservar unidades/fórmulas cuando aplique. Usar arrays/objetos vacíos solo si se explica que están pendientes, nunca como evidencia de éxito.

Devolver SUCCESS, FAILED, BLOCKED o NEEDS_REVIEW según protocolo. Otro ejecutante debe poder verificar fuentes, método/cálculos, aceptación y límites con este paquete, sin memoria implícita. Escalar incertidumbre material o decisión crítica; no pedir permiso para análisis autorizado.

## Fuentes y ejemplos

- Procedimiento original sintetizado desde la directiva AEM OS y documentación de visión. Consultar fuentes oficiales/académicas de la tarea al ejecutar; no atribuirlo a un autor no verificado.

Ejemplo: «Usa $aem-skill-factory con capacidad repetible, ejemplos, alcance, fuentes, skills existentes para obtener capability_contract, skill_package, evaluation». Ante datos insuficientes, devolver preguntas/plan y límites; no simular resultado de campo.

## Historial

0.1.0 — 2026-10-10: core delegable, contratos y casos iniciales. EXPERIMENTAL hasta revisión de comportamiento documentada.

0.1.1 — 2026-10-10: criterio de aporte incremental, creación autónoma autorizada y mejora continua con evidencia, métricas, regresiones y reversión. Sigue EXPERIMENTAL.

## Calidad inicial exigida

Leer [first-release-quality.md](references/first-release-quality.md) antes de crear, promover o declarar terminada una capacidad. Exigir contenido técnico completo desde la primera entrega; el generador y la validación de formato no sustituyen revisión sustantiva ni pruebas independientes.

## 2. Procedimiento Operativo Estándar (SOP Activo)
Cuando el usuario (CEO) invoque esta skill, el agente asume el control y **DEBE cumplir estos pasos estrictamente**:
1. **Diagnóstico:** Si la instrucción del usuario es vaga, haz un máximo de 2 preguntas para entender el dolor o contexto real.
2. **Ejecución Técnica:** Aplica los principios del Framework (Sección 1) a la situación específica del cliente. 
3. **Restricción de Calidad:** No uses lenguaje genérico de IA. Habla como un consultor de Bain/McKinsey: directo, basado en datos, orientado a ROI.

## 3. Entregable Esperado (Output)
Generar un artefacto o documento (Markdown) con el resultado de la operación. Debe terminar con una recomendación clara de "Próximo Paso".


