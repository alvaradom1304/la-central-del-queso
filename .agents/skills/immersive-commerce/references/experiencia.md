# Experiencia, rendimiento y posicionamiento

## UX y narrativa

- Definir tareas prioritarias y puntos de incertidumbre. Diseñar primero navegación, información de producto, selección, pedido y ayuda.
- Hacer la narrativa opcional y progresiva; permitir saltar al catálogo, volver atrás y recuperar selección.
- Mostrar unidad y precio con claridad: kg, gramos, pieza o paquete. Explicitar si el total es estimado por pesaje, cómo se confirma y cómo se cobra entrega.
- Preparar estados de carga, vacío, error, sin stock y confirmación. Diseñar responsive y probar teclado, foco, contraste y lectores de pantalla cuando aplique.
- Usar Figma si hay herramienta/acceso útil; no declarar archivos Figma creados sin haberlos creado. Usar prototipos del proyecto como alternativa.

## Movimiento y 3D

Elegir CSS para transiciones sencillas; GSAP para coordinación compleja si se justifica; WebGL/Three.js para interacción espacial con valor definido. No instalar todas las opciones por defecto.

- Cargar escenas costosas de forma diferida; mantener contenido principal usable antes de inicializarlas.
- Optimizar modelos, texturas, luces, resolución y trabajo por frame; pausar cuando no sea visible y liberar recursos al desmontar.
- Respetar preferencia de movimiento reducido. Ofrecer imagen o contenido equivalente si falla WebGL o el dispositivo no sostiene la experiencia.
- No secuestrar scroll ni bloquear CTA, foco o navegación. Si se usa smooth scroll, comprobar enlaces internos, teclado y scroll nativo.

## WPO y presupuesto

Establecer un presupuesto antes de construir: peso inicial, recursos diferidos, JS, imágenes/modelos, tiempos y fluidez en móvil. Proponer valores según audiencia y verificar umbrales oficiales vigentes de Core Web Vitals si se adoptan; no inventar metas acordadas.

Medir carga y tareas reales en móvil representativo y red limitada. Distinguir métricas de laboratorio de datos reales de usuarios. Registrar entorno, versión y limitaciones. Revisar LCP, INP y CLS cuando corresponda, además de tamaño transferido, errores y costo del render 3D.

Aplicar imágenes responsivas y formatos adecuados, tamaños declarados, fuentes optimizadas y diferimiento de recursos secundarios. Priorizar el recurso que realmente determina LCP. Configurar caché y servidor según arquitectura actual. No usar una puntuación aislada como prueba de calidad integral.

## SEO local e internacional

- Partir de mercado y búsquedas relevantes; no prometer dominar resultados.
- Verificar rastreo, indexabilidad, enlaces, títulos, contenido útil, canonical, sitemap y datos estructurados pertinentes; evitar información importante exclusivamente en canvas.
- Mantener nombre, dirección y contacto coherentes si el negocio tiene ubicación pública. Considerar perfil local y cobertura de servicio según elegibilidad vigente y autorización.
- Preparar SEO internacional cuando existan mercados, idiomas y capacidad de atenderlos: arquitectura de URLs, traducción contextual, monedas, condiciones logísticas y hreflang si corresponde.
- No afirmar posicionamiento o tráfico incremental sin datos y periodo de comparación. Separar implementación técnica de resultados comerciales.
