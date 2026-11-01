# web-quality-assurance — criterios de ingeniería

Cada evidencia debe identificar build, caso, condición, resultado observado y artefacto. Una captura de éxito no prueba escritura ni inventario: consultar fuente de verdad cuando esté autorizado. Simulaciones solo prueban los contratos simulados; un mock no verifica permisos o capacidades del proveedor. En teclado revisar orden, foco visible, diálogo, errores y salida de trampas; revisar movimiento reducido y contenido con efectos fallidos. No declarar conformidad WCAG por pasar una herramienta automática. Seleccionar la matriz según riesgo y acceso real, dejando NOT_RUN donde falten entorno o credenciales. No añadir pruebas que repitan la implementación sin comprobar comportamiento. Corregir bloqueadores de tarea antes de una entrega final y mantener el registro de defectos con responsable.

## Caso adverso determinante

El botón confirma visualmente el pedido, pero la base no tiene registro; con refresh aparece vacío y la prueba solo guarda una captura.

## Evidencia de aceptación

- Falla de persistencia bloquea release
- Verificar estado independiente UI/backend
- No certificar recorrido con captura o mock

Registrar entorno, build/versión, entrada, resultado esperado/observado y artefacto. Marcar NOT_RUN cuando no se ejecute; no sustituir una comprobación por una promesa de optimización futura.
