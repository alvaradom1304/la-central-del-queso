# Portada: recorrido inmersivo por el campo — 2026-10-21

**Encargo:** identidad propia y la sensación de estar en una película inmersiva en el campo, sin que sea una película literal. El recorrido se cuenta con scrollytelling, con motion y efectos inmersivos, y con estrategias de negocio para vender a hogares y a restaurantes y establecimientos.
**Reemplaza** en la portada a la propuesta editorial «El Puesto», que sigue en `/claude`, sin indexar, para comparar.
**Skills y agentes usados:**
- `immersive-interaction-lab`: técnica, fit check y fallbacks.
- `immersive-commerce`: recorrido comercial, pedidos y eventos.
- `schema`: JSON-LD.
- `cro`: diagnóstico de conversión.
- `webapp-testing`: Playwright.
- Agentes `immersive-reviewer` (dos revisiones) y `seo-auditor`.

## Decisión (fit check)

- **Tarea principal:** elegir quesos, saber cuánto llevar y apartar por WhatsApp (hogar), o calcular volumen y cotizar (negocio).
- **La narrativa es opcional:**
  - Desde el primer cuadro hay dos llamados («Comprar para mi casa» / «Soy restaurante o negocio») que llevan directo a la mesa o a la calculadora de negocio.
  - El pedido está a un clic siempre: botón en la cabecera y, en móvil, una barra flotante.
- **Sensación de cine sin metáforas literales:**
  - Un solo plano continuo y movimiento de cámara (dolly al bajar, cámara en mano con el puntero).
  - Formato panorámico durante la caminata.
  - Luz y atmósfera: neblina, rayos de sol, polen y luz de la puerta.
  - Enfoque selectivo en la mesa y tipografía que entra por líneas.
- **Sin WebGL nuevo:** el efecto sale de fotografía, scroll, CSS, GSAP y canvas 2D. Esto mantiene el peso y el riesgo bajos.

## Recorrido

| Escena | Componente | Qué hace | Objetivo comercial |
|---|---|---|---|
| Amanecer | `Amanecer.tsx` | Primer fotograma con neblina, rayos y polen; al bajar, la cámara avanza | Propuesta de valor, bifurcación casa/negocio, próxima feria con fecha real |
| La finca | `ActoFinca.tsx` | Plano secuencia del portón a la puerta (motor de fotogramas), relato por tramo, hierba tocable; al final la luz de la puerta llena la pantalla | Origen y confianza |
| La mesa | `ActoMesa.tsx` | Quesos sobre madera; en escritorio el scroll desliza la mesa y el producto del centro queda en foco | Selección: precio, unidad, usos y «+ ½ kg» |
| Para su casa | `ActoCasa.tsx` | Canasta sugerida por personas y frecuencia; se agrega completa | Ticket promedio y menos dudas sobre cuánto llevar |
| Para su negocio | `ActoNegocios.tsx`, `negocio.ts` | Platos por semana × gramos por plato → kg → bloques de 2,5 kg; costo en bloque frente a detalle | Captar clientes B2B con una cotización ya armada |
| Ferias | `ActoFerias.tsx` | Día, horario, puesto, próxima fecha, Maps y Waze | Recogida y visita |
| Cierre | `Cierre.tsx` | Atardecer; resumen del pedido y contacto | Último llamado |

**Panel del pedido** (`PanelPedido.tsx`):
- Diálogo modal con el foco atrapado y el fondo inerte.
- Sugiere complementos de lo que ya lleva (natilla, palmito, mantequilla).
- Opción «Quiero este mismo pedido cada semana».
- Enlace de respaldo si el navegador bloquea WhatsApp.

## Estrategia comercial aplicada (y lo que requiere confirmar el negocio)

**Hogar:**
- Canasta sugerida.
- Complementos.
- Fecha real de la próxima feria.
- Confianza: «Apártelo por WhatsApp · Recójalo en la feria · Pruebe antes de llevar · Pague por SINPE Móvil».

