"use client";
import { motion } from "framer-motion";

const Polaroid = ({ color, rotate, tapeRotate, delay, label }: { color: string, rotate: string, tapeRotate: string, delay: number, label: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 100, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: parseInt(rotate.replace(/[^0-9-]/g, '')) || 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.4 }}
      whileHover={{ scale: 1.15, rotate: 0, zIndex: 50 }}
      className={`relative p-3 md:p-4 bg-white bg-paper-noise border-[4px] border-black shadow-[12px_12px_0_#111] cursor-pointer transition-shadow hover:shadow-[20px_20px_0_#111] ${rotate}`}
    >
      {/* Tape */}
      <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/70 backdrop-blur-md border-[3px] border-black z-10 shadow-[2px_2px_0_#111] ${tapeRotate}`}></div>
      
      {/* Image Area */}
      <div className={`w-[220px] h-[280px] md:w-[300px] md:h-[380px] ${color} border-[3px] border-black flex items-center justify-center relative overflow-hidden group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-black/10 transition-colors`}>
        {/* Abstract shape to make it look less empty */}
        <div className="absolute w-[150%] h-[150%] bg-black/5 rotate-45 translate-y-1/2"></div>
        
        <svg className="w-1/3 h-1/3 text-black opacity-20 relative z-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      </div>

      {/* Label */}
      <div className="mt-4 md:mt-6 text-center pb-2">
        <span className="font-cartoon text-2xl md:text-3xl text-black tracking-widest">{label}</span>
      </div>
    </motion.div>
  )
}

export default function Moods() {
  return (
    <section id="moods" className="relative w-full bg-[var(--color-electric-blue)] bg-paper-noise py-32 md:py-40 px-6 overflow-hidden border-t-[8px] border-black">
      
      {/* Hand-drawn squiggly border transition at the top */}
      <div className="absolute top-0 left-0 w-full h-8 overflow-hidden pointer-events-none opacity-20 z-0">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
          <path d="M0,0 Q30,40 60,0 T120,0 T180,0 T240,0 T300,0 T360,0 T420,0 T480,0 T540,0 T600,0 T660,0 T720,0 T780,0 T840,0 T900,0 T960,0 T1020,0 T1080,0 T1140,0 T1200,0 V-10 H0 Z"></path>
        </svg>
      </div>

      {/* Scattered background doodles */}
      <div className="hidden md:block absolute top-20 right-[15%] w-16 h-16 opacity-30 pointer-events-none rotate-[20deg]">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 30 L70 70 M30 70 L70 30" stroke="#111" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>
      <div className="hidden md:block absolute bottom-[20%] left-[10%] w-24 h-24 opacity-20 pointer-events-none -rotate-[10deg]">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#111" strokeWidth="6" strokeDasharray="10 10" />
        </svg>
      </div>

      {/* Massive Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
         <span 
           className="font-cartoon text-[40vw] text-black whitespace-nowrap tracking-widest rotate-[-6deg] opacity-[0.07]"
         >
           VIBES
         </span>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-24 relative">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#FFD700] rounded-full border-[4px] border-black shadow-[4px_4px_0_#111] -z-10"></div>
          
          <motion.h2 
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="font-cartoon text-7xl md:text-9xl text-white tracking-widest drop-shadow-[8px_8px_0_#111] rotate-[-2deg]" 
            style={{ WebkitTextStroke: '4px #111' }}
          >
            OUR MOODS
          </motion.h2>
          
          <div className="mt-6 bg-white border-[3px] border-black px-6 py-2 shadow-[4px_4px_0_#111] rotate-[1deg] inline-block">
            <p className="font-black text-black text-sm md:text-lg tracking-widest uppercase">The Streets. The Culture. The Clothes.</p>
          </div>
        </div>

        {/* Scattered Polaroids Layout */}
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-x-16 md:gap-y-24 max-w-[1200px]">
          <Polaroid color="bg-[var(--color-coral-red)]" rotate="rotate-[-8deg]" tapeRotate="rotate-[-5deg]" delay={0.1} label="STREET" />
          <Polaroid color="bg-[#FFD700]" rotate="rotate-[12deg]" tapeRotate="rotate-[3deg]" delay={0.2} label="STUDIO" />
          <Polaroid color="bg-[#246BFD]" rotate="rotate-[-15deg]" tapeRotate="rotate-[-10deg]" delay={0.3} label="LIFESTYLE" />
          <Polaroid color="bg-[#FF9800]" rotate="rotate-[6deg]" tapeRotate="rotate-[8deg]" delay={0.4} label="ARCHIVE" />
          <Polaroid color="bg-[#E91E63]" rotate="rotate-[-10deg]" tapeRotate="rotate-[2deg]" delay={0.5} label="DROPS" />
        </div>
        
        {/* View Lookbook Button */}
        <motion.button 
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          className="mt-32 cartoon-btn px-10 py-5 bg-white text-black text-xl font-black tracking-widest border-[4px] border-black shadow-[8px_8px_0_#111] group"
        >
          VIEW FULL LOOKBOOK 
          <span className="inline-block ml-4 text-[var(--color-coral-red)] group-hover:translate-x-2 transition-transform">★</span>
        </motion.button>
        
      </div>
    </section>
  )
}
