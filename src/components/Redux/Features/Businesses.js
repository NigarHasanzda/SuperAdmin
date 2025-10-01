import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://194.163.173.179:3300";
const getToken = () => localStorage.getItem("token");

// 1️⃣ Bütün biznesləri gətirmək
export const fetchAllBusinesses = createAsyncThunk(
  "businesses/fetchAllBusinesses",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${BASE_URL}/api/businesses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 2️⃣ Bir biznesi id ilə gətirmək
export const fetchBusinessById = createAsyncThunk(
  "businesses/fetchBusinessById",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${BASE_URL}/api/businesses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 3️⃣ AdminId ilə filialları gətirmək
export const fetchBranchesByAdmin = createAsyncThunk(
  "businesses/fetchBranchesByAdmin",
  async (adminId, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${BASE_URL}/api/businesses/${adminId}/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 4️⃣ Bütün filialları gətirmək
export const fetchAllBranches = createAsyncThunk(
  "businesses/fetchAllBranches",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${BASE_URL}/api/businesses/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 5️⃣ Branch by branchId ✅ yeni əlavə
export const fetchBranchById = createAsyncThunk(
  "businesses/fetchBranchById",
  async (branchId, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${BASE_URL}/api/businesses/branches/${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 6️⃣ Branch stats by branchId ✅ yeni əlavə
export const fetchBranchStatsById = createAsyncThunk(
  "businesses/fetchBranchStatsById",
  async (branchId, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${BASE_URL}/api/businesses/branches/${branchId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 7️⃣ Bütün filialların statistikaları
export const fetchBranchesStats = createAsyncThunk(
  "businesses/fetchBranchesStats",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${BASE_URL}/api/businesses/branches/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

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
      // fetchAllBusinesses
      .addCase(fetchAllBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchBusinessById
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.single = action.payload;
      })
      // fetchBranchesByAdmin
      .addCase(fetchBranchesByAdmin.fulfilled, (state, action) => {
        state.branches = action.payload;
      })
      // fetchAllBranches
      .addCase(fetchAllBranches.fulfilled, (state, action) => {
        state.branches = action.payload.content || [];
      })
      // fetchBranchById
      .addCase(fetchBranchById.fulfilled, (state, action) => {
        state.branch = action.payload;
      })
      // fetchBranchStatsById
      .addCase(fetchBranchStatsById.fulfilled, (state, action) => {
        state.branchStats = action.payload;
      })
      // fetchBranchesStats
      .addCase(fetchBranchesStats.fulfilled, (state, action) => {
        state.branchesStats = action.payload;
      });
  },
});

export default businessesSlice.reducer;
