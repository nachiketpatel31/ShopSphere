import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, Banknote, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import toast from 'react-hot-toast';

export const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, itemCount, subtotal, shippingFee, tax, total, refreshCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        street: prev.street || user.shippingAddress?.street || '',
        city: prev.city || user.shippingAddress?.city || '',
        state: prev.state || user.shippingAddress?.state || '',
        postalCode: prev.postalCode || user.shippingAddress?.postalCode || '',
        country: prev.country || user.shippingAddress?.country || 'India'
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Contact phone number is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please complete all required shipping fields.');
      return;
    }

    try {
      setSubmitting(true);
      setOrderError(null);

      const orderPayload = {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim()
        },
        paymentMethod: 'COD'
      };

      const res = await orderService.createOrder(orderPayload);
      if (res.success && res.order) {
        toast.success('Order placed successfully!');
        await refreshCart();
        navigate(`/order-confirmation/${res.order._id}`, { state: { order: res.order } });
      }
    } catch (err) {
      console.error('Order placement failure:', err);
      setOrderError(err.message || 'Checkout failed. Please check item stock availability.');
      toast.error(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Checkout Header */}
      <div className="pb-6 border-b border-hairline/80 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Checkout & Delivery
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Complete your delivery details to confirm your order
          </p>
        </div>
        <Link
          to="/cart"
          className="text-xs font-bold text-dark hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bag</span>
        </Link>
      </div>

      {orderError && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Order Placement Blocked</p>
            <p className="mt-0.5">{orderError}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Form (7 cols) + Order Summary (5 cols) */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Shipping Address Section */}
          <div className="bg-surface rounded-3xl border border-hairline/80 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-hairline/60">
              <Truck className="w-5 h-5 text-dark" />
              <h2 className="text-lg font-bold text-dark">Shipping Destination</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required
                />
                <Input
                  label="Contact Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <Input
                label="Street Address / Apartment / Suite"
                name="street"
                value={formData.street}
                onChange={handleChange}
                error={errors.street}
                placeholder="144 Maple Boulevard, Flat 4B"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  required
                />
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  required
                />
                <Input
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  error={errors.postalCode}
                  required
                />
              </div>

              <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          {/* Payment Method Section (COD per assignment specs) */}
          <div className="bg-surface rounded-3xl border border-hairline/80 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-hairline/60">
              <Banknote className="w-5 h-5 text-dark" />
              <h2 className="text-lg font-bold text-dark">Payment Method</h2>
            </div>

            <div className="p-5 rounded-2xl border-2 border-dark bg-white flex items-start gap-4 shadow-subtle">
              <div className="mt-1">
                <CheckCircle2 className="w-5 h-5 text-dark" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-dark">Cash on Delivery (COD)</p>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Pay with exact cash or digital UPI upon doorstep delivery. No advance online payment required.
                </p>
                <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mt-2">
                  Zero Processing Surcharge
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary (5 cols) */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-surface rounded-3xl border border-hairline/80 p-6 sm:p-8 shadow-subtle space-y-6">
            <h3 className="text-lg font-extrabold text-dark pb-4 border-b border-hairline/60">
              Curated Order Review
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart?.items?.map((item) => (
                <div key={item._id} className="flex items-center gap-3 py-2 border-b border-hairline/60 last:border-0">
                  <div className="w-12 h-14 rounded-xl overflow-hidden bg-white p-1 flex-shrink-0 border border-hairline flex items-center justify-center">
                    <ImageWithFallback
                      src={item.product?.images && item.product.images[0]}
                      alt={item.product?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-dark truncate">{item.product?.name}</p>
                    <p className="text-[11px] text-ink-muted font-medium">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-extrabold text-dark tracking-tight">
                    ₹{item.itemTotal?.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Verified Server Calculations */}
            <div className="space-y-3 text-xs pt-4 border-t border-hairline/60">
              <div className="flex justify-between text-ink-muted">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-semibold text-dark">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Domestic Shipping</span>
                <span className="font-semibold text-dark">
                  {shippingFee === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Estimated Tax (5% GST)</span>
                <span className="font-semibold text-dark">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-hairline/60 pt-3 flex justify-between text-sm font-extrabold text-dark">
                <span>Final Payable Amount</span>
                <span className="text-xl font-extrabold text-dark tracking-tight">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full shadow-md font-bold"
            >
              Confirm & Place Order (COD)
            </Button>

            <div className="pt-2 text-[11px] text-ink-muted flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>Atomic stock reservation protects against inventory overselling.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
