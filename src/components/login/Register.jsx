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
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <span className="auth-brand-badge">Yeni hesab</span>
          <h1>Admin panelə qoşulun</h1>
          <p>
            Qeydiyyat məlumatları yalnız brauzerinizdə saxlanılır — statik
            demo üçün idealdır.
          </p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Qeydiyyat</h2>
            <p>Yeni admin hesabı yaradın</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="name">Ad</label>
              <input
                id="name"
                type="text"
                placeholder="Adınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-password">Şifrə</label>
              <input
                id="reg-password"
                type="password"
                placeholder="Minimum 6 simvol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className={`auth-submit ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Yaradılır..." : "Qeydiyyatdan keç"}
            </button>

            <p className="auth-footer">
              Artıq hesabınız var? <Link to="/login">Daxil ol</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
