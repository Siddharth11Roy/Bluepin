import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BiSearch, BiFilterAlt, BiX, BiPackage, BiStar, BiHeart, BiSolidHeart,
  BiChevronLeft, BiChevronRight, BiGridAlt, BiListUl
} from 'react-icons/bi';
import * as api from '../api/services';

interface Product {
  id: number;
  product_name: string;
  product_category: string;
  item_price: number;
  avg_star_rating: number;
  image_url?: string;
  supplier_name?: string;
  brand?: string;
}

interface FilterOptions {
  categories: string[];
  suppliers: string[];
  brands: string[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ categories: [], suppliers: [], brands: [] });
  const [wishlist, setWishlist] = useState<number[]>([]);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: '',
    brand: '',
    min_price: '',
    max_price: '',
    min_rating: ''
  });
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const perPage = 20;
  
  // UI state
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadFilterOptions();
    loadWishlist();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters, page]);

  const loadFilterOptions = async () => {
    try {
      const data = await api.getFilterOptions();
      setFilterOptions(data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const loadWishlist = async () => {
    try {
      const data = await api.getWishlist();
      setWishlist(data.map((item: any) => item.product_id));
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const cleanFilters: any = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) cleanFilters[key] = value;
      });
      
      const data = await api.getProducts(cleanFilters, page, perPage);
      setProducts(data.products || []);
      setTotalPages(data.total_pages || 1);
      setTotalProducts(data.total || 0);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      supplier: '',
      brand: '',
      min_price: '',
      max_price: '',
      min_rating: ''
    });
    setPage(1);
  };

  const toggleWishlist = async (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (wishlist.includes(productId)) {
        await api.removeFromWishlist(productId);
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await api.addToWishlist(productId);
        setWishlist(prev => [...prev, productId]);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Products
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {totalProducts.toLocaleString()} products available
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary ${showFilters ? 'bg-primary text-white' : ''}`}
          >
            <BiFilterAlt className="text-lg" />
            Filters
          </button>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <BiGridAlt className="text-xl" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <BiListUl className="text-xl" />
            </button>
          </div>
        </div>
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
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                      bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                      focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                    bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Supplier */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Supplier
                </label>
                <select
                  value={filters.supplier}
                  onChange={(e) => handleFilterChange('supplier', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                    bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="">All Suppliers</option>
                  {filterOptions.suppliers.slice(0, 50).map(sup => (
                    <option key={sup} value={sup}>{sup}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                      bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                      focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <input
                    type="number"
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 
                      bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                      focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

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

        {/* Products Content */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="floating-card text-center py-16">
              <BiPackage className="text-6xl text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-white mb-2">No products found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className={viewMode === 'grid' ? 'product-grid-4' : 'space-y-4'}>
                {products.map((product) => (
                  viewMode === 'grid' ? (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="floating-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-square bg-slate-100 dark:bg-slate-700 rounded-xl mb-4 overflow-hidden">
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
                        <button
                          onClick={(e) => toggleWishlist(product.id, e)}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 
                            flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                        >
                          {wishlist.includes(product.id) ? (
                            <BiSolidHeart className="text-xl text-red-500" />
                          ) : (
                            <BiHeart className="text-xl text-slate-400" />
                          )}
                        </button>
                      </div>
                      
                      <div className="px-1">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {product.product_category}
                        </span>
                        <h4 className="mt-2 font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                          {product.product_name}
                        </h4>
                        {product.supplier_name && (
                          <p className="text-sm text-slate-500 mt-1">{product.supplier_name}</p>
                        )}
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
                  ) : (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="floating-card flex gap-4 group hover:shadow-xl transition-all"
                    >
                      <div className="w-32 h-32 flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <BiPackage className="text-3xl" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {product.product_category}
                        </span>
                        <h4 className="mt-2 font-semibold text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                          {product.product_name}
                        </h4>
                        {product.supplier_name && (
                          <p className="text-sm text-slate-500 mt-1">{product.supplier_name}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-lg font-bold text-slate-800 dark:text-white">
                            ${product.item_price?.toFixed(2)}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500">
                            <BiStar className="fill-current" />
                            <span className="text-sm font-medium">{product.avg_star_rating?.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className="self-start w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 
                          flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        {wishlist.includes(product.id) ? (
                          <BiSolidHeart className="text-xl text-red-500" />
                        ) : (
                          <BiHeart className="text-xl text-slate-400" />
                        )}
                      </button>
                    </Link>
                  )
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
