import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, setUser, API_BASE } = useAppContext();
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem("addresses")) || []
  );
  const [newAddress, setNewAddress] = useState({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
  const [editingIndex, setEditingIndex] = useState(null);
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
        const sortedOrders = (data.orders || []).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseAddress = (address) => {
    if (address.includes(', ') && address.split(', ').length >= 6) {
      const parts = address.split(', ');
      return {
        name: parts[0] || "",
        phone: parts[1] || "",
        street: parts[2] || "",
        city: parts[3] || "",
        state: parts[4] || "",
        pincode: parts[5] || ""
      };
    } else if (address.includes(', ') && address.split(', ').length === 5) {
      const parts = address.split(', ');
      const statePincode = parts[4].split(' - ');
      return {
        name: parts[0] || "",
        phone: parts[1] || "",
        street: parts[2] || "",
        city: parts[3] || "",
        state: statePincode[0] || "",
        pincode: statePincode[1] || ""
      };
    } else {
      return { 
        name: "", 
        phone: "", 
        street: address, 
        city: "", 
        state: "", 
        pincode: "" 
      };
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.street.trim() || !newAddress.city.trim() || !newAddress.state.trim() || !newAddress.pincode.trim()) {
      toast.error("Please fill all address fields");
      return;
    }
    
    const formattedAddress = `${newAddress.name}, ${newAddress.phone}, ${newAddress.street}, ${newAddress.city}, ${newAddress.state}, ${newAddress.pincode}`;
    const updated = [...addresses, formattedAddress];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    setNewAddress({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
    toast.success("Address added successfully!");
  };

  const handleEditAddress = (index) => {
    const address = addresses[index];
    const parsedAddress = parseAddress(address);
    setNewAddress(parsedAddress);
    setEditingIndex(index);
  };

  const handleUpdateAddress = () => {
    if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.street.trim() || !newAddress.city.trim() || !newAddress.state.trim() || !newAddress.pincode.trim()) {
      toast.error("Please fill all address fields");
      return;
    }
    
    const formattedAddress = `${newAddress.name}, ${newAddress.phone}, ${newAddress.street}, ${newAddress.city}, ${newAddress.state}, ${newAddress.pincode}`;
    const updated = [...addresses];
    updated[editingIndex] = formattedAddress;
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    setNewAddress({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
    setEditingIndex(null);
    toast.success("Address updated successfully!");
  };

  const handleCancelEdit = () => {
    setNewAddress({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
    setEditingIndex(null);
    toast.info("Address editing cancelled");
  };

  const handleDeleteAddress = (indexToDelete) => {
    const updated = addresses.filter((_, index) => index !== indexToDelete);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    toast.success("Address deleted successfully!");
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
                  <div key={idx} className="card mb-3">
                    <div className="card-body p-3">
                      <div className="d-flex flex-column">
                        <div className="mb-2">
                          <span className="small text-break">{addr}</span>
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEditAddress(idx)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteAddress(idx)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No addresses added yet.</p>
            )}

            <div className="mb-3">
              <label className="form-label fw-bold">{editingIndex !== null ? 'Edit Address' : 'Add New Address'}</label>
              <div className="row g-2">
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone Number"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                  />
                </div>
                <div className="col-12">
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Street Address"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pincode"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-2">
                {editingIndex !== null ? (
                  <>
                    <button className="btn btn-primary flex-fill" onClick={handleUpdateAddress}>
                      Update Address
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn btn-dark w-100" onClick={handleAddAddress}>
                    Add Address
                  </button>
                )}
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