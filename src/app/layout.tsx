import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://iliked.in'),
  title: {
    template: '%s | I LIKED',
    default: 'I LIKED | Premium Oversized Streetwear',
  },
  description: "Modern oversized streetwear clothing brand. Shop premium graphic tees, hoodies, and aesthetic daily wear.",
  keywords: ["streetwear", "oversized tees", "graphic tees", "I LIKED", "clothing brand", "aesthetic wear", "fashion"],
  authors: [{ name: "I LIKED" }],
  creator: "I LIKED",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://iliked.in",
    title: "I LIKED | Premium Oversized Streetwear",
    description: "Modern oversized streetwear clothing brand. Shop premium graphic tees and aesthetic daily wear.",
    siteName: "I LIKED",
    images: [{
      url: "https://iliked.in/images/logo.png",
      width: 1200,
      height: 630,
      alt: "I LIKED Streetwear"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "I LIKED | Premium Oversized Streetwear",
    description: "Modern oversized streetwear clothing brand.",
    images: ["https://iliked.in/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  }
};

import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate layout every 60 seconds

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch maintenance mode state
  const { data: settings } = await supabase.from('settings').select('maintenance_mode').single();
  const isMaintenanceMode = settings?.maintenance_mode || false;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'I LIKED',
    url: 'https://iliked.in',
    logo: 'https://iliked.in/images/logo.png',
    sameAs: [
      'https://instagram.com/iliked.in'
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfit.variable} antialiased font-sans overflow-x-hidden max-w-[100vw]`}>
        <LayoutWrapper isMaintenanceMode={isMaintenanceMode}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
