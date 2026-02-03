import { Link } from 'react-router-dom';
import { Star, ChevronDown, ChevronUp, Flame, TrendingUp, Trophy } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useState } from 'react';

interface TopProductListsProps {
  products: Product[];
}

const ProductListItem = ({ product, meta }: { product: Product; meta: string }) => (
  <Link 
    to={`/product/${product['Product Identifier']}`}
    className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group"
  >
    <img 
      src={product.Image} 
      alt={product.Title} 
      className="w-10 h-10 rounded object-cover bg-slate-100"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image';
      }}
    />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-primary-500">
        {product.Title}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {meta}
      </p>
    </div>
  </Link>
);

const ListCard = ({ 
  title, 
  icon: Icon, 
  iconColor, 
  children 
}: { 
  title: string; 
  icon: React.ComponentType<{ className?: string }>; 
  iconColor: string;
  children: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      <div className={`space-y-1 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default function TopProductLists({ products }: TopProductListsProps) {
  // Sort products for different lists
  // Note: Cloning array to avoid mutating prop
  const topRated = [...products]
    .sort((a, b) => b.Ratings - a.Ratings)
    .slice(0, 5);

  const bestSellers = [...products]
    .sort((a, b) => (b.Sales_Number || 0) - (a.Sales_Number || 0))
    .slice(0, 5);

  const mostProfitable = [...products]
    .sort((a, b) => b.Price - a.Price)
    .slice(0, 5);

  const topProducts = products.slice(0, 5);

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <ListCard title="Top Rated" icon={Star} iconColor="text-amber-500">
        {topRated.map(p => (
          <ProductListItem 
            key={p['Product Identifier']} 
            product={p} 
            meta={`⭐ ${p.Ratings.toFixed(1)} • ${p.Review} reviews`} 
          />
        ))}
      </ListCard>

      <ListCard title="Best Sellers" icon={Flame} iconColor="text-red-500">
        {bestSellers.map(p => (
          <ProductListItem 
            key={p['Product Identifier']} 
            product={p} 
            meta={`${p.Sales_Number || 0} sold • ${formatCurrency(p.Price)}`} 
          />
        ))}
      </ListCard>

      <ListCard title="Most Profitable" icon={TrendingUp} iconColor="text-emerald-500">
        {mostProfitable.map(p => (
          <ProductListItem 
            key={p['Product Identifier']} 
            product={p} 
            meta={`${formatCurrency(p.Price)} • ⭐ ${p.Ratings.toFixed(1)}`} 
          />
        ))}
      </ListCard>

      <ListCard title="Top Products" icon={Trophy} iconColor="text-blue-500">
        {topProducts.map(p => (
          <ProductListItem 
            key={p['Product Identifier']} 
            product={p} 
            meta={`${formatCurrency(p.Price)} • ⭐ ${p.Ratings.toFixed(1)}`} 
          />
        ))}
      </ListCard>
    </div>
  );
}
