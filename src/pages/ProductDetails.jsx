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
  const [showSizeModal, setShowSizeModal] = useState(false);

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
  
  // Check if product is in cart with the currently selected size
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
    setSelectedSize(""); // Reset size after adding to cart
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setShowSizeModal(false);
  };

  const handleSizeSelectAndAdd = (size) => {
    setSelectedSize(size);
    setShowSizeModal(false);
    addToCart(product._id, size);
    toast.success(`${product.name} (Size: ${size}) added to cart!`);
    setSelectedSize(""); // Reset size after adding to cart
  };

  // Remove specific size from cart
  const handleRemoveFromCart = (size = "") => {
    if (size) {
      // Remove specific size
      const itemToRemove = cartItemsForProduct.find(item => item.size === size);
      if (itemToRemove) {
        removeFromCart(itemToRemove.id);
        toast.info(`${product.name} (Size: ${size}) removed from cart!`);
      }
    } else {
      // Remove all sizes
      cartItemsForProduct.forEach(item => {
        removeFromCart(item.id);
      });
      toast.info(`${product.name} removed from cart!`);
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center">loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <p>product not found</p>
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
              <label className="form-label fw-bold">Size {selectedSize && `- Selected: ${selectedSize}`}</label>
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
            {/* Show Add to Cart if no size selected OR if selected size is not in cart */}
            {!isCurrentSizeInCart ? (
              <button 
                className="btn btn-dark me-2" 
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            ) : (
              <button 
                className="btn btn-danger me-2" 
                onClick={() => handleRemoveFromCart(selectedSize)}
              >
                Remove {selectedSize && `Size ${selectedSize}`} from cart
              </button>
            )}
            
            <button 
              className={`btn ${inWishlist ? 'btn-danger' : 'btn-outline-danger'}`} 
              onClick={() => toggleWishlist(product._id)}
            >
              {inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            </button>
          </div>

          {cartItemsForProduct.length > 0 && (
            <div className="alert alert-info">
              <strong>In your cart:</strong>
              {cartItemsForProduct.map((item, index) => (
                <div key={item.id}>
                  {index + 1}. {product.name} {item.size && `- Size: ${item.size}`}
                </div>
              ))}
            </div>
          )}

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

      {showSizeModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Size</h5>
                <button type="button" className="btn-close" onClick={() => setShowSizeModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Please select a size for <strong>{product.name}</strong>:</p>
                <div className="d-flex gap-2 flex-wrap">
                  {["S","M","L","XL","XXL"].map((size) => (
                    <button 
                      key={size}
                      className="btn btn-outline-dark"
                      onClick={() => handleSizeSelectAndAdd(size)}
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

      <hr className="my-4" />

      <h5>More from this category</h5>
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