import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiLink,
  FiPlus,
  FiImage,
  FiUpload,
  FiDownload,
  FiSave,
  FiTrash2,
  FiTarget,
} from "react-icons/fi";
import {
  fetchAds,
  addAd,
  uploadAdImage,
  deleteAd,
  downloadFile,
  updateAd,
} from "../../Redux/Features/AdsSlice";
import "./Ads.css";

const AdsList = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.ads);
  const { token, user } = useSelector((state) => state.auth);

  const [newAd, setNewAd] = useState({ link: "", userId: user?.id || 1 });
  const [files, setFiles] = useState({});
  const [locales, setLocales] = useState({});
  const [editedAds, setEditedAds] = useState({});

  useEffect(() => {
    if (token) dispatch(fetchAds());
  }, [token, dispatch]);

  const stats = useMemo(() => {
    const active = list.filter((a) => Number(a.isActive) === 1).length;
    return {
      total: list.length,
      active,
      inactive: list.length - active,
    };
  }, [list]);

  const handleAddAd = () => {
    if (!newAd.link.trim()) return alert("Enter a link!");
    dispatch(addAd({ ...newAd, userId: user?.id, isActive: 1 }));
    setNewAd({ link: "", userId: user?.id || 1 });
  };

  const handleUploadImage = (id) => {
    if (!files[id]) return alert("Choose a file!");
    const locale = locales[id] || "AZ";
    dispatch(uploadAdImage({ id, file: files[id], locale }))
      .unwrap()
      .then(() => {
        setFiles((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      })
      .catch(console.error);
  };

  const handleDownload = (filename) => {
    dispatch(downloadFile(filename));
  };

  const handleEditField = (id, field, value) => {
    setEditedAds((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const hasChanges = (adId) =>
    editedAds[adId] && Object.keys(editedAds[adId]).length > 0;

  const handleUpdateAd = (ad) => {
    const updatedFields = editedAds[ad.id];
    if (!updatedFields) return;
    dispatch(updateAd({ id: ad.id, updatedFields }))
      .unwrap()
      .then(() => {
        setEditedAds((prev) => {
          const copy = { ...prev };
          delete copy[ad.id];
          return copy;
        });
      });
  };

  const statusClass = (isActive) =>
    Number(isActive) === 1 ? "is-active" : "is-inactive";

  return (
    <div className="ads-page">
      <header className="ads-page__header">
        <div className="ads-page__header-text">
          <h2>Ad campaigns</h2>
          <p>
            Manage banner links, status, and locale images.
          </p>
        </div>
        <div className="ads-page__stats">
          <div className="ads-stat">
            <div className="ads-stat__value">{stats.total}</div>
            <div className="ads-stat__label">Total</div>
          </div>
          <div className="ads-stat ads-stat--active">
            <div className="ads-stat__value">{stats.active}</div>
            <div className="ads-stat__label">Active</div>
          </div>
          <div className="ads-stat ads-stat--inactive">
            <div className="ads-stat__value">{stats.inactive}</div>
            <div className="ads-stat__label">Inactive</div>
          </div>
        </div>
      </header>

      <section className="ads-create" aria-label="New ad">
        <div className="ads-create__field">
          <label htmlFor="new-ad-link">Destination URL</label>
          <div className="ads-create__input-wrap">
            <FiLink size={18} aria-hidden />
            <input
              id="new-ad-link"
              type="url"
              placeholder="https://example.com/campaign"
              value={newAd.link}
              onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
              className="ads-create__input"
              onKeyDown={(e) => e.key === "Enter" && handleAddAd()}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddAd}
          className="ads-create__submit"
          disabled={loading}
        >
          <FiPlus size={18} />
          Add ad
        </button>
      </section>

      {error && (
        <div className="ads-page__error" role="alert">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="ads-page__state">
          <div className="ads-page__spinner" />
          <p>Loading ads...</p>
        </div>
      )}

      {!loading && !error && list.length === 0 && (
        <div className="ads-page__state">
          <FiTarget size={40} strokeWidth={1.5} opacity={0.35} />
          <h3>No ads yet</h3>
          <p>Create your first campaign using the form above.</p>
        </div>
      )}

      {!loading && !error && list.length > 0 && (
        <ul className="ads-grid">
          {list.map((ad) => {
            const isActive =
              editedAds[ad.id]?.isActive ?? ad.isActive;
            const dirty = hasChanges(ad.id);

            return (
              <li
                key={ad.id}
                className={`ads-card${dirty ? " ads-card--dirty" : ""}`}
              >
                <div className="ads-card__top">
                  <div className="ads-card__id">
                    ID <span>#{ad.id}</span>
                    {dirty && (
                      <span className="ads-dirty-badge"> Unsaved</span>
                    )}
                  </div>
                  <select
                    value={isActive}
                    onChange={(e) =>
                      handleEditField(ad.id, "isActive", Number(e.target.value))
                    }
                    className={`ads-status-select ${statusClass(isActive)}`}
                    aria-label="Ad status"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>

                <div className="ads-card__media">
                  {ad.pictureUrl ? (
                    <>
                      <img src={ad.pictureUrl} alt="" />
                      <button
                        type="button"
                        onClick={() => handleDownload(ad.pictureUrl)}
                        className="ads-card__download"
                      >
                        <FiDownload size={14} />
                        Download
                      </button>
                    </>
                  ) : (
                    <div className="ads-card__media-empty">
                      <FiImage size={32} />
                      <span>No image set</span>
                    </div>
                  )}
                </div>

                <div className="ads-card__body">
                  <div className="ads-field">
                    <label htmlFor={`link-${ad.id}`}>Link URL</label>
                    <input
                      id={`link-${ad.id}`}
                      type="url"
                      value={editedAds[ad.id]?.link ?? ad.link}
                      onChange={(e) =>
                        handleEditField(ad.id, "link", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="ads-upload">
                  <div className="ads-upload__row">
                    <label
                      className={`ads-file-label${files[ad.id] ? " has-file" : ""}`}
                    >
                      <FiUpload size={14} />
                      {files[ad.id]?.name || "Choose image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setFiles((prev) => ({
                            ...prev,
                            [ad.id]: e.target.files?.[0],
                          }))
                        }
                      />
                    </label>
                    <select
                      value={locales[ad.id] || "AZ"}
                      onChange={(e) =>
                        setLocales((prev) => ({
                          ...prev,
                          [ad.id]: e.target.value,
                        }))
                      }
                      className="ads-locale-select"
                      aria-label="Dil"
                    >
                      <option value="AZ">AZ</option>
                      <option value="EN">EN</option>
                      <option value="RU">RU</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleUploadImage(ad.id)}
                      className="ads-btn-icon ads-btn-icon--primary"
                      disabled={!files[ad.id]}
                    >
                      <FiUpload size={14} />
                      Upload
                    </button>
                  </div>
                </div>

                <div className="ads-card__footer">
                  <button
                    type="button"
                    onClick={() => handleUpdateAd(ad)}
                    className="ads-btn-icon ads-btn-icon--save"
                    disabled={!dirty}
                  >
                    <FiSave size={14} />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this ad?")) {
                        dispatch(deleteAd(ad.id));
                      }
                    }}
                    className="ads-btn-icon ads-btn-icon--danger"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdsList;
