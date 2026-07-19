"use client";
import ModelFlipbook from "./ModelFlipbook";
import { motion } from "framer-motion";

const FloatingStar = ({ className, delay }: { className: string, delay: number }) => (
  <motion.svg 
    animate={{ y: [0, -20, 0], rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
    viewBox="0 0 100 100" 
    className={`absolute z-10 ${className}`}
  >
    <path fill="currentColor" stroke="#111" strokeWidth="4" d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
  </motion.svg>
);

const FloatingSquiggle = ({ className, delay }: { className: string, delay: number }) => (
  <motion.svg 
    animate={{ y: [0, 15, 0], rotate: [0, -10, 10, 0] }}
    transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
    viewBox="0 0 100 100" 
    className={`absolute z-10 ${className}`}
  >
    <path fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" d="M10 50 Q 25 20, 50 50 T 90 50" />
  </motion.svg>
);

export default function Hero() {
  return (
    <section className="relative w-full h-[100svh] bg-[#E5F1FB] overflow-hidden">
      
      {/* 1. Original V5 Organic Cartoon Blobs (Background) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 10, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-[#FFD700] rounded-full border-[6px] border-black opacity-90 shadow-[10px_10px_0_rgba(0,0,0,0.1)]"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -20, 0] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-20 w-[500px] h-[400px] md:w-[700px] md:h-[500px] bg-[var(--color-coral-red)] rounded-[120px] rotate-12 border-[6px] border-black opacity-90 shadow-[10px_10px_0_rgba(0,0,0,0.1)]"
        />
        <motion.div 
          animate={{ y: [0, 40, 0] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/4 left-10 md:top-1/3 md:left-40 w-[150px] h-[200px] bg-[#19B85A] rounded-full rotate-[-20deg] border-[5px] border-black opacity-80"
        />
      </div>

      {/* Floating Hand-drawn Elements */}
      <FloatingStar className="bottom-[20%] md:bottom-[30%] left-[2%] md:left-[5%] w-12 h-12 md:w-16 md:h-16 text-[#FFD700] drop-shadow-[2px_2px_0_#111]" delay={0} />
      <FloatingStar className="top-1/3 right-1/4 w-10 h-10 md:w-12 md:h-12 text-[var(--color-coral-red)] drop-shadow-[2px_2px_0_#111]" delay={1.5} />
      <FloatingStar className="bottom-40 left-[40%] w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[2px_2px_0_#111]" delay={3} />
      
      <FloatingSquiggle className="top-40 right-20 w-24 h-24 text-black" delay={1} />
      <FloatingSquiggle className="bottom-32 right-1/3 w-32 h-32 text-black opacity-50" delay={2.5} />

      {/* 2. Original V5 Unified Ground */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-end z-10">
        <div className="absolute bottom-[-10%] w-[120%] md:w-[800px] h-[25vh] bg-black/10 rounded-[100%] blur-xl z-0"></div>
        <div className="absolute bottom-[-15%] w-[150%] md:w-[1200px] h-[30vh] bg-white border-t-[8px] border-black rounded-[100%] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-10 flex items-center justify-center pb-24 md:pb-24 pointer-events-auto">
          {/* Season Tag */}
          <motion.div 
            whileHover={{ rotate: 0, scale: 1.05 }}
            className="z-40 bg-white border-[4px] border-black shadow-[6px_6px_0_#111] px-6 py-2 md:px-8 md:py-3 rotate-[-4deg] cursor-pointer"
          >
            <span className="font-cartoon text-black text-xl md:text-3xl tracking-[0.2em] leading-none">SEASON ONE</span>
          </motion.div>
        </div>
      </div>

      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden md:flex absolute inset-0 flex-col md:flex-row pointer-events-none z-20">
        
        {/* Left Column: The Model */}
        <div className="relative w-1/2 h-full flex items-center justify-center overflow-visible pointer-events-auto z-30">
          
          {/* Animated Comic Card Container */}
          <motion.div 
            whileHover={{ scale: 1.02, rotate: -2, y: -10 }}
            className="relative w-[130%] lg:w-[650px] h-[450px] bg-white border-[8px] border-black rounded-[32px] shadow-[16px_16px_0_#111] overflow-hidden flex flex-row items-center group cursor-pointer transition-shadow hover:shadow-[24px_24px_0_#111] ml-12"
          >
            {/* Comic Halftone Background inside card */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#111 3px, transparent 3px)', backgroundSize: '24px 24px' }}></div>
            
            {/* Left Side: Action Text */}
            <div className="relative w-1/2 h-full flex flex-col items-center justify-center z-20 pl-8">
              <motion.div 
                className="font-cartoon text-7xl text-[#FFD700] rotate-[-10deg] opacity-90 group-hover:scale-110 transition-transform duration-300 flex flex-col leading-[0.8]" 
                style={{ WebkitTextStroke: '2px #111', textShadow: '4px 4px 0 #111' }}
              >
                <span>STAY</span>
                <span className="text-[var(--color-coral-red)] text-8xl ml-4">FRESH</span>
              </motion.div>
            </div>

            {/* Right Side: Model Container */}
            <div className="relative w-1/2 h-full flex items-end justify-center z-10 group-hover:scale-110 transition-transform duration-500 origin-bottom">
              <div className="absolute -bottom-[5%] w-[160%] h-[125%] right-[-20%]">
                <ModelFlipbook />
              </div>
            </div>

            {/* Comic Sticker */}
            <div className="absolute top-6 left-6 bg-[var(--color-electric-blue)] border-[3px] border-black shadow-[4px_4px_0_#111] px-4 py-1 rotate-[-6deg] z-30 group-hover:rotate-[4deg] transition-transform">
              <span className="font-cartoon text-white text-xl tracking-widest">VOL. 1</span>
            </div>
            
          </motion.div>
        </div>

        {/* Right Column: Typography & CTA */}
        <div className="relative w-1/2 h-full flex flex-col items-center justify-center pointer-events-auto">
          
          {/* Stacked Bubbly Typography */}
          <div className="flex flex-col items-stretch font-cartoon text-[16vw] leading-[0.8] text-white tracking-widest drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]" style={{ WebkitTextStroke: '4px #111', textShadow: '8px 8px 0 #111' }}>
            <div className="flex justify-start">
              <motion.span animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0, ease: "easeInOut" }} className="inline-block">I</motion.span>
            </div>
            <div className="flex mt-8">
              {["L", "I", "K", "E", "D"].map((letter, i) => (
                <motion.span key={i} animate={{ y: [0, -15, 0], rotate: [0, i % 2 === 0 ? 5 : -5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: (i + 1) * 0.15, ease: "easeInOut" }} className="inline-block">{letter}</motion.span>
              ))}
            </div>
          </div>

          {/* Comic Speech Bubble CTA */}
          <a href="#shop" className="mt-16 group cursor-pointer ml-12">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }} className="relative bg-white border-[5px] border-black rounded-[40px] px-10 py-6 shadow-[8px_8px_0_#111] transition-transform">
              <div className="absolute -bottom-6 left-8 w-10 h-10 bg-white border-b-[5px] border-l-[5px] border-black rounded-bl-xl transform -rotate-12 shadow-[-4px_4px_0_#111] -z-10 clip-path-tail"></div>
              <div className="flex flex-col items-center justify-center transform -rotate-2">
                <span className="font-cartoon text-black text-3xl tracking-widest leading-none">SHOP</span>
                <span className="font-cartoon text-[var(--color-coral-red)] text-4xl tracking-widest leading-none mt-1" style={{ WebkitTextStroke: '1px #111' }}>THE DROP</span>
              </div>
            </motion.div>
          </a>
        </div>
      </div>

      {/* --- NEW DEDICATED MOBILE LAYOUT --- */}
      <div className="flex md:hidden relative z-20 flex-col items-center justify-between w-full min-h-[100svh] pt-[90px] pb-6 px-4">
        
        {/* Top: Big Brand Text (Horizontal) */}
        <div className="w-full flex justify-center mt-2 pointer-events-auto">
          <div className="flex items-center font-cartoon text-[18vw] text-white tracking-widest drop-shadow-[0_8px_8px_rgba(0,0,0,0.2)]" style={{ WebkitTextStroke: '3px #111', textShadow: '4px 4px 0 #111' }}>
            {["I", "\u00A0", "L", "I", "K", "E", "D"].map((letter, i) => (
              <motion.span 
                key={i} 
                animate={{ y: [0, -6, 0], rotate: letter === "\u00A0" ? 0 : (i % 2 === 0 ? 4 : -4) }} 
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }} 
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Middle: The Model Card (Perfect Aspect Ratio Box) */}
        <div className="w-full max-w-[340px] flex flex-col justify-center my-6 relative pointer-events-auto">
          <motion.div 
            className="w-full bg-white border-[4px] border-black rounded-[24px] shadow-[8px_8px_0_#111] overflow-visible relative flex flex-col"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none rounded-[20px] overflow-hidden" style={{ backgroundImage: 'radial-gradient(#111 3px, transparent 3px)', backgroundSize: '24px 24px' }}></div>
            
            {/* Tag */}
            <div className="absolute -top-4 -left-2 bg-[var(--color-electric-blue)] border-[2px] border-black shadow-[3px_3px_0_#111] px-4 py-1 rotate-[-6deg] z-30">
              <span className="font-cartoon text-white text-lg tracking-widest">VOL. 1</span>
            </div>

            {/* Title inside card */}
            <div className="w-full flex justify-center pt-6 pb-2 z-20 relative">
               <motion.div 
                className="font-cartoon text-4xl text-[#FFD700] rotate-[-4deg] flex flex-col items-center leading-none" 
                style={{ WebkitTextStroke: '2px #111', textShadow: '3px 3px 0 #111' }}
              >
                <span>STAY</span>
                <span className="text-[var(--color-coral-red)] text-5xl mt-1">FRESH</span>
              </motion.div>
            </div>

            {/* Model Image sticking out */}
            <div className="w-full aspect-[4/3] relative z-10 -mt-2">
               <div className="absolute inset-x-[-15%] bottom-0 h-[130%] flex justify-center items-end">
                 <div className="w-full h-full relative">
                   <ModelFlipbook />
                 </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: CTA */}
        <div className="w-full flex justify-center mt-auto pointer-events-auto pb-4">
          <a href="#shop" className="group cursor-pointer">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative bg-white border-[4px] border-black rounded-[30px] px-10 py-4 shadow-[6px_6px_0_#111]">
              <div className="absolute -bottom-4 left-8 w-6 h-6 bg-white border-b-[4px] border-l-[4px] border-black rounded-bl-xl transform -rotate-12 shadow-[-4px_4px_0_#111] -z-10 clip-path-tail"></div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-cartoon text-black text-xl tracking-widest leading-none">SHOP</span>
                <span className="font-cartoon text-[var(--color-coral-red)] text-3xl tracking-widest leading-none mt-1" style={{ WebkitTextStroke: '1px #111' }}>THE DROP</span>
              </div>
            </motion.div>
          </a>
        </div>
        
      </div>
    </section>
  );
}
