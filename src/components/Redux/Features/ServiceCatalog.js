import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as db from "../../../static/mockDb";

export const fetchServiceCatalogPages = createAsyncThunk(
  "serviceCatalog/fetchServiceCatalogPages",
  async () => db.getProfiles(0)
);

export const fetchBusinessPages = createAsyncThunk(
  "serviceCatalog/fetchBusinessPages",
  async () => db.getAllBusinesses()
);

const serviceCatalogSlice = createSlice({
  name: "serviceCatalog",
  initialState: { pages: [], businesses: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceCatalogPages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServiceCatalogPages.fulfilled, (state, action) => {
        state.loading = false;
        state.pages = action.payload;
      })
      .addCase(fetchServiceCatalogPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBusinessPages.fulfilled, (state, action) => {
        state.businesses = action.payload;
      });
  },
});

export default serviceCatalogSlice.reducer;
