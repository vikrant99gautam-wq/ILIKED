"use client";
import { useEffect, useState } from "react";
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
  const [message, setMessage] = useState("");

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
                <label className="block font-black mb-2 text-xl">SHIPPING COST</label>
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
                <p className="text-gray-500 mt-1 font-bold text-sm">Default shipping fee per order.</p>
              </div>

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
              <label className="block font-black text-xl mb-2">PROMO CODES (JSON)</label>
              <p className="text-gray-600 font-bold text-sm mb-4">
                Define promo codes as a JSON array. Example:<br/>
                <code>{`[{"code": "WELCOME10", "discount": 10}]`}</code> (Discount is in percentage %)
              </p>
              <textarea 
                value={settings.promo_codes || "[]"}
                onChange={e => setSettings({...settings, promo_codes: e.target.value})}
                className="w-full border-[3px] border-black p-3 font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[#FFD700]"
                rows={4}
              />
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
