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
      setSearchQuery("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-2 px-md-3">
      <Link to="/" className="navbar-brand d-flex align-items-center me-auto">
        <img
          src="/my_shop_logo.webp"
          alt="Shop Logo"
          style={{ width: "50px", height: "50px", objectFit: "contain" }}
          className="me-2"
        />
        <span className="d-none d-sm-block">ClothStore</span>
      </Link>

      <form className="d-flex order-1 order-md-0 mx-2 mx-md-3 flex-grow-1 flex-md-grow-0" onSubmit={handleSearchSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ minWidth: "150px" }}
        />
        <button type="submit" className="btn btn-outline-light d-none d-md-block">
          Search
        </button>
      </form>

      <div className="d-flex align-items-center order-0 order-md-1">
        <Link to="/wishlist" className="btn btn-outline-light btn-sm me-2 position-relative text-decoration-none">
          ❤️
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
            {wishlist.length}
          </span>
        </Link>

        <Link to="/cart" className="btn btn-outline-light btn-sm me-2 position-relative text-decoration-none">
          🛒
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: "0.6rem" }}>
            {cart.length}
          </span>
        </Link>

        {user ? (
          <div className="dropdown">
            <button className="btn btn-outline-info btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
              👤
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button onClick={handleLogout} className="dropdown-item text-danger">Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-outline-info btn-sm text-decoration-none">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;