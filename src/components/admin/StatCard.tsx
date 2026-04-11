import { ComponentType } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

export default function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-[2.5rem] border border-gray-50 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${trend.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-1">{title}</p>
        <h3 className="text-4xl font-serif text-brand-plum dark:text-brand-rosegold tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
