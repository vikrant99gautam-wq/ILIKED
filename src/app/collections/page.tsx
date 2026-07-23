import Link from "next/link";
import { Metadata } from "next";
import MoodsGallery from "@/components/MoodsGallery";

export const metadata: Metadata = {
  title: "Collections | I LIKED",
  description: "Explore our curated streetwear collections. Exclusive drops and limited edition oversized apparel.",
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen">
      <MoodsGallery />
    </main>
  );
}
