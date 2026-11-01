# Ejemplo aplicado: piloto de La Central del Queso (laboratorio interno)

**Esto no es un caso comercial ni prueba de la oferta.** El piloto no tiene contrato, pago ni aceptación del cliente, y no acredita ventas, retorno ni un precio de US$10.000. Sirve para mostrar cómo se usa el proceso con un proyecto real del equipo. Usar la identidad del piloto fuera de Altiora requiere permiso (`PRUEBA-PILOTO.md`).

Repositorio: `C:/Users/Usuario/OneDrive/Desktop/client-central-del-queso`. Solo se leyó, y el chequeo de tipos no escribió archivos (`git status` limpio antes y después).

## Estado por etapa

| Etapa | Estado en el piloto | Evidencia | Compuerta |
|---|---|---|---|
| 1. Diagnóstico y venta | No aplica como venta: es un laboratorio, sin comprador que pague | `CLIENTS_PORTFOLIO.md`, `OFERTA.md:3` | — |
| 2. Propuesta y contrato | No hay | — | — |
| 3. Planificación | Sin plan de horas ni registro de horas reales | — | G3: NO VERIFICADO |
| 4. Estrategia y experiencia | Recorrido de catálogo → recomendador → carrito → consulta | `PRUEBA-PILOTO.md:9-11` | G4: falta un brief aprobado |
| 5. Producción | Componentes implementados. Activos 3D y renders sin registro de derechos | commits `d82d483` y `43e8ac4` del repositorio raíz | G5: HOLD (falta la plantilla 07) |
| 6. Calidad | Ver el registro de evidencia | abajo | G6: HOLD |
| 7. Lanzamiento | No hay | — | — |
| 8. Rentabilidad | No calculable: faltan horas y costes reales | — | — |

## Registro de evidencia · 31/10/2026 (plantilla 06)

Versión observada:
- subrepositorio `web`: rama `main`, commit `73519f0`;
- repositorio raíz: rama `estudio-render-blender`, commit `d4ac166`.

Entorno: local, Windows 11, Node v24.21.0. Revisor: Claude Code. No construyó el piloto, pero tampoco es una persona independiente.

| Área | Resultado | Evidencia y límite |
|---|---|---|
| Correspondencia del código revisado | **PASS** | `manifiesto.py verificar --manifiesto docs/altiora-business/PILOT-SOURCE-MANIFEST.json`: 8 de 8 archivos coinciden con los inspeccionados en la revisión de código. No acredita ejecución. |
| Tipos (TypeScript 5.9.3, `tsc --noEmit --incremental false`) | **PASS** (exit 0) | Comprobación estática: no prueba el comportamiento. |
| Recorrido funcional en ejecución | NO VERIFICADO | Falta levantar la web en local con datos sintéticos; requiere autorización para iniciar el servidor de desarrollo. |
| Envío de la consulta | NO VERIFICADO | El carrito abre WhatsApp con una línea provisional (`CartDrawer.tsx:39,66,286`). No se probó ni debe enviarse a una línea externa. |
| Móvil, teclado, accesibilidad, rendimiento | NO VERIFICADO | Requiere la ejecución anterior y un revisor. |
| Seguridad | Parcial | La API valida que haya campos, pero no cantidades ni precios (`PRUEBA-PILOTO.md:12`). El webhook se despacha sin confirmar la recepción. |
| Derechos de activos | NO VERIFICADO | No hay registro de activos (plantilla 07) para modelos, renders ni imágenes. |

## Decisión que bloquea la aceptación del piloto (R-13)

El recorrido de aceptación tiene que ser uno solo. Alternativas:

1. **Consulta por WhatsApp.** La interfaz actual ya la usa.
   - Aceptación: la vista previa del mensaje es correcta y la línea está validada por el responsable.
   - Límite: no deja un registro durable. No cumple «registro y asignación» de la oferta salvo con un paso manual documentado.
2. **Pedido durable por API.**
   - Aceptación: la ruta `/api/orders` valida cantidades y precios en el servidor, guarda el pedido en un destino durable y confirma la recepción del webhook. El SOP y la interfaz pasan a ese recorrido.
   - Coste: más horas de construcción. Requiere una plantilla 04 si se trata como cambio.

**Decisión del fundador, 31/10/2026: opción 2, pedido durable por API.** WhatsApp puede seguir como canal de aviso o confirmación, pero ya no es el registro del pedido.

## Implementación · 31/10/2026, sin commit

