import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FiSearch,
  FiPlus,
  FiX,
  FiShield,
  FiUser,
  FiBriefcase,
  FiHome,
  FiShoppingBag,
  FiNavigation,
  FiAward,
  FiEdit2,
  FiTrash2,
  FiSave,
} from "react-icons/fi";
import {
  fetchRoles,
  addRole,
  updateRole,
  deleteRole,
} from "../../Redux/Features/AllRole";
import "./Role.css";

const PERMISSIONS = [
  { key: "superAdmin", label: "Super Admin", Icon: FiAward },
  { key: "admin", label: "Admin", Icon: FiShield },
  { key: "person", label: "Person", Icon: FiUser },
  { key: "professional", label: "Professional", Icon: FiBriefcase },
  { key: "business", label: "Business", Icon: FiHome },
  { key: "businessAdmin", label: "Business Admin", Icon: FiShoppingBag },
  { key: "driverAdmin", label: "Driver Admin", Icon: FiNavigation },
];

const EMPTY_ROLE = {
  name: "",
  description: "",
  superAdmin: 0,
  admin: 0,
  person: 0,
  professional: 0,
  business: 0,
  businessAdmin: 0,
  driverAdmin: 0,
};

function countGranted(role) {
  return PERMISSIONS.filter((p) => Number(role[p.key]) === 1).length;
}

function PermissionsEditor({ value, onToggle }) {
  return (
    <>
      <span className="roles-perms-label">Permissions</span>
      <div className="roles-perms-grid">
        {PERMISSIONS.map((perm) => {
          const on = Number(value[perm.key]) === 1;
          return (
            <button
              key={perm.key}
              type="button"
              className={`roles-perm${on ? " is-on" : ""}`}
              onClick={() => onToggle(perm.key)}
            >
              <span className="roles-perm__icon">
                <perm.Icon size={18} />
              </span>
              <span className="roles-perm__name">{perm.label}</span>
              <span className="roles-perm__dot" aria-hidden />
            </button>
          );
        })}
      </div>
    </>
  );
}

