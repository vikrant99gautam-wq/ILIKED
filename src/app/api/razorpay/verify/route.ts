import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderPayload
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

    // Payment is verified, create the order in Supabase
    // To keep it simple, we reuse the logic from /api/orders here or just insert directly.
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: orderPayload.customer_name,
          email: orderPayload.email,
          total: orderPayload.total,
          items: orderPayload.items,
          status: "Pending",
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Order Creation Error:", error);
      return NextResponse.json({ error: "Failed to create order in database" }, { status: 500 });
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
