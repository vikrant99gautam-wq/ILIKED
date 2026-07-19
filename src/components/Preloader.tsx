"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Preloader() {
  const [isOn, setIsOn] = useState(false);
  const [phase, setPhase] = useState(0); // 0: Flickering, 1: Solid On, 2: Fading out
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Check if we've already shown the preloader in this session
    if (sessionStorage.getItem("hasSeenPreloader")) {
      setPhase(3); // Skip straight to unmounted phase
      setHasChecked(true);
      return;
    }
    
    // Mark as seen
    sessionStorage.setItem("hasSeenPreloader", "true");
    setHasChecked(true);

    // Realistic Neon Flicker Sequence
    const t1 = setTimeout(() => setIsOn(true), 300);
    const t2 = setTimeout(() => setIsOn(false), 400);
    const t3 = setTimeout(() => setIsOn(true), 500);
    const t4 = setTimeout(() => setIsOn(false), 700);
    const t5 = setTimeout(() => setIsOn(true), 800);
    const t6 = setTimeout(() => setIsOn(false), 850);
    
    // Turns on fully and solidly
    const t7 = setTimeout(() => {
      setIsOn(true);
      setPhase(1);
    }, 1200);

    // After sitting fully on for a moment, fade out the preloader
    const t8 = setTimeout(() => {
      setPhase(2);
    }, 2400); 

    // Unmount completely after the fade-out animation (0.8s) finishes
    const t9 = setTimeout(() => {
      setPhase(3);
    }, 3200); 

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); 
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); 
      clearTimeout(t7); clearTimeout(t8); clearTimeout(t9);
    }
  }, []);

  if (phase === 3 || !hasChecked) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none"
      // Pitch black background (No bricks)
      style={{ backgroundColor: "#050505" }}
      initial={{ opacity: 1 }}
      animate={phase === 2 ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      
      {/* Subtle vignette/dark edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-0"></div>

      {/* The Neon Sign */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Support brackets/wires (subtle detail behind the sign) */}
        <div className="absolute top-1/2 left-1/4 w-full h-[2px] bg-zinc-900 -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 right-1/4 w-full h-[2px] bg-zinc-900 -translate-y-1/2 z-0"></div>
        <div className="absolute -top-10 left-1/4 w-[2px] h-32 bg-zinc-900 z-0"></div>
        <div className="absolute -top-10 right-1/4 w-[2px] h-32 bg-zinc-900 z-0"></div>

        <h1 
          className="font-cartoon text-6xl md:text-[120px] tracking-widest relative z-10 transition-all duration-75"
          style={isOn ? {
            color: "#ffe6f2", // Bright white/pink core
            textShadow: `
              0 0 5px #ff0055,
              0 0 10px #ff0055,
              0 0 20px #ff0055,
              0 0 40px #ff0055,
              0 0 80px #ff0055,
              0 0 120px #ff0055
            `
          } : {
            color: "#1a0810", // Dull unlit red tube
            textShadow: "0 0 2px rgba(0,0,0,0.8)",
            boxShadow: "none"
          }}
        >
          I LIKED
        </h1>

        {/* Established text below */}
        <h2 
          className="font-sans font-black text-xl md:text-2xl mt-4 tracking-[0.3em] transition-all duration-75"
          style={isOn ? {
            color: "#e6f2ff", // Bright white/blue core
            textShadow: `
              0 0 5px #0088ff,
              0 0 10px #0088ff,
              0 0 20px #0088ff,
              0 0 40px #0088ff,
              0 0 80px #0088ff
            `
          } : {
            color: "#0a111a", // Dull unlit blue tube
            textShadow: "0 0 2px rgba(0,0,0,0.8)"
          }}
        >
          EST. 2024
        </h2>

        {/* Ambient glow behind the text that lights up the dark wall */}
        <motion.div 
          className="absolute inset-0 bg-[#ff0055] rounded-full blur-[100px] -z-10 mix-blend-screen"
          animate={{ opacity: isOn ? 0.2 : 0 }}
          transition={{ duration: 0.1 }}
        ></motion.div>

      </div>
    </motion.div>
  );
}
