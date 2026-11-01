# Diseño y alcance

El usuario solicitó construir el sistema de las cinco capas de las referencias para aplicarlo en Antigravity, Codex y Claude Code. Se interpreta como configuración operativa de Altiora, conservando su biblioteca y proyectos existentes.

Se elige un núcleo portable con adaptadores de proyecto. Una instalación global produciría cambios ajenos a proyectos y riesgo de mezclar clientes; mantener tres bibliotecas independientes produciría deriva. El instalador conserva skills homónimas locales y añade wrappers mínimos a instrucciones existentes. El contenido canónico instalado vive en `.altiora/system`; las dos copias para descubrimiento de skills se verifican por hash y se actualizan desde el paquete.

Se reutilizan las cuatro responsabilidades ya presentes en Altiora: investigación, experiencia, ingeniería y revisión. Se crean dos procedimientos que cubren el hueco entre herramientas: comprobar la integración real de un runtime y transferir una tarea con evidencia. No se vuelve a crear la biblioteca de negocio, marca, web o crecimiento.

La capa de distribución se implementa mediante archivos versionados, ZIP, manifiesto SHA-256, instalación conservadora y reversión. El paquete no promete una API de plugin común que las tres herramientas compartan.

Aceptación: instalación local funcional, configuración nativa separada, preservación de reglas/skills/permisos, reinstalación sin duplicados, traspaso validable, protección directa comprobada mediante payloads de cada protocolo, rollback que no borra cambios posteriores y límites de validación declarados.

Datos del cliente y secretos quedan fuera del paquete. La instalación no envía comunicaciones, despliega proyectos, consume APIs, activa tareas periódicas ni concede permisos. Las pruebas de integración de scripts no acreditan comportamiento de modelos o mejora comercial.
