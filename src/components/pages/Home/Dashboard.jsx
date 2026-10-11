import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ADMIN_MENU, adminPath } from "../../../Router/adminMenu";
import { fetchUsers } from "../../Redux/Features/AllUserSlice";
import { fetchAllBusinesses } from "../../Redux/Features/Businesses";
import { fetchProducts } from "../../Redux/Features/ProductSlice";
import { fetchAds } from "../../Redux/Features/AdsSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const users = useSelector((state) => state.users.list || []);
  const businesses = useSelector((state) => state.businesses.all || []);
  const products = useSelector((state) => state.products.list || {});
  const ads = useSelector((state) => state.ads.list || []);

  const userNumber = Array.isArray(users)
    ? users.length
    : users.content?.length || 0;
  const businessLength = Array.isArray(businesses)
    ? businesses.length
    : businesses.content?.length || 0;
  const productLength = Array.isArray(products)
    ? products.length
    : products.content?.length || 0;
  const allAdsLength = Array.isArray(ads)
    ? ads.length
    : ads.content?.length || 0;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllBusinesses());
    dispatch(fetchProducts());
    dispatch(fetchAds());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 22) return "Good evening";
    return "Good night";
  };

  const metrics = [
    {
      id: "users",
      label: "Users",
      value: userNumber,
      color: "#6366f1",
      icon: "👥",
      trend: "Active",
    },
    {
      id: "businesses",
      label: "Businesses",
      value: businessLength,
      color: "#10b981",
      icon: "🏢",
      trend: "Static demo",
    },
    {
      id: "products",
      label: "Products",
      value: productLength,
      color: "#f59e0b",
      icon: "📦",
      trend: "Catalog",
    },
    {
      id: "ads",
      label: "Ads",
      value: allAdsLength,
      color: "#ef4444",
      icon: "📢",
      trend: "Campaigns",
    },
  ];

  const quickLinks = ADMIN_MENU.filter((i) => i.id !== "dashboard").slice(0, 8);

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="welcome-info">
            <h1 className="hero-title">
              {getGreeting()}, {user?.name || "Admin"}!
            </h1>
            <p className="hero-subtitle">
              Today&apos;s stats and quick links to modules are below.
            </p>
            <div className="user-details">
              <div className="user-detail-item">
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
          <div className="time-info">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`metric-card ${metric.id}`}
            style={{ "--metric-color": metric.color }}
          >
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-info">
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
              <div
                className="metric-trend"
                style={{
                  background: `color-mix(in srgb, ${metric.color} 18%, transparent)`,
                  color: metric.color,
                }}
              >
                {metric.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-quick">
        <h3>Quick links</h3>
        <div className="quick-links">
          {quickLinks.map((item) => (
            <button
              key={item.id}
              type="button"
              className="quick-link"
              onClick={() => navigate(adminPath(item.path))}
            >
              <span className="quick-link-icon">
                <item.Icon />
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
