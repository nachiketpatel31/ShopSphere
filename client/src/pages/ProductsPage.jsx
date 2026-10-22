import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { productService } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { Pagination } from '../components/common/Pagination';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state from URL query parameters
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'All';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const filters = {
    keyword,
    category,
    minPrice,
    maxPrice,
    minRating,
    sort,
    page
  };

  const updateFilters = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val === '' || val === undefined || (key === 'category' && val === 'All')) {
      newParams.delete(key);
    } else {
      newParams.set(key, val);
    }
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = {
          keyword: keyword || undefined,
          category: category !== 'All' ? category : undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          minRating: minRating ? Number(minRating) : undefined,
          sort,
          page,
          limit: 12
        };

        const res = await productService.getProducts(params);
        if (res.success) {
          setProducts(res.products);
          setTotal(res.total);
          setTotalPages(res.totalPages);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  const hasActiveFilters = Boolean(
    keyword || (category && category !== 'All') || minPrice || maxPrice || minRating
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-hairline/80">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-ink-light">
            {category && category !== 'All' ? category : 'Complete Studio Archive'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight mt-1">
            Studio Collection
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Displaying {products.length} of {total} verified lifestyle pieces
          </p>
        </div>

        {/* Sort Controls & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface border border-hairline rounded-full text-xs font-semibold text-dark hover:bg-surface-hover transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-surface border border-hairline rounded-full px-3.5 py-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-ink-light" />
            <select
              value={sort}
              onChange={(e) => updateFilters('sort', e.target.value)}
              className="bg-transparent text-xs text-dark font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort by: Newest Additions</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-dark">Active Filters:</span>
          {category && category !== 'All' && (
            <button
              onClick={() => updateFilters('category', 'All')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-hairline rounded-full text-xs font-semibold text-dark hover:bg-surface-hover transition-colors"
            >
              <span>Discipline: {category}</span>
              <X className="w-3 h-3 text-ink-light" />
            </button>
          )}
          {keyword && (
            <button
              onClick={() => updateFilters('keyword', '')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-hairline rounded-full text-xs font-semibold text-dark hover:bg-surface-hover transition-colors"
            >
              <span>Search: "{keyword}"</span>
              <X className="w-3 h-3 text-ink-light" />
            </button>
          )}
          {(minPrice || maxPrice) && (
            <button
              onClick={() => {
                updateFilters('minPrice', '');
                updateFilters('maxPrice', '');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-hairline rounded-full text-xs font-semibold text-dark hover:bg-surface-hover transition-colors"
            >
              <span>Price: ₹{minPrice || 0} - ₹{maxPrice || '∞'}</span>
              <X className="w-3 h-3 text-ink-light" />
            </button>
          )}
          {minRating && (
            <button
              onClick={() => updateFilters('minRating', '')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-hairline rounded-full text-xs font-semibold text-dark hover:bg-surface-hover transition-colors"
            >
              <span>★ {minRating}+ Rating</span>
              <X className="w-3 h-3 text-ink-light" />
            </button>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-dark hover:underline font-bold ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28">
          <ProductFilters
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            totalResults={total}
          />
        </aside>

        {/* Product Grid & Pagination */}
        <main className="lg:col-span-3 space-y-8">
          <ProductGrid
            products={products}
            loading={loading}
            onResetFilters={resetFilters}
          />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => updateFilters('page', newPage)}
          />
        </main>
      </div>

      {/* Mobile Filters Slide-over */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-dark/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-hairline">
                <h3 className="text-lg font-bold text-dark">Refine Catalog</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-ink-muted hover:text-dark"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
                totalResults={total}
              />
            </div>

            <div className="pt-6 border-t border-hairline">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-dark text-white rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Show {total} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
