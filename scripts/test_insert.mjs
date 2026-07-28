import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function test() {
  const { data, error } = await supabase.from('orders').insert([
    {
      id: Date.now().toString(),
      customer_name: "Recovered Razorpay User",
      email: "unknown@razorpay.com",
      total: 1,
      items: [
        {
          id: "PAYMENT-INFO",
          name: "Razorpay Payment (Recovered)",
          size: "-",
          price: 1,
          quantity: 1,
          image: "",
          payment_id: "Razorpay Test",
          razorpay_order_id: "Recovered Order"
        }
      ],
      status: "Pending"
    }
  ]).select().single()

  console.log("Error:", error)
  console.log("Data:", data)
}

test()
