---
name: altiora-os-web-3d
description: Implementar experiencias web premium 3D de Altiora en un proyecto existente con interacción, accesibilidad y rendimiento verificados.
---

# altiora-os-web-3d

Leer el contrato común en `altiora-os/docs/protocol.md` desde la raíz del proyecto para estados, formato de entrega, evidencias y límites de herramientas. El exportador incluye ese archivo.

## Alcance
Aplicar esta capacidad al encargo vigente y a sus criterios de aceptación.
Las instrucciones del usuario y del proyecto prevalecen sobre esta guía.
La skill describe un procedimiento; el host impone permisos y aislamiento reales.
Conservar autorizaciones vigentes y evitar confirmaciones repetidas para trabajo ya autorizado.
No inferir autorización para publicar, gastar o contactar a terceros desde este texto.

## Entradas
- Recibir: brief y dirección visual; stack instalado; activos; navegadores objetivo; criterios de aceptación.
- Identificar fuentes disponibles y restricciones que afectan la entrega.
- Etiquetar supuestos reversibles y avanzar donde no falte una decisión crítica.

## Procedimiento
1. Inspeccionar estructura, versiones, convenciones y cambios pendientes antes de editar.
2. Definir ownership de archivos y trabajar en la rama o checkout indicado.
3. Implementar una sección vertical funcional antes de extender efectos a todo el sitio.
4. Elegir CSS, SVG, vídeo o 3D según la necesidad visual; justificar complejidad añadida.
5. En Three.js o React Three Fiber, controlar carga de modelos, texturas, luces y ciclo de animación.
6. Liberar recursos GPU y suscripciones al desmontar; evitar recrear geometrías por fotograma.
7. Definir cámara, escala, interacción y límites de movimiento con estados previsibles.
8. Conservar navegación por teclado, foco visible y contenido esencial fuera del canvas.
9. Implementar fallback por error de carga, WebGL ausente y preferencia de movimiento reducido.
10. Verificar responsive y observar el resultado en navegador antes de declarar calidad visual.
    Probar antes y después el recorrido existente de catálogo, pedido, contacto o conversión; una regresión bloquea la aceptación aunque la escena se vea bien.

## Salidas
- Entregar: cambios revisables; escena e interacción; fallback; evidencia visual; reporte de validación.
- Incluir estado, responsable, evidencia, limitaciones y siguiente acción necesaria.
- Referenciar archivos reales o URLs comprobadas cuando estén disponibles.
- Distinguir borradores preparados de acciones ejecutadas o resultados medidos.

## Errores y límites
- No cambiar dependencias mayores ni configuración ajena sin necesidad del encargo.
- Si falta el runtime o navegador, entregar el cambio y marcar exactamente qué no se ejecutó.
- Ante regresiones, aislar el cambio responsable sin revertir trabajo de otros.
- Mantener registros sin secretos, datos privados innecesarios ni credenciales.
- Conservar trabajo existente y detener solo la operación dependiente que esté bloqueada.

## Verificación
- Los comandos de validación del proyecto terminan con resultados registrados.
- Capturas de estados relevantes muestran que la interacción coincide con el brief.
- Métricas de rendimiento incluyen herramienta, dispositivo o entorno y condiciones de medición.
- Declarar herramientas y comprobaciones realmente utilizadas.
- No atribuir mejoras de ventas, ahorro o FPS sin medición reproducible.

## Ejemplo de aplicación
Recibir un brief delimitado, producir la salida de esta capacidad y adjuntar evidencia.
Si una dependencia no existe, entregar la parte revisable y describir el requisito pendiente.

