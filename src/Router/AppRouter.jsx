import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "../components/login/Login";
import Register from "../components/login/Register";
import Home from "../components/pages/Home/Home";
import Dashboard from "../components/pages/Home/Dashboard";
import Ads from "../components/pages/Home/Ads";
import Category from "../components/pages/Home/Category";
import Role from "../components/pages/Home/Role";
import Persons from "../components/pages/Home/Persons";
import Businesses from "../components/pages/Home/Businesses";
import { Product } from "../components/pages/Home/Product";
import { Notification } from "../components/pages/Home/Notification";
import Profiles from "../components/pages/Home/Profiles";
import Report from "../components/pages/Home/Report";
import Log from "../components/pages/Home/Log";
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
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="ads" element={<Ads />} />
        <Route path="category" element={<Category />} />
        <Route path="roles" element={<Role />} />
        <Route path="persons" element={<Persons />} />
        <Route path="businesses" element={<Businesses />} />
        <Route path="products" element={<Product />} />
        <Route path="notifications" element={<Notification />} />
        <Route path="profiles" element={<Profiles />} />
        <Route path="reports" element={<Report />} />
        <Route path="logs" element={<Log />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      <Route
        path="/"
        element={<Navigate to={token ? "/admin" : "/login"} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={token ? "/admin" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRouter;
