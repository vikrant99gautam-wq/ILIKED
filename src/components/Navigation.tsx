"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 h-[76px] flex items-center ${
          scrolled || isMobileMenuOpen ? "bg-white/95 backdrop-blur-md border-b border-black shadow-[0_4px_0_#111]" : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center text-[var(--color-primary-black)]">
          {/* Brand Logo */}
          <Link href="/" className="relative flex items-center hover:scale-105 transition-transform z-[110]" onClick={() => setIsMobileMenuOpen(false)}>
            <img 
              src="/images/logo.png?v=3" 
              alt="I LIKED Logo" 
              className="h-[50px] md:h-[60px] w-auto object-contain origin-left"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-[14px] font-black tracking-widest text-black">
            <Link href="/shop" className="bg-white border-[3px] border-black shadow-[4px_4px_0_#111] px-5 py-2 hover:-translate-y-1 hover:shadow-[6px_6px_0_#111] hover:bg-[var(--color-coral-red)] hover:text-white transition-all uppercase">SHOP</Link>
            <Link href="/moods" className="bg-white border-[3px] border-black shadow-[4px_4px_0_#111] px-5 py-2 hover:-translate-y-1 hover:shadow-[6px_6px_0_#111] hover:bg-[#19B85A] hover:text-white transition-all uppercase">MOODS</Link>
            <Link href="/story" className="bg-white border-[3px] border-black shadow-[4px_4px_0_#111] px-5 py-2 hover:-translate-y-1 hover:shadow-[6px_6px_0_#111] hover:bg-[var(--color-electric-blue)] hover:text-white transition-all uppercase">OUR STORY</Link>
            <Link href="/bag" className="cartoon-btn px-6 py-2 bg-[var(--color-electric-blue)] text-white flex items-center gap-2 ml-4">
              BAG (0) <span className="w-3 h-3 rounded-full bg-[var(--color-coral-red)] border-2 border-black block"></span>
            </Link>
          </div>

          {/* Mobile Menu Toggle & Cart */}
          <div className="flex md:hidden items-center gap-4 text-[13px] font-black tracking-widest text-black z-[200]">
             <Link href="/bag" onClick={() => setIsMobileMenuOpen(false)} className="cartoon-btn px-4 py-1.5 bg-[var(--color-electric-blue)] text-white flex items-center gap-2">
              BAG <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-coral-red)] border border-black block"></span>
            </Link>
            <div 
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="flex flex-col gap-[5px] justify-center h-10 w-10 bg-black items-center cartoon-btn relative z-[200] cursor-pointer"
              style={{ touchAction: "manipulation" }}
            >
              <span className={`w-5 h-[3px] bg-white block transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-[4px]" : ""}`}></span>
              <span className={`w-5 h-[3px] bg-white block transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`}></span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-[#F4F4F0] flex flex-col items-center justify-center pt-20 pointer-events-auto transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6 w-full px-8 text-center">
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-white border-[4px] border-black shadow-[6px_6px_0_#111] py-4 text-3xl font-cartoon tracking-widest hover:bg-[var(--color-coral-red)] hover:text-white transition-colors">
            SHOP
          </Link>
          <Link href="/moods" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-white border-[4px] border-black shadow-[6px_6px_0_#111] py-4 text-3xl font-cartoon tracking-widest hover:bg-[#19B85A] hover:text-white transition-colors">
            MOODS
          </Link>
          <Link href="/story" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-white border-[4px] border-black shadow-[6px_6px_0_#111] py-4 text-3xl font-cartoon tracking-widest hover:bg-[var(--color-electric-blue)] hover:text-white transition-colors">
            OUR STORY
          </Link>
        </div>
        
        <div className="mt-12 opacity-50 font-black tracking-widest text-sm uppercase">
          STAY FRESH
        </div>
      </div>
    </>
  );
}
