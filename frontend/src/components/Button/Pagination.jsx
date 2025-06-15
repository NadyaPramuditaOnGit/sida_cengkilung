import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-primary-shade1 text-netural-white font-roboto font-semibold disabled:opacity-50"
      >
        &lt;
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${currentPage === page ? 'bg-primary-shade4 text-netural-white font-roboto font-semibold'  : 'bg-primary-shade1 text-netural-white'}`}
        >
          {page}
        </button>
      ))}
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
