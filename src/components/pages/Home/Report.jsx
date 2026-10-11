import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReportTransactions,
  answerReportTransaction,
  clearReportStatus,
} from "../../Redux/Features/reportSlice";
import { toast } from "react-toastify";
import "./Report.css";

const Report = () => {
  const dispatch = useDispatch();
  const { list, loading, error, answerLoading, answerSuccess } = useSelector(
    (state) => state.reports
  );

  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    dispatch(fetchReportTransactions());
  }, [dispatch]);

  useEffect(() => {
    if (answerSuccess) {
      toast.success("Reply sent successfully");
      setSelectedId(null);
      setMessage("");
      dispatch(clearReportStatus());
      dispatch(fetchReportTransactions());
    }
    if (error) {
      toast.error(error);
      dispatch(clearReportStatus());
    }
  }, [answerSuccess, error, dispatch]);

  // Utility functions
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleReportDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "open":
        return "#f59e0b";
      case "resolved":
      case "answered":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      case "in_progress":
        return "#3b82f6";
      default:
        return "#64748b";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "open":
        return "⏳";
      case "resolved":
      case "answered":
        return "✅";
      case "rejected":
        return "❌";
      case "in_progress":
        return "🔄";
      default:
        return "❓";
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "spam":
        return "🚫";
      case "fraud":
        return "⚠️";
      case "inappropriate":
        return "🔞";
      case "harassment":
        return "🚨";
      case "fake":
        return "🎭";
      case "other":
        return "📝";
      default:
        return "📋";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    let filtered = list.filter((report) => {
      const searchMatch =
        searchTerm === "" ||
        report.id.toString().includes(searchTerm) ||
        (report.reportType || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (report.fromUserId || "").toString().includes(searchTerm) ||
        (report.reportCategoryId || "").toString().includes(searchTerm);

      const statusMatch =
        statusFilter === "all" ||
        (report.reportStatus || "").toLowerCase() ===
          statusFilter.toLowerCase();

      const typeMatch =
        typeFilter === "all" ||
        (report.reportType || "").toLowerCase() === typeFilter.toLowerCase();

      return searchMatch && statusMatch && typeMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || "";
      let bValue = b[sortBy] || "";

      if (
        sortBy === "id" ||
        sortBy === "fromUserId" ||
        sortBy === "reportCategoryId"
      ) {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (sortBy === "createdAt") {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [list, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const reports = list || [];
    return {
      total: reports.length,
      pending: reports.filter((r) =>
        (r.reportStatus || "").toLowerCase().includes("pending")
      ).length,
      resolved: reports.filter((r) =>
        (r.reportStatus || "").toLowerCase().includes("resolved")
      ).length,
      rejected: reports.filter((r) =>
        (r.reportStatus || "").toLowerCase().includes("rejected")
      ).length,
      filtered: filteredAndSortedReports.length,
    };
  }, [list, filteredAndSortedReports]);

  if (loading) {
    return (
      <div className="reports-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-container">
        <div className="error-state">
          ⚠️ Error:{" "}
          {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      {/* Header */}
      {/* <div className="reports-header">
        <h1 className="reports-title">
          📋 Report management
        </h1>
        <p className="reports-subtitle">
          Track user complaints, reply, and resolve issues.
        </p>
      </div> */}

      {/* Controls */}
      <div className="reports-controls">
        <div className="search-filter-section">
          {/* Search */}
          <div className="search-input-container">
            <span className="search-icon">�</span>
            <input
              type="text"
              placeholder="Search by report ID, type, user ID, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={handleClearSearch} className="clear-search-btn">
                ✖️
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="filter-controls">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">📊 All statuses</option>
              <option value="pending">⏳ Pending</option>
              <option value="resolved">✅ Resolved</option>
              <option value="rejected">❌ Rejected</option>
              <option value="in_progress">🔄 Davam edir</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">📋 All types</option>
              <option value="spam">🚫 Spam</option>
              <option value="fraud">⚠️ Fraud</option>
              <option value="inappropriate">🔞 Inappropriate</option>
              <option value="harassment">🚨 Harassment</option>
              <option value="fake">🎭 Saxta</option>
              <option value="other">📝 Other</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="id">🆔 ID</option>
              <option value="reportStatus">📊 Status</option>
              <option value="reportType">📋 Type</option>
              <option value="fromUserId">👤 User</option>
              <option value="createdAt">📅 Date</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className={`sort-order-btn ${sortOrder}`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.filtered}</div>
            <div className="stat-label">Filtered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      {/* Search Info */}
      {searchTerm && (
        <div className="search-info">
          🔍 {filteredAndSortedReports.length} results for "{searchTerm}"
        </div>
      )}

      {/* Reports Table */}
      {filteredAndSortedReports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No reports found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="reports-table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th className="th-id">🆔 ID</th>
                <th className="th-category">📂 Category</th>
                <th className="th-status">📊 Status</th>
                <th className="th-type">📋 Report type</th>
                <th className="th-user">👤 User</th>
                <th className="th-date">📅 Date</th>
                <th className="th-actions">🔧 Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedReports.map((report) => (
                <tr key={report.id} className="report-row">
                  <td className="td-id">
                    <div className="id-badge">#{report.id}</div>
                  </td>
                  <td className="td-category">
                    <div className="category-info">
                      <span className="category-icon">📂</span>
                      <span className="category-text">
                        {report.reportCategoryId || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="td-status">
                    <div
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(report.reportStatus),
                      }}
                    >
                      <span className="status-icon">
                        {getStatusIcon(report.reportStatus)}
                      </span>
                      <span className="status-text">{report.reportStatus}</span>
                    </div>
                  </td>
                  <td className="td-type">
                    <div className="type-info">
                      <span className="type-icon">
                        {getTypeIcon(report.reportType)}
                      </span>
                      <span className="type-text">{report.reportType}</span>
                    </div>
                  </td>
                  <td className="td-user">
                    <div className="user-info">
                      <span className="user-icon">👤</span>
                      <span className="user-id">#{report.fromUserId}</span>
                    </div>
                  </td>
                  <td className="td-date">
                    <div className="date-info">
                      <div className="date-main">
                        {formatDate(report.createdAt)}
                      </div>
                      <div className="date-exact">
                        {report.createdAt &&
                          new Date(report.createdAt).toLocaleTimeString(
                            "en-US"
                          )}
                      </div>
                    </div>
                  </td>
                  <td className="td-actions">
                    <div className="action-buttons">
                      <button
                        onClick={() => handleReportDetail(report)}
                        className="btn-detail"
                      >
                        👁️ View
                      </button>
                      {selectedId === report.id ? (
                        <div className="reply-form">
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your reply..."
                            className="reply-textarea"
                          />
                          <div className="reply-buttons">
                            <button
                              onClick={() =>
                                dispatch(
                                  answerReportTransaction({
                                    reportTransactionId: report.id,
                                    message,
                                  })
                                )
                              }
                              disabled={answerLoading || !message.trim()}
                              className="btn-send"
                            >
                              {answerLoading ? "📤 Sending..." : "📤 Send"}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedId(null);
                                setMessage("");
                              }}
                              className="btn-cancel"
                            >
                              ❌ Cancel et
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedId(report.id)}
                          className="btn-reply"
                        >
                          💬 Cavab
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report Detail Modal */}
      {showDetailModal && selectedReport && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="report-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title">
                <h2>
                  {getTypeIcon(selectedReport.reportType)} Report details
                </h2>
                <button
                  className="close-btn"
                  onClick={() => setShowDetailModal(false)}
                >
                  ❌
                </button>
              </div>
              <div className="report-status-row">
                <div
                  className="status-badge"
                  style={{
                    backgroundColor: getStatusColor(
                      selectedReport.reportStatus
                    ),
                  }}
                >
                  {getStatusIcon(selectedReport.reportStatus)}{" "}
                  {selectedReport.reportStatus}
                </div>
                <div className="report-id-badge">ID: #{selectedReport.id}</div>
              </div>
            </div>

            <div className="modal-content">
              {/* Report Info */}
              <div className="report-info-section">
                <h3>📋 Overview</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>📂 Category ID:</strong>{" "}
                    {selectedReport.reportCategoryId || "—"}
                  </div>
                  <div className="info-item">
                    <strong>📊 Status:</strong>
                    <span
                      className="status-tag"
                      style={{
                        backgroundColor: getStatusColor(
                          selectedReport.reportStatus
                        ),
                      }}
                    >
                      {getStatusIcon(selectedReport.reportStatus)}{" "}
                      {selectedReport.reportStatus}
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>📋 Report type:</strong>
                    <span className="type-tag">
                      {getTypeIcon(selectedReport.reportType)}{" "}
                      {selectedReport.reportType}
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>👤 User ID:</strong> #
                    {selectedReport.fromUserId}
                  </div>
                  <div className="info-item">
                    <strong>📅 Created:</strong>{" "}
                    {formatDate(selectedReport.createdAt)}
                  </div>
                  <div className="info-item">
                    <strong>⏰ Exact time:</strong>
                    {selectedReport.createdAt
                      ? new Date(selectedReport.createdAt).toLocaleString(
                          "en-US"
                        )
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Report Details */}
              {selectedReport.description && (
                <div className="report-description-section">
                  <h3>📝 Description</h3>
                  <div className="description-content">
                    {selectedReport.description}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="additional-info-section">
                <h3>🔧 Additional info</h3>
                <div className="info-grid">
                  {selectedReport.priority && (
                    <div className="info-item">
                      <strong>⚡ Prioritet:</strong> {selectedReport.priority}
                    </div>
                  )}
                  {selectedReport.assignedTo && (
                    <div className="info-item">
                      <strong>👨‍💼 Assigned to:</strong>{" "}
                      {selectedReport.assignedTo}
                    </div>
                  )}
                  {selectedReport.resolvedAt && (
                    <div className="info-item">
                      <strong>✅ Resolved at:</strong>{" "}
                      {formatDate(selectedReport.resolvedAt)}
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

export default Report;
