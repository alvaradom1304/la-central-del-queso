# automation-design — criterios de ingeniería

Para Make/Zapier/Base44 verificar trigger, payload, cuotas, consistencia, historial y recuperación disponibles en la cuenta; no deducir capacidad transaccional del nombre de la plataforma. Calcular ahorro neto como tiempo evitado menos supervisión, excepciones y mantenimiento, sin contabilizarlo de nuevo como ingreso. Medir volumen útil y tasa de excepción, no solo ejecuciones. Si se usa IA, definir confianza operativa mediante evaluación real, casos de abstención y revisión, no una etiqueta autodeclarada. Registrar si la automatización está diseñada, simulada, conectada o activa. Separar estado de workflow de estado comercial. Mantener un responsable para fallos de precio, stock, entrega y mensajes; rollback del código no revierte efectos externos.

## Caso adverso determinante

Una automatización de pedidos funciona en simulación pero el conector no ofrece reserva atómica; dos compradores solicitan el último producto.

## Evidencia de aceptación

- No prometer inventario sincronizado por simulación
- Resolver fuente de verdad/concurrencia o confirmación manual
- Registrar costo y capacidad de excepciones

Registrar entorno, build/versión, entrada, resultado esperado/observado y artefacto. Marcar NOT_RUN cuando no se ejecute; no sustituir una comprobación por una promesa de optimización futura.
