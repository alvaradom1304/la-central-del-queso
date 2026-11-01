# Dictamen de entrega: quesera artesanal de Costa Rica

Fecha: 2026-10-10. Alcance: diagnóstico y especificación revisable; sin modificar producción, ejecutar staging ni conectar servicios. Aplicación enfocada de Agency OS + immersive-commerce en Desarrollo/Entrega, con revisión puntual de UX y medición. Posicionamiento y diseño se conservan como aprobaciones declaradas del brief; no corresponde repetir discovery ni rediseñar por ritual.

**Decisión global: REVISE. No READY_TO_RELEASE ni «premium terminado».** El cálculo de precio y la concurrencia de stock afectan la tarea esencial. La medición atribuye una venta a un gesto que solo abre un canal. Lighthouse 98 de escritorio no compensa esos defectos ni acredita accesibilidad, móvil, operación o experiencia real. La integración automatizada está BLOCKED por dependencias de acceso; el research con compradores queda pendiente, sin inventar participantes. Hoy puede entregarse este diagnóstico y una especificación completa. Una web corregida solo podría aceptarse cuando existan pruebas ejecutadas del alcance elegido.

## Objetivo y evidencia disponible

OBJ-01: permitir seleccionar queso por peso, entender el costo y solicitar un pedido que el negocio pueda confirmar y cumplir, con pago contra entrega. OBJ-02: expresar el origen artesanal mediante una experiencia de finca distintiva, sin impedir la compra. OBJ-03: medir etapas comerciales observables sin convertir intención en ingreso.

Todos los IDs siguientes corresponden a registros de este documento. Los hechos de staging proceden del encargo, no de una inspección independiente. No se recibieron URL, versión, trazas, reportes Lighthouse, acceso, datos operativos ni resultados de tests.

| ID | Evidencia | Tipo y alcance | Consecuencia |
|---|---|---|---|
| EV-01 | Posicionamiento y diseño aprobados | Declaración del brief; artefactos de aprobación no adjuntos | Preservar decisiones; revisar implementación y estados omitidos |
| EV-02 | 3D vistoso y Lighthouse 98 en escritorio | Declaración; entorno y reporte desconocidos | Valor visual no demuestra calidad comercial; móvil y fallback UNKNOWN |
| EV-03 | 500 g muestra 12000 CRC a 12000 CRC/kg | Defecto reportado; cálculo esperado comprobable aritméticamente | Subtotal de producto correcto: 6000 CRC; 12000 es el doble |
| EV-04 | Click de WhatsApp registrado como venta | Defecto de definición reportado | Invalidar interpretación de ventas/conversión basada en ese evento |
| EV-05 | Dos compradores pueden pedir el último queso | Riesgo reportado; «pedir» no prueba que ambos sean confirmados | Verificar frontera solicitud/confirmación; impedir comprometer el mismo stock dos veces |
| EV-06 | Sin participantes para research | Restricción declarada | Evaluación interna posible; validación de comprensión con compradores no ejecutable hoy |
| EV-07 | API y automatización sin credenciales | Dependencia declarada | No acreditar integración real; alternativa manual no requiere API |

No hay baseline verificable de ventas, margen, abandono o tareas exitosas. Son UNKNOWN. La hipótesis de que el 3D aumenta confianza o conversión sigue sin validar. No se promete exclusividad jurídica, incremento de ventas, inventario en tiempo real ni resultados SEO.

## Gates y decisiones

