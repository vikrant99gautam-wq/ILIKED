import Hero from "@/components/Hero";
import CurrentlyLiked from "@/components/CurrentlyLiked";
import Moods from "@/components/Moods";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Hero />
      
      {/* Dynamic Scrolling Marquee */}
      <div className="w-full bg-[#FFD700] border-y-[4px] border-black py-3 overflow-hidden flex whitespace-nowrap relative z-30 transform -rotate-1 origin-left scale-105 my-8 shadow-[0_8px_0_#111]">
        <div className="animate-marquee flex gap-8 font-black tracking-[0.2em] text-black text-xl uppercase">
          <span>★ OVERSIZED FITS</span>
          <span>★ STAY FRESH</span>
          <span>★ PREMIUM COTTON</span>
          <span>★ LIMITED DROPS</span>
          <span>★ STREETWEAR ESSENTIALS</span>
          <span>★ OVERSIZED FITS</span>
          <span>★ STAY FRESH</span>
          <span>★ PREMIUM COTTON</span>
          <span>★ LIMITED DROPS</span>
          <span>★ STREETWEAR ESSENTIALS</span>
        </div>
      </div>

      <CurrentlyLiked />
      <Moods />
    </main>
  );
}
