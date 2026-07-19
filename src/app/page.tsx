import Hero from "@/components/Hero";
import CurrentlyLiked from "@/components/CurrentlyLiked";
import Moods from "@/components/Moods";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Preloader />
      <Hero />
      <CurrentlyLiked />
      <Moods />
    </main>
  );
}
