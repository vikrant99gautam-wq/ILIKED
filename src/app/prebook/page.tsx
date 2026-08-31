import ShopGrid from "@/components/ShopGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-Order Exclusive Streetwear Drops | Limited Edition Tees | I LIKED™",
  description: "Pre-order upcoming limited edition oversized streetwear from I LIKED™. Secure your drops early with an instant 5% discount and priority dispatch.",
  alternates: {
    canonical: 'https://iliked.in/prebook',
  },
  keywords: [
    "pre-book streetwear India",
    "pre-order graphic tees",
    "limited drop streetwear",
    "exclusive streetwear prebook",
    "I LIKED pre-order",
    "early bird streetwear discount"
  ],
  openGraph: {
    title: "Pre-Order Exclusive Streetwear Drops | I LIKED™",
    description: "Pre-order upcoming limited edition streetwear. Secure your drop early with 5% off & priority shipping.",
    url: "https://iliked.in/prebook",
    siteName: "I LIKED™",
    images: [{
      url: "https://iliked.in/images/logo.png",
      width: 1200,
      height: 630,
      alt: "I LIKED™ Pre-Book Drops"
    }],
  },
};

export default function PrebookPage() {
  return (
    <main className="min-h-screen">
      <ShopGrid filterMode="preorder" />
    </main>
  );
}
