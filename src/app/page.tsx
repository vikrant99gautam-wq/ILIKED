import Hero from "@/components/Hero";
import CurrentlyLiked from "@/components/CurrentlyLiked";
import Moods from "@/components/Moods";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CurrentlyLiked />
      <Moods />
    </main>
  );
}
