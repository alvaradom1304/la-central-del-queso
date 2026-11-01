# threejs-experience — criterios de ingeniería

No asumir que un GLB pequeño usa poca memoria GPU; estimar por dimensiones, canales, mipmaps, render targets y buffers, y comprobar con herramientas disponibles. Definir quién posee cada recurso compartido para evitar liberarlo mientras otro componente lo usa. Detener el bucle de render y retirar listeners/controles; liberar geometrías, materiales, texturas y render targets explícitamente según su ciclo de vida. Quitar un mesh no libera esos recursos. Usar estadísticas del renderer como señal de tendencia, no exigir cero absoluto por cachés internos. No incluir precio/CTA únicamente dentro del canvas. Preservar contraste y una descripción útil del contenido significativo fuera del 3D. Si el dispositivo no cumple el presupuesto, degradar efectos o usar 2D antes de degradar compra.

## Caso adverso determinante

El modelo falla al descargar y luego se pierde el contexto WebGL; abrir producto y preparar pedido debe seguir funcionando mediante HTML/2D.

## Evidencia de aceptación

- Fallback cubre la misma tarea esencial
- Liberación respeta ownership de recursos compartidos
- Memoria e instancias no crecen sin límite tras rutas repetidas

Registrar entorno, build/versión, entrada, resultado esperado/observado y artefacto. Marcar NOT_RUN cuando no se ejecute; no sustituir una comprobación por una promesa de optimización futura.

## Contrato de datos de salida

Seguir los tipos y campos requeridos de output-schema.json; no devolver prosa en data. Usar null para versión/métrica/observación no disponible, NOT_RUN para prueba pendiente y arrays vacíos solo con explicación en summary/limitations. Un schema válido no demuestra ejecución. Registrar unidades, entorno, ownership y política de recuperación según el campo.
