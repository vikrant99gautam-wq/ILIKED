import ShopGrid from "@/components/ShopGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Oversized Graphic Tees & Streetwear | I LIKED™",
  description: "Explore our full catalog of premium oversized graphic tees, optic wash drop-shoulder shirts, and limited streetwear drops. High GSM heavyweight fabric, bold aesthetics & all-India COD.",
  alternates: {
    canonical: 'https://iliked.in/shop',
  },
  keywords: [
    "shop streetwear India",
    "buy oversized graphic tees",
    "drop shoulder t shirts online",
    "optic wash tees",
    "heavyweight graphic tees",
    "I LIKED clothing shop",
    "aesthetic streetwear apparel"
  ],
  openGraph: {
    title: "Shop All Oversized Graphic Tees & Streetwear | I LIKED™",
    description: "Explore our full catalog of premium oversized graphic tees, optic wash shirts, and limited streetwear drops.",
    url: "https://iliked.in/shop",
    siteName: "I LIKED™",
    images: [{
      url: "https://iliked.in/images/logo.png",
      width: 1200,
      height: 630,
      alt: "I LIKED™ Shop"
    }],
  },
};

export default function ShopPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'I LIKED™ Streetwear Shop',
    url: 'https://iliked.in/shop',
    description: 'Shop oversized streetwear, heavyweight graphic tees, and aesthetic apparel in India.',
    isPartOf: {
      '@type': 'WebSite',
      name: 'I LIKED™',
      url: 'https://iliked.in',
    },
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <ShopGrid />
    </main>
  );
}
