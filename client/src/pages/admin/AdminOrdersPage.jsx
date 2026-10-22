import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Filter } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const STATUSES = ['All', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        page: currentPage,
        limit: 15
      };
      const res = await orderService.getAllOrders(params);
      if (res.success) {
        setOrders(res.orders);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, currentPage]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setSelectedStatus(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                  selectedStatus === status
                    ? 'bg-[#0C0C0E] text-white'
                    : 'bg-[#F4F4F6] text-neutral-600 hover:text-[#0C0C0E] hover:bg-neutral-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-bold text-neutral-400">
          Showing {orders.length} of {total} orders
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-neutral-400">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Current Status</th>
                  <th className="py-3 px-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-[#F4F4F6] transition-colors">
                    <td className="py-4 px-3">
                      <Link
                        to={`/orders/${o._id}`}
                        className="font-mono font-bold text-[#0C0C0E] hover:underline block"
                      >
                        {o.orderNumber}
                      </Link>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono">
                        {o.paymentMethod} • {o.paymentStatus}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <p className="font-bold text-[#0C0C0E]">{o.shippingAddress?.fullName || o.user?.name}</p>
                      <p className="text-[11px] text-neutral-400">{o.user?.email || o.shippingAddress?.phone}</p>
                    </td>

                    <td className="py-4 px-3 text-neutral-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-3">
                      <span className="font-bold text-[#0C0C0E]">
                        {o.orderItems?.length} {o.orderItems?.length === 1 ? 'item' : 'items'}
                      </span>
                    </td>

                    <td className="py-4 px-3 font-extrabold text-[#0C0C0E]">
                      ₹{o.totalAmount?.toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-3">
                      <Badge variant={getStatusBadgeVariant(o.orderStatus)} size="xs">
                        {o.orderStatus}
                      </Badge>
                    </td>

                    <td className="py-4 px-3 text-right">
                      <select
                        value={o.orderStatus}
                        disabled={updatingId === o._id}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="px-3 py-1.5 bg-[#F4F4F6] border border-neutral-200 rounded-full text-xs font-bold text-[#0C0C0E] focus:outline-none focus:border-[#0C0C0E] cursor-pointer disabled:opacity-50"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-neutral-400 py-8 text-center">No orders match selected status.</p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>
    </div>
  );
};
