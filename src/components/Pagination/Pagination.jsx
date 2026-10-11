import React, { useEffect } from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  const totalPages = lastPage && lastPage > 0 ? lastPage : 1;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <nav className="pagination-root" aria-label="Pagination">
      <button
        type="button"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-btn"
        aria-label="Previous page"
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => page !== currentPage && onPageChange(page)}
          className={`page-btn ${page === currentPage ? "is-active" : ""}`}
          disabled={page === currentPage}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="page-btn"
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
};

export default Pagination;
