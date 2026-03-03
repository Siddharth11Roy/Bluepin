import React from 'react';
import { Link } from 'react-router-dom';
import { BiPackage, BiStar, BiHeart, BiSolidHeart } from 'react-icons/bi';

interface Product {
  id: number;
  product_name: string;
  product_category: string;
  item_price: number;
  avg_star_rating: number;
  image_url?: string;
  supplier_name?: string;
}

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: number, e: React.MouseEvent) => void;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ 
  product, 
  isWishlisted = false, 
  onToggleWishlist,
  viewMode = 'grid'
}: ProductCardProps) {
  if (viewMode === 'list') {
    return (
      <Link
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
        {onToggleWishlist && (
          <button
            onClick={(e) => onToggleWishlist(product.id, e)}
            className="self-start w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 
              flex items-center justify-center hover:scale-110 transition-transform"
          >
            {isWishlisted ? (
              <BiSolidHeart className="text-xl text-red-500" />
            ) : (
              <BiHeart className="text-xl text-slate-400" />
            )}
          </button>
        )}
      </Link>
    );
  }

  return (
    <Link
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
        {onToggleWishlist && (
          <button
            onClick={(e) => onToggleWishlist(product.id, e)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 
              flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            {isWishlisted ? (
              <BiSolidHeart className="text-xl text-red-500" />
            ) : (
              <BiHeart className="text-xl text-slate-400" />
            )}
          </button>
        )}
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
  );
}
