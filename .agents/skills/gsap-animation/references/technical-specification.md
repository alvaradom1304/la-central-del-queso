# gsap-animation — criterios de ingeniería

Definir una sola autoridad para el scroll y documentar si hay Lenis u otro controlador. No duplicar listeners/tickers ni transformar el contenedor de forma que rompa el foco. Reservar dimensiones antes de inicializar y refrescar mediciones cuando cambie geometría real, no en cada frame. Mantener contenido legible si falla la inicialización. Separar recursos de GSAP de listeners, observers y timers de aplicación; sus limpiezas no son intercambiables. En SSR evitar acceso a window antes del cliente. En navegación repetida comprobar que el número de instancias se estabiliza. Usar transform/opacity cuando corresponda, sin convertirlo en garantía de composición o rendimiento. Documentar duración, easing, trigger, cancelación y destino del foco por interacción.

## Caso adverso determinante

Navegar diez veces a una ruta con ScrollTrigger y cambiar prefers-reduced-motion mientras está abierta; el CTA debe permanecer disponible sin listeners acumulados.

## Evidencia de aceptación

- Inspeccionar instancias antes/después y cleanup propio
- Restaurar estado accesible en reduced motion y desmontaje
- No declarar fluidez por inspección visual solamente

Registrar entorno, build/versión, entrada, resultado esperado/observado y artefacto. Marcar NOT_RUN cuando no se ejecute; no sustituir una comprobación por una promesa de optimización futura.

## Contrato de datos de salida

Seguir los tipos y campos requeridos de output-schema.json; no devolver prosa en data. Usar null para versión/métrica/observación no disponible, NOT_RUN para prueba pendiente y arrays vacíos solo con explicación en summary/limitations. Un schema válido no demuestra ejecución. Registrar unidades, entorno, ownership y política de recuperación según el campo.
