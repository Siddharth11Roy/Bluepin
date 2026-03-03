import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiHeart, BiSolidHeart, BiPackage, BiStar, BiTrash, BiX } from 'react-icons/bi';
import * as api from '../api/services';

interface WishlistItem {
  id: number;
  product_id: number;
  product_name: string;
  product_category: string;
  item_price: number;
  avg_star_rating: number;
  image_url?: string;
  supplier_name?: string;
  added_at: string;
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await api.getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      await api.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const clearWishlist = async () => {
    try {
      // Remove all items one by one
      await Promise.all(wishlist.map(item => api.removeFromWishlist(item.product_id)));
      setWishlist([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
            <BiSolidHeart className="text-red-500" />
            My Wishlist
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="btn-secondary text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <BiTrash className="text-lg" />
            Clear All
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="floating-card text-center py-16">
          <BiHeart className="text-6xl text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-white mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-slate-500 mb-6">
            Save products you're interested in to view them later
          </p>
          <Link to="/products" className="btn-primary inline-flex">
            <BiPackage className="text-lg" />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="floating-card group relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(item.product_id)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-red-500 text-white 
                  flex items-center justify-center opacity-0 group-hover:opacity-100 
                  transition-opacity hover:bg-red-600"
              >
                <BiX className="text-lg" />
              </button>

              <Link to={`/products/${item.product_id}`}>
                <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-xl mb-4 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.product_name}
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
                    {item.product_category}
                  </span>
                  <h4 className="mt-2 font-semibold text-slate-800 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                    {item.product_name}
                  </h4>
                  {item.supplier_name && (
                    <p className="text-sm text-slate-500 mt-1">{item.supplier_name}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-slate-800 dark:text-white">
                      ${item.item_price?.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <BiStar className="fill-current" />
                      <span className="text-sm font-medium">{item.avg_star_rating?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
