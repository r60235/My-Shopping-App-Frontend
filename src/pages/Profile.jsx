import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const Profile = () => {
  const { user, setUser } = useAppContext();
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem("addresses")) || []
  );
  const [newAddress, setNewAddress] = useState("");

  const handleAddAddress = () => {
    if (!newAddress) return;
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    setNewAddress("");
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

        <h5 className="mt-4">Addresses</h5>
        {addresses.length > 0 ? (
          <ul className="list-group mb-3">
            {addresses.map((addr, idx) => (
              <li key={idx} className="list-group-item">
                {addr}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No addresses added yet.</p>
        )}

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Add new address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <button className="btn btn-dark" onClick={handleAddAddress}>
            Add
          </button>
        </div>

        <button className="btn btn-danger w-100 mt-2" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
