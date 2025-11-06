import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const Profile = () => {
  const { user, setUser, API_BASE } = useAppContext();
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem("addresses")) || []
  );
  const [newAddress, setNewAddress] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE}/orders/${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.trim()) {
      alert("Please enter an address");
      return;
    }
    const updated = [...addresses, newAddress.trim()];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    setNewAddress("");
  };

  const handleDeleteAddress = (indexToDelete) => {
    const updated = addresses.filter((_, index) => index !== indexToDelete);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <h4>Please login to view your profile.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-5">
          <div className="card p-4 shadow-sm mb-4">
            <h4 className="mb-3 text-center">User Profile</h4>

            <div className="text-start mb-3">
              <strong>Email:</strong> {user.email}
            </div>
            <div className="text-start mb-3">
              <strong>Name:</strong> John Doe
            </div>
            <div className="text-start mb-3">
              <strong>Phone:</strong> +91 9876543210
            </div>

            <h5 className="mt-4 mb-3">Addresses</h5>
            {addresses.length > 0 ? (
              <div className="mb-3">
                {addresses.map((addr, idx) => (
                  <div key={idx} className="card mb-2">
                    <div className="card-body py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small">{addr}</span>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteAddress(idx)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No addresses added yet.</p>
            )}

            <div className="mb-3">
              <label className="form-label fw-bold">Add New Address</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your complete address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAddress()}
                />
                <button className="btn btn-dark" onClick={handleAddAddress}>
                  Add Address
                </button>
              </div>
            </div>

            <button className="btn btn-danger w-100 mt-2" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card p-4 shadow-sm h-100">
            <h4 className="mb-3 text-center">Your Orders</h4>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3" style={{fontSize: '4rem'}}>📦</div>
                <h5 className="text-muted mb-2">No orders yet</h5>
                <p className="text-muted">Your orders will appear here after you make a purchase.</p>
              </div>
            ) : (
              <div className="orders-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {orders.map((order) => (
                  <div key={order._id} className="card mb-4 border-0 shadow-sm">
                    <div className="card-header bg-light py-3">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary rounded p-2 me-3">
                              <span className="text-white fw-bold">ORDER</span>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-bold">#{order._id.slice(-8).toUpperCase()}</h6>
                              <small className="text-muted">
                                {new Date(order.orderDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 text-md-end mt-2 mt-md-0">
                          <span className={`badge fs-6 ${
                            order.status === 'Placed' ? 'bg-primary' : 
                            order.status === 'Shipped' ? 'bg-warning' : 
                            order.status === 'Delivered' ? 'bg-success' : 'bg-secondary'
                          }`}>
                            {order.status}
                          </span>
                          <div className="mt-1">
                            <strong className="text-primary fs-5">${order.totalAmount.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <h6 className="fw-bold mb-2">📦 Delivery Information</h6>
                          <p className="mb-1 small text-muted">{order.deliveryAddress}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <h6 className="fw-bold mb-2">📊 Order Summary</h6>
                          <div className="d-flex justify-content-between small">
                            <span>Items:</span>
                            <span>{order.items.length}</span>
                          </div>
                          <div className="d-flex justify-content-between small">
                            <span>Total Amount:</span>
                            <span className="fw-bold">${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <h6 className="fw-bold mb-3">🛍️ Order Items</h6>
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="d-flex align-items-center border-bottom pb-3 mb-3">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="rounded me-3 flex-shrink-0"
                              style={{ 
                                width: '60px', 
                                height: '60px', 
                                objectFit: 'cover',
                                border: '1px solid #dee2e6'
                              }}
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold small mb-1">{item.name}</div>
                              <div className="d-flex flex-wrap gap-3 small text-muted">
                                <span>Qty: {item.quantity}</span>
                                {item.size && <span>Size: {item.size}</span>}
                                <span>Price: ${item.price.toFixed(2)}</span>
                                <span className="fw-bold text-dark">
                                  Total: ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;