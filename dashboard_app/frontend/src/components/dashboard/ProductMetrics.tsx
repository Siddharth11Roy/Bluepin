import { Package, ShoppingCart, DollarSign, Grid } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ProductMetricsProps {
  products: Product[];
  categories: string[];
}

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: 'primary' | 'success' | 'warning' | 'info';
}

const MetricCard = ({ title, value, trend, trendUp, icon: Icon, color }: MetricCardProps) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
    success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    info: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  }[color];

  return (
    <div className="card p-4 relative overflow-hidden">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${colorClasses}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      </div>
      
      <div className={`text-xs font-medium flex items-center gap-1 ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
        {trendUp ? '↑' : '↓'} {trend} vs last month
      </div>
    </div>
  );
};

export default function ProductMetrics({ products, categories }: ProductMetricsProps) {
  // Calculate metrics
  const totalProducts = products.length;
  
  // Use a rough estimate or actual data if available for units calculation
  // In the original template: products|map(attribute='Monthly Sales')|...|sum
  const unitSold = products.reduce((sum, p) => {
    // Check if Sales_Number exists (mapped from Monthly Sales often)
    // If not, we might need to parse or mock. The type says Sales_Number?: number
    return sum + (p.Sales_Number || 0); 
  }, 0);
  
  const totalSales = products.reduce((sum, p) => sum + p.Price, 0);
  const totalCategories = categories.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Total Products"
        value={totalProducts.toString()}
        trend="8.2%"
        trendUp={true}
        icon={Package}
        color="primary"
      />
      
      <MetricCard
        title="Unit Sold"
        value={`${(unitSold / 1000).toFixed(1)}K`}
        trend="15.3%"
        trendUp={true}
        icon={ShoppingCart}
        color="success"
      />
      
      <MetricCard
        title="Total Sales"
        value={formatCurrency(totalSales)}
        trend="12.5%"
        trendUp={true}
        icon={DollarSign}
        color="warning"
      />
      
      <MetricCard
        title="Categories"
        value={totalCategories.toString()}
        trend="2 new"
        trendUp={true}
        icon={Grid}
        color="info"
      />
    </div>
  );
}
