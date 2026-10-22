import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';

export const WishlistPage = () => {
  const { wishlist, loading, count, toggleWishlist, moveToCart } = useWishlist();
  const navigate = useNavigate();

  if (loading && wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-neutral-400">
        Loading saved pieces...
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save favorite pieces you want to revisit later or move into your shopping bag."
          actionText="Browse Collection"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Personal Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0C0C0E] tracking-tight mt-1">
            Saved <span className="text-neutral-400 font-light">Wishlist</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-neutral-500 bg-[#F4F4F6] px-3 py-1.5 rounded-full border border-neutral-200">
            {count} {count === 1 ? 'item' : 'items'} saved
          </span>
          <Link to="/products">
            <Button variant="outline" size="sm">
              <span>Continue Browsing</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          if (!product) return null;
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={product._id}
              className="group bg-[#F4F4F6] rounded-3xl border border-neutral-200/80 hover:border-neutral-400 transition-all flex flex-col overflow-hidden"
            >
              {/* Image Preview */}
              <div className="relative aspect-[4/3] bg-white m-3 rounded-2xl overflow-hidden flex items-center justify-center p-4">
                <Link to={`/products/${product._id}`} className="w-full h-full flex items-center justify-center">
                  <ImageWithFallback
                    src={product.images && product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-neutral-400 hover:text-red-500 shadow-sm flex items-center justify-center transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {isOutOfStock && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="accent" size="xs">
                      Sold Out
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info & Action */}
              <div className="p-5 pt-2 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {product.category}
                  </span>
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-extrabold text-base text-[#0C0C0E] hover:underline transition-colors line-clamp-1 mt-0.5">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-base font-extrabold text-[#0C0C0E] mt-1">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </p>
                </div>

                <Button
                  onClick={() => moveToCart(product._id)}
                  disabled={isOutOfStock}
                  variant="primary"
                  size="sm"
                  className="w-full gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Move to Bag'}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
