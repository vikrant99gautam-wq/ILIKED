import { getProducts } from "@/lib/db";

export default async function AdminDashboard() {
  const products = getProducts();
  const lowStockProducts = products.filter(p => p.stock <= 3);

  return (
    <div>
      <h1 className="font-cartoon text-5xl mb-8 border-b-[4px] border-black pb-4">DASHBOARD</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Stat Card */}
        <div className="bg-white border-[4px] border-black p-6 shadow-[6px_6px_0_#111]">
          <h3 className="font-black tracking-widest text-gray-500 mb-2">TOTAL PRODUCTS</h3>
          <p className="font-cartoon text-6xl text-[var(--color-electric-blue)]">{products.length}</p>
        </div>

        {/* Stat Card */}
        <div className="bg-white border-[4px] border-black p-6 shadow-[6px_6px_0_#111]">
          <h3 className="font-black tracking-widest text-gray-500 mb-2">LOW STOCK ALERTS</h3>
          <p className="font-cartoon text-6xl text-[var(--color-coral-red)]">{lowStockProducts.length}</p>
        </div>

        {/* Stat Card */}
        <div className="bg-white border-[4px] border-black p-6 shadow-[6px_6px_0_#111]">
          <h3 className="font-black tracking-widest text-gray-500 mb-2">TODAY'S ORDERS</h3>
          <p className="font-cartoon text-6xl text-[#19B85A]">0</p>
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
    </div>
  );
}
