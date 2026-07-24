import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="w-full min-h-screen pt-40 pb-20 px-6 md:px-16 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
      <h1 className="font-cartoon text-5xl md:text-7xl mb-6 uppercase tracking-widest text-[#111]" style={{ textShadow: '2px 2px 0 #FFD700' }}>Contact Us</h1>
      
      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0_#111] p-10 md:p-16 rounded-2xl w-full max-w-2xl mt-8 rotate-[-1deg]">
        <p className="font-black text-xl md:text-2xl text-gray-700 mb-8 uppercase tracking-widest">For all inquiries, please email us at:</p>
        
        <a 
          href="mailto:admin.iliked@gmail.com" 
          className="inline-block bg-[var(--color-electric-blue)] border-[4px] border-black text-white font-cartoon text-3xl md:text-5xl py-4 px-8 shadow-[6px_6px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-1 hover:translate-y-1 transition-all hover:bg-[var(--color-coral-red)] rotate-[2deg] hover:rotate-[0deg]"
        >
          admin.iliked@gmail.com
        </a>

        <div className="mt-12">
          <p className="text-gray-500 font-bold mb-4">We'll get back to you within 24-48 hours.</p>
          <Link href="/" className="inline-block font-black text-black border-b-4 border-black hover:text-[var(--color-coral-red)] hover:border-[var(--color-coral-red)] transition-colors">
            RETURN TO STORE
          </Link>
        </div>
      </div>
    </div>
  );
}
