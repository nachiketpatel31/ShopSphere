import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { PackageSearch } from 'lucide-react';

export const ProductGrid = ({
  products = [],
  loading = false,
  emptyTitle = 'No products match your criteria',
  emptyDescription = 'Try adjusting your search terms, price range, or category filters.',
  onResetFilters
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={emptyTitle}
        description={emptyDescription}
        actionText={onResetFilters ? 'Clear All Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
