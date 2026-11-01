---
name: high-ticket-offer
description: "Define o revisa la oferta propia de Altiora de US$10.000 por proyecto (web + automatización B2B): alcance, exclusiones, hitos de pago, aceptación y mantenimiento opcional separado. Usar al empaquetar, ajustar o defender la oferta; para ofertas de clientes usar offers. No inventa ROI, urgencia ni garantías."
---

# HIGH-TICKET-OFFER (Executive Protocol)

**Rol de Agencia:** Especialista Técnico/Estratégico.
**Regla de Oro:** "Evidence before opinion. Business outcomes before execution."

## 1. Base de Conocimiento (Framework)
## Contrato

- **Versión:** 1.0.0 | **Dominio:** estrategia comercial y orquestación | **Tipo:** SOP de oferta | **Estado:** experimental
- **Resultado:** oferta y propuesta de sitio web + automatización, con precio objetivo de USD 3,000–5,000 sujeto a diagnóstico, viabilidad y aprobación.
- **Activar cuando:** se desea convertir servicios técnicos de web y automatización en un paquete claro para un cliente negocio.
- **No activar cuando:** alcance, capacidad o evidencia son insuficientes para sostener la promesa o el cliente requiere certificaciones/asesoría especializada no disponible.
- **Dependencias:** `sales-discovery`, `value-proposition-design`, `value-selling`, `pricing`, `pricing-optimization`, `sales-proposal`, `brand-positioning`.
- **Aprobación:** enviar cotización, términos legales, descuentos y compromisos de plazo necesita autorización humana.

## SOP ejecutable

### 1. Diagnostica antes de empaquetar

Completa `references/input-schema.json`. Entrevista sobre negocio y comprador: segmento, oferta y canal actual; flujo de cliente de hoy; fricción y costo en tiempo/dinero; frecuencia y volumen; herramientas y dueño de ellas; intentos previos; resultado deseado y cómo se mide; fecha límite real; autoridad decisoria; presupuesto; datos y permisos; soporte y capacidad del cliente. Distingue hechos, estimaciones del cliente, inferencias y propuestas. No calcules pérdida económica como hecho sin datos.

### 2. Decide elegibilidad

Comprueba si el problema es importante, cuantificable y resoluble con los servicios disponibles. Verifica acceso a contenido, dominio, CRM, proveedor de mensajería, decisor, datos y consentimiento. Estima horas, dependencias, riesgo, costos de terceros, mantenimiento y margen. Si el rango de USD 3k–5k no cubre el trabajo con margen mínimo acordado, reduce alcance, sube precio con justificación o declara `BLOCKED`; no recortes QA, seguridad o integración necesaria para forzar el número. No ofrezcas un resultado de negocio bajo control de terceros como garantía.

### 3. Define el resultado y el mecanismo

Formula un resultado observable de implementación, no una promesa absoluta de ingresos: por ejemplo “publicar un sitio de conversión con formulario que crea/actualiza el lead en CRM y habilita seguimiento autorizado”. Ata cada entregable a un problema descubierto y a una medida verificable. Explica el mecanismo: sitio, formulario, integración, reglas, notificación, analítica, formación. Incluye línea base y métrica de adopción/operación cuando el cliente pueda medirla.

### 4. Empaqueta alcance en etapas

Propón etapas apropiadas al diagnóstico, de forma típica:

1. **Descubrimiento y arquitectura:** requisitos, mapa de conversión, datos, integraciones y criterios de aceptación.
2. **Diseño y construcción web:** páginas, contenido que entrega el cliente, formularios, responsive y analítica acordada.
3. **Automatización:** flujo documentado (p. ej. Web → n8n → CRM/WhatsApp), validaciones, consentimiento, idempotencia, manejo de errores y registro mínimo.
4. **QA y lanzamiento:** pruebas acordadas, capacitación, documentación, handover y periodo de corrección de defectos.

