"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", label: "Dashboard", color: "hover:bg-[var(--color-electric-blue)]" },
    { href: "/admin/products", label: "Products", color: "hover:bg-[var(--color-coral-red)]" },
    { href: "/admin/orders", label: "Orders", color: "hover:bg-[#FFD700]" },
    { href: "/admin/reviews", label: "Reviews", color: "hover:bg-[#FF8C00]" },
    { href: "/admin/discounts", label: "Discounts", color: "hover:bg-[#19B85A]" },
    { href: "/admin/settings", label: "Settings", color: "hover:bg-black" },
  ];

  if (pathname.includes('/print') || pathname.includes('/login')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden h-20 bg-white border-b-[4px] border-black flex items-center justify-between px-6 z-50">
        <span className="font-cartoon text-3xl tracking-widest">ADMIN</span>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-12 h-12 bg-black flex flex-col items-center justify-center gap-1.5"
        >
          <span className={`w-6 h-[3px] bg-white transition-all ${isSidebarOpen ? "rotate-45 translate-y-[9px]" : ""}`}></span>
          <span className={`w-6 h-[3px] bg-white transition-all ${isSidebarOpen ? "opacity-0" : ""}`}></span>
          <span className={`w-6 h-[3px] bg-white transition-all ${isSidebarOpen ? "-rotate-45 -translate-y-[9px]" : ""}`}></span>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r-[4px] border-black flex flex-col shrink-0 z-50
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-20 border-b-[4px] border-black flex items-center justify-center bg-black text-white">
          <span className="font-cartoon text-3xl tracking-widest">I LIKED ADMIN</span>
        </div>
        
        <nav className="flex-1 flex flex-col pt-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={`px-8 py-4 font-black tracking-widest uppercase border-b-[2px] border-black/10 transition-colors
                  ${isActive ? 'bg-gray-100 text-black border-l-[6px] border-l-black' : `text-black ${link.color} hover:text-white border-l-[6px] border-l-transparent`}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-[4px] border-black">
          <Link href="/" className="w-full cartoon-btn py-3 bg-black text-white text-center block text-sm">
            BACK TO STORE
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 h-[calc(100vh-80px)] md:h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
