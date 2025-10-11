import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const [newAd, setNewAd] = useState({ link: "", userId: 1 });
  const [files, setFiles] = useState({});
  const [locales, setLocales] = useState({});

  useEffect(() => {
    if (token) {
      dispatch(fetchAds());
    }
  }, [dispatch, token]);

  const handleAddAd = () => {
    if (!newAd.link.trim()) return alert("Link daxil edin!");
    const adData = { ...newAd, userId: user?.id || 1 };
    dispatch(addAd(adData));
    setNewAd({ link: "", userId: 1 });
  };

  const handleUploadImage = (id) => {
    if (!files[id]) return alert("Fayl seçin!");
    const locale = locales[id] || "AZ";
    dispatch(uploadAdImage({ id, file: files[id], locale }));
  };

  const handleDownload = (filename) => {
    dispatch(downloadFile(filename));
  };

  const handleToggleActive = (ad) => {
    const updatedAd = {
      ...ad,
      isActive: ad.isActive ? 0 : 1,
    };
    dispatch(updateAd(updatedAd));
  };

  return (
    <div className="ads-container">
      <div className="ads-header">
        <h1 className="ads-title">📢 Reklam İdarəetməsi</h1>
        <p className="ads-subtitle">Bütün reklamları idarə edin, şəkil yükləyin və statuslarını dəyişin</p>
      </div>

      <div className="add-ad-form">
        <div className="form-group">
          <div className="form-input">
            <label className="form-label">🔗 Reklam Linki</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={newAd.link}
              onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
              className="input-field"
            />
          </div>
          <button onClick={handleAddAd} className="btn btn-primary" disabled={loading}>
            ✨ Reklam Əlavə Et
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Reklamlar yüklənir...</p>
        </div>
      )}

      {error && <div className="error-state">⚠️ Xəta: {error}</div>}

      {!loading && !error && (
        <>
          {list.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3>Hələ heç bir reklam yoxdur</h3>
              <p>Yuxarıdakı formu istifadə edərək ilk reklamınızı əlavə edin.</p>
            </div>
          ) : (
            <ul className="ads-list">
              {list.map((ad) => (
                <li key={ad.id} className="ad-card">
                  <div className="ad-header-info">
                    <div className="ad-link">
                      <h3>🌐 Reklam Linki</h3>
                      <p>{ad.link}</p>
                    </div>
                    <div className={`ad-status ${ad.isActive ? 'status-active' : 'status-inactive'}`}>
                      {ad.isActive ? '🟢 Aktiv' : '🔴 Deaktiv'}
                    </div>
                  </div>

                  <div className="ad-image-section">
                    <div className="ad-image-preview">
                      {ad.pictureUrl ? (
                        <>
                          <img
                            src={`https://p.kaktusbooking.app/website/api/files/download/${ad.pictureUrl}`}
                            alt="Reklam şəkli"
                            className="ad-image"
                          />
                          <button
                            onClick={() => handleDownload(ad.pictureUrl)}
                            className="btn btn-success"
                          >
                            📥 Şəkli Endir
                          </button>
                        </>
                      ) : (
                        <div className="image-upload-area">
                          <div className="no-image">🖼️</div>
                          <p className="image-upload-text">Şəkil yüklənməyib</p>
                        </div>
                      )}
                    </div>

                    <div className="upload-controls">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setFiles((prev) => ({ ...prev, [ad.id]: e.target.files[0] }))
                        }
                        className="file-input"
                      />
                      <select
                        value={locales[ad.id] || "AZ"}
                        onChange={(e) =>
                          setLocales((prev) => ({ ...prev, [ad.id]: e.target.value }))
                        }
                        className="locale-select"
                      >
                        <option value="AZ">🇦🇿 AZ</option>
                        <option value="EN">🇺🇸 EN</option>
                        <option value="RU">🇷🇺 RU</option>
                      </select>
                      <button
                        onClick={() => handleUploadImage(ad.id)}
                        className="btn btn-primary"
                        disabled={!files[ad.id]}
                      >
                        📤 Şəkil Yüklə
                      </button>
                    </div>
                  </div>

                  <div className="ad-actions">
                    <button
                      onClick={() => handleToggleActive(ad)}
                      className={`btn ${ad.isActive ? 'btn-warning' : 'btn-secondary'}`}
                    >
                      {ad.isActive ? '⏹️ Deaktiv Et' : '✅ Aktiv Et'}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Bu reklamı silməkdə əminsiniz?')) {
                          dispatch(deleteAd(ad.id));
                        }
                      }}
                      className="btn btn-danger"
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default AdsList;
