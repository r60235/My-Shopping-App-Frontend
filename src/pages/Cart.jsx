import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAppContext } from "../context/AppContext.jsx";

const Cart = () => {
  const { cart, products, removeFromCart, toggleWishlist, wishlist, user } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
  
  const cartItems = cart.map(cartItem => {
    const product = products.find(p => p && p._id === cartItem.productId);
    return {
      ...cartItem,
      product: product
    };
  }).filter(item => item.product);

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
    const isInWishlist = wishlist.includes(productId);
    if (isInWishlist) {
      toast.success(`${productName} added to wishlist!`);
    } else {
      toast.info(`${productName} removed from wishlist!`);
    }
  };

  const handlePlaceOrder = () => {
    if (!user) {
      toast.error("Please login to place an order!");
      return;
    }
    
    if (addresses.length === 0) {
      toast.error("Please add an address to your profile first!");
      return;
    }
    
    if (!selectedAddress) {
      toast.error("Please select a delivery address!");
      return;
    }
    
    toast.success("Order placed successfully! Thank you for your purchase!", {
      autoClose: 5000,
    });
  };

  const subtotal = cartItems.reduce((s, item) => s + item.product.price * (quantities[item.id] || 1), 0);
  const discount = subtotal > 200 ? 20 : 0;
  const deliveryCharges = subtotal > 100 ? 0 : 10;
  const total = subtotal - discount + deliveryCharges;

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
                  {cartItems.map((item) => {
                    const isInWishlist = wishlist.includes(item.product._id);
                    return (
                      <div key={item.id} className="cart-item border-bottom p-3">
                        <div className="row align-items-center">
                          <div className="col-4 col-md-2 mb-2 mb-md-0">
                            <Link to={`/product/${item.product._id}`} className="text-decoration-none">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="img-fluid rounded shadow-sm"
                                style={{
                                  width: '100%',
                                  height: '80px',
                                  objectFit: 'cover',
                                  cursor: 'pointer'
                                }} 
                              />
                            </Link>
                          </div>
                          
                          <div className="col-8 col-md-4">
                            <Link to={`/product/${item.product._id}`} className="text-decoration-none text-dark">
                              <h6 className="fw-bold mb-1" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>{item.product.name}</h6>
                            </Link>
                            <p className="text-muted mb-1 text-capitalize" style={{ fontSize: '0.8rem' }}>{item.product.category}</p>
                            {item.size && (
                              <span className="badge bg-light text-dark border" style={{ fontSize: '0.7rem' }}>Size: {item.size}</span>
                            )}
                          </div>

                          <div className="col-6 col-md-2 text-center">
                            <div className="text-primary mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>${item.product.price.toFixed(2)}</div>
                          </div>

                          <div className="col-6 col-md-2">
                            <div className="d-flex align-items-center justify-content-center">
                              <button 
                                className="btn btn-outline-secondary btn-sm px-2" 
                                onClick={() => dec(item.id)}
                                disabled={quantities[item.id] <= 1}
                                style={{ minWidth: '30px' }}
                              >
                                −
                              </button>
                              <span className="mx-2 fw-bold" style={{ fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>{quantities[item.id] || 1}</span>
                              <button 
                                className="btn btn-outline-secondary btn-sm px-2" 
                                onClick={() => inc(item.id)}
                                style={{ minWidth: '30px' }}
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="col-12 col-md-2 text-center mt-2 mt-md-0">
                            <div className="fw-bold mb-2" style={{ fontSize: '0.9rem' }}>
                              ${((item.product.price * (quantities[item.id] || 1)).toFixed(2))}
                            </div>
                            <div className="d-flex gap-1 justify-content-center">
                              <button 
                                className={`btn btn-sm ${isInWishlist ? 'btn-primary' : 'btn-outline-primary'}`} 
                                onClick={() => handleMoveToWishlist(item.product._id, item.product.name)}
                                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                                style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                              >
                                {isInWishlist ? '♥' : '♥'}
                              </button>
                              <button 
                                className="btn btn-outline-danger btn-sm" 
                                onClick={() => handleRemoveFromCart(item.id, item.product.name, item.size)}
                                title="Remove Item"
                                style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white py-3">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span style={{ fontSize: '0.9rem' }}>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                    <span className="fw-bold" style={{ fontSize: '0.9rem' }}>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="d-flex justify-content-between align-items-center mb-3 text-success">
                      <span style={{ fontSize: '0.9rem' }}>Discount</span>
                      <span className="fw-bold" style={{ fontSize: '0.9rem' }}>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span style={{ fontSize: '0.9rem' }}>Delivery Charges</span>
                    <span className={deliveryCharges === 0 ? 'text-success fw-bold' : ''} style={{ fontSize: '0.9rem' }}>
                      {deliveryCharges === 0 ? 'FREE' : `$${deliveryCharges.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-bold" style={{ fontSize: '1.1rem' }}>Total Amount</span>
                    <span className="fw-bold text-primary" style={{ fontSize: '1.2rem' }}>${total.toFixed(2)}</span>
                  </div>

                  {!user ? (
                    <div className="alert alert-warning mb-3 py-2">
                      <small className="d-block mb-2">Please login to place an order</small>
                      <Link to="/login" className="btn btn-warning btn-sm w-100">
                        Login to Continue
                      </Link>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="alert alert-warning mb-3 py-2">
                      <small className="d-block mb-2">No addresses found. Please add an address first.</small>
                      <Link to="/profile" className="btn btn-warning btn-sm w-100">
                        Add Address in Profile
                      </Link>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <label className="form-label fw-bold mb-2" style={{ fontSize: '0.9rem' }}>Select Delivery Address</label>
                      <div className="mb-2">
                        <button 
                          className="btn btn-outline-secondary btn-sm w-100 text-start py-2"
                          onClick={() => setShowAddressModal(true)}
                          style={{ fontSize: '0.8rem' }}
                        >
                          {selectedAddress ? `Selected: ${selectedAddress.substring(0, 30)}...` : "Choose Address"}
                        </button>
                      </div>
                      {selectedAddress && (
                        <div className="alert alert-info py-2 small">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>Selected:</strong> 
                              <div style={{ fontSize: '0.8rem' }}>{selectedAddress}</div>
                            </div>
                            <button 
                              className="btn btn-outline-secondary btn-sm ms-2"
                              onClick={() => setShowAddressModal(true)}
                              style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    className="btn btn-dark w-100 py-2 fw-bold mb-2" 
                    onClick={handlePlaceOrder}
                    disabled={!user || addresses.length === 0 || !selectedAddress}
                    style={{ fontSize: '0.9rem' }}
                  >
                    🚀 Place Order - ${total.toFixed(2)}
                  </button>
                  
                  <Link to="/products/all" className="btn btn-outline-primary w-100 py-2" style={{ fontSize: '0.9rem' }}>
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showAddressModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Delivery Address</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddressModal(false)}></button>
              </div>
              <div className="modal-body">
                {addresses.map((address, index) => (
                  <div key={index} className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="address"
                        id={`address-${index}`}
                        checked={selectedAddress === address}
                        onChange={() => setSelectedAddress(address)}
                      />
                      <label className="form-check-label" htmlFor={`address-${index}`} style={{ fontSize: '0.9rem' }}>
                        {address}
                      </label>
                    </div>
                  </div>
                ))}
                {addresses.length === 0 && (
                  <div className="text-center py-3">
                    <p className="text-muted">No addresses found</p>
                    <Link to="/profile" className="btn btn-primary">
                      Add Address in Profile
                    </Link>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm" 
                  onClick={() => setShowAddressModal(false)}
                  disabled={!selectedAddress}
                >
                  Confirm Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;