import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const { cart, wishlist, searchQuery, setSearchQuery, user, setUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear search after submit
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link to="/" className="navbar-brand d-flex align-items-center">
        <img
          src="/my_shop_logo.webp"
          alt="Shop Logo"
          style={{ width: "60px", marginRight: "10px", marginLeft: "10px" }}
        />
      </Link>

      <form className="d-flex w-50 mx-auto" onSubmit={handleSearchSubmit}>
        <input
          className="form-control"
          type="search"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit" className="btn btn-outline-light ms-2">
          Search
        </button>
      </form>

      <div className="d-flex align-items-center">
        <Link to="/wishlist" className="btn btn-outline-light me-3 position-relative">
          ❤️ Wishlist
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.7rem" }}
          >
            {wishlist.length}
          </span>
        </Link>

        <Link to="/cart" className="btn btn-outline-light me-3 position-relative">
          🛒 Cart
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
            style={{ fontSize: "0.7rem" }}
          >
            {cart.length}
          </span>
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="btn btn-outline-info me-2">
              👤 Profile
            </Link>
            <button onClick={handleLogout} className="btn btn-outline-danger">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-outline-info">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;