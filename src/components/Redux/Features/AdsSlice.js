import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// 🔹 Reklamları gətir
export const fetchAds = createAsyncThunk("ads/fetchAds", async () => {
  const res = await api.get("/api/ads");
  return res.data;
});

// 🔹 Yeni reklam əlavə et
export const addAd = createAsyncThunk("ads/addAd", async (adData) => {
  const body = {
    link: adData.link,
    isActive: adData.isActive ?? 1,
    userId: adData.userId,
  };
  const res = await api.post("/api/ads", body);
  return res.data;
});

// 🔹 Reklama şəkil yüklə
export const uploadAdImage = createAsyncThunk(
  "ads/uploadAdImage",
  async ({ id, file }) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/api/ads/${id}/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return { id, data: res.data };
  }
);

// 🔹 Faylı endir
export const downloadFile = createAsyncThunk(
  "ads/downloadFile",
  async (filename) => {
    const res = await api.get(`/api/files/download/${filename}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return filename;
  }
);

// 🔹 Reklamı sil
export const deleteAd = createAsyncThunk("ads/deleteAd", async (id) => {
  await api.delete(`/api/ads/${id}`);
  return id;
});

// 🔹 Reklamın aktiv/deaktiv vəziyyətini dəyiş
export const toggleAdActive = createAsyncThunk(
  "ads/toggleAdActive",
  async ({ id, isActive }) => {
    const res = await api.put(`/api/ads/${id}`, { isActive });
    return res.data;
  }
);

const adsSlice = createSlice({
  name: "ads",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAds
      .addCase(fetchAds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAds.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // addAd
      .addCase(addAd.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // uploadAdImage
      .addCase(uploadAdImage.fulfilled, (state, action) => {
        const index = state.list.findIndex((ad) => ad.id === action.payload.id);
        if (index !== -1) {
          state.list[index].pictureUrl = action.payload.data?.uuidName;
        }
      })

      // deleteAd
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.list = state.list.filter((ad) => ad.id !== action.payload);
      })

      // toggleAdActive
      .addCase(toggleAdActive.fulfilled, (state, action) => {
        const index = state.list.findIndex((ad) => ad.id === action.payload.id);
        if (index !== -1) {
          state.list[index].isActive = action.payload.isActive;
        }
      });
  },
});

export default adsSlice.reducer;
