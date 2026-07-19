"use client";
import { motion } from "framer-motion";

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-[#F4F4F0] pt-[76px] overflow-hidden">
      
      {/* 1. Marquee Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] flex flex-col justify-center bg-[var(--color-electric-blue)] overflow-hidden border-b-[8px] border-black">
        {/* Halftone background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }}
        ></div>
        
        {/* Central Logo/Text */}
        <div className="relative z-10 flex flex-col items-center justify-center -rotate-2">
          <h1 className="font-cartoon text-[12vw] leading-none text-white tracking-widest drop-shadow-[8px_8px_0_#111]" style={{ WebkitTextStroke: '3px #111' }}>
            WE MAKE
          </h1>
          <h1 className="font-cartoon text-[12vw] leading-none text-[var(--color-coral-red)] tracking-widest drop-shadow-[8px_8px_0_#111]" style={{ WebkitTextStroke: '3px #111' }}>
            WHAT WE LIKE.
          </h1>
        </div>

        {/* Scrolling Tape Top */}
        <div className="absolute top-10 left-0 w-[120%] bg-[#FFD700] border-y-[4px] border-black py-3 rotate-[-3deg] -translate-x-10 z-20 overflow-hidden shadow-[0_8px_0_#111]">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="flex whitespace-nowrap"
          >
            {[...Array(10)].map((_, i) => (
              <span key={i} className="font-black text-black text-xl tracking-widest mx-4 uppercase">
                * THE STORY * NO BORING FITS 
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scrolling Tape Bottom */}
        <div className="absolute bottom-10 left-0 w-[120%] bg-white border-y-[4px] border-black py-3 rotate-[2deg] -translate-x-10 z-20 overflow-hidden shadow-[0_8px_0_#111]">
          <motion.div 
            animate={{ x: [-1000, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="flex whitespace-nowrap"
          >
            {[...Array(10)].map((_, i) => (
              <span key={i} className="font-black text-black text-xl tracking-widest mx-4 uppercase">
                * EST. 2024 * I LIKED 
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. The Origin (Split Layout) */}
      <section className="relative w-full py-32 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Image */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, x: -50, rotate: -10 }}
              whileInView={{ opacity: 1, x: 0, rotate: -4 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="relative bg-white border-[6px] border-black p-4 md:p-6 shadow-[16px_16px_0_#111] z-10"
            >
              <div className="w-full aspect-[4/5] bg-gray-200 border-[4px] border-black overflow-hidden relative">
                <img 
                  src="/images/secondary-model.png" 
                  alt="I LIKED Origins" 
                  className="absolute w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-[var(--color-electric-blue)] mix-blend-color opacity-50"></div>
              </div>
              <div className="absolute -top-8 right-10 w-24 h-12 bg-[#FFD700] border-[4px] border-black rotate-[12deg] shadow-[4px_4px_0_#111] flex items-center justify-center">
                <span className="font-cartoon text-xl">EST. 24</span>
              </div>
            </motion.div>
            
            {/* Background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--color-coral-red)] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] -z-10 blur-xl opacity-20 animate-pulse"></div>
          </div>

          {/* Right: Text */}
          <div className="w-full lg:w-1/2">
            <h2 className="font-cartoon text-6xl md:text-7xl text-black tracking-widest mb-8 drop-shadow-[4px_4px_0_var(--color-coral-red)]">
              HOW IT STARTED
            </h2>
            <div className="space-y-6 font-bold text-lg md:text-xl leading-relaxed text-gray-800">
              <p>
                We got tired of wearing the same boring, mass-produced basics that everyone else was wearing. The streets lacked color, personality, and that raw, unfiltered energy.
              </p>
              <p className="p-6 bg-white border-[4px] border-black shadow-[6px_6px_0_#111] rotate-[1deg] text-black">
                "We didn't start a brand to blend in. We started it because we couldn't find clothes that we actually liked."
              </p>
              <p>
                So, we bought a screen printer, hijacked some heavy-weight cotton blanks, and started making stuff for ourselves. When people on the street started asking where we got our fits, <span className="text-[var(--color-electric-blue)] font-black">I LIKED</span> was officially born.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. The Manifesto (Comic Panels) */}
      <section className="relative w-full py-32 bg-black px-6 md:px-12 border-t-[8px] border-white">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="text-center mb-20">
            <h2 className="font-cartoon text-6xl md:text-8xl text-white tracking-widest drop-shadow-[6px_6px_0_var(--color-electric-blue)]">
              THE MANIFESTO
            </h2>
            <p className="font-black text-white text-xl tracking-widest mt-4">OUR THREE RULES FOR SURVIVAL.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-12">
            
            {/* Panel 1 */}
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="bg-white border-[6px] border-white p-2"
            >
              <div className="w-full h-full bg-[var(--color-coral-red)] border-[4px] border-black p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white border-[4px] border-black rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0_#111]">
                  <span className="font-cartoon text-4xl">1</span>
                </div>
                <h3 className="font-cartoon text-4xl text-black mb-4">NO BORING FITS</h3>
                <p className="font-bold text-black text-lg">Life is too short to wear gray hoodies every day. Stand out or stay home.</p>
              </div>
            </motion.div>

            {/* Panel 2 */}
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="bg-white border-[6px] border-white p-2 mt-0 md:mt-12"
            >
              <div className="w-full h-full bg-[var(--color-electric-blue)] border-[4px] border-black p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white border-[4px] border-black rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0_#111]">
                  <span className="font-cartoon text-4xl">2</span>
                </div>
                <h3 className="font-cartoon text-4xl text-black mb-4">CULTURE FIRST</h3>
                <p className="font-bold text-black text-lg">We are shaped by the streets, the music, and the art. The clothes are just the canvas.</p>
              </div>
            </motion.div>

            {/* Panel 3 */}
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -1 }}
              className="bg-white border-[6px] border-white p-2 mt-0 md:mt-24"
            >
              <div className="w-full h-full bg-[#FFD700] border-[4px] border-black p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white border-[4px] border-black rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0_#111]">
                  <span className="font-cartoon text-4xl">3</span>
                </div>
                <h3 className="font-cartoon text-4xl text-black mb-4">WEAR WHAT YOU LIKE</h3>
                <p className="font-bold text-black text-lg">No trends. No rules. If you like it, rock it. That's the only approval you need.</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </main>
  );
}
