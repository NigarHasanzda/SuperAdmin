import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, updateUser } from "../../Redux/Features/AllUserSlice";

const Persons = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.users);
console.log(list);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", surname: "", email: "" });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Bu istifadəçini silmək istədiyinizə əminsiniz?")) {
      dispatch(deleteUser(id));
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setEditData({ name: user.name, surname: user.surname, email: user.email });
  };

  const handleUpdate = () => {
    dispatch(updateUser({ id: editId, userData: editData }));
    setEditId(null);
  };

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>İstifadəçilər (SuperAdmin)</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Email</th>
            <th>Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          {list.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editId === user.id ? (
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editId === user.id ? (
                  <input
                    value={editData.surname}
                    onChange={(e) => setEditData({ ...editData, surname: e.target.value })}
                  />
                ) : (
                  user.surname
                )}
              </td>
              <td>
                {editId === user.id ? (
                  <input
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editId === user.id ? (
                  <button onClick={handleUpdate}>Yenilə</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>Redaktə et</button>
                    <button onClick={() => handleDelete(user.id)} style={{ marginLeft: "5px", color: "red" }}>
                      Sil
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Persons;
