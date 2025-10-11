import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  fetchLocalizedCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  searchCategoryById,
  clearSearchResult,
} from "../../Redux/Features/CategorySlice";
import "./Category.css";

const Category = () => {
  const dispatch = useDispatch();
    const { list, localized, searchResult, loading, error } = useSelector((state) => state.categories);
  const { token } = useSelector((state) => state.auth);

  const [newName, setNewName] = useState("");
  const [lang, setLang] = useState("az");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    console.log("Category component mounted. Token:", token ? "Available" : "Missing");
    if (token) {
      dispatch(fetchCategories());
      dispatch(fetchLocalizedCategories(lang));
    }
  }, [dispatch, lang, token]);

  const handleAdd = () => {
    if (!newName.trim()) {
      alert("Kateqoriya adı boş ola bilməz!");
      return;
    }
    if (!token) {
      alert("Token mövcud deyil. Yenidən daxil olun.");
      return;
    }
    dispatch(addCategory({ name: newName }));
    setNewName("");
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditName(getLocalizedName(category.id, category.name));
  };

  const handleUpdate = () => {
    if (!editName.trim()) {
      alert("Kateqoriya adı boş ola bilməz!");
      return;
    }
    dispatch(updateCategory({ id: editingId, name: editName }));
    setEditingId(null);
    setEditName("");
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`"${name}" kateqoriyasını silmək istədiyinizə əminsiniz?`)) {
      dispatch(deleteCategory(id));
    }
  };

  const handleSearch = () => {
    if (!searchId.trim()) {
      alert("Axtarış üçün ID daxil edin!");
      return;
    }
    if (!token) {
      alert("Token mövcud deyil. Yenidən daxil olun.");
      return;
    }
    console.log("Searching for category with ID:", searchId);
    dispatch(searchCategoryById(searchId)).then((result) => {
      console.log("Search result:", result);
      if (result.payload) {
        setShowSearch(true);
      } else {
        alert("Bu ID ilə kateqoriya tapılmadı!");
        setShowSearch(false);
      }
    }).catch((error) => {
      console.error("Search error:", error);
      alert("Axtarışda xəta baş verdi!");
      setShowSearch(false);
    });
  };

  const handleClearSearch = () => {
    setSearchId("");
    setShowSearch(false);
    // searchResult-u state-dən təmizlə
    dispatch(clearSearchResult());
  };

  const getLocalizedName = (id, defaultName) => {
    const loc = localized.find((cat) => cat.id === id);
    return loc ? loc.name : defaultName;
  };

  const getLanguageLabel = (lang) => {
    const labels = {
      'az': '🇦🇿 Azərbaycanca',
      'en': '🇺🇸 İngiliscə', 
      'ru': '🇷🇺 Rusca'
    };
    return labels[lang] || lang;
  };

  // Göstəriləcək kateqoriyalar - axtarış nəticəsi varsa onu, yoxsa bütün siyahını göstər
  const displayCategories = searchResult ? [searchResult] : list;

  return (
    <div className="category-container">
      {/* Header */}
      <div className="category-header">
        <h1 className="category-title">
          📂 Kateqoriya İdarəetməsi
        </h1>
        <p className="category-subtitle">
          Məhsul kateqoriyalarını əlavə edin, redaktə edin və idarə edin
        </p>
      </div>

      {/* Controls */}
      <div className="category-controls">
        <div className="search-section">
          <div className="search-form">
            <div className="search-controls">
              <input
                type="number"
                placeholder="ID ilə axtarış"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="search-input"
              />
              <button 
                onClick={handleSearch} 
                className="btn-modal btn-search"
                disabled={!searchId || loading}
              >
                🔍 Axtar
              </button>
              <button 
                onClick={handleClearSearch} 
                className="btn-modal btn-clear"
              >
                ❌ Təmizlə
              </button>
            </div>
            {searchResult && showSearch && (
              <div className="search-result-info">
                🎯 ID {searchResult.id} tapıldı: {searchResult.name || 'Ad mövcud deyil'}
              </div>
            )}
          </div>
        </div>

        <div className="add-category-form">
          <div className="form-group">
            <label className="form-label">
              🏷️ Yeni Kateqoriya Adı
            </label>
            <input
              type="text"
              placeholder="Məsələn: Elektronika, Geyim, Kosmetika..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input-field new-category-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              style={{
                color: '#1f2937',
                fontWeight: '500',
                fontSize: '16px'
              }}
            />
          </div>
          <button
            onClick={handleAdd}
            className="btn btn-primary"
            disabled={loading || !newName.trim()}
          >
            ✨ Kateqoriya Əlavə Et
          </button>
        </div>

        <div className="language-selector">
          <label className="form-label">
            🌐 Dil Seçimi
          </label>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="language-select"
          >
            <option value="az">🇦🇿 Azərbaycanca</option>
            <option value="en">🇺🇸 İngiliscə</option>
            <option value="ru">🇷🇺 Rusca</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Kateqoriyalar yüklənir...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          ⚠️ Xəta: {error}
        </div>
      )}

      {/* Categories Grid */}
      {/* Kateqoriya Siyahısı */}
      {!loading && !error && (
        <>
          {(showSearch && searchResult ? [searchResult] : list).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>Hələ heç bir kateqoriya yoxdur</h3>
              <p>Yuxarıdakı formu istifadə edərək ilk kateqoriyanızı əlavə edin və məhsullarınızı təşkil etməyə başlayın</p>
            </div>
          ) : (
            <div className="categories-grid">
              {(showSearch && searchResult ? [searchResult] : list).map((cat) => (
                <div key={cat.id} className="category-card">
                  <div className="category-info">
                    <div className="category-id">
                      🆔 ID: {cat.id}
                    </div>
                    
                    {editingId === cat.id ? (
                      <div className="form-group">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="input-field"
                          onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <h3 className="category-name">
                        🏷️ {getLocalizedName(cat.id, cat.name)}
                      </h3>
                    )}
                  </div>

                  <div className="category-actions">
                    {editingId === cat.id ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          className="btn btn-primary"
                          disabled={!editName.trim()}
                        >
                          💾 Saxla
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditName("");
                          }}
                          className="btn btn-edit"
                        >
                          ✖️ Ləğv et
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(cat)}
                          className="btn btn-edit"
                        >
                          ✏️ Redaktə
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, getLocalizedName(cat.id, cat.name))}
                          className="btn btn-danger"
                        >
                          🗑️ Sil
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Category;
