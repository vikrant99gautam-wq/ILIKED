"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none z-0 opacity-5">
        <h1 className="font-cartoon text-[30vw] leading-none text-black tracking-widest text-center whitespace-nowrap rotate-[-5deg]">
          STASH
        </h1>
      </div>

      <div className="max-w-[1000px] mx-auto relative z-10">
        {loadingSession ? (
          <div className="flex justify-center py-20">
            <span className="font-cartoon text-3xl animate-pulse">LOADING...</span>
          </div>
        ) : !session ? (
          <AuthUI />
        ) : (
          <Dashboard user={session.user} />
        )}
      </div>
    </main>
  );
}

// -------------------------------------------------------------
// AuthUI Component (Magic Link)
// -------------------------------------------------------------
function AuthUI() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Redirection handled by default or specify here if needed
        emailRedirectTo: window.location.origin + "/profile",
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "MAGIC LINK SENT! CHECK YOUR INBOX." });
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + "/profile"
      }
    });
    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-12 bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_#111]">
      <h1 className="font-cartoon text-5xl md:text-6xl text-black tracking-widest mb-4 drop-shadow-[2px_2px_0_var(--color-electric-blue)]">
        LOGIN
      </h1>
      <p className="font-black tracking-widest uppercase mb-8 text-sm text-gray-500">
        Enter your email for a magic link, or login instantly with Google.
      </p>

      {message && (
        <div className={`mb-6 p-4 border-[3px] border-black font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-[#19B85A] text-white' : 'bg-[var(--color-coral-red)] text-white'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="YOU@EXAMPLE.COM" 
          className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="cartoon-btn px-8 py-4 bg-black text-white font-cartoon text-3xl tracking-widest border-[4px] border-black hover:bg-[var(--color-electric-blue)] transition-colors shadow-[6px_6px_0_var(--color-coral-red)] disabled:opacity-50 w-full"
        >
          {loading ? "SENDING..." : "SEND MAGIC LINK"}
        </button>
      </form>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex-1 h-[4px] bg-black"></div>
        <span className="font-black tracking-widest uppercase text-sm">OR</span>
        <div className="flex-1 h-[4px] bg-black"></div>
      </div>

      <button 
        type="button" 
        onClick={handleGoogleLogin}
        disabled={loading}
        className="cartoon-btn mt-8 px-8 py-4 bg-white text-black font-cartoon text-3xl tracking-widest border-[4px] border-black hover:bg-[#FFD700] transition-colors shadow-[6px_6px_0_#111] disabled:opacity-50 w-full flex items-center justify-center gap-3"
      >
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        LOGIN WITH GOOGLE
      </button>
    </div>
  );
}

// -------------------------------------------------------------
// Dashboard Component
// -------------------------------------------------------------
function Dashboard({ user }: { user: User }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .ilike('email', user.email!)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
        <div>
          <h1 className="font-cartoon text-6xl md:text-8xl text-black tracking-widest drop-shadow-[4px_4px_0_var(--color-electric-blue)]">
            YOUR STASH
          </h1>
          <p className="font-black tracking-widest uppercase mt-4 text-sm text-gray-500 bg-white border-[3px] border-black px-4 py-2 shadow-[4px_4px_0_#111] inline-block">
            LOGGED IN AS: {user.email}
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="cartoon-btn px-6 py-3 bg-[var(--color-coral-red)] text-white font-cartoon text-xl tracking-widest border-[4px] border-black hover:bg-black shadow-[4px_4px_0_#111] transition-colors"
        >
          LOGOUT
        </button>
      </div>

      {loading ? (
        <div className="w-full py-20 flex justify-center">
          <span className="font-cartoon text-3xl animate-pulse">LOADING STASH...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center border-[4px] border-dashed border-black bg-white">
          <h2 className="font-cartoon text-4xl mb-2">NO ORDERS FOUND!</h2>
          <p className="font-black tracking-widest uppercase">Looks like you haven't copped anything yet.</p>
        </div>
      ) : (
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
                  {order.items.map((item: any, index: number) => {
                    if (item.id === "SHIPPING-INFO" && item.shipping_info) {
                      const { address, city, district, state, zip, phone } = item.shipping_info;
                      return (
                        <div key={index} className="bg-[#FFD700] p-4 border-[3px] border-black text-sm md:text-base shadow-[4px_4px_0_#111] my-4">
                          <p className="font-cartoon text-2xl mb-2">DELIVERY DETAILS</p>
                          <p className="font-bold font-mono uppercase text-black">
                            {address}, {city} <br />
                            DISTRICT {district}, {state} - {zip} <br />
                            PHONE: {phone}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <div key={index} className="flex justify-between items-center font-bold font-mono text-sm md:text-base border-b border-black/10 pb-4">
                        <div className="flex items-center gap-4">
                          {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 border-[2px] border-black object-contain bg-white shrink-0" />}
                          <div>
                            <p>{item.name}</p>
                            <p className="text-gray-500 text-xs">SIZE: {item.size} | QTY: {item.quantity}</p>
                          </div>
                        </div>
                        <p>₹{item.price * item.quantity}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t-[3px] border-black gap-4 md:gap-0">
                  <a href={`/checkout/success?orderId=${order.id}`} className="cartoon-btn px-4 py-2 bg-[var(--color-electric-blue)] text-white font-cartoon text-xl tracking-widest border-[3px] border-black hover:bg-black transition-colors shadow-[3px_3px_0_#111]">
                    VIEW INVOICE
                  </a>
                  <div className="font-mono font-black text-xl md:text-2xl">
                    <span>TOTAL: ₹{order.total}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
