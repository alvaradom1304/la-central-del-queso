---
name: n8n-webhook-architect
description: Diseña y documenta el flujo CRM Web → n8n → WhatsApp con validación, idempotencia, consentimiento, reintentos, observabilidad y plan de pruebas. No despliega ni envía mensajes reales sin autorización.
---

# N8N-WEBHOOK-ARCHITECT (Executive Protocol)

**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
## Contrato

- **Versión:** 1.0.0 | **Dominio:** operaciones e integración | **Tipo:** SOP técnico | **Estado:** experimental
- **Resultado:** arquitectura, contrato de payload, nodos y ramas de error del flujo; checklist de configuración y pruebas reproducibles.
- **Activar cuando:** se diseña o revisa intake de leads del sitio conectado a CRM y WhatsApp mediante n8n.
- **No activar cuando:** se pide poner secretos en código/logs, enviar WhatsApp a personas sin opt-in válido o eludir ventanas/plantillas de WhatsApp.
- **Dependencias:** `n8n-workflow-design`, `api-integration`, `api-security`, `authentication-security`, `authorization-security`.
- **Aprobación:** configurar credenciales, producción, migraciones CRM y mensajes reales requiere autorización expresa del dueño del sistema.

## SOP ejecutable

### 1. Levanta requisitos y límites

Recoge CRM, campos/IDs, origen de formularios, volumen, regiones, tratamiento de consentimiento, proveedor/WhatsApp Business Platform, número emisor, ventanas de servicio, SLA, dueño técnico, retención y política de reintento. No presupongas proveedor, endpoint, formato de plantilla ni ventana vigente. Consulta documentación oficial actual de n8n y Meta/WhatsApp y anota la fecha. Si consentimiento, jurisdicción, identidad del remitente o dueño de datos no está definido, deja el flujo en diseño y marca `BLOCKED` o `NEEDS_REVIEW`.

### 2. Especifica entrada y respuesta

Usa `references/input-schema.json` como base y adapta solo con aprobación. El formulario envía un identificador idempotente, nombre/medio de contacto, asunto/servicio, URL de origen y campos mínimos de consentimiento con texto/versión, fecha, fuente y propósito. No aceptes campos libres arbitrarios ni datos sensibles. Establece HTTPS, límites de tamaño y rate limit en el borde; agrega honeypot/CAPTCHA si procede. Para webhooks entrantes del proveedor, verifica firma y timestamp según su guía oficial. No trates un secreto compartido expuesto al navegador como autenticación segura.

### 3. Dibuja topología de nodos

Documenta el flujo y sus responsables antes de implementarlo:

`Formulario HTTPS → Webhook n8n (producción) → validar/normalizar → deduplicar → CRM → decisión de consentimiento → WhatsApp → persistir estado`

Ramas: error de validación → respuesta 4xx; duplicado → devolver el resultado anterior sin crear ni enviar otra vez; CRM fallido → cola/reintento acotado; sin opt-in → CRM solamente y tarea humana, nunca WhatsApp; WhatsApp no entregado → estado fallido, alarma y ruta de atención. La respuesta al sitio debe ser rápida y contener un `request_id`, no bloquear la experiencia esperando el mensaje.

### 4. Protege el webhook

Mantén separado URL de prueba y producción, método, ruta y respuesta; confirma la versión actual de n8n. Restringe acceso en el borde, valida tipo/contenido y esquema, limita tamaño/ritmo, evita filtrar URLs de webhook, y rota secretos si se exponen. El webhook de navegador no puede custodiar credenciales del servidor. No registres payloads completos ni tokens; sanea CR/LF y limita datos identificables en logs.

### 5. Normaliza y persiste idempotentemente

