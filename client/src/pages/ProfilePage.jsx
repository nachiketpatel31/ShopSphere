import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, LogOut, ShieldCheck, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        street: user.shippingAddress?.street || '',
        city: user.shippingAddress?.city || '',
        state: user.shippingAddress?.state || '',
        postalCode: user.shippingAddress?.postalCode || '',
        country: user.shippingAddress?.country || 'India'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        }
      });
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Account Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0C0C0E] tracking-tight mt-1">
            My <span className="text-neutral-400 font-light">Profile</span>
          </h1>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 hover:border-red-200 text-neutral-600 hover:text-red-600 bg-white hover:bg-red-50 rounded-full text-xs font-bold transition-colors shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#F4F4F6] rounded-3xl border border-neutral-200/80 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-[#0C0C0E] shadow-sm flex-shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Logged In As</p>
            <p className="text-sm font-extrabold text-[#0C0C0E] truncate">{user?.name}</p>
            <span className="text-xs text-neutral-500 truncate block">{user?.email}</span>
          </div>
        </div>

        <Link
          to="/orders"
          className="bg-white rounded-3xl border border-neutral-200/80 p-6 flex items-center justify-between hover:border-neutral-400 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F4F4F6] flex items-center justify-center text-[#0C0C0E] flex-shrink-0 group-hover:bg-[#0C0C0E] group-hover:text-white transition-colors">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Fulfillment</p>
              <p className="text-sm font-extrabold text-[#0C0C0E]">Order History</p>
              <span className="text-xs text-neutral-500 font-medium">Track deliveries</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-[#0C0C0E] transition-all" />
        </Link>

        <Link
          to="/wishlist"
          className="bg-white rounded-3xl border border-neutral-200/80 p-6 flex items-center justify-between hover:border-neutral-400 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F4F4F6] flex items-center justify-center text-red-500 flex-shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Sanctuary</p>
              <p className="text-sm font-extrabold text-[#0C0C0E]">{wishlistCount} Saved Pieces</p>
              <span className="text-xs text-neutral-500 font-medium">View wishlist</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-[#0C0C0E] transition-all" />
        </Link>
      </div>

      {/* Profile Details & Form */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-xl font-extrabold text-[#0C0C0E]">Personal Information</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Contact details and default shipping address</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="secondary" size="sm">
              Edit Details
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email Address (Read-only)"
                value={user?.email || ''}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
              <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Default Shipping Destination
              </h3>

              <Input
                label="Street Address / Flat / Floor"
                name="street"
                value={formData.street}
                onChange={handleChange}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
                <Input
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
              <Button type="submit" variant="primary" loading={saving} size="md">
                Save Changes
              </Button>
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                variant="outline"
                size="md"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-600">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F4F4F6] border border-neutral-200/60">
                <Mail className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-[#0C0C0E] block text-xs">Email Address</span>
                  <span className="text-neutral-500 mt-0.5 block">{user?.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F4F4F6] border border-neutral-200/60">
                <Phone className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-[#0C0C0E] block text-xs">Contact Phone</span>
                  <span className="text-neutral-500 mt-0.5 block">{user?.phone || 'No phone number provided'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F4F4F6] border border-neutral-200/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-[#0C0C0E] block text-xs">Security Standards</span>
                  <span className="text-neutral-500 mt-0.5 block">Protected via HTTP-only Cookie JWT & Bcrypt encryption</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F4F4F6] border border-neutral-200/60 h-full">
                <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-[#0C0C0E] block text-xs">Saved Shipping Address</span>
                  {user?.shippingAddress?.street ? (
                    <div className="space-y-1 mt-1 text-neutral-600">
                      <p className="font-semibold text-[#0C0C0E]">{user.shippingAddress.street}</p>
                      <p>
                        {user.shippingAddress.city}, {user.shippingAddress.state} - {user.shippingAddress.postalCode}
                      </p>
                      <p>{user.shippingAddress.country}</p>
                    </div>
                  ) : (
                    <span className="text-neutral-400 block mt-1">No default address saved yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
