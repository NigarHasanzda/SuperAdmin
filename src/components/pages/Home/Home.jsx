import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin, checkTokenExpiration, clearExpiredToken } from "../../Redux/Features/Login";
import "./AdminPanel.css";

// Import all page components
import Ads from "./Ads";
import Category from "./Category";
import Role from "./Role";
import Persons from "./Persons";
import Businesses from "./Businesses";
import { Product } from "./Product";
import { Notification } from "./Notification";
import Profiles from "./Profiles";
import Report from "./Report";
import WheelService from "./WheelService";
import Log from "./Log";

const Home = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Token vaxının yoxlanması
  useEffect(() => {
    const checkToken = () => {
      if (token && checkTokenExpiration()) {
        dispatch(clearExpiredToken());
        alert("Sessiya müddəti bitdi. Yenidən daxil olun.");
      }
    };

    // İlk yoxlama
    checkToken();

    // Hər 5 dəqiqədə bir yoxlama
    const interval = setInterval(checkToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, dispatch]);

  const handleLogout = () => {
    if (window.confirm("Çıxış etmək istədiyinizə əminsiniz?")) {
      dispatch(logoutAdmin());
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'ads', label: 'Reklamlar', icon: '📢' },
    { id: 'category', label: 'Kateqoriyalar', icon: '📋' },
    { id: 'roles', label: 'Rollar', icon: '👥' },
    { id: 'persons', label: 'Şəxslər', icon: '👤' },
    { id: 'businesses', label: 'Bizneslər', icon: '🏢' },
    { id: 'products', label: 'Məhsullar', icon: '📦' },
    { id: 'notification', label: 'Bildirişlər', icon: '🔔' },
    { id: 'profiles', label: 'Profillər', icon: '👤' },
    { id: 'report', label: 'Hesabatlar', icon: '📈' },
    { id: 'wheel', label: 'Çarx Xidməti', icon: '⚙️' },
    { id: 'logs', label: 'Loglar', icon: '📝' }
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'ads': return <Ads />;
      case 'category': return <Category />;
      case 'roles': return <Role />;
      case 'persons': return <Persons />;
      case 'businesses': return <Businesses />;
      case 'products': return <Product />;
      case 'notification': return <Notification />;
      case 'profiles': return <Profiles />;
      case 'report': return <Report />;
      case 'wheel': return <WheelService />;
      case 'logs': return <Log />;
      default: return <DashboardHome setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar" style={{ width: sidebarCollapsed ? '70px' : '250px' }}>
        <div className="sidebar-header">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="toggle-button"
          >
            {sidebarCollapsed ? '☰' : '✕'}
          </button>
          {!sidebarCollapsed && (
            <h2 className="logo">Admin Panel</h2>
          )}
        </div>
        
        <nav className="nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`menu-item ${activePage === item.id ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <span className="menu-icon">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="menu-label">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <span className="menu-icon">🚪</span>
            {!sidebarCollapsed && <span>Çıxış</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: sidebarCollapsed ? '70px' : '250px' }}>
        {/* Header */}
        <div className="header">
          <h1 className="page-title">
            {menuItems.find(item => item.id === activePage)?.label || 'Dashboard'}
          </h1>
          <div className="user-info">
            <span>Xoş gəlmisiniz, {user?.name || 'Admin'}</span>
            <button onClick={handleLogout} className="header-logout-button">
              Çıxış
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ setActivePage }) => {
  const { user } = useSelector((state) => state.auth);
  
  // Static default values to prevent unnecessary re-renders
  const emptyList = [];
  const emptyBusinesses = { all: [], approved: [], pending: [] };
  
  // Real data from Redux store with stable defaults
  const { list: allUsers = emptyList } = useSelector((state) => state.allUsers || { list: emptyList });
  const { all: businesses = emptyList, approved: approvedBusinesses = emptyList, pending: pendingBusinesses = emptyList } = useSelector((state) => state.businesses || emptyBusinesses);
  const { list: products = emptyList } = useSelector((state) => state.products || { list: emptyList });
  const { list: ads = emptyList } = useSelector((state) => state.ads || { list: emptyList });
  const { list: categories = emptyList } = useSelector((state) => state.categories || { list: emptyList });
  const { list: notifications = emptyList } = useSelector((state) => state.notifications || { list: emptyList });
  const { list: reports = emptyList } = useSelector((state) => state.reports || { list: emptyList });
  const { list: profiles = emptyList } = useSelector((state) => state.profiles || { list: emptyList });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loginTime] = useState(new Date()); // Admin panelə daxil olma vaxtı
  
  // Real statistics from Redux data
  const statsData = {
    totalUsers: Array.isArray(allUsers) ? allUsers.length : (allUsers?.content?.length || 0),
    activeBusinesses: Array.isArray(approvedBusinesses) ? approvedBusinesses.length : 0,
    totalProducts: Array.isArray(products) ? products.length : (products?.content?.length || 0),
    pendingApprovals: Array.isArray(pendingBusinesses) ? pendingBusinesses.length : 0,
    totalAds: Array.isArray(ads) ? ads.length : (ads?.content?.length || 0),
    totalCategories: Array.isArray(categories) ? categories.length : (categories?.content?.length || 0),
    notifications: Array.isArray(notifications) ? notifications.filter(n => n && n.title).length : 0,
    reports: Array.isArray(reports) ? reports.length : (reports?.content?.length || 0),
    profiles: Array.isArray(profiles) ? profiles.length : (profiles?.content?.length || 0)
  };

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('az-AZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('az-AZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = loginTime.getHours(); // Login vaxtına görə
    if (hour >= 5 && hour < 12) return "Sabahınız xeyir";
    if (hour >= 12 && hour < 17) return "Günortanız xeyir";
    if (hour >= 17 && hour < 22) return "Axşamınız xeyir";
    return "Gecəniz xeyir";
  };

  const getWelcomeMessage = () => {
    const hour = loginTime.getHours();
    const minute = loginTime.getMinutes();
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    if (hour >= 5 && hour < 9) {
      return `Admin panelinizə ${timeStr}-da daxil oldunuz. Səhər işlərinizə uğurlar diləyirik!`;
    } else if (hour >= 9 && hour < 12) {
      return `Admin panelinizə ${timeStr}-da daxil oldunuz. Səhər saatlarında sisteminizdə hər şey qaydasındadır.`;
    } else if (hour >= 12 && hour < 14) {
      return `Admin panelinizə ${timeStr}-da daxil oldunuz. Günorta fasiləsindən sonra da aktiv iş gününüz davam edir!`;
    } else if (hour >= 14 && hour < 17) {
      return `Admin panelinizə ${timeStr}-da daxil oldunuz. Günün ikinci yarısında da uğurlu idarəetmə!`;
    } else if (hour >= 17 && hour < 20) {
      return `Admin panelinizə ${timeStr}-da daxil oldunuz. Axşam saatlarında da sisteminizdə hər şey nəzarətdədir.`;
    } else if (hour >= 20 && hour < 23) {
      return `Admin panelinizə ${timeStr}-da daxil oldunuz. Gecə saatlarında da siz sistemin başındasınız!`;
    } else {
      return `Admin panelinizə ${timeStr}-da daxil oldunuz. Gecə geç saatlarda da aktivsiniz, əla!`;
    }
  };

  const quickActions = [
    { id: 'users', label: 'İstifadəçilər', icon: '👥', color: '#3b82f6', action: 'persons' },
    { id: 'business', label: 'Bizneslər', icon: '🏢', color: '#10b981', action: 'businesses' },
    { id: 'products', label: 'Məhsullar', icon: '📦', color: '#f59e0b', action: 'products' },
    { id: 'reports', label: 'Hesabatlar', icon: '📊', color: '#ef4444', action: 'report' },
    { id: 'notifications', label: 'Bildirişlər', icon: '🔔', color: '#8b5cf6', action: 'notification' },
    { id: 'settings', label: 'Tənzimləmələr', icon: '⚙️', color: '#06b6d4', action: 'roles' }
  ];

  const recentActivities = [
    { id: 1, user: 'Nigar Həsənzadə', action: 'Yeni biznes əlavə etdi', time: '5 dəqiqə əvvəl', icon: '🏢', color: '#10b981' },
    { id: 2, user: 'System', action: 'Avtomatik backup tamamlandı', time: '15 dəqiqə əvvəl', icon: '💾', color: '#3b82f6' },
    { id: 3, user: 'Admin', action: 'İstifadəçi rolunu yenilədi', time: '1 saat əvvəl', icon: '👥', color: '#f59e0b' },
    { id: 4, user: 'Mehmet Ali', action: 'Məhsul kataloqunu yenilədi', time: '2 saat əvvəl', icon: '📦', color: '#ef4444' },
    { id: 5, user: 'System', action: 'Sistem yenilənməsi', time: '3 saat əvvəl', icon: '🔧', color: '#8b5cf6' }
  ];

  const systemStatus = [
    { label: 'Server Status', value: 'Online', color: '#10b981', icon: '🟢' },
    { label: 'Database', value: 'Healthy', color: '#10b981', icon: '🗄️' },
    { label: 'API Response', value: '245ms', color: '#f59e0b', icon: '⚡' },
    { label: 'Uptime', value: '99.8%', color: '#10b981', icon: '⏱️' }
  ];
  
  return (
    <div className="dashboard-container">
      {/* Welcome Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="welcome-info">
            <h1 className="hero-title">
              {getGreeting()}, {user?.name || 'Admin'}! 👋
            </h1>
            <p className="hero-subtitle">
              {getWelcomeMessage()}
            </p>
            <div className="user-details">
              <div className="user-detail-item">
                <span className="detail-icon">👤</span>
                <span>{user?.name} {user?.surname}</span>
              </div>
              <div className="user-detail-item">
                <span className="detail-icon">📧</span>
                <span>{user?.email}</span>
              </div>
              <div className="user-detail-item">
                <span className="detail-icon">📞</span>
                <span>{user?.phone}</span>
              </div>
            </div>
          </div>
          <div className="time-info">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card users">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <div className="metric-value">{statsData.totalUsers.toLocaleString()}</div>
            <div className="metric-label">Ümumi İstifadəçi</div>
            <div className="metric-trend">{statsData.totalUsers > 0 ? 'Aktiv sistem' : 'Məlumat yüklənir'}</div>
          </div>
        </div>
        
        <div className="metric-card businesses">
          <div className="metric-icon">🏢</div>
          <div className="metric-info">
            <div className="metric-value">{statsData.activeBusinesses}</div>
            <div className="metric-label">Təsdiqlənmiş Biznes</div>
            <div className="metric-trend">{statsData.pendingApprovals > 0 ? `${statsData.pendingApprovals} gözləmədə` : 'Hamısı təsdiqlənib'}</div>
          </div>
        </div>
        
        <div className="metric-card products">
          <div className="metric-icon">📦</div>
          <div className="metric-info">
            <div className="metric-value">{statsData.totalProducts.toLocaleString()}</div>
            <div className="metric-label">Məhsul Sayı</div>
            <div className="metric-trend">{statsData.totalCategories > 0 ? `${statsData.totalCategories} kateqoriya` : 'Məlumat yoxdur'}</div>
          </div>
        </div>
        
        <div className="metric-card revenue">
          <div className="metric-icon">📢</div>
          <div className="metric-info">
            <div className="metric-value">{statsData.totalAds.toLocaleString()}</div>
            <div className="metric-label">Reklam Sayı</div>
            <div className="metric-trend">{statsData.notifications > 0 ? `${statsData.notifications} bildiriş` : 'Bildiriş yoxdur'}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">🚀 Tez Əməliyyatlar</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <div key={action.id} className="quick-action-card" style={{ '--action-color': action.color }}>
              <div className="action-icon">{action.icon}</div>
              <div className="action-label">{action.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-bottom">
        {/* Recent Activities */}
        <div className="recent-activities">
          <h2 className="section-title">� Son Aktivliklər</h2>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: activity.color }}>
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <div className="activity-user">{activity.user}</div>
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="system-status">
          <h2 className="section-title">⚙️ Sistem Statusu</h2>
          <div className="status-grid">
            {systemStatus.map((status, index) => (
              <div key={index} className="status-item">
                <div className="status-icon">{status.icon}</div>
                <div className="status-info">
                  <div className="status-label">{status.label}</div>
                  <div className="status-value" style={{ color: status.color }}>
                    {status.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Approvals Alert */}
          {statsData.pendingApprovals > 0 && (
            <div className="pending-alert">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <div className="alert-title">Gözləyən Təsdiqləmələr</div>
                <div className="alert-message">
                  {statsData.pendingApprovals} biznes təsdiqləməni gözləyir
                </div>
              </div>
              <button className="alert-action" onClick={() => setActivePage('businesses')}>İndi Bax</button>
            </div>
          )}
          
          {/* Additional Stats */}
          {statsData.reports > 0 && (
            <div className="pending-alert" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <div className="alert-icon">📋</div>
              <div className="alert-content">
                <div className="alert-title">Yeni Hesabatlar</div>
                <div className="alert-message">
                  {statsData.reports} hesabat yoxlanılmağı gözləyir
                </div>
              </div>
              <button className="alert-action" onClick={() => setActivePage('report')} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.5)' }}>Hesabatlara Bax</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



export default Home;
