import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRoles,
  addRole,
  updateRole,
  deleteRole,
} from "../../Redux/Features/AllRole";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Role.css";
import { FaAngleLeft ,FaAngleRight} from 'react-icons/fa';

const permissions = [
  { key: "superAdmin", label: "Super Admin", icon: "👑" },
  { key: "admin", label: "Admin", icon: "🛡️" },
  { key: "person", label: "Person", icon: "👤" },
  { key: "professional", label: "Professional", icon: "💼" },
  { key: "business", label: "Business", icon: "🏢" },
  { key: "businessAdmin", label: "Business Admin", icon: "🏪" },
  { key: "driverAdmin", label: "Driver Admin", icon: "🚗" },
];

const Role = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.roles);

  const [editRole, setEditRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    superAdmin: 0,
    admin: 0,
    person: 0,
    professional: 0,
    business: 0,
    businessAdmin: 0,
    driverAdmin: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 5;

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRoles(list);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredRoles(
        list.filter(
          (r) =>
            r.name.toLowerCase().includes(term) ||
            r.description.toLowerCase().includes(term)
        )
      );
    }
    setCurrentPage(1);
  }, [searchTerm, list]);

  // Pagination logic
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // ✅ Toast funksiyası
  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const handleToggleEdit = (perm) => {
    setEditRole({ ...editRole, [perm]: editRole[perm] ? 0 : 1 });
  };

  const handleToggleNew = (perm) => {
    setNewRole({ ...newRole, [perm]: newRole[perm] ? 0 : 1 });
  };

  const handleUpdate = () => {
    if (!editRole.name.trim()) {
      toast.error("⚠️ Rol adı boş ola bilməz");
      return;
    }
    dispatch(updateRole(editRole)).then(() => {
      showToast(`"${editRole.name}" rolu yeniləndi ✅`);
      setEditRole(null);
    });
  };

  const handleAdd = () => {
    if (!newRole.name.trim()) {
      toast.error("⚠️ Rol adı boş ola bilməz");
      return;
    }
    dispatch(addRole(newRole)).then(() => {
      showToast(`"${newRole.name}" rolu əlavə olundu ✨`);
      setNewRole({
        name: "",
        description: "",
        superAdmin: 0,
        admin: 0,
        person: 0,
        professional: 0,
        business: 0,
        businessAdmin: 0,
        driverAdmin: 0,
      });
      setShowAddForm(false);
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`"${name}" rolunu silmək istədiyinizə əminsiniz?`)) {
      dispatch(deleteRole(id)).then(() => {
        showToast(`"${name}" rolu silindi 🗑️`, "info");
      });
    }
  };

  const resetNewRole = () => {
    setNewRole({
      name: "",
      description: "",
      superAdmin: 0,
      admin: 0,
      person: 0,
      professional: 0,
      business: 0,
      businessAdmin: 0,
      driverAdmin: 0,
    });
    setShowAddForm(false);
  };

  return (
    <div className="role-container">
            <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      {/* Controls */}
      <div className="role-controls">
        <div className="search-section">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rol adı və ya təsvir üzrə axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="clear-search-btn"
              >
                ❌
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="search-info">
              🎯 {filteredRoles.length} nəticə tapıldı
            </div>
          )}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary add-role-btn"
        >
          {showAddForm ? "❌ Bağla" : "✨ Yeni Rol"}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="add-role-form">
          <div className="form-header">
            <h3>🆕 Yeni Rol Əlavə Et</h3>
          </div>
          <div className="form-content">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">📛 Rol Adı</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label className="form-label">📝 Təsvir</label>
                <input
                  type="text"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div className="permissions-section">
              <label className="form-label">🔐 İcazələr</label>
              <div className="permissions-grid">
                {permissions.map((perm) => (
                  <div
                    key={perm.key}
                    className={`permission-card ${
                      newRole[perm.key] ? "active" : ""
                    }`}
                    onClick={() => handleToggleNew(perm.key)}
                  >
                    <div className="permission-icon">{perm.icon}</div>
                    <div className="permission-label">{perm.label}</div>
                    <div className="permission-status">
                      {newRole[perm.key] ? "✅" : "❌"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button onClick={handleAdd} className="btn btn-success">
                ✨ Əlavə Et
              </button>
              <button onClick={resetNewRole} className="btn btn-secondary">
                ❌ Ləğv Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Rollar yüklənir...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-state">
          ⚠️ Xəta: {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      {/* Roles List */}
      {!loading && !error && (
        <>
          {filteredRoles.length === 0 ? (
            <div className="empty-state">
              <h3>🛡️ Heç bir rol tapılmadı</h3>
              <p>
                {searchTerm
                  ? `"${searchTerm}" üçün nəticə yoxdur`
                  : "Hələ heç bir rol əlavə edilməyib"}
              </p>
            </div>
          ) : (
            <>
              <div className="roles-grid">
                {currentRoles.map((role) => (
                  <div key={role.id} className="role-card">
                    {editRole?.id === role.id ? (
                      <div className="role-edit-form">
                        <h3>✏️ Rol Düzəliş Et</h3>
                        <div className="form-row">
                          <input
                            type="text"
                            value={editRole.name}
                            onChange={(e) =>
                              setEditRole({
                                ...editRole,
                                name: e.target.value,
                              })
                            }
                            className="input-field"
                          />
                          <input
                            type="text"
                            value={editRole.description}
                            onChange={(e) =>
                              setEditRole({
                                ...editRole,
                                description: e.target.value,
                              })
                            }
                            className="input-field"
                          />
                        </div>
                        <div className="permissions-grid">
                          {permissions.map((perm) => (
                            <div
                              key={perm.key}
                              className={`permission-card ${
                                editRole[perm.key] ? "active" : ""
                              }`}
                              onClick={() => handleToggleEdit(perm.key)}
                            >
                              <div className="permission-icon">{perm.icon}</div>
                              <div className="permission-label">
                                {perm.label}
                              </div>
                              <div className="permission-status">
                                {editRole[perm.key] ? "✅" : "❌"}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="edit-actions">
                          <button
                            onClick={handleUpdate}
                            className="btn btn-success"
                          >
                            ✅ Saxla
                          </button>
                          <button
                            onClick={() => setEditRole(null)}
                            className="btn btn-secondary"
                          >
                            ❌ Ləğv Et
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="role-view">
                        <h3 className="role-name">🏷️ {role.name}</h3>
                        <p>{role.description || "Təsvir yoxdur"}</p>

                        <div className="permissions-list">
                          {permissions.map((perm) => (
                            <div
                              key={perm.key}
                              className={`permission-item ${
                                role[perm.key] ? "granted" : "denied"
                              }`}
                            >
                              <span>{perm.icon}</span>
                              <span>{perm.label}</span>
                              <span>{role[perm.key] ? "✅" : "❌"}</span>
                            </div>
                          ))}
                        </div>

                        <div className="role-actions">
                          <button
                            onClick={() => setEditRole(role)}
                            className="btn btn-primary"
                          >
                            ✏️ Düzəliş Et
                          </button>
                          <button
                            onClick={() => handleDelete(role.id, role.name)}
                            className="btn btn-danger"
                          >
                            🗑️ Sil
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ✅ Pagination (ellipses ilə) */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaAngleLeft/> 
                  </button>

                  {currentPage > 2 && (
                    <>
                      <button
                        className={`page-btn ${
                          currentPage === 1 ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </button>
                      {currentPage > 3 && <span className="dots">...</span>}
                    </>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (num) =>
                        num >= currentPage - 1 && num <= currentPage + 1
                    )
                    .map((num) => (
                      <button
                        key={num}
                        className={`page-btn ${
                          currentPage === num ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(num)}
                      >
                        {num}
                      </button>
                    ))}

                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && (
                        <span className="dots">...</span>
                      )}
                      <button
                        className={`page-btn ${
                          currentPage === totalPages ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FaAngleRight/>
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Role;
