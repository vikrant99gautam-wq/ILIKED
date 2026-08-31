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
    template: '%s | I LIKED™',
    default: 'I LIKED™ | Premium Oversized Streetwear & Graphic Tees India',
  },
  description: "Shop premium oversized streetwear, heavyweight graphic tees, optic wash drop-shoulder t-shirts & limited drops. Designed for those who stand out. Fast all-India shipping & COD available.",
  keywords: [
    "I LIKED",
    "streetwear India",
    "oversized t-shirts India",
    "oversized graphic tees",
    "heavyweight cotton t-shirts",
    "drop shoulder tees",
    "optic wash streetwear",
    "aesthetic streetwear brand",
    "buy oversized tees online",
    "Indian streetwear clothing brand",
    "baggy fit graphic tees",
    "limited edition streetwear drops"
  ],
  authors: [{ name: "I LIKED", url: "https://iliked.in" }],
  creator: "I LIKED",
  publisher: "I LIKED",
  category: "clothing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://iliked.in',
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://iliked.in",
    title: "I LIKED™ | Premium Oversized Streetwear & Graphic Tees",
    description: "Shop bold oversized streetwear, heavyweight graphic tees & aesthetic daily wear. Stand out from the crowd.",
    siteName: "I LIKED™",
    images: [{
      url: "https://iliked.in/images/logo.png",
      width: 1200,
      height: 630,
      alt: "I LIKED™ Streetwear India"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "I LIKED™ | Premium Oversized Streetwear",
    description: "Modern oversized streetwear & heavyweight graphic tees in India.",
    images: ["https://iliked.in/images/logo.png"],
    creator: "@iliked_in",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

import { supabase } from "@/lib/supabase";
import { unstable_cache } from "next/cache";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const revalidate = 60; // Revalidate layout every 60 seconds

const getSettings = unstable_cache(
  async () => {
    const { data } = await supabase.from('settings').select('*').single();
    return data || {};
  },
  ['global-settings'],
  { revalidate: 60, tags: ['settings'] }
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch settings once and cache it
  const settings = await getSettings();
  const isMaintenanceMode = settings?.maintenance_mode || false;
  
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://iliked.in/#organization',
    name: 'I LIKED',
    legalName: 'I LIKED Streetwear',
    url: 'https://iliked.in',
    logo: {
      '@type': 'ImageObject',
      url: 'https://iliked.in/images/logo.png',
      width: '512',
      height: '512'
    },
    description: 'Modern oversized streetwear clothing brand in India specializing in premium graphic tees and heavyweight daily wear.',
    email: settings?.contact_email || 'support@iliked.in',
    sameAs: [
      settings?.instagram_link || 'https://instagram.com/iliked.in'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings?.whatsapp_number ? `+91${settings.whatsapp_number}` : '+91-9876543210',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi']
    }
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://iliked.in/#website',
    url: 'https://iliked.in',
    name: 'I LIKED',
    description: 'Premium Oversized Streetwear & Graphic Tees Store in India',
    publisher: {
      '@id': 'https://iliked.in/#organization'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://iliked.in/shop?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${outfit.variable} antialiased font-sans overflow-x-hidden max-w-[100vw]`}>
        <LayoutWrapper 
          isMaintenanceMode={isMaintenanceMode} 
          instagramLink={settings?.instagram_link || "https://instagram.com/iliked.in"}
          whatsappNumber={settings?.whatsapp_number}
          storeAddress={settings?.store_address || "Designed in Mumbai, India"}
        >
          {children}
        </LayoutWrapper>
        {settings?.whatsapp_number && (
          <FloatingWhatsApp whatsappNumber={settings.whatsapp_number} />
        )}
      </body>
    </html>
  );
}
