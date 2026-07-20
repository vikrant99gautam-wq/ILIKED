"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    state: "",
    zip: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (!data.error) setSettings(data);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    });

    const savedAddress = localStorage.getItem('iliked_saved_address');
    if (savedAddress) {
      try {
        const parsed = JSON.parse(savedAddress);
        setFormData(prev => ({
          ...prev,
          firstName: parsed.firstName || prev.firstName,
          lastName: parsed.lastName || prev.lastName,
          phone: parsed.phone || prev.phone,
          address: parsed.address || prev.address,
          city: parsed.city || prev.city,
          district: parsed.district || prev.district,
          state: parsed.state || prev.state,
          zip: parsed.zip || prev.zip,
        }));
      } catch(e) {}
    }

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (formData.zip.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${formData.zip}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
            const postOffices = data[0].PostOffice;
            const uniqueCities = Array.from(new Set(postOffices.map((po: any) => po.Name))) as string[];
            setCityOptions(uniqueCities);
            
            setFormData(prev => ({
              ...prev,
              district: postOffices[0].District,
              state: postOffices[0].State,
              city: uniqueCities[0] || ""
            }));
          } else {
            setCityOptions([]);
          }
        })
        .catch(err => {
          console.error("Error fetching pincode details", err);
          setCityOptions([]);
        });
    } else {
      setCityOptions([]);
    }
  }, [formData.zip]);

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any | null>(null);
  const [promoError, setPromoError] = useState("");

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleApplyPromo = () => {
    setPromoError("");
    if (!promoCodeInput.trim()) return;
    
    if (!settings?.promo_codes) {
      setPromoError("Invalid code.");
      return;
    }
    try {
      const promos = JSON.parse(settings.promo_codes);
      const found = promos.find((p: any) => p.code.toUpperCase() === promoCodeInput.trim().toUpperCase());
      
      if (!found) {
        setPromoError("Invalid code.");
        setAppliedPromo(null);
        return;
      }
      
      if (found.active === false) {
        setPromoError("This code is inactive.");
        setAppliedPromo(null);
        return;
      }
      
      if (found.maxUses !== null && found.currentUses >= found.maxUses) {
        setPromoError("This code has reached its usage limit.");
        setAppliedPromo(null);
        return;
      }
      
      if (found.minOrderValue !== null && subtotal < found.minOrderValue) {
        setPromoError(`Minimum order value of ₹${found.minOrderValue} required.`);
        setAppliedPromo(null);
        return;
      }
      
      if (found.restrictedToEmail && found.restrictedToEmail.toLowerCase() !== formData.email.toLowerCase()) {
        setPromoError("This code is not valid for your email.");
        setAppliedPromo(null);
        return;
      }

      setAppliedPromo(found);
    } catch(e) {
      setPromoError("Promo system offline.");
    }
  };

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discountAmount = Math.floor((subtotal * appliedPromo.value) / 100);
    } else {
      discountAmount = appliedPromo.value;
    }
  }
  
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  
  let shipping = 0;
  if (settings) {
    if (settings.free_shipping_threshold > 0 && discountedSubtotal >= settings.free_shipping_threshold) {
      shipping = 0;
    } else {
      shipping = settings.shipping_cost || 0;
    }
  } else {
    shipping = cartItems.length > 0 ? 850 : 0;
  }
  
  const total = discountedSubtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // We bundle the shipping details as a special item in the items array 
      // to avoid breaking the Supabase table schema if columns don't exist.
      const itemsWithShipping = [
        ...cartItems,
        ...(appliedPromo ? [{
          id: `PROMO-${appliedPromo.code}`,
          name: `Discount (${appliedPromo.code})`,
          size: "-",
          price: -discountAmount,
          quantity: 1,
          image: ""
        }] : []),
        {
          id: "SHIPPING-INFO",
          name: "Delivery Details",
          size: "-",
          price: 0,
          quantity: 1,
          image: "",
          shipping_info: {
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            district: formData.district,
            state: formData.state,
            zip: formData.zip
          }
        }
      ];

      const orderPayload = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        total: total,
        items: itemsWithShipping
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
              <div className="flex justify-between items-end border-b-[4px] border-black pb-2">
                <h3 className="font-black text-2xl inline-block">1. CONTACT</h3>
                {!user && (
                  <button 
                    type="button" 
                    onClick={() => router.push('/profile')} 
                    className="font-bold text-sm tracking-widest uppercase hover:text-[var(--color-electric-blue)] underline"
                  >
                    HAVE AN ACCOUNT? LOGIN
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm tracking-widest uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required
                    readOnly={!!user}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="YOU@EXAMPLE.COM" 
                    className={`w-full p-4 border-[4px] border-black font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all ${user ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#F4F4F0]'}`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm tracking-widest uppercase">Mobile Number</label>
                  <input 
                    type="tel" 
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                    placeholder="9876543210" 
                    className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all"
                  />
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm tracking-widest uppercase">City / Locality</label>
                  {cityOptions.length > 0 ? (
                    <select 
                      required
                      value={formData.city} 
                      onChange={(e) => setFormData({...formData, city: e.target.value})} 
                      className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all appearance-none cursor-pointer"
                    >
                      {cityOptions.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  ) : (
                    <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm tracking-widest uppercase">District</label>
                  <input required type="text" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm tracking-widest uppercase">State/Prov</label>
                  <input required type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm tracking-widest uppercase">ZIP Code (Enter to auto-fill)</label>
                  <input required type="text" maxLength={6} value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value.replace(/\D/g, '')})} className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all" />
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

            {/* Promo Code */}
            <div className="mb-8 border-b-[3px] border-dashed border-black pb-8">
              <label className="font-bold text-sm tracking-widest uppercase mb-2 block">PROMO CODE</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  disabled={!!appliedPromo}
                  placeholder="GOT A CODE?"
                  className="flex-1 p-3 border-[3px] border-black font-bold outline-none focus:ring-4 focus:ring-[#FFD700] uppercase"
                />
                {!appliedPromo ? (
                  <button 
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-6 border-[3px] border-black bg-black text-white font-black tracking-widest hover:bg-[var(--color-electric-blue)] transition-colors"
                  >
                    APPLY
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => { setAppliedPromo(null); setPromoCodeInput(""); setPromoError(""); }}
                    className="px-6 border-[3px] border-black bg-red-500 text-white font-black tracking-widest hover:bg-black transition-colors"
                  >
                    REMOVE
                  </button>
                )}
              </div>
              {promoError && <p className="text-red-600 font-bold text-sm mt-2 uppercase">{promoError}</p>}
              {appliedPromo && <p className="text-[#19B85A] font-bold text-sm mt-2 uppercase">Code {appliedPromo.code} applied! (-{appliedPromo.discount}%)</p>}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-lg">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold tracking-widest text-sm">SUBTOTAL</span>
                <span className="font-black">₹{subtotal}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-[#19B85A]">
                  <span className="font-bold tracking-widest text-sm">DISCOUNT ({appliedPromo.code})</span>
                  <span className="font-black">-₹{discountAmount}</span>
                </div>
              )}
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