Hecha en `web` (rama `main`, sobre `73519f0`), en la copia de trabajo y sin commit. Se aplicaron los 8 cambios de la especificación siguiente, con almacén local para la demostración:
- **Módulos nuevos:** `lib/orders.ts` (validación, precios y ID), `lib/orderStore.ts` (interfaz, memoria y JSON Lines), `lib/orderService.ts` (guarda primero y avisa después).
- **Ruta y carrito:** la ruta usa esos módulos; el carrito registra el pedido, muestra el número y ofrece WhatsApp solo si existe `NEXT_PUBLIC_BUSINESS_PHONE`.
- **Protocolo:** `TESTING_SOP.md` reescrito.
- **Pruebas:** `npm test` con `node:test` y el TypeScript ya instalado, sin dependencias nuevas.

| Comprobación | Resultado | Evidencia y límite |
|---|---|---|
| Pruebas automáticas (`npm test`) | **PASS 12/12** | Validación, precios en servidor, 409 por total manipulado, 503 sin destino o con fallo de escritura, `NOTIFY_FAILED` y JSON Lines |
| Tipos (`tsc --noEmit`) | **PASS** | Todo el proyecto |
| Build de producción (`next build`) | **PASS** | `/api/orders` dinámica. Se ejecutó antes de normalizar los finales de línea a CRLF, sin cambios de contenido. Lint omitido: el proyecto no tiene configuración de ESLint (NO VERIFICADO) |
| Versión probada | **PASS** | [manifiesto de 12 archivos](evidencia/piloto-pedido-api-2026-10-31.json) |
| Recorrido en navegador (360 y 1440 px, teclado) | NO VERIFICADO | Requiere iniciar el servidor de desarrollo local, que no está autorizado todavía |
| Aviso real (n8n) | NO VERIFICADO | El código lo espera con un tiempo límite de 5 s. **Advertencia:** si `.env` o `.env.local` definen `N8N_ORDER_WEBHOOK_URL` (no se leyeron), una prueba local llamaría a ese webhook real |
| Destino durable en producción | Pendiente | En Vercel la API responde 503 a propósito hasta configurar un adaptador durable autorizado |

`PILOT-SOURCE-MANIFEST.json` ya da FAIL en `CartDrawer.tsx`, `route.ts`, `package.json` y `TESTING_SOP.md`, como era de esperar. Las afirmaciones de `PRUEBA-PILOTO.md` sobre esos archivos describen el código anterior y hay que reevaluarlas.

## Especificación de los cambios (implementada; ver arriba)

Basada en el código leído el 31/10/2026 (`web` main@`73519f0`), antes de implementar.

| # | Hallazgo (H) | Archivo | Cambio requerido |
|---|---|---|---|
| 1 | La interfaz no llama a la API: el carrito arma el mensaje y abre `wa.me` con la línea provisional `50688888888` | `components/CartDrawer.tsx:69-75` | El envío llama a `POST /api/orders` con los artículos y cantidades del carrito. Se muestra el ID del pedido o un error recuperable. WhatsApp, si se usa, solo se abre después de que el pedido quedó registrado. |
| 2 | La API acepta un solo producto (`productId`, `quantity`), pero el carrito tiene varios | `lib/orderSchema.ts:1-12` | El esquema pasa a `items: {productId, quantity}[]`, con nombre, teléfono, punto de retiro, notas y origen. |
| 3 | La API confía en el nombre, la unidad y el total que envía el navegador | `app/api/orders/route.ts:9,43,45` | El servidor recalcula precios y total desde `lib/products.ts`. Rechaza producto desconocido o agotado, cantidades no enteras o fuera de rango (p. ej. de 1 a 50), y textos demasiado largos. |
| 4 | Sin registro durable: solo `console.log` | `route.ts:27` | Guardar con una interfaz `OrderStore`, y responder 201 **solo después** de que la escritura se confirme. |
| 5 | El webhook se despacha sin esperar respuesta. En un entorno serverless puede cortarse al responder, y el pedido se pierde sin aviso | `route.ts:30-39` | Esperar la respuesta con un tiempo límite. Si falla, el pedido sigue guardado con el estado `NOTIFY_FAILED` y queda visible para el procedimiento manual. |
| 6 | Datos personales (nombre, notas) en los registros del servidor | `route.ts:27,37,59` | Registrar solo el ID del pedido y el estado. |
| 7 | ID de 4 caracteres aleatorios: puede repetirse | `route.ts:17` | ID único (`crypto.randomUUID()` o fecha + sufijo largo), y comprobar que no está repetido en el almacén. |
| 8 | El SOP espera un modal de un producto y Sheets, distinto de la interfaz actual | `TESTING_SOP.md:26-42` | Reescribir el SOP para el recorrido carrito → API → registro → aviso, con los datos sintéticos de las pruebas. |

**Destino durable (por decidir):**
- **(a) Adaptador local** (archivo JSON Lines fuera de `public/`) para la demostración interna. No usa servicios externos ni credenciales, pero no sirve en Vercel.
- **(b) n8n → Google Sheets**, el destino que ya prevé el SOP. Necesita autorización para usar la cuenta y el webhook reales.

