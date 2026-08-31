import Link from "next/link";
import { Metadata } from "next";
import MoodsGallery from "@/components/MoodsGallery";

export const metadata: Metadata = {
  title: "Streetwear Collections & Drops | Normal, Oversized & Optic Wash | I LIKED™",
  description: "Explore our curated streetwear mood boards and drops: Normal Tees, Oversized Heavyweight Tees, and Optic Wash Acid Wash essentials.",
  alternates: {
    canonical: 'https://iliked.in/collections',
  },
  keywords: [
    "streetwear collections",
    "oversized tees collection",
    "optic wash drop",
    "acid wash streetwear",
    "I LIKED collections",
    "curated streetwear drops"
  ],
  openGraph: {
    title: "Streetwear Collections & Drops | I LIKED™",
    description: "Explore curated streetwear mood boards and limited edition drops by I LIKED™.",
    url: "https://iliked.in/collections",
    siteName: "I LIKED™",
    images: [{
      url: "https://iliked.in/images/logo.png",
      width: 1200,
      height: 630,
      alt: "I LIKED™ Collections"
    }],
  },
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen">
      <MoodsGallery />
    </main>
  );
}
