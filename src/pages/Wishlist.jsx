import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, products, moveWishlistToCart, toggleWishlist, addToCart } = useAppContext();
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  
  const items = products.filter((p) => p && p._id && wishlist.includes(p._id));

  const handleMoveToCart = (product) => {
    const isClothing = ["men", "women", "kids"].includes(String(product.category).toLowerCase());
    
    if (isClothing) {
      setSelectedProduct(product);
      setSelectedSize("");
      setShowSizeModal(true);
    } else {
      addToCart(product._id, "");
      toggleWishlist(product._id);
      toast.success(`${product.name} moved to cart!`);
    }
  };

  const handleRemoveFromWishlist = (product) => {
    toggleWishlist(product._id);
    toast.info(`${product.name} removed from wishlist!`);
  };

  const handleConfirmMoveToCart = () => {
    if (selectedProduct) {
      const isClothing = ["men", "women", "kids"].includes(String(selectedProduct.category).toLowerCase());
      
      if (isClothing && !selectedSize) {
        toast.error("Please select a size");
        return;
      }
      
      addToCart(selectedProduct._id, selectedSize);
      toggleWishlist(selectedProduct._id);
      setShowSizeModal(false);
      setSelectedProduct(null);
      setSelectedSize("");
      toast.success(`${selectedProduct.name} ${selectedSize ? `(Size: ${selectedSize})` : ''} moved to cart!`);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Your Wishlist ❤️</h3>
        <span className="badge bg-danger fs-6">{items.length} items</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center mt-5 py-5">
          <div className="mb-4" style={{fontSize: '4rem'}}>❤️</div>
          <h4 className="text-muted mb-3">Your wishlist is empty</h4>
          <p className="text-muted mb-4">Start adding products you love to your wishlist!</p>
          <Link to="/products/all" className="btn btn-primary btn-lg">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {items.map((p) => (
            <div className="col-6 col-md-4 col-lg-3" key={p._id}>
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                  <Link to={`/product/${p._id}`} className="text-decoration-none">
                    <img
                      src={p.image || "https://placehold.co/300x200?text=No+Image"}
                      className="card-img-top"
                      alt={p.name}
                      style={{ 
                        height: "200px", 
                        objectFit: "cover",
                        cursor: 'pointer'
                      }}
                    />
                  </Link>
                  
                  <button
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                    onClick={() => handleRemoveFromWishlist(p)}
                    title="Remove from wishlist"
                  >
                    ×
                  </button>
                </div>
                
                <div className="card-body d-flex flex-column p-3">
                  <Link to={`/product/${p._id}`} className="text-decoration-none text-dark">
                    <h6 className="card-title mb-2 text-truncate" style={{ cursor: 'pointer' }} title={p.name}>
                      {p.name}
                    </h6>
                  </Link>
                  
                  <div className="fw-bold mb-2">${p.price.toFixed(2)}</div>
                  <div className="text-muted small text-capitalize mb-3">{p.category}</div>

                  <div className="d-flex flex-column flex-sm-row gap-2 mt-auto">
                    <button
                      className="btn btn-primary flex-fill btn-sm"
                      onClick={() => handleMoveToCart(p)}
                    >
                      Move to Cart
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveFromWishlist(p)}
                      title="Remove from wishlist"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSizeModal && selectedProduct && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Size</h5>
                <button type="button" className="btn-close" onClick={() => setShowSizeModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Choose size for {selectedProduct.name}</label>
                  <div className="d-flex gap-2 flex-wrap justify-content-center">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        className={`btn ${selectedSize === size ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => setSelectedSize(size)}
                        style={{ minWidth: "50px" }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowSizeModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleConfirmMoveToCart}
                  disabled={!selectedSize}
                >
                  Move to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;