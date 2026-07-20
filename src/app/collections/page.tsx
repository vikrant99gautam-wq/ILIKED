import MoodsGallery from "@/components/MoodsGallery";

export const metadata = {
  title: "Collections & Archive | I LIKED",
  description: "Explore the collections and archive of I LIKED.",
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen">
      <MoodsGallery />
    </main>
  );
}
