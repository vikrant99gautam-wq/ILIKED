import ShopGrid from "@/components/ShopGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pre-Book Products | I LIKED",
  description: "Pre-order upcoming premium streetwear from I LIKED. Secure your piece before it drops.",
  alternates: {
    canonical: 'https://iliked.in/prebook',
  },
  keywords: ["pre-book streetwear", "pre-order tees", "upcoming drops", "I LIKED pre-book"],
};

export default function PrebookPage() {
  return (
    <main className="min-h-screen">
      <ShopGrid filterMode="preorder" />
    </main>
  );
}
