import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';

export const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative bg-surface hover:bg-surface-hover/80 rounded-3xl border border-hairline/80 hover:border-dark/20 hover:shadow-elevated transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] bg-white m-3 rounded-2xl overflow-hidden flex items-center justify-center p-4">
        <Link to={`/products/${product._id}`} className="block w-full h-full flex items-center justify-center">
          <ImageWithFallback
            src={product.images && product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent && (
            <Badge variant="accent" size="xs">
              Save {discountPercent}%
            </Badge>
          )}
          {isOutOfStock ? (
            <Badge variant="danger" size="xs">
              Sold Out
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning" size="xs">
              Only {product.stock} Left
            </Badge>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-subtle ${
            inWishlist
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 text-ink-muted hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Product Metadata & Info (Reference Layout) */}
      <div className="px-5 pb-5 pt-1 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Sub-tags row */}
          <div className="flex items-center justify-between text-[11px] text-ink-light font-medium tracking-tight mb-1">
            <span className="uppercase tracking-wider">{product.category}</span>
            {product.rating > 0 && (
              <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                ★ {Number(product.rating).toFixed(1)}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/products/${product._id}`} className="block">
            <h3 className="font-bold text-sm text-dark group-hover:text-neutral-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-1">
            Studio Crafted • Authentic Materials
          </p>
        </div>

        {/* Price & Add to Bag row */}
        <div className="pt-2 border-t border-hairline/60 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-dark tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-ink-light line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {!isOutOfStock ? (
            <button
              type="button"
              onClick={() => addToCart(product._id, 1)}
              className="text-xs font-bold text-dark hover:text-neutral-600 underline underline-offset-4 transition-colors flex items-center gap-1 active:scale-95"
            >
              <span>Add to bag</span>
            </button>
          ) : (
            <span className="text-xs font-semibold text-ink-light">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
};
