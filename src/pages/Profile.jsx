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
        // Get last 6 orders (most recent first)
        const sortedOrders = (data.orders || []).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders.slice(0, 6));
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
          <div className="card p-3 shadow-sm h-100">
            <h4 className="mb-3 text-center">Recent Orders</h4>
            
            {loading ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted small">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-4">
                <div className="mb-2" style={{fontSize: '2.5rem'}}>📦</div>
                <h6 className="text-muted mb-1">No orders yet</h6>
                <p className="text-muted small">Your recent orders will appear here</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="card mb-3 border">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1 fw-bold">Order #{order._id.slice(-6)}</h6>
                          <small className="text-muted">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="text-end">
                          <span className={`badge ${
                            order.status === 'Placed' ? 'bg-primary' : 
                            order.status === 'Shipped' ? 'bg-warning' : 
                            order.status === 'Delivered' ? 'bg-success' : 'bg-secondary'
                          }`}>
                            {order.status}
                          </span>
                          <div className="fw-bold text-primary mt-1">${order.totalAmount.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="small text-muted mb-2">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} • 
                        Delivery: {order.deliveryAddress.substring(0, 25)}...
                      </div>

                      <div className="order-items">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="d-flex align-items-center mb-1">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="rounded me-2"
                              style={{ 
                                width: '30px', 
                                height: '30px', 
                                objectFit: 'cover'
                              }}
                            />
                            <div className="flex-grow-1">
                              <div className="small text-truncate" style={{maxWidth: '150px'}}>
                                {item.name}
                              </div>
                              <div className="small text-muted">
                                Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="small text-muted text-center mt-1">
                            +{order.items.length - 2} more items
                          </div>
                        )}
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