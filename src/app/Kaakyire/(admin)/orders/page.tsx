"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingBagIcon, 
  MapPinIcon, 
  PhoneIcon, 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

type OrderItem = { name: string; quantity: number; price: number; };
type Order = { 
  id: string; 
  customerName: string; 
  customerPhone: string; 
  location: string; 
  items: any; // OrderItem[]
  totalAmount: number; 
  status: string; 
  createdAt: string; 
};

const STATUS_ORDER = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    fetchOrders();
    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const filteredOrders = orders.filter(o => statusFilter === "All" || o.status === statusFilter);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'PROCESSING': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'SHIPPED': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'DELIVERED': return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      case 'COMPLETED': return 'bg-green-50 text-green-700 border-green-100';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const handleWhatsApp = (order: Order) => {
    const text = `Hello ${order.customerName}, this is Glow By Connie. We have an update on your order #${order.id.slice(-5).toUpperCase()}. Current Status: ${order.status}. Thank you for shopping with us!`;
    window.open(`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-4xl md:text-6xl font-serif text-brand-plum dark:text-brand-rosegold italic mb-2 tracking-tight">Order Tracking</h2>
        <p className="text-gray-500 font-light text-lg">Manage customer requests and fulfillment status</p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-4">
        {["All", ...STATUS_ORDER].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              statusFilter === status 
                ? 'bg-brand-plum text-white border-brand-plum shadow-lg' 
                : 'bg-white dark:bg-[#1E1E1E] text-gray-500 border-gray-100 dark:border-gray-800 hover:border-brand-rosegold'
            }`}
          >
            {status}
            {status !== "All" && (
              <span className="ml-2 py-0.5 px-1.5 bg-black/10 rounded-md">
                {orders.filter(o => o.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredOrders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white dark:bg-[#1E1E1E] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500 p-8 flex flex-col group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-opacity-5 rounded-full translate-x-10 -translate-y-10 transition-transform group-hover:scale-150 ${getStatusStyle(order.status).split(' ')[0]}`}></div>
            
            <div className="flex justify-between items-start mb-8 relative">
              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight">{order.customerName}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order #{order.id.slice(-5).toUpperCase()}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border tracking-widest ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <span className="line-clamp-1 italic">{order.location}</span>
              </div>
              <a 
                href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                className="flex items-center gap-3 text-sm text-brand-rosegold hover:text-brand-plum transition-colors group/link"
              >
                <PhoneIcon className="w-5 h-5 text-gray-400 group-hover/link:text-brand-rosegold" />
                <span className="font-bold underline decoration-dotted underline-offset-4">{order.customerPhone}</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
                <span>{JSON.parse(JSON.stringify(order.items)).length} items • GHC {order.totalAmount}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedOrder(order)}
              className="w-full py-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-brand-rosegold hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Order Details <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="p-40 text-center bg-gray-50/50 dark:bg-gray-800/20 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
          <ClockIcon className="w-20 h-20 mx-auto text-gray-200 mb-6" />
          <h2 className="text-2xl font-serif text-gray-400 italic">No orders in this category.</h2>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto pt-10 pb-10">
          <div className="fixed inset-0 bg-brand-plum/40 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white dark:bg-[#1E1E1E] w-full max-w-4xl rounded-[4rem] shadow-2xl p-10 md:p-14 animate-in zoom-in-95 duration-500 overflow-hidden">
             {/* Modal Header */}
             <div className="flex justify-between items-start mb-12">
               <div className="flex gap-6 items-center">
                 <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center ${getStatusStyle(selectedOrder.status).split(' ')[0]} bg-opacity-20`}>
                   <ShoppingBagIcon className={`w-10 h-10 ${getStatusStyle(selectedOrder.status).split(' ')[1]}`} />
                 </div>
                 <div>
                   <h3 className="text-4xl font-serif italic">{selectedOrder.customerName}</h3>
                   <div className="flex items-center gap-2 mt-2">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(selectedOrder.status)}`}>
                       {selectedOrder.status}
                     </span>
                     <span className="text-[10px] text-gray-400 font-bold tracking-widest">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                   </div>
                 </div>
               </div>
               <button onClick={() => setSelectedOrder(null)} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full hover:rotate-90 transition-transform">
                 <XMarkIcon className="w-6 h-6" />
               </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               {/* Left Side: Order Items */}
               <div className="space-y-8">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4">Itemized Receipt</h4>
                 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                   {JSON.parse(JSON.stringify(selectedOrder.items)).map((item: OrderItem, idx: number) => (
                     <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center font-black text-xs text-brand-rosegold">
                              {item.quantity}x
                           </div>
                           <span className="font-bold text-sm">{item.name}</span>
                        </div>
                        <span className="font-serif italic text-brand-plum dark:text-brand-rosegold">GHC {item.price * item.quantity}</span>
                     </div>
                   ))}
                 </div>
                 <div className="p-6 bg-brand-plum text-white rounded-[2rem] flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Grand Total</span>
                   <span className="text-3xl font-serif italic">GHC {selectedOrder.totalAmount}</span>
                 </div>
               </div>

               {/* Right Side: Customer & Fulfillment */}
               <div className="space-y-8">
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4">Delivery Insights</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <a 
                         href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}`} 
                         target="_blank" 
                         className="p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl space-y-2 hover:bg-brand-rosegold/10 transition-colors group/modal-link"
                       >
                          <PhoneIcon className="w-5 h-5 text-brand-rosegold" />
                          <p className="font-bold text-xs group-hover/modal-link:text-brand-rosegold underline decoration-dotted">{selectedOrder.customerPhone}</p>
                       </a>
                       <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl space-y-2">
                          <MapPinIcon className="w-5 h-5 text-brand-rosegold" />
                          <p className="font-bold text-xs line-clamp-1">{selectedOrder.location}</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4">Fulfillment Workflow</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {STATUS_ORDER.map(s => (
                        <button 
                          key={s} 
                          onClick={() => updateOrderStatus(selectedOrder.id, s)}
                          className={`py-3 rounded-xl text-[8px] font-black transition-all ${
                            selectedOrder.status === s 
                              ? 'bg-brand-rosegold text-white shadow-lg' 
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-brand-plum'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => handleWhatsApp(selectedOrder)}
                      className="w-full flex items-center justify-center gap-3 py-6 bg-[#25D366] text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:-translate-y-1 transition-all"
                    >
                      <ChatBubbleLeftRightIcon className="w-6 h-6" /> Notify Customer via WhatsApp
                    </button>
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
