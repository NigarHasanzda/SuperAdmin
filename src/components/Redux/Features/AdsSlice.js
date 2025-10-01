import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://194.163.173.179:3300/api/ads";


export const fetchAds = createAsyncThunk("ads/fetchAds", async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});


export const addAd = createAsyncThunk("ads/addAd", async (adData) => {
  const token = localStorage.getItem("token");
  const body = {
    link: adData.link,
    isActive: adData.isActive ?? 1,
    userId: adData.userId,
  };
  const res = await axios.post(API_URL, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});


export const uploadAdImage = createAsyncThunk("ads/uploadAdImage", async ({ id, file }) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${API_URL}/${id}/upload-image`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return { id, data: res.data };
});


export const deleteAd = createAsyncThunk("ads/deleteAd", async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});


const adsSlice = createSlice({
  name: "ads",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAds.pending, (state) => { state.loading = true; })
      .addCase(fetchAds.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addAd.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(uploadAdImage.fulfilled, (state, action) => {
        const index = state.list.findIndex(ad => ad.id === action.payload.id);
        if (index >= 0) {
          state.list[index].pictureUrl = action.payload.data.uuidName;
        }
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.list = state.list.filter(ad => ad.id !== action.payload);
      });
  },
});

export default adsSlice.reducer;
