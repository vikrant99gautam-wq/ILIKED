"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { useCartStore } from "@/lib/store";

export default function BagPage() {
  const cart = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeFromCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdateQuantity = (id: string, size: string, currentQty: number, delta: number) => {
    const newQ = currentQty + delta;
    updateQuantity(id, size, newQ > 0 ? newQ : 1);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cart.length > 0 ? 850 : 0;
  const total = subtotal + shipping;

  if (!mounted) {
    return <main className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-24 px-6 md:px-12"></main>;
  }

  return (
    <main className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-24 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        
        <h1 className="font-cartoon text-6xl md:text-8xl text-black tracking-widest mb-12 drop-shadow-[4px_4px_0_var(--color-electric-blue)]">
          YOUR STASH
        </h1>

        {cart.length === 0 ? (
          <div className="w-full py-32 flex flex-col items-center justify-center border-[6px] border-dashed border-black bg-white">
            <h2 className="font-cartoon text-5xl md:text-7xl mb-4 text-center">BAG IS EMPTY!</h2>
            <p className="font-black tracking-widest uppercase text-xl mb-8">Go cop something.</p>
            <a href="/shop" className="cartoon-btn px-8 py-4 bg-[var(--color-electric-blue)] text-white font-cartoon text-2xl tracking-widest">
              BACK TO SHOP
            </a>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* Left: Cart Items */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -100 }}
                    key={item.id} 
                    className="relative bg-white border-[4px] border-black p-4 flex flex-col md:flex-row gap-6 shadow-[8px_8px_0_#111]"
                  >
                    {/* Item Image */}
                    <div className="w-full md:w-40 h-40 bg-white border-[3px] border-black flex-shrink-0 overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="absolute w-full h-full object-contain drop-shadow-[4px_4px_0_#111] scale-125" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-cartoon text-3xl tracking-widest uppercase">{item.name}</h3>
                        <p className="font-black text-gray-500 tracking-widest">SIZE: {item.size}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        <span className="font-black text-2xl">₹{item.price}</span>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center border-[3px] border-black bg-[#F4F4F0] shadow-[3px_3px_0_#111]">
                          <button onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity, -1)} className="w-10 h-10 flex items-center justify-center font-black text-xl hover:bg-white transition-colors border-r-[3px] border-black">-</button>
                          <span className="w-12 h-10 flex items-center justify-center font-black text-xl">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity, 1)} className="w-10 h-10 flex items-center justify-center font-black text-xl hover:bg-white transition-colors border-l-[3px] border-black">+</button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button (Red X Sticker) */}
                    <button 
                      onClick={() => removeItem(item.id, item.size)}
                      className="absolute -top-4 -right-4 w-10 h-10 bg-[var(--color-coral-red)] border-[3px] border-black rounded-full flex items-center justify-center rotate-[12deg] hover:scale-110 hover:rotate-[-12deg] transition-all shadow-[3px_3px_0_#111]"
                    >
                      <span className="font-black text-white text-xl">X</span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right: The Receipt */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-[120px]">
              <div className="bg-white border-[4px] border-black shadow-[12px_12px_0_#111] relative pb-6">
                
                {/* Receipt Content */}
                <div className="p-8 font-mono text-black">
                  <div className="text-center mb-8">
                    <h3 className="font-black text-3xl tracking-tighter">* I LIKED *</h3>
                    <p className="text-sm mt-1">STORE #001 - INTERNET</p>
                    <p className="text-sm" suppressHydrationWarning>DATE: {new Date().toLocaleDateString()}</p>
                  </div>

                  <div className="border-t-[3px] border-dashed border-black py-6 space-y-4">
                    {cart.map(item => (
                      <div key={`receipt-${item.id}`} className="flex justify-between text-lg md:text-xl font-bold">
                        <span>{item.quantity}x {item.name.substring(0,12)}..</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-[3px] border-dashed border-black py-6 space-y-2">
                    <div className="flex justify-between text-xl md:text-2xl font-bold">
                      <span>SUBTOTAL</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-xl md:text-2xl font-bold">
                      <span>SHIPPING</span>
                      <span>₹{shipping}</span>
                    </div>
                  </div>

                  <div className="border-y-4 border-black py-4 mt-4">
                    <div className="flex justify-between items-end">
                      <span className="font-black text-3xl">TOTAL</span>
                      <span className="font-black text-4xl md:text-5xl">₹{total}</span>
                    </div>
                  </div>

                  {/* Barcode Graphic */}
                  <div className="mt-8 flex justify-center">
                    <div className="w-full max-w-[200px] h-16 bg-black" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 4px, transparent 4px, transparent 8px, white 8px, white 10px, transparent 10px, transparent 14px)' }}></div>
                  </div>
                  <p className="text-center text-xs mt-2 font-bold tracking-widest">THANK YOU COME AGAIN</p>
                </div>

                {/* Jagged Bottom Edge */}
                <div className="absolute -bottom-4 left-0 w-full h-4 overflow-hidden flex">
                  {[...Array(20)].map((_, i) => (
                     <div key={i} className="w-[5%] h-full bg-white border-b-[4px] border-black transform rotate-45 origin-top-left -translate-y-2 translate-x-1"></div>
                  ))}
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="block w-full">
                <button className="w-full mt-8 cartoon-btn px-8 py-5 bg-[var(--color-electric-blue)] text-white font-cartoon text-3xl tracking-widest shadow-[8px_8px_0_#111]">
                  SECURE THE BAG
                </button>
              </Link>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
