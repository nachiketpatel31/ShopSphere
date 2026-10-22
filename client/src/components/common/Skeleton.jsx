import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-[#ECE8E1] rounded-xl ${className}`}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-3 border border-hairline flex flex-col space-y-3">
      <Skeleton className="w-full aspect-[4/5] rounded-xl" />
      <div className="space-y-2 px-1">
        <Skeleton className="w-1/3 h-3" />
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-4" />
      </div>
    </div>
  );
};