| Gate | Estado | Motivo y salida necesaria | Responsable propuesto |
|---|---|---|---|
| Discovery/Strategy | PASS de continuidad limitado | Aprobaciones declaradas suficientes para enfocar la reparación; cerrar unidad de venta, pesaje, cobertura, capacidad y responsables antes de comprometer pedidos | Dueño de negocio |
| Research | Avanzar con condiciones; BLOCKED para validación con compradores | Documentar hipótesis y protocolo; no exigir investigación completa para corregir aritmética o stock. No afirmar éxito de usuario | Responsable UX |
| UX | REVISE | Mostrar unidad, subtotal, envío y confirmación; catálogo accesible sin completar 3D; diseñar errores y fallback | UX + desarrollo |
| Diseño | PASS de continuidad limitado | Mantener diseño aprobado; accesibilidad, responsive y movimiento implementado aún sin evidencia | Diseño + QA |
| Desarrollo comercial | REVISE | Precio correcto, autoridad sobre inventario, estados y recuperación verificables | Desarrollo + operación |
| Integraciones automáticas | BLOCKED | Faltan cuentas/credenciales y pruebas reales; solo especificación y simulaciones identificadas | Responsable técnico |
| Medición | REVISE | Reemplazar venta por whatsapp_open; venta/cobro requieren evidencia operativa y reconciliación | Analítica + operación |
| Entrega final | REVISE | Corregir críticos/altos y ejecutar QA proporcional; definir propietario, excepciones y recuperación | Responsable de entrega |
| Publicación | Fuera de alcance | No se solicita ni autoriza aquí; un gate interno no autoriza publicar | Dueño del proyecto |

El gate de continuidad no certifica fases previas que no se inspeccionaron. La ausencia de participantes no bloquea corregir defectos técnicos; sí impide certificar que compradores reales comprenden y completan la experiencia. Si la aceptación acordada exige esa validación, el cierre de ese requisito permanece BLOCKED.

## Arquitectura corregida y decisiones registradas

| ID → requisito | Decisión propuesta | Alternativa y renuncia | Dependencias, costo y revisión |
|---|---|---|---|
| DEC-01 → REQ-01 | Catálogo, carrito y contenido accesibles primero; finca 3D progresiva, opcional, diferida y con imagen equivalente | CSS/imágenes como versión mínima; conservar 3D solo si supera presupuesto y no dificulta compra | El 3D añade descarga, GPU, QA y mantenimiento. Owner frontend; revisar con móvil/red limitada y fallos |
| DEC-02 → REQ-02 | Peso canónico en gramos enteros y dinero decimal/entero con escala explícita | Evitar representar dinero con flotantes binarios y confiar en total del cliente | Owner comercio; revisar incrementos permitidos, peso final y política de redondeo con negocio |
| DEC-03 → REQ-03 | Elegir inicialmente cotización por WhatsApp y confirmación humana serializada, si se dispone de operador y registro único | Backend transaccional ofrece reserva inmediata, con mayor implementación y operación; API no necesaria para click-to-chat | Costo manual crece con volumen; no promete tiempo real. Sin owner/registro, alternativa manual también bloqueada |
| DEC-04 → REQ-04 | Inventario disponible separado de físico y reservado; autoridad única para comprometerlo | El enlace WhatsApp y deduplicar mensajes no solucionan concurrencia | Owner inventario; revisar canales externos y frecuencia real de conciliación |
| DEC-05 → REQ-05 | Embudo por estados observados y cobro separado | Se descarta «click = venta», facturación estimada como cobro y métricas retrospectivas inventadas | Owner analítica; costo de registro/reconciliación; revisar cobertura y atribución |
| DEC-06 → REQ-06 | Automatización diferida hasta acceso, contrato y prueba de recuperación reales | Simulaciones útiles para lógica, insuficientes para certificación productiva | Proveedor/SDK/costos/versiones UNKNOWN; verificar documentación oficial vigente antes de implementar |

### Capas y recorrido

1. **Contenido/compra:** HTML legible y rastreable; producto, unidad y precio; catálogo directo; carrito recuperable tras refresh/retorno; ayuda, cobertura y condiciones. Los activos 3D no controlan navegación, foco ni CTA.
2. **Identidad/narrativa:** conservar dirección aprobada; origen, elaboración y producto con claims y activos verificables. Documentar derechos y decisiones propias de fotografía, ritmo, copy e interacción; «exclusiva» se refiere a una ejecución distintiva, no a la propiedad de una técnica.
3. **Movimiento/3D:** iniciar después del contenido útil; respetar movimiento reducido, pausar fuera de vista y liberar recursos. Ante fallo de WebGL, descarga o dispositivo insuficiente, conservar imagen/contenido y toda la compra. Sin scroll secuestrado.
4. **Operación/medición:** registro único de cotizaciones/pedidos, precios y stock; confirmación, entrega y cobro con responsables; analítica sin teléfono/dirección/textos privados. APIs y automatización son módulos independientes, no requisitos del enlace WhatsApp.

