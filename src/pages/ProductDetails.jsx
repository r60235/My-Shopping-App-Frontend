import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const { products, cart, wishlist, addToCart, removeFromCart, toggleWishlist } = useAppContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const foundProduct = products.find(p => String(p._id) === String(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          const response = await fetch(`https://my-shopping-app-backend.vercel.app/product/${id}`);
          if (response.ok) {
            const productData = await response.json();
            setProduct(productData);
          } else {
            console.error('product not found');
          }
        }
      } catch (error) {
        console.error('error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id, products]);

  if (loading) {
    return <div className="container mt-5 text-center">loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <p>product not found</p>
        <Link to="/products/all" className="btn btn-dark">back to products</Link>
      </div>
    );
  }

  const isClothing = ["men", "women", "kids"].includes(String(product.category).toLowerCase());
  const inCart = cart.includes(product._id);
  const inWishlist = wishlist.includes(product._id);

  return (
    <div className="container mt-4">
      <Link 
        to={product?.category ? `/products/${product.category}` : '/products/all'}
        className="btn btn-outline-secondary mb-3 text-decoration-none"
      >
        ← back to {product.category ? `${product.category} products` : 'products'}
      </Link>

      <div className="row g-4">
        <div className="col-md-6">
          <img 
            src={product.image || "https://placehold.co/600x400?text=no+image"} 
            className="img-fluid rounded" 
            alt={product.name} 
            style={{ maxHeight: "500px", objectFit: "cover", width: "100%" }}
          />
        </div>
        
        <div className="col-md-6">
          <h3>{product.name}</h3>
          <div className="mb-2">
            <strong className="fs-4">${product.price?.toFixed(2)}</strong>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through ms-2">
                ${product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Description</label>
            <p className="text-muted">{product.description || "no description available"}</p>
          </div>

          {isClothing && (
            <div className="mb-3">
              <label className="form-label fw-bold">Size</label>
              <div>
                {["S","M","L","XL","XXL"].map((size) => (
                  <button 
                    key={size} 
                    className={`btn btn-outline-secondary btn-sm me-2 mb-2 ${selectedSize === size ? 'btn-dark' : 'btn-outline-secondary'}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-3">
            {!inCart ? (
              <button 
                className="btn btn-dark me-2" 
                onClick={() => addToCart(product._id)}
              >
                add to cart
              </button>
            ) : (
              <button 
                className="btn btn-danger me-2" 
                onClick={() => removeFromCart(product._id)}
              >
                remove from cart
              </button>
            )}
            
            <button 
              className={`btn ${inWishlist ? 'btn-danger' : 'btn-outline-danger'}`} 
              onClick={() => toggleWishlist(product._id)}
            >
              {inWishlist ? 'remove from wishlist' : 'add to wishlist'}
            </button>
          </div>

          <div className="mt-4 d-flex gap-3">
            <div className="text-center">
              <div style={{fontSize:24}}>↩️</div>
              <small>10 day returnable</small>
            </div>
            <div className="text-center">
              <div style={{fontSize:24}}>💳</div>
              <small>pay on delivery</small>
            </div>
            <div className="text-center">
              <div style={{fontSize:24}}>🚚</div>
              <small>free delivery</small>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <h5>more from this category</h5>
      <div className="d-flex flex-wrap gap-3 mt-3">
        {products
          .filter((p) => p._id !== product._id && p.category === product.category)
          .slice(0,4)
          .map((r) => (
            <div key={r._id} style={{width:200}}>
              <Link to={`/product/${r._id}`} className="text-decoration-none text-dark">
                <div className="card">
                  <img 
                    src={r.image || "https://placehold.co/200x120?text=no+image"} 
                    alt={r.name} 
                    style={{height:120, objectFit:"cover"}} 
                    className="card-img-top" 
                  />
                  <div className="card-body">
                    <div className="fw-bold">{r.name}</div>
                    <div>${r.price?.toFixed(2)}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductDetails;