import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  // If already logged in, redirect
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-block group">
          <span className="text-2xl font-extrabold tracking-tight text-[#0C0C0E]">
            ShopSphere
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] mb-1 inline-block ml-1" />
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0C0C0E] tracking-tight">
          Welcome <span className="text-neutral-400 font-light">Back</span>
        </h1>
        <p className="text-xs text-neutral-500">
          Sign in to access your saved pieces, cart, and order history.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-sm space-y-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full gap-2 font-bold"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <div className="border-t border-neutral-100 pt-5 text-center">
          <p className="text-xs text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#0C0C0E] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Secured with HTTP-only Cookies & JWT Session</span>
      </div>
    </div>
  );
};
