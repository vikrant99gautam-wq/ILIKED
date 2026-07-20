"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FOMOBar from "@/components/FOMOBar";

export default function CurrentlyLiked() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        // Only show featured products
        setProducts(data.filter((p: any) => p.featured).slice(0, 4));
      });
  }, []);

  return (
    <section className="relative w-full bg-[#f4f4f0] bg-paper-noise pt-20 pb-32 px-6 md:px-12 flex flex-col items-center border-t-[8px] border-black overflow-hidden">
      
      {/* Pop-Art Polka Dot Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#111 3px, transparent 3px)', backgroundSize: '32px 32px' }}
      ></div>

      {/* Decorative Doodles */}
      <div className="hidden md:block absolute top-[10%] left-[10%] md:left-[20%] w-12 h-12 md:w-16 md:h-16 opacity-40 pointer-events-none rotate-12">
         <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill="#FFD700" stroke="#111" strokeWidth="4" />
         </svg>
      </div>
      <div className="hidden md:block absolute top-[15%] right-[10%] md:right-[20%] w-8 h-8 md:w-12 md:h-12 opacity-50 pointer-events-none -rotate-12">
         <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 50 Q50 20 80 50 Q50 80 20 50" stroke="var(--color-electric-blue)" strokeWidth="8" strokeLinecap="round" />
            <circle cx="50" cy="50" r="8" fill="var(--color-coral-red)" />
         </svg>
      </div>

      {/* Title Section */}
      <div className="w-full flex flex-col items-center justify-center pt-10 md:pt-20 px-4 mb-10 md:mb-12 z-10 relative mt-4">
        <motion.div 
          whileHover={{ rotate: -5, scale: 1.05 }}
          className="bg-white border-[3px] border-black shadow-[4px_4px_0_#111] px-4 py-1 rotate-[-2deg] mb-8 md:mb-8 cursor-default"
        >
          <span className="font-sans font-black text-[var(--color-electric-blue)] tracking-[0.2em] text-sm">NOW SHOWING</span>
        </motion.div>
        
        <motion.h2 
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="font-cartoon text-6xl md:text-8xl text-[#FFD700] flex flex-col items-center leading-none md:leading-[0.8] mb-10 md:mb-12" 
          style={{ WebkitTextStroke: '2px #111', textShadow: '4px 4px 0 #111' }}
        >
          <span>CURRENTLY</span>
          <span className="text-white ml-8 md:ml-16 rotate-[2deg] mt-2 md:mt-0 relative">
            LIKED<span className="text-[var(--color-coral-red)]">!</span>
            {/* Tiny underline squiggle */}
            <svg className="absolute -bottom-4 left-0 w-full h-4 opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="#111" strokeWidth="4" />
            </svg>
          </span>
        </motion.h2>
        
        <button 
          onClick={() => window.location.href = '/shop'}
          className="cartoon-btn group relative inline-flex items-center justify-center bg-[#FFD700] px-8 py-3 w-full max-w-[400px]"
        >
          <span className="font-cartoon text-black text-xl tracking-widest">VIEW ALL LIKES</span>
          <span className="ml-3 font-bold group-hover:translate-x-2 transition-transform">→</span>
        </button>
      </div>

      {/* 4-Column Cartoon Grid */}
      <div className="w-full max-w-[1440px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 z-10 relative mx-auto">
        {products.map((product) => (
          <div key={product.id} onClick={() => window.location.href = `/shop/${product.id}`} className="cartoon-card cursor-pointer flex flex-col relative bg-white bg-paper-noise p-4 pb-6 group">
            
            {/* Image Placeholder Box */}
            <div className={`w-full aspect-[4/5] ${product.bgColor} border-[4px] border-black shadow-inner mb-6 overflow-hidden relative`}>
              
              {/* Image Box */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-105 transition-transform duration-500">
                <img src={product.image ? product.image.split(',')[0].trim() : ''} alt={product.name} className="w-[115%] h-[115%] object-contain drop-shadow-[6px_6px_0_#111] z-10" />
              </div>
              
              {/* Sticker Tag */}
              <div className="absolute top-4 left-4 bg-white px-4 py-1 text-[14px] font-cartoon tracking-widest text-black border-[3px] border-black shadow-[4px_4px_0px_#111] rotate-[-6deg] group-hover:rotate-[0deg] transition-transform">
                {product.tag}
              </div>
            </div>

            {/* Product Details (Pop-Art Style) */}
            <div className="flex flex-col w-full group-hover:translate-x-1 transition-transform duration-300">
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col">
                  <span className="text-[20px] xl:text-[24px] font-cartoon tracking-widest text-black leading-tight group-hover:text-[var(--color-electric-blue)] transition-colors">{product.name}</span>
                  <span className="text-[10px] xl:text-[12px] font-black text-black mt-2 tracking-widest uppercase border-[2px] border-black bg-white w-fit px-2 py-0.5 shadow-[2px_2px_0px_#111] rotate-[1deg]">{product.color}</span>
                </div>
                <div className="relative">
                   <span className="relative z-10 text-[18px] xl:text-[20px] font-cartoon tracking-widest text-white bg-[var(--color-coral-red)] border-[3px] border-black px-3 py-1 shadow-[4px_4px_0px_#111] rotate-[6deg] group-hover:rotate-[-2deg] transition-transform block">₹{product.price}</span>
                </div>
              </div>
              <FOMOBar stockLeft={product.stock} />
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
