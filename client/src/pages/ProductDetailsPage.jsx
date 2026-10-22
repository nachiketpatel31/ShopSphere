import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
  ArrowLeft,
  Check,
  Star
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { StarRating } from '../components/common/StarRating';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ProductCard } from '../components/product/ProductCard';
import { Skeleton } from '../components/common/Skeleton';
import toast from 'react-hot-toast';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedImage(0);
        setQuantity(1);

        const res = await productService.getProductById(id);
        if (res.success) {
          setProduct(res.product);
          setRelatedProducts(res.relatedProducts || []);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Skeleton className="w-48 h-4 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="w-full aspect-[4/5] rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="w-1/4 h-4 rounded-full" />
            <Skeleton className="w-3/4 h-8 rounded-xl" />
            <Skeleton className="w-1/3 h-6 rounded-lg" />
            <Skeleton className="w-full h-32 rounded-2xl" />
            <Skeleton className="w-1/2 h-12 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-dark">Product Unavailable</h2>
        <p className="text-sm text-ink-muted">
          The requested product could not be found or has been retired from the catalog.
        </p>
        <div className="pt-4">
          <Button onClick={() => navigate('/products')} variant="primary">
            Return to Catalog
          </Button>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    setAddingToCart(true);
    await addToCart(product._id, quantity);
    setAddingToCart(false);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const nextVal = prev + delta;
      if (nextVal < 1) return 1;
      if (nextVal > product.stock) {
        toast.error(`Only ${product.stock} units currently available.`);
        return product.stock;
      }
      return nextVal;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-ink-muted">
        <Link to="/" className="hover:text-dark transition-colors font-medium">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-dark transition-colors font-medium">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-dark font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Display */}
          <div className="relative aspect-[4/5] bg-surface rounded-3xl overflow-hidden border border-hairline flex items-center justify-center p-8">
            <ImageWithFallback
              src={product.images && product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            {discountPercent && (
              <div className="absolute top-5 left-5">
                <Badge variant="accent" size="sm">
                  Save {discountPercent}%
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden p-2 bg-surface border-2 transition-all flex-shrink-0 ${
                    selectedImage === idx
                      ? 'border-dark shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3 border-b border-hairline pb-6">
            <div className="flex items-center justify-between text-xs text-ink-light">
              <span className="font-extrabold uppercase tracking-widest text-dark">{product.category}</span>
              <span className="font-mono text-[11px] text-ink-light">SKU: {product.sku}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <StarRating rating={product.rating} numReviews={product.numReviews} size="md" />
              <span className="text-ink-light">•</span>
              {isOutOfStock ? (
                <span className="text-xs font-bold text-rose-600">Sold Out</span>
              ) : isLowStock ? (
                <span className="text-xs font-bold text-amber-700">
                  Only {product.stock} units remaining
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                </span>
              )}
            </div>

            {/* Pricing */}
            <div className="pt-3 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-dark tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-ink-light line-through font-medium">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark">Craftsmanship & Details</h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector & Add To Bag */}
          <div className="space-y-4 pt-4 border-t border-hairline">
            {!isOutOfStock && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-light mb-2">
                  Select Quantity
                </label>
                <div className="inline-flex items-center border border-hairline rounded-full bg-surface p-1">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-dark hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-dark">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-dark hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                loading={addingToCart}
                variant="primary"
                size="lg"
                className="flex-1 shadow-md font-bold"
              >
                <ShoppingBag className="w-4 h-4 mr-1" />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
              </Button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-full border transition-all ${
                  inWishlist
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-hairline bg-surface text-dark hover:text-rose-600 hover:bg-white'
                }`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Specifications Grid */}
          {product.specs && product.specs.length > 0 && (
            <div className="pt-6 border-t border-hairline space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.specs.map((spec, i) => (
                  <div key={i} className="bg-surface rounded-2xl p-3 border border-hairline/60">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-light">
                      {spec.label}
                    </span>
                    <span className="text-xs font-semibold text-dark mt-0.5 block">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Value Assurances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-hairline text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-dark flex-shrink-0" />
              <span>Complimentary shipping &gt; ₹1,500</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-dark flex-shrink-0" />
              <span>30-Day returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-dark flex-shrink-0" />
              <span>Cash on delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Rail */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="pt-16 border-t border-hairline space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-ink-light mb-1">
                Complementary Pieces
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">
                Related in {product.category}
              </h2>
            </div>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold uppercase tracking-wider text-dark hover:underline flex items-center gap-1"
            >
              <span>View Category</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
