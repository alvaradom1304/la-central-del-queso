# Standard Skill Contract v0.1

Cada skill incluye NAME, VERSION, DOMAIN, TYPE, PURPOSE, BUSINESS OUTCOME, WHEN TO USE/NOT TO USE, TRIGGERS, REQUIRED/OPTIONAL INPUTS, DEPENDENCIES, TOOLS, KNOWLEDGE SOURCES, PROCEDURE, DECISION RULES, OUTPUTS/SCHEMA, QUALITY CRITERIA, VALIDATION, FAILURE/ESCALATION CONDITIONS, SECURITY, HUMAN APPROVAL, KPIs, EXAMPLES, RELATED SKILLS, VERSION HISTORY, propietario y estado en contract.json.

La información de activación vive en description del frontmatter; solo name/description en YAML. El body instruye la ejecución y enlaza contrato, protocolo, schemas y casos. No depender de memoria invisible o ruta de carpeta fija.

Delegation envelope: task_id, objective, context (fechado y mínimo), inputs específicos, authorized_scope, available_tools, acceptance_criteria y budget opcional. Datos faltantes pueden expresarse como null, pero requieren validación semántica, no se consideran válidos por aceptar JSON.

Output envelope: task_id, skill, version, status, result específico, evidence, assumptions, missing_inputs, validation y next_actions. Cada bloque de result tiene summary, data, evidence_ids y limitations. Los campos result son específicos de cada capacidad, con contenido definido por procedimiento y contrato. Evidencia: ID, tipo, fuente, fecha, afirmación y límites. Una recommendation no debe disfrazarse de FACT.

Estados de ejecución SUCCESS/FAILED/BLOCKED/NEEDS_REVIEW no equivalen a estados de madurez DRAFT/EXPERIMENTAL/VALIDATED/PRODUCTION/DEPRECATED. Validación estructural verifica integridad, no verdad. Promover a VALIDATED solo con casos representativos y negativos documentados; PRODUCTION además requiere pruebas/contexto operativo y mantenimiento. La publicación de una skill EXPERIMENTAL no acredita uso productivo.

Human approval: acción crítica final o fuera de alcance vigente; no pedir de nuevo un permiso explícito ya concedido. GO es recomendación de gate, nunca autorización implícita para gastos, despliegues o contactos.
