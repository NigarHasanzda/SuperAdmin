import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAds,
  addAd,
  uploadAdImage,
  deleteAd,
  downloadFile,
  toggleAdActive,
} from "../../Redux/Features/AdsSlice";

const AdsList = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.ads);

  const [newAd, setNewAd] = useState({ link: "", userId: 1 });
  const [files, setFiles] = useState({}); // Hər reklam üçün ayrı file
  const [locales, setLocales] = useState({}); // Hər reklam üçün ayrı locale seçimi

  useEffect(() => {
    dispatch(fetchAds());
  }, [dispatch]);

  const handleAddAd = () => {
    if (!newAd.link.trim()) return alert("Link daxil edin!");
    dispatch(addAd(newAd));
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
    dispatch(toggleAdActive({ id: ad.id, isActive: ad.isActive ? 0 : 1 }));
  };

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: 20 }}>
      <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        📢 Reklam Siyahısı
      </h2>

      {/* Yeni reklam əlavə et */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Link"
          value={newAd.link}
          onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleAddAd}
          style={{
            padding: "8px 16px",
            backgroundColor: "#5D56F1",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Əlavə et
        </button>
      </div>

      {loading && <p>Yüklənir...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Reklam siyahısı */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 20 }}>
        {list.map((ad) => (
          <li
            key={ad.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div>
              <p style={{ fontWeight: "bold" }}>🔗 {ad.link}</p>
              <p style={{ fontWeight: "bold", color: ad.isActive ? "green" : "red" }}>
                {ad.isActive ? "Aktiv" : "Deaktiv"}
              </p>

              {ad.pictureUrl && (
                <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center" }}>
                  <img
                    src={`https://p.kaktusbooking.app/website/api/files/download/${ad.pictureUrl}`}
                    alt="ad"
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }}
                  />
                  <button
                    onClick={() => handleDownload(ad.pictureUrl)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    📥 Endir
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="file"
                onChange={(e) =>
                  setFiles((prev) => ({ ...prev, [ad.id]: e.target.files[0] }))
                }
              />
              <select
                value={locales[ad.id] || "AZ"}
                onChange={(e) =>
                  setLocales((prev) => ({ ...prev, [ad.id]: e.target.value }))
                }
              >
                <option value="AZ">AZ</option>
                <option value="EN">EN</option>
                <option value="RU">RU</option>
              </select>
              <button
                onClick={() => handleUploadImage(ad.id)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#5D56F1",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Şəkil Yüklə
              </button>

              <button
                onClick={() => handleToggleActive(ad)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: ad.isActive ? "orange" : "gray",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {ad.isActive ? "Deaktiv et" : "Aktiv et"}
              </button>

              <button
                onClick={() => dispatch(deleteAd(ad.id))}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "red",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdsList;