Para cada entregable establece cantidad, herramientas, responsable, dependencias, fecha estimada, prueba de aceptación y exclusiones. Aclara costos/licencias/hosting/proveedor de WhatsApp, copy/fotos, migración, integraciones fuera de alcance, idiomas, soporte y cambios. Define propiedad, acceso, respaldo y transferencia al cliente.

### 5. Elige precio y opciones

Calcula precio desde horas/costo real + herramientas + riesgo + margen objetivo; usa USD 3,000–5,000 como rango de referencia solicitado, no como precio automático. Anota supuestos y qué cambia el precio. Presenta una opción recomendada y como máximo dos alcances alternativos (menor inicial o mayor soporte), cada uno con entregables equivalentes y límites claros. Desglosa pago por hitos y qué activa cada pago. No uses “valor” ficticio, ancla inflada, descuento inventado, escasez falsa ni tarifas ocultas.

### 6. Establece responsabilidades y gestión del cambio

Incluye cronograma dependiente de la entrega oportuna de materiales, accesos, aprobaciones y consentimiento por parte del cliente. Nombra las decisiones que debe tomar el cliente. Define una ronda de revisión por fase si ese es el límite acordado, criterios objetivos de aceptación, ventana para reportar defectos, tratamiento de cambios y tarifas/proceso para trabajo adicional. Separa garantía de corrección de defectos de soporte continuo/hosting y de resultados comerciales.

### 7. Escribe propuesta y conversación

Entrega resumen del problema confirmado, impacto con fuente, resultado objetivo, enfoque, alcance y exclusiones, inversión/opciones, hitos, cronograma, responsabilidades, riesgos, métricas, términos por revisar y próximo paso. Incluye preguntas para validar objeciones y decisiones; no uses lenguaje de “oferta irresistible” que oculte condiciones. Toda proyección incluye fórmula, supuestos y etiqueta de estimación. Si no hay baseline, define cómo establecerla.

### 8. Revisión humana

Valida aritmética, margen, impuestos/moneda, fechas, capacidad, dependencias, licencias, privacidad/consentimiento, claims, exclusiones y términos legales. Devuelve `NEEDS_REVIEW` si falta aprobación del dueño de entrega o revisión legal/fiscal aplicable. Salida es borrador; no enviar, firmar ni prometer fechas al cliente.

## Señales de una buena oferta

- El comprador entiende para quién es, qué se implementa y qué queda fuera.
- El mecanismo técnico conecta con un problema documentado y el éxito puede inspeccionarse.
- El precio tiene una lógica de costo/margen y condicionantes explícitos.
- Se preservan QA, seguridad, accesibilidad razonable, consentimiento y transferencia de propiedad.
- No hay garantía de ventas/ROI ni presión comercial inventada.

Consulta [contrato](references/contract.json), [protocolo](references/protocol.md), [entrada](references/input-schema.json), [salida](references/output-schema.json) y [casos](references/evaluation-cases.json).

## Fuentes para verificar antes de ejecutar

- Related pricing and value design skills are listed in contract.json.

Confirma siempre que las reglas y especificaciones sigan vigentes en la fecha de la campaña o despliegue.

## 2. Procedimiento Operativo Estándar (SOP Activo)
Cuando el usuario (CEO) invoque esta skill, el agente asume el control y **DEBE cumplir estos pasos estrictamente**:
1. **Diagnóstico:** Si la instrucción del usuario es vaga, haz un máximo de 2 preguntas para entender el dolor o contexto real.
2. **Ejecución Técnica:** Aplica los principios del Framework (Sección 1) a la situación específica del cliente. 
3. **Restricción de Calidad:** No uses lenguaje genérico de IA. Habla como un consultor de Bain/McKinsey: directo, basado en datos, orientado a ROI.

## 3. Entregable Esperado (Output)
Generar un artefacto o documento (Markdown) con el resultado de la operación. Debe terminar con una recomendación clara de "Próximo Paso".
