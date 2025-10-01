import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAds,
  addAd,
  deleteAd,
  uploadAdImage,
} from "../../Redux/Features/AdsSlice";

const Ads = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.ads);

  const [link, setLink] = useState("");
  const [file, setFile] = useState(null); // şəkil üçün
  const [idToSearch, setIdToSearch] = useState("");
  const [selectedAd, setSelectedAd] = useState(null);

  // 🔸 Bütün reklamları gətir
  useEffect(() => {
    dispatch(fetchAds());
  }, [dispatch]);

  // 🔸 Reklam əlavə et
  const handleAdd = async () => {
    if (!link.trim()) return alert("Link boş ola bilməz");
    const newAd = {
      link,
      isActive: 1,
      userId: 1, // Superadmin ID
    };

    const result = await dispatch(addAd(newAd));
    if (result.payload?.id && file) {
      await dispatch(uploadAdImage({ id: result.payload.id, file }));
      alert("Reklam və şəkil uğurla əlavə olundu!");
    } else {
      alert("Reklam uğurla əlavə olundu!");
    }
    setLink("");
    setFile(null);
  };

  // 🔸 ID ilə reklam axtar
  const handleSearch = () => {
    const ad = list.find((a) => a.id === Number(idToSearch));
    if (ad) {
      setSelectedAd(ad);
    } else {
      alert("Bu ID ilə reklam tapılmadı");
      setSelectedAd(null);
    }
  };

  // 🔸 Reklam sil
  const handleDelete = (id) => {
    if (window.confirm("Silmək istədiyinə əminsən?")) {
      dispatch(deleteAd(id));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🧩 Reklam İdarəetməsi</h1>

      {/* 🔸 Yeni reklam əlavə */}
      {/* <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Reklam linki"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleAdd}>Əlavə et</button>
      </div> */}

      {/* 🔸 ID ilə axtar */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="ID ilə axtar"
          value={idToSearch}
          onChange={(e) => setIdToSearch(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleSearch}>Axtar</button>
      </div>

      {/* 🔸 Tapılan reklam */}
      {selectedAd && (
        <div style={{ marginTop: 10, padding: 10, border: "1px solid #ccc" }}>
          <h3>Axtarış Nəticəsi</h3>
          <p>ID: {selectedAd.id}</p>
          <p>Link: {selectedAd.link}</p>
          {selectedAd.pictureUrl && (
            <img
              src={`http://194.163.173.179:3300/uploads/${selectedAd.pictureUrl}`}
              alt="Reklam"
              width={200}
            />
          )}
        </div>
      )}

      {/* 🔸 Bütün reklamlar */}
      <h2 style={{ marginTop: 30 }}>📋 Bütün Reklamlar</h2>
      {loading && <p>Yüklənir...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {list.map((ad) => (
          <div
            key={ad.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              borderRadius: 6,
              width: 250,
            }}
          >
            <p><strong>ID:</strong> {ad.id}</p>
            <p><strong>Link:</strong> {ad.link}</p>
            <p><strong>isActive:</strong> {ad.isActive ? "✅ Aktiv" : "❌ Passiv"}</p>
            {ad.pictureUrl && (
              <img
                src={`http://194.163.173.179:3300/uploads/${ad.pictureUrl}`}
                alt="Reklam şəkli"
                width={200}
                style={{ borderRadius: 4 }}
              />
            )}
            <button
              onClick={() => handleDelete(ad.id)}
              style={{
                background: "red",
                color: "white",
                marginTop: 10,
                border: "none",
                padding: "5px 10px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ads;
