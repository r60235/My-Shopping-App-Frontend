import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAppContext } from "../context/AppContext.jsx";

export default function Cart() {
  const { cart, products, removeFromCart, toggleWishlist } = useAppContext();
  
  // Get product details for each cart item and group by productId and size
  const cartItems = cart.map(cartItem => {
    const product = products.find(p => p && p._id === cartItem.productId);
    return {
      ...cartItem,
      product: product
    };
  }).filter(item => item.product); // Remove items where product not found

  // quantity mapping local state - now based on cart item ID
  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const inc = (cartItemId) => {
    setQuantities((q) => ({ ...q, [cartItemId]: (q[cartItemId] || 1) + 1 }));
    toast.info("Quantity increased!");
  };

  const dec = (cartItemId) => {
    if (quantities[cartItemId] > 1) {
      setQuantities((q) => ({ ...q, [cartItemId]: q[cartItemId] - 1 }));
      toast.info("Quantity decreased!");
    }
  };

  const handleRemoveFromCart = (cartItemId, productName, size) => {
    removeFromCart(cartItemId);
    toast.error(`${productName} ${size ? `(Size: ${size})` : ''} removed from cart!`);
  };

  const handleMoveToWishlist = (productId, productName) => {
    toggleWishlist(productId);
    toast.success(`${productName} moved to wishlist!`);
  };

  // order totals
  const subtotal = cartItems.reduce((s, item) => s + item.product.price * (quantities[item.id] || 1), 0);
  const discount = subtotal > 200 ? 20 : 0; // $20 discount for orders over $200
  const deliveryCharges = subtotal > 100 ? 0 : 10;
  const total = subtotal - discount + deliveryCharges;

  const handlePlaceOrder = () => {
    toast.success("Order placed successfully! Thank you for your purchase!", {
      autoClose: 5000,
    });
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">🛒 Your Shopping Cart</h2>
        <span className="badge bg-primary fs-6">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
      </div>
      
      <div className="row g-4">
        {cartItems.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="empty-cart-icon mb-4" style={{fontSize: '4rem'}}>🛒</div>
            <h4 className="text-muted mb-3">Your cart is empty</h4>
            <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products/all" className="btn btn-primary btn-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="col-lg-8">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0">Cart Items</h5>
                </div>
                <div className="card-body p-0">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item border-bottom p-4">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <Link to={`/product/${item.product._id}`} className="text-decoration-none">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="img-fluid rounded shadow-sm"
                              style={{
                                width: '100%',
                                height: 100,
                                objectFit: 'cover',
                                cursor: 'pointer'
                              }} 
                            />
                          </Link>
                        </div>
                        
                        <div className="col-md-4">
                          <Link to={`/product/${item.product._id}`} className="text-decoration-none text-dark">
                            <h6 className="fw-bold mb-1" style={{ cursor: 'pointer' }}>{item.product.name}</h6>
                          </Link>
                          <p className="text-muted small mb-1 text-capitalize">{item.product.category}</p>
                          {item.size && (
                            <span className="badge bg-light text-dark border">Size: {item.size}</span>
                          )}
                        </div>

                        <div className="col-md-2 text-center">
                          <div className="h5 text-primary mb-0">${item.product.price.toFixed(2)}</div>
                          <small className="text-muted">each</small>
                        </div>

                        <div className="col-md-2">
                          <div className="d-flex align-items-center justify-content-center">
                            <button 
                              className="btn btn-outline-secondary btn-sm" 
                              onClick={() => dec(item.id)}
                              disabled={quantities[item.id] <= 1}
                            >
                              −
                            </button>
                            <span className="mx-3 fw-bold">{quantities[item.id] || 1}</span>
                            <button 
                              className="btn btn-outline-secondary btn-sm" 
                              onClick={() => inc(item.id)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="col-md-2 text-center">
                          <div className="h6 fw-bold mb-2">
                            ${((item.product.price * (quantities[item.id] || 1)).toFixed(2))}
                          </div>
                          <div className="d-flex gap-1 justify-content-center">
                            <button 
                              className="btn btn-outline-primary btn-sm" 
                              onClick={() => handleMoveToWishlist(item.product._id, item.product.name)}
                              title="Move to Wishlist"
                            >
                              ♥
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm" 
                              onClick={() => handleRemoveFromCart(item.id, item.product.name, item.size)}
                              title="Remove Item"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 sticky-top" style={{top: '20px'}}>
                <div className="card-header bg-dark text-white py-3">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                    <span className="fw-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="d-flex justify-content-between align-items-center mb-3 text-success">
                      <span>Discount</span>
                      <span className="fw-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span>Delivery Charges</span>
                    <span className={deliveryCharges === 0 ? 'text-success fw-bold' : ''}>
                      {deliveryCharges === 0 ? 'FREE' : `$${deliveryCharges.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fs-5 fw-bold">Total Amount</span>
                    <span className="fs-4 fw-bold text-primary">${total.toFixed(2)}</span>
                  </div>


                  <button 
                    className="btn btn-dark btn-lg w-100 py-3 fw-bold" 
                    onClick={handlePlaceOrder}
                  >
                    🚀 Place Order - ${total.toFixed(2)}
                  </button>
                  
                  <Link to="/products/all" className="btn btn-outline-primary w-100 mt-2">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}