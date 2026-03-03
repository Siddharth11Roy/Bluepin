import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BiPackage, BiStore, BiCategoryAlt, BiTrendingUp, BiDollarCircle,
  BiStar, BiRightArrowAlt, BiLineChart, BiPieChart
} from 'react-icons/bi';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import * as api from '../api/services';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardStats {
  total_products: number;
  total_suppliers: number;
  categories: number;
  avg_price: number;
  total_revenue: number;
  avg_rating: number;
}

interface Product {
  id: number;
  product_name: string;
  product_category: string;
  item_price: number;
  avg_star_rating: number;
  image_url?: string;
}

interface ChartData {
  labels: string[];
  values: number[];
}

export default function Overview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<ChartData | null>(null);
  const [priceDistribution, setPriceDistribution] = useState<ChartData | null>(null);
  const [ratingDistribution, setRatingDistribution] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, productsRes, categoryRes, priceRes, ratingRes] = await Promise.all([
        api.getStats(),
        api.getProducts({}, 1, 8),
        api.getCategoryDistribution(),
        api.getPriceDistribution(),
        api.getRatingDistribution()
      ]);
      
      setStats(statsRes);
      setTopProducts(productsRes.products || []);
      setCategoryData(categoryRes);
      setPriceDistribution(priceRes);
      setRatingDistribution(ratingRes);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart colors
  const chartColors = [
    'rgba(30, 58, 138, 0.8)',   // Primary blue
    'rgba(59, 130, 246, 0.8)',  // Light blue
    'rgba(16, 185, 129, 0.8)',  // Green
    'rgba(245, 158, 11, 0.8)', // Amber
    'rgba(239, 68, 68, 0.8)',  // Red
    'rgba(139, 92, 246, 0.8)', // Purple
    'rgba(6, 182, 212, 0.8)',   // Cyan
    'rgba(236, 72, 153, 0.8)'   // Pink
  ];

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' }
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#64748b' }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: '#64748b', padding: 15, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back! Here's what's happening with your products.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/products" className="btn-primary">
            <BiPackage className="text-lg" />
            View Products
          </Link>
        </div>
      </div>

      {/* Stats Cards - 4 cards per row max for better spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <BiPackage className="text-2xl" />
            </div>
            <span className="text-sm font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
              +12.5%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Total Products</p>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">
            {stats?.total_products?.toLocaleString() || '0'}
          </div>
          <p className="text-emerald-500 text-xs mt-2">↑ vs last month</p>
        </div>

        <div className="stat-card bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <BiStore className="text-2xl" />
            </div>
            <span className="text-sm font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
              +8.3%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Total Suppliers</p>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">
            {stats?.total_suppliers?.toLocaleString() || '0'}
          </div>
          <p className="text-emerald-500 text-xs mt-2">↑ vs last month</p>
        </div>

        <div className="stat-card bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
              <BiDollarCircle className="text-2xl" />
            </div>
            <span className="text-sm font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
              +12.8%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Total Sales</p>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">
            ₹{((stats?.total_revenue || 0) / 100000).toFixed(1)}M
          </div>
          <p className="text-emerald-500 text-xs mt-2">↑ vs last month</p>
        </div>

        <div className="stat-card bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white shadow-lg">
              <BiStar className="text-2xl" />
            </div>
            <span className="text-sm font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
              +18.3%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Avg. Rating</p>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">
            {stats?.avg_rating?.toFixed(1) || '0.0'}
          </div>
          <p className="text-emerald-500 text-xs mt-2">↑ vs last month</p>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="stat-card bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <BiCategoryAlt className="text-xl" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Categories</p>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {stats?.categories || '0'}
          </div>
        </div>

        <div className="stat-card bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
              <BiTrendingUp className="text-xl" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Avg. Price</p>
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            ₹{stats?.avg_price?.toFixed(0) || '0'}
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="floating-card chart-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Category Distribution</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Products by category</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
              <BiPieChart className="text-xl" />
            </div>
          </div>
          <div className="h-[300px]">
            {categoryData && (
              <Doughnut
                data={{
                  labels: categoryData.labels,
                  datasets: [{
                    data: categoryData.values,
                    backgroundColor: chartColors,
                    borderWidth: 0,
                    hoverOffset: 10
                  }]
                }}
                options={pieOptions}
              />
            )}
          </div>
        </div>

        {/* Price Distribution */}
        <div className="floating-card chart-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Price Distribution</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Products by price range</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <BiLineChart className="text-xl" />
            </div>
          </div>
          <div className="h-[300px]">
            {priceDistribution && (
              <Bar
                data={{
                  labels: priceDistribution.labels,
                  datasets: [{
                    label: 'Products',
                    data: priceDistribution.values,
                    backgroundColor: 'rgba(30, 58, 138, 0.8)',
                    borderRadius: 8,
                    barThickness: 40
                  }]
                }}
                options={barOptions}
              />
            )}
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="floating-card chart-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Rating Distribution</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Products by star rating</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
            <BiStar className="text-xl" />
          </div>
        </div>
        <div className="h-[300px]">
          {ratingDistribution && (
            <Bar
              data={{
                labels: ratingDistribution.labels,
                datasets: [{
                  label: 'Products',
                  data: ratingDistribution.values,
                  backgroundColor: chartColors.slice(0, ratingDistribution.labels.length),
                  borderRadius: 8,
                  barThickness: 60
                }]
              }}
              options={{
                ...barOptions,
                indexAxis: 'y' as const
              }}
            />
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="floating-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Featured Products</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Top rated products in your catalog</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
            View All <BiRightArrowAlt className="text-lg" />
          </Link>
        </div>
        
        <div className="product-grid">
          {topProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="floating-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-xl mb-4 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <BiPackage className="text-4xl" />
                  </div>
                )}
              </div>
              
              <div className="px-1">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {product.product_category}
                </span>
                <h4 className="mt-2 font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                  {product.product_name}
                </h4>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-slate-800 dark:text-white">
                    ${product.item_price?.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <BiStar className="fill-current" />
                    <span className="text-sm font-medium">{product.avg_star_rating?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
