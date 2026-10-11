import React, { useState, useEffect, useCallback } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
} from "react-icons/fi";
import {
  logoutAdmin,
  checkTokenExpiration,
  clearExpiredToken,
} from "../../Redux/Features/Login";
import { ADMIN_MENU, adminPath, titleFromPathname } from "../../../Router/adminMenu";
import "./AdminPanel.css";

const Home = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    if (checkTokenExpiration()) {
      dispatch(clearExpiredToken());
      alert("Sessiya müddəti bitdi. Yenidən daxil olun.");
      window.location.href = "/login";
    }
  }, [dispatch, token]);

  const handleLogout = useCallback(() => {
    if (window.confirm("Çıxış etmək istədiyinizə əminsiniz?")) {
      dispatch(logoutAdmin());
    }
  }, [dispatch]);

  const closeMobile = () => setMobileOpen(false);

  const sidebarClass = [
    "sidebar",
    sidebarCollapsed ? "collapsed" : "",
    mobileOpen ? "mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const mainContentClass = sidebarCollapsed
    ? "main-content expanded"
    : "main-content";

  const currentPageTitle = titleFromPathname(location.pathname);

  const initials = (user?.name || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="admin-container">
      <aside className={sidebarClass}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-mark">SA</div>
            <div className="sidebar-brand-text">
              <h2 className="logo">SuperAdmin</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="toggle-button"
            title={sidebarCollapsed ? "Genişləndir" : "Yığışdır"}
            aria-label="Sidebar"
          >
            {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <nav className="nav">
          {ADMIN_MENU.map((item) => (
            <NavLink
              key={item.id}
              to={adminPath(item.path)}
              end={item.path === ""}
              onClick={closeMobile}
              className={({ isActive }) =>
                `menu-item${isActive ? " active" : ""}`
              }
              title={item.label}
            >
              <span className="menu-icon">
                <item.Icon />
              </span>
              {!sidebarCollapsed && (
                <span className="menu-label">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" onClick={handleLogout} className="logout-button">
            <span className="menu-icon">
              <FiLogOut />
            </span>
            {!sidebarCollapsed && <span>Çıxış</span>}
          </button>
        </div>
      </aside>

      <div className={mainContentClass}>
        <header className="header">
          <div className="header-start">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menyu"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="page-title">{currentPageTitle}</h1>
          </div>
          <div className="user-info">
            <span className="welcome-text">
              Xoş gəlmisiniz, <strong>{user?.name || "Admin"}</strong>
            </span>
            <div className="user-avatar" title={user?.email}>
              {initials}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="header-logout-button"
            >
              Çıxış
            </button>
          </div>
        </header>

        <div className="content">
          <div key={location.pathname} className="page-transition">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
