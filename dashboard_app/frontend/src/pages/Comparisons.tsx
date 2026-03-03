import { useState, useEffect } from 'react';
import { 
  BiGitCompare, BiPackage, BiStar, BiDollar, BiPlus, BiX, BiSearch
} from 'react-icons/bi';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import * as api from '../api/services';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Product {
  id: number;
  product_name: string;
  product_category: string;
  item_price: number;
  avg_star_rating: number;
  image_url?: string;
  supplier_name?: string;
}

export default function Comparisons() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchProducts();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({ search: searchQuery }, 1, 10);
      setSearchResults(data.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = (product: Product) => {
    if (selectedProducts.length < 4 && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setShowSearch(false);
    setSearchQuery('');
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const chartColors = [
    { bg: 'rgba(30, 58, 138, 0.7)', border: 'rgba(30, 58, 138, 1)' },
    { bg: 'rgba(16, 185, 129, 0.7)', border: 'rgba(16, 185, 129, 1)' },
    { bg: 'rgba(245, 158, 11, 0.7)', border: 'rgba(245, 158, 11, 1)' },
    { bg: 'rgba(239, 68, 68, 0.7)', border: 'rgba(239, 68, 68, 1)' }
  ];

  // Price comparison bar chart
  const priceChartData = {
    labels: selectedProducts.map(p => p.product_name.substring(0, 20) + '...'),
    datasets: [{
      label: 'Price ($)',
      data: selectedProducts.map(p => p.item_price),
      backgroundColor: selectedProducts.map((_, i) => chartColors[i]?.bg || 'rgba(100,100,100,0.7)'),
      borderColor: selectedProducts.map((_, i) => chartColors[i]?.border || 'rgba(100,100,100,1)'),
      borderWidth: 2,
      borderRadius: 8
    }]
  };

  // Rating comparison bar chart
  const ratingChartData = {
    labels: selectedProducts.map(p => p.product_name.substring(0, 20) + '...'),
    datasets: [{
      label: 'Rating',
      data: selectedProducts.map(p => p.avg_star_rating),
      backgroundColor: selectedProducts.map((_, i) => chartColors[i]?.bg || 'rgba(100,100,100,0.7)'),
      borderColor: selectedProducts.map((_, i) => chartColors[i]?.border || 'rgba(100,100,100,1)'),
      borderWidth: 2,
      borderRadius: 8
    }]
  };

  // Radar chart data
  const radarData = {
    labels: ['Price Value', 'Rating', 'Popularity', 'Quality Score', 'Value for Money'],
    datasets: selectedProducts.map((product, index) => ({
      label: product.product_name.substring(0, 15) + '...',
      data: [
        Math.min(100, (500 - product.item_price) / 5), // Price value (lower price = higher value)
        (product.avg_star_rating / 5) * 100, // Rating normalized
        Math.random() * 40 + 60, // Mock popularity
        Math.random() * 30 + 70, // Mock quality
        ((5 - product.item_price / 100) + product.avg_star_rating) * 10 // Value for money
      ],
      backgroundColor: chartColors[index]?.bg.replace('0.7', '0.3') || 'rgba(100,100,100,0.3)',
      borderColor: chartColors[index]?.border || 'rgba(100,100,100,1)',
      borderWidth: 2,
      pointBackgroundColor: chartColors[index]?.border || 'rgba(100,100,100,1)'
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#64748b' } }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom' as const,
        labels: { color: '#64748b', padding: 20, usePointStyle: true }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20, color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        pointLabels: { color: '#64748b', font: { size: 12 } }
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Product Comparison
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Compare up to 4 products side by side
          </p>
        </div>
      </div>

      {/* Product Selection */}
      <div className="floating-card mb-8">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Selected Products</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedProducts.map((product, index) => (
            <div 
              key={product.id}
              className="relative p-4 rounded-xl border-2 transition-all"
              style={{ borderColor: chartColors[index]?.border }}
            >
              <button
                onClick={() => removeProduct(product.id)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white 
                  flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <BiX className="text-sm" />
              </button>
              
              <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg mb-3 overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.product_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <BiPackage className="text-3xl" />
                  </div>
                )}
              </div>
              
              <h4 className="font-medium text-slate-800 dark:text-white text-sm line-clamp-2">
                {product.product_name}
              </h4>
              <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                ${product.item_price?.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 text-amber-500 mt-1">
                <BiStar className="fill-current text-sm" />
                <span className="text-xs">{product.avg_star_rating?.toFixed(1)}</span>
              </div>
            </div>
          ))}
          
          {selectedProducts.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setShowSearch(true)}
                className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600
                  flex flex-col items-center justify-center gap-2 text-slate-400 
                  hover:border-primary hover:text-primary transition-all"
              >
                <BiPlus className="text-3xl" />
                <span className="text-sm font-medium">Add Product</span>
              </button>
              
              {/* Search Dropdown */}
              {showSearch && (
                <div className="absolute top-0 left-0 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl z-10 overflow-hidden">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="relative">
                      <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        autoFocus
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 
                          bg-white dark:bg-slate-700 text-slate-700 dark:text-white
                          focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-slate-500">Searching...</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map(product => (
                        <button
                          key={product.id}
                          onClick={() => addProduct(product)}
                          disabled={selectedProducts.some(p => p.id === product.id)}
                          className="w-full p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 
                            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-600 overflow-hidden flex-shrink-0">
                            {product.image_url ? (
                              <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <BiPackage />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-medium text-slate-700 dark:text-white truncate">
                              {product.product_name}
                            </p>
                            <p className="text-xs text-slate-500">${product.item_price?.toFixed(2)}</p>
                          </div>
                        </button>
                      ))
                    ) : searchQuery.length > 2 ? (
                      <div className="p-4 text-center text-slate-500">No products found</div>
                    ) : (
                      <div className="p-4 text-center text-slate-500">Type to search...</div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                    className="w-full p-3 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 
                      border-t border-slate-200 dark:border-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Charts */}
      {selectedProducts.length >= 2 && (
        <div className="space-y-6">
          {/* Price & Rating Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="floating-card chart-card">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <BiDollar className="text-emerald-500" />
                Price Comparison
              </h3>
              <div className="h-[300px]">
                <Bar data={priceChartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="floating-card chart-card">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <BiStar className="text-amber-500" />
                Rating Comparison
              </h3>
              <div className="h-[300px]">
                <Bar data={ratingChartData} options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: { ...chartOptions.scales.y, max: 5, beginAtZero: true }
                  }
                }} />
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="floating-card chart-card">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <BiGitCompare className="text-primary" />
              Overall Comparison
            </h3>
            <div className="h-[400px]">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* Comparison Table */}
          <div className="floating-card overflow-x-auto">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Detailed Comparison
            </h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                    Attribute
                  </th>
                  {selectedProducts.map((product, index) => (
                    <th 
                      key={product.id} 
                      className="text-left py-3 px-4 font-medium"
                      style={{ color: chartColors[index]?.border }}
                    >
                      {product.product_name.substring(0, 20)}...
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Price</td>
                  {selectedProducts.map(product => (
                    <td key={product.id} className="py-3 px-4 font-semibold text-slate-800 dark:text-white">
                      ${product.item_price?.toFixed(2)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Rating</td>
                  {selectedProducts.map(product => (
                    <td key={product.id} className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <BiStar className="text-amber-400 fill-current" />
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {product.avg_star_rating?.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Category</td>
                  {selectedProducts.map(product => (
                    <td key={product.id} className="py-3 px-4 text-slate-800 dark:text-white">
                      {product.product_category}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Supplier</td>
                  {selectedProducts.map(product => (
                    <td key={product.id} className="py-3 px-4 text-slate-800 dark:text-white">
                      {product.supplier_name || 'N/A'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedProducts.length < 2 && (
        <div className="floating-card text-center py-16">
          <BiGitCompare className="text-6xl text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-white mb-2">
            Select Products to Compare
          </h3>
          <p className="text-slate-500">
            Add at least 2 products to see comparison charts
          </p>
        </div>
      )}
    </div>
  );
}
