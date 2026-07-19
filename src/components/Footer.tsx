"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#111] overflow-hidden flex flex-col items-center border-t-[8px] border-black">
      
      {/* 1. Scrolling Marquee Ticker at Top Border */}
      <div className="absolute top-0 left-0 w-full bg-[#FFD700] border-b-[6px] border-black py-3 md:py-4 overflow-hidden flex whitespace-nowrap z-20">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
          className="flex font-cartoon text-black text-2xl md:text-3xl tracking-widest"
        >
          {Array(20).fill("JOIN THE CULT ★ WEAR WHAT YOU LIKE ★ ").map((text, i) => (
            <span key={i} className="mr-8">{text}</span>
          ))}
        </motion.div>
      </div>

      <div className="w-full max-w-[1440px] px-6 md:px-16 pt-32 pb-24 flex flex-col lg:flex-row justify-between gap-20 z-10 relative">
        
        {/* Left Side: Newsletter */}
        <div className="flex flex-col w-full lg:w-1/2 max-w-[600px]">
           <h3 
             className="font-cartoon text-5xl md:text-7xl text-white tracking-widest mb-4"
             style={{ textShadow: '4px 4px 0 #000' }}
           >
             JOIN THE CULT.
           </h3>
           <p className="font-black text-gray-400 text-sm md:text-base tracking-widest uppercase mb-8">Sign up for early access to drops, exclusive releases, and unhinged emails.</p>
           
           <div className="flex flex-col sm:flex-row w-full gap-4 group">
              <input 
                type="email" 
                placeholder="ENTER EMAIL ADDRESS" 
                className="w-full sm:w-2/3 bg-white border-[4px] border-black shadow-[6px_6px_0_#000] focus:shadow-[2px_2px_0_#000] focus:translate-x-1 focus:translate-y-1 outline-none px-6 py-4 font-black tracking-widest text-black text-sm md:text-lg transition-all" 
              />
              <button className="w-full sm:w-1/3 bg-[var(--color-electric-blue)] border-[4px] border-black hover:bg-[var(--color-coral-red)] shadow-[6px_6px_0_#000] active:shadow-[2px_2px_0_#000] active:translate-x-1 active:translate-y-1 px-6 py-4 font-cartoon tracking-widest text-white text-xl md:text-2xl transition-all">
                SUBSCRIBE
              </button>
           </div>
        </div>

        {/* Right Side: Links */}
        <div className="flex flex-wrap w-full lg:w-1/2 gap-16 lg:justify-end">
           
           <div className="flex flex-col gap-6">
              <h4 className="font-black text-gray-500 tracking-[0.2em] text-xs">MENU</h4>
              <Link href="/shop" className="font-cartoon text-3xl md:text-5xl text-white hover:text-[#FFD700] hover:translate-x-2 transition-all tracking-widest drop-shadow-[2px_2px_0_#000]">SHOP</Link>
              <Link href="/moods" className="font-cartoon text-3xl md:text-5xl text-white hover:text-[var(--color-coral-red)] hover:translate-x-2 transition-all tracking-widest drop-shadow-[2px_2px_0_#000]">MOODS</Link>
              <Link href="/story" className="font-cartoon text-3xl md:text-5xl text-white hover:text-[#19B85A] hover:translate-x-2 transition-all tracking-widest drop-shadow-[2px_2px_0_#000]">OUR STORY</Link>
           </div>

           <div className="flex flex-col gap-6">
              <h4 className="font-black text-gray-500 tracking-[0.2em] text-xs">SOCIALS</h4>
              <a href="#" className="font-cartoon text-3xl md:text-5xl text-white hover:text-[var(--color-electric-blue)] hover:translate-x-2 transition-all tracking-widest drop-shadow-[2px_2px_0_#000]">INSTAGRAM</a>
           </div>

        </div>
      </div>

      {/* Massive I LIKED Text at the bottom */}
      <div className="w-full flex justify-center items-end mt-[-2rem] md:mt-[-8rem] pointer-events-none z-0">
        <h1 className="font-cartoon text-[25vw] text-[#1c1c1c] leading-[0.7] tracking-tighter m-0 p-0 text-center select-none w-full overflow-hidden">
          I LIKED
        </h1>
      </div>

      <div className="absolute bottom-6 w-full text-center z-10">
        <p className="font-black text-gray-600 text-xs tracking-[0.3em]">© 2026 I LIKED. ALL RIGHTS RESERVED.</p>
      </div>

    </footer>
  );
}
