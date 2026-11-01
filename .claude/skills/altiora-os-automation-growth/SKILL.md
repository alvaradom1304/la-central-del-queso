---
name: altiora-os-automation-growth
description: "Diseña marketing medible (campañas, experimentos) o automatizaciones operativas (flujos de datos y eventos) con métricas y límites. Usar para medición y crecimiento posteriores a la entrega o para planear automatizaciones; para el flujo web→n8n concreto usar n8n-webhook-architect."
---

# altiora-os-automation-growth

Leer el contrato común en `altiora-os/docs/protocol.md` desde la raíz del proyecto para estados, formato de entrega, evidencias y límites de herramientas. El exportador incluye ese archivo.

## Alcance
Aplicar esta capacidad al encargo vigente y a sus criterios de aceptación.
Las instrucciones del usuario y del proyecto prevalecen sobre esta guía.
La skill describe un procedimiento; el host impone permisos y aislamiento reales.
Conservar autorizaciones vigentes y evitar confirmaciones repetidas para trabajo ya autorizado.
No inferir autorización para publicar, gastar o contactar a terceros desde este texto.

## Entradas
- Recibir: objetivo; variante; audiencia o proceso; canales; datos disponibles; integraciones y autorización vigentes.
- Identificar fuentes disponibles y restricciones que afectan la entrega.
- Etiquetar supuestos reversibles y avanzar donde no falte una decisión crítica.

## Procedimiento
1. Elegir variante marketing si el objetivo es mensaje, adquisición, retención o experimento.
2. Elegir variante automatización si el objetivo es transferir datos, ejecutar eventos o reducir trabajo repetido.
3. En marketing, definir audiencia, problema, oferta, canal y acción de conversión.
4. Redactar piezas acordes a la marca sin testimonios, urgencia o resultados inventados.
5. Definir experimento con hipótesis, métrica, población, ventana y condición de parada.
   Registrar baseline y fuente; si se desconoce, preparar su medición y no afirmar incremento ni atribución causal.
6. En automatización, dibujar origen, validación, transformación, destino y propietario de datos.
7. Definir contrato de entrada y salida, autenticación, idempotencia, reintentos y cola de errores.
8. Preparar flujos n8n como borradores inactivos, sin credenciales incorporadas ni llamadas reales por defecto.
9. Probar payloads sintéticos, duplicados, campos ausentes y fallos del destino mediante mocks o modo de prueba.
10. En ambos modos, distinguir preparar una entrega de ejecutar mensajes, campañas, pagos o publicaciones.

## Salidas
- Entregar: plan de campaña o contrato de flujo; borradores o configuración; pruebas; métricas y límites.
- Incluir estado, responsable, evidencia, limitaciones y siguiente acción necesaria.
- Referenciar archivos reales o URLs comprobadas cuando estén disponibles.
- Distinguir borradores preparados de acciones ejecutadas o resultados medidos.

## Errores y límites
- Usar conectores solo si están disponibles y dentro de permisos y autorización reales.
- No crear seguimiento periódico ni activar flujos por la sola existencia de esta skill.
- Si la integración falta, entregar contrato y configuración importable con activación pendiente.
- Mantener registros sin secretos, datos privados innecesarios ni credenciales.
- Conservar trabajo existente y detener solo la operación dependiente que esté bloqueada.

## Verificación
- Marketing: contenido y métrica responden al objetivo; resultados estimados están etiquetados.
- Automatización: duplicados no repiten efectos y los errores tienen un destino observable.
- Toda acción externa ejecutada tiene autorización vigente y evidencia de su resultado.
- Declarar herramientas y comprobaciones realmente utilizadas.
- No atribuir mejoras de ventas, ahorro o FPS sin medición reproducible.

## Ejemplo de aplicación
Recibir un brief delimitado, producir la salida de esta capacidad y adjuntar evidencia.
Si una dependencia no existe, entregar la parte revisable y describir el requisito pendiente.

