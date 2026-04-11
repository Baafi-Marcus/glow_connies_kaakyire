"use client";

import { useState, useEffect } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  BanknotesIcon, 
  ShoppingBagIcon, 
  Square3Stack3DIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";
import StatCard from "@/components/admin/StatCard";

type Product = { id: string; name: string; price: number; stock: number; lowStockThreshold: number; isAvailable: boolean; };
type Order = { id: string; customerName: string; totalAmount: number; status: string; createdAt: string; };

export default function OverviewDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([
        fetch('/api/products?admin=true'),
        fetch('/api/orders')
      ]);
      const pData = await pRes.json();
      const oData = await oRes.json();
      setProducts(Array.isArray(pData) ? pData : []);
      setOrders(Array.isArray(oData) ? oData : []);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const lowStockItems = products.filter(p => p.isAvailable && p.stock <= p.lowStockThreshold);
  
  const salesTrend = orders.slice().reverse().slice(-10).map(o => ({
    date: new Date(o.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    amount: o.totalAmount
  }));

  if (loading) return <div className="animate-pulse space-y-8">
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
       {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem]" />)}
     </div>
     <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-[3rem]" />
  </div>;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-4xl md:text-6xl font-serif text-brand-plum dark:text-brand-rosegold italic mb-2 tracking-tight">E-Commerce Overview</h2>
        <p className="text-gray-500 font-light text-lg">Real-time performance metrics for Glow By Connie</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`GHC ${totalRevenue.toLocaleString()}`} 
          icon={BanknotesIcon} 
          color="bg-green-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Total Orders" 
          value={orders.length} 
          icon={ShoppingBagIcon} 
          color="bg-blue-500"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Active Inventory" 
          value={products.filter(p => p.isAvailable).length} 
          icon={Square3Stack3DIcon} 
          color="bg-brand-plum"
        />
        <StatCard 
          title="Stock Alerts" 
          value={lowStockItems.length} 
          icon={ExclamationTriangleIcon} 
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] p-10 rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-2xl font-bold flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-6 h-6 text-brand-rosegold" />
              Revenue Growth
            </h4>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Past 10 Orders</div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b76e79" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#b76e79" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', background: '#fff' }}
                  itemStyle={{ color: '#4a0336', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#b76e79" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] p-10 rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm space-y-8">
          <h4 className="text-2xl font-bold flex items-center gap-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            Stock Alerts
          </h4>
          <div className="space-y-4">
            {lowStockItems.length > 0 ? lowStockItems.map(p => (
              <div key={p.id} className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                <div>
                  <p className="font-bold text-sm text-red-900 dark:text-red-300">{p.name}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-red-400">Only {p.stock} left</p>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-3 py-1.5 rounded-full shadow-lg">Refill</button>
              </div>
            )) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                    <SparklesIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-light italic">All inventory levels are looking great.</p>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] p-10 rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm">
        <h4 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-brand-plum" />
          Recent Orders
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
               <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-gray-800">
                 <th className="pb-4 px-2">Customer</th>
                 <th className="pb-4 px-2">Date</th>
                 <th className="pb-4 px-2">Amount</th>
                 <th className="pb-4 px-2">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
               {orders.slice(0, 5).map(order => (
                 <tr key={order.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="py-4 px-2 font-bold">{order.customerName}</td>
                    <td className="py-4 px-2 text-sm text-gray-500 font-light">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-2 font-black text-brand-plum dark:text-brand-rosegold">GHC {order.totalAmount}</td>
                    <td className="py-4 px-2">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                         order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-brand-rosegold/20 text-brand-plum'
                       }`}>
                         {order.status}
                       </span>
                    </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>;
}
