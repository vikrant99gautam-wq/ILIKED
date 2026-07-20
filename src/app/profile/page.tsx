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
// AuthUI Component (Magic Link / OTP)
// -------------------------------------------------------------
function AuthUI() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNum, setPhoneNum] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    let error;

    if (loginMethod === 'email') {
      if (!emailInput) {
        setLoading(false);
        return;
      }
      const { error: emailError } = await supabase.auth.signInWithOtp({
        email: emailInput,
        options: {
          emailRedirectTo: window.location.origin + "/profile",
        },
      });
      error = emailError;
    } else {
      if (!phoneInput) {
        setLoading(false);
        return;
      }
      const formattedPhone = `${countryCode}${phoneInput}`;
      setPhoneNum(formattedPhone);

      const { error: phoneError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      error = phoneError;
    }

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      if (loginMethod === 'email') {
        setMessage({ type: 'success', text: "MAGIC LINK SENT! CHECK YOUR INBOX." });
      } else {
        setMessage({ type: 'success', text: "OTP SENT! CHECK YOUR SMS." });
        setOtpSent(true);
      }
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !phoneNum) return;
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.verifyOtp({
      phone: phoneNum,
      token: otp,
      type: 'sms'
    });

    if (error) {
      setMessage({ type: 'error', text: "INVALID OTP. TRY AGAIN." });
    }
    setLoading(false);
  };

  if (otpSent) {
    return (
      <div className="w-full max-w-xl mx-auto mt-12 bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_#111]">
        <h1 className="font-cartoon text-5xl md:text-6xl text-black tracking-widest mb-4 drop-shadow-[2px_2px_0_var(--color-electric-blue)]">
          VERIFY OTP
        </h1>
        <p className="font-black tracking-widest uppercase mb-8 text-sm text-gray-500">
          Enter the 6-digit code sent to {phoneNum}
        </p>

        {message && (
          <div className={`mb-6 p-4 border-[3px] border-black font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-[#19B85A] text-white' : 'bg-[var(--color-coral-red)] text-white'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
          <input 
            type="text" 
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="000000" 
            className="w-full p-4 border-[4px] border-black bg-[#F4F4F0] font-bold text-center text-3xl tracking-[1em] outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all"
          />
          <button 
            type="submit" 
            disabled={loading || otp.length !== 6}
            className="cartoon-btn px-8 py-4 bg-black text-white font-cartoon text-3xl tracking-widest border-[4px] border-black hover:bg-[var(--color-electric-blue)] transition-colors shadow-[6px_6px_0_var(--color-coral-red)] disabled:opacity-50 w-full"
          >
            {loading ? "VERIFYING..." : "LOGIN"}
          </button>
          
          <button 
            type="button"
            onClick={() => {
              setOtpSent(false);
              setOtp("");
            }}
            className="font-black text-sm uppercase text-gray-500 hover:text-black underline mt-2"
          >
            Try a different number
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-12 bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_#111]">
      <h1 className="font-cartoon text-5xl md:text-6xl text-black tracking-widest mb-4 drop-shadow-[2px_2px_0_var(--color-electric-blue)]">
        LOGIN
      </h1>

      <div className="flex border-[4px] border-black mb-8 bg-[#F4F4F0]">
        <button 
          type="button"
          onClick={() => { setLoginMethod('email'); setMessage(null); }}
          className={`flex-1 py-3 font-black tracking-widest text-sm md:text-base transition-colors ${loginMethod === 'email' ? 'bg-black text-white' : 'hover:bg-gray-200 text-black'}`}
        >
          USE EMAIL
        </button>
        <div className="w-[4px] bg-black"></div>
        <button 
          type="button"
          onClick={() => { setLoginMethod('mobile'); setMessage(null); }}
          className={`flex-1 py-3 font-black tracking-widest text-sm md:text-base transition-colors ${loginMethod === 'mobile' ? 'bg-[var(--color-electric-blue)] text-white' : 'hover:bg-gray-200 text-black'}`}
        >
          USE MOBILE
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 border-[3px] border-black font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-[#19B85A] text-white' : 'bg-[var(--color-coral-red)] text-white'}`}>
          {message.text}
        </div>
      )}

      {loginMethod === 'email' ? (
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <input 
            type="email" 
            required
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
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
      ) : (
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex gap-2">
            <select 
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-1/3 p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all appearance-none cursor-pointer"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
            </select>
            <input 
              type="tel" 
              required
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
              placeholder="9876543210" 
              className="w-2/3 p-4 border-[4px] border-black bg-[#F4F4F0] font-bold outline-none focus:bg-white focus:shadow-[6px_6px_0_var(--color-electric-blue)] transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="cartoon-btn px-8 py-4 bg-black text-white font-cartoon text-3xl tracking-widest border-[4px] border-black hover:bg-[var(--color-electric-blue)] transition-colors shadow-[6px_6px_0_var(--color-coral-red)] disabled:opacity-50 w-full"
          >
            {loading ? "SENDING..." : "SEND OTP"}
          </button>
        </form>
      )}
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
      )}
    </div>
  );
}
