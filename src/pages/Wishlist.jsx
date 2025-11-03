import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const Wishlist = () => {
  const { wishlist, products, moveWishlistToCart, toggleWishlist } = useAppContext();
  
  // filter products present in wishlist
  const items = products.filter((p) => wishlist.includes(p._id));

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-center">Your Wishlist ❤️</h3>

      {items.length === 0 ? (
        <div className="text-center mt-5">
          <p>Your wishlist is empty!</p>
          <Link to="/products/all" className="btn btn-dark">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="row">
          {items.map((p) => (
            <div className="col-md-3 mb-4" key={p._id}>
              <div className="card h-100 shadow-sm">
                {/*product image */}
                <Link to={`/product/${p._id}`} className="text-decoration-none">
                  <img
                    src={p.image || "https://placehold.co/300x200?text=No+Image"}
                    className="card-img-top"
                    alt={p.name}
                    style={{ 
                      height: 180, 
                      objectFit: "cover",
                      cursor: 'pointer'
                    }}
                  />
                </Link>
                
                <div className="card-body d-flex flex-column text-center">
                  {/*product name */}
                  <Link to={`/product/${p._id}`} className="text-decoration-none text-dark">
                    <h6 className="card-title" style={{ cursor: 'pointer' }}>{p.name}</h6>
                  </Link>
                  
                  <div className="fw-bold mb-2">${p.price.toFixed(2)}</div>
                  <div className="text-muted small text-capitalize mb-2">{p.category}</div>

                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-primary flex-fill"
                      onClick={() => moveWishlistToCart(p._id)}
                    >
                      Move to Cart
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => toggleWishlist(p._id)}
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