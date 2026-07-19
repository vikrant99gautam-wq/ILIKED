"use client";
import { useEffect, useState, useRef } from "react";
import { Product } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [sizeInventory, setSizeInventory] = useState<{size: string, stock: number}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Calculate total stock from sizeInventory
    const totalStock = sizeInventory.reduce((acc, curr) => acc + curr.stock, 0);
    const newSizes = sizeInventory.map(s => `${s.size}:${s.stock}`);

    if (currentProduct.id) {
      // Update
      await fetch(`/api/products/${currentProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentProduct,
          stock: totalStock,
          sizes: newSizes
        }),
      });
    } else {
      // Create
      await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentProduct,
          stock: totalStock,
          sizes: newSizes
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    let uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        alert("Error uploading image: " + uploadError.message);
        continue;
      }

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    const existingImages = currentProduct.image ? currentProduct.image.split(',').map(s=>s.trim()).filter(Boolean) : [];
    const newImages = [...existingImages, ...uploadedUrls].join(', ');
    
    setCurrentProduct({...currentProduct, image: newImages});
    setIsUploading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8 border-b-[4px] border-black pb-4">
        <h1 className="font-cartoon text-5xl">MANAGE PRODUCTS</h1>
        <button 
          onClick={() => { 
            setCurrentProduct({}); 
            setSizeInventory([{size: "S", stock: 1}, {size: "M", stock: 1}, {size: "L", stock: 1}]);
            setIsEditing(true); 
          }}
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
                <th className="p-4">COLOR</th>
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
                  <td className="p-4 font-bold text-sm text-gray-600 uppercase">{p.color || '-'}</td>
                  <td className="p-4 font-cartoon text-xl">₹{p.price}</td>
                  <td className="p-4">
                    <span className={`font-black px-2 py-1 border-[2px] border-black ${p.stock <= 3 ? 'bg-[var(--color-coral-red)] text-white' : 'bg-[#19B85A] text-black'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => { 
                      setCurrentProduct(p); 
                      // Parse existing sizes "S:5" to {size: "S", stock: 5}
                      const parsed = (p.sizes || []).map((s: string) => {
                        const parts = s.split(':');
                        return parts.length === 2 ? { size: parts[0], stock: parseInt(parts[1]) } : { size: s, stock: 1 };
                      });
                      setSizeInventory(parsed);
                      setIsEditing(true); 
                    }} className="px-4 py-2 border-[2px] border-black bg-[#FFD700] hover:bg-black hover:text-white font-black text-sm">EDIT</button>
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
                    <span className="font-bold text-sm text-gray-500 uppercase">{p.color || '-'}</span>
                    <span className="font-cartoon text-2xl">₹{p.price}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`font-black px-3 py-1 border-[2px] border-black ${p.stock <= 3 ? 'bg-[var(--color-coral-red)] text-white' : 'bg-[#19B85A] text-black'}`}>
                    STOCK: {p.stock}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => { 
                      setCurrentProduct(p); 
                      const parsed = (p.sizes || []).map((s: string) => {
                        const parts = s.split(':');
                        return parts.length === 2 ? { size: parts[0], stock: parseInt(parts[1]) } : { size: s, stock: 1 };
                      });
                      setSizeInventory(parsed);
                      setIsEditing(true); 
                    }} className="px-4 py-2 border-[2px] border-black bg-[#FFD700] font-black text-sm">EDIT</button>
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
              <div>
                <label className="block font-black mb-1">CATEGORY</label>
                <select 
                  value={currentProduct.category || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                  className="w-full border-[3px] border-black p-2 font-bold uppercase"
                >
                  <option value="" disabled>Select Category</option>
                  <option value="NORMAL TEES">NORMAL TEES</option>
                  <option value="OVERSIZED TEES">OVERSIZED TEES</option>
                  <option value="OPTIC WASH TEES">OPTIC WASH TEES</option>
                </select>
              </div>
              <div>
                <label className="block font-black mb-1">COLOR</label>
                <select 
                  value={currentProduct.color || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, color: e.target.value})}
                  className="w-full border-[3px] border-black p-2 font-bold uppercase"
                >
                  <option value="" disabled>Select Color</option>
                  <option value="BLACK">BLACK</option>
                  <option value="WHITE">WHITE</option>
                  <option value="RED">RED</option>
                  <option value="BLUE">BLUE</option>
                  <option value="YELLOW">YELLOW</option>
                </select>
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
                  <label className="block font-black mb-1">TOTAL STOCK (Auto-calculated)</label>
                  <input 
                    type="number" 
                    value={sizeInventory.reduce((acc, curr) => acc + curr.stock, 0)} 
                    disabled
                    className="w-full border-[3px] border-black p-2 font-bold bg-gray-200 cursor-not-allowed text-gray-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-black mb-1 flex items-center justify-between">
                  <span>SIZE & INVENTORY MANAGER</span>
                  <button 
                    onClick={() => setSizeInventory([...sizeInventory, {size: "NEW", stock: 0}])}
                    className="px-2 py-1 bg-black text-white text-xs border-[2px] border-black hover:bg-[var(--color-electric-blue)]"
                  >
                    + ADD SIZE
                  </button>
                </label>
                <div className="flex flex-col gap-2 p-4 border-[3px] border-black bg-gray-50">
                  {sizeInventory.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        value={item.size}
                        onChange={(e) => {
                          const newInv = [...sizeInventory];
                          newInv[idx].size = e.target.value.toUpperCase();
                          setSizeInventory(newInv);
                        }}
                        className="w-24 border-[2px] border-black p-1 font-bold text-center uppercase"
                        placeholder="S, M, L..."
                      />
                      <span className="font-black">QTY:</span>
                      <input 
                        type="number" 
                        value={item.stock}
                        onChange={(e) => {
                          const newInv = [...sizeInventory];
                          newInv[idx].stock = Number(e.target.value);
                          setSizeInventory(newInv);
                        }}
                        className="w-20 border-[2px] border-black p-1 font-bold text-center"
                      />
                      <button 
                        onClick={() => setSizeInventory(sizeInventory.filter((_, i) => i !== idx))}
                        className="ml-auto px-2 py-1 bg-[var(--color-coral-red)] text-white font-black text-xs border-[2px] border-black hover:bg-black"
                      >
                        REMOVE
                      </button>
                    </div>
                  ))}
                  {sizeInventory.length === 0 && (
                    <div className="text-gray-500 font-bold italic">No sizes added. Click + ADD SIZE to start.</div>
                  )}
                </div>
              </div>
              <div>
                <label className="block font-black mb-1">IMAGES (Add multiple)</label>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="cartoon-btn px-4 py-2 bg-[var(--color-electric-blue)] text-white font-black whitespace-nowrap"
                  >
                    {isUploading ? "UPLOADING..." : "UPLOAD FILE"}
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="font-black text-gray-500 mx-2">OR</span>
                  <input 
                    type="text" 
                    value={currentProduct.image || ''} 
                    onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})}
                    placeholder="Paste URLs separated by comma..."
                    className="w-full border-[3px] border-black p-2 font-bold flex-1"
                  />
                </div>
                {currentProduct.image && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {currentProduct.image.split(',').map((imgUrl, idx) => (
                      <div key={idx} className="relative">
                        <img src={imgUrl.trim()} alt={`Preview ${idx + 1}`} className="w-32 h-32 object-contain border-[3px] border-black bg-gray-100" />
                        <button 
                          onClick={() => {
                            const newImages = currentProduct.image!.split(',').map(s=>s.trim()).filter((_, i) => i !== idx).join(', ');
                            setCurrentProduct({...currentProduct, image: newImages});
                          }}
                          className="absolute -top-2 -right-2 bg-[var(--color-coral-red)] text-white font-black w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-xs"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
