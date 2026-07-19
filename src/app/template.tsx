"use client";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25, 
      }}
      className="w-full h-full origin-center"
    >
      {children}
    </motion.div>
  );
}
