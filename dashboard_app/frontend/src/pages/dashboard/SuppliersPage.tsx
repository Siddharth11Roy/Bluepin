import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Search,
  Filter,
  Star,
  Phone,
  MapPin,
  ExternalLink,
  ChevronDown,
  X,
  Package,
  Trophy,
  DollarSign,
  PieChart,
  BarChart3,
  Map,
} from 'lucide-react';
import { suppliersApi, statsApi } from '../../api';
import type { SupplierFilters, Supplier } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { HorizontalBarChart, DoughnutChart, ScatterChart } from '../../components/charts/Charts';

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

export default function SuppliersPage() {
  const [filters, setFilters] = useState<SupplierFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Fetch filter options
  const { data: filterOptions } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: statsApi.getFilterOptions,
  });

  // Fetch suppliers list
  const { data: suppliersData, isLoading: listLoading } = useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => suppliersApi.getSuppliers(filters),
  });

  // Fetch charts data
  const { data: chartsData, isLoading: chartsLoading } = useQuery({
    queryKey: ['supplierCharts', filters],
    queryFn: () => suppliersApi.getSupplierCharts(filters),
  });

  const suppliers = suppliersData?.suppliers || [];
  const totalCount = suppliersData?.count || 0;

  // Calculate dynamic metrics from current filtered view
  const metrics = useMemo(() => {
    if (!suppliers.length) return { avgPrice: 0, avgRating: 0, locationCount: 0 };
    
    const totalPri = suppliers.reduce((sum, s) => sum + (s.Price || 0), 0);
    const totalRat = suppliers.reduce((sum, s) => sum + (s.Rating || 0), 0);
    const locs = new Set(suppliers.map(s => s.Location)).size;

    return {
      avgPrice: totalPri / suppliers.length,
      avgRating: totalRat / suppliers.length,
      locationCount: locs
    };
  }, [suppliers]);

  const updateFilter = (key: keyof SupplierFilters, value: string | number | undefined) => {
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
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-emerald-500" />
            Suppliers
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Supplier network and partnerships
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 pr-4 py-2 w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'} relative`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div variants={itemVariants} className="card p-4 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.price_min || ''}
                  onChange={(e) => updateFilter('price_min', e.target.value ? Number(e.target.value) : undefined)}
                  className="input flex-1"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.price_max || ''}
                  onChange={(e) => updateFilter('price_max', e.target.value ? Number(e.target.value) : undefined)}
                  className="input flex-1"
                />
              </div>
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Min Rating
              </label>
              <div className="relative">
                <select
                  value={filters.rating_min || ''}
                  onChange={(e) => updateFilter('rating_min', e.target.value ? Number(e.target.value) : undefined)}
                  className="input appearance-none pr-10"
                >
                  <option value="">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Location
              </label>
              <div className="relative">
                <select
                  value={filters.location || ''}
                  onChange={(e) => updateFilter('location', e.target.value || undefined)}
                  className="input appearance-none pr-10"
                >
                  <option value="">All Locations</option>
                  {filterOptions?.locations?.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Product Type
              </label>
              <div className="relative">
                <select
                  value={filters.product || ''}
                  onChange={(e) => updateFilter('product', e.target.value || undefined)}
                  className="input appearance-none pr-10"
                >
                  <option value="">All Products</option>
                  {filterOptions?.products?.map((prod) => (
                    <option key={prod} value={prod}>
                      {prod}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* KPI Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card metric-card-success">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Suppliers</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {listLoading ? '...' : totalCount}
            </p>
          </div>
        </div>

        <div className="metric-card metric-card-primary">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-primary-500/20">
              <DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Avg Price</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {listLoading ? '...' : formatCurrency(metrics.avgPrice)}
            </p>
          </div>
        </div>

        <div className="metric-card metric-card-warning">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Avg Rating</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {listLoading ? '...' : metrics.avgRating.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="metric-card metric-card-info">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-cyan-500/20">
              <MapPin className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Locations</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {listLoading ? '...' : metrics.locationCount}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Visualizations Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Locations */}
        <div className="card lg:col-span-1 p-0">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Map className="w-4 h-4 text-primary-500" />
              Top Locations
            </h3>
          </div>
          <div className="h-64 px-4 pb-4">
            {chartsLoading ? (
               <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto mt-20"></div>
            ) : chartsData?.location ? (
              <HorizontalBarChart
                labels={chartsData.location.labels}
                data={chartsData.location.values}
                title="Suppliers"
              />
            ) : null}
          </div>
        </div>

        {/* Rounds Distribution */}
        <div className="card lg:col-span-1 p-0">
           <div className="p-4 border-b border-slate-100 dark:border-slate-700 mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Supplier Rounds
            </h3>
          </div>
          <div className="h-64 px-4 pb-4">
             {chartsLoading ? (
               <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto mt-20"></div>
            ) : chartsData?.rounds ? (
              <DoughnutChart
                labels={chartsData.rounds.labels}
                data={chartsData.rounds.values}
                title="Suppliers"
              />
             ) : null}
          </div>
        </div>

        {/* Price vs Rating Scatter */}
        <div className="card lg:col-span-1 p-0">
           <div className="p-4 border-b border-slate-100 dark:border-slate-700 mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              Price vs Rating
            </h3>
          </div>
          <div className="h-64 px-4 pb-4">
            {chartsLoading ? (
               <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto mt-20"></div>
            ) : chartsData?.scatter ? (
              <ScatterChart
                xData={chartsData.scatter.prices}
                yData={chartsData.scatter.ratings}
                labels={chartsData.scatter.labels}
                xLabel="Price"
                yLabel="Rating"
              />
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-medium text-slate-900 dark:text-white">{suppliers.length}</span> suppliers
        </p>
      </motion.div>

      {/* Suppliers Grid Layout */}
      <motion.div variants={itemVariants}>
        {listLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="card p-12 text-center">
            <Building2 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No suppliers found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Try adjusting your filters or search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {suppliers.map((supplier, index) => (
              <div 
                key={`${supplier['Supplier Name']}-${index}`}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col p-5"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-[140px] title-font">
                        {supplier['Supplier Name']}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Round {supplier['Supplier Round']}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded text-xs font-bold text-amber-700 dark:text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    {supplier.Rating.toFixed(1)}
                  </div>
                </div>

                {/* Card Body - Info List */}
                <div className="space-y-3 flex-1 mb-4">
                  <div className="flex items-start gap-3 text-sm">
                    <Package className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-slate-600 dark:text-slate-300 line-clamp-2">
                      {supplier['Product Searched']}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <p className="text-slate-600 dark:text-slate-300 truncate">
                      {supplier.Location}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={`tel:${supplier['Contact Phone']}`} className="text-primary-600 hover:text-primary-700 truncate">
                      {supplier['Contact Phone']}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                     <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-4 h-4 text-slate-400 shrink-0"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p className="text-slate-600 dark:text-slate-300">
                      {supplier.Reviews} reviews
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Price</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(supplier.Price)}
                    </p>
                  </div>
                  
                  {supplier['IndiaMART Link'] && (
                    <a
                      href={supplier['IndiaMART Link']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow"
                    >
                      View
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="ml-0.5"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
