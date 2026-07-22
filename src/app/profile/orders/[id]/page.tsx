"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

function ReviewItem({ item, orderStatus }: { item: any; orderStatus: string }) {
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const isRealProduct = item.id && !item.id.toString().includes('discount') && !item.id.toString().includes('delivery') && !item.name.toLowerCase().includes('discount') && !item.name.toLowerCase().includes('delivery');
  const canReview = isRealProduct && (orderStatus === 'Delivered' || orderStatus === 'Cancelled');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) {
      alert("Name and comment are required!");
      return;
    }
    setIsSubmitting(true);
    try {
      // Fetch product to get current reviews
      const productRes = await fetch(`/api/products/${item.id}`);
      const product = await productRes.json();
      
      const currentReviews = Array.isArray(product.reviews) ? product.reviews : [];
      const newReview = { ...reviewForm, date: new Date().toISOString() };
      const updatedReviews = [...currentReviews, newReview];
      
      const res = await fetch(`/api/products/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews: updatedReviews })
      });
      
      if (res.ok) {
        setReviewForm({ name: '', rating: 5, comment: '' });
        alert("Review added successfully! Thank you.");
        setShowReviewForm(false);
      } else {
        alert("Failed to submit review.");
      }
    } catch (e) {
      alert("Error submitting review.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border-[4px] border-black p-4 mb-4 shadow-[4px_4px_0_#111]">
      <div className="flex gap-4 items-start">
        <div className="w-24 h-24 bg-[#F4F4F0] border-[2px] border-black overflow-hidden flex items-center justify-center shrink-0">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
          ) : (
            <div className="font-cartoon text-xs text-center text-gray-400">NO IMAGE</div>
          )}
        </div>
        <div className="flex-1">
          <Link href={`/shop/${item.id}`} className="font-cartoon text-2xl md:text-3xl hover:underline">
            {item.name}
          </Link>
          <div className="font-mono font-bold mt-1 text-sm md:text-base">SIZE: {item.size}</div>
          <div className="font-mono font-black mt-1 text-sm md:text-base">₹{item.price} x {item.quantity}</div>
          
          {canReview && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="mt-3 px-4 py-1 border-[2px] border-black bg-[#FFD700] hover:bg-black hover:text-white font-black text-xs md:text-sm transition-colors uppercase"
            >
              {showReviewForm ? "CANCEL REVIEW" : "LEAVE A REVIEW"}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showReviewForm && canReview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t-[2px] border-dashed border-black">
              <h4 className="font-cartoon text-xl mb-3">DROP A REVIEW FOR THIS PIECE</h4>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block font-black text-xs mb-1">NAME</label>
                  <input 
                    type="text" 
                    required
                    value={reviewForm.name}
                    onChange={e => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full border-[2px] border-black p-2 font-bold focus:outline-none focus:ring-4 focus:ring-[var(--color-electric-blue)]"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block font-black text-xs mb-1">RATING</label>
                  <div className="flex gap-1 text-2xl text-gray-300 drop-shadow-[1px_1px_0_#111]">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className={`transition-colors ${(hoverRating || reviewForm.rating) >= star ? 'text-[#FFD700]' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-black text-xs mb-1">COMMENT</label>
                  <textarea 
                    required
                    rows={2}
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                    className="w-full border-[2px] border-black p-2 font-bold focus:outline-none focus:ring-4 focus:ring-[var(--color-electric-blue)] resize-none"
                    placeholder="What do you think about this piece?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[var(--color-electric-blue)] text-white border-[3px] border-black py-2 font-cartoon text-xl hover:bg-black transition-colors"
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        router.push("/profile");
      } else {
        fetchOrder(session.user.email);
      }
    });
  }, []);

  const fetchOrder = async (email: string | undefined) => {
    if (!email) return;
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.id)
      .ilike('email', email)
      .single();

    if (!error && data) {
      setOrder(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex justify-center py-20">
          <span className="font-cartoon text-4xl animate-pulse">LOADING ORDER...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 border-[4px] border-dashed border-black bg-white shadow-[12px_12px_0_#111]">
          <h2 className="font-cartoon text-4xl mb-4">ORDER NOT FOUND</h2>
          <Link href="/profile" className="px-6 py-3 border-[3px] border-black bg-[#FFD700] hover:bg-black hover:text-white font-black uppercase transition-colors">
            BACK TO STASH
          </Link>
        </div>
      </div>
    );
  }

  let shippingInfo = null;
  if (order.shipping_info) {
    try {
      shippingInfo = JSON.parse(order.shipping_info);
    } catch(e) {}
  } 
  if (!shippingInfo && Array.isArray(order.items)) {
    const shippingItem = order.items.find((item: any) => item.id === "SHIPPING-INFO");
    if (shippingItem && shippingItem.shipping_info) {
      shippingInfo = shippingItem.shipping_info;
    }
  }

  const realItems = Array.isArray(order.items) ? order.items.filter((item: any) => {
    if (item.id === "SHIPPING-INFO" || item.id === "PAYMENT-INFO") return false;
    const name = item.name?.toLowerCase() || '';
    return !name.includes('discount') && !name.includes('delivery');
  }) : [];

  const promoItems = Array.isArray(order.items) ? order.items.filter((item: any) => item.id.toString().startsWith("PROMO-") || item.name?.toLowerCase().includes("discount")) : [];
  
  const subtotal = realItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const discountTotal = promoItems.reduce((sum: number, item: any) => sum + Math.abs(item.price), 0);
  const calculatedDelivery = Math.max(0, order.total - (subtotal - discountTotal));

  return (
    <div className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/profile" className="inline-block mb-6 font-black uppercase text-sm hover:underline hover:text-[var(--color-electric-blue)]">
          ← BACK TO MY ORDERS
        </Link>
        
        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0_#111] p-6 md:p-8 relative">
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FFD700] border-[3px] border-black rotate-12 flex items-center justify-center shadow-[4px_4px_0_#111]">
            <span className="font-cartoon text-2xl">📦</span>
          </div>

          <div className="border-b-[4px] border-black pb-6 mb-6">
            <h1 className="font-cartoon text-4xl md:text-5xl uppercase drop-shadow-[2px_2px_0_var(--color-electric-blue)]">
              ORDER #{order.id.slice(-8)}
            </h1>
            <p className="font-black text-gray-500 mt-2 uppercase text-sm tracking-widest">
              PLACED ON {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-[#fcfaf5] border-[3px] border-dashed border-black p-4">
              <h3 className="font-cartoon text-2xl mb-2">STATUS</h3>
              <div className="inline-block px-3 py-1 border-[2px] border-black font-black uppercase text-sm bg-white">
                {order.status || 'Pending'}
              </div>
            </div>
            
            {shippingInfo && (
              <div className="bg-[#fcfaf5] border-[3px] border-dashed border-black p-4">
                <h3 className="font-cartoon text-2xl mb-2">SHIPPING TO</h3>
                <p className="font-mono text-sm font-bold uppercase leading-relaxed">
                  {shippingInfo.firstName} {shippingInfo.lastName}<br />
                  {shippingInfo.address}<br />
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode || shippingInfo.zip}<br />
                  PHONE: {shippingInfo.phone}
                </p>
              </div>
            )}
          </div>

          <h2 className="font-cartoon text-3xl mb-4">ITEMS</h2>
          <div className="mb-6">
            {realItems.map((item: any, i: number) => (
                <ReviewItem key={i} item={item} orderStatus={order.status || 'Pending'} />
            ))}
          </div>

          <div className="border-t-[4px] border-black pt-6 flex flex-col gap-4">
            {promoItems.map((promo: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-[#19B85A] font-mono font-bold">
                <span className="uppercase text-sm">{promo.name}</span>
                <span className="text-xl">₹{promo.price}</span>
              </div>
            ))}
            {calculatedDelivery > 0 && (
              <div className="flex justify-between items-center text-gray-500 font-mono font-bold">
                <span className="uppercase text-sm">DELIVERY CHARGE</span>
                <span className="text-xl">₹{calculatedDelivery}</span>
              </div>
            )}
            <div className="flex justify-between items-end mt-2 pt-4 border-t-[2px] border-dashed border-gray-300">
              <div className="font-black text-black uppercase text-sm">TOTAL AMOUNT PAID</div>
              <div className="font-mono font-black text-3xl md:text-4xl text-black">
                ₹{order.total}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <a href={`/checkout/success?orderId=${order.id}`} className="cartoon-btn px-6 py-3 bg-[var(--color-electric-blue)] text-white font-cartoon text-2xl tracking-widest border-[4px] border-black hover:bg-black transition-colors shadow-[4px_4px_0_#111]">
              VIEW INVOICE
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
