"use client";
import { motion } from "framer-motion";

export default function FOMOBar({ stockLeft, maxStock = 20 }: { stockLeft: number, maxStock?: number }) {
  // If stock is high, don't show the FOMO bar
  if (stockLeft > 15) return null; 

  const percentage = Math.max(5, (stockLeft / maxStock) * 100);
  const isCritical = stockLeft <= 3;

  return (
    <div className="w-full mt-4 flex flex-col gap-1.5 relative z-20">
      <div className="flex justify-between items-end">
        <motion.span 
          className="font-black text-[10px] tracking-widest uppercase bg-black text-white px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_#111]"
          animate={isCritical ? { scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] } : {}}
          transition={isCritical ? { repeat: Infinity, duration: 0.4 } : {}}
          style={isCritical ? { backgroundColor: 'var(--color-coral-red)' } : {}}
        >
          {isCritical ? `ONLY ${stockLeft} LEFT G!` : "SELLING FAST"}
        </motion.span>
      </div>
      
      {/* The Health Bar */}
      <div className="w-full h-4 border-[3px] border-black bg-white p-[2px] shadow-[3px_3px_0_#111] overflow-hidden">
        <motion.div 
          className={`h-full border-r-[2px] border-black ${isCritical ? 'bg-[var(--color-coral-red)]' : 'bg-[#FFD700]'}`}
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
          }}
          initial={{ width: "100%" }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.4, delay: 0.2 }}
        />
      </div>
    </div>
  );
}
