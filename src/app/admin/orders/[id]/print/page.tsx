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

      <div className="max-w-[21cm] mx-auto bg-white pt-8">
        
        {/* =========================================
            PART 1: SHIPPING LABEL (Top Half)
        ========================================== */}
        <div className="p-8 h-[13cm] flex flex-col justify-between border-b border-dashed border-gray-400">
          <div>
            <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-widest text-black">I LIKED</h1>
                <p className="text-sm mt-1 text-gray-700">ORDER: #{order.id}</p>
                <p className="text-sm text-gray-700">DATE: {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right border border-black p-3 bg-gray-50">
                <p className="text-lg font-bold">{paymentInfo?.payment_id === "COD" ? "COD - COLLECT CASH" : "PREPAID - DO NOT COLLECT CASH"}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="w-1/2 pr-4 text-sm text-gray-800">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">FROM (SENDER):</p>
                <p className="font-bold">I LIKED STORE</p>
                <p>Sector 7, Block B</p>
                <p>New Delhi, India 110001</p>
                <p>support@iliked.in</p>
              </div>
              
              <div className="w-1/2 pl-4 border-l border-gray-300">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">TO (RECEIVER):</p>
                <h2 className="text-xl font-bold uppercase mb-1">
                  {shippingInfo ? `${shippingInfo.firstName} ${shippingInfo.lastName}` : order.customer_name}
                </h2>
                {shippingInfo && (
                  <p className="text-sm leading-relaxed text-gray-800">
                    {shippingInfo.address}<br />
                    {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode || shippingInfo.zip}<br />
                    PHONE: <span className="font-semibold">{shippingInfo.phone}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-300 pt-4 mt-6">
            <p className="text-center font-medium text-lg uppercase tracking-wide text-gray-700">
              PLEASE DELIVER QUICKLY
            </p>
          </div>
        </div>

        {/* CUT LINE INDICATOR */}
        <div className="text-center text-xs text-gray-500 py-2 tracking-widest no-print">
          --------------------- CUT HERE ---------------------
        </div>

        {/* =========================================
            PART 2: STORE INVOICE (Bottom Half)
        ========================================== */}
        <div className="p-8 h-[13cm] flex flex-col">
          <div className="flex justify-between items-end border-b border-black pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-widest text-black mb-1">I LIKED</h1>
              <h2 className="text-xl font-semibold text-gray-800">TAX INVOICE</h2>
              <p className="text-xs text-gray-500 mt-1 uppercase">Customer Copy</p>
            </div>
            <div className="text-right text-sm text-gray-800">
              <p>ORDER NO: <span className="font-semibold">#{order.id}</span></p>
              <p>DATE: <span className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</span></p>
            </div>
          </div>

          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="border-b border-black text-gray-700">
                <th className="py-2 text-xs font-bold uppercase">ITEM DESCRIPTION</th>
                <th className="py-2 text-xs font-bold uppercase text-center w-16">QTY</th>
                <th className="py-2 text-xs font-bold uppercase text-right w-24">PRICE</th>
                <th className="py-2 text-xs font-bold uppercase text-right w-24">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {realItems.map((item: any, i: number) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3">
                    <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Size: {item.size}</p>
                  </td>
                  <td className="py-3 text-center text-sm">{item.quantity}</td>
                  <td className="py-3 text-right text-sm">₹{item.price}</td>
                  <td className="py-3 text-right text-sm font-semibold">₹{item.price * item.quantity}</td>
                </tr>
              ))}
              {promoItems.map((item: any, i: number) => (
                <tr key={'p'+i} className="border-b border-gray-200 bg-gray-50">
                  <td className="py-2"><p className="font-semibold text-sm text-gray-700">Discount ({item.id})</p></td>
                  <td className="py-2 text-center text-sm">1</td>
                  <td className="py-2 text-right text-sm">-</td>
                  <td className="py-2 text-right text-sm font-semibold text-gray-700">-₹{Math.abs(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-auto self-end w-2/3 md:w-1/2">
            <div className="flex justify-between py-1.5 text-sm text-gray-800">
              <span>SUBTOTAL</span>
              <span className="font-semibold">₹{subtotal - discountTotal}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm text-gray-800 border-b border-gray-300">
              <span>SHIPPING</span>
              <span className="font-semibold">₹{calculatedDelivery}</span>
            </div>
            <div className="flex justify-between py-3 mt-1">
              <span className="text-lg font-bold">GRAND TOTAL</span>
              <span className="text-lg font-bold">₹{order.total}</span>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-300 pt-4 text-center">
            <p className="text-xs text-gray-500">Thank you for shopping with I LIKED.</p>
            <p className="text-xs text-gray-500">For support, email us at support@iliked.in</p>
          </div>
        </div>

      </div>
    </div>
  );
}
