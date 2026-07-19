import MoodsGallery from "@/components/MoodsGallery";

export const metadata = {
  title: "Moods & Archive | I LIKED",
  description: "Explore the culture, style, and archive of I LIKED.",
};

export default function MoodsPage() {
  return (
    <main className="min-h-screen">
      <MoodsGallery />
    </main>
  );
}
