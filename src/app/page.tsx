import Hero from "@/components/Hero";
import CurrentlyLiked from "@/components/CurrentlyLiked";
import Moods from "@/components/Moods";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://iliked.in',
  },
};

export const revalidate = 0; // Force dynamic to always fetch the latest hero image

export default async function Home() {
  const { data: settings } = await supabase.from('settings').select('hero_image, collection_image_1, collection_image_2, collection_image_3').single();
  const heroImage = settings?.hero_image || "/images/model-anim-1.png";

  return (
    <main className="min-h-screen overflow-hidden">
      <Hero initialHeroImage={heroImage} />
      
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

      {/* Pre-book Banner Section */}
      <a href="/prebook" className="group block w-full bg-[var(--color-electric-blue)] border-y-[6px] border-black py-6 md:py-8 relative z-40 cursor-pointer overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '12px 12px' }}></div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 group-hover:scale-[1.02] transition-transform duration-300">
           <div className="flex flex-col items-center md:items-start text-center md:text-left">
             <span className="font-cartoon text-5xl md:text-7xl text-white tracking-widest drop-shadow-[4px_4px_0_#111] leading-none">NEW DROPS OUT!</span>
             <span className="font-black text-[#FFD700] text-xl md:text-2xl uppercase tracking-widest mt-2 drop-shadow-[2px_2px_0_#111]">PRE-BOOK NOW</span>
           </div>
           <div className="bg-[#FFD700] font-cartoon text-black text-2xl md:text-4xl px-8 py-4 border-[4px] border-black tracking-widest shadow-[6px_6px_0_#111] group-hover:shadow-[8px_8px_0_#111] group-hover:-translate-y-1 transition-all flex items-center gap-2">
             PRE-BOOK NOW <span className="font-black">→</span>
           </div>
        </div>
      </a>

      <CurrentlyLiked />
      <Moods 
        image1={settings?.collection_image_1} 
        image2={settings?.collection_image_2} 
        image3={settings?.collection_image_3} 
      />
    </main>
  );
}
