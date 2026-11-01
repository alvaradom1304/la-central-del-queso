---
name: altiora-bibliotecario
description: Selecciona skills, herramientas y roles con contexto mínimo en Altiora. Usar al enrutar una petición nueva, retomar una tarea o resolver solapamientos; continuar trabajo pequeño directamente si ninguna skill aporta.
---

# Bibliotecario de Altiora

Elegir por resultado, riesgo y capacidades reales, no por una palabra aislada. Esta skill organiza la selección; no sustituye la especialidad ni otorga permisos.

En cada mensaje conservar objetivo activo, requisitos, autorización y preguntas pendientes. Detectar si el mensaje añade una tarea, corrige la actual o la cancela. Una consulta lateral no cancela trabajo autorizado.

1. Examinar primero nombres y descripciones **disponibles en esta sesión**. Las skills explícitamente pedidas y las instrucciones del proyecto tienen prioridad. Resolver nombre/alias y abrir solo la candidata más específica; añadir otra si cubre una necesidad distinta o es obligatoria. Si nada aporta, trabajar directamente.
2. Reutilizar instrucciones y evidencia ya leídas mientras sigan vigentes. Abrir referencias condicionales solo al necesitarlas. Para buscar en una biblioteca local grande, usar [el buscador](scripts/library.py); su ranking es una pista, no una decisión ni prueba de disponibilidad del runtime. No volcar el catálogo completo al contexto. Refrescarlo cuando cambie la biblioteca, no por mensaje.
3. Elegir ejecución directa para cambios pequeños. Usar un agente real solo si la delegación está autorizada, disponible y reduce trabajo duplicado o aporta revisión independiente. Una definición de rol no crea un subagente. En tareas complejas seguir `altiora-agent-orchestrator`; para comparativas de costes/modelos, `altiora-ai-economy`, si están disponibles. No cambiar modelos ni iniciar servicios para ahorrar por defecto.
4. Al delegar enviar objetivo, entradas imprescindibles, archivos propios, restricciones, aceptación y salida breve con evidencia. Evitar historial completo, recursión de agentes y lecturas duplicadas. Pedir precisión suficiente para revisar el resultado.
5. Mantener las pruebas necesarias para el riesgo y verificar entregables reales. Responder con resultado, evidencia y límite material; añadir detalle solo si ayuda o se pide. No recortar requisitos, incertidumbre o aprobaciones para escribir menos.

No declarar porcentajes de ahorro ni superioridad sin comparar tareas aceptadas: tokens de todos los agentes, herramientas/contexto, correcciones, latencia y calidad. Si el cliente no expone consumo, marcarlo desconocido. `smart-model-router` puede orientar una comparación, pero sus cifras, modelos y herramientas requieren comprobación; no son garantías.

Si no puede leerse una ruta, buscar en las capacidades actuales o actuar con el rol secuencial e indicar el límite. No instalar, mover bibliotecas, publicar o sincronizar cuentas como efecto lateral del enrutamiento.

Para integración y rutas por cliente, leer [portabilidad](references/portability.md) solo al instalar o diagnosticar descubrimiento. Versión 0.1.0; validación técnica del paquete, ahorro y comportamiento universal no certificados.
