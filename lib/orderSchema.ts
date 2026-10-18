export interface OrderPayload {
  customerName: string;
  customerPhone: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  totalPriceCRC: number;
  pickupLocation: "Guadalupe" | "Hatillo" | "Delivery";
  notes?: string;
  source: string;
}

export interface OrderRecord extends OrderPayload {
  orderId: string;
  status: "PENDING_CONFIRMATION" | "CONFIRMED" | "FULFILLED" | "CANCELLED";
  createdAt: string;
}
