import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      name,
      type = 'text',
      className = '',
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          ref={ref}
          required={required}
          className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-medium text-[#0C0C0E] placeholder:text-neutral-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-[#0C0C0E] ${
            error ? 'border-red-500 ring-2 ring-red-500/10' : 'border-neutral-200'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-neutral-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
