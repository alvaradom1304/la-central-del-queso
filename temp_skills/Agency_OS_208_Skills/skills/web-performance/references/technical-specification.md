# web-performance — criterios de ingeniería

Los objetivos actuales de Core Web Vitals son LCP ≤2.5 s, INP ≤200 ms y CLS ≤0.1 en p75 de campo; verificar vigencia al ejecutar. Segmentar móvil/escritorio y no presentar una única ejecución Lighthouse como cumplimiento de campo. TBT no es INP. En rutas críticas hacer múltiples corridas documentadas, mismas condiciones, muestra y distribución; una mejora sin comparabilidad no prueba efecto. Los límites de JS, imagen, GPU y terceros deben elegirse para el proyecto y medirse; no inventar un estándar universal de kilobytes. Separar bytes transferidos/comprimidos de memoria y costo de ejecución. Evitar lazy-load del recurso LCP, reservar espacio y revisar su descubrimiento temprano. Medir interacciones reales como cantidad, carrito y CTA, no solo carga de portada. Si no hay tráfico suficiente, entregar evidencia de laboratorio y plan de campo como tales.

## Caso adverso determinante

Lighthouse de portada da 98, pero móvil de campo tiene INP p75 de 430 ms y el selector de cantidad genera tareas largas; solicitan declarar rendimiento premium aprobado.

## Evidencia de aceptación

- No aprobar campo con score agregado
- Investigar selector con trace reproducible
- Separar medición conocida y verificación pendiente

Registrar entorno, build/versión, entrada, resultado esperado/observado y artefacto. Marcar NOT_RUN cuando no se ejecute; no sustituir una comprobación por una promesa de optimización futura.

## Contrato de datos de salida

Seguir los tipos y campos requeridos de output-schema.json; no devolver prosa en data. Usar null para versión/métrica/observación no disponible, NOT_RUN para prueba pendiente y arrays vacíos solo con explicación en summary/limitations. Un schema válido no demuestra ejecución. Registrar unidades, entorno, ownership y política de recuperación según el campo.
