---
name: aem-skill-system
description: Mantener la biblioteca AEM OS de capacidades reutilizables y delegables. Usar para auditar capacidades, consultar catálogo/taxonomía, seleccionar skills, diseñar contratos y workflows, evaluar portabilidad entre IAs, revisar calidad o incorporar aprendizajes. No sustituir las skills de negocio ni activar agentes o integraciones inexistentes.
---

# AEM-SKILL-SYSTEM (Executive Protocol)

**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
Leer [SKILL_ARCHITECTURE.md](references/SKILL_ARCHITECTURE.md) para límites entre knowledge, skill, agent, workflow, orchestrator, project context, memory, policy y template. Leer [SKILL_CATALOG.md](references/SKILL_CATALOG.md) para encontrar capacidades por nombre y dominio; resolverlas por frontmatter `name`, no por un nombre de carpeta supuesto. Usar [DEPENDENCY_MAP.md](references/DEPENDENCY_MAP.md) para ordenar inputs; cargar solo capacidades necesarias.

## Mantener el sistema

1. Auditar archivos y conexiones realmente accesibles. Registrar límites y fuentes en SKILL_INVENTORY y SKILL_GAP_ANALYSIS; no inferir acceso de recuerdos o URLs.
2. Separar procedimiento repetible de conocimiento de referencia y del contexto de un cliente. Consultar aliases antes de crear otra skill.
3. Aplicar el contrato en [SKILL_STANDARD.md](references/SKILL_STANDARD.md). Reutilizar los esquemas en assets; cada capacidad debe tener inputs, output, decisión y validación específicos.
4. Incorporar las capacidades faltantes mediante $aem-skill-factory, dentro del alcance de creación autorizado. Antes, distinguir REUSE, IMPROVE, CREATE y guardado pendiente. Exigir problema repetible, aporte incremental, métrica, baseline real o UNKNOWN y plan de evaluación. Inicializar con el creador del entorno, preservar existentes y adaptar herramientas al entorno real.
5. Definir pruebas antes de evaluar; usar casos en references/evaluation-cases.json de cada skill. Distinguir pruebas estructurales, escenarios ejecutados y validación empresarial real.
6. Registrar resultados en EVALUATION_REPORT y cambios en CHANGELOG. Tras cada uso significativo, extraer aprendizaje trazable, aplicar un cambio acotado, evaluar casos independientes y regresiones, versionar y decidir KEEP/REVISE/REVERT. Marcar EXPERIMENTAL hasta contar con evidencia de comportamiento suficiente; no promover todas por un validador de YAML.
7. Guardar mediante mecanismo de Skills del entorno y sincronizar Git cuando aplique. No desplegar clientes ni enviar comunicaciones como efecto lateral.

## Delegar

Enviar task_id, objetivo, skill/version, contexto mínimo fechado, inputs, fuentes, herramientas disponibles, alcance autorizado, presupuesto de tiempo/costo y criterios de aceptación. No incluir secretos ni historial personal ajeno al problema. Validar inputs antes de ejecutar; devolver resultado según esquema y evidencia. El orquestador verifica antes de integrar.

Usar [AGENT_REGISTRY.md](references/AGENT_REGISTRY.md) como roles conceptuales, no como agentes instalados. Consultar [WORKFLOW_REGISTRY.md](references/WORKFLOW_REGISTRY.md) para secuencias. Mantener supervisión humana en decisiones críticas; aprovechar autorización explícita existente sin repetir permisos. No afirmar que un workflow está activo sin implementación y pruebas.

## Portabilidad y aprendizaje

Leer [PORTABILITY.md](references/PORTABILITY.md) antes de exportar a otra IA. Markdown y JSON permiten transferencia manual; no garantizan autodescubrimiento, permisos o ejecución compatible. Mantener VERSION HISTORY dentro del contrato; extraer KIPs solo después de separar observación, interpretación y contexto de aplicación. Conservar La Central del Queso como contexto aislado en PROJECT_LAB.md.


## Documentación y estado

Consultar [FIRST_MILESTONE.md](references/FIRST_MILESTONE.md), [SKILL_INVENTORY.md](references/SKILL_INVENTORY.md) y [SKILL_GAP_ANALYSIS.md](references/SKILL_GAP_ANALYSIS.md) para auditoría. Usar [CONSTITUTION.md](references/CONSTITUTION.md) como política. Consultar [IMPLEMENTATION_ROADMAP.md](references/IMPLEMENTATION_ROADMAP.md), TESTING_STRATEGY.md de $aem-library-validation y [EVALUATION_REPORT.md](references/EVALUATION_REPORT.md) para sprints y evaluación. [METHOD_COMPARISON.md](references/METHOD_COMPARISON.md) y [SOURCE_INDEX.md](references/SOURCE_INDEX.md) registran metodología/fuentes. Revisar [CHANGELOG.md](references/CHANGELOG.md). [PROJECT_LAB.md](references/PROJECT_LAB.md) es contexto aislado.

Leer [contract.json](references/contract.json), [protocol.md](references/protocol.md), [input-schema.json](references/input-schema.json) y [output-schema.json](references/output-schema.json) para delegación. [evaluation-cases.json](references/evaluation-cases.json) contiene diseños de prueba, no resultados ejecutados. La fábrica requiere PyYAML; los validadores de $aem-library-validation declaran PyYAML/jsonschema en scripts/requirements.txt. La fábrica recibe --root, --init y --sprint, crea solo carpetas inexistentes y no sobrescribe originales; ejecutarla solo con scope de escritura.

Versión normativa 0.1.2 — 2026-10-10: incorporación autónoma de faltantes con aporte verificable y mejora continua. Ver VERSION HISTORY en contract.json.

## Calidad inicial exigida

Leer [first-release-quality.md](references/first-release-quality.md) antes de crear, promover o declarar terminada una capacidad. Exigir contenido técnico completo desde la primera entrega; el generador y la validación de formato no sustituyen revisión sustantiva ni pruebas independientes.

Consultar [TECHNICAL_QUALITY_REVIEW.md](references/TECHNICAL_QUALITY_REVIEW.md) para alcance real de revisión y límites; leer las salidas crudas de quality-evidence solo al auditar esos casos.

Para preguntas y decisiones con crítica, evidencia y respuesta integrada, seleccionar $high-value-deliberation. Sus perspectivas no equivalen a revisores independientes de $quality-council. Resolver por nombre; el catálogo describe definiciones y la disponibilidad debe verificarse separadamente.

## 2. Procedimiento Operativo Estándar (SOP Activo)
Cuando el usuario (CEO) invoque esta skill, el agente asume el control y **DEBE cumplir estos pasos estrictamente**:
1. **Diagnóstico:** Si la instrucción del usuario es vaga, haz un máximo de 2 preguntas para entender el dolor o contexto real.
2. **Ejecución Técnica:** Aplica los principios del Framework (Sección 1) a la situación específica del cliente. 
3. **Restricción de Calidad:** No uses lenguaje genérico de IA. Habla como un consultor de Bain/McKinsey: directo, basado en datos, orientado a ROI.

## 3. Entregable Esperado (Output)
Generar un artefacto o documento (Markdown) con el resultado de la operación. Debe terminar con una recomendación clara de "Próximo Paso".


