import type { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'cyan';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
  emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/30',
  purple: 'from-purple-500 to-purple-600 shadow-purple-500/30',
  amber: 'from-amber-500 to-orange-500 shadow-amber-500/30',
  rose: 'from-rose-500 to-pink-500 shadow-rose-500/30',
  cyan: 'from-cyan-500 to-teal-500 shadow-cyan-500/30'
};

export default function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className="floating-card metric-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg`}>
          <Icon className="text-2xl" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.isPositive 
              ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
              : 'text-red-500 bg-red-50 dark:bg-red-500/10'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
    </div>
  );
}
