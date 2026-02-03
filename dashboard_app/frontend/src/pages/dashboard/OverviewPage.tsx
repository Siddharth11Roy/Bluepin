import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Building2,
  DollarSign,
  ShoppingCart,
  ArrowUp,
  RefreshCw,
  Download,
  Star,
  MapPin,
  Trophy,
  Award,
  Gem,
  BarChart3,
  PieChart,
  MapPinned,
  Tags,
} from 'lucide-react';
import { statsApi, productsApi, suppliersApi } from '../../api';
import { formatCurrency, formatNumber, formatCompact } from '../../utils/formatters';
import { BarChart, DoughnutChart, HorizontalBarChart } from '../../components/charts/Charts';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function OverviewPage() {
  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.getStats,
  });

  // Fetch top products
  const { data: topProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['topProducts'],
    queryFn: async () => {
      const data = await productsApi.getTopProducts(6, 'ratings');
      return Array.isArray(data) ? data : [];
    },
  });

  // Fetch top suppliers
  const { data: topSuppliers, isLoading: suppliersLoading } = useQuery({
    queryKey: ['topSuppliers'],
    queryFn: async () => {
      const data = await suppliersApi.getTopSuppliers(6, 'rating');
      return Array.isArray(data) ? data : [];
    },
  });

  // Fetch price distribution for chart
  const { data: priceDistribution } = useQuery({
    queryKey: ['priceDistribution'],
    queryFn: statsApi.getPriceDistribution,
  });

  // Fetch rating distribution for chart
  const { data: ratingDistribution } = useQuery({
    queryKey: ['ratingDistribution'],
    queryFn: statsApi.getRatingDistribution,
  });

  // Fetch location stats for chart
  const { data: locationStats } = useQuery({
    queryKey: ['locationStats'],
    queryFn: statsApi.getLocationStats,
  });

  // Fetch categories for chart
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: statsApi.getCategories,
  });

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-primary-500">📊</span>
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="btn btn-outline btn-sm flex items-center gap-2 h-9"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button className="btn btn-primary btn-sm flex items-center gap-2 h-9">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="metric-card metric-card-primary">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-lg bg-primary-500/20">
              <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
              <ArrowUp className="w-3 h-3" />
              12.5%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Products</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {statsLoading ? '...' : formatNumber(stats?.total_products || 0)}
            </p>
          </div>
        </div>

        {/* Total Suppliers */}
        <div className="metric-card metric-card-success">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-lg bg-emerald-500/20">
              <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
              <ArrowUp className="w-3 h-3" />
              8.3%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Suppliers</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {statsLoading ? '...' : formatNumber(stats?.total_suppliers || 0)}
            </p>
          </div>
        </div>

        {/* Total Sales */}
        <div className="metric-card metric-card-warning">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-lg bg-amber-500/20">
              <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
              <ArrowUp className="w-3 h-3" />
              12.8%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Sales</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {statsLoading ? '...' : `₹${(stats?.total_sales_millions || 0).toFixed(1)}M`}
            </p>
          </div>
        </div>

        {/* Units Sold */}
        <div className="metric-card metric-card-purple">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-lg bg-purple-500/20">
              <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
              <ArrowUp className="w-3 h-3" />
              18.3%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Units Sold</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {statsLoading ? '...' : formatCompact(stats?.total_reviews || 0)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Charts Row 1: Price Distribution & Rating Distribution */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Price Distribution Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-500" />
                Price Distribution Analysis
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Product pricing trends across ranges
              </p>
            </div>
          </div>
          <div className="p-4">
            <div className="h-64">
              {priceDistribution ? (
                <BarChart
                  labels={priceDistribution.bins || []}
                  data={priceDistribution.counts || []}
                  title="Products"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rating Distribution Chart */}
        <div className="card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-500" />
                Rating Distribution
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customer satisfaction metrics
              </p>
            </div>
          </div>
          <div className="p-4">
            <div className="h-64">
              {ratingDistribution ? (
                <DoughnutChart
                  labels={ratingDistribution.labels || []}
                  data={ratingDistribution.counts || []}
                  title="Ratings"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Row 2: Suppliers by Location & Top Categories */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Suppliers by Location */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPinned className="w-4 h-4 text-red-500" />
                Suppliers by Location
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Geographic distribution of suppliers
              </p>
            </div>
          </div>
          <div className="p-4">
            <div className="h-64">
              {locationStats && Array.isArray(locationStats) && locationStats.length > 0 ? (
                <HorizontalBarChart
                  labels={locationStats.slice(0, 10).map((s: any) => s.location || '')}
                  data={locationStats.slice(0, 10).map((s: any) => s.supplier_count || 0)}
                  title="Suppliers"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Tags className="w-4 h-4 text-amber-500" />
                Top Categories
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Most popular product categories
              </p>
            </div>
          </div>
          <div className="p-4">
            <div className="h-64">
              {categories && Array.isArray(categories) && categories.length > 0 ? (
                <DoughnutChart
                  labels={categories.slice(0, 6).map((c: any) => c.category || '')}
                  data={categories.slice(0, 6).map((c: any) => c.count || 0)}
                  title="Products"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top Products Section */}
      <motion.div variants={itemVariants} className="card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Most Profitable Products
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Highest rated products this month
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
          >
            View All →
          </Link>
        </div>

        <div className="p-4">
          {productsLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : topProducts && topProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {topProducts.map((product) => (
                <Link
                  key={product['Product Identifier']}
                  to={`/product/${product['Product Identifier']}`}
                  className="group"
                >
                  <div className="product-card group">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.Image}
                        alt={product.Title}
                        className="product-card-image h-40"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium">View Details</span>
                      </div>
                    </div>
                    <div className="product-card-body p-3">
                      <h3 className="text-xs font-medium text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors h-8">
                        {product.Title.slice(0, 40)}...
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(product.Price)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                          <Star className="w-3 h-3 fill-current" />
                          {product.Ratings.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {product.Review} reviews
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
              No products available.
            </div>
          )}
        </div>
      </motion.div>

      {/* Top Suppliers Section */}
      <motion.div variants={itemVariants} className="card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-primary-500" />
              Top Suppliers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Leading suppliers by performance
            </p>
          </div>
          <Link
            to="/suppliers"
            className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          {suppliersLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : topSuppliers && topSuppliers.length > 0 ? (
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="w-16">Rank</th>
                  <th>Supplier Name</th>
                  <th>Location</th>
                  <th>Rating</th>
                  <th>Reviews</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {topSuppliers.map((supplier, index) => (
                  <tr key={supplier['Supplier Name']}>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs ${
                        index === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                        index === 1 ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' :
                        index === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                        'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {index === 0 ? <Trophy className="w-3 h-3" /> :
                         index === 1 ? <Award className="w-3 h-3" /> :
                         index === 2 ? <Gem className="w-3 h-3" /> :
                         index + 1}
                      </span>
                    </td>
                    <td className="font-medium text-slate-900 dark:text-white py-2.5">
                      {supplier['Supplier Name']}
                    </td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-xs">
                        <MapPin className="w-3 h-3" />
                        {supplier.Location}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className="badge badge-warning flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {supplier.Rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-slate-500 dark:text-slate-400 text-xs py-2.5">
                      {supplier.Reviews}
                    </td>
                    <td className="py-2.5">
                      <code className="text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                        {supplier['Contact Phone']}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
              No suppliers available.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
