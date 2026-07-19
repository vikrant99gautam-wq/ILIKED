import Link from "next/link";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r-[4px] border-black flex flex-col shrink-0">
        <div className="h-20 border-b-[4px] border-black flex items-center justify-center bg-black text-white">
          <span className="font-cartoon text-3xl tracking-widest">I LIKED ADMIN</span>
        </div>
        
        <nav className="flex-1 flex flex-col pt-8">
          <Link href="/admin" className="px-8 py-4 font-black tracking-widest uppercase text-black hover:bg-[var(--color-electric-blue)] hover:text-white border-b-[2px] border-black/10 transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/products" className="px-8 py-4 font-black tracking-widest uppercase text-black hover:bg-[var(--color-coral-red)] hover:text-white border-b-[2px] border-black/10 transition-colors">
            Products
          </Link>
          <Link href="/admin/orders" className="px-8 py-4 font-black tracking-widest uppercase text-black hover:bg-[#FFD700] border-b-[2px] border-black/10 transition-colors">
            Orders
          </Link>
          <Link href="/admin/settings" className="px-8 py-4 font-black tracking-widest uppercase text-black hover:bg-black hover:text-white transition-colors">
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t-[4px] border-black">
          <Link href="/" className="w-full cartoon-btn py-3 bg-black text-white text-center block text-sm">
            BACK TO STORE
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
