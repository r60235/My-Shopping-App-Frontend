import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const Wishlist = () => {
  const { wishlist, products, moveWishlistToCart, toggleWishlist } = useAppContext();
  
  const items = products.filter((p) => wishlist.includes(p._id));

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
                    onClick={() => toggleWishlist(p._id)}
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

                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-primary flex-fill btn-sm"
                      onClick={() => moveWishlistToCart(p._id)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => toggleWishlist(p._id)}
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
    </div>
  );
};

export default Wishlist;