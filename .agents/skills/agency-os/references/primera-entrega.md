# Estándar de primera entrega — Agency OS

Aplicar antes de cerrar una fase. La mejora continua afina una solución completa; no sustituye requisitos omitidos, arquitectura pendiente, errores conocidos ni pruebas indispensables. Una propuesta exploratoria puede ser útil, pero no declararla entrega final.

## Contrato de calidad

Definir al inicio el resultado, alcance, usuario, operación, dependencias y aceptación verificable. Expresar cada criterio como comportamiento, condición de prueba, resultado esperado y evidencia. Diferenciar calidad de la solución de resultados futuros: poder comprobar un pedido correcto hoy no demuestra ventas futuras.

Mantener una cadena con IDs estables: OBJ → EV → DEC → REQ → componente/proceso → TEST → KPI. Para cada decisión material registrar alternativas, opción elegida, renuncia, fundamento, costo total, incertidumbre y condición de revisión. Los IDs deben apuntar a registros reales del proyecto, no a una lista ficticia.

## Gates y evidencia mínima

| Etapa | Decisión que debe quedar resuelta | Evidencia de salida |
|---|---|---|
| Discovery | Qué problema vale resolver y cómo opera el negocio | Brief vigente, mapa de proceso, objetivo medible, restricciones y vacíos críticos |
| Research | Qué se sabe, qué contradice la hipótesis y qué falta | Matriz de fuentes con fecha/método/población, observaciones reales o protocolo pendiente, casos negativos |
| Strategy | Dónde competir, por qué elegirán la oferta y qué se descarta | Opciones comparadas, propuesta sustentada, economía y capacidad, prioridades y renuncias |
| UX | Cómo completa la tarea cada usuario en condiciones reales | Flujos normales/adversos, arquitectura de información, protocolo o resultados de pruebas, reglas de contenido |
| Diseño | Cómo expresa el posicionamiento un sistema distintivo y usable | Concepto propio, tokens, componentes/estados, composición responsive, especificación de movimiento y accesibilidad |
| Desarrollo | Cómo funciona y se mantiene el sistema completo | Contratos de datos, manejo de errores, pruebas pertinentes, rendimiento y seguridad según alcance |
| Entrega | Qué fue probado y quién lo opera | Matriz requisito/prueba/evidencia, incidentes abiertos, operación, observabilidad, recuperación y autorización de publicación si aplica |
| Optimización | Qué hipótesis mejora un resultado sin degradar otro | Baseline real o UNKNOWN, método de comparación, señal de éxito, guardrails y regla de parada |

Usar PASS, REVISE, BLOCKED o NOT_APPLICABLE con motivo. No usar promedio ni una puntuación estética para compensar una falla crítica. Un gate de calidad interno no concede permiso para acciones externas.

## Criterios que bloquean una entrega final

- Una tarea esencial falla, pierde datos, duplica un pedido o calcula incorrectamente una cantidad/precio.
- Una decisión material depende de datos contradictorios sin resolver, y se comunica como definitiva.
- La compra exige completar 3D, depende de una animación para acceder al CTA o queda inaccesible sin el efecto visual.
- Hay secretos expuestos, permisos indebidos, tratamiento de datos no definido o integraciones sin recuperación acorde al alcance.
- Se afirma una prueba no ejecutada, resultado de negocio no observado o conformidad sin evaluar el proceso pertinente.
- La operación no tiene responsable, fuente de verdad ni mecanismo para tratar excepciones relevantes.

Clasificar defectos por impacto: crítico (pérdida, seguridad o tarea esencial), alto (impide una tarea relevante), medio (degrada sin impedir), bajo (ajuste menor). Corregir críticos y altos antes de cerrar. Registrar cualquier medio aceptado con impacto y responsable; no esconderlo en un backlog genérico. Reservar la mejora posterior para ajustes menores, nueva evidencia o necesidades nuevas.

## Exclusividad del trabajo

Crear una tesis de diferenciación específica: audiencia/tarea, tensión comercial, prueba propia, concepto, expresión visual/interactiva y efecto esperado. Comparar referencias para identificar convenciones útiles y evitar copiar composición, textos, activos o códigos distintivos. Registrar procedencia y derechos de activos. No confundir personalización con exclusividad jurídica ni prometer que una técnica o una herramienta sea privativa.

Mantener decisiones propias reconocibles en contenido, jerarquía, ritmo, fotografía, movimiento y servicio. Una plantilla solo es infraestructura; justificar cómo se transforma para el negocio. Evaluar distinción junto con comprensión, confianza, accesibilidad, rendimiento y facilidad de compra.

## Review técnico de primera entrega

Revisar primero arquitectura y datos, luego implementación y experiencia, finalmente acabado. Realizar una comprobación independiente proporcional del recorrido y de los fallos relevantes. Separar evidencia de ejecución (log, trace, salida, captura, archivo) de opiniones de revisión. Un caso escrito es un caso diseñado; solo marcarlo ejecutado cuando haya salida e inspección.

En la entrega indicar alcance terminado, pruebas realizadas y sus resultados, límites no comprobados y pendientes materiales. No declarar READY_TO_RELEASE si el gate está bloqueado. No declarar resultado comercial garantizado por superar QA.
