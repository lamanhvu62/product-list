"use client";

import { useState, useRef, useCallback } from "react";
import useSearchProduct from "../hook/useSearchProduct";

const ProductList: React.FC = () => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const { products, loading, error, hasMore } = useSearchProduct(
    query,
    pageNumber
  );

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductEl = useCallback(
    (node: HTMLLIElement | null) => {
      if (loading || !node) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 20);
          console.log("visible");
        }
      });

      if (node) observer.current.observe(node);
      console.log(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e: any) {
    setQuery(e.target.value);
    setPageNumber(0);
  }

  return (
    <div>
      <div className="box-search">
        <h3>Search box</h3>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search something..."
        />
      </div>
      <div>
        <h3>Product list</h3>
        <ul>
          {products.map((item, index) => {
            if (products.length === index + 1) {
              return (
                <li ref={lastProductEl} key={index}>
                  <p>
                    <img src={item.images[0]} alt={item.title} />
                  </p>
                  <p>{item.title}</p>
                  <p>${item.price}</p>
                </li>
              );
            } else {
              return (
                <li key={index}>
                  <p>
                    <img src={item.images[0]} alt={item.title} />
                  </p>
                  <p>{item.title}</p>
                  <p>${item.price}</p>
                </li>
              );
            }
          })}
        </ul>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>Error</div>}
    </div>
  );
};

export default ProductList;
