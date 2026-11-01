# Core y adapters

| Entorno | Ruta de uso | Estado verificado |
|---|---|---|
| ChatGPT Work Skills | Invocar nombre de skill; usar herramientas disponibles y permisos del entorno | Estructura nativa generada; guardar con Git antes de afirmar disponible |
| Claude | Cargar core Markdown, references y contrato por mecanismo compatible; resolver herramientas/autorización local | Transferencia conceptual; no instalado ni ejecución cross-model probada |
| Gemini | Proporcionar core/contrato como contexto; implementar envelope y revisión en runtime disponible | No probado; no prometer lectura automática de directorios/ZIP |
| Antigravity | Integrar core según capacidades reales del agente y permisos de repo | No probado; no asumir formato nativo |
| Workflow/otros agentes | Mapear input/output JSON, estado, retries y gate humano | Contrato diseñado; adaptador ejecutable no implementado |

La lógica de negocio no depende del proveedor. No clonar core por modelo. Antes de adaptar: verificar formato admitido, límites, tools, autenticación, almacenamiento, evaluación y autoridad. Traducir invocación/herramientas, preservar policy, procedimiento y schema. Un prompt importado no instala un agente ni conecta servicios. Sin herramientas, limitarse a análisis y marcar acciones sin ejecutar.