### Precio, pesaje y contrato

Para el precio dado: `subtotal_CRC = cantidad_g × 12000 / 1000`. Casos exactos: 250 g → 3000 CRC; 500 g → 6000 CRC; 1000 g → 12000 CRC; 1500 g → 18000 CRC. El encabezado 12000 CRC/kg puede mantenerse, pero no sustituye el subtotal seleccionado. Envío, impuestos y redondeo no están especificados: no inventar tratamiento fiscal ni un total final. Deben definirse con negocio y verificarse según reglas aplicables antes del cierre.

Rechazar cantidades no positivas/no finitas, unidad desconocida, incrementos no admitidos y SKU/variante inexistente. Convertir kg a g de forma decimal exacta; fijar precisión e incrementos comerciales. Aclarar si se venden paquetes de peso fijo o cortes con pesaje final. Si el peso varía, separar cotización estimada de peso/total final, explicar tolerancia y obtener confirmación cuando cambie lo comprometido.

Contrato mínimo: `quote_id`, caducidad, `order_id` una vez recibido, `schema_version`, fecha, CRC, SKU/variante, cantidad y unidad explícitas, unidad de venta, precio por kg y versión de precio, subtotal, total estimado/final, zona/método/costo de entrega, método contra entrega, estado del pedido, estado de cobro y referencia segura de cliente. `quote_id` no acredita persistencia, recepción ni reserva. El resumen de WhatsApp es editable y debe revalidarse; evitar incluir dirección o datos personales innecesarios en la URL.

### Dos niveles operativos, sin falsas garantías

**Opción manual condicionada:** el navegador crea una cotización y abre WhatsApp con resumen. UI: «Solicitud sujeta a confirmación de disponibilidad y entrega», sin descontar inventario ni afirmar pedido confirmado. Al recibir mensaje, el operador registra un ID estable y valida peso, precio vigente y zona. Un único responsable autorizado consulta y actualiza el registro de stock antes de confirmar; nadie más confirma en paralelo. Otros canales usan la misma autoridad. Si llega otra solicitud por el último queso, se rechaza o propone alternativa con consentimiento. Debe existir procedimiento para ausencia del operador, reserva vencida, cancelación y conciliación. Permite dos solicitudes; no permite dos compromisos incompatibles. Si ese control no es viable, se requiere el backend antes de ofrecer disponibilidad garantizada.

**Opción backend:** validación de precio/cobertura/stock en servidor; creación de pedido y reserva atómica/condicional en una transacción durable o garantía equivalente. La operación exige `disponible >= peso_solicitado` y una clave idempotente por solicitud. Dos claves distintas que compiten por el último stock reciben un único éxito; deduplicación y exclusión de concurrencia son controles diferentes. Registrar reserva, expiración, liberación y recuperación; cancelar una reserva libera exactamente una vez. Si una respuesta expira después de persistir, consultar/reconciliar por ID antes de repetir escritura. Una automatización de mensajes no sustituye esta autoridad transaccional.

Estados: `draft → submitted → confirmed → preparing → dispatched → delivered`, con rechazo/cancelación y transiciones válidas. En manual, submitted solo después de recibir y registrar; abrir WhatsApp no demuestra envío. Cobro independiente: `pending → collected` o fallo/devolución según operación. Crear, confirmar, despachar o entregar no prueba cobro contra entrega; el operador registra lo efectivamente recibido. La reserva, descuento físico, merma y devolución deben corresponder a transiciones definidas y conciliables.

Automatización futura: recepción autenticada → persistencia durable → procesamiento → acción → registro/reconciliación. Duplicados por ID y alcance; eventos fuera de orden validados por estado; reintentos acotados para errores recuperables, cola de fallos y owner. Nunca reintentar ciegamente stock, cobros o confirmaciones. Una reversión técnica no deshace mensajes ya enviados. Sin credenciales se pueden diseñar contratos y ejecutar mocks locales; no se pueden certificar API, webhooks reales, cuotas, latencia, entrega de mensajes ni extremo a extremo.

### Medición corregida

