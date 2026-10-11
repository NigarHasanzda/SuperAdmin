import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as db from "../../../static/mockDb";

export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async (page = 0) => db.getProfiles(page)
);

export const fetchProfileById = createAsyncThunk(
  "profiles/fetchProfileById",
  async (id) => db.getProfileById(id)
);

const profilesSlice = createSlice({
  name: "profiles",
  initialState: { list: [], single: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.single = action.payload;
      });
  },
});

export default profilesSlice.reducer;
