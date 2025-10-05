import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";




export const fetchAds = createAsyncThunk("ads/fetchAds", async () => {
  const res = await api.get("/api/ads");
  return res.data;
});

export const addAd = createAsyncThunk("ads/addAd", async (adData) => {
  const body = {
    link: adData.link,
    isActive: adData.isActive ?? 1,
    userId: adData.userId,
  };
  const res = await api.post("/api/ads", body);
  return res.data;
});


export const uploadAdImage = createAsyncThunk(
  "ads/uploadAdImage",
  async ({ id, file }) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/api/ads/${id}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { id, data: res.data };
  }
);


export const deleteAd = createAsyncThunk("ads/deleteAd", async (id) => {
  await api.delete(`/api/ads/${id}`);
  return id;
});

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


      .addCase(addAd.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAd.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      .addCase(uploadAdImage.pending, (state) => {
        state.loading = true;
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

      .addCase(deleteAd.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((ad) => ad.id !== action.payload);
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default adsSlice.reducer;
