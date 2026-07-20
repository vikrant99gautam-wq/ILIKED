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
    <path fill="currentColor" stroke="#111" strokeWidth="4" strokeLinejoin="round" d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
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

const FloatingArrow = ({ className, delay }: { className: string, delay: number }) => (
  <motion.svg 
    animate={{ y: [0, 10, 0], x: [0, -5, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 7, repeat: Infinity, delay, ease: "easeInOut" }}
    viewBox="0 0 100 100" 
    className={`absolute z-10 ${className}`}
  >
    <path fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" d="M20 80 Q 50 50, 80 20 M60 20 L80 20 L80 40" />
  </motion.svg>
);

const FloatingCircle = ({ className, delay }: { className: string, delay: number }) => (
  <motion.svg 
    animate={{ y: [0, -12, 0], rotate: [0, 180, 360] }}
    transition={{ duration: 10, repeat: Infinity, delay, ease: "linear" }}
    viewBox="0 0 100 100" 
    className={`absolute z-10 ${className}`}
  >
    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10" />
  </motion.svg>
);

const FloatingSmile = ({ className, delay }: { className: string, delay: number }) => (
  <motion.svg 
    animate={{ y: [0, 10, 0], rotate: [-10, 10, -10] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
    viewBox="0 0 100 100" 
    className={`absolute z-10 ${className}`}
  >
    <path fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" d="M30 40 L30 45 M70 40 L70 45 M30 70 Q 50 90, 70 70" />
  </motion.svg>
);

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100svh] bg-[#E5F1FB] flex flex-col overflow-x-hidden">
      
      {/* 1. Original V5 Organic Cartoon Blobs (Background) - SCALED DOWN WITH DEPTH */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.03, 1], rotate: [0, 5, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 -right-16 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#FFD700] rounded-[45%] border-[3px] md:border-[4px] border-black/80 opacity-80 shadow-[10px_10px_30px_rgba(0,0,0,0.05)] blur-[2px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.05, 1], x: [0, 15, 0], y: [0, -10, 0] }} 
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -left-10 w-[300px] h-[250px] md:w-[550px] md:h-[400px] bg-[var(--color-coral-red)] rounded-[40%] rotate-12 border-[3px] md:border-[4px] border-black/80 opacity-80 shadow-[10px_10px_30px_rgba(0,0,0,0.05)] blur-[3px]"
        />
      </div>

      {/* Background Personality & Hand-drawn Elements */}
      <FloatingStar className="bottom-[20%] left-[5%] md:left-[8%] w-6 h-6 md:w-10 md:h-10 text-[#FFD700] drop-shadow-[2px_2px_0_#111] opacity-70 blur-[1px]" delay={0} />
      <FloatingStar className="top-[15%] right-[10%] md:top-[25%] md:right-[15%] w-8 h-8 md:w-12 md:h-12 text-[var(--color-coral-red)] drop-shadow-[2px_2px_0_#111] opacity-80" delay={1.5} />
      <FloatingStar className="hidden md:block top-[15%] left-[25%] w-4 h-4 md:w-6 md:h-6 text-[#19B85A] drop-shadow-[1px_1px_0_#111] opacity-60 blur-[1px]" delay={2.5} />
      
      <FloatingSquiggle className="hidden md:block top-40 right-20 w-16 h-16 md:w-24 md:h-24 text-black opacity-30" delay={1} />
      <FloatingSquiggle className="bottom-40 left-[20%] md:left-1/3 w-12 h-12 md:w-16 md:h-16 text-[var(--color-electric-blue)] opacity-40 blur-[1px]" delay={2} />
      
      <FloatingArrow className="top-[25%] left-[5%] md:top-1/3 md:left-10 w-10 h-10 md:w-16 md:h-16 text-black opacity-40" delay={0.5} />
      <FloatingCircle className="bottom-1/4 right-[5%] md:right-[10%] w-12 h-12 md:w-20 md:h-20 text-[var(--color-coral-red)] opacity-40" delay={1.2} />
      <FloatingSmile className="top-[18%] left-[40%] md:top-20 md:left-[40%] w-10 h-10 md:w-14 md:h-14 text-black opacity-50" delay={0.8} />

      {/* 2. Unified Ground */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-end z-10 overflow-hidden">
        <div className="absolute bottom-[-10%] w-[120%] md:w-[800px] h-[20vh] md:h-[25vh] bg-black/15 rounded-[100%] blur-[24px] z-0"></div>
        <div className="absolute bottom-[-10%] md:bottom-[-15%] w-[150%] md:w-[1300px] h-[25vh] md:h-[30vh] bg-[#F4F4F0] border-t-[4px] md:border-t-[6px] border-black rounded-[50%] shadow-[0_-15px_30px_rgba(0,0,0,0.1)] md:shadow-[0_-20px_50px_rgba(0,0,0,0.12)] z-10 flex items-center justify-center pb-16 md:pb-24 pointer-events-auto" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.04%22/%3E%3C/svg%3E")' }}>
          {/* Season Tag */}
          <motion.div 
            whileHover={{ rotate: -2, scale: 1.05 }}
            className="z-40 bg-white border-[3px] border-black shadow-[4px_4px_0_#111] px-6 py-2 md:px-8 md:py-3 rotate-[-3deg] cursor-pointer hidden md:block group"
          >
            <span className="font-cartoon text-black text-xl md:text-3xl tracking-[0.2em] leading-none group-hover:text-[var(--color-coral-red)] transition-colors">SEASON ONE</span>
          </motion.div>
        </div>
      </div>

      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden md:flex absolute inset-0 flex-col md:flex-row pointer-events-none z-20">
        
        {/* Left Column: The Model */}
        <div className="relative w-1/2 h-full flex items-center justify-center overflow-visible pointer-events-auto z-30">
          
          {/* Animated Comic Card Container */}
          <motion.div 
            whileHover={{ scale: 1.02, rotate: -1, y: -5 }}
            className="relative w-[130%] lg:w-[680px] h-[480px] bg-[#FAFAFA] border-[6px] border-black rounded-[28px] shadow-[inset_0_4px_12px_rgba(255,255,255,1),_20px_20px_0_#111] flex flex-row items-center group cursor-pointer transition-shadow hover:shadow-[inset_0_4px_12px_rgba(255,255,255,1),_28px_28px_0_#111] ml-8"
          >
            {/* Comic Halftone Background inside card */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none rounded-[20px] overflow-hidden mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.4%22/%3E%3C/svg%3E"), radial-gradient(#111 2.5px, transparent 2.5px)', backgroundSize: '100% 100%, 20px 20px' }}></div>
            
            {/* Left Side: Action Text */}
            <div className="relative w-1/2 h-full flex flex-col items-center justify-center z-20 pl-10 md:pl-16">
              <motion.div 
                className="font-cartoon text-6xl md:text-[80px] text-[#FFD700] rotate-[-8deg] opacity-95 group-hover:scale-[1.05] transition-transform duration-400 flex flex-col leading-[0.85]" 
                style={{ WebkitTextStroke: '3px #111', textShadow: '5px 5px 0 #111' }}
              >
                <span>STAY</span>
                <span className="text-[var(--color-coral-red)] text-7xl md:text-[96px] ml-4">FRESH</span>
              </motion.div>
            </div>

            {/* Right Side: Model Container - Adjusted size to prevent overflow */}
            <div className="relative w-1/2 h-full flex items-end justify-center z-10 origin-bottom">
              <motion.div 
                animate={{ y: [-3, 3, -3] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-[2%] w-[185%] h-[140%] right-[-25%] group-hover:scale-105 transition-transform duration-500 origin-bottom"
              >
                <ModelFlipbook />
              </motion.div>
            </div>

            {/* Comic Sticker */}
            <div className="absolute top-8 left-8 bg-[var(--color-electric-blue)] border-[3px] border-black shadow-[5px_5px_0_#111] px-5 py-2 rotate-[-5deg] z-30 group-hover:rotate-[3deg] group-hover:scale-110 transition-transform">
              <span className="font-cartoon text-white text-xl tracking-widest">VOL. 1</span>
            </div>
            
          </motion.div>
        </div>

        {/* Right Column: Typography & CTA */}
        <div className="relative w-1/2 h-full flex flex-col items-center justify-center pointer-events-auto">
          
          {/* Stacked Bubbly Typography */}
          <div className="flex flex-col items-stretch font-cartoon text-[clamp(100px,11vw,200px)] leading-[0.8] text-white tracking-widest drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]" style={{ WebkitTextStroke: '4px #111', textShadow: '10px 10px 0 #111' }}>
            <div className="flex justify-start">
              <motion.span animate={{ y: [0, -8, 0], rotate: [0, -3, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0, ease: "easeInOut" }} className="inline-block">I</motion.span>
            </div>
            <div className="flex mt-2 md:mt-4">
              {["L", "I", "K", "E", "D"].map((letter, i) => (
                <motion.span key={i} animate={{ y: [0, -8, 0], rotate: [0, i % 2 === 0 ? 3 : -3, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: (i + 1) * 0.15, ease: "easeInOut" }} className="inline-block">{letter}</motion.span>
              ))}
            </div>
          </div>

          {/* Comic Speech Bubble CTA */}
          <a href="#shop" className="mt-20 group cursor-pointer ml-16">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2, y: -4 }} 
              whileTap={{ scale: 0.96 }} 
              className="relative bg-white border-[5px] border-black rounded-[40px] px-12 py-7 shadow-[12px_12px_0_#111] group-hover:shadow-[16px_16px_0_#111] transition-all duration-300"
            >
              <div className="absolute -bottom-7 left-10 w-12 h-12 bg-white border-b-[5px] border-l-[5px] border-black rounded-bl-2xl transform -rotate-12 shadow-[-5px_5px_0_#111] -z-10 clip-path-tail"></div>
              <div className="flex flex-col items-center justify-center transform -rotate-[2deg] group-hover:rotate-0 transition-transform duration-300">
                <span className="font-cartoon text-black text-[32px] tracking-widest leading-none">SHOP</span>
                <span className="font-cartoon text-[var(--color-coral-red)] text-[40px] tracking-widest leading-none mt-2" style={{ WebkitTextStroke: '1.5px #111' }}>THE DROP</span>
              </div>
            </motion.div>
          </a>
        </div>
      </div>

      {/* --- NEW DEDICATED MOBILE LAYOUT --- */}
      <div className="flex md:hidden relative z-20 flex-col items-center justify-between w-full min-h-[100svh] pt-[90px] pb-8 px-4 gap-4 overflow-hidden">
        
        {/* Top: Big Brand Text (Horizontal) */}
        <div className="w-full flex justify-center pointer-events-auto mt-2">
          <div className="flex items-center font-cartoon text-[14vw] text-white tracking-widest drop-shadow-[0_8px_8px_rgba(0,0,0,0.2)]" style={{ WebkitTextStroke: '2.5px #111', textShadow: '4px 4px 0 #111' }}>
            {["I", "\u00A0", "L", "I", "K", "E", "D"].map((letter, i) => (
              <motion.span 
                key={i} 
                animate={{ y: [0, -4, 0], rotate: letter === "\u00A0" ? 0 : (i % 2 === 0 ? 3 : -3) }} 
                transition={{ duration: 4.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }} 
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Middle: The Model Card (Split left text, right model) */}
        <div className="w-full max-w-[340px] relative pointer-events-auto mt-2 z-30">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="w-full h-[220px] bg-[#FAFAFA] border-[4px] border-black rounded-[20px] shadow-[inset_0_2px_6px_rgba(255,255,255,1),_8px_8px_0_#111] relative flex flex-row group"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none rounded-[16px] overflow-hidden mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.4%22/%3E%3C/svg%3E"), radial-gradient(#111 2px, transparent 2px)', backgroundSize: '100% 100%, 14px 14px' }}></div>
            
            {/* Tag */}
            <div className="absolute -top-3 -left-2 bg-[var(--color-electric-blue)] border-[2px] border-black shadow-[3px_3px_0_#111] px-3 py-1 rotate-[-6deg] z-40">
              <span className="font-cartoon text-white text-xs tracking-widest">VOL. 1</span>
            </div>

            {/* Left Side: Action Text */}
            <div className="w-1/2 h-full flex flex-col items-center justify-center z-20 pl-2">
               <motion.div 
                className="font-cartoon text-[42px] text-[#FFD700] rotate-[-6deg] flex flex-col items-center leading-[0.9]" 
                style={{ WebkitTextStroke: '2px #111', textShadow: '3px 3px 0 #111' }}
              >
                <span>STAY</span>
                <span className="text-[var(--color-coral-red)] text-[52px] mt-1">FRESH</span>
              </motion.div>
            </div>

            {/* Right Side: Model Image - Scaled carefully for mobile */}
            <div className="w-1/2 h-full relative z-10 origin-bottom">
               <motion.div 
                 animate={{ y: [-1.5, 1.5, -1.5] }} 
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -bottom-[2%] w-[180%] h-[140%] right-[-15%] origin-bottom"
               >
                 <ModelFlipbook />
               </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: CTA */}
        <div className="w-full flex justify-center pointer-events-auto mt-4 z-40">
          <a href="#shop" className="active:scale-95 transition-transform">
            <motion.div 
              animate={{ y: [-2, 2, -2] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative bg-white border-[3px] border-black rounded-[24px] px-8 py-3 shadow-[6px_6px_0_#111]"
            >
              <div className="absolute -bottom-3 left-6 w-6 h-6 bg-white border-b-[3px] border-l-[3px] border-black rounded-bl-xl transform -rotate-12 shadow-[-2px_2px_0_#111] -z-10 clip-path-tail"></div>
              <div className="flex flex-col items-center justify-center transform -rotate-2">
                <span className="font-cartoon text-black text-xl tracking-widest leading-none">SHOP</span>
                <span className="font-cartoon text-[var(--color-coral-red)] text-[32px] tracking-widest leading-none mt-1" style={{ WebkitTextStroke: '1px #111' }}>THE DROP</span>
              </div>
            </motion.div>
          </a>
        </div>
        
        {/* Scroll Down Indicator */}
        <div className="w-full flex justify-center mt-4 pointer-events-auto">
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center opacity-70"
          >
            <span className="font-cartoon text-black text-[10px] tracking-[0.3em] mb-1 opacity-80">SCROLL DOWN</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-black">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
