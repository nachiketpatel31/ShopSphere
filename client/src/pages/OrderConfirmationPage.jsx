import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Printer, ArrowRight, Truck, Check } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const OrderConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const res = await orderService.getOrderById(id);
          if (res.success) {
            setOrder(res.order);
          }
        } catch (err) {
          console.error('Failed to load order confirmation:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-neutral-400">
        Loading order confirmation details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-[#0C0C0E]">Order Not Found</h2>
        <Button onClick={() => navigate('/orders')} variant="primary">
          View All Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-[#0C0C0E] text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Check className="w-8 h-8 text-emerald-400 stroke-[3]" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Verified & Confirmed
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0C0C0E]">
          Thank you for your order
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          Your order has been verified and safely queued for courier dispatch.
        </p>
      </div>

      {/* Order Reference Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Order Reference Number
            </span>
            <p className="font-mono text-lg font-extrabold text-[#0C0C0E] mt-0.5">{order.orderNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              Status: {order.orderStatus}
            </Badge>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-full border border-neutral-200 bg-[#F4F4F6] hover:bg-neutral-200 text-[#0C0C0E] transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Receipt</span>
            </button>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pb-6 border-b border-neutral-100">
          <div className="p-4 rounded-2xl bg-[#F4F4F6] border border-neutral-200/60">
            <span className="font-bold uppercase tracking-wider text-neutral-400 block mb-1 text-[10px]">
              Shipping Destination
            </span>
            <p className="font-bold text-[#0C0C0E] text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-neutral-600 mt-1">{order.shippingAddress.street}</p>
            <p className="text-neutral-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
            <p className="text-neutral-500 mt-2 font-mono text-[11px]">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F4F6] border border-neutral-200/60">
            <span className="font-bold uppercase tracking-wider text-neutral-400 block mb-1 text-[10px]">
              Payment & Logistics
            </span>
            <p className="font-bold text-[#0C0C0E] text-sm">Cash on Delivery (COD)</p>
            <p className="text-neutral-600 mt-1">Pay ₹{order.totalAmount?.toLocaleString('en-IN')} upon courier arrival.</p>
            <div className="mt-3 flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Estimated Delivery: 3-5 Business Days</span>
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-4">
          <span className="font-bold uppercase tracking-wider text-neutral-400 text-[10px] block">
            Purchased Items ({order.orderItems?.length})
          </span>
          <div className="divide-y divide-neutral-100">
            {order.orderItems?.map((item) => (
              <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 rounded-xl object-cover bg-[#F4F4F6] border border-neutral-200 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#0C0C0E]">{item.name}</p>
                    <p className="text-xs text-neutral-400 font-medium">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-[#0C0C0E]">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Totals */}
        <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-500">
            <span>Subtotal</span>
            <span className="font-bold text-[#0C0C0E]">₹{order.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>Domestic Shipping</span>
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link to="/orders" className="w-full sm:w-auto">
          <Button variant="secondary" size="md" className="w-full">
            <span>View All Past Orders</span>
          </Button>
        </Link>
        <Link to="/products" className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full gap-2">
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
