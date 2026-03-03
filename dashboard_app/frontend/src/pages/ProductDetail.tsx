import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BiArrowBack, BiStar, BiHeart, BiSolidHeart, BiPackage, BiStore,
  BiCategoryAlt, BiLink, BiCheck, BiX
} from 'react-icons/bi';
import * as api from '../api/services';

interface ProductDetail {
  id: number;
  product_name: string;
  product_category: string;
  item_price: number;
  avg_star_rating: number;
  image_url?: string;
  supplier_name?: string;
  brand?: string;
  description?: string;
  total_reviews?: number;
  in_stock?: boolean;
  url?: string;
  specifications?: Record<string, string>;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getProductById(parseInt(id!));
      setProduct(data);
      
      // Check wishlist status
      const wishlist = await api.getWishlist();
      setIsWishlisted(wishlist.some((item: any) => item.product_id === parseInt(id!)));
      
      // Load related products
      if (data.product_category) {
        const related = await api.getProducts({ category: data.product_category }, 1, 4);
        setRelatedProducts((related.products || []).filter((p: any) => p.id !== parseInt(id!)));
      }
    } catch (err: any) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;
    try {
      if (isWishlisted) {
        await api.removeFromWishlist(product.id);
        setIsWishlisted(false);
      } else {
        await api.addToWishlist(product.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="floating-card text-center py-16 max-w-lg mx-auto">
        <BiPackage className="text-6xl text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          <BiArrowBack className="text-lg" />
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-white">{product.product_category}</span>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[200px]">{product.product_name}</span>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary mb-6 transition-colors"
      >
        <BiArrowBack className="text-xl" />
        Back
      </button>

      {/* Product Details Card */}
      <div className="floating-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-2xl overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <BiPackage className="text-8xl" />
                </div>
              )}
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/95 dark:bg-slate-800/95 
                flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              {isWishlisted ? (
                <BiSolidHeart className="text-2xl text-red-500" />
              ) : (
                <BiHeart className="text-2xl text-slate-400" />
              )}
            </button>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit mb-4">
              {product.product_category}
            </span>
            
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
              {product.product_name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <BiStar
                    key={star}
                    className={`text-xl ${
                      star <= Math.round(product.avg_star_rating || 0)
                        ? 'text-amber-400 fill-current'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="font-medium text-slate-700 dark:text-white ml-1">
                  {product.avg_star_rating?.toFixed(1)}
                </span>
              </div>
              {product.total_reviews && (
                <span className="text-slate-500">
                  ({product.total_reviews.toLocaleString()} reviews)
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-800 dark:text-white">
                ${product.item_price?.toFixed(2)}
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              {product.in_stock !== false ? (
                <>
                  <BiCheck className="text-xl text-emerald-500" />
                  <span className="text-emerald-600 font-medium">In Stock</span>
                </>
              ) : (
                <>
                  <BiX className="text-xl text-red-500" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4 py-6 border-t border-b border-slate-200 dark:border-slate-700">
              {product.supplier_name && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <BiStore />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Supplier</p>
                    <p className="font-medium text-slate-700 dark:text-white">{product.supplier_name}</p>
                  </div>
                </div>
              )}
              
              {product.brand && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
                    <BiCategoryAlt />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Brand</p>
                    <p className="font-medium text-slate-700 dark:text-white">{product.brand}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <button 
                onClick={toggleWishlist}
                className={`btn-secondary flex-1 ${isWishlisted ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
              >
                {isWishlisted ? (
                  <>
                    <BiSolidHeart className="text-lg" />
                    Remove from Wishlist
                  </>
                ) : (
                  <>
                    <BiHeart className="text-lg" />
                    Add to Wishlist
                  </>
                )}
              </button>
              
              {product.url && (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1"
                >
                  <BiLink className="text-lg" />
                  View Source
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Description</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500">{key}</span>
                  <span className="font-medium text-slate-700 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Related Products</h2>
            <Link 
              to={`/products?category=${product.product_category}`}
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="product-grid-4">
            {relatedProducts.slice(0, 4).map((relProduct) => (
              <Link
                key={relProduct.id}
                to={`/products/${relProduct.id}`}
                className="floating-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-xl mb-4 overflow-hidden">
                  {relProduct.image_url ? (
                    <img
                      src={relProduct.image_url}
                      alt={relProduct.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <BiPackage className="text-4xl" />
                    </div>
                  )}
                </div>
                
                <h4 className="font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                  {relProduct.product_name}
                </h4>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-slate-800 dark:text-white">
                    ${relProduct.item_price?.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <BiStar className="fill-current" />
                    <span className="text-sm font-medium">{relProduct.avg_star_rating?.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
