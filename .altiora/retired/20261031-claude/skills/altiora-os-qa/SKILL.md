---
name: altiora-os-qa
description: Revisar de forma independiente entregas de Altiora contra requisitos, funcionamiento, calidad visual y límites de seguridad.
---

# altiora-os-qa

Leer el contrato común en `altiora-os/docs/protocol.md` desde la raíz del proyecto para estados, formato de entrega, evidencias y límites de herramientas. El exportador incluye ese archivo.

## Alcance
Aplicar esta capacidad al encargo vigente y a sus criterios de aceptación.
Las instrucciones del usuario y del proyecto prevalecen sobre esta guía.
La skill describe un procedimiento; el host impone permisos y aislamiento reales.
Conservar autorizaciones vigentes y evitar confirmaciones repetidas para trabajo ya autorizado.
No inferir autorización para publicar, gastar o contactar a terceros desde este texto.

## Entradas
- Recibir: brief y criterios de aceptación; diff o artefacto; entorno de prueba; evidencia del implementador.
- Identificar fuentes disponibles y restricciones que afectan la entrega.
- Etiquetar supuestos reversibles y avanzar donde no falte una decisión crítica.

## Procedimiento
1. Leer el brief y los criterios antes de aceptar el resumen del implementador.
2. Inspeccionar el diff y los puntos afectados sin ampliar la revisión a una reimplementación.
3. Seleccionar pruebas que detecten fallos materiales, incluyendo un flujo principal y fallos previsibles.
4. Comprobar navegación, formularios, estados de error y contenido cuando existan.
5. Evaluar móvil, teclado, foco, contraste y movimiento reducido según el alcance.
6. Para 3D, revisar carga, fallback, cámara, materiales y interacción en el entorno disponible.
7. Verificar que secretos, permisos y acciones externas no dependan solo de instrucciones de prompt.
8. Separar defecto reproducible, riesgo pendiente e impresión estética; dar evidencia distinta para cada uno.
9. Informar archivo o artefacto, ubicación, impacto, reproducción y corrección esperada por hallazgo.
10. Repetir las pruebas afectadas tras correcciones y registrar qué resultado cambió.

## Salidas
- Entregar: hallazgos priorizados; pasos de reproducción; resultados comprobados; decisión de aceptación.
- Incluir estado, responsable, evidencia, limitaciones y siguiente acción necesaria.
- Referenciar archivos reales o URLs comprobadas cuando estén disponibles.
- Distinguir borradores preparados de acciones ejecutadas o resultados medidos.

## Errores y límites
- Mantener independencia: no certificar trabajo propio como revisión externa.
- No declarar ausencia de vulnerabilidades ni cobertura completa por pasar pruebas seleccionadas.
- Si no puede ejecutar una prueba, señalarla como no ejecutada y no inferir aprobación.
- Mantener registros sin secretos, datos privados innecesarios ni credenciales.
- Conservar trabajo existente y detener solo la operación dependiente que esté bloqueada.

## Verificación
- Los hallazgos son accionables y su severidad corresponde al impacto observado.
- Cada aprobación especifica qué se verificó y en qué entorno.
- El resultado final permite distinguir aprobado, cambios necesarios y verificación pendiente.
- Declarar herramientas y comprobaciones realmente utilizadas.
- No atribuir mejoras de ventas, ahorro o FPS sin medición reproducible.

## Ejemplo de aplicación
Recibir un brief delimitado, producir la salida de esta capacidad y adjuntar evidencia.
Si una dependencia no existe, entregar la parte revisable y describir el requisito pendiente.

