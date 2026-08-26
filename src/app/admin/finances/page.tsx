"use client";
import { useEffect, useState } from "react";
import { Order } from "@/lib/db";

interface Expense {
  id: string;
  name: string;
  amount: number;
}

export default function AdminFinancesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, settingsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/settings")
      ]);
      
      const ordersData = await ordersRes.json();
      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      }

      const settingsData = await settingsRes.json();
      if (settingsData && settingsData.finances_data) {
        try {
          const parsed = JSON.parse(settingsData.finances_data);
          if (Array.isArray(parsed)) {
            setExpenses(parsed);
          }
        } catch (e) {
          console.error("Failed to parse finances_data", e);
        }
      }
    } catch (err) {
      console.error("Network error:", err);
    }
    setIsLoading(false);
  };

  const handleSaveExpenses = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finances_data: JSON.stringify(expenses) })
      });
      alert("Expenses saved successfully!");
    } catch (error) {
      alert("Failed to save expenses.");
    }
    setIsSaving(false);
  };

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now().toString(), name: "", amount: 0 }]);
  };

  const updateExpense = (id: string, field: keyof Expense, value: string | number) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Calculate Finances
  // Exclude cancelled orders from revenue
  const validOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = validOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0.0";

  return (
    <div>
      <div className="flex justify-between items-end mb-8 border-b-[4px] border-black pb-4">
        <h1 className="font-cartoon text-5xl text-black">FINANCES & PROFIT</h1>
      </div>

      {isLoading ? (
        <div className="font-cartoon text-3xl animate-pulse">CALCULATING MATH...</div>
      ) : (
        <div className="flex flex-col gap-8">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black text-white p-6 border-[4px] border-black shadow-[6px_6px_0_var(--color-electric-blue)]">
              <h3 className="font-black tracking-widest text-gray-400 mb-2">TOTAL REVENUE</h3>
              <p className="font-cartoon text-5xl">₹{totalRevenue.toLocaleString()}</p>
              <p className="font-bold text-sm mt-2">From {validOrders.length} valid orders</p>
            </div>
            
            <div className="bg-white text-black p-6 border-[4px] border-black shadow-[6px_6px_0_var(--color-coral-red)]">
              <h3 className="font-black tracking-widest text-gray-500 mb-2">TOTAL EXPENSES</h3>
              <p className="font-cartoon text-5xl">₹{totalExpenses.toLocaleString()}</p>
              <p className="font-bold text-sm mt-2">From {expenses.length} expense items</p>
            </div>
            
            <div className={`p-6 border-[4px] border-black ${netProfit >= 0 ? 'bg-[#19B85A] text-black shadow-[6px_6px_0_#111]' : 'bg-[var(--color-coral-red)] text-white shadow-[6px_6px_0_#111]'}`}>
              <h3 className="font-black tracking-widest mb-2">NET PROFIT</h3>
              <p className="font-cartoon text-5xl">₹{netProfit.toLocaleString()}</p>
              <p className="font-bold text-sm mt-2">Margin: {profitMargin}%</p>
            </div>
          </div>

          {/* Expenses Manager */}
          <div className="bg-white border-[4px] border-black shadow-[6px_6px_0_#111] p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 border-b-[2px] border-black pb-4">
              <h2 className="font-cartoon text-3xl">EXPENSES</h2>
              <button 
                onClick={addExpense}
                className="px-4 py-2 border-[2px] border-black bg-[var(--color-electric-blue)] text-white font-black hover:bg-black transition-colors shadow-[2px_2px_0_#111]"
              >
                + ADD EXPENSE
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {expenses.length === 0 ? (
                <div className="p-8 border-[2px] border-dashed border-gray-400 text-center text-gray-500 font-bold uppercase">
                  No expenses added yet. Click "+ ADD EXPENSE" to start calculating profit.
                </div>
              ) : (
                expenses.map((expense) => (
                  <div key={expense.id} className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 border-[2px] border-black">
                    <div className="flex-1 w-full">
                      <label className="block font-black text-xs mb-1">EXPENSE NAME</label>
                      <input 
                        type="text" 
                        value={expense.name}
                        onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                        placeholder="e.g. Facebook Ads, T-shirt blanks, Packaging"
                        className="w-full border-[2px] border-black p-2 font-bold"
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <label className="block font-black text-xs mb-1">AMOUNT (₹)</label>
                      <input 
                        type="number" 
                        value={expense.amount || ''}
                        onChange={(e) => updateExpense(expense.id, 'amount', Number(e.target.value))}
                        placeholder="0"
                        className="w-full border-[2px] border-black p-2 font-bold text-right"
                      />
                    </div>
                    <div className="w-full md:w-auto mt-auto flex justify-end">
                      <button 
                        onClick={() => removeExpense(expense.id)}
                        className="px-4 py-2 border-[2px] border-black bg-[var(--color-coral-red)] text-white font-black hover:bg-black transition-colors"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {expenses.length > 0 && (
              <div className="mt-8 pt-4 border-t-[2px] border-black flex justify-end">
                <button 
                  onClick={handleSaveExpenses}
                  disabled={isSaving}
                  className="px-8 py-4 border-[4px] border-black bg-[#FFD700] text-black font-black text-xl hover:bg-black hover:text-[#FFD700] transition-colors shadow-[4px_4px_0_#111] disabled:opacity-50"
                >
                  {isSaving ? 'SAVING...' : 'SAVE EXPENSES'}
                </button>
              </div>
            )}

          </div>
          
        </div>
      )}
    </div>
  );
}