Separar `product_view`, `selection`, `quote_created`, `whatsapp_open`, `message_received`, `order_confirmed`, `order_delivered`, `collection_recorded` y `repeat_order`. En manual, registrar los estados observados en el registro operativo, con fecha e ID seguro; no inferirlos del navegador. Definir venta reportada como pedido confirmado o ingreso cobrado según KPI explícito; conservar ambos indicadores por separado.

KPI-01: pedidos confirmados/cotizaciones de una cohorte identificable. KPI-02: cobro registrado y contribución después de costos variables conocidos. KPI-03: cancelaciones, cumplimiento y tiempo de respuesta. Denominadores, ventanas, exclusión de pruebas/bots y cobertura deben acordarse; baseline UNKNOWN. Sin unión confiable web–operación no atribuir ventas al 3D. Reclasificar histórico de clicks cuando exista evidencia; si no, marcarlo como intención de canal, sin reconstruir ventas.

## Matriz de aceptación proporcional

La tabla define pruebas; **ninguna prueba de staging fue ejecutada en este encargo**. «Ejecutable hoy» describe posibilidad con artefacto/acceso correspondiente, no resultado. Solo el cálculo matemático de REQ-02 fue comprobado aquí. Los estados FAIL reportados deben reproducirse y luego retestearse con evidencia.

| TEST → requisito → objetivo | Condición y resultado esperado | Evidencia necesaria / estado actual | Gate |
|---|---|---|---|
| T-01 → REQ-02 → OBJ-01 | 250/500/1000/1500 g producen 3000/6000/12000/18000 CRC; kg equivalentes iguales; subtotal y resumen coinciden | Aritmética comprobada; UI 500 g FAIL reportado. Test unitario + captura/traza UI y cotización pendientes | REVISE crítico |
| T-02 → REQ-02 → OBJ-01 | Cero, negativos, NaN, unidad/SKU inválidos e incremento no permitido rechazados; manipular total cliente no altera confirmado | Prueba local/servidor o revalidación humana documentada; no ejecutada | Pendiente esencial |
| T-03 → REQ-03 → OBJ-01 | Precio vencido/cambiado, peso final diferente y zona sin cobertura generan nueva cotización/error claro sin perder selección | Fixtures y walkthrough operativo; no ejecutados; política comercial faltante | Pendiente esencial |
| T-04 → REQ-04 → OBJ-01 | Dos clientes por último stock: máximo una reserva/confirmación; el otro recibe indisponibilidad o alternativa | Backend: ejecución concurrente y registros durables. Manual: dos solicitudes y secuencia real de operador/registro. No ejecutado | REVISE crítico si doble compromiso; REVISE alto por ambigüedad |
| T-05 → REQ-04/06 → OBJ-01 | Doble envío no duplica efectos; timeout tras persistir reconcilia; cancelación/vencimiento libera una vez | Logs por ID, stock antes/después y recuperación; mocks posibles, servicio real sin acceso bloqueado | Pendiente; integración BLOCKED |
| T-06 → REQ-03 → OBJ-01 | WhatsApp no disponible, mensaje editado/no enviado o pérdida de conexión no producen confirmación; selección recuperable | Prueba enlace/resumen/refresh y registro manual; no ejecutada | Pendiente esencial |
| T-07 → REQ-01 → OBJ-01/02 | Catálogo/CTA funcionan con 3D fallido, JS/efecto ornamental degradado y movimiento reducido; teclado/foco correctos | Navegación manual, capturas y herramienta accesibilidad pertinente; no ejecutados | Pendiente esencial |
| T-08 → REQ-01 → OBJ-02 | Móvil/red limitada: compra usable, escena diferida, sin bloqueo ni saltos que impidan tarea | Dispositivo/entorno/build/red, recursos y trazas; Lighthouse escritorio declarado insuficiente | UNKNOWN; falta evidencia |
| T-09 → REQ-01 → OBJ-02 | Legibilidad, contraste, etiquetas, errores y lectura de información de compra verificadas | Revisión manual y lector de pantalla proporcional; no afirmar conformidad completa por un escaneo | Pendiente esencial |
| T-10 → REQ-05 → OBJ-03 | Abrir WhatsApp emite whatsapp_open una vez y cero ventas; confirmación/entrega/cobro reflejan evidencias distintas | Captura de eventos y reconciliación de pedido de prueba sin PII; no ejecutada, defecto reportado | REVISE alto |
| T-11 → REQ-03/04 → OBJ-01 | Pago pendiente al recibir/confirmar; entrega fallida y entrega sin cobro no marcan collected; stock/estado conciliables | Ejercicio operativo y registro firmado por owner; no ejecutados | Pendiente esencial |
| T-12 → REQ-06 → OBJ-01/03 | Webhooks autenticados, duplicados/fuera de orden, caída, cola de fallos y recuperación verificados | Contratos/mocks diseñables; API real, credenciales y evidencia extremo a extremo ausentes | BLOCKED automatizado; N/A en alcance manual excluido explícitamente |
| T-13 → REQ-01/03 → OBJ-01/02 | Compradores comprenden precio por kg/subtotal, estimación, entrega y completan tarea | Protocolo pendiente: tareas, criterios, perfiles/muestra justificadas y reclutamiento; sin participantes | BLOCKED validación de usuarios; no sustituir por opinión experta |
| T-14 → REQ-01 → OBJ-02 | Contenido fuera de canvas, títulos/enlaces/canonical pertinentes; activos y claims trazables | Inspección build y registro de procedencia; no ejecutados; no demuestra ranking ni exclusividad jurídica | Pendiente proporcional |
| T-15 → REQ-03/04/06 → OBJ-01 | Owner, registro, acceso mínimo, respaldo y recuperación operativa disponibles; logs sin datos personales innecesarios | Checklist operativo + ensayo de recuperación; no ejecutados ni owners confirmados | BLOCKED cierre operativo |

