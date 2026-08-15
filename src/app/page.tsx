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

      {/* Pre-book Banner */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 mb-12 flex justify-center z-40 relative">
        <a href="/prebook" className="group">
          <div className="bg-[var(--color-electric-blue)] border-[4px] border-black shadow-[6px_6px_0_#111] group-hover:shadow-[8px_8px_0_#111] group-hover:-translate-y-1 transition-all px-6 py-3 md:px-8 md:py-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 rotate-1 cursor-pointer">
             <span className="font-cartoon text-2xl md:text-4xl text-white tracking-widest drop-shadow-[2px_2px_0_#111]">NEW DROPS OUT!</span>
             <span className="bg-[#FFD700] font-black text-black text-sm md:text-base px-4 py-1 border-[2px] border-black uppercase tracking-widest group-hover:scale-105 transition-transform shadow-[2px_2px_0_#111]">PRE-BOOK NOW →</span>
          </div>
        </a>
      </div>

      <CurrentlyLiked />
      <Moods 
        image1={settings?.collection_image_1} 
        image2={settings?.collection_image_2} 
        image3={settings?.collection_image_3} 
      />
    </main>
  );
}
