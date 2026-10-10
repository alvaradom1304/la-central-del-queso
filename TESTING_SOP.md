# QA & Mobile Validation Protocol (Vercel Deployment)

Este documento contiene el SOP (Standard Operating Procedure) para validar la aplicación web en dispositivos móviles reales antes del lanzamiento oficial en la Feria.

## 1. Validación de Atribución y Enlaces (Growth Tracking)
Abra los siguientes enlaces en su dispositivo móvil y verifique que la sesión capture correctamente el origen (la prueba se confirmará cuando realice el pedido en el paso 2):

- **Simulación Escaneo de Empaque:** 
  `https://lacentraldelqueso.cr/?src=qr_empaque_semiduro`
- **Simulación Banner Feria Guadalupe:** 
  `https://lacentraldelqueso.cr/?src=feria_guadalupe`
- **Simulación Bio Instagram:** 
  `https://lacentraldelqueso.cr/?utm_source=instagram_bio`

*(Sustituya `lacentraldelqueso.cr` por su URL temporal de Vercel durante el test).*

## 2. Protocolo de Pruebas Móviles (Checkout Flow)
Ejecute estos pasos exactos desde un teléfono móvil (iOS/Android):

1. **Navegación Visual:**
   - Deslice por la página principal. Verifique que los textos grandes del Hero Section no se desborden.
   - Verifique que la imagen de "Nuestra Herencia" se vea clara.
2. **Filtrado de Catálogo:**
   - En la sección "Nuestros Lácteos", toque diferentes pestañas (ej. "Tradición Tica").
   - Confirme que la grilla de productos se actualice instantáneamente.
3. **Flujo de Pedido (Checkout):**
   - Seleccione el botón **"Pedir"** en el producto *Semiduro Tradicional*.
   - Se debe abrir el modal de orden.
   - Ingrese un nombre de prueba (ej. "QA Tester").
   - Seleccione un punto de retiro (ej. "Feria Hatillo").
   - Agregue una nota (ej. "Prueba de Vercel").
   - Haga clic en **"Ir a WhatsApp"**.
4. **Verificación de Redirección:**
   - El sistema operativo debe abrir automáticamente la aplicación de WhatsApp.
   - El mensaje pre-cargado debe contener el ID de la orden (ej. `ORD-XXXX`), el nombre "QA Tester", el producto seleccionado y la nota.
5. **Verificación de Backend (Google Sheets):**
   - Vaya a la hoja de Google Sheets vinculada a n8n.
   - Confirme que ha ingresado una nueva fila con la orden.
   - Verifique crucialmente que la columna **"Canal de Origen"** refleje el enlace que usó en el paso 1 (ej. `qr_empaque_semiduro`).

---
**Criterio de Éxito:** "Evidence before opinion." Si el mensaje de WhatsApp se abre correctamente y la hoja de cálculo de Google registra el `Canal de Origen`, el flujo está certificado para producción.
