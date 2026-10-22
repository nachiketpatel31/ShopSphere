import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, numReviews, size = 'sm' }) => {
  const stars = [1, 2, 3, 4, 5];
  const sizeClasses = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {stars.map((star) => (
          <Star
            key={star}
            className={`${sizeClasses} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-stone-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-ink">
        {Number(rating).toFixed(1)}
      </span>
      {numReviews !== undefined && (
        <span className="text-xs text-ink-light">({numReviews})</span>
      )}
    </div>
  );
};