**Negocio:**
- Calculadora con precios reales: bloque ₡12.500 / 2,5 kg = ₡5.000/kg frente a ₡5.500/kg al detalle.
- Cotización por WhatsApp con tipo de negocio, platos, gramos, kg, bloques, frecuencia y muestra.
- Opción de agregar los bloques al pedido.

**Campañas:** `?segmento=negocio`, por ejemplo en un QR para restaurantes, pone primero el llamado de negocio. `?src=` o `?utm_source=` viaja en el mensaje de WhatsApp.

**Supuestos a confirmar con el negocio antes de publicar:**
- Si aceptan pedidos recurrentes semanales.
- Si dan muestras a negocios.
- Si cotizan precio por volumen distinto del bloque.
- Zonas de entrega y hora de corte para apartar.
- Si emiten factura electrónica, una objeción clave para restaurantes.
- Los gramos por plato son referencias editables, no datos del negocio.

## Embudo y eventos

`eventos.ts` publica estos eventos en `dataLayer` (si existe) y como `cq:evento`, sin datos personales:
- `segmento_elegido`
- `producto_agregado`
- `canasta_agregada`
- `pedido_abierto`
- `whatsapp_pedido`
- `whatsapp_cotizacion`

Abrir WhatsApp es intención de contacto, no venta: el pedido confirmado y el cobro se registran fuera de la web. Aún no hay analítica instalada.

## Técnica

- **Un reloj:** `gsap.ticker` mueve Lenis 1.3.26 (scroll suave), ScrollTrigger, el cursor de luz, la cámara en mano y el polen. El motor de fotogramas conserva su rAF.
- **Recalculo de posiciones:** un ResizeObserver sobre `main` vuelve a calcular ScrollTrigger cuando cambia el alto.
- **Un dueño por propiedad:**
  - La cámara en mano mueve una envoltura y GSAP escala la imagen interior.
  - El motor solo toca la opacidad del lienzo y del relato.
  - Las reglas de `pelicula.css` no fijan `position` ni `display` donde una utilidad de Tailwind debe decidir (`sticky`, `lg:hidden`).
- **Estado del pedido compartido con `/claude`:** `components/claude/pedidoEstado.tsx` (sesión, mensaje) y `datos.ts` (`calcularCanasta`, `siguienteFeria`, formato).
- **Datos estructurados:** `DatosEstructurados.tsx` con `Organization`, `WebSite` e `ItemList` de `Product` (CRC y precio por kg). No hay `LocalBusiness` porque falta una dirección verificada. La base de las URL sale de `NEXT_PUBLIC_SITE_URL` o de `VERCEL_PROJECT_PRODUCTION_URL`.

## Accesibilidad y alternativas

- **Reducir movimiento:**
  - Sin Lenis, sin escenas fijas, sin scrub, sin cursor, polen ni luz de puerta.
  - La finca se muestra como fotogramas fijos con su relato.
  - La compra queda completa.
- **Táctil o puntero grueso:** sin cursor ni cámara en mano; la mesa se recorre de lado.
- **Contenido revelado:** solo se anima opacidad y posición, nunca `visibility`, así que todo queda alcanzable con teclado y lector de pantalla.
- **Mesa fija:** el foco de teclado (`:focus-visible`) baja la página hasta el producto enfocado.

## Cómo verlo

```bash
npm run dev
```

http://localhost:3000. Si Windows tiene desactivadas las animaciones, el navegador reporta «reducir movimiento» y se ve la versión fija.

## Verificación (2026-10-21)

**Ejecutado:**
- TypeScript (`tsc --noEmit`) pasa.
- `next build` pasa.
- Playwright 1.55 con Chrome, en escritorio 1440×900 con movimiento, móvil 390×844 táctil y escritorio con movimiento reducido. Sin errores ni warnings de consola y sin desborde horizontal. Se comprobó:
  - Agregar desde la mesa y la canasta.
  - Calculadora de negocio: 800 platos × 120 g → 96 kg → 39 bloques → ₡487.500 frente a ₡536.250.
  - Cotización y pedido por WhatsApp, con `window.open` interceptado y el texto revisado.
  - Panel: foco, inerte, Escape y enlace de respaldo.
  - Eventos del embudo.
  - Relato por tramo y luz de la puerta.

**No probado:**
- Safari y dispositivos reales.
- Lector de pantalla.
- Red lenta.
- Medición de FPS, LCP, INP o CLS.

## Material: qué falta y cómo conseguirlo

**Situación actual:** los fotogramas de la finca y las fotos de producto son recreaciones generadas por IA, con el aviso visible. Varias fotos se repiten entre productos y se encuadran distinto.

**Rutas verificadas en esta sesión:**
1. **Fotos y video reales (lo que más identidad da):**
   - Cada producto en tres tomas (general, medio, detalle), con luz lateral y sobre madera.
   - El puesto en cada feria.
   - El queso en uso: sartén, gallo pinto, pizza.
   - Si la finca o el proveedor lo permiten, una caminata a 1,6 m con estabilizador del portón a la lechería, siguiendo `docs/experimentos/plano-secuencia-finca.md`.
   - El pipeline de ffmpeg para pasar video a fotogramas ya está probado.
2. **Video generado con IA (Kling o Veo):**
   - Figma Weave está conectado en esta sesión, pero pide vincular la cuenta de Figma en https://app.weavy.ai/settings?section=profile.
   - Una vez vinculada, cada generación se cotiza y solo corre con aprobación explícita.
   - Alternativa: Higgsfield, en la cuenta del usuario, con los prompts de la guía.
3. **Imágenes generadas** (Canva o Figma, con créditos): sirven para atmósfera o fotogramas clave, no para presentar productos.

**Prueba social:** reseñas reales, por ejemplo del perfil de Google Business. No hay testimonios verificados en el repositorio.

## Fotos reales: cómo entran a la web

La lista de tomas para el fotógrafo es el doc «Lista de tomas: productos y puesto». La web ya está preparada para recibirlas:

1. Copiar la versión web de cada foto (unos 3000 px, menos de 2,5 MB) a `public/fotos/productos/`, `public/fotos/uso/` o `public/fotos/ferias/`, con los nombres de la lista: `semiduro-tradicional-general.jpg`, `uso-desayuno.jpg`, `guadalupe-balanza.jpg`. La vista previa al compartir va en `public/fotos/compartir.jpg`.
2. Correr el validador, que revisa nombres, proporción, tamaño mínimo, duplicados y peso, y dice qué falta:

   ```bash
   npm run fotos:validar
   ```
3. Volver a generar la web (`npm run build` o el próximo despliegue).

Qué cambia sola la web (`lib/fotos.ts` lee las carpetas al generar la página; el plan está en `lib/fotos-plan.json`):

- **La mesa:** la toma general (o la media) reemplaza la recreación del producto, sin el recorte artificial; el detalle aparece al pasar el puntero o al enfocar la tarjeta.
- **Para su casa y Para su negocio:** una galería con hasta tres fotos en uso de cada segmento.
- **Ferias:** cada tarjeta lleva la foto del puesto (frente, si no mostrador, si no la llegada) y debajo una galería con la balanza, la prueba y la entrega.
- **Datos estructurados:** cada producto declara sus fotos reales en `image`.
- **Vista previa al compartir:** usa `compartir.jpg` si existe.
- **Aviso del cierre:** aclara que solo la finca y los productos sin foto propia son recreación.

Lo que falte sigue con la imagen actual, así que las fotos pueden llegar por partes.

## Próximo paso

1. Confirmar los supuestos comerciales de la sección anterior.
2. Decidir la ruta de material: sesión de fotos real o vincular Weave para cotizar video.
3. Configurar `NEXT_PUBLIC_SITE_URL` y la analítica antes de publicar.
