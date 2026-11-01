---
name: cold-outbound-system
description: Investiga y prepara prospección B2B personalizada y verificable con fuentes públicas permitidas, produce borradores de correo y seguimientos sujetos a revisión humana. No automatiza scraping ni envía mensajes.
---

# COLD-OUTBOUND-SYSTEM (Executive Protocol)

**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
## Contrato

- **Versión:** 1.0.0 | **Dominio:** ventas B2B | **Tipo:** SOP compuesto | **Estado:** experimental
- **Resultado:** una lista priorizada de cuentas/contactos con evidencia fechada y un conjunto de correos individualizados, listos para revisión y envío autorizado.
- **Activar cuando:** se solicita encontrar prospectos de negocio, preparar una campaña de correo frío o adaptar mensajes a señales públicas.
- **No activar cuando:** se pretende contactar consumidores sin base apropiada, evadir controles de una plataforma, recolectar categorías sensibles, inferir datos privados o enviar mensajes sin autorización.
- **Dependencias:** `prospecting`, `lead-generation`, `fanatical-prospecting`, `sales-follow-up`, `value-proposition-design`, `api-security` (si hay integración técnica).
- **Herramientas permitidas:** búsqueda web/Google, páginas públicas de empresas, directorios empresariales y herramientas oficiales con acceso autorizado. LinkedIn solo mediante uso manual y permitido o una integración oficial autorizada; no automatizar acceso ni extracción.
- **Aprobación:** toda lista, texto y secuencia se entrega como borrador. Antes de enviar, un humano debe aprobar destinatarios, fundamento de contacto, contenido, jurisdicción y canal.

## SOP ejecutable

### 1. Aclara campaña y oferta

Lee `references/protocol.md` y recoge los campos requeridos en `references/input-schema.json`. Identifica ICP, segmento, geografía, problema que resuelve la oferta, prueba disponible, precio/rango si puede divulgarse, CTA, capacidad de entrega, idiomas, volumen y exclusiones. Si falta el ICP, la oferta o la geografía, pregunta lo mínimo necesario y pausa la investigación masiva. Nunca inventes clientes, resultados, credenciales o garantías.

### 2. Traduce el ICP en criterios observables

Convierte el ICP a filtros empresariales verificables: industria, región, tamaño aproximado, modelo, tecnología o señal de necesidad pública. Define señales de compra que puedan citarse literalmente o resumirse con fuente y fecha (p. ej., contratación relevante, nueva ubicación, lanzamiento, migración tecnológica anunciada). Separa criterios obligatorios de señales preferentes. No uses raza, salud, religión, orientación, afiliación política u otros atributos sensibles.

### 3. Encuentra cuentas con fuentes públicas

Busca la organización primero mediante consultas específicas en motores de búsqueda y páginas públicas propias. Para LinkedIn, limita la actividad a navegación manual conforme a sus condiciones o a una API/integración oficial con permisos; no uses scraping, extensiones de extracción, bots, sesiones automatizadas ni elusión de límites. No recolectes datos de grupos cerrados ni perfiles privados. Registra por cada cuenta el nombre, dominio, región, ajuste ICP, señal, URL fuente, fecha de consulta y nivel de confianza. Si no hay prueba pública, marca “sin señal verificada”, no la inventes.

### 4. Identifica el rol y minimiza datos

Busca primero el rol profesional adecuado en el sitio corporativo o en fuentes públicas legítimas. Guarda solo datos laborales necesarios. No adivines patrones de correo ni presentes un correo inferido como verificado. Si solo se encuentra un contacto general, propone ese canal o marca el contacto como pendiente. Para datos personales profesionales, registra fuente, fecha y finalidad. Aplica exclusiones, listas de supresión y solicitudes previas de no contacto.

### 5. Califica y prioriza

Puntúa de 0 a 5: ajuste ICP (40%), relevancia de señal (30%), acceso al rol (15%) y evidencia/confianza (15%). Calcula el total ponderado sobre 100 y explica cada puntuación con evidencia. Descarta automáticamente si hay opt-out, conflicto con exclusiones, señal irrelevante, fuente no permitida o solo información sensible. No compenses evidencia débil con una puntuación alta de ajuste.

