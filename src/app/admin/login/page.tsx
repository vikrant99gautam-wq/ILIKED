"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Redirect to admin dashboard
        router.push("/admin");
        router.refresh(); // Force refresh to apply middleware changes immediately
      } else {
        setError("Bhai password galat hai! Wapas try kar.");
      }
    } catch (err) {
      setError("Kuch technical gadbad hui hai.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFD700] rounded-full blur-[100px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-electric-blue)] rounded-full blur-[100px] opacity-40"></div>
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-md bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_#000] relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black uppercase tracking-widest font-cartoon mb-2">I LIKED</h1>
          <div className="h-[4px] w-24 bg-black mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold uppercase tracking-widest bg-black text-white inline-block px-4 py-1">Admin Access</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-2">
              Secret Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full border-[3px] border-black p-4 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-[var(--color-electric-blue)] transition-all bg-gray-50"
              autoFocus
            />
          </div>

          {error && (
            <motion.div 
              initial={{ x: -10 }} animate={{ x: 0 }}
              className="p-3 bg-red-100 border-[2px] border-red-500 text-red-700 font-bold text-sm"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={isLoading || !password}
            className={`w-full py-4 text-xl font-black uppercase tracking-widest border-[3px] border-black transition-all ${
              isLoading || !password 
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-[#FFD700] text-black hover:bg-black hover:text-[#FFD700] hover:shadow-[4px_4px_0_#FFD700]"
            }`}
          >
            {isLoading ? "Checking..." : "Let Me In"}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-sm font-bold text-gray-500 hover:text-black underline underline-offset-4">
            ← Back to Store
          </a>
        </div>
      </motion.div>
    </div>
  );
}
