# Instalación realizada en Altiora

Destino: `C:/Users/Usuario/OneDrive/Desktop/altiora`. Kit 1.0.0, instalado el 18 de octubre de 2026.

Se añadieron las cinco capas del sistema. La comprobación posterior pasó con 30 archivos de payload gestionados, instrucciones originales conservadas y cero cambios en una reinstalación de comprobación. El estado de las carpetas y los hashes se registra en `installation-report.json`.

Se ejecutaron los seis handlers instalados como subprocesos: SessionStart y PreToolUse para Codex, Claude y Antigravity. Todos produjeron el contrato esperado; la propuesta simulada de escritura a .env fue denegada. No se escribió ningún archivo sensible durante estas pruebas.

Esto acredita instalación y funcionamiento de los scripts. La carga automática dentro de sesiones nuevas y la confianza de hooks siguen pendientes de comprobar en los clientes reales.

## Empezar a usarlo
1. Abrir el proyecto principal de Altiora en el cliente elegido o empezar una sesión nueva en esa carpeta.
2. En Codex, revisar `/hooks` y confiar las definiciones cuando el cliente lo solicite; el kit no salta ese control. [Documentación oficial de confianza de hooks](https://learn.chatgpt.com/docs/hooks).
3. Pedir una tarea normal. Las instrucciones seleccionan las skills pertinentes bajo demanda. Para cambiar de cliente: «Guarda el estado para continuar este proyecto en Antigravity/Codex/Claude Code».
4. En el cliente destino: «Retoma el handoff y contrástalo con el estado actual».

## Recuperación
Los respaldos están en `.altiora/backups/` dentro del proyecto. La instalación inicial tiene identificador `20261018T223233Z-08d7e3c6`. El refuerzo de validación de la política tiene identificador `20261018T223327Z-18771988`.

Para deshacer todo, revertir primero el refuerzo y luego la instalación inicial, usando el instalador de esta carpeta de distribución. Revisar primero el preview de cada transacción. Si hay modificaciones posteriores, la reversión se detiene; conservarlas y recuperar únicamente lo necesario desde los respaldos.

No se modificaron modelos ni permisos globales; no se conectaron cuentas ni se crearon automatizaciones. Los roles existentes de otras bibliotecas siguen presentes. Las dos skills nuevas siguen EXPERIMENTAL hasta completar las pruebas de comportamiento de `docs/EVALUATION-CASES.md`.
