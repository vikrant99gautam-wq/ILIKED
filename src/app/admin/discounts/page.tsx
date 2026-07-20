"use client";
import { useEffect, useState } from "react";

export interface AdvancedPromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  maxUses: number | null;
  currentUses: number;
  minOrderValue: number | null;
  restrictedToEmail: string | null;
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<AdvancedPromoCode[]>([]);
  const [settingsData, setSettingsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AdvancedPromoCode>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const res = await fetch("/api/settings");
    const data = await res.json();
    if (data && !data.error) {
      setSettingsData(data);
      try {
        const parsed = JSON.parse(data.promo_codes || "[]");
        // Migrate legacy formats if needed
        const migrated = parsed.map((p: any) => ({
          id: p.id || Date.now().toString() + Math.random().toString(36).substr(2, 5),
          code: p.code,
          type: p.type || 'percentage',
          value: p.value !== undefined ? p.value : (p.discount || 0),
          active: p.active !== undefined ? p.active : true,
          maxUses: p.maxUses || null,
          currentUses: p.currentUses || 0,
          minOrderValue: p.minOrderValue || null,
          restrictedToEmail: p.restrictedToEmail || null
        }));
        setDiscounts(migrated);
      } catch (e) {
        setDiscounts([]);
      }
    }
    setIsLoading(false);
  };

  const handleSaveAll = async (newDiscounts: AdvancedPromoCode[]) => {
    if (!settingsData) return;
    setIsSaving(true);
    try {
      const updatedSettings = {
        ...settingsData,
        promo_codes: JSON.stringify(newDiscounts)
      };
      
      const res = await fetch(`/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: "Discounts saved successfully!" });
        setDiscounts(newDiscounts);
        setSettingsData(updatedSettings);
        setEditingId(null);
      } else {
        setMessage({ type: 'error', text: "Failed to save." });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "An error occurred." });
    }
    setIsSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const openNewForm = () => {
    setFormData({
      id: Date.now().toString(),
      code: "",
      type: 'percentage',
      value: 0,
      active: true,
      maxUses: null,
      currentUses: 0,
      minOrderValue: null,
      restrictedToEmail: null
    });
    setEditingId("NEW");
  };

  const openEditForm = (d: AdvancedPromoCode) => {
    setFormData({ ...d });
    setEditingId(d.id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this discount code?")) {
      const updated = discounts.filter(d => d.id !== id);
      handleSaveAll(updated);
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      alert("Code and Value are required!");
      return;
    }

    let updated: AdvancedPromoCode[];
    const payload = formData as AdvancedPromoCode;
    // ensure code is uppercase
    payload.code = payload.code.toUpperCase().replace(/\s+/g, '');

    if (editingId === "NEW") {
      updated = [...discounts, payload];
    } else {
      updated = discounts.map(d => d.id === payload.id ? payload : d);
    }
    handleSaveAll(updated);
  };

  if (isLoading) {
    return <div className="p-8 font-cartoon text-3xl">LOADING DISCOUNTS...</div>;
  }

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-end mb-8 border-b-[4px] border-black pb-4">
        <h1 className="font-cartoon text-5xl tracking-widest">DISCOUNTS</h1>
        {!editingId && (
          <button 
            onClick={openNewForm}
            className="cartoon-btn px-6 py-2 bg-[var(--color-electric-blue)] text-white font-black tracking-widest border-[3px] border-black shadow-[4px_4px_0_#111] hover:bg-black transition-colors"
          >
            + NEW CODE
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-6 p-4 border-[3px] border-black font-black uppercase tracking-widest shadow-[4px_4px_0_#111] ${message.type === 'success' ? 'bg-[#19B85A] text-white' : 'bg-[var(--color-coral-red)] text-white'}`}>
          {message.text}
        </div>
      )}

      {editingId ? (
        <div className="bg-white border-[4px] border-black shadow-[8px_8px_0_#111] p-6 md:p-8">
          <h2 className="font-cartoon text-3xl mb-6 border-b-[3px] border-dashed border-black pb-4">
            {editingId === "NEW" ? "CREATE NEW CODE" : `EDIT CODE: ${formData.code}`}
          </h2>
          
          <form onSubmit={submitForm} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block font-black mb-2 text-xl">CODE</label>
                <input 
                  type="text" 
                  value={formData.code || ""} 
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
                  placeholder="e.g. SUMMER20"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-black mb-2 text-xl">STATUS</label>
                <div className="flex items-center gap-4 mt-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.active || false} 
                      onChange={e => setFormData({...formData, active: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none border-[3px] border-black peer-checked:bg-[#19B85A] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-[3px] after:border-black after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6"></div>
                  </label>
                  <span className="font-black tracking-widest">{formData.active ? "ACTIVE" : "INACTIVE"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 p-4 bg-gray-50 border-[3px] border-black">
              <div className="flex-1">
                <label className="block font-black mb-2 text-xl">DISCOUNT TYPE</label>
                <select 
                  value={formData.type || "percentage"}
                  onChange={e => setFormData({...formData, type: e.target.value as 'percentage'|'fixed'})}
                  className="w-full border-[3px] border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-[#FFD700] appearance-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-black mb-2 text-xl">DISCOUNT VALUE</label>
                <input 
                  type="number" 
                  value={formData.value || ""} 
                  onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                  className="w-full border-[3px] border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
                  placeholder={formData.type === 'fixed' ? "e.g. 500" : "e.g. 20"}
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-black mb-2 text-xl">USAGE LIMIT</label>
                <input 
                  type="number" 
                  value={formData.maxUses || ""} 
                  onChange={e => setFormData({...formData, maxUses: e.target.value ? Number(e.target.value) : null})}
                  className="w-full border-[3px] border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
                <p className="text-gray-500 font-bold text-sm mt-1">Current uses: {formData.currentUses || 0}</p>
              </div>
              <div>
                <label className="block font-black mb-2 text-xl">MIN ORDER VALUE (₹)</label>
                <input 
                  type="number" 
                  value={formData.minOrderValue || ""} 
                  onChange={e => setFormData({...formData, minOrderValue: e.target.value ? Number(e.target.value) : null})}
                  className="w-full border-[3px] border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
                  placeholder="Leave empty for no minimum"
                  min="1"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-black mb-2 text-xl">RESTRICT TO EMAIL (OPTIONAL)</label>
                <input 
                  type="email" 
                  value={formData.restrictedToEmail || ""} 
                  onChange={e => setFormData({...formData, restrictedToEmail: e.target.value || null})}
                  className="w-full border-[3px] border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
                  placeholder="user@example.com"
                />
                <p className="text-gray-500 font-bold text-sm mt-1">Only this specific email address can use this code.</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t-[3px] border-dashed border-black">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex-1 cartoon-btn py-3 bg-[#FFD700] text-black font-black tracking-widest text-xl border-[3px] border-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0_#111] disabled:opacity-50"
              >
                {isSaving ? "SAVING..." : "SAVE CODE"}
              </button>
              <button 
                type="button" 
                onClick={() => setEditingId(null)}
                className="flex-1 cartoon-btn py-3 bg-gray-200 text-black font-black tracking-widest text-xl border-[3px] border-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0_#111]"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {discounts.length === 0 ? (
            <div className="p-12 border-[4px] border-dashed border-black bg-white flex flex-col items-center justify-center">
              <span className="font-cartoon text-4xl mb-2 text-center">NO PROMO CODES YET</span>
              <p className="font-black text-gray-500 uppercase text-center">Create one to boost your sales!</p>
            </div>
          ) : (
            discounts.map(d => (
              <div key={d.id} className={`flex flex-col md:flex-row items-center justify-between p-4 md:p-6 border-[3px] border-black shadow-[4px_4px_0_#111] ${d.active ? 'bg-white' : 'bg-gray-100 opacity-70'}`}>
                <div className="w-full md:w-auto mb-4 md:mb-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-cartoon text-3xl">{d.code}</h3>
                    {d.active ? (
                      <span className="px-2 py-0.5 bg-[#19B85A] text-white font-black text-xs tracking-widest border-2 border-black">ACTIVE</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-400 text-white font-black text-xs tracking-widest border-2 border-black">INACTIVE</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 font-bold text-sm text-gray-600 uppercase">
                    <span>{d.type === 'percentage' ? `${d.value}% OFF` : `₹${d.value} OFF`}</span>
                    <span>USES: {d.currentUses} {d.maxUses ? `/ ${d.maxUses}` : '(UNLIMITED)'}</span>
                    {d.minOrderValue && <span>MIN: ₹{d.minOrderValue}</span>}
                    {d.restrictedToEmail && <span>ONLY: {d.restrictedToEmail}</span>}
                  </div>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => openEditForm(d)}
                    className="flex-1 md:flex-none px-4 py-2 bg-white border-[3px] border-black font-black uppercase text-sm hover:bg-black hover:text-white transition-colors"
                  >
                    EDIT
                  </button>
                  <button 
                    onClick={() => handleDelete(d.id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-[var(--color-coral-red)] text-white border-[3px] border-black font-black uppercase text-sm hover:bg-black transition-colors"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
