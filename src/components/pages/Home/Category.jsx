import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FiSearch,
  FiPlus,
  FiTag,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiLayers,
} from "react-icons/fi";
import {
  fetchCategories,
  fetchLocalizedCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../Redux/Features/CategorySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Category.css";

const LANG_OPTIONS = [
  { value: "az", label: "AZ" },
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
];

const CategoryCard = ({
  category,
  editingId,
  editName,
  setEditName,
  handleEdit,
  handleUpdate,
  handleDelete,
  getLocalizedName,
  langLabel,
}) => {
  const isEditing = editingId === category.id;
  const localizedName =
    getLocalizedName(category.id, category.name) || category.name;
  const showDefaultHint =
    category.name &&
    localizedName !== category.name &&
    !isEditing;

  return (
    <article
      className={`cat-card${isEditing ? " cat-card--editing" : ""}`}
    >
      <div className="cat-card__accent" aria-hidden />
      <div className="cat-card__body">
        <div className="cat-card__meta">
          <div className="cat-card__id">
            ID <span>#{category.id}</span>
          </div>
          {isEditing && <span className="cat-card__badge">Redaktə</span>}
        </div>

        {isEditing ? (
          <>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              className="cat-card__edit-input"
              placeholder="Kateqoriya adı"
              autoFocus
            />
          </>
        ) : (
          <h3 className="cat-card__title">
            <span className="cat-card__title-icon">
              <FiTag size={16} />
            </span>
            <span>{localizedName}</span>
          </h3>
        )}

        {showDefaultHint && (
          <p className="cat-card__default">
            Bazada: <em>{category.name}</em> · Dil: {langLabel}
          </p>
        )}
      </div>

      <div className="cat-card__actions">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleUpdate}
              className="cat-btn cat-btn--primary"
              disabled={!editName.trim()}
            >
              <FiSave size={14} />
              Saxla
            </button>
            <button
              type="button"
              onClick={() => handleEdit({ id: null })}
              className="cat-btn cat-btn--ghost"
            >
              <FiX size={14} />
              Ləğv
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => handleEdit(category)}
              className="cat-btn cat-btn--ghost"
            >
              <FiEdit2 size={14} />
              Redaktə
            </button>
            <button
              type="button"
              onClick={() => handleDelete(category.id, localizedName)}
              className="cat-btn cat-btn--danger"
              aria-label="Sil"
            >
              <FiTrash2 size={14} />
            </button>
          </>
        )}
      </div>
    </article>
  );
};

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

  useEffect(() => {
    if (token) {
      dispatch(fetchCategories());
      dispatch(fetchLocalizedCategories(lang));
    }
  }, [token, lang, dispatch]);

  const getLocalizedName = (id, defaultName) => {
    if (!localized) return defaultName;
    const loc = localized.find((cat) => cat.id === id);
    return loc ? loc.name : defaultName;
  };

  const langLabel =
    LANG_OPTIONS.find((o) => o.value === lang)?.label ?? lang.toUpperCase();

  const handleAdd = async () => {
    if (!newName.trim()) return toast.error("Kateqoriya adı boş ola bilməz!");
    try {
      await dispatch(addCategory({ name: newName })).unwrap();
      toast.success(`"${newName}" əlavə edildi`);
      setNewName("");
      dispatch(fetchLocalizedCategories(lang));
    } catch (err) {
      toast.error(`Xəta: ${err}`);
    }
  };

  const handleEdit = (category) => {
    if (category.id === null || editingId === category.id) {
      setEditingId(null);
      setEditName("");
    } else {
      setEditingId(category.id);
      setEditName(getLocalizedName(category.id, category.name));
    }
  };

  const handleUpdate = async () => {
    if (!editName.trim()) return toast.error("Kateqoriya adı boş ola bilməz!");
    try {
      await dispatch(
        updateCategory({ id: editingId, name: editName, lang })
      ).unwrap();
      toast.success("Yeniləndi");
      setEditingId(null);
      setEditName("");
      dispatch(fetchLocalizedCategories(lang));
    } catch (err) {
      toast.error(`Xəta: ${err}`);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" silinsin?`)) return;
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success(`"${name}" silindi`);
    } catch (err) {
      toast.error(`Xəta: ${err}`);
    }
  };

  const filteredList = useMemo(() => {
    if (!searchName.trim()) return list;
    const q = searchName.toLowerCase();
    return list.filter((cat) =>
      (getLocalizedName(cat.id, cat.name) || cat.name)
        .toLowerCase()
        .includes(q)
    );
  }, [list, searchName, localized, lang]);

  return (
    <div className="cat-page">
      <ToastContainer position="top-right" autoClose={2200} theme="colored" />

      <header className="cat-page__header">
        <div>
          <h2>Məhsul kateqoriyaları</h2>
          <p>
            Kateqoriya adlarını idarə edin, dillər arası lokalizasiyanı seçin və
            kataloqu axtarışla süzün.
          </p>
        </div>
        <div className="cat-page__stats">
          <div className="cat-stat">
            <div className="cat-stat__value">{list.length}</div>
            <div className="cat-stat__label">Ümumi</div>
          </div>
          <div className="cat-stat">
            <div className="cat-stat__value">{filteredList.length}</div>
            <div className="cat-stat__label">Göstərilən</div>
          </div>
          <div className="cat-stat cat-stat--lang">
            <div className="cat-stat__value">{langLabel}</div>
            <div className="cat-stat__label">Dil</div>
          </div>
        </div>
      </header>

      <div className="cat-toolbar">
        <div className="cat-toolbar__row">
          <div className="cat-search">
            <FiSearch size={18} aria-hidden />
            <input
              type="search"
              placeholder="Kateqoriya adı ilə axtar..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              aria-label="Axtarış"
            />
          </div>
          <div className="cat-lang" role="group" aria-label="Dil">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`cat-lang__btn${lang === opt.value ? " is-active" : ""}`}
                onClick={() => setLang(opt.value)}
                disabled={loading}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cat-toolbar__row">
          <div className="cat-create">
            <div className="cat-create__field">
              <label htmlFor="new-category">Yeni kateqoriya</label>
              <div className="cat-create__input-wrap">
                <FiPlus size={18} aria-hidden />
                <input
                  id="new-category"
                  type="text"
                  placeholder="Məs: Yağlar və mayelər"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  className="cat-create__input"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="cat-create__submit"
              disabled={loading || !newName.trim()}
            >
              <FiPlus size={18} />
              Əlavə et
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="cat-page__error" role="alert">
          Xəta: {error}
        </div>
      )}

      {loading && (
        <div className="cat-page__state">
          <div className="cat-page__spinner" />
          <p>Kateqoriyalar yüklənir...</p>
        </div>
      )}

      {!loading && !error && filteredList.length === 0 && (
        <div className="cat-page__state">
          <FiLayers size={40} strokeWidth={1.5} opacity={0.35} />
          <h3>Kateqoriya tapılmadı</h3>
          <p>
            {searchName
              ? "Axtarışı dəyişin və ya yeni kateqoriya əlavə edin."
              : "Yuxarıdakı formdan ilk kateqoriyanı yaradın."}
          </p>
        </div>
      )}

      {!loading && !error && filteredList.length > 0 && (
        <div className="cat-grid">
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
              langLabel={langLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
