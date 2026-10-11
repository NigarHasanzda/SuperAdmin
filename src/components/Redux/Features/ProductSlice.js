import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as db from "../../../static/mockDb";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (page = 0) => db.getProducts(page)
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id) => db.getProductById(id)
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    list: { content: [] },
    single: null,
    page: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.page = action.payload.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.single = action.payload;
      });
  },
});

export default productsSlice.reducer;
