import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfessionalPages,
  fetchWheelServices,
  fetchAutoWashServices,
} from "../../Redux/Features/WheelSlice";
import Pagination from "../../Pagination/Pagination";
import "./WheelService.css";

const WheelService = () => {
  const dispatch = useDispatch();
  const { professionalPages, wheelServices, autoWashServices, loading, error } =
    useSelector((state) => state.serviceCatalog);

  // Pagination state
  const [profPage, setProfPage] = useState(0);
  const [wheelPage, setWheelPage] = useState(0);
  const [autoPage, setAutoPage] = useState(0);
  const pageSize = 10;

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('professional');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceFilter, setPriceFilter] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch data
  useEffect(() => {
    dispatch(fetchProfessionalPages({ page: profPage, size: pageSize }));
  }, [dispatch, profPage]);

  useEffect(() => {
    dispatch(fetchWheelServices({ page: wheelPage, size: pageSize }));
  }, [dispatch, wheelPage]);

  useEffect(() => {
    dispatch(fetchAutoWashServices({ page: autoPage, size: pageSize }));
  }, [dispatch, autoPage]);

  // Utility functions
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleServiceDetail = (service) => {
    setSelectedService(service);
    setShowDetailModal(true);
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'professional':
        return '👨‍🔧';
      case 'wheel':
        return '🛞';
      case 'autowash':
        return '🚗';
      default:
        return '🔧';
    }
  };

  const getPriceColor = (price) => {
    if (price < 50) return '#10b981';
    if (price < 100) return '#f59e0b';
    return '#ef4444';
  };

  // Filter and sort services
  const getFilteredAndSortedServices = (services, type) => {
    if (!services?.content) return [];
    
    let filtered = services.content.filter(service => {
      const searchMatch = searchTerm === '' || 
        (service.serviceName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.surname || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const priceMatch = priceFilter === 'all' || 
        (priceFilter === 'low' && service.price < 50) ||
        (priceFilter === 'medium' && service.price >= 50 && service.price < 100) ||
        (priceFilter === 'high' && service.price >= 100);
      
      return searchMatch && priceMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (sortBy === 'price') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'name') {
        aValue = `${a.name || ''} ${a.surname || ''}`.toLowerCase();
        bValue = `${b.name || ''} ${b.surname || ''}`.toLowerCase();
      } else if (sortBy === 'serviceName') {
        aValue = (a.serviceName || '').toLowerCase();
        bValue = (b.serviceName || '').toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Get current services based on active tab
  const getCurrentServices = () => {
    switch (activeTab) {
      case 'professional':
        return getFilteredAndSortedServices(professionalPages, 'professional');
      case 'wheel':
        return getFilteredAndSortedServices(wheelServices, 'wheel');
      case 'autowash':
        return getFilteredAndSortedServices(autoWashServices, 'autowash');
      default:
        return [];
    }
  };

  const currentServices = getCurrentServices();

  // Statistics
  const stats = useMemo(() => {
    const profServices = professionalPages.content || [];
    const wheelServices_content = wheelServices.content || [];
    const autoServices = autoWashServices.content || [];
    
    return {
      total: profServices.length + wheelServices_content.length + autoServices.length,
      professional: profServices.length,
      wheel: wheelServices_content.length,
      autowash: autoServices.length,
      filtered: currentServices.length
    };
  }, [professionalPages, wheelServices, autoWashServices, currentServices]);

  const renderServiceCard = (service, type) => (
    <div key={service.id} className="service-card" onClick={() => handleServiceDetail({...service, type})}>
      <div className="service-header">
        <div className="service-info">
          <div className="service-type-badge">
            <span className="service-type-icon">{getServiceIcon(type)}</span>
            <span className="service-type-text">{type === 'professional' ? 'Professional' : type === 'wheel' ? 'Təkər' : 'Avto Yuma'}</span>
          </div>
          <h3 className="service-name">{service.serviceName}</h3>
          <div className="service-provider">
            <span className="provider-icon">👤</span>
            <span className="provider-name">{service.name} {service.surname}</span>
          </div>
          <div className="service-id">🆔 ID: {service.id}</div>
        </div>
        <div className="service-price" style={{ backgroundColor: getPriceColor(service.price) }}>
          {service.price} ₼
        </div>
      </div>
      
      <div className="service-details">
        <div className="detail-item">
          <span className="detail-icon">💰</span>
          <span className="detail-text">Qiymət: {service.price} ₼</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">⭐</span>
          <span className="detail-text">Reytinq: {service.rating || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">📊</span>
          <span className="detail-text">Sifarişlər: {service.orderCount || 0}</span>
        </div>
      </div>
      
      <div className="service-actions-preview">
        <button className="btn-preview" onClick={(e) => { e.stopPropagation(); handleServiceDetail({...service, type}); }}>
          👁️ Ətraflı Bax
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="wheel-service-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Servis məlumatları yüklənir...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wheel-service-container">
        <div className="error-state">
          ⚠️ Xəta baş verdi: {typeof error === 'string' ? error : JSON.stringify(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="wheel-service-container">
      {/* Header */}
      <div className="wheel-service-header">
        <h1 className="wheel-service-title">
          🔧 Servis Kataloqu
        </h1>
        <p className="wheel-service-subtitle">
          Professional xidmətlər, təkər servisləri və avto yuma xidmətlərini idarə edin
        </p>
      </div>

      {/* Controls */}
      <div className="wheel-service-controls">
        <div className="search-filter-section">
          {/* Search */}
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Servis, müştəri adı və ya xidmət adı ilə axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={handleClearSearch} className="clear-search-btn">✖️</button>
            )}
          </div>

          {/* Filters */}
          <div className="filter-controls">
            <select 
              value={priceFilter} 
              onChange={(e) => setPriceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">💰 Bütün Qiymətlər</option>
              <option value="low">💚 Ucuz (0-50₼)</option>
              <option value="medium">💛 Orta (50-100₼)</option>
              <option value="high">❤️ Bahalı (100₼+)</option>
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">� Müştəri Adı</option>
              <option value="serviceName">🔧 Servis Adı</option>
              <option value="price">💰 Qiymət</option>
            </select>

            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={`sort-order-btn ${sortOrder}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Ümumi</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.filtered}</div>
            <div className="stat-label">Filtrlənmiş</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.professional}</div>
            <div className="stat-label">Professional</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.wheel}</div>
            <div className="stat-label">Təkər</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.autowash}</div>
            <div className="stat-label">Avto Yuma</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'professional' ? 'active' : ''}`}
          onClick={() => setActiveTab('professional')}
        >
          👨‍🔧 Professional Səhifələr ({stats.professional})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'wheel' ? 'active' : ''}`}
          onClick={() => setActiveTab('wheel')}
        >
          🛞 Təkər Servisləri ({stats.wheel})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'autowash' ? 'active' : ''}`}
          onClick={() => setActiveTab('autowash')}
        >
          🚗 Avto Yuma Servisləri ({stats.autowash})
        </button>
      </div>

      {/* Search Info */}
      {searchTerm && (
        <div className="search-info">
          🔍 "{searchTerm}" üçün {currentServices.length} nəticə tapıldı
        </div>
      )}

      {/* Services Grid */}
      {currentServices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔧</div>
          <h3>Servis tapılmadı</h3>
          <p>Axtarış kriteriyalarınızı dəyişdirərək yenidən cəhd edin</p>
        </div>
      ) : (
        <>
          <div className="services-grid">
            {currentServices.map(service => renderServiceCard(service, activeTab))}
          </div>

          {/* Pagination */}
          <div className="pagination-wrapper">
            {activeTab === 'professional' && professionalPages.totalPages > 1 && (
              <Pagination
                currentPage={professionalPages.number + 1}
                lastPage={professionalPages.totalPages}
                onPageChange={(p) => setProfPage(p - 1)}
              />
            )}
            {activeTab === 'wheel' && wheelServices.totalPages > 1 && (
              <Pagination
                currentPage={wheelServices.number + 1}
                lastPage={wheelServices.totalPages}
                onPageChange={(p) => setWheelPage(p - 1)}
              />
            )}
            {activeTab === 'autowash' && autoWashServices.totalPages > 1 && (
              <Pagination
                currentPage={autoWashServices.number + 1}
                lastPage={autoWashServices.totalPages}
                onPageChange={(p) => setAutoPage(p - 1)}
              />
            )}
          </div>
        </>
      )}

      {/* Service Detail Modal */}
      {showDetailModal && selectedService && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="service-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <h2>{getServiceIcon(selectedService.type)} {selectedService.serviceName}</h2>
                <button className="close-btn" onClick={() => setShowDetailModal(false)}>❌</button>
              </div>
              <div className="service-type-row">
                <div className="service-type-badge">
                  {getServiceIcon(selectedService.type)} {selectedService.type === 'professional' ? 'Professional Xidmət' : selectedService.type === 'wheel' ? 'Təkər Servisi' : 'Avto Yuma Servisi'}
                </div>
                <div className="service-id-badge">ID: #{selectedService.id}</div>
              </div>
            </div>

            <div className="modal-content">
              {/* Service Info */}
              <div className="service-info-section">
                <h3>🔧 Servis Məlumatları</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>🏷️ Servis Adı:</strong> {selectedService.serviceName}
                  </div>
                  <div className="info-item">
                    <strong>👤 Müştəri:</strong> {selectedService.name} {selectedService.surname}
                  </div>
                  <div className="info-item">
                    <strong>💰 Qiymət:</strong> 
                    <span 
                      className="price-tag"
                      style={{ backgroundColor: getPriceColor(selectedService.price) }}
                    >
                      {selectedService.price} ₼
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>⭐ Reytinq:</strong> {selectedService.rating || 'Hələ reytinq verilməyib'}
                  </div>
                  <div className="info-item">
                    <strong>📊 Sifarişlər:</strong> {selectedService.orderCount || 0} ədəd
                  </div>
                  <div className="info-item">
                    <strong>📅 Yaradılma Tarixi:</strong> {selectedService.createdAt ? new Date(selectedService.createdAt).toLocaleDateString('az-AZ') : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedService.description && (
                <div className="service-description-section">
                  <h3>📝 Təsvir</h3>
                  <div className="description-content">
                    {selectedService.description}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="contact-info-section">
                <h3>📞 Əlaqə Məlumatları</h3>
                <div className="info-grid">
                  {selectedService.phone && (
                    <div className="info-item">
                      <strong>📱 Telefon:</strong> {selectedService.phone}
                    </div>
                  )}
                  {selectedService.email && (
                    <div className="info-item">
                      <strong>📧 Email:</strong> {selectedService.email}
                    </div>
                  )}
                  {selectedService.address && (
                    <div className="info-item">
                      <strong>📍 Ünvan:</strong> {selectedService.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WheelService;
