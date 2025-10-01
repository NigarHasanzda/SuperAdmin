import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  fetchLocalizedCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../Redux/Features/CategorySlice";

const Category = () => {
  const dispatch = useDispatch();
  const { list, localized, loading, error } = useSelector((state) => state.categories);
console.log(list);

  const [newName, setNewName] = useState("");
  const [lang, setLang] = useState("az");

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchLocalizedCategories(lang));
  }, [dispatch, lang]);

  const handleAdd = () => {
    if (!newName.trim()) return alert("Ad boş ola bilməz");
    dispatch(addCategory({ name: newName }));
    setNewName("");
  };

  // list-də adları render edərkən localized array-dən götür
  const getLocalizedName = (id, defaultName) => {
    const loc = localized.find((cat) => cat.id === id);
    return loc ? loc.name : defaultName;
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📂 Kateqoriya İdarəetməsi</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Yeni kateqoriya adı"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleAdd}>Əlavə et</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Language: </label>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="az">Azərbaycanca</option>
          <option value="en">İngiliscə</option>
          <option value="ru">Rusca</option>
        </select>
      </div>

      {loading && <p>Yüklənir...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Bütün kateqoriyalar ({lang})</h2>
      <div>
        {list.map((cat) => (
          <div key={cat.id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 5 }}>
            <p><strong>ID:</strong> {cat.id}</p>
            <p><strong>Ad:</strong> {getLocalizedName(cat.id, cat.name)}</p>
            <button onClick={() => dispatch(deleteCategory(cat.id))} style={{ color: "red" }}>
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
