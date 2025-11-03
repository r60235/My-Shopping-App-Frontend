import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const ProductCard = ({ product }) => {
  const { cart, wishlist, addToCart, toggleWishlist } = useAppContext();

  const inCart = cart.includes(product._id);
  const inWish = wishlist.includes(product._id);

  return (
    <div className="card h-100 shadow-sm">
      {/* img , wishlist button */}
      <div className="position-relative">
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <img
            src={product.image || "https://placehold.co/300x200?text=No+Image"}
            className="card-img-top"
            alt={product.name}
            style={{ 
              height: 180, 
              objectFit: "cover",
              cursor: 'pointer'
            }}
          />
        </Link>

        <button
          className={`btn btn-sm position-absolute top-0 end-0 m-2 ${
            inWish ? "btn-danger" : "btn-outline-light"
          }`}
          onClick={() => toggleWishlist(product._id)}
        >
          {inWish ? '♥' : '♥'}
        </button>
      </div>

      {/* product info */}
      <div className="card-body d-flex flex-column text-center">
        <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
          <h6 className="card-title mb-2" style={{ cursor: 'pointer' }}>{product.name}</h6>
        </Link>

        <div className="fw-bold mb-2">${product.price?.toFixed(2)}</div>
        <div className="text-muted small text-capitalize mb-2">{product.category}</div>

        {!inCart ? (
          <button
            className="btn btn-secondary w-100 mt-auto"
            onClick={() => addToCart(product._id)}
          >
            Add to Cart
          </button>
        ) : (
          <Link to="/cart" className="btn btn-primary w-100 mt-auto">
            Go to Cart
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCard;