# Evidencia de Calidad y Validación: Recuperación y Scrollytelling 3D

**Módulo**: Experiencia 3D, Portón Batiente y Scrollytelling  
**Fecha de Validación**: 11 de Octubre de 2026  
**Entorno de Prueba**: Microsoft Edge Headless (Chromium Engine con aceleración WebGL D3D11)  
**Herramienta de Captura**: Puppeteer-Core automatizado contra `http://localhost:3000`

---

## 1. Validación de los 6 Hitos Visuales

### Hito 1: Llegada frente al Portón Cerrado
- **Scroll**: 0% (`p = 0.0`)
- **Estado Visual**: Portón rústico de madera cerrado enmarcado por columnas de piedra natural. Encabezado adaptativo en modo transparente/oscuro con tipografía serif blanca y acento en amarillo queso.
- **Interacciones Disponibles**: "Deslice para iniciar el recorrido", "Saltar al Catálogo", "Activar Sonido".

### Hito 2: Apertura Progresiva de las Puertas del Portón
- **Scroll**: 22% (`p = 0.22`)
- **Estado Visual**: Ambas hojas (`Gate_Door_Left` y `Gate_Door_Right`) giran progresivamente sobre sus ejes de bisagra exterior hasta 94 grados hacia los laterales, abriendo el paso sin atravesar la geometría de las columnas.
- **Narrativa**: Capítulo 2 ("El Portón Tradicional / Apertura a la Tradición").

### Hito 3: Avance Cinemático por el Sendero Campesino
- **Scroll**: 50% (`p = 0.50`)
- **Estado Visual**: La cámara cruza el umbral del portón y recorre el camino de tierra flanqueado por cercas de madera rústica y árboles botánicos realistas con vegetación natural, en dirección al granero de maduración.
- **Narrativa**: Capítulo 3 ("El Sendero Campesino / Camino de Madrugadas").

### Hito 4: Ingreso al Granero de Maduración
- **Scroll**: 74% (`p = 0.74`)
- **Estado Visual**: Las puertas frontales del granero (`Barn_Door_L` y `Barn_Door_R`) se abren de par en par. La cámara ingresa al interior iluminado por lámparas rústicas, revelando estanterías de madera con ruedas de queso en reposo y barricas tradicionales.
- **Narrativa**: Capítulo 4 ("Espacio de Maduración / El Reposo del Queso").

### Hito 5: La Cava de Quesos 3D y Pedido de Pieza
- **Scroll**: 93% (`p = 0.93`)
- **Estado Visual**: La cámara se posiciona frente al pedestal central con la rueda de queso semiduro en primer plano y sombra de contacto realista.
- **Interacciones Habilitadas**:
  - Arrastre con ratón / dedo para rotar la pieza 360 grados.
  - Selector de variedades con cambio instantáneo de color de corteza PBR: *Semiduro de Turrialba* (₡5,500/kg), *Maduro Selección* (₡6,800/kg), *Ahumado en Leña* (₡6,200/kg).
  - Botón "Pedir Esta Pieza" vinculado en tiempo real a `CartContext` con feedback visual ("¡Agregado!").

### Hito 6: Transición Fluida al Catálogo Comercial
- **Scroll**: 100% (`p >= 1.0`)
- **Estado Visual**: Desenganche suave del lienzo WebGL fijo y transición directa a la sección `#catalogo`. El encabezado cambia con animación a fondo crema con bordes verde bosque, adaptándose a la paleta comercial.

---

## 2. Validación Responsiva Móvil (390 x 844 px)

- **Prevención de Solapamientos**: El botón de audio flotante se desplaza en móvil a una posición segura (`top-20 right-4`) como un icono circular traslúcido para no colisionar con las tarjetas de pedido ni con el encabezado.
- **Tipografía Escalada**: Títulos ajustados con tamaños tipográficos fluidos que evitan saltos de línea irregulares o cortes horizontales.
- **Rendimiento Táctil**: Desplazamiento nativo sin bloqueo de rueda o gestos táctiles.
