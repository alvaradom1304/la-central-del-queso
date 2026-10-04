import { NextResponse } from "next/server";
import { OrderPayload, OrderRecord } from "@/lib/orderSchema";

const BUSINESS_PHONE = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "50688888888";
const WEBHOOK_URL = process.env.N8N_ORDER_WEBHOOK_URL;

export async function POST(request: Request) {
  try {
    const body: OrderPayload = await request.json();

    // Basic Validation
    if (!body.customerName || !body.productId || !body.pickupLocation) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Generate Order ID & Timestamp
    const orderId = `ORD-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const newOrder: OrderRecord = {
      ...body,
      orderId,
      status: "PENDING_CONFIRMATION",
      createdAt: timestamp,
    };

    console.log("[ORDER CAPTURED]", newOrder);

    // Asynchronously dispatch to n8n/Airtable webhook if configured
    if (WEBHOOK_URL) {
      // We don't await this so it doesn't block the WhatsApp redirect
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      }).catch(err => {
        console.error("[WEBHOOK DISPATCH FAILED] - Handled gracefully:", err);
      });
    }

    // Prepare WhatsApp Message with the captured ID
    const greeting = `¡Hola Doña Martha! Soy ${body.customerName}.`;
    const orderDetails = `Quiero confirmar mi pedido *${orderId}*:\n- ${body.quantity}x ${body.productName} (${body.unit})`;
    const logistics = `Lo necesito para: *${body.pickupLocation}*.`;
    const totalMsg = `Total aproximado: ₡${body.totalPriceCRC.toLocaleString("es-CR")}.`;
    const notesMsg = body.notes ? `\nNota: ${body.notes}` : "";
    const closing = "Quedo atento(a) al pago por Sinpe Móvil. ¡Gracias!";

    const message = `${greeting}\n\n${orderDetails}\n${logistics}\n${totalMsg}${notesMsg}\n\n${closing}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`;

    return NextResponse.json({
      success: true,
      orderId,
      whatsappUrl,
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
