import React from 'react';
import { RotateCcw, Search, SlidersHorizontal, Check } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Accessories'];

export const ProductFilters = ({
  filters,
  onChange,
  onReset,
  totalResults
}) => {
  const handleCategoryClick = (category) => {
    onChange('category', category);
  };

  const handlePriceChange = (field, val) => {
    onChange(field, val === '' ? '' : Number(val));
  };

  return (
    <div className="bg-surface rounded-3xl border border-hairline/80 p-6 space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-hairline/60">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-dark" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-dark">Refine Catalog</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-ink-muted hover:text-dark flex items-center gap-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-light mb-2">
          Keyword Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search goods..."
            value={filters.keyword || ''}
            onChange={(e) => onChange('keyword', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-hairline rounded-xl text-dark placeholder:text-ink-light focus:outline-none focus:border-dark transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-ink-light absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Category List */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-light mb-2">
          Disciplines
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = (filters.category || 'All') === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-dark text-white shadow-sm'
                    : 'text-ink-muted hover:bg-white hover:text-dark'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-light mb-2">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-hairline rounded-xl text-dark focus:outline-none focus:border-dark"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-hairline rounded-xl text-dark focus:outline-none focus:border-dark"
          />
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-light mb-2">
          Minimum Rating
        </label>
        <div className="space-y-1">
          {[4, 3].map((stars) => {
            const isSelected = Number(filters.minRating) === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => onChange('minRating', isSelected ? '' : stars)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-dark text-white shadow-sm'
                    : 'bg-white/60 text-ink-muted hover:bg-white hover:text-dark'
                }`}
              >
                <span>★ {stars}.0 & Above</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
