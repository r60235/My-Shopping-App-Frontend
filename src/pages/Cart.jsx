import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAppContext } from "../context/AppContext.jsx";

const Cart = () => {
  const { cart, products, removeFromCart, toggleWishlist, wishlist, user, API_BASE, setCart } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();
  
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

  const handleAddNewAddress = () => {
    if (!newAddress.trim()) {
      toast.error("Please enter an address");
      return;
    }
    
    const updatedAddresses = [...addresses, newAddress.trim()];
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    setNewAddress("");
    setShowAddAddressModal(false);
    setSelectedAddress(newAddress.trim());
    toast.success("Address added successfully!");
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order!");
      navigate('/login');
      return;
    }
    
    if (addresses.length === 0) {
      setShowAddAddressModal(true);
      return;
    }
    
    if (!selectedAddress) {
      toast.error("Please select a delivery address!");
      setShowAddressModal(true);
      return;
    }

    setPlacingOrder(true);

    try {
      const orderData = {
        userEmail: user.email,
        items: cartItems.map(item => ({
          productId: item.product._id,
          quantity: quantities[item.id] || 1,
          size: item.size || '',
          price: item.product.price,
          name: item.product.name,
          image: item.product.image
        })),
        totalAmount: total,
        deliveryAddress: selectedAddress
      };

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Clear cart after successful order
        setCart([]);
        localStorage.removeItem('cart');
        
        toast.success("Order placed successfully! Thank you for your purchase!", {
          autoClose: 5000,
        });
        
        // Navigate to profile page to see orders
        navigate('/profile');
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
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
                    const itemTotal = item.product.price * (quantities[item.id] || 1);
                    
                    return (
                      <div key={item.id} className="cart-item border-bottom p-3">
                        {/* desktop */}
                        <div className="d-none d-md-flex row align-items-center">
                          <div className="col-md-2">
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
                          
                          <div className="col-md-4">
                            <Link to={`/product/${item.product._id}`} className="text-decoration-none text-dark">
                              <h6 className="fw-bold mb-1" style={{ cursor: 'pointer' }}>{item.product.name}</h6>
                            </Link>
                            <p className="text-muted mb-1 text-capitalize">{item.product.category}</p>
                            {item.size && (
                              <span className="badge bg-light text-dark border">Size: {item.size}</span>
                            )}
                          </div>

                          <div className="col-md-2 text-center">
                            <div className="h6 text-primary mb-0">${item.product.price.toFixed(2)}</div>
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
                            <div className="h6 fw-bold mb-2">${itemTotal.toFixed(2)}</div>
                            <div className="d-flex gap-1 justify-content-center">
                              <button 
                                className={`btn btn-sm ${isInWishlist ? 'btn-primary' : 'btn-outline-primary'}`} 
                                onClick={() => handleMoveToWishlist(item.product._id, item.product.name)}
                                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                              >
                                {isInWishlist ? '♥' : '♥'}
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

                        {/* Mobile View */}
                        <div className="d-md-none">
                          <div className="row">
                            <div className="col-4">
                              <Link to={`/product/${item.product._id}`} className="text-decoration-none">
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name} 
                                  className="img-fluid rounded shadow-sm w-100"
                                  style={{
                                    height: '100px',
                                    objectFit: 'cover',
                                    cursor: 'pointer'
                                  }} 
                                />
                              </Link>
                            </div>
                            <div className="col-8">
                              <Link to={`/product/${item.product._id}`} className="text-decoration-none text-dark">
                                <h6 className="fw-bold mb-1" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>{item.product.name}</h6>
                              </Link>
                              <p className="text-muted mb-1 text-capitalize" style={{ fontSize: '0.8rem' }}>{item.product.category}</p>
                              {item.size && (
                                <span className="badge bg-light text-dark border" style={{ fontSize: '0.7rem' }}>Size: {item.size}</span>
                              )}
                              
                              {/* Price below photo on mobile */}
                              <div className="mt-2">
                                <div className="text-primary fw-bold" style={{ fontSize: '0.9rem' }}>
                                  ${item.product.price.toFixed(2)}
                                </div>
                                <small className="text-muted" style={{ fontSize: '0.7rem' }}>each</small>
                              </div>
                            </div>
                          </div>
                          
                          {/* Quantity controls in middle on mobile */}
                          <div className="row mt-3">
                            <div className="col-12">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <span className="fw-bold me-2" style={{ fontSize: '0.9rem' }}>Quantity:</span>
                                  <div className="d-flex align-items-center border rounded">
                                    <button 
                                      className="btn btn-outline-secondary btn-sm px-3" 
                                      onClick={() => dec(item.id)}
                                      disabled={quantities[item.id] <= 1}
                                      style={{ border: 'none' }}
                                    >
                                      −
                                    </button>
                                    <span className="mx-3 fw-bold" style={{ fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>
                                      {quantities[item.id] || 1}
                                    </span>
                                    <button 
                                      className="btn btn-outline-secondary btn-sm px-3" 
                                      onClick={() => inc(item.id)}
                                      style={{ border: 'none' }}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="text-end">
                                  <div className="fw-bold text-success" style={{ fontSize: '1rem' }}>
                                    ${itemTotal.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action buttons on mobile */}
                          <div className="row mt-2">
                            <div className="col-12">
                              <div className="d-flex gap-2">
                                <button 
                                  className={`btn btn-sm flex-fill ${isInWishlist ? 'btn-primary' : 'btn-outline-primary'}`} 
                                  onClick={() => handleMoveToWishlist(item.product._id, item.product.name)}
                                >
                                  {isInWishlist ? '♥ In Wishlist' : '♥ Wishlist'}
                                </button>
                                <button 
                                  className="btn btn-outline-danger btn-sm flex-fill" 
                                  onClick={() => handleRemoveFromCart(item.id, item.product.name, item.size)}
                                >
                                  Remove
                                </button>
                              </div>
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

                  {!user ? (
                    <div className="alert alert-warning mb-3">
                      <small>Please login to place an order</small>
                      <Link to="/login" className="btn btn-warning w-100 mt-2">
                        Login to Continue
                      </Link>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="alert alert-warning mb-3">
                      <small>No addresses found. Please add an address to continue.</small>
                      <button 
                        className="btn btn-warning w-100 mt-2"
                        onClick={() => setShowAddAddressModal(true)}
                      >
                        Add Address
                      </button>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Select Delivery Address</label>
                      <div className="mb-2">
                        <button 
                          className="btn btn-outline-secondary w-100 text-start"
                          onClick={() => setShowAddressModal(true)}
                        >
                          {selectedAddress ? `Selected: ${selectedAddress.substring(0, 30)}...` : "Choose Address"}
                        </button>
                      </div>
                      {selectedAddress && (
                        <div className="alert alert-info py-2 small">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>Selected:</strong> 
                              <div>{selectedAddress}</div>
                            </div>
                            <button 
                              className="btn btn-outline-secondary btn-sm ms-2"
                              onClick={() => setShowAddressModal(true)}
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    className="btn btn-dark btn-lg w-100 py-3 fw-bold" 
                    onClick={handlePlaceOrder}
                    disabled={!user || addresses.length === 0 || !selectedAddress || placingOrder}
                  >
                    {placingOrder ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Placing Order...
                      </>
                    ) : (
                      <>🚀 Place Order - ${total.toFixed(2)}</>
                    )}
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

      {/* Address Selection Modal */}
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
                      <label className="form-check-label" htmlFor={`address-${index}`}>
                        {address}
                      </label>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-3">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setShowAddressModal(false);
                      setShowAddAddressModal(true);
                    }}
                  >
                    + Add New Address
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
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

      {/* add address */}
      {showAddAddressModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Address</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddAddressModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Enter your complete address</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddAddressModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleAddNewAddress}
                  disabled={!newAddress.trim()}
                >
                  Save Address
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