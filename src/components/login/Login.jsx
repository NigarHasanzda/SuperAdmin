import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../Redux/Features/Login";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginAdmin({ email, password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <span className="auth-brand-badge">SuperAdmin</span>
          <h1>Your admin panel is one step away</h1>
          <p>
            Try every module in static demo mode — no API, fast and simple.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <span className="auth-feature-dot" />
              Dashboard & analytics
            </div>
            <div className="auth-feature">
              <span className="auth-feature-dot" />
              Users & business management
            </div>
            <div className="auth-feature">
              <span className="auth-feature-dot" />
              Ads, notifications & reports
            </div>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>{getGreeting()}</h2>
            <p>
              {isAuthenticated
                ? `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`
                : "Sign in to continue"}
            </p>
          </div>

          {!isAuthenticated && (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@demo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button
                type="submit"
                className={`auth-submit ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <p className="auth-footer">
                Don&apos;t have an account? <Link to="/register">Register</Link>
              </p>
              <p className="auth-hint">Demo: admin@demo.com / admin123</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
