"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ERROR-404";
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString());
  }, []);

  return (
    <div className="relative z-10 max-w-lg w-full flex flex-col items-center">
      
      <motion.div 
        initial={{ y: 50, opacity: 0, rotate: -2 }}
        animate={{ y: 0, opacity: 1, rotate: 2 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-full bg-[#fcfaf5] p-8 md:p-12 shadow-[15px_15px_0_#111] border-[4px] border-black relative"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.05) 100%), url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E")',
        }}
      >
        {/* Tape */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/80 border-[3px] border-black rotate-[-3deg] shadow-[2px_2px_0_#111]"></div>
        
        <div className="text-center mb-8 mt-4 font-mono">
          <h2 className="font-cartoon text-5xl mb-2 text-black">I LIKED</h2>
          <p className="text-gray-600 font-bold text-sm tracking-widest uppercase">Order Confirmed</p>
          <div className="border-b-[3px] border-dashed border-black w-full my-4"></div>
          
          <p className="font-black text-xl mb-1">ORDER #{orderId.slice(-8)}</p>
          <p className="text-xs font-bold text-gray-500">{date}</p>
        </div>

        <div className="font-mono text-sm space-y-4 font-bold border-b-[3px] border-dashed border-black pb-8 mb-8">
          <p className="uppercase text-center leading-relaxed">
            Your drip is secured.<br/>
            We'll email you the tracking details once it ships out.
          </p>
        </div>

        <div className="flex flex-col items-center">
          {/* Barcode Graphic */}
          <div className="w-full h-20 bg-black opacity-90 mb-4" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, white 3px, white 6px, transparent 6px, transparent 12px, white 12px, white 15px, transparent 15px, transparent 20px)' }}></div>
          <p className="font-black tracking-[0.3em] text-xs">THANK YOU FOR THE SUPPORT</p>
        </div>
        
        {/* Jagged Bottom Edge */}
        <div className="absolute -bottom-5 left-0 w-full h-5 overflow-hidden flex">
          {[...Array(24)].map((_, i) => (
              <div key={i} className="w-[5%] h-full bg-[#fcfaf5] border-b-[4px] border-r-[4px] border-black transform rotate-45 origin-top-left -translate-y-2 translate-x-1"></div>
          ))}
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center w-full"
      >
        <Link href="/">
           <button className="w-full max-w-[300px] bg-black text-white border-[4px] border-black py-4 font-cartoon text-2xl tracking-widest hover:bg-[var(--color-electric-blue)] hover:translate-y-1 hover:translate-x-1 transition-all shadow-[6px_6px_0_#FFD700] active:shadow-none">
             BACK TO STREETS
           </button>
        </Link>
      </motion.div>

    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-32 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none z-0 opacity-5">
        <h1 className="font-cartoon text-[25vw] leading-none text-black tracking-widest text-center whitespace-nowrap rotate-[-10deg]">
          SECURED
        </h1>
      </div>
      
      <Suspense fallback={<div className="font-cartoon text-4xl">LOADING...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
