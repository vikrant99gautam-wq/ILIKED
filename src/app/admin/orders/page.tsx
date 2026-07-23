"use client";
import { useEffect, useState } from "react";
import { Order } from "@/lib/db";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Failed to fetch orders:", data);
        setOrders([]);
      }
    } catch (err) {
      console.error("Network error:", err);
      setOrders([]);
    }
    setIsLoading(false);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus as any });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-400 text-black';
      case 'Processing': return 'bg-blue-400 text-white';
      case 'Shipped': return 'bg-purple-500 text-white';
      case 'Delivered': return 'bg-green-500 text-white';
      case 'Cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-black';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8 border-b-[4px] border-black pb-4">
        <h1 className="font-cartoon text-5xl text-black">MANAGE ORDERS</h1>
      </div>

      {isLoading ? (
        <div className="font-cartoon text-3xl animate-pulse">LOADING ORDERS...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border-[4px] border-black p-8 text-center shadow-[6px_6px_0_#111]">
          <h2 className="font-cartoon text-3xl">NO ORDERS YET</h2>
        </div>
      ) : (
        <div className="bg-white border-[4px] border-black shadow-[6px_6px_0_#111] overflow-hidden">
          {/* Desktop Table */}
          <table className="w-full text-left hidden md:table">
            <thead className="bg-black text-white font-black tracking-widest">
              <tr>
                <th className="p-4">ORDER ID</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4">DATE</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b-[2px] border-black/10 last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-bold">#{order.id.slice(-6)}</td>
                  <td className="p-4 font-bold">{order.customer_name}</td>
                  <td className="p-4">{new Date(order.created_at || Date.now()).toLocaleDateString()}</td>
                  <td className="p-4 font-cartoon text-xl">₹{order.total}</td>
                  <td className="p-4">
                    <span className={`font-black px-3 py-1 border-[2px] border-black ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 border-[2px] border-black bg-[#FFD700] hover:bg-black hover:text-white font-black text-sm"
                      >
                        VIEW
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="px-4 py-2 border-[2px] border-black bg-red-500 hover:bg-black text-white font-black text-sm"
                      >
                        DEL
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col">
            {orders.map(order => (
              <div key={order.id} className="border-b-[4px] border-black last:border-0 p-4 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">#{order.id.slice(-6)}</span>
                    <span className="font-bold text-gray-600">{order.customer_name}</span>
                  </div>
                  <span className={`font-black px-2 py-1 border-[2px] border-black text-sm ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-cartoon text-2xl">₹{order.total}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 border-[2px] border-black bg-[#FFD700] font-black text-sm"
                    >
                      VIEW
                    </button>
                    <button 
                      onClick={() => handleDelete(order.id)}
                      className="px-4 py-2 border-[2px] border-black bg-red-500 text-white font-black text-sm"
                    >
                      DEL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl border-[4px] border-black p-6 shadow-[10px_10px_0_#111] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-cartoon text-4xl">ORDER #{selectedOrder.id.slice(-6)}</h2>
              <button onClick={() => setSelectedOrder(null)} className="font-black text-2xl">&times;</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border-[3px] border-black p-4">
                <h3 className="font-black text-xl mb-2">CUSTOMER INFO</h3>
                <p className="font-bold">{selectedOrder.customer_name}</p>
                <p>{selectedOrder.email}</p>
                <p className="mt-2 text-sm text-gray-500">Date: {new Date(selectedOrder.created_at || Date.now()).toLocaleString()}</p>
                
                {(() => {
                  const shippingItem = selectedOrder.items?.find((i: any) => i.id === 'SHIPPING-INFO');
                  if (shippingItem && shippingItem.shipping_info) {
                    const info = shippingItem.shipping_info;
                    return (
                      <div className="mt-4 pt-4 border-t-[2px] border-black/20">
                        <h4 className="font-black mb-1">SHIPPING ADDRESS</h4>
                        <p className="font-bold">{info.phone}</p>
                        <p className="text-sm">{info.address}</p>
                        <p className="text-sm">{info.city}, {info.district}</p>
                        <p className="text-sm">{info.state} - {info.zip}</p>
                      </div>
                    );
                  }
                  return null;
                })()}

                {(() => {
                  const paymentItem = selectedOrder.items?.find((i: any) => i.id === 'PAYMENT-INFO');
                  if (paymentItem) {
                    return (
                      <div className="mt-4 pt-4 border-t-[2px] border-black/20">
                        <h4 className="font-black mb-1">PAYMENT DETAILS</h4>
                        <p className="text-sm font-bold text-gray-700">Gateway: <span className="text-black">{paymentItem.name}</span></p>
                        <p className="text-sm font-bold text-gray-700">Payment ID: <span className="text-black font-mono bg-gray-200 px-1">{paymentItem.payment_id}</span></p>
                        <p className="text-sm font-bold text-gray-700">Order ID: <span className="text-black font-mono bg-gray-200 px-1">{paymentItem.razorpay_order_id}</span></p>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="border-[3px] border-black p-4 bg-gray-50">
                <h3 className="font-black text-xl mb-2">UPDATE STATUS</h3>
                <select 
                  className="w-full border-[3px] border-black p-2 font-bold mb-4 bg-white"
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <span className={`font-black px-3 py-1 border-[2px] border-black ${getStatusColor(selectedOrder.status)}`}>
                  CURRENT: {selectedOrder.status}
                </span>
              </div>
            </div>

            <h3 className="font-black text-2xl mb-4">ITEMS ORDERED</h3>
            <div className="border-[3px] border-black bg-white mb-6">
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                 selectedOrder.items
                  .filter((item: any) => item.id !== 'SHIPPING-INFO' && item.id !== 'PAYMENT-INFO' && !String(item.id).startsWith('PROMO-'))
                  .map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-4 border-b-[2px] border-black last:border-0">
                    <div className="flex items-center gap-4">
                      {item.image && <img src={item.image} className="w-12 h-12 object-contain border-[2px] border-black" alt={item.name} />}
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm">Qty: {item.quantity} | Size: {item.size}</p>
                      </div>
                    </div>
                    <span className="font-cartoon text-xl">₹{item.price * item.quantity}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 font-bold">No items found (Test Order)</div>
              )}
            </div>

            <div className="flex justify-between items-center bg-black text-white p-4 font-cartoon text-3xl border-[4px] border-black mb-8 shadow-[4px_4px_0_#FFD700]">
              <span>TOTAL</span>
              <span>₹{selectedOrder.total}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <button 
                onClick={() => handleDelete(selectedOrder.id)}
                className="px-6 py-3 border-[3px] border-black bg-red-500 text-white font-black hover:bg-black w-full md:w-auto text-center"
              >
                DELETE ORDER
              </button>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <a 
                  href={`/admin/orders/${selectedOrder.id}/print`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-3 border-[3px] border-black bg-[#FFD700] text-black font-black hover:bg-black hover:text-white text-center flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🖨️</span> PRINT LABEL
                </a>
                <button 
                  onClick={() => setSelectedOrder(null)} 
                  className="px-8 py-3 border-[3px] border-black bg-black text-white font-black hover:bg-[var(--color-electric-blue)] w-full md:w-auto text-center"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
