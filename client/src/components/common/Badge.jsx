import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = ''
}) => {
  const variants = {
    neutral: 'bg-surface text-ink-muted border border-hairline',
    dark: 'bg-dark text-white',
    accent: 'bg-rose-50 text-rose-700 border border-rose-200',
    glass: 'bg-black/50 backdrop-blur-md text-white border border-white/15',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200'
  };

  const sizes = {
    xs: 'text-[10px] px-2.5 py-0.5 font-bold tracking-wider uppercase',
    sm: 'text-xs px-3 py-1 font-semibold',
    md: 'text-xs sm:text-sm px-3.5 py-1.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full transition-colors ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};
