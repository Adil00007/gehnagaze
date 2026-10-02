"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProductCatalog({ products, categories }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const visibleProducts = products
    .filter((product) => {
      const matchesQuery = `${product.name} ${product.description || ""} ${product.category || ""}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory = category === "all" || product.category === category;
      return matchesQuery && matchesCategory;
    })
    .sort((first, second) => {
      if (sort === "price-low") return Number(first.price) - Number(second.price);
      if (sort === "price-high") return Number(second.price) - Number(first.price);
      return new Date(second.created_at) - new Date(first.created_at);
    });

  return (
    <>
      <div className="catalog-toolbar">
        <label className="catalog-search">
          <span className="sr-only">Search pieces</span>
          <input
            type="search"
            placeholder="Search the edit"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="catalog-select">
          <span className="sr-only">Filter by category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="catalog-select">
          <span className="sr-only">Sort products</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between text-xs text-ink/50 mb-6">
        <span>{visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}</span>
        {query && <span>Results for “{query}”</span>}
      </div>

      {visibleProducts.length === 0 ? (
        <div className="border border-dashed border-ink/20 p-14 text-center text-ink/50">
          No pieces match your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-12 md:gap-x-7 md:gap-y-16">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
