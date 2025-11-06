import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAppContext } from "../context/AppContext.jsx";

const ProductCard = ({ product }) => {
  const { cart, wishlist, addToCart, toggleWishlist } = useAppContext();
  const [showSizeModal, setShowSizeModal] = useState(false);

  const inWish = wishlist.includes(product._id);
  const isClothing = ["men", "women", "kids"].includes(String(product.category).toLowerCase());
  
  const cartItemsForProduct = cart.filter(item => item.productId === product._id);
  const inCart = cartItemsForProduct.length > 0;

  const handleAddToCart = () => {
    if (isClothing) {
      setShowSizeModal(true);
    } else {
      addToCart(product._id, "");
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleSizeSelect = (size) => {
    setShowSizeModal(false);
    addToCart(product._id, size);
    toast.success(`${product.name} (Size: ${size}) added to cart!`);
  };

  return (
    <>
      <div className="card h-100 shadow-sm">
        <div className="position-relative">
          <Link to={`/product/${product._id}`} className="text-decoration-none">
            <img
              src={product.image || "https://placehold.co/300x200?text=No+Image"}
              className="card-img-top"
              alt={product.name}
              style={{ 
                height: "180px", 
                objectFit: "cover",
                cursor: 'pointer'
              }}
            />
          </Link>

          <button
            className={`btn btn-sm position-absolute top-0 end-0 m-2 ${inWish ? "btn-danger" : "btn-outline-light"}`}
            onClick={() => toggleWishlist(product._id)}
          >
            {inWish ? '♥' : '♥'}
          </button>
        </div>

        <div className="card-body d-flex flex-column text-center p-3">
          <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
            <h6 className="card-title mb-2 text-truncate" style={{ cursor: 'pointer' }} title={product.name}>{product.name}</h6>
          </Link>

          <div className="fw-bold mb-2">${product.price?.toFixed(2)}</div>
          <div className="text-muted small text-capitalize mb-2 text-truncate">{product.category}</div>

          {!inCart ? (
            <button
              className="btn btn-secondary w-100 mt-auto btn-sm"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          ) : (
            <Link to="/cart" className="btn btn-primary w-100 mt-auto btn-sm">
              Go to Cart ({cartItemsForProduct.length})
            </Link>
          )}
        </div>
      </div>

      {showSizeModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Size</h5>
                <button type="button" className="btn-close" onClick={() => setShowSizeModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Please select a size for <strong>{product.name}</strong>:</p>
                <div className="d-flex gap-2 flex-wrap justify-content-center">
                  {["S","M","L","XL","XXL"].map((size) => (
                    <button 
                      key={size}
                      className="btn btn-outline-dark"
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;