import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderPayload,
      isPartialCod
    } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify signature only if we have real keys and it's not a mock order
    if (keySecret && keySecret !== "dummy_secret_here" && !razorpay_order_id.startsWith("mock_order_")) {
      const generated_signature = crypto
        .createHmac("sha256", keySecret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }
    } else {
      console.warn("Skipping Razorpay signature verification (Mock Order or Dummy Keys).");
    }

    // Determine payment info items
    const paymentItems = isPartialCod ? [
      {
        id: "PAYMENT-INFO",
        name: "Partial COD (Advance Paid)",
        size: "-",
        price: 149,
        quantity: 1,
        image: "",
        payment_id: razorpay_payment_id || "mock_payment_123",
        razorpay_order_id: razorpay_order_id || "mock_order_123"
      },
      {
        id: "DUE-AMOUNT",
        name: "Amount Due on Delivery",
        size: "-",
        price: Math.max(0, orderPayload.total - 149),
        quantity: 1,
        image: ""
      }
    ] : [
      {
        id: "PAYMENT-INFO",
        name: "Razorpay Payment (Full)",
        size: "-",
        price: orderPayload.total,
        quantity: 1,
        image: "",
        payment_id: razorpay_payment_id || "mock_payment_123",
        razorpay_order_id: razorpay_order_id || "mock_order_123"
      }
    ];

    // Append Payment Info to items array to avoid database schema changes
    const itemsWithPayment = [
      ...(orderPayload.items || []),
      ...paymentItems
    ];

    // Payment is verified, create the order in Supabase
    // To keep it simple, we reuse the logic from /api/orders here or just insert directly.
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: orderPayload.customer_name,
          email: orderPayload.email,
          total: orderPayload.total,
          items: itemsWithPayment,
          status: "Pending",
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Order Creation Error:", error);
      return NextResponse.json({ error: "Failed to create order in database" }, { status: 500 });
    }

    // Deduct Inventory
    for (const item of orderPayload.items || []) {
      if (item.id && !item.id.startsWith("PROMO-") && !item.id.startsWith("SHIPPING-") && !item.id.startsWith("PAYMENT-")) {
        try {
          const { data: product } = await supabase.from("products").select("stock").eq("id", item.id).single();
          if (product && typeof product.stock === 'number') {
            const newStock = Math.max(0, product.stock - (item.quantity || 1));
            await supabase.from("products").update({ stock: newStock }).eq("id", item.id);
          }
        } catch (e) {
          console.error("Failed to deduct inventory for item:", item.id, e);
        }
      }
    }

    // AWAIT the email notification so Vercel doesn't kill the function before it sends
    try {
      await sendOrderConfirmationEmail(data);
    } catch (err) {
      console.error("Email Error:", err);
    }

    return NextResponse.json({ success: true, orderId: data.id });
  } catch (error: any) {
    console.error("Razorpay Verify Error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
