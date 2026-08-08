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

      <CurrentlyLiked />
      <Moods 
        image1={settings?.collection_image_1} 
        image2={settings?.collection_image_2} 
        image3={settings?.collection_image_3} 
      />
    </main>
  );
}
