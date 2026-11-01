# Arquitectura de comercio inmersivo — especificación operativa

Leer antes de desarrollar pedidos o aprobar el recorrido. Adaptar el modelo a la unidad de venta y al canal real. El ejemplo quesero es un caso de aplicación, no un supuesto sobre otros clientes.

## Decisión de arquitectura

Separar cuatro capas: contenido/compra accesible; identidad y narrativa; movimiento/3D progresivo; operación/medición. La falla de una capa ornamental no debe impedir las tareas comerciales. Comparar CSS/imágenes, GSAP y 3D por función, costo inicial, descarga, ejecución, mantenimiento y capacidad del equipo. Elegir 3D solo cuando su aporte tenga una hipótesis clara y sobreviva al presupuesto técnico. No equiparar una web sobria con una entrega de menor calidad.

Definir ADRs para renderizado, contenido, carrito, pedidos, inventario, eventos y automatización. Documentar alternativa descartada, dependencia de proveedor, costo recurrente, fallback, owner y recuperación. Verificar versiones/documentación del proveedor antes de código específico.

## Contrato de pedido

Como mínimo especificar order_id, schema_version, created_at, currency, items, delivery_zone, delivery_method, payment_method, totals, status y referencia segura al cliente. Para cada item: product_id/SKU, variant_id cuando corresponda, quantity, quantity_unit, sale_unit, unit_price, price_version y subtotal. En venta por peso, registrar explícitamente si se cotiza peso estimado o cobro final pesado; aclarar cómo se confirma una diferencia. Definir impuestos, envío, redondeo y caducidad de cotización según la oferta y reglas verificadas.

No calcular dinero con flotantes binarios. Usar decimal o unidades monetarias menores con escala explícita. Normalizar g/kg y paquetes/piezas solo con conversiones conocidas; rechazar unidad desconocida, cantidad no positiva/no finita y variantes inexistentes. Revalidar precio, stock, cobertura y condiciones en el servidor o en la confirmación humana si el canal es manual. Nunca confiar en el total enviado por el navegador.

## Estados y concurrencia

Separar draft, submitted, confirmed, preparing, dispatched, delivered, cancelled; definir transiciones válidas y responsables. La recepción del mensaje no confirma disponibilidad, entrega ni cobro. En contra entrega, dispatched y delivered tampoco prueban cobro: mantener collection_status independiente y reconciliar lo efectivamente recibido.

Definir cuándo se reserva stock, vencimiento y liberación. La deduplicación del webhook no evita dos compradores compitiendo por la última unidad: usar una operación atómica/condicional de reserva, o confirmación manual explícita si la plataforma no ofrece garantía. No prometer inventario en tiempo real cuando hay retraso o conciliación manual. Registrar updated_at y lag visible cuando importe.

## WhatsApp y automatización

Un enlace click-to-chat prepara texto editable; no da confirmación de envío ni estructura confiable para inventario. Minimizar datos personales en URLs, historiales y analítica. Para pedidos manuales incluir un ID de cotización y resumen claro; validar los datos cuando el cliente los envíe. Para Cloud API comprobar requisitos de cuenta, mensajes, consentimiento, autenticación y webhooks en documentación vigente. Mantener credenciales exclusivamente del lado servidor.

En Make/Zapier/Base44 mapear campos, capacidades reales, cuotas, autenticación, errores y mecanismos de persistencia; no asumir transacciones o conectores disponibles. Diseñar recepción → persistencia duradera → procesamiento → actualización → conciliación. Confirmar recepción solo tras una transferencia durable acorde al protocolo. Procesar eventos duplicados idempotentemente por ID del proveedor y alcance; registrar estado por entidad, no solo una caché local. Distinguir HTTP de transporte, estado del mensaje y estado del pedido.

Para timeout después de un efecto posiblemente aplicado, reconciliar por ID antes de repetir una escritura. Definir reintentos acotados, espera/jitter, errores no reintentables, cola de fallos y dueño de resolución. No aplicar reintento ciego sobre cobros, stock o confirmaciones. Diseñar compensaciones explícitas; rollback de una automatización no deshace un mensaje ya enviado.

## Instrumentación y privacidad

Separar product_view, selection, quote_created, whatsapp_open, message_received, order_confirmed, order_delivered, collection_recorded y repeat_order. Asociar eventos con event_id, order_id seguro, timestamp, origen y versión. whatsapp_open es intención de canal; no es conversión de venta. Definir denominadores y ventanas por cohorte, exclusión de pruebas/bots y cobertura de tracking. No enviar teléfono/dirección ni texto del cliente a analítica de comportamiento.

Medir contribución tras costos variables relevantes, cancelaciones, devoluciones, respuesta, fulfillment y cobro. No usar facturación bruta para justificar una campaña de margen negativo. Cuando no existe atribución suficiente, declarar el límite y usar evidencia operativa disponible.

## Matriz de aceptación del recorrido

Comprobar: compra con movimiento reducido; teclado y foco; móvil/red lenta; recurso 3D fallido; cotización caducada; producto agotado; cambio de precio; g/kg; zona sin cobertura; doble envío; eventos duplicados/fuera de orden; timeout tras persistir; integración caída; pedido cancelado con reserva; entrega fallida; contra entrega sin cobro. Incluir retorno/refresh en carrito y confirmación, error comprensible sin perder selección y recuperación operativa. Seleccionar los casos pertinentes al alcance y registrar los no ejecutables; no fabricar una prueba end-to-end sin cuentas, datos y conectores.

La primera entrega debe tener una alternativa funcional verificable, estados adversos diseñados, contratos completos y responsable operativo. Perfeccionar movimiento o contenido después no debe servir para posponer compra, accesibilidad, datos ni recuperación.
