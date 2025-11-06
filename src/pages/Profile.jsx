import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const Profile = () => {
  const { user, setUser } = useAppContext();
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem("addresses")) || []
  );
  const [newAddress, setNewAddress] = useState("");

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
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card p-4 shadow-sm">
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
  );
};

export default Profile;