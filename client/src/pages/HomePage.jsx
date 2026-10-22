import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Star
} from 'lucide-react';
import { productService } from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';

export const HomePage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carousel state for "Meet Our Curated Goods"
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Interactive shopping process accordion state (0 = Choose, 1 = Delivery, 2 = Enjoy)
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await productService.getProducts({ limit: 16 });
        if (res.success && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to load homepage products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  // Calculate real average rating across available products
  const avgRating =
    products.length > 0
      ? (products.reduce((acc, p) => acc + (p.rating || 4.5), 0) / products.length).toFixed(1)
      : '4.8';

  const totalReviewsCount = products.reduce((acc, p) => acc + (p.numReviews || 0), 0);

  // Carousel sliding logic (displaying 4 cards per page on desktop, 2 on tablet, 1 on mobile)
  const itemsPerPage = 4;
  const maxCarouselPages = Math.ceil(products.length / itemsPerPage) || 1;

  const currentCarouselProducts = products.slice(
    carouselIndex * itemsPerPage,
    carouselIndex * itemsPerPage + itemsPerPage
  );

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => Math.min(maxCarouselPages - 1, prev + 1));
  };

  const processSteps = [
    {
      id: 0,
      number: '1',
      title: 'Choose Your Goods',
      shortTitle: 'Curate',
      desc: 'Browse our studio collection of precision acoustics, raw silk overshirts, wheel-thrown ceramics, and bespoke leather goods.',
      actionText: 'Shop Catalog Now',
      actionUrl: '/products'
    },
    {
      id: 1,
      number: '2',
      title: 'Express Delivery',
      shortTitle: 'Delivery',
      desc: 'Dispatched in plastic-free recycled packaging with door-to-door courier tracking and convenient Cash on Delivery.',
      actionText: 'View Dispatch Policies',
      actionUrl: '/products?category=Electronics'
    },
    {
      id: 2,
      number: '3',
      title: 'Unbox & Enjoy',
      shortTitle: '30-Day Guarantee',
      desc: 'Every artifact is backed by our 30-day conscious doorstep return guarantee and authentic material certifications.',
      actionText: 'Explore Living Pieces',
      actionUrl: '/products?category=Home%20%26%20Living'
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* =========================================================================
          1. HERO SECTION (REFERENCE MATCH: Expansive Rounded Container + High-End Lifestyle)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[580px] sm:min-h-[640px] flex flex-col justify-between p-6 sm:p-12 lg:p-16 shadow-elevated border border-hairline/60">
          {/* Background Image with Crisp Contrast Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1800&auto=format&fit=crop&q=85"
              alt="Contemporary lifestyle models sitting in urban setting"
              className="w-full h-full object-cover object-center filter brightness-[0.75]"
            />
            {/* Subtle Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </div>

          {/* Hero Top Row: Social Proof / Review Pill */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white shadow-subtle">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold tracking-tight">
                {avgRating}/5 Rating ({totalReviewsCount} Verified Reviews)
              </span>
            </div>
          </div>

          {/* Hero Center Row: Bold Typography & Actions */}
          <div className="relative z-10 max-w-2xl my-auto py-8 space-y-5">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.04]">
              Elevate Your Living{' '}
              <span className="block text-white/95 font-extrabold">With Every Piece</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 max-w-lg leading-relaxed">
              Discover curated lifestyle goods crafted for everyday comfort, enduring tactile performance, and modern aesthetic restraint.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/products">
                <Button variant="white" size="lg" className="shadow-lg font-bold">
                  <span>Shop Now</span>
                </Button>
              </Link>
              <Link
                to="/products?category=Electronics"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-neutral-200 transition-colors py-2 px-3 group"
              >
                <span>Explore Studio Goods</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Hero Bottom Row: Floating Feature Card (Reference Design Accent) */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="text-white/60 text-xs font-medium">
              Autumn / Winter Studio Collection 2026
            </div>

            {/* Glassmorphic Feature Callout Box */}
            <div className="max-w-xs bg-black/70 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 text-white shadow-elevated">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                  Next-Level Craft
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-1.5">
                Precision Acoustic Technology
              </h4>
              <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                Machined from solid American walnut, anodized aluminum, and lambskin for studio acoustics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. "MEET OUR CURATED GOODS" CAROUSEL (REFERENCE MATCH: Light Gray Cards + Progress)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
              Meet Our <span className="font-extrabold text-dark">Curated Goods</span>
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-xl">
              Explore the latest studio collection, designed to keep you intentional, comfortable, and ahead of trends.
            </p>
          </div>

          {/* Carousel Slider Navigation Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-dark bg-surface px-3 py-1.5 rounded-full border border-hairline">
              <span>{String(carouselIndex + 1).padStart(2, '0')}</span>
              <span className="text-ink-light">/</span>
              <span className="text-ink-light">{String(maxCarouselPages).padStart(2, '0')}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevSlide}
                disabled={carouselIndex === 0}
                className="w-10 h-10 rounded-full border border-hairline bg-white hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-dark transition-colors shadow-subtle active:scale-95"
                aria-label="Previous items"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                disabled={carouselIndex >= maxCarouselPages - 1}
                className="w-10 h-10 rounded-full bg-dark text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-subtle active:scale-95"
                aria-label="Next items"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Slider Track */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {currentCarouselProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          3. PROMO SPLIT BANNER (REFERENCE MATCH: High-Contrast 45% OFF / Seasonal Drop)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] sm:rounded-3xl border border-hairline overflow-hidden bg-surface grid grid-cols-1 lg:grid-cols-12 shadow-subtle">
          {/* Left Text Column */}
          <div className="lg:col-span-6 p-8 sm:p-14 lg:p-16 flex flex-col justify-between space-y-8 bg-white">
            <div className="space-y-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-ink-light">
                Mid-Season Special Curation
              </span>
              <div className="space-y-1">
                <p className="text-4xl sm:text-6xl font-extrabold text-dark tracking-tight leading-none">
                  UP TO 30% OFF
                </p>
                <p className="text-base sm:text-lg font-bold text-ink-muted">
                  SITEWIDE ON SELECT DISPATCHES
                </p>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-md pt-2">
                Upgrade your daily ritual with limited-edition tactile overshirts, audiophile headphone rigs, and hand-finished ceramics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/products">
                <Button variant="primary" size="lg" className="shadow-md">
                  <span>Explore Sale Pieces</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <span className="text-xs font-mono font-bold text-ink-light">
                Auto-applied at checkout
              </span>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full bg-dark overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&auto=format&fit=crop&q=80"
              alt="Model in heavy canvas chore jacket"
              className="w-full h-full object-cover object-center filter brightness-[0.85] hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. "EASY SHOPPING PROCESS" ACCORDION (REFERENCE MATCH: Interactive Steps)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Easy Shopping <span className="font-extrabold">Process</span>
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Browse, select, and order your perfect pieces in just a few steps with our smooth and user-friendly shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Media Image */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-surface border border-hairline min-h-[340px] sm:min-h-[440px] relative">
            <img
              src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&auto=format&fit=crop&q=80"
              alt="Curated lifestyle products flatlay"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white text-xs font-semibold">
              Intentional Design • Seamless Acquisition
            </div>
          </div>

          {/* Right Interactive Step Accordion */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row gap-4">
            {processSteps.map((step) => {
              const isActive = activeProcessStep === step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveProcessStep(step.id)}
                  className={`rounded-3xl cursor-pointer transition-all duration-300 p-6 flex flex-col justify-between ${
                    isActive
                      ? 'sm:flex-[2] bg-dark text-white shadow-elevated border border-white/10'
                      : 'sm:flex-1 bg-surface hover:bg-surface-hover text-dark border border-hairline'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between pb-4">
                    <span
                      className={`text-sm font-bold ${
                        isActive ? 'text-white' : 'text-dark'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                        isActive
                          ? 'bg-white text-dark'
                          : 'bg-white text-ink-muted border border-hairline'
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Step Body (Expanded when active) */}
                  {isActive ? (
                    <div className="space-y-6 pt-4 animate-in fade-in duration-200">
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {step.desc}
                      </p>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(step.actionUrl);
                        }}
                        variant="white"
                        size="md"
                        className="shadow-sm font-bold"
                      >
                        {step.actionText}
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-auto hidden sm:block pt-8 text-[11px] font-bold uppercase tracking-wider text-ink-light">
                      {step.shortTitle}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. "DETAILS DOWN TO ATOMIC LEVEL" BENTO GRID (REFERENCE MATCH: Technical Anatomy)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Details Down To <span className="font-extrabold">Atomic Level</span>
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Every element of our pieces is meticulously crafted for maximum comfort, durability, and style—nothing is overlooked, down to the smallest detail.
          </p>
        </div>

        {/* 3-Card Technical Bento Grid with Annotation Callout Lines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Ergonomic Cushioning */}
          <div className="bg-surface rounded-3xl border border-hairline p-6 flex flex-col justify-between overflow-hidden relative group">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden p-6 relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Memory foam lambskin cushion"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              {/* Technical Callout Annotation Line */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-hairline shadow-subtle">
                <span className="text-[10px] font-bold text-dark block">
                  Padded Interior
                </span>
                <span className="text-[9px] text-ink-light block">
                  Lambskin & memory foam for grip
                </span>
              </div>
            </div>
            <div className="pt-5">
              <h4 className="font-bold text-sm text-dark">Ergonomic Fit & Tactile Comfort</h4>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Zero pressure points across extended listening and working sessions.
              </p>
            </div>
          </div>

          {/* Card 2: Center Dark Hero Card (Chassis & Sole Architecture) */}
          <div className="bg-dark text-white rounded-3xl border border-white/10 p-6 flex flex-col justify-between overflow-hidden relative group shadow-elevated">
            <div className="aspect-square bg-dark-card rounded-2xl overflow-hidden p-6 relative flex items-center justify-center border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
                alt="Precision gasket mechanical chassis"
                className="w-full h-full object-contain filter brightness-[0.95] group-hover:scale-105 transition-transform duration-500"
              />
              {/* Technical Callout Annotation Line */}
              <div className="absolute top-4 right-4 bg-dark-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 shadow-subtle text-right">
                <span className="text-[10px] font-bold text-white block">
                  Precision Cutout Pattern
                </span>
                <span className="text-[9px] text-neutral-400 block">
                  Optimizes acoustic weight distribution
                </span>
              </div>
            </div>
            <div className="pt-5">
              <h4 className="font-bold text-sm text-white">Anodized Structural Chassis</h4>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Machined from aerospace-grade aluminum and solid American walnut for zero vibration.
              </p>
            </div>
          </div>

          {/* Card 3: Woven Texture & Leather */}
          <div className="bg-surface rounded-3xl border border-hairline p-6 flex flex-col justify-between overflow-hidden relative group">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden p-6 relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80"
                alt="Vegetable tanned buttero leather"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              {/* Technical Callout Annotation Line */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-hairline shadow-subtle">
                <span className="text-[10px] font-bold text-dark block">
                  Buttero Vachetta
                </span>
                <span className="text-[9px] text-ink-light block">
                  Hand-burnished beeswax edges
                </span>
              </div>
            </div>
            <div className="pt-5">
              <h4 className="font-bold text-sm text-dark">Full-Grain Italian Buttero Leather</h4>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Naturally acquires an authentic amber patina over years of intentional everyday use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. TRUST BADGES STRIP (REFERENCE MATCH: Minimalist Icon Row)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-hairline pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-dark">
              <Truck className="w-5 h-5" />
            </div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-dark">Express Dispatch</h5>
            <p className="text-[11px] text-ink-muted">Domestic delivery &gt; ₹1,500</p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-dark">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-dark">Free 30-Day Returns</h5>
            <p className="text-[11px] text-ink-muted">Doorstep return collection</p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-dark">
              <Sparkles className="w-5 h-5" />
            </div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-dark">Sustainable Packaging</h5>
            <p className="text-[11px] text-ink-muted">100% Recycled & plastic-free</p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-dark">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-dark">Cash On Delivery</h5>
            <p className="text-[11px] text-ink-muted">Pay securely at your doorstep</p>
          </div>
        </div>
      </section>
    </div>
  );
};
