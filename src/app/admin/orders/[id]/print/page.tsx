"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function PrintInvoicePage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
      if (!error && data) {
        setOrder(data);
      }
      setLoading(false);
      
      // Auto-trigger print when loaded
      if (data) {
        setTimeout(() => {
          window.print();
        }, 500);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="p-10 font-bold text-center">Loading Invoice...</div>;
  }

  if (!order) {
    return <div className="p-10 font-bold text-center">Order not found.</div>;
  }

  // Extract pseudo-items
  let shippingInfo: any = null;
  let paymentInfo: any = null;

  if (Array.isArray(order.items)) {
    const sItem = order.items.find((item: any) => item.id === "SHIPPING-INFO");
    if (sItem && sItem.shipping_info) shippingInfo = sItem.shipping_info;
    
    paymentInfo = order.items.find((item: any) => item.id === "PAYMENT-INFO");
  }

  const realItems = Array.isArray(order.items) ? order.items.filter((item: any) => 
    item.id !== "SHIPPING-INFO" && item.id !== "PAYMENT-INFO" && !String(item.id).startsWith("PROMO-")
  ) : [];

  const promoItems = Array.isArray(order.items) ? order.items.filter((item: any) => 
    String(item.id).startsWith("PROMO-")
  ) : [];

  const subtotal = realItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const discountTotal = promoItems.reduce((sum: number, item: any) => sum + Math.abs(item.price), 0);
  const calculatedDelivery = Math.max(0, order.total - (subtotal - discountTotal));

  return (
    <div className="bg-white min-h-screen text-black w-full" style={{ fontFamily: "Arial, sans-serif" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          .no-print { display: none !important; }
        }
        @page { size: A4 portrait; margin: 0; }
        * { box-sizing: border-box; }
      `}} />

      {/* Action Bar (Hidden when printing) */}
      <div className="no-print p-4 bg-gray-100 border-b border-gray-300 flex justify-between items-center fixed top-0 w-full z-50">
        <p className="font-bold">Print Preview Mode</p>
        <div>
          <button onClick={() => window.close()} className="px-4 py-2 border border-black mr-2 bg-white font-bold">CLOSE</button>
          <button onClick={() => window.print()} className="px-4 py-2 border border-black bg-black text-white font-bold">PRINT NOW</button>
        </div>
      </div>

      <div className="max-w-[21cm] mx-auto bg-white pt-16">
        
        {/* =========================================
            PART 1: SHIPPING LABEL (Top Half)
        ========================================== */}
        <div className="p-8 h-[13cm] flex flex-col justify-between border-b-2 border-dashed border-gray-400">
          <div>
            <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-6">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: "'Luckiest Guy', cursive" }}>I LIKED</h1>
                <p className="font-bold mt-1 text-sm">ORDER: #{order.id}</p>
                <p className="font-bold text-sm">DATE: {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right border-2 border-black p-2 bg-gray-100">
                <p className="text-xl font-black uppercase">{paymentInfo?.payment_id === "COD" ? "COD - COLLECT CASH" : "PREPAID - DO NOT COLLECT CASH"}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="w-1/2 pr-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">FROM (SENDER):</p>
                <p className="font-bold">I LIKED STORE</p>
                <p className="text-sm">Sector 7, Block B</p>
                <p className="text-sm">New Delhi, India 110001</p>
                <p className="text-sm">support@iliked.in</p>
              </div>
              
              <div className="w-1/2 pl-4 border-l-2 border-black">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">TO (RECEIVER):</p>
                <h2 className="text-2xl font-black uppercase leading-tight mb-2">
                  {shippingInfo ? `${shippingInfo.firstName} ${shippingInfo.lastName}` : order.customer_name}
                </h2>
                {shippingInfo && (
                  <p className="text-lg font-bold uppercase leading-snug">
                    {shippingInfo.address}<br />
                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode || shippingInfo.zip}<br />
                    PHONE: {shippingInfo.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t-2 border-black pt-4 mt-6">
            <p className="text-center font-bold text-xl uppercase tracking-widest">
              Please deliver quickly!
            </p>
          </div>
        </div>

        {/* CUT LINE INDICATOR */}
        <div className="text-center text-xs font-bold text-gray-400 py-1 tracking-widest no-print">
          ✂️ --------------------- CUT HERE --------------------- ✂️
        </div>

        {/* =========================================
            PART 2: STORE INVOICE (Bottom Half)
        ========================================== */}
        <div className="p-8 h-[13cm] flex flex-col">
          <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-black uppercase">TAX INVOICE / RECEIPT</h2>
              <p className="text-sm font-bold text-gray-600 mt-1">STORE COPY / CUSTOMER COPY</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">ORDER NO: #{order.id}</p>
              <p className="text-sm font-bold">DATE: {new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>

          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2 text-sm font-black uppercase">ITEM</th>
                <th className="py-2 text-sm font-black uppercase text-center w-16">QTY</th>
                <th className="py-2 text-sm font-black uppercase text-right w-24">PRICE</th>
                <th className="py-2 text-sm font-black uppercase text-right w-24">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {realItems.map((item: any, i: number) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3">
                    <p className="font-bold text-sm uppercase">{item.name}</p>
                    <p className="text-xs text-gray-600">SIZE: {item.size}</p>
                  </td>
                  <td className="py-3 text-center text-sm font-bold">{item.quantity}</td>
                  <td className="py-3 text-right text-sm">₹{item.price}</td>
                  <td className="py-3 text-right text-sm font-bold">₹{item.price * item.quantity}</td>
                </tr>
              ))}
              {promoItems.map((item: any, i: number) => (
                <tr key={'p'+i} className="border-b border-gray-200 bg-gray-50">
                  <td className="py-2"><p className="font-bold text-sm uppercase text-gray-600">DISCOUNT ({item.id})</p></td>
                  <td className="py-2 text-center text-sm font-bold">1</td>
                  <td className="py-2 text-right text-sm">-</td>
                  <td className="py-2 text-right text-sm font-bold text-gray-600">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-auto self-end w-1/2">
            <div className="flex justify-between py-1 text-sm">
              <span className="font-bold text-gray-600">SUBTOTAL</span>
              <span className="font-bold">₹{subtotal - discountTotal}</span>
            </div>
            <div className="flex justify-between py-1 text-sm border-b border-black">
              <span className="font-bold text-gray-600">SHIPPING</span>
              <span className="font-bold">₹{calculatedDelivery}</span>
            </div>
            <div className="flex justify-between py-2 mt-1">
              <span className="text-xl font-black uppercase">GRAND TOTAL</span>
              <span className="text-xl font-black">₹{order.total}</span>
            </div>
          </div>
          
          <div className="mt-8 border-t border-black pt-4 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase">Thank you for shopping with I LIKED.</p>
            <p className="text-xs font-bold text-gray-500 uppercase">For support, email us at support@iliked.in</p>
          </div>
        </div>

      </div>
    </div>
  );
}
