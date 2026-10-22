import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navCategories = [
    { name: 'All Goods', path: '/products' },
    { name: 'Acoustics', path: '/products?category=Electronics' },
    { name: 'Garments', path: '/products?category=Fashion' },
    { name: 'Living', path: '/products?category=Home%20%26%20Living' },
    { name: 'Carry Goods', path: '/products?category=Accessories' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-hairline/80 transition-all">
      {/* Top Banner Notice */}
      <div className="bg-dark text-white py-1.5 px-4 text-center text-[11px] font-semibold tracking-wider uppercase">
        <span>Complimentary Domestic Dispatch On Orders Above ₹1,500</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-dark hover:bg-surface rounded-full transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Brand Identity / Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="group flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-dark text-white flex items-center justify-center font-extrabold text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current stroke-2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tighter text-dark">
                SHOPSPHERE
              </span>
            </Link>
          </div>

          {/* Desktop Pill Navigation (Inspired by Reference Pill Nav) */}
          <nav className="hidden lg:flex items-center bg-surface/80 border border-hairline rounded-full px-2 py-1 space-x-1 shadow-subtle">
            {navCategories.map((cat) => {
              const isActive = location.pathname + location.search === cat.path;
              return (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className={`text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-dark text-white shadow-sm'
                      : 'text-ink-muted hover:text-dark hover:bg-white/60'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Pills */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-52 pl-9 pr-3 py-2 text-xs bg-surface border border-hairline rounded-full focus:outline-none focus:border-dark focus:bg-white transition-all placeholder:text-ink-light"
              />
              <Search className="w-3.5 h-3.5 text-ink-light absolute left-3.5 top-3" />
            </form>

            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 text-dark hover:bg-surface rounded-full md:hidden transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-2.5 text-dark hover:bg-surface rounded-full relative transition-colors"
              aria-label="View saved items"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Pill (Reference styled button) */}
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3.5 py-2 bg-dark text-white hover:bg-neutral-800 rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bag</span>
              <span className="w-4 h-4 rounded-full bg-white text-dark text-[10px] font-extrabold flex items-center justify-center">
                {itemCount}
              </span>
            </Link>

            {/* User Account Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              {isAuthenticated ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-full border border-hairline hover:bg-surface transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-surface-hover text-dark flex items-center justify-center font-bold text-xs">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <ChevronDown className="w-3 h-3 text-ink-muted mr-1" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-hairline py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-hairline">
                        <p className="text-xs font-bold text-dark truncate">{user.name}</p>
                        <p className="text-[11px] text-ink-light truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-dark text-white px-2 py-0.5 rounded-full">
                            Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-dark hover:bg-surface font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4 text-accent" />
                          Admin Console
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-dark hover:bg-surface font-medium"
                      >
                        <User className="w-4 h-4 text-ink-muted" />
                        Account Profile
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-dark hover:bg-surface font-medium"
                      >
                        <Package className="w-4 h-4 text-ink-muted" />
                        Order History
                      </Link>

                      <div className="border-t border-hairline my-1" />

                      <button
                        type="button"
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="text-xs font-semibold px-3 py-2 text-dark hover:bg-surface rounded-full transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="pb-4 pt-1 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-surface border border-hairline rounded-xl focus:outline-none focus:border-dark"
                autoFocus
              />
              <Search className="w-4 h-4 text-ink-light absolute left-3 top-3.5" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-hairline px-6 py-6 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-light">Categories</p>
          <div className="grid grid-cols-1 gap-2">
            {navCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className="text-sm font-semibold text-dark hover:text-accent py-1"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-hairline pt-4 space-y-2">
            <Link to="/wishlist" className="flex items-center justify-between text-sm text-dark py-1">
              <span>Saved Wishlist</span>
              <span className="text-xs bg-surface px-2.5 py-0.5 rounded-full font-bold">{wishlistCount}</span>
            </Link>
            <Link to="/cart" className="flex items-center justify-between text-sm text-dark py-1">
              <span>Shopping Bag</span>
              <span className="text-xs bg-dark text-white px-2.5 py-0.5 rounded-full font-bold">{itemCount}</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block text-sm text-dark py-1">My Profile</Link>
                <Link to="/orders" className="block text-sm text-dark py-1">My Orders</Link>
                {isAdmin && (
                  <Link to="/admin" className="block text-sm font-bold text-accent py-1">
                    Admin Console
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="block text-sm text-rose-600 font-semibold py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex gap-3">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2 text-xs font-semibold tracking-wider uppercase border border-hairline rounded-full hover:bg-surface"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-2 text-xs font-semibold tracking-wider uppercase bg-dark text-white rounded-full hover:bg-neutral-800"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