function RoleFormPanel({ title, data, setData, onSave, onCancel, saveLabel }) {
  const toggle = (key) => {
    setData({ ...data, [key]: data[key] ? 0 : 1 });
  };

  return (
    <section className="roles-panel">
      <div className="roles-panel__head">
        <h3>{title}</h3>
      </div>
      <div className="roles-panel__body">
        <div className="roles-form-row">
          <div className="roles-field">
            <label htmlFor={`role-name-${title}`}>Role name</label>
            <input
              id={`role-name-${title}`}
              type="text"
              placeholder="e.g. Moderator"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>
          <div className="roles-field">
            <label htmlFor={`role-desc-${title}`}>Description</label>
            <input
              id={`role-desc-${title}`}
              type="text"
              placeholder="Short description"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </div>
        </div>
        <PermissionsEditor value={data} onToggle={toggle} />
        <div className="roles-form-actions">
          <button
            type="button"
            onClick={onSave}
            className="roles-action-btn roles-action-btn--save"
            disabled={!data.name.trim()}
          >
            <FiSave size={16} />
            {saveLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="roles-action-btn roles-action-btn--ghost"
          >
            <FiX size={16} />
            Cancel et
          </button>
        </div>
      </div>
    </section>
  );
}

const Role = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.roles);

  const [editRole, setEditRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRole, setNewRole] = useState({ ...EMPTY_ROLE });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const filteredRoles = useMemo(() => {
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term)
    );
  }, [list, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRoles = filteredRoles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
    return pages;
  };

  const handleUpdate = () => {
    if (!editRole?.name?.trim()) {
      alert("Role name cannot be empty");
      return;
    }
    dispatch(updateRole(editRole)).then(() => setEditRole(null));
  };

  const handleAdd = () => {
    if (!newRole.name.trim()) {
      alert("Role name cannot be empty");
      return;
    }
    dispatch(addRole(newRole)).then(() => {
      setNewRole({ ...EMPTY_ROLE });
      setShowAddForm(false);
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`"${name}" role?`)) {
      dispatch(deleteRole(id));
    }
  };

  const avgPerms =
    list.length > 0
      ? Math.round(
          list.reduce((s, r) => s + countGranted(r), 0) / list.length
        )
      : 0;

  return (
    <div className="roles-page">
      <header className="roles-page__header">
        <div>
          <h2>Roles & permissions</h2>
          <p>
            Manage system roles and toggle granular permissions per role.
          </p>
        </div>
        <div className="roles-page__stats">
          <div className="roles-stat">
            <div className="roles-stat__value">{list.length}</div>
            <div className="roles-stat__label">Total rol</div>
          </div>
          <div className="roles-stat">
            <div className="roles-stat__value">{filteredRoles.length}</div>
            <div className="roles-stat__label">Showing</div>
          </div>
          <div className="roles-stat">
            <div className="roles-stat__value">{avgPerms}</div>
            <div className="roles-stat__label">Avg. permissions</div>
          </div>
        </div>
      </header>

      <div className="roles-toolbar">
        <div className="roles-search">
          <FiSearch size={18} aria-hidden />
          <input
            type="search"
            placeholder="Role name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search"
          />
          {searchTerm && (
            <button
              type="button"
              className="roles-search__clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditRole(null);
          }}
          className={`roles-btn-new ${
            showAddForm ? "roles-btn-new--ghost" : "roles-btn-new--primary"
          }`}
        >
          {showAddForm ? (
            <>
              <FiX size={18} /> Close
            </>
          ) : (
            <>
              <FiPlus size={18} /> New role
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <RoleFormPanel
          title="New role"
          data={newRole}
          setData={setNewRole}
          onSave={handleAdd}
          onCancel={() => {
            setNewRole({ ...EMPTY_ROLE });
            setShowAddForm(false);
          }}
          saveLabel="Create role"
        />
      )}

      {editRole && (
        <RoleFormPanel
          title={`Edit: ${editRole.name}`}
          data={editRole}
          setData={setEditRole}
          onSave={handleUpdate}
          onCancel={() => setEditRole(null)}
          saveLabel="Save"
        />
      )}

      {loading && (
        <div className="roles-page__state">
          <div className="roles-page__spinner" />
          <p>Loading roles...</p>
        </div>
      )}

      {error && (
        <div className="roles-page__error" role="alert">
          Error: {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      {!loading && !error && filteredRoles.length === 0 && (
        <div className="roles-page__state">
          <FiShield size={40} strokeWidth={1.5} opacity={0.35} />
          <h3>No roles found</h3>
          <p>
            {searchTerm
              ? "Change your search or add a new role."
              : "Create your first role above."}
          </p>
        </div>
      )}

      {!loading && !error && filteredRoles.length > 0 && (
        <>
          <div className="roles-grid">
            {currentRoles.map((role) => {
              const granted = countGranted(role);
              const pct = Math.round((granted / PERMISSIONS.length) * 100);

              return (
                <article key={role.id} className="roles-card">
                  <div className="roles-card__top">
                    <div className="roles-card__title-row">
                      <h3 className="roles-card__title">
                        <span className="roles-card__title-badge">
                          <FiShield size={18} />
                        </span>
                        {role.name}
                      </h3>
                      <span className="roles-card__id">#{role.id}</span>
                    </div>
                    <p className="roles-card__desc">
                      {role.description || "No description provided"}
                    </p>
                    <div className="roles-card__meter">
                      <div className="roles-card__meter-label">
                        <span>Active permissions</span>
                        <span>
                          {granted}/{PERMISSIONS.length}
                        </span>
                      </div>
                      <div className="roles-card__meter-bar">
                        <div
                          className="roles-card__meter-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="roles-card__chips">
                    {PERMISSIONS.map((perm) => {
                      const on = Number(role[perm.key]) === 1;
                      return (
                        <span
                          key={perm.key}
                          className={`roles-chip${on ? " roles-chip--on" : " roles-chip--off"}`}
                        >
                          <perm.Icon size={12} />
                          {perm.label}
                        </span>
                      );
                    })}
                  </div>

                  <div className="roles-card__footer">
                    <button
                      type="button"
                      onClick={() => {
                        setEditRole({ ...role });
                        setShowAddForm(false);
                      }}
                      className="roles-action-btn roles-action-btn--save"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(role.id, role.name)}
                      className="roles-action-btn roles-action-btn--danger"
                      aria-label="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav className="roles-pagination" aria-label="Pagination">
              <button
                type="button"
                className="roles-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                ‹
              </button>
              {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span key={`e-${idx}`} className="roles-page-ellipsis">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={`roles-page-btn${currentPage === p ? " is-active" : ""}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                type="button"
                className="roles-page-btn"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                ›
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Role;
