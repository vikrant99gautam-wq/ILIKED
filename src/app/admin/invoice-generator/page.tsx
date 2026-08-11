"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function InvoiceGeneratorPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(true);
  
  const [formData, setFormData] = useState({
    orderId: "CUSTOM-001",
    orderDate: new Date().toISOString().split('T')[0],
    senderName: "I LIKED STORE",
    senderAddressLine1: "Sector 7, Block B",
    senderAddressLine2: "New Delhi, India 110001",
    senderEmail: "support@iliked.in",
    receiverName: "",
    receiverAddressLine1: "",
    receiverAddressLine2: "",
    receiverPhone: "",
    courierName: "",
    trackingNumber: "",
    paymentMethod: "CASH",
    paymentStatus: "PAID",
    discountAmount: 0,
    shippingAmount: 0
  });

  const [items, setItems] = useState<{name: string, size: string, quantity: number, price: number}[]>([
    { name: "CUSTOM TEE", size: "L", quantity: 1, price: 999 }
  ]);

  useEffect(() => {
    async function fetchSettings() {
      const { data: settingsData } = await supabase.from('settings').select('*').single();
      if (settingsData) {
        setSettings(settingsData);
        setFormData(prev => ({
          ...prev,
          senderName: settingsData.store_name || prev.senderName,
          senderEmail: settingsData.contact_email || prev.senderEmail,
          senderAddressLine1: settingsData.store_address || prev.senderAddressLine1,
          senderAddressLine2: ""
        }));
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value } as any;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", size: "M", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleGenerate = () => {
    setIsEditing(false);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountTotal = Number(formData.discountAmount) || 0;
  const shippingTotal = Number(formData.shippingAmount) || 0;
  const grandTotal = subtotal - discountTotal + shippingTotal;
  const isPartialCod = formData.paymentMethod === "PARTIAL_COD";
  const dueAmount = isPartialCod ? grandTotal - 200 : 0;

  // ==========================================
  // EDIT MODE (FORM)
  // ==========================================
  if (isEditing) {
    return (
      <div className="max-w-5xl mx-auto bg-white border-[4px] border-black p-4 md:p-8 shadow-[8px_8px_0_#000]">
        <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
          <h1 className="text-3xl font-black uppercase">CUSTOM INVOICE GENERATOR</h1>
          <Link href="/admin" className="px-4 py-2 border-2 border-black font-bold hover:bg-gray-100">BACK</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Order Meta */}
          <div className="border-2 border-black p-6 bg-gray-50">
            <h2 className="text-xl font-bold mb-4 uppercase">Order Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Order ID / Number</label>
                <input type="text" name="orderId" value={formData.orderId} onChange={handleChange} className="w-full border-2 border-black p-2 font-semibold uppercase" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Order Date</label>
                <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} className="w-full border-2 border-black p-2 font-semibold uppercase" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full border-2 border-black p-2 font-semibold">
                  <option value="PREPAID">PREPAID</option>
                  <option value="CASH">CASH</option>
                  <option value="UPI">UPI (OFFLINE)</option>
                  <option value="PARTIAL_COD">PARTIAL COD</option>
                  <option value="COD">CASH ON DELIVERY</option>
                </select>
              </div>
            </div>
          </div>

          {/* Receiver Form */}
          <div className="border-2 border-black p-6 bg-gray-50">
            <h2 className="text-xl font-bold mb-4 uppercase">To (Customer Details)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Customer Name</label>
                <input type="text" name="receiverName" value={formData.receiverName} onChange={handleChange} className="w-full border-2 border-black p-2 font-semibold uppercase" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Address Line 1</label>
                <input type="text" name="receiverAddressLine1" value={formData.receiverAddressLine1} onChange={handleChange} className="w-full border-2 border-black p-2 font-semibold uppercase" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">City, State, Zip</label>
                <input type="text" name="receiverAddressLine2" value={formData.receiverAddressLine2} onChange={handleChange} className="w-full border-2 border-black p-2 font-semibold uppercase" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Phone Number</label>
                <input type="text" name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} className="w-full border-2 border-black p-2 font-semibold uppercase" />
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="border-2 border-black p-6 bg-white mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold uppercase">Items</h2>
            <button onClick={addItem} className="px-4 py-1 bg-black text-white font-bold text-sm">+ ADD ITEM</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="pb-2 font-bold">ITEM NAME</th>
                  <th className="pb-2 font-bold w-24">SIZE</th>
                  <th className="pb-2 font-bold w-24 text-center">QTY</th>
                  <th className="pb-2 font-bold w-32 text-right">PRICE (₹)</th>
                  <th className="pb-2 font-bold w-12 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2">
                      <input type="text" value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} className="w-full border border-black p-1 uppercase font-bold" placeholder="T-SHIRT" />
                    </td>
                    <td className="py-2 pr-2">
                      <input type="text" value={item.size} onChange={e => handleItemChange(index, 'size', e.target.value)} className="w-full border border-black p-1 uppercase font-bold" placeholder="M" />
                    </td>
                    <td className="py-2 pr-2">
                      <input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} className="w-full border border-black p-1 text-center font-bold" min="1" />
                    </td>
                    <td className="py-2">
                      <input type="number" value={item.price} onChange={e => handleItemChange(index, 'price', Number(e.target.value))} className="w-full border border-black p-1 text-right font-bold" min="0" />
                    </td>
                    <td className="py-2 text-center">
                      <button onClick={() => removeItem(index)} className="text-red-500 font-bold hover:bg-red-100 px-2 border border-red-500">X</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex flex-col items-end gap-2 text-sm font-bold">
            <div className="flex justify-between w-64">
              <span>SUBTOTAL:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-64 items-center">
              <span>DISCOUNT (₹):</span>
              <input type="number" name="discountAmount" value={formData.discountAmount} onChange={handleChange} className="w-24 border border-black p-1 text-right" />
            </div>
            <div className="flex justify-between w-64 items-center">
              <span>SHIPPING (₹):</span>
              <input type="number" name="shippingAmount" value={formData.shippingAmount} onChange={handleChange} className="w-24 border border-black p-1 text-right" />
            </div>
            <div className="flex justify-between w-64 mt-2 pt-2 border-t-2 border-black text-lg font-black">
              <span>TOTAL:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-2 border-black p-6 bg-[#FFD700]/20">
          <h2 className="text-xl font-bold mb-4 uppercase">Shipping / Tracking (Optional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold mb-1">Courier Name (e.g. Delhivery)</label>
              <input type="text" name="courierName" value={formData.courierName} onChange={handleChange} className="w-full border-2 border-black p-2 font-semibold uppercase" placeholder="DELHIVERY" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Tracking Number (AWB)</label>
              <input type="text" name="trackingNumber" value={formData.trackingNumber} onChange={handleChange} className="w-full border-2 border-black p-2 font-semibold uppercase" placeholder="AWB123456789" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleGenerate}
            className="px-8 py-4 bg-black text-white font-black text-xl tracking-widest uppercase hover:bg-[var(--color-electric-blue)] border-[4px] border-black transition-colors shadow-[4px_4px_0_#FFD700]"
          >
            CREATE INVOICE & PRINT
          </button>
        </div>

      </div>
    );
  }

  // ==========================================
  // PRINT MODE
  // ==========================================
  return (
    <div className="bg-white min-h-screen text-black w-full fixed inset-0 z-[100] overflow-y-auto" style={{ fontFamily: "Arial, sans-serif" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          .no-print { display: none !important; }
        }
        @page { size: A4 portrait; margin: 0; }
        * { box-sizing: border-box; }
      `}} />

      {/* Action Bar (Hidden when printing) */}
      <div className="no-print p-4 bg-gray-100 border-b border-gray-300 flex justify-between items-center fixed top-0 w-full z-[150]">
        <p className="font-bold">Print Preview Mode</p>
        <div>
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-black mr-2 bg-white font-bold">EDIT AGAIN</button>
          <button onClick={() => window.print()} className="px-4 py-2 border border-black bg-black text-white font-bold">PRINT NOW</button>
        </div>
      </div>

      <div className="max-w-[21cm] mx-auto bg-white pt-[80px]">
        
        {/* =========================================
            PART 1: SHIPPING LABEL (Top Half)
        ========================================== */}
        <div className="p-8 h-[13cm] flex flex-col justify-between border-b border-dashed border-gray-400">
          <div>
            <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-widest text-black">I LIKED</h1>
                <p className="text-sm mt-1 text-gray-700 font-bold uppercase">ORDER: #{formData.orderId}</p>
                <p className="text-sm text-gray-700 font-bold uppercase">DATE: {new Date(formData.orderDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <div className="border border-black p-3 bg-gray-50 text-center w-64">
                  <p className="text-lg font-bold uppercase">{formData.paymentMethod === 'PARTIAL_COD' || formData.paymentMethod === 'COD' ? "COLLECT CASH" : "PREPAID - DO NOT COLLECT CASH"}</p>
                  {(formData.paymentMethod === 'PARTIAL_COD' || formData.paymentMethod === 'COD') && <p className="text-xl font-black mt-1">₹{dueAmount > 0 ? dueAmount.toFixed(2) : grandTotal.toFixed(2)}</p>}
                </div>
                {formData.trackingNumber && (
                  <div className="border border-black p-2 bg-gray-100 text-center w-64">
                    <p className="text-xs font-bold uppercase text-gray-500">AWB / TRACKING ({formData.courierName})</p>
                    <p className="font-bold text-lg uppercase">{formData.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="w-1/2 pr-4 text-sm text-gray-800">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">FROM (SENDER):</p>
                <p className="font-bold uppercase">{formData.senderName}</p>
                <p className="uppercase">{formData.senderAddressLine1}</p>
                <p className="uppercase">{formData.senderAddressLine2}</p>
                <p className="uppercase">{formData.senderEmail}</p>
              </div>
              
              <div className="w-1/2 pl-4 border-l border-gray-300">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">TO (RECEIVER):</p>
                <h2 className="text-xl font-bold uppercase mb-1">{formData.receiverName || "CUSTOMER"}</h2>
                <p className="text-sm leading-relaxed text-gray-800 uppercase">
                  {formData.receiverAddressLine1}<br />
                  {formData.receiverAddressLine2}<br />
                  PHONE: <span className="font-semibold">{formData.receiverPhone}</span>
                </p>
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
              {settings?.gst_number && (
                <p className="text-xs text-gray-800 font-bold uppercase mt-1">GSTIN: {settings.gst_number}</p>
              )}
            </div>
            <div className="text-right text-sm text-gray-800">
              <p>ORDER NO: <span className="font-semibold uppercase">#{formData.orderId}</span></p>
              <p>DATE: <span className="font-semibold uppercase">{new Date(formData.orderDate).toLocaleDateString()}</span></p>
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
              {items.map((item: any, i: number) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3">
                    <p className="font-semibold text-sm text-gray-900 uppercase">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 uppercase">Size: {item.size}</p>
                  </td>
                  <td className="py-3 text-center text-sm">{item.quantity}</td>
                  <td className="py-3 text-right text-sm">₹{Number(item.price).toFixed(2)}</td>
                  <td className="py-3 text-right text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              {discountTotal > 0 && (
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-2"><p className="font-semibold text-sm text-gray-700 uppercase">Discount</p></td>
                  <td className="py-2 text-center text-sm">1</td>
                  <td className="py-2 text-right text-sm">-</td>
                  <td className="py-2 text-right text-sm font-semibold text-gray-700">-₹{discountTotal.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-auto self-end w-2/3 md:w-1/2">
            <div className="flex justify-between py-1.5 text-sm text-gray-800">
              <span>SUBTOTAL</span>
              <span className="font-semibold">₹{(subtotal - discountTotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm text-gray-800 border-b border-gray-300">
              <span>SHIPPING</span>
              <span className="font-semibold">₹{shippingTotal.toFixed(2)}</span>
            </div>
            {settings?.gst_number && (
              <>
                <div className="flex justify-between py-1.5 text-sm text-gray-800">
                  <span>BASE AMOUNT</span>
                  <span className="font-semibold">₹{(grandTotal / 1.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1.5 text-sm text-gray-800 border-b border-gray-300">
                  <span>GST (5%)</span>
                  <span className="font-semibold">₹{(grandTotal - (grandTotal / 1.05)).toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between py-3 mt-1">
              <span className="text-lg font-bold">GRAND TOTAL</span>
              <span className="text-lg font-bold">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-300 pt-4 text-center">
            <p className="text-xs text-gray-500 uppercase">Thank you for shopping with {formData.senderName}.</p>
            <p className="text-xs text-gray-500 uppercase">For support, email us at {formData.senderEmail}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
