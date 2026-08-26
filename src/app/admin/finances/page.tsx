"use client";
import { useState, useEffect } from "react";

export default function AdminFinancesPage() {
  const [sellingPrice, setSellingPrice] = useState<number>(999);
  const [expectedUnits, setExpectedUnits] = useState<number>(100);

  // Per Unit Costs
  const [blankCost, setBlankCost] = useState<number>(300);
  const [printCost, setPrintCost] = useState<number>(100);
  const [packagingCost, setPackagingCost] = useState<number>(50);
  const [shippingCost, setShippingCost] = useState<number>(70);
  const [marketingCac, setMarketingCac] = useState<number>(150);
  const [otherCosts, setOtherCosts] = useState<number>(30);

  // Calculations
  const pgFee = sellingPrice * 0.02; // Approx 2% Payment Gateway fee
  
  const totalCostPerUnit = blankCost + printCost + packagingCost + shippingCost + marketingCac + otherCosts + pgFee;
  const profitPerUnit = sellingPrice - totalCostPerUnit;
  const marginPercentage = sellingPrice > 0 ? ((profitPerUnit / sellingPrice) * 100).toFixed(1) : "0.0";
  
  const totalRevenue = sellingPrice * expectedUnits;
  const totalProfit = profitPerUnit * expectedUnits;
  const totalCost = totalCostPerUnit * expectedUnits;

  return (
    <div>
      <div className="flex justify-between items-end mb-8 border-b-[4px] border-black pb-4">
        <div>
          <h1 className="font-cartoon text-5xl text-black leading-none drop-shadow-[3px_3px_0_var(--color-electric-blue)]">PROFIT CALCULATOR</h1>
          <p className="font-black text-gray-500 uppercase tracking-widest text-sm mt-2">Plan your next drop's pricing</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Input Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-white border-[4px] border-black shadow-[6px_6px_0_#111] p-6 md:p-8">
            <h2 className="font-cartoon text-3xl mb-6 border-b-[2px] border-black pb-2">THE BASICS</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block font-black text-sm mb-2 text-gray-600">SELLING PRICE (₹)</label>
                <input 
                  type="number" 
                  value={sellingPrice || ''}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full border-[3px] border-black p-3 font-cartoon text-2xl text-center shadow-[4px_4px_0_var(--color-electric-blue)] focus:outline-none focus:-translate-y-1 transition-transform"
                />
              </div>
              <div className="flex-1">
                <label className="block font-black text-sm mb-2 text-gray-600">EXPECTED SALES (UNITS)</label>
                <input 
                  type="number" 
                  value={expectedUnits || ''}
                  onChange={(e) => setExpectedUnits(Number(e.target.value))}
                  className="w-full border-[3px] border-black p-3 font-cartoon text-2xl text-center shadow-[4px_4px_0_#111] focus:outline-none focus:-translate-y-1 transition-transform"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F4F4F0] border-[4px] border-black shadow-[6px_6px_0_#111] p-6 md:p-8">
            <h2 className="font-cartoon text-3xl mb-6 border-b-[2px] border-black pb-2">COSTS PER UNIT (₹)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-xs mb-1">BLANK T-SHIRT / FABRIC</label>
                <input 
                  type="number" 
                  value={blankCost || ''}
                  onChange={(e) => setBlankCost(Number(e.target.value))}
                  className="w-full border-[2px] border-black p-2 font-bold text-right"
                />
              </div>
              <div>
                <label className="block font-black text-xs mb-1">PRINTING & WASH</label>
                <input 
                  type="number" 
                  value={printCost || ''}
                  onChange={(e) => setPrintCost(Number(e.target.value))}
                  className="w-full border-[2px] border-black p-2 font-bold text-right"
                />
              </div>
              <div>
                <label className="block font-black text-xs mb-1">PACKAGING (Boxes, Tags)</label>
                <input 
                  type="number" 
                  value={packagingCost || ''}
                  onChange={(e) => setPackagingCost(Number(e.target.value))}
                  className="w-full border-[2px] border-black p-2 font-bold text-right"
                />
              </div>
              <div>
                <label className="block font-black text-xs mb-1">SHIPPING COST</label>
                <input 
                  type="number" 
                  value={shippingCost || ''}
                  onChange={(e) => setShippingCost(Number(e.target.value))}
                  className="w-full border-[2px] border-black p-2 font-bold text-right"
                />
              </div>
              <div>
                <label className="block font-black text-xs mb-1 text-[var(--color-coral-red)]">FB ADS / CAC</label>
                <input 
                  type="number" 
                  value={marketingCac || ''}
                  onChange={(e) => setMarketingCac(Number(e.target.value))}
                  className="w-full border-[2px] border-black p-2 font-bold text-right"
                />
              </div>
              <div>
                <label className="block font-black text-xs mb-1">OTHER (RTO loss, labor)</label>
                <input 
                  type="number" 
                  value={otherCosts || ''}
                  onChange={(e) => setOtherCosts(Number(e.target.value))}
                  className="w-full border-[2px] border-black p-2 font-bold text-right"
                />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t-[2px] border-dashed border-black">
              <p className="font-black text-xs text-gray-500 uppercase text-right">
                + ₹{pgFee.toFixed(2)} PAYMENT GATEWAY FEE (2%)
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-black text-white border-[4px] border-black shadow-[8px_8px_0_var(--color-coral-red)] p-8">
            <h2 className="font-cartoon text-3xl mb-6 border-b-[2px] border-white/20 pb-2 text-[var(--color-coral-red)]">PER UNIT BREAKDOWN</h2>
            
            <div className="flex justify-between items-center mb-4">
              <span className="font-black tracking-widest text-gray-400">TOTAL COST / UNIT</span>
              <span className="font-cartoon text-3xl text-white">₹{totalCostPerUnit.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="font-black tracking-widest text-gray-400">NET PROFIT / UNIT</span>
              <span className="font-cartoon text-4xl text-[#19B85A]">₹{profitPerUnit.toFixed(2)}</span>
            </div>

            <div className="w-full bg-white/10 h-6 border-[2px] border-white/20 relative overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full ${profitPerUnit > 0 ? 'bg-[#19B85A]' : 'bg-[var(--color-coral-red)]'}`} 
                style={{ width: `${Math.max(0, Math.min(100, (profitPerUnit / sellingPrice) * 100))}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-[10px] tracking-widest mix-blend-difference text-white">
                PROFIT MARGIN: {marginPercentage}%
              </div>
            </div>
          </div>

          <div className="bg-[#FFD700] border-[4px] border-black shadow-[8px_8px_0_#111] p-8">
            <h2 className="font-cartoon text-3xl mb-6 border-b-[2px] border-black/20 pb-2">THE BIG PICTURE (For {expectedUnits} units)</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white border-[2px] border-black p-4 text-center">
                <p className="font-black text-xs text-gray-500 mb-1">TOTAL EXPENSE</p>
                <p className="font-cartoon text-2xl">₹{totalCost.toLocaleString()}</p>
              </div>
              <div className="bg-white border-[2px] border-black p-4 text-center">
                <p className="font-black text-xs text-gray-500 mb-1">TOTAL REVENUE</p>
                <p className="font-cartoon text-2xl">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            <div className={`p-6 border-[4px] border-black text-center ${totalProfit >= 0 ? 'bg-[#19B85A] text-black shadow-inner' : 'bg-[var(--color-coral-red)] text-white shadow-inner'}`}>
              <p className="font-black tracking-widest mb-1 text-sm">TOTAL ESTIMATED PROFIT</p>
              <p className="font-cartoon text-6xl">₹{totalProfit.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="p-4 border-[2px] border-dashed border-black text-center font-black text-xs uppercase text-gray-500 tracking-widest bg-white">
            Pro Tip: Keep marketing CAC under 20% of selling price and aim for at least 30% profit margin for a healthy drop.
          </div>

        </div>

      </div>
    </div>
  );
}
