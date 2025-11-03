import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";

const Login = () => {
  const { user, setUser } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const userObj = { email };
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  };

  if (user) {
    return (
      <div className="container mt-5" style={{ maxWidth: "500px" }}>
        <div className="card p-4 shadow-sm">
          <h4 className="text-center mb-3">Welcome, {user.email}</h4>
          <p className="text-center">You are now logged in.</p>
          <a href="/profile" className="btn btn-dark w-100">
            Go to Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "420px" }}>
      <div className="card p-4 shadow-sm">
        <h4 className="mb-3 text-center">Login</h4>
        <form onSubmit={handleLogin}>
          <div className="mb-3 text-start">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>
          <button type="submit" className="btn btn-dark w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
