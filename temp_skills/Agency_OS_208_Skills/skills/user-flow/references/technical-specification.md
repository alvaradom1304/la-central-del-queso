# user-flow — criterios de ingeniería

No confundir sitemap, pantalla o wireframe con flujo de tarea. En checkout separar validación local de confirmación de stock/precio/entrega y estado del pedido. Modelar la vuelta desde WhatsApp: abrir la app no implica que se envió mensaje. Mantener selección o explicar qué caducó tras refresh. Distinguir error corregible por el usuario de fallo que requiere soporte. Cada bifurcación necesita condición determinable y salida; evitar loops sin mecanismo de escape. No marcar tarea exitosa por llegar a una pantalla si falta el efecto comercial.

## Caso adverso determinante

El usuario abre WhatsApp, vuelve sin enviar y actualiza la página; el flujo lo marca como compra y borra el carrito.

## Evidencia de aceptación

- Resolver el fallo específico con evidencia y límites
- No cerrar con contradicción material o resultado inventado
- Entregar criterios verificables y responsables operativos según alcance

Registrar entorno, build/versión, entrada, resultado esperado/observado y artefacto. Marcar NOT_RUN cuando no se ejecute; no sustituir una comprobación por una promesa de optimización futura.
