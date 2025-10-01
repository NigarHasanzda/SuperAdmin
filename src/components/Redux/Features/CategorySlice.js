import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://194.163.173.179:3300/api/categories";
const getToken = () => localStorage.getItem("token");

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const token = getToken();
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});


export const fetchLocalizedCategories = createAsyncThunk(
  "categories/fetchLocalizedCategories",
  async (language = "az") => {
    const token = getToken();
    const res = await axios.get(`${API_URL}/localized?language=${language}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.productCategoryResponses;
  }
);


export const addCategory = createAsyncThunk("categories/addCategory", async (categoryData) => {
  const token = getToken();
  const res = await axios.post(API_URL, categoryData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});


export const updateCategory = createAsyncThunk("categories/updateCategory", async (categoryData) => {
  const token = getToken();
  const res = await axios.put(API_URL, categoryData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});


export const deleteCategory = createAsyncThunk("categories/deleteCategory", async (id) => {
  const token = getToken();
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    localized: [],
    loading: false,
    error: null,
  },
  reducers: {},
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
      });
  },
});

export default categorySlice.reducer;
