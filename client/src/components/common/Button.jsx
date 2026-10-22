import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-dark hover:bg-neutral-800 text-white shadow-sm focus:ring-dark active:scale-[0.98]',
    white:
      'bg-white hover:bg-neutral-100 text-dark font-semibold shadow-sm focus:ring-neutral-200 active:scale-[0.98]',
    secondary:
      'bg-surface hover:bg-surface-hover text-dark font-medium focus:ring-neutral-300 active:scale-[0.98]',
    outline:
      'border border-hairline bg-transparent hover:bg-surface text-dark focus:ring-dark active:scale-[0.98]',
    'dark-outline':
      'border border-white/30 bg-transparent hover:bg-white/10 text-white focus:ring-white active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-surface text-dark focus:ring-transparent',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5',
    md: 'text-xs sm:text-sm px-5 py-2.5 rounded-full gap-2',
    lg: 'text-sm sm:text-base px-7 py-3 rounded-full gap-2.5 font-semibold',
    icon: 'p-2 rounded-full'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};
