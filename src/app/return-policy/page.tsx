import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "Return policy for I LIKED.",
};

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F4F4F0] pt-[120px] pb-24">
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
