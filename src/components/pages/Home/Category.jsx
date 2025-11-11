import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  fetchLocalizedCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../Redux/Features/CategorySlice";
import "./Category.css";

// 🔹 Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ===========================================
// Alt-Komponent: CategoryCard
// ===========================================
const CategoryCard = ({
  category,
  editingId,
  editName,
  setEditName,
  handleEdit,
  handleUpdate,
  handleDelete,
  getLocalizedName,
}) => {
  const isEditing = editingId === category.id;
  const localizedName =
    getLocalizedName(category.id, category.name) || category.name;

  const handleCancelEdit = () => {
    handleEdit({ id: null });
  };

  return (
    <div key={category.id} className="category-card">
      <div className="category-info">
        <div className="category-id">ID: {category.id}</div>
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleUpdate()}
            className="input-field edit-input-field"
            placeholder="Yeni adı daxil edin"
            autoFocus
          />
        ) : (
          <h3 className="category-name" title={localizedName}>
            🏷️ {localizedName}
          </h3>
        )}
      </div>

      <div className="category-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="btn btn-primary btn-save"
              disabled={!editName.trim()}
            >
              💾 Saxla
            </button>
            <button
              onClick={handleCancelEdit}
              className="btn btn-edit btn-cancel"
            >
              ✖️ Ləğv et
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleEdit(category)}
              className="btn btn-edit"
            >
              ✏️ Redaktə
            </button>
            <button
              onClick={() => handleDelete(category.id, localizedName)}
              className="btn btn-danger"
            >
              🗑️ Sil
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ===========================================
// Əsas Komponent: Category
// ===========================================
const Category = () => {
  const dispatch = useDispatch();
  const { list, localized, loading, error } = useSelector(
    (state) => state.categories
  );
  const { token } = useSelector((state) => state.auth);

  const [newName, setNewName] = useState("");
  const [lang, setLang] = useState("az");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [searchName, setSearchName] = useState("");

  // 🔹 Kateqoriyaları və lokal adları yüklə
  useEffect(() => {
    if (token) {
      dispatch(fetchCategories());
      dispatch(fetchLocalizedCategories(lang));
    }
  }, [token, lang, dispatch]);

  // 🔹 Lokal ad tapmaq funksiyası
  const getLocalizedName = (id, defaultName) => {
    if (!localized) return defaultName; // localized undefined olsa
    const loc = localized.find((cat) => cat.id === id);
    return loc ? loc.name : defaultName;
  };

  // 🔹 Yeni kateqoriya əlavə et
  const handleAdd = async () => {
    if (!newName.trim()) return toast.error("Kateqoriya adı boş ola bilməz!");
    try {
      await dispatch(addCategory({ name: newName })).unwrap();
      toast.success(`"${newName}" kateqoriyası əlavə edildi!`);
      setNewName("");
    } catch (err) {
      toast.error(`Əlavə edilərkən xəta: ${err}`);
    }
  };

  // 🔹 Redaktəyə başla / Ləğv et
  const handleEdit = (category) => {
    if (category.id === null || editingId === category.id) {
      setEditingId(null);
      setEditName("");
    } else {
      setEditingId(category.id);
      setEditName(getLocalizedName(category.id, category.name));
    }
  };

  // 🔹 Redaktəni saxla
  const handleUpdate = async () => {
    if (!editName.trim()) return toast.error("Kateqoriya adı boş ola bilməz!");
    try {
      await dispatch(updateCategory({ id: editingId, name: editName, lang })).unwrap();
      toast.success("Kateqoriya uğurla yeniləndi!");
      setEditingId(null);
      setEditName("");
    } catch (err) {
      toast.error(`Yenilənərkən xəta: ${err}`);
    }
  };

  // 🔹 Kateqoriya sil
  const handleDelete = async (id, name) => {
    if (window.confirm(`"${name}" kateqoriyasını silmək istədiyinizə əminsiniz?`)) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success(`"${name}" kateqoriyası silindi!`);
      } catch (err) {
        toast.error(`Silinərkən xəta: ${err}`);
      }
    }
  };

  // 🔹 Name-a görə canlı axtarış
  const filteredList = searchName
    ? list.filter((cat) =>
        (getLocalizedName(cat.id, cat.name) || cat.name)
          .toLowerCase()
          .includes(searchName.toLowerCase())
      )
    : list;

  return (
    <div className="category-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="category-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Kateqoriya adı ilə axtar"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="add-category-form">
          <input
            type="text"
            placeholder="Yeni kateqoriya adı..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            className="input-field new-category-input"
          />
          <button
            onClick={handleAdd}
            className="btn btn-primary"
            disabled={loading || !newName.trim()}
          >
            ✨ Əlavə Et
          </button>
        </div>

        <div className="language-selector">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="language-select"
            disabled={loading}
          >
            <option value="az">🇦🇿 Azərbaycanca</option>
            <option value="en">🇺🇸 İngiliscə</option>
            <option value="ru">🇷🇺 Rusca</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Kateqoriyalar yüklənir...</p>
        </div>
      )}
      {error && <div className="error-state">⚠️ Xəta: {error}</div>}

      {!loading && !error && (
        <>
          {filteredList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>Heç bir kateqoriya tapılmadı</h3>
              <p>Kateqoriyaları yuxarıdakı forma ilə əlavə edə bilərsiniz.</p>
            </div>
          ) : (
            <div className="categories-grid">
              {filteredList.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  editingId={editingId}
                  editName={editName}
                  setEditName={setEditName}
                  handleEdit={handleEdit}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  getLocalizedName={getLocalizedName}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Category;
