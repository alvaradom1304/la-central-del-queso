# api-integration — criterios de ingeniería

No usar una respuesta 2xx de transporte como comprobación del resultado comercial. Clasificar operaciones por lectura/escritura y por efecto externo; un timeout de escritura deja resultado desconocido hasta reconciliar. El key de idempotencia necesita ámbito, persistencia, caducidad y política frente a payload diferente con mismo key. Definir transiciones monotónicas cuando proceda para no degradar delivered a sent por evento tardío; conservar historial de hechos. Validar firma sobre los bytes y algoritmo que exija el proveedor, sin inventar un header universal. Distinguir secreto de verificación inicial de autenticidad del POST. Documentar eventos no soportados y campos opcionales. Acotar reintentos a presupuesto y errores recuperables; no repetir rechazo de schema/autorización. Diseñar reconciliación y responsable de excepciones; no afirmar exactly-once por tener deduplicación.

## Caso adverso determinante

El servidor aplica una reserva, se pierde la respuesta y el cliente reintenta; llega además dos veces el mismo webhook de confirmación.

## Evidencia de aceptación

- Resultado ambiguo se reconcilia por ID
- Una reserva y una transición comercial por evento lógico
- No duplicar efecto ni afirmar exactly-once

Registrar entorno, build/versión, entrada, resultado esperado/observado y artefacto. Marcar NOT_RUN cuando no se ejecute; no sustituir una comprobación por una promesa de optimización futura.

## Contrato de datos de salida

Seguir los tipos y campos requeridos de output-schema.json; no devolver prosa en data. Usar null para versión/métrica/observación no disponible, NOT_RUN para prueba pendiente y arrays vacíos solo con explicación en summary/limitations. Un schema válido no demuestra ejecución. Registrar unidades, entorno, ownership y política de recuperación según el campo.
