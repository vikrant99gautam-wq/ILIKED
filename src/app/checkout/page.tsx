"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 850 : 0; // Flat ₹850 shipping
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        total: total,
        items: cartItems
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const orderData = await res.json();
        clearCart();
        router.push(`/checkout/success?orderId=${orderData.id}`);
      } else {
        alert("Something went wrong!");
        setIsSubmitting(false);
      }
    } catch (err) {
      alert("Error placing order.");
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return <main className="min-h-screen bg-white pt-[76px]"></main>;
  }

  return (
    <main className="min-h-screen bg-white pt-[76px]">
      <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-76px)]">
        
        {/* Left Side: The Details */}
        <div className="w-full lg:w-[60%] p-8 md:p-12 lg:p-20 flex flex-col justify-start">
          <div className="mb-12">
            <h1 className="font-cartoon text-5xl md:text-7xl text-black tracking-widest drop-shadow-[4px_4px_0_var(--color-coral-red)] uppercase mb-4">
              THE DETAILS
            </h1>
            <p className="font-bold text-gray-500 uppercase tracking-widest">Where do we drop the heat?</p>
          </div>

          <form className="space-y-8 max-w-2xl" onSubmit={handleSubmit}>
            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-black text-2xl border-b-[4px] border-black pb-2 inline-block">1. CONTACT</h3>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm tracking-widest uppercase">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="YOU@EXAMPLE.COM" 
                  className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all"
                />
              </div>
            </div>

            {/* Shipping */}
            <div className="space-y-4 pt-8">
              <h3 className="font-black text-2xl border-b-[4px] border-black pb-2 inline-block">2. SHIPPING</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm tracking-widest uppercase">First Name</label>
                  <input required type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm tracking-widest uppercase">Last Name</label>
                  <input required type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm tracking-widest uppercase">Street Address</label>
                <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2 md:col-span-1">
                  <label className="font-bold text-sm tracking-widest uppercase">City</label>
                  <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-1">
                  <label className="font-bold text-sm tracking-widest uppercase">State/Prov</label>
                  <input required type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all" />
                </div>
                <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                  <label className="font-bold text-sm tracking-widest uppercase">ZIP Code</label>
                  <input required type="text" value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all" />
                </div>
              </div>
            </div>

            <button id="hiddenSubmit" type="submit" className="hidden"></button>
          </form>

        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[40%] bg-[var(--color-coral-red)] text-black p-8 md:p-12 lg:p-20 flex flex-col justify-start border-t-[8px] lg:border-t-0 lg:border-l-[8px] border-black relative">
          
          {/* Comic Halftone Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 2px)', backgroundSize: '16px 16px' }}
          ></div>

          <div className="relative z-10 bg-white border-[4px] border-black p-6 lg:p-8 shadow-[8px_8px_0_#111]">
            {/* Order Items Mini Summary */}
            <div className="space-y-6 mb-8 border-b-[3px] border-dashed border-black pb-8">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white border-[3px] border-black flex items-center justify-center p-1 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-black text-lg leading-none">{item.name}</p>
                      <p className="text-gray-500 text-sm mt-1">SIZE: {item.size} | QTY: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-black text-xl">₹{item.price}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-lg">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold tracking-widest text-sm">SUBTOTAL</span>
                <span className="font-black">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold tracking-widest text-sm">SHIPPING</span>
                <span className="font-black">₹{shipping}</span>
              </div>
              <div className="flex justify-between pt-4 border-t-[3px] border-dashed border-black mt-4 text-3xl text-[var(--color-coral-red)]">
                <span className="font-cartoon tracking-widest">TOTAL</span>
                <span className="font-black">₹{total}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6">
            <button 
              onClick={() => document.getElementById('hiddenSubmit')?.click()}
              disabled={isSubmitting}
              className={`w-full bg-[#FFD700] text-black border-[4px] border-black py-6 font-cartoon text-4xl tracking-widest transition-colors duration-300 shadow-[8px_8px_0_#111] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--color-electric-blue)] hover:text-white active:translate-y-1 active:translate-x-1 active:shadow-none'}`}
            >
              {isSubmitting ? "PROCESSING..." : "SEAL THE DEAL"}
            </button>
            <p className="text-center text-gray-500 text-xs mt-6 font-bold tracking-widest uppercase">
              By confirming, you agree that this drip is non-refundable.
            </p>
          </div>
          
        </div>
      </div>
    </main>
  );
}
