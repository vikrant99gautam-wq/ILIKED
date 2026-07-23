"use client";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ 
  children, 
  isMaintenanceMode = false 
}: { 
  children: React.ReactNode,
  isMaintenanceMode?: boolean 
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isMaintenanceMode && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center border-[8px] border-[#FFD700]">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-widest font-cartoon text-[#FFD700] mb-6">BRB.</h1>
        <p className="text-xl md:text-2xl font-bold text-white max-w-md uppercase tracking-wide">
          We are upgrading the store. We'll be back online shortly with some fresh heat.
        </p>
      </div>
    );
  }

  return (
    <>
      {!isAdmin && <Navigation />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
