// Redux slice: businessesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api";

// GET /api/businesses → bütün biznesləri gətirir
export const fetchAllBusinesses = createAsyncThunk(
  "businesses/fetchAllBusinesses",
  async () => {
    const res = await api.get("/api/businesses");
    return res.data;
  }
);

// GET /api/businesses/{id} → id-ə görə biznes
export const fetchBusinessById = createAsyncThunk(
  "businesses/fetchBusinessById",
  async (id) => {
    const res = await api.get(`/api/businesses/${id}`);
    return res.data;
  }
);

// GET /api/businesses/{adminId}/branches → id-ə görə filiallar
export const fetchBranchesByAdmin = createAsyncThunk(
  "businesses/fetchBranchesByAdmin",
  async (adminId) => {
    const res = await api.get(`/api/businesses/${adminId}/branches`);
    return res.data;
  }
);

// GET /api/businesses/branches → bütün filiallar
export const fetchAllBranches = createAsyncThunk(
  "businesses/fetchAllBranches",
  async () => {
    const res = await api.get("/api/businesses/branches");
    return res.data;
  }
);

// GET /api/businesses/branches/{branchId} → id-ə görə filial
export const fetchBranchById = createAsyncThunk(
  "businesses/fetchBranchById",
  async (branchId) => {
    const res = await api.get(`/api/businesses/branches/${branchId}`);
    return res.data;
  }
);

// GET /api/businesses/branches/{branchId}/stats → filial statistikası
export const fetchBranchStatsById = createAsyncThunk(
  "businesses/fetchBranchStatsById",
  async (branchId) => {
    const res = await api.get(`/api/businesses/branches/${branchId}/stats`);
    return res.data;
  }
);

// GET /api/businesses/branches/stats → bütün filialların statistikası
export const fetchBranchesStats = createAsyncThunk(
  "businesses/fetchBranchesStats",
  async () => {
    const res = await api.get("/api/businesses/branches/stats");
    return res.data;
  }
);

// Slice
const businessesSlice = createSlice({
  name: "businesses",
  initialState: {
    all: [],
    single: null,
    branches: [],
    branch: null,
    branchesStats: [],
    branchStats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBusinesses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllBusinesses.fulfilled, (state, action) => { state.loading = false; state.all = action.payload; })
      .addCase(fetchAllBusinesses.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(fetchBusinessById.fulfilled, (state, action) => { state.single = action.payload; })
      .addCase(fetchBranchesByAdmin.fulfilled, (state, action) => { state.branches = action.payload; })
      .addCase(fetchAllBranches.fulfilled, (state, action) => { state.branches = action.payload.content || []; })
      .addCase(fetchBranchById.fulfilled, (state, action) => { state.branch = action.payload; })
      .addCase(fetchBranchStatsById.fulfilled, (state, action) => { state.branchStats = action.payload; })
      .addCase(fetchBranchesStats.fulfilled, (state, action) => { state.branchesStats = action.payload; });
  },
});

export default businessesSlice.reducer;
