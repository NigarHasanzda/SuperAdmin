import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, updateUser } from "../../Redux/Features/AllUserSlice";
import "./Persons.css";

const Persons = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.users);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", surname: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter and search users
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(list);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = list.filter(
        (user) =>
          user.name?.toLowerCase().includes(term) ||
          user.surname?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.id.toString().includes(term)
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, list]);

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortBy] || "";
    const bValue = b[sortBy] || "";
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleDelete = (id, name) => {
    if (window.confirm(`"${name}" istifadəçisini silmək istədiyinizə əminsiniz?`)) {
      dispatch(deleteUser(id));
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setEditData({ 
      name: user.name || "", 
      surname: user.surname || "", 
      email: user.email || "" 
    });
  };

  const handleUpdate = () => {
    if (!editData.name.trim() || !editData.surname.trim() || !editData.email.trim()) {
      alert("Bütün sahələr doldurulmalıdır!");
      return;
    }
    dispatch(updateUser({ id: editId, userData: editData }));
    setEditId(null);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditData({ name: "", surname: "", email: "" });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️";
    return sortOrder === "asc" ? "↗️" : "↘️";
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="persons-container">
      {/* Header */}
      <div className="persons-header">
        <h1 className="persons-title">
          👥 İstifadəçi İdarəetməsi
        </h1>
        <p className="persons-subtitle">
          Bütün istifadəçiləri idarə edin, məlumatlarını yeniləyin və hesabları idarə edin
        </p>
      </div>

      {/* Controls */}
      <div className="persons-controls">
        <div className="search-section">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Ad, soyad, email və ya ID ilə axtar..."
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
              🎯 {filteredUsers.length} nəticə tapıldı
            </div>
          )}
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{list.length}</div>
            <div className="stat-label">Ümumi İstifadəçi</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{filteredUsers.length}</div>
            <div className="stat-label">Göstərilən</div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>İstifadəçilər yüklənir...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          ⚠️ Xəta: {error}
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <>
          {currentUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>İstifadəçi tapılmadı</h3>
              <p>
                {searchTerm 
                  ? `"${searchTerm}" axtarışına uyğun istifadəçi mövcud deyil`
                  : 'Hələ heç bir istifadəçi yoxdur'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("id")} className="sortable">
                        🆔 ID {getSortIcon("id")}
                      </th>
                      <th onClick={() => handleSort("name")} className="sortable">
                        👤 Ad {getSortIcon("name")}
                      </th>
                      <th onClick={() => handleSort("surname")} className="sortable">
                        👤 Soyad {getSortIcon("surname")}
                      </th>
                      <th onClick={() => handleSort("email")} className="sortable">
                        📧 Email {getSortIcon("email")}
                      </th>
                      <th className="actions-header">
                        ⚙️ Əməliyyatlar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr 
                        key={user.id} 
                        className={`user-row ${editId === user.id ? 'editing' : ''} ${index % 2 === 0 ? 'even' : 'odd'}`}
                      >
                        <td className="user-id">
                          <div className="id-badge">{user.id}</div>
                        </td>
                        <td className="user-name">
                          {editId === user.id ? (
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                              className="edit-input"
                              placeholder="Ad daxil edin"
                            />
                          ) : (
                            <div className="user-info">
                              <span className="name">{user.name || 'Ad yoxdur'}</span>
                            </div>
                          )}
                        </td>
                        <td className="user-surname">
                          {editId === user.id ? (
                            <input
                              type="text"
                              value={editData.surname}
                              onChange={(e) => setEditData({ ...editData, surname: e.target.value })}
                              className="edit-input"
                              placeholder="Soyad daxil edin"
                            />
                          ) : (
                            <div className="user-info">
                              <span className="surname">{user.surname || 'Soyad yoxdur'}</span>
                            </div>
                          )}
                        </td>
                        <td className="user-email">
                          {editId === user.id ? (
                            <input
                              type="email"
                              value={editData.email}
                              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                              className="edit-input"
                              placeholder="Email daxil edin"
                            />
                          ) : (
                            <div className="email-container">
                              <span className="email">{user.email || 'Email yoxdur'}</span>
                            </div>
                          )}
                        </td>
                        <td className="user-actions">
                          {editId === user.id ? (
                            <div className="edit-actions">
                              <button onClick={handleUpdate} className="btn btn-success">
                                ✅ Yadda Saxla
                              </button>
                              <button onClick={handleCancelEdit} className="btn btn-secondary">
                                ❌ Ləğv Et
                              </button>
                            </div>
                          ) : (
                            <div className="view-actions">
                              <button 
                                onClick={() => handleEdit(user)} 
                                className="btn btn-primary"
                                title="Düzəliş et"
                              >
                                ✏️ Redaktə
                              </button>
                              <button 
                                onClick={() => handleDelete(user.id, user.name)} 
                                className="btn btn-danger"
                                title="Sil"
                              >
                                🗑️ Sil
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    ⬅️ Əvvəlki
                  </button>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Növbəti ➡️
                  </button>
                </div>
              )}

              {/* Table Info */}
              <div className="table-info">
                <span>
                  {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, sortedUsers.length)} / {sortedUsers.length} istifadəçi göstərilir
                </span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Persons;
