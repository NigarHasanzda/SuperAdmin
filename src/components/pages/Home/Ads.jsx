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
  // Redux state-i birbaşa istifadə edirik
  const { list: adsList, loading, error } = useSelector((state) => state.ads);
  const { token, user } = useSelector((state) => state.auth);

  const [newAd, setNewAd] = useState({ link: "", userId: user?.id || 1 });
  // Hər reklam üçün fərqli fayl və locale saxlanılır
  const [files, setFiles] = useState({});
  const [locales, setLocales] = useState({});
  const [imageUrls, setImageUrls] = useState({});
  const [editedAds, setEditedAds] = useState({}); // Dəyişiklikləri saxlayır

  const BASE_URL = "http://194.163.173.179:3300";

  // 1. Reklamları yüklə
  useEffect(() => {
    if (token) {
      dispatch(fetchAds());
    }
  }, [token, dispatch]);

  // 2. Blob Preview: Şəkilləri serverdən çəkib URL-ə çevirir (yalnız `adsList` yeniləndikdə)
  useEffect(() => {
    adsList.forEach((ad) => {
      // Yalnız `pictureUrl` varsa və `imageUrls` state-də yoxdursa çək
      if (ad.pictureUrl && !imageUrls[ad.id]) {
        fetch(`${BASE_URL}/api/files/download/${ad.pictureUrl}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            setImageUrls((prev) => ({ ...prev, [ad.id]: url }));
          })
          .catch((err) => {
            console.error(`Error fetching image for ad ${ad.id}:`, err);
            // Şəkil yüklənməsə placeholder göstərmək üçün URL-i null et
            setImageUrls((prev) => ({ ...prev, [ad.id]: null }));
          });
      }
    });

    // Component unmount olarkən yaradılan URL-ləri təmizlə
    return () => {
      Object.values(imageUrls).forEach(URL.revokeObjectURL);
    };
  }, [adsList, token, imageUrls]);

  // Yeni reklam əlavə et
  const handleAddAd = () => {
    if (!newAd.link.trim()) return alert("Link daxil edin!");

    const adToDispatch = { 
      link: newAd.link.trim(), 
      userId: user?.id || 1, 
      isActive: 1 // Default olaraq aktiv əlavə et
    };
    
    dispatch(addAd(adToDispatch))
        .unwrap()
        .then(() => {
            setNewAd({ link: "", userId: user?.id || 1 });
        })
        .catch(err => {
            alert(`Reklam əlavə edilərkən xəta: ${err}`);
        });
  };

  // Şəkil yüklə
  const handleUploadImage = (id) => {
    const file = files[id];
    if (!file) return alert("Fayl seçin!");
    
    const locale = locales[id] || "AZ";

    dispatch(uploadAdImage({ id, file, locale }))
      .unwrap()
      .then((res) => {
        // Redux artıq `pictureUrl`-i yeniləyir, biz sadəcə preview URL-i yeniləməliyik
        alert(`Şəkil uğurla yükləndi: ${res.uuidName}`);
        
        // Yeni blob URL-i çəkmək üçün `imageUrls` state-dən silirik.
        // `useEffect` təkrar işləyib yeni blob URL-i yaradacaq.
        setImageUrls(prev => {
            const copy = {...prev};
            delete copy[id];
            return copy;
        });

        // Seçilmiş faylı təmizlə
        setFiles(prev => {
            const copy = {...prev};
            delete copy[id];
            return copy;
        });

      })
      .catch((err) => {
        alert(`Şəkil yüklənərkən xəta: ${err}`);
      });
  };

  // Faylı endir
  const handleDownload = async (filename) => {
    try {
        const blob = await dispatch(downloadFile(filename)).unwrap();
        if (blob) {
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        }
    } catch (err) {
        alert(`Faylı endirərkən xəta: ${err}`);
    }
  };

  // Dəyişiklikləri state-də saxla
  const handleEditField = (id, field, value) => {
    setEditedAds((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Reklamı yenilə
  const handleUpdateAd = (ad) => {
    const updatedFields = editedAds[ad.id];
    if (!updatedFields || Object.keys(updatedFields).length === 0) {
        return alert("Heç bir dəyişiklik yoxdur!");
    }
    
    // Yalnız fərqli olan sahələri göndərmək üçün filtrləyirik
    const changes = Object.keys(updatedFields).reduce((acc, key) => {
        // `isActive` dəyəri 0 və ya 1 olduğu üçün Number ilə müqayisə edirik
        const isChanged = key === 'isActive' 
            ? Number(ad[key]) !== updatedFields[key]
            : ad[key] !== updatedFields[key];
            
        if (isChanged) {
            acc[key] = updatedFields[key];
        }
        return acc;
    }, {});
    
    if (Object.keys(changes).length === 0) {
        return alert("Daxil edilən dəyərlər mövcud dəyərlərlə eynidir.");
    }
    
    dispatch(updateAd({ id: ad.id, updatedFields: changes }))
      .unwrap()
      .then(() => {
        alert(`Reklam ID ${ad.id} uğurla yeniləndi!`);
        // Redaktə state-ini təmizlə
        setEditedAds((prev) => {
          const copy = { ...prev };
          delete copy[ad.id];
          return copy;
        });
      })
      .catch(err => {
        alert(`Yeniləmə xətası: ${err}`);
      });
  };
  
  // Reklamı sil
  const handleDeleteAd = (id) => {
    if (window.confirm('Bu reklamı silməkdə əminsiniz? Bu əməliyyat geri qaytarılmayacaq!')) {
        dispatch(deleteAd(id))
            .unwrap()
            .then(() => alert(`Reklam ID ${id} uğurla silindi.`))
            .catch(err => alert(`Silmə xətası: ${err}`));
    }
  };

  return (
    <div className="ads-container">
      {/* 📝 Yeni Reklam Formu */}
      <div className="add-ad-form">
        <div className="form-group">
          <div className="form-input">
            <input
              type="url"
              placeholder="Reklam linki: https://example.com"
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

      {/* ⏳ Loading və Error Vəziyyətləri */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Reklamlar yüklənir...</p>
        </div>
      )}

      {error && <div className="error-state">⚠️ Xəta: {error}</div>}

      {/* 📋 Reklam Siyahısı */}
      {!loading && !error && (
        <>
          {adsList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3>Hələ heç bir reklam yoxdur</h3>
              <p>Yuxarıdakı formu istifadə edərək ilk reklamınızı əlavə edin.</p>
            </div>
          ) : (
            <ul className="ads-list">
              {adsList.map((ad) => {
                // Hazırda redaktə edilən dəyərlər
                const currentLink = editedAds[ad.id]?.link ?? ad.link;
                const currentIsActive = editedAds[ad.id]?.isActive ?? ad.isActive;
                const hasChanges = !!editedAds[ad.id] && Object.keys(editedAds[ad.id]).length > 0;
                const fileSelected = !!files[ad.id];

                return (
                  <li key={ad.id} className="ad-card">
                    <div className="ad-header-info">
                      <div className="ad-link">
                        <h3>🌐 Reklam Linki (ID: {ad.id})</h3>
                        <input
                          type="url"
                          value={currentLink}
                          onChange={(e) => handleEditField(ad.id, "link", e.target.value)}
                          className="input-field"
                          placeholder="Link daxil edin"
                        />
                      </div>
                      <div className="ad-status">
                        <h3>⚙️ Status</h3>
                        <select
                          value={currentIsActive}
                          onChange={(e) => handleEditField(ad.id, "isActive", Number(e.target.value))}
                          className="locale-select"
                        >
                          <option value={1}>🟢 Aktiv</option>
                          <option value={0}>🔴 Deaktiv</option>
                        </select>
                      </div>
                    </div>

                    <div className="ad-image-section">
                      <div className="ad-image-preview">
                        {ad.pictureUrl && imageUrls[ad.id] ? (
                          <>
                            <img
                              src={imageUrls[ad.id]}
                              alt="Reklam şəkli"
                              className="ad-image"
                            />
                            <button
                              onClick={() => handleDownload(ad.pictureUrl)}
                              className="btn btn-success"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              📥 Endir
                            </button>
                          </>
                        ) : (
                          <div className="image-upload-area">
                            <div className="no-image">🖼️</div>
                            <p className="image-upload-text">
                              {loading && fileSelected ? 'Yüklənir...' : 'Şəkil yoxdur'}
                            </p>
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
                          disabled={!fileSelected || loading}
                        >
                          📤 Şəkil Yüklə
                        </button>
                      </div>
                    </div>

                    <div className="ad-actions">
                      <button
                        onClick={() => handleUpdateAd(ad)}
                        className="btn btn-warning"
                        disabled={!hasChanges || loading}
                      >
                        ✏️ Redaktə Et
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="btn btn-danger"
                        disabled={loading}
                      >
                        🗑️ Sil
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default AdsList;