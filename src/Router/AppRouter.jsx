import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "../components/login/Login";
import Register from "../components/login/Register";
import Home from "../components/pages/Home/Home";
import { checkTokenExpiration, clearExpiredToken } from "../components/Redux/Features/Login";

const ProtectedRoute = ({ children }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && checkTokenExpiration()) {
      dispatch(clearExpiredToken());
      navigate("/login");
    }
  }, [token, dispatch, navigate]);

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRouter = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/admin" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/admin" replace /> : <Register />}
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <Navigate to={token ? "/admin" : "/login"} replace />
        }
      />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AppRouter;
