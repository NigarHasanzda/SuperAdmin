import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// ============================
// 🔹 Async Thunks
// ============================

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
  async ({ id, file, locale = "AZ" }) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(
      `/api/ads/${id}/upload-image?locale=${locale}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { id, data: res.data };
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

// ============================
// 🔹 Slice
// ============================
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
        state.error = null;
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
      .addCase(addAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAd.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // uploadAdImage
      .addCase(uploadAdImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAdImage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((ad) => ad.id === action.payload.id);
        if (index !== -1) {
          state.list[index].pictureUrl = action.payload.data?.uuidName;
        }
      })
      .addCase(uploadAdImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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
      })

      // downloadFile (sadec frontend üçün, state update yox)
      .addCase(downloadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default adsSlice.reducer;
