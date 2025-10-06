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
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchAds());
  }, [dispatch]);

  const handleAddAd = () => {
    if (!newAd.link.trim()) return alert("Link daxil edin!");
    dispatch(addAd(newAd));
    setNewAd({ link: "", userId: 1 });
  };

  const handleUploadImage = (id) => {
    if (!file) return alert("Fayl seçin!");
    dispatch(uploadAdImage({ id, file }));
  };

  const handleDownload = (filename) => {
    dispatch(downloadFile(filename));
  };

  const handleToggleActive = (ad) => {
    dispatch(toggleAdActive({ id: ad.id, isActive: ad.isActive ? 0 : 1 }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📢 Reklam Siyahısı</h2>

      {/* Yeni reklam əlavə et */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Link"
          value={newAd.link}
          onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
          className="border p-2 flex-1 rounded shadow-sm"
        />
        <button
          onClick={handleAddAd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Əlavə et
        </button>
      </div>

      {/* Yüklənir / Error */}
      {loading && <p className="text-gray-500">Yüklənir...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Reklam siyahısı */}
      <ul className="space-y-4">
        {list.map((ad) => (
          <li
            key={ad.id}
            className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm"
          >
            <div className="flex-1">
              <p className="font-medium">🔗 {ad.link}</p>
              <p className={`mt-1 font-semibold ${ad.isActive ? "text-green-600" : "text-red-600"}`}>
                {ad.isActive ? "Aktiv" : "Deaktiv"}
              </p>

              {ad.pictureUrl && (
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                  <img
                    src={`https://p.kaktusbooking.app/website/api/files/download/${ad.pictureUrl}`}
                    alt="ad"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <button
                    onClick={() => handleDownload(ad.pictureUrl)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    📥 Endir
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mb-2 sm:mb-0"
              />
              <button
                onClick={() => handleUploadImage(ad.id)}
                className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition"
              >
                Şəkil Yüklə
              </button>

              <button
                onClick={() => handleToggleActive(ad)}
                className={`px-3 py-1 rounded text-white transition ${
                  ad.isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-500 hover:bg-gray-600"
                }`}
              >
                {ad.isActive ? "Deaktiv et" : "Aktiv et"}
              </button>

              <button
                onClick={() => dispatch(deleteAd(ad.id))}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
