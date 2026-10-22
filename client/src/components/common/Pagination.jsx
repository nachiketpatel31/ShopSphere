import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 rounded-full border border-neutral-200 bg-white text-[#0C0C0E] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 transition-colors shadow-sm"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-full text-xs font-bold transition-all shadow-sm ${
            currentPage === page
              ? 'bg-[#0C0C0E] text-white shadow-md'
              : 'border border-neutral-200 bg-white text-[#0C0C0E] hover:bg-neutral-100'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 rounded-full border border-neutral-200 bg-white text-[#0C0C0E] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 transition-colors shadow-sm"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
