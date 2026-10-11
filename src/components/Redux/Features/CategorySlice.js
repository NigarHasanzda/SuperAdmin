import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as db from "../../../static/mockDb";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => db.getCategories()
);

export const fetchLocalizedCategories = createAsyncThunk(
  "categories/fetchLocalizedCategories",
  async () => {
    const res = await db.getLocalizedCategories();
    return res.productCategoryResponses;
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (categoryData) => db.addCategory(categoryData)
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (categoryData) => db.updateCategory(categoryData)
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id) => db.deleteCategory(id)
);

export const searchCategoryById = createAsyncThunk(
  "categories/searchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      return db.getCategoryById(id);
    } catch (error) {
      return rejectWithValue(error.message || "Kateqoriya tapılmadı");
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    localized: [],
    searchResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResult: (state) => {
      state.searchResult = null;
      state.error = null;
    },
    searchCategoryByName: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      state.searchResult = state.list.filter((cat) =>
        cat.name?.toLowerCase().includes(searchTerm)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLocalizedCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocalizedCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.localized = action.payload;
      })
      .addCase(fetchLocalizedCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updatedCat = {
          id: action.payload.id,
          name: action.payload.name || action.meta.arg.name,
        };
        const index = state.list.findIndex((cat) => cat.id === updatedCat.id);
        if (index >= 0) state.list[index] = updatedCat;
        const locIndex = state.localized.findIndex(
          (cat) => cat.id === updatedCat.id
        );
        if (locIndex >= 0) state.localized[locIndex] = updatedCat;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        const newCat = {
          id: action.payload?.id,
          name: action.payload?.name || action.meta.arg.name,
        };
        if (!state.list) state.list = [];
        if (!state.localized) state.localized = [];
        if (newCat.id) {
          state.list.push(newCat);
          state.localized.push(newCat);
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        if (!state.list) state.list = [];
        if (!state.localized) state.localized = [];
        state.list = state.list.filter((cat) => cat.id !== action.payload);
        state.localized = state.localized.filter(
          (cat) => cat.id !== action.payload
        );
      })
      .addCase(searchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = action.payload;
        state.error = null;
      })
      .addCase(searchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.searchResult = null;
      });
  },
});

export const { clearSearchResult, searchCategoryByName } =
  categorySlice.actions;
export default categorySlice.reducer;
