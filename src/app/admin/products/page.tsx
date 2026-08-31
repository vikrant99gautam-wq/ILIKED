"use client";
import { useEffect, useState, useRef } from "react";
import { Product, parseProductTag, stringifyProductTag, ProductTagData } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [sizeInventory, setSizeInventory] = useState<{size: string, stock: number}[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeUploadIndex, setActiveUploadIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Tag Data State (for pre-order, labels, etc.)
  const [tagData, setTagData] = useState<ProductTagData>({});

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

    const isExisting = products.some(p => p.id === currentProduct.id);

    if (isExisting) {
      // Update
      await fetch(`/api/products/${currentProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentProduct,
          stock: totalStock,
          sizes: newSizes,
          tag: stringifyProductTag(tagData)
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
          sizes: newSizes,
          tag: stringifyProductTag(tagData)
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
    if (!files || files.length === 0 || activeUploadIndex === null) return;

    setIsUploading(true);
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      alert("Error uploading image: " + uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    // Update specific slot
    const currentImgs = currentProduct.image ? currentProduct.image.split(',').map(s=>s.trim()) : [];
    const paddedImages = Array.from({length: 6}, (_, i) => currentImgs[i] || "");
    paddedImages[activeUploadIndex] = data.publicUrl;
    
    setCurrentProduct({...currentProduct, image: paddedImages.join(',')});
    setIsUploading(false);
    setActiveUploadIndex(null);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
        <div className="flex justify-between items-end mb-8 border-b-[4px] border-black pb-4">
          <h1 className="font-cartoon text-5xl tracking-widest">PRODUCTS</h1>
          <button onClick={() => { 
            setCurrentProduct({ id: Date.now().toString() }); 
            setSizeInventory([]); 
            setTagData({}); 
            setIsEditing(true); 
          }} className="cartoon-btn px-6 py-2 bg-black text-white font-black tracking-widest hover:bg-[#FFD700] hover:text-black transition-colors">
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
                <th className="p-4">PRODUCT INFO</th>
                <th className="p-4">CATEGORY</th>
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
                    <img src={p.image?.split(',')[0]?.trim() || ''} className="w-16 h-16 object-contain bg-gray-100 border-[2px] border-black" alt={p.name} />
                  </td>
                  <td className="p-4 font-bold text-lg">
                    <div className="flex flex-col">
                      <span>{p.name}</span>
                      <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">ID: {p.id}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-sm text-gray-600 uppercase">{p.category || '-'}</td>
                  <td className="p-4 font-bold text-sm text-gray-600 uppercase">{p.color || '-'}</td>
                  <td className="p-4 font-cartoon text-xl">₹{p.price}</td>
                  <td className="p-4">
                    <span className={`font-black px-2 py-1 border-[2px] border-black ${p.stock <= 3 ? 'bg-[var(--color-coral-red)] text-white' : 'bg-[#19B85A] text-black'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => { 
                        setCurrentProduct(p); 
                        // Parse existing sizes "S:5" to {size: "S", stock: 5}
                        const parsed = (p.sizes || []).map((s: string) => {
                          const parts = s.split(':');
                          return parts.length === 2 ? { size: parts[0], stock: parseInt(parts[1]) } : { size: s, stock: 1 };
                        });
                        setSizeInventory(parsed);
                        setTagData(parseProductTag(p.tag));
                        setIsEditing(true); 
                      }} className="px-4 py-2 border-[2px] border-black bg-[#FFD700] hover:bg-black hover:text-white font-black text-sm">EDIT</button>
                      <button onClick={() => handleDelete(p.id)} className="px-4 py-2 border-[2px] border-black bg-[var(--color-coral-red)] text-white hover:bg-black font-black text-sm">DEL</button>
                    </div>
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
                  <img src={p.image?.split(',')[0]?.trim() || ''} className="w-20 h-20 object-contain bg-gray-100 border-[2px] border-black shrink-0" alt={p.name} />
                  <div className="flex flex-col">
                    <span className="font-bold text-lg leading-tight">{p.name}</span>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">ID: {p.id}</span>
                    <span className="font-bold text-sm text-gray-500 uppercase mt-1">{p.color || '-'}</span>
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
                      setTagData(parseProductTag(p.tag));
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
            <h2 className="font-cartoon text-3xl md:text-4xl mb-6">{currentProduct.id && !currentProduct.id.match(/^\d+$/) ? 'EDIT PRODUCT' : 'PRODUCT DETAILS'}</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block font-black mb-1">PRODUCT ID (Auto-Generated)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={currentProduct.id || ''} 
                    readOnly
                    className="w-full border-[3px] border-black p-2 font-bold bg-gray-100 text-gray-600 font-mono text-sm"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(currentProduct.id || '');
                      alert("Product ID Copied!");
                    }}
                    className="px-4 border-[3px] border-black bg-[var(--color-electric-blue)] text-white font-black whitespace-nowrap hover:bg-black"
                    type="button"
                  >
                    COPY
                  </button>
                </div>
              </div>

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
                <div className="flex flex-col gap-2 p-2 border-[3px] border-black bg-white">
                  {["NORMAL TEES", "OVERSIZED TEES", "OPTIC WASH TEES"].map(cat => {
                    const currentCats = currentProduct.category ? currentProduct.category.split(',').map(c => c.trim()) : [];
                    const isChecked = currentCats.includes(cat);
                    return (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer font-bold uppercase">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => {
                            let newCats = [...currentCats];
                            if (e.target.checked) {
                              newCats.push(cat);
                            } else {
                              newCats = newCats.filter(c => c !== cat);
                            }
                            setCurrentProduct({...currentProduct, category: newCats.join(', ')});
                          }}
                          className="w-5 h-5 border-[2px] border-black accent-black"
                        />
                        {cat}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block font-black mb-1">COLOR</label>
                <div className="flex flex-col gap-2 p-2 border-[3px] border-black bg-white">
                  {["BLACK", "WHITE", "RED", "BLUE", "YELLOW"].map(color => {
                    const currentColors = currentProduct.color ? currentProduct.color.split(',').map(c => c.trim()) : [];
                    const isChecked = currentColors.includes(color);
                    return (
                      <label key={color} className="flex items-center gap-2 cursor-pointer font-bold uppercase">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => {
                            let newColors = [...currentColors];
                            if (e.target.checked) {
                              newColors.push(color);
                            } else {
                              newColors = newColors.filter(c => c !== color);
                            }
                            setCurrentProduct({...currentProduct, color: newColors.join(', ')});
                          }}
                          className="w-5 h-5 border-[2px] border-black accent-black"
                        />
                        {color}
                      </label>
                    );
                  })}
                </div>
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
                <label className="block font-black mb-2">PRODUCT IMAGES (Up to 6 slots)</label>
                
                {/* Hidden file input for single file */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({length: 6}).map((_, idx) => {
                    const currentImgs = currentProduct.image ? currentProduct.image.split(',').map(s=>s.trim()) : [];
                    const imgUrl = currentImgs[idx] || "";
                    
                    return (
                      <div key={idx} className="border-[3px] border-black bg-gray-50 p-2 flex flex-col gap-2 relative">
                        <div className="font-black text-xs text-gray-500 absolute top-1 left-2">IMAGE {idx + 1}</div>
                        
                        {imgUrl ? (
                          <div className="relative mt-4 flex justify-center">
                            <img src={imgUrl} alt={`Slot ${idx + 1}`} className="w-24 h-24 object-contain bg-white border-[2px] border-black" />
                            <button 
                              onClick={() => {
                                const newImgs = [...currentImgs];
                                while(newImgs.length < 6) newImgs.push("");
                                newImgs[idx] = "";
                                setCurrentProduct({...currentProduct, image: newImgs.join(',')});
                              }}
                              className="absolute -top-2 -right-2 bg-[var(--color-coral-red)] text-white font-black w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-xs"
                              title="Remove Image"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <div className="mt-4 flex flex-col gap-2 items-center justify-center h-24 border-[2px] border-dashed border-gray-400 p-2">
                             <button
                               onClick={() => {
                                 setActiveUploadIndex(idx);
                                 fileInputRef.current?.click();
                               }}
                               disabled={isUploading}
                               className="w-full px-2 py-1 bg-[var(--color-electric-blue)] text-white font-black text-[10px] border-[2px] border-black whitespace-nowrap"
                             >
                               {isUploading && activeUploadIndex === idx ? "UPLOADING..." : "+ UPLOAD"}
                             </button>
                             <input 
                               type="text"
                               placeholder="Or Paste URL..."
                               className="w-full px-1 py-1 text-[10px] border-[2px] border-black"
                               onBlur={(e) => {
                                  if(!e.target.value) return;
                                  const newImgs = [...currentImgs];
                                  while(newImgs.length < 6) newImgs.push("");
                                  newImgs[idx] = e.target.value;
                                  setCurrentProduct({...currentProduct, image: newImgs.join(',')});
                                  e.target.value = "";
                               }}
                             />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="border-[3px] border-black p-4 bg-[#F4F4F0] mt-4">
                <h3 className="font-black text-xl mb-4 border-b-[2px] border-black pb-2">PRE-ORDER & TAG SETTINGS</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block font-black mb-1">PRODUCT LABEL / BADGE</label>
                    <input 
                      type="text" 
                      placeholder="e.g. NEW, BESTSELLER, SELLING FAST"
                      value={tagData.label || ''} 
                      onChange={e => setTagData({...tagData, label: e.target.value})}
                      className="w-full border-[3px] border-black p-2 font-bold"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="checkbox" 
                      id="isPreorder"
                      checked={tagData.isPreorder || false} 
                      onChange={e => setTagData({...tagData, isPreorder: e.target.checked})}
                      className="w-5 h-5 border-[3px] border-black"
                    />
                    <label htmlFor="isPreorder" className="font-black text-lg">ENABLE PRE-ORDER MODE</label>
                  </div>
                  
                  {tagData.isPreorder && (
                    <div>
                      <label className="block font-black mb-1 text-[var(--color-coral-red)]">PRE-ORDER DISPATCH MESSAGE</label>
                      <select 
                        value={tagData.preorderMessage || ''} 
                        onChange={e => setTagData({...tagData, preorderMessage: e.target.value})}
                        className="w-full border-[3px] border-black p-2 font-bold uppercase"
                      >
                        <option value="" disabled>Select Dispatch Message</option>
                        <option value="SHIPS IN 7-10 DAYS">SHIPS IN 7-10 DAYS</option>
                        <option value="SHIPS IN 2 WEEKS">SHIPS IN 2 WEEKS</option>
                        <option value="SHIPS IN 3 WEEKS">SHIPS IN 3 WEEKS</option>
                        <option value="SHIPS IN 4 WEEKS">SHIPS IN 4 WEEKS</option>
                        <option value="SHIPS NEXT MONTH">SHIPS NEXT MONTH</option>
                      </select>
                    </div>
                  )}
                </div>
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
