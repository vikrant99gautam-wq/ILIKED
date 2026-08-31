import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Exchange Policy (3-Day Easy Return) | I LIKED™",
  description: "Check the official return, exchange, and refund policy for I LIKED™. 3-day easy return window, QC guidelines, reverse pickups, and refund processing details.",
  alternates: {
    canonical: 'https://iliked.in/return-policy',
  },
  openGraph: {
    title: "Return & Exchange Policy | I LIKED™",
    description: "3-day return policy and exchange guidelines for I LIKED™ streetwear.",
    url: "https://iliked.in/return-policy",
    siteName: "I LIKED™",
  },
};

export default function ReturnPolicyPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the return window for I LIKED streetwear orders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You have exactly 3 days from the delivery date to request a return or exchange on I LIKED products.',
        },
      },
      {
        '@type': 'Question',
        name: 'What condition should the product be in for return approval?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The clothes must be completely unworn, unwashed, with the original hangtag intact, and free from stains or odors.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I initiate a return or exchange?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Contact I LIKED support via WhatsApp or email with your Order ID and photos of the product with tags attached. A reverse pickup will be scheduled if your pincode is serviceable.',
        },
      },
      {
        '@type': 'Question',
        name: 'How are refunds processed for COD and Prepaid orders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Once the returned item passes quality check, refunds are processed via bank transfer or store credit for COD orders, and back to original payment mode for prepaid orders.',
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-[800px] mx-auto px-6 md:px-12">
        <div className="bg-white border-[4px] lg:border-[8px] border-black p-8 md:p-16 shadow-[8px_8px_0_#111] lg:shadow-[16px_16px_0_#111] relative">
          
          {/* Tape decorations */}
          <div className="absolute -top-4 right-10 w-24 h-8 bg-[#FFD700]/80 backdrop-blur-sm rotate-3 z-10" style={{ mixBlendMode: 'multiply' }}></div>
          <div className="absolute top-10 -left-6 w-20 h-8 bg-[var(--color-electric-blue)]/60 backdrop-blur-sm -rotate-12 z-10" style={{ mixBlendMode: 'multiply' }}></div>

          <h1 className="font-cartoon text-5xl md:text-7xl text-black tracking-widest mb-12 drop-shadow-[3px_3px_0_var(--color-coral-red)] uppercase transform rotate-1">
            RETURN <br/>POLICY
          </h1>
          
          <div className="font-mono text-sm md:text-base font-bold text-gray-800 space-y-8 leading-relaxed">
            
            <section>
              <h2 className="font-black text-xl mb-4 uppercase bg-black text-white inline-block px-3 py-1 shadow-[4px_4px_0_#19B85A] -rotate-1">The 3-Day Rule</h2>
              <p>Listen up. You have exactly <strong>3 days</strong> from the time the package reaches you to request a return. We don't do returns after 3 days. No exceptions.</p>
            </section>

            <section>
              <h2 className="font-black text-xl mb-4 uppercase bg-black text-white inline-block px-3 py-1 shadow-[4px_4px_0_var(--color-electric-blue)] rotate-2">Condition of the Gear</h2>
              <p>The clothes must be completely <strong>unworn</strong>. Don't remove the hangtag until you try it and are 100% satisfied. If it smells like perfume, sweat, smoke, or if there's even a single stain, we will send it back to you at your cost.</p>
            </section>

            <section>
              <h2 className="font-black text-xl mb-4 uppercase bg-black text-white inline-block px-3 py-1 shadow-[4px_4px_0_#FFD700] -rotate-2">How to Return</h2>
              <p>Hit us up on WhatsApp or Email with your Order ID and photos of the product (with the hangtag attached). We'll arrange a reverse pickup if your pincode is serviceable. If not, you'll have to ship it back to us yourself.</p>
            </section>

            <section>
              <h2 className="font-black text-xl mb-4 uppercase bg-black text-white inline-block px-3 py-1 shadow-[4px_4px_0_var(--color-coral-red)] rotate-1">Refunds & Store Credit</h2>
              <p>Once we receive the item and our QC team gives it a green light, we will process your refund. For COD orders, refunds will be provided as Store Credit or via Bank Transfer. Shipping charges are non-refundable.</p>
            </section>
            
          </div>
        </div>
      </div>
    </main>
  );
}
