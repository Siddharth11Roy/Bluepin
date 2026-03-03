import { useState, useEffect } from 'react';
import { 
  BiSearch, BiFilterAlt, BiX, BiStore, BiStar, BiPackage,
  BiChevronLeft, BiChevronRight, BiMap, BiGlobe
} from 'react-icons/bi';
import * as api from '../api/services';

interface Supplier {
  id: number;
  supplier_name: string;
  country?: string;
  rating?: number;
  total_products?: number;
  categories?: string[];
  website?: string;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    min_rating: ''
  });
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const perPage = 12;
  
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [filters, page]);

  const loadCountries = async () => {
    try {
      const data = await api.getFilterOptions();
      // Extract unique countries from suppliers if available
      setCountries(data.countries || []);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const cleanFilters: any = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) cleanFilters[key] = value;
      });
      
      const data = await api.getSuppliers(cleanFilters, page, perPage);
      setSuppliers(data.suppliers || []);
      setTotalPages(data.total_pages || 1);
      setTotalSuppliers(data.total || 0);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', country: '', min_rating: '' });
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Suppliers
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {totalSuppliers.toLocaleString()} suppliers available
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary ${showFilters ? 'bg-primary text-white' : ''}`}
        >
          <BiFilterAlt className="text-lg" />
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        {showFilters && (
          <div className="w-72 flex-shrink-0">
            <div className="floating-card sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-800 dark:text-white">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <BiX className="text-lg" />
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search suppliers..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                      bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                      focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Country */}
              {countries.length > 0 && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Country
                  </label>
                  <select
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                      bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                      focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Min Rating */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.min_rating}
                  onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                    bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Suppliers Content */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500">Loading suppliers...</p>
              </div>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="floating-card text-center py-16">
              <BiStore className="text-6xl text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-white mb-2">No suppliers found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Suppliers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {suppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="floating-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 
                        flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {supplier.supplier_name?.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 dark:text-white truncate">
                          {supplier.supplier_name}
                        </h3>
                        
                        {supplier.country && (
                          <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                            <BiMap className="text-base" />
                            {supplier.country}
                          </div>
                        )}
                        
                        {supplier.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            <BiStar className="text-amber-400 fill-current" />
                            <span className="text-sm font-medium text-slate-700 dark:text-white">
                              {supplier.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500">
                        <BiPackage className="text-lg" />
                        <span className="text-sm">{supplier.total_products || 0} products</span>
                      </div>
                      
                      {supplier.website && (
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark transition-colors"
                        >
                          <BiGlobe className="text-xl" />
                        </a>
                      )}
                    </div>
                    
                    {supplier.categories && supplier.categories.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {supplier.categories.slice(0, 3).map((cat, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 
                              px-2 py-1 rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                        {supplier.categories.length > 3 && (
                          <span className="text-xs text-slate-400">
                            +{supplier.categories.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BiChevronLeft className="text-xl" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all
                            ${page === pageNum 
                              ? 'bg-primary text-white' 
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BiChevronRight className="text-xl" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
