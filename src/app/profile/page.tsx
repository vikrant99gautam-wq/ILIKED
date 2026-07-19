"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setHasSearched(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .ilike('email', email)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none z-0 opacity-5">
        <h1 className="font-cartoon text-[30vw] leading-none text-black tracking-widest text-center whitespace-nowrap rotate-[-5deg]">
          STASH
        </h1>
      </div>

      <div className="max-w-[1000px] mx-auto relative z-10">
        
        <h1 className="font-cartoon text-6xl md:text-8xl text-black tracking-widest mb-12 drop-shadow-[4px_4px_0_var(--color-electric-blue)]">
          YOUR ORDERS
        </h1>

        <div className="bg-white border-[4px] border-black p-6 md:p-10 shadow-[12px_12px_0_#111] mb-12">
          <p className="font-black tracking-widest uppercase mb-6 text-sm md:text-base">Enter your email to track your past orders.</p>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOU@EXAMPLE.COM" 
              className="flex-1 p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="cartoon-btn px-8 py-4 bg-black text-white font-cartoon text-2xl tracking-widest border-[4px] border-black hover:bg-[var(--color-electric-blue)] transition-colors shadow-[6px_6px_0_var(--color-coral-red)] disabled:opacity-50"
            >
              {loading ? "SEARCHING..." : "FIND STASH"}
            </button>
          </form>
        </div>

        {hasSearched && !loading && orders.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center border-[4px] border-dashed border-black bg-white">
            <h2 className="font-cartoon text-4xl mb-2">NO ORDERS FOUND!</h2>
            <p className="font-black tracking-widest uppercase">Looks like you haven't copped anything yet.</p>
          </div>
        )}

        <div className="space-y-12">
          <AnimatePresence>
            {orders.map((order, i) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#fcfaf5] p-6 md:p-8 shadow-[10px_10px_0_#111] border-[4px] border-black relative"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.05) 100%), url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E")',
                }}
              >
                {/* Tape */}
                <div className="absolute -top-4 left-8 w-24 h-8 bg-white/80 border-[3px] border-black rotate-[-5deg] shadow-[2px_2px_0_#111]"></div>
                
                <div className="flex flex-col md:flex-row justify-between md:items-end border-b-[3px] border-dashed border-black pb-4 mb-6">
                  <div>
                    <h3 className="font-cartoon text-3xl md:text-4xl">ORDER #{order.id.slice(-8)}</h3>
                    <p className="font-black tracking-widest text-gray-500 text-xs md:text-sm mt-1">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`font-black px-4 py-2 border-[3px] border-black text-sm uppercase ${order.status === 'Pending' ? 'bg-[#FFD700]' : 'bg-[#19B85A] text-white'}`}>
                      {order.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center font-bold font-mono text-sm md:text-base border-b border-black/10 pb-4">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-12 h-12 border-[2px] border-black object-contain bg-white shrink-0" />
                        <div>
                          <p>{item.name}</p>
                          <p className="text-gray-500 text-xs">SIZE: {item.size} | QTY: {item.quantity}</p>
                        </div>
                      </div>
                      <p>₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 font-mono font-black text-xl md:text-2xl border-t-[3px] border-black">
                  <span>TOTAL: ₹{order.total}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}
