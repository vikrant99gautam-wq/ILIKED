"use client";
import { useState, useEffect } from "react";
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
    <section className="relative w-full bg-[#f4f4f0] pt-20 pb-32 px-6 md:px-12 flex flex-col items-center border-t-[8px] border-black overflow-hidden">
      
      {/* Pop-Art Polka Dot Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#111 3px, transparent 3px)', backgroundSize: '32px 32px' }}
      ></div>

      {/* Title Section */}
      <div className="w-full flex flex-col items-center justify-center pt-10 md:pt-20 px-4 mb-6 md:mb-10 z-10 relative">
        <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_#111] px-4 py-1 rotate-[-2deg] mb-4">
          <span className="font-sans font-black text-[var(--color-electric-blue)] tracking-[0.2em] text-sm">NOW SHOWING</span>
        </div>
        
        <h2 className="font-cartoon text-5xl md:text-8xl text-[#FFD700] flex flex-col items-center leading-[0.8] mb-4 md:mb-8" style={{ WebkitTextStroke: '2px #111', textShadow: '4px 4px 0 #111' }}>
          <span>CURRENTLY</span>
          <span className="text-white ml-8 md:ml-16 rotate-[2deg]">
            LIKED<span className="text-[var(--color-coral-red)]">!</span>
          </span>
        </h2>
        
        <Link 
          href="/shop" 
          className="group relative inline-flex items-center justify-center bg-[#FFD700] border-[4px] border-black px-8 py-3 w-full max-w-[400px] shadow-[6px_6px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-y-1 hover:translate-x-1 transition-all"
        >
          <span className="font-cartoon text-black text-xl tracking-widest">VIEW ALL LIKES</span>
          <span className="ml-3 font-bold group-hover:translate-x-2 transition-transform">→</span>
        </Link>
      </div>

      {/* 4-Column Cartoon Grid */}
      <div className="w-full max-w-[1440px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 z-10 relative">
        {products.map((product) => (
          <div key={product.id} onClick={() => window.location.href = `/shop/${product.id}`} className="group cursor-pointer flex flex-col relative">
            
            {/* Hover Background Shadow Effect */}
            <div className="absolute inset-0 bg-black rounded-[20px] top-6 left-6 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>

            {/* Image Placeholder Box */}
            <div className={`w-full aspect-[4/5] ${product.bgColor} border-[4px] border-black shadow-[8px_8px_0_#111] rounded-[24px] mb-6 overflow-hidden relative group-hover:-translate-y-4 group-hover:-rotate-3 group-hover:shadow-[12px_12px_0_#111] transition-all duration-300`}>
              
              {/* Image Box */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-500">
                <img src={product.image} alt={product.name} className="w-[90%] h-[90%] object-contain drop-shadow-[4px_4px_0_#111] z-10" />
              </div>
              
              {/* Sticker Tag */}
              <div className="absolute top-4 left-4 bg-white px-4 py-1 text-[14px] font-cartoon tracking-widest text-black border-[3px] border-black shadow-[4px_4px_0px_#111] rotate-[-4deg] group-hover:rotate-[2deg] transition-transform">
                {product.tag}
              </div>
            </div>

            {/* Product Details (Pop-Art Style) */}
            <div className="flex flex-col w-full px-2 group-hover:translate-x-1 transition-transform duration-300">
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col">
                  <span className="text-[20px] xl:text-[24px] font-cartoon tracking-widest text-black leading-none">{product.name}</span>
                  <span className="text-[10px] xl:text-[12px] font-black text-black mt-2 tracking-widest uppercase border-[2px] border-black bg-white w-fit px-2 py-0.5 shadow-[2px_2px_0px_#111] rotate-[1deg]">{product.color}</span>
                </div>
                <span className="text-[18px] xl:text-[20px] font-cartoon tracking-widest text-white bg-[var(--color-coral-red)] border-[3px] border-black px-3 py-1 shadow-[4px_4px_0px_#111] rotate-[3deg] group-hover:rotate-[-2deg] transition-transform">${product.price}</span>
              </div>
              <FOMOBar stockLeft={product.stock} />
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