### 6. Redacta mensajes individuales

Para cada contacto elegible, crea asunto claro (sin engaño), apertura basada en una señal específica, relación concisa entre señal y problema, propuesta de valor solo respaldada por el brief, prueba verificada si existe, y CTA de baja fricción. El correo debe ser breve, profesional y fácil de rechazar; no finjas relación previa ni crees urgencia falsa. Personaliza con una observación pertinente, no con detalles personales irrelevantes. Entrega versión de 70–130 palabras y una alternativa más corta de 40–70 palabras; ajusta al idioma solicitado.

### 7. Diseña seguimientos sobrios

Propón como máximo dos seguimientos, espaciados (por ejemplo, 4–6 y 7–10 días hábiles), cada uno con información útil distinta. Detén la secuencia ante respuesta, rebote, queja u opt-out. Incluye instrucciones para identificar remitente, dirección física y mecanismo de baja donde lo exijan las reglas aplicables. Señala que el usuario debe validar normas locales de marketing directo, privacidad y correo comercial antes de activar.

### 8. Revisión y entrega

Comprueba nombres, cargos, dominio, actualidad de cada fuente, afirmaciones, destinatario, idioma y mecanismo de baja. Si una página no se puede abrir o confirmar, baja confianza y deja el campo vacío. Genera la salida con el sobre de `references/output-schema.json`, incluyendo evidencia, supuestos, faltantes, validación y siguiente acción. No envíes, importes a CRM ni actives secuencias.

## Reglas de decisión y límites

- **Alta confianza:** fuente primaria reciente confirma organización y señal; el dato de contacto está publicado de manera legítima.
- **Media:** ajuste sólido, pero la señal o el contacto requiere confirmación humana. No incluir como listo para envío.
- **Baja:** no se encontró señal pertinente o fuente fiable. Excluir de la campaña y reportar la brecha.
- Si la ley aplicable, el consentimiento/base legal o el mecanismo de opt-out es incierto, devuelve `NEEDS_REVIEW` y no propongas enviar.
- No redactes afirmaciones comparativas, cifras de ROI ni referencias de cliente salvo que estén documentadas y autorizadas.

## QA antes de entregar

1. Cada prospecto tiene evidencia enlazada, fecha y confianza.
2. La puntuación se puede recalcular desde sus componentes.
3. No hay correo adivinado ni dato sensible.
4. Cada mensaje usa una señal cierta y claims autorizados.
5. La secuencia se detiene al recibir respuesta/opt-out y explica la revisión legal requerida.
6. La salida declara expresamente “borrador; no enviado”.

Consulta [contrato](references/contract.json), [protocolo](references/protocol.md), [esquema de entrada](references/input-schema.json), [esquema de salida](references/output-schema.json) y [casos de evaluación](references/evaluation-cases.json).

## Fuentes para verificar antes de ejecutar

- [LinkedIn User Agreement](https://www.linkedin.com/legal/user-agreement)
- [LinkedIn prohibited software and scraping](https://www.linkedin.com/help/linkedin/answer/a1341387)
- [FTC CAN-SPAM compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)

Confirma siempre que las reglas y especificaciones sigan vigentes en la fecha de la campaña o despliegue.

## 2. Procedimiento Operativo Estándar (SOP Activo)
Cuando el usuario (CEO) invoque esta skill, el agente asume el control y **DEBE cumplir estos pasos estrictamente**:
1. **Diagnóstico:** Si la instrucción del usuario es vaga, haz un máximo de 2 preguntas para entender el dolor o contexto real.
2. **Ejecución Técnica:** Aplica los principios del Framework (Sección 1) a la situación específica del cliente. 
3. **Restricción de Calidad:** No uses lenguaje genérico de IA. Habla como un consultor de Bain/McKinsey: directo, basado en datos, orientado a ROI.

## 3. Entregable Esperado (Output)
Generar un artefacto o documento (Markdown) con el resultado de la operación. Debe terminar con una recomendación clara de "Próximo Paso".
