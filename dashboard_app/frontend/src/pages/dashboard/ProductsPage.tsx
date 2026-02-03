import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Search,
  Grid,
  List,
  Star,
  Package,
  X,
  Filter,
} from 'lucide-react';
import { productsApi, statsApi } from '../../api';
import { formatCurrency } from '../../utils/formatters';
import type { ProductFilters } from '../../types';
import ProductMetrics from '../../components/dashboard/ProductMetrics';
import ProductCharts from '../../components/dashboard/ProductCharts';
import TopProductLists from '../../components/dashboard/TopProductLists';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch filter options
  const { data: filterOptions } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: statsApi.getFilterOptions,
  });

  // Fetch products with filters
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
  });

  // Fetch chart data with filters
  const { data: chartsData, isLoading: isChartsLoading } = useQuery({
    queryKey: ['productCharts', filters],
    queryFn: () => productsApi.getProductCharts(filters),
  });

  const products = productsData?.products || [];

  const updateFilter = (key: keyof ProductFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-primary-500" />
            Products Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Browse and manage product catalog
          </p>
        </div>
        
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden btn btn-outline w-full flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className={`
          lg:w-64 flex-shrink-0 
          ${showMobileFilters ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 p-6 overflow-y-auto' : 'hidden lg:block'}
        `}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white">Filters</h2>
             <button onClick={() => setShowMobileFilters(false)} className="p-2">
               <X className="w-6 h-6" />
             </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search || ''}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="pl-9 pr-4 py-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.price_min || ''}
                    onChange={(e) => updateFilter('price_min', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.price_max || ''}
                    onChange={(e) => updateFilter('price_max', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Customer Rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Customer Rating
                </label>
                <div className="space-y-2">
                  {[4, 3, 2].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating_min === rating}
                        onChange={() => updateFilter('rating_min', rating)}
                        className="w-4 h-4 text-primary-500 border-slate-300 focus:ring-primary-500"
                      />
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary-500 transition-colors">
                        <div className="flex items-center gap-0.5 mr-2 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}`} 
                            />
                          ))}
                        </div>
                        & Up
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      checked={!filters.rating_min}
                      onChange={() => updateFilter('rating_min', undefined)}
                      className="w-4 h-4 text-primary-500 border-slate-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-primary-500">All Ratings</span>
                  </label>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => updateFilter('category', e.target.value || undefined)}
                   className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {filterOptions?.categories?.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Metrics Section */}
          <ProductMetrics 
            products={products} 
            categories={filterOptions?.categories || []}
          />

          {/* Charts Section */}
          <ProductCharts 
            data={chartsData} 
            isLoading={isChartsLoading} 
          />

          {/* Top Lists Section */}
          <TopProductLists products={products} />

          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing <span className="font-medium text-slate-900 dark:text-white">{products.length}</span> products
            </p>

            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="card p-12 text-center">
              <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Try adjusting your filters or search term
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product['Product Identifier']}
                  to={`/product/${product['Product Identifier']}`}
                  className="group"
                >
                  <div className="product-card h-full">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.Image}
                        alt={product.Title}
                        className="product-card-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium px-4 py-2 bg-primary-500 rounded-lg">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="product-card-body">
                      {product.Category && (
                        <span className="badge badge-primary text-xs mb-2 inline-block">
                          {product.Category}
                        </span>
                      )}
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors h-10">
                        {product.Title.slice(0, 60)}...
                      </h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(product.Price)}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                          <Star className="w-4 h-4 fill-current" />
                          {product.Ratings?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        {product.Review} reviews
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Link
                  key={product['Product Identifier']}
                  to={`/product/${product['Product Identifier']}`}
                  className="card p-4 flex gap-4 hover:shadow-card-hover transition-shadow"
                >
                  <img
                    src={product.Image}
                    alt={product.Title}
                    className="w-24 h-24 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    {product.Category && <span className="badge badge-primary text-xs">{product.Category}</span>}
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-1 hover:text-primary-500 transition-colors">
                      {product.Title.slice(0, 80)}...
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(product.Price)}
                      </span>
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        {product.Ratings?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-sm text-slate-500">{product.Review} reviews</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
