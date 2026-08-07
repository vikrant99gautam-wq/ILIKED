"use client";
import { useState, useEffect } from "react";

export default function ModelFlipbook() {
  const [heroImage, setHeroImage] = useState("/images/model-anim-1.png");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data && data.hero_image) {
          setHeroImage(data.hero_image);
        }
      } catch (err) {
        console.error("Failed to load hero image from settings:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="relative w-full h-full z-30 flex justify-center items-end pb-0 md:pb-4 overflow-visible group">
      
      {/* Single Static Image */}
      <div className="absolute inset-0 w-full h-full flex justify-center items-end z-10">
        <img 
          src={heroImage} 
          alt="I LIKED Primary Model" 
          className="absolute w-full md:w-[95%] h-[105%] object-contain object-bottom pointer-events-none p-4 opacity-100 z-20 transition-all duration-700 ease-in-out"
          style={{
            // Stacked blurred white shadows create a perfectly smooth, rounded solid outline
            filter: 'drop-shadow(0 0 6px #fff) drop-shadow(0 0 6px #fff) drop-shadow(0 0 6px #fff) drop-shadow(0 0 6px #fff) drop-shadow(0px 0px 15px rgba(0,0,0,0.5))'
          }}
        />
      </div>
      
    </div>
  );
}
