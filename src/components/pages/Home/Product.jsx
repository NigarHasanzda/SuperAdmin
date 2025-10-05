import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchProductById } from "../../Redux/Features/ProductSlice";
import Pagination from "../../Pagination/Pagination"; 

export const Product = () => {
  const dispatch = useDispatch();
  const { list, loading, error, single, page } = useSelector(state => state.products);

  const [currentPage, setCurrentPage] = useState(1); 

  useEffect(() => {
    dispatch(fetchProducts(currentPage - 1));
  }, [dispatch, currentPage]);

  const handleClick = (id) => {
    dispatch(fetchProductById(id));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {list.content?.map(product => (
          <li
            key={product.id}
            onClick={() => handleClick(product.id)}
            style={{ cursor: "pointer", marginBottom: "8px", padding: "6px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            {product.name} (ID: {product.id})
          </li>
        ))}
      </ul>

      {page && page.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          lastPage={page.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Seçilmiş məhsul */}
      {single && (
        <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
          <h3>Selected Product Details:</h3>
          <p>ID: {single.id}</p>
          <p>Name: {single.name}</p>
          <p>Price: {single.price}</p>
        </div>
      )}
    </div>
  );
};
