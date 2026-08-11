import { getProducts } from "@/lib/db";

export default async function AdminDashboard() {
  const products = await getProducts();
  const lowStockProducts = products.filter(p => p.stock <= 3);

  return (
    <div>
      <h1 className="font-cartoon text-4xl md:text-5xl mb-6 md:mb-8 border-b-[4px] border-black pb-4">DASHBOARD</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        
        {/* Stat Card */}
        <div className="bg-white border-[4px] border-black p-5 md:p-6 shadow-[6px_6px_0_#111]">
          <h3 className="font-black tracking-widest text-gray-500 mb-2 text-sm md:text-base">TOTAL PRODUCTS</h3>
          <p className="font-cartoon text-5xl md:text-6xl text-[var(--color-electric-blue)]">{products.length}</p>
        </div>

        {/* Stat Card */}
        <div className="bg-white border-[4px] border-black p-5 md:p-6 shadow-[6px_6px_0_#111]">
          <h3 className="font-black tracking-widest text-gray-500 mb-2 text-sm md:text-base">LOW STOCK ALERTS</h3>
          <p className="font-cartoon text-5xl md:text-6xl text-[var(--color-coral-red)]">{lowStockProducts.length}</p>
        </div>

        {/* Stat Card */}
        <div className="bg-white border-[4px] border-black p-5 md:p-6 shadow-[6px_6px_0_#111]">
          <h3 className="font-black tracking-widest text-gray-500 mb-2 text-sm md:text-base">TODAY'S ORDERS</h3>
          <p className="font-cartoon text-5xl md:text-6xl text-[#19B85A]">0</p>
        </div>

      </div>

      {lowStockProducts.length > 0 && (
        <div className="mt-12 bg-white border-[4px] border-[var(--color-coral-red)] p-6 shadow-[6px_6px_0_#111]">
          <h3 className="font-cartoon text-3xl mb-4 text-[var(--color-coral-red)]">URGENT: RESTOCK NEEDED</h3>
          <ul>
            {lowStockProducts.map(p => (
              <li key={p.id} className="font-black tracking-widest py-2 border-b-2 border-dashed border-gray-300 last:border-0 flex justify-between">
                <span>{p.name}</span>
                <span className="text-[var(--color-coral-red)]">ONLY {p.stock} LEFT</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="mt-12 bg-[#FFD700] border-[4px] border-black p-6 md:p-8 shadow-[6px_6px_0_#111] flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h3 className="font-cartoon text-3xl mb-2 text-black">CONNECT INSTAGRAM</h3>
          <p className="font-bold text-gray-800">Link your Instagram account so customers can easily find you in the footer.</p>
        </div>
        <a href="/admin/settings" className="mt-4 md:mt-0 bg-black text-white px-8 py-3 font-black tracking-widest hover:bg-[var(--color-electric-blue)] transition-colors border-[3px] border-black whitespace-nowrap shadow-[4px_4px_0_#fff]">
          CONNECT NOW
        </a>
      </div>
    </div>
  );
}
