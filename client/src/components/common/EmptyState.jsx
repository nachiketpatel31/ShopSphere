import React from 'react';
import { Button } from './Button';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-6 bg-[#F4F4F6] rounded-3xl border border-neutral-200/80 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200/60 shadow-sm flex items-center justify-center text-[#0C0C0E] mb-5">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-extrabold text-[#0C0C0E] mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
};
