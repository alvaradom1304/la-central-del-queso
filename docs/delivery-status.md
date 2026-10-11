# Estado de Entrega · La Central del Queso

**Documento de Control y Aceptación de Hitos**  
**Fecha**: 11 de Octubre de 2026  
**Proyecto**: La Central del Queso / Quesos Doña Martha  
**Repositorio**: `client-central-del-queso` (Ramas: `restore-finca-3d` [activa], `checkpoint-editorial-catalog` [respaldo], `main`)  
**Commit Activo**: `51392d2` en `web/`

---

## 1. Tabla de Hitos y Estado de Aceptación

| Hito | Trabajo Requerido | Estado | Evidencia Registrada |
| :--- | :--- | :--- | :--- |
| **1. Recuperación** | Encontrar versión de puertas y recorrido; conservar actual en rama; restaurar selectivamente | **COMPLETADO Y VALIDADO** | Rama `checkpoint-editorial-catalog` guardada; rama `restore-finca-3d` con apertura de puertas comprobada en 6 capturas de Edge Headless con WebGL; 0 errores HTTP. |
| **2. Realismo** | Mejorar encuadre completo en Blender; render portón y queso; archivo `.blend` editable | **EN CURSO / BASE DISPONIBLE** | Escena `.blend` editable en `3d/scenes/estudio_queso_semiduro_master.blend` y renders Cycles de alta resolución en `3d/renders/hero_semiduro_v5.png`. Inspeccionable con Blender 5.2.2 LTS. |
| **3. Animación** | Extender acabado; apertura suave y trayectoria sin colisiones | **COMPLETADO Y VALIDADO** | Función `smoothstep` desacoplada del catálogo en `HaciendaWorld3D.tsx`; apertura de `Gate_Door_Left`/`Right` y `Barn_Door_L`/`R`; trayectoria cinemática fluida hacia el pedestal. |
| **4. Compra** | Catálogo comercial, resumen y pedido sin fricción | **COMPLETADO Y VALIDADO** | Catálogo con 12 referencias diferenciadas; selector de moneda dual (CRC/USD); buscador en vivo; cajón de carrito (*Cart Drawer*) con edición de cantidades y WhatsApp estructurado. |
| **5. QA** | Verificar móvil, escritorio, teclado, movimiento reducido y rendimiento | **COMPLETADO Y VALIDADO** | Probado en Edge Headless en 1440px y 390px (iPhone 14); encabezado dinámico adaptativo; 0 errores de consola; build de producción en Next.js (exit code 0); servidor activo en `localhost:3000`. |
| **6. Negocio** | Completar datos reales y evaluación comercial | **PENDIENTE DE CLIENTE** | Datos históricos alineados a 1980 (padre, madre, hijos) y Turrialba; ferias de Guadalupe y Hatillo; teléfonos y correos señalados como provisionales / por confirmar. |

---

## 2. Inventario de Archivos y Recursos

### A. Escenas 3D y Modelos GLB
- `3d/scenes/estudio_queso_semiduro_master.blend` (114 KB): Escena de estudio gastronómico con iluminación de tres puntos, tabla de madera artesanal, cuchillo de corte y cuña de semiduro.
- `3d/scenes/finca.blend` (63 MB): Escena territorial de la hacienda y entorno rural.
- `web/public/models/finca_world.glb` (1.40 MB): Entorno interactivo optimizado con portón animado (`Gate_Door_Left`, `Gate_Door_Right`), granero (`Barn_Door_L`, `Barn_Door_R`), cavas y estanterías.
- `web/public/models/cheese_wheel.glb` (122 KB): Modelo de queso semiduro con biseles y proporciones físicas.
- `web/public/models/tree_realistic.glb` (4.57 MB): Vegetación botánica con troncos texturizados y copas de hojas.

### B. Código Frontend Next.js
- `web/components/HaciendaWorld3D.tsx`: Componente de scrollytelling en Three.js / React Three Fiber con desacoplamiento de scroll, cámara cinematográfica, inspección 360° y adición al carrito.
- `web/components/Header.tsx`: Encabezado adaptativo que detecta la posición de scroll y conmuta automáticamente entre tema oscuro traslúcido (en el mundo 3D) y crema/bosque (en el catálogo).
- `web/components/ProductCatalog.tsx`: Catálogo editorial con filtros por categoría, búsqueda en vivo, selector CRC/USD y tarjetas de producto.
- `web/components/CartDrawer.tsx`: Carrito lateral deslizable con cálculo de totales y enlace de pedido a WhatsApp.
- `web/app/page.tsx`: Punto de entrada dinámico con hidratación cliente para WebGL y renderizado fluido.

---

## 3. Registro de Pruebas y QA

- **Script de Validación Automatizada**: `scratch/verify_experience.js` utilizando Microsoft Edge Headless con aceleración WebGL D3D11.
- **Rendimiento**: 64.2 kB primer bundle de página; tiempo de inicio de servidor ~1033 ms.
- **Auditoría de Errores**: 0 errores 404, 0 errores WebGL, 0 advertencias de hidratación de Next.js.
