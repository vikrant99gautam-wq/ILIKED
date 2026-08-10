"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingWhatsApp() {
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.whatsapp_number) {
          setWhatsappNumber(data.whatsapp_number);
        }
      })
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  if (!whatsappNumber) return null;

  const handleChat = () => {
    const formattedNumber = whatsappNumber.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/91${formattedNumber}`, "_blank");
  };

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleChat}
        className="fixed bottom-6 right-6 z-[99] bg-[#25D366] text-white p-4 rounded-full shadow-[4px_4px_0_#111] border-[3px] border-black flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp Icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.898-4.45 9.898-9.898 0-5.448-4.45-9.898-9.898-9.898-5.448 0-9.898 4.45-9.898 9.898 0 2.012.518 3.865 1.492 5.539l-1.069 3.904 4.083-1.039zm7.042-9.768c-.144-.319-.325-.333-.497-.333h-.425c-.172 0-.453.064-.69.319-.237.255-.905.885-.905 2.158 0 1.274.927 2.505 1.056 2.676.13.17 1.826 2.784 4.422 3.882 2.597 1.098 2.597.737 3.071.694.475-.042 1.539-.628 1.755-1.236.215-.609.215-1.132.143-1.236-.071-.106-.258-.17-.546-.312s-1.7-.842-1.966-.938c-.265-.096-.458-.142-.651.142-.193.284-.741.938-.908 1.13-.167.191-.334.212-.622.071-.288-.141-1.215-.448-2.316-1.428-.857-.764-1.434-1.706-1.606-1.998-.172-.292-.018-.45.126-.593.129-.129.288-.337.432-.505.143-.169.191-.29.287-.483.095-.193.048-.363-.024-.505-.072-.142-.651-1.57-.891-2.15z" />
        </svg>
        
        {/* Tooltip */}
        <div className="absolute right-[calc(100%+16px)] top-1/2 -translate-y-1/2 bg-white text-black font-black text-sm px-4 py-2 rounded-lg border-[3px] border-black shadow-[4px_4px_0_#111] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          NEED HELP? CHAT WITH US
          <div className="absolute top-1/2 -right-[7px] -translate-y-1/2 w-3 h-3 bg-white border-r-[3px] border-b-[3px] border-black rotate-[-45deg]"></div>
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
