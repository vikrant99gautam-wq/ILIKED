import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | I LIKED",
  description: "Learn about I LIKED. Wear what you like. We believe in high-quality streetwear that speaks for itself.",
};

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
