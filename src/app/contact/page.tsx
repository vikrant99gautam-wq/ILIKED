import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { unstable_cache } from "next/cache";

export const metadata: Metadata = {
  title: "Contact Support & WhatsApp Helpline | I LIKED™",
  description: "Get in touch with I LIKED™ customer support via WhatsApp or Email. We're here for order tracking, size queries, and assistance.",
  alternates: {
    canonical: 'https://iliked.in/contact',
  },
  openGraph: {
    title: "Contact Support & WhatsApp Helpline | I LIKED™",
    description: "Get in touch with I LIKED™ customer support via WhatsApp or Email.",
    url: "https://iliked.in/contact",
    siteName: "I LIKED™",
    images: [{
      url: "https://iliked.in/images/logo.png",
      width: 1200,
      height: 630,
      alt: "I LIKED™ Contact"
    }],
  },
};

const getSettings = unstable_cache(
  async () => {
    const { data } = await supabase.from('settings').select('*').single();
    return data || {};
  },
  ['global-settings'],
  { revalidate: 60, tags: ['settings'] }
);

export default async function ContactPage() {
  const settings = await getSettings();

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'I LIKED™ Contact & Support',
    url: 'https://iliked.in/contact',
    description: 'Contact I LIKED streetwear team via WhatsApp or Email.',
    mainEntity: {
      '@type': 'Organization',
      name: 'I LIKED',
      telephone: settings?.whatsapp_number ? `+91${settings.whatsapp_number}` : '+91-9876543210',
      email: settings?.contact_email || 'support@iliked.in',
      address: settings?.store_address || 'Mumbai, India',
    },
  };

  return (
    <main className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-24 flex items-center justify-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <div className="max-w-[600px] w-full px-6 md:px-12">
        <div className="bg-white border-[4px] lg:border-[8px] border-black p-8 md:p-16 shadow-[8px_8px_0_#111] lg:shadow-[16px_16px_0_#111] relative text-center">
          
          {/* Tape decorations */}
          <div className="absolute -top-4 right-1/2 translate-x-1/2 w-24 h-8 bg-[var(--color-coral-red)]/80 backdrop-blur-sm rotate-2 z-10" style={{ mixBlendMode: 'multiply' }}></div>
          <div className="absolute top-1/2 -left-4 w-12 h-6 bg-[var(--color-electric-blue)]/80 backdrop-blur-sm -rotate-6 z-10" style={{ mixBlendMode: 'multiply' }}></div>
          <div className="absolute top-1/2 -right-4 w-12 h-6 bg-[#FFD700]/80 backdrop-blur-sm rotate-12 z-10" style={{ mixBlendMode: 'multiply' }}></div>

          <h1 className="font-cartoon text-5xl md:text-7xl text-black tracking-widest mb-4 drop-shadow-[3px_3px_0_#19B85A] uppercase transform rotate-1">
            CONTACT
          </h1>
          
          <p className="font-mono text-sm font-bold text-gray-500 tracking-widest uppercase mb-12">Don't be shy, hit us up.</p>
          
          <div className="flex flex-col gap-10">
            
            {settings.whatsapp_number && (
              <a 
                href={`https://wa.me/91${settings.whatsapp_number.replace(/[^0-9]/g, "")}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-6 border-[3px] border-black hover:bg-[#25D366] transition-colors cursor-pointer shadow-[4px_4px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-1 hover:translate-y-1"
              >
                <h3 className="font-black text-xs text-gray-500 tracking-[0.2em] mb-2 group-hover:text-black">WHATSAPP US</h3>
                <p className="font-cartoon text-3xl text-black tracking-wider group-hover:text-white drop-shadow-[1px_1px_0_#fff] group-hover:drop-shadow-[2px_2px_0_#000]">
                  {settings.whatsapp_number}
                </p>
              </a>
            )}

            {settings.contact_email && (
              <a 
                href={`mailto:${settings.contact_email}`} 
                className="group flex flex-col items-center justify-center p-6 border-[3px] border-black hover:bg-[var(--color-electric-blue)] transition-colors cursor-pointer shadow-[4px_4px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-1 hover:translate-y-1"
              >
                <h3 className="font-black text-xs text-gray-500 tracking-[0.2em] mb-2 group-hover:text-black">EMAIL US</h3>
                <p className="font-cartoon text-3xl text-black tracking-wider group-hover:text-white drop-shadow-[1px_1px_0_#fff] group-hover:drop-shadow-[2px_2px_0_#000] break-all">
                  {settings.contact_email}
                </p>
              </a>
            )}

            {settings.store_address && (
              <div className="flex flex-col items-center justify-center p-6 border-[3px] border-black bg-[#FFD700] shadow-[4px_4px_0_#111] rotate-1">
                <h3 className="font-black text-xs text-black tracking-[0.2em] mb-2">STORE BASE</h3>
                <p className="font-mono text-lg font-bold text-black uppercase">
                  {settings.store_address}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
