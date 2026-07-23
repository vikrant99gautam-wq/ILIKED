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
  title: "I LIKED | Wear what you like.",
  description: "Modern oversized streetwear clothing brand.",
};

import { supabase } from "@/lib/supabase";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch maintenance mode state
  const { data: settings } = await supabase.from('settings').select('maintenance_mode').single();
  const isMaintenanceMode = settings?.maintenance_mode || false;
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased font-sans`}>
        <LayoutWrapper isMaintenanceMode={isMaintenanceMode}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
