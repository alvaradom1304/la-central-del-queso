# Estándar de Diseño y Dirección de Arte "Taste" — Altiora OS

Este estándar define los principios estéticos, tokens visuales y directrices de interfaz para eliminar el aspecto genérico de "sitio web hecho por IA" y asegurar experiencias digitales de alto impacto comercial y sensorial.

---

## 1. Reglas Anti-Genérico (Lo que NUNCA debe permitirse)

1. **Cero Fondos Blancos Aburridos o Degradados Púrpura/Cian Cliché:**
   - Prohibido el degradado genérico de Tailwind `from-purple-500 to-indigo-500`.
   - Prohibido el fondo blanco plano con tarjetas grises estándar y sombras flotantes tipo plantilla de Bootstrap.
2. **Cero Textos de Relleno Corporativo Hueco:**
   - Prohibido titulares tipo *"Empoderando el futuro de tu negocio con IA de última generación"*.
   - Todo titular debe hablar de un beneficio tangible, un dolor real o un deseo concreto del cliente (ej. *"Tesoros tech que no sabías que ocupabas. Entrega en 24h en GAM y SINPE directo"*).
3. **Cero Iconos en Círculos Centrados sin Contexto:**
   - Prohibido el patrón de 3 columnas con un icono de Lucide en un círculo azul seguido de dos líneas de texto genérico.
4. **Cero Diseños Estáticos sin Vida:**
   - Las interfaces de Altiora deben respirar: hover reactivos, sutiles resplandores de luz (ambient glows), micro-interacciones táctiles y transiciones fluidas.

---

## 2. Paleta de Tokens Obsidian Cyber-Street

| Token | Valor Hex | Rol de Diseño |
| :--- | :--- | :--- |
| `--bg-obsidian` | `#0A0A0C` | Fondo principal ultra profundo (negro obsidiana premium). |
| `--surface-card` | `#131317` | Fondo de tarjetas y paneles modales. |
| `--surface-elevated` | `#1A1A22` | Elementos flotantes y desplegables. |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Bordes nítidos y elegantes con baja opacidad. |
| `--border-glow` | `rgba(0, 255, 163, 0.35)` | Resplandor perimetral reactivo al interactuar. |
| `--accent-neon-mint` | `#00FFA3` | Color primario de acción, badges de stock y precios de oferta. |
| `--accent-reactive-orange`| `#FF5E1E` | Botones de checkout, llamadas a la acción (CTA) y ofertas urgentes. |
| `--text-primary` | `#F4F4F6` | Títulos y tipografía de máxima jerarquía. |
| `--text-muted` | `#8A8A99` | Metadatos, especificaciones técnicas y descripciones secundarias. |

---

## 3. Tipografía y Jerarquía Espacial

- **Titulares de Impacto:** `Space Grotesk`, `Outfit` o `Inter` en pesos semi-bold o black (`font-weight: 700-900`), con espaciado ajustado (`tracking-tight` o `letter-spacing: -0.03em`).
- **Números de Precio, SKUs y Badges:** `JetBrains Mono` o monospace moderno (`font-variant-numeric: tabular-nums`) para conferir rigor técnico y claridad matemática.
- **Micro-Copy y Cuerpo:** `Inter` o fuentes grotescas a 14px-16px con altura de línea amplia (`line-height: 1.6`) para máxima legibilidad en pantallas OLED móviles.

---

## 4. Micro-Interacciones de Alta Gama

1. **Card Tilt 3D:**
   - Las tarjetas de producto deben responder sutilmente a la posición del cursor (`perspective: 1000px`, rotación máxima de 6 a 8 grados) simulando volumen físico tridimensional.
2. **Glassmorphism Frosted:**
   - Barras de navegación fijas y carritos laterales deben usar `backdrop-filter: blur(20px)` con transparencia del 85% sobre el fondo obsidiana.
3. **Efectos Táctiles y Sonido Sintetizado:**
   - Eventos de recompensa (unboxing de Loot Box, aplicar cupón) deben incorporar síntesis de audio procedural ligera (Web Audio API) sin requerir archivos MP3 externos pesados.
4. **Checkout Sin Fricción:**
   - El botón de compra final debe reflejar el desglose exacto (productos + envío GAM/Correos) y generar un mensaje estructurado directo para WhatsApp con opción de comprobante SINPE Móvil.
