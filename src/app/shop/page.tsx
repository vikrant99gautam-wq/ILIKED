import ShopGrid from "@/components/ShopGrid";

export const metadata = {
  title: "Shop | I LIKED",
  description: "Browse the latest streetwear drops from I LIKED.",
};

export default function ShopPage() {
  return (
    <main className="min-h-screen">
      <ShopGrid />
    </main>
  );
}
