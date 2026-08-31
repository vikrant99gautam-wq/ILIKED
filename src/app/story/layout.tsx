import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story & Streetwear Manifesto | Born in Bhilai | I LIKED™",
  description: "The origin story of I LIKED™ streetwear. Born out of frustration with boring fits, crafted with heavyweight cotton, and made for those who demand to be noticed.",
  alternates: {
    canonical: 'https://iliked.in/story',
  },
  keywords: [
    "I LIKED brand story",
    "streetwear origin India",
    "streetwear manifesto",
    "Bhilai streetwear",
    "about I LIKED",
    "independent streetwear clothing brand"
  ],
  openGraph: {
    title: "Our Story & Streetwear Manifesto | I LIKED™",
    description: "We make what we like. No boring fits. Culture first. Discover the story behind I LIKED™.",
    url: "https://iliked.in/story",
    siteName: "I LIKED™",
    images: [{
      url: "https://iliked.in/images/secondary-model.png",
      width: 1200,
      height: 630,
      alt: "I LIKED™ Story & Origins"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story & Streetwear Manifesto | I LIKED™",
    description: "We make what we like. Discover the origin story of I LIKED™.",
    images: ["https://iliked.in/images/secondary-model.png"],
  },
};

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
