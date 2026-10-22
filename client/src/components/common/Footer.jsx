import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thank you for subscribing to the ShopSphere Journal.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-dark text-white border-t border-dark-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 items-start">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-white text-dark flex items-center justify-center font-extrabold text-sm tracking-tighter shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current stroke-2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-white">
                SHOPSPHERE
              </span>
            </Link>

            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Curated everyday lifestyle goods engineered for enduring utility, tactile satisfaction, and modern aesthetic restraint.
            </p>

            {/* Social Icons Strip (Reference match) */}
            <div className="flex items-center space-x-2 pt-2">
              <a
                href="#social"
                onClick={(e) => { e.preventDefault(); toast('ShopSphere on Instagram'); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#social"
                onClick={(e) => { e.preventDefault(); toast('ShopSphere on Twitter/X'); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#social"
                onClick={(e) => { e.preventDefault(); toast('ShopSphere on LinkedIn'); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#social"
                onClick={(e) => { e.preventDefault(); toast('ShopSphere on GitHub'); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h5 className="font-bold uppercase tracking-wider text-white text-[11px]">
              Navigation
            </h5>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/products" className="hover:text-white transition-colors">All Goods</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-white transition-colors">Acoustics & Studio</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-white transition-colors">Garments & Knitwear</Link></li>
              <li><Link to="/products?category=Home%20%26%20Living" className="hover:text-white transition-colors">Home & Living</Link></li>
              <li><Link to="/products?category=Accessories" className="hover:text-white transition-colors">Carry Goods</Link></li>
            </ul>
          </div>

          {/* Client Services Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h5 className="font-bold uppercase tracking-wider text-white text-[11px]">
              Client Care
            </h5>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/profile" className="hover:text-white transition-colors">Account Profile</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Bag</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Sanctuary</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* Newsletter & QR Code Widget (4 cols) (Reference match) */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="font-bold uppercase tracking-wider text-white text-[11px]">
              The Journal & Drops
            </h5>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Subscribe to receive seasonal studio drops, craftsmanship essays, and private previews.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-xs bg-dark-card border border-white/15 rounded-full text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-white text-dark rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                >
                  Join
                </button>
              </div>
            </form>

            {/* Mobile Scan Widget (Inspired by Reference bottom right QR) */}
            <div className="pt-2 flex items-center gap-3 p-3 bg-dark-surface rounded-2xl border border-white/10">
              <div className="p-2 bg-white rounded-xl text-dark flex-shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-[11px] text-neutral-400">
                <span className="font-bold text-white block">ShopSphere On Mobile</span>
                <span>Optimized progressive responsive web experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} ShopSphere Studio. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Rewamp Technical Assessment</span>
            <span>•</span>
            <span>MERN Full-Stack Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
