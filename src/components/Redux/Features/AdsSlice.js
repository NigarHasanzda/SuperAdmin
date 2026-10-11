import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as db from "../../../static/mockDb";

export const fetchAds = createAsyncThunk("ads/fetchAds", async () =>
  db.getAds()
);

export const addAd = createAsyncThunk(
  "ads/addAd",
  async (adData, { getState }) => {
    const state = getState();
    const currentUser =
      state.auth?.user || JSON.parse(localStorage.getItem("user")) || {};
    return db.addAd({
      ...adData,
      userId: currentUser.id,
      userName: currentUser.name,
    });
  }
);

export const uploadAdImage = createAsyncThunk(
  "ads/uploadAdImage",
  async ({ id, file }) => db.uploadAdImage(id, file)
);

export const deleteAd = createAsyncThunk("ads/deleteAd", async (id) =>
  db.deleteAd(id)
);

export const updateAd = createAsyncThunk(
  "ads/updateAd",
  async ({ id, updatedFields }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const ad = state.ads.list.find((a) => a.id === id);
      if (!ad) throw new Error("Ad not found");
      return db.updateAd(id, { ...ad, ...updatedFields });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const downloadFile = createAsyncThunk("ads/downloadFile", async () =>
  db.downloadFilePlaceholder()
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
        state.error = action.payload || action.error.message;
      })
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
        state.error = action.payload || action.error.message;
      })
      .addCase(uploadAdImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAdImage.fulfilled, (state, action) => {
        state.loading = false;
        const { id, uuidName } = action.payload;
        const index = state.list.findIndex((ad) => ad.id === id);
        if (index !== -1) {
          state.list[index].pictureUrl = uuidName;
        }
      })
      .addCase(uploadAdImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.list = state.list.filter((ad) => ad.id !== action.payload);
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((ad) => ad.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(downloadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default adsSlice.reducer;
