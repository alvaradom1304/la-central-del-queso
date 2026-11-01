# Pedidos, WhatsApp y automatización

## Elegir el nivel de integración

| Necesidad | Opción | Límite que debe quedar explícito |
|---|---|---|
| Abrir conversación con resumen del carrito | Enlace a WhatsApp con texto codificado | No requiere por sí solo WhatsApp Business API; no confirma envío, recepción ni venta. |
| Registrar pedido con ID antes de conversar | Backend/formulario y base de datos, más enlace de seguimiento | Diseñar persistencia, validación y consentimiento; abrir WhatsApp no completa el pedido. |
| Procesar mensajes y automatizar atención | WhatsApp Business Platform/API y webhooks si son adecuados | Verificar configuración, credenciales, políticas, consentimiento, plantillas y costos vigentes en documentación oficial. |

No pedir credenciales en el chat ni incorporarlas al código cliente. Verificar herramientas de Meta/proveedor disponibles y el alcance autorizado antes de operar una cuenta.

## Contrato mínimo de pedido

Definir ID estable, fecha, productos/SKUs, unidades, cantidades, precio y moneda, total estimado/final, entrega y costo, método de pago, estado y responsable. Recoger contacto y dirección solo cuando sean necesarios; evitar colocar datos personales innecesarios en URLs o analítica. Validar precio y disponibilidad en el servidor si existe backend; no confiar en totales enviados por el navegador.

Modelar estados según operación: borrador → recibido → confirmado → preparado → en ruta → entregado; admitir rechazado/cancelado y pago pendiente/confirmado como dimensión separada. Para pago contra entrega, no marcar pagado al crear el pedido. Aclarar dónde ocurre confirmación y cómo se notifican cambios.

## Inventario y logística

Elegir fuente de verdad y unidades; para productos por peso definir conversión y peso final. Distinguir existencia física, cantidad reservada y disponible. Establecer cuándo reservar, descontar, liberar y registrar merma; manejar concurrencia si hay varios canales.

No prometer inventario en tiempo real si ferias, teléfono o compras siguen sin registrarse. Proponer reconciliación y responsables con la frecuencia viable. Validar cobertura, rutas, ventanas, pedido mínimo, capacidad y excepciones antes de automatizar entregas.

## Make, Zapier, n8n o Base44

Elegir según acceso, integraciones vigentes, costo, volumen, mantenimiento y capacidad del cliente; no asumir que Base44 ofrece cualquier API o webhook.

Especificar evento origen → validación → persistencia → acción → registro → manejo de errores. Definir idempotencia, autenticación, reintentos limitados, duplicados, alertas y recuperación manual. Comprobar firmas de webhooks cuando la plataforma lo soporte. Registrar latencia real y distinguir sincronización eventual de tiempo real.

Probar pedido correcto, datos inválidos, doble envío, stock insuficiente, servicio caído, pago pendiente y cancelación. Asegurar que cada pedido tenga trazabilidad sin exponer datos personales en logs. Mantener intervención humana para excepciones y promesas que la automatización no pueda garantizar.
