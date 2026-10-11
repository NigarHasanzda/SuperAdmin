import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLog } from "../../Redux/Features/LogSlice";
import Pagination from "../../Pagination/Pagination";
import "./Log.css";

const Log = () => {
  const dispatch = useDispatch();
  const { logs, loading, error, status } = useSelector((state) => state.logs);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    dispatch(getAllLog({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleClearSearch = () => setSearchTerm("");
  const handleLogDetail = (log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const getActionColor = (action) => {
    switch ((action || "").toLowerCase()) {
      case "create":
      case "add":
      case "success":
        return "#10b981";
      case "update":
      case "edit":
        return "#3b82f6";
      case "delete":
      case "remove":
        return "#ef4444";
      case "login":
      case "logout":
        return "#8b5cf6";
      case "error":
        return "#dc2626";
      case "warning":
        return "#f59e0b";
      default:
        return "#64748b";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const logData = logs?.logs || [];
  const totalPages = logs?.pages || 1;
  const totalCount = logs?.total || 0;

  // Filter və search
  const filteredLogs = logData.filter((log) => {
    const searchMatch =
      searchTerm === "" ||
      (log.user || log.userId || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (log.message || log.details || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const typeMatch =
      filterType === "all" ||
      (log.type || log.action || "")
        .toLowerCase()
        .includes(filterType.toLowerCase());
    return searchMatch && typeMatch;
  });

  // Sort
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let aValue = a[sortBy] || "";
    let bValue = b[sortBy] || "";
    if (sortBy === "date") {
      aValue = new Date(a.createdAt || 0).getTime();
      bValue = new Date(b.createdAt || 0).getTime();
    }
    if (sortOrder === "asc") return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });

  if (loading || status === "loading") {
    return (
      <div className="logs-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="logs-container">
        <div className="error-state">
          ⚠️ Error:{" "}
          {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="logs-container">
      {/* Controls */}
      <div className="logs-controls">
        <div className="search-filter-section">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search logs (user, message)..."
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
          <div className="filter-controls">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">🗂️ All types</option>
              <option value="new_service_product">New product/service</option>
              <option value="report_action">Report</option>
              <option value="payment">Payment</option>
              <option value="user_registered">User registration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      {sortedLogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No logs found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <div className="logs-table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>🆔 ID</th>
                  <th>📅 Date</th>
                  <th>👤 User</th>
                  <th>Tip</th>
                  <th>Mesaj</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedLogs.map((log, index) => (
                  <tr key={log.id || index}>
                    <td>#{log.id || index + 1}</td>
                    <td>{formatDate(log.createdAt)}</td>
                    <td>{log.user || log.userId || "Sistem"}</td>
                    <td>
                      <span
                        style={{
                          backgroundColor: getActionColor(log.type),
                          padding: "2px 6px",
                          borderRadius: "4px",
                          color: "white",
                          fontWeight: "500",
                        }}
                      >
                        {log.type || "N/A"}
                      </span>
                    </td>
                    <td>
                      {(log.message || "").substring(0, 80)}
                      {(log.message || "").length > 80 && "..."}
                    </td>
                    <td>
                      <button onClick={() => handleLogDetail(log)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages >= 1 && (
            <Pagination
              currentPage={currentPage}
              lastPage={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Log Detail Modal */}
      {showDetailModal && selectedLog && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="log-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Log details</h2>
              <button onClick={() => setShowDetailModal(false)}>❌</button>
            </div>
            <div className="modal-content">
              <p>
                <strong>ID:</strong> {selectedLog.id}
              </p>
              <p>
                <strong>User:</strong>{" "}
                {selectedLog.user || selectedLog.userId || "Sistem"}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(selectedLog.createdAt)}
              </p>
              <p>
                <strong>Tip:</strong> {selectedLog.type}
              </p>
              <p>
                <strong>Mesaj:</strong> {selectedLog.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Log;
