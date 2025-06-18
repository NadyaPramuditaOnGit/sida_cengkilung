// src/components/Button/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-2">
      {/* Tombol Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-primary-shade1 text-netural-white font-roboto font-semibold disabled:opacity-50"
      >
        &lt;
      </button>

      {/* Tombol Halaman */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded font-roboto font-semibold 
            ${currentPage === page
              ? 'bg-primary-shade4 text-netural-white'
              : 'bg-primary-shade1 text-netural-white'}`}
        >
          {page}
        </button>
      ))}

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-primary-shade1 text-netural-white font-roboto font-semibold disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;