import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../Redux/Features/Login";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user ,token} = useSelector((state) => state.auth);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Göndərilən data:", { phone, password });
    dispatch(loginAdmin({ phone, password }));
  };
  // Əgər token localStorage-dan varsa, avtomatik yönləndir
  useEffect(() => {
    if (token) navigate("/loginedpage");
  }, [token, navigate]);

  useEffect(() => {
    if (user) {
      console.log("Admin logged in:", user);
      navigate("/loginedpage"); // login uğurlu olduqda yönləndir
    }
  }, [user, navigate]);

  return (
    <section className="panel card" aria-label="Giriş formu">
      <form className="form form-login" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="login-phone">Telefon nömrəsi</label>
          <input
            id="login-phone"
            type="tel"
            placeholder="+994501234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="login-password">Şifrə</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Yüklənir..." : "Daxil ol"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </section>
  );
};

export default Login;
