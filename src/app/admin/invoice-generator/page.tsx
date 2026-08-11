"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function InvoiceGeneratorPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(true);
  
  const defaultFormData = {
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
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [items, setItems] = useState<{name: string, size: string, quantity: number, price: number}[]>([
    { name: "CUSTOM TEE", size: "L", quantity: 1, price: 999 }
  ]);
  
  const [savedInvoices, setSavedInvoices] = useState<any[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    // Load saved invoices
    const saved = localStorage.getItem('iliked_offline_invoices');
    if (saved) {
      try {
        setSavedInvoices(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved invoices");
      }
    }

    // Load draft if exists
    const draft = localStorage.getItem('iliked_invoice_draft');
    if (draft) {
      try {
        const { draftFormData, draftItems } = JSON.parse(draft);
        if (draftFormData) setFormData(draftFormData);
        if (draftItems) setItems(draftItems);
      } catch(e) {}
    } else {
      // Fetch settings if no draft
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
    }
  }, []);

  // Save draft whenever formData or items change
  useEffect(() => {
    if (isEditing) {
      localStorage.setItem('iliked_invoice_draft', JSON.stringify({ draftFormData: formData, draftItems: items }));
    }
  }, [formData, items, isEditing]);

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

  const saveInvoice = () => {
    const invoiceToSave = {
      id: Date.now().toString(),
      dateSaved: new Date().toISOString(),
      formData: { ...formData },
      items: [...items]
    };
    
    // Check if we are updating an existing one (matching orderId) or adding new
    const existingIndex = savedInvoices.findIndex(inv => inv.formData.orderId === formData.orderId);
    let updatedInvoices;
    if (existingIndex >= 0) {
      updatedInvoices = [...savedInvoices];
      updatedInvoices[existingIndex] = invoiceToSave;
    } else {
      updatedInvoices = [invoiceToSave, ...savedInvoices];
    }
    
    setSavedInvoices(updatedInvoices);
    localStorage.setItem('iliked_offline_invoices', JSON.stringify(updatedInvoices));
    alert("Invoice Saved Successfully!");
  };

  const loadInvoice = (inv: any) => {
    if (confirm("Load this invoice? Unsaved changes will be lost.")) {
      setFormData(inv.formData);
      setItems(inv.items);
    }
  };

  const deleteInvoice = (id: string) => {
    if (confirm("Delete this saved invoice?")) {
      const updated = savedInvoices.filter(inv => inv.id !== id);
      setSavedInvoices(updated);
      localStorage.setItem('iliked_offline_invoices', JSON.stringify(updated));
    }
  };
  
  const resetForm = () => {
    if (confirm("Clear all fields and start a new invoice?")) {
      setFormData({
        ...defaultFormData,
        orderId: `CUSTOM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        senderName: settings?.store_name || defaultFormData.senderName,
        senderEmail: settings?.contact_email || defaultFormData.senderEmail,
        senderAddressLine1: settings?.store_address || defaultFormData.senderAddressLine1,
      });
      setItems([{ name: "", size: "L", quantity: 1, price: 0 }]);
    }
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
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
        
        {/* Left Column: Generator Form */}
        <div className="flex-1 bg-white border-[4px] border-black p-4 md:p-8 shadow-[8px_8px_0_#000]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-4 border-black pb-4 gap-4">
            <h1 className="text-3xl font-black uppercase">CUSTOM INVOICE</h1>
            <div className="flex gap-2">
              <button type="button" onClick={resetForm} className="px-4 py-2 border-2 border-black font-bold hover:bg-red-100 uppercase text-xs md:text-sm">NEW INVOICE</button>
              <button type="button" onClick={saveInvoice} className="px-4 py-2 border-2 border-black bg-[#19B85A] text-white font-bold hover:bg-black uppercase text-xs md:text-sm">SAVE INVOICE</button>
              <Link href="/admin" className="px-4 py-2 border-2 border-black font-bold hover:bg-gray-100 uppercase text-xs md:text-sm">BACK</Link>
            </div>
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
              <button type="button" onClick={addItem} className="px-4 py-1 bg-black text-white font-bold text-sm">+ ADD ITEM</button>
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
                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 font-bold hover:bg-red-100 px-2 border border-red-500">X</button>
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

          <div className="mt-8 flex justify-end">
            <button 
              type="button"
              onClick={handleGenerate}
              className="px-8 py-4 bg-black text-white font-black text-xl tracking-widest uppercase hover:bg-[var(--color-electric-blue)] border-[4px] border-black transition-colors shadow-[4px_4px_0_#FFD700]"
            >
              GENERATE INVOICE & PRINT
            </button>
          </div>

        </div>

        {/* Right Column: Saved Invoices */}
        <div className="w-full xl:w-80 bg-white border-[4px] border-black p-4 shadow-[8px_8px_0_#000] h-fit">
          <h2 className="text-xl font-black uppercase border-b-[3px] border-black pb-2 mb-4">Saved Invoices</h2>
          
          {savedInvoices.length === 0 ? (
            <p className="text-sm font-bold text-gray-400 text-center py-8">NO SAVED INVOICES</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {savedInvoices.map((inv) => (
                <div key={inv.id} className="border-2 border-black p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-black uppercase text-sm">{inv.formData.orderId}</p>
                    <button type="button" onClick={() => deleteInvoice(inv.id)} className="text-xs text-red-500 font-bold hover:underline">DELETE</button>
                  </div>
                  <p className="text-xs font-bold text-gray-600 mb-2">{inv.formData.receiverName || 'No Name'}</p>
                  <p className="text-xs font-bold mb-3">₹{
                    ((inv.items || []).reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) 
                    - (Number(inv.formData.discountAmount) || 0) 
                    + (Number(inv.formData.shippingAmount) || 0)).toFixed(2)
                  }</p>
                  <button type="button" onClick={() => loadInvoice(inv)} className="w-full py-1 border-2 border-black bg-[#FFD700] hover:bg-black hover:text-white font-black text-xs uppercase transition-colors">
                    LOAD INVOICE
                  </button>
                </div>
              ))}
            </div>
          )}
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
          <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 border border-black mr-2 bg-white font-bold hover:bg-gray-200">EDIT AGAIN</button>
          <button type="button" onClick={() => window.print()} className="px-4 py-2 border border-black bg-black text-white font-bold hover:bg-gray-800">PRINT NOW</button>
        </div>
      </div>

      <div className="max-w-[21cm] min-h-[29.7cm] mx-auto bg-white pt-[80px] p-8 flex flex-col">
        
        {/* INVOICE HEADER */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-widest text-black mb-2 uppercase">{formData.senderName}</h1>
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">TAX INVOICE</h2>
            {settings?.gst_number && (
              <p className="text-sm text-gray-800 font-bold uppercase mt-1">GSTIN: {settings.gst_number}</p>
            )}
          </div>
          <div className="text-right text-sm text-gray-800">
            <p className="text-lg font-bold uppercase mb-1">INVOICE NO: #{formData.orderId}</p>
            <p className="font-semibold uppercase mb-2">DATE: {new Date(formData.orderDate).toLocaleDateString()}</p>
            <div className="inline-block border-2 border-black p-2 bg-gray-50 text-center mt-2">
              <p className="text-sm font-bold uppercase">{formData.paymentMethod === 'PARTIAL_COD' || formData.paymentMethod === 'COD' ? "CASH ON DELIVERY" : "PREPAID"}</p>
              <p className="text-xs text-gray-600 font-bold mt-1 uppercase">{formData.paymentStatus}</p>
            </div>
          </div>
        </div>

        {/* ADDRESS BLOCK */}
        <div className="flex justify-between mb-10">
          <div className="w-1/2 pr-4 text-sm text-gray-800">
            <p className="text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">ISSUED BY:</p>
            <p className="font-bold uppercase text-lg">{formData.senderName}</p>
            <p className="uppercase mt-1">{formData.senderAddressLine1}</p>
            <p className="uppercase">{formData.senderAddressLine2}</p>
            <p className="uppercase font-semibold mt-2">{formData.senderEmail}</p>
          </div>
          
          <div className="w-1/2 pl-6 border-l-2 border-gray-200">
            <p className="text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">BILLED TO:</p>
            <h2 className="text-xl font-bold uppercase mb-2">{formData.receiverName || "CUSTOMER"}</h2>
            <p className="text-sm leading-relaxed text-gray-800 uppercase">
              {formData.receiverAddressLine1}<br />
              {formData.receiverAddressLine2}
            </p>
            {formData.receiverPhone && (
              <p className="mt-2 text-sm uppercase">PHONE: <span className="font-bold">{formData.receiverPhone}</span></p>
            )}
          </div>
        </div>

        {/* ITEMS TABLE */}
        <table className="w-full text-left border-collapse mb-8 flex-1">
          <thead>
            <tr className="border-b-2 border-black text-black">
              <th className="py-3 text-sm font-black uppercase tracking-wider">ITEM DESCRIPTION</th>
              <th className="py-3 text-sm font-black uppercase text-center w-20 tracking-wider">QTY</th>
              <th className="py-3 text-sm font-black uppercase text-right w-32 tracking-wider">PRICE</th>
              <th className="py-3 text-sm font-black uppercase text-right w-32 tracking-wider">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, i: number) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="py-4">
                  <p className="font-bold text-base text-black uppercase">{item.name}</p>
                  {item.size && <p className="text-sm text-gray-500 mt-1 uppercase font-semibold">SIZE: {item.size}</p>}
                </td>
                <td className="py-4 text-center text-base font-semibold">{item.quantity}</td>
                <td className="py-4 text-right text-base font-semibold">₹{Number(item.price).toFixed(2)}</td>
                <td className="py-4 text-right text-base font-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
            {discountTotal > 0 && (
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-3"><p className="font-bold text-sm text-red-600 uppercase">DISCOUNT APPLIED</p></td>
                <td className="py-3 text-center text-sm font-semibold">1</td>
                <td className="py-3 text-right text-sm font-semibold">-</td>
                <td className="py-3 text-right text-sm font-bold text-red-600">-₹{discountTotal.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="flex justify-end mt-auto pt-8 border-t-2 border-black">
          <div className="w-1/2">
            <div className="flex justify-between py-2 text-base text-gray-800">
              <span className="font-semibold uppercase tracking-wider">SUBTOTAL</span>
              <span className="font-bold">₹{(subtotal - discountTotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-base text-gray-800 border-b-2 border-gray-200">
              <span className="font-semibold uppercase tracking-wider">SHIPPING</span>
              <span className="font-bold">₹{shippingTotal.toFixed(2)}</span>
            </div>
            {settings?.gst_number && (
              <>
                <div className="flex justify-between py-2 text-base text-gray-600">
                  <span className="font-semibold uppercase tracking-wider">BASE AMOUNT</span>
                  <span className="font-bold">₹{(grandTotal / 1.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-base text-gray-600 border-b-2 border-gray-200">
                  <span className="font-semibold uppercase tracking-wider">GST (5%)</span>
                  <span className="font-bold">₹{(grandTotal - (grandTotal / 1.05)).toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between py-4 mt-2 bg-gray-50 px-4 border-2 border-black">
              <span className="text-2xl font-black uppercase tracking-wider">GRAND TOTAL</span>
              <span className="text-2xl font-black">₹{grandTotal.toFixed(2)}</span>
            </div>
            {(formData.paymentMethod === 'PARTIAL_COD' || formData.paymentMethod === 'COD') && dueAmount > 0 && (
              <div className="flex justify-between py-2 mt-2 px-4 text-red-600">
                <span className="text-lg font-bold uppercase tracking-wider">AMOUNT DUE</span>
                <span className="text-lg font-black">₹{dueAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* FOOTER */}
        <div className="mt-12 pt-6 border-t-2 border-dashed border-gray-300 text-center">
          <p className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-1">THANK YOU FOR YOUR BUSINESS</p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">FOR SUPPORT, PLEASE CONTACT {formData.senderEmail}</p>
        </div>

      </div>
    </div>
  );
}
