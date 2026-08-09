"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { StoreSettings } from "@/lib/db";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: "",
    contact_email: "",
    currency: "USD",
    maintenance_mode: false,
    free_shipping_threshold: 2000,
    shipping_cost: 850
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coll1Ref = useRef<HTMLInputElement>(null);
  const coll2Ref = useRef<HTMLInputElement>(null);
  const coll3Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const res = await fetch("/api/settings");
    const data = await res.json();
    if (data && !data.error) {
      setSettings(data);
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage("SETTINGS SAVED SUCCESSFULLY!");
      } else {
        setMessage("ERROR SAVING SETTINGS!");
      }
    } catch (err) {
      setMessage("ERROR SAVING SETTINGS!");
    }
    setIsSaving(false);
    
    setTimeout(() => setMessage(""), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof StoreSettings, ref: React.RefObject<HTMLInputElement | null>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `settings/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setSettings({...settings, [fieldName]: data.publicUrl});
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
    }
    
    setIsUploading(false);
    if (ref.current) ref.current.value = '';
  };

  const parsedSizeChart = settings.size_chart_data ? JSON.parse(settings.size_chart_data) : [];
  
  const updateSizeChart = (index: number, field: string, value: string) => {
    const updated = [...parsedSizeChart];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, size_chart_data: JSON.stringify(updated) });
  };

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-end mb-8 border-b-[4px] border-black pb-4">
        <h1 className="font-cartoon text-5xl text-black">STORE SETTINGS</h1>
      </div>

      {isLoading ? (
        <div className="font-cartoon text-3xl animate-pulse">LOADING SETTINGS...</div>
      ) : (
        <form onSubmit={handleSave} className="bg-white border-[4px] border-black shadow-[6px_6px_0_#111] p-6 md:p-10">
          
          {message && (
            <div className={`mb-6 p-4 border-[3px] border-black font-black text-center ${message.includes('ERROR') ? 'bg-red-500 text-white' : 'bg-[#19B85A] text-black'}`}>
              {message}
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div>
              <label className="block font-black mb-2 text-xl">STORE NAME</label>
              <input 
                type="text" 
                value={settings.store_name} 
                onChange={e => setSettings({...settings, store_name: e.target.value})}
                className="w-full border-[3px] border-black p-3 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
                required
              />
              <p className="text-gray-500 mt-1 font-bold text-sm">Used in the header and emails.</p>
            </div>

            <div>
              <label className="block font-black mb-2 text-xl">CONTACT EMAIL</label>
              <input 
                type="email" 
                value={settings.contact_email} 
                onChange={e => setSettings({...settings, contact_email: e.target.value})}
                className="w-full border-[3px] border-black p-3 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
                required
              />
              <p className="text-gray-500 mt-1 font-bold text-sm">Customers will contact you here.</p>
            </div>

            <div>
              <label className="block font-black mb-2 text-xl">STORE CURRENCY</label>
              <select 
                value={settings.currency} 
                onChange={e => setSettings({...settings, currency: e.target.value})}
                className="w-full border-[3px] border-black p-3 font-bold text-lg bg-white focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block font-black mb-2 text-xl">PREPAID SHIPPING COST</label>
                <div className="flex relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-500 text-lg">₹</span>
                  <input 
                    type="number" 
                    value={settings.shipping_cost || 0} 
                    onChange={e => setSettings({...settings, shipping_cost: Number(e.target.value)})}
                    className="w-full border-[3px] border-black p-3 pl-8 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
                    required
                  />
                </div>
                <p className="text-gray-500 mt-1 font-bold text-sm">Shipping fee for prepaid orders.</p>
              </div>

              <div className="flex-1">
                <label className="block font-black mb-2 text-xl">PARTIAL COD SHIPPING COST</label>
                <div className="flex relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-500 text-lg">₹</span>
                  <input 
                    type="number" 
                    value={settings.partial_cod_shipping_cost || 0} 
                    onChange={e => setSettings({...settings, partial_cod_shipping_cost: Number(e.target.value)})}
                    className="w-full border-[3px] border-black p-3 pl-8 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
                    required
                  />
                </div>
                <p className="text-gray-500 mt-1 font-bold text-sm">Shipping fee for partial COD orders.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block font-black mb-2 text-xl">FREE SHIPPING THRESHOLD</label>
                <div className="flex relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-500 text-lg">₹</span>
                  <input 
                    type="number" 
                    value={settings.free_shipping_threshold || 0} 
                    onChange={e => setSettings({...settings, free_shipping_threshold: Number(e.target.value)})}
                    className="w-full border-[3px] border-black p-3 pl-8 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
                    required
                  />
                </div>
                <p className="text-gray-500 mt-1 font-bold text-sm">Amount needed for free shipping (0 to disable).</p>
              </div>
            </div>

            <div className="border-[3px] border-black p-4 bg-gray-50 mt-4">
              <label className="block font-black text-xl mb-4">HOMEPAGE HERO IMAGE</label>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e, 'hero_image', fileInputRef)}
                    className="hidden"
                  />
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="cartoon-btn px-6 py-3 bg-[var(--color-electric-blue)] text-white font-black whitespace-nowrap border-[3px] border-black hover:bg-black transition-colors"
                    >
                      {isUploading ? "UPLOADING..." : "UPLOAD NEW IMAGE"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({...settings, hero_image: ""})}
                      className="px-6 py-3 bg-[var(--color-coral-red)] text-white font-black whitespace-nowrap border-[3px] border-black hover:bg-black transition-colors"
                    >
                      CLEAR
                    </button>
                  </div>
                  <p className="text-gray-500 mt-2 font-bold text-sm">Upload a PNG with a transparent background for best results. Cleared image defaults to a placeholder.</p>
                </div>
                <div className="shrink-0 w-48 h-48 border-[3px] border-black bg-[#E5F1FB] bg-paper-noise flex items-center justify-center relative overflow-hidden">
                   {settings.hero_image ? (
                     <img src={settings.hero_image} alt="Hero Preview" className="w-full h-full object-contain" />
                   ) : (
                     <span className="font-black text-gray-400 text-sm">DEFAULT IMAGE</span>
                   )}
                </div>
              </div>
            </div>

            {/* Collection Images */}
            <div className="border-[3px] border-black p-4 bg-gray-50 mt-4">
              <label className="block font-black text-xl mb-4">COLLECTION IMAGES (HOMEPAGE MOODS)</label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Collection 1 */}
                <div className="flex flex-col gap-4">
                  <div className="font-bold">1. NORMAL TEES</div>
                  <div className="w-full h-48 border-[3px] border-black bg-[var(--color-coral-red)] bg-paper-noise flex items-center justify-center relative overflow-hidden">
                    {settings.collection_image_1 ? (
                      <img src={settings.collection_image_1} alt="Collection 1" className="w-full h-full object-contain" />
                    ) : (
                      <span className="font-black text-black opacity-50 text-sm">NO IMAGE</span>
                    )}
                  </div>
                  <input type="file" accept="image/*" ref={coll1Ref} onChange={(e) => handleFileUpload(e, 'collection_image_1', coll1Ref)} className="hidden" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => coll1Ref.current?.click()} disabled={isUploading} className="flex-1 cartoon-btn px-2 py-2 bg-[var(--color-electric-blue)] text-white font-black border-[3px] border-black hover:bg-black transition-colors text-xs">
                      UPLOAD
                    </button>
                    <button type="button" onClick={() => setSettings({...settings, collection_image_1: ""})} className="px-2 py-2 bg-[var(--color-coral-red)] text-white font-black border-[3px] border-black hover:bg-black transition-colors text-xs">
                      CLEAR
                    </button>
                  </div>
                </div>

                {/* Collection 2 */}
                <div className="flex flex-col gap-4">
                  <div className="font-bold">2. OVERSIZED TEES</div>
                  <div className="w-full h-48 border-[3px] border-black bg-[#FFD700] bg-paper-noise flex items-center justify-center relative overflow-hidden">
                    {settings.collection_image_2 ? (
                      <img src={settings.collection_image_2} alt="Collection 2" className="w-full h-full object-contain" />
                    ) : (
                      <span className="font-black text-black opacity-50 text-sm">NO IMAGE</span>
                    )}
                  </div>
                  <input type="file" accept="image/*" ref={coll2Ref} onChange={(e) => handleFileUpload(e, 'collection_image_2', coll2Ref)} className="hidden" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => coll2Ref.current?.click()} disabled={isUploading} className="flex-1 cartoon-btn px-2 py-2 bg-[var(--color-electric-blue)] text-white font-black border-[3px] border-black hover:bg-black transition-colors text-xs">
                      UPLOAD
                    </button>
                    <button type="button" onClick={() => setSettings({...settings, collection_image_2: ""})} className="px-2 py-2 bg-[var(--color-coral-red)] text-white font-black border-[3px] border-black hover:bg-black transition-colors text-xs">
                      CLEAR
                    </button>
                  </div>
                </div>

                {/* Collection 3 */}
                <div className="flex flex-col gap-4">
                  <div className="font-bold">3. OPTIC WASH TEES</div>
                  <div className="w-full h-48 border-[3px] border-black bg-[#246BFD] bg-paper-noise flex items-center justify-center relative overflow-hidden">
                    {settings.collection_image_3 ? (
                      <img src={settings.collection_image_3} alt="Collection 3" className="w-full h-full object-contain" />
                    ) : (
                      <span className="font-black text-black opacity-50 text-sm">NO IMAGE</span>
                    )}
                  </div>
                  <input type="file" accept="image/*" ref={coll3Ref} onChange={(e) => handleFileUpload(e, 'collection_image_3', coll3Ref)} className="hidden" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => coll3Ref.current?.click()} disabled={isUploading} className="flex-1 cartoon-btn px-2 py-2 bg-[var(--color-electric-blue)] text-white font-black border-[3px] border-black hover:bg-black transition-colors text-xs">
                      UPLOAD
                    </button>
                    <button type="button" onClick={() => setSettings({...settings, collection_image_3: ""})} className="px-2 py-2 bg-[var(--color-coral-red)] text-white font-black border-[3px] border-black hover:bg-black transition-colors text-xs">
                      CLEAR
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Size Chart Editor */}
            <div className="border-[3px] border-black p-4 bg-[#fcfaf5] mt-4 relative">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.05) 100%), url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E")' }}></div>
              <label className="block font-black text-xl mb-4 relative z-10">SIZE CHART MEASUREMENTS (INCHES)</label>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedSizeChart.map((sizeData: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-2 p-3 border-[2px] border-black bg-white shadow-[2px_2px_0_#111]">
                    <div className="font-black text-lg">SIZE: {sizeData.size}</div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500">CHEST</label>
                        <input 
                          type="text" 
                          value={sizeData.chest} 
                          onChange={(e) => updateSizeChart(idx, 'chest', e.target.value)}
                          className="w-full border-[2px] border-black p-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500">LENGTH</label>
                        <input 
                          type="text" 
                          value={sizeData.length} 
                          onChange={(e) => updateSizeChart(idx, 'length', e.target.value)}
                          className="w-full border-[2px] border-black p-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-[3px] border-black p-4 bg-[#FFD700] mt-4 flex items-center justify-between">
              <div>
                <label className="block font-black text-xl mb-1">PROMO CODES & DISCOUNTS</label>
                <p className="font-bold text-sm">
                  Discounts are now managed in a dedicated dashboard with advanced rules.
                </p>
              </div>
              <a href="/admin/discounts" className="cartoon-btn px-6 py-2 bg-black text-white font-black tracking-widest text-sm border-[3px] border-black hover:bg-white hover:text-black transition-colors">
                MANAGE
              </a>
            </div>

            <div className="border-[3px] border-black p-4 bg-gray-50 mt-4 flex items-center justify-between">
              <div>
                <label className="block font-black text-xl">MAINTENANCE MODE</label>
                <p className="text-gray-600 font-bold text-sm">Show a &quot;Coming Soon&quot; page to visitors.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.maintenance_mode} 
                  onChange={e => setSettings({...settings, maintenance_mode: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none border-[3px] border-black peer-checked:bg-[var(--color-electric-blue)] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-[3px] after:border-black after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6"></div>
              </label>
            </div>
          </div>

          <div className="mt-10 border-t-[4px] border-black pt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className={`px-10 py-4 border-[4px] border-black font-black tracking-widest text-xl shadow-[4px_4px_0_#111] transition-all
                ${isSaving ? 'bg-gray-400 text-black cursor-not-allowed' : 'bg-[#FFD700] hover:bg-black hover:text-white hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_#111]'}
              `}
            >
              {isSaving ? 'SAVING...' : 'SAVE SETTINGS'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
