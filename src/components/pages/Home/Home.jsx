import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../Redux/Features/AllUserSlice";
import {
  fetchRoles,
  addRole,
  updateRole,
  deleteRole,
} from "../../Redux/Features/AllRole";

import {
  fetchAds,

  deleteAd
} from "../../Redux/Features/AdsSlice";
import { Link } from "react-router";

const Home = () => {
  const dispatch = useDispatch();
  const { token , user } = useSelector((state) => state.auth);
console.log(user);

  // Users state
  const { list: users, loading: usersLoading, error: usersError } = useSelector((state) => state.users);
  
  // Roles state
  const { list: roles, loading: rolesLoading, error: rolesError } = useSelector((state) => state.roles);


  // Ads state
  const { list: ads, loading: adsLoading, error: adsError } = useSelector((state) => state.ads);
console.log(ads);

  // Local state for role management
  const [newRoleName, setNewRoleName] = useState("");
  const [editRoleId, setEditRoleId] = useState(null);
  const [editRoleName, setEditRoleName] = useState("");

  // Local state for ad management
  const [newAdTitle, setNewAdTitle] = useState("");
  const [editAdId, setEditAdId] = useState(null);
  const [editAdTitle, setEditAdTitle] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers(token));
      dispatch(fetchRoles(token));
      dispatch(fetchAds(token));
    }
  }, [token, dispatch]);

  // --- Role handlers ---
  const handleAddRole = () => {
    if (!newRoleName.trim()) return alert("Rol adı boş ola bilməz");
    dispatch(addRole({ token, roleData: { name: newRoleName } }));
    setNewRoleName("");
  };

  const handleEditRole = (role) => {
    setEditRoleId(role.id);
    setEditRoleName(role.name);
  };

  const handleUpdateRole = () => {
    if (!editRoleName.trim()) return alert("Rol adı boş ola bilməz");
    dispatch(updateRole({ token, id: editRoleId, roleData: { name: editRoleName } }));
    setEditRoleId(null);
    setEditRoleName("");
  };

  const handleDeleteRole = (id) => {
    if (window.confirm("Rolu silmək istədiyinizə əminsiniz?")) {
      dispatch(deleteRole({ token, id }));
    }
  };

  // --- Ads handlers ---
  const handleAddAd = () => {
    if (!newAdTitle.trim()) return alert("Reklam başlığı boş ola bilməz");
    dispatch(addAd({ token, adData: { title: newAdTitle } }));
    setNewAdTitle("");
  };

  const handleEditAd = (ad) => {
    setEditAdId(ad.id);
    setEditAdTitle(ad.title);
  };

  const handleUpdateAd = () => {
    if (!editAdTitle.trim()) return alert("Reklam başlığı boş ola bilməz");
    dispatch(updateAd({ token, id: editAdId, adData: { title: editAdTitle } }));
    setEditAdId(null);
    setEditAdTitle("");
  };

  const handleDeleteAd = (id) => {
    if (window.confirm("Reklamı silmək istədiyinizə əminsiniz?")) {
      dispatch(deleteAd({ token, id }));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Users Section */}
      <h1>Bütün İstifadəçilər (Super Admin)</h1>
      {usersLoading ? <p>Yüklənir...</p> : usersError ? <p style={{ color: "red" }}>{usersError}</p> : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>{u.name} {u.surname} — {u.email} — {u.phone}</li>
          ))}
        </ul>
      )}



      {/* Roles Section */}
      <h1>Rollar</h1>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Yeni rol adı"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
        />
        <button onClick={handleAddRole} style={{ marginLeft: "8px" }}>Əlavə et</button>
      </div>
      {rolesLoading ? <p>Yüklənir...</p> : rolesError ? <p style={{ color: "red" }}>{rolesError}</p> : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Adı</th>
              <th>SuperAdmin</th>
              <th>Admin</th>
              <th>Person</th>
              <th>Business</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>
                  {editRoleId === r.id ? (
                    <input value={editRoleName} onChange={(e) => setEditRoleName(e.target.value)} />
                  ) : (
                    r.name
                  )}
                </td>
                <td>{r.superAdmin}</td>
                <td>{r.admin}</td>
                <td>{r.person}</td>
                <td>{r.business}</td>
                <td>
                  {editRoleId === r.id ? (
                    <button onClick={handleUpdateRole} style={{ marginRight: "8px" }}>Yadda saxla</button>
                  ) : (
                    <button onClick={() => handleEditRole(r)} style={{ marginRight: "8px" }}>Redaktə et</button>
                  )}
                  <button onClick={() => handleDeleteRole(r.id)} style={{ color: "red" }}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Ads Section */}
      <h1>Reklamlar</h1>

<h1><a href="/ads">ads</a></h1>
<h1><a href="/category">category</a></h1>
<h1><a href="/roles">role</a></h1>
<h1><a href="/persons">person</a></h1>
<h1><a href="/businesses">business</a></h1>
<h1><a href="/products">products</a></h1>
<h1><a href="/notification"> notification</a></h1>
<h1><a href="/profiles">profiles</a></h1>
<h1><a href="/report">report</a></h1>
<h1><a href="/wheel">wheel</a></h1>
    </div>
  );
};

export default Home;
