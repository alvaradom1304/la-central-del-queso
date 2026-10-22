# Rediseño artesanal elegante — 2026-10-18

Encargo: abandonar el minimalismo y recuperar la calculadora de feria.
Diagnóstico: fondos claros continuos y pequeñas ilustraciones producían poca profundidad visual.
Comparación: (A) fotografía envolvente con capas CSS y jerarquía editorial; (B) escena WebGL de producto. Se eligió A para preservar detalle fotográfico y acceso rápido a precios/pedido sin nuevos paquetes ni assets externos.
Implementación: portada y /claude comparten diseño, hero fotográfico verde/latón, monograma, selección de tres productos, carta, calculadora como libro abierto, ferias y negocio. Imágenes reutilizadas del proyecto; procedencia/licencias originales no auditadas en esta tarea. Sin publicación externa.
Calculadora: mantiene factores .22/.42/.65 y umbrales originales de CheeseMatcher, usa los precios de lib/products y el mismo PedidoProvider del catálogo. Cantidades orientativas, confirmación de peso por WhatsApp.
Verificación: TypeScript --noEmit --incremental false PASS. Navegador: 4 personas diario + 2 kg semiduro + 1 palmito + 1 natilla = 16700 CRC; al agregar se observaron las mismas tres líneas y total. Móvil 390x844 sin overflow horizontal; hero y recibo revisados visualmente. Prueba en pestaña separada cerrada sin enviar pedido. Animación de entrada y hover desactivables por prefers-reduced-motion. No benchmark FPS, build producción ni auditoría WCAG completa.
Aprendizaje: elevar elegancia exige cambiar composición, proporción fotográfica y contraste de materiales; cambiar colores de la misma estructura no bastaba. Preservar utilidad como elemento central.
Skill aplicada: frontend-design. Guía de mejora visual consultada. No WebGL, cursor experimental ni librerías nuevas.