# Arquitectura y decisiones

## Separación de entidades

| Entidad | Función | Persistencia |
|---|---|---|
| Knowledge | Conceptos, fuentes y hallazgos fechados | references con procedencia |
| Skill | Procedimiento con inputs/output y validación | SKILL.md, contrato JSON, casos |
| Agent | Ejecutante con rol, herramientas y permisos reales | Registro conceptual hasta implementar runtime |
| Workflow | Secuencia de capacidades, eventos y estados | Registro declarativo; no está activo por existir |
| Orchestrator | Selección y revisión de capacidades | Skills coordinadoras y reglas de routing |
| Project context | Estado, datos y decisiones de un cliente | Expediente separado, nunca core universal |
| Memory | Hechos/decisiones persistidos y su vigencia | Registro fechado y fuente; no memoria inventada |
| Policy | Principios, autorizaciones, privacidad y límites | Constitution y protocolo comunes |
| Template | Estructura para completar, no hallazgos | assets/esquemas |

## Opciones

**A:** monorepo tradicional con skills/, adapters/, projects/ y docs/. Facilita CI externo, pero aquí la publicación de Skills se basa en carpetas de skills y no hay repo externo de AEM OS conectado.

**B:** Skills nativas independientes y una skill de sistema que conserva catálogo, schemas, política, registros y fábrica. Favorece descubrimiento actual; referencias normativas mínimas duplicadas permiten exportar cada core sin dependencia de carpetas absolutas.

**Recomendación:** B ahora. Mantener nombres canónicos y contratos JSON para futura exportación a monorepo A. No afirmar compatibilidad de autoejecución en otras IAs. Evitar enlaces relativos entre carpetas renombrables; resolver por name del frontmatter y catálogo.

## Taxonomía

Atomic: una tarea específica con resultado verificable. Composite: combina salidas sin ejecutar todos los módulos por defecto. Orchestrator: selecciona capacidades, controla gates, revisa resultados y escala decisiones. Un rol no equivale a una skill y un workflow no equivale a proceso automatizado.

## Top 20 inicial, en orden de habilitación

1. aem-skill-system — contrato/fábrica y catálogo.
2. market-research — evidencia externa.
3. customer-research — evidencia de clientes.
4. competitor-analysis — alternativas del mercado.
5. business-diagnostic — problema antes de solución.
6. problem-validation — evitar invertir en demanda inexistente.
7. value-proposition-design — promesa sustentada.
8. business-model-design — creación/captura de valor.
9. unit-economics — contribución real.
10. cash-flow-analysis — sostenibilidad de caja.
11. business-strategy — prioridades y renuncias.
12. go-to-market — oferta/canal/venta.
13. sales-discovery — señales para ventas y marketing.
14. brand-strategy — identidad desde posicionamiento.
15. web-strategy — web vinculada al negocio.
16. threat-modeling — seguridad temprana.
17. automation-design — automatizar procesos comprendidos.
18. inventory-management — operación confiable.
19. business-decision-gates — revisión antes de comprometer recursos.
20. aem-autonomous-quality-loop — ejecución con evidencia y límites.

No es un ranking universal: reconsiderar por proyecto, riesgo y fuente de datos.

La evaluación y sus artifacts/runnables viven en $aem-library-validation; el core de catálogo y fábrica queda en $aem-skill-system. Se separaron paquetes para reducir tamaño de publicación, sin cambiar límites ni evidencias.
