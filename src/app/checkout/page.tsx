"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import Script from "next/script";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [paymentPopup, setPaymentPopup] = useState<{show: boolean, type: 'success' | 'error', message: string} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'PARTIAL_COD'>('ONLINE');
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
      setLoadingSession(false);
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

      const isPartialCod = paymentMethod === 'PARTIAL_COD';
      const amountToPay = isPartialCod ? 149 : total;

      // Handle ONLINE and PARTIAL_COD (Razorpay) flow
      // 1. Create Razorpay Order
      const rzpRes = await fetch("/api/razorpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountToPay })
      });
      const rzpData = await rzpRes.json();

      if (!rzpRes.ok) {
        setPaymentPopup({ show: true, type: 'error', message: rzpData.error || "Failed to initialize payment" });
        setIsSubmitting(false);
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy_key_here",
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: "I LIKED",
        description: "Streetwear Purchase",
        order_id: rzpData.id,
        handler: async function (response: any) {
          // 3. Verify Payment & Create Order
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id || rzpData.id,
              razorpay_payment_id: response.razorpay_payment_id || "mock_payment_123",
              razorpay_signature: response.razorpay_signature || "mock_sig",
              orderPayload,
              isPartialCod
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            setPaymentPopup({ show: true, type: 'success', message: "Payment Successful! Redirecting..." });
            clearCart();
            setTimeout(() => {
              router.push(`/checkout/success?orderId=${verifyData.orderId}`);
            }, 2000);
          } else {
            setPaymentPopup({ show: true, type: 'error', message: "Payment Verification Failed!" });
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: orderPayload.customer_name,
          email: orderPayload.email,
          contact: formData.phone
        },
        theme: {
          color: "#000000"
        }
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setPaymentPopup({ show: true, type: 'error', message: response.error.description || "Payment Failed" });
        setIsSubmitting(false);
      });
      rzp.open();

    } catch (err) {
      setPaymentPopup({ show: true, type: 'error', message: "Error placing order." });
      setIsSubmitting(false);
    }
  };

  if (!mounted || loadingSession) {
    return (
       <main className="min-h-screen bg-white pt-[76px] flex items-center justify-center">
         <span className="font-cartoon text-4xl animate-pulse">LOADING...</span>
       </main>
    );
  }

  // TEMPORARILY DISABLED FOR RAZORPAY VERIFICATION
  /*
  if (!user) {
    return (
       <main className="min-h-screen bg-[#F4F4F0] pt-[76px] flex items-center justify-center p-4">
         <div className="bg-white border-[4px] border-black shadow-[12px_12px_0_#111] p-12 text-center max-w-lg w-full">
           <h1 className="font-cartoon text-5xl mb-4 uppercase text-[var(--color-coral-red)]">Hold Up!</h1>
           <p className="font-black text-gray-500 uppercase tracking-widest mb-8">You need to login to your stash before you can cop this drip.</p>
           <button onClick={() => router.push('/profile')} className="w-full bg-[#FFD700] text-black border-[4px] border-black py-4 font-cartoon text-3xl tracking-widest shadow-[6px_6px_0_#111] hover:bg-black hover:text-[#FFD700] transition-colors">
             LOGIN NOW
           </button>
         </div>
       </main>
    );
  }
  */

  return (
    <main className="min-h-screen bg-white pt-[76px]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
              {paymentMethod === 'PARTIAL_COD' ? (
                <>
                  <div className="flex justify-between pt-4 border-t-[3px] border-dashed border-black mt-4 text-3xl text-[var(--color-coral-red)]">
                    <span className="font-cartoon tracking-widest">ADVANCE (PAY NOW)</span>
                    <span className="font-black">₹149</span>
                  </div>
                  <div className="flex justify-between mt-2 text-xl text-black">
                    <span className="font-cartoon tracking-widest">DUE ON DELIVERY</span>
                    <span className="font-black">₹{total - 149}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between pt-4 border-t-[3px] border-dashed border-black mt-4 text-3xl text-[var(--color-coral-red)]">
                  <span className="font-cartoon tracking-widest">TOTAL</span>
                  <span className="font-black">₹{total}</span>
                </div>
              )}
            </div>
          </div>

          <div className="relative z-10 mt-6 space-y-4">
            {/* Payment Method Selection */}
            <div className="border-[3px] border-black bg-white p-4">
              <h3 className="font-black text-lg mb-3 tracking-widest">PAYMENT METHOD</h3>
              <div className="space-y-2">
                <label className={`flex items-center p-3 border-[2px] cursor-pointer transition-colors ${paymentMethod === 'ONLINE' ? 'border-black bg-gray-100' : 'border-gray-300 hover:border-black'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="ONLINE" 
                    checked={paymentMethod === 'ONLINE'}
                    onChange={() => setPaymentMethod('ONLINE')}
                    className="w-5 h-5 accent-black mr-3"
                  />
                  <span className="font-bold">Pay Full Amount Online (Cards / UPI)</span>
                </label>
                <label className={`flex items-center p-3 border-[2px] cursor-pointer transition-colors ${paymentMethod === 'PARTIAL_COD' ? 'border-black bg-gray-100' : 'border-gray-300 hover:border-black'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="PARTIAL_COD" 
                    checked={paymentMethod === 'PARTIAL_COD'}
                    onChange={() => setPaymentMethod('PARTIAL_COD')}
                    className="w-5 h-5 accent-black mr-3 shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold">Partial Cash on Delivery</span>
                    <span className="text-xs text-gray-500 font-bold uppercase mt-1">Pay ₹149 now, rest on delivery</span>
                  </div>
                </label>
              </div>
            </div>

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

      {/* Payment Popup Modal */}
      {paymentPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className={`w-full max-w-md bg-white border-[4px] border-black p-8 relative shadow-[8px_8px_0_#111] flex flex-col items-center text-center`}
          >
            {paymentPopup.type === 'success' ? (
              <>
                <div className="w-20 h-20 bg-[#19B85A] border-[3px] border-black rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-cartoon tracking-widest text-black mb-2 uppercase">Payment Successful</h2>
                <p className="text-black font-bold mb-6 uppercase">{paymentPopup.message}</p>
                <div className="w-8 h-8 border-4 border-black border-t-[#19B85A] rounded-full animate-spin"></div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-[var(--color-coral-red)] border-[3px] border-black rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-cartoon tracking-widest text-black mb-2 uppercase">Payment Failed</h2>
                <p className="text-gray-600 font-bold mb-8 uppercase text-sm">{paymentPopup.message}</p>
                <button 
                  onClick={() => setPaymentPopup(null)}
                  className="w-full bg-black text-white border-[3px] border-black py-4 font-black tracking-widest hover:bg-[var(--color-coral-red)] hover:text-black transition-colors"
                >
                  TRY AGAIN
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
}
