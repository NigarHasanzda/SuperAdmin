import React, { useEffect } from "react";

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  // Hər dəfə səhifə dəyişəndə yuxarı qaytarır
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        marginTop: 20,
        userSelect: "none",
      }}
    >
      {/* Sol ox — əvvəlki səhifə */}
      <button
        onClick={() => {
          if (currentPage > 1) {
            onPageChange(currentPage - 1);
          }
        }}
        disabled={currentPage === 1}
        style={btnStyle}
        aria-label="Əvvəlki səhifə"
      >
        ‹
      </button>

      {/* Səhifə nömrələri */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => {
            if (page !== currentPage) {
              onPageChange(page);
            }
          }}
          style={{
            ...btnStyle,
            fontWeight: page === currentPage ? "bold" : "normal",
            backgroundColor: page === currentPage ? "#5D56F1" : "transparent",
            color: page === currentPage ? "white" : "#5D56F1",
            cursor: page === currentPage ? "default" : "pointer",
          }}
          disabled={page === currentPage}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {/* Sağ ox — növbəti səhifə */}
      <button
        onClick={() => {
          if (currentPage < lastPage) {
            onPageChange(currentPage + 1);
          }
        }}
        disabled={currentPage === lastPage}
        style={btnStyle}
        aria-label="Sonrakı səhifə"
      >
        ›
      </button>
    </div>
  );
};

const btnStyle = {
  border: "1px solid #5D56F1",
  background: "transparent",
  color: "#5D56F1",
  padding: "6px 12px",
  borderRadius: "4px",
  fontSize: "16px",
  userSelect: "none",
};

export default Pagination;
