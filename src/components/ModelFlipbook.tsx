"use client";
import { useState, useEffect, useCallback } from "react";

export default function ModelFlipbook() {
  const [frame, setFrame] = useState(0); // 0-indexed for easier translation math
  const totalFrames = 3;

  const nextFrame = useCallback(() => {
    setFrame((prev) => (prev + 1) % totalFrames);
  }, []);

  const prevFrame = () => {
    setFrame((prev) => (prev - 1 + totalFrames) % totalFrames);
  };

  useEffect(() => {
    // Automatic cross-fade every 3 seconds
    const interval = setInterval(nextFrame, 3000);
    return () => clearInterval(interval);
  }, [nextFrame]);

  return (
    <div className="relative w-full h-full z-30 flex justify-center items-end pb-0 md:pb-4 overflow-visible group">
      
      {/* Cross-Fade Images */}
      <div className="absolute inset-0 w-full h-full flex justify-center items-end z-10">
        {[1, 2, 3].map((num, idx) => (
          <img 
            key={num}
            src={`/images/model-anim-${num}.png`} 
            alt={`I LIKED Primary Model Frame ${num}`} 
            className={`absolute w-[90%] md:w-[85%] h-full object-contain object-bottom pointer-events-none transition-opacity duration-1000 ease-in-out ${frame === idx ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}
            style={{
              // Stacked blurred white shadows create a perfectly smooth, rounded solid outline
              filter: 'drop-shadow(0 0 6px #fff) drop-shadow(0 0 6px #fff) drop-shadow(0 0 6px #fff) drop-shadow(0 0 6px #fff) drop-shadow(0px 0px 15px rgba(0,0,0,0.5))'
            }}
          />
        ))}
      </div>

      {/* Navigation Buttons (Pop-Art Style) */}
      <div className="absolute right-[25%] md:right-[20%] bottom-8 z-40 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={prevFrame}
          className="bg-white border-[3px] border-black shadow-[4px_4px_0px_#111] p-3 hover:bg-[#FFD700] hover:scale-110 active:shadow-[0px_0px_0px_#111] active:translate-x-1 active:translate-y-1 transition-all pointer-events-auto flex items-center justify-center w-12 h-12"
        >
          <span className="font-black text-xl leading-none">←</span>
        </button>

        <button 
          onClick={nextFrame}
          className="bg-white border-[3px] border-black shadow-[4px_4px_0px_#111] p-3 hover:bg-[#FFD700] hover:scale-110 active:shadow-[0px_0px_0px_#111] active:translate-x-1 active:translate-y-1 transition-all pointer-events-auto flex items-center justify-center w-12 h-12"
        >
          <span className="font-black text-xl leading-none">→</span>
        </button>
      </div>
      
    </div>
  );
}