Normaliza teléfono a E.164 solo si el país se conoce; valida correo/teléfono y campos enum. Genera o exige un `submission_id` estable. Antes de insertar, consulta clave única/idempotency key y aplica operación upsert transaccional donde sea posible. Guarda timestamps UTC, fuente, estado de consentimiento, versión exacta del texto y evidencia de su captura. Nunca conviertas ausencia de consentimiento en consentimiento. CRM es el registro de estado; conserva `request_id`, `submission_id` y el ID de registro para reconciliación.

### 6. Aplica política de WhatsApp

Envía solo si consta opt-in aplicable a WhatsApp, propósito y número correctos, y no hay opt-out/supresión. Respeta la ventana de atención y reglas vigentes de Meta: fuera de la ventana permitida, usa una plantilla aprobada cuando corresponda. Proporciona una salida fácil y propaga STOP/opt-out a supresión antes de cualquier nuevo envío. Si el consentimiento es ambiguo o el proveedor no devuelve estado verificable, no envíes y genera revisión humana. Evita mensajes sensibles y limita contenido al propósito capturado.

### 7. Reintentos y observabilidad

Clasifica errores transitorios y permanentes. Reintenta solo transitorios con backoff exponencial y jitter, número máximo acotado e idempotencia. No reintentes 4xx de validación ni rechazos de política como si fueran errores temporales. Tras agotar intentos, manda a dead-letter/cola de errores y alerta con IDs correlacionables, no PII. Captura estados `accepted`, `sent`, `delivered`, `read`, `failed` solo si el proveedor los distingue; procesa webhooks de estado con verificación de firma y deduplicación. Programa reconciliación CRM ↔ proveedor.

### 8. Prueba y libera

En staging, usa test URL o credenciales sandbox y números controlados con opt-in; nunca datos reales por defecto. Prueba payload válido, campo inválido, duplicado, opt-out, falta de consentimiento, CRM timeout, rate limit, proveedor caído, webhook replay, firma inválida, delivery status duplicado y recuperación tras reintento. Verifica que ninguna ruta de error envía WhatsApp. Despliega solo con aprobación; monitoriza, define rollback/export de workflow y anota versión n8n, credenciales externas y fecha.

## Esqueleto de nodos (no es workflow importable)

1. Webhook Trigger → 2. Code/Set de validación y normalización → 3. Data Store/CRM lookup por idempotency key → 4. IF duplicado → respuesta/replay → 5. CRM upsert → 6. IF consent + no suppression + policy window → WhatsApp provider node/API con plantilla aprobada si se requiere → 7. persistir message ID/estado → 8. Respond to Webhook; ramas de error registran solo IDs y abren alerta.

Confirma las etiquetas y semántica exactas de nodos en la versión instalada de n8n antes de importar o ejecutar. Nunca presentes este esquema como JSON de workflow válido.

Consulta [contrato](references/contract.json), [protocolo](references/protocol.md), [entrada](references/input-schema.json), [salida](references/output-schema.json), [casos](references/evaluation-cases.json).

## Fuentes para verificar antes de ejecutar

- [n8n Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [n8n Webhook common issues](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/common-issues/)
- [WhatsApp Business Messaging Policy](https://business.whatsapp.com/policy)
- [WhatsApp Business opt-in guidance](https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in/)

Confirma siempre que las reglas y especificaciones sigan vigentes en la fecha de la campaña o despliegue.

## 2. Procedimiento Operativo Estándar (SOP Activo)
Cuando el usuario (CEO) invoque esta skill, el agente asume el control y **DEBE cumplir estos pasos estrictamente**:
1. **Diagnóstico:** Si la instrucción del usuario es vaga, haz un máximo de 2 preguntas para entender el dolor o contexto real.
2. **Ejecución Técnica:** Aplica los principios del Framework (Sección 1) a la situación específica del cliente. 
3. **Restricción de Calidad:** No uses lenguaje genérico de IA. Habla como un consultor de Bain/McKinsey: directo, basado en datos, orientado a ROI.

## 3. Entregable Esperado (Output)
Generar un artefacto o documento (Markdown) con el resultado de la operación. Debe terminar con una recomendación clara de "Próximo Paso".
