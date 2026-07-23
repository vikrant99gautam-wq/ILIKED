import ShopGrid from "@/components/ShopGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products | I LIKED",
  description: "Browse our premium oversized streetwear collection. Graphic tees, hoodies, and essentials.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen">
      <ShopGrid />
    </main>
  );
}
