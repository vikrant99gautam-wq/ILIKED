import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for I LIKED.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-24">
      <div className="max-w-[800px] mx-auto px-6 md:px-12">
        <div className="bg-white border-[4px] lg:border-[8px] border-black p-8 md:p-16 shadow-[8px_8px_0_#111] lg:shadow-[16px_16px_0_#111] relative">
          
          {/* Tape decorations */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-200/80 backdrop-blur-sm -rotate-2 z-10" style={{ mixBlendMode: 'multiply' }}></div>
          <div className="absolute top-4 -right-4 w-16 h-6 bg-[#FFD700]/80 backdrop-blur-sm rotate-45 z-10" style={{ mixBlendMode: 'multiply' }}></div>

          <h1 className="font-cartoon text-5xl md:text-7xl text-black tracking-widest mb-12 drop-shadow-[3px_3px_0_var(--color-electric-blue)] uppercase transform -rotate-1">
            TERMS & <br/>CONDITIONS
          </h1>
          
          <div className="font-mono text-sm md:text-base font-bold text-gray-800 space-y-8 leading-relaxed">
            
            <section>
              <h2 className="font-black text-xl mb-4 uppercase bg-black text-white inline-block px-3 py-1 shadow-[4px_4px_0_var(--color-coral-red)] rotate-1">1. The Basics</h2>
              <p>Welcome to I LIKED. By using our website and buying our clothes, you agree to these terms. If you don't agree, you can leave. Simple as that. We reserve the right to update these terms at any time without asking for your permission.</p>
            </section>

            <section>
              <h2 className="font-black text-xl mb-4 uppercase bg-black text-white inline-block px-3 py-1 shadow-[4px_4px_0_var(--color-electric-blue)] -rotate-1">2. Pricing & Payments</h2>
              <p>All prices are subject to change without notice. We accept payments via UPI, Credit/Debit cards, Net Banking, and select wallets through our secure payment gateway Razorpay. Cash on Delivery (COD) is available with a partial upfront payment as specified during checkout.</p>
            </section>

            <section>
              <h2 className="font-black text-xl mb-4 uppercase bg-black text-white inline-block px-3 py-1 shadow-[4px_4px_0_#FFD700] rotate-2">3. Shipping</h2>
              <p>We try to ship things as fast as humanly possible, usually within 48 hours. Delivery takes 8-10 days depending on where you live. Once the package leaves our facility, the courier is responsible. We'll help you track it, but we can't control the weather or courier delays.</p>
            </section>

            <section>
              <h2 className="font-black text-xl mb-4 uppercase bg-black text-white inline-block px-3 py-1 shadow-[4px_4px_0_#19B85A] -rotate-2">4. Intellectual Property</h2>
              <p>Everything on this site—the designs, the graphics, the text, the vibe—belongs to I LIKED. If you steal our designs and try to sell them, our lawyers will find you. Don't be that guy.</p>
            </section>

            <section>
              <h2 className="font-black text-xl mb-4 uppercase bg-black text-white inline-block px-3 py-1 shadow-[4px_4px_0_var(--color-coral-red)] rotate-1">5. Contact</h2>
              <p>Got issues with your order? Hit us up. We actually reply.</p>
            </section>
            
          </div>
        </div>
      </div>
    </main>
  );
}
