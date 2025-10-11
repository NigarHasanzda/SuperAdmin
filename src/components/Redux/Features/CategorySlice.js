import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";


export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const res = await api.get("/api/categories");
  return res.data;
});


export const fetchLocalizedCategories = createAsyncThunk(
  "categories/fetchLocalizedCategories",
  async (language = "az") => {
    const res = await api.get(`/api/categories/localized?language=${language}`);
    return res.data.productCategoryResponses;
  }
);


export const addCategory = createAsyncThunk("categories/addCategory", async (categoryData) => {
  const res = await api.post("/api/categories", categoryData);
  return res.data;
});


export const updateCategory = createAsyncThunk("categories/updateCategory", async (categoryData) => {
  const res = await api.put("/api/categories", categoryData);
  return res.data;
});


export const deleteCategory = createAsyncThunk("categories/deleteCategory", async (id) => {
  await api.delete(`/api/categories/${id}`);
  return id;
});

export const searchCategoryById = createAsyncThunk(
  "categories/searchCategoryById", 
  async (id, { rejectWithValue }) => {
    try {
      console.log("Searching category with ID:", id);
      const res = await api.get(`/api/categories/${id}`);
      console.log("Search API response:", res.data);
      return res.data;
    } catch (error) {
      console.error("Search category error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Kateqoriya tapılmadı");
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
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })


      .addCase(fetchLocalizedCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchLocalizedCategories.fulfilled, (state, action) => { state.loading = false; state.localized = action.payload; })
      .addCase(fetchLocalizedCategories.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(addCategory.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.localized.push({ id: action.payload.id, name: action.payload.name });
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.list.findIndex(cat => cat.id === action.payload.id);
        if (index >= 0) state.list[index] = action.payload;

        const locIndex = state.localized.findIndex(cat => cat.id === action.payload.id);
        if (locIndex >= 0) state.localized[locIndex].name = action.payload.name;
      })


      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter(cat => cat.id !== action.payload);
        state.localized = state.localized.filter(cat => cat.id !== action.payload);
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

export const { clearSearchResult } = categorySlice.actions;
export default categorySlice.reducer;
