import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from 'react-toastify';
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
          const response = await fetch(`http://localhost:5001/product/${id}`);
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

  const isClothing = ["men", "women", "kids"].includes(String(product?.category).toLowerCase());
  
  const cartItemsForProduct = cart.filter(item => item.productId === product?._id);
  const isCurrentSizeInCart = cartItemsForProduct.some(item => item.size === selectedSize);
  const isAnySizeInCart = cartItemsForProduct.length > 0;

  const handleAddToCart = () => {
    if (isClothing && !selectedSize) {
      toast.warning("Please select a size before adding to cart!");
      return;
    }
    
    addToCart(product._id, selectedSize);
    toast.success(`${product.name} ${selectedSize ? `(Size: ${selectedSize})` : ''} added to cart!`);
    setSelectedSize("");
  };

  const handleRemoveFromCart = (size = "") => {
    if (size) {
      const itemToRemove = cartItemsForProduct.find(item => item.size === size);
      if (itemToRemove) {
        removeFromCart(itemToRemove.id);
        toast.info(`${product.name} (Size: ${size}) removed from cart!`);
      }
    } else {
      cartItemsForProduct.forEach(item => {
        removeFromCart(item.id);
      });
      toast.info(`${product.name} removed from cart!`);
    }
  };

  // Function to render star rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-warning">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-warning">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-muted">★</span>);
    }
    
    return stars;
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <p>Product not found</p>
        <Link to="/products/all" className="btn btn-dark">Back to products</Link>
      </div>
    );
  }

  const inWishlist = wishlist.includes(product._id);

  return (
    <div className="container mt-4">
      <Link 
        to={product?.category ? `/products/${product.category}` : '/products/all'}
        className="btn btn-outline-secondary mb-3 text-decoration-none"
      >
        ← Back to {product.category ? `${product.category} products` : 'products'}
      </Link>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <img 
            src={product.image || "https://placehold.co/600x400?text=No+Image"} 
            className="img-fluid rounded w-100" 
            alt={product.name} 
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
        </div>
        
        <div className="col-12 col-md-6">
          <h3 className="h4 h-md-3">{product.name}</h3>
          
          {/* ADDED: Rating Display */}
          <div className="mb-2">
            <div className="d-flex align-items-center">
              <div className="me-2">
                {renderRating(product.rating || 0)}
              </div>
              <span className="text-muted">
                ({product.rating || 0}/5)
                {product.reviewCount && ` • ${product.reviewCount} reviews`}
              </span>
            </div>
          </div>

          <div className="mb-3">
            <strong className="fs-4">${product.price?.toFixed(2)}</strong>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through ms-2">
                ${product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Description</label>
            <p className="text-muted">{product.description || "No description available"}</p>
          </div>

          {isClothing && (
            <div className="mb-3">
              <label className="form-label fw-bold">Size {selectedSize && `- Selected: ${selectedSize}`}</label>
              <div className="d-flex flex-wrap gap-2">
                {["S","M","L","XL","XXL"].map((size) => (
                  <button 
                    key={size} 
                    className={`btn btn-sm ${selectedSize === size ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() => setSelectedSize(size)}
                    style={{ minWidth: "50px" }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            {!isCurrentSizeInCart ? (
              <button 
                className="btn btn-dark me-2 mb-2" 
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            ) : (
              <button 
                className="btn btn-danger me-2 mb-2" 
                onClick={() => handleRemoveFromCart(selectedSize)}
              >
                Remove {selectedSize && `Size ${selectedSize}`} from Cart
              </button>
            )}
            
            <button 
              className={`btn mb-2 ${inWishlist ? 'btn-danger' : 'btn-outline-danger'}`} 
              onClick={() => toggleWishlist(product._id)}
            >
              {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {cartItemsForProduct.length > 0 && (
            <div className="alert alert-info">
              <strong>In your cart:</strong>
              {cartItemsForProduct.map((item, index) => (
                <div key={item.id} className="small">
                  {index + 1}. {product.name} {item.size && `- Size: ${item.size}`}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 d-flex justify-content-around text-center">
            <div>
              <div style={{fontSize: "24px"}}>↩️</div>
              <small className="d-block mt-1">10 Day Return</small>
            </div>
            <div>
              <div style={{fontSize: "24px"}}>💳</div>
              <small className="d-block mt-1">Pay on Delivery</small>
            </div>
            <div>
              <div style={{fontSize: "24px"}}>🚚</div>
              <small className="d-block mt-1">Free Delivery</small>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="mb-4">
        <h5>More from this category</h5>
        <div className="row g-3 mt-3">
          {products
            .filter((p) => p._id !== product._id && p.category === product.category)
            .slice(0, 4)
            .map((r) => (
              <div key={r._id} className="col-6 col-md-4 col-lg-3">
                <Link to={`/product/${r._id}`} className="text-decoration-none text-dark">
                  <div className="card h-100">
                    <img 
                      src={r.image || "https://placehold.co/300x200?text=No+Image"} 
                      alt={r.name} 
                      style={{height: "150px", objectFit: "cover"}} 
                      className="card-img-top" 
                    />
                    <div className="card-body">
                      <div className="fw-bold small text-truncate">{r.name}</div>
                      <div className="text-primary">${r.price?.toFixed(2)}</div>
                      {/* ADDED: Rating in related products */}
                      {r.rating && (
                        <div className="small text-warning">
                          {renderRating(r.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;