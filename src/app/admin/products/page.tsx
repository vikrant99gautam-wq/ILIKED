"use client";
import { useEffect, useState } from "react";
import { Product } from "@/lib/db";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (currentProduct.id) {
      // Update
      await fetch(`/api/products/${currentProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProduct),
      });
    } else {
      // Create (Mock default fields for simplicity if missing)
      await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentProduct,
          sizes: currentProduct.sizes || ["M", "L"],
        }),
      });
    }
    setIsEditing(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8 border-b-[4px] border-black pb-4">
        <h1 className="font-cartoon text-5xl">MANAGE PRODUCTS</h1>
        <button 
          onClick={() => { setCurrentProduct({}); setIsEditing(true); }}
          className="cartoon-btn px-6 py-2 bg-black text-white font-black tracking-widest"
        >
          + ADD NEW
        </button>
      </div>

      {isLoading ? (
        <div className="font-cartoon text-3xl animate-pulse">LOADING STUFF...</div>
      ) : (
        <div className="bg-white border-[4px] border-black shadow-[6px_6px_0_#111] overflow-hidden">
          
          {/* Desktop Table */}
          <table className="hidden md:table w-full text-left">
            <thead className="bg-black text-white font-black tracking-widest">
              <tr>
                <th className="p-4">IMAGE</th>
                <th className="p-4">NAME</th>
                <th className="p-4">PRICE</th>
                <th className="p-4">STOCK</th>
                <th className="p-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b-[2px] border-black/10 last:border-0 hover:bg-gray-50">
                  <td className="p-4">
                    <img src={p.image} className="w-16 h-16 object-contain bg-gray-100 border-[2px] border-black" alt={p.name} />
                  </td>
                  <td className="p-4 font-bold">{p.name}</td>
                  <td className="p-4 font-cartoon text-xl">₹{p.price}</td>
                  <td className="p-4">
                    <span className={`font-black px-2 py-1 border-[2px] border-black ${p.stock <= 3 ? 'bg-[var(--color-coral-red)] text-white' : 'bg-[#19B85A] text-black'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => { setCurrentProduct(p); setIsEditing(true); }} className="px-4 py-2 border-[2px] border-black bg-[#FFD700] hover:bg-black hover:text-white font-black text-sm">EDIT</button>
                    <button onClick={() => handleDelete(p.id)} className="px-4 py-2 border-[2px] border-black bg-[var(--color-coral-red)] text-white hover:bg-black font-black text-sm">DEL</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col">
            {products.map(p => (
              <div key={p.id} className="border-b-[4px] border-black last:border-0 p-4 flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <img src={p.image} className="w-20 h-20 object-contain bg-gray-100 border-[2px] border-black shrink-0" alt={p.name} />
                  <div className="flex flex-col">
                    <span className="font-bold text-lg leading-tight">{p.name}</span>
                    <span className="font-cartoon text-2xl">₹{p.price}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`font-black px-3 py-1 border-[2px] border-black ${p.stock <= 3 ? 'bg-[var(--color-coral-red)] text-white' : 'bg-[#19B85A] text-black'}`}>
                    STOCK: {p.stock}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => { setCurrentProduct(p); setIsEditing(true); }} className="px-4 py-2 border-[2px] border-black bg-[#FFD700] font-black text-sm">EDIT</button>
                    <button onClick={() => handleDelete(p.id)} className="px-4 py-2 border-[2px] border-black bg-[var(--color-coral-red)] text-white font-black text-sm">DEL</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full max-w-2xl border-t-[4px] md:border-[4px] border-black p-6 md:p-8 shadow-[0_-10px_0_#111] md:shadow-[10px_10px_0_#111] max-h-[90vh] overflow-y-auto">
            <h2 className="font-cartoon text-3xl md:text-4xl mb-6">{currentProduct.id ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-black mb-1">NAME</label>
                <input 
                  type="text" 
                  value={currentProduct.name || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className="w-full border-[3px] border-black p-2 font-bold"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block font-black mb-1">PRICE (₹)</label>
                  <input 
                    type="number" 
                    value={currentProduct.price || 0} 
                    onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                    className="w-full border-[3px] border-black p-2 font-bold"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-black mb-1">STOCK</label>
                  <input 
                    type="number" 
                    value={currentProduct.stock || 0} 
                    onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})}
                    className="w-full border-[3px] border-black p-2 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-black mb-1">IMAGE URL</label>
                <input 
                  type="text" 
                  value={currentProduct.image || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})}
                  className="w-full border-[3px] border-black p-2 font-bold"
                />
              </div>
              <div>
                <label className="block font-black mb-1">DESCRIPTION</label>
                <textarea 
                  value={currentProduct.description || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                  className="w-full border-[3px] border-black p-2 font-bold min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-end gap-4 mt-8">
              <button onClick={() => setIsEditing(false)} className="w-full md:w-auto px-6 py-3 md:py-2 border-[3px] border-black font-black hover:bg-gray-100">CANCEL</button>
              <button onClick={handleSave} className="w-full md:w-auto px-6 py-3 md:py-2 border-[3px] border-black bg-black text-white font-black hover:bg-[var(--color-electric-blue)]">SAVE IT</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
