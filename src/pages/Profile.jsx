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
        <div className="col-md-6">
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
                        <span>{addr}</span>
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

        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3 text-center">Your Orders</h4>
            
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-4">
                <div className="mb-3" style={{fontSize: '3rem'}}>📦</div>
                <h5 className="text-muted">No orders yet</h5>
                <p className="text-muted">Your orders will appear here after you make a purchase.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="card mb-3">
                    <div className="card-header bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>Order #{order._id.slice(-6)}</strong>
                        <span className={`badge ${
                          order.status === 'Placed' ? 'bg-primary' : 
                          order.status === 'Shipped' ? 'bg-warning' : 
                          order.status === 'Delivered' ? 'bg-success' : 'bg-secondary'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <small className="text-muted">
                        {new Date(order.orderDate).toLocaleDateString()} • ${order.totalAmount.toFixed(2)}
                      </small>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <strong>Delivery Address:</strong>
                        <p className="mb-1 small">{order.deliveryAddress}</p>
                      </div>
                      <div>
                        <strong>Items:</strong>
                        {order.items.map((item, index) => (
                          <div key={index} className="d-flex align-items-center mt-2">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="rounded me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                              <div className="small">{item.name}</div>
                              <div className="small text-muted">
                                Qty: {item.quantity} 
                                {item.size && ` • Size: ${item.size}`}
                                • ${item.price.toFixed(2)} each
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