Recomendación (R): (a) para la demostración interna y (b) más adelante, detrás de la misma interfaz `OrderStore`.

**Pruebas exigidas (plantilla 06):**
- pruebas unitarias de validación y recálculo de precios;
- una prueba de la ruta con almacén en memoria: 201 con el pedido guardado, 400 con datos inválidos o un total manipulado, y fallo del aviso → pedido guardado con `NOTIFY_FAILED`;
- `tsc` y `lint` sin errores;
- recorrido manual en 360 y 1440 px con datos sintéticos;
- manifiesto creado de la versión probada.

Esfuerzo estimado (S, sin medir): 8–12 h. Va como solicitud de cambio (plantilla 04) dentro del laboratorio. No consume horas de un cliente.

## Criterios de aceptación propuestos para la demostración interna

Datos, nombres e imágenes sintéticos. Sin envío externo.

1. Selección → cantidades → carrito → vista previa de la consulta, en 360 px y 1440 px, también con teclado.
2. Tres pedidos de prueba con varios productos quedan guardados con un ID único y con el total recalculado en el servidor. Un total manipulado se rechaza. Si falla el aviso, el pedido queda guardado como `NOTIFY_FAILED` y hay un procedimiento manual.
3. Movimiento reducido: el contenido y el carrito siguen siendo accesibles sin animación 3D.
4. Manifiesto creado de la versión probada y verificado con PASS antes de enseñarla.
5. Registro con fecha, versión, navegador o dispositivo y capturas. Lo que falte, NO VERIFICADO.

Lo que Altiora puede decir hoy sigue siendo exactamente lo que fija `PRUEBA-PILOTO.md:21`.

## Limpieza de afirmaciones sin fuente · 31/10/2026, sin commit

Es la consecuencia de la auditoría del [brief creativo diferencial](piloto/BRIEF-CREATIVO-DIFERENCIAL.md) y la aprobó el fundador. Criterio: retirar o neutralizar lo que no tiene fuente sin inventar un sustituto. Los IDs y precios de los productos no cambian.

| Qué | Dónde | Cambio |
|---|---|---|
| 3 testimonios inventados con nombre propio, ofertas no confirmadas (100 g de cortesía, «fila express», «18 cupos», cierre los viernes, regalo cada 4.º pedido) y «Código VIP» | `VipTastingPass` | El componente **deja de mostrarse** en `page.tsx`; el archivo se conserva |
| «Finca Doña Martha», 1980/45 años, 1.220 m, hato Jersey, 34 °C, 14 °C, guayabo, pastoreo libre, historia familiar contradictoria | `FincaToTableExperience`, marquesinas de `page.tsx`, `BrandArtDirection`, `InteractiveArtisanalPhysics`, `VideoScrollytellingPlayer`, `Footer`, metadatos de `layout.tsx` | Sustituidos por hechos verificados (ferias, días, degustación en el puesto) y el recorrido marcado como **ilustración** |
| «Queso Turrialba» y «de Turrialba» en nombres y textos (denominación de origen sin verificar) | `products.ts`, `CheeseMatcher`, la finca | Nombres neutros: «Queso Semiduro Tradicional», «Queso Fresco Artesanal» y la categoría «Línea Tradicional» |
| Afirmaciones de salud o composición: «Bajo en sal», «Sin almidones», «100 % pura crema/natural», «Sin almidones ni grasas vegetales» | `products.ts`, `CheeseMatcher`, la finca, marquesina | Retiradas |
| Número falso `50688888888` | `Footer`, sección mayorista de la finca, `ProductCatalog`, `lib/whatsapp.ts` | Un solo número en `NEXT_PUBLIC_BUSINESS_PHONE`. Sin configurarlo, el enlace lleva al catálogo |
| La marquesina se mueve sin respetar la preferencia de movimiento reducido | `BrandArtDirection` | `useReducedMotion`: con esa preferencia, la cinta queda quieta |

**Comprobaciones:** `npm test` 12/12, `tsc` y `next build` PASS. [Manifiesto de la versión limpia](evidencia/piloto-limpieza-2026-10-31.json): 38 archivos, PASS. El manifiesto anterior da FAIL solo en `products.ts`, como se esperaba.

**No se tocaron** porque no se muestran en la página: `HaciendaWorld3D`, `Header`, `HeroJourney`, `StorySection` y el texto de `ProductCatalog`. Conservan afirmaciones sin fuente y no deben volver a usarse sin revisarlas. **Navegador: NO VERIFICADO.**

**Pendiente del cliente:**
- confirmar la historia real (años, fundación, si elabora o compra el queso);
- aclarar la relación con la denominación de origen Queso Turrialba;
- hacer una cata para validar las fichas sensoriales;
- dar su consentimiento para usar nombres, imágenes y la frase de la degustación.
