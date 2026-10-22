import React from 'react';
import { NavLink, Outlet, Link, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-neutral-400">
        Verifying administrator credentials...
      </div>
    );
  }

  // Strict client-side guard (backed by server-side 403 enforcement)
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navLinks = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Product Catalog', path: '/admin/products', icon: Package },
    { name: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'User Directory', path: '/admin/users', icon: Users }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Header */}
      <div className="pb-6 border-b border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Restricted Console
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0C0C0E] tracking-tight mt-1">
            ShopSphere <span className="text-neutral-400 font-light">Command Center</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Admin Session: {user.name} ({user.email})
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 rounded-full text-xs font-bold text-[#0C0C0E] bg-white hover:bg-[#F4F4F6] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </Link>
      </div>

      {/* Admin Horizontal Tabs */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200/80">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0C0C0E] text-white shadow-sm'
                    : 'text-neutral-500 hover:bg-[#F4F4F6] hover:text-[#0C0C0E]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Admin Routed Page Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};
