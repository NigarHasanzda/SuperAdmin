import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllLog } from '../../Redux/Features/LogSlice'
import Pagination from '../../Pagination/Pagination'
import './Log.css'

const Log = () => {
    const dispatch = useDispatch()
    const { logs, loading, error, status } = useSelector((state) => state.logs)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')
    const [selectedLog, setSelectedLog] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    
    console.log(logs);

    useEffect(() => {
        dispatch(getAllLog())
    }, [dispatch])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        // Yeni səhifə üçün data yükləmək lazımsa burada edə bilərsiz
        // dispatch(getAllLog({ page: page - 1 })) // backend 0-indexed olarsa
    }

    const handleClearSearch = () => {
        setSearchTerm('')
    }

    const handleLogDetail = (log) => {
        setSelectedLog(log)
        setShowDetailModal(true)
    }

    const getActionIcon = (action) => {
        switch (action?.toLowerCase()) {
            case 'create':
            case 'add':
            case 'insert':
                return '✅'
            case 'update':
            case 'edit':
            case 'modify':
                return '✏️'
            case 'delete':
            case 'remove':
                return '🗑️'
            case 'login':
            case 'signin':
                return '🔐'
            case 'logout':
            case 'signout':
                return '🚪'
            case 'view':
            case 'read':
                return '👁️'
            case 'search':
                return '🔍'
            case 'export':
                return '📤'
            case 'import':
                return '📥'
            case 'error':
                return '❌'
            case 'warning':
                return '⚠️'
            case 'success':
                return '✅'
            default:
                return '📋'
        }
    }

    const getActionColor = (action) => {
        switch (action?.toLowerCase()) {
            case 'create':
            case 'add':
            case 'success':
                return '#10b981'
            case 'update':
            case 'edit':
                return '#3b82f6'
            case 'delete':
            case 'remove':
                return '#ef4444'
            case 'login':
            case 'logout':
                return '#8b5cf6'
            case 'error':
                return '#dc2626'
            case 'warning':
                return '#f59e0b'
            default:
                return '#64748b'
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now - date)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) return 'Bugün'
        if (diffDays === 2) return 'Dünən'
        if (diffDays <= 7) return `${diffDays - 1} gün əvvəl`
        
        return date.toLocaleString('az-AZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const logData = logs.logs || []
    const totalPages = logs.pages || 1
    const totalCount = logs.total || 0

    // Filter və search
    const filteredLogs = logData.filter(log => {
        const searchMatch = searchTerm === '' || 
            (log.user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.details || '').toLowerCase().includes(searchTerm.toLowerCase())
        
        const typeMatch = filterType === 'all' || 
            (log.action || '').toLowerCase().includes(filterType.toLowerCase())
        
        return searchMatch && typeMatch
    })

    // Sort edilmiş logs
    const sortedLogs = [...filteredLogs].sort((a, b) => {
        let aValue = a[sortBy] || ''
        let bValue = b[sortBy] || ''
        
        if (sortBy === 'date') {
            aValue = new Date(a.createdAt || a.date || 0).getTime()
            bValue = new Date(b.createdAt || b.date || 0).getTime()
        }
        
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1
        } else {
            return aValue < bValue ? 1 : -1
        }
    })

    if (loading || status === 'loading') {
        return (
            <div className="logs-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Log məlumatları yüklənir...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="logs-container">
                <div className="error-state">
                    ⚠️ Xəta baş verdi: {typeof error === 'string' ? error : JSON.stringify(error)}
                </div>
            </div>
        )
    }

    return (
        <div className="logs-container">
            {/* Header */}
            <div className="logs-header">
                <h1 className="logs-title">
                    📋 Sistem Logları
                </h1>
                <p className="logs-subtitle">
                    Sistem fəaliyyətlərini izləyin və təhlil edin
                </p>
            </div>

            {/* Controls */}
            <div className="logs-controls">
                <div className="search-filter-section">
                    {/* Search */}
                    <div className="search-input-container">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Loglarda axtar (istifadəçi, əməliyyat, detallar)..."
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
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">🗂️ Bütün Növlər</option>
                            <option value="create">✅ Yaratma</option>
                            <option value="update">✏️ Yeniləmə</option>
                            <option value="delete">🗑️ Silmə</option>
                            <option value="login">🔐 Giriş</option>
                            <option value="error">❌ Xətalar</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="sort-controls">
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="date">📅 Tarix</option>
                            <option value="user">👤 İstifadəçi</option>
                            <option value="action">⚡ Əməliyyat</option>
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
                        <div className="stat-number">{totalCount}</div>
                        <div className="stat-label">Ümumi</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{filteredLogs.length}</div>
                        <div className="stat-label">Filtrlənmiş</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{totalPages}</div>
                        <div className="stat-label">Səhifə</div>
                    </div>
                </div>
            </div>

            {/* Search Info */}
            {searchTerm && (
                <div className="search-info">
                    🔍 "{searchTerm}" üçün {filteredLogs.length} nəticə tapıldı
                </div>
            )}

            {/* Logs List */}
            {sortedLogs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>Log məlumatı tapılmadı</h3>
                    <p>Axtarış kriteriyalarınızı dəyişdirərək yenidən cəhd edin</p>
                </div>
            ) : (
                <>
                    <div className="logs-table-container">
                        <table className="logs-table">
                            <thead>
                                <tr>
                                    <th className="th-id">🆔 ID</th>
                                    <th className="th-date">📅 Tarix</th>
                                    <th className="th-user">👤 İstifadəçi</th>
                                    <th className="th-action">⚡ Əməliyyat</th>
                                    <th className="th-details">📝 Detallar</th>
                                    <th className="th-actions">🔧 Əməliyyatlar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedLogs.map((log, index) => (
                                    <tr key={log.id || index} className="log-row">
                                        <td className="td-id">
                                            <div className="id-badge">#{log.id || index + 1}</div>
                                        </td>
                                        <td className="td-date">
                                            <div className="date-info">
                                                <div className="date-main">{formatDate(log.createdAt || log.date)}</div>
                                                <div className="date-exact">
                                                    {log.createdAt && new Date(log.createdAt).toLocaleTimeString('az-AZ')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="td-user">
                                            <div className="user-info">
                                                <span className="user-icon">👤</span>
                                                <span className="user-name">{log.user || log.userId || 'Sistem'}</span>
                                            </div>
                                        </td>
                                        <td className="td-action">
                                            <div 
                                                className="action-badge" 
                                                style={{ backgroundColor: getActionColor(log.action || log.operation) }}
                                            >
                                                <span className="action-icon">{getActionIcon(log.action || log.operation)}</span>
                                                <span className="action-text">{log.action || log.operation || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="td-details">
                                            <div className="details-preview">
                                                {(log.details || log.description || log.message || 'N/A').substring(0, 80)}
                                                {(log.details || log.description || log.message || '').length > 80 && '...'}
                                            </div>
                                        </td>
                                        <td className="td-actions">
                                            <button 
                                                onClick={() => handleLogDetail(log)}
                                                className="btn-detail"
                                            >
                                                👁️ Ətraflı
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination-wrapper">
                            <Pagination
                                currentPage={currentPage}
                                lastPage={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Log Detail Modal */}
            {showDetailModal && selectedLog && (
                <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="log-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">
                                <h2>{getActionIcon(selectedLog.action)} Log Detayları</h2>
                                <button className="close-btn" onClick={() => setShowDetailModal(false)}>❌</button>
                            </div>
                            <div className="log-id-badge">ID: #{selectedLog.id}</div>
                        </div>

                        <div className="modal-content">
                            {/* Log Info */}
                            <div className="log-info-section">
                                <h3>📋 Əsas Məlumatlar</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <strong>📅 Tarix:</strong> {formatDate(selectedLog.createdAt || selectedLog.date)}
                                    </div>
                                    <div className="info-item">
                                        <strong>⏰ Dəqiq Vaxt:</strong> 
                                        {selectedLog.createdAt 
                                            ? new Date(selectedLog.createdAt).toLocaleString('az-AZ')
                                            : 'N/A'
                                        }
                                    </div>
                                    <div className="info-item">
                                        <strong>👤 İstifadəçi:</strong> {selectedLog.user || selectedLog.userId || 'Sistem'}
                                    </div>
                                    <div className="info-item">
                                        <strong>⚡ Əməliyyat:</strong> 
                                        <span 
                                            className="action-tag"
                                            style={{ backgroundColor: getActionColor(selectedLog.action || selectedLog.operation) }}
                                        >
                                            {getActionIcon(selectedLog.action || selectedLog.operation)} {selectedLog.action || selectedLog.operation || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="log-details-section">
                                <h3>📝 Təfərrüatlar</h3>
                                <div className="details-content">
                                    {selectedLog.details || selectedLog.description || selectedLog.message || 'Ətraflı məlumat mövcud deyil'}
                                </div>
                            </div>

                            {/* Additional Info */}
                            {(selectedLog.ip || selectedLog.userAgent || selectedLog.sessionId) && (
                                <div className="additional-info-section">
                                    <h3>🔧 Əlavə Məlumatlar</h3>
                                    <div className="info-grid">
                                        {selectedLog.ip && (
                                            <div className="info-item">
                                                <strong>🌐 IP Ünvanı:</strong> {selectedLog.ip}
                                            </div>
                                        )}
                                        {selectedLog.userAgent && (
                                            <div className="info-item">
                                                <strong>🖥️ Brauzer:</strong> {selectedLog.userAgent}
                                            </div>
                                        )}
                                        {selectedLog.sessionId && (
                                            <div className="info-item">
                                                <strong>🔐 Sessiya ID:</strong> {selectedLog.sessionId}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Log