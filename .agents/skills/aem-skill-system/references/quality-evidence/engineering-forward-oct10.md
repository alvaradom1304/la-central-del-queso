# Plan de ingeniería para comercio premium React

Fecha: 2026-10-10. task_id: engineering-forward-oct10. Estado: NEEDS_REVIEW para implementación/release; documentación solicitada completada. Alcance: propuesta técnica, sin código de aplicación, cambios de producción ni pruebas ejecutadas del producto.

## 1. Evidencia, interpretación y límites

| ID | Tipo | Fuente | Afirmación y límite |
| --- | --- | --- | --- |
| B1 | EVIDENCE: relato del encargo | Brief recibido 2026-10-10 | Tras diez cambios de ruta aumentan ScrollTriggers y memoria GPU; no hay inventario ni trace para atribuir causa. |
| B2 | EVIDENCE: relato del encargo | Brief | Canvas es único acceso al catálogo; reduced motion no cambia animación. No se ha inspeccionado DOM ni recorrido accesible. |
| B3 | EVIDENCE: relato del encargo | Brief | API crea pedido, respuesta timeout, cliente reintenta; eventos delivered, sent, delivered. No se conoce proveedor, entidad de esos eventos ni IDs. |
| B4 | ACTUAL DATA comunicado, sin verificación independiente | Brief | Lighthouse portada 98; INP móvil de campo p75 430 ms. Faltan ventana, muestra, build y población. |
| S1 | FACT documental | [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), consulta 2026-10-10 | Scope, cambios de condiciones y reversión de animaciones; limpieza propia de listeners separada. |
| S2 | FACT documental | [React y GSAP](https://gsap.com/resources/React/), consulta 2026-10-10 | Lifecycle y registro de callbacks diferidos en contexto. Versiones instaladas desconocidas. |
| S3 | FACT documental | [Three.js disposal](https://threejs.org/manual/pages/how-to-dispose-of-objects.html), consulta 2026-10-10 | Disposal explícito; texturas separadas de materiales; estadísticas incluyen recursos internos reutilizados. |
| S4 | FACT documental | [Web Vitals](https://web.dev/articles/vitals) y [INP](https://web.dev/articles/inp), consulta 2026-10-10 | Umbrales de campo p75: LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1. 430 ms necesita mejora; Lighthouse no sustituye campo. |

HYPOTHESIS: efectos repetidos sin cleanup, callbacks tardíos y cachés GPU sin límite podrían explicar B1; trabajo del selector de cantidad, re-render global, terceros o render 3D podrían explicar B4. Ninguna causa está demostrada. No afirmar que el selector genera tareas largas por aparecer en un caso de evaluación de una skill.

INTERPRETATION: el acceso comercial depende de una mejora visual susceptible de fallar; un timeout de escritura es resultado desconocido, no prueba de fracaso. RECOMMENDATION: recuperar primero acceso HTML y seguridad de pedidos, después estabilizar recursos y medir interacciones.

Inputs pendientes: repositorio/build y versiones React, router, GSAP/plugins, Three.js o R3F; motion spec y controlador de scroll; assets, derechos, tamaños y dispositivos; contrato oficial, auth, sandbox, límites y soporte de idempotencia del proveedor; semántica de sent/delivered; origen de RUM/CrUX, rutas y muestra. No se solicitan secretos. Estas carencias impiden aprobar implementación o release; permiten este plan provisional.

## 2. Responsables y orden de ejecución

Los roles siguientes son ownership propuesto, sin asignación personal confirmada.

| Prioridad | Responsable | Entrega verificable |
| --- | --- | --- |
| P0 | Frontend + accesibilidad + producto | Catálogo, precio, variantes, cantidad, carrito y preparar pedido disponibles en HTML/2D. |
| P0 | Backend/integraciones | Contrato de operación, ledger persistente, reconciliación y procesamiento durable de eventos. |
| P1 | Frontend motion | Inventario de instancias y cleanup por ruta; variante reduced motion activa y dinámica. |
| P1 | Responsable 3D | Registro de recursos, caché acotada, recuperación y degradación. |
| P1 | Performance + analítica | Baseline por ruta/interacción, traces y presupuestos comparables. |
| Gate | QA + release owner | Evidencias de pruebas, excepciones explícitas, decisión y recuperación. |

La inspección futura debe registrar versiones exactas y verificar APIs oficiales compatibles antes de implementar. No instalar plugins ni controlador de scroll por defecto. Backend y fallback HTML pueden avanzar independientemente; el release conjunto depende de los gates de la sección 8.

## 3. Ownership y lifecycle de recursos

| Recurso | Propietario | Creación/uso | Fin de vida y criterio |
| --- | --- | --- | --- |
| Timelines y ScrollTriggers | Componente/ruta que los crea | Un scope al root; creación dentro del contexto de la variante activa | Revert al cambiar condición o desmontar; desaparecen solo instancias propias. Sin killAll global. |
| matchMedia | Componente de motion | Condiciones de breakpoint y reduced motion | Una reversión al desmontar; callbacks propios retirados. No duplicar contextos sin necesidad. |
| Handlers que crean animación después | Componente | Registrar en contexto/contextSafe compatible con versión | Retirar listener y cancelar callback; no crear nuevos triggers desde promesas tardías. |
| Timers, observers, listeners, RAF | Dueño que los registra | Inventario con handle y scope | Cancelar timer/RAF; disconnect observer; remove listener; revert GSAP no sustituye estas acciones. |
| Scroll/controller y bridge con ticker | Shell de aplicación, si existe | Una autoridad de scroll; bridge único | Cleanup al cerrar shell. Rutas no añaden tickers; foco y scroll nativos siguen utilizables. |
| Renderer/canvas | Host 3D explícito | Propuesta: un host activo por ruta 3D, sin duplicados durante transición | Detener loop antes de disposal; renderer.dispose cuando muere host. Si se elige persistencia, documentar lifecycle del shell y reset entre escenas. |
| Geometrías, materiales, texturas, skeletons | Registro de assets o escena exclusiva | Cada recurso tiene identidad, owner y consumidores | Exclusivos se liberan al salir; compartidos solo con refcount cero y política de caché/evicción. Material.dispose no dispone texturas. |
| Render targets, composer/passes, controls | Host/efecto que los crea | Presupuesto por resolución y passes | Liberar según API de clase; controles retiran listeners; ninguna pasada queda en loop muerto. |
| ImageBitmap, blobs, buffers decodificados | Asset manager | Registro separado CPU/GPU | Cerrar bitmap/revocar URL y quitar referencias cuando no hay consumidor. |
| Fetch de assets y trabajo asíncrono | Generación de escena/ruta | Identificador de generación y cancelación disponible | Abort donde soporte; resultados tardíos de generación inválida no se insertan, se liberan o transfieren al cache owner. |

Secuencia de salida: invalidar generación → parar productores (loop/ticker/timers) → cancelar cargas y callbacks → revertir motion/retirar observers y controles → soltar referencias de escena → liberar exclusivos y decrementar compartidos → cerrar renderer si es propio → retirar canvas. Cleanup idempotente debe tolerar montaje/desmontaje doble de StrictMode y errores a mitad de inicialización.

Medición futura: baseline de shell sin ruta 3D; warm-up con assets fijos; repetir exactamente la misma secuencia de rutas y capturar conteos tras volver a la ruta base. Comparar diez y cincuenta ciclos. Criterio: cero triggers/listeners propios de rutas salientes, número activo igual al inventario de la ruta y caché dentro del límite aprobado; sin crecimiento sostenido tras warm-up. renderer.info indica tendencia de geometrías/texturas/programas, no bytes exactos de VRAM ni exigencia de cero. Corroborar con heap retenido y herramientas GPU disponibles; documentar incertidumbre si VRAM no es observable.

## 4. Motion, acceso y recuperación 3D

Base HTML visible antes de JS: enlaces a productos, nombre, descripción útil, imágenes, precio, stock, variantes, cantidad, carrito y checkout. Debe provenir del mismo modelo comercial que el canvas y conservar deep links. El canvas añade exploración; controles HTML etiquetados permiten la misma selección. Si JS falla, SSR/prerender y formularios/enlaces con ruta servidor deben preservar el recorrido esencial según arquitectura elegida. No ocultar CTA esperando animación ni cargar datos de catálogo solo desde escena.

Motion spec provisional (ASSUMPTION a validar con diseño): entrada decorativa 180–250 ms, easing suave, transform/opacity; empieza después de contenido listo, cancelable al navegar. No reordenar foco. Navegación mueve foco al título principal cuando corresponda; actualización de carrito anuncia resultado sin robar foco. Reduced motion mantiene contenido en posición final legible, sin scrub/parallax, pinning decorativo, rotación automática ni transiciones de cámara. Debe reaccionar al cambio de preferencia mientras la página está abierta, revertir la variante anterior y detener loops decorativos sin resetear selección/carrito. CSS, GSAP, controles 3D y scroll smoothing comparten esa política; una animación de duración cero no resuelve por sí sola pinning ni trabajo recurrente.

| Estado visual | Entrada | Acción | Salida |
| --- | --- | --- | --- |
| HTML_READY | Ruta disponible | Mostrar catálogo/poster y controles | Loading opcional por intención/visibilidad |
| LOADING_3D | Capacidad y presupuesto aceptados | Carga diferida; HTML sigue operable | READY, timeout o error |
| READY | Assets y contexto válidos | Render bajo demanda; animación solo visible y permitida | PAUSED, CONTEXT_LOST, salida de ruta |
| PAUSED | Fuera de viewport, pestaña oculta o reduced motion | Parar loop decorativo | Revalidar antes de reanudar |
| CONTEXT_LOST | Evento de pérdida | Parar trabajo; conservar selección en store comercial; mostrar 2D | Un intento acotado de recuperación o FALLBACK |
| RECOVERING | Restauración soportada y usuario presente | Reconstruir recursos válidos, validar generación | READY o FALLBACK |
| FALLBACK | Sin WebGL, timeout, error o presupuesto excedido | Compra completa en HTML; opción manual de reintentar 3D | Nuevo intento aislado, sin recargar pedido |

La recuperación no debe regenerar pedidos ni perder carrito. Manejo del evento/contexto conforme al renderer y versión; no renderizar contra contexto perdido. Tras fallo repetido conservar 2D durante sesión. Respuesta tardía de asset tras timeout no sustituye una escena más reciente.

Carga: 3D fuera del camino crítico, poster con dimensiones; no lazy-load del recurso LCP. Auditar modelos/texturas/derechos y transfer comprimido frente a memoria decodificada. Para textura RGBA8, estimación base ancho × alto × 4 bytes; mipmaps completos aproximadamente ×4/3, más caras/capas; formatos comprimidos y targets requieren fórmula propia. Incluir buffers, targets multisample, sombras y passes. Proponer DPR máximo móvil 1,5 como ASSUMPTION, degradando resolución, sombras y passes por profiling antes de afectar controles HTML. Presupuesto GPU numérico definitivo pendiente de assets y dispositivos; ausencia de ese presupuesto bloquea 3D de release, permite release con 2D validado.

## 5. Contrato de pedidos e idempotencia

Contrato propuesto de nuestra API, pendiente de contrato real del proveedor: POST /order-operations recibe operation_id estable, cart_version, líneas/variantes/cantidades y referencia a quote; moneda y precio se verifican servidor. Identidad del usuario/tenant viene de auth servidor. Response y consulta GET /order-operations/{operation_id} exponen operation_status, order_id cuando existe, versión y timestamps, error tipado y correlation_id. Campos obligatorios/opcionales, enums, límites y compatibilidad se fijan en esquema versionado. GET autorizado por dueño; claves aleatorias no sustituyen autorización.

Separar tres entidades: operación de creación (pending/unknown/confirmed/rejected), pedido comercial (según contrato), envío o mensaje (sent/delivered si corresponde). delivered de una notificación no demuestra pago ni pedido entregado. Confirmar significado, IDs y fuente de verdad antes de mapear eventos. Un 2xx de transporte solo acredita recepción/respuesta conforme a su contrato.

El cliente crea y persiste operation_id antes del primer envío y lo reutiliza al reintentar el mismo intento lógico, incluso tras recarga. Deshabilitar doble click ayuda UX pero no garantiza idempotencia. Nuevo payload requiere nuevo intento solo cuando el anterior está resuelto o reemplazado explícitamente; cambiar key para escapar de un timeout está prohibido.

Ledger durable servidor: clave única (tenant, actor/checkout, tipo_operación, operation_id), hash canónico del payload semántico, estado, provider_operation_id/order_id, resultado estable y timestamps. Crear ledger/reserva local atómicamente; concurrencia se serializa por unicidad/claim con lease. Mismo key y payload: devolver operación/resultado existente; mismo key distinto payload: conflicto 409 sin efecto. Si está en curso, devolver 202 y ubicación de consulta; 201/200 confirmado incluye el mismo order_id para replays, según contrato acordado.

Retención propuesta: resultado replayable mínimo siete días (ASSUMPTION), nunca menor que retry/offline y TTL del proveedor; operaciones ambiguas no se purgan por edad. Mantener vínculo permanente operation_id→order_id o tombstone suficiente para impedir recreación tardía. Definir política después de caducidad: rechazar key conocida expirada y reconciliar, no tratarla automáticamente como nueva. Backend y seguridad fijan retención final y minimización de datos.

Frontera externa: ledger local no hace atómica la llamada al proveedor. Si éste admite idempotency key, usar key derivada estable y lookup por ID dentro de su ventana verificada. Si no admite idempotencia ni lookup inequívoco, no repetir automáticamente una escritura ambigua: cola de reconciliación y revisión humana. Puede no ser posible garantizar ausencia de duplicados externos; esta limitación es bloqueante para checkout automático con reintentos.

| Estado de operación | Evento | Transición/acción UI |
| --- | --- | --- |
| DRAFT | Submit | Persistir key → SUBMITTING; feedback inmediato |
| SUBMITTING | Confirmación válida | CONFIRMED; mostrar pedido único |
| SUBMITTING | Timeout, conexión rota o aborto cliente | UNKNOWN; «Estamos comprobando tu pedido»; conservar key/carrito |
| UNKNOWN | Lookup encuentra efecto | CONFIRMED con order_id existente |
| UNKNOWN | En proceso/ausencia no concluyente | RECONCILING; no permitir nueva creación ciega |
| RECONCILING | No aplicado demostrado por contrato | Retry controlado misma key o REJECTED según motivo |
| RECONCILING | Presupuesto agotado | MANUAL_REVIEW; referencia de seguimiento y responsable |
| Cualquier intento | Error definitivo schema/auth/rechazo negocio | REJECTED; corregir causa, no retry automático |

Abortar fetch no cancela el efecto servidor. No mostrar «pedido fallido» por timeout ni descontar/reponer stock por eventos de transporte. Reservas, pago y pedido necesitan IDs y compensaciones propias; si hay fallo parcial tras cobro, revisar/reconciliar antes de liberar stock o repetir pago.

Retry propuesto (ASSUMPTION): hasta tres reintentos recuperables dentro de 30 s con backoff exponencial y jitter; respetar Retry-After y presupuesto total. Lecturas pueden reintentarse; 429/5xx/timeouts de escritura solo con garantías anteriores y reconciliación. No retry por schema, 401/403 ni rechazo comercial. Tras límite, worker durable continúa lookup/reconciliación con plazo y alerta acordados; no mantener navegador como única autoridad. Circuit breaker limita proveedor degradado. Outbox transaccional registra trabajo local; reconciliar caída entre aceptación externa y guardado local mediante key/ID del proveedor, sin afirmar exactly-once.

## 6. Eventos duplicados y desordenados

Contrato event envelope a acordar: event_id, provider, schema_version, entity_type/entity_id, event_type, occurred_at, received_at, versión/secuencia si existe y payload validado. Autenticación/verificación del POST por bytes originales, algoritmo, rotación y headers definidos por el proveedor; no inventar firma universal. Challenge inicial de webhook no valida autenticidad de cada POST. Rechazar autenticidad inválida; cuarentena y alarma para versión/tipo desconocido, con política explícita de ACK. No asumir que eventos desconocidos se procesaron comercialmente.

Receiver valida, guarda inbox durable con unique(provider,event_id) y responde ACK después de persistencia, antes del trabajo comercial. Si persistencia falla devuelve error recuperable. Worker aplica actualización de entidad, marca evento procesado y produce outbox de efectos en una transacción. Crash antes/después de commit y redelivery deben ser recuperables. Concurrencia por entity_id usa versión/lock; inbox dedup solo no evita duplicar emails, reservas o cargos: cada efecto tiene clave lógica durable y consumidor idempotente. DLQ y replay conservan IDs y tienen responsable de integración.

Para una misma entidad compatible con progreso monotónico: delivered → sent → delivered conserva delivered. Registrar sent como hecho tardío sin degradar proyección; segundo delivered con mismo event_id es duplicado técnico, con distinto ID puede ser hecho lógico repetido y no vuelve a disparar efecto. Mantener historial completo, orden de recepción y ocurrencia. Preferir secuencia/version de proveedor cuando exista; timestamps no garantizan orden. Terminales excepcionales como devolución/cancelación requieren máquina propia; no aplicar ranking universal a todo el pedido. Contradicción o evento de entidad aún desconocida: conservar pendiente y reconciliar snapshot oficial, sin inventar entidad ni sobrescribir un estado más reciente.

## 7. Performance y pruebas propuestas

El 98 de portada es señal de laboratorio con condiciones desconocidas. El 430 ms comunicado supera el objetivo INP de 200 ms; no permite declarar rendimiento premium aprobado. TBT no es INP. RUM calcula INP por visita/página, no promedio de handlers ni suma de rutas SPA; etiquetar acciones/rutas para atribución y separar métrica de interacción de página. Segmentar móvil/escritorio, build, navegación caliente/fría, red y ruta; explicar limitaciones de CrUX agregado y su ventana.

| Presupuesto | Criterio propuesto | Evidencia futura |
| --- | --- | --- |
| Campo | p75 INP ≤200 ms, LCP ≤2,5 s, CLS ≤0,1 por segmento crítico | RUM con muestra/ventana declarada; CrUX como corroboración cuando disponible |
| Interacción laboratorio | Cantidad, filtro, variantes, carrito, CTA, back/forward, tras diez rutas; feedback visible ≤200 ms en dispositivo acordado | Event Timing/traces y desglose input delay, procesamiento, presentación; criterio local, no sustituto de INP campo |
| Lifecycle | Conteos propios vuelven a inventario; caché acotada; sin crecimiento sostenido en 10/50 ciclos | Tabla por ciclo, heap retenido, renderer.info y límites GPU |
| Carga/recursos | Bytes JS, assets y terceros; GPU/CPU por dispositivo | Límite numérico por ruta pendiente del baseline; no inventar estándar universal |
| Inmersión | Cero loop decorativo oculto/fuera de viewport/reduced motion | Instrumentación loop/ticker y consumo; HTML mantiene tarea |

Diagnóstico: reproducir selector de cantidad sin asumir culpabilidad; capturar trace y React profiler de actualización antes/después y tras navegación. Atribuir tareas largas a stack, renders, listeners duplicados, raycasting, terceros, layout o GPU. Confirmar coste, después aislar estado de cantidad, evitar recomputar escena, fraccionar trabajo no urgente, usar worker para cálculo transferible y preservar feedback urgente. Medir si la modificación cambia processing o presentation. Para LCP separar TTFB, descubrimiento, descarga y render delay; para CLS localizar shifts y reservar dimensiones. No prometer que transform/opacity garantizan fluidez.

Todas las filas siguientes tienen performed=false y outcome=NOT_RUN; son diseños de pruebas, no resultados.

| ID | Prueba | Resultado esperado | Responsable |
| --- | --- | --- | --- |
| T1 | 10 y 50 rutas, mismas escenas warm/cold, back/forward y StrictMode | Triggers propios sin retención; loops y listeners sin duplicados; recursos estabilizados dentro de caché aprobada | Motion/3D QA |
| T2 | Cambiar reduced motion abierto, durante scrub, resize y assets/fuentes tardíos | Estado accesible final, sin pinning decorativo ni loop; foco y CTA disponibles; refresh solo por geometría real | Frontend/accesibilidad |
| T3 | Desactivar JS/WebGL, fallo descarga, timeout y pérdida/restauración de contexto | Catálogo/producto/carrito/preparar pedido por HTML; selección conservada; recuperación acotada | QA |
| T4 | Dos escenas comparten textura; desmontar una; carga tardía tras salida | Recurso sigue válido para consumidor activo; último owner libera; resultado obsoleto no reanima escena | 3D |
| T5 | Servidor crea y se pierde respuesta; replay simultáneo, recarga cliente | Un pedido/reserva por intento lógico; mismo ID; UNKNOWN se resuelve mediante lookup | Backend/QA |
| T6 | Mismo key distinto payload, key expirado, crash antes/después de efecto externo | Conflicto sin nuevo efecto; expiración segura; reconciliación durable, sin escritura ciega | Backend |
| T7 | delivered/sent/delivered; IDs iguales/distintos; concurrentes; event antes de pedido | Sin degradación ni efecto comercial duplicado; historial y pendientes recuperables | Integraciones |
| T8 | Firma inválida, challenge válido/POST inválido, esquema nuevo, inbox caído | No procesar eventos no autenticados; ACK solo durable; cuarentena y reentrega conforme contrato | Integraciones/seguridad |
| T9 | 429 Retry-After, 5xx, 401/403, rechazo comercial; worker caído/DLQ replay | Retry acotado pertinente; operación ambigua visible; replay conserva idempotencia | Backend/SRE |
| T10 | Traces cantidad/variantes/carrito/CTA, 3D activo/2D, tras diez rutas | Causa atribuida y medición comparable; ausencia de regresión compra y foco | Performance/QA |

Ejecutar futuro baseline y candidato con mismo build mode, móvil representativo real, navegador/OS, red/CPU documentados, cache y datos controlados; al menos cinco corridas por escenario propuesto, medianas y rango además de distribución. Registrar URL/ruta, secuencia, input, esperado/observado, fecha, commit, logs y artefacto trace; no solo score agregado. RUM: propuesta de siete días y ≥1.000 visitas válidas móviles con interacciones por cohorte crítica, revisable con analítica; si volumen insuficiente, estado de campo INCONCLUSO, no PASS. No comparar cohortes con composición distinta como causalidad demostrada.

## 8. Gate de release y recuperación

NO-GO actual para declarar resueltos estos fallos: no hay implementación ni verificación del producto. Gate de propuesta: revisable, con incertidumbres identificadas.

Gate futuro: versiones/contratos confirmados, owner asignado, T1–T10 ejecutados con evidencia; recorrido accesible 2D completo; reduced motion dinámico; recursos estables y presupuestos definidos; timeout reconciliable sin pedido duplicado; eventos no degradan ni duplican efectos; traces y compra verificados. La versión 3D exige budget/dispositivo y context recovery probados; si no, activar versión 2D validada. La aprobación de rendimiento de campo exige umbrales por cohortes y muestra suficiente; 98 no permite excepción implícita.

Propuesta de rollout tras gates de seguridad/función: canary acotado con feature flags independientes para motion y 3D, comparado con control y build etiquetado. Campo aún insuficiente solo permite canary supervisado, no certificación final de rendimiento. Alertas: cualquier duplicado comercial atribuible o pérdida de acceso al checkout detiene expansión; INP p75 >200 ms, incremento de errores/context loss o crecimiento de recursos exige investigación y desactivar mejora visual según evidencia. Monitorizar también operaciones UNKNOWN por edad, lag inbox/outbox, DLQ, replays y conflictos de key, sin PII ni secretos.

Rollback: desactivar motion/3D conserva HTML y estado comercial; volver frontend no elimina ledger/inbox ni cambia IDs. Backend migraciones aditivas y compatibles; no borrar historial para recuperar. Pedidos ambiguos siguen reconciliándose durante rollback; duplicado confirmado va a responsable de operaciones, con compensación autorizada y auditable. Release owner registra decisión GO/NO-GO, evidencia, excepciones y ventanas; este documento no autoriza despliegue.

## 9. Aplicación trazable de las skills

Localizadas por frontmatter `name` dentro de `/root/.codex/skills/remote-skills`, todas v0.2.0 EXPERIMENTAL. Leídos SKILL.md, contract.json, protocol.md, technical-specification.md, output-schema.json y evaluation-cases.json. No usado contexto previo ni artefactos de proyecto. Las etiquetas `*_code` se mantienen como nombres contractuales de entregable documental, con implementación NOT_APPLICABLE a este alcance; no contienen código ejecutable.

| Skill / ruta localizada | Outputs documentales | evidence_ids | limitations |
| --- | --- | --- | --- |
| gsap-animation / skill-6ac9d99d57a481918dae0c5caca5a213 | animation_code: spec sección 4; cleanup: matriz sección 3; verification: T1/T2 | B1,B2,S1,S2 | Versiones/spec instaladas desconocidas; pruebas NOT_RUN |
| threejs-experience / threejs-experience | scene_code: arquitectura sección 3; loading_plan y fallback: sección 4 | B1,B2,S3 | Budget/VRAM/dispositivo pendientes; pruebas NOT_RUN |
| api-integration / skill-6ac9c9408e1c8191addfa4b9e1a72b9b | integration_code: contrato sección 5; error_handling: secciones 5/6; tests: T5–T9 | B3 | Proveedor/semántica/garantías pendientes; pruebas NOT_RUN |
| web-performance / web-performance | performance_budget, measurements y fixes: sección 7 | B4,S4 | Datos cliente sin fuente exportada; todas mediciones nuevas NOT_RUN |

Para cada output: summary es la decisión de su sección; data son tablas/método de esa sección; evidence_ids y limitations figuran arriba. Envelope común: task_id engineering-forward-oct10; skill según fila; version 0.2.0; status NEEDS_REVIEW; result según outputs; evidence sección 1; assumptions etiquetadas en secciones 4/5/7; missing_inputs sección 1; validation T1–T10 performed=false/NOT_RUN; next_actions sección 2. Esta representación Markdown es documental, no afirma validación automática de JSON Schema.

Validación realizada de esta entrega: lectura de las cuatro skills y referencias y consulta de fuentes oficiales citadas. Validación de producto: NOT_RUN en su totalidad. Próxima acción: responsables confirmar inputs y convertir propuesta en cambios revisables; QA ejecutar matriz en entorno autorizado; release owner evaluar gates. No inferir éxito de producción de la completitud del plan.
