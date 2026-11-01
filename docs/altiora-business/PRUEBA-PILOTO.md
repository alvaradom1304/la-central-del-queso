# Evidencia del piloto · uso interno

Revisión de código del 31/10/2026 por explorador independiente, con `altiora-quality-review`. No se ejecutaron la web, pruebas, conexiones o envíos; tampoco se copiaron imágenes o datos del cliente. Estado: **código observado; demostración en ejecución pendiente**. No es material publicado ni permiso para usar la identidad del piloto.

## Afirmaciones permitidas con su límite

| Observación de código | Referencia interna | Lo que no acredita |
|---|---|---|
| La portada integra catálogo, recomendador y carrito; hay acciones de añadir productos | `web/app/page.tsx:38`, `web/components/FincaToTableExperience.tsx:872`, `:909`, `web/components/CheeseMatcher.tsx:172` | Funcionamiento reciente, móvil, accesibilidad o conversiones |
| El carrito intenta recuperar/guardar datos en sessionStorage y captura errores de almacenamiento | `web/lib/CartContext.tsx:33` | Registro durable, pedido recibido o sincronización |
| El manejador prepara una consulta y abre WhatsApp usando una línea marcada provisional; no llama a /api/orders | `web/components/CartDrawer.tsx:39`, `:66`, `:286` | Mensaje enviado, destinatario validado, respuesta, cobro o venta |
| La ruta API separada valida presencia de campos, genera identificador y despacha un webhook opcional sin esperar confirmación HTTP | `web/app/api/orders/route.ts:12`, `:27`, `:30`, `:58` | Escritura durable, automatización conectada, recepción de webhook o validación suficiente de cantidades/precios |
| Hay comandos de desarrollo/build/lint; el SOP espera un recorrido con orden/Sheets que difiere del carrito actual | `web/package.json:5`, `web/TESTING_SOP.md:26` | Pruebas recientes pasadas, producción, ingresos o SLA |

Las rutas se refieren exclusivamente al checkout local del piloto: `C:/Users/Usuario/OneDrive/Desktop/client-central-del-queso`. No se modificó ese repositorio ni se consultaron secretos. Las observaciones están acotadas al código inspeccionado, no a infraestructura externa o despliegues.

El [manifiesto privado de hashes](PILOT-SOURCE-MANIFEST.json) identifica los ocho archivos inspeccionados. Un cambio exige volver a evaluar la afirmación afectada; el hash no demuestra ejecución, producción o derechos de publicación.

## Reevaluación del 31/10/2026, tras implementar el pedido por API

Decisión del fundador: el piloto registra los pedidos por API. Claude Code cambió `CartDrawer.tsx`, `route.ts`, `package.json` y `TESTING_SOP.md`, y añadió `lib/orders.ts`, `orderStore.ts`, `orderService.ts` y sus pruebas, sin hacer commit en `web`. Por eso el manifiesto anterior da FAIL en esos cuatro archivos. Las filas de la tabla de arriba que los citan describen **el código anterior**. La versión actual está en el [manifiesto de la implementación](entrega/evidencia/piloto-pedido-api-2026-10-31.json) (12 archivos, PASS).

| Afirmación actual | Evidencia | Lo que no acredita |
|---|---|---|
| El carrito envía los productos a `POST /api/orders` y muestra un número de pedido o un error | Código y `tsc`/`next build` PASS | Que funcione en un navegador real (NO VERIFICADO) |
| El servidor recalcula precios desde el catálogo, rechaza datos inválidos o un total manipulado, y guarda antes de avisar | `npm test` 12/12 PASS (pruebas unitarias y de servicio con almacén en memoria y archivo) | Comportamiento con tráfico real |
| Si falla el aviso, el pedido queda guardado como `NOTIFY_FAILED` | Prueba automática | Recepción en n8n o Sheets, que no se probó |
| En Vercel, sin destino durable, responde 503 en lugar de perder pedidos | Código revisado | Un destino durable de producción, que no existe todavía |

Detalle en [EJEMPLO-PILOTO.md](entrega/EJEMPLO-PILOTO.md).

## Qué puede decir Altiora ahora

«Hemos implementado un prototipo de selección de productos con registro de pedidos por API: valida y calcula precios en el servidor, y está cubierto por pruebas automáticas. Falta comprobar la ejecución en navegador, el aviso al negocio y un destino de producción.»

No decir «automatizamos los pedidos del cliente», «integramos Sheets/n8n», «generamos ventas» o «este caso valida US$10.000» sin evidencia adicional y permiso de uso.

## Demostración interna propuesta · 90 segundos

Con datos, nombres e imágenes sintéticos: selección → cantidades → canasta → vista previa de consulta. No abrir ni enviar a una línea externa. Mostrar expresamente qué es prototipo y qué integración falta. Registrar versión, fecha, entorno y resultados antes de afirmar que la demostración pasó. La propuesta todavía no se ejecutó.

Para probar una entrega comercial, primero decidir con el responsable si el recorrido de aceptación usa WhatsApp como consulta o una orden durable con API. Alinear interfaz, backend y SOP con esa decisión; verificar destino autorizado, recuperación ante fallo y recepción. No completar datos de producción ni conectar servicios por inferencia.

Próximo paso técnico: preparar una prueba interna con datos sintéticos y criterios claros; mantener cualquier afirmación de integración o resultado comercial en HOLD hasta obtener evidencia.
