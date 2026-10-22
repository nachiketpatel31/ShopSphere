import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Banknote,
  ShoppingBag,
  Package,
  Users,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Badge } from '../../components/common/Badge';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboardStats();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-neutral-400">
        Aggregating store telemetry and sales metrics...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-16 text-center text-neutral-400">
        Unable to load dashboard metrics.
      </div>
    );
  }

  const kpis = [
    {
      title: 'Net Store Revenue',
      value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`,
      sub: 'Excludes cancelled orders',
      icon: Banknote,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Total Placed Orders',
      value: stats.orderCount || 0,
      sub: 'All-time transactions',
      icon: ShoppingBag,
      color: 'bg-neutral-100 text-[#0C0C0E] border-neutral-200'
    },
    {
      title: 'Active Products',
      value: stats.productCount || 0,
      sub: 'Live in public catalog',
      icon: Package,
      color: 'bg-neutral-100 text-[#0C0C0E] border-neutral-200'
    },
    {
      title: 'Registered Users',
      value: stats.userCount || 0,
      sub: 'Authenticated accounts',
      icon: Users,
      color: 'bg-neutral-100 text-[#0C0C0E] border-neutral-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  {kpi.title}
                </span>
                <div className={`p-2.5 rounded-2xl border ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#0C0C0E] tracking-tight">{kpi.value}</p>
                <p className="text-[11px] text-neutral-400 mt-1">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Orders by Status & Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 space-y-5 shadow-sm">
          <div>
            <h3 className="text-xl font-extrabold text-[#0C0C0E]">Orders by Status</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Live distribution across fulfillment stages</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => {
              const count = stats.ordersByStatus?.[status] || 0;
              return (
                <div key={status} className="bg-[#F4F4F6] rounded-2xl p-4 border border-neutral-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    {status}
                  </span>
                  <p className="text-2xl font-extrabold text-[#0C0C0E] mt-1">{count}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 space-y-5 shadow-sm">
          <div>
            <h3 className="text-xl font-extrabold text-[#0C0C0E]">Category Representation</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Inventory distribution across store departments</p>
          </div>
          <div className="space-y-3">
            {stats.categoryStats?.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between text-xs py-2.5 border-b border-neutral-100 last:border-0">
                <span className="font-bold text-[#0C0C0E]">{cat.category}</span>
                <span className="font-bold text-[#0C0C0E] bg-[#F4F4F6] border border-neutral-200 px-3 py-1 rounded-full">
                  {cat.count} items
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-xl font-extrabold text-[#0C0C0E]">Recent Store Orders</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Most recent incoming customer purchases</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#0C0C0E] hover:underline flex items-center gap-1.5"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {stats.recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#F4F4F6] transition-colors">
                    <td className="py-4 px-3 font-mono font-bold text-[#0C0C0E]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-4 px-3">
                      <p className="font-bold text-[#0C0C0E]">{ord.shippingAddress?.fullName || ord.user?.name}</p>
                      <p className="text-[11px] text-neutral-400">{ord.user?.email}</p>
                    </td>
                    <td className="py-4 px-3 text-neutral-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-3">
                      <Badge
                        variant={ord.orderStatus === 'Delivered' ? 'success' : ord.orderStatus === 'Shipped' ? 'accent' : 'neutral'}
                        size="xs"
                      >
                        {ord.orderStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-3 text-right font-extrabold text-[#0C0C0E]">
                      ₹{ord.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-3 text-right">
                      <Link
                        to={`/orders/${ord._id}`}
                        className="text-xs text-[#0C0C0E] font-bold hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-neutral-400 py-6 text-center">No orders recorded yet.</p>
        )}
      </div>
    </div>
  );
};
