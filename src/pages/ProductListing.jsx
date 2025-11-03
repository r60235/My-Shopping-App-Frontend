import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

const ProductListing = () => {
  const { category } = useParams();
  const { products, filters, setFilters, searchQuery } = useContext(AppContext);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // reset selected categories when main category changes
  useEffect(() => {
    setSelectedCategories([]);
  }, [category]);

  // filter products by category 
  const categoryProducts = category && category !== "all" 
    ? products.filter(p => p.category === category)
    : products;

  // search
  const searchProducts = (productsToSearch, query) => {
    if (!query.trim()) return productsToSearch;
    
    const searchTerm = query.toLowerCase().trim();
    
    return productsToSearch.filter(product => {
      const nameMatch = product.name?.toLowerCase().includes(searchTerm);
      const categoryMatch = product.category?.toLowerCase() === searchTerm;
      
      // either name or category match
      return nameMatch || categoryMatch;
    });
  };

  // appply filters
  const filteredProducts = (Array.isArray(categoryProducts) ? categoryProducts : [])
    .filter((p) => {
      // search filter
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.toLowerCase().trim();
        const nameMatch = p.name?.toLowerCase().includes(searchTerm);
        const categoryMatch = p.category?.toLowerCase() === searchTerm;
        if (!nameMatch && !categoryMatch) return false;
      }
      
      // price filter
      if (p.price > filters.price) return false;
      
      // rating filter
      if (filters.rating && (p.rating || 0) < filters.rating) return false;
      
    
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "low") return a.price - b.price;
      if (filters.sort === "high") return b.price - a.price;
      return 0;
    });

  // Ccategory filter based on current category
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
    setFilters({ category: "", price: 2000, rating: "", sort: "" });
    setSelectedCategories([]);
  };

  // loading state
  if (products.length === 0) {
    return <p className="text-center mt-5">Loading products...</p>;
  }

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        {/* filters */}
        <div className="col-md-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Filters</h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleClearAllFilters}
            >
              Clear All
            </button>
          </div>

          {/* search Info */}
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


          {/* price filter */}
          <div className="mt-3">
            <label className="form-label">Max Price: ${filters.price}</label>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={filters.price}
              className="form-range"
              onChange={(e) =>
                setFilters({ ...filters, price: Number(e.target.value) })
              }
            />
            <div className="d-flex justify-content-between">
              <small>$50</small>
              <small>$2000</small>
            </div>
          </div>

          {/* category filter */}
          <div className="mt-3">
            <h6>Category</h6>
            {getCategoryFilters().map((filter) => (
              <div key={filter.id}>
                <input 
                  type="checkbox" 
                  id={filter.id}
                  checked={selectedCategories.includes(filter.value)}
                  onChange={(e) => handleCategoryFilterChange(filter.value, e.target.checked)}
                />
                <label htmlFor={filter.id} className="ms-2">{filter.label}</label>
              </div>
            ))}
          </div>

          {/* rating filter */}
          <div className="mt-3">
            <h6>Minimum Rating</h6>
            {[4, 3, 2, 1].map((r) => (
              <div key={r}>
                <input
                  type="radio"
                  name="rating"
                  id={`rating-${r}`}
                  onChange={() => setFilters({ ...filters, rating: r })}
                  checked={filters.rating === r}
                />{" "}
                <label htmlFor={`rating-${r}`}>{r}★ & above</label>
              </div>
            ))}
            <div>
              <input
                type="radio"
                name="rating"
                id="rating-all"
                onChange={() => setFilters({ ...filters, rating: "" })}
                checked={filters.rating === ""}
              />{" "}
              <label htmlFor="rating-all">All Ratings</label>
            </div>
          </div>

          {/* sort by */}
          <div className="mt-3">
            <h6>Sort By</h6>
            <div>
              <input
                type="radio"
                name="sort"
                id="sort-default"
                onChange={() => setFilters({ ...filters, sort: "" })}
                checked={filters.sort === ""}
              />{" "}
              <label htmlFor="sort-default">Default</label>
            </div>
            <div>
              <input
                type="radio"
                name="sort"
                id="sort-low"
                onChange={() => setFilters({ ...filters, sort: "low" })}
                checked={filters.sort === "low"}
              />{" "}
              <label htmlFor="sort-low">Price: Low → High</label>
            </div>
            <div>
              <input
                type="radio"
                name="sort"
                id="sort-high"
                onChange={() => setFilters({ ...filters, sort: "high" })}
                checked={filters.sort === "high"}
              />{" "}
              <label htmlFor="sort-high">Price: High → Low</label>
            </div>
          </div>
        </div>

        {/* product section */}
        <div className="col-md-9">
          <div className="bg-light p-4 rounded">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'} 
                {searchQuery && ` matching "${searchQuery}"`}
                <span className="text-muted"> ({filteredProducts.length})</span>
              </h5>
              
              {filteredProducts.length > 0 && (
                <div className="text-muted small">
                  Price: ${filters.price === 2000 ? 'Any' : `Up to $${filters.price}`} | 
                  Rating: {filters.rating ? `${filters.rating}★+` : 'Any'} |
                  Sort: {filters.sort === 'low' ? 'Low to High' : filters.sort === 'high' ? 'High to Low' : 'Default'}
                </div>
              )}
            </div>

            <div className="d-flex flex-wrap gap-4 justify-content-start">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    style={{ flex: "1 1 200px", maxWidth: "220px" }}
                  >
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <div className="text-center w-100 py-5">
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