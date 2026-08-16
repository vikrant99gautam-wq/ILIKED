"use client";
import Image from "next/image";

export default function ModelFlipbook({ initialHeroImage }: { initialHeroImage?: string }) {
  const heroImage = initialHeroImage || "/images/model-anim-1.png";

  return (
    <div className="relative w-full h-full z-30 flex justify-center items-end pb-0 md:pb-4 overflow-visible group">
      
      {/* Single Static Image */}
      <div className="absolute inset-0 w-full h-full flex justify-center items-end z-10">
        <Image 
          src={heroImage} 
          alt="I LIKED Primary Model"
          width={1000}
          height={1000}
          priority
          sizes="(max-width: 768px) 100vw, 50vw" 
          className="absolute w-full md:w-[95%] h-[85%] md:h-[90%] object-contain object-bottom pointer-events-none p-4 opacity-100 z-20 transition-all duration-700 ease-in-out"
          style={{
            // Stacked blurred white shadows create a perfectly smooth, rounded solid outline
            filter: 'drop-shadow(0 0 6px #fff) drop-shadow(0 0 6px #fff) drop-shadow(0 0 6px #fff) drop-shadow(0 0 6px #fff) drop-shadow(0px 0px 15px rgba(0,0,0,0.5))'
          }}
        />
      </div>
      
    </div>
  );
}
