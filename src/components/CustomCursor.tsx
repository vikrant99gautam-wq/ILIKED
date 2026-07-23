"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  const [isMobile, setIsMobile] = useState(true); // default true to prevent hydration mismatch before mount, or false, but let's use useEffect

  useEffect(() => {
    // Check if the device has a touch screen, if so we don't render custom cursor
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsMobile(true);
      document.body.style.cursor = "auto";
      return;
    } else {
      setIsMobile(false);
    }

    // Hide default cursor
    document.body.style.cursor = "none";

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' || 
        target.closest('a') || 
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = "auto";
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* The main following circle */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center font-black"
        animate={{
          x: mousePosition.x - (isHovering ? 32 : 16),
          y: mousePosition.y - (isHovering ? 32 : 16),
          width: isHovering ? 64 : 32,
          height: isHovering ? 64 : 32,
          backgroundColor: isHovering ? "var(--color-electric-blue)" : "transparent",
          borderColor: "black",
          borderWidth: isHovering ? "4px" : "3px",
          borderRadius: isHovering ? "0%" : "50%",
          rotate: isHovering ? 12 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28,
          mass: 0.5
        }}
        style={{
          boxShadow: isHovering ? '4px 4px 0 #111' : 'none'
        }}
      >
        {isHovering && (
          <motion.span 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white text-xs tracking-widest pointer-events-none"
          >
            CLICK
          </motion.span>
        )}
      </motion.div>

      {/* The tiny center dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[var(--color-coral-red)] border border-black rounded-full pointer-events-none z-[10000]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          opacity: isHovering ? 0 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 28,
          mass: 0.1
        }}
      />
    </>
  );
}
