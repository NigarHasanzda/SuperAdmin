import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRoles, addRole, updateRole, deleteRole } from "../../Redux/Features/AllRole";

const permissions = [
  "superAdmin",
  "admin",
  "person",
  "professional",
  "business",
  "businessAdmin",
  "driverAdmin",
];

const Role = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.roles);

  const [editRole, setEditRole] = useState(null);
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

  useEffect(() => {
    dispatch(fetchRoles());
  }, []);

  // Live search üçün effect
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRoles(list);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = list.filter(
        (r) => r.name.toLowerCase().includes(term) || r.description.toLowerCase().includes(term)
      );
      setFilteredRoles(filtered);
    }
  }, [searchTerm, list]);

  const handleToggleEdit = (perm) => {
    setEditRole({ ...editRole, [perm]: editRole[perm] ? 0 : 1 });
  };

const handleToggleNew = (perm) => {
  setNewRole({ ...newRole, [perm]: newRole[perm] ? 0 : 1 });
};

  const handleUpdate = () => {
    if (!editRole.name.trim()) return alert("Rol adı boş ola bilməz");
    dispatch(updateRole(editRole));
    setEditRole(null);
  };

  const handleAdd = () => {
    if (!newRole.name.trim()) return alert("Rol adı boş ola bilməz");
    dispatch(addRole(newRole));
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
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🛡️ Rol İdarəetməsi</h1>

      {/* Axtarış inputu */}
      <input
        placeholder="Rol adı və ya təsvir üzrə axtar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 15, padding: 5, width: "100%" }}
      />


      {loading && <p>Yüklənir...</p>}
      {error && <p style={{ color: "red" }}>{JSON.stringify(error)}</p>}

      {/* Mövcud rollar */}
      {(filteredRoles || []).map((role) => (
        <div key={role.id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 5 }}>
          {editRole?.id === role.id ? (
            <>
              <input
                value={editRole.name}
                onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                style={{ marginRight: 10 }}
              />
              <input
                value={editRole.description}
                onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
                style={{ marginRight: 10 }}
              />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 5 }}>
                {permissions.map((perm) => (
                  <label key={perm}>
                    <input
                      type="checkbox"
                      checked={editRole[perm] === 1}
                      onChange={() => handleToggleEdit(perm)}
                    />{" "}
                    {perm}
                  </label>
                ))}
              </div>
              <button onClick={handleUpdate} style={{ marginTop: 10 }}>Yenilə</button>
              <button onClick={() => setEditRole(null)} style={{ marginLeft: 10 }}>Ləğv et</button>
            </>
          ) : (
            <>
              <p><strong>{role.name}</strong> - {role.description}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {permissions.map((perm) => (
                  <span key={perm} style={{ fontSize: 12 }}>
                    {perm}: {role[perm] ? "✅" : "❌"}
                  </span>
                ))}
              </div>
              <button onClick={() => setEditRole(role)} style={{ marginTop: 5 }}>Düzəliş et</button>
              <button
                onClick={() => dispatch(deleteRole(role.id))}
                style={{ marginLeft: 5, color: "red" }}
              >
                Sil
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Role;
