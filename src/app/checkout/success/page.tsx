"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
      if (!error && data) {
        setOrder(data);
      }
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="font-cartoon text-4xl text-center">LOADING INVOICE...</div>;
  }

  if (!order) {
    return <div className="font-cartoon text-4xl text-center">ORDER NOT FOUND</div>;
  }

  const subtotal = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const shipping = order.total - subtotal;

  return (
    <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
      
      <motion.div 
        initial={{ y: 50, opacity: 0, rotate: -1 }}
        animate={{ y: 0, opacity: 1, rotate: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-full bg-[#fcfaf5] p-6 md:p-10 shadow-[15px_15px_0_#111] border-[4px] border-black relative"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.05) 100%), url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E")',
        }}
      >
        {/* Tape */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/80 border-[3px] border-black rotate-[-3deg] shadow-[2px_2px_0_#111]"></div>
        
        {/* INVOICE HEADER */}
        <div className="text-center mb-8 mt-4 font-mono">
          <h2 className="font-cartoon text-6xl mb-2 text-black">I LIKED</h2>
          <p className="text-gray-600 font-black text-lg tracking-widest uppercase mb-1">TAX INVOICE</p>
          <p className="text-sm text-gray-500 font-bold">STORE #001 - INTERNET</p>
        </div>

        <div className="border-b-[3px] border-dashed border-black w-full my-6"></div>

        {/* CUSTOMER INFO */}
        <div className="flex flex-col md:flex-row justify-between font-mono text-base md:text-lg mb-6 gap-4 font-bold">
          <div>
            <p className="text-gray-500 text-sm mb-1">BILLED TO:</p>
            <p className="text-xl md:text-2xl font-black">{order.customer_name}</p>
            <p>{order.email}</p>
          </div>
          <div className="md:text-right">
            <p className="text-gray-500 text-sm mb-1">INVOICE NO:</p>
            <p className="text-xl md:text-2xl font-black">#{order.id}</p>
            <p className="text-gray-500 text-sm mt-4 mb-1">DATE:</p>
            <p>{new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="border-b-[3px] border-dashed border-black w-full my-6"></div>

        {/* ITEMS LIST */}
        <div className="font-mono text-lg md:text-xl w-full font-bold mb-6">
          <div className="flex justify-between text-gray-500 text-base mb-6 border-b-[2px] border-black pb-2">
            <span className="w-1/2">ITEM</span>
            <span className="w-1/4 text-center">QTY</span>
            <span className="w-1/4 text-right">TOTAL</span>
          </div>
          
          <div className="space-y-6">
            {order.items.map((item: any, i: number) => {
              if (item.id === "SHIPPING-INFO") return null;
              const isPromo = item.id.startsWith("PROMO-");
              return (
                <div key={i} className={`flex justify-between items-center ${isPromo ? 'text-[#19B85A]' : ''}`}>
                  <div className="w-1/2 pr-2 flex items-center gap-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-20 h-20 border-[3px] border-black object-contain bg-white shrink-0 shadow-[3px_3px_0_#111]" />
                    ) : (
                      !isPromo && <div className="w-20 h-20 border-[3px] border-black bg-gray-200 shrink-0 shadow-[3px_3px_0_#111]"></div>
                    )}
                    <div>
                      <p className="leading-tight font-black text-xl">{item.name}</p>
                      {!isPromo && <p className="text-gray-500 text-sm mt-1">SIZE: {item.size}</p>}
                    </div>
                  </div>
                  <div className="w-1/4 text-center">
                    <p>{item.quantity}</p>
                  </div>
                  <div className="w-1/4 text-right">
                    <p className="font-black">{isPromo ? `₹${item.price}` : `₹${item.price * item.quantity}`}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-b-[3px] border-black w-full my-4"></div>

        {/* TOTALS */}
        <div className="font-mono text-lg md:text-xl font-bold flex flex-col items-end space-y-3 mb-10 mt-6">
          <div className="flex justify-between w-full md:w-1/2">
            <span className="text-gray-500">SUBTOTAL</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between w-full md:w-1/2">
            <span className="text-gray-500">SHIPPING</span>
            <span>₹{shipping}</span>
          </div>
          <div className="border-b-[3px] border-dashed border-gray-400 w-full md:w-1/2 my-2"></div>
          <div className="flex justify-between w-full md:w-1/2 text-2xl md:text-4xl font-black mt-2">
            <span>TOTAL</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full h-16 bg-black opacity-90 mb-4" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, white 3px, white 6px, transparent 6px, transparent 12px, white 12px, white 15px, transparent 15px, transparent 20px)' }}></div>
          <p className="font-black tracking-[0.2em] text-xs uppercase text-center">Your drip is secured. We'll email you the tracking details.</p>
        </div>
        
        {/* Jagged Bottom Edge */}
        <div className="absolute -bottom-5 left-0 w-full h-5 overflow-hidden flex">
          {[...Array(24)].map((_, i) => (
              <div key={i} className="w-[5%] h-full bg-[#fcfaf5] border-b-[4px] border-r-[4px] border-black transform rotate-45 origin-top-left -translate-y-2 translate-x-1"></div>
          ))}
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center w-full"
      >
        <Link href="/">
           <button className="w-full max-w-[300px] bg-black text-white border-[4px] border-black py-4 font-cartoon text-2xl tracking-widest hover:bg-[var(--color-electric-blue)] hover:translate-y-1 hover:translate-x-1 transition-all shadow-[6px_6px_0_#FFD700] active:shadow-none">
             BACK TO STREETS
           </button>
        </Link>
      </motion.div>

    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-32 px-4 md:px-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none z-0 opacity-5">
        <h1 className="font-cartoon text-[25vw] leading-none text-black tracking-widest text-center whitespace-nowrap rotate-[-10deg]">
          SECURED
        </h1>
      </div>
      
      <Suspense fallback={<div className="font-cartoon text-4xl text-center relative z-10 pt-20">LOADING INVOICE...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
