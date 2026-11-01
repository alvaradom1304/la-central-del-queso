---
name: altiora-os-media
description: "Produce y prepara activos 3D, imagen o vídeo (Blender y herramientas multimedia disponibles) con ficha técnica, procedencia y derechos. Usar cuando un proyecto necesita modelos, renders, imágenes o vídeo reales."
---

# altiora-os-media

Leer el contrato común en `altiora-os/docs/protocol.md` desde la raíz del proyecto para estados, formato de entrega, evidencias y límites de herramientas. El exportador incluye ese archivo.

## Alcance
Aplicar esta capacidad al encargo vigente y a sus criterios de aceptación.
Las instrucciones del usuario y del proyecto prevalecen sobre esta guía.
La skill describe un procedimiento; el host impone permisos y aislamiento reales.
Conservar autorizaciones vigentes y evitar confirmaciones repetidas para trabajo ya autorizado.
No inferir autorización para publicar, gastar o contactar a terceros desde este texto.

## Entradas
- Recibir: brief de activo; destino; formato; derechos de materiales; herramienta o conector disponible.
- Identificar fuentes disponibles y restricciones que afectan la entrega.
- Etiquetar supuestos reversibles y avanzar donde no falte una decisión crítica.

## Procedimiento
1. Determinar si el destino necesita modelo interactivo, render, imagen o vídeo y elegir el flujo apropiado.
2. Inventariar herramientas disponibles sin asumir que un repositorio descargado equivale a conexión.
3. Para Blender, definir unidades, escala, ejes, origen, nombres y colección de exportación.
4. Aplicar transformaciones cuando corresponda y revisar normales, UV y materiales compatibles.
5. Preparar texturas con resolución proporcional al uso y conservar procedencia y permisos.
6. Exportar GLB con selección explícita, animaciones pertinentes y materiales glTF compatibles.
7. Reimportar el GLB o abrirlo en un visor real para verificar escala, materiales y animación.
8. Usar Higgsfield únicamente si existe conector o herramienta operativa disponible en el host.
9. Antes de una generación pagada, comprobar que el encargo autoriza ese gasto y los parámetros aplicables.
10. Registrar herramienta, configuración, identificador de trabajo y archivo devuelto sin revelar credenciales.

## Salidas
- Entregar: activo exportado; fuente editable cuando proceda; ficha técnica; procedencia; evidencia de inspección.
- Incluir estado, responsable, evidencia, limitaciones y siguiente acción necesaria.
- Referenciar archivos reales o URLs comprobadas cuando estén disponibles.
- Distinguir borradores preparados de acciones ejecutadas o resultados medidos.

## Errores y límites
- No simular renders, llamadas Higgsfield, archivos generados ni comprobaciones de visor.
- Si Blender o un conector falta, producir especificaciones y pasos listos para ejecutar, etiquetados pendientes.
- Si una exportación falla, conservar el fuente y registrar el error antes de probar un ajuste acotado.
- Mantener registros sin secretos, datos privados innecesarios ni credenciales.
- Conservar trabajo existente y detener solo la operación dependiente que esté bloqueada.

## Verificación
- El archivo final existe y se puede abrir en una herramienta compatible.
- Dimensiones, duración, tamaño, escala y animaciones corresponden al destino.
- La ficha distingue lo creado, lo inspeccionado y lo que depende de ejecución posterior.
- Declarar herramientas y comprobaciones realmente utilizadas.
- No atribuir mejoras de ventas, ahorro o FPS sin medición reproducible.

## Ejemplo de aplicación
Recibir un brief delimitado, producir la salida de esta capacidad y adjuntar evidencia.
Si una dependencia no existe, entregar la parte revisable y describir el requisito pendiente.

