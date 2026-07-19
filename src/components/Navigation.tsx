"use client";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 h-[76px] flex items-center ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-100/20 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center text-[var(--color-primary-black)]">
        {/* Brand Logo */}
        <a href="/" className="relative flex items-center hover:scale-105 transition-transform">
          <img 
            src="/images/logo.png?v=3" 
            alt="I LIKED Logo" 
            className="h-[50px] md:h-[60px] w-auto object-contain origin-left"
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-[14px] font-black tracking-widest text-black">
          <a href="/shop" className="bg-white border-[3px] border-black shadow-[4px_4px_0_#111] px-5 py-2 hover:-translate-y-1 hover:shadow-[6px_6px_0_#111] hover:bg-[var(--color-coral-red)] hover:text-white transition-all uppercase">SHOP</a>
          <a href="/moods" className="bg-white border-[3px] border-black shadow-[4px_4px_0_#111] px-5 py-2 hover:-translate-y-1 hover:shadow-[6px_6px_0_#111] hover:bg-[#19B85A] hover:text-white transition-all uppercase">MOODS</a>
          <a href="/story" className="bg-white border-[3px] border-black shadow-[4px_4px_0_#111] px-5 py-2 hover:-translate-y-1 hover:shadow-[6px_6px_0_#111] hover:bg-[var(--color-electric-blue)] hover:text-white transition-all uppercase">OUR STORY</a>
          <a href="/bag" className="cartoon-btn px-6 py-2 bg-[var(--color-electric-blue)] text-white flex items-center gap-2 ml-4">
            BAG (0) <span className="w-3 h-3 rounded-full bg-[var(--color-coral-red)] border-2 border-black block"></span>
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-4 text-[13px] font-black tracking-widest text-black">
           <a href="/bag" className="cartoon-btn px-4 py-1.5 bg-[var(--color-electric-blue)] text-white flex items-center gap-2">
            BAG <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-coral-red)] border border-black block"></span>
          </a>
          <button className="flex flex-col gap-[5px] justify-center h-10 w-10 bg-black items-center cartoon-btn">
            <span className="w-5 h-[3px] bg-white block"></span>
            <span className="w-5 h-[3px] bg-white block"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
