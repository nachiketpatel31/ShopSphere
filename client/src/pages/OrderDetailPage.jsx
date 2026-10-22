import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, MapPin, Truck, AlertCircle, Printer, Check } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await orderService.getOrderById(id);
        if (res.success) {
          setOrder(res.order);
        }
      } catch (err) {
        setError(err.message || 'Unable to retrieve order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-neutral-400">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0C0C0E]">Order Not Available</h2>
        <p className="text-xs text-neutral-500 leading-relaxed">
          {error || 'You do not have permission to view this order or it does not exist.'}
        </p>
        <Button onClick={() => navigate('/orders')} variant="secondary">
          Return to Orders
        </Button>
      </div>
    );
  }

  const statusSteps = ['Placed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/orders"
            className="text-xs font-bold text-neutral-500 hover:text-[#0C0C0E] flex items-center gap-1.5 mb-2.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-[#0C0C0E] tracking-tight">
            Order <span className="font-mono text-neutral-500 text-2xl font-bold">{order.orderNumber}</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={order.orderStatus === 'Delivered' ? 'success' : order.orderStatus === 'Shipped' ? 'accent' : 'neutral'} size="md">
            {order.orderStatus}
          </Badge>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 text-[#0C0C0E] transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Status Progress Timeline */}
      {order.orderStatus !== 'Cancelled' ? (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-8">
            Fulfillment Journey
          </h3>
          <div className="grid grid-cols-4 gap-2 relative">
            {statusSteps.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={step} className="flex flex-col items-center text-center space-y-2.5 relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed
                        ? 'bg-[#0C0C0E] text-white shadow-md'
                        : 'bg-[#F4F4F6] text-neutral-400 border border-neutral-200'
                    } ${isCurrent ? 'ring-4 ring-neutral-200' : ''}`}
                  >
                    {isPassed ? <Check className="w-5 h-5 text-emerald-400 stroke-[3]" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs ${
                      isPassed ? 'text-[#0C0C0E] font-extrabold' : 'text-neutral-400 font-medium'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Status History Notes */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="mt-8 pt-6 border-t border-neutral-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Activity Log
              </span>
              <div className="space-y-1.5">
                {order.statusHistory.map((h, i) => (
                  <div key={i} className="text-xs text-neutral-600 flex items-center justify-between">
                    <span>{h.note || `Status transitioned to ${h.status}`}</span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl text-xs text-rose-800">
          <p className="font-bold">This order was cancelled.</p>
          <p className="mt-1">Inventory reserved for this order was returned to stock.</p>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Destination */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#0C0C0E] font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <span>Shipping Address</span>
          </div>
          <div className="text-xs space-y-1 text-neutral-600">
            <p className="font-bold text-[#0C0C0E] text-sm">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
            <p className="pt-1 text-neutral-400 font-mono">Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#0C0C0E] font-bold text-xs uppercase tracking-wider">
            <Truck className="w-4 h-4 text-neutral-400" />
            <span>Payment & Delivery</span>
          </div>
          <div className="text-xs space-y-1 text-neutral-600">
            <p className="font-bold text-[#0C0C0E] text-sm">Payment Method: Cash on Delivery (COD)</p>
            <p>Payment Status: <strong className="uppercase text-[#0C0C0E]">{order.paymentStatus}</strong></p>
            <p className="text-neutral-400 pt-1">
              Please have exact cash ready at delivery handoff.
            </p>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 space-y-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Order Items ({order.orderItems?.length})
        </h3>

        <div className="divide-y divide-neutral-100">
          {order.orderItems?.map((item) => (
            <div key={item._id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-16 rounded-2xl object-cover bg-[#F4F4F6] border border-neutral-200 flex-shrink-0"
                />
                <div>
                  <Link
                    to={`/products/${item.product}`}
                    className="text-sm font-bold text-[#0C0C0E] hover:underline block line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    SKU: {item.sku} • Unit Price: ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-neutral-500 mr-3 font-medium">Qty: {item.quantity}</span>
                <span className="text-sm font-extrabold text-[#0C0C0E]">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Subtotal Breakdown */}
        <div className="pt-6 border-t border-neutral-100 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal</span>
            <span className="font-bold text-[#0C0C0E]">₹{order.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>Shipping Fee</span>
            <span className="font-bold text-[#0C0C0E]">
              {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
            </span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>GST Tax (5%)</span>
            <span className="font-bold text-[#0C0C0E]">₹{order.tax?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-[#0C0C0E] pt-3 border-t border-neutral-100">
            <span>Total Payable on Delivery</span>
            <span className="text-xl font-extrabold text-[#0C0C0E]">
              ₹{order.totalAmount?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
