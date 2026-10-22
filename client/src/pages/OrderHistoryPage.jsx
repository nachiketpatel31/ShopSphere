import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, MapPin } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'accent';
      case 'Processing':
        return 'neutral';
      case 'Cancelled':
        return 'dark';
      default:
        return 'neutral';
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center text-neutral-400">
        Retrieving your order history...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <EmptyState
          icon={Package}
          title="No previous orders found"
          description="You haven't placed any orders yet. Discover our curated collection to make your first purchase."
          actionText="Explore Collection"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="pb-6 border-b border-neutral-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Account Management
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0C0C0E] tracking-tight mt-1">
            Order <span className="text-neutral-400 font-light">History</span>
          </h1>
        </div>
        <p className="text-xs text-neutral-500">
          Showing {orders.length} past {orders.length === 1 ? 'order' : 'orders'}
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-7 hover:border-neutral-400 transition-all shadow-sm space-y-5"
          >
            {/* Top Bar: Order ID, Date, Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Order Number
                </span>
                <p className="font-mono text-sm font-extrabold text-[#0C0C0E]">{order.orderNumber}</p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={getStatusBadgeVariant(order.orderStatus)} size="sm">
                  {order.orderStatus}
                </Badge>
                <Link to={`/orders/${order._id}`}>
                  <Button variant="secondary" size="sm" className="gap-1.5 font-bold">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Middle: Items Mini Thumbnails */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {order.orderItems?.map((item) => (
                <div key={item._id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F4F4F6] border border-neutral-200/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 rounded-xl object-cover bg-white border border-neutral-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0C0C0E] truncate">{item.name}</p>
                    <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Qty: {item.quantity} • ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom: Destination and Total */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-neutral-100 text-xs gap-2">
              <div className="flex items-center gap-1.5 text-neutral-500 truncate">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                <span className="truncate">
                  Destination: {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
                </span>
              </div>
              <div className="text-right">
                <span className="text-neutral-400 mr-2 font-medium">Total Paid (COD):</span>
                <span className="font-extrabold text-base text-[#0C0C0E]">
                  ₹{order.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
