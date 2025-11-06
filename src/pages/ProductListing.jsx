import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

const ProductListing = () => {
  const { category } = useParams();
  const { products, filters, setFilters, searchQuery } = useAppContext();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSelectedCategories([]);
  }, [category]);

  const categoryProducts = category && category !== "all" 
    ? products.filter(p => p.category === category)
    : products;

  const filteredProducts = (Array.isArray(categoryProducts) ? categoryProducts : [])
    .filter((p) => {
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.toLowerCase().trim();
        const nameMatch = p.name?.toLowerCase().includes(searchTerm);
        const categoryMatch = p.category?.toLowerCase().includes(searchTerm);
        
        if (!nameMatch && !categoryMatch) return false;
      }
      
      if (filters.price !== "any" && p.price > parseInt(filters.price)) return false;
      
      if (filters.rating && (p.rating || 0) < filters.rating) return false;
      
      if (selectedCategories.length > 0 && (!category || category === "all")) {
        if (!selectedCategories.includes(p.category)) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "low") return a.price - b.price;
      if (filters.sort === "high") return b.price - a.price;
      return 0;
    });

  const getCategoryFilters = () => {
    if (category === "men") {
      return [
        { id: "men-shirts", label: "Men Shirts", value: "men-shirts" },
        { id: "men-pants", label: "Men Pants", value: "men-pants" },
        { id: "men-jackets", label: "Men Jackets", value: "men-jackets" }
      ];
    } else if (category === "women") {
      return [
        { id: "women-dresses", label: "Women Dresses", value: "women-dresses" },
        { id: "women-tops", label: "Women Tops", value: "women-tops" },
        { id: "women-pants", label: "Women Pants", value: "women-pants" }
      ];
    } else if (category === "kids") {
      return [
        { id: "kids-boys", label: "Boys Clothing", value: "kids-boys" },
        { id: "kids-girls", label: "Girls Clothing", value: "kids-girls" },
        { id: "kids-unisex", label: "Unisex", value: "kids-unisex" }
      ];
    } else if (category === "electronics") {
      return [
        { id: "elec-audio", label: "Audio", value: "elec-audio" },
        { id: "elec-wearables", label: "Wearables", value: "elec-wearables" },
        { id: "elec-mobiles", label: "Mobiles", value: "elec-mobiles" }
      ];
    } else {
      return [
        { id: "cat-men", label: "Men", value: "men" },
        { id: "cat-women", label: "Women", value: "women" },
        { id: "cat-kids", label: "Kids", value: "kids" },
        { id: "cat-electronics", label: "Electronics", value: "electronics" }
      ];
    }
  };

  const handleCategoryFilterChange = (filterValue, isChecked) => {
    if (isChecked) {
      setSelectedCategories(prev => [...prev, filterValue]);
    } else {
      setSelectedCategories(prev => prev.filter(cat => cat !== filterValue));
    }
  };

  const handleClearAllFilters = () => {
    setFilters({ category: "", price: "any", rating: "", sort: "" });
    setSelectedCategories([]);
  };

  const priceRanges = [
    { value: "any", label: "Any Price" },
    { value: "100", label: "Up to $100" },
    { value: "250", label: "Up to $250" },
    { value: "500", label: "Up to $500" },
    { value: "1000", label: "Up to $1000" },
    { value: "2000", label: "Up to $2000" }
  ];

  if (products.length === 0) {
    return <p className="text-center mt-5">Loading products...</p>;
  }

  const FilterSection = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Filters</h5>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={handleClearAllFilters}
        >
          Clear All
        </button>
      </div>

      {searchQuery && (
        <div className="alert alert-info mt-3">
          <small>Search: "{searchQuery}"</small>
          <button 
            className="btn btn-sm btn-outline-secondary ms-2"
            onClick={() => window.location.href = window.location.pathname}
          >
            Clear
          </button>
        </div>
      )}

      {/* REPLACED: Price Dropdown instead of Slider */}
      <div className="mb-4">
        <label className="form-label fw-bold">Price Range</label>
        <select
          className="form-select"
          value={filters.price}
          onChange={(e) => setFilters({ price: e.target.value })}
        >
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <h6>Category</h6>
        {getCategoryFilters().map((filter) => (
          <div key={filter.id} className="form-check">
            <input 
              className="form-check-input"
              type="checkbox" 
              id={filter.id}
              checked={selectedCategories.includes(filter.value)}
              onChange={(e) => handleCategoryFilterChange(filter.value, e.target.checked)}
            />
            <label className="form-check-label" htmlFor={filter.id}>{filter.label}</label>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <h6>Minimum Rating</h6>
        {[4, 3, 2, 1].map((r) => (
          <div key={r} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="rating"
              id={`rating-${r}`}
              onChange={() => setFilters({ rating: r })}
              checked={filters.rating === r}
            />
            <label className="form-check-label" htmlFor={`rating-${r}`}>{r}★ & above</label>
          </div>
        ))}
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="rating"
            id="rating-all"
            onChange={() => setFilters({ rating: "" })}
            checked={filters.rating === ""}
          />
          <label className="form-check-label" htmlFor="rating-all">All Ratings</label>
        </div>
      </div>

      <div className="mb-3">
        <h6>Sort By</h6>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sort"
            id="sort-default"
            onChange={() => setFilters({ sort: "" })}
            checked={filters.sort === ""}
          />
          <label className="form-check-label" htmlFor="sort-default">Default</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sort"
            id="sort-low"
            onChange={() => setFilters({ sort: "low" })}
            checked={filters.sort === "low"}
          />
          <label className="form-check-label" htmlFor="sort-low">Price: Low → High</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sort"
            id="sort-high"
            onChange={() => setFilters({ sort: "high" })}
            checked={filters.sort === "high"}
          />
          <label className="form-check-label" htmlFor="sort-high">Price: High → Low</label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-lg-3 d-none d-lg-block">
          <div className="sticky-top" style={{top: '20px'}}>
            <FilterSection />
          </div>
        </div>

        <div className="col-12 d-lg-none mb-3">
          <button 
            className="btn btn-outline-primary w-100"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="col-12 d-lg-none mb-3">
            <div className="card p-3">
              <FilterSection />
            </div>
          </div>
        )}

        <div className="col-lg-9">
          <div className="bg-light p-3 p-md-4 rounded">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
              <h5 className="mb-2 mb-md-0">
                {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'} 
                {searchQuery && ` matching "${searchQuery}"`}
                <span className="text-muted"> ({filteredProducts.length})</span>
              </h5>
              
              {filteredProducts.length > 0 && (
                <div className="text-muted small text-center text-md-start">
                  Price: {filters.price === "any" ? 'Any' : `Up to $${filters.price}`} | 
                  Rating: {filters.rating ? `${filters.rating}★+` : 'Any'} |
                  Sort: {filters.sort === 'low' ? 'Low to High' : filters.sort === 'high' ? 'High to Low' : 'Default'}
                </div>
              )}
            </div>

            <div className="row g-3">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <div key={p._id} className="col-6 col-md-4 col-lg-3">
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-muted">No products found with current filters.</p>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleClearAllFilters}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;