Presupuesto de rendimiento: fijar límites de transferencia inicial, JS/3D diferido, memoria y fluidez para dispositivos/red de la audiencia antes del retest. Son propuestas por acordar, no cifras ya aprobadas. Si se adoptan Core Web Vitals, verificar umbrales oficiales vigentes antes de declararlos como criterio. Laboratorio móvil no acredita datos de campo; INP real y comportamiento de compradores permanecen sin evidencia. No se usa un puntaje agregado para compensar fallas críticas.

## Entrega de hoy y cierre posterior

Hoy se entrega **diagnóstico + decisiones propuestas + contrato + protocolo de aceptación**, terminado como documento de especificación, no como web lista para vender. Prioridad inmediata: precio/unidades, autoridad de stock/confirmación y medición; después fallback/compra accesible y operación; validar inmersión móvil y acabado dentro de esos guardrails. No se requiere rehacer marca aprobada.

Para un cierre manual: dueño de negocio confirma pesaje, precios, envío/cobertura y owner; desarrollo corrige; QA ejecuta matriz aplicable con versión y evidencia; operador ensaya última existencia, cancelación y cobro; se documenta integración automática fuera del alcance acordado. El cambio de alcance tiene impacto explícito en capacidad, plazo y costo y no se considera aprobado por silencio. Para un cierre automatizado: añadir acceso seguro, garantías de inventario, pruebas de integraciones y recuperación reales. No pedir secretos en chat.

Solo declarar terminado el alcance elegido tras corregir críticos/altos, comprobar recorrido completo, asignar operación y registrar límites materiales. Mantener research pendiente como limitación explícita y plan de validación; si es criterio contractual imprescindible, impide cierre. Optimización posterior corresponde a ajustes menores y nueva evidencia, nunca a ocultar errores de precio, concurrencia, accesibilidad o recuperación.

## Fuentes metodológicas leídas

- Agency OS: `/root/.codex/skills/remote-skills/skill-6ac9997d350c8191911ceb94de562df7/SKILL.md`; referencias `fases.md`, `registros.md`, `primera-entrega.md`.
- immersive-commerce: `/root/.codex/skills/remote-skills/skill-6ac99d7aac5c819184d1d276af114aef/SKILL.md`; referencias `experiencia.md`, `pedidos.md`, `revision.md`, `arquitectura-operativa.md`.
- Única evidencia del proyecto: brief del encargo, recibido 2026-10-10. No se hicieron búsquedas externas ni se implementaron proveedores; las reglas cambiantes quedan como dependencia de verificación antes de implementación. Sin cambios en producción, conexiones, mensajes ni despliegues.
