# Automation Engine: La Central del Queso (Google Sheets Edition)

Este directorio contiene las definiciones de automatización y los contratos de datos para la infraestructura AEM OS de Doña Martha (Stage 06).
Hemos priorizado **Google Sheets** por ser una herramienta sin costo, conocida y amigable en móviles para operar durante el ajetreo de las ferias.

## Archivos
- `schemas/order_payload_contract.json`: Define el formato exacto del payload JSON que Next.js enviará vía POST.
- `workflows/01_order_intake_google_sheets.json`: Flujo de n8n exportable.

## Setup en Google Sheets
Cree una nueva hoja de cálculo llamada "Libro de Pedidos y Fiados" con las siguientes columnas exactas:
1. `Fecha`
2. `ID Orden`
3. `Cliente`
4. `Teléfono`
5. `Producto`
6. `Cantidad`
7. `Total CRC`
8. `Retiro/Feria`
9. `Estado Pago`
10. `Notas`

## ¿Cómo implementar este flujo en n8n?
1. Abra su instancia de n8n.
2. Cree un nuevo Workflow en blanco.
3. Abra las opciones (tres puntos arriba a la derecha) y seleccione **"Import from File..."**.
4. Seleccione el archivo `01_order_intake_google_sheets.json`.
5. Autorice su cuenta de Google en el nodo "Google Sheets Logger" y seleccione el documento "Libro de Pedidos y Fiados".
6. Obtenga la "Test URL" o "Production URL" del nodo "Webhook".
7. Guarde y active el workflow.

## Configuración del Entorno Frontend (Next.js)
En la raíz de `src/web/`, cree o edite el archivo `.env.local` e incluya la URL de producción del webhook que obtuvo de n8n:
```env
N8N_ORDER_WEBHOOK_URL="https://n8n.midominio.com/webhook/order-capture"
```

## SOP: Operación en Feria (Sábados/Domingos)
1. **Llegada del Cliente:** El cliente muestra el mensaje de WhatsApp o simplemente da su nombre.
2. **Revisión en Móvil:** Doña Martha abre la app de Google Sheets en su teléfono, busca el nombre o el "ID Orden".
3. **Cobro:** Si el cliente paga por Sinpe Móvil o efectivo, Doña Martha edita la celda `Estado Pago` de "Pendiente Sinpe" a "Pagado".
4. **Entrega:** Se entrega el producto fresco. El sistema asegura que nunca se pierda un pedido de la memoria ni se acumulen "fiados" sin seguimiento.
