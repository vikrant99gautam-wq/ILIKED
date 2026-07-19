"use client";
import { motion } from "framer-motion";

const MOODS_DATA = [
  { id: 1, image: "/images/model-anim-1.png", label: "STREET VIBE", rotate: "rotate-[-3deg]", color: "bg-[#FFD700]" },
  { id: 2, image: "/images/primary-model.png", label: "STUDIO DROP", rotate: "rotate-[2deg]", color: "bg-[#E5F1F9]" },
  { id: 3, image: "/images/model-anim-2.png", label: "ARCHIVE", rotate: "rotate-[-4deg]", color: "bg-[var(--color-coral-red)]" },
  { id: 4, image: "/images/model-anim-3.png", label: "LIFESTYLE", rotate: "rotate-[5deg]", color: "bg-[#19B85A]" },
  { id: 5, image: "/images/secondary-model.png", label: "CLASSICS", rotate: "rotate-[-2deg]", color: "bg-[#E5F1F9]" },
  { id: 6, image: "/images/primary-model.png", label: "NEW GEN", rotate: "rotate-[3deg]", color: "bg-[var(--color-electric-blue)]" },
  { id: 7, image: "/images/model-anim-1.png", label: "RAW", rotate: "rotate-[-5deg]", color: "bg-[#FFD700]" },
  { id: 8, image: "/images/model-anim-2.png", label: "CULTURE", rotate: "rotate-[4deg]", color: "bg-[var(--color-coral-red)]" },
];

export default function MoodsGallery() {
  return (
    <section className="relative w-full min-h-screen bg-[#F4F4F0] pt-[120px] pb-32 px-6 md:px-12">
      
      {/* Background Graphic */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none z-0 opacity-10">
        <h1 className="font-cartoon text-[20vw] leading-none text-black tracking-widest text-center whitespace-nowrap rotate-[-5deg]">
          ARCHIVE
        </h1>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-cartoon text-6xl md:text-8xl text-black tracking-widest drop-shadow-[4px_4px_0_var(--color-electric-blue)]">
            THE ARCHIVE
          </h2>
          <p className="font-black text-black text-lg tracking-widest uppercase mt-4">
            Visuals, culture, and raw streetwear.
          </p>
        </div>

        {/* Clean Structured Grid with slight rotations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
          {MOODS_DATA.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
              key={item.id}
              className={`relative bg-white border-[4px] border-black p-4 shadow-[12px_12px_0_#111] hover:shadow-[16px_16px_0_#111] transition-all duration-300 ${item.rotate} group cursor-pointer`}
            >
              {/* Tape */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/80 border-[3px] border-black rotate-[-5deg] z-10 shadow-[2px_2px_0_#111]"></div>
              
              {/* Image Container */}
              <div className={`relative w-full aspect-[4/5] ${item.color} border-[3px] border-black overflow-hidden flex items-center justify-center`}>
                <img 
                  src={item.image} 
                  alt={item.label}
                  className="absolute w-full h-full object-contain drop-shadow-[4px_4px_0_#111] scale-[1.2] group-hover:scale-[1.3] transition-transform duration-500"
                />
                
                {/* Shop Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a href="/shop" className="bg-[#FFD700] border-[3px] border-black px-6 py-2 rotate-[-5deg] shadow-[4px_4px_0_#111]">
                    <span className="font-black text-black uppercase tracking-widest">Shop Look ↗</span>
                  </a>
                </div>
              </div>

              {/* Label */}
              <div className="mt-4 text-center">
                <span className="font-cartoon text-2xl text-black tracking-widest uppercase">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
