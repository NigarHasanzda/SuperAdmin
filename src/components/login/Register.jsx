import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerAdmin,
  clearRegisterStatus,
} from "../Redux/Features/Login";
import "./Login.css";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, registerSuccess } = useSelector(
    (state) => state.auth
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(registerAdmin({ email, password, name }));
  };

  React.useEffect(() => {
    if (registerSuccess) {
      dispatch(clearRegisterStatus());
      navigate("/login", { replace: true });
    }
  }, [registerSuccess, dispatch, navigate]);

  return (
    <div className="body">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="neu-icon">
              <div className="icon-inner">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
            </div>
            <h2>Admin Qeydiyyatı</h2>
            <p>Statik demo üçün yeni hesab yaradın</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-group neu-input">
                <input
                  type="text"
                  placeholder=" Ad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group neu-input">
                <input
                  type="email"
                  placeholder=" Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group neu-input password-group">
                <input
                  type="password"
                  placeholder=" Şifrə"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && <p className="error-message show">{error}</p>}

            <button
              type="submit"
              className={`neu-button login-btn ${loading ? "loading" : ""}`}
            >
              Qeydiyyatdan keç
            </button>

            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              Artıq hesabınız var?{" "}
              <Link to="/login" style={{ color: "#6366f1" }}>
                Daxil ol
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
