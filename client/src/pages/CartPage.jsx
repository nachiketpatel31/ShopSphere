import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';

export const CartPage = () => {
  const {
    cart,
    loading,
    itemCount,
    subtotal,
    shippingFee,
    tax,
    total,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const navigate = useNavigate();

  if (loading && !cart) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-xs text-ink-muted">
        Loading your shopping bag...
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your shopping bag is empty"
          description="Explore our studio collection of precision acoustics, garments, and carry goods."
          actionText="Explore Studio Collection"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  const freeShippingThreshold = 1500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-6 border-b border-hairline/80">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} curated for checkout
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-ink-light hover:text-rose-600 font-semibold transition-colors"
        >
          Clear bag
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      {remainingForFreeShipping > 0 ? (
        <div className="bg-surface p-4 rounded-2xl border border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <span>
            Add <strong className="text-dark font-bold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more to qualify for <strong className="text-dark">Complimentary Domestic Shipping</strong>.
          </span>
          <Link to="/products" className="font-bold text-dark hover:underline">
            Browse pieces →
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <span>✓ Qualified for Complimentary Domestic Shipping!</span>
        </div>
      )}

      {/* Main Bag Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={item._id}
                className="bg-surface rounded-2xl border border-hairline/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-dark/20"
              >
                {/* Product Media & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <Link
                    to={`/products/${product._id}`}
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-white p-2 flex-shrink-0 border border-hairline flex items-center justify-center"
                  >
                    <ImageWithFallback
                      src={product.images && product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-light">
                      {product.category}
                    </span>
                    <Link
                      to={`/products/${product._id}`}
                      className="font-bold text-sm text-dark hover:text-neutral-700 block line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs font-extrabold text-dark">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    {!item.isAvailable && (
                      <Badge variant="danger" size="xs">
                        Stock unavailable
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Quantity Stepper & Price Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-hairline">
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center border border-hairline rounded-full bg-white p-1 shadow-subtle">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-dark hover:bg-surface transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-dark">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      disabled={item.quantity >= product.stock}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-dark hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm font-extrabold text-dark tracking-tight">
                      ₹{item.itemTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 text-ink-light hover:text-rose-600 transition-colors rounded-full hover:bg-white"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-4 flex items-center justify-between">
            <Link
              to="/products"
              className="text-xs font-bold text-dark hover:underline transition-colors"
            >
              ← Continue Curating
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="bg-surface rounded-3xl border border-hairline p-6 sm:p-8 shadow-subtle space-y-6">
            <h3 className="text-lg font-extrabold text-dark pb-4 border-b border-hairline">
              Order Summary
            </h3>

            {/* Calculations strictly verified on server */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-ink-muted">
                <span>Items Subtotal</span>
                <span className="font-semibold text-dark">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Shipping Fee</span>
                <span className="font-semibold text-dark">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `₹${shippingFee.toLocaleString('en-IN')}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Estimated Tax (5% GST)</span>
                <span className="font-semibold text-dark">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-hairline pt-3 flex justify-between text-sm font-extrabold text-dark">
                <span>Total Amount</span>
                <span className="text-xl font-extrabold text-dark tracking-tight">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Button
              onClick={() => navigate('/checkout')}
              variant="primary"
              size="lg"
              className="w-full shadow-md font-bold"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <div className="pt-2 border-t border-hairline text-[11px] text-ink-muted space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Verified server-side pricing & atomic stock guarantee.</span>
              </div>
              <p className="text-ink-light text-[10px]">
                Payment will be collected via Cash on Delivery upon shipment arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
