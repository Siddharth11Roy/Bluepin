import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Share2,
  Heart,
  Building2,
  TrendingUp,
  Package,
} from 'lucide-react';
import { productsApi } from '../../api';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getProductDetail(productId!),
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card p-12 text-center">
        <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          Product not found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          to="/products"
          className="flex items-center gap-1 text-primary-500 hover:text-primary-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-500 dark:text-slate-400">{product.Category}</span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="card overflow-hidden">
          <img
            src={product.Image}
            alt={product.Title}
            className="w-full h-96 object-contain bg-slate-50 dark:bg-slate-800"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
            }}
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Title & Category */}
          <div>
            <span className="badge badge-primary text-sm mb-3">
              {product.Category}
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
              {product.Title}
            </h1>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.Ratings)
                        ? 'text-amber-500 fill-current'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                {product.Ratings.toFixed(1)}
              </span>
            </div>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 dark:text-slate-400">
              {formatNumber(product.Review)} reviews
            </span>
          </div>

          {/* Price */}
          <div className="p-6 bg-gradient-to-br from-emerald-50 to-primary-50 dark:from-emerald-900/20 dark:to-primary-900/20 rounded-xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Price</p>
            <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(product.Price)}
            </p>
          </div>

          {/* Stats */}
          {product.Sales_Number && (
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <ShoppingCart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Units Sold</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {formatNumber(product.Sales_Number)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Revenue</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(product.Sales_Number * product.Price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="btn-ghost p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Heart className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <button className="btn-ghost p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <Link
              to={`/comparisons?product=${productId}`}
              className="btn btn-primary flex-1"
            >
              <Building2 className="w-5 h-5" />
              Compare with Suppliers
            </Link>
          </div>
        </div>
      </div>

      {/* Similar Products Placeholder */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Similar Products
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Coming soon...
        </p>
      </div>
    </div>
  );
}
